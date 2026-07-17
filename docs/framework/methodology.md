# Methodology

## How the Framework Was Developed

The **Health Data Readiness Level (HDRL)** Framework was developed through a combination of **structured evidence synthesis**, **first-principles analysis**, and **stakeholder calibration**. This page documents the approach, evidence base, and key design decisions.

---

## Multi-Model AI Synthesis

**Three artificial intelligence (AI) models**—Claude, Gemini and ChatGPT—independently reviewed the framework landscape against identical research specifications. Outputs were then triangulated to assess confidence:

| Confidence Level | Definition | Count |
|:-----------------|:-----------|------:|
| **High (concordance)** | Identified by all three models | 14 frameworks |
| **Medium (partial consensus)** | Identified by two models | 10 frameworks |
| **Verified unique** | From a single model, with a dedicated review | 25 frameworks |
| **Single mention** | Named by one model in passing, not independently reviewed | 4 frameworks |
| **Practitioner-sourced** | Pre-dated the AI review; supplied directly by the lead author from prior professional practice | 3 frameworks |

This approach widened coverage and made areas of agreement and disagreement visible. AI outputs were used as synthesis aids, not as sources of authority: retained claims were checked by a human reviewer against primary or authoritative sources, and framework-design decisions remained human decisions. Three practitioner-sourced frameworks (B1MG MLM, SATRE, Building Trusted Research Environments) were nominated by the lead author from direct professional experience and pre-dated the AI landscape review; the AI synthesis then built out the wider evidence base around them.

!!! success "Design rationale"
    The review found that relevant readiness conditions were distributed across multiple instruments. HDRL integrates them at system and service level for the specific purpose of trusted, federated health data research.

---

## 56-Framework Evidence Base

The structured landscape review identified **56 frameworks** across seven domains:

| Domain | Frameworks | Key Exemplars |
|:-------|:---------:|:--------------|
| Data governance & management | 8 | CMMI-DMM, DAMA-DMBOK, EDM Council DCAM |
| Health-specific | 12 | OECD Health Data Governance, WHO SCORE, HIMSS EMRAM, B1MG MLM* |
| Research infrastructure | 9 | EOSC Readiness, RDA FAIR DMM, NIH DMSP |
| Digital government | 7 | UN EGDI, World Bank GTMI, OECD DGI |
| Data quality & FAIR | 8 | RDA FAIR Data Maturity Model, WHO DQR, ISO 8000 |
| Workforce capacity | 6 | ESSENCE Framework (TDR/WHO), NHS NCF, WHO HWF Assessment |
| National strategies | 6 | Various national data strategies with maturity components |

*B1MG MLM was practitioner-nominated by the lead author (seeded from direct application in the Jordan Population Genome Programme), not independently surfaced by the three AI models — see Key Sources.

Each framework was analysed across eleven extraction elements including purpose, domain structure, indicator design, measurement approach, level architecture, validation evidence, strengths, limitations, and relevance to health data research.

---

## Three Research Tasks

### Task 1: Structured Framework Review

Identification and comparative analysis of existing maturity and readiness frameworks. This established the evidence base for domain selection, indicator design, and level architecture.

### Task 2: Jurisdictional Evidence Review

Analysis of health data research ecosystems across:

- **High-income exemplars:** UK, Nordic countries, Singapore, Australia, Canada, Estonia
- **Middle-income contexts:** India, Jordan, Brazil
- **Lower-resource settings:** Various WHO member states

This ensured the framework reflects real-world variation rather than idealised models.

### Task 3: First-Principles Derivation

Independent derivation — without reference to existing frameworks — of what "readiness for health data research" fundamentally requires:

- **Necessary conditions:** Data existence, accessibility, legal basis, ethical authorisation, minimum sustainability
- **Enabling conditions:** Standardised formats, linkage capability, trained workforce, governance mechanisms, public transparency
- **Excellence conditions:** Real-time availability, population-scale coverage, federated analysis, automated quality monitoring

---

## Architecture Decisions

The framework architecture reflects strong consensus across source frameworks:

### Five Maturity Levels

Level descriptors align with Capability Maturity Model Integration (CMMI) nomenclature: **Initial** (L1), **Developing** (L2), **Defined** (L3), **Managed** (L4), **Optimising** (L5). The use of "Optimising" rather than "Optimised" reflects maturity as a continuous process.

### Eight Domains

High-relevance frameworks operate with 6–11 domains. HDRL's eight domains fall within this range, reflecting synthesis across the capability clusters identified through the evidence base and first-principles analysis.

### Core/Enhancement Classification

Adapted from the Research Data Alliance (RDA) FAIR Data Maturity Model's priority tiers (essential, important, useful). HDRL uses **Core** (essential for baseline participation) and **Enhancement** (good practice for mature organisations).

