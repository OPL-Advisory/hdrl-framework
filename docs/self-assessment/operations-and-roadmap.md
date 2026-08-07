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
2. Use a pull-request preview or local environment; the public configuration must keep remote clients disabled.
3. Run the MkDocs strict build and catalogue/site/self-assessment checks.
4. Perform keyboard, screen-reader, 320px reflow, 400% zoom, contrast and reduced-motion testing.
5. Test representative long indicators, rationale, evidence notes and report tables.
6. Maintain the dedicated Supabase London project as non-public staging and use only synthetic participant/feedback records until release approval.
7. Prove that result fields and request bodies are rejected or redacted, feedback without contact details has no participant or analytics key, and verification/deletion controls work.
8. Pilot with an invited cohort using non-sensitive assessment boundaries.
9. Review incidents, support demand, funnel loss and user research before any wider launch or server-side assessment feature.

### Current activation state

The dedicated Supabase project **HDRL Framework Beta** is deployed in West Europe (London). Its versioned Postgres migrations, RLS, least-privilege grants, scheduled retention and `beta-service` Edge Function are live. The project database contains no assessment or report tables and synthetic feedback used for verification has been removed.

The website configuration is intentionally set to `remote_collection_enabled: false`, `plausible.enabled: false` and `supabase_publishable_key: null`. This is a fail-closed non-public state: the service URL may be inspected, but no public form can use Supabase or emit beta events. Assessment answers and reports remain local regardless of later activation.

The user approved the dedicated project and its additional US$10 monthly charge. On 7 August 2026, IONOS Mail Basic was activated with five licences at £2.50/month excluding VAT. `report@hdrlframework.org` is the authenticated sending mailbox and `privacy@hdrlframework.org` forwards to a monitored OPL Advisory inbox. Delivery through the privacy forwarding route was confirmed by the operator. The mailbox credential was rotated by the operator and updated in Supabase; its password-manager custody must remain part of the operational access review. Supabase's built-in email service is not a beta delivery channel.

Supabase custom SMTP is active through `smtp.ionos.co.uk` on port 587 with sender name `HDRL Framework beta`. Passwordless sign-in uses one six-digit, 10-minute OTP journey for both new and returning users: Supabase's separate pre-sign-in email-confirmation step is disabled, while ownership is still verified when the emailed OTP is successfully presented. Both the first-time and returning-user templates are token-only and contain no magic link. After credential rotation, a synthetic request, delivery and correct-code exchange passed on 7 August 2026 and reuse of the same code was rejected with HTTP 403. Wrong-code, expiry, throttling and enumeration checks remain release gates.

Plausible Business is active from 7 August 2026 at £19/month excluding VAT (£22.80 including VAT), renewing monthly, with an allowance of up to 10,000 monthly pageviews. Seven core event goals are configured: beta started, snapshot domain completed, snapshot completed, report unlocked, report download requested, feedback submitted and feedback skipped. The Business plan permits the coarse custom properties proposed for active-time bands and section context, but the HDRL beta loader remains disabled and no identifier or assessment property is configured.

## Security test set

| Test | Expected result |
|:--|:--|
| Request OTP for registered/unregistered email | Neutral response, same observable timing class, rate limit and no account enumeration. |
| Reuse or brute-force OTP | Single use, short expiry, throttled attempts and security event without secret logging. |
| Add `level`, `certainty`, email, scope or free text to an event request | Server rejects the property/request; logs do not reproduce it. |
| Submit feedback without contact details | Stored without participant foreign key or authentication token; security metadata uses the approved short retention. |
| Correlate feedback and Plausible events | No application join key; systems and access roles are separated. |
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

The following checks were completed against this branch on 7 August 2026 using synthetic content. Tool v0.5 includes migration of earlier on-device draft schemas and the Supabase/Plausible public-beta data boundary:

