// Synthetic print/boundary regressions. Fresh browser profiles; loopback MkDocs only.
// HDRL_SOURCE_ROOT selects the checkout whose unmodified served assets are pinned.
// HDRL_FEEDBACK_FIXTURE must be the retained, unmodified synthetic Fenland export.
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { createHash, webcrypto } from "node:crypto";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import vm from "node:vm";

const CASES = Object.freeze(["print-framework-overview", "print-wrapped-report-control", "print-assessment-63-actions", "boundary-first-entry", "boundary-existing-edit-mobile"]);
const ENGINES = Object.freeze(["chromium", "firefox", "webkit"]);
const filter = process.env.HDRL_BROWSER_CASE || "";
assert.ok(!filter || CASES.includes(filter), `Unknown HDRL_BROWSER_CASE; supported: ${CASES.join(", ")}`);
const engines = (process.env.HDRL_BROWSERS || ENGINES.join(",")).split(",");
assert.ok(engines.length && engines.every((e) => ENGINES.includes(e)) && new Set(engines).size === engines.length, "Choose unique supported browsers");
const cases = filter ? [filter] : [...CASES];
const require = createRequire(import.meta.url);
const playwright = require("playwright");
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.resolve(process.env.HDRL_SOURCE_ROOT || repo);
const origin = new URL(process.env.HDRL_PREVIEW_ORIGIN || "http://127.0.0.1:8150");
assert.ok(origin.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname), "Loopback HTTP preview only");
const output = path.resolve(process.env.HDRL_BROWSER_RESULTS || `/tmp/hdrl-print-boundary-${Date.now()}/results.json`);
const artifacts = path.resolve(process.env.HDRL_BROWSER_ARTIFACTS || path.join(path.dirname(output), "artifacts"));
const sha = (v) => createHash("sha256").update(v).digest("hex");
const clone = (v) => JSON.parse(JSON.stringify(v));
// pdftotext wraps an existing hyphenated word at a physical line boundary.
// Rejoin that boundary only; do not discard words or ordinary within-line spaces.
const normal = (s) => s.normalize("NFKC").replace(/\u00ad/g, "").replace(/([-\u2010\u2011])\r?\n\s*/g, "$1").replace(/\s+/g, " ").trim();
const jsonPin = (v) => sha(JSON.stringify(v ?? null));
const fixturePath = process.env.HDRL_FEEDBACK_FIXTURE;
assert.ok(fixturePath, "HDRL_FEEDBACK_FIXTURE is required");
const fixtureBytes = await readFile(fixturePath);
assert.equal(sha(fixtureBytes), "8e0c36eb2f24895d38198431ebc179e57517cbba0abc5b6a20e8e13c2db61422", "Original synthetic fixture is unchanged");
const fixture = JSON.parse(fixtureBytes);
const assets = ["/assets/js/self-assessment.js", "/assets/js/self-assessment-portability.js", "/assets/css/self-assessment.css"];
const bytes = Object.fromEntries(await Promise.all(assets.map(async (url) => [url, await readFile(path.join(sourceRoot, "docs", url))])));
const pins = Object.fromEntries(Object.entries(bytes).map(([url, b]) => [url, sha(b)]));
const configBytes = await readFile(path.join(sourceRoot, "docs/data/hdrl-assessment-beta-config-v0.3.0.json"));
const config = JSON.parse(configBytes);
const context = vm.createContext({ document: { getElementById: () => ({}) }, crypto: webcrypto });
const source = bytes[assets[0]].toString();
assert.match(source, /  init\(\);\n\}\)\(\);\s*$/);
vm.runInContext(source.replace(/  init\(\);\n\}\)\(\);\s*$/, "  globalThis.makeFixture = config => { betaConfig = config; return defaultState(); };\n})();"), context);
function draft() {
  const d = clone(context.makeFixture(config)), a = fixture.assessment;
  Object.assign(d, { id: "SYNTHETIC-PRINT-BOUNDARY-ONLY", createdAt: a.created_at, updatedAt: a.updated_at,
    view: "report", boundary: clone(a.boundary), rapid: clone(a.rapid_first_pass), snapshot: clone(a.whole_framework_snapshot),
    indicators: clone(a.evidence_led_responses), domainNotes: clone(a.domain_capacity_notes), audit: clone(a.audit),
    versions: clone(fixture.versions), provenance: clone(fixture.provenance), declaredContext: "synthetic" });
  return d;
}
async function storage(page, operation, value) {
  return page.evaluate(({ operation, value }) => new Promise((resolve, reject) => {
    const open = indexedDB.open("hdrl-self-assessment-prototype", 1);
    open.onupgradeneeded = () => open.result.createObjectStore("drafts");
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result, tx = db.transaction("drafts", operation === "put" ? "readwrite" : "readonly");
      const req = operation === "put" ? tx.objectStore("drafts").put(value, "current") : tx.objectStore("drafts").get("current");
      let result; req.onsuccess = () => { result = req.result; };
      tx.oncomplete = () => { db.close(); resolve(result); };
      tx.onerror = tx.onabort = () => { db.close(); reject(tx.error || new Error("Synthetic storage failure")); };
    };
  }), { operation, value });
}
const settled = (page) => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
async function app(page, initial) {
  await page.goto(`${origin.origin}/__print_boundary_fixture__`);
  if (initial) await storage(page, "put", initial);
  await page.goto(`${origin.origin}/self-assessment/`);
  await page.locator('#hdrl-assessment-root[aria-busy="false"]').waitFor(); await settled(page);
}
async function contentRows(page, selector) {
  return page.locator(selector).evaluateAll((nodes) => nodes.map((node, index) => {
    let visible = !!node.getClientRects().length;
    for (let ancestor = node; ancestor; ancestor = ancestor.parentElement) {
      const style = getComputedStyle(ancestor);
      if (style.display === "none" || style.visibility === "hidden") visible = false;
    }
    const copy = node.cloneNode(true); copy.querySelectorAll(".headerlink").forEach((n) => n.remove());
    return { index, tag: node.tagName, text: copy.textContent.replace(/\s+/g, " ").trim(), visible };
  }));
}
async function printEvidence(page, engine, dir, observations, selector) {
  await page.emulateMedia({ media: "print" }); await settled(page);
  observations.print_rows = await contentRows(page, selector);
  await page.screenshot({ path: path.join(dir, "print-top.png") });
  const last = page.locator(selector).last();
  if (await last.isVisible()) { await last.scrollIntoViewIfNeeded(); await page.screenshot({ path: path.join(dir, "print-bottom.png") }); }
  if (engine === "chromium") {
    const pdf = path.join(dir, "actual-browser-print.pdf");
    await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
    const textFile = path.join(dir, "actual-browser-print.txt");
    await promisify(execFile)(process.env.HDRL_PDFTOTEXT || "pdftotext", ["-layout", pdf, textFile]);
    const pdfBytes = await readFile(pdf), text = await readFile(textFile, "utf8");
    observations.pdf = { path: pdf, sha256: sha(pdfBytes), bytes: pdfBytes.length, text_path: textFile,
      scope: "Actual headless Chromium PDF. Text checks and separately recorded visual inspection; not native Firefox/WebKit PDF evidence." };
    return normal(text);
  }
  observations.pdf = { produced: false, reason: "Playwright PDF export is Chromium-only; this engine has print-media DOM and screenshots." };
  return null;
}
const fields = { title: "boundary-title", serviceName: "boundary-service", scope: "boundary-scope", timePeriod: "boundary-period", assessmentDate: "boundary-date", unit: "boundary-unit", method: "boundary-method", intendedUse: "boundary-use", declaredContext: "boundary-context" };
async function formValues(page) {
  return page.locator("#hdrl-boundary-form").evaluate((form, mapping) => Object.fromEntries(Object.entries(mapping).map(([key, name]) => [key, form.elements[name].value])), fields);
}
async function fillBoundary(page, values) {
  await settled(page);
  for (const [key, value] of Object.entries(values)) {
    if (["unit", "method"].includes(key)) { if (value) await page.locator(`input[name="${fields[key]}"][value="${value}"]`).check(); }
    else if (key === "declaredContext") await page.locator(`#${fields[key]}`).selectOption(value);
    else await page.locator(`#${fields[key]}`).fill(value);
  }
  assert.deepEqual(await formValues(page), values, "All intended values reached the actual rendered form before submission");
}
async function boundaryTest({ page, engine, check, dir, observations, existing }) {
  await app(page, existing ? draft() : null);
  if (existing) await page.locator('[data-action="dashboard"]').first().click();
  await page.locator(`[data-action="${existing ? "boundary" : "start"}"]`).first().click();
  await page.locator("#hdrl-boundary-form").waitFor(); await settled(page); await page.waitForTimeout(700);
  const savedBefore = await storage(page, "get"), savedPin = jsonPin(savedBefore);
  const values = { title: "  SYNTHETIC boundary retention <one>  ", serviceName: "  Invented service only  ",
    scope: "  Synthetic scope\nRetain line two & literal <text>.  ", timePeriod: "  Invented period 2026–2027  ",
    assessmentDate: "2026-10-29", unit: "dual", method: "team", intendedUse: "", declaredContext: "real" };
  if (!existing) {
    const missingUnit = { ...values, unit: "", intendedUse: "  Synthetic unit error only.  " };
    await fillBoundary(page, missingUnit);
    await page.locator('#hdrl-boundary-form button[type="submit"]').click(); await page.locator("#hdrl-boundary-errors").waitFor();
    observations.unit_error = { expected: missingUnit, actual: await formValues(page) };
    check("unit-only error preserves every entered control", observations.unit_error.actual, missingUnit);
    check("unit-only summary lists only missing unit", await page.locator("#hdrl-boundary-errors a").evaluateAll((a) => a.map((n) => n.getAttribute("href"))), ["#boundary-unit"]);
    check("unit error summary focused", await page.evaluate(() => document.activeElement?.id), "hdrl-boundary-errors");
    await page.keyboard.press(engine === "webkit" ? "Alt+Tab" : "Tab"); await page.keyboard.press("Enter");
    check("unit error link focuses the first actual unit control", await page.evaluate(() => document.activeElement?.value), "system");
    check("keyboard reaches an actual unit radio directly", await page.evaluate(() => ({ name:document.activeElement?.name, type:document.activeElement?.type })), {name:"boundary-unit", type:"radio"});
    await page.keyboard.press("Space");
    check("keyboard can choose unit after the error link", (await formValues(page)).unit, "system");
    check("unit error and correction remain unsaved before valid submission", jsonPin(await storage(page, "get")), savedPin);
  }
  // 'real' is a synthetic declaration-selection control, not a factual assessment.
  await fillBoundary(page, values);
  await page.locator('#hdrl-boundary-form button[type="submit"]').click();
  await page.locator("#hdrl-boundary-errors").waitFor();
  observations.single_error = { expected: values, actual: await formValues(page), focus: await page.evaluate(() => document.activeElement?.id) };
  check("all nine visible controls retained after one error", observations.single_error.actual, values);
  check("error summary receives focus", observations.single_error.focus, "hdrl-boundary-errors");
  check("one error points to intended use", await page.locator("#hdrl-boundary-errors a").evaluateAll((links) => links.map((a) => a.getAttribute("href"))), ["#boundary-use"]);
  await page.waitForTimeout(600);
  check("invalid first submit does not write pending form", jsonPin(await storage(page, "get")), savedPin);
  const multiple = { ...values, title: "  SYNTHETIC second attempt  ", serviceName: "", assessmentDate: "", intendedUse: "", declaredContext: "synthetic" };
  await fillBoundary(page, multiple);
  await page.locator('#hdrl-boundary-form button[type="submit"]').click(); await page.locator("#hdrl-boundary-errors").waitFor();
  observations.multiple_errors = { expected: multiple, actual: await formValues(page), focus: await page.evaluate(() => document.activeElement?.id) };
  check("all controls including blank values retained after multiple errors", observations.multiple_errors.actual, multiple);
  check("all three errors are listed once", await page.locator("#hdrl-boundary-errors a").evaluateAll((links) => links.map((a) => a.getAttribute("href"))), ["#boundary-service", "#boundary-date", "#boundary-use"]);
  check("multiple-error summary receives focus", observations.multiple_errors.focus, "hdrl-boundary-errors");
  await page.waitForTimeout(600);
  check("multiple invalid submit leaves saved record exact", jsonPin(await storage(page, "get")), savedPin);
  if (existing) {
    const widths = await page.evaluate(() => ({ viewport: innerWidth, body: document.documentElement.scrollWidth }));
    observations.mobile_widths = widths; check("320px boundary form has no horizontal overflow", widths.body <= widths.viewport + 1);
  }
  await page.screenshot({ path: path.join(dir, "multiple-errors.png"), fullPage: true });
  // Native keyboard activation from the focused error summary, never a click fallback.
  await page.keyboard.press(engine === "webkit" ? "Alt+Tab" : "Tab");
  check("keyboard reaches first error link", await page.evaluate(() => document.activeElement?.getAttribute("href")), "#boundary-service");
  await page.keyboard.press("Enter");
  check("error link focuses service input", await page.evaluate(() => document.activeElement?.id), "boundary-service");
  await page.keyboard.type("Synthetic corrected service");
  await page.locator("#boundary-date").fill("2026-10-30");
  await page.locator("#boundary-use").fill("  Synthetic correction and retention test only.  ");
  const corrected = { ...multiple, serviceName: "Synthetic corrected service", assessmentDate: "2026-10-30", intendedUse: "  Synthetic correction and retention test only.  " };
  check("keyboard correction changes only invalid fields", await formValues(page), corrected);
  // Enter activates the actual submit control. WebKit may skip buttons in its
  // default tab preference; focusing the submit button then Enter tests native activation.
  await page.locator('#hdrl-boundary-form button[type="submit"]').focus(); await page.keyboard.press("Enter");
  await page.waitForTimeout(900);
  const savedAfter = await storage(page, "get");
  const expectedBoundary = Object.fromEntries(Object.entries(corrected).filter(([key]) => key !== "declaredContext").map(([key, value]) => [key, value.trim()]));
  observations.saved_after = savedAfter ? { boundary: savedAfter.boundary, context: savedAfter.declaredContext } : null;
  check("valid correction reaches assessment overview", await page.locator("#hdrl-view-title").innerText(), "Assessment overview");
  check("valid boundary saved with trimming only after success", savedAfter?.boundary, expectedBoundary);
  check("valid context saved", savedAfter?.declaredContext, corrected.declaredContext);
  if (existing) {
    for (const key of ["id", "createdAt", "versions", "provenance", "snapshot", "indicators", "rapid", "domainNotes"]) check(`boundary edit preserves ${key}`, savedAfter?.[key], savedBefore[key]);
  }
  if (await page.locator("#hdrl-view-title").innerText() !== "Assessment overview") return;
  await page.reload(); await page.locator('#hdrl-assessment-root[aria-busy="false"]').waitFor();
  await page.locator('[data-action="boundary"]').first().click(); await settled(page);
  check("valid saved boundary and context survive reload", await formValues(page), { ...expectedBoundary, declaredContext: corrected.declaredContext });
}
const tests = {
  async "print-framework-overview"({ page, engine, check, dir, observations }) {
    await page.goto(`${origin.origin}/framework/overview/`); await settled(page);
    const selector = ".md-content__inner h1, .md-content__inner h2, .md-content__inner h3, .md-content__inner p, .md-content__inner li, .md-content__inner th, .md-content__inner td";
    const screen = (await contentRows(page, selector)).filter((r) => r.visible && r.text);
    observations.screen_rows = screen;
    const pdf = await printEvidence(page, engine, dir, observations, selector);
    check("overview has substantive source body", screen.length > 20);
    check("all overview headings and body remain printable", screen.filter((r) => !observations.print_rows[r.index]?.visible).map((r) => ({ tag: r.tag, text: r.text })), []);
    if (pdf !== null) check("actual PDF contains every overview heading and paragraph", screen.filter((r) => ["H1", "H2", "H3", "P"].includes(r.tag) && !pdf.includes(normal(r.text))).map((r) => r.text), []);
  },
  async "print-wrapped-report-control"({ page, engine, check, dir, observations }) {
    await page.goto(`${origin.origin}/explore-report/`); await settled(page);
    const selector = ".hdrl-report-page h1, .hdrl-report-page h2, .hdrl-report-page h3, .hdrl-report-page p:not(.hdrl-report-actions p), .hdrl-report-page li, .hdrl-report-page th, .hdrl-report-page td";
    const screen = (await contentRows(page, selector)).filter((r) => r.visible && r.text);
    observations.screen_rows = screen;
    const pdf = await printEvidence(page, engine, dir, observations, selector);
    check("wrapped report control has substantive source body", screen.length > 100);
    check("wrapped report headings and body remain printable", screen.filter((r) => !observations.print_rows[r.index]?.visible).map((r) => ({ tag: r.tag, text: r.text })), []);
    if (pdf !== null) check("actual PDF retains every wrapped-report heading", screen.filter((r) => /^H/.test(r.tag) && !pdf.includes(normal(r.text))).map((r) => r.text), []);
  },
  async "print-assessment-63-actions"({ page, engine, check, dir, observations }) {
    const d = draft(); const extra = "SYNTHETIC extra unknown-status action retained for print testing.";
    d.indicators["E.3.1"].improvementNote = extra;
    const actions = Object.entries(d.indicators).filter(([, r]) => r.improvementNote.trim());
    assert.equal(actions.length, 63); await app(page, d);
    await page.locator("#hdrl-generated-report").waitFor(); await page.waitForTimeout(700);
    const section = page.locator("#hdrl-generated-report section").filter({ has: page.getByRole("heading", { name: /^Potential improvement actions(?: \(\d+\))?$/ }) });
    check("all 63 actions are rendered on screen", await section.locator(".hdrl-finding-list li").count(), 63);
    const before = await section.innerText();
    check("all exact action texts present before print", actions.filter(([, r]) => !before.includes(r.improvementNote)).map(([ref]) => ref), []);
    const pdf = await printEvidence(page, engine, dir, observations, "#hdrl-generated-report h1, #hdrl-generated-report h2, #hdrl-generated-report h3, .hdrl-finding-list li");
    const after = await section.innerText();
    check("all 63 exact actions remain in print media", actions.filter(([, r]) => !after.includes(r.improvementNote)).map(([ref]) => ref), []);
    check("all action rows are visible in print", await section.locator(".hdrl-finding-list li").evaluateAll((rows) => rows.filter((r) => !!r.getClientRects().length && getComputedStyle(r).display !== "none").length), 63);
    if (pdf !== null) check("actual PDF contains all 63 exact actions including late H", actions.filter(([, r]) => !pdf.includes(normal(r.improvementNote))).map(([ref]) => ref), []);
    const late = section.locator('[data-ref^="H."]').last(); await late.scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(dir, "print-late-H-actions.png") });
    const saved = await storage(page, "get");
    for (const key of ["snapshot", "indicators", "versions", "provenance"]) check(`printing preserves ${key}`, saved[key], d[key]);
    observations.actions = actions.map(([ref, r]) => ({ ref, text: r.improvementNote }));
  },
  "boundary-first-entry": (args) => boundaryTest({ ...args, existing: false }),
  "boundary-existing-edit-mobile": (args) => boundaryTest({ ...args, existing: true })
};

