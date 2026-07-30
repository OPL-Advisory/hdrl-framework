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
- authentication, workspace-isolation and deletion tests;
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
6. After supplier/legal approval, create a separate staging application and synthetic test accounts.
7. Complete isolation and security testing in staging.
8. Pilot with an invited cohort using non-sensitive assessment boundaries.
9. Review incidents, support demand and user research before any wider launch.

## Security test set

| Test | Expected result |
|:--|:--|
| Request OTP for registered/unregistered email | Neutral response, same observable timing class, rate limit and no account enumeration. |
| Reuse or brute-force OTP | Single use, short expiry, throttled attempts and security event without secret logging. |
| Access another workspace by changing ID | Denied by application and database policy; event recorded. |
| Change owner/contributor/reviewer role client-side | Server ignores unauthorised claim. |
| Inject HTML/script in rationale/evidence fields | Stored and rendered as inert text; report/export remains safe. |
| Enumerate report endpoints | No public report; opaque identifiers and authorisation on every read. |
| Inspect URLs/referrers/logs | No email, token, score, evidence, workspace/report data or body content. |
| Delete workspace | Live records removed, access revoked, export no longer available, backup-expiry date recorded. |
| Restore backup | Original permissions and deletion reconciliation reapplied before service. |
| Automated registrations/invitations | Rate limiting, abuse controls, quotas and alerting operate. |

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

The following checks were completed against this branch on 30 July 2026 using synthetic content:

| Check | Result |
|:--|:--|
| JavaScript syntax and release invariant validator | Passed. Framework 1.0.1, catalogue 1.0.2, tool 0.1.0-prototype; eight rapid prompts; 64 reachable indicators; two same-origin data reads; no file input or external submission. |
| Existing catalogue and Presentation Kit validators | Passed. 64 indicators, 92 slides and canonical wording/version checks remained intact. |
| MkDocs strict build and site coherence | Passed. 32 pages, 2,797 internal links/anchors, unique descriptions and canonical framework download checksum. |
| New-draft individual journey | Passed from boundary validation through eight rapid prompts, evidence-led review, report gate and full report. |
| Framework fidelity | The workspace rendered 64 indicator tasks; A.1.1 rendered all five exact catalogue descriptors and its published minimum-evidence wording. |
| Evidence and output safety | An HTML-like synthetic rationale rendered as inert text; no injected image appeared. Evidence entry preserved unsaved judgement fields. CSV formula-prefix protection is enforced by the release validator. |
| Reporting | The report rendered all 64 indicator rows, version provenance, separate rapid/evidence-led sections, rule traces, limitations and no overall score. JSON and CSV generation paths are present; browser download-event capture was not reliable in the test harness and needs a normal-browser regression check. |
| Save and return | Passed across browser reload using the same on-device IndexedDB draft. |
| Responsive reflow | Passed at 390px and 320px browser viewports for the report, indicator workspace and long indicator entry. Measured document width equalled viewport width with no page-level horizontal overflow. |
| Analytics and indexing | Built prototype contains `noindex, nofollow` and no Plausible script; other site pages retain aggregate analytics. |
| Browser diagnostics | No application errors or warnings during the completed journey. |

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
- Rapid impressions teach the eight-domain shape and are not HDRL scores.
- Evidence-led results describe the evidence available at a date within a stated boundary.
- The report shows missing evidence, uncertainty and unassessed scope rather than imputing optimistic values.
- Rules generate questions and carry forward user actions; they do not invent authoritative recommendations.
- No overall score, rank, badge, pass/fail or participation decision is produced.
- Team distributions remain visible after calibration.
- Reports identify method and versions and invite critique and further validation.

## Open issues for review

### Legal and data protection

- controller/joint-controller position;
- lawful basis for free report delivery and framework-improvement analysis;
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
- whether users distinguish rapid impressions from HDRL levels;
- indicator-task-list usability across 64 items;
- mobile evidence entry;
- usefulness of the gate and minimum required fields;
- team blind-round and disagreement workflow;
- deletion/export comprehension; and
- accessibility with real assistive-technology users.
