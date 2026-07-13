# Framework Overview

## Purpose and Scope

The **Health Data Readiness Level (HDRL)** Assessment Framework provides a common language for understanding capabilities, identifying gaps, and planning investments across health data research infrastructure.

HDRS aims to create federated UK-wide infrastructure for health data research. HDRL provides a structured way to assess the potential readiness of organisations and systems to participate in this vision. It may also be adapted to comparable settings beyond the UK where governance and terminology are made explicit.

!!! important "Positioning"
    HDRL is an independently developed planning and assessment instrument. It complements existing principles, standards and assurance processes; it does not replace them and is not an official HDRS accreditation or participation standard.

**Designed for:**

- Programme leadership
- Health data organisations
- Policy makers and funders
- UK Health Data Research Alliance members
- Researchers, public contributors and industry partners

## Development Approach

The HDRL Framework was developed through a structured landscape review and first-principles analysis. **Three AI models independently reviewed 56 existing frameworks** across data governance, health information systems, research infrastructure, and workforce capacity domains. Outputs were triangulated to identify areas of consensus and disagreement, with retained claims checked by a human reviewer against primary or authoritative sources.

!!! success "Design rationale"
    Relevant conditions were distributed across multiple instruments rather than operationalised in one assessment at the system-and-service scope required for this project. HDRL brings those conditions together for the specific challenge of trusted, federated health data research.

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

## Relationship to Federated TRE Maturity Work

[Luong and colleagues' 2026 maturity-model framework](https://doi.org/10.3389/fdgth.2026.1699125){ target="_blank" rel="noopener" } addresses the related problem of preparing networks of Trusted Research Environments for federation. It proposes six high-level domains and maps them to SATRE and the DARE UK Federated Architecture Blueprint, while identifying indicators and maturity descriptors as areas for further development and validation.

HDRL does not claim exclusivity in this field. Its distinct contribution is a broader system-and-service readiness lens, operationalised through 64 indicators across eight domains and formatively applied across three heterogeneous national settings. It includes data coverage and semantics, research delivery, public trust, sustainability and workforce alongside governance and technical infrastructure. The two approaches are complementary rather than interchangeable.

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
    These profiles support planning, not accreditation. A maturity level does not guarantee delivery performance, and HDRS participation decisions are made through separate governance.
