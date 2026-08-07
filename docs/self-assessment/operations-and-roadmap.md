---
title: Self-assessment operations, testing and handover
description: Deployment controls, quality plan, operational runbook and handover for the HDRL self-assessment capability.
---

# Self-assessment operations, testing and handover

## Release gate

The research prototype does not transmit assessment information and must remain visibly labelled as non-production. Do not enable production collection until all of the following have named approvers and evidence:

- controller/processor determination and contracts;
- approved privacy notice, just-in-time notices, retention and rights process;
- DPIA and legitimate-interest assessments;
- production architecture and supplier spend approval;
- verification, event/feedback separation, allow-list enforcement and deletion tests;
- accessibility audit including assistive-technology testing;
- incident, backup and recovery exercise;
- public-contributor and user review; and
- named operational owner, support route and security contact.

## Deployment approach

1. Build and test the prototype on `codex/self-assessment`.
2. Use a pull-request preview or local environment only; do not point forms at a live backend.
3. Run the MkDocs strict build and catalogue/site/self-assessment checks.
4. Perform keyboard, screen-reader, 320px reflow, 400% zoom, contrast and reduced-motion testing.
5. Test representative long indicators, rationale, evidence notes and report tables.
6. After supplier/legal approval, create the thin beta service in staging with synthetic participant/event/feedback records.
7. Prove that result fields and request bodies are rejected or redacted, feedback without contact details cannot be joined to participant/session tables, and verification/deletion controls work.
8. Pilot with an invited cohort using non-sensitive assessment boundaries.
9. Review incidents, support demand, funnel loss and user research before any wider launch or server-side assessment feature.

### Current activation state

The Worker, D1 migration, browser transport and email/rights flows are implemented in `services/beta-service`. The website configuration is intentionally set to `remote_collection_enabled: false` and has no service URL. Local integration uses generated secrets, a local D1 database and a development-only OTP return; these values are ignored by Git and cannot be used in staging.

External activation is paused at the correct control point. It needs a Cloudflare account session, two EU-jurisdiction D1 database IDs (staging and production), a Resend API key, DNS verification for `beta.hdrlframework.org`, and approval of the controller/privacy/processor items in this document. Staging must be deployed first and tested only with synthetic identities. Production requires a later, explicit change to the public beta configuration.

The smallest operating choice is Cloudflare and Resend Free tiers. A US$5/month Workers Paid plan is optional if the controller prefers a 30-day rather than seven-day D1 Time Travel window. Resend Free currently permits 3,000 emails per month and 100 per day; those limits are likely suitable for an early beta but must be monitored and rechecked at activation.

## Security test set

| Test | Expected result |
|:--|:--|
| Request OTP for registered/unregistered email | Neutral response, same observable timing class, rate limit and no account enumeration. |
| Reuse or brute-force OTP | Single use, short expiry, throttled attempts and security event without secret logging. |
| Add `level`, `certainty`, email, scope or free text to an event request | Server rejects the property/request; logs do not reproduce it. |
| Submit feedback without contact details | Stored without participant/session foreign key or authentication cookie; security metadata uses the approved short retention. |
| Correlate feedback and event tables | No routine join key; timestamps are coarsened and access roles are separated. |
| Unlock local report | Verification response unlocks browser generation without sending IndexedDB state or report content. |
| Access another workspace by changing ID | Denied by application and database policy; event recorded. |
| Change owner/contributor/reviewer role client-side | Server ignores unauthorised claim. |
| Inject HTML/script in rationale/evidence fields | Stored and rendered as inert text; report/export remains safe. |
| Enumerate report endpoints | No public report; opaque identifiers and authorisation on every read. |
| Inspect URLs/referrers/logs | No email, token, score, evidence, workspace/report data or body content. |
| Delete workspace | Live records removed, access revoked, export no longer available, backup-expiry date recorded. |
| Restore backup | Original permissions and deletion reconciliation reapplied before service. |
| Automated registrations/invitations | Rate limiting, abuse controls, quotas and alerting operate. |

Workspace, invitation and role-manipulation tests apply only if the later server-side assessment service is approved; the thin public beta has no workspace/result API.

## Accessibility test set

