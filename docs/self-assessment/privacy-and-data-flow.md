---
title: Self-assessment privacy and data-flow assessment
description: Draft privacy model, data-flow assessment, notices, retention and review points for an HDRL self-assessment service.
---

# Self-assessment privacy and data-flow assessment

**Status:** draft for product design. It requires formal legal and data-protection review before production.

## Proposed roles

The proposed initial controller is **OPL Advisory Ltd**, because it currently administers the framework website and would determine the operational purposes and means of the assessment service. Research Data Scotland would receive no identifiable assessment data by default. If Research Data Scotland or another sponsor jointly determines purposes or access, the parties must document whether the arrangement is joint controllership or controller/processor before launch.

Proposed processors are the approved application host/CDN, managed database/authentication provider, transactional email provider, monitoring provider and backup provider. Each requires due diligence, an Article 28 contract, sub-processor review, location/transfer assessment, deletion commitments and incident terms.

## Data flow

```text
Public site ──normal link──> Assessment application
                                 │
                   email OTP ────┼────> transactional email processor
                                 │
User browser ──TLS──> application/API ──> UK-region operational database
                                 │                    │
                                 │                    ├─ encrypted backup
                                 │                    └─ application audit log
                                 │
                                 ├─> accessible report/export for authorised user
                                 │
                                 └─> scheduled de-identification pipeline
                                              │
                                              └─ thresholded aggregate store

Plausible website analytics is separate and receives no assessment values,
email addresses, evidence, report content, workspace IDs or authentication events.
```

No patient-level data, personal confidential data, credentials or unnecessarily sensitive operational information is required or permitted.

## Purposes and proposed lawful bases

| Purpose | Data | Proposed basis | Review point |
|:--|:--|:--|:--|
| Authenticate, isolate and secure a workspace | email, session/security events, membership | Contract where necessary to deliver the user-requested service; legitimate interests for proportionate security and abuse prevention | Confirm that the free-service terms form a suitable contract; otherwise document an LIA. |
| Save an assessment and deliver its report | boundary, responses, rationale, evidence references, contact details | Contract or legitimate interests | Confirm necessity of every registration field. |
| Support access, correction, export and deletion | account and request records | Legal obligation and/or basis used for the service | Define identity-verification and response procedures. |
| Improve the tool and framework using de-identified patterns | operational source data transformed into a separate aggregate dataset | Legitimate interests for the transformation; anonymous outputs fall outside UK GDPR only if identifiability risk is sufficiently remote | Complete LIA, DPIA and anonymisation review; allow objection where applicable. |
| Invite optional research contact | email and preference record | Consent; PECR consent where the message is electronic direct marketing | Separate, specific, unbundled, recorded and withdrawable. |
| Newsletter or promotional updates | email and preference record | Consent unless a reviewed PECR exception genuinely applies | Do not infer from report delivery or research participation. |

ICO guidance distinguishes a requested service message from marketing: an emailed report requested by the user does not grant permission for promotional email. See [planning direct marketing](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/direct-marketing-guidance/plan-direct-marketing/) and [electronic mail marketing](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-direct-marketing-using-electronic-mail/).