| Check | Result |
|:--|:--|
| JavaScript syntax and release invariant validator | Passed. Framework 1.0.1, catalogue 1.0.2, tool 0.5.0-beta; eight orientation prompts; 64 snapshot and evidence indicators; no file input. Supabase requires the approved environment, endpoint, publishable key and explicit flag; the committed configuration omits the key and disables both remote services. |
| Existing catalogue and Presentation Kit validators | Passed. 64 indicators, 92 slides and canonical wording/version checks remained intact. |
| MkDocs strict build and site coherence | Passed. The strict build completed; coherence checked 34 indexed pages, 3,032 internal links/anchors, unique descriptions and the canonical framework download checksum. Prototype design documents are `noindex`. |
| New-draft individual journey | Passed from boundary through stage choice, a synthetic snapshot response, partial review, report gate, full local report, optional feedback checkpoint and beta-activity view. The earlier orientation and evidence-led journeys remain available. |
| Framework fidelity | Both snapshot and evidence workspaces expose all 64 indicators. A.1.1 rendered all five exact catalogue descriptors; evidence-led A.1.1 retains the published minimum-evidence wording. Snapshot and evidence responses remain separate. |
| Evidence and output safety | Evidence entry now uses references only and omits “level supported” and review-period questions. Three-nation evidence examples are de-identified prompts, not proof. CSV formula-prefix protection is enforced by the release validator. |
| Reporting | The report rendered the accessible impression-by-certainty matrix, provisional snapshot domain profile, evidence-led Core median and observed range, all 64 evidence-led indicator rows, domain constraints, version provenance, rule traces, limitations and no overall score. JSON and two CSV generation paths are present. Programmatic blob downloads were requested and recorded locally, but the in-app preview did not surface a browser download event; repeat in Safari/Chrome/Firefox before release. |
| Save and return | Passed across browser reload using the same on-device IndexedDB draft. |
| Responsive reflow | Rechecked at a 320px viewport: document width equalled viewport width with no page-level horizontal overflow. Beta boundary/funnel cards, snapshot dashboard and long canonical indicator options reflowed to one column; option and action widths remained within the 288px assessment root. The 5-column orientation matrix retains a labelled internal scroll region. |
| Analytics and indexing | Prototype contains `noindex, nofollow`; its existing public-site analytics is disabled. The beta Plausible loader is configuration-controlled, disables automatic page views and is off in the committed release. |
| Progressive interaction and focus | Passed. Snapshot level selection reveals certainty; not known/not assessed/not applicable clear the level and hide certainty. Evidence-led unstarted indicators retain the binary judgement decision. Next-indicator actions focused the new heading and returned the assessment root to the top of the viewport. |
| Beta privacy contract | Local funnel showed one start, one report unlock, one download request and one feedback submission while the assessment itself contained an L2 selection. Inspection confirmed the operational view exposed counts/actions only and labelled result fields local/explicit-share only. Feedback without contact details excludes participant and analytics identifiers from its export mapping. |
| Thin service unit/privacy tests | Passed. The profile allow-list accepts beta-administration fields only; assessment-like fields are rejected; feedback without contact details cannot carry participant identity. Postgres has RLS on all six beta tables and public grants are revoked. |
| Thin service synthetic integration | Passed against the London Supabase project. Health returned v0.3.0; a synthetic feedback row was accepted and then deleted; an attempted maturity field was rejected with `privacy_boundary_violation`; requests without the publishable key were rejected. London invocation was confirmed through `x-sb-edge-region`. No feedback rows remain. |
| Staging package | Supabase migrations and Edge Function are deployed. Custom IONOS SMTP is active. After operator credential rotation, a synthetic token-only email was delivered from `report@hdrlframework.org`, its six-digit OTP verified successfully, reuse was rejected and the synthetic Auth identity was deleted. The public browser key is deliberately not committed and remote/Plausible flags remain off. Wrong-code, expiry, throttling and enumeration tests remain release gates. |
| Supabase security advisor | Passed after revoking public execution on the platform auto-RLS helper: 0 errors and 0 warnings. Six informational notices confirm the deliberate default-deny design—RLS is enabled and no client policies exist because only the least-privilege service role may use the beta tables. |
| Plausible goal configuration | Plausible Business is active and seven core beta goals are staged. No assessment property or identifier is configured. A controlled live synthetic event/funnel check after privacy approval remains a release gate; the committed loader is off. |
| Browser diagnostics | No application errors or warnings during the v0.5 interaction checks. |

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
2. review aggregate Plausible funnel counts and Supabase Auth/Function failure indicators without attempting identity linkage;
3. investigate verification spikes without copying email/body content into tickets;
4. export participant details only for an approved beta-administration purpose;
5. action verified privacy requests and record completion;
6. confirm the daily retention schedule is running; and
7. rotate/revoke Supabase secret/publishable keys, the rate-limit secret or IONOS SMTP password if compromise is suspected; invalidate Auth sessions as part of the response where appropriate.

Supabase, Plausible and IONOS administrator MFA is mandatory where supported. Store the IONOS mailbox password in an approved password manager and enter it directly into Supabase custom SMTP; never commit it, send it in chat or place it in a URL/shell history. Add a second authorised operator and documented break-glass route before a public beta so the service does not depend on one person being available. Keep the browser-safe publishable key distinct from Supabase secret keys.

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
- Supabase, Plausible and IONOS roles, operational locations, contracts and approved spend;
- lawful basis for free report delivery and framework-improvement analysis;
- LIA/PECR assessment for the aggregate Plausible event funnel and browser storage/access;
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
