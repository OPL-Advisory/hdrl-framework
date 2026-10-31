// Reporting browser regressions: synthetic local fixtures, unmodified MkDocs assets.
// No live services or existing browser profile. HDRL_FEEDBACK_FIXTURE is required.
// HDRL_PREVIEW_ORIGIN defaults to http://127.0.0.1:8152. Results/artifacts must be private.
// Full suite also requires HDRL_RESTORE_EXPLANATION_FIXTURE: the separate pinned
// synthetic review fixture. It is not copied into this repository or published.
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { createHash, webcrypto } from "node:crypto";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import vm from "node:vm";

const CASES = Object.freeze(["fenland-report-comparison", "foundational-low-h", "snapshot-only", "sparse-missingness", "reference-status-and-ordinal-comparison", "exports-history-and-safe-text", "narrative-correction-keyboard-mobile", "print-all-63-actions", "snapshot-context-and-guidance", "snapshot-keyboard-pause-and-domain-navigation", "snapshot-pause-failed-save-no-autosave", "orientation-and-completed-snapshot-resume", "restored-active-explanation"]);
const ENGINES = Object.freeze(["chromium", "firefox", "webkit"]);
const filter = process.env.HDRL_BROWSER_CASE || "";
assert.ok(!filter || CASES.includes(filter), `Unknown HDRL_BROWSER_CASE; supported: ${CASES.join(", ")}`);
const engines = (process.env.HDRL_BROWSERS || ENGINES.join(",")).split(",");
assert.ok(engines.length && engines.every((e) => ENGINES.includes(e)) && new Set(engines).size === engines.length, "Choose unique supported browsers");
const selected = filter ? [filter] : [...CASES];
const origin = new URL(process.env.HDRL_PREVIEW_ORIGIN || "http://127.0.0.1:8152");
assert.ok(origin.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname) && !origin.username && !origin.password && !origin.search, "Loopback HTTP preview only");
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.resolve(process.env.HDRL_SOURCE_ROOT || repo);
const output = path.resolve(process.env.HDRL_BROWSER_RESULTS || `/tmp/hdrl-reporting-${Date.now()}/results.json`);
const artifacts = path.resolve(process.env.HDRL_BROWSER_ARTIFACTS || path.join(path.dirname(output), "artifacts"));
const fixturePath = process.env.HDRL_FEEDBACK_FIXTURE;
assert.ok(fixturePath, "HDRL_FEEDBACK_FIXTURE is required");
const sha = (v) => createHash("sha256").update(v).digest("hex"), clone = (v) => JSON.parse(JSON.stringify(v));
const normal = (s) => s.normalize("NFKC").replace(/\u00ad/g, "").replace(/([-\u2010\u2011])\r?\n\s*/g, "$1").replace(/\s+/g, " ").trim();
const fixtureBytes = await readFile(fixturePath);
assert.equal(sha(fixtureBytes), "8e0c36eb2f24895d38198431ebc179e57517cbba0abc5b6a20e8e13c2db61422", "Retained synthetic Fenland fixture changed");
const fixture = JSON.parse(fixtureBytes);
const explanationFixturePath = process.env.HDRL_RESTORE_EXPLANATION_FIXTURE;
let explanationFixtureBytes = null, explanationFixture = null;
if (selected.includes("restored-active-explanation")) {
  assert.ok(explanationFixturePath, "HDRL_RESTORE_EXPLANATION_FIXTURE is required for restored-active-explanation");
  explanationFixtureBytes = await readFile(explanationFixturePath);
  assert.equal(sha(explanationFixtureBytes), "f6567646391879cee274789ba75a59d81652a4d3aa13a7e9c5bdc3a882cccd85", "Separate synthetic restore fixture changed");
  explanationFixture = JSON.parse(explanationFixtureBytes);
  assert.equal(explanationFixture.export_schema, "hdrl-self-assessment-export-v0.4.0");
}
const assetPaths = ["/assets/js/self-assessment.js", "/assets/js/self-assessment-portability.js", "/assets/css/self-assessment.css", "/data/hdrl-indicators-v1.json", "/data/hdrl-assessment-content-v0.2.0.json", "/data/hdrl-assessment-beta-config-v0.3.0.json"];
const assets = Object.fromEntries(await Promise.all(assetPaths.map(async (url) => [url, await readFile(path.join(sourceRoot, "docs", url))])));
const pins = Object.fromEntries(Object.entries(assets).map(([url, bytes]) => [url, sha(bytes)]));
assert.equal(pins[assetPaths[3]], "442a10be23a0ddec889785577fb8853db2296cc5b3a50929849025e27077cd47");
assert.equal(pins[assetPaths[4]], "1118cb773ca4ecc2bff06d2612d14b756134bda04603c43dd18604f4df36f92f");
assert.equal(pins[assetPaths[5]], "a3da49a235a97d28be620acd8ab0c52de1e9beda2955364d027b492ce787b928");
const catalogue = JSON.parse(assets[assetPaths[3]]), config = JSON.parse(assets[assetPaths[5]]);
const members = (domain) => catalogue.indicators.filter((i) => i.domain === domain && i.type === "Core" && i.applicability_class !== "Y");
assert.deepEqual(catalogue.domains.map((d) => members(d.ref).length), [7, 4, 9, 3, 6, 2, 4, 6]);
const foundational = catalogue.indicators.filter((i) => i.foundational).map((i) => i.ref);
assert.deepEqual(foundational, ["C.1.1", "C.2.2", "C.4.1", "H.3.1", "H.3.2"]);
const source = assets[assetPaths[0]].toString(), fixtureContext = vm.createContext({ document: { getElementById: () => ({}) }, crypto: webcrypto });
assert.match(source, /  init\(\);\n\}\)\(\);\s*$/);
vm.runInContext(source.replace(/  init\(\);\n\}\)\(\);\s*$/, "  globalThis.makeFixture = c => { betaConfig=c; return defaultState(); };\n})();"), fixtureContext);
const playwright = createRequire(import.meta.url)(process.env.HDRL_PLAYWRIGHT || "playwright");
const level = (r) => r?.status === "rated" && /^L[1-5]$/.test(r.level || "") ? r.level : null;
const med = (responses, domain) => {
  const values = members(domain).map((i) => level(responses[i.ref])).filter(Boolean).sort();
  if (!values.length) return "Not enough data";
  const left = values[Math.floor((values.length - 1) / 2)], right = values[Math.floor(values.length / 2)];
  return left === right ? left : `${left}–${right}`;
};
function draft() {
  const d = clone(fixtureContext.makeFixture(config)), a = fixture.assessment;
  Object.assign(d, { id: a.id, createdAt: a.created_at, updatedAt: a.updated_at, boundary: clone(a.boundary), rapid: clone(a.rapid_first_pass),
    snapshot: clone(a.whole_framework_snapshot), indicators: clone(a.evidence_led_responses), domainNotes: clone(a.domain_capacity_notes), audit: clone(a.audit),
    versions: clone(fixture.versions), provenance: clone(fixture.provenance), view: "report", declaredContext: "synthetic" });
  return d;
}
const response = (stage, status = "unstarted", selectedLevel = "") => stage === "snapshot"
  ? { status, level: selectedLevel, certainty: selectedLevel ? "medium" : "", certaintyReasons: [], clarity: "", note: "", updatedAt: null }
  : { decision: status, status, level: selectedLevel, certainty: selectedLevel ? "medium" : "", rationale: "", improvementNote: "", statusReason: "", evidence: [], updatedAt: null };
