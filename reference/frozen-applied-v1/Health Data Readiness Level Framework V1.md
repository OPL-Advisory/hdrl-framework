Health Data Research Service

Three Nations Readiness Assessment

# Annex A: HDRL Framework v1.0 and Methodology

April 2026

**Classification: Unrestricted — open access**

This document sets out the Health Data Readiness Level Framework, how it was developed and the method by which the maturity of the health data services across the devolved nations was assessed and hence their potential readiness for participating in the UK Health Data Research Service (HDRS).

# 1. Introduction

## 1.1 Purpose and scope

HDRS aims to create federated UK-wide infrastructure for health data research. The HDRL Framework provides a common language for understanding capabilities, identifying gaps, and planning investments. It is designed for programme leadership, health data organisations, policy makers, funders, and UK Health Data Research Alliance members.

## 1.2 Unit of assessment

HDRL can be applied at multiple levels. Each indicator is tagged:

| **Tag** | **Level** | **Description** |
|----|----|----|
| **S** | System | Nation or health system level. Policy, legal framework, population infrastructure. Services inherit these scores. |
| **V** | Service | Individual SDE or data service level. Operational delivery specific to that service. |
| **B** | Both | Can be assessed at either level. Score may differ between levels. |

### System-level assessment

When assessing a nation or system as an HDRS node, assess all indicators; for V indicators, assess the primary service or aggregate across services.

### Service-level assessment

When assessing an individual SDE, focus on V and B indicators; inherit S indicators from national context or mark N/A.

### Dual-level assessment

For comprehensive view, conduct both. This reveals whether gaps are systemic (policy/investment) or operational (individual service).

## 1.3 HDRS capabilities

Indicators map to six HDRS capabilities:

- \(1\) Linked national-scale data

- \(2\) Consented cohort data

- \(3\) Multi-modal data

- \(4\) Trial acceleration

- \(5\) Single-entry point with secure environments

- \(6\) Cross-sector linkage.

A detailed mapping of HDRS capabilities to HDRL indicators is provided in **Section 7 (HDRS capability map)**.

# 2. Framework structure

## 2.1 Maturity levels

The HDRL Framework uses five levels to describe the current state of maturity of a health data organisation or system, and by extension its potential readiness to participate in HDRS. Levels reflect current state of capability, from basic to advanced.

**Level 1: Initial — Ad-hoc processes**

Processes are informal or fragmented. Major gaps exist; requirements are not met.

**Level 2: Developing — Basic structures**

A strategy is in place, and initial steps have been taken. Implementation is just beginning and not yet widespread.

**Level 3: Defined — Documented processes**

Some progress has been made, and parts of the system are working. Targets are set but not always achieved consistently.

**Level 4: Managed — Measured performance (anticipated collaboration baseline)**

Operations are standardised and meet baseline requirements. Service Level Agreements (SLAs) are published and met.

**Level 5: Optimising — Continuous improvement**

The organisation exceeds baseline requirements. Focus on continuous improvement and top performance. Practices are recognised as exemplary.

**Note:** Level 4 thresholds are designed to be ambitious but achievable. These will require validation by comparing with UK and international benchmarks.

## 2.2 Indicator classification

HDRL keeps the existing Core vs Enhancement distinction (used for colour-coding and continuity) and adds an explicit Applicability Class to support role-based assessment and separate readiness from demand-driven outcomes.

**Indicator Type:**

- Core (green): essential controls and capabilities for participation.

- Enhancement (amber): improves quality, efficiency, and scale but is not required for baseline participation.

**Applicability Class:**

- B0 — Baseline Core: mandatory for any system or service claiming HDRS participation (the "licence to operate" set).

- Cx — Capability Core: mandatory only if a system or service claims the relevant HDRS capability x (1–6).

- O — Optional / Enhancement: good practice; informs roadmaps but not required for baseline or capability readiness.

- Y — Outcome / Context: reported for situational awareness and benefit tracking but excluded from readiness scoring because it is strongly influenced by external demand or context (e.g., research intensity, funding environment).

**Important implementation note:** Some indicators labelled as Enhancement are capability-defining (e.g., multi-modal data access; trial acceleration) and are treated as Cx when assessing that capability. The Indicator Summary (Section 5) records the Applicability Class for every indicator.

## 2.3 Aggregation and interpretation

HDRL supports roadmap development rather than pass/fail judgements.

### Domain scores

Calculate domain scores as the median of Core indicators excluding Outcome/Context (Y) within the domain. For baseline participation readiness, focus on Baseline Core indicators; for a specific HDRS capability, score the subset of indicators mapped to that capability (including any capability-defining enhancements). Enhancement indicators inform the overall picture and roadmap but do not affect baseline domain scores unless explicitly included in a capability module. Outcome/Context (Y) indicators are reported separately and do not affect readiness scoring.

### Indicative readiness profiles

| **Profile** | **Characteristics** |
|----|----|
| **Emerging** | Majority of Baseline Core at Level 1–2. Significant foundational work required. |
| **Developing** | Majority of Baseline Core at Level 2–3. Active improvement. May participate with roadmap and support. |
| **Managed** | Majority of Baseline Core at Level 3–4, none below Level 2. Meets baseline requirements. |
| **Optimising** | Majority of Baseline Core at Level 4–5. Exceeds baseline. Potential exemplar. |

**Important:** These profiles support planning, not accreditation. HDRS participation decisions are made through separate governance. Capability module readiness should be reported alongside the baseline profile.

## 2.4 Domain structure

HDRL has 64 indicators organised across eight domains. Per-domain narrative commentary is provided as the introduction to each domain in Section 6 (Indicator catalogue). This section lists the domains only.

| **Ref** | **Domain** | **Focus** |
|----|----|----|
| **A** | **Data Coverage & Federation** | Availability, linkage, flow of health data |
| **B** | **Data Semantics & Quality** | Standardisation, quality, analytical readiness |
| **C** | **Governance & Access** | Legal frameworks, access processes, UK coordination |
| **D** | **Research Integration & Market** | Researcher engagement, services, demonstrated use |
| **E** | **Public Trust & Transparency** | Engagement, transparency, social licence |
| **F** | **Sustainability** | Funding, commercial model, economic impact |
| **G** | **Workforce & Culture** | Staff capacity, capability, culture |
| **H** | **Infrastructure & Compute** | Technical environment, compute, security, AI |

# 3. Framework alignment and positioning

## 3.1 Development approach

The HDRL Framework was developed through systematic evidence synthesis and first-principles analysis. Three frontier AI models independently reviewed 56 existing frameworks across data governance, health information systems, research infrastructure, and workforce capacity domains. Outputs were triangulated to identify areas of consensus and disagreement, with findings verified against primary sources except for four reduced-confidence single mentions retained in the catalogue without independent review.

A critical finding was that no existing framework comprehensively addresses health data research readiness. While mature frameworks exist for general data management (DCAM, DAMA-DMBOK), health information systems (HIMSS EMRAM, WHO SCORE) and FAIR data practices (RDA FAIR DMM), none integrates these dimensions for assessing readiness to participate in multi-site health data research infrastructure. This validates the purpose of HDRL.

The framework architecture reflects strong consensus across source frameworks: five maturity levels (aligned with CMMI nomenclature), eight domains (within the 6–11 range observed), and a Core/Enhancement indicator classification adapted from RDA FAIR's priority tiers. Full methodology and evidence base documentation is provided in Section 8.

## 3.2 The health data framework landscape

HDRL operates within a rich ecosystem organised across four layers:

- **Foundational principles:** Five Safes (Ritchie/ONS, 2003), FAIR principles, GA4GH Framework, UK Health Data Research Alliance Principles for Participation, Building Trusted Research Environments guidance.

- **Policy and legal frameworks:** UK GDPR, Data Protection Act 2018, Digital Economy Act 2017, DHSC SDE Policy, Scottish Safe Haven Charter, National Data Guardian guidance.

- **Technical specifications:** SATRE, NHS England SDE Specifications, ISO 27001, OMOP CDM, HL7 FHIR.

- **Maturity assessment:** HDRL sits alongside the B1MG Maturity Level Model and organisation-specific tools.

## 3.3 Companion frameworks

| **Framework** | **What it does** | **How HDRL relates** |
|----|----|----|
| **SATRE** | TRE capability specification (mandatory/recommended/optional) | HDRL assesses maturity across wider indicator set; SATRE informs Domain H |
| **B1MG MLM** | Genomic medicine adoption (5 levels, 49 indicators) | Structural precedent; companion crosswalk available |
| **Five Safes** | Risk framework for individual access decisions | HDRL assesses systemic capability to apply Five Safes consistently |
| **Building TREs** | TRE principles and best practices (Alliance, 2021) | Informed Domains C and H; HDRL operationalises principles |
| **Alliance Principles** | UK Health Data Research Alliance member commitments | HDRL measures delivery against eleven principles |

## 3.4 Alliance Principles alignment

HDRL maps to all eleven UK Health Data Research Alliance Principles for Participation (July 2025):

| **\#** | **Alliance Principle** | **HDRL Domain** | **Key Indicators** |
|----|----|----|----|
| **1** | Active public engagement | E: Public Trust | E.2.1, E.2.2 |
| **2** | Encourage data availability | A: Data Coverage | A.1.1, A.1.3, A.4.2 |
| **3** | Privacy via accredited SDEs | H: Infrastructure | H.1.1, H.3.1 |
| **4** | FAIR data principles | B: Data Semantics | B.1.1, B.1.2, B.2.2 |
| **5** | Five Safes governance | C: Governance | C.2.2, C.4.1 |
| **6** | Non-preferential access | D: Research Integration | D.1.1, D.3.2 |
| **7** | Mutually beneficial partnerships | F: Sustainability | F.2.1, F.2.2 |
| **8** | Harmonisation | C: Governance | C.2.1, C.3.1, C.3.3 |
| **9** | UK-wide collaboration | A, C, D | A.3.2, A.3.3, D.3.1, C.3.3 |
| **10** | Transparency | E: Public Trust | E.1.1, E.1.2 |
| **11** | Responsible AI | H: Infrastructure | H.4.2 |

# 4. Evidence, assessment and readiness

This section provides practical guidance to make HDRL assessments repeatable, auditable, and comparable across systems and services.

## 4.1 Evidence expectations by level

HDRL scoring should be based on documented evidence, not assessor opinion. For implementation, maintain an Evidence Register alongside the scored framework.

**Evidence strength expectations by maturity level:**

- **Level 1 (Initial):** narrative description is acceptable; evidence may be limited to informal artefacts (emails, ad-hoc documents).

- **Level 2 (Developing):** documented intent exists (strategy, draft policies, workplans, early governance minutes).

- **Level 3 (Defined):** documented processes exist and are used (SOPs, decision logs, training records, workflow artefacts). Evidence should show the process is operational.

- **Level 4 (Managed):** performance is measured and routinely reported (KPIs, SLAs, audit logs). Evidence should demonstrate the threshold claims (e.g., timeliness, SLA compliance).

- **Level 5 (Optimising):** continuous improvement is evidenced (benchmarking, independent assurance, learning loops, externally shared good practice).

**Evidence categories (examples):**

- **Policy / governance artefacts:** published policies, terms of reference, committee membership, decision criteria, escalation routes.

- **Operational workflow evidence:** process maps, SOPs, application forms, ticketing system exports, training completion logs.

- **Performance evidence:** KPI dashboards, SLA reports, turnaround-time distributions (median + 90th percentile), service catalogues.

- **Assurance evidence:** ISO certificates, audit reports (internal/external), penetration test summaries, risk registers, incident post-mortems.

- **Transparency evidence:** data use register links, annual reports, published minutes (redacted), public benefit statements.

**Minimum rule:** claims at Level 4–5 should be supported by at least one objective performance or assurance artefact, not only narrative.

## 4.2 Evidence Register template

Recommended layout for the Evidence Register:

| **Ref** | **Claimed Level** | **Evidence required (minimum)** | **Evidence location (URL/link)** | **Notes / assumptions** |
|----|----|----|----|----|
| **C.2.1** | 4 | SLA report; time-to-data distribution; process SOP | (link) | start/stop definition used |
| **H.3.1** | 4 | ISO 27001 certificate; pen test summary; remediation evidence | (link) | scope coverage confirmed |

## 4.3 Assessor guidance ("what counts")

To support comparability, assessments should standardise key definitions.

### Defining a "project" (used in D.1.1 and related indicators)

Unless otherwise stated, count projects as approved and provisioned data access requests (governance approval completed and the researcher/team has been granted access to the dataset/workspace), within the last 12 months, where each project is a distinct protocol/application (not each dataset extract). Recommended reporting split (optional): academic / NHS / commercial / public sector; and local / UK-wide / international.

### Measuring "time-to-data" (C.2.1)

Define and record start/stop points consistently:

- Start: date a complete application is received (all mandatory documents supplied; clock starts when the application is "valid").

- Stop: date the applicant has access to the approved dataset/workspace in the secure environment (not the date of committee decision alone).

Report at least median time-to-data, 90th percentile time-to-data (to detect long tails), and % meeting SLA (where SLAs exist).

### Defining "coverage" denominators (A.1.1, A.4.2 and related)

Use a denominator that matches the dataset type and publish it alongside the score: primary care — registered population (practice list size) typically appropriate; secondary care/hospital activity — resident population (e.g., ONS mid-year estimates) or catchment-based denominator (specify method); cohorts/biobanks — eligible population or recruitment frame (specify inclusion/exclusion). Where multiple denominators are plausible, prefer the denominator most comparable across devolved nations and available from official statistics, and document the choice.

### Handling heterogeneity across datasets and services

For system-level scoring where multiple services exist, default approach is to report both a coverage-weighted score (weighted by population coverage / dataset volume / project volume) and a minimum-of-core score for selected "foundational indicators" (to avoid "median hides the hole"). If only one approach is feasible, state it explicitly in the assessment report.

### N/A and inherited scores

- System indicators (S) are inherited by services unless there is a clearly evidenced service-specific deviation.

- Capability-specific indicators (Cx) may be marked N/A if the system/service is not claiming that capability.

- Outcome/context indicators (Y) should be reported even if capability is not claimed, where data exists.

## 4.4 Readiness statements

To make HDRL outputs decision-useful, produce a concise readiness statement in addition to numeric scores.

- **Ready (baseline met):** Baseline Core (B0) shows a Managed/Optimising profile, and no foundational indicator is below the minimum acceptable level.

- **Ready with conditions:** Baseline profile is Developing/Managed, but specific gaps are documented with a time-bound delivery plan (or capability modules are not yet met).

- **Not ready (foundational indicator failed):** One or more foundational indicators fail the minimum level, or Baseline Core is predominantly Level 1–2.

## 4.5 Foundational indicators

The following indicators are treated as non-negotiable for baseline participation and should be explicitly reported:

- **C.1.1** Legal basis for processing

- **C.2.2** Data Access Committee (functioning and documented criteria)

- **C.4.1** Statistical disclosure control

- **H.3.1** Security certification & audit

- **H.3.2** Security operations

Programmes may choose to add others (e.g., C.2.3 ethics integration; E.1.1 transparency register) depending on risk appetite.

**Note:**

Thresholds (e.g., "minimum acceptable level") should be validated using UK benchmarking and may be adjusted over time.

## 4.6 Capability module reporting

For each HDRS capability claimed (1–6), report:

