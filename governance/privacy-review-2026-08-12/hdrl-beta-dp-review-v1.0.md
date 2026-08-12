---
title: HDRL public beta — data protection review
subtitle: Prioritised review, role analysis, lawful basis assessment and publication checklist
version: 1.0
date: 12 August 2026
reviewer: Independent review, prepared as a review and drafting exercise
status: Draft for controller decision
---

# HDRL public beta — data protection review

**This is a review and drafting exercise, not formal legal advice, and it is not a substitute for sign-off by a qualified solicitor or data-protection adviser.** Items marked **[SOLICITOR]** should be referred before publication.

Each finding is classified as one of:

- **[LEGAL]** — a requirement of the UK GDPR, the Data Protection Act 2018, the Data (Use and Access) Act 2025 or PECR;
- **[GOOD PRACTICE]** — recognised ICO or sector expectation, not itself a statutory duty;
- **[RISK]** — a risk-based recommendation proportionate to this service; or
- **[DESIGN]** — an optional product-design choice.

---

## 1. State of the law at the date of this review

The pack asserts that the Data (Use and Access) Act 2025 "is fully in force". It is not, and the assertion should be removed rather than corrected in passing, because a dated statement of the legal position is more useful than an undated one.

Commencement has been phased through six sets of regulations. The great majority of the Part 5 data protection and PECR amendments commenced on **5 February 2026** under the Data (Use and Access) Act 2025 (Commencement No. 6 and Transitional and Saving Provisions) Regulations 2026 (SI 2026/82). Section 103 (complaints by data subjects) commenced on **19 June 2026** under the same instrument. Section 119, which transfers the Commissioner's functions to the Information Commission, has not been fully commenced, so the ICO remains the supervisory authority to name in the notice.

Five changes bear directly on this service.

**Complaints.** Section 103 inserted sections 164A and 164B into the DPA 2018. Since 19 June 2026 every controller must facilitate complaints, acknowledge receipt within 30 days, investigate without undue delay and communicate the outcome. The ICO's guidance *How to deal with data protection complaints* (12 February 2026) states there are no exemptions. This is addressed at P1-02.

**Storage and access technologies.** Section 112 and Schedule 12 substituted PECR regulation 6 and inserted Schedule A1, adding three consent exceptions to the existing communication and strictly necessary exceptions: statistical purposes, appearance, and emergency assistance. The ICO finalised its *Guidance on the use of storage and access technologies* on **29 April 2026** following two consultations, adding sub-chapters on what "a simple means of objecting" means and on using one technology for multiple purposes. The pack's reference to "the ICO's April 2026 storage and access technology guidance" is therefore correct, but the pack has not applied it. This is addressed at P1-05.

**Enforcement.** Section 115 and Schedule 13 aligned the PECR enforcement regime with the UK GDPR. The old £500,000 PECR ceiling has gone; the maximum is now £17.5m or 4% of worldwide annual turnover. The DUAA also extends liability to the "instigator" of storage or access. For a small consultancy the practical risk remains reprimands and enforcement notices rather than fines, but the change removes the argument that PECR is a lower-priority regime than the UK GDPR.

**Recognised legitimate interests.** A new Article 6(1)(ea) and Annex 1 remove the balancing test for a closed public-interest list: national security and defence, emergencies, detection and prevention of crime, safeguarding vulnerable individuals, and disclosures to public bodies performing public interest tasks. **None of these applies to this service.** Direct marketing, intra-group transmission and network security are named in the Act only as examples of ordinary Article 6(1)(f) interests and still require a full legitimate interests assessment. The pack should not assume the DUAA has reduced the LIA burden here; it has not.

**Purpose limitation and research.** The DUAA remodelled further processing so that all reuse must be compatible, with consent as the principal route to compatibility unless an Annex 2 derogation applies, and introduced a statutory definition of scientific research. This tightens, rather than loosens, the future path from "beta feedback" to "research dataset" described in the aggregation section. **[SOLICITOR]** if any future research reuse is contemplated.

**Article 35 is unchanged.** The DPIA obligation and threshold are as before. The ICO's DPIA guidance and its list of processing likely to result in high risk are both marked as under review pending DUAA updates, so the position should be rechecked at sign-off.

---

## 2. Controller and processor roles

### 2.1 OPL Advisory Ltd as controller

