---
title: Self-assessment privacy and data-flow assessment
description: Draft privacy model, data-flow assessment, notices, retention and review points for an HDRL self-assessment service.
---

# Self-assessment privacy and data-flow assessment

**Status:** draft for product and controller review. An independent review was received on 12 August 2026 and reconciled against current ICO guidance; qualified legal/data-protection approval is still required before production.

## Proposed roles

The working controller determination is **OPL Advisory Ltd** (company number `16704749`; registered office 71–75 Shelton Street, Covent Garden, London WC2H 9JQ), because it administers the framework website and determines the operational purposes and means of the beta service. The ICO registration reference, privacy postal address, accountable owner and deputy remain publication blockers. Research Data Scotland receives no participant or assessment data by default. A written boundary arrangement must record that position and require a new role assessment before Research Data Scotland or another sponsor determines processing purposes, specifies participant measures, receives identifiable records or gains supplier-dashboard access.

The selected design uses **Supabase, Inc.** for email authentication, London-region Postgres, Edge Functions and recovery; **IONOS** for authenticated email delivery; **Plausible Insights OÜ** for product-event aggregation; and **GitHub, Inc.** for the static application and content delivery. GitHub Pages/CDN receives normal request metadata such as visitor IP address and browser details even though it receives no assessment content. Each supplier requires role determination and due diligence, an Article 28 arrangement where applicable, sub-processor review, data-location/transfer assessment, deletion commitments, security-log review and incident terms. The database region is West Europe (London), but that does not by itself establish that every support, authentication, log, backup or sub-processor activity stays in the UK.

Operational participant records remain separate from Plausible. GitHub Pages serves the application and receives request metadata, but no participant record or assessment content from the application API. Supabase, Plausible, IONOS and GitHub operate platform/security logs under their terms; roles, content, access and retention must be confirmed before activation.

## Recommended public-beta boundary

The first public beta should **not** operate a server-side assessment workspace. Levels, certainty, applicability, boundary text, comments, evidence and report contents remain in the user's browser. OPL Advisory receives only the information needed to understand beta adoption, verify report access and receive optional feedback. Server-side assessment storage, team workspaces and benchmarking are later, separately approved features.

This reduces confidentiality and contractual friction but does not remove data-protection obligations: verified participant details, security logs and feedback can still be personal data. Plausible event messages are sent without a participant identifier and aggregated after receipt; they must not be described as legally anonymous.

## Data flow

```text
GitHub Pages/CDN ──page request metadata──> browser assessment (IndexedDB)
                                  │
                                  ├── local levels, certainty, notes, evidence
                                  ├── local HTML report / JSON / CSV / print
                                  │
                                  ├── allow-listed event messages ──> Plausible aggregation
                                  │                                  (no app/user ID or results/text)
                                  │
                                  ├── report-gate details ──> email OTP + participant store
                                  │                           (no assessment upload)
                                  │
                                  └── optional feedback ──> separate feedback store
                                      without contact details OR explicitly contactable

Automatic public-site page views are disabled on the assessment route. Explicit
beta events receive no email, app/user identifier, response, evidence or report.
```

The browser first requests the static application from GitHub Pages/CDN, which receives normal request metadata but no assessment content. It calls Supabase Auth and the Edge Function directly over TLS. Supabase Auth receives the email and OTP state; London Postgres receives the minimum participant profile, preferences, feedback and rights/audit records. Plausible receives individual allow-listed event messages without a participant identifier and aggregates them after receipt. IONOS receives the destination email, sender, one-time-code message and normal delivery metadata; it receives no participant profile, assessment response, report or feedback. Supabase administrator access is not a routine application flow and is protected by account MFA and least privilege.

No patient-level data, personal confidential data, credentials or unnecessarily sensitive operational information is required or permitted.

## Purposes and proposed lawful bases

