---
title: Self-assessment research and design rationale
description: Comparator research, user needs, design principles and risks behind the HDRL self-assessment research prototype.
---

# Self-assessment research and design rationale

**Research snapshot:** 30 July 2026. This is product and design research, not legal advice.

## Verified HDRL baseline

The design is tied to **HDRL Framework v1.0.1**, indicator catalogue and Schema **v1.0.2**, and Presentation Kit **v1.1.0**. The live and repository catalogues both contain 64 indicators in eight domains. The framework remains evidence-informed and formatively applied; content validity, inter-rater reliability, responsiveness and predictive validity require further work. It must not be represented as accreditation, an official standard, a programme participation decision or a validated benchmarking service.

The repository baseline is `origin/main` commit `7646f7b`, which includes Presentation Kit pull request #20. The site builds with MkDocs Material in GitHub Actions and deploys static output to GitHub Pages. It has no application server, account system or assessment datastore. The existing site loads Plausible for aggregate, cookieless page analytics and says in its About page that analytics do not use cookies or persistent identifiers. The prototype therefore disables that analytics block on the assessment page rather than exposing assessment interactions or content to it.

## Legal requirements, good practice and design choices

These categories must remain distinct. The legal interpretation needs formal UK legal and data-protection review before production.

| Category | Current interpretation |
|:--|:--|
| Legal and regulatory requirements | Establish a controller and processors; identify purposes and lawful bases; provide transparent information; minimise and secure personal data; honour applicable rights; document processor terms and restricted transfers; define and enforce retention; manage breaches; and comply with PECR where electronic contact is direct marketing. A requested report email does not itself authorise marketing. |
| Recognised good practice | Complete a DPIA and legitimate-interests assessments before the pilot; use privacy by design, least privilege, independent access-control testing, backup/deletion reconciliation, separate analytics, blind team scoring before calibration, disclosure-risk review and public-contributor review. |
| Product-design choices | Use eight non-scoring rapid prompts; keep all 64 indicators available in the evidence-led pass; accept evidence references but no files; use emailed OTP rather than secrets in links; do not benchmark; keep AI off; make HTML the accessible report; and apply provisional internal `k ≥ 10` and public `k ≥ 20` aggregation gates pending disclosure-control review. |

## Comparator landscape

