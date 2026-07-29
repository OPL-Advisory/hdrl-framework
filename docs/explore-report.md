---
title: Explore the Final Report
description: An accessible HTML transcription of the published Three Nations Readiness Assessment Final Report, with the RDS PDF retained as the authoritative version.
schema_type: report
template: report.html
report_media: []
report_table_captions:
  - Document control
  - Glossary of terms and abbreviations
  - Overall readiness verdict
  - Score distribution across 64 indicators
  - HDRL domains
  - Cross-nation readiness profiles
  - Foundational indicators
  - COVID-era enablers and current status
  - Pathfinder propositions
  - Risk mitigation
  - Considerations for HDRS design
  - Immediate actions
---

## About this accessible version { #report-source-note-title }

## Document Control

| Item | Detail |
|---|---|
| Client | [Research Data Scotland](https://www.researchdata.scot/) |
| Deliverable | Final Report (Deliverable 3) |
| Version | V1.0 |
| Date | April 2026 |
| Prepared by | David Seymour, OPL Advisory |
| Oversight Group | Roger Halliday (RDS, Chair), Jon Smart (SAIL Databank COO), Frances Burns (NITRE / HSC Data Institute) |
| Evidence basis | HDRL Assessments v1.0 (Wales, Scotland, Northern Ireland), Use Case Journey Maps (COALESCE/Shingrix), stakeholder interviews (Dec 2025 – Jan 2026), nation-specific workshops (Scotland, Wales, Northern Ireland), Joint 3-Nations Synthesis Session (1 April 2026), ABPI clinical trials report (March 2026), HDRS CEO briefing outcomes |
| AI transparency | AI tools and models (Claude, Gemini, ChatGPT) were used to support evidence sourcing, synthesis and consistency checking; scoring judgements, interpretation and final text were determined by OPL Advisory with human review and stakeholder right of reply. |
| Important note | This report uses the HDRL Framework and a set of proposed Foundational Indicators developed for this assessment. These are not official HDRS indicators or thresholds and should be revisited as HDRS leadership defines formal baseline requirements. |

## Glossary of Terms and Abbreviations

This report covers a technically specialist domain. The following glossary defines key terms and abbreviations used throughout. Terms are expanded on first use in the main text; this page provides a single reference point.

| Abbreviation | Definition |
|---|---|
| ABPI | Association of the British Pharmaceutical Industry |
| ADR Wales | Administrative Data Research Wales — cross-sector data linkage programme operated through SAIL |
| ALF / RALF | Anonymised Linkage Field / Residential Anonymous Linking Field — SAIL’s pseudonymisation and place-based linkage identifiers |
| CAG | Confidentiality Advisory Group — provides independent advice on the use of patient information in England and Wales |
| CDM | Common Data Model — a standardised data structure (typically OMOP) enabling consistent analysis across different data sources |
| CHI | Community Health Index — Scotland’s universal patient identifier |
| COALESCE | Capacity and capability Of UK-wide Analysts to LEverage health data at Scale using COVID-19 as an Exemplar. A four-nation COVID-19 vaccine uptake study spanning approximately 68 million individuals. Used in this report as a retrospective use case to stress-test cross-nation research delivery. |
| COPI | Control of Patient Information — emergency legal mechanism used during COVID-19 to enable rapid data sharing |
| DaC-VaP | Data and Connectivity: COVID-19 Vaccines Pharmacovigilance.  Related to COALESCE and the term used in Northern Ireland to cover both studies. |
| DARE UK | Data and Analytics Research Environments UK — UKRI programme advancing federated research infrastructure |
| dm+d | Dictionary of Medicines and Devices — UK standard for prescribing and dispensing data |
| FEDS UK | Federated Ecosystem for Discovery and Sharing — consortium led by Swansea University |
| GPIP | GP Information Pipeline — Northern Ireland’s programme for expanding GP data availability for research |
| HDRL | Health Data Readiness Level — the assessment framework developed for this project (64 indicators, 8 domains, 5 levels) |
| HDRS | Health Data Research Service — £600m UK initiative to simplify secure access to health data for research |
| HIC | Health Informatics Centre, University of Dundee |
| HSC | Health and Social Care (Northern Ireland) |
| ICD-10 / OPCS-4 | International Classification of Diseases / Classification of Interventions and Procedures — standard clinical coding systems |
| IGRP | Information Governance Review Panel — Wales’s independent data access governance body |
| NIHAP | Northern Ireland Health Analytics Platform |
| NITRE | Northern Ireland Trusted Research Environment |
| OLS | Office for Life Sciences (UK Government) |
| OMOP | Observational Medical Outcomes Partnership — a widely used common data model for observational research |
| PBPP | Public Benefit and Privacy Panel — Scotland’s national data access governance mechanism |
| PICTURES | InterdisciPlInary Collaboration for efficienT and effective Use of clinical images in big data healthcare RESearch — Scotland’s national research imaging programme |
| QOF | Quality and Outcomes Framework — GP performance and reporting framework; QOF data subsets are emerging as a route to GP clinical data for research in Northern Ireland |
| RAS | Research Access Service — Research Data Scotland’s access pathway |
| SDE | Secure Data Environment — NHS England’s term for trusted research environments |
| SeRP | Secure e-Research Platform — Swansea University’s TRE technology, franchised to Northern Ireland and internationally |
| SFIA | Skills Framework for the Information Age — international standard for digital skills and competency assessment |
| SSHN | Scottish Safe Haven Network |
| TRE | Trusted Research Environment — a secure computing facility where researchers analyse data without it leaving the secure boundary |
| WLGP | Welsh Longitudinal General Practice dataset — GP data held by SAIL, covering approximately 86% of the Welsh population |

## Executive Summary

### Purpose and Scope

This report presents the first structured, evidence-based and independently conducted multi-jurisdiction maturity assessment of health data research infrastructure conducted against a common framework, together with a prioritised roadmap for action. Commissioned by Research Data Scotland on behalf of the devolved nations and conducted by OPL Advisory between December 2025 and April 2026, the project provides an independent evaluation of the maturity of Scotland, Wales and Northern Ireland’s health data research services and hence their potential readiness to participate in the [UK Health Data Research Service (HDRS)](https://www.hdrs.com/), a £600 million initiative to simplify secure access to health data for research across the four UK nations.

The assessment applies the Health Data Readiness Level (HDRL) Framework. The framework was developed specifically for this project through systematic analysis of 56 existing frameworks. It covers eight domains, 64 indicators, and five maturity levels (L1–5). Five indicators have been designated Foundational Indicators where a minimum standard is assumed to be necessary for participation in federated data research services. Two stress-testing use cases (COALESCE retrospective and Shingrix prospective) complement the framework assessment with operational evidence of what multi-nation research delivery looks like in practice.

### Key Finding: A Mature Set of Ecosystems

The assessment reveals a mature set of secure research services across the devolved nations, with decades of experience providing access to data for a predominantly local academic user base. Wales, anchored by SAIL Databank’s 17-year track record and the SeRP platform, achieves a “Managed” profile (Level 3–Level 4) with 19 indicators at Level 4 or above. Scotland’s Safe Haven Network demonstrates a “Defined” profile (Level 3) with 6 indicators at Level 4 or above, strong foundations, and activity at scale. Northern Ireland operates at a “Developing” level (Level 2–Level 3) with significant potential and all five Foundational Indicators meeting the minimum threshold.

A central finding is that operational capability consistently exceeds publicly documented performance across all three nations. This evidence maturity gap means nations with strong operational delivery but limited published metrics score lower than their actual performance warrants. Closing this documentation gap is one of the lowest-cost, highest-impact routes to demonstrating readiness, communicating capability and sharing good practice.

> 1. All three nations bring significant assets to HDRS. Existing infrastructure predates the English SDE network by over a decade. HDRS should build on these capabilities.
>
> 2. Each national system requires differentiated support. Wales requires capacity investment. Scotland requires confirmed multi-year funding and resolution of the GP data access bottleneck. Northern Ireland requires investment to build scale, alongside legislative enablers.
>
> 3. Governance approvals have slowed markedly since COVID-19. Emergency provisions have expired. The projected timeline for approvals for a comparable multi-nation study today is 18–24 months.
>
> 4. UK-wide federation means meta-analysis today. COALESCE achieved its objectives through separate national analyses with results manually combined. Automated federation at the scale envisaged for HDRS does not currently exist.
>
> 5. GP data access is the critical dependency for whole-population research. Wales leads with approximately 86% population coverage. Scotland has regional access for Lothian only. Northern Ireland has prescribing data with QOF subsets emerging.
>
> 6. All three nations can participate in one or more of the proposed HDRS capabilities.  Wales leads here too but the absence of mutual recognition across jurisdictions remains the single largest structural barrier. Four pathfinder propositions offer practical routes to demonstrate cross-nation value.

### Overall Readiness Verdict

| Nation | Profile | Indicators at Level 4+ | Foundational Ind. | Status |
|---|---|---|---|---|
| Wales / SAIL | Managed (L3–L4) | 19 of 64 | All 5 ≥ L3 ✔ (4 at L4) | READY |
| Scotland / SSHN | Defined (L3) | 6 of 64 | All 5 ≥ L3 ✔ (1 at L4) | READY BUT GP DATA GAP — Priority actions on funding, GP data, metrics |
| N. Ireland / NITRE | Developing (L2–L3) | 1 of 64 | All 5 = L3 ✔ | READY WITH CONDITIONS — GP data, legislation, scaled operations |

### Score distribution across 64 indicators

|  | L1 | L2 | L3 | L4 | L5 |
|---|---|---|---|---|---|
| Wales / SAIL | – | 2 | 43 | 16 | 3 |
| Scotland / SSHN | – | 10 | 48 | 6 | – |
| N. Ireland / NITRE | 5 | 27 | 31 | 1 | – |

### Priority Roadmap Recommendations

The roadmap recommendations are structured across three time horizons:

- Quick Wins (0–6 months, before HDRS first services in December 2026),
- Short-Term priorities (6–18 months, during the HDRS operational build), and
- Strategic outcomes (18–36 months, targeting HDRS full capability by FY29/30).
Four pathfinder propositions position the devolved nations as proactive partners: Pathfinder A (Rapid Real-World Evidence Network) can start immediately; Pathfinder D (Decentralised Trials Network) is the lead strategic proposition, anchored by Wales’s GP data coverage and validated by the ABPI’s March 2026 report.

---

The three devolved nations’ combined population of approximately 10 million people, their established research data services, and their demonstrated capacity for cross-nation collaboration represent a compelling and immediate offer to HDRS. They should be integral to the design and delivery of HDRS.

## 1. Introduction

### 1.1 The Health Data Research Service

The Health Data Research Service represents the UK’s most ambitious attempt to unify access to health data for research. Announced by the Prime Minister on 7 April 2025, HDRS is backed by up to £600 million (up to £500 million from UK Government and £100 million from Wellcome). HDRS is being established as a Government Company (HDRS Ltd) at the Wellcome Genome Campus, with Baroness Nicola Blackwood appointed Chair (November 2025) and Dr Melanie Ivarsson OBE appointed CEO (January 2026). First services are targeted for end of 2026, with full operational capability by 2030.

The service is proposed to be built around six core capabilities: (1) access to linked, national-scale primary care, hospital, prescribing and deaths data; (2) access to linked primary and secondary care data for consented research participants; (3) access to diagnostic images, lab results, digital pathology, genomic and clinical letter data; (4) tools to accelerate clinical trial processes; (5) a single entry point to discover and request data; and (6) the ability to bring together data from different sectors.

### 1.2 Why the Devolved Nations Matter

Health is a devolved competency. Scotland, Wales and Northern Ireland each operate distinct health data research infrastructure for routinely collected data, developed independently over decades. These systems predate the English SDE network by more than ten years. Their participation is essential for HDRS to deliver genuinely UK-wide research capability.

The three nations bring specific assets that HDRS cannot replicate from English infrastructure alone: Wales’s SAIL Databank provides the UK’s most comprehensive GP data coverage for research (approximately 86% of the Welsh population); Scotland’s PICTURES programme offers a globally significant imaging database linked to longitudinal health records; Northern Ireland’s integrated Health and Social Care system creates unique opportunities for cross-sector data linkage. These proven capabilities should inform HDRS design.

#### Scotland System Overview

Scotland's health data research infrastructure is delivered through the [Scottish Safe Haven Network](https://www.researchdata.scot/accessing-data/scottish-safe-haven-network/), a collaboration of five regional and national Safe Havens coordinated by Research Data Scotland (RDS), a Scottish Government-funded, independent charitable organisation established in 2021 to make it faster and simpler to access public sector data for research.

The network comprises: the National Safe Haven (NSH) operated by eDRIS within Public Health Scotland; DataLoch (Edinburgh/Lothian); DaSH (Aberdeen/Grampian); HIC (Dundee/Tayside); and the West of Scotland Safe Haven (Greater Glasgow & Clyde). Technical infrastructure for the national data safe haven is provided by EPCC at the University of Edinburgh. The Researcher Access Service (RAS) provides a new route for accessing a subset of nationally-held datasets, complementing the governance oversight from the HSC Public Benefit & Privacy Panel (PBPP).

Access to data through the network is governed by a common Safe Haven Charter (originally published 2015 and updated in March 2025) requiring ISO 27001 certification across all nodes. The Safe Haven Network is developing a Target Operating Model to enable greater federation of services and data across the network.

#### Wales System Overview

Wales’s health data research infrastructure centres on the [SAIL Databank](https://saildatabank.com/) (Secure Anonymised Information Linkage), operated by Swansea University since 2007. SAIL is Wales’s national Trusted Research Environment (TRE) and the primary route for accessing linked health, administrative, and social data for research.

SAIL holds over 70 data sources covering approximately 5 million individuals, with GP data coverage of 86% of the Welsh population. Governance is provided by the Information Governance Review Panel (IGRP), an independent panel assessing data access applications. Technical infrastructure includes the SAIL Gateway secure remote access environment.

#### Northern Ireland System Overview

Northern Ireland's health data research infrastructure is delivered through the [Northern Ireland Trusted Research Environment (NITRE), operated by the HSC Data Institute](https://dhcni.hscni.net/digital-strategy/data/) within Digital Health and Care Northern Ireland (DHCNI). [The Honest Broker Service (HBS)](https://bso.hscni.net/directorates/digital/honest-broker-service/honest-broker-service-our-work/), hosted by the Business Services Organisation (BSO), an arm's-length body of the Department of Health, provides the established data access pathway, managing 25 core datasets covering the 1.9 million Northern Ireland population.

NITRE is hosted on SAIL Databank infrastructure under a partnership arrangement with Swansea University, providing ISO 27001-certified secure processing. Governance is provided through the HBS governance framework with oversight from DHCNI.

### 1.3 How This Report Was Developed

This project was commissioned by Research Data Scotland on behalf of the devolved nations to provide an evidence-based assessment of readiness and a framework for positioning Scotland, Wales and Northern Ireland within the emerging HDRS architecture. It was conducted by OPL Advisory between December 2025 and April 2026.

The report draws on five evidence streams: HDRL readiness assessments across 64 indicators and eight domains utilising stakeholder interviews and document analysis; use case analysis (COALESCE retrospective and Shingrix prospective); three nation-specific workshops; the Joint 3-Nations Synthesis Session (1 April 2026) attended by Oversight Group members and civil servant counterparts; and external intelligence including the ABPI clinical trials report (March 2026) and HDRS CEO briefing outcomes.

The assessment methodology employs a multi-model AI synthesis approach with human editorial control throughout. The Right of Reply process enabled each nation to present additional evidence and correct inaccuracies before scores were finalised. The HDRL Framework is being published under CC BY 4.0 licence for reuse.

This report is a framework for coordinated investment decisions. It is not a funded delivery plan, a project plan, a funding bid, nor an HDRS commitment. It is a structured evidence base and roadmap that demonstrates the three nations are ready to move — and have something valuable to offer. The roadmap recommendations aim to sequence by dependency rather than absolute priority and to distinguish between actions that improve existing operations and genuinely new development requiring additional investment.

## 2. Assessment Approach

### 2.1 The HDRL Framework

The Health Data Readiness Level Framework was developed through systematic analysis of 56 existing maturity, readiness and capability frameworks. It provides a common measurement instrument across eight domains, 64 indicators and five maturity levels, designed to be applicable to heterogeneous health data research infrastructure regardless of governance model, scale or organisational structure.

Assessment follows a structured evidence hierarchy: Level 1 (Initial) requires minimal or no documented capability; Level 2 (Repeatable) requires demonstrated but informal capability; Level 3 (Defined) requires formal, documented processes; Level 4 (Managed) requires measured, published performance; Level 5 (Optimising) requires evidence of systematic improvement and international benchmarking.

### 2.2 Domains

| Domain | Name | Scope |
|---|---|---|
| A | Data Coverage and Federation | Data availability, patient identification, federation capability, and multi-modal data assets. |
| B | Data Semantics and Quality | Common data models, quality management, and reusable research assets. |
| C | Governance and Access | Legal basis, access processes, cross-sector linkage governance, and data protection. |
| D | Research Integration and Market | Research output, engagement channels, commercial access, and clinical trial services. |
| E | Public Trust and Transparency | Transparency reporting, public engagement, and data management practices. |
| F | Sustainability | Funding horizon, cost recovery, and business continuity. |
| G | Workforce and Culture | Staffing, skills frameworks, and service orientation. |
| H | Infrastructure and Compute | Architecture, compute capability, security, and advanced analytics. |

### 2.3 Evidence Standards

All scores are evidence-based. Self-reported capability without documentation caps at Level 2; formal documentation supports Level 3; published performance data with external validation supports Level 4; and systematic benchmarking with evidence of improvement supports Level 5. The Right of Reply process enabled nations to present additional evidence, with all score changes documented in the Change Log.

### 2.4 Foundational Indicators

Five indicators have been designated Foundational Indicators where a minimum standard of Level 3 is assumed to be necessary for participation in a UK-wide data research service. These were selected because they represent non-negotiable prerequisites for any organisation processing health data for research across jurisdictional boundaries: Legal Basis for Research Processing (C.1.1), Data Access Committee (C.2.2), Statistical Disclosure Control (C.4.1), Security Certification and Audit (H.3.1), and Security Operations (H.3.2). All three nations meet the Level 3 threshold across all five. These are offered as a contribution to the HDRS design conversation, not as established HDRS requirements.

## 3. Cross-Nation Comparative Analysis

### 3.1 Overall Readiness Profiles

|  | Wales / SAIL | Scotland / SSHN | N. Ireland / NITRE |
|---|---|---|---|
| Profile | Managed (L3–L4) | Defined (L3) | Developing (L2–L3) |
| Foundational Ind. | All 5 ≥ L3 ✔ (4 at L4) | All 5 ≥ L3 ✔ (1 at L4) | All 5 = L3 ✔ |
| L4+ indicators | 19 | 6 | 1 |
| Status | READY | READY BUT GP DATA GAP | READY WITH CONDITIONS |
| GP Data | ~86% population via WLGP | Regional only (DataLoch) | QOF subsets emerging |

The spread across nations reflects genuine differences in scale, investment and operating history rather than differences in commitment or ambition. Wales benefits from 17 years of continuous SAIL operation with sustained Welsh Government investment. Scotland’s Safe Haven Network is in a consolidation phase, building national coordination through Research Data Scotland across national and four regional academic-led data safe havens. Northern Ireland’s research data infrastructure operates at smaller scale with proportionally less investment yet delivers strong user satisfaction and efficient turnaround times.

### 3.2 The Evidence Maturity Gap

This assessment has identified that operational capability consistently exceeds publicly documented performance across all three nations. Services that routinely deliver high-quality outputs to researchers often lack the published metrics, service level documentation, and external benchmarking evidence that the HDRL Framework specifies for Level 4 or above. As HDRS defines its requirements, demonstrable performance will matter more than stated capability. The roadmap therefore includes specific actions to close this gap through operational metrics publication.

### 3.3 Domain-by-Domain Synthesis

#### Domain A: Data Coverage and Federation

All three nations provide national-scale secondary care, mortality, cancer and prescribing data using consistent coding standards (ICD-10, OPCS-4, dm+d). The critical asymmetry is GP data: Wales leads with approximately 86% population coverage through SAIL’s WLGP dataset. Scotland has GP data available at regional scale for Lothian only through DataLoch (approximately 17% of Scottish population). Northern Ireland has prescribing data and is progressing GP clinical data through GPIP, with QOF-based subsets emerging. No nation has operational federated query capability, though Scotland’s Connect 4 programme and Wales’s TELEPORT (DARE UK) work are advancing toward this.

#### Domain B: Data Semantics and Quality

Data quality management is generally embedded in operational processes but rarely formally documented at the level required for Level 4. Common Data Model adoption is limited: no verified operational OMOP implementation exists, though Wales has a pilot underway with the University of Nottingham, Scotland’s DataLoch participates in the HDR UK OMOP network whilst HIC and the National Data Safe Haven have OMOP assets for data discovery via the HDR UK Gateway. Wales’s contribution to the HDR UK Phenotype Library (1,090+ validated phenotypes) represents a significant UK-wide research asset.

#### Domain C: Governance and Access

All three nations have established governance frameworks with independent data access committees and formal application processes. Wales’s IGRP operates an efficient 12-week pathway. Scotland’s PBPP provides a recognised national mechanism and RDS is expanding the Research Access Service for more standardised requests. Northern Ireland’s governance through the Honest Broker Service is well-established with strong user satisfaction. The critical gap is mutual recognition: no cross-border governance reciprocity exists, meaning every multi-nation study requires duplicative applications.

#### Domain D: Research Integration and Market

All three nations serve predominantly academic users. Commercial access pathways are at different stages: Wales has an established model; Scotland published a formal framework in March 2026; Northern Ireland has limited commercial track record. Clinical trial data services are nascent, though the ABPI’s March 2026 report specifically names SAIL as an exemplar.

#### Domain E: Public Trust and Transparency

Scotland leads in public engagement capacity with the Scotland Talks Data panel, a dedicated Public Engagement Fund, and evaluated two-way dialogue. Wales demonstrates strong institutional commitment through public-facing reporting and the Queen’s Anniversary Prize. Northern Ireland’s public engagement is limited by scale but includes patient and public involvement in governance. Opt-out approaches differ across the three nations and from NHS England’s national opt-out model — a point requiring proactive articulation for HDRS interoperability.

#### Domain F: Sustainability

Funding models vary significantly. SAIL has confirmed multi-year funding through HCRW (2025–2030) and ADR UK (2026–2031), achieving Level 5 on funding horizon. Research Data Scotland also has ADR UK funding for 2026-31 but operates on a conditional basis with a Letter of Comfort from the Scottish Government with no confirmed multi-year grant. Northern Ireland operates within annual budget cycles, often competing with care delivery for funding.

#### Domain G: Workforce and Culture

All three nations face workforce constraints typical of specialist data services within academic or public sector salary structures. Scotland has developed a comprehensive SFIA-aligned workforce framework (Level 4) that could serve as a template for cross-nation benchmarking. Northern Ireland achieves notably high user satisfaction (86%) despite resource constraints.

#### Domain H: Infrastructure and Compute

All three nations operate ISO 27001-certified trusted research environments. Wales’s SeRP platform is franchised internationally (including to Northern Ireland) and includes GPU access for AI workloads. Scotland’s network includes multiple accredited environments (EPCC, HIC, NSH, DataLoch). Northern Ireland’s infrastructure is delivered through SeRP partnership, a deliberate and cost-effective business choice.

### 3.4 Foundational Indicators

| Indicator | Wales | Scotland | N. Ireland |
|---|---|---|---|
| C.1.1 Legal Basis for Research Processing | L3 | L3 | L3 |
| C.2.2 Data Access Committee | L4 | L3 | L3 |
| C.4.1 Statistical Disclosure Control | L4 | L3 | L3 |
| H.3.1 Security Certification and Audit | L4 | L4 | L3 |
| H.3.2 Security Operations | L4 | L3 | L3 |

### 3.5 Readiness Assessment Summary by Nation

#### Wales / SAIL Databank

> **Status:** READY
>
> **Profile:** Managed (L3–L4) — Closest to operational readiness for HDRS participation
>
> **Foundational Indicators:** All five meet L3 minimum; four exceed at L4 (Data Access Committee, Statistical Disclosure Control, Security Certification, Security Operations)
>
> **Distinctive strengths:** UK-leading GP coverage (~86%), proven SeRP architecture franchised internationally, 741 approved projects, efficient IGRP governance (12-week pathway), Queen’s Anniversary Prize, HDR UK Phenotype Library foundation, FEDS UK consortium leadership, comprehensive cross-sector linkage via ADR Wales
>
> **Priority gaps:** Capacity funding for analyst pool, evidence maturity gap, Common Data Model not yet operational, practical implementation of responsible AI framework
>
> **Data supply risk:** Audit Plus (Informatica) withdrawal requires a new model to ensure GP data continuity. Anything that damages trusted relationships with data holders built up over many years.

#### Scottish Safe Haven Network

> **Status:** READY BUT GP DATA GAP
>
> **Profile:** Defined (L3) — Strong foundations with significant documentation debt and longer-term funding uncertainty
>
> **Foundational Indicators:** All five meet L3 minimum; one exceeds at L4 (Security Certification and Audit)
>
> **Distinctive strengths:** CHI universal identifier, 10+ years TRE experience with zero reportable breaches, PICTURES imaging database, Scotland Talks Data public engagement, engagement with all five DARE UK Driver Projects, RAS modernisation, SFIA-aligned workforce framework
>
> **Priority gaps:** National GP data access, funding horizon (conditional assurance only), documentation debt, no CDM operational, mutual recognition not established
>
> **Funding risk:** Provisional notification of Scottish Government grant funding for a two-year period only. Without multi-year confirmation, Scotland cannot plan for HDRS integration.

#### Northern Ireland / NITRE – HSC Data Institute

> **Status:** READY WITH CONDITIONS
>
> **Profile:** Developing (L2–L3) — with significant potential
>
> **Foundational Indicators:** All five meet L3 minimum
>
> **Distinctive strengths:** Integrated HSC system for cross-sector access, 86% user satisfaction, 43–56% same-day output clearance, Health and Care Number for deterministic linkage, Encompass single EHR programme, emerging GPIP QOF subsets, DaC-VaP operational legacy
>
> **Priority gaps:** No CDM adoption, legislative gap (2016 Act amendment targeting summer 2026), workforce critically thin, no federated query capability (although platform capability exists via SeRP)
>
> **Capacity risk:** Major digital transformation underway with understandable focus on direct care. Research data infrastructure competes for the same limited specialist workforce.

### 3.6 What the Devolved Nations Bring to HDRS

The three nations bring specific, proven assets that HDRS cannot replicate from English systems alone. Seven exemplars illustrate the breadth of potential contribution.

#### SeRP: Proven, Exportable TRE Architecture

Wales’s Secure e-Research Platform is the UK’s most widely deployed TRE architecture. Developed by Swansea University and franchised to Northern Ireland, it demonstrates that devolved nation innovation can scale across jurisdictions. SeRP provides GPU-enabled compute, containerised analysis environments, and a mature security model.

#### IGRP: A Governance Model That Works

Wales’s Information Governance Review Panel operates a streamlined, transparent governance pathway that consistently delivers approvals within 12 weeks. With 741 approved projects, IGRP provides the UK’s strongest evidence base for how research governance can work at scale.

#### ADR Wales and Cross-Sector Linkage

Wales’s Administrative Data Research capability, operated through SAIL, provides the UK’s most comprehensive cross-sector data linkage for research. The dual ALF and RALF identifiers enable individual-level and place-based research across health, education, housing and justice — directly supporting HDRS Capability 6.

#### Scotland: Universal Identifiers and Cross-Nation Linkage

Scotland’s Community Health Index provides a universal, well-maintained patient identifier enabling deterministic linkage across all health datasets. The CHI-UPRN Residential Linkage (CURL) extends this to household-level analysis. Scotland’s indexing infrastructure, including the Connect 4 programme, represents essential plumbing for any UK-wide federated research service.

#### PICTURES: A World First in Research Imaging

Scotland’s PICTURES programme hosts over 57 million de-identified images (X-ray, CT, MRI, Ultrasound) linked to longitudinal health records via CHI — aligning precisely with HDRS Capability 3 goals. This is a globally significant asset.

#### Northern Ireland’s Integrated Health and Social Care

Northern Ireland’s unique integrated HSC system provides structural advantages for cross-sector data linkage that do not exist elsewhere in the UK. The Encompass programme’s implementation of a single Epic electronic health record will further strengthen this, though not all research-relevant data will flow through Encompass and secondary use data extraction needs to be designed into the implementation. Ensuring this happens while the system is being built is a priority.

#### The Phenotype Library: UK Research Infrastructure

SAIL developed the Concept Library that became the foundation for HDR UK’s Phenotype Library. With 1,090+ validated phenotypes, version control and seamless integration into the secure analysis environment, this is a significant national contribution enabling researchers across the UK to apply standardised, validated case definitions.

## 4. Use Case Analysis: Then Versus Now

Two use cases stress-test readiness from complementary perspectives. COALESCE provides a retrospective lens on what was achieved during the pandemic. Shingrix tests what is possible today under normal governance arrangements. Together they reveal an approvals and data availability regression that is central to understanding HDRS’s delivery challenge.

### 4.1 COALESCE: What Was Achieved

COALESCE operated within the CVD-COVID-UK consortium, led by the BHF Data Science Centre. The study achieved analysis spanning approximately 68 million individuals across all four nations (Lancet 2024; 403: 554–66) — an extraordinary demonstration of cross-nation data research.

The critical finding is the heavy lifting required to make it an operational reality despite favourable governance and data availability through the COVID-19 pandemic. The project initially envisaged federated analytics using the OMOP Common Data Model, but the actual approach was meta-analysis: separate national analyses - each nation conducted its own analysis within its local Trusted Research Environment (TRE) - with results manually combined after clearing statistical disclosure control at each local TRE. The pandemic-era enablers — COPI notices and programmatic access in England, PBPP rapid review and programmatic access in Scotland, programmatic access in SAIL, collaborative institutional culture, and National Core Study funding and co-ordination — have all since expired.

### 4.2 Lessons from COALESCE for Federation Design

The COALESCE analysis reveals the challenges to achieving federated analytics. Three design principles follow:

1. Harmonised specifications before full Common Data Model (CDM): agree variable lists, coding standards, refresh frequency, and derivation rules for core datasets, enabling the same code to run across TREs.

2. Offer a service provision model with embedded TRE analysts running coordinated analyses. This helps reproducibility and co-ordination across separate teams building four models from first principles.

3. Start with what is available now: hospital, deaths and cancer data can federate now. Do not wait for GP data to demonstrate cross-nation capability.

### 4.3 Shingrix: What Is Possible Now

The GSK Shingrix shingles vaccine study was announced in March 2025 with ministerial backing as part of the Life Sciences Sector Plan. It represents the type of industry-partnered, multi-nation health data study that HDRS is designed to enable. Nine months after announcement, systematic searches across all major UK governance registers in January 2026 found no visible applications for this study. It is assumed therefore to be in a feasibility phase.

#### The GP Data Challenge

The critical operational blocker for both Shingrix and HDRS Capability 1 is GP data access. Vaccination status verification, dementia diagnoses, and longitudinal health outcomes tracking all require population-scale primary care data. As set out in the Domain A analysis, only Wales currently has this at scale (and has hosted a similar Shingles vaccine study in the past).

#### The Governance Regression

The projected timeline for a comparable multi-nation study today — without emergency powers and other pandemic related enablers — is estimated at 18–24 months rather than weeks.

| COVID-Era Enabler | Current Status | Impact |
|---|---|---|
| COPI Notice (England/Wales) | Expired June 2022 | Adds 6–12 months for CAG approval in England. Prevents equivalent access to GP data for non-COVID purposes. |
| PBPP rapid review (Scotland) | Normal timelines restored | Weeks to months for Scottish approvals. |
| Expanded GP participation (Wales) | Maintained at high level | Positive legacy — 86% coverage persists |
| Collaborative institutional culture | Reverted to institutional protection | Resource constraints and charging have increased friction |
| National Core Studies funding | Programme ended | No coordinated cross-nation funding vehicle |

Positive legacy: in Northern Ireland, the DaC-VaP capabilities developed during the pandemic have been operationalised for routine vaccine surveillance, with results shared with Joint Committee on Vaccination and Immunisation (JCVI) to inform booster decisions.

## 5. The Strategic Context

### 5.1 Establishing HDRS

It is a year since the HDRS announcement, but its leadership has only been in post a short time and embarking on a rapid discovery phase, including visits to each of the devolved nations. It is understood that three transitional commitments — NHS DigiTrials, the NHS in England SDE Network, and OpenSAFELY — are likely to account for a significant share of the first-year budget.

The commitment to a four-nations endeavour is stated but not yet operationalised. No formal agreement exists between HDRS and the devolved nations. A Four Nations Council has been proposed but not established. If HDRS funding flows predominantly to inherited English infrastructure while the devolved nations’ services continue to be funded through their own governments, this creates a structural asymmetry that must be addressed.

HDRS’s own priorities are expected to crystallise by June 2026, feeding into a business case by November 2026. The devolved nations have significant expertise that would help shape the service, and their services provide benchmarks for what HDRS should aspire to achieve. The opportunity to influence HDRS design is immediate and may not persist once the architecture is set.

### 5.2 The ABPI Signal

[The ABPI’s March 2026 report on data-enabled clinical trials](https://www.abpi.org.uk/publications/globally-competitive-uk-wide-data-enabled-clinical-trials-the-time-is-now/) provides external validation for a potential three nations’ proposition. The report highlights that the UK conducted its lowest number of clinical trial participant recruitments in 2024/25 since 2017/18, that screen failure rates reach 90% in some therapeutic areas, and that fewer than 5% of UK trials currently use routinely collected health data. It specifically names SAIL as an exemplar and recommends that a service design function for data-enabled trials be placed within HDRS.

### 5.3 The Funding Question

Funding and sustainability were recurrent themes from the assessments and national workshops. It remains unclear whether HDRS will act as a commissioner, investor, or collaborator of the devolved nations’ services. The roadmap distinguishes between actions that improve existing operations (justifiable from current budgets) and genuinely new development requiring additional investment. Any proposition to HDRS should include a clear statement that participation in service design, business case development, and pilot activities requires funded resource. Every interaction has an opportunity cost.

## 6. Recommendations

### 6.1 Pathfinder Propositions

Four pathfinder propositions position the devolved nations as proactive partners offering demonstrable value to HDRS. Each addresses a specific HDRS capability, has potential to demonstrate cross-nation federation, and builds toward the strategic prize of a fully integrated UK-wide service.

|  | Pathfinder | Description | Data Readiness |
|---|---|---|---|
| A | Rapid Real-World Evidence Network | Builds on the COALESCE legacy using existing secondary care and mortality data. All three nations can participate immediately with no GP data dependency. Embedded TRE analysts run coordinated analyses using harmonised specifications. The recommended quick win: demonstrates cross-nation capability before HDRS first services in December 2026. | READY NOW |
| B | Imaging AI Network | Scotland’s PICTURES database (57 million+ de-identified images linked to health records) combined with Wales’s SeRP GPU compute for multi-system external validation of imaging AI algorithms. Requires scoping before it can progress. | SCOPING NEEDED |
| C | Policy Laboratory | The UK’s four-nation structure creates natural experiments through divergent policies. Wales’s cross-sector linkage through ADR Wales is unmatched. Significant academic and policy value; lower HDRS priority. | WALES-LED |
| D | Decentralised Trials Network | Lead strategic proposition. The ABPI report confirms linked GP and secondary care data addresses ~60% of protocol selection criteria. Delivery phased by GP data availability: Wales anchors Phase 1; Scotland and Northern Ireland join as access expands. NHS capacity to support trials delivery is also a key dependency. | PHASED |

Recommendation: Pursue Pathfinder D as the lead proposition to HDRS, supported by Pathfinder A as the immediate quick win.

### 6.2 Data Readiness: The Core Offer

Hospital inpatient data, mortality, cancer registration and prescribing data use consistent coding standards across all three nations and could form the basis of a cross-nation core offer relatively quickly. GP data remains the critical asymmetry.

Four priority data actions are recommended:

- Agree a core offer dataset specification (0–6 months, collaborative);
- Publish harmonised metadata (0–6 months, Northern Ireland-led);
- Develop a coordinated GP data expansion strategy (6–18 months);
- Coordinate CDM adoption (6–18 months, Wales-led).

### 6.3 The Joint Roadmap

The roadmap is structured across three time horizons aligned to HDRS milestones. Nation-specific recommendations are summarised in 6.4 below. The most valuable near-term HDRS gains come from aligning operating models and reusable components. Recommended mechanisms include a coordinated engagement model with HDRS (collective on system-wide matters, bilateral on specialist capabilities); a shared template library; a UK-wide metrics and transparency agreement; and joint federation pilots starting with Pathfinder A.

#### Quick Wins: 0–6 Months

In addition to the core data offer specification, collaborative quick wins focus on demonstrating coordination readiness with minimal new investment: publishing harmonised metadata through the HDR UK Gateway; scoping Pathfinder A as a cross-nation demonstrator; and establishing a shared evidence repository. Each nation also has specific quick wins focused on closing the evidence maturity gap through operational metrics publication.

#### Short-Term: 6–18 Months

The critical collaborative action is governance harmonisation. Without movement towards mutual recognition of governance standards, every cross-nation study will continue to require duplicative applications. A potentially practical starting point is each party accepting another nation’s application form whilst retaining its own assessment. Beyond governance, this period should see Pathfinder A progress to a live study, CDM coordination led by Wales, and development of Pathfinder D.

Nation-specific priorities are substantial: Scotland’s top priority is national GP data access, followed by securing multi-year government funding. Wales’s priorities are federation operationalisation and expansion of SAIL for complex data modalities, dependent on NHS data holders. Northern Ireland’s priorities are NIHAP and HSC data integration, securing recurrent funding, and legislative completion.

#### Strategic: 18–36 Months

The strategic outcomes define success: three nations contributing routine data to HDRS via federated infrastructure; GP data coverage moving toward comprehensive coverage; harmonised governance for cross-nation research access; and data-enabled clinical trials actively recruiting via devolved nation services. A formal cross-nation coordination mechanism should be established, with potential for wider connections including to the European Health Data Space.

### 6.4 Recommendations for Each Nation

#### Wales

Maintain and protect the core operational model (IGRP + SAIL + SeRP) as an HDRS pathfinder node. Publish consistent end-to-end service metrics. Lead UK working groups on reusable research assets and CDM adoption. Expand complex data modalities available through SAIL in partnership with NHS data holders.

#### Scotland

Resolve the sustainability risk by securing a stable multi-year funding horizon. Accelerate national-scale primary care access. Publish operational metrics. Build on PICTURES and laboratory data to enhance the multi-modal offer across the Safe Haven Network. Develop a unified service catalogue and front door for the network.

#### Northern Ireland

Build on progress with QOF-based registry data to deliver a GP data offer. Continue the legislative enabling conditions. Invest in interoperability foundations and strengthen workforce resilience through the SeRP partnership. Ensure secondary use data extraction is designed into Encompass.

### 6.5 Risk Mitigation

The following eight risks are considered the most relevant to the collective HDRS proposition and need particular consideration by the leadership across the three nations. The recommended actions provide potential mitigations.

| Risk | Likelihood / Impact | Mitigation |
|---|---|---|
| HDRS architecture fixed around English infrastructure before devolved nations engaged | Medium / High | Collective proposition by June 2026. Pathfinder propositions as concrete contributions. |
| GP data supply disruption | Medium / High | Coordinated approach across nations. Joint position paper. Alternative extraction routes. |
| Funding for participation not secured | High / High | Clear statement that engagement requires funded resource. Pursue DSIT/OLS and HDRS channels. |
| Governance harmonisation stalls | Medium / High | Start with application form reciprocity. Build incrementally. |
| Scotland GP data access resolution delayed | Medium / High | DataLoch blueprint for phased expansion. Engage GP Editorial Board through RDS |
| NI legislative timeline slips | High / Medium | Research continues under current framework. Amendment bill on Stormont schedule. |
| Workforce capacity insufficient | High / Medium | Distinguish BAU from DEV. Explore workforce benchmarking and pooling of capability. |
| Post-project coordination lapses | Medium / Medium | Monthly keep-in-touch meetings agreed. Governance mechanism to be determined. |

## 7. Reflections for HDRS leadership

### 7.1 Considerations for HDRS Design

The project has generated some themes that may be helpful for the HDRS leadership team to consider alongside the other discovery work that has taken place over the last year. The emerging themes are framed as considerations for HDRS design, intended to inform conversations not specify requirements.

| # | Consideration | Rationale |
|---|---|---|
| 1 | Design for a ‘federation of capable nodes’ | Define a minimum viable node standard and allow staged onboarding at different maturity levels. |
| 2 | Treat the cross-border operating model as a core product | Mutual recognition pathways, standardised agreements and repeatable workflows should be built together and tested early. |
| 3 | Invest in shared UK research accelerators | Concept and phenotype libraries, reusable analytic code assets, metadata catalogues — high-value, low-cost, building on what exists. |
| 4 | Adopt UK-wide service metrics | Time-to-data, throughput, user satisfaction — require routine publication across any HDRS ‘franchisee’. |
| 5 | Adopt a standard assurance pack for baseline enablers | Templates that reduce burden for smaller nodes while maintaining standards. |
| 6 | Start multi-modal delivery through targeted pathfinders | Use existing assets rather than requiring uniform readiness from day one. |
| 7 | Ensure the concierge service is distributed | Embedded resource within each TRE. A centralised-only model risks replicating known challenges. |
| 8 | Fund the data utility layer | Data harmonisation, coding standards and metadata at source — prerequisite for sustainable cross-nation research. |

### 7.2 A Reusable Methodology

This assessment represents the first systematic, evidence-based readiness evaluation of health data research infrastructure across multiple jurisdictions using a common framework. The HDRL methodology is designed to be reusable: by HDRS as a baseline measurement tool, by individual services for self-assessment, and potentially by other jurisdictions including those preparing for the European Health Data Space. The framework is published under CC BY 4.0 licence.

## 8. Governance and Next Steps

### 8.1 Sustaining Collaboration Post-Project

This project has created an infrastructure for cross-nation collaboration — shared evidence, aligned assessments, joint strategy. The Oversight Group has agreed to monthly keep-in-touch meetings including civil servant counterparts, to share developments and develop collective thinking as HDRS progresses.

### 8.2 Engaging with HDRS

The three nations intend to develop a collective proposition for HDRS. This report provides the evidence base; further engagement should be structured to maintain control of the process. The recommended approach is to share this report with HDRS leadership with an invitation to provide initial feedback and questions, creating a controlled dialogue before any formal proposition is tabled. Nations should engage HDRS collectively on system-wide matters and bilaterally on specialist capabilities, keeping each other informed.

### 8.3 Immediate Actions

| Action | Owner | Timing |
|---|---|---|
| Share Final Report with HDRS | Roger Halliday | Post sign-off |
| Develop collective narrative and outline 2026–27 proposition | Roger Halliday | May 2026 |
| HDRS CEO visit to Northern Ireland | Frances Burns | TBC |
| Agree governance mechanism | OG decision | May 2026 |
| Pathfinder A scoping paper | Collaborative | May 2026 |
| Core offer dataset specification | Collaborative | June 2026 |
| ABPI engagement | Collaborative | First half 2026 |
