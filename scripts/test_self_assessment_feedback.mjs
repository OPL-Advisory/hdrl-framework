// FB-01–05 browser regression. Invented Fenland fixture only; fresh contexts,
// unmodified served MkDocs JS, loopback requests only. No provider or user profile.
// HDRL_FEEDBACK_FIXTURE=/absolute/Fenland-synthetic-baseline.json
// HDRL_PREVIEW_ORIGIN=http://127.0.0.1:8128 HDRL_BROWSER_RESULTS=/absolute/results.json
// Optional HDRL_SOURCE_PATH pins an immutable before source; defaults to current JS.
// Optional HDRL_BROWSERS=chromium (default: chromium,firefox,webkit).
// Optional HDRL_BROWSER_ARTIFACTS retains screenshots, PDF and actual JSON downloads.
// Optional HDRL_BROWSER_CASE selects one exact case for a bounded diagnostic rerun.
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash, webcrypto } from "node:crypto";
import vm from "node:vm";
import { CASE_NAMES, selectFeedbackRun, feedbackCoverageFailures } from "./self_assessment_feedback_inventory.mjs";

// Fail configuration errors before loading Playwright, opening a browser or reading a fixture.
const selection = selectFeedbackRun(process.env);
const require = createRequire(import.meta.url);
const playwright = require(process.env.HDRL_PLAYWRIGHT || "playwright");
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = new URL(process.env.HDRL_PREVIEW_ORIGIN || "http://127.0.0.1:8128");
assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname), "Loopback preview only");
assert.equal(origin.protocol, "http:");
const fixturePath = process.env.HDRL_FEEDBACK_FIXTURE || process.argv[2];
assert.ok(fixturePath, "Supply HDRL_FEEDBACK_FIXTURE or the retained Fenland fixture path as argument");
const output = path.resolve(process.env.HDRL_BROWSER_RESULTS || "/tmp/hdrl-feedback-browser-results.json");
const artifacts = path.resolve(process.env.HDRL_BROWSER_ARTIFACTS || `/tmp/hdrl-feedback-artifacts-${Date.now()}`);
await mkdir(artifacts, { recursive: true });
const sourcePath = path.resolve(process.env.HDRL_SOURCE_PATH || path.join(repo, "docs/assets/js/self-assessment.js"));
const source = await readFile(sourcePath, "utf8");
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const sourceHash = hash(source);
const fixtureBytes = await readFile(fixturePath);
const fixture = JSON.parse(fixtureBytes);
assert.equal(fixture.export_schema, "hdrl-self-assessment-export-v0.4.0");
assert.match(fixture.assessment.boundary.title, /HYPOTHETICAL TEST ONLY.*Fenland/);
const catalogue = JSON.parse(await readFile(path.join(repo, "docs/data/hdrl-indicators-v1.json"), "utf8"));
const betaConfig = JSON.parse(await readFile(path.join(repo, "docs/data/hdrl-assessment-beta-config-v0.3.0.json"), "utf8"));
const context = vm.createContext({ document: { getElementById: () => ({}) }, crypto: webcrypto });
assert.match(source, /  init\(\);\n\}\)\(\);\s*$/);
vm.runInContext(source.replace(/  init\(\);\n\}\)\(\);\s*$/, "  globalThis.fixtureFactory = (config) => { betaConfig = config; return defaultState(); };\n})();"), context);
const clone = (value) => JSON.parse(JSON.stringify(value));
const makeDraft = (view = "report") => {
  const draft = clone(context.fixtureFactory(betaConfig));
  const a = fixture.assessment;
  Object.assign(draft, { id: a.id, createdAt: a.created_at, updatedAt: a.updated_at,
    boundary: clone(a.boundary), rapid: clone(a.rapid_first_pass), snapshot: clone(a.whole_framework_snapshot),
    indicators: clone(a.evidence_led_responses), domainNotes: clone(a.domain_capacity_notes), audit: clone(a.audit),
    versions: clone(fixture.versions), provenance: clone(fixture.provenance), view });
  return draft;
};
const scoreShape = (responses) => Object.fromEntries(Object.entries(responses).map(([ref, r]) => [ref, { status: r.status, level: r.level, certainty: r.certainty, evidence: r.evidence || [] }]));
const actionEntries = (draft) => Object.entries(draft.indicators).filter(([, r]) => r.improvementNote.trim());
const statusCounts = (responses) => Object.values(responses).reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] || 0) + 1 }), {});
const report = { observed_at: new Date().toISOString(), fixture_sha256: hash(fixtureBytes), source_sha256: sourceHash,
  requested_engines: selection.engines, expected_case_names: selection.caseNames, case_filter: selection.filter || null,
  source_path: sourcePath, artifact_directory: artifacts, fixture_name: path.basename(fixturePath), synthetic_only: true, live_services: false,
  fixture_counts: { snapshot: statusCounts(fixture.assessment.whole_framework_snapshot), evidence: statusCounts(fixture.assessment.evidence_led_responses), actions: actionEntries(makeDraft()).length },
  browsers: [], failures: [] };