- Keyboard-only completion of onboarding, rapid pass, indicator editing, evidence entry, review, gate and export.
- VoiceOver/Safari and NVDA/Firefox reading order, labels, groups, expanded states, errors and save announcements.
- 200% text resize and 400% zoom; 320 CSS pixel reflow.
- Light/dark contrast, high-contrast/forced-colour behaviour and no colour-only status.
- Touch target size and portrait mobile operation.
- Long canonical descriptors and long user text without clipping.
- Focus preservation after saves, filters and validation errors.
- Reduced-motion preference.
- Print preview, heading/table structure and accessible HTML alternative to PDF.

## Prototype verification record

The following checks were completed against this branch on 7 August 2026 using synthetic content. The third iteration includes migration of both earlier on-device draft schemas and the new public-beta data boundary:

| Check | Result |
|:--|:--|
| JavaScript syntax and release invariant validator | Passed. Framework 1.0.1, catalogue 1.0.2, tool 0.4.0-beta; eight orientation prompts; 64 snapshot and evidence indicators; four same-origin versioned data reads; no file input. Remote collection requires both an endpoint and explicit flag; the committed beta configuration has neither. |
| Existing catalogue and Presentation Kit validators | Passed. 64 indicators, 92 slides and canonical wording/version checks remained intact. |
| MkDocs strict build and site coherence | Passed. The strict build completed; coherence checked 34 indexed pages, 3,033 internal links/anchors, unique descriptions and the canonical framework download checksum. Prototype design documents are `noindex`. |
| New-draft individual journey | Passed from boundary through stage choice, a synthetic snapshot response, partial review, report gate, full local report, optional feedback checkpoint and beta-activity view. The earlier orientation and evidence-led journeys remain available. |
| Framework fidelity | Both snapshot and evidence workspaces expose all 64 indicators. A.1.1 rendered all five exact catalogue descriptors; evidence-led A.1.1 retains the published minimum-evidence wording. Snapshot and evidence responses remain separate. |
| Evidence and output safety | Evidence entry now uses references only and omits “level supported” and review-period questions. Three-nation evidence examples are de-identified prompts, not proof. CSV formula-prefix protection is enforced by the release validator. |
| Reporting | The report rendered the accessible impression-by-certainty matrix, provisional snapshot domain profile, evidence-led Core median and observed range, all 64 evidence-led indicator rows, domain constraints, version provenance, rule traces, limitations and no overall score. JSON and two CSV generation paths are present. Programmatic blob downloads were requested and recorded locally, but the in-app preview did not surface a browser download event; repeat in Safari/Chrome/Firefox before release. |
| Save and return | Passed across browser reload using the same on-device IndexedDB draft. |
| Responsive reflow | Rechecked at a 320px viewport: document width equalled viewport width with no page-level horizontal overflow. Beta boundary/funnel cards, snapshot dashboard and long canonical indicator options reflowed to one column; option and action widths remained within the 288px assessment root. The 5-column orientation matrix retains a labelled internal scroll region. |
| Analytics and indexing | Built prototype contains `noindex, nofollow` and no Plausible script; other site pages retain aggregate analytics. |
| Progressive interaction and focus | Passed. Snapshot level selection reveals certainty; not known/not assessed/not applicable clear the level and hide certainty. Evidence-led unstarted indicators retain the binary judgement decision. Next-indicator actions focused the new heading and returned the assessment root to the top of the viewport. |
| Beta privacy contract | Local funnel showed one start, one report unlock, one download request and one feedback submission while the assessment itself contained an L2 selection. Inspection confirmed the operational view exposed counts/actions only and labelled result fields local/explicit-share only. Feedback without contact details excludes participant/session identifiers from its export mapping. |
| Thin service unit/privacy tests | Passed. Server-issued sessions and allow-listed events were accepted; assessment-like top-level fields were rejected; feedback without contact details could not carry participant/session identifiers; contactable feedback required a signed verified receipt; public CORS and administrative access rules held. |
| Thin service synthetic integration | Passed against local Worker/D1. Email request and correct/incorrect OTP flows, report unlock, unlinked and contactable feedback, aggregate administration, participant access, live deletion and telemetry disable all worked. Database inspection found only ciphertext/keyed email index for participant data and coarse event properties—no maturity level, certainty or evidence content. |
| Staging package | Passed `wrangler deploy --dry-run --env=staging`; the full installed dependency tree has no known npm audit vulnerability after pinning patched `undici` 7.29.0 for the local emulator. No real cloud resource was created and no email was sent. |
| Browser diagnostics | No application errors or warnings during the third-iteration interaction tests. |