- 1\) Baseline readiness statement (B0)

- 2\) Capability readiness statement (Cx for that capability)

- 3\) Named gaps + delivery plan (actions, owners, dates).

# 5. Indicator summary

The current version has 64 indicators across 8 domains. Column key:

- Type — Core (43) or Enhancement (21).

- Class — Applicability Class: B0 = Baseline Core (mandatory for any HDRS participation); C1–C6 = Capability Core (mandatory only when that HDRS capability is claimed; some Enhancements are capability-defining); O = Optional/Enhancement; Y = Outcome/Context. Current distribution: B0 (37), Cx (7), O (16), Y (4).

- Level — S=System (11), V=Service (14), B=Both (39).

- HDRS — mapping to HDRS proposed capabilities (see §1.3).

- Alliance — mapping to Alliance Principles for Participation (see §3.4).

| **Ref** | **Indicator** | **Type** | **Class** | **Level** | **HDRS** | **Alliance** |
|----|----|----|----|----|----|----|
| **A.1.1** | Core Dataset Availability | Core | B0 | S | 1 | 2 |
| **A.1.2** | Data Currency & Timeliness | Core | B0 | S | 4 | 2 |
| **A.1.3** | Data Equity & Representativeness | Core | B0 | S | 1 | 2 |
| **A.2.1** | Patient Identifier Infrastructure | Core | B0 | S | 1,2,6 | 2 |
| **A.2.2** | Linkage Services | Core | B0 | B | 1,2 | 2 |
| **A.3.1** | Federated Query Capability | Enh | O | B | 5 | 9 |
| **A.3.2** | UK Gateway Connectivity | Core | B0 | B | 5 | 9 |
| **A.3.3** | Federation Operating Model & Assurance | Core | B0 | B | 5 | 9 |
| **A.4.1** | Consented Cohort Integration | Enh | C2 | S | 2 | 2 |
| **A.4.2** | Multi-Modal Data Access | Enh | C3 | S | 3 | 2 |
| **B.1.1** | Common Data Model Adoption | Core | C1 | B | 1 | 4 |
| **B.1.2** | Terminology Standards | Core | C1 | B | 1 | 4 |
| **B.2.1** | Quality Framework & Monitoring | Core | B0 | B | 1 | 4 |
| **B.2.2** | Data Documentation & Metadata | Core | B0 | B | 5 | 4 |
| **B.3.1** | Curated Dataset Availability | Enh | O | B | 1,2 | 4 |
| **B.3.2** | Phenotype Library & Validation | Enh | O | B | 1 | 4,9 |
| **C.1.1** | Legal Basis for Processing | Core | B0 | S | 5 | 3,5 |
| **C.1.2** | Legislative Environment | Enh | O | S | 5 | 3 |
| **C.2.1** | Time-to-Data | Core | B0 | B | 5 | 8 |
| **C.2.2** | Data Access Committee | Core | B0 | B | 5 | 1,5 |
| **C.2.3** | Ethics Pathway Integration & Proportionality | Core | B0 | B | 5 | 5 |
| **C.3.1** | Mutual Recognition & Standards | Core | B0 | B | 5 | 8 |
| **C.3.2** | Cross-Border Legal Alignment | Enh | O | S | 5,6 | 9 |
| **C.3.3** | Cross-sector Data Sharing & Linkage Governance | Core | C6 | S | 6 | 8,9 |
| **C.4.1** | Statistical Disclosure Control | Core | B0 | V | 5 | 3,5 |
| **C.4.2** | Researcher Accreditation | Core | B0 | B | 5 | 5 |
| **C.4.3** | Consent, Permissions & Restrictions Governance | Core | B0 | B | 2,5 | 3,5 |
| **D.1.1** | Active User Base | Core | Y | B | 5 | 6 |
| **D.1.2** | Research Output & Impact | Core | Y | B | All | 10 |
| **D.2.1** | Researcher Support & Helpdesk | Core | B0 | V | 5 | 8 |
| **D.2.2** | Training & Capability Building | Enh | O | V | 5 | 9 |
| **D.2.3** | Reproducibility & Analytic Provenance Support | Core | B0 | V | All | 10 |
| **D.3.1** | Multi-Site Research Capability | Core | B0 | B | 5 | 9 |
| **D.3.2** | Commercial Access Framework | Enh | O | B | 5 | 6,7 |
| **D.4.1** | Trial Data & Recruitment | Enh | C4 | B | 4 | 2 |
| **E.1.1** | Public Register of Data Uses | Core | B0 | B | 5 | 10 |
| **E.1.2** | Annual Transparency Reporting | Core | B0 | B | 5 | 10 |
| **E.2.1** | Lay Involvement in Governance | Core | B0 | B | 5 | 1 |
| **E.2.2** | Public Engagement Capacity | Enh | O | B | 5 | 1 |
| **E.3.1** | Opt-Out Management | Core | B0 | S | 1,5 | 1,3 |
| **E.3.2** | Public Benefit & Value | Core | B0 | B | All | 1,6 |
| **E.3.3** | Legitimacy, Assurance & Learning | Core | B0 | B | All | 1,10 |
| **F.1.1** | Funding Horizon | Core | B0 | B | All | \- |
| **F.1.2** | Financial Risk Management | Enh | O | B | All | \- |
| **F.2.1** | Cost Recovery & Pricing | Core | B0 | B | 5 | 7 |
| **F.2.2** | Commercial Revenue & Partnerships | Enh | O | B | 5 | 7 |
| **F.3.1** | Economic Impact Assessment | Enh | Y | B | All | \- |
| **F.3.2** | Value Demonstration | Enh | Y | B | All | 10 |
| **G.1.1** | Staff Capacity | Core | B0 | B | All | \- |
| **G.1.2** | Staff Retention & Development | Enh | O | B | All | \- |
| **G.1.3** | Strategic Workforce Planning | Enh | O | B | All | \- |
| **G.2.1** | Role Definition & Professionalization | Core | B0 | B | All | \- |
| **G.2.2** | Technical Skills | Core | B0 | B | All | \- |
| **G.3.1** | Service Orientation | Core | B0 | V | 5 | 8 |
| **G.3.2** | Collaboration & Knowledge Sharing | Enh | O | B | All | 9 |
| **H.1.1** | SDE Architecture & Standards | Core | B0 | V | 5 | 3 |
| **H.1.2** | User Environment & Experience | Core | B0 | V | 5 | 8 |
| **H.2.1** | Compute Scalability | Core | B0 | V | 3,5 | 3 |
| **H.2.2** | Storage & Data Management | Enh | O | V | 5 | 3 |
| **H.3.1** | Security Certification & Audit | Core | B0 | V | 5 | 3 |
| **H.3.2** | Security Operations | Core | B0 | V | 5 | 3 |
| **H.3.3** | Privacy-Enhancing Technologies | Enh | O | V | 5 | 3 |
| **H.4.1** | ML/AI Platform Capability | Enh | O | V | 3,4 | 11 |
| **H.4.2** | Responsible AI Practices | Core | C3/4 | V | 3,4 | 11 |

# 6. Indicator catalogue

This section presents all 64 indicators. Each entry shows the full L1–L5 maturity descriptors and the minimum evidence expected to claim Level 3 (Defined), Level 4 (Managed) or Level 5 (Optimising). Evidence requirements apply to readiness scoring; Outcome/Context (Y) indicators are reported for quality but do not affect scoring.

## Domain A: Data Coverage & Federation

Assesses availability, linkage, and flow of health data. Core indicators include dataset availability, data currency, equity, patient-identifier infrastructure, linkage services, UK Gateway connectivity, and federation operating model and assurance. Enhancement indicators cover federated query capability and multi-modal data access. Maturity levels describe progression from no systematic data inventories to comprehensive, automated, and UK-wide integrated data flows.

### A.1.1 Core Dataset Availability

Core • Class B0 • Unit S • HDRS 1,5 • Alliance 2

**Maturity levels**

| **L1** | No systematic inventory. Data flows ad-hoc. Core datasets (primary care, secondary care, prescribing, mortality) have unknown or highly restricted availability. |
|----|----|
| **L2** | Inventory initiated. Feasibility assessed. Strategy documented. Pilot agreements in discussion. |
| **L3** | Core datasets partially available: secondary care and mortality accessible; primary care \<50% coverage or not refreshed; prescribing not linked. |
| **L4** | Core datasets available with \>= 70% population coverage. Refreshed at least quarterly. Data sharing agreements with major providers. \\Threshold subject to benchmarking\\ |
| **L5** | Core datasets \>= 90% coverage with monthly refresh. Automated flows. Proactive provider engagement. Coverage gaps systematically addressed. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Documented dataset inventory showing which core datasets are available and under what conditions

- Evidence of access for at least some core datasets (agreements/approvals; delivered extracts/workspaces)

**L4 (minimum evidence):**

- Published data inventory/catalogue for core datasets (incl. coverage method)

- Signed data sharing agreements with major providers (or controller decisions) for those datasets

- Coverage and refresh evidence meeting Level 4 threshold (report/dashboard + extract dates)

**L5 (minimum evidence):**

- Automated ingestion/refresh logs showing monthly (or better) updates

- Coverage improvement plan + evidence of actions taken (e.g., onboarding new providers) and resulting change

- Proactive monitoring/reporting demonstrating sustained coverage and refresh performance

### A.1.2 Data Currency & Timeliness

Core • Class B0 • Unit S • HDRS 1,4 • Alliance 2

**Maturity levels**

| **L1** | Currency unknown or variable. Some datasets years out of date. No monitoring. |
|----|----|
| **L2** | Requirements defined. Baseline measured. Targets established but not achieved. |
| **L3** | Core datasets refreshed within 6 months. Latency monitored. Some achieve monthly; others delayed. |
| **L4** | Refreshed quarterly, median latency \<= 120 days. SLAs met \>= 80%. \\Threshold subject to benchmarking\\ |
| **L5** | Median \<= 60-day latency. Near-real-time for priority use cases. SLAs met \>= 95%. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Defined timeliness requirements/targets + baseline measurement

- Refresh/latency evidence for core datasets consistent with Level 3 claim (extract dates; monitoring output)

**L4 (minimum evidence):**

- Latency definition + monitoring dashboard showing quarterly refresh and median latency claim

- SLA/targets for refresh and delivery + evidence of \>=80% compliance

- Exception log showing how delays are detected and addressed

**L5 (minimum evidence):**

- Monitoring dashboard showing median latency \<=60 days (and near-real-time where claimed)

- SLA report showing \>=95% compliance for priority datasets/use cases

- Evidence of continuous improvement (trend over time; change log)

### A.1.3 Data Equity & Representativeness

Core • Class B0 • Unit S • HDRS 1 • Alliance 2

**Maturity levels**

| **L1** | No assessment of coverage by demographic/socioeconomic characteristics. Representativeness unknown. |
|----|----|
| **L2** | Equity dimensions identified (deprivation, ethnicity, geography, age, sex). Baseline assessment initiated. |
| **L3** | Coverage monitored by key dimensions. Known gaps documented. Improvement actions identified but not systematic. |
| **L4** | Routine monitoring by deprivation, ethnicity, geography, protected characteristics. Annual equity reporting. Active programmes to address gaps. |
| **L5** | Comprehensive equity framework with published reports. Demonstrated improvement. Equity embedded in acquisition priorities. Contributing to national guidance. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Baseline representativeness assessment using agreed equity dimensions

- Documented gap register and initial actions (plans, provider engagement)

**L4 (minimum evidence):**

- Equity monitoring report with agreed dimensions (deprivation, ethnicity, geography, protected characteristics)

- Documented gap register + prioritised improvement actions

- Published (or internally approved) annual equity report for data coverage/quality

**L5 (minimum evidence):**

- Published equity framework + repeated reporting over time

- Evidence of measurable improvement in identified gaps (before/after metrics)

- Evidence equity is embedded in acquisition priorities (e.g., business case decisions, procurement criteria)

### A.2.1 Patient Identifier Infrastructure

Core • Class B0 • Unit S • HDRS 1,6 • Alliance 2

**Maturity levels**

| **L1** | No consistent identifier. Probabilistic matching with significant errors. |
|----|----|
| **L2** | National identifier exists but incomplete adoption. Strategy documented. Interim approaches defined. |
| **L3** | Identifier (CHI, NHS number) used in majority of datasets. Deterministic linkage for most core datasets. |
| **L4** | Identifier consistently applied across core datasets. Linkage accuracy \>= 99%. Validation in place. |
| **L5** | Universal identifier across all datasets including cohorts and multi-modal. Externally validated. Supports cross-UK linkage. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Evidence identifier is present in the majority of relevant datasets (audit/sample)

- Linkage validation approach documented with initial results

**L4 (minimum evidence):**

- Documentation showing identifier coverage across core datasets

- Linkage accuracy validation report (method + results) supporting \>=99% claim

- Ongoing control for identifier quality (audit/checks and remediation process)

**L5 (minimum evidence):**

- External/independent validation of linkage accuracy and process (audit or peer review)

- Evidence identifier applies across extended datasets (cohorts/multi-modal where applicable)

- Evidence of cross-UK linkage capability (documented approach + successful linkage case)

### A.2.2 Linkage Services

Core • Class B0 • Unit B • HDRS 1,2,6 • Alliance 2

**Maturity levels**

| **L1** | No dedicated service. Linkage ad-hoc with inconsistent methodology. |
|----|----|
| **L2** | Function identified. Methodology documented. Available for selected projects. |
| **L3** | Operational service. Standard process. Turnaround variable (weeks to months). Limited combinations. |
| **L4** | Routinely available with SLAs. Turnaround \<= 4 weeks. Flexible linkage. Quality metrics reported. |
| **L5** | Turnaround \<= 2 weeks. Automated workflows. Advanced capabilities (fuzzy matching, privacy-preserving). |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Linkage service SOP/process documented and operational for projects

- Evidence of delivered linkages + basic quality reporting (match rate/error rate)

**L4 (minimum evidence):**

- Standard linkage service SOP + published SLA

- Turnaround statistics (median + tail) showing \<=4 weeks for routine requests

- Linkage quality metrics report (match rate, error rate) and QC process

**L5 (minimum evidence):**

- Workflow automation evidence (tooling/pipeline docs) + stats showing \<=2 weeks

- Evidence of advanced methods where used (e.g., privacy-preserving/fuzzy matching) with evaluation

- Independent review or benchmarking of linkage service performance/quality

### A.3.1 Federated Query Capability

Enh • Class O • Unit B • HDRS 5 • Alliance 9

**Maturity levels**

| **L1** | No federated capability. All analysis requires data transfer. |
|----|----|
| **L2** | Concepts understood. Options assessed. Pilot in planning. |
| **L3** | Federated possible for selected datasets. Bespoke setup. Limited tools. |
| **L4** | Routinely supported. Standard APIs. Compatible with DataSHIELD, OHDSI. |
| **L5** | Default for appropriate uses. Rich API ecosystem. Active in UK/international networks. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Pilot or limited operational federated query implementation (architecture/API evidence)

- Evidence of at least one federated use case delivered (project log)

**L4 (minimum evidence):**

- Operational federated query implementation documentation (APIs/standards supported)

- Evidence of routine use (project list/logs) and supported toolchain (e.g., DataSHIELD/OHDSI)

- Service guidance/SOP for researchers and node operators

**L5 (minimum evidence):**

