// FB-06/07 synthetic browser regression: fresh contexts and loopback MkDocs only.
// Required HDRL_FEEDBACK_FIXTURE is the unchanged original Fenland v0.4 export.
// Optional HDRL_PREVIEW_ORIGIN, HDRL_BROWSERS, HDRL_BROWSER_CASE,
// HDRL_BROWSER_RESULTS and HDRL_BROWSER_ARTIFACTS configure the local run.
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { createHash, webcrypto } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const CASE_NAMES = Object.freeze([
  "restore-current-backup-confirm", "restore-legacy-v04", "restore-cancel-preserves-current",
  "restore-invalid-inputs-atomic", "restore-transaction-abort", "restore-concurrent-change-refused", "delete-drains-queued-saves", "restore-inert-text",
  "restore-two-tab-stale-same-id", "restore-two-tab-stale-replaced-id",
  "restore-two-tab-conflict-cancel", "restore-pending-cancel-without-conflict",
  "share-synthetic-snapshot", "share-real-context", "share-legacy-unspecified",
  "share-selection-exclusions", "share-na-context", "keyboard-mobile"
]);
const ENGINES = ["chromium", "firefox", "webkit"];
const selectedCase = process.env.HDRL_BROWSER_CASE || "";
assert.ok(!selectedCase || CASE_NAMES.includes(selectedCase), `Unknown HDRL_BROWSER_CASE; supported: ${CASE_NAMES.join(", ")}`);
const engines = (process.env.HDRL_BROWSERS || ENGINES.join(",")).split(",");
assert.ok(engines.length && engines.every((e) => ENGINES.includes(e)) && new Set(engines).size === engines.length, "Choose unique supported browser engines");
const selectedCases = selectedCase ? [selectedCase] : [...CASE_NAMES];
const require = createRequire(import.meta.url);
const playwright = require("playwright");
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = new URL(process.env.HDRL_PREVIEW_ORIGIN || "http://127.0.0.1:8131");
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname) && origin.protocol === "http:", "Loopback HTTP MkDocs preview only");
const output = path.resolve(process.env.HDRL_BROWSER_RESULTS || `/tmp/hdrl-portability-${Date.now()}/results.json`);
const artifacts = path.resolve(process.env.HDRL_BROWSER_ARTIFACTS || path.join(path.dirname(output), "artifacts"));
const sha = (value) => createHash("sha256").update(value).digest("hex");
const clone = (value) => JSON.parse(JSON.stringify(value));
const fixturePath = process.env.HDRL_FEEDBACK_FIXTURE;
assert.ok(fixturePath, "Supply HDRL_FEEDBACK_FIXTURE with the original synthetic Fenland JSON");
const fixtureBytes = await readFile(fixturePath);
assert.equal(sha(fixtureBytes), "8e0c36eb2f24895d38198431ebc179e57517cbba0abc5b6a20e8e13c2db61422");
const fixture = JSON.parse(fixtureBytes);
const assetPaths = ["/assets/js/self-assessment.js", "/assets/js/self-assessment-portability.js", "/assets/css/self-assessment.css"];
const localAssets = Object.fromEntries(await Promise.all(assetPaths.map(async (url) => [url, await readFile(path.join(repo, "docs", url))])));
const assetPins = Object.fromEntries(Object.entries(localAssets).map(([url, bytes]) => [url, sha(bytes)]));
const config = JSON.parse(await readFile(path.join(repo, "docs/data/hdrl-assessment-beta-config-v0.3.0.json")));
const fixtureContext = vm.createContext({ document: { getElementById: () => ({}) }, crypto: webcrypto });
const source = localAssets["/assets/js/self-assessment.js"].toString();
assert.match(source, /  init\(\);\n\}\)\(\);\s*$/);
vm.runInContext(source.replace(/  init\(\);\n\}\)\(\);\s*$/, "  globalThis.makeFixture = (config) => { betaConfig = config; return defaultState(); };\n})();"), fixtureContext);

