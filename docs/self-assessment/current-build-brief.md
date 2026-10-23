---
title: Self-assessment current build brief
description: Current state, decisions, ordered backlog and fresh-session instructions for completing the HDRL beta.
robots: noindex, nofollow
analytics: false
---

# Current build brief

**Updated:** 23 October 2026. This is the current restart point for self-assessment implementation. Historical research and test records keep their original dates.

## Outcome and next increment

Help individuals and teams learn HDRL by applying it, retain a useful record of their understanding and evidence, and choose proportionate improvement questions. The owner needs a service that can run with little routine intervention.

**Next increment:** prepare an improved beta release candidate from the existing application: fix the remaining privacy/authentication release issues, make the 64-indicator snapshot the clear primary route, make its report useful on its own, add traceable next-step guidance and prove safe local export/restore. Keep production activation as a separate approved release. This increment does not require a new platform or a public AI feature.

The [October comparator analysis](comparator-refresh-2026-10.md) explains how the two supplied Grok/Gemini analyses and an independent agent review informed this recommendation. The separate agent did not read the supplied analyses. Its agreement is a design cross-check, not independent validation.

## Observed state

| Asset/capability | Checked on 23 October | Limit |
|:--|:--|:--|
| Repository | `codex/self-assessment`; restart input commit `9915f15`; fetched `origin/main` is `7646f7b`, including presentation-kit PR #20. The branch is eight commits ahead with no missing main commits. | Never use the earlier presentation-kit branches as a new base. Preserve unrelated untracked work. |
| Live catalogue | Framework `1.0.1`, catalogue/schema `1.0.2`, eight domains, 64 indicators. Public and local JSON are byte-identical. | Canonical catalogue SHA-256: `442a10be23a0ddec889785577fb8853db2296cc5b3a50929849025e27077cd47`. This is distinct from the method-source checksum. |
| Classifications | 43 Core, 21 Enhancement; 37 B0; five proposed foundational indicators. | B0 is not synonymous with all Core. Proposed thresholds are internal framework logic. |
| Application | Tool `0.5.0-beta`, guidance/rules `0.2.0`, report `0.4.0`, beta configuration `0.3.0`. | No runtime version change is made by this planning refresh. |
| Individual use | Optional eight-domain orientation; full 64-indicator provisional snapshot; evidence-reference workspace; certainty, notes, report, JSON/CSV and print. | Current report includes all stages even if only the snapshot was used; recommendations remain mostly coverage prompts and user-entered actions. |
| Local persistence | IndexedDB save-and-return and migration of older draft schemas. | One active draft; JSON export exists but a validated restore/import journey is not implemented. Catalogue/guidance provenance needs strengthening before historical comparisons. |
| Team use | One working set and explanatory team/report panels. | No implemented independent multi-rater import, invitations, secure blind rounds or team consensus workflow. |
| Agent assessment | No model service or evidence-ingestion workflow in the reviewed application. | A research design exists in the October comparison; no AI feature is operational. |
| Public route | `https://hdrlframework.org/self-assessment/` returned HTTP 404. | The self-assessment branch has not been deployed to main. Branch/local preview and public launch are different states. |
| Public service configuration | Remote collection `false`; Plausible `false`; publishable key `null`. | Keep these settings until approved public activation. |
| Supabase | Dedicated `HDRL Framework Beta`, `eu-west-2`, `ACTIVE_HEALTHY`; `beta-service` active, deployment version 5; health endpoint reports service `0.3.0`, `result_storage:false`. | A health response is not an authentication, retention or full security test. No identity/profile/feedback content was fetched. |
| Operational database | The table metadata API reports zero rows in all six public beta tables, all with RLS. | Metadata counts are not a forensic audit of all provider records/logs. |
| Security advisor | No errors/warnings returned; six expected informational notices for RLS without public policies. | Default-deny tables are deliberate. This check does not certify the application. |
| Email/analytics suppliers | IONOS SMTP/OTP, privacy forwarding and Plausible Business setup recorded in August; OTP success and reuse rejection were tested then. | Mail delivery, provider contracts/settings, subscriptions and current spend were not reverified in this restart. |