- Policy/architecture showing federated access is default where appropriate

- Participation evidence in federated networks/standards groups + interoperability test results

- Performance and reliability KPIs for federated services (availability, query latency)

### A.3.2 UK Gateway Connectivity

Core • Class B0 • Unit B • HDRS 5 • Alliance 9

**Maturity levels**

| **L1** | No awareness of UK Gateway specs. Architecture does not consider UK-wide interoperability. |
|----|----|
| **L2** | Specs reviewed. Gap analysis completed. Roadmap defined. |
| **L3** | Architecture aligned. Connectivity in development/testing. Manual workarounds required. |
| **L4** | Operational connectivity. Metadata discoverable. Standard requests flow through Gateway. |
| **L5** | Full integration with automated sync. Complex UK-wide queries supported. Contributing to standards. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Gateway connectivity roadmap + technical alignment evidence (architecture mapping)

- Evidence of connectivity in development/testing (test results; manual workarounds documented)

**L4 (minimum evidence):**

- Gateway integration test evidence (metadata discovery + request routing) and operational sign-off

- Operational logs/screenshots showing metadata is discoverable and requests flow via gateway

- SOP for maintaining gateway connectivity (change control + incident handling)

**L5 (minimum evidence):**

- Automated synchronisation evidence (scheduled jobs, APIs) with monitoring/alerts

- Demonstration of complex UK-wide requests/queries supported (test cases)

- Evidence of contribution to gateway standards/spec evolution (change proposals, working group outputs)

### A.3.3 Federation Operating Model & Assurance

Core • Class B0 • Unit B • HDRS 5 • Alliance 9

**Maturity levels**

| **L1** | No federation operating model. Roles and cross-node processes undefined. |
|----|----|
| **L2** | Draft operating model. Limited bilateral agreements; inconsistent use. |
| **L3** | Model used for priority pathways. Issues logged; assurance limited. |
| **L4** | Standard model in routine use. Cross-node SOPs and performance reporting. |
| **L5** | Optimised federation. Joint improvement cycle and independent assurance/benchmarking. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Draft operating model (roles, escalation, change control) with initial adoption evidence

- Evidence of operating model used for at least one cross-node pathway (issues/decisions logged)

**L4 (minimum evidence):**

- Signed federation operating model (roles, RACI, escalation, change control) + SOP set

- Joint governance minutes/decision logs showing routine use

- Cross-node KPIs/service reporting and evidence of interoperability testing

**L5 (minimum evidence):**

- Evidence of joint improvement cycle (backlog, retrospectives, release notes) and tracked KPI improvement

- Independent assurance/assessment of federation operations (audit/peer review)

- Evidence model has been shared/adopted beyond the node (templates, guidance, community contribution)

### A.4.1 Consented Cohort Integration

Enh • Class C2 • Unit S • HDRS 2 • Alliance 2

**Maturity levels**

| **L1** | No systematic linkage to cohorts/biobanks. |
|----|----|
| **L2** | Key cohorts identified. Consent reviewed. Pilot planned. |
| **L3** | Selected cohorts linkable. Bespoke arrangements. Coverage incomplete. |
| **L4** | Major cohorts routinely linkable. Standard processes. Catalogue maintained. |
| **L5** | Comprehensive linkage. Recall-by-genotype. UK-wide cohort integration. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- List of priority cohorts/biobanks and consent/permissions review summary

- Evidence of at least one linkage arrangement delivered or in active operation

**L4 (minimum evidence):**

- Catalogue of linkable cohorts/biobanks + consent/permissions summary

- Standard linkage process + template agreements

- Evidence of routine linkage for major cohorts (delivery logs/metrics)

**L5 (minimum evidence):**

- Evidence of comprehensive linkage coverage across major cohorts/biobanks

- Demonstrated advanced use case (e.g., recall-by-genotype or equivalent) with governance approval

- Evidence of UK-wide cohort integration arrangements (cross-node agreements + delivered project)

### A.4.2 Multi-Modal Data Access

Enh • Class C3 • Unit S • HDRS 3 • Alliance 2

**Maturity levels**

| **L1** | Multi-modal data (imaging, genomics, pathology, clinical letters) not available. |
|----|----|
| **L2** | Strategy defined. Priority types identified. Pilot planned. |
| **L3** | Selected multi-modal available. Coverage incomplete; linkage partial. |
| **L4** | Routine access to \>= 2 types with \>= 25% coverage each. Linked to core datasets. \\Threshold subject to benchmarking\\ |
| **L5** | Comprehensive access: imaging, genomics, pathology, clinical letters. Population-scale. NLP-processed text. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Multi-modal strategy/inventory with at least one modality accessible for research

- Evidence of linkage for at least one modality to core datasets (technical + governance sign-off)

**L4 (minimum evidence):**

- Inventory of multi-modal datasets with coverage estimates for \>=2 modalities

- Evidence of linkage to core datasets (technical + governance sign-off)

- Access process and documentation (data dictionaries, quality notes) for those modalities

**L5 (minimum evidence):**

- Evidence of population-scale multi-modal availability (coverage/refresh metrics per modality)

- Evidence of advanced handling where relevant (e.g., NLP-processed text pipeline + QC)

- Demonstration of routine multi-modal research delivery (project examples, throughput metrics)

## Domain B: Data Semantics & Quality

Assesses standardisation, documentation, and quality assurance. Core indicators include adoption of common data models, terminology standards, quality frameworks, and metadata documentation. Enhancement indicators cover curated datasets and phenotype libraries. Levels range from no standards or documentation to comprehensive, externally validated, and internationally contributing data ecosystems.

### B.1.1 Common Data Model Adoption

Core • Class C1 • Unit B • HDRS 1,5 • Alliance 4

**Maturity levels**

| **L1** | No CDM. Data in source formats with bespoke schemas. |
|----|----|
| **L2** | CDM (OMOP, Sentinel, PCORnet, or equivalent) evaluated. Mapping assessed. Pilot planned. |
| **L3** | Core datasets partially mapped. Coverage \<50%. CDM available but not routine. |
| **L4** | Core datasets mapped to recognised CDM with \>= 60% coverage. CDM maintained and refreshed. Standard tools operational. \\Threshold subject to benchmarking\\ |
| **L5** | Comprehensive CDM. Externally validated. Contributing to international networks. CDM-native services. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- CDM selection and mapping approach documented (ETL plan, data model choice)

- Evidence of partial mapping and use on core datasets (tables, coverage metrics, pilot analyses)

**L4 (minimum evidence):**

- Mapping/ETL documentation + evidence \>=60% coverage for core datasets (counts/metrics)

- Operational CDM environment (repository, pipelines, refresh schedule) and maintained mappings

- Evidence standard tools are available and used (e.g., OHDSI stack)

**L5 (minimum evidence):**

- External validation/quality review of CDM mappings (peer review, audit, network validation)

- Evidence CDM is comprehensive and routinely refreshed (change logs, release notes)

- Evidence of contribution/participation in relevant networks (methods/tools shared, study participation)

### B.1.2 Terminology Standards

Core • Class C1 • Unit B • HDRS 1 • Alliance 4

**Maturity levels**

| **L1** | No consistent standards. Codes as recorded (mixture of Read, ICD-10, OPCS, local). |
|----|----|
| **L2** | Strategy defined. Target standards identified. Baseline assessed. |
| **L3** | Primary standards adopted (SNOMED CT, dm+d for new systems). Legacy retains original. Partial mapping. |
| **L4** | SNOMED CT, dm+d, ICD-10/OPCS consistently applied. Terminology services operational. Limitations documented. |
| **L5** | Full SNOMED CT with semantic interoperability. Advanced services. Contributing to standards. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Terminology standards strategy documented + mapping plan

- Evidence of partial adoption/mapping on at least one major dataset/system

**L4 (minimum evidence):**

- Evidence terminology standards are consistently applied (samples/audits across datasets)

- Operational terminology service or controlled mapping process + documented limitations

- Governance artefact for terminology updates/versioning

**L5 (minimum evidence):**

- Evidence of semantic interoperability at scale (cross-system mapping quality, reduced local code use)

- Advanced terminology services (e.g., value set management) with usage metrics

- Contribution to national/international terminology work (submissions, participation)

### B.2.1 Quality Framework & Monitoring

Core • Class B0 • Unit B • HDRS 1 • Alliance 4

**Maturity levels**

| **L1** | No framework. Issues ad-hoc. No monitoring. |
|----|----|
| **L2** | Framework defined. Dimensions identified. Baseline initiated. |
| **L3** | Metrics for core datasets. Annual reporting. Issues documented. Improvement underway. |
| **L4** | Comprehensive monitoring with automated checks. Metrics published. SLAs defined. Root cause analysis. |
| **L5** | Real-time monitoring. Benchmarked nationally/internationally. Certification or audit. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Quality framework documented with defined dimensions and responsibilities

- Evidence of quality metrics produced for core datasets and issues tracked

**L4 (minimum evidence):**

- Documented quality framework with automated checks + coverage across core datasets

- Published/internal quality dashboard with metrics and thresholds

- Evidence of root-cause analysis process and tracked remediation actions

**L5 (minimum evidence):**

- Evidence of near-real-time or high-frequency monitoring for priority datasets

- Benchmarking against external comparators (UK/international) or certification/audit

- Evidence of continuous quality improvement (trend improvement over time)

### B.2.2 Data Documentation & Metadata

Core • Class B0 • Unit B • HDRS 5 • Alliance 4

**Maturity levels**

| **L1** | Minimal documentation. Tacit knowledge. No catalogue. |
|----|----|
| **L2** | Initiative underway. Basic documentation. Catalogue developing. |
| **L3** | Structured metadata for core datasets. Variable quality. |
| **L4** | Comprehensive, standardised metadata. Machine-readable. Searchable catalogue integrated with access. Regular updates. |
| **L5** | Rich ecosystem with automated generation. Provenance and lineage tracking. Community contributions. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Structured metadata exists for core datasets (data dictionary/metadata template) with variable completeness

- Catalogue or register exists (even if partial) and is used for discovery

**L4 (minimum evidence):**

- Standardised, machine-readable metadata for core datasets (schema, example records)

- Searchable catalogue integrated with access workflow (screenshots/URL + process)

- Evidence of regular metadata updates (change log, release cadence)

**L5 (minimum evidence):**

- Automated metadata generation or validation pipeline (tooling evidence)

- Lineage/provenance documentation (data flows, transformations) with traceability

- Evidence of community contribution mechanism (issues/PRs, feedback loops)

### B.3.1 Curated Dataset Availability

Enh • Class O • Unit B • HDRS 1,2 • Alliance 4

**Maturity levels**

| **L1** | No curated datasets. Raw extracts requiring extensive cleaning. |
|----|----|
| **L2** | Needs assessed. Priority datasets identified. Pilot underway. |
| **L3** | Selected curated datasets. Methodology documented but not standardised. |
| **L4** | Portfolio with standard methodology. Derived variables, phenotypes, linked data. Version control. |
| **L5** | Comprehensive library. Community contributions. Automated pipelines. Benchmarked. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Pilot curated datasets produced with documented methodology

- Evidence curated outputs used in at least one project and are versioned at least minimally

**L4 (minimum evidence):**

- Curated dataset portfolio list + published methodology/SOP

- Version control evidence for curated products (release notes, tags)

- Evidence curated datasets are routinely used (project examples/usage stats)

**L5 (minimum evidence):**

- Evidence of comprehensive curated library with automated pipelines

- Community contribution process with governance (requests, approvals, updates)

- Benchmarking or external validation of curated products (comparisons, audits)

### B.3.2 Phenotype Library & Validation

Enh • Class O • Unit B • HDRS 1 • Alliance 4,9

**Maturity levels**

| **L1** | No library. Researchers define from scratch. |
|----|----|
| **L2** | Concept established. Initial phenotypes documented. No validation. |
| **L3** | Growing library. Selected phenotypes validated. Searchable but not integrated. |
| **L4** | Comprehensive with validated definitions. Standardised validation. Integrated with access. Version control. |
| **L5** | Internationally validated. Cross-references HDR UK/OHDSI. Phenotype-as-code. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Initial phenotype library exists (definitions stored and discoverable)

- Evidence of validation for selected phenotypes or documented validation plan

**L4 (minimum evidence):**

- Phenotype library with validated definitions and versioning (repository + governance)

- Standard validation protocol + evidence of completed validations

- Integration evidence (library searchable and usable within analysis environments)

**L5 (minimum evidence):**

- International validation/crosswalk evidence (e.g., OHDSI/HDR UK alignment) where relevant

- Phenotype-as-code implementation (tests, CI, reproducible packages)

- Evidence of sharing/contribution beyond the organisation (public repos, publications)

## Domain C: Governance & Access

Covers legal, regulatory, and procedural frameworks. Core indicators address legal basis for processing, time-to-data, data access committees, ethics-pathway integration, mutual recognition, statistical disclosure control, researcher accreditation, and consent/permissions governance. Enhancement indicators include legislative environment and cross-border legal alignment. Maturity ranges from unclear legal bases and ad-hoc access to robust, UK-wide interoperable, and streamlined governance processes.

### C.1.1 Legal Basis for Processing

Core • Class B0 • Unit S • HDRS 5 • Alliance 3,5

**Maturity levels**

| **L1** | Legal basis unclear. Reliance on consent for all research. No systematic review. |
|----|----|
| **L2** | Framework developing. Review initiated. GDPR options assessed. |
| **L3** | Primary basis established. Controller/processor defined. Review process exists. Some ambiguity. |
| **L4** | Comprehensive basis. Clear documentation per dataset. Agreements in place. Timely guidance. |
| **L5** | Robust framework. Proactive horizon scanning. Contributing to national guidance. UK-wide and international support. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Documented legal basis and roles for key datasets (controller/processor clarity)

- Evidence legal review process exists and is used (DPIA/TRA, sign-off records)

**L4 (minimum evidence):**

- Per-dataset legal basis documentation (lawful basis, purposes, roles) with sign-off

- Template agreements (DAA/DSA, controller/processor arrangements) in routine use

- DPIA/TRA artefacts and governance process evidence (review cycle, updates)

**L5 (minimum evidence):**

- Horizon scanning/legal review process evidence (register + update cadence)

- Evidence of contribution to national/UK-wide guidance or shared legal patterns

- Evidence framework supports UK-wide operation (cross-node legal arrangements, resolved issues)

### C.1.2 Legislative Environment

Enh • Class O • Unit S • HDRS 5 • Alliance 3

**Maturity levels**

| **L1** | Significant barriers. Key statutes block secondary use. No reform pathway. |
|----|----|
| **L2** | Barriers identified. Policy engagement initiated. Interim approaches defined. |
| **L3** | Permits research under conditions. Constraints remain. Active in legislative review. |
| **L4** | Enabling environment with safeguards. Clear pathway. Compatible with UK-wide operation. |
| **L5** | Actively enables research. Legislation updated. Supports innovation within ethics. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Assessment of legal/legislative constraints with documented workarounds

- Evidence of active engagement in policy/legislative review processes

**L4 (minimum evidence):**

- Documented assessment of legislative barriers/enablers + mitigation pathway

- Evidence of enabling safeguards and clear pathway for secondary use

- Demonstrated compatibility with UK-wide operation (policy/guidance mapping)

**L5 (minimum evidence):**

- Evidence of updated/modernised legislation or formal policy instruments enabling research

