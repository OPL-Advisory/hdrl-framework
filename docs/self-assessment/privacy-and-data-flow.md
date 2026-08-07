---
title: Self-assessment privacy and data-flow assessment
description: Draft privacy model, data-flow assessment, notices, retention and review points for an HDRL self-assessment service.
---

# Self-assessment privacy and data-flow assessment

**Status:** draft for product design. It requires formal legal and data-protection review before production.

## Proposed roles

The proposed initial controller is **OPL Advisory Ltd**, because it currently administers the framework website and would determine the operational purposes and means of the assessment service. Research Data Scotland would receive no identifiable assessment data by default. If Research Data Scotland or another sponsor jointly determines purposes or access, the parties must document whether the arrangement is joint controllership or controller/processor before launch.

Proposed processors are the approved application host/CDN, managed database/authentication provider, transactional email provider, monitoring provider and backup provider. Each requires due diligence, an Article 28 contract, sub-processor review, location/transfer assessment, deletion commitments and incident terms.

## Recommended public-beta boundary

The first public beta should **not** operate a server-side assessment workspace. Levels, certainty, applicability, boundary text, comments, evidence and report contents remain in the user's browser. OPL Advisory receives only the information needed to understand beta adoption, verify report access and receive optional feedback. Server-side assessment storage, team workspaces and benchmarking are later, separately approved features.

This reduces confidentiality and contractual friction but does not remove data-protection obligations: verified participant details, pseudonymous beta-session events, security logs and feedback can still be personal data.

## Data flow

```text
Public site ──normal link──> browser assessment (IndexedDB)
                                  │
                                  ├── local levels, certainty, notes, evidence
                                  ├── local HTML report / JSON / CSV / print
                                  │
                                  ├── allow-listed funnel events ──> beta event store
                                  │                                  (no results/text)
                                  │
                                  ├── report-gate details ──> email OTP + participant store
                                  │                           (no assessment upload)
                                  │
                                  └── optional feedback ──> separate feedback store
                                      without contact details OR explicitly contactable

Public-site analytics is disabled on the assessment route. It receives no
email, beta-session identifier, response, evidence or report information.
```

No patient-level data, personal confidential data, credentials or unnecessarily sensitive operational information is required or permitted.

## Purposes and proposed lawful bases

| Purpose | Data | Proposed basis | Review point |
|:--|:--|:--|:--|
| Measure beta starts, progress and requested exports | random beta-session identifier, allow-listed event/time, coarse duration and completion counts | Legitimate interests | Complete an LIA; confirm any PECR/storage-access implications and provide a simple objection where required. No assessment values or text. |
| Verify report access and know who completed the beta | email, role, organisation, optional profile bands, verification/security events | Contract where necessary to deliver the requested report; legitimate interests for proportionate security and beta administration | Confirm that the free-service terms form a suitable contract and test whether role/organisation are genuinely necessary. |
| Generate and save the assessment/report | browser-only boundary, responses, rationale, evidence references | Processing occurs locally at the user's direction; OPL Advisory does not receive these data in the public-beta model | Confirm that no request, log, analytics event or crash report can capture the content. |
| Receive feedback without contact details | rating/category/comment and allow-listed coarse tool context | Legitimate interests | Do not promise legal anonymity; exclude participant/session IDs, separate storage and minimise network logs. |
| Receive contactable feedback | feedback plus explicit participant/contact reference | Legitimate interests for responding to the requested contact; consent if later contact goes beyond that request | Make the choice explicit and separate from report delivery and marketing. |
| Support access, correction, export and deletion | account and request records | Legal obligation and/or basis used for the service | Define identity-verification and response procedures. |
| Improve the tool and framework | aggregate funnel measures and feedback deliberately submitted by users | Legitimate interests; separate consent/permission for identifiable quotations or case studies | The public beta has no central result dataset. Future result research requires explicit sharing and new governance. |
| Invite optional research contact | email and preference record | Consent; PECR consent where the message is electronic direct marketing | Separate, specific, unbundled, recorded and withdrawable. |
| Newsletter or promotional updates | email and preference record | Consent unless a reviewed PECR exception genuinely applies | Do not infer from report delivery or research participation. |