| Purpose | Data | Proposed basis | Review point |
|:--|:--|:--|:--|
| Measure beta starts, progress and requested exports | allow-listed Plausible event name, tool version, coarse duration and completion counts; no participant identifier | Legitimate interests | Complete an LIA. Use the PECR statistical-purposes exception only with clear information, purpose limitation and a simple, free objection that actually stops the storage/access. No assessment values or text. |
| Verify report access and know who completed the beta | email, role, organisation, optional profile bands, verification/security events | Legitimate interests for running and learning from a controlled beta | Complete the gate LIA and decide whether organisation is necessary. Report generation itself is local, so contract is not relied on. |
| Generate and save the assessment/report | browser-only boundary, responses, rationale, evidence references | Outside the OPL-held beta record by design: OPL Advisory does not receive these data by default | Confirm that no request, log, analytics event or crash report captures the content; separately govern any deliberate share or support copy. |
| Receive feedback without contact details | rating/category/comment and allow-listed coarse tool context | Legitimate interests | Do not promise legal anonymity; exclude participant and analytics identifiers, separate storage and minimise network logs. |
| Receive contactable feedback | feedback plus explicit participant/contact reference | Legitimate interests for responding to the requested contact; consent if later contact goes beyond that request | Make the choice explicit and separate from report delivery and marketing. |
| Support access, correction, export, deletion and complaints | account, request and complaint records | Legal obligation | Define identity verification, response procedures, complaint acknowledgement within 30 days and outcomes without undue delay. |
| Improve the tool and framework | aggregate funnel measures and feedback deliberately submitted by users | Legitimate interests; separate consent/permission for identifiable quotations or case studies | The public beta has no central result dataset. Future result research requires explicit sharing and new governance. |
| Invite optional research contact | email and preference record | Consent; PECR consent where the message is electronic direct marketing | Separate, specific, unbundled, recorded and withdrawable. |
| Newsletter or promotional updates | email and preference record | Consent unless a reviewed PECR exception genuinely applies | Do not infer from report delivery or research participation. |

ICO guidance distinguishes a requested service message from marketing: an emailed report requested by the user does not grant permission for promotional email. See [planning direct marketing](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/direct-marketing-guidance/plan-direct-marketing/) and [electronic mail marketing](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-direct-marketing-using-electronic-mail/).

As checked on 12 August 2026, the ICO states that all stages of the Data (Use and Access) Act 2025 are in force, with the complaints requirements applying from 19 June 2026. ICO guidance continues to require purpose clarity, necessity, transparency and accountability; current guidance must be rechecked at launch. See the ICO's [current DUAA status](https://ico.org.uk/about-the-ico/what-we-do/legislation-we-cover/data-use-and-access-act-2025/the-data-use-and-access-act-2025-how-does-this-affect-me/) and [complaints guidance](https://ico.org.uk/for-organisations/how-to-deal-with-data-protection-complaints/).

## Data minimisation

### Required locally at onboarding (not transmitted)

- assessment title;
- service or ecosystem name;
- boundary and time period;
- system, service or dual unit;
- individual or team method; and
- intended use.

### Report gate for the public beta

- email: verify the beta participant and unlock the requested report;
- role and organisation: give minimum context for beta follow-up and interpretation;
- individual/team use and a broad intended-use category: show how people are applying the beta without collecting detailed plans;
- name: optional personalisation;
- country or region: optional broad operating context; and
- service type and approximate scale: optional broad bands without exact populations or staff counts.

Test whether organisation and role remain proportionate once the beta has enough learning. Do not require phone number, postal address, exact staff count, patient population, date of birth or demographic information. Providing an email for report access is not consent to marketing or general research contact.

## Retention and deletion proposal

| Record | Retention |
|:--|:--|
| Unverified OTP/account attempt | 24 hours |
| OTP | 10 minutes, single use |
| Plausible beta events | Use the approved Plausible plan/retention setting; review aggregate product events after six months and retain only while necessary |
| Verified beta participant | 12 months after the beta or last participant activity, whichever is later; review at six months and provide earlier deletion |
| Feedback without contact details | 12 months, then delete or retain only a reviewed non-identifying synthesis |
| Contactable feedback | 12 months after closure of the feedback/follow-up, unless the person separately opts into research contact |
| Transactional email delivery logs | 30 days unless needed for a live support/security issue |
| Application security/IP logs | Target 30 days; shorten further if the provider supports adequate abuse investigation |
| Consent/preference record | Until withdrawal plus a proportionate suppression record to honour the withdrawal; review at 24 months |
| Live data after verified deletion | Remove promptly, target within 24 hours |
| Backups after deletion | No new live use. Record the actual Supabase Pro backup/recovery schedule and maximum expiry before launch; reconcile any restore against deletions before returning it to service. |
| Aggregate beta counts | Review annually; retain only while necessary and non-identifying |

