# Indicator Classification

HDRL uses a dual classification system: the original **Core/Enhancement** distinction for continuity, plus an explicit **Applicability Class** for role-based assessment.

---

## Indicator Type

| Type | Description |
|:-----|:------------|
| **Core** | Essential controls and capabilities for participation |
| **Enhancement** | Improves quality, efficiency, and scale but is not required for baseline participation |

## Applicability Class

| Class | Name | Description |
|:------|:-----|:------------|
| **B0** | Baseline Core | Mandatory for *any* system/service claiming HDRS participation (the "licence to operate" set) |
| **Cx** | Capability Core | Mandatory **only if** a system/service claims the relevant HDRS capability x (1-6) |
| **O** | Optional / Enhancement | Good practice; informs roadmaps but not required for baseline or capability readiness |
| **Y** | Outcome / Context | Reported for awareness and benefit tracking but **excluded from readiness scoring** |

!!! note "Important"
    Some indicators labelled as *Enhancement* are **capability-defining** (e.g., multi-modal data access, trial acceleration) and are treated as **Cx** when assessing that capability.

## Unit of Assessment Tags

| Tag | Level | Description |
|:----|:------|:------------|
| **S** | System | Nation or health system level |
| **V** | Service | Individual SDE or data service level |
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
| **Hard Controls** | 5 |

## Scoring Rules

- **Domain scores**: Median of Core indicators excluding Outcome/Context (Y) within the domain
- **Baseline assessment**: Focus on B0 indicators
- **Capability assessment**: Score the subset mapped to that capability (including capability-defining enhancements)
- **Enhancement indicators**: Inform the overall picture and roadmap but do not affect baseline domain scores
- **Outcome/Context (Y)**: Reported separately, do not affect readiness scoring