async function storage(page, operation, value) {
  return page.evaluate(({ operation, value }) => new Promise((resolve, reject) => {
    const r = indexedDB.open("hdrl-self-assessment-prototype", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("drafts"); r.onerror = () => reject(r.error);
    r.onsuccess = () => { const db = r.result, tx = db.transaction("drafts", operation === "put" ? "readwrite" : "readonly");
      const request = operation === "put" ? tx.objectStore("drafts").put(value, "current") : tx.objectStore("drafts").get("current");
      let result; request.onsuccess = () => { result = request.result; };
      tx.oncomplete = () => { db.close(); resolve(result); }; tx.onerror = tx.onabort = () => { db.close(); reject(tx.error || new Error("Synthetic storage failure")); };
    };
  }), { operation, value });
}
const ready = (page) => page.locator('#hdrl-assessment-root[aria-busy="false"]').waitFor();
const settled = (page) => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
async function load(page, value) {
  await page.goto(`${origin.origin}/__hdrl_reporting_fixture__`); await storage(page, "put", value);
  await page.goto(`${origin.origin}/self-assessment/`); await ready(page); await settled(page);
}
const table = (page, label) => page.locator(`[aria-label="${label}"]`).first();
const row = (page, label, ref) => table(page, label).locator("tbody tr").filter({ has: page.locator("th", { hasText: new RegExp(`^${ref.replaceAll(".", "\\.")} ·`) }) });
const cells = (page, label, ref) => row(page, label, ref).locator("td").allTextContents();
async function compare(page) { await page.locator('[data-action="comparison"]').first().click(); await page.getByRole("heading", { name: "Compare your responses", exact: true }).waitFor(); await settled(page); }
async function toReport(page) { await page.locator('[data-action="report"]').first().click(); await page.locator("#hdrl-generated-report").waitFor(); await settled(page); }
const verdictShape = (d) => ({ snapshot: d.snapshot, indicators: d.indicators, versions: d.versions, provenance: d.provenance });
function expectedCoverage(responses, domain) {
  const result = { rated: 0, not_known: 0, not_assessed: 0, unstarted: 0, not_applicable: 0, incomplete: 0 };
  for (const item of members(domain)) { const r = responses[item.ref] || {}, status = r.status || "unstarted";
    if (level(r)) result.rated++; else if (status in result && status !== "rated") result[status]++; else result.incomplete++;
  }
  return result;
}
async function checkCoverage(page, d, check) {
  check("eight coverage domain rows", await table(page, "Assessment coverage by domain").locator("tbody tr").count(), 8);
  for (const domain of catalogue.domains) {
    const actual = await cells(page, "Assessment coverage by domain", domain.ref);
    for (const [index, stage] of ["snapshot", "indicators"].entries()) {
      const c = expectedCoverage(d[stage], domain.ref), text = normal(actual[index]);
      check(`${domain.ref}/${stage} full Core denominator`, text.includes(`${c.rated}/${members(domain.ref).length} Core levels selected`));
      for (const [key, label] of Object.entries({ not_known: "not known", not_assessed: "not assessed", unstarted: "not started", not_applicable: "N/A" }))
        check(`${domain.ref}/${stage} ${label} separate`, text.includes(`${c[key]} ${label}`));
      if (c.incomplete) check(`${domain.ref}/${stage} incomplete separate`, text.includes(`${c.incomplete} incomplete`));
    }
  }
}
async function download(page, action, destination) {
  const [file] = await Promise.all([page.waitForEvent("download"), page.locator(`[data-action="${action}"]`).first().click()]);
  await file.saveAs(destination); assert.equal(await file.failure(), null); const bytes = await readFile(destination);
  return { path: destination, sha256: sha(bytes), bytes, value: destination.endsWith(".json") ? JSON.parse(bytes) : null };
}
function parseCsv(text) {
  const rows = []; let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) { const ch = text[i];
    if (ch === '"') { if (quoted && text[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted; }
    else if (ch === "," && !quoted) { row.push(cell); cell = ""; }
    else if (ch === "\n" && !quoted) { row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += ch;
  }
  assert.equal(quoted, false); if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.slice(1).map((r) => { assert.equal(r.length, rows[0].length); return Object.fromEntries(rows[0].map((key, i) => [key, r[i]])); });
}
async function findings(page) {
  const result = {};
  for (const heading of ["Findings supported by referenced evidence status", "Provisional interpretations", "Suggested questions to investigate", "Potential improvement actions"]) {
    const section = page.locator("#hdrl-generated-report section").filter({ has: page.getByRole("heading", { name: new RegExp(`^${heading}(?: \\(\\d+\\))?$`) }) });
    result[heading] = await section.innerText();
  }
  return result;
}
const tests = {
  async "fenland-report-comparison"({ page, check, observations }) {
    const d = draft(); await load(page, d);
    check("overview exists near report start", await page.locator("#hdrl-report-overview").count(), 1);
    check("exact five foundational catalogue rows", await table(page, "Foundational indicators").locator("tbody th").allTextContents(), foundational.map((ref) => `${ref} · ${catalogue.indicators.find((i) => i.ref === ref).name}`));
    for (const ref of foundational) { const c = await cells(page, "Foundational indicators", ref);
      check(`${ref} proposed reference remains L3`, c[0], "L3"); check(`${ref} actual snapshot selection`, c[1], d.snapshot[ref].level); check(`${ref} actual evidence selection`, c[2].startsWith(d.indicators[ref].level));
    }
    check("foundational precedes detailed snapshot", await page.evaluate(() => !!(document.getElementById("hdrl-report-overview").compareDocumentPosition(document.querySelector('[aria-label="Snapshot selections by indicator"]')) & Node.DOCUMENT_POSITION_FOLLOWING)));
    const targets = await page.locator('#hdrl-report-overview a[href^="#"]').evaluateAll((links) => links.map((a) => ({ href: a.getAttribute("href"), exists: !!document.getElementById(a.hash.slice(1)) })));
    check("overview links resolve to report detail", targets.length >= 3 && targets.every((a) => a.exists)); observations.anchors = targets;
    await checkCoverage(page, d, check); await compare(page);
    check("comparison domain row count", await table(page, "Comparison by domain").locator("tbody tr").count(), 8);
    check("comparison indicator row count", await table(page, "Comparison by indicator").locator("tbody tr").count(), 64);
    for (const domain of catalogue.domains) { const c = await cells(page, "Comparison by domain", domain.ref);
      check(`${domain.ref} snapshot ordinal median`, c[1].includes(med(d.snapshot, domain.ref))); check(`${domain.ref} evidence ordinal median`, c[2].includes(med(d.indicators, domain.ref)));
    }
    check("no numeric-delta column", !/delta|score gap|improvement|gain/i.test((await table(page, "Comparison by domain").locator("thead").innerText())));
    check("comparison is explicitly not a time series", /not a time series/i.test(await page.locator("#hdrl-assessment-root").innerText()));
    await page.waitForTimeout(700); check("read-only comparison preserves ratings and original identity", verdictShape(await storage(page, "get")), verdictShape(d));
  },
  async "foundational-low-h"({ page, check, dir }) {
    const d = draft(); for (const i of members("H")) for (const stage of ["snapshot", "indicators"]) d[stage][i.ref].level = i.ref === "H.3.1" ? "L1" : "L3";
    await load(page, d); const h = await cells(page, "Comparison by domain", "H"), found = await cells(page, "Foundational indicators", "H.3.1");
    check("H snapshot median remains L3", h[1].includes("L3") && h[1].includes("6/6"));
    check("H evidence median remains L3", h[2].includes("L3") && h[2].includes("6/6"));
    check("H3.1 snapshot L1 remains prominent", found[1], "L1"); check("H3.1 evidence L1 remains prominent", found[2].startsWith("L1"));
    check("reference is proposed not an aggregate verdict", /proposed L3 reference/.test(await page.locator("#hdrl-report-overview").innerText()));
    await row(page, "Foundational indicators", "H.3.1").scrollIntoViewIfNeeded(); await page.screenshot({ path: path.join(dir, "h31-l1-with-h-median-l3.png") });
    check("no invented automatic pass/fail cell", !/pass|fail|adequate|eligible/i.test(await table(page, "Foundational indicators").innerText()));
  },
  async "snapshot-only"({ page, check }) {
    const d = draft(); d.indicators = {}; d.rapid = {}; await load(page, d);
    check("honest absent evidence stage", /evidence-led pass was not undertaken/i.test(await page.locator("#hdrl-report-overview").innerText()));
    check("absence does not indicate absent capability", /do not indicate absent capability/i.test(await page.locator("#hdrl-report-overview").innerText()));
    check("no evidence-led findings created", await page.locator("#hdrl-report-actions").count(), 0);
    await checkCoverage(page, d, check);
    for (const ref of foundational) { const c = await cells(page, "Foundational indicators", ref); check(`${ref} empty evidence unstarted`, /Not started/i.test(c[2])); check(`${ref} no references inferred`, c[3].startsWith("0 references:")); }
    await compare(page); check("all64 still visible without evidence stage", await table(page, "Comparison by indicator").locator("tbody tr").count(), 64);
    for (const domain of catalogue.domains) { const c = await cells(page, "Comparison by domain", domain.ref); check(`${domain.ref} no orientation band imputed`, /Not recorded/.test(c[0])); check(`${domain.ref} no evidence median imputed`, !/L[1-5]/.test(c[2])); }
  },
  async "sparse-missingness"({ page, check }) {
    const d = draft(); d.snapshot = {}; d.indicators = {}; d.rapid = {};
    const refs = members("A").map((i) => i.ref);
    [response("snapshot", "rated", "L2"), response("snapshot", "rated", "L4"), response("snapshot", "not_known"), response("snapshot", "not_assessed"), response("snapshot", "not_applicable")].forEach((r, i) => { d.snapshot[refs[i]] = r; });
    [response("evidence", "rated", "L3"), response("evidence", "not_known"), response("evidence", "not_assessed"), response("evidence", "not_applicable"), response("evidence", "not_applicable"), response("evidence", "rated")].forEach((r, i) => { d.indicators[refs[i]] = r; });
    for (const i of members("B")) { d.snapshot[i.ref] = response("snapshot", "not_applicable"); d.indicators[i.ref] = response("evidence", "not_applicable"); }
    for (const i of catalogue.indicators.filter((i) => i.domain === "A" && !members("A").some((m) => m.ref === i.ref))) { d.snapshot[i.ref] = response("snapshot", "rated", "L5"); d.indicators[i.ref] = response("evidence", "rated", "L5"); }
    await load(page, d); await checkCoverage(page, d, check);
    const a = await cells(page, "Comparison by domain", "A"); check("even selected ordinal median remains L2–L4", a[1].includes("L2–L4")); check("single evidence judgement remains visible", a[2].includes("L3") && a[2].includes("1/7"));
    const b = await cells(page, "Assessment coverage by domain", "B"); check("all-N/A snapshot keeps full denominator", b[0].includes("0/4") && b[0].includes("4 N/A")); check("all-N/A evidence keeps full denominator", b[1].includes("0/4") && b[1].includes("4 N/A"));
    await compare(page); const incomplete = await cells(page, "Comparison by indicator", refs[5]); check("unfinished rated evidence honest missing level", incomplete[1].includes("Level not recorded"));
    check("N/A without reason remains N/A, not silently scored", (await cells(page, "Comparison by indicator", refs[4]))[1].includes("Not applicable"));
  },
  async "reference-status-and-ordinal-comparison"({ page, check }) {
    const d = draft(), base = d.indicators["C.1.1"].evidence[0];
    d.indicators["C.1.1"].evidence = ["reviewed", "accepted", "unreviewed", "needs_update"].map((reviewStatus, i) => ({ ...clone(base), id: `SYNTHETIC-review-${i}`, reviewStatus }));
    d.indicators["H.3.1"] = { ...response("evidence", "not_known"), statusReason: "Synthetic: inherited claim awaits local scope check.", evidence: [{ ...clone(base), id: "SYNTHETIC-unknown-reviewed", reviewStatus: "reviewed" }] };
    d.snapshot["C.1.1"].level = "L1"; d.snapshot["C.1.1"].certainty = "high";
    d.rapid.C = { impression: "defined", certainty: "medium", note: "Synthetic orientation only" };
    await load(page, d); const c = await cells(page, "Foundational indicators", "C.1.1"), h = await cells(page, "Foundational indicators", "H.3.1");
    check("four references separated by recorded review status", c[3], "4 references: 1 reviewed by assessor; 1 accepted in calibration; 1 unreviewed; 1 need update.");
    check("reviewed reference never supplies missing judgement", h[2].startsWith("Not known") && !/L[1-5]/.test(h[2])); check("unknown indicator retains its reviewed reference count", h[3].includes("1 reviewed by assessor"));
    const before = await findings(page); await compare(page);
    check("orientation band stays textual", (await cells(page, "Comparison by domain", "C"))[0].startsWith("Defined"));
    const cr = await cells(page, "Comparison by indicator", "C.1.1"); check("different selection displayed without numeric conversion", cr[0].startsWith("L1") && cr[1].startsWith(d.indicators["C.1.1"].level));
    check("each cell includes its own certainty", /High certainty/.test(cr[0]) && /certainty/i.test(cr[1]));
    d.snapshot["C.1.1"].level = "L5"; d.snapshot["C.1.1"].certainty = "medium"; await load(page, d);
    check("snapshot-only level/certainty changes create no evidence-gap finding", await findings(page), before);
  },
  async "exports-history-and-safe-text"({ page, check, dir, observations }) {
    const d = draft(); const dangerous = ['=SUM(1,2)', '+SUM(1,2)', '-SUM(1,2)', '@SUM(1,2)', '\t=SUM(1,2)', '\r=SUM(1,2)'];
    for (let i = 0; i < dangerous.length; i++) d.indicators[catalogue.indicators[i].ref].rationale = dangerous[i];
    const inert = '<img src="x" onerror="globalThis.reportingInjected=true"> literal synthetic <text> & notes';
    d.domainNotes.H = `${inert}\nLocal delivery; inherited host evidence dated 2026-10-30; shared responsibility; local scope remains unverified.`;
    d.audit = Array.from({ length: 300 }, (_, i) => ({ id: `SYNTHETIC-event-${i}`, type: "synthetic_preparation", ref: "H", reason: "Invented event only", at: "2026-10-30T00:00:00.000Z" }));
    await load(page, d); check("CSV is explicitly a summary", await page.locator('[data-action="export-csv"]').innerText(), "Download evidence summary CSV");
    const help = await page.locator(".hdrl-export-help").innerText(); check("export explanation names omitted reference detail", /review status.*locator.*note.*limitations/.test(help)); check("history limit and inability to reconstruct are explicit", /250/.test(help) && /not a complete change history/.test(help) && /Restore starts a new event list/.test(help));
    check("HTML remains literal in report", (await page.locator("#hdrl-report-context").innerText()).includes(inert)); check("HTML created no injected image or execution", await page.evaluate(() => !globalThis.reportingInjected && !document.querySelector('#hdrl-generated-report img[src="x"]')));
    // A real UI save trims the invented over-limit event fixture using existing retention.
    await page.locator('[data-action="domain-notes"]').click(); await settled(page); await page.locator('#hdrl-domain-notes-form button[type="submit"]').click(); await page.waitForTimeout(700);
    await page.locator('[data-action="review"]').first().click(); await page.locator('[data-action="gate"]').first().click(); await page.locator("#hdrl-generated-report").waitFor();
    const json = await download(page, "export-json", path.join(dir, "full-backup.json"));
    const csv = await download(page, "export-csv", path.join(dir, "evidence-summary.csv"));
    const rows = parseCsv(csv.bytes.toString()); check("CSV all64 data rows", rows.length, 64);
    for (let i = 0; i < dangerous.length; i++) check(`spreadsheet prefix ${JSON.stringify(dangerous[i][0])} escaped`, rows[i].rationale, `'${dangerous[i]}`);
    check("CSV omits complete reference records", !Object.keys(rows[0]).some((key) => /review_status|reference_locator|evidence_owner|evidence_note|evidence_limitations/.test(key)));
    check("full JSON retains complete references", json.value.assessment.evidence_led_responses, d.indicators); check("full JSON retains narrative exactly", json.value.assessment.domain_capacity_notes, d.domainNotes);
    check("full JSON preserves original versions", json.value.versions, d.versions); check("full JSON preserves original provenance", json.value.provenance, d.provenance);
    check("current generator stays distinct", json.value.generated_by.implementation_candidate, "2026-10-31.2"); check("source implementation retains2026-10-28.2", json.value.provenance.implementation_candidate, "2026-10-28.2");
    check("recent event list bounded after real save", json.value.assessment.audit.length, 250); check("oldest invented events dropped", !json.value.assessment.audit.some((a) => a.id === "SYNTHETIC-event-0"));
    check("CSV retains source provenance", rows[0].implementation_candidate, "2026-10-28.2"); observations.downloads = [json, csv].map(({ path, sha256, bytes }) => ({ path, sha256, bytes: bytes.length }));
  },
  async "narrative-correction-keyboard-mobile"({ page, check, dir, observations }) {
    await page.setViewportSize({ width: 320, height: 900 }); const d = draft(); await load(page, d);
    await page.locator('[data-action="comparison"]').first().focus(); await page.keyboard.press("Enter"); await page.getByRole("heading", { name: "Compare your responses", exact: true }).waitFor(); await settled(page);
    check("comparison heading receives focus", await page.evaluate(() => document.activeElement.id), "hdrl-view-title");
    const snapshotLink = row(page, "Comparison by indicator", "A.1.1").locator('[data-action="open-snapshot"]'); await snapshotLink.focus(); await page.keyboard.press("Enter"); await settled(page);
    check("comparison keyboard edit opens correct response", /^A\.1\.1 ·/.test(await page.locator("#hdrl-view-title").innerText()));
    const note = ("SYNTHETIC shared and inherited context: local configuration remains our responsibility; source/date/scope and limitations need review. " + "Long literal context <text> & detail. ".repeat(20)).trim();
    await load(page, d); await page.locator('[data-action="domain-notes"]').focus(); await page.keyboard.press("Enter"); await settled(page);
    check("context correction opens editable notes and focusesA", await page.evaluate(() => document.querySelector('.hdrl-domain-notes').open && document.activeElement.id === 'domain-capacity-A'));
    await page.locator("#domain-capacity-H").fill(note); await page.locator('#hdrl-domain-notes-form button[type="submit"]').click(); await page.waitForTimeout(700);
    const saved = await storage(page, "get"); check("corrected narrative saved", saved.domainNotes.H, note); check("narrative does not change ratings/provenance", verdictShape(saved), verdictShape(d));
    await page.reload(); await ready(page); await page.locator('[data-action="review"]').first().click(); await page.locator('[data-action="gate"]').first().click(); await page.locator("#hdrl-generated-report").waitFor();
    check("corrected narrative survives reload/report", (await page.locator("#hdrl-report-context").innerText()).includes(note));
    const json = await download(page, "export-json", path.join(dir, "corrected-context.json")); check("corrected narrative retained fullJSON", json.value.assessment.domain_capacity_notes.H, note); observations.download = { path: json.path, sha256: json.sha256 };
    const reportWidth = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth })); check("report fits320px", reportWidth.scroll <= reportWidth.width + 1);
    await page.screenshot({ path: path.join(dir, "report-mobile.png") }); await compare(page);
    const comparisonWidth = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth })); check("comparison fits320px", comparisonWidth.scroll <= comparisonWidth.width + 1);
    await table(page, "Comparison by indicator").focus(); check("wide comparison is keyboard-focusable", await table(page, "Comparison by indicator").evaluate((node) => node === document.activeElement));
    await page.screenshot({ path: path.join(dir, "comparison-mobile.png") }); observations.viewports = { reportWidth, comparisonWidth }; observations.long_note_characters = note.length;
  },
  async "print-all-63-actions"({ page, engine, check, dir, observations }) {
    const d = draft(); d.indicators["E.3.1"].improvementNote = "SYNTHETIC extra unknown-status action retained for reporting print.";
    const actions = Object.entries(d.indicators).filter(([, r]) => r.improvementNote.trim()); assert.equal(actions.length, 63);
    await load(page, d); check("all63 actions present on screen", await page.locator('#hdrl-report-actions .hdrl-finding-list li').count(), 63);
    await page.emulateMedia({ media: "print" }); await settled(page);
    check("five foundational rows remain printed", await table(page, "Foundational indicators").locator("tbody tr").evaluateAll((rows) => rows.filter((r) => !!r.getClientRects().length && getComputedStyle(r).display !== "none").length), 5);
    check("all63 actions visible in print", await page.locator('#hdrl-report-actions .hdrl-finding-list li').evaluateAll((rows) => rows.filter((r) => !!r.getClientRects().length && getComputedStyle(r).display !== "none").length), 63);
    const actionText = normal(await page.locator("#hdrl-report-actions").innerText());
    check("all exact action text retained", actions.filter(([, r]) => !actionText.includes(normal(r.improvementNote))).map(([ref]) => ref), []);
    await page.screenshot({ path: path.join(dir, "print-overview.png") }); await page.locator('#hdrl-report-actions [data-ref="H.4.2"]').scrollIntoViewIfNeeded(); await page.screenshot({ path: path.join(dir, "print-late-actions.png") });
    if (engine === "chromium") {
      const pdf = path.join(dir, "actual-report.pdf"), textFile = path.join(dir, "actual-report.txt");
      await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
      await promisify(execFile)(process.env.HDRL_PDFTOTEXT || "pdftotext", ["-layout", pdf, textFile]);
      const text = await readFile(textFile, "utf8"), normalized = normal(text);
      check("PDF containsall63 exact actions", actions.filter(([, r]) => !normalized.includes(normal(r.improvementNote))).map(([ref]) => ref), []);
      check("PDF keeps proposed reference and five foundational rows", normalized.includes("proposed L3 reference") && foundational.every((ref) => normalized.includes(ref)));
      check("PDF keeps coverage and context", normalized.includes("Coverage and reference review") && normalized.includes("Your operating context and constraints"));
      const pages = text.split("\f"); if (!pages.at(-1).trim()) pages.pop();
      const numbers = [...new Set([1, Math.max(1, pages.findIndex((p) => p.includes("Foundational indicators")) + 1), Math.max(1, pages.findIndex((p) => normal(p).includes(normal(actions.at(-1)[1].improvementNote))) + 1)])];
      const rendered = [];
      for (const pageNo of numbers) { const prefix = path.join(dir, `pdf-page-${pageNo}`); await promisify(execFile)(process.env.HDRL_PDFTOPPM || "pdftoppm", ["-f", String(pageNo), "-l", String(pageNo), "-singlefile", "-scale-to", "1400", "-png", pdf, prefix]); rendered.push(prefix + ".png"); }
      observations.pdf = { path: pdf, sha256: sha(await readFile(pdf)), text_path: textFile, pages: pages.length, rendered_pages: rendered, scope: "Actual Chromium PDF/text checks; rendered PNGs retained for separate visual inspection." };
    } else observations.pdf = { produced: false, reason: "Chromium-only PDF API; this engine has print-media DOM and screenshots." };
    await page.waitForTimeout(700); check("printing preserves all source answers/provenance", verdictShape(await storage(page, "get")), verdictShape(d));
  },
  async "snapshot-context-and-guidance"({ page, check, dir, observations }) {
    const d = draft();
    const refs = ["C.1.1", "A.3.1", "H.4.2", "D.1.1"];
    observations.indicators = []; observations.reflow = [];
    for (const ref of refs) {
      const indicator = catalogue.indicators.find((item) => item.ref === ref);
      d.view = "snapshot"; d.activeIndicator = ref; await load(page, d);
      const context = normal(await page.locator("#hdrl-snapshot-context").innerText());
      check(`${ref} canonical type visible`, context.includes(indicator.type));
      check(`${ref} canonical unit visible`, context.includes(`Unit: ${catalogue.vocabularies.units[indicator.unit]}`));
      if (indicator.unit === "B") check(`${ref} Both unit explained`, context.includes("System / Service"));
      check(`${ref} context explains local shared inherited scope`, /Local, shared or inherited/.test(context) && /no response is inherited automatically/.test(context));
      if (indicator.foundational) check(`${ref} proposed foundational reference bounded`, /Proposed foundational indicator · L3 reference/.test(context) && /not a pass\/fail, legal-compliance or participation decision/.test(context));
      else check(`${ref} no invented foundational marker`, !context.includes("Proposed foundational indicator"));
      const expectedClass = indicator.applicability_class === "B0" ? /general baseline/ : indicator.applicability_class === "O" ? /Optional or Enhancement/ : indicator.applicability_class === "Y" ? /Outcome or Context.*excluded from domain medians/ : /does not decide applicability/;
      check(`${ref} classification is a bounded context prompt`, expectedClass.test(context));
      for (const level of ["L1", "L2", "L3", "L4", "L5"])
        check(`${ref}/${level} canonical description unchanged`, await page.locator(`label[for="snapshot-level-${level}"] > span`).nth(1).innerText(), indicator.maturity_levels[level]);
      const guidance = page.locator("#hdrl-snapshot-evidence-guidance");
      check(`${ref} evidence guidance initially collapsed`, await guidance.evaluate((el) => el.open), false);
      await guidance.locator("summary").click();
      check(`${ref} opening guidance keeps selected level`, await page.locator('input[name="snapshot-level"]:checked').inputValue(), d.snapshot[ref].level);
      for (const level of ["L1", "L2", "L3", "L4", "L5"]) {
        await page.locator(`#snapshot-level-${level}`).check();
        check(`${ref}/${level} guidance heading follows selection`, (await page.locator("#hdrl-snapshot-evidence-text strong").innerText()).startsWith(level + " · "));
        check(`${ref}/${level} exact minimum evidence list`, await page.locator("#hdrl-snapshot-evidence-text li").allTextContents(), indicator.minimum_evidence[level] || []);
        if (!indicator.minimum_evidence[level]) check(`${ref}/${level} missing list is explicit`, (await page.locator("#hdrl-snapshot-evidence-text").innerText()).includes(`does not publish a separate minimum-evidence list for ${level}`));
        check(`${ref}/${level} reading guidance is not review`, /does not establish that evidence has been checked/.test(await page.locator("#hdrl-snapshot-evidence-text").innerText()));
      }
      await page.locator('input[name="snapshot-status"][value="not_applicable"]').check();
      check(`${ref} N/A clears selected level without inventing guidance`, await page.locator('input[name="snapshot-level"]:checked').count(), 0);
      check(`${ref} no-level guidance asks for selection`, /Select a level/.test(await page.locator("#hdrl-snapshot-evidence-text").innerText()));
      await page.waitForTimeout(700);
      check(`${ref} reading/changing pending guidance does not save answers or evidence`, verdictShape(await storage(page, "get")), verdictShape(d));
      await page.setViewportSize({ width: 320, height: 900 }); await settled(page);
      const width = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
      check(`${ref} context and expanded guidance fit320px`, width.scroll <= width.width + 1);
      await page.locator("#hdrl-snapshot-context").scrollIntoViewIfNeeded(); await page.screenshot({ path: path.join(dir, `${ref}-context-mobile.png`) });
      await guidance.scrollIntoViewIfNeeded(); await page.screenshot({ path: path.join(dir, `${ref}-guidance-mobile.png`) });
      observations.indicators.push({ ref, context, width });
      if (ref === "H.4.2") {
        // CSS viewport equivalents exercise reflow, not native browser zoom.
        // A 1280×900 reference viewport divided by2/4 represents200%/400% space.
        for (const size of [{ name: "short-desktop", width: 1280, height: 600, equivalent_zoom: null }, { name: "reflow-200", width: 640, height: 450, equivalent_zoom: "200%" }, { name: "reflow-400", width: 320, height: 225, equivalent_zoom: "400%" }]) {
          await page.setViewportSize({ width: size.width, height: size.height });
          await page.locator("#snapshot-level-L5").focus(); await page.keyboard.press("Space"); await page.locator("#snapshot-level-L5").scrollIntoViewIfNeeded(); await settled(page);
          const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, focused: document.activeElement.id }));
          check(`${size.name} long canonical form has no horizontal page overflow`, dimensions.scroll <= dimensions.width + 1);
          check(`${size.name} native focus remains on selected radio`, dimensions.focused, "snapshot-level-L5");
          const screenshot = path.join(dir, `${size.name}-long-canonical-native-focus.png`);
          await page.screenshot({ path: screenshot });
          observations.reflow.push({ ...size, ...dimensions, screenshot, technique: size.equivalent_zoom ? "Viewport equivalent only: reference1280x900 divided by scale; no native browser zoom performed" : "Actual short desktop viewport" });
        }
      }
      await page.locator('button[data-action="snapshot-dashboard"]').last().click(); await settled(page); await page.waitForTimeout(700);
      check(`${ref} return without saving discards provisional changes`, verdictShape(await storage(page, "get")), verdictShape(d));
      await page.setViewportSize({ width: 1280, height: 900 });
    }
  },
  async "snapshot-keyboard-pause-and-domain-navigation"({ page, engine, check, dir, observations }) {
    await page.setViewportSize({ width: 320, height: 900 });
    const d = draft(); d.snapshot = {}; d.view = "snapshot-dashboard"; d.activeIndicator = "A.1.1";
    await load(page, d);
    await page.locator('.md-button--primary[data-action="open-snapshot"]').focus(); await page.keyboard.press("Enter"); await settled(page);
    check("snapshot entry focuses heading", await page.evaluate(() => document.activeElement.id), "hdrl-view-title");
    await page.waitForTimeout(700); const beforeEdit = await storage(page, "get");
    check("hints describe native controls and no numeric shortcuts", /Tab.*arrow|arrow.*Tab/i.test(await page.locator("#hdrl-snapshot-form").innerText()) && !/Use keys 1|Use H, M or L/.test(await page.locator("#hdrl-snapshot-form").innerText()));
    await page.keyboard.press("1"); await page.keyboard.press("h");
    check("heading number/letter key does not silently change answer", await page.locator('input[name="snapshot-level"]:checked').count(), 0);
    // Match the existing print/boundary harness: WebKit uses Option+Tab for all native controls.
    observations.native_tab_key = engine === "webkit" ? "Alt+Tab" : "Tab";
    await page.keyboard.press(observations.native_tab_key); check("Native Tab traversal from heading reaches first level radio", await page.evaluate(() => document.activeElement.id), "snapshot-level-L1");
    await page.keyboard.press("Space"); await page.keyboard.press("ArrowRight");
    check("native Space and arrow select L2", await page.locator('input[name="snapshot-level"]:checked').inputValue(), "L2");
    await page.keyboard.press("5"); await page.keyboard.press("h");
    check("radio numeric key does not trigger old custom shortcut", await page.locator('input[name="snapshot-level"]:checked').inputValue(), "L2");
    check("radio letter key does not trigger certainty shortcut", await page.locator('input[name="snapshot-certainty"]:checked').count(), 0);
    await page.locator(".hdrl-snapshot-note summary").click();
    const rawNote = "  SYNTHETIC keyboard text 12345 H M L: local and inherited scope.  ";
    await page.locator("#snapshot-note").fill(""); await page.locator("#snapshot-note").pressSequentially(rawNote);
    check("editable note receives all letters and numbers", await page.locator("#snapshot-note").inputValue(), rawNote);
    check("typing note leaves selected level unchanged", await page.locator('input[name="snapshot-level"]:checked').inputValue(), "L2");
    await page.locator('[name="journey-action"][value="pause"]').click();
    await page.locator("#hdrl-snapshot-errors").waitFor();
    check("invalid pause focuses error summary", await page.evaluate(() => document.activeElement.id), "hdrl-snapshot-errors");
    check("invalid pause preserves pending level", await page.locator('input[name="snapshot-level"]:checked').inputValue(), "L2");
    check("invalid pause preserves raw pending note", await page.locator("#snapshot-note").inputValue(), rawNote);
    const invalid = await storage(page, "get");
    check("invalid pause does not commit any snapshot answer or note", invalid.snapshot, beforeEdit.snapshot);
    await page.locator('#hdrl-snapshot-errors a[href="#hdrl-snapshot-certainty-panel"]').click();
    check("error link focuses first certainty radio", await page.evaluate(() => document.activeElement.id), "snapshot-certainty-high");
    await page.keyboard.press("Space"); await page.keyboard.press("ArrowRight");
    check("native certainty arrow selects medium", await page.locator('input[name="snapshot-certainty"]:checked').inputValue(), "medium");
    await page.screenshot({ path: path.join(dir, "keyboard-recovered-mobile.png") });
    await page.locator('[name="journey-action"][value="pause"]').focus(); await page.keyboard.press("Enter");
    await page.getByRole("heading", { name: "Whole-framework snapshot", exact: true }).waitFor(); await settled(page);
    check("pause announces successful local save", /Saved on this device/.test(await page.locator("#hdrl-assessment-root").innerText()));
    const paused = await storage(page, "get");
    check("pause saves trimmed note and native selections", { level: paused.snapshot["A.1.1"].level, certainty: paused.snapshot["A.1.1"].certainty, note: paused.snapshot["A.1.1"].note }, { level: "L2", certainty: "medium", note: rawNote.trim() });
    check("pause preserves evidence and original identity", { indicators: paused.indicators, versions: paused.versions, provenance: paused.provenance }, { indicators: d.indicators, versions: d.versions, provenance: d.provenance });
    await page.reload(); await ready(page); await settled(page);
    check("reload resumes snapshot overview", await page.locator("#hdrl-view-title").innerText(), "Whole-framework snapshot");
    check("reload retains paused answer", (await storage(page, "get")).snapshot["A.1.1"], paused.snapshot["A.1.1"]);
    check("partial dashboard offers next unfinished indicator", await page.locator('.md-button--primary[data-action="open-snapshot"]').getAttribute("data-ref"), "A.1.2");
    await page.screenshot({ path: path.join(dir, "paused-overview-mobile.png") });
    // A second invented state reaches the domain boundary without 64 repetitive saves.
    const edge = draft(); edge.snapshot = {}; edge.view = "snapshot"; edge.activeIndicator = "A.4.2";
    for (const i of catalogue.indicators.filter((item) => item.domain === "A" && item.ref !== edge.activeIndicator)) edge.snapshot[i.ref] = response("snapshot", "rated", "L3");
    await load(page, edge); await page.locator('input[name="snapshot-status"][value="not_known"]').check();
    check("domain boundary next action is explicit", await page.locator('[name="journey-action"][value="next"]').innerText(), "Save and continue in domain B");
    await page.locator('[name="journey-action"][value="pause"]').click();
    await page.getByRole("heading", { name: "Whole-framework snapshot", exact: true }).waitFor();
    check("domain-end pause returns overview without compulsory checkpoint", await page.locator("#hdrl-view-title").innerText(), "Whole-framework snapshot");
    const firstDomain = page.locator(".hdrl-snapshot-domains article").first();
    check("domain-end pause marks actual A progress", (await firstDomain.innerText()).includes(`${catalogue.indicators.filter((i) => i.domain === "A").length}/${catalogue.indicators.filter((i) => i.domain === "A").length} indicators`));
    await firstDomain.locator("details summary").click(); await firstDomain.locator('[data-action="open-snapshot"][data-ref="A.4.2"]').click(); await settled(page);
    await page.locator('[name="journey-action"][value="next"]').click(); await page.getByRole("heading", { name: /^B\.1\.1 ·/ }).waitFor(); await settled(page);
    check("domain continuation opens B1.1 directly", /^B\.1\.1 ·/.test(await page.locator("#hdrl-view-title").innerText()));
    check("domain continuation focuses next heading", await page.evaluate(() => document.activeElement.id), "hdrl-view-title");
    check("unknown status remains unscored after navigation", { status: (await storage(page, "get")).snapshot["A.4.2"].status, level: (await storage(page, "get")).snapshot["A.4.2"].level }, { status: "not_known", level: "" });
    const width = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    check("snapshot keyboard journey fits320px", width.scroll <= width.width + 1); observations.width = width;
    await page.screenshot({ path: path.join(dir, "next-domain-mobile.png") });
  },
  async "snapshot-pause-failed-save-no-autosave"({ page, check, dir, observations }) {
    const d = draft(); d.view = "snapshot"; d.activeIndicator = "A.1.1";
    d.snapshot["A.1.1"] = { ...response("snapshot", "rated", "L1"), certainty: "high", note: "SYNTHETIC previously saved note." };
    await load(page, d); const before = await storage(page, "get");
    await page.locator("#snapshot-level-L2").check(); await page.locator('input[name="snapshot-certainty"][value="medium"]').check();
    await page.locator("#snapshot-note").fill("SYNTHETIC attempted note must remain unsaved.");
    // Independently retained JRN-S1 probe established the failure sequence. Keep
    // real IndexedDB transactions: delay first open delivery, then abort its put.
    await page.evaluate(() => {
      const originalOpen = indexedDB.open.bind(indexedDB), originalPut = IDBObjectStore.prototype.put;
      globalThis.syntheticPauseFault = { opens: 0, puts: 0, aborts: 0, delay_ms: 850 };
      globalThis.restorePauseFault = () => { indexedDB.open = originalOpen; IDBObjectStore.prototype.put = originalPut; };
      indexedDB.open = function (...args) {
        const request = originalOpen(...args);
        if (!globalThis.syntheticPauseFault.opens++) {
          let assigned;
          Object.defineProperty(request, "onsuccess", { configurable: true, get: () => assigned, set(fn) {
            assigned = fn; request.addEventListener("success", (event) => setTimeout(() => fn.call(request, event), 850), { once: true });
          } });
        }
        return request;
      };
      IDBObjectStore.prototype.put = function (...args) {
        const request = originalPut.apply(this, args);
        if (this.name === "drafts") {
          globalThis.syntheticPauseFault.puts++;
          if (!globalThis.syntheticPauseFault.aborts) { globalThis.syntheticPauseFault.aborts++; this.transaction.abort(); }
        }
        return request;
      };
    });
    await page.locator('[name="journey-action"][value="pause"]').click(); await page.waitForTimeout(75);
    check("pause waits with form inert while IDB open delayed", await page.locator("#hdrl-assessment-root").evaluate((el) => el.inert));
    await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
    await page.locator("#hdrl-snapshot-save-error").waitFor(); await page.waitForTimeout(650);
    const fault = await page.evaluate(() => ({ ...globalThis.syntheticPauseFault })), after = await storage(page, "get");
    check("real transaction abort was exercised", fault.aborts, 1);
    check("visibility event did not enqueue second put after failed pause", fault.puts, 1);
    check("failed pause leaves complete saved record unchanged", after, before);
    check("failed pause keeps attempted note in visible form", await page.locator("#snapshot-note").inputValue(), "SYNTHETIC attempted note must remain unsaved.");
    check("failed pause keeps attempted level", await page.locator('input[name="snapshot-level"]:checked').inputValue(), "L2");
    check("failed pause keeps attempted certainty", await page.locator('input[name="snapshot-certainty"]:checked').inputValue(), "medium");
    check("failed pause focuses error", await page.evaluate(() => document.activeElement.id), "hdrl-snapshot-save-error");
    check("failed pause never claims success", await page.locator('[role="status"].hdrl-success-panel').count(), 0);
    await writeFile(path.join(dir, "failed-pause.html"), await page.content()); await page.screenshot({ path: path.join(dir, "failed-pause-retains-form.png") });
    await page.evaluate(() => globalThis.restorePauseFault());
    await page.locator('button[data-action="snapshot-dashboard"]').last().click();
    await page.getByRole("heading", { name: "Whole-framework snapshot", exact: true }).waitFor(); await page.waitForTimeout(700);
    const discarded = await storage(page, "get");
    check("explicit return discards attempted snapshot values", discarded.snapshot, before.snapshot);
    check("discard preserves evidence and source provenance", { indicators: discarded.indicators, provenance: discarded.provenance, versions: discarded.versions }, { indicators: before.indicators, provenance: before.provenance, versions: before.versions });
    await page.reload(); await ready(page);
    check("reload after discard still has old note", (await storage(page, "get")).snapshot["A.1.1"].note, before.snapshot["A.1.1"].note);
    observations.fault = { ...fault, visibility_event_during_commit: true, saved_record_unchanged_after_failure: JSON.stringify(after) === JSON.stringify(before), source: "Retained independent JRN-S1 fault sequence, using real disposable IndexedDB" };
  },
  async "orientation-and-completed-snapshot-resume"({ page, check, dir, observations }) {
    const orientation = draft(); orientation.snapshot = {}; orientation.indicators = {}; orientation.view = "rapid-summary";
    for (const domain of catalogue.domains) orientation.rapid[domain.ref] = { impression: "defined", certainty: "medium", note: "SYNTHETIC orientation only." };
    await load(page, orientation);
    const intro = await page.locator("#hdrl-assessment-root").innerText();
    check("eight orientations do not claim Stage1 complete", !/Stage 1 complete/i.test(intro));
    check("summary identifies orientation distinctly", /Orientation/i.test(intro));
    await page.locator('[data-action="snapshot-dashboard"]').first().click(); await settled(page);
    check("orientation-only snapshot has zero addressed", (await page.locator(".hdrl-progress__meta").innerText()).includes("0 of 64"));
    check("orientation-only primary starts first indicator", await page.locator('.md-button--primary[data-action="open-snapshot"]').getAttribute("data-ref"), "A.1.1");
    await page.locator('[data-action="overview"]').first().click(); await settled(page);
    const overview = await page.locator("#hdrl-assessment-root").innerText();
    check("overview names assessment and date", overview.includes(orientation.boundary.title) && overview.includes(orientation.boundary.assessmentDate));
    check("overview distinguishes zero snapshot from completed orientation", overview.includes("8/8") && overview.includes("0/64"));
    check("overview has explicit report action", await page.locator('[data-action="gate"]').count(), 1);
    await page.screenshot({ path: path.join(dir, "orientation-only-overview.png") });
    const last = draft(); last.indicators = {}; last.view = "snapshot"; last.activeIndicator = "H.4.2"; last.snapshot["H.4.2"] = response("snapshot");
    await load(page, last); await page.locator('input[name="snapshot-status"][value="not_assessed"]').check();
    check("last response promises review not another question", await page.locator('[name="journey-action"][value="next"]').innerText(), "Save and review snapshot");
    await page.locator('[name="journey-action"][value="next"]').click();
    await page.getByRole("heading", { name: "Review the provisional snapshot", exact: true }).waitFor(); await settled(page);
    observations.completed_review_label = normal(await page.locator(".hdrl-progress-label").innerText());
    check("final response opens review showing64addressed", /64 of 64 indicators addressed/i.test(observations.completed_review_label));
    await page.waitForTimeout(700);
    const saved = await storage(page, "get"); check("last deferred answer remains unscored", { status: saved.snapshot["H.4.2"].status, level: saved.snapshot["H.4.2"].level }, { status: "not_assessed", level: "" });
    await page.locator('[data-action="snapshot-dashboard"]').last().click(); await settled(page);
    check("completed dashboard primary is review", await page.locator('.md-button--primary[data-action="snapshot-review"]').count(), 1);
    check("completed dashboard no primary unfinished action", await page.locator('.md-button--primary[data-action="open-snapshot"]').count(), 0);
    check("completed dashboard report available", await page.locator('[data-action="gate"]').count(), 1);
    await page.waitForTimeout(700); await page.reload(); await ready(page); await settled(page);
    check("reload retains completed review primary", await page.locator('.md-button--primary[data-action="snapshot-review"]').count(), 1);
    check("reload retains64addressed without restarting A1.1", /64 of 64/.test(await page.locator(".hdrl-progress__meta").innerText()));
    await page.screenshot({ path: path.join(dir, "completed-dashboard.png") });
    await page.locator('[data-action="gate"]').first().click(); await page.locator("#hdrl-generated-report").waitFor();
    check("completed snapshot opens honest snapshot-only report", /evidence-led pass was not undertaken/i.test(await page.locator("#hdrl-report-overview").innerText()));
    const backup = await download(page, "export-json", path.join(dir, "completed-snapshot-backup.json"));
    check("completion download retains all64snapshotresponses", Object.keys(backup.value.assessment.whole_framework_snapshot).length, 64);
    check("completion download retains nonrated final answer", backup.value.assessment.whole_framework_snapshot["H.4.2"].status, "not_assessed");
    check("completion never manufactures rated evidence", Object.values(backup.value.assessment.evidence_led_responses).filter((r) => r.status === "rated").length, 0);
    check("completion preserves original provenance", backup.value.provenance, last.provenance);
    check("completion preserves original method versions", backup.value.versions, last.versions);
    observations.download = { path: backup.path, sha256: backup.sha256, bytes: backup.bytes.length };
  },
  async "restored-active-explanation"({ page, engine, check, dir, observations }) {
    // All variants are invented in memory from the separate supplied test input.
    // Restore performs the actual parser/preview/confirmation/IndexedDB path.
    // No evidence form is submitted: saves would clear the inactive narrative.
    const scenarios = [
      { ref: "A.1.1", status: "rated", empty: false },
      { ref: "E.3.1", status: "not_known", empty: false },
      { ref: "B.1.1", status: "not_assessed", empty: false },
      { ref: "A.4.1", status: "not_applicable", empty: false },
      { ref: "A.1.2", status: "rated", empty: true },
      { ref: "E.1.1", status: "not_known", empty: true },
      { ref: "B.1.2", status: "not_assessed", empty: true },
      { ref: "C.1.1", status: "not_applicable", empty: true }
    ];
    const literal = '<img src="r25-inert-image" onerror="globalThis.r25Injected=true">';
    async function reportFromWorkspace() {
      await page.locator('[data-action="dashboard"]').first().click(); await page.locator('[data-action="evidence"]').first().click();
      await page.locator('[data-action="review"]').first().click(); await page.locator('[data-action="gate"]').first().click();
      await page.locator("#hdrl-generated-report").waitFor(); await settled(page);
    }
    observations.source_fixture_sha256 = sha(explanationFixtureBytes);
    observations.variants = [];
    await page.goto(`${origin.origin}/self-assessment/`); await ready(page);
    for (const format of ["v0.4.0", "v0.5.0"]) {
      const incoming = clone(explanationFixture);
      incoming.export_schema = `hdrl-self-assessment-export-${format}`;
      if (format === "v0.5.0") incoming.assessment.declared_context = "synthetic";
      else delete incoming.assessment.declared_context;
      incoming.assessment.boundary.title = `SYNTHETIC R25 active explanation — ${format}`;
      for (const s of scenarios) {
        const r = incoming.assessment.evidence_led_responses[s.ref], active = s.status === "rated" ? "rationale" : "statusReason", inactive = active === "rationale" ? "statusReason" : "rationale";
        Object.assign(r, { status: s.status, decision: s.status === "rated" ? "rated" : "not_judged", level: s.status === "rated" ? "L3" : "", certainty: s.status === "rated" ? "medium" : "" });
        r[active] = s.empty ? (s.ref === "E.1.1" ? "   " : "") : `SYNTHETIC ACTIVE ${s.ref} ${active} — source/date/scope explanation ${literal}`;
        r[inactive] = `SYNTHETIC INACTIVE ${s.ref} ${inactive} — retained historical text, never a fallback.`;
      }
      const serialized = Buffer.from(JSON.stringify(incoming, null, 2) + "\n"), variant = { source_schema: incoming.export_schema, incoming_sha256: sha(serialized), observations: [], downloads: [] };
      observations.variants.push(variant);
      await page.locator('[data-action="restore"]').first().click();
      await page.locator("#restore-file").setInputFiles({ name: `synthetic-active-explanation-${format}.json`, mimeType: "application/json", buffer: serialized });
      await page.locator("#restore-preview").waitFor(); const preview = await page.locator("#restore-preview").innerText();
      check(`${format} validated preview names incoming record`, preview.includes(incoming.assessment.boundary.title));
      check(`${format} preview preserves original method identity`, preview.includes("framework: 1.0.1") && preview.includes("catalogue: 1.0.2"));
      await page.screenshot({ path: path.join(dir, `${format}-validated-preview.png`) });
      await page.locator("#restore-confirm").check(); await page.locator('#hdrl-restore-confirm-form button[type="submit"]').click();
      await page.locator("#restore-preview").waitFor({ state: "detached" }); await ready(page); await page.waitForTimeout(700);
      const restored = await storage(page, "get");
      check(`${format} actual restore preserves both narratives`, restored.indicators, incoming.assessment.evidence_led_responses);
      check(`${format} source provenance survives restore`, restored.provenance, incoming.provenance);
      check(`${format} original snapshot unchanged by restore`, restored.snapshot, incoming.assessment.whole_framework_snapshot);
      check(`${format} context follows explicit schema`, restored.declaredContext, format === "v0.4.0" ? "unspecified" : "synthetic");
      for (const phase of ["before-reload", "after-reload"]) {
        if (phase === "after-reload") { await page.reload(); await ready(page); }
        await reportFromWorkspace();
        const reportNotes = Object.fromEntries(await Promise.all(scenarios.map(async (s) => [s.ref, await row(page, "All indicator results", s.ref).locator("td").nth(3).innerText()])));
        await writeFile(path.join(dir, `${format}-${phase}-report.html`), await page.content());
        if (engine === "chromium" && phase === "before-reload") {
          const pdf = path.join(dir, `${format}-restored-report.pdf`), textPath = path.join(dir, `${format}-restored-report.txt`);
          await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
          await promisify(execFile)(process.env.HDRL_PDFTOTEXT || "pdftotext", ["-layout", pdf, textPath]);
          const compactPdfText = (text) => normal(text).replace(/\s+/g, "");
          const pdfText = compactPdfText(await readFile(textPath, "utf8"));
          // Unique per-row prefixes survive tabular PDF extraction; adjacent columns
          // interleave longer text. Full explanation equality is checked in HTML.
          const activeTexts = scenarios.filter((s) => !s.empty).map((s) => `SYNTHETIC ACTIVE ${s.ref}`);
          const inactiveTexts = scenarios.map((s) => `SYNTHETIC INACTIVE ${s.ref}`);
          check(`${format} actual PDF retains all active explanation markers`, activeTexts.filter((text) => !pdfText.includes(compactPdfText(text))), []);
          check(`${format} actual PDF excludes all inactive explanation markers`, inactiveTexts.filter((text) => pdfText.includes(compactPdfText(text))), []);
          variant.pdf = { path: pdf, sha256: sha(await readFile(pdf)), text_path: textPath };
        }
        variant.reportNotes ||= [];
        variant.reportNotes.push({ phase, notes: reportNotes, html_path: path.join(dir, `${format}-${phase}-report.html`) });
        await compare(page);
        for (const s of scenarios) {
          const original = incoming.assessment.evidence_led_responses[s.ref], active = s.status === "rated" ? "rationale" : "statusReason", inactive = active === "rationale" ? "statusReason" : "rationale";
          const expected = original[active].trim() ? original[active] : "No explanation recorded.", target = row(page, "Comparison by indicator", s.ref), evidenceCell = target.locator("td").nth(1);
          const visible = await evidenceCell.locator("p").nth(1).innerText();
          check(`${format}/${phase}/${s.ref} only active explanation visible`, visible, expected);
          check(`${format}/${phase}/${s.ref} report Notes uses active explanation`, reportNotes[s.ref], expected);
          check(`${format}/${phase}/${s.ref} report Notes agrees with comparison`, reportNotes[s.ref], visible);
          check(`${format}/${phase}/${s.ref} report Notes omits inactive explanation`, !reportNotes[s.ref].includes(original[inactive]));
          check(`${format}/${phase}/${s.ref} inactive narrative not shown`, !(await evidenceCell.innerText()).includes(original[inactive]));
          check(`${format}/${phase}/${s.ref} original snapshot note visible`, await target.locator("td").nth(0).locator("p").nth(1).innerText(), incoming.assessment.whole_framework_snapshot[s.ref].note || "No explanation recorded.");
          await target.screenshot({ path: path.join(dir, `${format}-${phase}-${s.ref}-comparison.png`) });
          await target.locator('[data-action="open-indicator"]').click();
          const editor = page.locator(s.status === "rated" ? "#indicator-rationale" : "#indicator-status-reason"); await editor.waitFor();
          const current = await editor.inputValue(); check(`${format}/${phase}/${s.ref} editor and comparison agree`, current.trim() ? current : "No explanation recorded.", visible);
          check(`${format}/${phase}/${s.ref} editor active value unchanged`, current, original[active]);
          variant.observations.push({ phase, ref: s.ref, status: s.status, active_field: active, active_empty: s.empty, visible_explanation: visible, editor_value: current });
          if (s.ref === "E.3.1") { await editor.scrollIntoViewIfNeeded(); await page.screenshot({ path: path.join(dir, `${format}-${phase}-current-editor.png`) }); }
          await reportFromWorkspace(); await compare(page);
        }
        check(`${format}/${phase} active HTML-like text remains inert`, await page.evaluate(() => !globalThis.r25Injected && !document.querySelector('img[src="r25-inert-image"]')));
        await toReport(page); const backup = await download(page, "export-json", path.join(dir, `${format}-${phase}-full-backup.json`));
        check(`${format}/${phase} download retains all original and inactive narratives`, backup.value.assessment.evidence_led_responses, incoming.assessment.evidence_led_responses);
        check(`${format}/${phase} download retains snapshot notes`, backup.value.assessment.whole_framework_snapshot, incoming.assessment.whole_framework_snapshot);
        check(`${format}/${phase} download retains original versions`, backup.value.versions, incoming.versions);
        check(`${format}/${phase} download retains original provenance`, backup.value.provenance, incoming.provenance);
        check(`${format}/${phase} download retains original record identity`, backup.value.assessment.id, incoming.assessment.id);
        check(`${format}/${phase} current generator stays distinct`, backup.value.generated_by.implementation_candidate, "2026-10-31.2");
        variant.downloads.push({ phase, path: backup.path, sha256: backup.sha256, bytes: backup.bytes.length });
      }
    }
  }
};
assert.deepEqual(Object.keys(tests), CASES, "Exact reporting case inventory");
await mkdir(artifacts, { recursive: true }); await mkdir(path.dirname(output), { recursive: true });
const harnessPin = sha(await readFile(fileURLToPath(import.meta.url)));
const report = { started_at: new Date().toISOString(), origin: origin.origin, source_root: sourceRoot, harness_sha256: harnessPin, source_pins: pins, fixture_sha256: sha(fixtureBytes),
  restore_explanation_fixture_sha256: explanationFixtureBytes ? sha(explanationFixtureBytes) : null,
  selected_cases: selected, selected_engines: engines, synthetic_only: true, live_services: false, browsers: [], failures: [] };
