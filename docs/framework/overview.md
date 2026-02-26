# Framework Overview

## Purpose and Scope

The **Health Data Readiness Level (HDRL)** Assessment Framework provides a common language for understanding capabilities, identifying gaps, and planning investments across the UK's health data infrastructure.

HDRS aims to create federated UK-wide infrastructure for health data research. HDRL provides a standardised way to assess how ready organisations and systems are to participate in this vision.

**Designed for:**

- Programme leadership
- Health data organisations
- Policy makers and funders
- UK Health Data Research Alliance members

## Development Approach

The HDRL Framework was developed through systematic evidence synthesis and first-principles analysis. **Three frontier AI models independently reviewed 56 existing frameworks** across data governance, health information systems, research infrastructure, and workforce capacity domains. Outputs were triangulated to identify areas of consensus and disagreement, with all findings verified against primary sources.

!!! success "Key finding"
    No existing framework comprehensively addresses health data research readiness. While mature frameworks exist for general data management (DCAM, DAMA-DMBOK), health information systems (HIMSS EMRAM, WHO SCORE), and FAIR data practices (RDA FAIR DMM), none integrates these dimensions for assessing readiness to participate in multi-site health data research infrastructure.

The framework architecture reflects strong consensus across source frameworks:

- **5 maturity levels** — aligned with CMMI nomenclature
- **8 domains** — within the 6-11 range observed across sources
- **Core/Enhancement classification** — adapted from RDA FAIR's priority tiers

## Bridging the Gap

HDRL fills the "missing middle" between abstract principles and detailed technical specifications:

| Layer | Examples | Nature |
|:------|:---------|:-------|
| **High-Level Principles** | Five Safes, Alliance Principles | Abstract guidance |
| **HDRL Framework** | Organisational Readiness & Investment Roadmap | *"Are we organisationally ready to deliver?"* |
| **Technical Specifications** | SATRE, NHS SDE Specs, ISO 27001 | Detailed requirements |

## Unit of Assessment

HDRL can be applied at multiple levels. Each indicator is tagged:

| Tag | Level | Description |
|:----|:------|:------------|
| **S** | System | Nation or health system level. Policy, legal framework, population infrastructure. Services inherit these scores. |
| **V** | Service | Individual SDE or data service level. Operational delivery specific to that service. |
| **B** | Both | Can be assessed at either level. Score may differ between levels. |

### Assessment Approaches

=== "System-Level"
    When assessing a nation/system as HDRS node: assess all indicators; for V indicators, assess primary service or aggregate across services.

=== "Service-Level"
    When assessing individual SDE: focus on V and B indicators; inherit S indicators from national context or mark N/A.

=== "Dual-Level"
    For comprehensive view, conduct both. This reveals whether gaps are systemic (policy/investment) or operational (individual service).

## HDRS Capabilities

Indicators map to six HDRS capabilities:

1. **Linked national-scale data**
2. **Consented cohort data**
3. **Multi-modal data**
4. **Trial acceleration**
5. **Single-entry point with secure environments**
6. **Cross-sector linkage**

## Aggregation & Interpretation

HDRL supports roadmap development rather than pass/fail judgements.

**Domain Scores:** Calculate as the median of Core indicators (excluding Outcome/Context) within the domain.

### Indicative Readiness Profiles

| Profile | Characteristics |
|:--------|:----------------|
| **Emerging** | Majority of Baseline Core at Level 1-2. Significant foundational work required. |
| **Developing** | Majority of Baseline Core at Level 2-3. Active improvement. May participate with roadmap and support. |
| **Managed** | Majority of Baseline Core at Level 3-4, none below Level 2. Meets baseline requirements. |
| **Optimising** | Majority of Baseline Core at Level 4-5. Exceeds baseline. Potential exemplar. |

!!! important
    These profiles support planning, not accreditation. HDRS participation decisions are made through separate governance.