async function storage(page, operation, value) {
  return page.evaluate(({ operation, value }) => new Promise((resolve, reject) => {
    const request = indexedDB.open("hdrl-self-assessment-prototype", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("drafts");
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("drafts", operation === "put" ? "readwrite" : "readonly");
      const store = tx.objectStore("drafts");
      const action = operation === "put" ? store.put(value, "current") : store.get("current");
      let result;
      action.onsuccess = () => { result = action.result; };
      tx.oncomplete = () => { db.close(); resolve(result); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    };
  }), { operation, value });
}
async function downloadJson(page, tag) {
  const [download] = await Promise.all([page.waitForEvent("download"), page.locator('[data-action="export-json"]').click()]);
  const destination = path.join(artifacts, `${tag}.json`);
  await download.saveAs(destination);
  assert.equal(await download.failure(), null);
  const bytes = await readFile(destination);
  return { value: JSON.parse(bytes), path: destination, bytes: bytes.length, sha256: hash(bytes) };
}
async function toReport(page) {
  if (await page.locator("#hdrl-generated-report").count()) return;
  await page.locator('[data-action="dashboard"]').click();
  await page.locator('[data-action="evidence"]').click();
  await page.locator('[data-action="review"]').click();
  await page.locator('[data-action="gate"]').click();
  await page.locator("#hdrl-generated-report").waitFor();
}
const section = (page, heading) => page.locator("#hdrl-generated-report section").filter({ has: page.getByRole("heading", { name: new RegExp(`^${heading}(?: \\(\\d+\\))?$`) }) });
async function expandDetails(locator) {
  for (const detail of await locator.locator("details").all()) {
    if ((await detail.getAttribute("open")) === null) await detail.locator("summary").first().click();
  }
}
async function plainText(locator) {
  return locator.evaluate((node) => { const copy = node.cloneNode(true); copy.querySelectorAll("details").forEach((d) => d.remove()); return copy.textContent; });
}

async function runCase(browser, engine, name, draft, body) {
  assert.ok(CASE_NAMES.includes(name), `Undeclared browser case: ${name}`);
  if (!selection.caseNames.includes(name)) return;
  const record = { name, checks: [], observations: {} };
  const browserRecord = report.browsers.find((b) => b.engine === engine);
  browserRecord.cases.push(record);
  const check = (label, actual, expected = true) => {
    let passed = true; try { assert.deepEqual(actual, expected); } catch { passed = false; }
    record.checks.push({ label, passed, ...(passed ? {} : { actual, expected }) });
  };
  const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 } });
  const external = [], errors = [], scriptHashes = [];
  await ctx.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== origin.origin) { external.push(url.href); return route.abort(); }
    if (url.pathname === "/__hdrl_feedback_fixture__") return route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Synthetic fixture</title>" });
    return route.continue();
  });
  const page = await ctx.newPage(); page.setDefaultTimeout(6000);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => { if (new URL(response.url()).pathname.endsWith("/assets/js/self-assessment.js")) scriptHashes.push(response.body().then(hash)); });
  try {
    await page.goto(`${origin.origin}/__hdrl_feedback_fixture__`);
    await storage(page, "put", draft);
    await page.goto(`${origin.origin}/self-assessment/`);
    await page.locator('#hdrl-assessment-root[aria-busy="false"]').waitFor();
    // A stale/mismatched build is a harness error, never evidence of an app defect.
    assert.deepEqual([...new Set(await Promise.all(scriptHashes))], [sourceHash], "Served JS does not match selected source pin");
    await body({ page, record, check, engine });
  } catch (error) { record.fatal = error.message; }
  finally {
    record.behaviour_assertions = record.checks.length;
    if (!record.behaviour_assertions) record.fatal ||= "Case executed without behavioural assertions.";
    check("no external request", external, []); check("no uncaught page error", errors, []);
    check("all served JS copies match selected source", [...new Set(await Promise.all(scriptHashes))], [sourceHash]);
    record.assertions = { total: record.checks.length, passed: record.checks.filter((c) => c.passed).length, failed: record.checks.filter((c) => !c.passed).length };
    record.passed = !record.fatal && record.checks.every((c) => c.passed);
    record.external_requests = external; record.page_errors = errors;
    if (!record.passed) report.failures.push({ engine, name, fatal: record.fatal || null, failed_checks: record.checks.filter((c) => !c.passed).map((c) => c.label) });
    await ctx.close();
    console.log(`${engine}/${name}: ${record.passed ? "PASS" : "FAIL"}`);
  }
}

