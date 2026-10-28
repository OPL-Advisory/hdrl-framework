// Expected coverage for the bounded FB-01–05 browser suite.
export const CASE_NAMES = Object.freeze([
  "fenland-report-completeness-and-provenance",
  "nonrated-action-not_known",
  "nonrated-action-not_assessed",
  "nonrated-action-not_applicable",
  "snapshot-validation-new-response",
  "snapshot-validation-saved-response",
  "review-queues-preserve-every-status-and-reason"
]);
const ENGINES = ["chromium", "firefox", "webkit"];

export function selectFeedbackRun(env) {
  const filter = env.HDRL_BROWSER_CASE || "";
  if (filter && !CASE_NAMES.includes(filter)) {
    throw new Error(`Unknown HDRL_BROWSER_CASE ${JSON.stringify(filter)}. Supported cases: ${CASE_NAMES.join(", ")}`);
  }
  const engines = (env.HDRL_BROWSERS || ENGINES.join(",")).split(",");
  if (engines.some((engine) => !ENGINES.includes(engine)) || new Set(engines).size !== engines.length) {
    throw new Error(`HDRL_BROWSERS must name unique supported engines: ${ENGINES.join(", ")}`);
  }
  return { engines, caseNames: filter ? [filter] : [...CASE_NAMES], filter };
}

export function feedbackCoverageFailures(selection, browsers) {
  const failures = [];
  const fail = (engine, name, fatal) => failures.push({ engine, name, fatal, failed_checks: [] });
  for (const engine of selection.engines) {
    const runs = browsers.filter((run) => run.engine === engine);
    if (runs.length !== 1) {
      fail(engine, "case-inventory", `Expected one engine run; found ${runs.length}.`);
      continue;
    }
    const cases = runs[0].cases;
    const names = cases.map((item) => item.name).sort();
    if (JSON.stringify(names) !== JSON.stringify([...selection.caseNames].sort())) {
      fail(engine, "case-inventory", `Expected cases: ${selection.caseNames.join(", ")}; executed: ${names.join(", ") || "none"}.`);
    }
    for (const item of cases) {
      if (!(item.behaviour_assertions > 0) || !(item.assertions?.total > 0)) {
        fail(engine, item.name, "Case executed without behavioural assertions; common safety checks alone are insufficient.");
      }
    }
  }
  return failures;
}