### Proposed Foundational Indicators

Five indicators designated by HDRL as proposed safety and governance prerequisites within the framework's assessment logic. These are drawn from the first-principles "necessary conditions" analysis and prevent median-based scoring from hiding critical gaps. Their proposed minimum of Level 3 is not an established or current UK Health Data Research Service (HDRS) requirement, or a requirement for any other programme.

---

## Key Sources

| Source | Contribution to HDRL |
|:-------|:--------------------|
| [**FAIR Data Maturity Model: Specification and Guidelines**](https://doi.org/10.15497/RDA00050){ target="_blank" rel="noopener" } (Research Data Alliance, 2020; DOI 10.15497/RDA00050) | Indicator classification and priority tiers |
| [**Electronic Medical Record Adoption Model (EMRAM)**](https://www.himss.org/maturity-models/emram/){ target="_blank" rel="noopener" } (HIMSS) | Validation of staged maturity assessment in healthcare |
| [**Data Management Capability Assessment Model (DCAM) v3**](https://edmcouncil.org/frameworks/dcam/){ target="_blank" rel="noopener" } (EDM Council) | Capability-based assessment and hierarchical indicator structure |
| [**Planning, Monitoring and Evaluation Framework for Research Capacity Strengthening**](https://tdr.who.int/publications/m/item/planning-monitoring-and-evaluation-framework-for-capacity-strengthening-in-health-research){ target="_blank" rel="noopener" } (ESSENCE/TDR, 2016 revision) | Multi-level assessment through System/Service/Both tags |
| [**Recommendation of the Council on Health Data Governance**](https://legalinstruments.oecd.org/en/instruments/OECD-LEGAL-0433){ target="_blank" rel="noopener" } (OECD/LEGAL/0433) | Normative foundation for Domains C and E |
| [**The Five Safes: A framework for planning, designing and evaluating data access solutions**](https://doi.org/10.5281/zenodo.897821){ target="_blank" rel="noopener" } (Ritchie, 2017; originating in ONS practice) | Governance model operationalised across Domains C and H |
| [**B1MG D5.1: B1MG Maturity Level Model and Country-Specific Alignment within the Model**](https://doi.org/10.5281/zenodo.6587561) (Costa, Cardoso, Konopko, Pérez Sitjà, Lopes et al., 2022) | Precedent for HDRL's domain × level self-assessment architecture; applied directly by the lead author in national genomic-medicine implementation work (Jordan Population Genome Programme) |
| [**Building Trusted Research Environments: Principles and Best Practices**](https://doi.org/10.5281/zenodo.5767586){ target="_blank" rel="noopener" } (UK Health Data Research Alliance and NHSX, 2021; DOI 10.5281/zenodo.5767586) | TRE operational requirements informing Domain H |
| [**SATRE: Standardised Architecture for Trusted Research Environments**](https://doi.org/10.5281/zenodo.10055345){ target="_blank" rel="noopener" } (DARE UK, 2023; version 1.0) | TRE capability tiers informing H.1.1 |
| [**CMMI Levels of Capability and Performance**](https://cmmiinstitute.com/learning/appraisals/levels){ target="_blank" rel="noopener" } (CMMI Institute) | Maturity-level nomenclature and progression logic |

## Later Related Work

[Luong and colleagues' federated TRE maturity-model framework](https://doi.org/10.3389/fdgth.2026.1699125){ target="_blank" rel="noopener" } was published in 2026, after HDRL v1.0 had been developed and first applied. It is therefore **not a source used to develop HDRL**. It is included as later related work because it addresses the complementary problem of preparing networks of Trusted Research Environments for federation.

---

## Field application and further validation

Version 1.0 was applied formatively across three distinct UK jurisdictions using documentary evidence, stakeholder interviews, national workshops, structured Right of Reply, cross-nation calibration and two research use-case stress tests. This demonstrated practical feasibility across heterogeneous institutional models; it was not designed as psychometric validation or a national league table.

Further validation is still required. Priorities include independent expert and public content-validity review, scoring by multiple assessors, formal inter-rater reliability testing, sensitivity analysis, prospective application and refinement of Level 4 and Level 5 thresholds using benchmark data. The framework and any assessment results should therefore be presented as evidence-informed and formatively applied, not as a fully validated accreditation instrument.

<div class="hdrl-next" markdown>

## Continue exploring

<div class="hdrl-button-grid" markdown>
[See the maturity levels](maturity-levels.md){ .md-button .md-button--primary }
[Understand indicator classification](classification.md){ .md-button }
[Use the framework](using-the-framework.md){ .md-button }
</div>

</div>
