# Framework Overview

## Purpose and Scope

The **Health Data Readiness Level (HDRL)** Assessment Framework provides a common language for understanding capabilities, identifying gaps, and planning investments across health data research services, networks and systems.

HDRL is not tied to one national programme or institutional model. It can support improvement planning for individual data services, national or regional systems, and federated networks in the UK and internationally, provided the assessment scope, governance context and terminology are made explicit.

The framework's first field application examined the potential readiness of organisations and systems to participate in the emerging UK **Health Data Research Service (HDRS)**. That application is an important origin and test case, not the limit of the framework's relevance.

!!! important "Positioning"
    HDRL is an independently developed planning and assessment instrument. It complements existing principles, standards and assurance processes; it does not replace them and is not an official HDRS or other programme accreditation or participation standard.

**Designed for:**

- Programme leadership
- Health data organisations
- Policy makers and funders
- National and international health data networks
- Researchers, public contributors and industry partners

## Development Approach

The HDRL Framework was developed through a structured landscape review and first-principles analysis. **Three AI models independently reviewed 56 existing frameworks** across data governance, health information systems, research infrastructure, and workforce capacity domains. Outputs were triangulated to identify areas of consensus and disagreement, with retained claims checked by a human reviewer against primary or authoritative sources.

!!! success "Design rationale"
    Relevant conditions were distributed across multiple instruments rather than operationalised in one assessment at the system-and-service scope required for this project. HDRL brings those conditions together for the specific challenge of trusted, federated health data research.

The framework architecture reflects strong consensus across source frameworks:

- **5 maturity levels** — aligned with Capability Maturity Model Integration (CMMI) nomenclature
- **8 domains** — within the 6-11 range observed across sources
- **Core/Enhancement classification** — adapted from the Research Data Alliance (RDA) FAIR Data Maturity Model's priority tiers

## Bridging the Gap

HDRL fills the "missing middle" between abstract principles and detailed technical specifications:

| Layer | Examples | Nature |
|:------|:---------|:-------|
| **High-Level Principles** | Five Safes, Alliance Principles | Abstract guidance |
| **HDRL Framework** | Organisational Readiness & Investment Roadmap | *"Are we organisationally ready to deliver?"* |
| **Technical Specifications** | SATRE, National Health Service secure data environment specifications, ISO 27001 | Detailed requirements |

## Relationship to Federated TRE Maturity Work

[Luong and colleagues' 2026 maturity-model framework](https://doi.org/10.3389/fdgth.2026.1699125){ target="_blank" rel="noopener" } addresses the related problem of preparing networks of Trusted Research Environments (TREs) for federation. It proposes six high-level domains and maps them to the Standardised Architecture for Trusted Research Environments (SATRE) and the DARE UK Federated Architecture Blueprint, while identifying indicators and maturity descriptors as areas for further development and validation.

HDRL does not claim exclusivity in this field. Its distinct contribution is a broader system-and-service readiness lens, operationalised through 64 indicators across eight domains and formatively applied across three heterogeneous national settings. It includes data coverage and semantics, research delivery, public trust, sustainability and workforce alongside governance and technical infrastructure. The two approaches are complementary rather than interchangeable.

## Unit of Assessment

HDRL can be applied at multiple levels. Each indicator is tagged:

| Tag | Level | Description |
|:----|:------|:------------|
| **S** | System | Nation or health system level. Policy, legal framework, population infrastructure. Services inherit these scores. |
| **V** | Service | Individual secure data environment (SDE) or data service level. Operational delivery specific to that service. |
| **B** | Both | Can be assessed at either level. Score may differ between levels. |

### Assessment Approaches

=== "System-Level"
    When assessing a nation or system: assess all indicators; for V indicators, assess the primary service or aggregate across services.

=== "Service-Level"
    When assessing an individual secure data environment or data service: focus on V and B indicators; inherit S indicators from the wider system context or mark them not applicable.

=== "Dual-Level"
    For comprehensive view, conduct both. This reveals whether gaps are systemic (policy/investment) or operational (individual service).

## Initial HDRS Capability Mapping

When HDRL v1.0 was developed, the Department of Health and Social Care and Wellcome described six intended capabilities or goals for the emerging Health Data Research Service. HDRL retained a mapping to those six areas so that capability-specific indicators could be identified during the 3 Nations Readiness Assessment:

1. **Linked national-scale data**
2. **Consented cohort data**
3. **Multi-modal data**
4. **Trial acceleration**
5. **Single-entry point with secure environments**
6. **Cross-sector linkage**

!!! warning "Historical programme context, not a current commitment"
    This six-part mapping records the proposition available at the start of the assessment in 2025. It should not be read as a statement of the service model or capability set that the current HDRS leadership will adopt. The programme may retain, refine, combine or replace those capabilities. They remain visible here so that HDRL v1.0 and the 3 Nations assessment are reproducible.

For use beyond HDRS, assessors should define the capabilities and outcomes relevant to their own service, network or system. The eight domains, maturity levels and evidence approach can be used without adopting the six-part HDRS mapping. Any formal remapping of the C1–C6 tags should be recorded as an adaptation rather than silently presented as unchanged HDRL v1.0.

[Read Wellcome's description of the six original goals](https://wellcome.org/research-funding/funding-portfolio/major-initiatives/health-data-research-service){ target="_blank" rel="noopener" }.

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
    These profiles support planning, not accreditation. A maturity level does not guarantee delivery performance, and participation or assurance decisions for HDRS or any other programme are made through separate governance.