On the facts given, OPL Advisory Ltd is the controller for the beta service and the analysis is straightforward: it determines that the beta will run, what is measured, what the report gate requires, how long records are kept and who is contacted. Nothing in the pack undermines this. Record the determination formally rather than leaving it as "proposed initial controller"; a notice that says a controller is "proposed" is not a notice.

Note a distinction the pack currently blurs. For the assessment content itself, OPL Advisory is not a controller at all, because it does not determine the purposes and means of processing that happens entirely within the participant's browser under the participant's own direction and never reaches OPL Advisory. That is a stronger and more honest position than "processing occurs locally at the user's direction", which reads as a lawful basis and is not one. State it as a scope boundary, not a basis.

### 2.2 Research Data Scotland

**Commissioning and owning the framework does not make RDS a controller.** Intellectual property in a set of indicators is not personal data, and ownership of a methodology confers no determination over the processing of participant records. On the arrangement as described, RDS is neither controller nor processor and receives nothing.

That position is fragile in five specific and foreseeable ways, and the *Wirtschaftsakademie* and *Fashion ID* line of authority is clear that joint controllership can arise without any access to the data at all. Joint controllership would arise if RDS:

1. asks for, or is given, participant names, organisations or contact details;
2. specifies what the beta must measure about participants, as distinct from commenting on the framework;
3. receives identifiable feedback or is copied into contactable follow-up;
4. is presented on the assessment route in a way that a reasonable participant would read as RDS operating the service; or
5. obtains access to the Supabase project or the Plausible dashboard for any purpose.

**Recommendation [RISK].** Put a one-page written arrangement in place before publication recording that RDS receives no personal data, that aggregate statistical outputs containing no personal data may be shared, and that any of the five triggers requires a documented Article 26 arrangement with a published essence before it takes effect. This costs an afternoon now and avoids an unmanaged joint controllership later. The notice should state plainly that RDS commissioned and owns the framework and does not receive participant information, precisely so that participants do not infer a relationship that does not exist.

### 2.3 Processors and recipients

| Party | Entity to confirm | Role | Position |
|:--|:--|:--|:--|
| Supabase | Supabase, Inc. (US) | Processor | Article 28 terms and a transfer mechanism both required. London database region does not resolve the transfer question: the contracting entity, support access and subprocessors are the relevant test, not where the Postgres instance sits. |
| Plausible | Plausible Insights OÜ (Estonia) | Processor | UK adequacy regulations cover the EEA, so no Article 46 safeguard is needed, but Article 28 terms are still required. Confirm hosting location and, critically, that Plausible uses the data only to provide the service. |
| IONOS | Entity unconfirmed | Processor | `smtp.ionos.co.uk` indicates a UK service but not a UK contracting entity. Confirm entity, DPA, subprocessors, mail log content and retention. |
| GitHub | GitHub, Inc. (US) | **Undetermined — see P1-07** | Currently described as receiving "no participant record or assessment content". True but incomplete: GitHub Pages and its CDN receive visitor IP addresses and user agents. This is personal data and GitHub is an undisclosed recipient. |

**The GitHub gap is the most significant omission in the recipients analysis.** The pack treats GitHub as outside the data flow because the application API does not send it anything. That is the wrong test. Every participant who loads the assessment route discloses an IP address to GitHub and its CDN before any of the designed boundaries engage. Determine whether GitHub acts as processor for those logs or as controller for its own security purposes, disclose it as a recipient, and record the transfer position.

---

## 3. Purposes and lawful bases

### 3.1 Report gate — the central issue

The pack proposes "contract where necessary to deliver the requested report; legitimate interests for proportionate security and beta administration". **Drop the contract limb.**

Article 6(1)(b) requires the processing to be necessary for performance of a contract with the data subject. The report is generated in the participant's browser from data that never leaves it. Verifying an email address is not necessary to produce or deliver the report; it is a gate OPL Advisory has chosen to impose in order to know who completed the beta. Relying on contract would misdescribe the service to participants and would not survive scrutiny.

Nor is consent a clean fit, because access to the report is conditional on providing the email address. Consent conditioned on receiving a service is the classic bundling problem.

**Recommendation [LEGAL].** Rely on Article 6(1)(f) legitimate interests for the whole gate — verification, participant record and beta administration — and complete a documented LIA that confronts the honest position rather than dressing it up. The interest is real and articulable: OPL Advisory cannot run a meaningful beta of a framework it is responsible for improving if it cannot tell who completed it or contact them about defects. Necessity is arguable but not automatic, since the beta could run without a gate. The balancing test should turn on the mitigations that are already designed in: no marketing by default, a minimum field set, no assessment content, straightforward deletion, and the fact that participants are professionals acting in a work context rather than consumers disclosing private information.

