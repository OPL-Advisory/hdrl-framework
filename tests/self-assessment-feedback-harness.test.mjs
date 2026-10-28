import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { CASE_NAMES, selectFeedbackRun, feedbackCoverageFailures } from "../scripts/self_assessment_feedback_inventory.mjs";

const script = fileURLToPath(new URL("../scripts/test_self_assessment_feedback.mjs", import.meta.url));
const executed = (name) => ({ name, behaviour_assertions: 1, assertions: { total: 4 } });

test("unknown case filter makes the actual CLI fail before Playwright or fixture access", () => {
  const result = spawnSync(process.execPath, [script], {
    encoding: "utf8",
    env: { ...process.env, HDRL_BROWSER_CASE: "nonexistent-typo-case", HDRL_BROWSERS: "chromium",
      HDRL_PLAYWRIGHT: "/__must_not_load_playwright__", HDRL_FEEDBACK_FIXTURE: "/__must_not_read_fixture__" }
  });
  assert.equal(result.error, undefined);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown HDRL_BROWSER_CASE "nonexistent-typo-case"/);
  for (const name of CASE_NAMES) assert.ok(result.stderr.includes(name));
  assert.doesNotMatch(result.stderr, /MODULE_NOT_FOUND|ENOENT/);
  assert.equal(result.stdout, "");
});

test("a known single case and the explicit seven-case inventory accept complete execution", () => {
  const full = selectFeedbackRun({});
  assert.equal(full.caseNames.length, 7);
  assert.equal(full.engines.length, 3);
  assert.deepEqual(feedbackCoverageFailures(full, full.engines.map((engine) => ({ engine, cases: CASE_NAMES.map(executed) }))), []);
  const single = selectFeedbackRun({ HDRL_BROWSER_CASE: CASE_NAMES[0], HDRL_BROWSERS: "chromium" });
  assert.deepEqual(single.caseNames, [CASE_NAMES[0]]);
  assert.deepEqual(feedbackCoverageFailures(single, [{ engine: "chromium", cases: single.caseNames.map(executed) }]), []);
});

test("missing engines, zero cases, skipped cases and duplicate cases cannot pass coverage", () => {
  const selection = selectFeedbackRun({ HDRL_BROWSERS: "chromium" });
  for (const cases of [[], CASE_NAMES.slice(1).map(executed), [...CASE_NAMES.slice(1), CASE_NAMES[1]].map(executed)]) {
    assert.ok(feedbackCoverageFailures(selection, [{ engine: "chromium", cases }]).some((f) => f.name === "case-inventory"));
  }
  assert.equal(feedbackCoverageFailures(selection, []).length, 1);
  assert.throws(() => selectFeedbackRun({ HDRL_BROWSERS: "chromium,chromium" }), /unique supported engines/);
});

test("empty case bodies cannot pass on the three common safety assertions", () => {
  const selection = selectFeedbackRun({ HDRL_BROWSERS: "chromium", HDRL_BROWSER_CASE: CASE_NAMES[0] });
  for (const item of [
    { name: CASE_NAMES[0], behaviour_assertions: 0, assertions: { total: 3 } },
    { name: CASE_NAMES[0], behaviour_assertions: 0, assertions: { total: 0 } },
    { name: CASE_NAMES[0] }
  ]) {
    assert.match(feedbackCoverageFailures(selection, [{ engine: "chromium", cases: [item] }])[0].fatal, /without behavioural assertions/);
  }
});
