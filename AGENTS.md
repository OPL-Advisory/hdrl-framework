# HDRL repository instructions

## Resume the self-assessment work

- Read `docs/self-assessment/current-build-brief.md` first. It records current state, accepted decisions, the next bounded increment and owner decisions.
- The October 2026 comparator synthesis is `docs/self-assessment/comparator-refresh-2026-10.md`. Original supplied analyses and a separate agent review are under `reference/self-assessment-review-2026-10-23/`.
- Continue the existing `codex/self-assessment` branch unless the user directs otherwise. Fetch and inspect before changing its base. It includes presentation-kit PR #20; do not build from earlier presentation-kit branches.
- Preserve unrelated changes and untracked SDE-register scripts, `research/`, `outputs/` and `node_modules`.

## Framework and data boundaries

- Canonical wording comes from `docs/data/hdrl-indicators-v1.json`; catalogue and framework versions are distinct. Never silently rewrite indicators, maturity descriptors or minimum evidence.
- Keep guidance/rules, tool, report and catalogue provenance distinct. Unknown/not assessed/not applicable are not scores. No overall HDRL percentage, accreditation, official participation decision or machine-verified maturity.
- Detailed nation-level evidence and assessment records are controlled. Only the authorised public Final Report/framework material may be reused without additional permission. Do not treat formative judgements as a validated gold standard.
- The beta keeps assessment responses, evidence and reports in the browser. The thin Supabase service is for minimum participant administration and deliberately submitted feedback only.
- Keep `remote_collection_enabled:false`, `plausible.enabled:false` and the publishable key omitted until explicit public-activation approval. No evidence uploads, new AI processing/provider/spend or unsolicited participant messaging.
- A public evidence assistant may propose citations and questions in a separately approved experiment; absence from public sources does not establish absence of capability.

## Verification and handoff

- Use the existing MkDocs/JavaScript/Supabase stack and proportionate tests. See the current brief for commands and acceptance checks.
- Render through MkDocs, not by opening a template as a file. Keep report HTML accessible and test actual exports in named browsers before claiming download success.
- State whether a result is current observation, historical test, vendor claim or product hypothesis. A healthy service/advisor result is not production approval.
- Keep the current brief updated after a meaningful increment. Leave concrete acceptance evidence, remaining decisions and a resumable next step; do not create a parallel project or a stack migration without a demonstrated requirement.