Two points will decide the balance and both need a named decision. First, **is `organisation` necessary?** It is the field most likely to make a participant identifiable when combined with a role and a rare job title, and its stated justification — "minimum context for beta follow-up and interpretation" — is an analytical convenience, not a necessity. Make it optional unless the LIA can justify it. Second, **your own user research already asks "whether verified report unlock is an acceptable exchange for beta participation, and how many people abandon before it".** If the answer turns out to be that the gate suppresses participation, the legitimate interest weakens at exactly the moment the product case does. Consider the design alternative at P3-02.

### 3.2 Analytics

Two questions must be answered separately and the pack currently answers neither cleanly.

**PECR regulation 6 — is there storage or access on terminal equipment?** Yes, in at least three places, and only one is acknowledged.

- The IndexedDB draft is storage on terminal equipment. The strictly necessary exception is available because save-and-return is the service the participant requests, but the exception is purpose-specific and the ICO's April 2026 guidance is explicit that where one technology serves both an exempt and a non-exempt purpose, consent is required for the whole thing. The configuration sets `local_beta_events: true`. **A local event buffer maintained for the operator's benefit is not strictly necessary to the service the participant requested**, and if it shares the same storage as the draft it puts the exemption for the draft at risk. Separate them or bring the buffer inside the analytics analysis.
- The Plausible script involves access to information in terminal equipment. Cookieless design does not remove regulation 6 from scope; the ICO's guidance covers scripts, pixels and device identifiers.
- The feedback context allow-list includes `viewport_band`. That is device information read from the participant's equipment and belongs in the analytics disclosure, not buried in a feedback schema.

**Which exception applies?** The statistical purposes exception in Schedule A1 fits this design better than consent, and the design was very nearly built for it: aggregate counts about how the service is used, no application identifier, no advertising, no profiling. The exception requires that the sole purpose is collecting statistical information about how the service or website is used with a view to improving it, that clear and comprehensive information is given, and that a **simple means of objecting, free of charge**, is provided. The ICO's April 2026 guidance adds that browser settings alone will not discharge the objection requirement and that the focus must be on *how* the service is used, not *who* uses it. Where a third-party provider is involved, it must use the information only to help improve your service and not for its own purposes — which makes the Plausible DPA a condition of the exception, not merely a contractual tidy-up.

**Recommendation [LEGAL].** Choose the statistical purposes exception and make every document consistent with it. Delete "If you allow beta analytics" from the just-in-time wording and everywhere else; that is consent language and it will either mislead participants into thinking they opted in or create an expectation you have not met. Replace it with a clear statement plus a persistent, one-action opt-out, which the architecture already provides. Then complete a separate Article 6(1)(f) LIA for any personal data in the event stream — PECR and the UK GDPR are independent, and the exception from consent under one says nothing about the lawful basis under the other. Even if the stored events contain no personal data, the momentary processing of an IP address to derive a country does, so the LIA is the right artefact regardless.

### 3.3 Other purposes

| Purpose | Basis | Assessment |
|:--|:--|:--|
| Feedback without contact details | Art. 6(1)(f) | Sound. Include in the same LIA as the gate. Retention needs a justification (P2-06). |
| Contactable feedback | Art. 6(1)(f) for responding | Sound, provided the choice is genuinely separate. Contact beyond responding to the feedback needs consent. |
| Rights and complaints records | Art. 6(1)(c) | Correct, but "and/or basis used for the service" is too loose to publish. Pin it to legal obligation. |
| Framework improvement | Art. 6(1)(f) | Sound for feedback given for that purpose. Any move to a research dataset is further processing and now engages the DUAA compatibility rules. **[SOLICITOR]** |
| Research contact | Consent | Genuine research invitations are generally not direct marketing under ICO guidance, but the distinction fails the moment the message also promotes OPL Advisory's services. Take consent, record it, and keep the messages clean. |
| Newsletter | Consent, PECR reg. 22 | The soft opt-in is unavailable: there is no sale or negotiation of a sale, and the new charity soft opt-in does not apply to a limited company. State this in the LIA file so it is not revisited. |

---

## 4. DPIA

**A DPIA is not clearly mandatory, and you should do one anyway.**