The October inspection did not create users, submit feedback, send email, change a supplier project or enable collection.

## Decisions carried forward

- Keep all 64 indicators reachable. For a rated snapshot response, the minimum is a canonical descriptor choice and high/medium/low certainty. Clarity and comments remain optional.
- Keep not known, not assessed and not applicable separate from maturity. Unknown is not zero or L1.
- Use the snapshot as the main route; the existing orientation remains optional. Deep evidence work follows when useful.
- Keep scores, certainty, scope, comments, evidence and reports on the participant's device by default.
- Retain the previously agreed delayed verified-email gate for the full report as the working product model. Review its burden with beta evidence and its lawful basis in the LIA; the SmarterX comparison alone does not reverse the decision.
- Retain separate, unchecked research/newsletter choices and optional feedback with a without-contact-details route.
- Use evidence references, not uploaded documents, in the public beta.
- Use rules and separately versioned HDRL guidance for next steps; no default third-party AI service.
- No overall HDRL percentage, accreditation, eligibility decision, league table or machine-verified-maturity claim.
- Treat capability, available evidence and operating capacity separately. Foundational flags identify matters for review within HDRL's proposed logic; they do not establish legal compliance or programme eligibility.
- Retain the present MkDocs/GitHub Pages application plus narrow Supabase service. Hosted assessment/team workspaces are a later product and privacy decision.

The timing targets remain hypotheses: optional orientation 5–10 minutes and full snapshot 30–60 minutes. Measure them; do not replace them with a comparator's marketing estimate.

## Ordered backlog and acceptance checks

### Increment 1 — useful, defensible beta candidate

| Work | Deliverable and done condition |
|:--|:--|
| Privacy implementation | Resolve the stored-event-buffer issue: objection must stop the analytics collection/storage/access covered by it, not just network sending. Separate necessary draft persistence from analytics, remove or strictly bound production diagnostic history, and persist the objection independently of a deleted/new draft as appropriate. Verify with network/storage observations and a synthetic draft. |
| Event contract | Enumerate values as well as property names for `context`, `bundle_scope`, entry points and export types; bound counts and text lengths; reject invalid fields. Test that no response value/free text reaches Plausible or logs. Plausible is called directly, so do not claim that a Supabase endpoint secures that stream. |
| Verified-email control | Prove the server requires the intended completed OTP journey before participant registration. Current `authenticatedUser()` checks `getUser()` and email presence; August configuration records the separate confirmation toggle disabled. Test alternative sign-up/session paths as a possible bypass, rather than treating any authenticated session as proof of email-code use. This is a code/configuration review concern, not a demonstrated exploit. Cover wrong code, expiry, reuse, rate limits, enumeration, access and deletion. |
| Policy/implementation agreement | Align actual retention logic, provider backup/log settings and preference withdrawal with the approved notice. Code currently sets participant retention to 365 days from registration, while the draft mentions beta-end/last-activity rules. Do not publish a promise the implementation does not enforce. |
| Clear entry | One primary “whole-framework snapshot” action, optional orientation and later evidence deepening; show a fictional report example and commitment estimates. All 64 indicators remain available through domain breaks and resume. |
| Snapshot report | Show a strong domain profile with counts, certainty and unknown coverage; include the selected method, scope, date and versions. A snapshot-only report must not present untouched evidence-work fields as findings of poor capability. Relevant indicator selections remain inspectable. Use accessible tables/text alongside colour. |
| Next-step guidance | Original, separately versioned records containing rule ID, trigger, indicator reference, relevant canonical evidence expectation, question/action, rationale and limitations. User can select three priorities and record local owner/review date. Each report item exposes derivation; no automatic claim of attaining the next level. |
| Safe portability | Validated, previewed local JSON restore with schema/version/hash checks, size bounds, inert rendering and a clear replace/keep decision. Restore must not import email/contact choices, authenticated sessions, analytics history or consent as if newly granted. Export a backup before replacement; retain original assessment date and provenance. |
| Provenance | Include the catalogue hash and distinct framework/catalogue/tool/guidance/rules/report versions in new exports. Preserve old exports and known draft provenance; flag missing/legacy provenance rather than silently relabelling it with the newest method. |
| Regression and accessibility | A synthetic first-pass report, mixed evidence case, long text, missing certainty, incomplete applicability, reload/restore and malicious text all work. Check keyboard focus, screen-reader labels/announcements, contrast, mobile reflow, actual file saving and print/HTML output. Record the browsers and what was actually tested. |
| Operational reproducibility | Pin the currently unbounded Supabase JS dependency before the next function deployment, retain a tested lock/resolution record, and review relevant platform changelog/security notices. Do not replace the working architecture merely to adopt new middleware. |

