// Pure backup validation: invented records, no browser storage, network or scoring.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
import { test } from "node:test";
import vm from "node:vm";

const file = (relative) => new URL(`../${relative}`, import.meta.url);
const source = readFileSync(file("docs/assets/js/self-assessment-portability.js"), "utf8");
const catalogue = JSON.parse(readFileSync(file("docs/data/hdrl-indicators-v1.json"), "utf8"));
const context = vm.createContext({ TextEncoder,
  fetch() { throw new Error("Unexpected network access"); },
  get document() { throw new Error("Unexpected DOM access"); },
  get indexedDB() { throw new Error("Unexpected storage access"); }
});
vm.runInContext(source, context);
const parse = (value) => context.HDRLPortability.parseBackup(typeof value === "string" ? value : JSON.stringify(value), catalogue);
const plain = (value) => JSON.parse(JSON.stringify(value));
const timestamp = "2026-10-28T16:51:07.310Z";
const snapshot = (patch = {}) => ({ status: "rated", level: "L3", certainty: "medium", certaintyReasons: [],
  clarity: "", note: "Invented snapshot note", updatedAt: timestamp, ...patch });
const evidence = (patch = {}) => ({ decision: "rated", status: "rated", level: "L3", certainty: "medium",
  rationale: "Invented rationale", improvementNote: "Invented next action", statusReason: "", evidence: [],
  updatedAt: timestamp, ...patch });
const reference = (patch = {}) => ({ id: "synthetic-reference-1", title: "Invented reference", type: "Other",
  reference: "EXAMPLE-ONLY", owner: "Invented team", date: "", note: "No real record", limitations: "Synthetic only",
  reviewStatus: "unreviewed", ...patch });
function fixture() {
  return {
    export_schema: "hdrl-self-assessment-export-v0.4.0", exported_at: timestamp,
    versions: { framework: "1.0.1", catalogue: "1.0.2", tool: "0.5.0-beta", guidance: "0.2.0", rules: "0.2.0", report: "0.4.0", beta: "0.3.0" },
    provenance: { status: "recorded", catalogue_sha256: "442a10be23a0ddec889785577fb8853db2296cc5b3a50929849025e27077cd47",
      guidance_sha256: "1118cb773ca4ecc2bff06d2612d14b756134bda04603c43dd18604f4df36f92f", implementation_candidate: "2026-10-28.2" },
    generated_by: { tool_version: "0.5.0-beta", report_version: "0.4.0", implementation_candidate: "2026-10-28.3" },
    assessment: {
      id: "invented-assessment-1", created_at: timestamp, updated_at: timestamp,
      boundary: { title: "SYNTHETIC test", serviceName: "Invented service", scope: "No real organisation",
        timePeriod: "October 2026", assessmentDate: "2026-10-28", unit: "service", method: "individual", intendedUse: "Test only" },
      rapid_first_pass: { A: { impression: "defined", certainty: "medium", note: "Invented impression" } },
      whole_framework_snapshot: { "C.1.1": snapshot() }, domain_capacity_notes: { A: "Invented capacity note" },
      evidence_led_responses: { "C.1.1": evidence({ evidence: [reference()] }) },
      audit: [{ id: "invented-event", type: "indicator_response_changed", ref: "C.1.1", reason: "Original event only", at: timestamp }]
    },
    derived: { findings: "Untrusted stored findings", readiness: true }, limitations: ["Synthetic only"]
  };
}
function changed(mutator) { const data = fixture(); mutator(data); return data; }

test("module has no DOM, storage or network side effects and exports only parseBackup", () => {
  assert.deepEqual(Object.keys(context.HDRLPortability), ["parseBackup"]);
  assert.equal(typeof context.HDRLPortability.parseBackup, "function");
});

test("current full backup preserves source identity, fields and sparse maps without reassessment", () => {
  const input = fixture(), before = JSON.stringify(input), result = plain(parse(input));
  assert.equal(JSON.stringify(input), before);
  assert.deepEqual(result.versions, input.versions);
  assert.deepEqual(result.provenance, input.provenance);
  assert.equal(result.provenance.implementation_candidate, "2026-10-28.2");
  const expected = structuredClone(input.assessment); expected.audit = []; expected.declared_context = "unspecified";
  assert.deepEqual(result.assessment, expected);
  assert.equal(result.sourceSchema, input.export_schema);
  assert.match(result.compatibilityNote, /older file.*unspecified/);
  assert.match(result.compatibilityNote, /prior event history.*not restored/);
  assert.equal("derived" in result, false);
});