Article 35(3) is not engaged: there is no systematic and extensive automated evaluation producing legal or similarly significant effects, no large-scale special category processing, and no systematic monitoring of a publicly accessible area. Against the ICO's list, the position is mixed rather than clear — the "denial of a service" criterion is partly engaged because report access is conditional on verification, and the free-text channels create a residual special category possibility, but neither is decisive at this scale.

Three reasons make it advisable anyway. The pack already commits to a DPIA in four separate places; deciding at this stage that it is not required would be conspicuous. The screening decision itself must be documented under accountability whichever way it goes, so the marginal cost of continuing to a short DPIA is small. And the DPIA is the natural home for the analytics and PECR analysis, the free-text risk assessment, the transfer analysis and the RDS trigger list, all of which need somewhere to live.

Scope it at ten to twelve pages. Recheck ICO DPIA guidance at sign-off, since it is under review.

One correction: the pack states that ICO guidance "requires a comprehensive governance approach and a DPIA for anonymisation". The ICO recommends a DPIA in that context; it does not impose it as a freestanding legal requirement. Overstating a regulator's position in an internal document tends to survive into external ones.

---

## 5. Part A — prioritised review table

### Priority 1 — blocks publication

| Ref | Issue | Risk | Basis | Recommended change | Decision or evidence required |
|:--|:--|:--|:--|:--|:--|
| P1-01 | `privacy-and-data-flow.md` states the DUAA "is fully in force". | Reviewers rely on an inaccurate statement of law; downstream analysis is not properly dated. | [LEGAL] | Replace with a dated statement: main Part 5 provisions from 5 Feb 2026 (SI 2026/82); s.103 from 19 Jun 2026; s.119 not yet commenced. | Named reviewer and date for the legal position; a recheck trigger at launch. |
| P1-02 | No data protection complaints procedure anywhere in the pack. | Non-compliance with a duty already in force. The ICO may decline complaints not first put to OPL Advisory, so participants have no route and OPL Advisory has no record. | [LEGAL] — s.164A DPA 2018, in force 19 Jun 2026 | Publish a written complaints procedure; provide an electronic form plus at least one alternative route; acknowledge within 30 days; investigate without undue delay; communicate the outcome; explain ICO escalation. | Written procedure; form; logging method; named owner; deputy cover. |
| P1-03 | Controller identity incomplete: no company number, registered address or ICO registration number. | Article 13 non-compliance; notice cannot be published. | [LEGAL] — Art. 13(1)(a) | Supply. Confirm ICO registration and fee payment under the Data Protection (Charges and Information) Regulations 2018. | Companies House details; ICO registration reference; fee tier confirmation. |
| P1-04 | Report gate proposes contract as a lawful basis. | Misdescribes the service; would not survive scrutiny; participants told something untrue about why their email is needed. | [LEGAL] — Art. 6(1)(b) necessity | Remove the contract limb. Rely on Art. 6(1)(f) with a completed LIA covering verification, participant record and beta administration. | Signed LIA; named decision on whether `organisation` is required or optional. |
| P1-05 | Analytics documents alternate between consent language and objection language; PECR position on IndexedDB, the Plausible script and `viewport_band` is unresolved. | Either a consent claim that is not honoured, or reliance on an exception without meeting its conditions. Both are PECR breaches, now at UK GDPR penalty levels. | [LEGAL] — PECR reg. 6 and Sch. A1 | Adopt the statistical purposes exception. Remove all consent wording. Provide clear information plus a simple, free, persistent objection that actually stops the storage or access. Complete a separate Art. 6(1)(f) LIA. | Named decision on exception vs consent; UI evidence that objection works; confirmation that Plausible uses the data only to improve this service. |
| P1-06 | "Anonymous" used for Plausible events in `adr-thin-beta-service.md` and `architecture-and-data.md`, contradicting the correct warning in `privacy-and-data-flow.md`. | An unsupportable legal claim in documents likely to be quoted. | [LEGAL] | Replace with "aggregate events that do not identify individuals" or "de-identified". Also correct the transmission description: individual events are sent and aggregated on receipt; nothing "aggregate" leaves the browser. | Full-text sweep across all five documents and the codebase. |
| P1-07 | GitHub not disclosed as a recipient. GitHub Pages and its CDN receive visitor IP addresses and user agents. | Undisclosed recipient; incomplete transfer analysis; the "nothing leaves the device" story has an unacknowledged first hop. | [LEGAL] — Art. 13(1)(e), Art. 28 | Determine GitHub's role for Pages visitor logs, disclose it as a recipient, and record the transfer position. | GitHub terms and DPA review; decision on processor vs controller; CDN identity. |
| P1-08 | No Article 28 written terms in place with Supabase, Plausible, IONOS or GitHub. | Processing live personal data without written processor terms. | [LEGAL] — Art. 28(3) | Execute or accept each DPA before the flags are enabled. Synthetic testing does not require them; the first real participant does. | Executed or accepted DPAs; subprocessor lists; incident contacts; deletion commitments. |
| P1-09 | Transfer mechanism for Supabase, Inc. undetermined. | Restricted transfer without a lawful mechanism. | [LEGAL] — Art. 44–46 | Verify whether Supabase, Inc. holds an active listing under the UK Extension to the EU-US Data Privacy Framework. If yes, rely on it and record the check. If no, execute the IDTA or the UK Addendum and complete a transfer risk assessment against the DUAA's "not materially lower" standard. | DPF list check with date and screenshot; or executed IDTA plus TRA. **[SOLICITOR]** |
| P1-10 | Retention schedule contains aspirations and placeholders presented as decisions: "target 30 days", "record the actual Supabase Pro backup schedule before launch", "use the approved Plausible plan setting". | A notice cannot promise defined retention while the periods are undefined. | [LEGAL] — Art. 5(1)(e), Art. 13(2)(a) | Replace every "target" with a period. Obtain and record the actual figures for Supabase log and backup retention, Plausible retention and IONOS mail log retention. | Documented figures from each supplier with source and date. |
| P1-11 | Draft notice omits the right to object, the right to complain to OPL Advisory before the ICO, a statement that no automated decisions are made, an effective date, a version and a postal address. | Article 13 non-compliance. | [LEGAL] — Arts. 13, 21; s.164A DPA 2018 | Add all six. See Part B. | Approved final text. |
| P1-12 | "12 months after the beta or last participant activity" — the beta has no defined end. | An unmeasurable retention period is not a retention period. | [LEGAL] | Define a beta end date or a maximum retention backstop. | Named end date or backstop, and what happens to records at that point. |