- Evaluation evidence showing reduced barriers while maintaining safeguards

- Evidence of leadership in policy shaping (consultations, published positions)

### C.2.1 Time-to-Data

Core • Class B0 • Unit B • HDRS 5 • Alliance 8

**Maturity levels**

| **L1** | No standard process. Case-by-case. \>12 months where successful. |
|----|----|
| **L2** | Central function exists. Documentation drafted. Median 6-12 months. |
| **L3** | Operational process. Single application. Median 3-6 months. SLAs defined but not consistent. |
| **L4** | Single-gateway. Median \<90 days. SLAs met \>= 80%. Applicant support. \\Threshold subject to benchmarking\\ |
| **L5** | Median \<45 days. Tiered/fast-track approvals. Automated workflows. Top-quartile UK. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Operational access workflow with a single application route (process map + artefacts)

- Time-to-data measurement evidence supporting Level 3 claim (median 3--6 months; SLA defined)

**L4 (minimum evidence):**

- End-to-end process map + SOP defining start/stop points for the clock

- Time-to-data distribution (median + 90th percentile) showing Level 4 claim

- SLA compliance report showing \>=80% plus evidence of applicant support workflow

**L5 (minimum evidence):**

- Time-to-data distribution showing median \<45 days + tiered/fast-track pathway evidence

- Automation evidence (workflow tooling, integration) reducing manual steps

- Benchmarking evidence (UK comparative position) or independent review

### C.2.2 Data Access Committee

Core • Class B0 • Unit B • HDRS 5 • Alliance 1,5

**Maturity levels**

| **L1** | No formal DAC. Ad-hoc decisions. No criteria. No public benefit assessment. |
|----|----|
| **L2** | DAC established/forming. Terms defined. Public benefit criteria developing. Infrequent meetings. |
| **L3** | Operational DAC meeting monthly. Published criteria including NDG public benefit. Decisions documented. Lay members initiated. |
| **L4** | Efficient with clear criteria. Public benefit per NDG for every decision. Lay \>= 25% with voting. Decisions within 2 weeks. |
| **L5** | Streamlined with risk-proportionate pathways. Public benefit methodology shared. Appeal process. Lay co-governance. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- DAC operating with published criteria and decision logging (minutes/records)

- Evidence of regular meetings and decisions (e.g., monthly cadence)

**L4 (minimum evidence):**

- DAC terms of reference + membership list (incl. lay representation) and decision criteria

- Sample minutes/decision logs (redacted) showing timely decisions (\<=2 weeks) and NDG public benefit use

- Published guidance for applicants and audit trail of decisions

**L5 (minimum evidence):**

- Evidence of risk-proportionate pathways (tiering rules + examples)

- Appeals process evidence + outcomes

- Evidence DAC criteria/method is shared or adopted more widely (templates, training)

### C.2.3 Ethics Pathway Integration & Proportionality

Core • Class B0 • Unit B • HDRS 5 • Alliance 5

**Maturity levels**

| **L1** | Ethics pathway unclear or duplicative. Handled ad-hoc. |
|----|----|
| **L2** | Pathway mapped and documented. Proportionality intent stated. |
| **L3** | Standard ethics triage for common studies. Variable duplication remains. |
| **L4** | Integrated, risk-proportionate pathway. Tiered routes and SLAs tracked. |
| **L5** | Optimised pathway. Reuse/mutual recognition where lawful; learning loop and benchmarking. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Ethics triage guidance available for common study types (process doc)

- Evidence of at least some approval reuse/portability or reduced duplication (cases)

**L4 (minimum evidence):**

- Documented ethics pathway integrated with access (triage rules + decision rights)

- SLA/turnaround reporting for ethics steps (where applicable)

- Evidence of templates/support for multi-site studies (guidance, examples)

**L5 (minimum evidence):**

- Evidence of approval reuse/mutual recognition where lawful (agreements + cases)

- Metrics showing reduced duplication (trend over time) and documented learning loop

- Contribution to sector guidance or external review endorsing the pathway

### C.3.1 Mutual Recognition & Standards

Core • Class B0 • Unit B • HDRS 5 • Alliance 8

**Maturity levels**

| **L1** | No UK-wide engagement. Organisation-specific agreements. |
|----|----|
| **L2** | Standards reviewed. Gap analysis. Participation initiated. |
| **L3** | Partial adoption (Alliance DAA). Mutual recognition of some approvals. Additional steps for UK-wide. |
| **L4** | Full adoption of UK-standard DAA. Mutual accreditation recognition. Single approval for UK-wide. Participating in governance. |
| **L5** | Leading contributor. Full interoperability. Supporting others. Contributing to Alliance standards. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Evidence of partial adoption of UK standards (e.g., Alliance DAA) and engagement

- Evidence of mutual recognition for at least some approvals or accreditations (cases)

**L4 (minimum evidence):**

- Evidence of adoption of UK-standard DAA (or equivalent) and mutual recognition arrangements

- Evidence single approval works in practice (case studies + reduced duplicative steps)

- Participation evidence in UK governance/standards bodies (minutes/roles)

**L5 (minimum evidence):**

- Evidence of leadership contributions (standards proposals, tooling, guidance)

- Interoperability evidence across nodes (tests, joint exercises)

- Support evidence provided to other nodes (mentoring, implementation packs)

### C.3.2 Cross-Border Legal Alignment

Enh • Class O • Unit S • HDRS 5,6 • Alliance 9

**Maturity levels**

| **L1** | No consideration of cross-border issues. |
|----|----|
| **L2** | Issues identified (NI-Ireland, Scotland common law). Initial assessment. |
| **L3** | Complexities documented with workarounds. Some friction. |
| **L4** | Arrangements address cross-border. Controller agreements enable UK-wide. Manageable overhead. |
| **L5** | Framework designed for UK-wide. Proactive resolution. International arrangements where relevant. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Documented cross-border legal issues and practical workarounds

- Evidence of at least one cross-border case managed/delivered

**L4 (minimum evidence):**

- Documented cross-border legal arrangements enabling data flow/linkage

- Controller agreements and DPIA/TRA addressing cross-border issues

- Case example showing cross-border project delivered with manageable overhead

**L5 (minimum evidence):**

- Proactive framework design evidence (policy/agreements anticipating cross-border needs)

- Evidence of resolving cross-border friction (issue log + fixes)

- International arrangements evidence where relevant

### C.3.3 Cross-sector Data Sharing & Linkage Governance

Core • Class C6 • Unit S • HDRS 6 • Alliance 8,9

**Maturity levels**

| **L1** | No cross-sector pathway. Roles, decision rights and feasibility unclear. |
|----|----|
| **L2** | Priority sectors identified. Draft principles/templates; DPIA/TRA approach emerging. |
| **L3** | Governance operational for \>=1 sector. Templates in use; pilot linkage delivered. |
| **L4** | Repeatable pathway for multiple sectors. Defined accountabilities; performance tracked. |
| **L5** | Scaled and assured cross-sector linkage. Quality/bias monitored; good practice shared. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Identified priority partner sector(s) and documented principles/roles (controllers/processors)

- Evidence of at least one cross-sector linkage/data sharing project delivered (case)

**L4 (minimum evidence):**

- Named partner sectors + documented controller/processor roles and decision rights

- Template agreements and DPIA/TRA approach (reusable where appropriate)

- Delivery evidence for cross-sector linkage across multiple sectors + cycle-time metrics

**L5 (minimum evidence):**

- Breadth/maintenance evidence (published approach; refreshed partner list)

- Linkage quality/bias monitoring evidence (metrics + improvement actions)

- Independent assurance and evidence of sharing templates/good practice cross-UK

### C.4.1 Statistical Disclosure Control

Core • Class B0 • Unit V • HDRS 5 • Alliance 3,5

**Maturity levels**

| **L1** | No systematic control. Outputs released without review. |
|----|----|
| **L2** | Policy drafted. Training identified. Manual checking for some. |
| **L3** | Policy operational. Trained checkers. Manual review. Some delays. |
| **L4** | Systematic with guidelines. Trained team with capacity. SLA met. Semi-automated tools. |
| **L5** | Advanced with automated tools. Risk-based. Contributing to standards. Rarely delays. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- SDC policy operational with trained reviewers

- Evidence of disclosure review decisions logged (audit trail)

**L4 (minimum evidence):**

- SDC policy and guidelines + trained checker list

- SLA/performance evidence for disclosure review (turnaround, backlog)

- Evidence of semi-automated tooling use and documented decisions/audit trail

**L5 (minimum evidence):**

- Automated or advanced tooling evidence (risk-based rules, tool validation)

- Evidence of contributing to SDC standards/guidance (methods shared)

- Performance evidence showing minimal delays without compromising safety

### C.4.2 Researcher Accreditation

Core • Class B0 • Unit B • HDRS 5 • Alliance 5

**Maturity levels**

| **L1** | No requirements. Access without competency demonstration. |
|----|----|
| **L2** | Requirements defined. Curriculum developing. Enforcement not systematic. |
| **L3** | Accreditation required. Training available. Status tracked. Some legacy gaps. |
| **L4** | Comprehensive with mandatory training, renewal, enforcement. Aligned with ONS RAS. Integrated. |
| **L5** | Advanced pathway. Tiered accreditation. Contributing to UK standards. Mentorship. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Accreditation requirement in place with training offer

- Evidence accreditation status is tracked and used in access decisions

**L4 (minimum evidence):**

- Accreditation/training requirements policy + renewal rules

- Tracking system evidence (who is accredited, expiry, enforcement)

- Alignment evidence with ONS RAS (or equivalent) and integration with access workflow

**L5 (minimum evidence):**

- Tiered accreditation pathway evidence + mentoring/support arrangements

- Contribution to UK-wide accreditation standards (materials, working groups)

- Evaluation evidence of improved compliance/quality (audit findings, incidents reduced)

### C.4.3 Consent, Permissions & Restrictions Governance

Core • Class B0 • Unit B • HDRS 2,5 • Alliance 3,5

**Maturity levels**

| **L1** | Permissions/restrictions not captured. Applied inconsistently or discovered late. |
|----|----|
| **L2** | Inventory initiated. Key restrictions documented; enforcement mainly manual. |
| **L3** | Most restrictions documented and used in decisions. Manual checks common. |
| **L4** | Restrictions captured and enforced end-to-end. Audit trail and change control in place. |
| **L5** | Automated policy enforcement. Routine audits; scalable reuse (e.g., standard models where applicable). |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Permissions/restrictions documented for most datasets and used in decisions

- Evidence of manual compliance checks and handling of edge cases (logs)

**L4 (minimum evidence):**

- Permissions/restrictions inventory linked to datasets/cohorts + governance sign-off

- End-to-end enforcement evidence (triage rules, provisioning controls, access controls)

- Audit trail + change control evidence for restriction updates

**L5 (minimum evidence):**

- Automated policy enforcement evidence (rules engine, attribute-based controls, etc.)

- Routine audit evidence (internal/external) covering compliance with permissions

- Evidence of scalable reuse patterns shared (standard models, templates; dynamic consent where applicable)

## Domain D: Research Integration & Market Use

Evaluates integration with research communities and multi-sector use. Core indicators assess active user base, research output, researcher support, reproducibility support, and multi-site capability. Enhancement indicators focus on training, commercial access frameworks, and trial support. Levels progress from minimal activity and no support to large, diverse user communities with comprehensive services and international leadership.

### D.1.1 Active User Base

Core • Class Y • Unit B • HDRS 5 • Alliance 6

**Maturity levels**

| **L1** | Minimal activity. \<10 projects. Internal researchers only. |
|----|----|
| **L2** | Growing with 10-30 projects. External engaging. Pipeline developing. |
| **L3** | Established with 30-75 projects. Mix of academic, NHS, commercial. Growing. |
| **L4** | Substantial \>= 75 projects (or \>= 15/million pop). Diverse community. Demand exceeds supply. |
| **L5** | Large \>= 150 projects. International. High retention. Community promoting. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Project register demonstrating Level 3 activity level and mix (definition stated)

- Evidence of repeat use or sustained demand (pipeline metrics)

**L4 (minimum evidence):**

- Project register showing counts and segmentation (last 12 months definition)

- Evidence of active external user engagement (applications, onboarded users)

- Demand/throughput metrics (requests received vs provisioned)

**L5 (minimum evidence):**

- Retention/returning user metrics and pipeline evidence

- Evidence of international engagement/collaboration where claimed

- Independent validation or benchmarking of user base/activity (optional)

### D.1.2 Research Output & Impact

Core • Class Y • Unit B • HDRS All • Alliance 10

**Maturity levels**

| **L1** | No tracking. Publications and impacts unknown. |
|----|----|
| **L2** | Tracking initiated. Reporting requirement. Baseline identified. |
| **L3** | Regular tracking with annual reporting. Publications cited. Selected case studies. |
| **L4** | Comprehensive tracking. \>= 30 publications/year (or \>= 6/million pop). Health service impact. Policy influence. |
| **L5** | Leadership with high-impact publications. Influencing practice/policy. Economic impact quantified. International recognition. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Annual publication/output tracking linked to datasets/services

- Initial impact case studies or policy/service influence examples

**L4 (minimum evidence):**

- Publication/output register linked to projects with annual reporting

- Impact case studies (service/policy) with traceable evidence

- Bibliometrics/altmetrics dashboard or report

**L5 (minimum evidence):**

- Evidence of high-impact outputs (citation metrics, journal quality) and translation to practice

- Economic/health impact quantification where available (methods + results)

- External recognition evidence (awards, invitations, international leadership)

### D.2.1 Researcher Support & Helpdesk

Core • Class B0 • Unit V • HDRS 5 • Alliance 8

**Maturity levels**

| **L1** | No dedicated support. Researchers navigate independently. |
|----|----|
| **L2** | Function identified. Basic documentation/FAQs. Variable response. |
| **L3** | Dedicated helpdesk. Targets defined. Application and basic technical support. |
| **L4** | Comprehensive: pre-submission, guidance, technical, analytical. SLAs (2-day response). Satisfaction surveyed. |
| **L5** | Exemplary with proactive outreach. Account management. \>= 80% satisfaction. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Dedicated support function with targets defined (SOP + staffing)

- Ticketing/helpdesk evidence showing response and resolution activity

**L4 (minimum evidence):**

- Helpdesk SOP + ticketing system export showing SLA performance and volumes

- Published support offer (pre-submission + technical/analytical) and staffing evidence

- User satisfaction survey results and improvement actions

**L5 (minimum evidence):**

- Proactive engagement/account management evidence (plans + activity logs)

- Sustained high satisfaction (\>=80%) with methodology and response rate documented

- Evidence of service improvements driven by user insight (release notes, backlog)

### D.2.2 Training & Capability Building

Enh • Class O • Unit V • HDRS 5 • Alliance 9

**Maturity levels**

| **L1** | No provision. Researchers expected to have skills. |
|----|----|
| **L2** | Needs identified. Ad-hoc training. Strategy developing. |
| **L3** | Regular programme. Moderate uptake. |
| **L4** | Comprehensive with multiple levels. Regular schedule. Linked to accreditation. |
| **L5** | Extensive ecosystem. Co-developed. NHS analyst capacity building. Shared UK-wide. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Regular training programme delivered with attendance records

- Feedback/evaluation evidence and iteration over time

**L4 (minimum evidence):**

