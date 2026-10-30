// Reporting browser regressions: synthetic local fixtures, unmodified MkDocs assets.
// No live services or existing browser profile. HDRL_FEEDBACK_FIXTURE is required.
// HDRL_PREVIEW_ORIGIN defaults to http://127.0.0.1:8152. Results/artifacts must be private.
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { createHash, webcrypto } from "node:crypto";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import vm from "node:vm";

const CASES = Object.freeze(["fenland-report-comparison", "foundational-low-h", "snapshot-only", "sparse-missingness", "reference-status-and-ordinal-comparison", "exports-history-and-safe-text", "narrative-correction-keyboard-mobile", "print-all-63-actions"]);
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
    check("current generator stays distinct", json.value.generated_by.implementation_candidate, "2026-10-30.1"); check("source implementation retains2026-10-28.2", json.value.provenance.implementation_candidate, "2026-10-28.2");
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
    await page.screenshot({ path: path.join(dir, "comparison-mobile.png") }); observations.viewports = { reportWidth, comparisonWidth };
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
  }
};
assert.deepEqual(Object.keys(tests), CASES, "Exact reporting case inventory");
await mkdir(artifacts, { recursive: true }); await mkdir(path.dirname(output), { recursive: true });
const harnessPin = sha(await readFile(fileURLToPath(import.meta.url)));
const report = { started_at: new Date().toISOString(), origin: origin.origin, source_root: sourceRoot, harness_sha256: harnessPin, source_pins: pins, fixture_sha256: sha(fixtureBytes),
  selected_cases: selected, selected_engines: engines, synthetic_only: true, live_services: false, browsers: [], failures: [] };
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
} finally {
  for (const engine of engines) { const groups = report.browsers.filter((g) => g.engine === engine); if (groups.length !== 1 || JSON.stringify(groups[0].cases.map((c) => c.name)) !== JSON.stringify(selected)) report.failures.push({ engine, name: "inventory", fatal: "Exact requested cases did not execute" }); }
  const all = report.browsers.flatMap((b) => b.cases);
  if (sha(await readFile(fileURLToPath(import.meta.url))) !== harnessPin) report.failures.push({ name: "harness-mutated" });
  for (const [url, pin] of Object.entries(pins)) if (sha(await readFile(path.join(sourceRoot, "docs", url))) !== pin) report.failures.push({ name: "source-mutated", path: url });
  if (sha(await readFile(fixturePath)) !== report.fixture_sha256) report.failures.push({ name: "fixture-mutated" });
  report.counts = { expected_cases: engines.length * selected.length, executed_cases: all.length, assertions: all.reduce((n, c) => n + (c.assertions?.total || 0), 0), behaviour_assertions: all.reduce((n, c) => n + (c.behaviour_assertions || 0), 0), failed_cases: report.failures.length };
  report.finished_at = new Date().toISOString(); report.passed = report.failures.length === 0; await writeFile(output, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify({ output, ...report.counts, passed: report.passed })); process.exitCode = report.passed ? 0 : 1;
}