test("new full format requires explicit declared context, and legacy never infers it", () => {
  for (const value of ["synthetic", "real", "unspecified"]) {
    const data = changed((d) => { d.export_schema = "hdrl-self-assessment-export-v0.5.0"; d.assessment.declared_context = value; });
    assert.equal(parse(data).assessment.declared_context, value);
  }
  assert.equal(parse(fixture()).assessment.declared_context, "unspecified");
  for (const value of [undefined, "fictional", "", null, true, {}]) {
    const data = changed((d) => { d.export_schema = "hdrl-self-assessment-export-v0.5.0"; d.assessment.declared_context = value; });
    assert.throws(() => parse(data), /declared_context/);
  }
  for (const value of ["real", "synthetic", "unspecified", null])
    assert.throws(() => parse(changed((d) => { d.assessment.declared_context = value; })), /older backup format/);
});

test("private controls and derived claims are excluded even when deliberately supplied", () => {
  const data = fixture();
  for (const key of ["registration", "contacts", "consent", "beta", "session", "settings", "auth", "accessToken", "analytics", "telemetry"]) {
    data[key] = { unsafe: "SECRET-DO-NOT-RESTORE" };
    data.assessment[key] = { unsafe: "SECRET-DO-NOT-RESTORE" };
  }
  data.generated_by = { implementation_candidate: "FORGED-CURRENT" };
  data.derived = { maturity: "FORGED-CURRENT", readiness: true };
  data.assessment.audit[0].reason = "SECRET-DO-NOT-RESTORE";
  const encoded = JSON.stringify(parse(data));
  assert.doesNotMatch(encoded, /SECRET-DO-NOT-RESTORE|FORGED-CURRENT/);
  assert.equal(parse(data).assessment.evidence_led_responses["C.1.1"].evidence[0].owner, "Invented team");
});

test("empty and incomplete stage maps preserve legitimate partial work", () => {
  const data = fixture();
  data.assessment.created_at = null; data.assessment.updated_at = null;
  data.assessment.boundary = { title: "", serviceName: "", scope: "", timePeriod: "", assessmentDate: null, unit: "", method: "individual", intendedUse: "" };
  data.assessment.rapid_first_pass = {}; data.assessment.whole_framework_snapshot = {};
  data.assessment.domain_capacity_notes = {}; data.assessment.evidence_led_responses = {}; data.assessment.audit = [];
  const result = parse(data);
  assert.equal(Object.keys(result.assessment.whole_framework_snapshot).length, 0);
  assert.equal(result.assessment.created_at, null);
  assert.equal(result.assessment.boundary.assessmentDate, null);
  data.assessment.whole_framework_snapshot["A.1.1"] = snapshot({ status: "unstarted", level: "", certainty: "", updatedAt: null });
  data.assessment.evidence_led_responses["A.1.1"] = evidence({ decision: "", status: "unstarted", level: "", certainty: "", updatedAt: null });
  assert.deepEqual(plain(parse(data).assessment.evidence_led_responses), data.assessment.evidence_led_responses);
});

test("incomplete evidence autosaves remain recoverable and are explicitly flagged", () => {
  for (const patch of [{ level: "" }, { certainty: "" }, { level: "", certainty: "" },
    { decision: "not_judged", status: "unstarted", level: "", certainty: "", statusReason: "" },
    { decision: "not_judged", status: "not_known", level: "", certainty: "", statusReason: "" }]) {
    const data = changed((d) => { Object.assign(d.assessment.evidence_led_responses["C.1.1"], patch); });
    const result = parse(data);
    assert.deepEqual(plain(result.assessment.evidence_led_responses), data.assessment.evidence_led_responses);
    assert.match(result.compatibilityNote, /1 incomplete evidence response/);
  }
});

test("unknown, deferred and N/A keep notes, actions and retained evidence with no score", () => {
  for (const status of ["not_known", "not_assessed", "not_applicable"]) {
    const data = changed((d) => {
      d.assessment.whole_framework_snapshot["C.1.1"] = snapshot({ status, level: "", certainty: "", note: "Explicit reason" });
      d.assessment.evidence_led_responses["C.1.1"] = evidence({ decision: "not_judged", status, level: "", certainty: "",
        statusReason: "Explicit reason", evidence: [reference()] });
    });
    const result = plain(parse(data));
    assert.deepEqual(result.assessment.evidence_led_responses, data.assessment.evidence_led_responses);
    assert.equal(result.assessment.whole_framework_snapshot["C.1.1"].level, "");
  }
});

test("method or format mismatch is refused, never relabelled", () => {
  for (const schema of ["hdrl-share-bundle-v0.1.0", "hdrl-self-assessment-export-v0.6.0", "", null])
    assert.throws(() => parse(changed((d) => { d.export_schema = schema; })), /format/);
  for (const key of Object.keys(fixture().versions))
    assert.throws(() => parse(changed((d) => { d.versions[key] = "other"; })), /original/);
  for (const key of ["status", "catalogue_sha256", "guidance_sha256"])
    assert.throws(() => parse(changed((d) => { d.provenance[key] = "other"; })), /exact method/);
  assert.throws(() => parse(changed((d) => { delete d.provenance.implementation_candidate; })), /implementation_candidate/);
  assert.throws(() => parse("indicator,status\nC.1.1,rated"), /JSON/);
});