- Training curriculum + schedule + attendance records

- Evaluation evidence (feedback scores; learning outcomes where measured)

- Evidence of linkage to accreditation or capability plans

**L5 (minimum evidence):**

- Co-developed programme evidence (partners, PPIE involvement where relevant)

- Evidence of wide reach (NHS analyst capacity building) and reuse by others

- Materials shared (open resources) and evidence of continuous improvement

### D.2.3 Reproducibility & Analytic Provenance Support

Core • Class B0 • Unit V • HDRS All • Alliance 10

**Maturity levels**

| **L1** | No reproducibility support. Code/data/environments not versioned. |
|----|----|
| **L2** | Basic expectations documented. Tooling limited; relies on individuals. |
| **L3** | Standard tools available. Partial provenance; inconsistent adoption. |
| **L4** | Reproducibility-by-design. Versioned data/environments and provenance capture supported. |
| **L5** | Automated provenance and reusable pipelines. Routine reproducibility audit and sharing. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Standard reproducibility tooling available (e.g., version control, notebooks) and guidance

- Evidence of partial adoption (some projects use versioning/provenance)

**L4 (minimum evidence):**

- Project template standards + guidance for reproducible analysis

- Evidence of versioned datasets and environments (release tags, snapshots, package locks)

- Provenance/audit logging evidence (who ran what, when, with which data/version)

**L5 (minimum evidence):**

- Automated provenance capture and containerised or equivalent reproducible environments

- Reusable pipelines/workflows (CI/CD, tests) with examples

- Evidence of reproducibility checks/audits and sharing tooling/practice beyond the service

### D.3.1 Multi-Site Research Capability

Core • Class B0 • Unit B • HDRS 5 • Alliance 9

**Maturity levels**

| **L1** | No multi-site. Cannot combine with other UK nodes. |
|----|----|
| **L2** | Requirements understood. Barriers identified. Pilot planned. |
| **L3** | Possible with bespoke arrangements. \>= 2 projects delivered. Effortful. |
| **L4** | Routine capability. Standard processes. Participating in federated networks. |
| **L5** | Leading capability. Proactively supporting UK-wide. Advanced federated. International. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Evidence of at least two multi-site projects delivered (cases)

- Documented multi-site process and agreements (even if bespoke)

**L4 (minimum evidence):**

- Standard multi-site/federated process documentation + template agreements

- Evidence of routine delivery (projects, networks participated in)

- Interoperability testing evidence (data model alignment, gateway/federation tests)

**L5 (minimum evidence):**

- Evidence of leadership role in UK-wide multi-site delivery (host/coordinate)

- Advanced federation capability evidence (scale, performance) and international links

- Evidence of supporting other nodes (implementation packs, mentoring)

### D.3.2 Commercial Access Framework

Enh • Class O • Unit B • HDRS 5 • Alliance 6,7

**Maturity levels**

| **L1** | No framework. Commercial access unclear. No IP policy. |
|----|----|
| **L2** | Policy developing. Pricing discussed. IP under review. Pilots exploring. |
| **L3** | Access permitted under conditions. Pricing exists. IP policy drafted. |
| **L4** | Clear framework with published pricing/terms. IP aligned with Fair Value principles. Revenue contributing. |
| **L5** | Mature offering. Competitive. Comprehensive IP. Diverse partnership models. Good practice. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Commercial access permitted under defined conditions (policy) and pricing exists

- Evidence of at least one commercial project delivered with documented terms

**L4 (minimum evidence):**

- Published commercial terms/pricing and IP policy aligned to Fair Value principles

- Governance evidence showing non-preferential access decisions and transparency

- Revenue/usage reporting and reinvestment approach (where applicable)

**L5 (minimum evidence):**

- Mature partnership models evidence (multiple routes, templates, case studies)

- Evidence of competitiveness and operational efficiency (cycle times, repeat customers)

- External assurance/independent review of commercial framework fairness (optional)

### D.4.1 Trial Data & Recruitment

Enh • Class C4 • Unit B • HDRS 4 • Alliance 2

**Maturity levels**

| **L1** | No integration. Trial data flows separate. |
|----|----|
| **L2** | Opportunities identified. Trials unit discussions. Feasibility assessed. |
| **L3** | Selected services (feasibility, site identification). Some trial data flows. |
| **L4** | Routine services. Follow-up linkable. IRAS/REC integration. |
| **L5** | Comprehensive integration. Real-time recruitment. Contributing to UK trial acceleration. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Selected trial support services delivered (feasibility/site identification) with examples

- Trial-related data linkage possible for some studies (case evidence)

**L4 (minimum evidence):**

- Documented trial support offer integrated with access (feasibility, recruitment, follow-up linkage)

- Evidence of IRAS/REC alignment where applicable (process map + cases)

- Performance evidence (cycle times, number of supported studies)

**L5 (minimum evidence):**

- Evidence of real-time or near-real-time recruitment/feasibility support for priority pathways

- Demonstrated impact on trial delivery (metrics, case studies)

- Contribution to UK trial acceleration capability (shared methods, partnerships)

## Domain E: Public Trust & Transparency

Assesses engagement, transparency, and social licence. Core indicators include public registers of data uses, annual transparency reporting, lay involvement in governance, opt-out management, public benefit demonstration, and legitimacy/assurance mechanisms. Enhancement indicator covers public engagement capacity. Maturity advances from no transparency or involvement to exemplary, co-developed, and independently assured practices.

### E.1.1 Public Register of Data Uses

Core • Class B0 • Unit B • HDRS 5 • Alliance 10

**Maturity levels**

| **L1** | No register. Approved uses not disclosed. |
|----|----|
| **L2** | Register developing. Content/format defined. Alliance standard reviewed. |
| **L3** | Operational with basic info. Updates may be delayed. Partially aligned. |
| **L4** | Comprehensive meeting Alliance standard. Updated within 30 days. Searchable, promoted. |
| **L5** | Exemplary with outcomes. Public feedback. Aligned with HRA Make it Public. Good practice. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Operational register exists with basic fields and some delay tolerance

- Evidence approved uses are consistently entered (sample audit)

**L4 (minimum evidence):**

- Public data use register URL meeting required fields (Alliance standard mapping)

- Update log or evidence register is updated within 30 days (samples)

- Governance evidence linking approvals to register entries (audit trail)

**L5 (minimum evidence):**

- Register includes outcomes/benefits and is actively promoted (usage analytics)

- Mechanism for public feedback and evidence it is acted on

- Independent review/assurance of register completeness/quality (optional)

### E.1.2 Annual Transparency Reporting

Core • Class B0 • Unit B • HDRS 5 • Alliance 10

**Maturity levels**

| **L1** | No annual reporting. No public accountability. |
|----|----|
| **L2** | Report developing. Framework defined. |
| **L3** | Basic report (projects, releases, users). Published. |
| **L4** | Comprehensive: approvals, rejections, access times, satisfaction, outputs, incidents, plans. Within 3 months. |
| **L5** | Best-practice with independent assurance. Co-developed with public. Influences improvement. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Published basic annual report (projects, releases, users) with date-stamp

- Evidence reporting process exists and is repeated annually

**L4 (minimum evidence):**

- Published annual transparency report within 3 months (date-stamped)

- Report includes required operational metrics (approvals/rejections, access times, incidents, plans)

- Evidence report informs improvement actions (tracked action log)

**L5 (minimum evidence):**

- Independent assurance statement or audit of the report

- Evidence of co-development with public/lay partners (process and outputs)

- Year-on-year trend reporting demonstrating learning and improvement

### E.2.1 Lay Involvement in Governance

Core • Class B0 • Unit B • HDRS 5 • Alliance 1

**Maturity levels**

| **L1** | No lay involvement. Decisions without public input. |
|----|----|
| **L2** | Approach defined. Recruitment initiated. NIHR standards reviewed. |
| **L3** | Lay members appointed. Limited influence. Perspective sought but not embedded. |
| **L4** | Meaningful: \>= 25% lay DAC. Voting rights. Support, remuneration per NIHR. Demonstrably influences. |
| **L5** | Exemplary in strategic and operational. Lay co-chairs. Diverse. Contributing to engagement. PEDRI aligned. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Lay members appointed to governance with defined roles

- Evidence lay input is sought and recorded (minutes/feedback)

**L4 (minimum evidence):**

- Lay membership evidence (\>=25% where claimed) with role descriptions and voting rights

- Support/remuneration evidence consistent with NIHR standards

- Minutes/examples showing lay input influenced decisions

**L5 (minimum evidence):**

- Lay co-governance evidence (co-chairs/strategic roles) and diversity monitoring

- Evaluation evidence of PPIE effectiveness and improvements made

- Contribution to wider PPIE practice (shared methods, networks)

### E.2.2 Public Engagement Capacity

Enh • Class O • Unit B • HDRS 5 • Alliance 1

**Maturity levels**

| **L1** | No dedicated capacity. Reactive, ad-hoc. |
|----|----|
| **L2** | Strategy developing. Responsibility assigned. Activities planned. |
| **L3** | Some activities. Not systematic or evaluated. |
| **L4** | Dedicated function with budget/staff. Diverse audiences. Evaluated. Two-way dialogue. |
| **L5** | Comprehensive with multiple channels. Co-designed. Social media. Proactive. Capacity shared. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Some engagement activity delivered (log) but not yet systematic

- Evidence learning captured (feedback) even if evaluation limited

**L4 (minimum evidence):**

- Dedicated function evidence (staff/budget) and engagement plan

- Activity log covering diverse audiences + evaluation results

- Evidence outputs feed back into governance decisions (issues/actions)

**L5 (minimum evidence):**

- Co-designed engagement programme evidence (materials, partners, governance)

- Multi-channel sustained delivery with measured reach/impact

- Evidence of sharing capacity or supporting others (toolkits, training)

### E.3.1 Opt-Out Management

Core • Class B0 • Unit S • HDRS 1,5 • Alliance 1,3

**Maturity levels**

| **L1** | No mechanism or not operational. Choices not respected. |
|----|----|
| **L2** | Mechanism exists but incomplete. Some opted-out data may be included. |
| **L3** | Operational. Opted-out excluded. Audit. Rate monitored. |
| **L4** | Robust mechanism with routine auditing. Opt-outs are applied consistently across all relevant data flows. Clear public information is available and maintained. |
| **L5** | Mature preferences management (granular where policy permits). Auditable, timely updates and proactive communications; opt-out rates reported contextually. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Operational opt-out mechanism with audit evidence

- Monitoring of opt-out rates and documented handling of exclusions

**L4 (minimum evidence):**

- Policy and technical design showing opt-outs applied across all relevant data flows

- Audit evidence (sampling/results) demonstrating correct application

- Public-facing information (webpages/materials) kept current

**L5 (minimum evidence):**

- Evidence of preference management maturity (granular options where policy permits)

- Audit evidence of timely updates and sustained compliance over time

- Contextual reporting of opt-out rates with interpretation (not used as readiness proxy)

### E.3.2 Public Benefit & Value

Core • Class B0 • Unit B • HDRS All • Alliance 1,6

**Maturity levels**

| **L1** | No articulation. Benefits without visibility. No framework. |
|----|----|
| **L2** | Framework developing using NDG. Commitment expressed. Initial mechanisms. |
| **L3** | Benefit articulated using NDG. Examples. Commercial income partially reinvested. Statement required. |
| **L4** | Clear proposition. NDG methodology applied consistently. Revenue supports public. Principles published. |
| **L5** | Comprehensive with measurable return. Methodology contributes to sector. Community agreements. Public involved. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Public benefit statements required and examples available

- Evidence NDG-aligned framework is used at least for priority decisions

**L4 (minimum evidence):**

- Published public benefit framework aligned to NDG (or equivalent) and applied in decisions

- Evidence of consistent benefit statements in DAC approvals

- Evidence of reinvestment/use of revenues to support public benefit (where applicable)

**L5 (minimum evidence):**

- Measurable return evidence (benefits tracked with metrics and attribution approach)

- Public involvement evidence in benefit definition/assessment

- Evidence of sharing/standardising benefit methodology beyond the organisation

### E.3.3 Legitimacy, Assurance & Learning

Core • Class B0 • Unit B • HDRS All • Alliance 1,10

**Maturity levels**

| **L1** | No meaningful assurance or learning. Issues repeat; accountability weak. |
|----|----|
| **L2** | Assurance/learning plan exists. Complaints/appeals defined but not embedded. |
| **L3** | Periodic internal assurance. Learning after incidents; limited visibility. |
| **L4** | Regular independent review. Systematic learning with published actions. |
| **L5** | Trusted model. Routine independent assurance; confidence measures tracked; good practice shared. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Periodic internal assurance activity and incident learning documented

- Evidence actions are tracked even if not fully public (action log)

**L4 (minimum evidence):**

- Independent review/assurance report covering governance and transparency

- Complaint/incident learning process evidence + published action log

- Evidence of public feedback mechanisms and responses

**L5 (minimum evidence):**

- Routine independent assurance over time with comparative benchmarking

- Public confidence/legitimacy measures tracked (survey/metrics) with trend

- Evidence of sharing assurance/learning approach with other nodes

## Domain F: Sustainability

Focuses on financial sustainability and economic contribution. Core indicators include funding horizon and cost recovery/pricing. Enhancement indicators cover financial risk management, commercial revenue, economic impact assessment, and value demonstration. Levels range from precarious short-term funding to long-term, diversified, and economically impactful models.

### F.1.1 Funding Horizon

Core • Class B0 • Unit B • HDRS All

**Maturity levels**

| **L1** | Precarious. Short-term grants. Gap within 12 months. |
|----|----|
| **L2** | Secured 1-2 years. Not baselined. Grant-dependent. |
| **L3** | Core secured 2-3 years. Mixed baseline/grant. Medium-term concerns. |
| **L4** | Core \>= 3 years. Baseline covers essentials. Grants supplement not sustain. |
| **L5** | Long-term \>= 5 years. Diverse sources. Reserves. Enables innovation. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Funding documentation showing 2--3 year horizon for core operations

- Evidence mixed baseline/grant model with identified medium-term risks

**L4 (minimum evidence):**

- Budget/funding documents showing \>=3-year committed core funding

- Evidence baseline funding covers essential operations (staff, platform, governance)

- Financial plan showing grants supplement rather than substitute core funding

**L5 (minimum evidence):**

- Funding documents showing \>=5-year horizon and diversified sources

- Reserves policy and evidence of reserves held (audited accounts/statement)

- Evidence funding enables improvement/innovation (investment plan)

### F.1.2 Financial Risk Management

Enh • Class O • Unit B • HDRS All

**Maturity levels**

| **L1** | No management. Single funder. No contingency. |
|----|----|
| **L2** | Risks identified. Mitigation discussed. Limited diversification. |
| **L3** | Basic with risks/mitigations. Some diversification. Minor contingency. |
| **L4** | Active with register, plans, review. \>= 3 sources. 3+ months reserves. |
| **L5** | Comprehensive resilience. Scenario planning. Counter-cyclical. Enables opportunistic investment. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Basic risk register/mitigation list exists with some diversification

- Evidence of contingency planning and periodic review

**L4 (minimum evidence):**

- Financial risk register with owners and review cycle

- Evidence of diversification (\>=3 funding sources) and contingency plans

- Evidence of minimum reserves or equivalent mitigation (policy + current position)

