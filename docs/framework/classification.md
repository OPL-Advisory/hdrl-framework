# Indicator Classification

The **Health Data Readiness Level (HDRL)** Framework uses a dual classification system: the original **Core/Enhancement** distinction for continuity, plus an explicit **Applicability Class** for role-based assessment.

!!! important "How to read 'mandatory'"
    The classification terms below describe the internal logic of HDRL assessments. They do not create official UK Health Data Research Service (HDRS) participation requirements—or requirements for any other programme—and do not replace decisions made through legal, governance, assurance or programme processes.

---

## Indicator Type

| Type | Description |
|:-----|:------------|
| **Core** | Essential controls and capabilities for participation |
| **Enhancement** | Improves quality, efficiency, and scale but is not required for baseline participation |

## Applicability Class

| Class | Name | Description |
|:------|:-----|:------------|
| **B0** | Baseline Core | Treated as mandatory for baseline participation within HDRL v1.0's internal assessment logic |
| **Cx** | Capability Core | Mandatory within HDRL v1.0 **only when** assessing capability module x (1–6) from the original project mapping |
| **O** | Optional / Enhancement | Good practice; informs roadmaps but not required for baseline or capability readiness |
| **Y** | Outcome / Context | Reported for awareness and benefit tracking but **excluded from readiness scoring** |

The C1–C6 codes refer back to the six goals described in the [initial HDRS capability mapping](overview.md#initial-hdrs-capability-mapping). Three related but distinct mappings need to be kept separate:

1. **Applicability Class (`Cx`)** identifies the seven capability-defining indicators in HDRL v1.0.
2. **Section 7 of the canonical applied-v1 method source** provides the broader indicator-to-capability map, including cross-cutting and other indicators relevant to each capability.
3. **The 3 Nations assessment** used a selected subset of the broader mapping.

### Capability-defining `Cx` indicators

The table below shows the indicators whose **Applicability Class contains a C code**.

| Code | Original capability or goal | Capability-defining indicators in HDRL v1.0 |
|:-----|:----------------------------|:---------------------------------------------|
| **C1** | Linked national-scale data | B.1.1 Common Data Model Adoption; B.1.2 Terminology Standards |
| **C2** | Consented cohort data | A.4.1 Consented Cohort Integration |
| **C3** | Multi-modal data | A.4.2 Multi-Modal Data Access; H.4.2 Responsible AI Practices (shared C3/4) |
| **C4** | Trial acceleration | D.4.1 Trial Data & Recruitment; H.4.2 Responsible AI Practices (shared C3/4) |
| **C5** | Single-entry point with secure environments | No separate C5-class indicator. In HDRL v1.0 this goal was represented primarily through B0 indicators and their original capability mapping. |
| **C6** | Cross-sector linkage | C.3.3 Cross-sector Linkage Governance |

### Capability subsets used in the 3 Nations assessment

The subset of indicators used to assess readiness for the six HDRS capabilities as part of the 3 Nations assessment is shown in the table below.

| Code | Original capability or goal | Indicators included in the 3 Nations capability assessment |
|:-----|:----------------------------|:-------------------------------------------------------------|
| **C1** | Linked national-scale data | A.1.1 Core Dataset Availability; A.2.1 Patient Identifier Infrastructure; A.2.2 Linkage Services; B.1.1 Common Data Model Adoption; B.1.2 Terminology Standards; B.2.1 Quality Framework & Monitoring; E.3.1 Opt-Out Management |
| **C2** | Consented cohort data | A.2.2 Linkage Services; A.4.1 Consented Cohort Integration; C.4.3 Consent, Permissions & Restrictions |
| **C3** | Multi-modal data | A.4.2 Multi-Modal Data Access; H.2.1 Compute Scalability; H.4.1 ML/AI Platform Capability; H.4.2 Responsible AI Practices |
| **C4** | Trial acceleration | A.1.2 Data Currency & Timeliness; D.4.1 Trial Data & Recruitment; H.4.2 Responsible AI Practices |
| **C5** | Single-entry point with secure environments | C.2.1 Time-to-Data; C.2.2 Data Access Committee; C.3.1 Mutual Recognition & Standards; H.1.1 SDE Architecture & Standards; H.3.1 Security Certification & Audit; H.3.2 Security Operations |
| **C6** | Cross-sector linkage | A.2.1 Patient Identifier Infrastructure; C.3.3 Cross-sector Linkage Governance |

!!! note "Why C5 appears differently in the two tables"
    C5 has no indicator with a `C5` Applicability Class, so it has no capability-defining row in the first sense. The 3 Nations assessment nevertheless used six mapped B0 indicators for its C5 capability assessment. That assessment rule did not convert those indicators into `C5` indicators or alter their classifications.

The broader map is available in [Section 7 of the canonical applied-v1 method source](applied-v1-reference-files.md). The subsets above form part of the 3 Nations assessment method, not a current HDRS requirement or a universal rule for future HDRL use.

!!! note "Important"
    Some indicators labelled as *Enhancement* are **capability-defining** (e.g., multi-modal data access, trial acceleration) and are treated as **Cx** when assessing that capability.

!!! warning "Why the C1–C6 codes remain"
    The six modules preserve the capability proposition described by the Department of Health and Social Care and Wellcome at the start of the HDRS programme in 2025. They are retained so that HDRL v1.0 and the 3 Nations assessment remain reproducible; they are not a claim about the capability set that current HDRS leadership will take forward. Users outside HDRS can apply the baseline, optional and outcome/context classifications without adopting this programme-specific mapping.

## Unit of Assessment Tags

| Tag | Level | Description |
|:----|:------|:------------|
| **S** | System | Nation or health system level |
| **V** | Service | Individual secure data environment (SDE) or data service level |
| **B** | Both | Can be assessed at either level |

## Statistics

The framework uses several classifications for different purposes. **Type**, **Applicability Class** and **Unit** are three separate ways of partitioning the same 64 indicators; they should not be added together across groups.

**By indicator type — complete partition of 64**

| Type | Count |
|:-----|------:|
| Core | 43 |
| Enhancement | 21 |
| **Total** | **64** |

**By applicability class — complete partition of 64**

| Class | Count |
|:------|------:|
| Baseline Core (B0) | 37 |
| Capability Core (Cx) | 7 |
| Optional / Enhancement (O) | 16 |
| Outcome / Context (Y) | 4 |
| **Total** | **64** |

**By unit of assessment — complete partition of 64**

| Unit | Count |
|:-----|------:|
| System (S) | 11 |
| Service (V) | 14 |
| Both (B) | 39 |
| **Total** | **64** |

**Cross-cutting designation:** the five proposed Foundational Indicators are a subset of the 37 Baseline Core indicators. They are not an additional class and should not be added to the class totals.

## Scoring Rules

- **Domain scores**: Median of Core indicators excluding Outcome/Context (Y) within the domain
- **Baseline assessment**: Focus on B0 indicators
- **Capability assessment**: Score the subset mapped to that capability (including capability-defining enhancements)
- **Enhancement indicators**: Inform the overall picture and roadmap but do not affect baseline domain scores
- **Outcome/Context (Y)**: Reported separately, do not affect readiness scoring

<div class="hdrl-next" markdown>

## Continue exploring

<div class="hdrl-button-grid" markdown>
[Review the proposed Foundational Indicators](foundational-requirements.md){ .md-button .md-button--primary }
[Open the quick reference](quick-reference.md){ .md-button }
[Return to the framework overview](overview.md){ .md-button }
</div>

</div>