try {
  for (const engine of selection.engines) {
    assert.ok(playwright[engine], "Unknown browser engine");
    const browser = await playwright[engine].launch({ headless: true });
    report.browsers.push({ engine, version: browser.version(), cases: [] });
    try {
      await runCase(browser, engine, "fenland-report-completeness-and-provenance", makeDraft(), async ({ page, record, check }) => {
        const expected = actionEntries(makeDraft());
        const actions = section(page, "Potential improvement actions");
        const provisional = section(page, "Provisional interpretations");
        const questions = section(page, "Suggested questions to investigate");
        await expandDetails(actions); await expandDetails(provisional); await expandDetails(questions);
        const actionText = await actions.innerText();
        const missing = expected.filter(([, r]) => !actionText.includes(r.improvementNote)).map(([ref]) => ref);
        check("all fixture actions reachable in HTML", missing, []);
        const provisionalText = await provisional.innerText();
        check("all provisional references reachable in HTML", fixture.derived.findings.provisional.filter((f) => !provisionalText.includes(f.ref)).map((f) => f.ref), []);
        const late = expected.filter(([ref]) => ref.startsWith("H.")).at(-1);
        const lateLink = actions.locator(`[data-action="open-indicator"][data-ref="${late[0]}"]`);
        check("late H action has an edit link", await lateLink.count(), 1);
        if (await lateLink.count()) {
          await lateLink.scrollIntoViewIfNeeded();
          const desktopPath = path.join(artifacts, `${engine}-late-H-desktop.png`);
          await page.screenshot({ path: desktopPath });
          record.observations.desktop_screenshot = desktopPath;
          await lateLink.click(); await page.locator("#hdrl-indicator-form").waitFor();
          check("late H action link opens corresponding input", await page.locator("#indicator-improvement").inputValue(), late[1].improvementNote);
          await toReport(page);
        }
        check("action attribution is plain language", /assessor[- ]entered|entered by (you|the assessor)|you entered/i.test(await plainText(section(page, "Potential improvement actions"))));
        check("question explanation names uncertainty trigger", /not known|unknown|low certainty/i.test(await plainText(section(page, "Suggested questions to investigate"))));
        check("rule IDs outside primary finding prose", !/R-(USER-ACTION|LOW-CERTAINTY|NOT-ASSESSED|EVIDENCE-GAP)/.test(await plainText(section(page, "Potential improvement actions"))));
        const downloaded = await downloadJson(page, `${engine}-fenland`);
        const value = downloaded.value;
        check("JSON action count agrees with raw fixture", value.derived.findings.actions.length, expected.length);
        check("JSON keeps source versions", value.versions, fixture.versions);
        check("JSON keeps source provenance", value.provenance, fixture.provenance);
        check("JSON keeps source date", value.assessment.boundary.assessmentDate, fixture.assessment.boundary.assessmentDate);
        check("JSON evidence medians unchanged", value.derived.domain_summaries, fixture.derived.domain_summaries);
        check("JSON snapshot medians unchanged", value.derived.snapshot_domain_summaries, fixture.derived.snapshot_domain_summaries);
        check("JSON retains stable rule IDs", value.derived.findings.actions.every((a) => a.rule === "R-USER-ACTION"));
        check("fixture status counts unchanged", statusCounts(value.assessment.evidence_led_responses), report.fixture_counts.evidence);
        await page.setViewportSize({ width: 320, height: 740 });
        const mobile = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth,
          offenders: [...document.querySelectorAll("#hdrl-assessment-root *")].map((el) => ({ el, rect: el.getBoundingClientRect() })).filter(({ el, rect }) => !el.closest(".hdrl-report-table-wrap") && rect.width && (rect.right > document.documentElement.clientWidth + 1 || rect.left < -1) && getComputedStyle(el).position !== "fixed").sort((a, b) => b.rect.right - a.rect.right).slice(0, 30).map(({ el, rect }) => ({ tag: el.tagName, id: el.id, class: String(el.className), left: rect.left, right: rect.right, width: rect.width, scrollWidth: el.scrollWidth, text: el.textContent.slice(0, 120) })) }));
        const mobileLate = section(page, "Potential improvement actions").locator(`[data-action="open-indicator"][data-ref="${late[0]}"]`);
        if (await mobileLate.count()) await mobileLate.scrollIntoViewIfNeeded();
        const mobilePath = path.join(artifacts, `${engine}-late-H-mobile.png`);
        await page.screenshot({ path: mobilePath });
        record.observations.mobile_screenshot = mobilePath;
        check("report reflows at 320px", mobile.scroll <= mobile.width + 1);
        await page.emulateMedia({ media: "print" });
        await expandDetails(section(page, "Potential improvement actions"));
        const printText = await section(page, "Potential improvement actions").innerText();
        check("all actions remain in printable HTML", expected.filter(([, r]) => !printText.includes(r.improvementNote)).map(([ref]) => ref), []);
        if (engine === "chromium") {
          const pdf = await page.pdf({ format: "A4", printBackground: true });
          check("Chromium produced PDF bytes", pdf.subarray(0, 4).toString(), "%PDF");
          const pdfPath = path.join(artifacts, `${engine}-fenland-report.pdf`);
          await writeFile(pdfPath, pdf);
          record.observations.pdf = { path: pdfPath, bytes: pdf.length, sha256: hash(pdf), scope: "PDF creation, not visual pagination review" };
        }
        record.observations = { ...record.observations, expected_actions: expected.length, missing_html_action_refs: missing, mobile, json_download: { path: downloaded.path, bytes: downloaded.bytes, sha256: downloaded.sha256 } };
      });

      for (const status of ["not_known", "not_assessed", "not_applicable"]) {
        const draft = makeDraft("indicator"); draft.activeIndicator = "E.3.1";
        Object.assign(draft.indicators["E.3.1"], { status, decision: "not_judged", level: "", certainty: "", statusReason: `Synthetic explicit ${status} explanation`, improvementNote: "" });
        const beforeScores = scoreShape(draft.indicators);
        const note = `SYNTHETIC FB01 ${status}: obtain proportionate supporting information; no maturity claim.`;
        await runCase(browser, engine, `nonrated-action-${status}`, draft, async ({ page, record, check }) => {
          // The initial temporary rated choice exposes the old field, so baseline
          // can reproduce silent clearing as well as field invisibility.
          await page.locator('input[name="indicator-decision"][value="rated"]').check();
          await page.locator("#indicator-improvement").fill(note);
          await page.locator('input[name="indicator-decision"][value="not_judged"]').check();
          await page.locator(`input[name="indicator-status"][value="${status}"]`).check();
          await page.locator("#indicator-status-reason").fill(`Synthetic explicit ${status} explanation`);
          check("action stays editable for non-rated status", await page.locator("#indicator-improvement").isVisible());
          await page.locator('#hdrl-indicator-form button[type="submit"]').click();
          await page.waitForTimeout(500); await page.reload();
          await page.locator('#hdrl-assessment-root[aria-busy="false"]').waitFor();
          const stored = await storage(page, "get");
          check("saved action survives reload", stored.indicators["E.3.1"].improvementNote, note);
          check("action-only change preserves every score/evidence status", scoreShape(stored.indicators), beforeScores);
          await page.locator('[data-action="open-indicator"][data-ref="E.3.1"]').click();
          check("reopened action is visible", await page.locator("#indicator-improvement").isVisible());
          check("reopened action text is identical", await page.locator("#indicator-improvement").inputValue(), note);
          await toReport(page);
          await expandDetails(section(page, "Potential improvement actions"));
          const actionText = await section(page, "Potential improvement actions").innerText();
          check("non-rated action reachable in report HTML", actionText.includes(note));
          check("all 62 original actions plus new action reachable in HTML", [...actionEntries(draft).map(([ref, r]) => ({ ref, text: r.improvementNote })), { ref: "E.3.1", text: note }].filter((a) => !actionText.includes(a.text)).map((a) => a.ref), []);
          const downloaded = await downloadJson(page, `${engine}-${status}`);
          check("JSON retains non-rated action", downloaded.value.assessment.evidence_led_responses["E.3.1"].improvementNote, note);
          check("non-rated action creates no level", downloaded.value.assessment.evidence_led_responses["E.3.1"].level, "");
          check("JSON includes every original action plus retained action", downloaded.value.derived.findings.actions.length, actionEntries(draft).length + 1);
          check("JSON preserves all 62 original action texts", actionEntries(draft).filter(([ref, r]) => downloaded.value.assessment.evidence_led_responses[ref].improvementNote !== r.improvementNote).map(([ref]) => ref), []);
          check("JSON status counts unchanged by action save", statusCounts(downloaded.value.assessment.evidence_led_responses), statusCounts(draft.indicators));
          check("action changes do not change medians", downloaded.value.derived.domain_summaries, fixture.derived.domain_summaries);
          check("source provenance is retained", downloaded.value.provenance, fixture.provenance);
          record.observations.saved_action = stored.indicators["E.3.1"].improvementNote;
          record.observations.expected_action_count = actionEntries(draft).length + 1;
        });
      }

      for (const existing of [false, true]) {
        const draft = makeDraft("snapshot"); draft.activeIndicator = "A.1.2";
        Object.assign(draft.snapshot["A.1.2"], { status: existing ? "not_known" : "unstarted", level: "", certainty: "", clarity: "", note: existing ? "Previously saved synthetic note" : "" });
        const beforeResponse = clone(draft.snapshot["A.1.2"]);
        const note = `SYNTHETIC FB02 ${existing ? "existing" : "new"} note must survive one correction`;
        await runCase(browser, engine, `snapshot-validation-${existing ? "saved-response" : "new-response"}`, draft, async ({ page, record, check }) => {
          await page.locator("#snapshot-level-L3").focus(); await page.keyboard.press("Space");
          const detail = page.locator(".hdrl-snapshot-note");
          if ((await detail.getAttribute("open")) === null) await detail.locator("summary").click();
          await page.locator("#snapshot-note").fill(note);
          await page.locator('input[name="snapshot-clarity"][value="some_overlap"]').check();
          await page.locator('#hdrl-snapshot-form [name="journey-action"][value="next"]').focus(); await page.keyboard.press("Enter");
          await page.locator("#hdrl-snapshot-errors").waitFor();
          check("validation error summary receives keyboard focus", await page.evaluate(() => document.activeElement?.id), "hdrl-snapshot-errors");
          check("chosen level survives missing certainty", await page.locator("#snapshot-level-L3").isChecked());
          check("unsaved note survives missing certainty", await page.locator("#snapshot-note").inputValue(), note);
          check("valid clarity survives missing certainty", await page.locator('input[name="snapshot-clarity"][value="some_overlap"]').isChecked());
          await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
          await page.waitForTimeout(500);
          check("invalid answer never replaces saved response", (await storage(page, "get")).snapshot["A.1.2"], beforeResponse);
          const reselect = !(await page.locator("#snapshot-level-L3").isChecked());
          check("correction needs only certainty, not level reselection", reselect, false);
          if (reselect) await page.locator("#snapshot-level-L3").check();
          await page.locator('input[name="snapshot-certainty"][value="high"]').focus(); await page.keyboard.press("Space");
          await page.locator('#hdrl-snapshot-form [name="journey-action"][value="next"]').focus(); await page.keyboard.press("Enter");
          await page.waitForTimeout(500); await page.reload();
          await page.locator('#hdrl-assessment-root[aria-busy="false"]').waitFor();
          const saved = (await storage(page, "get")).snapshot["A.1.2"];
          check("corrected response is rated L3 with high certainty", { status: saved.status, level: saved.level, certainty: saved.certainty }, { status: "rated", level: "L3", certainty: "high" });
          check("corrected response retains note", saved.note, note);
          check("corrected response retains clarity", saved.clarity, "some_overlap");
          record.observations = { previous_status: beforeResponse.status, corrected_response: saved, baseline_level_reselection_needed: reselect };
        });
      }

      const queueDraft = makeDraft("snapshot-review");
      const naRef = Object.keys(queueDraft.snapshot).find((ref) => queueDraft.snapshot[ref].status === "not_applicable");
      const [deferred, unstarted, multiple] = catalogue.indicators.map((i) => i.ref).filter((ref) => !["E.3.1", naRef].includes(ref)).slice(0, 3);
      for (const [ref, r] of Object.entries(queueDraft.snapshot)) if (ref !== naRef) Object.assign(r, { status: "rated", level: "L3", certainty: "high", clarity: "clear" });
      for (const [ref, status] of [["E.3.1", "not_known"], [deferred, "not_assessed"], [unstarted, "unstarted"]]) Object.assign(queueDraft.snapshot[ref], { status, level: "", certainty: "", clarity: "" });
      Object.assign(queueDraft.snapshot[multiple], { certainty: "low", clarity: "unclear" });
      for (const [ref, r] of Object.entries(queueDraft.indicators)) {
        if (ref === naRef) continue;
        Object.assign(r, { status: "rated", decision: "rated", level: "L3", certainty: "high", rationale: "Synthetic rationale", statusReason: "", evidence: [{ id: ref, title: "Synthetic reference", type: "Other", reference: "INVENTED", owner: "Invented", date: "2026-10-28", note: "Invented", limitations: "Synthetic", reviewStatus: "unreviewed" }] });
      }
      for (const [ref, status] of [["E.3.1", "not_known"], [deferred, "not_assessed"], [unstarted, "unstarted"]]) Object.assign(queueDraft.indicators[ref], { status, decision: status === "unstarted" ? "" : "not_judged", level: "", certainty: "", statusReason: status === "unstarted" ? "" : "Synthetic reason" });
      Object.assign(queueDraft.indicators[multiple], { rationale: "", evidence: [] });
      await runCase(browser, engine, "review-queues-preserve-every-status-and-reason", queueDraft, async ({ page, check, record }) => {
        const expected = ["E.3.1", deferred, unstarted, multiple];
        const rows = page.locator('.hdrl-review-issues [data-action="open-snapshot"]');
        check("snapshot queue contains four unique indicators", await rows.count(), expected.length);
        for (const ref of expected) check(`snapshot queue contains exactly one ${ref}`, await rows.filter({ has: page.locator(`strong:text-is("${ref}")`) }).count(), 1);
        const multiRow = rows.filter({ has: page.locator(`strong:text-is("${multiple}")`) });
        const multiText = await multiRow.count() ? await multiRow.innerText() : "";
        check("snapshot multiple reasons retain low certainty and wording", /low certainty/i.test(multiText) && /wording|unclear/i.test(multiText));
        check("scope-explained N/A is not an unresolved deficiency", await page.locator(`.hdrl-review-issues [data-ref="${naRef}"]`).count(), 0);
        const unknown = page.locator('.hdrl-review-issues [data-action="open-snapshot"][data-ref="E.3.1"]');
        if (await unknown.count()) { await unknown.click(); check("unknown edit link opens E.3.1", (await page.locator("#hdrl-view-title").innerText()).startsWith("E.3.1")); await page.locator('[data-action="snapshot-dashboard"]').first().click(); await page.locator('[data-action="snapshot-review"]').click(); }
        await page.locator('[data-action="evidence"]').click(); await page.locator('[data-action="review"]').click();
        const evidenceRows = page.locator('.hdrl-review-issues [data-action="open-indicator"]');
        check("evidence queue groups reasons into four indicator rows", await evidenceRows.count(), expected.length);
        for (const ref of expected) check(`evidence queue contains exactly one ${ref}`, await page.locator(`.hdrl-review-issues [data-action="open-indicator"][data-ref="${ref}"]`).count(), 1);
        const evidenceMulti = page.locator(`.hdrl-review-issues [data-ref="${multiple}"]`);
        const evidenceText = (await evidenceMulti.allInnerTexts()).join(" ");
        check("evidence multiple reasons preserve missing rationale and evidence", /rationale/i.test(evidenceText) && /evidence/i.test(evidenceText));
        check("evidence N/A scope remains distinct", await page.locator(`.hdrl-review-issues [data-ref="${naRef}"]`).count(), 0);
        record.observations = { expected_refs: expected, not_applicable_ref: naRef };
      });
    } finally { await browser.close(); }
  }
} finally {
  report.failures.push(...feedbackCoverageFailures(selection, report.browsers));
  const allCases = report.browsers.flatMap((b) => b.cases);
  report.assertions = { total: allCases.reduce((n, c) => n + (c.assertions?.total || 0), 0), passed: allCases.reduce((n, c) => n + (c.assertions?.passed || 0), 0), failed: allCases.reduce((n, c) => n + (c.assertions?.failed || 0), 0), fatal_cases: allCases.filter((c) => c.fatal).length };
  report.finished_at = new Date().toISOString();
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify(report, null, 2) + "\n");
}
console.log(JSON.stringify({ engines: report.browsers.map((b) => b.engine), cases: report.browsers.reduce((n, b) => n + b.cases.length, 0), failures: report.failures.length, assertions: report.assertions, output, artifacts }));
if (report.failures.length) process.exitCode = 1;