If a later server-side assessment workspace is approved, its draft, report, audit and invitation retention requires a separate schedule; it is not covered by the public-beta periods above.

The ICO requires justified retention rather than a universal period and recommends erasure or anonymisation when data are no longer needed: [storage limitation](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/storage-limitation/).

## Confidentiality and access

- Public-beta assessment responses and reports remain on the user's device and are not visible to OPL Advisory.
- Beta operations staff can see only the participant or feedback fields needed for their role. Plausible access is separate and contains no Supabase identity.
- Feedback without contact details has no participant foreign key or Plausible identifier. Contactable feedback is linked only after the user explicitly selects that mode.
- Administrative access is MFA-protected, just-in-time where practical, time-limited and logged.
- Individual scores, evidence and reports are not shared with other organisations or users without an explicit owner action.
- Assessment data are never used for accreditation, funding or participation decisions by the service operator.
- A later team workspace must preserve independent hidden submissions and role-based access, but those controls are outside the public-beta data model.

## Aggregation and anonymisation

The public beta has no central result dataset, so it cannot generate a maturity benchmark. Data minimisation does not make participant or feedback records anonymous. Any future pipeline using explicitly shared results should:

1. select only fields required for an approved analysis;
2. remove user, workspace, organisation, service, report and evidence identifiers;
3. exclude all free text, URLs, internal references, exact dates and invitation/audit details;
4. coarsen geography, service type, scale and time;
5. limit each organisation/scope to one eligible assessment per analysis period;
6. require at least **10 distinct organisations** in every internal reported cell and **20** before any public comparative breakdown is considered;
7. suppress secondary cells and block queries that enable differencing;
8. avoid public score benchmarking during MVP and validation;
9. perform motivated-intruder and linkability review before release; and
10. keep a release ledger recording purpose, fields, thresholds, reviewer and residual risk.