**L5 (minimum evidence):**

- Scenario planning evidence (stress tests, sensitivity analysis)

- Evidence of counter-cyclical or resilience planning (e.g., cost base flexibility)

- Independent assurance of financial governance (audit committee minutes, external audit)

### F.2.1 Cost Recovery & Pricing

Core • Class B0 • Unit B • HDRS 5 • Alliance 7

**Maturity levels**

| **L1** | No recovery. Services free/subsidised. True cost unknown. |
|----|----|
| **L2** | Analysis initiated. Unit costs calculated. Principles discussed. |
| **L3** | Model with pricing for some services. Partial recovery. Basic IP terms. |
| **L4** | Comprehensive with rate card. Tiered. \>= 50% recovery. IP aligned with Fair Value principles. |
| **L5** | Transparent, sustainable pricing model (published rate card, justified subsidies, predictable invoicing). Fair Value aligned. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Pricing model exists for some services with documented unit costs and assumptions

- Evidence of partial cost recovery tracking and basic IP terms

**L4 (minimum evidence):**

- Rate card and cost model documentation (unit cost basis) with governance sign-off

- Evidence of tiering/subsidy rules and alignment to Fair Value principles

- Evidence of cost recovery tracking (management accounts)

**L5 (minimum evidence):**

- Published pricing model with justified subsidies and predictable invoicing

- Evidence pricing reviewed and improved (change log, stakeholder input)

- Benchmarking or independent review of pricing fairness and sustainability (optional)

### F.2.2 Commercial Revenue & Partnerships

Enh • Class O • Unit B • HDRS 5 • Alliance 7

**Maturity levels**

| **L1** | No commercial revenue. No partnership framework. |
|----|----|
| **L2** | Opportunities identified. Pilots initiated. Principles developing. |
| **L3** | Some revenue (\<10%). Offering exists. Basic agreements. |
| **L4** | Significant (10-30%). Active pipeline. Competitive. LSSD2 aligned. IP defined. |
| **L5** | Substantial (\>30%). Major partnerships. Sophisticated models. Good practice. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Evidence some commercial revenue exists, and basic partnership agreements are used

- Due diligence and governance for partnerships documented

**L4 (minimum evidence):**

- Commercial partnership framework + standard agreements and due diligence process

- Revenue evidence in the 10--30% range (or relevant threshold) with reporting

- Evidence of compliance with policy (Fair Value/LSSD2 alignment where relevant)

**L5 (minimum evidence):**

- Evidence of substantial commercial activity (portfolio, pipeline, revenue share)

- Case studies showing sophisticated partnership models and delivery at scale

- Independent review/assurance of partnership governance (optional)

### F.3.1 Economic Impact Assessment

Enh • Class Y • Unit B • HDRS All

**Maturity levels**

| **L1** | No assessment. Contribution not quantified. |
|----|----|
| **L2** | Commissioned/planned. Methodology developing. |
| **L3** | Initial completed. Headlines available. May be limited. |
| **L4** | Proportionate assessment within 3 years. Methodology documented. Findings published. |
| **L5** | Regular. Validated. Trajectory tracked. Influences policy. Contributing nationally. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Initial economic impact assessment completed with headline results

- Methodology documented and findings used in internal planning

**L4 (minimum evidence):**

- Published economic impact assessment within 3 years (methods + results)

- Evidence methodology is proportionate and documented

- Evidence findings inform strategy/investment decisions

**L5 (minimum evidence):**

- Repeated assessments over time with trend tracking

- External validation/peer review of methodology and results

- Evidence results influence wider policy or national narrative

### F.3.2 Value Demonstration

Enh • Class Y • Unit B • HDRS All • Alliance 10

**Maturity levels**

| **L1** | No systematic demonstration. Benefits claimed not evidenced. |
|----|----|
| **L2** | Proposition articulated. Case studies developing. Metrics defined. |
| **L3** | Portfolio of case studies. Metrics tracked. Communicated. |
| **L4** | Comprehensive framework with multiple dimensions. Regular reporting. Supports funding case. |
| **L5** | Sophisticated with attribution. ROI quantified. Influences policy. Framework shared. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Portfolio of case studies with defined metrics tracked

- Evidence value narrative is used for funding and stakeholder reporting

**L4 (minimum evidence):**

- Value framework with defined dimensions and metrics

- Regular reporting outputs (dashboards/reports) linked to activities

- Case studies linked to metrics (attribution narrative)

**L5 (minimum evidence):**

- Attribution/ROI approach documented with quantified impacts

- Evidence framework adopted/used for funding/policy decisions

- Sharing of framework and peer learning evidence

## Domain G: Workforce & Culture

Assesses human capacity, capability, and culture. Core indicators examine staff capacity, role definitions, technical skills, and service orientation. Enhancement indicators cover retention, strategic workforce planning, and collaboration. Maturity moves from critical shortages and undefined roles to optimal staffing, mature professionalisation, and exemplary service culture.

### G.1.1 Staff Capacity

Core • Class B0 • Unit B • HDRS All

**Maturity levels**

| **L1** | Critical shortages. Key roles vacant. Insufficient. High temp reliance. |
|----|----|
| **L2** | Challenges identified. Recruitment underway. Below requirements. |
| **L3** | Adequate for core. Constraints in peak/specialist. Vacancy \<15%. |
| **L4** | Meets requirements with headroom. Vacancy \<10%. Planning enables recruitment. |
| **L5** | Optimal with strategic capacity. Vacancy \<5%. Strong pipeline. Flexible surge. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Staffing baseline and vacancy metrics documented

- Evidence capacity is sufficient for delivery of core services (throughput vs staffing)

**L4 (minimum evidence):**

- Workforce plan and org chart showing staffing meets requirements with headroom

- Vacancy and recruitment metrics showing \<10% vacancy rate (or equivalent)

- Evidence of capability to manage peaks (rota/surge plan, prioritisation)

**L5 (minimum evidence):**

- Vacancy metrics showing \<5% and evidence of stable pipeline (talent pathways)

- Evidence of surge capacity/flex (cross-training, partnerships, reserve staff)

- Retention/engagement evidence supporting sustained capacity

### G.1.2 Staff Retention & Development

Enh • Class O • Unit B • HDRS All

**Maturity levels**

| **L1** | High turnover. Limited development. Knowledge lost. |
|----|----|
| **L2** | Concerns identified. Opportunities expanding. Exit interviews informing. |
| **L3** | Moderate (\<20% turnover). Pathways exist. Some progression. |
| **L4** | Good (\<15%). Clear pathways. Regular review. Succession identified. Satisfaction surveyed. |
| **L5** | Excellent (\<10%). Employer of choice. Comprehensive development. Alumni network. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Turnover tracked with basic development offer documented

- Evidence of mitigation actions for retention risks

**L4 (minimum evidence):**

- Turnover metrics showing \<15% with breakdown by role

- Career pathways and development offer evidence (CPD plans, training records)

- Staff satisfaction survey results and actions

**L5 (minimum evidence):**

- Turnover metrics \<10% sustained with progression evidence

- Evidence of employer-of-choice practices (benefits, recognition, development)

- Knowledge management practices limiting loss (handover, documentation audits)

### G.1.3 Strategic Workforce Planning

Enh • Class O • Unit B • HDRS All

**Maturity levels**

| **L1** | No planning. Reactive recruitment. No future view. |
|----|----|
| **L2** | Planning initiated. Workforce profiled. Requirements scoped. |
| **L3** | Basic 1-2 year plan. Key gaps identified. Annual review. |
| **L4** | Comprehensive 3+ years aligned to strategy. Scenario planning. Pipeline development. |
| **L5** | Sophisticated with workforce as asset. Long-term pipelines. Integrated with financial. Contributing nationally. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Workforce plan exists linking roles to expected demand

- Evidence of recruitment/training pipeline actions underway

**L4 (minimum evidence):**

- 3+ year workforce plan aligned to strategy with scenario elements

- Pipeline development evidence (training partnerships, apprenticeships)

- Annual review evidence and tracked delivery against plan

**L5 (minimum evidence):**

- Long-term pipeline evidence (multi-year agreements, national programmes)

- Workforce treated as strategic asset (investment cases, metrics)

- Contribution to wider workforce standards/initiatives (optional)

### G.2.1 Role Definition & Professionalization

Core • Class B0 • Unit B • HDRS All

**Maturity levels**

| **L1** | Undefined. Staff outside competencies. No framework. |
|----|----|
| **L2** | Definitions developing. Frameworks reviewed. Gap analysis. |
| **L3** | Key roles defined. Framework for some. Job families emerging. |
| **L4** | Comprehensive aligned to DDaT/SFIA. All mapped. Competency informs development. |
| **L5** | Mature professional workforce. Contributing to standards. Recognised leader. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Role definitions documented with basic competency expectations

- Evidence roles are used for recruitment/performance management

**L4 (minimum evidence):**

- Role framework mapped to DDaT/SFIA (or equivalent) across all roles

- Job families and competency-based development evidence

- Evidence recruitment and performance processes use the framework

**L5 (minimum evidence):**

- Evidence of mature professionalisation (certifications, progression, community leadership)

- Contribution to sector standards/job families (optional)

- External recognition evidence (awards, invitations, benchmarking)

### G.2.2 Technical Skills

Core • Class B0 • Unit B • HDRS All

**Maturity levels**

| **L1** | Critical gaps (engineering, governance, analysis, AI/ML). Limited specialist access. |
|----|----|
| **L2** | Assessment completed. Priority training. Development underway. Gaps remain. |
| **L3** | Core skills present. Development programme. Specialists via partnerships. |
| **L4** | Comprehensive across engineering, governance, security, analysis, data science/AI. Skills matrix. CPD. |
| **L5** | Advanced including AI/ML, federated, PETs. Contributing to standards. Attracts talent. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Skills coverage assessed (skills matrix) with identified gaps

- Evidence of training/contracting to address gaps

**L4 (minimum evidence):**

- Skills matrix covering engineering, governance, security, analysis, data science/AI

- Evidence of training/CPD and specialist access where required

- Assessment evidence showing coverage of required competencies

**L5 (minimum evidence):**

- Evidence of advanced capability (PETs, federation, AI/ML) with applied projects

- Evidence of attracting/retaining talent (offers, partnerships, fellowships)

- Contribution to standards or shared training materials (optional)

### G.3.1 Service Orientation

Core • Class B0 • Unit V • HDRS 5 • Alliance 8

**Maturity levels**

| **L1** | "Computer says no". Requests as burden. Defensive. |
|----|----|
| **L2** | Improvement priority. Feedback collected. Culture change initiated. |
| **L3** | Improving. Feedback reviewed. Some embrace service culture. |
| **L4** | Embedded. Needs prioritised. "How can we help?" Satisfaction tracked. Standards published. |
| **L5** | Exemplary with proactive engagement. Empowered staff. Continuous improvement. Externally recognised. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Service standards and targets defined with evidence of delivery for some

- Evidence of service mindset (feedback loops, issue resolution)

**L4 (minimum evidence):**

- Service standards published + evidence of adherence (tickets, SLAs, metrics)

- User satisfaction survey results and improvement actions

- Evidence of service culture embedded (training, leadership messages, behaviours)

**L5 (minimum evidence):**

- External recognition or benchmarking of service quality (awards, comparisons)

- Evidence of proactive engagement and continuous improvement (roadmap, releases)

- Sustained high satisfaction results with methodology documented

### G.3.2 Collaboration & Knowledge Sharing

Enh • Class O • Unit B • HDRS All • Alliance 9

**Maturity levels**

| **L1** | Siloed. Limited collaboration. Knowledge held by individuals. |
|----|----|
| **L2** | Improvement identified. Knowledge management started. Cross-team emerging. |
| **L3** | Regular cross-team. Knowledge documented. Some external collaboration. |
| **L4** | Strong collaborative culture. Communities of practice. Knowledge accessible. UK/international networks. |
| **L5** | Collaborative leadership. Anchors networks. Knowledge flows. Attracts opportunities. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Knowledge sharing mechanisms exist (communities, docs) with participation evidence

- Evidence of collaboration supporting delivery (shared artefacts, joint work)

**L4 (minimum evidence):**

- Communities of practice/knowledge base evidence + participation records

- Knowledge management artefacts (wikis, SOP repositories) with usage stats

- Evidence of UK/international network participation

**L5 (minimum evidence):**

- Evidence of leadership in collaboration networks (hosting, chairing, outputs)

- Cross-organisational knowledge sharing outputs (toolkits, templates)

- Measured improvement in delivery attributable to collaboration (optional)

## Domain H: Infrastructure & Compute Capacity

Evaluates technical infrastructure including SDEs, compute, security, and AI capabilities. Core indicators include SDE architecture, user environment, compute scalability, security certification, security operations, and responsible AI practices. Enhancement indicators cover storage, privacy-enhancing technologies, and ML/AI platform capability. Levels span from no dedicated infrastructure to advanced, fully integrated, and internationally benchmarked environments supporting responsible AI.

### H.1.1 SDE Architecture & Standards

Core • Class B0 • Unit V • HDRS 5 • Alliance 3

**Maturity levels**

| **L1** | No dedicated SDE. Ad-hoc access. Controls inconsistent. |
|----|----|
| **L2** | SDE developing. Architecture defined. NHS SDE specs and SATRE reviewed. |
| **L3** | Operational meeting basic requirements. ISO 27001 in progress. Some gaps vs gold-standard/SATRE. |
| **L4** | Mature meeting NHS SDE gold-standard and SATRE mandatory. ISO 27001. DEA accredited. |
| **L5** | Advanced exceeding baseline. Most SATRE recommended. Enables emerging uses. Contributing to UK standards. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- SDE architecture documented and aligned to key specs; gaps identified

- Evidence of implemented controls and progress towards certification/accreditation

**L4 (minimum evidence):**

- Architecture documentation showing compliance with NHS SDE specs and SATRE mandatory controls

- ISO 27001 certificate (scope includes service) and DEA accreditation evidence

- Independent gap assessment evidence and remediation status

**L5 (minimum evidence):**

- Evidence of exceeding baseline (SATRE recommended controls implemented) with documentation

- Continuous improvement evidence (security/architecture roadmap + delivery)

- Contribution to UK standards/specs (working groups, shared patterns)

### H.1.2 User Environment & Experience

Core • Class B0 • Unit V • HDRS 5 • Alliance 8

**Maturity levels**

| **L1** | Poor experience. Difficult access. Tools outdated. Significant complaints. |
|----|----|
| **L2** | Issues identified. Roadmap defined. Upgrades underway. |
| **L3** | Functional. Standard tools (R, Python, SQL). Process works but cumbersome. |
| **L4** | Good with modern environment. Tools updated. Onboarding \<1 day. Satisfaction tracked. |
| **L5** | Excellent matching commercial platforms. Rich tools. Rapid onboarding. \>= 80% satisfaction. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Operational user environment with documented tooling and onboarding process

- Evidence of user feedback collection and response

**L4 (minimum evidence):**

- Onboarding metrics showing \<1 day for standard users + process evidence

- Tooling/environment list showing modern, maintained stack

- Satisfaction survey results and improvement actions

**L5 (minimum evidence):**

- Benchmarking against leading platforms (comparators and results)

- Sustained high satisfaction (\>=80%) with methodology documented

- Evidence of rapid enhancement cycle driven by users (release notes/backlog)

### H.2.1 Compute Scalability