await mkdir(artifacts, { recursive: true }); await mkdir(path.dirname(output), { recursive: true });
const harnessPin = sha(await readFile(fileURLToPath(import.meta.url)));
const report = { started_at: new Date().toISOString(), origin: origin.origin, source_root: sourceRoot, fixture_sha256: sha(fixtureBytes),
  harness_sha256: harnessPin, source_pins: pins, config_sha256: sha(configBytes), inventory: CASES, selected_cases: cases, browsers: [], failures: [],
  isolation: "Fresh disposable contexts. Only loopback GET/HEAD requests allowed. Ordinary framework pages' pre-existing font/analytics assets are blocked and reported separately; no external traffic is permitted." };
try {
  for (const engine of engines) {
    const browser = await playwright[engine].launch(); const group = { engine, cases: [] }; report.browsers.push(group);
    try {
      for (const name of cases) {
        const record = { name, checks: [], observations: {} }; group.cases.push(record);
        const check = (label, actual, expected = true) => { try { assert.deepEqual(actual, expected); record.checks.push({ label, passed: true }); } catch { record.checks.push({ label, passed: false, actual, expected }); } };
        const dir = path.join(artifacts, `${engine}-${name}`); await mkdir(dir, { recursive: true });
        const ctx = await browser.newContext({ viewport: { width: name === "boundary-existing-edit-mobile" ? 320 : 1280, height: 900 }, serviceWorkers: "block", acceptDownloads: true });
        const blocked = [], errors = [], responses = [];
        await ctx.route("**/*", async (route) => {
          const request = route.request(), url = new URL(request.url());
          if (url.origin !== origin.origin || !["GET", "HEAD"].includes(request.method())) {
            blocked.push({ method: request.method(), url: request.url() }); return route.abort();
          }
          if (url.pathname === "/__print_boundary_fixture__") return route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Synthetic fixture only</title>" });
          return route.continue();
        });
        ctx.on("page", (page) => {
          page.setDefaultTimeout(10000); page.on("pageerror", (e) => errors.push(e.message));
          page.on("response", (r) => { const url = new URL(r.url()).pathname; if (pins[url]) responses.push(r.body().then((b) => ({ path: url, sha256: sha(b) }))); });
        });
        const page = await ctx.newPage();
        try { await tests[name]({ page, engine, check, dir, observations: record.observations }); }
        catch (e) { record.fatal = e.stack; }
        finally {
          record.behaviour_assertions = record.checks.length;
          if (!record.behaviour_assertions) record.fatal ||= "No behavioural assertions executed";
          const framework = ["print-framework-overview", "print-wrapped-report-control"].includes(name);
          const expectedBlocked = (r) => framework && r.method === "GET" && ["fonts.googleapis.com", "fonts.gstatic.com", "plausible.io"].includes(new URL(r.url).hostname);
          record.blocked_requests = blocked; record.known_blocked_framework_assets = blocked.filter(expectedBlocked);
          check("no unexpected external or non-GET/HEAD attempts", blocked.filter((r) => !expectedBlocked(r)), []);
          record.page_errors = errors; check("no uncaught page error", errors, []);
          const seen = await Promise.all(responses);
          for (const [url, pin] of Object.entries(pins)) {
            const actual = [...new Set(seen.filter((r) => r.path === url).map((r) => r.sha256))];
            if (actual.length || !framework || url.endsWith(".css")) check(`served asset pinned: ${url}`, actual, [pin]);
          }
          record.assertions = { total: record.checks.length, failed: record.checks.filter((c) => !c.passed).length };
          record.passed = !record.fatal && !record.assertions.failed;
          if (!record.passed) {
            report.failures.push({ engine, name, fatal: record.fatal || null, failed_checks: record.checks.filter((c) => !c.passed).map((c) => c.label) });
            try { await writeFile(path.join(dir, "failure.html"), await page.content()); await page.screenshot({ path: path.join(dir, "failure.png"), fullPage: true }); } catch (e) { record.capture_error = e.message; }
          }
          await ctx.close(); console.log(`${engine}/${name}: ${record.passed ? "PASS" : "FAIL"}`);
          await writeFile(output, JSON.stringify(report, null, 2) + "\n");
        }
      }
    } finally { await browser.close(); }
  }
} finally {
  for (const engine of engines) {
    const groups = report.browsers.filter((g) => g.engine === engine);
    if (groups.length !== 1 || JSON.stringify(groups[0].cases.map((c) => c.name)) !== JSON.stringify(cases)) report.failures.push({ engine, name: "inventory", fatal: "Exact requested cases did not execute" });
  }
  const all = report.browsers.flatMap((b) => b.cases);
  report.counts = { expected_cases: engines.length * cases.length, executed_cases: all.length,
    assertions: all.reduce((n, c) => n + (c.assertions?.total || 0), 0), behaviour_assertions: all.reduce((n, c) => n + (c.behaviour_assertions || 0), 0), failed_cases: report.failures.length };
  if (sha(await readFile(fileURLToPath(import.meta.url))) !== harnessPin) report.failures.push({ name: "harness-mutated" });
  for (const [url, pin] of Object.entries(pins)) if (sha(await readFile(path.join(sourceRoot, "docs", url))) !== pin) report.failures.push({ name: "source-mutated", path: url });
  if (sha(await readFile(fixturePath)) !== report.fixture_sha256) report.failures.push({ name: "fixture-mutated" });
  report.finished_at = new Date().toISOString(); report.passed = report.failures.length === 0;
  await writeFile(output, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify({ output, ...report.counts, passed: report.passed }));
  process.exitCode = report.passed ? 0 : 1;
}