ICO guidance distinguishes a requested service message from marketing: an emailed report requested by the user does not grant permission for promotional email. See [planning direct marketing](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/direct-marketing-guidance/plan-direct-marketing/) and [electronic mail marketing](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-direct-marketing-using-electronic-mail/).

The Data (Use and Access) Act 2025 is fully in force. ICO guidance continues to require purpose clarity, necessity, transparency and accountability; several detailed UK GDPR pages remain under review and should be rechecked before launch. See the [ICO DUAA summary](https://ico.org.uk/about-the-ico/what-we-do/legislation-we-cover/data-use-and-access-act-2025/the-data-use-and-access-act-2025-duaa-summary-of-the-changes/).

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
| Pseudonymous beta-session events | Six months after last event, then delete; retain only reviewed aggregate counts if still necessary |
| Verified beta participant | 12 months after the beta or last participant activity, whichever is later; review at six months and provide earlier deletion |
| Feedback without contact details | 12 months, then delete or retain only a reviewed non-identifying synthesis |
| Contactable feedback | 12 months after closure of the feedback/follow-up, unless the person separately opts into research contact |
| Transactional email delivery logs | 30 days unless needed for a live support/security issue |
| Application security/IP logs | Target 30 days; shorten further if the provider supports adequate abuse investigation |
| Consent/preference record | Until withdrawal plus a proportionate suppression record to honour the withdrawal; review at 24 months |
| Live data after verified deletion | Remove promptly, target within 24 hours |
| Backups after deletion | No new live use; expire within the provider's documented backup window, target no more than 30 days |
| Aggregate beta counts | Review annually; retain only while necessary and non-identifying |

If a later server-side assessment workspace is approved, its draft, report, audit and invitation retention requires a separate schedule; it is not covered by the public-beta periods above.

The ICO requires justified retention rather than a universal period and recommends erasure or anonymisation when data are no longer needed: [storage limitation](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/storage-limitation/).

## Confidentiality and access

- Public-beta assessment responses and reports remain on the user's device and are not visible to OPL Advisory.
- Beta operations staff can see only the participant, event or feedback fields needed for their role. Routine support must not have access to all three stores.
- Feedback without contact details has no participant or beta-session foreign key. Contactable feedback is linked only after the user explicitly selects that mode.
- Administrative access is MFA-protected, just-in-time where practical, time-limited and logged.
- Individual scores, evidence and reports are not shared with other organisations or users without an explicit owner action.
- Assessment data are never used for accreditation, funding or participation decisions by the service operator.
- A later team workspace must preserve independent hidden submissions and role-based access, but those controls are outside the public-beta data model.

## Aggregation and anonymisation

The public beta has no central result dataset, so it cannot generate a maturity benchmark. Pseudonymisation alone does not make beta-session events or participant records anonymous. Any future pipeline using explicitly shared results should:

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

Small-cell rules are contextual rather than magic numbers. ONS advises considering sparsity, zeros, differencing, dimensionality and sensitivity, and using aggregation, rounding or suppression as appropriate: [ONS disclosure-control policy](https://www.ons.gov.uk/methodology/methodologytopicsandstatisticalconcepts/disclosurecontrol/policyonprotectingconfidentialityintablesofbirthanddeathstatistics). ICO guidance requires a comprehensive governance approach and a DPIA for anonymisation: [anonymisation governance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-sharing/anonymisation/what-accountability-and-governance-measures-do-we-need/).

## Analytics separation

- Use a different project, access role and retention policy for public-site analytics.
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

## Draft privacy notice

### Who we are

OPL Advisory Ltd is proposed to operate the HDRL self-assessment service and act as controller. This must be confirmed before launch. The HDRL Framework was commissioned by and is owned by Research Data Scotland, but Research Data Scotland will not receive identifiable assessment records unless a separate arrangement and notice say otherwise.

### What we collect and why

Your assessment—including levels, certainty, scope, comments, evidence references and report—stays in your browser unless you deliberately download or share it. OPL Advisory cannot see or recover it.

We collect a random beta-session identifier and a limited set of events to understand how many people start, make progress, reach the report and request downloads. Events contain tool versions, coarse time bands and completion counts, but no assessment values or text. At report access we collect a verified email address, role and organisation, plus any optional broad profile information you provide, so we can administer the beta and know who reached the report. We collect feedback only when you submit it.

We do not use assessment data to accredit you, decide funding or participation, advertise to you, profile individuals or sell data. We do not publish identifiable assessment information.

### Sharing

Participant, event and feedback records are available only to authorised OPL Advisory personnel and suppliers that process them under contract. Feedback submitted without contact details is stored without your email, organisation or beta-session identifier; however, free text or unusual context can still identify you. We do not share individual scores, evidence or reports with another organisation because we do not receive them unless you explicitly create and send a results bundle. Identifiable quotations, case studies and examples require separate permission.

### Framework improvement

We analyse aggregate funnel measures and the feedback people choose to submit to understand how the framework and tool are used and where guidance is unclear. The public beta does not provide OPL Advisory with a result dataset and will not produce maturity benchmarking. Individual feedback may influence future guidance indirectly, but identifiable quotations, case studies or examples need separate permission.

If a user explicitly shares results for beta support, that does not silently enrol the results in research or benchmarking. Any future analysis of suitably aggregated and de-identified assessment results needs a defined research purpose, new notice/lawful-basis review, controlled ingestion, disclosure-risk assessment and an explicit sharing route. Scores, comments and evidence must never be harvested from local browser data or report downloads.

### Retention and rights

Retention periods are defined for each record and are not indefinite. You can delete the local draft in the tool. Depending on the circumstances, you may ask for access, correction or deletion of your participant/contactable-feedback record, or object to processing. Feedback submitted without contact details may be impossible to locate reliably without collecting more identifying information. The production notice will provide a controller address, privacy email, complaint route and ICO details.

### Marketing and contact

Providing an email address to receive or access a report does not subscribe you to marketing. Research contact and newsletters use separate, optional choices. You can withdraw either choice at any time without losing access to your report.

### International processing

The operational region and suppliers have not yet been approved. Before launch, locations and any restricted transfers will be identified, assessed and protected using an applicable adequacy route or safeguard. See the ICO [international transfers guide](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/a-guide-to-international-transfers/).

## Just-in-time notices

### Boundary screen

> Use a boundary that is meaningful and no broader than needed. Do not include patient names, patient-level information, passwords, API keys or sensitive security details. In this prototype, entries stay on this device.

### Evidence screen

> Add a reference and short note, not the evidence document itself. Do not enter patient-level data, personal confidential data, credentials or unnecessarily sensitive operational information. A reference does not mean the evidence has been independently reviewed.

### Save and return

> Your draft is saved only in this browser on this device. OPL Advisory cannot see or recover it. Clearing browser data will remove it; use an export if you need a separate copy.

### Beta activity

> We record that this beta was started, coarse time and completion bands, and whether report, download and feedback actions were reached. We do not include your levels, certainty, assessment boundary, comments, evidence or report contents. Public-site analytics is disabled on this route.

### Feedback

> Feedback is optional and can be skipped. “Without contact details” feedback includes a rating/category/comment and limited tool context, but no email, organisation or beta-session identifier. Avoid identifying or sensitive information in free text; wording or unusual context can still identify you.

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
- approve lawful bases and legitimate-interest assessments;
- complete the DPIA and records of processing;
- approve controller contact, rights and complaint wording;
- review DUAA 2025 and current ICO guidance at launch;
- approve processor contracts, sub-processors, locations and transfer safeguards;
- validate retention, backup expiry and deletion evidence;
- approve statistical disclosure-control protocol;
- review optional-contact wording and preference records under PECR;
- decide whether children are reasonably likely to use the service;
- assess whether free text could contain special-category or confidential information;
- public-contributor review of the notice, aggregation proposal and responsible-use language; and
- production penetration/access-control testing and incident runbook exercise.
