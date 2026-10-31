// Synthetic, offline browser-function tests. No live assessment or service is used.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
import { test } from "node:test";
import vm from "node:vm";

const file = (relative) => new URL(`../${relative}`, import.meta.url);
const source = readFileSync(file("docs/assets/js/self-assessment.js"), "utf8");
const catalogueBytes = readFileSync(file("docs/data/hdrl-indicators-v1.json"));
const catalogue = JSON.parse(catalogueBytes);
const guidanceBytes = readFileSync(file("docs/data/hdrl-assessment-content-v0.2.0.json"));
const content = JSON.parse(guidanceBytes);
const betaConfig = JSON.parse(readFileSync(file("docs/data/hdrl-assessment-beta-config-v0.3.0.json")));
const plain = (value) => JSON.parse(JSON.stringify(value));

function harness(options = {}) {
  const { stored, bytes = catalogueBytes, assessmentContent = content, assessmentBeta = betaConfig, fetchFailure = false, readFailure = "", deleteFailure = false } = options;
  let storedPresent = Object.hasOwn(options, "stored");
  let storedValue = structuredClone(stored);
  const metrics = { writes: 0, deletes: 0, opens: 0, closes: 0, listeners: [], requests: [], announcements: [], recoveryHandler: null };
  const root = {
    dataset: { catalogueUrl: "catalogue.json", contentUrl: "content.json", betaConfigUrl: "beta.json" },
    innerHTML: "", setAttribute() {}, querySelectorAll() { return []; },
    querySelector(selector) {
      if (selector === '[data-action="export-recovery"]' && root.innerHTML.includes('data-action="export-recovery"')) return { addEventListener(_type, callback) { metrics.recoveryHandler = callback; } };
      return null;
    }
  };
  const document = {
    getElementById(id) {
      if (id === "hdrl-assessment-root") return root;
      if (id === "hdrl-assessment-status") return { setAttribute() {}, set textContent(value) { metrics.announcements.push(value); } };
      return null;
    },
    querySelectorAll() { return []; }, visibilityState: "visible",
    addEventListener(type) { metrics.listeners.push(type); }
  };
  const indexedDB = {
    open() {
      const request = {};
      metrics.opens += 1;
      queueMicrotask(() => {
        if (readFailure === "open" && metrics.opens === 1) {
          request.error = new Error("Synthetic IndexedDB open failure");
          request.onerror();
          return;
        }
        request.result = {
          close() { metrics.closes += 1; },
          transaction(_store, mode) {
            const finishRead = () => queueMicrotask(() => {
              if (readFailure === "abort") tx.onabort();
              else tx.oncomplete();
            });
            const tx = { abort() { queueMicrotask(() => tx.onabort()); }, objectStore() { return {
              get() {
                const result = { result: structuredClone(storedPresent ? storedValue : undefined) };
                queueMicrotask(() => {
                  if (readFailure === "get") {
                    result.error = new Error("Synthetic IndexedDB read failure");
                    result.onerror();
                    return;
                  }
                  result.onsuccess();
                  if (mode === "readonly" && result.result !== undefined) finishRead();
                });
                return result;
              },
              count() {
                const result = { result: storedPresent ? 1 : 0 };
                queueMicrotask(() => {
                  if (readFailure === "count") {
                    result.error = new Error("Synthetic IndexedDB key-count failure");
                    result.onerror();
                    return;
                  }
                  result.onsuccess();
                  if (mode === "readonly") finishRead();
                });
                return result;
              },
              put(value) {
                metrics.writes += 1;
                storedValue = structuredClone(value);
                storedPresent = true;
                queueMicrotask(() => tx.oncomplete());
              },
              delete() {
                metrics.deletes += 1;
                queueMicrotask(() => {
                  if (deleteFailure) {
                    tx.error = new Error("Synthetic deletion failure");
                    tx.onerror();
                  } else {
                    storedValue = undefined;
                    storedPresent = false;
                    tx.oncomplete();
                  }
                });
              }
            }; } };
            return tx;
          }
        };
        request.onsuccess();
      });
      return request;
    }
  };
  const context = vm.createContext({
    document, indexedDB, crypto: webcrypto, TextDecoder, structuredClone,
    setTimeout, clearTimeout, console,
    window: {}, location: { hostname: "localhost" },
    fetch: async (url) => {
      metrics.requests.push(url);
      if (fetchFailure) throw new Error("Synthetic offline failure");
      if (url === "catalogue.json") return { ok: true, arrayBuffer: async () => Uint8Array.from(bytes).buffer };
      if (url === "content.json") return { ok: true, arrayBuffer: async () => Uint8Array.from(assessmentContent === content ? guidanceBytes : Buffer.from(JSON.stringify(assessmentContent))).buffer };
      return { ok: true, json: async () => structuredClone(assessmentBeta) };
    }
  });
  const hook = `globalThis.testApi = {
    VERSIONS, CATALOGUE_SHA256, GUIDANCE_SHA256, COMPATIBILITY_CANDIDATE, defaultState, migrateDraft, draftCompatibility,
    exportPayload, recoveryPayload, downloadRecovery, csvPayload, snapshotCsvPayload, shareBundlePayload,
    reportView, gateView, welcomeView, feedbackView, betaActivityView, derivedFindings, snapshotDomainSummary, domainSummary, summariseLevelValues,
    publicTestMode, betaServiceAvailable, remoteServiceEnabled, recordBetaEvent, updateActiveTime, clearDraft, sampleState,
    saveSnapshotForm, snapshotFormValues, validateSnapshot, snapshotIndicatorView, snapshotReviewView, snapshotStats,
    saveIndicatorForm, indicatorView, reviewView, findingSection, persist, scheduleSave, setView, render, init,
    setInputs(c, g, b) { catalogue = c; content = g; betaConfig = b; },
    setState(value, original) { state = value; originalLoadedDraft = original; hasOriginalLoadedDraft = arguments.length > 1; if (hasOriginalLoadedDraft) storageBaseline = { found: true, value: structuredClone(original) }; },
    getState() { return state; }
  };`;
  assert.match(source, /  init\(\);\n\}\)\(\);\s*$/);
  vm.runInContext(source.replace(/  init\(\);\n\}\)\(\);\s*$/, `${hook}\n})();`), context);
  const api = context.testApi;
  api.setInputs(structuredClone(catalogue), structuredClone(content), structuredClone(assessmentBeta));
  return { api, root, metrics, getStored() { return structuredClone(storedValue); } };
}