Small-cell rules are contextual rather than magic numbers. ONS advises considering sparsity, zeros, differencing, dimensionality and sensitivity, and using aggregation, rounding or suppression as appropriate: [ONS disclosure-control policy](https://www.ons.gov.uk/methodology/methodologytopicsandstatisticalconcepts/disclosurecontrol/policyonprotectingconfidentialityintablesofbirthanddeathstatistics). ICO guidance recommends comprehensive anonymisation governance and considering a DPIA; it does not impose a freestanding DPIA requirement for every anonymisation exercise: [anonymisation governance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-sharing/anonymisation/what-accountability-and-governance-measures-do-we-need/).

## Analytics separation

- Keep Plausible access, purpose and retention separate from Supabase operational records.
- Never initialise analytics with email, participant ID, organisation or feedback ID.
- Never include assessment state in paths, query strings, fragments, event names or referrers.
- Maintain a versioned allow-list such as `assessment_started`, `snapshot_domain_completed`, `snapshot_completed`, `report_unlocked`, `report_download_requested`, `feedback_submitted` and `feedback_skipped`. Only coarse counts/bands and action types are permitted.
- Store feedback text outside the event store. A funnel event may say that feedback was submitted or skipped, never what it said.
- Do not claim that `report_download_requested` proves that a file was saved, retained or opened.
- If storage/access technologies are introduced, review the ICO's April 2026 [storage and access technology guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/), including the statistical-purpose exception and simple objection requirement.

## Security, backup and incidents

- Encrypt in transit and at rest; separate production/staging; rotate secrets.
- Enforce least privilege, administrator MFA, RLS and application authorisation.
- Log membership, export, report access, material changes and deletion without logging content.
- Test workspace isolation, enumeration, injection, OTP abuse, session expiry and report access.
- Restore backups at least quarterly; restored data remain subject to original access and deletion controls.
- Incident plan covers triage, containment, affected records, processor coordination, notification and lessons learned.
- Record all personal-data breaches; where required, notify the ICO within 72 hours and affected people without undue delay when high risk. See [ICO breach guidance](https://ico.org.uk/for-organisations/report-a-breach/personal-data-breach/personal-data-breaches-a-guide/).

### Thin-service implementation

- Supabase Auth holds the verified email; the public beta tables do not duplicate it. Managed encryption at rest and TLS apply, with Postgres RLS enabled and all `anon`/`authenticated` table grants revoked.
- The Supabase secret key and HMAC rate-limit secret are available only to the Edge Function. The website eventually receives only the browser-safe publishable key.
- One-time codes are six digits and expire in 10 minutes. Supabase Auth and the Edge Function apply rate controls; the application stores an expiring HMAC-derived key for abuse control, not the raw source address.
- JSON request schemas use a top-level and nested allow-list. Unexpected assessment-like fields cause a `400 privacy_boundary_violation`; they are not accepted and stripped later.
- Feedback without contact details has no participant foreign key. Feedback timestamps are reduced to a date; operational events go only to Plausible.
- A scheduled job applies the published retention periods. Verified access/export, profile correction and deletion requests use the same OTP channel and record completion without retaining request content indefinitely. A verified-email change is handled through the published privacy contact because it requires separate identity checks.
- Operational endpoints do not put emails, OTPs, session IDs or report data in URLs. Report and export generation remain in the browser.
- Administrative access is a deliberately narrow control for a thin beta, not a general account system. Before production it requires named operators, MFA-protected Supabase and Plausible accounts, a secret-rotation procedure, access review and independent authorisation test.

## Draft privacy notice

### Who we are

OPL Advisory Ltd (company number `16704749`) is the working controller for the HDRL self-assessment beta records described here. Its registered office is 71–75 Shelton Street, Covent Garden, London WC2H 9JQ. The ICO registration reference, approved privacy postal address and accountable contact must be confirmed before publication. The HDRL Framework was commissioned by and is owned by Research Data Scotland, but Research Data Scotland does not operate the beta or receive participant or assessment records under the planned arrangement. Any change requires a new role assessment and updated notice before it takes effect.

### What we collect and why

Your assessment—including levels, certainty, scope, comments, evidence references and report—stays in your browser unless you deliberately export or share it. It is not sent to OPL Advisory through the assessment service, and OPL Advisory cannot retrieve the on-device draft. If you deliberately send assessment content in a share bundle, support message or another route, that copy is outside this default boundary.

We send a limited set of individual event messages to Plausible so it can aggregate how many people start, make progress, reach the report and request downloads. We do not send a participant/session identifier, email or organisation with those events. Events contain tool versions, coarse time bands and completion counts, but no assessment values or text. At report access we collect a verified email address, role and organisation, plus any optional broad profile information you provide, so we can administer the beta and know who reached the report. We collect feedback only when you submit it.

OPL Advisory does not use participant records or assessment content deliberately shared with it to accredit you or make funding or participation decisions. It does not use beta records for advertising or individual profiling, sell them or publish identifiable assessment information. A participant who shares a report with another organisation controls that disclosure; this notice cannot govern the recipient's later use.

### Sharing

Participant and feedback records are available only to authorised OPL Advisory personnel and suppliers that process them under the applicable contractual terms. GitHub receives normal website request metadata but no assessment content. Plausible events are held separately. Feedback submitted without contact details is stored without your email, organisation or participant identifier; however, free text or unusual context can still identify you. We do not share individual scores, evidence or reports with another organisation because we do not receive them unless you explicitly create and send a results bundle. Identifiable quotations, case studies and examples require separate permission.

### Framework improvement

We analyse aggregate funnel measures and the feedback people choose to submit to understand how the framework and tool are used and where guidance is unclear. The public beta does not provide OPL Advisory with a result dataset and will not produce maturity benchmarking. Individual feedback may influence future guidance indirectly, but identifiable quotations, case studies or examples need separate permission.

If a user explicitly shares results for beta support, that does not silently enrol the results in research or benchmarking. Any future analysis of suitably aggregated and de-identified assessment results needs a defined research purpose, new notice/lawful-basis review, controlled ingestion, disclosure-risk assessment and an explicit sharing route. Scores, comments and evidence must never be harvested from local browser data or report downloads.

### Retention and rights

Retention periods are defined for each record and are not indefinite. You can delete the local draft in the tool. Depending on the circumstances, you may ask for access, correction or deletion of your participant/contactable-feedback record, or object to processing. Feedback submitted without contact details may be impossible to locate reliably without collecting more identifying information. The production notice will provide a controller address, privacy email, complaint route and ICO details.

### Marketing and contact

Providing an email address to receive or access a report does not subscribe you to marketing. Research contact and newsletters use separate, optional choices. You can withdraw either choice at any time without losing access to your report.

### International processing

The Supabase database is configured in West Europe (London), and browser requests ask the Edge Function to run in `eu-west-2`. Supabase support, authentication, logs, backups and subprocessors still require a documented location and transfer review. Plausible and IONOS processing must receive the same review; use of an existing account or a UK SMTP hostname is not a substitute for checking the current contracts and subprocessors. See the ICO [international transfers guide](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/a-guide-to-international-transfers/).

## Just-in-time notices

### Boundary screen

> Use a boundary that is meaningful and no broader than needed. Do not include patient names, patient-level information, passwords, API keys or sensitive security details. In this prototype, entries stay on this device.

### Evidence screen

> Add a reference and short note, not the evidence document itself. Do not enter patient-level data, personal confidential data, credentials or unnecessarily sensitive operational information. A reference does not mean the evidence has been independently reviewed.

### Save and return

> Your draft is saved only in this browser on this device. OPL Advisory cannot see or recover it. Clearing browser data will remove it; use an export if you need a separate copy.

### Beta activity

> We count how this beta is used: that it was started, coarse time and completion bands, and whether report, download and feedback actions were reached. We do not send a participant identifier, your email or organisation, levels, certainty, assessment boundary, comments, evidence or report contents. Automatic page views are disabled on this route. You can turn beta analytics off in one action; it takes effect immediately for future events and does not stop requested email verification or feedback you deliberately submit.

### Feedback

> Feedback is optional and can be skipped. “Without contact details” feedback includes a rating/category/comment and limited tool context, but no email, organisation, participant or analytics identifier. Avoid identifying or sensitive information in free text; wording or unusual context can still identify you.

### Report gate

> We use your verified email, role and organisation to unlock the locally generated report and administer the beta. Your assessment and report are not uploaded. Report access is a service message, not marketing. The two optional contact choices below are separate and unchecked.

### Result sharing

> Assessment results stay on this device. If you create a results share bundle, nothing is selected by default. Review the included categories and use an organisation-approved transfer route; the bundle may contain business-sensitive information.

### Optional research contact

> [ ] OPL Advisory may email me about voluntary HDRL research or testing. This is optional. I can withdraw at any time.

### Optional newsletter

> [ ] OPL Advisory may email me occasional HDRL updates. This is optional and separate from report delivery and research contact. I can unsubscribe at any time.

### Team invitation

> The assessment owner invited this email address to a private workspace. Signing in lets you see only workspaces you are authorised to access. Your independent answers remain hidden from other participants until the round closes.

### Aggregation

> Your identifiable assessment is not published. We may use a separate, de-identified aggregate to learn where HDRL is used and which guidance needs improvement. We exclude free text and direct identifiers and suppress small groups.

## Required formal review before production

- confirm controller, joint-controller and processor roles;
- approve and test the data-protection complaints procedure, accountable owner and deputy cover;
- approve lawful bases and legitimate-interest assessments;
- complete the DPIA and records of processing;
- approve controller contact, rights and complaint wording;
- review DUAA 2025 and current ICO guidance at launch;
- approve processor contracts, sub-processors, locations and transfer safeguards;
- record approval of the dedicated Supabase London project and its US$10 monthly increment;
- approve the current Supabase, Plausible and IONOS terms, subprocessors, locations, transfers and recovery/log-retention settings;
- retain the tested `report@hdrlframework.org` IONOS custom SMTP credential through the approved secret/password process;
- retain monitoring and deputy cover for the tested `privacy@hdrlframework.org` rights-contact route;
- validate retention, backup expiry and deletion evidence;
- approve statistical disclosure-control protocol;
- review optional-contact wording and preference records under PECR;
- decide whether children are reasonably likely to use the service;
- assess whether free text could contain special-category or confidential information;
- public-contributor review of the notice, aggregation proposal and responsible-use language; and
- production penetration/access-control testing and incident runbook exercise.