### Priority 2 — resolve before publication

| Ref | Issue | Risk | Basis | Recommended change | Decision or evidence required |
|:--|:--|:--|:--|:--|:--|
| P2-01 | No DPIA; screening decision undocumented. | Accountability gap; the analysis has nowhere to live. | [GOOD PRACTICE] | Complete a short DPIA covering the gate, analytics, free text, transfers and RDS triggers. Record the screening decision either way. | Completed DPIA; named approver. |
| P2-02 | RDS joint controllership triggers not documented. | Joint controllership can arise without access to data; an unmanaged arrangement is discovered late. | [RISK] | One-page written arrangement recording that RDS receives no personal data, plus the five change-control triggers at §2.2. | Signed arrangement; RDS sign-off on the notice text that names it. |
| P2-03 | Ownership of `hdrlframework.org` and custody of the mailboxes unconfirmed. `privacy@` forwards to an OPL Advisory inbox. | If RDS owns the domain, the controller story and the rights contact are both compromised. | [RISK] | Confirm registrant and mailbox custody in writing. | Domain registration record; mailbox ownership confirmation. |
| P2-04 | Absolute claims: "OPL Advisory cannot see or recover it". | Overclaim. It is a design property, not a physical impossibility, and it is defeated by a share bundle, a support email or a screenshot. | [RISK] | Reword to "is not sent to us and we cannot retrieve it", and name the exceptions explicitly. | Approved wording; support playbook covering content sent in by participants. |
| P2-05 | Free-text fields could carry special category, confidential or patient-level information. | Unassessed Article 9 exposure; the pack says such data is "not permitted", which is a rule and not a control. | [RISK] — Art. 9 | Complete an Article 9 assessment. Keep the prohibition wording, add detection, a redaction runbook and an incident trigger. Do not claim it cannot happen. | Assessment; runbook; named owner. |
| P2-06 | Feedback without contact details retained 12 months without justification. | Retention that cannot be explained on request. | [GOOD PRACTICE] — Art. 5(1)(e) | Justify against the beta improvement cycle or shorten. | Written justification. |
| P2-07 | Just-in-time notices for team invitations and aggregation describe features excluded from the beta. | Publishing them would misdescribe the service. | [LEGAL] — Art. 5(1)(a) | Remove from the beta notice set; retain in the backlog. | Confirmation of the published notice set. |
| P2-08 | Backup window not stated numerically. | Participants cannot be told how long deleted data persists. | [LEGAL] — Art. 13(2)(a) | State a maximum backup persistence period in the schedule and honour it. | Supabase Pro backup and PITR configuration, in writing. |
| P2-09 | Supabase log retention stated as "target 30 days"; platform tiers set their own. | The stated period may be unachievable. | [RISK] | Record the actual platform figures and align the schedule to them. | Supabase log retention configuration for the Pro tier. |
| P2-10 | IONOS contracting entity, DPA, subprocessors and mail log retention unconfirmed. | Undocumented processor in the verification path. | [LEGAL] — Art. 28 | Confirm all four. | IONOS DPA and entity confirmation. |
| P2-11 | SPF, DKIM and DMARC for `hdrlframework.org` not listed as a release gate. | Verification codes are a spoofing target; deliverability failures look like service failures. | [RISK] — Art. 32 | Add to the security test set and verify before launch. | DNS records and a DMARC policy decision. |
| P2-12 | Single-operator dependency; the pack already notes a second operator is needed. | The 30-day complaints clock and rights deadlines run regardless of availability. | [LEGAL] — s.164A DPA 2018, Art. 12(3) | Appoint a second authorised operator and document break-glass access before public launch. | Named deputy; access review record. |
| P2-13 | Children question left open. | Undocumented AADC position for a publicly accessible service. | [GOOD PRACTICE] | Record a short assessment concluding the service is not directed at, and not likely to be accessed by, children; add a minimum-age statement to the terms. | Signed assessment. |
| P2-14 | No ROPA. | Accountability gap. | [GOOD PRACTICE] — Art. 30 | Confirm the post-DUAA Article 30 position for a small controller, and keep a short ROPA regardless. | ROPA covering the six beta tables plus Auth. **[SOLICITOR]** on the exemption question. |
| P2-15 | Architecture assumes a strict CSP, but GitHub Pages cannot set HTTP response headers. | A stated control that does not exist as described. | [RISK] | Document the actual control — a `<meta http-equiv>` CSP with its known limitations — or move hosting. | Tested CSP and a record of what it cannot cover. |
| P2-16 | Verification record notes that blob downloads did not surface a browser download event in preview. | The gate exists to deliver a report the participant may not be able to save. | [RISK] | Retest in Safari, Chrome and Firefox before launch. | Cross-browser test evidence. |
| P2-17 | "Assessment data are never used for accreditation, funding or participation decisions." | Unqualified promise about third parties OPL Advisory does not control. | [RISK] | Scope to "by us", and note that a participant who shares a bundle controls what happens next. | Approved wording. |
| P2-18 | Consent record "review at 24 months". | A suppression record exists to honour a withdrawal indefinitely; reviewing it out defeats its purpose. | [GOOD PRACTICE] | Keep the suppression record for as long as the withdrawal must be honoured; review the surrounding record, not the suppression itself. | Corrected schedule. |
| P2-19 | Notice does not name the specific legitimate interests relied on. | Article 13(1)(d) requires the interest, not the category. *Mousse* (C-394/23) is persuasive on specificity. | [LEGAL] | Name each interest in the notice. | Approved wording. |
| P2-20 | Plausible plan described as "in trial" in one document and "active from 7 August 2026" in another; custom events count against the 10,000 monthly allowance while page views are disabled. | Contradictory operational record; possible silent data loss at the allowance ceiling. | [RISK] | Reconcile, and confirm how Plausible treats custom events against the allowance. | Current subscription record; Plausible confirmation. |
| P2-21 | `local_beta_events: true` maintains an on-device event buffer for operator purposes. | Puts the strictly necessary exemption for the IndexedDB draft at risk, because regulation 6 exceptions are purpose-specific. | [LEGAL] — PECR reg. 6 | Separate the buffer from the draft store, or bring it inside the analytics disclosure and objection control. | Named decision; technical evidence of separation. |
| P2-22 | `property_allowlist` includes free-form-looking `context` and `bundle_scope`. | An unenumerated property is an exfiltration path by accident. | [RISK] | Enumerate permitted values and enforce server-side. | Value list; rejection test evidence. |