function olderDraft(api, schemaVersion = 4) {
  const draft = plain(api.defaultState());
  draft.schemaVersion = schemaVersion;
  draft.versions = { ...draft.versions, framework: "0.9.0", catalogue: "0.8.0", rules: "0.1.0", original_method_label: "synthetic historical method" };
  delete draft.provenance;
  draft.createdAt = "2024-01-01T09:00:00.000Z";
  draft.updatedAt = "2024-02-03T10:00:00.000Z";
  draft.boundary.assessmentDate = "2024-02-01";
  draft.indicators["A.1.1"] = { status: "rated", level: "L3", uncertainty: "low", evidence: [{ title: "Synthetic evidence", supports: "Original annotation" }], updatedAt: "2024-02-01T09:00:00.000Z" };
  return draft;
}

for (const schema of [1, 2, 3, 4]) {
  test(`schema ${schema} migration preserves method identity, dates and original input`, () => {
    const { api } = harness();
    const draft = olderDraft(api, schema);
    const before = structuredClone(draft);
    const migrated = api.migrateDraft(draft, api.defaultState());
    assert.deepEqual(plain(migrated.versions), draft.versions);
    assert.equal(migrated.createdAt, draft.createdAt);
    assert.equal(migrated.updatedAt, draft.updatedAt);
    assert.equal(migrated.boundary.assessmentDate, draft.boundary.assessmentDate);
    assert.equal(migrated.indicators["A.1.1"].level, "L3");
    assert.equal(migrated.provenance.status, "legacy_unknown");
    assert.equal(migrated.provenance.catalogue_sha256, null);
    assert.equal(migrated.formatMigration.reassessed, false);
    assert.equal(api.draftCompatibility(migrated).compatible, false);
    assert.deepEqual(draft, before);
    api.setState(migrated, draft);
    const recovery = plain(api.exportPayload());
    assert.equal(recovery.export_schema, "hdrl-self-assessment-recovery-v0.1.0");
    assert.deepEqual(recovery.original_draft, before);
    assert.equal("derived" in recovery, false);
  });
}

test("missing provenance and dates remain explicitly unknown", () => {
  const { api } = harness();
  const result = api.migrateDraft({ schemaVersion: 4, snapshot: { "A.1.1": { status: "not_known" } } }, api.defaultState());
  assert.deepEqual(plain(result.versions), {});
  assert.equal(result.provenance.status, "legacy_unknown");
  assert.equal(result.createdAt, null);
  assert.equal(result.updatedAt, null);
  assert.equal(result.boundary.assessmentDate, "");
  assert.equal(result.snapshot["A.1.1"].status, "not_known");
  assert.equal(api.draftCompatibility(result).compatible, false);
});

test("unsupported draft formats are preserved for recovery", () => {
  const { api } = harness();
  const original = { schemaVersion: 99, future_response: { important: "synthetic value" }, versions: { framework: "9.9" } };
  const result = api.migrateDraft(original, api.defaultState());
  api.setState(result, original);
  assert.equal(result.schemaVersion, 99);
  assert.equal(api.draftCompatibility().compatible, false);
  assert.deepEqual(plain(api.recoveryPayload().original_draft), original);
});

test("current synthetic exports retain separate method and generator provenance", () => {
  const { api } = harness();
  const draft = api.defaultState();
  draft.boundary.assessmentDate = "2026-01-15";
  api.setState(draft);
  const exported = api.exportPayload();
  assert.equal(api.draftCompatibility().compatible, true);
  assert.deepEqual(plain(exported.versions), plain(api.VERSIONS));
  assert.equal(exported.provenance.catalogue_sha256, api.CATALOGUE_SHA256);
  assert.equal(exported.assessment.boundary.assessmentDate, "2026-01-15");
  assert.equal(exported.generated_by.tool_version, api.VERSIONS.tool);
  assert.equal(exported.generated_by.report_version, api.VERSIONS.report);
  assert.equal(exported.generated_by.implementation_candidate, api.COMPATIBILITY_CANDIDATE);
  assert.equal(exported.provenance.guidance_sha256, api.GUIDANCE_SHA256);
  assert.equal(exported.derived.snapshot_domain_summaries.A.median, "—");
  for (const csv of [api.csvPayload(), api.snapshotCsvPayload()]) {
    for (const key of ["framework", "catalogue", "tool", "guidance", "rules", "report"]) assert.ok(csv.split("\n")[0].includes(`${key}_version`));
    assert.ok(csv.includes(api.CATALOGUE_SHA256));
    assert.ok(csv.includes("2026-01-15"));
  }
  const share = api.shareBundlePayload({ snapshot: true, scopeSummary: "Synthetic service boundary, current period." });
  assert.deepEqual(plain(share.versions), plain(draft.versions));
  assert.equal(share.provenance.catalogue_sha256, api.CATALOGUE_SHA256);
  draft.registration.unlocked = true;
  const report = api.reportView();
  for (const hash of [api.CATALOGUE_SHA256, api.GUIDANCE_SHA256]) {
    const display = hash.match(/.{1,16}/g).join("<wbr>");
    assert.ok(report.includes(`<code>${display}</code>`));
    assert.equal(display.replaceAll("<wbr>", ""), hash);
  }
});

