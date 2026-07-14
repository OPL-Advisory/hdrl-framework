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

| Category | Count |
|:---------|------:|
| **Total Indicators** | 64 |
| **Core Indicators** | 43 |
| **Enhancement Indicators** | 21 |
| **Baseline Core (B0)** | 37 |
| **Capability Core (Cx)** | 7 |
| **Optional (O)** | 16 |
| **Outcome/Context (Y)** | 4 |
| **Proposed Foundational Indicators** | 5 |

## Scoring Rules

- **Domain scores**: Median of Core indicators excluding Outcome/Context (Y) within the domain
- **Baseline assessment**: Focus on B0 indicators
- **Capability assessment**: Score the subset mapped to that capability (including capability-defining enhancements)
- **Enhancement indicators**: Inform the overall picture and roadmap but do not affect baseline domain scores
- **Outcome/Context (Y)**: Reported separately, do not affect readiness scoring