This release candidate can be completed and reviewed while public flags remain off. Final provider configuration and live synthetic checks belong to the approved release procedure.

### Increment 2 — local team calibration

Build this after the individual report/export contract is stable. It may be built before wider launch if the first testers prioritise it; it is not a reason to delay the individual beta indefinitely.

Accept limited, deliberately shared assessment exports into a local comparison view. Require compatible catalogue/hash, guidance, stage, boundary and period; reject incompatible schema/versions and give a reconciliation screen for scope differences. Show distributions/counts, certainty, not-known and applicability disagreement. Keep independent answers immutable; store consensus, rationale and actions separately. Do not present an average as the team result.

Acceptance: three synthetic contributors with different views produce the expected distribution and a separately recorded consensus, export safely, and generate no network request containing answers. Explain voluntary independence, contributor identity limits, small-group disclosure and inability to revoke shared files. Do not describe this as secure blind rounds or hosted invitations.

### Increment 3 — evidence-assistant evaluation

Implement the bounded [experiment](comparator-refresh-2026-10.md#evidence-assistant-experiment) separately from the public app. The first deliverable is a reproducible corpus/manifest, output schema, evaluation rubric and run log. Provider/model selection, non-zero new spend, retention and any real confidential material require explicit direction before live model processing.

Use public/synthetic materials initially, human reference judgements and an unseen evaluation subset. Output candidate references, limitations and questions; never auto-update scores. Promotion depends on citation correctness, abstention, missed contradictions and net reviewer time saved. Do not publish a scored profile of an organisation from its public footprint.

### Later, only when demonstrated need warrants it

Hosted team workspaces, contributor authentication, enforceable blind rounds, evidence uploads, confidential AI processing, time-series dashboards and benchmark research each need a separate product case and operating/privacy design. Do not bundle them into a public-beta prerequisite.

## Human decisions and work ownership

Agent work can continue on report design, guidance, tests, schemas, portability, local team fixtures and draft governance artefacts. The owner should spend attention on these concrete decisions:

| Owner decision | Recommended working proposal | Where it matters |
|:--|:--|:--|
| Necessary registration context | Keep verified email; use a broad role category and make organisation optional unless the LIA justifies requiring it. | Cross-layer client/API/database/privacy change; prepare for review, preserve current behaviour until decided. |
| Controller and contact facts | Confirm ICO status/reference, approved postal address, accountable operator and practical continuity cover. | Populate the public notice/rights/complaints route. A named deputy is an operating proposal, not a blanket statutory job requirement. |
| Retention | Choose a finite, implementable backstop and align beta-end/last-activity semantics across code, backups and notices. | Avoid indefinite beta retention and contradictory promises. |
| Supplier/governance evidence | Assemble current terms, locations, transfers, actual log/backup periods and short LIA/DPIA/ROPA drafts for appropriate review. | Existing August drafts and reviews are inputs; their presence is not recorded approval. |
| Public activation | Review one concrete release candidate and its evidence, then explicitly approve deployment and collection. | No activation is inferred from continuing the build. |

CPRD and Lancashire/South Cumbria interest is historical user context, not a currently confirmed test appointment. Reconfirm availability through the owner. Do not send invitations, emails or follow-ups without instruction. Measure the first few user journeys rather than designing a large study before anyone can use the tool.

## Verification and operating notes

The October restart passed JavaScript syntax, the self-assessment and canonical catalogue validators, Presentation Kit checks and all three Supabase boundary unit tests. The strict MkDocs build and built-site coherence also passed: 36 pages, 3,289 internal links/anchors and zero failures. The public/local catalogue hashes match. The read-only service/advisor checks are recorded above. Initial builds stalled reading installed theme files; a run with normal filesystem access completed successfully. August browser/accessibility/OTP results remain historical evidence; no fresh usability or assistive-technology pass is implied.

Use the repository's existing tools, not a new build stack:

```console
node --check docs/assets/js/self-assessment.js
node --test supabase/tests/privacy-boundary.test.mjs
./.venv/bin/python scripts/validate_indicator_catalogue.py
./.venv/bin/python scripts/validate_presentation_kit.py
./.venv/bin/python scripts/validate_self_assessment.py
./.venv/bin/mkdocs build --strict
./.venv/bin/python scripts/check_site_coherence.py
```

For a local rendered preview use `./.venv/bin/mkdocs serve --dev-addr 127.0.0.1:8123`; opening `overrides/main.html` as a file does not render the MkDocs application. Serve an existing preview process when available rather than starting duplicates. GitHub Actions builds pull requests but deploys main/master pushes and manual runs; a branch push is not a public release.

Current platform notes: the October Supabase changelog includes a management-log endpoint migration, a Postgres security update and log-pricing changes. None establishes a required application rewrite. Review the relevant official notices and current project configuration before the next deployment; present database health does not prove patch currency or the terms of a paid subscription.

Unrelated untracked `node_modules`, `outputs/`, `research/` and SDE-register scripts were present at restart. They belong to the user; do not delete, stage or repurpose them for this work.

## Copyable prompt for the next session

```text
Continue the HDRL self-assessment project in:
/Users/opladvisory/Documents/Codex/2026-07-12/new-chat/work/hdrl-framework

Read AGENTS.md and docs/self-assessment/current-build-brief.md first, followed
by comparator-refresh-2026-10.md and the linked product/privacy/operations
documents needed for the change. Treat the current brief as the restart point.

Inspect git status, fetch origin and continue from codex/self-assessment and
its current head. It already descends from origin/main with presentation-kit
PR #20. Preserve unrelated user changes and untracked SDE-register work.
Do not restart from the earlier presentation-kit branches.

Implement Increment 1 of the current brief: an improved beta release candidate
with privacy/auth hardening, a clear 64-indicator primary journey, a useful
snapshot-only report, versioned traceable next-step guidance and safe local
export/restore. Make the result concrete and testable. Use the existing stack.

Keep canonical catalogue wording intact, unknowns separate from maturity,
results local, uploads absent and optional contact separate. Do not add an
overall score, benchmarking or machine-verified maturity. Keep collection and
Plausible flags off and the public key omitted until explicit activation
approval. Do not add providers, spend, send messages or transmit assessment
content to an AI service without instruction.

Use the current brief's acceptance checks and repository validation commands.
Prepare unresolved owner choices as concrete proposals while completing
independent implementation. Finish with the candidate commit/PR, tested
behaviour, known limits and the few owner decisions that remain. No live
publication is authorised by this prompt.
```

**Stop criterion:** a reviewable and tested candidate for Increment 1, with traceable findings and a small list of genuine owner decisions. Start local team comparison or evidence-model work as separately bounded follow-on increments rather than silently expanding the candidate.