### Priority 3 — optional and design

| Ref | Issue | Basis | Recommendation |
|:--|:--|:--|:--|
| P3-01 | Notice length and readability. | [DESIGN] | Layered structure: a short summary, expandable sections, and a separate processing and retention schedule. Drafted in Part B. |
| P3-02 | The gate is the main threat to both participation and the legitimate interests balance. | [DESIGN] | Consider allowing report download without verification, with voluntary registration offered alongside. This strengthens the LIA, removes the bundling question entirely and directly addresses the abandonment risk your own user research flags. It costs you the denominator on who completed the beta — which is precisely the trade-off worth deciding deliberately rather than by default. |
| P3-03 | Transparency artefact. | [DESIGN] | Publish the event allow-list as a versioned public page. It is unusually strong evidence for a claim most services only assert. |
| P3-04 | "What we never receive" panel. | [DESIGN] | A short explicit list is more reassuring, and more testable, than a longer description of what is collected. |
| P3-05 | Wording versions against consent records. | [GOOD PRACTICE] | Already in the schema via `wording_version`. Keep it and make sure the published notice version is wired to `privacy_notice_version` in the configuration. |
| P3-06 | Public-contributor review. | [GOOD PRACTICE] | Already planned. Include the complaints route and the analytics objection in what is tested for comprehension. |

