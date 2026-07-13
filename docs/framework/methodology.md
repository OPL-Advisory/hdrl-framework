# Methodology

## How the Framework Was Developed

The HDRL Framework was developed through a combination of **structured evidence synthesis**, **first-principles analysis**, and **stakeholder calibration**. This page documents the approach, evidence base, and key design decisions.

---

## Multi-Model AI Synthesis

**Three AI models** (Claude, Gemini, and ChatGPT) independently reviewed the framework landscape against identical research specifications. Outputs were then triangulated to assess confidence:

| Confidence Level | Definition | Count |
|:-----------------|:-----------|------:|
| **High (concordance)** | Identified by all three models | 24 frameworks |
| **Medium (partial consensus)** | Identified by two models | 18 frameworks |
| **Verified unique** | From single model, verified against primary sources | 14 frameworks |

This approach widened coverage and made areas of agreement and disagreement visible. AI outputs were used as synthesis aids, not as sources of authority: retained claims were checked by a human reviewer against primary or authoritative sources, and framework-design decisions remained human decisions.

!!! success "Design rationale"
    The review found that relevant readiness conditions were distributed across multiple instruments. HDRL integrates them at system and service level for the specific purpose of trusted, federated health data research.

---

## 56-Framework Evidence Base

The structured landscape review identified **56 frameworks** across seven domains:

| Domain | Frameworks | Key Exemplars |
|:-------|:---------:|:--------------|
| Data governance & management | 8 | CMMI-DMM, DAMA-DMBOK, EDM Council DCAM |
| Health-specific | 12 | OECD Health Data Governance, WHO SCORE, HIMSS EMRAM |
| Research infrastructure | 9 | EOSC Readiness, RDA FAIR DMM, NIH DMSP |
| Digital government | 7 | UN EGDI, World Bank GTMI, OECD DGI |
| Data quality & FAIR | 8 | RDA FAIR Data Maturity Model, WHO DQR, ISO 8000 |
| Workforce capacity | 6 | ESSENCE Framework (TDR/WHO), NHS NCF, WHO HWF Assessment |
| National strategies | 6 | Various national data strategies with maturity components |

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

Level descriptors align with CMMI nomenclature: **Initial** (L1), **Developing** (L2), **Defined** (L3), **Managed** (L4), **Optimising** (L5). The use of "Optimising" rather than "Optimised" reflects maturity as a continuous process.

### Eight Domains

High-relevance frameworks operate with 6–11 domains. HDRL's eight domains fall within this range, reflecting synthesis across the capability clusters identified through the evidence base and first-principles analysis.

### Core/Enhancement Classification

Adapted from the RDA FAIR Data Maturity Model's priority tiers (essential, important, useful). HDRL uses **Core** (essential for baseline participation) and **Enhancement** (good practice for mature organisations).

### Proposed Foundational Indicators

Five indicators designated by HDRL as proposed safety and governance prerequisites within the framework's assessment logic. These are drawn from the first-principles "necessary conditions" analysis and prevent median-based scoring from hiding critical gaps. Their proposed minimum of Level 3 is not an established HDRS requirement.

---

## Key Sources

| Source | Contribution to HDRL |
|:-------|:--------------------|
| **RDA FAIR Data Maturity Model** (2020) | Indicator classification and priority tiers |
| **HIMSS EMRAM** | Validation of staged maturity assessment in healthcare |
| **EDM Council DCAM** | Capability-based assessment and hierarchical indicator structure |
| **ESSENCE Framework** (TDR/WHO, 2016) | Multi-level assessment through System/Service/Both tags |
| **OECD Health Data Governance** (2016/2022) | Normative foundation for Domains C and E |
| **Five Safes Framework** (Ritchie, ONS) | Governance model operationalised across Domains C and H |
| **Building Trusted Research Environments** (UK HDRA, 2021) | TRE operational requirements informing Domain H |
| **SATRE Specification** (DARE UK, 2023) | TRE capability tiers informing H.1.1 |
| [**Federated TRE maturity-model framework**](https://doi.org/10.3389/fdgth.2026.1699125) (Luong et al., 2026) | Related six-domain model for federated TRE networks; published after HDRL v1.0 was developed |
| **CMMI** | Maturity level nomenclature and progression logic |

---

## Field application and further validation

Version 1.0 was applied formatively across three distinct UK jurisdictions using documentary evidence, stakeholder interviews, national workshops, structured Right of Reply, cross-nation calibration and two research use-case stress tests. This demonstrated practical feasibility across heterogeneous institutional models; it was not designed as psychometric validation or a national league table.

Further validation is still required. Priorities include independent expert and public content-validity review, scoring by multiple assessors, formal inter-rater reliability testing, sensitivity analysis, prospective application and refinement of Level 4 and Level 5 thresholds using benchmark data. The framework and any assessment results should therefore be presented as evidence-informed and formatively applied, not as a fully validated accreditation instrument.