Core • Class B0 • Unit V • HDRS 3,5 • Alliance 3

**Maturity levels**

| **L1** | Severely limited. Analysis constrained. Frequent delays/failures. |
|----|----|
| **L2** | Assessed. Upgrade requirements defined. Cloud/HPC evaluated. |
| **L3** | Adequate for standard. Queuing for intensive. GPU limited. Cloud/HPC for exceptions. |
| **L4** | Scalable meeting demand with headroom. GPU for AI/ML. Scaling pathway. Cost management. |
| **L5** | Elastic auto-scaling. Advanced GPU. Cost-optimised. Benchmarked internationally. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Compute environment operational with scaling plan; utilisation monitored

- Evidence of meeting routine demand without persistent capacity constraints

**L4 (minimum evidence):**

- Capacity and utilisation metrics showing headroom + scaling pathway

- GPU availability evidence for AI/ML where required

- Cost management evidence (chargeback/showback, monitoring)

**L5 (minimum evidence):**

- Elastic autoscaling evidence (architecture + performance under load tests)

- Advanced GPU/accelerator capability evidence + utilisation metrics

- Benchmarking evidence (UK/international) or independent performance review

### H.2.2 Storage & Data Management

Enh • Class O • Unit V • HDRS 5 • Alliance 3

**Maturity levels**

| **L1** | Constrained. Retention unclear. No tiering. Costs unmanaged. |
|----|----|
| **L2** | Assessment completed. Tiered strategy. Retention developing. |
| **L3** | Adequate with tiering. Retention operational. Costs monitored. |
| **L4** | Scalable. Comprehensive lifecycle. Costs optimised. Backup/DR tested. |
| **L5** | Advanced with automated tiering/lifecycle. Costs benchmarked. Multi-site resilience. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Storage management process documented (retention, backup) with implementation evidence

- Evidence of DR/backups functioning (test or restore logs)

**L4 (minimum evidence):**

- Storage lifecycle policy (tiering, retention) + implementation evidence

- Backup/DR test results and audit trail

- Cost optimisation evidence (monitoring, tiering usage)

**L5 (minimum evidence):**

- Automated lifecycle/tiering evidence with monitoring and alerts

- Cost benchmarking evidence and continuous optimisation

- Multi-site resilience evidence (replication, failover tests)

### H.3.1 Security Certification & Audit

Core • Class B0 • Unit V • HDRS 5 • Alliance 3

**Maturity levels**

| **L1** | No certification. Controls undocumented/untested. |
|----|----|
| **L2** | Assessment initiated. Gap analysis vs ISO 27001. Remediation plan. |
| **L3** | Controls implemented. ISO 27001 in progress. Penetration testing. Incident process defined. |
| **L4** | ISO 27001 certified (full scope). Annual penetration with remediation. Incident management. DEA accredited. |
| **L5** | Continuous assurance and independent testing. Demonstrable security outcomes; additional certifications as appropriate. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Controls implemented with certification in progress and regular testing

- Evidence of incident management process defined and used

**L4 (minimum evidence):**

- ISO 27001 certificate (full scope) + annual penetration test summary with remediation evidence

- Incident management SOP + exercised/tested evidence

- DEA accreditation evidence (where applicable)

**L5 (minimum evidence):**

- Continuous assurance evidence (control monitoring, frequent independent testing/red teaming)

- Demonstrable security outcomes (incident metrics, risk reduction) and improvement actions

- External assurance beyond ISO where appropriate (optional, scope stated)

### H.3.2 Security Operations

Core • Class B0 • Unit V • HDRS 5 • Alliance 3

**Maturity levels**

| **L1** | No dedicated ops. Monitoring ad-hoc. Incident response untested. |
|----|----|
| **L2** | Function identified. Monitoring implementing. Incident plan drafted. |
| **L3** | Basic ops monitoring key systems. Incident plan documented. |
| **L4** | Mature with comprehensive monitoring. 24/7 alerting. Incident tested. Metrics reported. |
| **L5** | Advanced with threat intelligence. Proactive hunting. Automated response. Benchmarked. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Operational security monitoring and incident response capabilities

- Evidence of regular patching/vulnerability management and reporting

**L4 (minimum evidence):**

- Monitoring/alerting evidence (coverage, 24/7 or equivalent) and runbooks

- Incident response exercises and lessons learned documentation

- Security ops KPIs reported (MTTD/MTTR, patch cadence)

**L5 (minimum evidence):**

- Threat intelligence and hunting capability evidence (process + outputs)

- Automation evidence (SOAR, auto-remediation) with controls

- Benchmarking or independent assessment of security operations maturity

### H.3.3 Privacy-Enhancing Technologies

Enh • Class O • Unit V • HDRS 5 • Alliance 3

**Maturity levels**

| **L1** | No PETs. All analysis requires pseudonymised data in secure environment. |
|----|----|
| **L2** | Options assessed. Federated/differential privacy pilots planned. |
| **L3** | Selected capabilities (DataSHIELD, federated). Limited use cases. |
| **L4** | Routinely available (federated, secure computation, differential privacy). Support. Governance. |
| **L5** | Advanced with multiple technologies. PET default where appropriate. Contributing to standards. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- At least one PET capability piloted or operational for selected use cases

- Governance guidance exists for when to use PETs

**L4 (minimum evidence):**

- Documented PET services available (federation, DP, secure computation) and governance

- Use case evidence showing PETs used routinely where appropriate

- Risk assessment templates/policies supporting PET selection

**L5 (minimum evidence):**

- Evidence PETs are default for suitable use cases (policy + adoption metrics)

- Multiple PETs with validation evidence and staff capability

- Contribution to PET standards/pilots beyond the service (optional)

### H.4.1 ML/AI Platform Capability

Enh • Class O • Unit V • HDRS 3,4 • Alliance 11

**Maturity levels**

| **L1** | No ML/AI capability. Cannot run ML workloads. |
|----|----|
| **L2** | Requirements assessed. Platform evaluated. Pilot planned. |
| **L3** | Basic with standard libraries. GPU limited. No MLOps. |
| **L4** | Mature with MLOps (tracking, registry, pipelines). GPU. Governance defined. |
| **L5** | Advanced full lifecycle. Automated pipelines. Monitoring. Synthetic data. Contributing to UK AI standards. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Basic ML platform components available (tools, GPU) for selected projects

- Governance for ML workflows documented

**L4 (minimum evidence):**

- MLOps tooling evidence (experiment tracking, model registry, pipelines) and governance

- GPU and platform capacity evidence supporting routine ML workloads

- Security/privacy controls for ML workflows (data handling, model release)

**L5 (minimum evidence):**

- End-to-end ML lifecycle evidence (monitoring, drift, retraining, audit trails)

- Advanced capabilities (synthetic data, federated learning where relevant) with evaluation

- Contribution to UK AI standards/tooling or shared patterns

### H.4.2 Responsible AI Practices

Core • Class C3/4 • Unit V • HDRS 3,4 • Alliance 11

**Maturity levels**

| **L1** | No consideration. Projects without ethics, bias assessment, or reporting. |
|----|----|
| **L2** | Principles acknowledged. STANDING Together, TRIPOD-AI, CONSORT-AI reviewed. Some awareness. |
| **L3** | Framework developing. Diversity assessed for some using STANDING Together. Guidelines referenced. Selected bias assessment. |
| **L4** | Comprehensive framework. All projects assess diversity per STANDING Together. TRIPOD-AI/CONSORT-AI mandated. Bias embedded. NICE AI aligned. |
| **L5** | Leading practice. Full STANDING Together. Contributing to standards. Advanced fairness monitoring. Scottish AI Playbook aligned. Sharing frameworks. |

**Minimum evidence for L3, L4 and L5**

**L3 (minimum evidence):**

- Responsible AI expectations documented and applied to some projects

- Evidence of bias/representativeness assessment performed for selected AI studies

**L4 (minimum evidence):**

- Responsible AI framework/policy + mandated reporting standards (e.g., TRIPOD-AI/CONSORT-AI where relevant)

- Evidence all AI projects assess dataset representativeness (e.g., STANDING Together) and bias

- Governance evidence (review, approvals, monitoring) linked to project delivery

**L5 (minimum evidence):**

- Evidence of advanced fairness/monitoring and continuous improvement

- External contribution/leadership in responsible AI standards/practice

- Independent assurance or peer review of responsible AI governance (optional)

# 7. HDRS capability map

This section summarises how HDRL indicators map to the six HDRS capabilities (Section 1.3). The HDRS column of the Indicator Summary (Section 5) is the authoritative master; this section presents the sideways view as a single matrix.

How to read the matrix:

- "All" — cross-cutting indicator that applies to every capability.

- "Cx" — capability-defining indicator (mandatory when that capability is claimed).

- "•" — indicator explicitly mapped to that capability in the Indicator Summary.

Applicability Class (Section 2.2) governs what is required in an assessment: **Cx** indicators are mandatory when that capability is claimed; **B0** indicators are baseline prerequisites for participation; **O** are optional enhancements; **Y** are outcomes/context (reported separately).

| **Ref** | **Indicator** | **Class** | **C1: Linked national-scale data** | **C2: Consented cohort data** | **C3: Multi-modal data** | **C4: Trial acceleration** | **C5: Single-entry point w/ SDEs** | **C6: Cross-sector linkage** |
|----|----|----|:--:|:--:|:--:|:--:|:--:|:--:|
| **A.1.1** | Core Dataset Availability | **B0** | **Cx** |  |  |  | • |  |
| **A.1.2** | Data Currency & Timeliness | **B0** | • |  |  | **Cx** |  |  |
| **A.1.3** | Data Equity & Representativeness | **B0** | • |  |  |  |  |  |
| **A.2.1** | Patient Identifier Infrastructure | **B0** | **Cx** |  |  |  |  | **Cx** |
| **A.2.2** | Linkage Services | **B0** | **Cx** | **Cx** |  |  |  | • |
| **A.3.1** | Federated Query Capability | **O** |  |  |  |  | • |  |
| **A.3.2** | UK Gateway Connectivity | **B0** |  |  |  |  | • |  |
| **A.3.3** | Federation Operating Model & Assurance | **B0** |  |  |  |  | • |  |
| **A.4.1** | Consented Cohort Integration | **C2** |  | **Cx** |  |  |  |  |
| **A.4.2** | Multi-Modal Data Access | **C3** |  |  | **Cx** |  |  |  |
| **B.1.1** | Common Data Model Adoption | **C1** | **Cx** |  |  |  | • |  |
| **B.1.2** | Terminology Standards | **C1** | **Cx** |  |  |  |  |  |
| **B.2.1** | Quality Framework & Monitoring | **B0** | **Cx** |  |  |  |  |  |
| **B.2.2** | Data Documentation & Metadata | **B0** |  |  |  |  | • |  |
| **B.3.1** | Curated Dataset Availability | **O** | • | • |  |  |  |  |
| **B.3.2** | Phenotype Library & Validation | **O** | • |  |  |  |  |  |
| **C.1.1** | Legal Basis for Processing | **B0** |  |  |  |  | • |  |
| **C.1.2** | Legislative Environment | **O** |  |  |  |  | • |  |
| **C.2.1** | Time-to-Data | **B0** |  |  |  |  | **Cx** |  |
| **C.2.2** | Data Access Committee | **B0** |  |  |  |  | **Cx** |  |
| **C.2.3** | Ethics Pathway Integration & Proportionality | **B0** |  |  |  |  | • |  |
| **C.3.1** | Mutual Recognition & Standards | **B0** |  |  |  |  | **Cx** |  |
| **C.3.2** | Cross-Border Legal Alignment | **O** |  |  |  |  | • | • |
| **C.3.3** | Cross-sector Data Sharing & Linkage Governance | **C6** |  |  |  |  |  | **Cx** |
| **C.4.1** | Statistical Disclosure Control | **B0** |  |  |  |  | • |  |
| **C.4.2** | Researcher Accreditation | **B0** |  |  |  |  | • |  |
| **C.4.3** | Consent, Permissions & Restrictions Governance | **B0** |  | **Cx** |  |  | • |  |
| **D.1.1** | Active User Base | **Y** |  |  |  |  | • |  |
| **D.1.2** | Research Output & Impact | **Y** | **All** | **All** | **All** | **All** | **All** | **All** |
| **D.2.1** | Researcher Support & Helpdesk | **B0** |  |  |  |  | • |  |
| **D.2.2** | Training & Capability Building | **O** |  |  |  |  | • |  |
| **D.2.3** | Reproducibility & Analytic Provenance Support | **B0** | **All** | **All** | **All** | **All** | **All** | **All** |
| **D.3.1** | Multi-Site Research Capability | **B0** |  |  |  |  | • |  |
| **D.3.2** | Commercial Access Framework | **O** |  |  |  |  | • |  |
| **D.4.1** | Trial Data & Recruitment | **C4** |  |  |  | **Cx** |  |  |
| **E.1.1** | Public Register of Data Uses | **B0** |  |  |  |  | • |  |
| **E.1.2** | Annual Transparency Reporting | **B0** |  |  |  |  | • |  |
| **E.2.1** | Lay Involvement in Governance | **B0** |  |  |  |  | • |  |
| **E.2.2** | Public Engagement Capacity | **O** |  |  |  |  | • |  |
| **E.3.1** | Opt-Out Management | **B0** | **Cx** |  |  |  | • |  |
| **E.3.2** | Public Benefit & Value | **B0** | **All** | **All** | **All** | **All** | **All** | **All** |
| **E.3.3** | Legitimacy, Assurance & Learning | **B0** | **All** | **All** | **All** | **All** | **All** | **All** |
| **F.1.1** | Funding Horizon | **B0** | **All** | **All** | **All** | **All** | **All** | **All** |
| **F.1.2** | Financial Risk Management | **O** | **All** | **All** | **All** | **All** | **All** | **All** |
| **F.2.1** | Cost Recovery & Pricing | **B0** |  |  |  |  | • |  |
| **F.2.2** | Commercial Revenue & Partnerships | **O** |  |  |  |  | • |  |
| **F.3.1** | Economic Impact Assessment | **Y** | **All** | **All** | **All** | **All** | **All** | **All** |
| **F.3.2** | Value Demonstration | **Y** | **All** | **All** | **All** | **All** | **All** | **All** |
| **G.1.1** | Staff Capacity | **B0** | **All** | **All** | **All** | **All** | **All** | **All** |
| **G.1.2** | Staff Retention & Development | **O** | **All** | **All** | **All** | **All** | **All** | **All** |
| **G.1.3** | Strategic Workforce Planning | **O** | **All** | **All** | **All** | **All** | **All** | **All** |
| **G.2.1** | Role Definition & Professionalization | **B0** | **All** | **All** | **All** | **All** | **All** | **All** |
| **G.2.2** | Technical Skills | **B0** | **All** | **All** | **All** | **All** | **All** | **All** |
| **G.3.1** | Service Orientation | **B0** |  |  |  |  | • |  |
| **G.3.2** | Collaboration & Knowledge Sharing | **O** | **All** | **All** | **All** | **All** | **All** | **All** |
| **H.1.1** | SDE Architecture & Standards | **B0** |  |  |  |  | **Cx** |  |
| **H.1.2** | User Environment & Experience | **B0** |  |  |  |  | • |  |
| **H.2.1** | Compute Scalability | **B0** |  |  | **Cx** |  | • |  |
| **H.2.2** | Storage & Data Management | **O** |  |  |  |  | • |  |
| **H.3.1** | Security Certification & Audit | **B0** |  |  |  |  | **Cx** |  |
| **H.3.2** | Security Operations | **B0** |  |  |  |  | **Cx** |  |
| **H.3.3** | Privacy-Enhancing Technologies | **O** |  |  |  |  | • |  |
| **H.4.1** | ML/AI Platform Capability | **O** |  |  | **Cx** | • |  |  |
| **H.4.2** | Responsible AI Practices | **C3/4** |  |  | **Cx** | **Cx** |  |  |