function draftFromFixture({ id = "SYNTHETIC-PORTABILITY-CURRENT", context = "unspecified", view = "report" } = {}) {
  const d = clone(fixtureContext.makeFixture(config)); const a = fixture.assessment;
  Object.assign(d, { id, createdAt: a.created_at, updatedAt: a.updated_at, view,
    boundary: clone(a.boundary), rapid: clone(a.rapid_first_pass), snapshot: clone(a.whole_framework_snapshot),
    indicators: clone(a.evidence_led_responses), domainNotes: clone(a.domain_capacity_notes), audit: clone(a.audit),
    versions: clone(fixture.versions), provenance: clone(fixture.provenance), declaredContext: context });
  d.boundary.title = `SYNTHETIC PORTABILITY ONLY — ${id}`;
  return d;
}
function assessmentShape(d) {
  return { id: d.id, declared_context: d.declaredContext || "unspecified", created_at: d.createdAt, updated_at: d.updatedAt,
    boundary: d.boundary, rapid_first_pass: d.rapid, whole_framework_snapshot: d.snapshot,
    domain_capacity_notes: d.domainNotes, evidence_led_responses: d.indicators };
}
function expectedRestored(exported) {
  const { audit, ...a } = clone(exported.assessment);
  return { ...a, declared_context: a.declared_context || "unspecified" };
}
async function storage(page, operation, value) {
  return page.evaluate(({ operation, value }) => new Promise((resolve, reject) => {
    const request = indexedDB.open("hdrl-self-assessment-prototype", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("drafts");
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result; const tx = db.transaction("drafts", operation === "put" ? "readwrite" : "readonly");
      const store = tx.objectStore("drafts"); const action = operation === "put" ? store.put(value, "current") : store.get("current");
      let result; action.onsuccess = () => { result = action.result; };
      tx.oncomplete = () => { db.close(); resolve(result); };
      tx.onerror = tx.onabort = () => { db.close(); reject(tx.error || new Error("Synthetic storage transaction failed")); };
    };
  }), { operation, value });
}
async function ready(page) { await page.locator('#hdrl-assessment-root[aria-busy="false"]').waitFor(); }
async function reload(page) { await page.reload(); await ready(page); }
async function settle(page) { await page.waitForTimeout(500); }
async function replaceFixture(page, draft) {
  // Leave the old document before changing storage, so its pending autosave
  // cannot race the new synthetic fixture used by the next part of the case.
  await page.goto(`${origin.origin}/__hdrl_portability_fixture__`);
  await storage(page, "put", draft);
  await page.goto(`${origin.origin}/self-assessment/`); await ready(page);
}
async function restoreFile(page, content, filename = "synthetic-backup.json") {
  await page.locator('[data-action="restore"]').first().click();
  await page.locator("#restore-file").setInputFiles({ name: filename, mimeType: filename.endsWith(".csv") ? "text/csv" : "application/json", buffer: Buffer.isBuffer(content) ? content : Buffer.from(content) });
}
async function confirmRestore(page) {
  await page.locator("#restore-confirm").check();
  await page.locator('#hdrl-restore-confirm-form button[type="submit"]').click();
}
async function secondAssessmentTab(page) {
  const second = await page.context().newPage();
  await second.goto(`${origin.origin}/self-assessment/`); await ready(second);
  // Allow any visibility-triggered save from opening the other actual tab to
  // finish before deliberately creating the concurrency sequence under test.
  await second.waitForTimeout(800);
  return second;
}
async function snapshotNoteForm(page, note) {
  await page.locator('[data-action="dashboard"]').first().click();
  await page.locator('[data-action="snapshot-dashboard"]').first().click();
  const indicatorDetails = page.locator("details").filter({ has: page.locator('[data-action="open-snapshot"][data-ref="A.1.1"]') }).first();
  if ((await indicatorDetails.getAttribute("open")) === null) await indicatorDetails.locator("summary").click();
  await page.locator('[data-action="open-snapshot"][data-ref="A.1.1"]').last().click();
  assert.match(await page.locator("#hdrl-view-title").innerText(), /^A\.1\.1 ·/, "Edit the intended indicator");
  const details = page.locator(".hdrl-snapshot-note");
  if ((await details.getAttribute("open")) === null) await details.locator("summary").click();
  // render() schedules heading focus in requestAnimationFrame. Let that native
  // focus work complete before typing, especially in Firefox; never retry fill.
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await page.locator("#snapshot-note").fill(note);
  assert.equal(await page.locator("#snapshot-note").inputValue(), note, "The intended note reached the actual input");
}
async function saveSnapshotNote(page, note) {
  await snapshotNoteForm(page, note);
  assert.equal(await page.locator("#snapshot-note").inputValue(), note, "Other-tab form still contains the note immediately before submit");
  await page.locator('#hdrl-snapshot-form button[type="submit"]').click();
  await page.waitForTimeout(800);
  const saved = await storage(page, "get");
  assert.equal(saved.snapshot["A.1.1"].note, note, "Other tab genuinely saved the new note through the UI");
  return saved;
}
async function pendingSnapshotThenRestore(page, note, prepared = false) {
  if (!prepared) { await snapshotNoteForm(page, note); await page.waitForTimeout(800); }
  const before = await storage(page, "get");
  assert.notEqual(before.snapshot["A.1.1"].note, note, "Form text is not saved before submitting it");
  assert.equal(await page.locator("#snapshot-note").inputValue(), note, "Pending form still contains the note immediately before submit");
  // One browser task ensures Restore suspends the real 350ms autosave created
  // by the real form submission. No timer or storage API is mocked here.
  await page.evaluate(() => {
    document.getElementById("hdrl-snapshot-form").requestSubmit();
    document.querySelector('[data-action="restore"]').click();
  });
  await page.locator("#restore-file").waitFor();
  assert.deepEqual(await storage(page, "get"), before, "Pending submitted note remains unsaved while Restore is open");
  return before;
}
async function verifyStaleEntry({ page, second, check, dir, observations, beforeA, savedB }) {
  await page.locator('[data-action="restore"]').first().click();
  await page.locator("#hdrl-storage-conflict").waitFor();
  check("stale tab is stopped before incoming file or replacement confirmation", {
    file: await page.locator("#restore-file").count(),
    confirmation: await page.locator("#hdrl-restore-confirm-form").count(),
    preview: await page.locator("#restore-preview").count()
  }, { file: 0, confirmation: 0, preview: 0 });
  check("conflict explains the saved draft changed", /changed|another tab|newer/i.test(await page.locator("#restore-error").innerText()));
  check("opening stale Restore preserves exact saved B", await storage(second, "get"), savedB);
  const tabBackup = await download(page, '[data-action="download-tab-backup"]', path.join(dir, "stale-tab-A-backup.json"));
  check("stale-tab recovery download preserves A identity", tabBackup.value.assessment.id, beforeA.id);
  check("stale-tab recovery download preserves A responses", tabBackup.value.assessment.whole_framework_snapshot, beforeA.snapshot);
  check("stale-tab recovery download retains original provenance", tabBackup.value.provenance, beforeA.provenance);
  await page.screenshot({ path: path.join(dir, "stale-tab-paused.png"), fullPage: true });
  await page.locator('[data-action="restore-cancel"]').click(); await page.waitForTimeout(1200);
  check("cancelling a stale-entry restore keeps B exact", await storage(second, "get"), savedB);
  check("cancelling does not clear the storage pause", await page.locator("#hdrl-storage-conflict").count(), 1);
  await page.locator('[data-action="reload-saved-draft"]').click();
  await page.locator("#hdrl-storage-conflict").waitFor({ state: "detached" }); await ready(page);
  check("explicit reload preserves B", await storage(second, "get"), savedB);
  await restoreFile(page, fixtureBytes); await page.locator("#restore-preview").waitFor();
  check("replacement warning now names actual saved B", (await page.locator("#restore-preview p strong").innerText()).includes(savedB.boundary.title));
  const savedBackup = await download(page, '[data-action="restore-backup"]', path.join(dir, "actual-saved-B-backup.json"));
  check("actual current backup matches the entire saved assessment B", expectedRestored(savedBackup.value), assessmentShape(savedB));
  check("actual current backup preserves B provenance", savedBackup.value.provenance, savedB.provenance);
  await page.locator('[data-action="restore-cancel"]').click(); await page.waitForTimeout(800);
  check("second cancellation keeps B after recovery", await storage(second, "get"), savedB);
  observations.downloads = [{ path: tabBackup.path, sha256: tabBackup.sha256 }, { path: savedBackup.path, sha256: savedBackup.sha256 }];
  observations.identities = { A: beforeA.id, B: savedB.id };
}
async function download(page, selector, destination) {
  const [file] = await Promise.all([page.waitForEvent("download"), typeof selector === "function" ? selector() : page.locator(selector).click()]);
  await file.saveAs(destination); assert.equal(await file.failure(), null);
  const bytes = await readFile(destination);
  return { path: destination, bytes, sha256: sha(bytes), value: JSON.parse(bytes) };
}
async function toReport(page) {
  if (await page.locator("#hdrl-generated-report").count()) return;
  await page.locator('[data-action="dashboard"]').first().click();
  await page.locator('[data-action="evidence"]').click();
  await page.locator('[data-action="review"]').click();
  await page.locator('[data-action="gate"]').click();
  await page.locator("#hdrl-generated-report").waitFor();
}
function verifyRestored(check, actual, exported) {
  check("all incoming assessment content and original dates retained", assessmentShape(actual), expectedRestored(exported));
  check("original versions retained", actual.versions, exported.versions);
  check("original provenance retained", actual.provenance, exported.provenance);
  check("prior audit events not imported", actual.audit, []);
  check("no imported contact or consent", { email: actual.registration.email, name: actual.registration.name, research: actual.registration.researchContact, newsletter: actual.registration.newsletter }, { email: "", name: "", research: false, newsletter: false });
  check("remote session and telemetry remain inactive", { unlocked: actual.registration.unlocked, telemetry: actual.beta.telemetryEnabled, events: actual.beta.events }, { unlocked: false, telemetry: false, events: [] });
}
async function verifyRestoredDownload(page, check, dir, incoming) {
  await toReport(page);
  const saved = await download(page, '[data-action="export-json"]', path.join(dir, "restored-full-backup.json"));
  check("restored export uses current full schema", saved.value.export_schema, "hdrl-self-assessment-export-v0.5.0");
  for (const field of ["id", "created_at", "boundary", "rapid_first_pass", "whole_framework_snapshot", "domain_capacity_notes", "evidence_led_responses"]) check(`restored JSON retains ${field}`, saved.value.assessment[field], incoming.assessment[field]);
  check("restored JSON retains original versions", saved.value.versions, incoming.versions);
  check("restored JSON retains original provenance", saved.value.provenance, incoming.provenance);
  check("restored JSON records explicit context", saved.value.assessment.declared_context, incoming.assessment.declared_context || "unspecified");
  return { path: saved.path, sha256: saved.sha256 };
}
const MINIMAL_SCOPE = "INVENTED TEST ONLY: bounded research service and current operating period; no live organisation represented.";
const NA_SCOPE = "INVENTED TEST ONLY: A.4.1 consented cohorts and recall services are outside this selected scope.";
async function openShare(page, { context = "synthetic", snapshot = true, evidence = false, comments = false, records = false, na = NA_SCOPE } = {}) {
  await toReport(page); await page.locator('[data-action="share-results"]').click();
  await page.locator("#share-context").selectOption(context);
  await page.locator("#share-scope").fill(MINIMAL_SCOPE);
  await page.locator("#share-snapshot").setChecked(snapshot);
  await page.locator("#share-evidence-results").setChecked(evidence);
  await page.locator("#share-comments").setChecked(comments);
  await page.locator("#share-evidence-records").setChecked(records);
  await page.locator("#share-na-context").fill(na);
}
async function previewShare(page) {
  await page.locator('#hdrl-share-form button[type="submit"]').click();
  await page.locator("#share-preview-json").waitFor();
  return await page.locator("#share-preview-json").textContent();
}
async function saveShare(page, check, dir, expectedText, filename = "minimised-share.json") {
  await page.locator("#share-confirm").check();
  const saved = await download(page, '#hdrl-share-download-form button[type="submit"]', path.join(dir, filename));
  check("actual share bytes equal exact preview including timestamp", saved.bytes.toString(), expectedText);
  check("share declares that it is not a restore backup", { schema: saved.value.schema, restorable: saved.value.restorable }, { schema: "hdrl-explicit-results-share-v0.2.0", restorable: false });
  return saved;
}
function verifyShareIdentity(check, payload, declared) {
  check("structured context is explicit", payload.declared_context, declared);
  check("assessment identifier retained", payload.assessment_id, "SYNTHETIC-PORTABILITY-CURRENT");
  check("assessment date and minimal scope retained", { date: payload.boundary_summary.assessment_date, scope: payload.boundary_summary.scope_summary }, { date: fixture.assessment.boundary.assessmentDate, scope: MINIMAL_SCOPE });
  check("original method versions retained", payload.versions, fixture.versions);
  check("original provenance retained", payload.provenance, fixture.provenance);
}