test("selective shares and recovery files explain that a full compatible backup is needed", () => {
  for (const schema of ["hdrl-explicit-results-share-v0.1.0", "hdrl-explicit-results-share-v0.2.0"])
    assert.throws(() => parse({ schema, restorable: false, snapshot: {} }),
      /minimised share is not a full backup\. Choose the full assessment JSON backup/);
  assert.throws(() => parse({ export_schema: "hdrl-self-assessment-recovery-v0.1.0", original_record: {} }),
    /recovery file preserves an unsupported draft\. Choose a compatible full assessment JSON backup/);
});

test("duplicate and escaped-equivalent JSON keys are rejected throughout the document", () => {
  const raw = JSON.stringify(fixture());
  for (const pair of ['"status":"rated","status":"rated"', '"status":"rated","st\\u0061tus":"rated"'])
    assert.throws(() => parse(raw.replace('"status":"rated"', pair)), /duplicate JSON field/);
  assert.throws(() => parse(raw.replace('"derived":', '"derived":{},"der\\u0069ved":')), /duplicate JSON field/);
  for (const key of ['__proto__', 'prototype', 'constructor', '\\u005f_proto__']) {
    const dangerous = raw.replace('"derived":', `"${key}":{},"derived":`);
    assert.throws(() => parse(dangerous), /unsafe object field/);
  }
  assert.equal({}.polluted, undefined);
});

test("byte size, depth and extreme JSON syntax fail before sanitization", () => {
  const raw = JSON.stringify(fixture());
  assert.throws(() => parse(" ".repeat(2 * 1024 * 1024 + 1)), /2 MiB/);
  assert.throws(() => parse(raw.replace('"derived":', '"padding":"' + "😀".repeat(524288) + '","derived":')), /2 MiB/);
  assert.throws(() => parse(raw.replace('"derived":', '"derived":' + '['.repeat(34) + '0' + ']'.repeat(34) + ',"unused":')), /deeply/);
  for (const literal of ["NaN", "Infinity", "1e400", "9007199254740993", "-0", "1e-9999"])
    assert.throws(() => parse(raw.replace('"derived":', `"derived":${literal},"unused":`)), /numeric|JSON/);
  for (const rawValue of ["{} trailing", "[1,]", '{"a":1,}', '{"a":01}', '{"a":"\\x00"}', '{"a":"\\ud800"}'])
    assert.throws(() => parse(rawValue));
});

test("Unicode and escaped text round-trip as inert content", () => {
  const note = 'Synthetic 😀 \"quoted\" \\ slash\n<script>fetch("https://invalid.test")</script>';
  const data = changed((d) => { d.assessment.whole_framework_snapshot["C.1.1"].note = note; });
  assert.equal(parse(data).assessment.whole_framework_snapshot["C.1.1"].note, note);
});

test("all required assessment fields and complete response shapes are enforced", () => {
  for (const key of Object.keys(fixture().assessment))
    assert.throws(() => parse(changed((d) => { delete d.assessment[key]; })), /missing/);
  for (const stage of ["whole_framework_snapshot", "evidence_led_responses"])
    for (const key of Object.keys(fixture().assessment[stage]["C.1.1"]))
      assert.throws(() => parse(changed((d) => { delete d.assessment[stage]["C.1.1"][key]; })), /missing/);
  for (const key of Object.keys(fixture().assessment.boundary))
    assert.throws(() => parse(changed((d) => { delete d.assessment.boundary[key]; })), /missing/);
});

test("unknown response/evidence fields and unknown refs fail rather than losing information", () => {
  for (const stage of ["whole_framework_snapshot", "evidence_led_responses"])
    assert.throws(() => parse(changed((d) => { d.assessment[stage]["C.1.1"].new_meaning = "do not discard"; })), /unsupported field/);
  assert.throws(() => parse(changed((d) => { d.assessment.evidence_led_responses["C.1.1"].evidence[0].new_meaning = true; })), /unsupported field/);
  for (const stage of ["whole_framework_snapshot", "evidence_led_responses"])
    assert.throws(() => parse(changed((d) => { d.assessment[stage]["Z.1.1"] = structuredClone(d.assessment[stage]["C.1.1"]); })), /unsupported field/);
  assert.throws(() => parse(changed((d) => { d.assessment.domain_capacity_notes.Z = "unknown"; })), /unsupported field/);
  assert.throws(() => parse(changed((d) => { d.assessment.rapid_first_pass.Z = { impression: "", certainty: "", note: "" }; })), /unsupported field/);
});

