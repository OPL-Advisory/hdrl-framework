# HDRL public-beta privacy review intake

**Intake date:** 12 August 2026  
**Status:** internal governance record; not approved legal advice or a public notice

This folder preserves the two outputs supplied from the UK data-protection and digital-service privacy specialist review:

- `hdrl-beta-dp-review-v1.0.md` — independent review and publication checklist;
- `hdrl-beta-privacy-notice-draft-v0.4.md` — proposed layered notice and just-in-time wording.

The source outputs are retained unchanged. They must not be published or treated as approved merely because they are present in the repository. The operative product documents remain in `docs/self-assessment/`, and public collection remains disabled.

## Reconciliation against current authoritative sources

The review is strong and broadly consistent with the selected privacy boundary, but one material statement must not be adopted:

- the review says the Data (Use and Access) Act 2025 is not fully in force and that section 119 remains outstanding;
- the ICO updated its public guidance on 19 June 2026 to say that **all stages of the DUAA are now in force**, and its 23 June 2026 announcement says all outstanding provisions came into force on 19 June;
- the operative material should therefore use a dated statement that all DUAA provisions affecting data protection and PECR were in force at the 12 August 2026 review date, while still naming the Information Commissioner's Office using its current public identity.

Authoritative checks:

- [ICO: DUAA — how does this affect me?](https://ico.org.uk/about-the-ico/what-we-do/legislation-we-cover/data-use-and-access-act-2025/the-data-use-and-access-act-2025-how-does-this-affect-me/)
- [ICO: new data-protection complaints law now in force](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/06/new-data-protection-complaints-law-now-in-force/)
- [ICO: how to deal with data-protection complaints](https://ico.org.uk/for-organisations/how-to-deal-with-data-protection-complaints/)
- [ICO: storage/access exceptions](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/)
- [Companies House: OPL Advisory Ltd](https://find-and-update.company-information.service.gov.uk/company/16704749)

## Findings accepted into the working design

These conclusions are sufficiently supported to update draft product and governance material, subject to final approval:

1. OPL Advisory Ltd is the working controller for the participant, feedback, preference, rights and operational records used to run the beta. Browser-local assessment content is outside the data OPL Advisory receives and holds by default.
2. The report gate should rely on a documented Article 6(1)(f) legitimate-interests assessment, not contract or bundled consent.
3. The Plausible design should use the PECR statistical-purposes exception only if clear information and a persistent, simple and free objection are implemented and tested. A separate legitimate-interests assessment remains necessary where personal data are processed transiently.
4. “Anonymous” must not describe individual event transmission or feedback. Use “events without a participant identifier” and explain that Plausible aggregates them after receipt.
5. GitHub Pages/CDN visitor logs must be included in the recipient and international-processing analysis even though GitHub receives no assessment content.
6. A published data-protection complaints route and internal procedure are required. Receipt must be acknowledged within 30 days; appropriate enquiries, updates and an outcome must follow without undue delay.
7. The supplier DPAs, subprocessors, roles, locations, transfer safeguards, log retention and deletion arrangements must be evidenced before activation.
8. A short LIA set, DPIA, ROPA, Article 9/free-text assessment, children assessment and RDS boundary arrangement are proportionate governance artefacts for the beta.
9. The public notice should be layered, versioned and tied to the tool configuration. All placeholders must be resolved before publication.

## Facts already resolved

- Controller company: OPL Advisory Ltd.
- Companies House number: `16704749`.
- Registered office: `71-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ`.
- Privacy email: `privacy@hdrlframework.org`, forwarding route tested.
- Transactional sender: `report@hdrlframework.org`, SMTP and single-use OTP tested after credential rotation.
- Supabase project: dedicated West Europe (London) project; public client disabled.
- Plausible: Business subscription active; beta loader disabled in the committed configuration.

## Controller decisions and evidence still required

| Decision or evidence | Why it is needed | Publication status |
|:--|:--|:--|
| ICO registration reference and fee status | Controller particulars and accountability | Blocker |
| Named accountable privacy owner and deputy/break-glass operator | Complaints, rights and incident continuity | Blocker |
| Postal address to use for privacy matters | Article 13/contact route | Blocker |
| Make `organisation` required or optional | Data minimisation and report-gate LIA | Product/controller decision |
| Retain the verification gate or offer ungated report access with voluntary registration | Participation burden and legitimate-interests balance | Product/controller decision |
| Beta end date or fixed maximum retention backstop | Measurable participant retention | Blocker |
| Whether no DPO is required, with recorded reasoning | Accountability statement | Blocker |
| Complaints form URL and case-log process | New complaints duty | Blocker |
| Supabase, GitHub, Plausible and IONOS contractual/transfer evidence | Articles 28 and 44–46 | Blocker; adviser review where flagged |
| Actual backup, Auth/security log, mail log and analytics retention | Storage limitation and public notice | Blocker |
| RDS boundary arrangement and change-control triggers | Avoid unmanaged joint controllership | Blocker |
| Final LIA, DPIA, ROPA and free-text/Article 9 assessment | Accountability and risk treatment | Blocker |

## Implementation cautions

- `local_beta_events` currently records the allow-listed event history inside the same saved browser state as the assessment draft. Before activation, either separate that buffer technically and bind it to the analytics objection or remove the persistent local buffer from the production beta.
- `context` and `bundle_scope` require enumerated values and rejection tests; property-name allow-listing alone is insufficient.
- The public notice must say that individual events are sent without a participant identifier and aggregated by Plausible, not that aggregate events leave the browser.
- Claims such as “cannot see or recover” and “never used” must be scoped to OPL Advisory's default processing and explicit exceptions, including deliberate result sharing or content sent to support.
- The supplied notice remains a drafting source until every `[CONFIRM: …]` placeholder and the independent review's legal-status error have been reconciled.