const tests = {
  async "restore-current-backup-confirm"({ page, check, dir, observations }) {
    const incoming = await download(page, '[data-action="export-json"]', path.join(dir, "incoming-v05.json"));
    check("actual full export uses current schema", incoming.value.export_schema, "hdrl-self-assessment-export-v0.5.0");
    const old = draftFromFixture({ id: "SYNTHETIC-REPLACED-ORIGINAL" });
    await replaceFixture(page, old); const before = await storage(page, "get");
    await restoreFile(page, incoming.bytes); await page.locator("#restore-preview").waitFor();
    const preview = await page.locator("#restore-preview").innerText();
    check("preview names incoming title/date/scope/versions and replacement", [incoming.value.assessment.boundary.title, incoming.value.assessment.boundary.assessmentDate, incoming.value.assessment.boundary.scope, incoming.value.versions.framework, old.boundary.title].every((v) => preview.includes(v)));
    check("preview alone preserves current draft", await storage(page, "get"), before);
    const backup = await download(page, '[data-action="restore-backup"]', path.join(dir, "replaced-draft-backup.json"));
    check("actual backup contains the replaced draft", expectedRestored(backup.value), assessmentShape(before));
    await confirmRestore(page); await page.locator("#restore-preview").waitFor({ state: "detached" });
    verifyRestored(check, await storage(page, "get"), incoming.value);
    await reload(page); verifyRestored(check, await storage(page, "get"), incoming.value);
    observations.downloads = [{ path: incoming.path, sha256: incoming.sha256 }, { path: backup.path, sha256: backup.sha256 }];
    observations.downloads.push(await verifyRestoredDownload(page, check, dir, incoming.value));
  },
  async "restore-legacy-v04"({ page, check, dir, observations }) {
    await restoreFile(page, fixtureBytes); await page.locator("#restore-preview").waitFor();
    check("legacy context preview remains unspecified", (await page.locator("#restore-preview").innerText()).includes("unspecified"));
    await confirmRestore(page); await page.locator("#restore-preview").waitFor({ state: "detached" });
    await reload(page); verifyRestored(check, await storage(page, "get"), fixture);
    observations.download = await verifyRestoredDownload(page, check, dir, fixture);
  },
  async "restore-cancel-preserves-current"({ page, check }) {
    const before = await storage(page, "get");
    await restoreFile(page, fixtureBytes); await page.locator("#restore-preview").waitFor();
    check("preview never replaces the saved draft", await storage(page, "get"), before);
    await page.locator('[data-action="restore-cancel"]').click(); await settle(page);
    check("cancel preserves stored draft byte-equivalent JSON", JSON.stringify(await storage(page, "get")), JSON.stringify(before));
    await reload(page); check("cancelled replacement does not return on reload", await storage(page, "get"), before);
  },
  async "restore-invalid-inputs-atomic"({ page, check, observations }) {
    const before = await storage(page, "get");
    const wrongMethod = clone(fixture); wrongMethod.versions.framework = "99.0.0";
    const missingField = clone(fixture); delete missingField.assessment.boundary.assessmentDate;
    const invalidUtf8 = Buffer.from(fixtureBytes);
    const titleOffset = invalidUtf8.indexOf(Buffer.from(fixture.assessment.boundary.title));
    assert.ok(titleOffset >= 0, "Locate the original JSON title before injecting invalid UTF-8");
    invalidUtf8[titleOffset] = 0xff;
    const variants = [
      ["malformed.json", "{broken", /JSON|parse|invalid/i],
      ["invalid-utf8.json", invalidUtf8, /UTF-8/i],
      ["duplicate.json", fixtureBytes.toString().replace("{", '{"export_schema":"hdrl-self-assessment-export-v0.4.0",'), /duplicate/i],
      ["summary.csv", "ref,status,level\nA.1.1,rated,L3", /CSV|full|backup/i],
      ["share.json", JSON.stringify({ schema: "hdrl-explicit-results-share-v0.2.0", snapshot: {} }), /share|full|schema|backup/i],
      ["method.json", JSON.stringify(wrongMethod), /version|method|compatible/i],
      ["missing-field.json", JSON.stringify(missingField), /assessmentDate|required|boundary|date/i],
      ["oversize.json", " ".repeat(2 * 1024 * 1024 + 1), /2 MiB|size|smaller/i]
    ];
    const errors = [];
    for (const [name, text, pattern] of variants) {
      await restoreFile(page, text, name); await page.locator("#restore-error").waitFor();
      const message = await page.locator("#restore-error").innerText(); errors.push({ input: name, message });
      check(`${name}: useful rejection`, pattern.test(message));
      check(`${name}: no replacement preview`, await page.locator("#restore-preview").count(), 0);
      check(`${name}: original stored draft intact`, await storage(page, "get"), before);
      await page.locator('[data-action="restore-cancel"]').click();
    }
    await reload(page); check("all rejected inputs leave original after reload", await storage(page, "get"), before);
    observations.rejections = errors;
  },
  async "restore-transaction-abort"({ page, check }) {
    const before = await storage(page, "get");
    await restoreFile(page, fixtureBytes); await page.locator("#restore-preview").waitFor();
    await page.evaluate((incomingId) => {
      const original = IDBObjectStore.prototype.put; window.__portabilityAbortCount = 0;
      IDBObjectStore.prototype.put = function (value, ...rest) {
        const request = original.call(this, value, ...rest);
        if (this.name === "drafts" && value?.id === incomingId && !window.__portabilityAbortCount) {
          window.__portabilityAbortCount += 1; this.transaction.abort();
        }
        return request;
      };
    }, fixture.assessment.id);
    await confirmRestore(page); await page.locator("#restore-error").waitFor();
    check("actual replacement transaction was aborted exactly once", await page.evaluate(() => window.__portabilityAbortCount), 1);
    check("abort reports unsuccessful restore", /did not complete|not.*replaced|interrupted/i.test(await page.locator("#restore-error").innerText()));
    check("aborted transaction retains exact original", await storage(page, "get"), before);
    await reload(page); check("aborted replacement does not reappear on reload", await storage(page, "get"), before);
  },
  async "restore-concurrent-change-refused"({ page, check }) {
    await restoreFile(page, fixtureBytes); await page.locator("#restore-preview").waitFor();
    const competing = draftFromFixture({ id: "SYNTHETIC-OTHER-TAB-CHANGE" });
    competing.snapshot["A.1.1"].note = "SYNTHETIC other-tab update after preview must survive";
    await storage(page, "put", competing); await confirmRestore(page); await page.locator("#restore-error").waitFor();
    check("concurrent change is explicitly refused", /another tab|changed|refresh/i.test(await page.locator("#restore-error").innerText()));
    check("competing saved draft preserved exactly", await storage(page, "get"), competing);
    await reload(page); check("competing draft survives reload", await storage(page, "get"), competing);
  },
  async "delete-drains-queued-saves"({ page, check, observations }) {
    await page.evaluate(() => {
      const originalOpen = IDBFactory.prototype.open; const originalClone = globalThis.structuredClone;
      window.__queuedSaveClones = 0; window.__delayedSaveReady = false; let delayNext = true;
      globalThis.structuredClone = function (value, ...rest) {
        if (value?.id === "SYNTHETIC-PORTABILITY-CURRENT") window.__queuedSaveClones += 1;
        return originalClone.call(this, value, ...rest);
      };
      IDBFactory.prototype.open = function (...args) {
        const request = originalOpen.apply(this, args);
        if (args[0] === "hdrl-self-assessment-prototype" && delayNext) {
          delayNext = false;
          request.addEventListener("success", (event) => {
            event.stopImmediatePropagation();
            window.__releaseFirstSave = () => request.onsuccess?.call(request, event);
            window.__delayedSaveReady = true;
          }, { once: true });
        }
        return request;
      };
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.waitForFunction(() => window.__delayedSaveReady);
    await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
    await page.waitForFunction(() => window.__queuedSaveClones >= 2);
    check("two actual autosave snapshots queued behind delayed first save", await page.evaluate(() => window.__queuedSaveClones), 2);
    page.once("dialog", (dialog) => dialog.accept());
    await page.locator('[data-action="clear"]').first().click();
    await page.evaluate(() => window.__releaseFirstSave());
    await page.waitForFunction(() => document.getElementById("hdrl-assessment-status")?.textContent.includes("deleted"));
    await settle(page);
    check("completed deletion leaves no draft despite queued saves", (await storage(page, "get")) === undefined);
    observations.queued_save_snapshots = await page.evaluate(() => window.__queuedSaveClones);
    await reload(page); check("deleted old draft does not resurrect on reload", (await storage(page, "get")) === undefined);
    check("reload no longer displays deleted synthetic assessment", !(await page.locator("#hdrl-assessment-root").innerText()).includes("SYNTHETIC-PORTABILITY-CURRENT"));
  },
  async "restore-inert-text"({ page, check }) {
    const incoming = clone(fixture);
    incoming.assessment.boundary.title = '<img src="https://synthetic-invalid.example/never-fetch" onerror="window.__importExecuted=true">';
    incoming.assessment.evidence_led_responses["A.1.1"].rationale = '<script>window.__importExecuted=true</script> SYNTHETIC ONLY';
    await restoreFile(page, JSON.stringify(incoming)); await page.locator("#restore-preview").waitFor();
    check("markup is visible as inert preview text", (await page.locator("#restore-preview").innerText()).includes(incoming.assessment.boundary.title));
    check("no supplied preview image element", await page.locator('#restore-preview img').count(), 0);
    await confirmRestore(page); await page.locator("#restore-preview").waitFor({ state: "detached" });
    check("supplied script did not execute", await page.evaluate(() => Boolean(window.__importExecuted)), false);
    verifyRestored(check, await storage(page, "get"), incoming);
  },
  async "restore-two-tab-stale-same-id"({ page, check, dir, observations }) {
    const second = await secondAssessmentTab(page); const beforeA = await storage(page, "get");
    check("two actual assessment tabs share the isolated context", page.context().pages().length, 2);
    const savedB = await saveSnapshotNote(second, "SYNTHETIC newer B note saved before A opens Restore");
    check("pre-entry divergence uses identical IDs", savedB.id, beforeA.id);
    check("B actually differs in its saved response", savedB.snapshot["A.1.1"].note !== beforeA.snapshot["A.1.1"].note);
    await verifyStaleEntry({ page, second, check, dir, observations, beforeA, savedB });
  },
  async "restore-two-tab-stale-replaced-id"({ page, check, dir, observations }) {
    const second = await secondAssessmentTab(page); const beforeA = await storage(page, "get");
    check("two actual assessment tabs share the isolated context", page.context().pages().length, 2);
    const replacementB = clone(fixture);
    replacementB.assessment.id = "SYNTHETIC-OTHER-TAB-REPLACED-ID-B";
    replacementB.assessment.boundary.title = "SYNTHETIC saved replacement B from other tab";
    replacementB.assessment.whole_framework_snapshot["A.1.1"].note = "SYNTHETIC B-only note before A opens Restore";
    await restoreFile(second, JSON.stringify(replacementB)); await second.locator("#restore-preview").waitFor();
    await confirmRestore(second); await second.locator("#restore-preview").waitFor({ state: "detached" }); await second.waitForTimeout(800);
    const savedB = await storage(second, "get");
    check("B actually replaces the saved ID through Restore UI", savedB.id, replacementB.assessment.id);
    check("pre-entry divergence uses a different ID", savedB.id !== beforeA.id);
    await verifyStaleEntry({ page, second, check, dir, observations, beforeA, savedB });
  },
  async "restore-two-tab-conflict-cancel"({ page, check, dir, observations }) {
    const pendingNote = "SYNTHETIC pending tab A note — preserve locally without overwriting B";
    await snapshotNoteForm(page, pendingNote); await page.waitForTimeout(800);
    const second = await secondAssessmentTab(page);
    check("two actual assessment tabs share the isolated context", page.context().pages().length, 2);
    const before = await pendingSnapshotThenRestore(page, pendingNote, true);
    await page.locator("#restore-file").setInputFiles({ name: "synthetic-C.json", mimeType: "application/json", buffer: fixtureBytes });
    await page.locator("#restore-preview").waitFor();
    const pendingBackup = await download(page, '[data-action="restore-tab-backup"]', path.join(dir, "pending-tab-A-backup.json"));
    check("actual preconflict backup identifies A", pendingBackup.value.assessment.id, before.id);
    check("actual preconflict backup preserves pending A note", pendingBackup.value.assessment.whole_framework_snapshot["A.1.1"].note, pendingNote);
    check("preview and download have not saved pending A over disk", await storage(second, "get"), before);
    const savedB = await saveSnapshotNote(second, "SYNTHETIC newer tab B note after A preview");
    check("B saves same assessment identity with different content", savedB.id, before.id);
    await confirmRestore(page); await page.locator("#restore-error").waitFor();
    check("replacement is refused after other-tab change", /another tab|changed|newer|refresh/i.test(await page.locator("#restore-error").innerText()));
    check("refusal preserves exact B immediately", await storage(second, "get"), savedB);
    await page.locator('[data-action="restore-cancel"]').click();
    await page.waitForTimeout(1200);
    check("Cancel cannot resume stale A autosave over B", await storage(second, "get"), savedB);
    await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
    await page.waitForTimeout(800);
    check("visibility save remains suppressed until saved draft is reloaded", await storage(second, "get"), savedB);
    await reload(page);
    check("reload retains exact newer B", await storage(second, "get"), savedB);
    observations.pending_backup = { path: pendingBackup.path, sha256: pendingBackup.sha256 };
    observations.saved_B = { id: savedB.id, note: savedB.snapshot["A.1.1"].note };
  },
  async "restore-pending-cancel-without-conflict"({ page, check, dir, observations }) {
    const pendingNote = "SYNTHETIC pending A note — no conflict, ordinary cancellation resumes save";
    await snapshotNoteForm(page, pendingNote); await page.waitForTimeout(800);
    const second = await secondAssessmentTab(page);
    check("control also uses two actual assessment tabs", page.context().pages().length, 2);
    const before = await pendingSnapshotThenRestore(page, pendingNote, true);
    await page.locator("#restore-file").setInputFiles({ name: "synthetic-C.json", mimeType: "application/json", buffer: fixtureBytes });
    await page.locator("#restore-preview").waitFor();
    const backup = await download(page, '[data-action="restore-tab-backup"]', path.join(dir, "pending-no-conflict-tab-backup.json"));
    check("this-tab backup preserves submitted pending note", backup.value.assessment.whole_framework_snapshot["A.1.1"].note, pendingNote);
    const savedBackup = await download(page, '[data-action="restore-backup"]', path.join(dir, "pending-no-conflict-saved-backup.json"));
    check("current saved backup contains the exact saved original", expectedRestored(savedBackup.value), assessmentShape(before));
    check("no-conflict preview keeps old saved bytes until cancellation", await storage(second, "get"), before);
    await page.locator('[data-action="restore-cancel"]').click(); await page.waitForTimeout(1200);
    const saved = await storage(second, "get");
    check("no-conflict Cancel resumes the legitimate pending save", saved.snapshot["A.1.1"].note, pendingNote);
    check("no-conflict Cancel retains assessment identity", saved.id, before.id);
    check("no-conflict Cancel retains original provenance", saved.provenance, before.provenance);
    await reload(page); check("resumed note survives reload", (await storage(second, "get")).snapshot["A.1.1"].note, pendingNote);
    observations.downloads = [{ path: backup.path, sha256: backup.sha256 }, { path: savedBackup.path, sha256: savedBackup.sha256 }];
  },
  async "share-synthetic-snapshot"({ page, check, dir, observations }) {
    await openShare(page); const text = await previewShare(page); const preview = JSON.parse(text);
    check("snapshot-only preview excludes evidence-led results", Object.hasOwn(preview, "evidence_led"), false);
    check("all64 snapshot selections retained", Object.keys(preview.snapshot).length, 64);
    check("unknown remains unscored", preview.snapshot["E.3.1"].status, "not_known");
    check("N/A remains unscored", { status: preview.snapshot["A.4.1"].status, level: preview.snapshot["A.4.1"].level }, { status: "not_applicable", level: "" });
    check("preview does not yet persist declaration", (await storage(page, "get")).declaredContext, "unspecified");
    const saved = await saveShare(page, check, dir, text); verifyShareIdentity(check, saved.value, "synthetic");
    await settle(page); await reload(page); check("download deliberately persists context", (await storage(page, "get")).declaredContext, "synthetic");
    observations.download = { path: saved.path, sha256: saved.sha256 };
  },
  async "share-real-context"({ page, check, dir }) {
    // Explicit "real" is only the declaration under test; all data stays invented.
    await openShare(page, { context: "real" }); const text = await previewShare(page);
    const saved = await saveShare(page, check, dir, text); verifyShareIdentity(check, saved.value, "real");
    await settle(page); await reload(page); check("explicit real declaration survives reload", (await storage(page, "get")).declaredContext, "real");
  },
  async "share-legacy-unspecified"({ page, check, dir }) {
    const old = draftFromFixture(); delete old.declaredContext; old.schemaVersion = 5;
    old.boundary.title = "HYPOTHETICAL TEST ONLY — Synthetic words do not establish declared context";
    await replaceFixture(page, old); await page.locator('[data-action="share-results"]').click();
    check("legacy declaration defaults to unspecified", await page.locator("#share-context").inputValue(), "unspecified");
    await page.locator("#share-snapshot").check(); await page.locator("#share-scope").fill(MINIMAL_SCOPE); await page.locator("#share-na-context").fill(NA_SCOPE);
    const text = await previewShare(page); const saved = await saveShare(page, check, dir, text);
    verifyShareIdentity(check, saved.value, "unspecified");
    await settle(page); await reload(page); check("legacy unspecified remains unspecified after deliberate download", (await storage(page, "get")).declaredContext, "unspecified");
  },
  async "share-selection-exclusions"({ page, check, dir }) {
    const privateDraft = draftFromFixture();
    privateDraft.boundary.title = "PRIVATE-TITLE-SENTINEL"; privateDraft.boundary.serviceName = "PRIVATE-SERVICE-SENTINEL";
    privateDraft.boundary.scope = "PRIVATE-FULL-SCOPE-SENTINEL"; privateDraft.boundary.intendedUse = "PRIVATE-INTENDED-USE-SENTINEL";
    privateDraft.domainNotes.A = "PRIVATE-DOMAIN-NOTE-SENTINEL"; privateDraft.rapid.A.note = "PRIVATE-ORIENTATION-NOTE-SENTINEL";
    privateDraft.registration.email = "PRIVATE-CONTACT-SENTINEL@example.invalid";
    privateDraft.registration.verificationReceipt = "PRIVATE-SESSION-SENTINEL";
    privateDraft.audit.push({ at: "2026-10-29T00:00:00.000Z", type: "PRIVATE-AUDIT-SENTINEL", ref: "test", reason: "Synthetic only" });
    privateDraft.snapshot["A.1.1"].note = "SELECTABLE-SNAPSHOT-NOTE";
    privateDraft.indicators["A.1.1"].rationale = "SELECTABLE-RATIONALE";
    privateDraft.indicators["A.1.1"].improvementNote = "SELECTABLE-ACTION";
    privateDraft.indicators["A.1.1"].evidence[0].owner = "SELECTABLE-EVIDENCE-OWNER";
    privateDraft.indicators["A.1.1"].evidence[0].reference = "SELECTABLE-EVIDENCE-REFERENCE";
    await replaceFixture(page, privateDraft); await page.locator('[data-action="share-results"]').click();
    check("no share categories selected by default", await page.locator('#hdrl-share-form input[type="checkbox"]:checked').count(), 0);
    check("full private scope is not prefilled", await page.locator("#share-scope").inputValue(), "");
    await page.locator("#share-snapshot").check(); await page.locator("#share-scope").fill(MINIMAL_SCOPE); await page.locator("#share-na-context").fill(NA_SCOPE);
    const minimal = await previewShare(page);
    check("unselected private and optional text absent", !/PRIVATE-|SELECTABLE-/.test(minimal));
    await page.locator('[data-action="share-edit"]').click(); await page.locator("#share-evidence-results").check(); await page.locator("#share-comments").check();
    const comments = await previewShare(page);
    check("selected comments and actions included", ["SELECTABLE-SNAPSHOT-NOTE", "SELECTABLE-RATIONALE", "SELECTABLE-ACTION"].every((s) => comments.includes(s)));
    check("unselected evidence and always-private context absent", !/PRIVATE-|SELECTABLE-EVIDENCE-/.test(comments));
    await page.locator('[data-action="share-edit"]').click(); await page.locator("#share-comments").uncheck(); await page.locator("#share-evidence-records").check();
    const references = await previewShare(page);
    check("selected evidence details included", references.includes("SELECTABLE-EVIDENCE-OWNER") && references.includes("SELECTABLE-EVIDENCE-REFERENCE"));
    check("unselected comments and always-private context still excluded", !/PRIVATE-|SELECTABLE-SNAPSHOT-NOTE|SELECTABLE-RATIONALE|SELECTABLE-ACTION/.test(references));
    await saveShare(page, check, dir, references);
  },
  async "share-na-context"({ page, check, dir }) {
    await openShare(page, { snapshot: true, evidence: true, na: "" });
    await page.locator('#hdrl-share-form button[type="submit"]').click();
    check("N/A context omission produces helpful explanation", /N\/A|not applicable/i.test(await page.locator("#share-error").innerText()));
    check("missing N/A context produces no preview", await page.locator("#share-preview-json").count(), 0);
    check("no private N/A notes automatically copied into input", await page.locator("#share-na-context").inputValue(), "");
    await page.locator("#share-na-context").fill(NA_SCOPE); const text = await previewShare(page); const payload = JSON.parse(text);
    check("N/A references deduplicated across both stages", payload.boundary_summary.not_applicable, { indicator_refs: ["A.4.1"], explanation: NA_SCOPE });
    check("private original N/A narrative excluded", !text.includes(fixture.assessment.whole_framework_snapshot["A.4.1"].note) && !text.includes(fixture.assessment.evidence_led_responses["A.4.1"].statusReason));
    const saved = await saveShare(page, check, dir, text);
    await settle(page); const before = await storage(page, "get");
    await restoreFile(page, saved.bytes, "actual-minimised-share.json"); await page.locator("#restore-error").waitFor();
    check("actual minimised share cannot replace full assessment", /share|full|backup|schema/i.test(await page.locator("#restore-error").innerText()));
    check("rejected actual share preserves stored draft", await storage(page, "get"), before);
  },
  async "keyboard-mobile"({ page, check, dir, observations, engine }) {
    await page.setViewportSize({ width: 320, height: 740 });
    const before = await storage(page, "get");
    await page.locator('[data-action="restore"]').first().focus(); await page.keyboard.press("Enter");
    await page.locator("#restore-file").focus(); check("file chooser accepts keyboard focus", await page.evaluate(() => document.activeElement.id), "restore-file");
    await page.locator("#restore-file").setInputFiles({ name: "legacy.json", mimeType: "application/json", buffer: fixtureBytes }); await page.locator("#restore-preview").waitFor();
    const restoreWidth = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    check("restore preview fits320px viewport", restoreWidth.scroll <= restoreWidth.width + 1);
    await page.screenshot({ path: path.join(dir, "restore-mobile.png"), fullPage: true });
    await page.locator('[data-action="restore-cancel"]').focus(); await page.keyboard.press("Enter");
    check("keyboard cancel preserves exact original", await storage(page, "get"), before);
    await openShare(page); await page.locator('#hdrl-share-form button[type="submit"]').focus(); await page.keyboard.press("Enter"); await page.locator("#share-preview-json").waitFor();
    const text = await page.locator("#share-preview-json").textContent();
    const shareWidth = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    check("share preview fits320px viewport", shareWidth.scroll <= shareWidth.width + 1);
    await page.locator("#share-confirm").scrollIntoViewIfNeeded(); await page.screenshot({ path: path.join(dir, "share-mobile.png") });
    await page.locator("#share-confirm").focus(); await page.keyboard.press("Space");
    // WebKit's native macOS preference skips buttons with plain Tab; Option-Tab
    // includes all controls. Keep native keyboard navigation and Enter activation.
    const nextControlKey = engine === "webkit" ? "Alt+Tab" : "Tab";
    await page.keyboard.press(nextControlKey);
    observations.keyboard = { key: nextControlKey, focus: await page.evaluate(() => ({
      tag: document.activeElement.tagName, id: document.activeElement.id,
      text: document.activeElement.textContent.trim().slice(0, 80)
    })) };
    check("confirmation tabs to download button", await page.evaluate(() => document.activeElement === document.querySelector('#hdrl-share-download-form button[type="submit"]')));
    const saved = await download(page, () => page.keyboard.press("Enter"), path.join(dir, "keyboard-share.json"));
    check("keyboard download exactly matches preview", saved.bytes.toString(), text);
    observations.mobile = { restore: restoreWidth, share: shareWidth }; observations.download = { path: saved.path, sha256: saved.sha256 };
  }
};
assert.deepEqual(Object.keys(tests), CASE_NAMES, "Implemented case inventory must exactly match declared coverage");

const report = { observed_at: new Date().toISOString(), synthetic_only: true, origin: origin.origin,
  asset_pins: assetPins, fixture_sha256: sha(fixtureBytes), requested_engines: engines,
  expected_case_names: selectedCases, browsers: [], failures: [] };
await mkdir(artifacts, { recursive: true });
try {
  for (const engine of engines) {
    const browser = await playwright[engine].launch({ headless: true });
    const browserRecord = { engine, version: browser.version(), cases: [] }; report.browsers.push(browserRecord);
    try {
      for (const name of selectedCases) {
        const record = { name, checks: [], observations: {} }; browserRecord.cases.push(record);
        let finalizing = false;
        const check = (label, actual, expected = true) => {
          let passed = true; try { assert.deepEqual(actual, expected); } catch { passed = false; }
          record.checks.push({ label, passed, ...(passed ? {} : { actual, expected }) });
          if (!passed && !finalizing) throw new Error(label);
        };
        const ctx = await browser.newContext({ acceptDownloads: true, serviceWorkers: "block", viewport: { width: 1280, height: 900 } });
        const blocked = [], pageErrors = [], errorDetails = [], assetResponses = [];
        await ctx.exposeBinding("__recordPortabilityError", (_source, detail) => { errorDetails.push(detail); });
        await ctx.addInitScript(() => {
          window.addEventListener("error", (event) => {
            window.__recordPortabilityError({ message: event.message, filename: event.filename,
              line: event.lineno, column: event.colno, stack: event.error?.stack || null,
              view: document.getElementById("hdrl-view-title")?.textContent || null });
          });
        });
        await ctx.route("**/*", async (route) => {
          const req = route.request(); const url = new URL(req.url());
          if (url.origin !== origin.origin || !["GET", "HEAD"].includes(req.method())) { blocked.push({ method: req.method(), url: req.url() }); return route.abort(); }
          if (url.pathname === "/__hdrl_portability_fixture__") return route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Synthetic fixture</title>" });
          return route.continue();
        });
        ctx.on("page", (opened) => {
          opened.setDefaultTimeout(10000);
          opened.on("pageerror", (e) => pageErrors.push(e.message));
          opened.on("response", (r) => { const url = new URL(r.url()).pathname; if (assetPins[url]) assetResponses.push(r.body().then((bytes) => ({ path: url, sha256: sha(bytes) }))); });
        });
        const page = await ctx.newPage();
        const dir = path.join(artifacts, `${engine}-${name}`); await mkdir(dir, { recursive: true });
        try {
          await page.goto(`${origin.origin}/__hdrl_portability_fixture__`);
          if (name !== "restore-legacy-v04") await storage(page, "put", draftFromFixture({ context: name === "restore-current-backup-confirm" ? "synthetic" : "unspecified" }));
          await page.goto(`${origin.origin}/self-assessment/`); await ready(page);
          const received = await Promise.all(assetResponses);
          for (const [url, pin] of Object.entries(assetPins)) assert.deepEqual([...new Set(received.filter((r) => r.path === url).map((r) => r.sha256))], [pin], `Unmodified served asset: ${url}`);
          await tests[name]({ page, check, dir, observations: record.observations, engine });
        } catch (e) { record.fatal = e.message; }
        finally {
          finalizing = true; record.behaviour_assertions = record.checks.length;
          if (!record.behaviour_assertions) record.fatal ||= "No behavioural assertions executed";
          check("no external or write request", blocked, []); check("no uncaught page error", pageErrors, []);
          for (const [url, pin] of Object.entries(assetPins)) check(`served asset remains pinned: ${url}`, [...new Set((await Promise.all(assetResponses)).filter((r) => r.path === url).map((r) => r.sha256))], [pin]);
          record.blocked_requests = blocked; record.page_errors = pageErrors; record.error_details = errorDetails;
          record.assertions = { total: record.checks.length, passed: record.checks.filter((c) => c.passed).length, failed: record.checks.filter((c) => !c.passed).length };
          record.passed = !record.fatal && record.checks.every((c) => c.passed);
          if (!record.passed) report.failures.push({ engine, name, fatal: record.fatal, failed_checks: record.checks.filter((c) => !c.passed).map((c) => c.label) });
          await ctx.close(); console.log(`${engine}/${name}: ${record.passed ? "PASS" : "FAIL"}`);
        }
      }
    } finally { await browser.close(); }
  }
} finally {
  for (const engine of engines) {
    const runs = report.browsers.filter((b) => b.engine === engine);
    if (runs.length !== 1 || JSON.stringify(runs[0].cases.map((c) => c.name)) !== JSON.stringify(selectedCases)) report.failures.push({ engine, name: "case-inventory", fatal: "Requested exact case inventory did not execute" });
  }
  const cases = report.browsers.flatMap((b) => b.cases);
  report.assertions = { total: cases.reduce((n, c) => n + (c.assertions?.total || 0), 0), failed: cases.reduce((n, c) => n + (c.assertions?.failed || 0), 0), fatal_cases: cases.filter((c) => c.fatal).length };
  report.finished_at = new Date().toISOString();
  report.fixture_unchanged = sha(await readFile(fixturePath)) === report.fixture_sha256;
  if (!report.fixture_unchanged) report.failures.push({ name: "fixture-pin", fatal: "Original fixture bytes changed" });
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify(report, null, 2) + "\n");
}
console.log(JSON.stringify({ cases: report.browsers.reduce((n, b) => n + b.cases.length, 0), assertions: report.assertions, failures: report.failures.length, output, artifacts }));
if (report.failures.length) process.exitCode = 1;