test("a compatible earlier implementation retains its original provenance", () => {
  for (const candidate of ["2026-10-26.1", "2026-10-26.2", "2026-10-28.1", "2026-10-28.2", "2026-10-28.3", "2026-10-29.1", "2026-10-29.2"]) {
    const { api } = harness();
    const draft = plain(api.defaultState());
    draft.provenance.implementation_candidate = candidate;
    draft.boundary.assessmentDate = "2024-02-01";
    const migrated = api.migrateDraft(draft, api.defaultState());
    api.setState(migrated, draft);
    assert.equal(api.draftCompatibility().compatible, true);
    const exported = plain(api.exportPayload());
    assert.equal(exported.provenance.implementation_candidate, candidate);
    assert.equal(exported.generated_by.implementation_candidate, "2026-10-31.2");
    assert.equal(exported.assessment.boundary.assessmentDate, "2024-02-01");
    assert.deepEqual(exported.versions, draft.versions);
  }
});

function snapshotOnlyDraft(api) {
  const draft = api.defaultState();
  draft.registration.unlocked = true;
  draft.boundary.assessmentDate = "2026-01-15";
  for (const indicator of catalogue.indicators) {
    draft.snapshot[indicator.ref] = {
      status: "rated", level: "L3", certainty: "medium", note: "Synthetic snapshot note",
      certaintyReasons: [], clarity: "clear", updatedAt: "2026-01-15T12:00:00.000Z"
    };
  }
  return draft;
}

test("complete snapshot report shows selections without inferring untouched evidence gaps", () => {
  const { api } = harness();
  const draft = snapshotOnlyDraft(api);
  api.setState(draft);
  const before = plain(api.exportPayload());
  const report = api.reportView();
  assert.match(report, /64 indicators have a provisional level selection/);
  assert.match(report, /The evidence-led pass was not undertaken/);
  assert.match(report, /data-action="snapshot-review">Revise assessment/);
  assert.doesNotMatch(report, /Evidence-led domain profile|0 of 64 indicators have a maturity judgement|64 are not assessed or not started|Suggested questions to investigate/);
  assert.match(report, /The optional orientation was not undertaken/);
  const table = report.split('aria-label="Snapshot selections by indicator"')[1].split("</table>")[0];
  assert.equal((table.match(/<th scope="row">/g) || []).length, 64);
  assert.equal((table.match(/Medium certainty/g) || []).length, 64);
  for (const indicator of catalogue.indicators) {
    const escape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
    assert.ok(table.includes(escape(indicator.maturity_levels.L3)), `${indicator.ref} selected canonical description`);
  }
  const exported = plain(api.exportPayload());
  assert.equal(exported.derived.evidence_stage_status, "not_started");
  assert.deepEqual(exported.derived.findings, { supported: [], provisional: [], questions: [], actions: [] });
  assert.deepEqual(exported.derived.snapshot_domain_summaries, before.derived.snapshot_domain_summaries);
  assert.deepEqual(exported.assessment.whole_framework_snapshot, before.assessment.whole_framework_snapshot);
  assert.deepEqual(exported.provenance, before.provenance);
  assert.equal(exported.assessment.boundary.assessmentDate, "2026-01-15");
});

test("snapshot report preserves unknowns, missing certainty and inert notes", () => {
  const { api } = harness();
  const draft = snapshotOnlyDraft(api);
  const refs = catalogue.indicators.map((indicator) => indicator.ref);
  for (const [index, status] of ["not_known", "not_assessed", "not_applicable", "unstarted"].entries()) {
    draft.snapshot[refs[index]] = { ...draft.snapshot[refs[index]], status, level: "", certainty: "" };
  }
  draft.snapshot[refs[4]].certainty = "";
  draft.snapshot[refs[4]].note = '<img src=x onerror="alert(1)">';
  api.setState(draft);
  const report = api.reportView();
  assert.match(report, /60 indicators have a provisional level selection; 1 are not known; 1 are not assessed; 1 are marked not applicable/);
  assert.match(report, /1 rated indicators have no certainty recorded/);
  assert.match(report, /1 indicators were not completed/);
  for (const status of ["Not known", "Not assessed", "Not applicable", "Not started"]) assert.ok(report.includes(`<td>${status}</td>`));
  assert.match(report, /Certainty not recorded/);
  assert.ok(report.includes("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"));
  assert.doesNotMatch(report, /<img src=x/);
  const exported = plain(api.exportPayload());
  for (const ref of refs.slice(0, 4)) assert.equal(exported.assessment.whole_framework_snapshot[ref].level, "");
});

test("chosen evidence unknowns and partial work remain visible with traceable guidance", () => {
  for (const status of ["not_known", "not_assessed", "rated"]) {
    const { api } = harness();
    const draft = snapshotOnlyDraft(api);
    draft.indicators["A.1.1"] = {
      decision: status === "rated" ? "rated" : "not_judged", status,
      level: status === "rated" ? "L4" : "", certainty: "low",
      rationale: "Synthetic evidence-stage rationale", statusReason: "Explicitly reviewed",
      improvementNote: "", evidence: [], updatedAt: "2026-01-15T12:00:00.000Z"
    };
    api.setState(draft);
    const expectedFindings = plain(api.derivedFindings());
    const report = api.reportView();
    assert.match(report, /Evidence-led domain profile/);
    assert.match(report, /Evidence-led indicator results/);
    assert.ok(report.includes(status === "rated" ? "Synthetic evidence-stage rationale" : "Explicitly reviewed"));
    assert.ok(!report.includes(status === "rated" ? "Explicitly reviewed" : "Synthetic evidence-stage rationale"));
    assert.doesNotMatch(report, /The evidence-led pass was not undertaken/);
    assert.match(report, /Suggested because .*you recorded low certainty/);
    assert.doesNotMatch(report.replace(/<details>[\s\S]*?<\/details>/g, ""), /R-LOW-CERTAINTY|R-NOT-ASSESSED|R-EVIDENCE-GAP/);
    const exported = plain(api.exportPayload());
    assert.equal(exported.derived.evidence_stage_status, "started");
    assert.deepEqual(exported.derived.findings, expectedFindings);
    assert.equal(exported.assessment.evidence_led_responses["A.1.1"].status, status);
    assert.equal(exported.assessment.evidence_led_responses["A.1.1"].rationale, "Synthetic evidence-stage rationale");
    assert.equal(exported.assessment.evidence_led_responses["A.1.1"].statusReason, "Explicitly reviewed");
  }
});