test("contradictory states and nonempty invalid values are rejected", () => {
  for (const stage of ["whole_framework_snapshot", "evidence_led_responses"])
    for (const patch of [{ status: "other" }, { level: "L6" }, { level: true }, { certainty: "certain" }, { status: "not_known" }])
      assert.throws(() => parse(changed((d) => { Object.assign(d.assessment[stage]["C.1.1"], patch); })));
  for (const patch of [{ level: "" }, { certainty: "" }, { certaintyReasons: ["unknown"] },
    { certainty: "low", certaintyReasons: ["knowledge_gap", "knowledge_gap"] }, { certaintyReasons: ["knowledge_gap"] }])
    assert.throws(() => parse(changed((d) => { Object.assign(d.assessment.whole_framework_snapshot["C.1.1"], patch); })));
  for (const decision of ["", "not_judged", true])
    assert.throws(() => parse(changed((d) => { d.assessment.evidence_led_responses["C.1.1"].decision = decision; })), /decision/);
  assert.throws(() => parse(changed((d) => { d.assessment.rapid_first_pass.A.impression = "not_known"; })), /certainty disagree/);
});

test("calendar dates, evidence structure, identifiers and audit shape are checked", () => {
  for (const invalid of ["2026-02-29", "2026-04-31", "0000-01-01", "2026-13-01", "yesterday"])
    assert.throws(() => parse(changed((d) => { d.assessment.boundary.assessmentDate = invalid; })), /valid date/);
  for (const invalid of ["2026-02-30T10:00:00Z", "2026-10-28T24:00:00Z", "2026-10-28T10:00:00+15:00", "unknown", 123])
    assert.throws(() => parse(changed((d) => { d.assessment.created_at = invalid; })), /timestamp|timezone/);
  const valid = changed((d) => { d.assessment.boundary.assessmentDate = "2024-02-29"; d.assessment.created_at = "2026-10-28T10:00:00+01:00"; });
  assert.equal(parse(valid).assessment.created_at, valid.assessment.created_at);
  for (const patch of [{ title: "" }, { date: "2026-02-30" }, { reviewStatus: "verified" }, { type: "Automatic validation" }, { reference: {} }])
    assert.throws(() => parse(changed((d) => { Object.assign(d.assessment.evidence_led_responses["C.1.1"].evidence[0], patch); })));
  assert.throws(() => parse(changed((d) => { d.assessment.evidence_led_responses["C.1.1"].evidence.push(reference()); })), /identifiers/);
  for (const audit of [null, {}, ["event"], Array(251).fill({})])
    assert.throws(() => parse(changed((d) => { d.assessment.audit = audit; })), /audit/);
  assert.throws(() => parse(changed((d) => { d.assessment.id = ""; })), /assessment.id/);
});

test("catalogue identity and reference inventory are required", () => {
  for (const altered of [null, {}, { ...catalogue, catalogue_version: "other" },
    { ...catalogue, indicators: Array(64).fill(catalogue.indicators[0]) }])
    assert.throws(() => context.HDRLPortability.parseBackup(JSON.stringify(fixture()), altered), /catalogue/);
});

test("retained original Fenland export restores substantive input without inferring fictional context", {
  skip: process.env.HDRL_PORTABILITY_FIXTURE ? false : "Set HDRL_PORTABILITY_FIXTURE to the original retained synthetic export for this integration check"
}, async () => {
  const raw = readFileSync(process.env.HDRL_PORTABILITY_FIXTURE);
  const hash = Buffer.from(await webcrypto.subtle.digest("SHA-256", raw)).toString("hex");
  assert.equal(hash, "8e0c36eb2f24895d38198431ebc179e57517cbba0abc5b6a20e8e13c2db61422");
  const input = JSON.parse(raw), result = plain(parse(raw.toString("utf8")));
  const expected = structuredClone(input.assessment); expected.audit = []; expected.declared_context = "unspecified";
  assert.deepEqual(result.assessment, expected);
  assert.deepEqual(result.versions, input.versions);
  assert.deepEqual(result.provenance, input.provenance);
  assert.equal(Object.keys(result.assessment.evidence_led_responses).length, 64);
  assert.equal(Object.values(result.assessment.evidence_led_responses).filter((item) => item.status === "rated").length, 62);
  assert.equal(result.assessment.evidence_led_responses["E.3.1"].status, "not_known");
  assert.equal(result.assessment.evidence_led_responses["A.4.1"].status, "not_applicable");
  assert.equal(Object.values(result.assessment.evidence_led_responses).flatMap((item) => item.evidence).every((item) => item.reviewStatus === "unreviewed"), true);
  assert.equal(Buffer.from(await webcrypto.subtle.digest("SHA-256", readFileSync(process.env.HDRL_PORTABILITY_FIXTURE))).toString("hex"), hash);
});