// A named/started case is not evidence of a completed behavioural run.
function completedCase(record) {
  return record.passed === true && Number.isInteger(record.behaviour_assertions)
    && record.behaviour_assertions > 0 && record.assertions?.total > record.behaviour_assertions
    && record.assertions.failed === 0 && record.checks.length === record.assertions.total
    && record.checks.every((check) => check.passed === true);
}
try {
  for (const engine of engines) {
    const browser = await playwright[engine].launch({ headless: true }), group = { engine, version: browser.version(), cases: [] }; report.browsers.push(group);
    try { for (const name of selected) {
      const record = { name, checks: [], observations: {}, blocked_requests: [], page_errors: [], assets: [] }; group.cases.push(record);
      const check = (label, actual, expected = true) => { try { assert.deepEqual(actual, expected); record.checks.push({ label, passed: true }); } catch { record.checks.push({ label, passed: false, actual, expected }); } };
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: "block", acceptDownloads: true }), pending = new Set();
      await ctx.routeWebSocket("**/*", (socket) => { record.blocked_requests.push({ method: "WEBSOCKET", url: socket.url() }); socket.close(); });
      await ctx.route("**/*", (route) => {
        const task = (async () => { const req = route.request(), url = new URL(req.url());
          if (url.origin !== origin.origin || !["GET", "HEAD"].includes(req.method()) || req.postData() !== null || url.search) { record.blocked_requests.push({ method: req.method(), url: req.url() }); return route.abort(); }
          if (url.pathname === "/__hdrl_reporting_fixture__") return route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Synthetic reporting fixture</title>" });
          // MkDocs refresh long-polls and browser prefetches are ordinary loopback
          // traffic; their cancellation on context close is not an app failure.
          // Every application/method/config asset still passes the byte-pin check.
          if (!pins[url.pathname]) return route.continue();
          const response = await route.fetch({ maxRedirects: 0, maxRetries: 0 }); assert.equal(response.status(), 200, `HTTP status ${url.pathname}`);
          if (pins[url.pathname] && req.method() === "GET") { const digest = sha(await response.body()); record.assets.push({ path: url.pathname, sha256: digest }); assert.equal(digest, pins[url.pathname], `Served asset changed: ${url.pathname}`); }
          await route.fulfill({ response });
        })().catch(async (e) => { record.fatal ||= e.message; await route.abort().catch(() => {}); });
        pending.add(task); void task.finally(() => pending.delete(task)); return task;
      });
      const dir = path.join(artifacts, `${engine}-${name}`); await mkdir(dir, { recursive: true });
      const page = await ctx.newPage(); page.setDefaultTimeout(12000); page.on("pageerror", (e) => record.page_errors.push(e.message));
      try { await tests[name]({ page, engine, check, dir, observations: record.observations }); await page.screenshot({ path: path.join(dir, "completed.png") }); }
      catch (e) { record.fatal ||= e.stack; }
      finally {
        record.behaviour_assertions = record.checks.length; if (!record.behaviour_assertions) record.fatal ||= "No behavioural assertions executed";
        if (record.fatal || record.checks.some((c) => !c.passed)) { try { await writeFile(path.join(dir, "failure.html"), await page.content()); await page.screenshot({ path: path.join(dir, "failure.png") }); } catch (e) { record.capture_error = e.message; } }
        await ctx.close(); await Promise.allSettled([...pending]);
        check("no external/write requests", record.blocked_requests, []); check("no uncaught page error", record.page_errors, []);
        for (const [url, pin] of Object.entries(pins)) check(`served asset pinned: ${url}`, [...new Set(record.assets.filter((a) => a.path === url).map((a) => a.sha256))], [pin]);
        record.assertions = { total: record.checks.length, failed: record.checks.filter((c) => !c.passed).length }; record.passed = !record.fatal && !record.assertions.failed;
        if (!record.passed) report.failures.push({ engine, name, fatal: record.fatal || null, failed_checks: record.checks.filter((c) => !c.passed).map((c) => c.label) });
        console.log(`${engine}/${name}: ${record.passed ? "PASS" : "FAIL"}`); await writeFile(output, JSON.stringify(report, null, 2) + "\n");
      }
    } } finally { await browser.close(); }
  }
} catch (error) {
  report.failures.push({ name: "runner-error", fatal: error.stack || String(error) });
} finally {
  for (const engine of engines) { const groups = report.browsers.filter((g) => g.engine === engine); if (groups.length !== 1 || JSON.stringify(groups[0].cases.map((c) => c.name)) !== JSON.stringify(selected)) report.failures.push({ engine, name: "inventory", fatal: "Exact requested cases did not execute" }); }
  const all = report.browsers.flatMap((b) => b.cases);
  for (const group of report.browsers) for (const record of group.cases) {
    if (!completedCase(record)) report.failures.push({ engine: group.engine, name: record.name, fatal: "Case did not complete with passing behavioural assertions" });
  }
  if (sha(await readFile(fileURLToPath(import.meta.url))) !== harnessPin) report.failures.push({ name: "harness-mutated" });
  for (const [url, pin] of Object.entries(pins)) if (sha(await readFile(path.join(sourceRoot, "docs", url))) !== pin) report.failures.push({ name: "source-mutated", path: url });
  if (sha(await readFile(fixturePath)) !== report.fixture_sha256) report.failures.push({ name: "fixture-mutated" });
  if (explanationFixtureBytes && sha(await readFile(explanationFixturePath)) !== report.restore_explanation_fixture_sha256) report.failures.push({ name: "restore-explanation-fixture-mutated" });
  report.counts = { expected_cases: engines.length * selected.length, executed_cases: all.length, assertions: all.reduce((n, c) => n + (c.assertions?.total || 0), 0), behaviour_assertions: all.reduce((n, c) => n + (c.behaviour_assertions || 0), 0), failed_cases: report.failures.length };
  report.finished_at = new Date().toISOString(); report.passed = report.failures.length === 0; await writeFile(output, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify({ output, ...report.counts, passed: report.passed })); process.exitCode = report.passed ? 0 : 1;
}
