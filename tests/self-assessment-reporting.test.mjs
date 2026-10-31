// Presentation-only reporting: synthetic inputs, no browser, storage or network.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import { spawnSync } from "node:child_process";
import { webcrypto } from "node:crypto";

const read = (name) => readFileSync(new URL(`../${name}`, import.meta.url), "utf8");
const source = read("docs/assets/js/self-assessment.js");
const catalogue = JSON.parse(read("docs/data/hdrl-indicators-v1.json"));
const content = JSON.parse(read("docs/data/hdrl-assessment-content-v0.2.0.json"));
const config = JSON.parse(read("docs/data/hdrl-assessment-beta-config-v0.3.0.json"));
const plain = (v) => JSON.parse(JSON.stringify(v));
function setup() {
  const context = vm.createContext({ TextEncoder, document: { getElementById: () => ({}) }, crypto: webcrypto });
  vm.runInContext(read("docs/assets/js/self-assessment-portability.js"), context);
  assert.match(source, /  init\(\);\n\}\)\(\);\s*$/);
  vm.runInContext(source.replace(/  init\(\);\n\}\)\(\);\s*$/, `globalThis.api = {
    coreCoverage, referenceCounts, foundationalTable, comparisonView, reportView, reportOverview,
    domainSummary, snapshotDomainSummary, reportFindings, fullBackupPayload, csvPayload, audit,
    restore(backup) { state=restoredState(HDRLPortability.parseBackup(JSON.stringify(backup), catalogue)); return state; },
    setup(c,g,b) { catalogue=c; content=g; betaConfig=b; state=defaultState();
      catalogue.indicators.forEach(i => { indicatorResponse(i.ref); snapshotResponse(i.ref); });
      return state; }
  };\n})();`), context);
  const api = context.api;
  const state = api.setup(plain(catalogue), plain(content), plain(config));
  return { api, state };
}
const rate = (response, level = "L3") => Object.assign(response, { status: "rated", level, certainty: "medium", rationale: "Synthetic judgement" });

test("coverage uses exactly the existing Core/non-Y membership and retains missing/N/A members", () => {
  const { api, state } = setup();
  assert.deepEqual(catalogue.domains.map(d => api.coreCoverage("evidence", d.ref).total), [7,4,9,3,6,2,4,6]);
  const members = catalogue.indicators.filter(i => i.domain === "A" && i.type === "Core" && i.applicability_class !== "Y");
  rate(state.indicators[members[0].ref]);
  for (const [index, status] of ["not_known", "not_assessed", "not_applicable"].entries()) state.indicators[members[index + 1].ref].status = status;
  state.indicators[members[4].ref].status = "rated";
  assert.deepEqual(plain(api.coreCoverage("evidence", "A")), { total:7, rated:1, not_known:1, not_assessed:1, unstarted:2, not_applicable:1, incomplete:1 });
  assert.equal(api.coreCoverage("snapshot", "A").unstarted, 7);
  assert.equal(api.domainSummary("A").count, 1);
});

test("all N/A remains a visible non-score, with the fixed denominator", () => {
  const { api, state } = setup();
  for (const i of catalogue.indicators.filter(i => i.domain === "F")) state.indicators[i.ref].status = "not_applicable";
  assert.equal(api.coreCoverage("evidence", "F").total, 2);
  assert.equal(api.coreCoverage("evidence", "F").not_applicable, 2);
  assert.equal(api.domainSummary("F").median, "—");
  assert.equal(api.reportFindings().actions.length, 0);
});

test("foundational rows are the existing five, and low H.3.1 remains visible beside H L3", () => {
  const { api, state } = setup();
  for (const i of catalogue.indicators.filter(i => i.domain === "H")) rate(state.indicators[i.ref]);
  rate(state.indicators["H.3.1"], "L1");
  state.indicators["H.3.2"].status = "not_known"; state.indicators["H.3.2"].level = "";
  assert.equal(api.domainSummary("H").median, "L3");
  assert.deepEqual(catalogue.indicators.filter(i => i.foundational).map(i => i.ref), ["C.1.1", "C.2.2", "C.4.1", "H.3.1", "H.3.2"]);
  const html = api.foundationalTable();
  assert.match(html, /H\.3\.1[\s\S]*?<strong>L1<\/strong>/);
  assert.match(html, /H\.3\.2[\s\S]*?Not known/);
  assert.equal((html.match(/<td>L3<\/td>/g) || []).length, 5);
  assert.match(html, /proposed L3 reference/);
});