test("each incompatible method field blocks editing, derived output and persistence", async () => {
  for (const key of ["framework", "catalogue", "tool", "guidance", "rules", "report", "catalogue_sha256", "guidance_sha256"]) {
    const { api, metrics } = harness();
    const draft = api.defaultState();
    if (["catalogue_sha256", "guidance_sha256"].includes(key)) draft.provenance[key] = "0".repeat(64);
    else draft.versions[key] = "other-method";
    api.setState(draft, plain(draft));
    const before = plain(draft);
    for (const fn of [api.derivedFindings, () => api.domainSummary("A"), () => api.snapshotDomainSummary("A"), api.csvPayload, api.snapshotCsvPayload, () => api.shareBundlePayload({ snapshot: true }), () => api.saveSnapshotForm({}), () => api.saveIndicatorForm({}), () => api.setView("report")]) {
      assert.throws(fn, /original method/);
    }
    assert.match(api.reportView(), /original method/);
    await api.persist();
    api.scheduleSave();
    assert.equal(metrics.writes, 0);
    assert.deepEqual(plain(draft), before);
  }
});

test("recovery UI escapes original metadata and offers only recovery", () => {
  const { api, root } = harness();
  const draft = api.defaultState();
  draft.versions.framework = '<img src=x onerror="bad()">';
  api.setState(draft, plain(draft));
  api.render();
  assert.ok(root.innerHTML.includes("&lt;img"));
  assert.equal(root.innerHTML.includes("<img"), false);
  assert.deepEqual([...root.innerHTML.matchAll(/data-action="([^"]+)"/g)].map((match) => match[1]), ["export-recovery"]);
});

test("unchanged ordinal convention keeps actual middle categories and unknowns separate", () => {
  const { api } = harness();
  const draft = api.defaultState();
  api.setState(draft);
  assert.equal(api.summariseLevelValues([2, 4]).median, "L2–L4");
  const refs = catalogue.indicators.filter((item) => item.domain === "A" && item.type === "Core" && item.applicability_class !== "Y").map((item) => item.ref);
  assert.ok(refs.length >= 3, "The synthetic case must use real applicable Core references");
  for (const status of ["not_known", "not_assessed", "not_applicable", "unstarted"]) {
    draft.snapshot = {};
    draft.indicators = {};
    // A stray level attached to a non-rated response must not enter the summary.
    draft.snapshot[refs[0]] = { status, level: "L1", certainty: "" };
    draft.indicators[refs[0]] = { status, level: "L1", certainty: "" };
    assert.equal(api.snapshotDomainSummary("A").median, "—");
    assert.equal(api.domainSummary("A").count, 0);
    for (const [index, level] of [[1, "L2"], [2, "L4"]]) {
      draft.snapshot[refs[index]] = { status: "rated", level, certainty: "medium" };
      draft.indicators[refs[index]] = { status: "rated", level, certainty: "medium" };
    }
    assert.equal(api.snapshotDomainSummary("A").median, "L2–L4");
    assert.equal(api.snapshotDomainSummary("A").count, 2);
    assert.equal(api.domainSummary("A").median, "L2–L4");
    assert.equal(api.domainSummary("A").count, 2);
  }
});

test("bootstrap verifies the adopted catalogue and leaves historical storage untouched", async () => {
  const temporary = harness();
  const stored = olderDraft(temporary.api);
  const before = structuredClone(stored);
  const { api, root, metrics } = harness({ stored });
  await api.init();
  assert.match(root.innerHTML, /Your saved assessment needs its original method/);
  assert.equal(metrics.writes, 0);
  assert.deepEqual(metrics.listeners, []);
  assert.deepEqual(metrics.requests, ["catalogue.json", "content.json", "beta.json"]);
  assert.deepEqual(plain(api.recoveryPayload().original_draft), before);
});

test("bootstrap rejects changed catalogue bytes and changed guidance/rules", async () => {
  for (const options of [
    { bytes: Buffer.concat([catalogueBytes, Buffer.from(" ")]) },
    { assessmentContent: { ...content, recommendation_rules_version: "unknown" } },
    { assessmentContent: { ...content, same_version_mutation: "changed guidance under identical version labels" } }
  ]) {
    const { api, root, metrics } = harness(options);
    await api.init();
    assert.match(root.innerHTML, /We could not load the assessment prototype/);
    assert.match(root.innerHTML, /hash does not match|versions do not match/);
    assert.equal(metrics.writes, 0);
    assert.deepEqual(metrics.listeners, []);
  }
});

test("fresh bootstrap accepts the current adopted catalogue", async () => {
  const { api, root, metrics } = harness();
  await api.init();
  assert.equal(api.draftCompatibility().compatible, true);
  assert.equal(root.innerHTML.includes("We could not load"), false, root.innerHTML);
  assert.ok(root.innerHTML.includes("data-action=\"start\""));
  assert.deepEqual(metrics.listeners, ["visibilitychange"]);
});

test("package rejection or fetch failure still offers unmodified local recovery", async () => {
  const temporary = harness();
  const stored = olderDraft(temporary.api, 1);
  for (const options of [{ fetchFailure: true }, { bytes: Buffer.from("{}") }]) {
    const { api, root, metrics } = harness({ stored, ...options });
    await api.init();
    assert.match(root.innerHTML, /Download original draft JSON/);
    assert.equal(typeof metrics.recoveryHandler, "function");
    const payload = api.recoveryPayload();
    assert.equal(payload.compatibility.compatible, false);
    assert.deepEqual(plain(payload.original_draft), stored);
    assert.equal(metrics.writes, 0);
  }
});

test("storage read failures cannot create or autosave a replacement draft", async () => {
  const temporary = harness();
  const original = olderDraft(temporary.api);
  for (const readFailure of ["open", "get", "abort"]) {
    const { api, root, metrics, getStored } = harness({ stored: original, readFailure });
    await api.init();
    assert.match(root.innerHTML, /on-device draft could not be read/);
    assert.equal(api.getState(), undefined);
    assert.equal(api.draftCompatibility().compatible, false);
    assert.equal(root.innerHTML.includes('data-action="start"'), false);
    assert.equal(root.innerHTML.includes('data-action="export-recovery"'), false);
    assert.equal(root.innerHTML.includes("Your original draft remains"), false);
    assert.equal(metrics.recoveryHandler, null);
    assert.deepEqual(metrics.listeners, []);
    assert.deepEqual(metrics.requests, []);
    await api.persist();
    api.scheduleSave();
    assert.equal(metrics.writes, 0);
    assert.deepEqual(getStored(), original);
    assert.equal(metrics.opens, 1);
    assert.equal(metrics.closes, readFailure === "open" ? 0 : 1);
  }
});

test("successful falsy and malformed reads preserve the original value in recovery", async () => {
  for (const stored of [null, false, 0, "", [], undefined]) {
    for (const fetchFailure of [false, true]) {
      const { api, root, metrics, getStored } = harness({ stored, fetchFailure });
      await api.init();
      assert.equal(api.draftCompatibility().compatible, false);
      assert.match(root.innerHTML, /Download original draft JSON/);
      const recovery = api.recoveryPayload();
      if (stored === undefined) {
        assert.equal(recovery.original_draft, null);
        assert.equal(recovery.original_draft_value_type, "undefined");
      } else assert.deepEqual(plain(recovery.original_draft), stored);
      assert.equal("derived" in recovery, false);
      await api.persist();
      assert.equal(metrics.writes, 0);
      assert.deepEqual(getStored(), stored);
      assert.equal(metrics.closes, 1);
    }
  }
});

test("failure checking an undefined record's key presence also fails closed", async () => {
  const { api, root, metrics, getStored } = harness({ stored: undefined, readFailure: "count" });
  await api.init();
  assert.match(root.innerHTML, /on-device draft could not be read/);
  assert.equal(api.getState(), undefined);
  assert.equal(root.innerHTML.includes('data-action="export-recovery"'), false);
  await api.persist();
  assert.equal(metrics.writes, 0);
  assert.equal(metrics.closes, 1);
  assert.equal(getStored(), undefined);
});

test("non-JSON structured-clone values cannot offer lossy recovery or become editable", async () => {
  const cycle = { note: "synthetic cycle" };
  cycle.self = cycle;
  const extraArray = ["synthetic"];
  extraArray.extra = "would disappear";
  const values = [
    NaN, Infinity, -Infinity, -0, 12n,
    { nested: { missing: undefined } }, { nested: [undefined] },
    { nested: { count: NaN } }, { nested: { count: 12n } },
    new Date("2026-01-15T12:00:00Z"), new Map([["synthetic", "value"]]), new Set(["synthetic"]),
    new Uint8Array([1, 2]), new ArrayBuffer(2), new DataView(new ArrayBuffer(2)),
    /synthetic/, new Error("Synthetic stored error"), new Number(4),
    new Array(2), extraArray, cycle, { nested: cycle }
  ];
  const current = plain(harness().api.defaultState());
  values.push({ ...current, unknown_original_field: { count: 12n } });
  for (const stored of values) {
    for (const options of [{}, { fetchFailure: true }, { bytes: Buffer.from("{}") }]) {
      const { api, root, metrics, getStored } = harness({ stored, ...options });
      await api.init();
      assert.match(root.innerHTML, /original draft remains on this device/);
      assert.match(root.innerHTML, /JSON recovery is unavailable/);
      assert.equal(root.innerHTML.includes('data-action="export-recovery"'), false);
      assert.equal(root.innerHTML.includes('data-action="start"'), false);
      assert.equal(root.innerHTML.includes("<input"), false);
      assert.equal(metrics.recoveryHandler, null);
      assert.equal(api.draftCompatibility().compatible, false);
      assert.equal(api.recoveryPayload(), null);
      assert.equal(api.exportPayload(), null);
      assert.doesNotThrow(() => api.downloadRecovery());
      await api.persist();
      api.scheduleSave();
      assert.equal(metrics.writes, 0);
      assert.deepEqual(metrics.listeners, []);
      assert.deepEqual(getStored(), stored);
    }
  }
});

test("JSON-safe nested original records keep their exact recovery values", async () => {
  const stored = {
    schemaVersion: 99,
    original: { text: "Synthetic quotation: \"test\"", number: 1.25, zero: 0, empty: "", yes: true, no: false, missing: null },
    nested: [[], {}, [null, 0, false, ""], { more: [{ value: "retained" }] }]
  };
  for (const fetchFailure of [false, true]) {
    const { api, root, metrics, getStored } = harness({ stored, fetchFailure });
    await api.init();
    assert.match(root.innerHTML, /Download original draft JSON/);
    assert.deepEqual(JSON.parse(JSON.stringify(api.recoveryPayload())).original_draft, stored);
    assert.deepEqual(getStored(), stored);
    assert.equal(metrics.writes, 0);
  }
});

test("public test opens report without registration and creates no activity diagnostics", () => {
  const { api } = harness();
  const draft = api.defaultState();
  api.setState(draft);
  const registration = plain(draft.registration);
  const beta = plain(draft.beta);
  assert.equal(api.publicTestMode(), true);
  assert.equal(api.betaServiceAvailable(), false);
  assert.equal(api.remoteServiceEnabled(), false);
  assert.equal(beta.telemetryEnabled, false);
  assert.equal(beta.localActivityId, "");
  assert.match(api.gateView(), /id="hdrl-generated-report"/);
  assert.doesNotMatch(api.gateView(), /id="gate-email"|id="hdrl-gate-form"|data-action="feedback"/);
  assert.doesNotMatch(api.welcomeView(), /telemetry-off|local diagnostic record/);
  assert.doesNotMatch(api.feedbackView(), /id="hdrl-feedback-form"/);
  assert.doesNotMatch(api.betaActivityView(), /data-action="export-beta-activity"/);
  api.recordBetaEvent("assessment_started", { entry_point: "synthetic" });
  api.updateActiveTime();
  assert.deepEqual(plain(draft.beta), beta);
  assert.deepEqual(plain(draft.registration), registration);
  assert.equal(draft.registration.unlocked, false, "Test access is not recorded as verified registration");
  const sample = api.sampleState();
  assert.equal(sample.registration.email, "");
  assert.equal(sample.registration.unlocked, false);
  assert.deepEqual(plain(sample.beta.events), []);
});

test("public mode preserves existing draft contact and diagnostic history without new collection", async () => {
  const original = plain(harness().api.defaultState());
  original.registration.email = "old-synthetic@example.invalid";
  original.beta.telemetryEnabled = true;
  original.beta.activeSeconds = 123;
  original.beta.localActivityId = "existing-synthetic-local-id";
  original.beta.events = [{ name: "assessment_started", at: "2024-01-01T00:00:00.000Z" }];
  original.provenance.implementation_candidate = "2026-10-28.1";
  const { api, root, metrics, getStored } = harness({ stored: original });
  await api.init();
  api.recordBetaEvent("assessment_started", { entry_point: "synthetic" });
  api.updateActiveTime();
  assert.deepEqual(plain(api.getState().beta), original.beta);
  assert.deepEqual(plain(api.getState().registration), original.registration);
  assert.equal(api.getState().provenance.implementation_candidate, "2026-10-28.1");
  assert.equal(metrics.writes, 0);
  assert.deepEqual(getStored(), original);
  assert.doesNotMatch(root.innerHTML, /old-synthetic@example.invalid/);
});

test("public test configuration rejects every conflicting collection flag without changing a draft", async () => {
  const conflicts = [
    ["transport", "remote_collection_enabled", true],
    ["transport", "local_preview_enabled", true],
    ["transport", "supabase_publishable_key", "sb_publishable_synthetic"],
    ["plausible", "enabled", true],
    ...["local_beta_events", "feedback_checkpoint", "contactable_feedback", "feedback_without_contact_details", "email_verification"].map((key) => ["feature_flags", key, true]),
    ["feature_flags", "public_test_mode", "true"]
  ];
  const original = plain(harness().api.defaultState());
  for (const [group, key, value] of conflicts) {
    const config = structuredClone(betaConfig);
    config[group][key] = value;
    const { api, root, metrics, getStored } = harness({ stored: original, assessmentBeta: config });
    await api.init();
    assert.match(root.innerHTML, /Public test mode requires|public test mode setting/);
    assert.doesNotMatch(root.innerHTML, /id="hdrl-generated-report"|id="gate-email"/);
    assert.equal(metrics.writes, 0, `${group}.${key} must not save`);
    assert.deepEqual(getStored(), original);
    assert.deepEqual(plain(api.recoveryPayload().original_draft), original);
    assert.deepEqual(metrics.requests, ["catalogue.json", "content.json", "beta.json"]);
  }
});

test("non-test product path retains report registration and verification screens", () => {
  const config = structuredClone(betaConfig);
  config.feature_flags.public_test_mode = false;
  config.feature_flags.local_beta_events = true;
  config.feature_flags.feedback_checkpoint = true;
  config.feature_flags.email_verification = true;
  const { api } = harness({ assessmentBeta: config });
  const draft = api.defaultState();
  api.setState(draft);
  assert.equal(api.publicTestMode(), false);
  assert.match(api.reportView(), /id="hdrl-gate-form"/);
  assert.match(api.reportView(), /id="gate-email"/);
  assert.doesNotMatch(api.reportView(), /id="hdrl-generated-report"/);
  draft.registration.challengeId = "synthetic-only-code-pending";
  assert.match(api.gateView(), /Enter the six-digit code/);
  draft.registration.unlocked = true;
  assert.match(api.reportView(), /id="hdrl-generated-report"/);
});

test("failed draft deletion preserves the draft and reports failure; successful deletion resets", async () => {
  for (const deleteFailure of [true, false]) {
    const original = plain(harness().api.defaultState());
    original.boundary.title = "Synthetic retained draft";
    const { api, metrics, getStored } = harness({ stored: original, deleteFailure });
    api.setState(structuredClone(original), structuredClone(original));
    await api.clearDraft();
    assert.equal(metrics.deletes, 1);
    if (deleteFailure) {
      assert.deepEqual(plain(api.getState()), original);
      assert.deepEqual(getStored(), original);
      assert.match(metrics.announcements.at(-1), /Deletion could not be confirmed/);
      assert.doesNotMatch(metrics.announcements.at(-1), /has been deleted/);
    } else {
      assert.equal(getStored(), undefined);
      assert.equal(api.getState().boundary.title, "");
      assert.match(metrics.announcements.at(-1), /has been deleted/);
    }
  }
});

// Feedback batch 1: behaviour complements the isolated real-browser regressions.
const formWith = (values, checked = []) => ({
  elements: Object.fromEntries(Object.entries(values).map(([key, value]) => [key, { value }])),
  querySelectorAll() { return checked.map((value) => ({ value })); }
});

test("FB-01 actions survive all non-rated saves without changing level or evidence semantics", async () => {
  for (const status of ["not_known", "not_assessed", "not_applicable"]) {
    const { api, getStored } = harness();
    const draft = api.defaultState();
    draft.activeIndicator = "E.3.1";
    api.setState(draft);
    const originalMedian = plain(api.domainSummary("E"));
    const action = "Ask the owner <without claiming an evidence gap> & review scope.";
    api.saveIndicatorForm(formWith({
      "indicator-decision": "not_judged", "indicator-status": status,
      "indicator-level": "L5", "indicator-certainty": "high", "indicator-rationale": "Unused",
      "indicator-improvement": action, "indicator-status-reason": "Synthetic deliberate non-rating"
    }));
    await api.persist();
    const saved = getStored().indicators["E.3.1"];
    assert.equal(saved.improvementNote, action);
    assert.equal(saved.status, status);
    assert.equal(saved.level, "");
    assert.equal(saved.certainty, "");
    assert.deepEqual(saved.evidence, []);
    assert.deepEqual(plain(api.domainSummary("E")), originalMedian);
    const exported = plain(api.exportPayload());
    assert.equal(exported.assessment.evidence_led_responses["E.3.1"].improvementNote, action);
    assert.deepEqual(exported.derived.findings.actions, [{ ref: "E.3.1", text: action, rule: "R-USER-ACTION" }]);
    if (status === "not_applicable") assert.equal(exported.derived.findings.questions.some((x) => x.ref === "E.3.1"), false);
    assert.match(api.reportView(), /Ask the owner &lt;without claiming an evidence gap&gt; &amp; review scope/);
    assert.match(api.reportView(), /You entered this action/);
    const reload = harness({ stored: getStored() });
    await reload.api.init();
    assert.equal(reload.api.getState().indicators["E.3.1"].improvementNote, action);
  }
});

test("FB-02 failed certainty validation renders temporary input without completing or replacing a response", () => {
  for (const existing of [false, true]) {
    const { api, metrics } = harness();
    const draft = api.defaultState();
    draft.activeIndicator = "A.1.2";
    if (existing) draft.snapshot["A.1.2"] = { status: "rated", level: "L2", certainty: "high", note: "Previously saved", clarity: "clear", certaintyReasons: [] };
    api.setState(draft);
    api.snapshotIndicatorView(); // Normal rendering initialises an empty, unstarted row.
    const completed = api.snapshotStats().completed;
    const before = plain(draft.snapshot);
    const form = formWith({ "snapshot-level": "L3", "snapshot-status": "", "snapshot-certainty": "", "snapshot-clarity": "unclear", "snapshot-note": "Keep <my note> & choice" });
    const errors = api.validateSnapshot(form);
    assert.deepEqual(plain(errors), { "hdrl-snapshot-certainty-panel": "Choose high, medium or low certainty." });
    const html = api.snapshotIndicatorView(errors, api.snapshotFormValues(form));
    assert.match(html, /id="snapshot-level-L3"[^>]*checked/);
    assert.match(html, /Keep &lt;my note&gt; &amp; choice/);
    assert.match(html, /name="snapshot-clarity"[^>]*value="unclear"[^>]*checked/);
    assert.match(html, /role="alert"/);
    assert.deepEqual(plain(draft.snapshot), before);
    assert.equal(api.snapshotStats().completed, completed);
    assert.equal(metrics.writes, 0);
    form.elements["snapshot-certainty"].value = "medium";
    assert.deepEqual(plain(api.validateSnapshot(form)), {});
    api.saveSnapshotForm(form);
    assert.equal(draft.snapshot["A.1.2"].level, "L3");
    assert.equal(draft.snapshot["A.1.2"].note, "Keep <my note> & choice");
    assert.equal(draft.snapshot["A.1.2"].certainty, "medium");
  }
});

test("FB-03 review queues expose all unresolved items once with every reason, excluding explained N/A", () => {
  const { api } = harness();
  const draft = api.defaultState();
  api.setState(draft);
  const initial = api.snapshotReviewView();
  assert.equal((initial.match(/data-action="open-snapshot" data-ref=/g) || []).length, 64);
  draft.snapshot["E.3.1"] = { ...draft.snapshot["E.3.1"], status: "not_known", certainty: "low", clarity: "unclear", note: "Ask the representative" };
  draft.snapshot["H.3.1"] = { ...draft.snapshot["H.3.1"], status: "not_assessed" };
  draft.snapshot["A.4.1"] = { ...draft.snapshot["A.4.1"], status: "not_applicable", note: "Outside the synthetic scope" };
  let html = api.snapshotReviewView();
  assert.equal((html.match(/data-action="open-snapshot" data-ref=/g) || []).length, 63);
  assert.equal((html.match(/data-action="open-snapshot" data-ref="E\.3\.1"/g) || []).length, 1);
  assert.match(html, /Not known · Low certainty · Level wording flagged/);
  assert.match(html, /Not assessed — left for later/);
  assert.doesNotMatch(html, /data-action="open-snapshot" data-ref="A\.4\.1"/);
  api.reviewView();
  draft.indicators["E.3.1"].status = "not_known"; // Also missing explanation: both reasons in one row.
  draft.indicators["A.4.1"].status = "not_applicable";
  draft.indicators["A.4.1"].statusReason = "Explicitly outside boundary";
  html = api.reviewView();
  assert.equal((html.match(/data-action="open-indicator" data-ref=/g) || []).length, 63);
  assert.equal((html.match(/data-action="open-indicator" data-ref="E\.3\.1"/g) || []).length, 1);
  assert.match(html, /Missing explanation · Knowledge gap/);
  assert.doesNotMatch(html, /data-action="open-indicator" data-ref="A\.4\.1"/);
});

test("FB-04/05 complete HTML lists link every finding to its input with plain provenance; JSON retains rule IDs", () => {
  const { api } = harness();
  const draft = api.defaultState();
  api.setState(draft);
  api.reviewView();
  for (const indicator of catalogue.indicators) {
    Object.assign(draft.indicators[indicator.ref], { status: "rated", level: "L3", certainty: "high", rationale: "Synthetic", improvementNote: `Action for ${indicator.ref}` });
  }
  const findings = plain(api.derivedFindings());
  for (const [name, items] of Object.entries(findings)) {
    const html = api.findingSection(name, items, "None");
    assert.equal((html.match(/<li>/g) || []).length, items.length);
    for (const item of items) assert.ok(html.includes(`data-action="open-indicator" data-ref="${item.ref}"`));
    assert.doesNotMatch(html, /R-USER-ACTION|R-EVIDENCE-GAP|additional items.*JSON/);
  }
  assert.match(api.reportView(), /You entered this action/);
  assert.deepEqual(plain(api.exportPayload().derived.findings), findings);
  draft.indicators["E.3.1"].status = "not_known";
  draft.indicators["E.3.1"].level = "";
  draft.indicators["H.3.1"].status = "not_assessed";
  draft.indicators["H.3.1"].level = "";
  draft.indicators["F.1.1"].certainty = "low";
  draft.indicators["A.1.1"].evidence = [{ title: "Synthetic only", reviewStatus: "reviewed" }];
  const report = api.reportView();
  assert.match(report, /Suggested because you selected Not known/);
  assert.match(report, /Suggested because you recorded low certainty/);
  assert.match(report, /Suggested because you left this indicator for a later assessment/);
  assert.match(report, /You marked a reference reviewed or accepted. The tool has not independently checked it/);
});


test("FB-07 context is declared, never inferred; format migration preserves provenance", () => {
  const { api } = harness();
  const original = plain(api.defaultState());
  original.schemaVersion = 5;
  delete original.declaredContext;
  original.boundary.title = "Synthetic name alone is not a declaration";
  original.provenance.implementation_candidate = "2026-10-28.3";
  const migrated = api.migrateDraft(original, api.defaultState());
  assert.equal(migrated.declaredContext, "unspecified");
  assert.equal(migrated.schemaVersion, 6);
  assert.deepEqual(plain(migrated.provenance), original.provenance);
  assert.equal(migrated.formatMigration.reassessed, false);
  api.setState(migrated);
  const exported = plain(api.exportPayload());
  assert.equal(exported.export_schema, "hdrl-self-assessment-export-v0.5.0");
  assert.equal(exported.assessment.declared_context, "unspecified");
  assert.equal(api.sampleState().declaredContext, "synthetic");
});

test("FB-07 minimised shares include reviewed context and exclude private unselected text", () => {
  const { api } = harness();
  const draft = api.sampleState();
  Object.assign(draft.boundary, { title: "SECRET_TITLE", serviceName: "SECRET_SERVICE", scope: "SECRET_SCOPE", intendedUse: "SECRET_INTENT" });
  draft.domainNotes.A = "SECRET_DOMAIN";
  draft.rapid.A.note = "SECRET_ORIENTATION";
  draft.snapshot["A.1.1"].note = "SECRET_COMMENT";
  draft.snapshot["A.1.2"] = { status: "not_applicable", level: "", certainty: "", clarity: "", note: "SECRET_NA" };
  draft.provenance.extra = "SECRET_PROVENANCE_EXTRA";
  draft.versions.extra = "SECRET_VERSION_EXTRA";
  draft.registration.name = "SECRET_CONTACT";
  draft.audit = [{ reason: "SECRET_HISTORY" }];
  api.setState(draft);
  const options = { snapshot: true, scopeSummary: "Selected service function this year", declaredContext: "synthetic", naContext: "A.1.2 is outside this selected boundary." };
  const shared = plain(api.shareBundlePayload(options));
  assert.doesNotMatch(JSON.stringify(shared), /SECRET_/);
  assert.equal(shared.schema, "hdrl-explicit-results-share-v0.2.0");
  assert.equal(shared.restorable, false);
  assert.equal(shared.assessment_id, draft.id);
  assert.equal(shared.declared_context, "synthetic");
  assert.equal(shared.boundary_summary.assessment_date, draft.boundary.assessmentDate);
  assert.deepEqual(shared.boundary_summary.not_applicable.indicator_refs, ["A.1.2"]);
  assert.equal(shared.boundary_summary.not_applicable.explanation, options.naContext);
  assert.equal(shared.provenance.implementation_candidate, draft.provenance.implementation_candidate);
  assert.equal(shared.evidence_led, undefined);
  assert.match(JSON.stringify(api.shareBundlePayload({ ...options, comments: true })), /SECRET_COMMENT/);
  assert.throws(() => api.shareBundlePayload({ ...options, naContext: "" }), /Explain the N\/A/);
  assert.throws(() => api.shareBundlePayload({ ...options, scopeSummary: "" }), /scope summary/);
  assert.throws(() => api.shareBundlePayload({ ...options, evidenceRecords: true }), /Choose evidence-led/);
});