This is not a substitute for the still-required VoiceOver/NVDA test, independent WCAG audit, tagged-PDF test, usability research, penetration test or production authentication/workspace-isolation testing.

## Operational controls

- Daily automated health and failed-job checks.
- Weekly dependency/security alert review.
- Monthly access review, retention job check and processor-status check.
- Quarterly restore and deletion-reconciliation test.
- Six-monthly incident exercise and threat-model review.
- Annual penetration test and accessibility audit, plus material-change reviews.
- Versioned change log for catalogue, tool, guidance, rules and reports.
- Support playbooks for lost access, incorrect invitation, export, correction, deletion and suspected sensitive-data entry.

For the thin beta, the daily runbook is intentionally small:

1. check `/health` without credentials;
2. review only aggregate `/v1/admin/summary` counts and failure alerts;
3. investigate verification spikes without copying email/body content into tickets;
4. export participant details only for an approved beta-administration purpose;
5. action verified privacy requests and record completion;
6. confirm the daily retention schedule is running; and
7. rotate/revoke the Resend key, administrator token, OTP or receipt secret immediately if compromise is suspected; invalidate active codes/receipts as part of the response.

The administrator token is an interim single-operator mechanism. Store it in an approved password manager, never a browser URL or shell history; rotate it after handover or suspected exposure. Cloudflare account MFA is mandatory. Add a second authorised operator and documented break-glass route before a public beta so the service does not depend on one person being available. The encryption and email-index keys cannot be replaced by a simple secret change: rotate them only through a controlled re-encryption/re-index migration, or delete the small beta dataset and restart after an incident. Document which route applies before production.

If prohibited information is entered, restrict access, contact the workspace owner without repeating the content, agree secure deletion and assess whether an incident or breach has occurred.

## Sample report expectations

The application report is the executable sample for an individual journey. A team report should additionally show:

- participant count and roles, without unnecessary names;
- independent response distributions and applicability differences;
- indicators selected for calibration and why;
- the consensus judgement as a separate decision;
- unresolved disagreement;
- assigned evidence actions;
- audit entries for material changes; and
- a statement that consensus is a facilitated working judgement, not independent validation.

## Handover: keeping HDRL within its evidence boundaries

- The canonical catalogue is the source for indicator names, descriptors and minimum evidence. Product guidance never silently edits it.
- Optional orientation impressions teach the eight-domain shape and are not HDRL scores.
- The whole-framework snapshot uses exact canonical level wording but remains provisional and visibly separate from the evidence-led record.
- Evidence-led results describe the evidence available at a date within a stated boundary.
- The report shows missing evidence, low certainty and unassessed scope rather than imputing optimistic values.
- Rules generate questions and carry forward user actions; they do not invent authoritative recommendations.
- No overall score, rank, badge, pass/fail or participation decision is produced.
- Team distributions remain visible after calibration.
- Reports identify method and versions and invite critique and further validation.
- The public-beta operating model keeps assessment results on the user's device. OPL Advisory receives only a minimum participant record, allow-listed funnel events and feedback the user submits; sharing results is a separate explicit action.

## Open issues for review

### Legal and data protection

- controller/joint-controller position;
- thin beta-service and transactional-email processors, operational region and spend;
- lawful basis for free report delivery and framework-improvement analysis;
- LIA/PECR assessment for the pseudonymous event funnel and browser storage/access;
- retention periods and backup treatment;
- international-transfer safeguards and processor contracts;
- PECR wording for optional research/newsletter contact;
- age/child-user assessment; and
- whether a DPIA is legally required as well as good practice.

### Framework and public contributors

- eight rapid questions and impression-band language;
- local median-range convention;
- domain-level common mistakes and dependencies;
- report limitation and invitation language;
- evidence status vocabulary;
- use of service type, scale and region in aggregation; and
- governance for future research releases.

### User research

- 5–10 minute completion target;
- 30–60 minute target for the 64-indicator snapshot and whether domain pauses feel manageable;
- whether users distinguish rapid impressions from HDRL levels;
- whether users distinguish provisional snapshot selections from evidence-led judgements;
- indicator-task-list usability across 64 items;
- mobile evidence entry;
- usefulness of the gate and minimum required fields;
- whether verified report unlock is an acceptable exchange for beta participation, and how many people abandon before it;
- comprehension of feedback “without contact details” and the explicit results share bundle;
- team blind-round and disagreement workflow;
- deletion/export comprehension; and
- accessibility with real assistive-technology users.