| Comparator | Useful pattern | What HDRL should not copy |
|:--|:--|:--|
| [Data Maturity Assessment for Government](https://www.gov.uk/government/publications/data-maturity-assessment-for-government-framework/data-maturity-assessment-for-government-framework-html) | A matrix view rather than one score; scope can be deep or shallow, wide or narrow; maturity should support prioritisation. The [delivery guidance](https://www.gov.uk/government/publications/delivering-a-data-maturity-assessment-objectives-and-resources/delivering-the-data-maturity-assessment-objectives-and-resources) makes assessment boundaries, mixed evidence and contributor selection explicit. | Do not turn flexibility into silent scoring conventions or compare unlike scopes. |
| [NCSC Cyber Assessment Framework 4.0](https://www.ncsc.gov.uk/collection/cyber-assessment-framework/introduction-to-caf) | Outcomes are supported by structured indicators of good practice; applicability and target profiles remain contextual; self-assessment is distinct from independent assessment. | Do not imply that self-assessment and external assurance are equivalent. |
| [US Department of Energy C2M2](https://www.energy.gov/ceser/cybersecurity-capability-maturity-model-c2m2) | Expandable help, saved local results, version portability and automatically generated graphical reports make a large framework manageable. The tool deliberately keeps data on the user's device. | Avoid the language of benchmarking until HDRL has a suitable evidence base and comparison method. |
| [NIST CSF 2.0 organisational profiles](https://www.nist.gov/cyberframework/profiles) | Separate current and target profiles, compare them transparently and turn gaps into an action plan. | A target profile is not an automatic recommendation or universal target. |
| [NHS England SORT](https://www.england.nhs.uk/long-read/self-assessment-of-organisational-readiness-tool-sort-guide/) | Provides plain-language maturity descriptions and prompts users to plan evidence sources before judging maturity. | Do not assume the existence of a document proves an operating capability. |
| [Highways England Lean Maturity Assessment guide](https://assets.publishing.service.gov.uk/media/5a81e88840f0b62305b91747/MCR17_0034_-_HE_Lean_Maturity_Assessment_Guide.pdf) | Individuals score before a facilitated consensus; the facilitator highlights agreement and disparity; the guide explicitly resists averaging. | Do not collapse disagreement into a mean or describe consensus as objective truth. |
| [LGA Population Intervention Triangle toolkit](https://www.local.gov.uk/topics/social-care-health-and-integration/population-intervention-triangle-toolkit) | A genuinely rapid individual mark-up can seed a structured workshop about why perspectives differ and what evidence would resolve them. | Do not hide the distribution once calibration begins. |
| [NHS England Digital Maturity Assessment reporting](https://digital.nhs.uk/data-and-information/digital-maturity-assessment-report-2024-and-2025-results/report) | Peer review, validation checks, participant support and explicit comparability caveats recognise that a data-collection tool alone does not create reliable results. | Do not publish league tables or year-on-year claims across changed question sets. |
| [WHO digital-health cybersecurity and privacy assessment](https://www.who.int/europe/publications/i/item/WHO-EURO-2025-11827-51599-79106) | Adaptable structured questions lead to a maturity summary and short-, medium- and long-term improvement discussion. | Do not turn a checklist into a substitute for context and evidence. |

## What HDRL should learn

1. **Two visibly different methods.** The rapid pass is eight domain-level impressions and takes about 5–10 minutes. It teaches the scope of HDRL but does not produce indicator scores or a single maturity number. The evidence-led pass uses all applicable canonical indicators.
2. **A matrix, not a verdict.** Show patterns, gaps, uncertainty and dependencies. Never calculate an overall HDRL score in the product.
3. **Scope before score.** Record the service or ecosystem, unit of assessment, organisations/capabilities included, time boundary, intended use and local scoring conventions.
4. **Evidence beside judgement.** A response has an applicability status, judgement, rationale, uncertainty and evidence records. Capability, evidence visibility and operating capacity are discussed separately.
5. **Progressive disclosure.** Keep canonical wording and the chosen maturity descriptors visible; place examples, evidence guidance, common mistakes and dependencies in expandable sections.
6. **Independent team input before calibration.** Owners can see completion but not answers until the round closes. Calibration begins with the range, distribution, rationales and evidence—not an average.
7. **Traceable recommendations.** Initial recommendations come only from explicit rules, recorded evidence gaps, uncertainty, dependencies and user-entered improvement notes.
8. **HTML first, structured exports alongside.** The web report is the accessible source; print-to-PDF is a convenience rendition. JSON preserves the full structure and CSV supports analysis.

## Users and jobs to be done

| User | Job | Product response |
|:--|:--|:--|
| Service lead or system owner | Understand where to investigate and invest without claiming accreditation. | Rapid profile, evidence-led work plan, traceable limitations and priorities. |
| Domain specialist | Judge relevant indicators, record rationale and point to evidence. | Filtered indicator workspace, evidence register and ownership. |
| Assessment facilitator | Obtain independent perspectives and run fair calibration. | Blind initial round, disagreement view, consensus record and audit trail. |
| Reviewer or assurer | Check derivation, evidence coverage and material changes. | Read-only review, change history, evidence status and version provenance. |
| Researcher or public contributor | Understand the method and challenge interpretations. | Plain-language guidance, accessible report and explicit invitation to critique. |
| Framework steward | Learn which indicators are unclear or difficult to evidence. | De-identified, thresholded pattern analysis separated from identifiable workspaces. |

## Critical journeys

### Individual

`Understand limits → define boundary → rapid domain impressions → limited summary → evidence-led indicator review → completeness review → report-information gate → accessible report and exports → revise or delete`

### Team

`Owner defines boundary → invites named roles → contributors respond independently → round closes → range/distribution revealed → facilitator prioritises disagreement → evidence actions assigned → consensus recorded with reason → reviewer checks changes → report`

The consensus record must preserve the independent distribution. A decision such as “consensus L3” means the group agreed a working judgement after reviewing evidence; it does not erase that initial assessors ranged from L2 to L4.

## Accessibility and long-form design

The prototype follows [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and uses native controls, visible focus, programmatic labels, live save messages, a logical heading sequence, 24px-or-larger targets, 320px reflow and reduced-motion support. The review step follows the [GOV.UK check-answers pattern](https://design-system.service.gov.uk/patterns/check-answers/), while the evidence-led workspace behaves like a task list rather than a 64-step forced wizard. Users may leave items not known, not assessed or not applicable.

## Key risks and mitigations

| Risk | Mitigation |
|:--|:--|
| False precision | No overall score; rapid pass uses non-numeric impression bands; even-number domain medians are displayed as a range. |
| Premature benchmarking | No peer percentile, rank, target or normative comparison in MVP; comparison requires a future validated protocol. |
| Unsupported high maturity | Report distinguishes linked evidence from unsubstantiated judgement and reproduces catalogue minimum-evidence expectations. |
| Assessment fatigue | Eight-question rapid pass; domain task list; filters; save and return; no forced completion of non-applicable indicators. |
| Anchoring in teams | Independent answers remain hidden until the owner closes the round. |
| Average presented as truth | Show count and distribution; consensus is a separate recorded decision; never average ordinal judgements. |
| Sensitive evidence | MVP accepts references and notes only, not file uploads; persistent warning against patient data, credentials and unnecessarily sensitive information. |
| Tool silently changes HDRL | Canonical wording is loaded from the versioned catalogue; added guidance, rapid questions and rules have separate versions. |
| Report overclaims | Findings are categorised as evidence-supported judgements, provisional interpretations, questions and potential actions; all carry derivation links. |

## Research questions before production

- Can eight domain prompts be completed comfortably in 5–10 minutes and still teach the scope accurately?
- Do users understand that an impression band is not an HDRL maturity level?
- Which indicator guidance needs indicator-specific examples rather than domain-level guidance?
- How do system, service and dual scopes affect applicability in real cases?
- What evidence statuses and review roles are meaningful without becoming an assurance claim?
- Can teams complete independent scoring without creating excessive burden?
- Which disagreement presentation supports learning without implying poor performance?
- What registration information is genuinely necessary to deliver and interpret a report?
- Will users enter sensitive operational material despite warnings and a reference-only evidence model?
- What public and contributor oversight is appropriate for future aggregate research?