# 8. Methodology and evidence base

The HDRL Framework was developed through a rigorous methodology combining systematic evidence synthesis, first-principles analysis, and multi-stakeholder validation. This section documents the approach taken to ensure the framework is grounded in established practice whilst addressing identified gaps in the health data research readiness landscape.

## 8.1 Approach to framework development

### 8.1.1 Multi-model evidence synthesis

Given the breadth of potentially relevant frameworks and the absence of a comprehensive existing synthesis, this project employed a novel multi-model AI synthesis methodology. Three frontier AI models (Claude, Gemini, and ChatGPT) independently conducted systematic reviews against identical research specifications, with outputs subsequently synthesised to identify:

- Concordance: findings identified by all three models (highest confidence).

- Partial consensus: findings identified by two models (medium confidence, verification applied).

- Unique contributions: findings from single models given a dedicated review (verified against primary sources before inclusion).

- Single mentions: frameworks named by one model in passing and retained in the catalogue as reduced-confidence items (not independently reviewed).

- Contradictions: points of disagreement (resolved through primary source verification).

- Practitioner-sourced: findings nominated directly by the project lead from prior professional practice, pre-dating the AI review (verified against primary sources).

This approach enabled comprehensive coverage whilst providing triangulation of findings and explicit confidence assessment. The methodology followed established multi-source verification principles, taking the most conservative confidence rating where models disagreed and documenting all discordances for transparency.

### 8.1.2 Research tasks

The evidence synthesis addressed three complementary tasks:

**Task 1: Systematic framework review.** Identification and analysis of existing maturity and readiness frameworks across seven domains: data governance and management; health-specific frameworks; research infrastructure; digital government and data protection; data quality and FAIR principles; workforce capacity; and national strategies. For each framework, eleven extraction elements were documented including purpose, domain structure, indicator design, measurement approach, level architecture, validation evidence, strengths, limitations, and relevance to health data research.

**Task 2: Jurisdictional evidence review.** Analysis of health data research ecosystems across diverse contexts to understand what readiness looks like in practice, spanning high-income exemplars (UK, Nordic countries, Singapore, Australia, Canada, Estonia), middle-income contexts (India, Jordan, Brazil), and lower-resource settings.

**Task 3: First principles derivation.** Independent derivation, without reference to existing frameworks, of what "readiness for health data research" fundamentally requires. This analysis distinguished between necessary conditions (without which health data research cannot occur), enabling conditions (which improve quality and efficiency), and excellence conditions (which distinguish good from world-class).

## 8.2 Framework landscape analysis

### 8.2.1 Coverage and scope

The systematic review identified 56 frameworks across seven domains relevant to health data research readiness assessment. Of these, 14 were identified by all three AI models (high consensus), 10 by two models (partial consensus), 25 by a single model with a dedicated review (verified against primary sources), 4 named by a single model in passing without independent review, and 3 were practitioner-sourced — nominated by the lead author from prior professional practice and not identified by any AI model.

| **Domain** | **Frameworks** | **High Consensus** | **Key Exemplars** |
|----|----|----|----|
| Data governance and management | 8 | 6 | CMMI-DMM, DAMA-DMBOK, EDM Council DCAM |
| Health-specific | 12 | 3 | OECD Health Data Governance, WHO SCORE, HIMSS EMRAM, B1MG MLM |
| Research infrastructure | 9 | 1 | EOSC Readiness, RDA FAIR DMM, NIH DMSP, SATRE, Building TREs |
| Digital government | 7 | 0 | UN EGDI, World Bank GTMI, OECD DGI |
| Data quality and FAIR | 8 | 4 | RDA FAIR Data Maturity Model, WHO DQR, ISO 8000 |
| Workforce capacity | 6 | 0 | ESSENCE Framework, NHS NCF, WHO HWF Assessment |
| National strategies | 6 | 0 | Various national data strategies with maturity components |

### 8.2.2 Critical gap finding

A central finding of the evidence synthesis was that no existing framework comprehensively addresses health data research readiness. All three AI models independently reached this conclusion. While mature frameworks exist for general data management, health information systems, FAIR data practices, and research capacity, none integrates these dimensions in a manner suitable for assessing a jurisdiction's or organisation's readiness to participate in multi-site health data research infrastructure such as HDRS. This finding validates the purpose of the HDRL Framework.

### 8.2.3 Highest-relevance frameworks

The following frameworks were identified as having highest relevance for HDRL development:

- **RDA FAIR Data Maturity Model** (Research Data Alliance, 2020). Provides 41 indicators across five maturity levels with explicit priority classification (essential, important, useful). Contributed methodology for indicator classification and level descriptors. HDRL adapted its approach to Core/Enhancement classification from the RDA priority tiers.

- **EDM Council DCAM** (Enterprise Data Management Council, v3). Offers 8 capability components, 37 capabilities, and 109 sub-capabilities across six maturity levels. Contributed the concept of capability-based assessment and hierarchical indicator structure. HDRL drew on its comprehensive coverage whilst simplifying for practical application.

- **HIMSS EMRAM** (Healthcare Information and Management Systems Society). Presents 8-stage maturity model with extensive empirical validation across 10,000+ organisations globally. Contributed validation methodology and demonstrated value of staged maturity assessment in healthcare contexts.

- **B1MG Maturity Level Model** (Beyond 1 Million Genomes, 2022). Developed to assess country readiness for genomic medicine infrastructure across EU member states, the model provides 49 indicators across five maturity levels covering technical infrastructure, ethical-legal-social considerations, and healthcare system integration. The author's prior application of B1MG MLM to assess Jordan's genomic medicine readiness directly inspired the HDRL Framework development. HDRL adopted B1MG's level architecture and indicator-based approach whilst expanding scope beyond genomics to encompass the full health data research ecosystem. A companion crosswalk is available for Domains A-C.

- **ESSENCE Framework** (TDR/WHO, 2016). Addresses research capacity across four levels (individual, organisational, environmental, network). Uniquely addresses system-level capacity alongside operational capability. HDRL adopted its multi-level assessment approach through the System/Service/Both indicator tags.

- **OECD Health Data Governance Recommendation** (OECD, 2016/2019/2022). Establishes twelve principles for health data governance balancing privacy and access. Provided normative foundation particularly for Domain C (Governance & Access) and Domain E (Public Trust & Transparency).

- **Five Safes Framework** (Ritchie, ONS, 2003). Originally devised by Felix Ritchie at the UK Office for National Statistics, the Five Safes operationalises data access governance through five dimensions: safe people, safe projects, safe settings, safe data, safe outputs. The framework was subsequently adopted across statistical agencies internationally and brought to prominence in UK health data research through the UK Health Data Research Alliance's Principles for Participation and related guidance. HDRL assesses systemic capability to apply Five Safes principles consistently rather than duplicating the access decision framework itself.

- **Building Trusted Research Environments: Principles and Best Practices** (UK Health Data Research Alliance, 2021). Comprehensive guidance establishing principles and best practices for TREs, achieving over 17,000 views and informing NHS England SDE specifications. Contributed the articulation of how Five Safes translates into TRE operational requirements and shaped UK-wide approaches to secure data access for research.

- **SATRE Specification** (DARE UK, 2023). Provides TRE capability specification with mandatory, recommended, and optional tiers. HDRL references SATRE as input to Domain H (Infrastructure & Compute) particularly for SDE architecture assessment (H.1.1).

### 8.2.4 Architectural consensus

The evidence synthesis revealed strong consensus across frameworks on two architectural elements.

**Maturity levels.** Frameworks converge on five to six levels, with five-level models predominating (CMMI 5-level, RDA FAIR 5-level, ESSENCE 4-level plus baseline). HDRL adopted a five-level architecture reflecting this consensus (Initial, Developing, Defined, Managed, Optimising). Level descriptors align with CMMI nomenclature whilst incorporating the insight (credited to Jon Smart, SAIL Databank) that "Optimising" rather than "Optimised" better reflects maturity as a continuous process.

**Domain scope.** High-relevance frameworks operate with 6–11 domains. HDRL's eight domains fall within this range and reflect synthesis across the capability clusters identified through first principles analysis.

## 8.3 First principles analysis

### 8.3.1 Necessity analysis

The first principles derivation distinguished between capabilities that are necessary, enabling, and excellence-defining for health data research.

**Necessary conditions (without which health data research cannot occur):**

- Data existence: health observations must have been recorded in persistent form.

- Data accessibility: recorded data must be retrievable by those who would analyse it.

- Data interpretability: data must be comprehensible through documentation or standardisation.

- Analytical capability: means of processing and analysing data must exist.

- Legal basis: processing must be lawful under applicable data protection law.

- Ethical authorisation: research must meet applicable ethics requirements.

- Minimum sustainability: resources must exist to operate the research infrastructure.

**Enabling conditions (which improve quality and efficiency):**

- Standardised data formats and terminologies.

- Digital storage and computational infrastructure.

- Linkage capability across datasets.

- Metadata describing provenance, collection methods, and quality.

- Trained workforce with relevant competencies.

- Governance mechanisms enabling timely access decisions.

- Public engagement and transparency mechanisms.

**Excellence conditions (which distinguish good from world-class):**

- Real-time or near-real-time data availability.

- Population-scale coverage with minimal systematic gaps.

- Multi-modal data integration.

- Federated analysis capability.

- FAIR-compliant data infrastructure.

- Automated quality monitoring.

- Proactive public engagement with demonstrated social licence.

This taxonomy informed the Core/Enhancement indicator classification, with Core indicators mapping primarily to necessary and essential enabling conditions.

### 8.3.2 Stakeholder requirements mapping

Fourteen stakeholder groups were mapped against primary requirements, secondary requirements, and potential conflicts:

| **Stakeholder** | **Primary Requirements** | **Key Tensions** |
|----|----|----|
| Patients and research participants | Privacy protection; transparency; tangible benefit | Speed vs consent thoroughness |
| General public | Public benefit; trust; accountability | Population-level good vs individual privacy |
| Academic researchers | Timely access; comprehensive data; reproducibility | Speed vs governance rigour |
| Healthcare providers | Minimal burden; clinical utility; professional protection | Operational priority vs research facilitation |
| Data controllers | Legal clarity; risk management; accountability | Enabling research vs protecting data subjects |
| Research funders | Impact; efficiency; value for money | Open access vs commercial returns |
| Industry (pharma, medtech) | Predictable access; commercial pathway; competitive data | Commercial confidentiality vs transparency |
| Regulators | Compliance; oversight; enforcement | Enabling innovation vs protecting rights |

This analysis informed indicator development, ensuring HDRL captures capabilities relevant to diverse stakeholder requirements whilst acknowledging inherent tensions.

### 8.3.3 Capability clustering

The first principles analysis identified ten capability clusters required for health data research readiness. These were mapped to the eight HDRL domains:

| **Capability cluster** | **HDRL domain** |
|----|----|
| Data infrastructure and availability | A: Data Coverage & Federation & H: Infrastructure & Compute |
| Data standards and interoperability | B: Data Semantics & Quality |
| Legal and regulatory framework | C: Governance & Access |
| Governance and oversight | C: Governance & Access |
| Security and privacy | H: Infrastructure & Compute |
| Research infrastructure | D: Research Integration & Market |
| Workforce and training | G: Workforce & Culture |
| Funding and sustainability | F: Sustainability |
| Equity and inclusion | Distributed (A.1.3, E.2.1, E.3.2) |
| Research translation and impact | D: Research Integration & Market |

The analysis notably found that equity and inclusion capabilities, while ethically essential, could be technically classified as enabling rather than strictly necessary — a jurisdiction could conduct health data research without equity measures. This finding informed the normative decision to retain equity as Core (A.1.3 Data Equity & Representativeness) despite its technical classification, reflecting the framework's position that equitable research is a requirement for legitimate health data research infrastructure.

## 8.4 Validation and limitations

### 8.4.1 Validation approach

The HDRL Framework has been validated through:

- Evidence synthesis: triangulation across three AI models with explicit confidence assessment.

- Stakeholder consultation: Oversight Group review (8 January 2026) endorsed the architecture and requested refinements incorporated into v1.0.

- Expert review: framework reviewed against Alliance Principles and HDRS capabilities.

- Stress testing: use case simulations (COALESCE retrospective, Shingrix prospective) tested indicator applicability, plus a Transparency Audit for each of Wales, Scotland and Northern Ireland.

### 8.4.2 Limitations

- Empirical validation pending: unlike HIMSS EMRAM (10,000+ validated assessments), HDRL has not yet been applied at scale. Level 4 thresholds in particular require validation against UK and international benchmarks.

- UK-focused development: while the framework draws on international evidence, it is optimised for UK health data infrastructure context. Adaptation may be required for other jurisdictions.

- Multi-model synthesis novelty: the AI synthesis methodology, while providing comprehensive coverage and triangulation, represents a novel approach not previously validated for framework development.

- Indicator weighting: the current framework treats all Core indicators equally within a domain. Future iterations may benefit from weighted scoring reflecting relative importance.

## 8.5 Selected References

1\. Multi-model AI synthesis methodology developed for this project. Documentation available in project records.

2\. Research Data Alliance FAIR Data Maturity Model Working Group. (2020). FAIR Data Maturity Model: Specification and Guidelines. https://doi.org/10.15497/rda00050

3\. EDM Council. (2023). Data Management Capability Assessment Model (DCAM) v3. https://edmcouncil.org/frameworks/dcam/

4\. HIMSS Analytics. (2023). Electronic Medical Record Adoption Model (EMRAM). https://www.himss.org/what-we-do-solutions/digital-health-transformation/maturity-models/emram

5\. Costa, A., Cardoso, M.L., Konopko, M., Pérez Sitjà, X., Lopes, M.F., et al. (2022). B1MG D5.1: B1MG Maturity Level Model and Country-Specific Alignment within the Model. Zenodo. https://doi.org/10.5281/zenodo.6587561

6\. TDR/WHO. (2016). ESSENCE Framework for Health Research Capacity Strengthening. https://www.who.int/tdr/publications/essence-framework

7\. OECD. (2019). Recommendation of the Council on Health Data Governance (OECD/LEGAL/0433). https://legalinstruments.oecd.org/en/instruments/OECD-LEGAL-0433

8\. Ritchie, F. (2017). The "Five Safes": A framework for planning, designing and evaluating data access solutions. Data for Policy 2017. Originally developed at ONS c.2003. https://doi.org/10.5281/zenodo.897821

9\. UK Health Data Research Alliance. (2021). Building Trusted Research Environments: Principles and Best Practices. Zenodo. https://zenodo.org/records/5767586

10\. DARE UK. (2023). SATRE: Standardised Architecture for Trusted Research Environments, v1.0. Zenodo. https://doi.org/10.5281/zenodo.10055345