test("reference review statuses remain separate and do not alter coverage or medians", () => {
  const { api, state } = setup(); const item = catalogue.indicators[0]; rate(state.indicators[item.ref]);
  state.indicators[item.ref].evidence = ["reviewed", "accepted", "unreviewed", "needs_update", ""].map(reviewStatus => ({ reviewStatus }));
  assert.deepEqual(plain(api.referenceCounts([item])), { total:5, reviewed:1, accepted:1, unreviewed:1, needs_update:1, other:1 });
  assert.equal(api.domainSummary("A").median, "L3");
  assert.equal(api.coreCoverage("evidence", "A").rated, 1);
});

test("comparison keeps impressions separate and does not create gaps from changed levels or certainty", () => {
  const { api, state } = setup();
  state.rapid.A = { impression:"improving", certainty:"high" };
  rate(state.indicators["A.1.1"], "L2"); state.indicators["A.1.1"].evidence = [{reviewStatus:"reviewed"}];
  const before = plain(api.reportFindings());
  rate(state.snapshot["A.1.1"], "L5"); state.snapshot["A.1.1"].certainty = "low";
  assert.deepEqual(plain(api.reportFindings()), before);
  const html = api.comparisonView();
  assert.match(html, /Continuously improving/); assert.match(html, /Low certainty/); assert.match(html, /Medium certainty/);
  assert.equal((html.match(/Review snapshot · /g) || []).length, 64);
  assert.equal((html.match(/Review evidence-led response · /g) || []).length, 64);
  assert.match(html, /not a time series or evidence of improvement/);
});

test("rendering overview/comparison preserves responses, original provenance and existing calculations", () => {
  const { api, state } = setup();
  for (const i of catalogue.indicators) { rate(state.indicators[i.ref]); rate(state.snapshot[i.ref], "L2"); }
  state.provenance.implementation_candidate = "2026-10-28.2";
  state.domainNotes.H = "Inherited synthetic security service; scope limited to test systems.";
  const before = plain(state), findings = plain(api.reportFindings());
  api.reportView(); api.comparisonView();
  assert.deepEqual(plain(state), before);
  assert.deepEqual(plain(api.reportFindings()), findings);
  const backup = plain(api.fullBackupPayload(state));
  assert.equal(backup.provenance.implementation_candidate, "2026-10-28.2");
  assert.equal(backup.generated_by.implementation_candidate, "2026-10-31.1");
  assert.equal(backup.export_schema, "hdrl-self-assessment-export-v0.5.0");
  assert.equal(state.schemaVersion, 6);
});

test("empty stages do not imply absent capability or produce broken finding links", () => {
  const { api } = setup(); const html = api.reportView();
  assert.match(html, /The evidence-led pass was not undertaken/);
  assert.doesNotMatch(html, /href="#hdrl-report-(questions|actions)"/);
  assert.equal(api.reportFindings().questions.length, 0);
});

test("all overview finding links resolve and every entered action is retained", () => {
  const { api, state } = setup();
  for (const i of catalogue.indicators) state.indicators[i.ref].improvementNote = `SYNTHETIC action ${i.ref}`;
  const html = api.reportView();
  for (const id of ["questions", "actions", "context"]) { assert.ok(html.includes(`href="#hdrl-report-${id}"`)); assert.ok(html.includes(`id="hdrl-report-${id}"`)); }
  assert.equal(api.reportFindings().actions.length, 64);
  assert.match(html, /SYNTHETIC action H\.3\.3/);
});