---

## 6. Part E — publication checklist

### 6.1 Facts OPL Advisory must supply

| Item | Status |
|:--|:--|
| Registered company name, number and registered office address | Required |
| ICO registration reference and fee tier | Required |
| Named accountable individual for data protection | Required |
| Named second authorised operator and break-glass route | Required |
| Postal address for rights and complaints | Required |
| Defined beta end date or retention backstop | Required |
| Confirmation of `hdrlframework.org` registrant and mailbox custody | Required |
| Decision on whether `organisation` is a required or optional field | Required |
| Decision on whether a DPO is appointed and, if not, the recorded reasoning | Required |

### 6.2 Contracts and supplier documents requiring review

Supabase, Inc.: DPA, subprocessor list, security documentation, DPF listing status or IDTA, log retention, backup and PITR configuration, deletion commitments, incident contact.
Plausible Insights OÜ: DPA, hosting location, retention configuration, confirmation that data is used only to provide the service, subprocessors.
IONOS: contracting entity, DPA, subprocessors, mail log content and retention, incident contact.
GitHub, Inc.: Pages terms, DPA applicability to visitor logs, CDN identity, role determination, transfer position.

### 6.3 LIA, DPIA and ROPA work

Three LIAs are required: the report gate and participant administration; the analytics event stream; feedback, both modes. A short DPIA covering the whole beta. An Article 30 record covering the six beta tables and Supabase Auth. A transfer risk assessment if the IDTA route is used for Supabase. An Article 9 assessment for free-text channels. A documented children and AADC assessment. A written RDS arrangement with change-control triggers.

### 6.4 Technical tests required

The pack's existing security test set is good and should stand, with these additions and completions.

Outstanding from the pack's own release gates: wrong-code, expiry, throttling and enumeration tests on the OTP journey; a controlled live synthetic event and funnel check once privacy approval is given.

New: confirmation that the main site's existing Plausible instance does not fire on the assessment route; evidence that the analytics objection control actually stops storage and access rather than only suppressing events; separation evidence for the local event buffer and the draft store; enumerated-value enforcement on `context` and `bundle_scope`; cross-browser download testing in Safari, Chrome and Firefox; SPF, DKIM and DMARC verification; and a tested CSP with a written record of what a meta-tag CSP cannot cover on GitHub Pages.

### 6.5 Named approvals required

Controller determination and the RDS arrangement. Lawful bases and all three LIAs. The DPIA. The privacy notice, just-in-time wording and checkbox labels. Retention schedule with every figure confirmed. Processor contracts, subprocessors and transfer mechanisms. The complaints procedure. Security test evidence and the incident runbook. Accessibility audit including assistive-technology testing. The decision to publish the Supabase publishable key and enable the remote and Plausible flags — which the pack rightly makes a separate, explicit change.

### 6.6 Refer to a qualified solicitor or data-protection adviser

The transfer mechanism for Supabase, Inc., including the DPF listing check and any TRA. The Article 30 exemption position for a small controller after the DUAA. Any future move from beta feedback to a research dataset, given the DUAA's remodelled purpose-limitation rules and the new statutory definition of scientific research. The RDS arrangement, if RDS proposes any of the five joint controllership triggers. The complaints procedure, if OPL Advisory expects to handle complaints alongside any other regulatory regime.