The Data (Use and Access) Act 2025 is fully in force. ICO guidance continues to require purpose clarity, necessity, transparency and accountability; several detailed UK GDPR pages remain under review and should be rechecked before launch. See the [ICO DUAA summary](https://ico.org.uk/about-the-ico/what-we-do/legislation-we-cover/data-use-and-access-act-2025/the-data-use-and-access-act-2025-duaa-summary-of-the-changes/).

## Data minimisation

### Required at onboarding

- assessment title;
- service or ecosystem name;
- boundary and time period;
- system, service or dual unit;
- individual or team method; and
- intended use.

### Required at report gate

- name and email: identify the recipient and secure report access;
- role and organisation: interpret the perspective and authority behind the assessment;
- country or region: interpret governance context and route privacy rights;
- service type and approximate scale: interpret scope without collecting detailed organisational data.

Test whether name, organisation and role can be optional for an individual exploratory report. Do not require phone number, postal address, exact staff count, patient population, date of birth or demographic information.

## Retention and deletion proposal

| Record | Retention |
|:--|:--|
| Unverified OTP/account attempt | 24 hours |
| OTP | 10 minutes, single use |
| Pending invitation | 14 days |
| In-progress workspace | Delete after 12 months of inactivity, with warning at 9 and 11 months |
| Completed assessment/report | 24 months after completion or last owner activity; offer renewal and immediate owner deletion |
| Transactional email delivery logs | 30 days unless needed for a live support/security issue |
| Application security logs | 90 days |
| Material assessment audit trail | Same life as workspace; include in export and deletion |
| Consent/preference record | Until withdrawal plus a proportionate suppression record to honour the withdrawal; review at 24 months |
| Live data after verified deletion | Remove promptly, target within 24 hours |
| Backups after deletion | No new live use; expire within the provider's documented backup window, target no more than 30 days |
| De-identified aggregate | Review annually; retain only while it remains necessary, useful and demonstrably anonymous |

The ICO requires justified retention rather than a universal period and recommends erasure or anonymisation when data are no longer needed: [storage limitation](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/storage-limitation/).

## Confidentiality and access

- Workspace data are visible only to authorised members.
- Owners manage membership, export, report access and deletion.
- Contributors see only the workspace/rounds allocated to them.
- Reviewers are read-only except for review status/comments.
- Independent team answers remain hidden from other participants until the round closes.
- Support access is just-in-time, time-limited, approved, logged and never used for routine browsing.
- Individual scores, evidence and reports are not shared with other organisations or users without an explicit owner action.
- Assessment data are never used for accreditation, funding or participation decisions by the service operator.

## Aggregation and anonymisation

Pseudonymisation alone does not make data anonymous. The source workspace remains personal/confidential data. A separate pipeline should:

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
- Never initialise analytics with email, user/workspace ID or organisation.
- Never include assessment state in paths, query strings, fragments, event names or referrers.
- Maintain an allow-list of events such as `assessment_started`, `stage_completed` and `delete_completed`; values and text are prohibited.
- Prefer server-side aggregate operational counters or no product analytics in the first pilot.
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

We collect the account and service information needed to secure your workspace, save your assessment, generate your report and respond to your requests. Your assessment may contain maturity judgements, certainty, rationale, domain-level capacity notes, improvement notes and references to evidence. Do not enter patient-level data, personal confidential data, credentials or information that is more sensitive than needed.

We do not use assessment data to accredit you, decide funding or participation, advertise to you, profile individuals or sell data. We do not publish identifiable assessment information.

### Sharing

Your workspace is shared only with people you or another authorised owner invite and with suppliers that process data for the service under contract. We do not share individual scores, evidence or reports with another organisation without your explicit instruction. Identifiable quotations, case studies and examples require separate permission.

### Framework improvement

We may analyse suitably aggregated and de-identified patterns to understand how the framework and tool are used and where guidance is unclear. Free text, evidence references, emails, names, organisations and service names are excluded. We apply minimum group sizes, suppression and disclosure-risk review. Individual inputs may therefore influence future guidance indirectly, but they will not be published as individual results.

### Retention and rights

Retention periods are defined for each record and are not indefinite. You can export or delete a workspace through the service. Depending on the circumstances, you may ask for access, correction, erasure, restriction or portability, or object to processing. The production notice will provide a controller address, privacy email, complaint route and ICO details.

### Marketing and contact

Providing an email address to receive or access a report does not subscribe you to marketing. Research contact and newsletters use separate, optional choices. You can withdraw either choice at any time without losing access to your report.

### International processing

The proposed operational database is in the UK. Some suppliers or support functions may involve restricted transfers. These will be identified, assessed and protected using an applicable adequacy route or safeguard before launch. See the ICO [international transfers guide](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/a-guide-to-international-transfers/).

## Just-in-time notices

### Boundary screen

> Use a boundary that is meaningful and no broader than needed. Do not include patient names, patient-level information, passwords, API keys or sensitive security details. In this prototype, entries stay on this device.

### Evidence screen

> Add a reference and short note, not the evidence document itself. Do not enter patient-level data, personal confidential data, credentials or unnecessarily sensitive operational information. A reference does not mean the evidence has been independently reviewed.

### Save and return

> Production: your draft is encrypted and visible only to authorised workspace members. Prototype: the draft is saved only in this browser on this device. Clearing browser data will remove it.

### Report gate

> We need these details to secure and interpret your report. Report delivery is a service message, not marketing. The two optional contact choices below are separate and unchecked.

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