test("shared/inherited notes remain escaped narrative and cannot drive ratings or reference review", () => {
  const { api, state } = setup(); rate(state.indicators["H.3.1"], "L1");
  state.indicators["H.3.1"].rationale = '<img src=x onerror="fail()"> Shared synthetic source';
  state.domainNotes.H = '<script>fail()</script> Inherited service does not establish local delivery';
  const before = plain(api.domainSummary("H"));
  const html = api.reportView() + api.comparisonView();
  assert.doesNotMatch(html, /<script>fail|<img src=x/); assert.match(html, /&lt;script&gt;fail/);
  assert.deepEqual(plain(api.domainSummary("H")), before); assert.equal(api.referenceCounts(catalogue.indicators).total, 0);
});

test("CSV stays a safe summary; full backup retains reference detail and recent history is bounded", () => {
  const { api, state } = setup(); rate(state.indicators["A.1.1"]);
  state.indicators["A.1.1"].rationale = '=HYPERLINK("synthetic.invalid")';
  state.indicators["A.1.1"].evidence = [{ title:"Synthetic source", reference:"PRIVATE-LOCATOR", reviewStatus:"reviewed", note:"PRIVATE-NOTE", limitations:"PRIVATE-LIMIT" }];
  for (let n=0;n<260;n++) api.audit("synthetic", "A.1.1", String(n));
  const csv=api.csvPayload(); assert.match(csv, /"'=HYPERLINK/);
  assert.doesNotMatch(csv, /PRIVATE-LOCATOR|PRIVATE-NOTE|PRIVATE-LIMIT/);
  const full = plain(api.fullBackupPayload(state));
  assert.equal(full.assessment.evidence_led_responses["A.1.1"].evidence[0].reference, "PRIVATE-LOCATOR");
  assert.equal(full.assessment.audit.length, 250); assert.equal(full.assessment.audit[0].reason, "10");
  assert.match(api.reportView(), /at most 250 events; it is not a complete change history/);
});

test("reporting browser harness rejects unknown filters and engines before loading fixtures or browsers", () => {
  for (const invalid of [{ HDRL_BROWSER_CASE: "nonexistent-typo-case" }, { HDRL_BROWSERS: "not-a-browser" }]) {
    const env = { ...process.env, HDRL_BROWSER_CASE: "", HDRL_BROWSERS: "chromium", ...invalid };
    delete env.HDRL_FEEDBACK_FIXTURE;
    const child = spawnSync(process.execPath, [new URL("../scripts/test_self_assessment_reporting.mjs", import.meta.url).pathname], { env, encoding: "utf8" });
    assert.notEqual(child.status, 0);
    assert.match(child.stderr, invalid.HDRL_BROWSER_CASE ? /Unknown HDRL_BROWSER_CASE/ : /Choose unique supported browsers/);
    assert.doesNotMatch(child.stderr, /HDRL_FEEDBACK_FIXTURE is required|Cannot find module/);
  }
});

test("browser receipt rejects started, empty or incomplete cases even if their names match", () => {
  const harnessSource = read("scripts/test_self_assessment_reporting.mjs");
  const predicate = harnessSource.match(/function completedCase\(record\) \{[\s\S]*?\n\}/)?.[0];
  assert.ok(predicate, "Use the actual finalizer predicate");
  const complete = vm.runInNewContext(`${predicate}; completedCase`);
  const good = { passed: true, behaviour_assertions: 1, assertions: { total: 3, failed: 0 }, checks: [{passed:true},{passed:true},{passed:true}] };
  assert.equal(complete(good), true);
  for (const record of [
    { name: "fenland-report-comparison", checks: [] },
    { ...good, passed: undefined },
    { ...good, passed: false },
    { ...good, behaviour_assertions: 0 },
    { ...good, behaviour_assertions: undefined },
    { ...good, assertions: undefined },
    { ...good, assertions: { total: 3, failed: 1 } },
    { ...good, assertions: { total: 1, failed: 0 } },
    { ...good, checks: [{passed:true}] },
    { ...good, checks: [{passed:true},{passed:false},{passed:true}] }
  ]) assert.equal(Boolean(complete(record)), false);
});

// Exercise both supported validated-backup paths, not a hand-built renderer-only state.
for (const schema of ["0.4.0", "0.5.0"]) {
  test(`restored v${schema} comparison uses the current status without rewriting either narrative`, () => {
    const { api, state } = setup();
    state.provenance.implementation_candidate = "2026-10-28.2";
    const input = plain(api.fullBackupPayload(state));
    input.export_schema = `hdrl-self-assessment-export-v${schema}`;
    if (schema === "0.4.0") delete input.assessment.declared_context;
    const refs = ["A.1.1", "E.3.1", "C.1.1", "A.4.1"];
    const statuses = ["rated", "not_known", "not_assessed", "not_applicable"];
    refs.forEach((ref, index) => {
      const status = statuses[index];
      Object.assign(input.assessment.evidence_led_responses[ref], {
        decision: status === "rated" ? "rated" : "not_judged", status,
        level: status === "rated" ? "L3" : "", certainty: status === "rated" ? "medium" : "",
        rationale: `SYNTHETIC rationale ${ref}`, statusReason: `SYNTHETIC current status ${ref}`
      });
      input.assessment.whole_framework_snapshot[ref].note = `SYNTHETIC snapshot ${ref}`;
    });
    const restored = api.restore(input), before = plain(restored), html = api.comparisonView();
    refs.forEach((ref, index) => {
      assert.ok(html.includes(`SYNTHETIC snapshot ${ref}`));
      const current = index === 0 ? `SYNTHETIC rationale ${ref}` : `SYNTHETIC current status ${ref}`;
      const inactive = index === 0 ? `SYNTHETIC current status ${ref}` : `SYNTHETIC rationale ${ref}`;
      assert.ok(html.includes(current), `${ref} current explanation visible`);
      assert.ok(!html.includes(inactive), `${ref} inactive explanation not substituted`);
    });
    assert.deepEqual(plain(restored), before);
    const exported = plain(api.fullBackupPayload(restored));
    assert.deepEqual(exported.assessment.evidence_led_responses, input.assessment.evidence_led_responses);
    assert.deepEqual(exported.assessment.whole_framework_snapshot, input.assessment.whole_framework_snapshot);
    assert.deepEqual(exported.provenance, input.provenance);
    assert.deepEqual(exported.versions, input.versions);
    assert.equal(exported.assessment.id, input.assessment.id);
  });

  test(`restored v${schema} empty active explanations never fall back to inactive text`, () => {
    const { api, state } = setup();
    const input = plain(api.fullBackupPayload(state));
    input.export_schema = `hdrl-self-assessment-export-v${schema}`;
    if (schema === "0.4.0") delete input.assessment.declared_context;
    for (const [index, status] of ["rated", "not_known", "not_assessed", "not_applicable"].entries()) {
      const ref = catalogue.indicators[index].ref;
      Object.assign(input.assessment.evidence_led_responses[ref], {
        decision: status === "rated" ? "rated" : "not_judged", status,
        level: status === "rated" ? "L3" : "", certainty: status === "rated" ? "medium" : "",
        rationale: status === "rated" ? "" : `INACTIVE rationale ${ref}`,
        statusReason: status === "rated" ? `INACTIVE status ${ref}` : ""
      });
      input.assessment.whole_framework_snapshot[ref].note = "<script>SYNTHETIC unsafe note</script>";
    }
    const restored = api.restore(input), before = plain(restored), html = api.comparisonView();
    assert.doesNotMatch(html, /INACTIVE/);
    assert.doesNotMatch(html, /<script>/);
    assert.match(html, /&lt;script&gt;SYNTHETIC unsafe note/);
    // All64 evidence cells and60 empty snapshot cells have their own empty explanation.
    assert.equal((html.match(/No explanation recorded\./g) || []).length, 124);
    assert.deepEqual(plain(restored), before);
    assert.deepEqual(plain(api.fullBackupPayload(restored)).assessment.evidence_led_responses,
      input.assessment.evidence_led_responses);
  });
}
