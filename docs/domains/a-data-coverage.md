# Domain A: Data Coverage & Federation

<span class="domain-ref" style="color: #3b82f6;">THE ASSET INVENTORY</span>

**Focus:** Availability, linkage, and flow of health data for research

**Indicators:** 10 (8 Core, 2 Enhancement)

!!! quote "The business question"
    Do we actually have the data researchers want? Without this, the shop shelves are empty.

Data coverage is the foundation of any health data research service. If core datasets — primary care, hospital episodes, mortality, prescribing — are unavailable or incomplete, no amount of governance or infrastructure investment can compensate. This domain also assesses whether data can be linked across sources and federated across organisational boundaries, which is critical for the UK's multi-nation architecture.

---

## Indicator Summary

| ID | Indicator | Type | Class | Unit |
|:---|:----------|:-----|:------|:-----|
| A.1.1 | Core Dataset Availability | Core | B0 | System |
| A.1.2 | Data Currency & Timeliness | Core | B0 | System |
| A.1.3 | Data Equity & Representativeness | Core | B0 | System |
| A.2.1 | Patient Identifier Infrastructure | Core | B0 | System |
| A.2.2 | Linkage Services | Core | B0 | Both |
| A.3.1 | Federated Query Capability | Enhancement | O | Both |
| A.3.2 | UK Gateway Connectivity | Core | B0 | Both |
| A.3.3 | Federation Operating Model & Assurance | Core | B0 | Both |
| A.4.1 | Consented Cohort Integration | Enhancement | C2 | System |
| A.4.2 | Multi-Modal Data Access | Enhancement | C3 | System |

---

## A.1 — Secondary Use Data Flows

### A.1.1 Core Dataset Availability
**CORE** · **B0** · **System**

| Level | Description |
|:------|:------------|
| **L1** | No systematic inventory. Data flows ad-hoc. Core datasets (primary care, secondary care, prescribing, mortality) have unknown or highly restricted availability. |
| **L2** | Inventory initiated. Feasibility assessed. Strategy documented. Pilot agreements in discussion. |
| **L3** | Core datasets partially available: secondary care and mortality accessible; primary care <50% coverage or not refreshed; prescribing not linked. |
| **L4** | Core datasets available with >= 70% population coverage. Refreshed at least quarterly. Data sharing agreements with major providers. |
| **L5** | Core datasets >= 90% coverage with monthly refresh. Automated flows. Proactive provider engagement. Coverage gaps systematically addressed. |

### A.1.2 Data Currency & Timeliness
**CORE** · **B0** · **System**

| Level | Description |
|:------|:------------|
| **L1** | Currency unknown or variable. Some datasets years out of date. No monitoring. |
| **L2** | Requirements defined. Baseline measured. Targets established but not achieved. |
| **L3** | Core datasets refreshed within 6 months. Latency monitored. Some achieve monthly; others delayed. |
| **L4** | Refreshed quarterly, median latency <= 120 days. SLAs met >= 80%. |
| **L5** | Median <= 60-day latency. Near-real-time for priority use cases. SLAs met >= 95%. |

### A.1.3 Data Equity & Representativeness
**CORE** · **B0** · **System**

| Level | Description |
|:------|:------------|
| **L1** | No assessment of coverage by demographic/socioeconomic characteristics. Representativeness unknown. |
| **L2** | Equity dimensions identified (deprivation, ethnicity, geography, age, sex). Baseline assessment initiated. |
| **L3** | Coverage monitored by key dimensions. Known gaps documented. Improvement actions identified but not systematic. |
| **L4** | Routine monitoring by deprivation, ethnicity, geography, protected characteristics. Annual equity reporting. Active programmes to address gaps. |
| **L5** | Comprehensive equity framework with published reports. Demonstrated improvement. Equity embedded in acquisition priorities. Contributing to national guidance. |

---

## A.2 — Identity & Linkage

### A.2.1 Patient Identifier Infrastructure
**CORE** · **B0** · **System**

| Level | Description |
|:------|:------------|
| **L1** | No consistent identifier. Probabilistic matching with significant errors. |
| **L2** | National identifier exists but incomplete adoption. Strategy documented. Interim approaches defined. |
| **L3** | Identifier (CHI, NHS number) used in majority of datasets. Deterministic linkage for most core datasets. |
| **L4** | Identifier consistently applied across core datasets. Linkage accuracy >= 99%. Validation in place. |
| **L5** | Universal identifier across all datasets including cohorts and multi-modal. Externally validated. Supports cross-UK linkage. |

### A.2.2 Linkage Services
**CORE** · **B0** · **Both**

| Level | Description |
|:------|:------------|
| **L1** | No dedicated service. Linkage ad-hoc with inconsistent methodology. |
| **L2** | Function identified. Methodology documented. Available for selected projects. |
| **L3** | Operational service. Standard process. Turnaround variable (weeks to months). Limited combinations. |
| **L4** | Routinely available with SLAs. Turnaround <= 4 weeks. Flexible linkage. Quality metrics reported. |
| **L5** | Turnaround <= 2 weeks. Automated workflows. Advanced capabilities (fuzzy matching, privacy-preserving). |

---

## A.3 — Federation & Interoperability

### A.3.1 Federated Query Capability
**ENHANCEMENT** · **O** · **Both**

| Level | Description |
|:------|:------------|
| **L1** | No federated capability. All analysis requires data transfer. |
| **L2** | Concepts understood. Options assessed. Pilot in planning. |
| **L3** | Federated possible for selected datasets. Bespoke setup. Limited tools. |
| **L4** | Routinely supported. Standard APIs. Compatible with DataSHIELD, OHDSI. |
| **L5** | Default for appropriate uses. Rich API ecosystem. Active in UK/international networks. |

### A.3.2 UK Gateway Connectivity
**CORE** · **B0** · **Both**

| Level | Description |
|:------|:------------|
| **L1** | No awareness of UK Gateway specs. Architecture does not consider UK-wide interoperability. |
| **L2** | Specs reviewed. Gap analysis completed. Roadmap defined. |
| **L3** | Architecture aligned. Connectivity in development/testing. Manual workarounds required. |
| **L4** | Operational connectivity. Metadata discoverable. Standard requests flow through Gateway. |
| **L5** | Full integration with automated sync. Complex UK-wide queries supported. Contributing to standards. |

### A.3.3 Federation Operating Model & Assurance
**CORE** · **B0** · **Both**

| Level | Description |
|:------|:------------|
| **L1** | No federation operating model. Roles and cross-node processes undefined. |
| **L2** | Draft operating model. Limited bilateral agreements; inconsistent use. |
| **L3** | Model used for priority pathways. Issues logged; assurance limited. |
| **L4** | Standard model in routine use. Cross-node SOPs and performance reporting. |
| **L5** | Optimised federation. Joint improvement cycle and independent assurance/benchmarking. |

---

## A.4 — Multi-Modal & Cohort Data

### A.4.1 Consented Cohort & Biobank Integration
**ENHANCEMENT** · **C2** · **System**

!!! note "Capability module"
    This indicator is mandatory only if claiming HDRS Capability 2 (Consented cohort data).

| Level | Description |
|:------|:------------|
| **L1** | No systematic linkage to cohorts/biobanks. |
| **L2** | Key cohorts identified. Consent reviewed. Pilot planned. |
| **L3** | Selected cohorts linkable. Bespoke arrangements. Coverage incomplete. |
| **L4** | Major cohorts routinely linkable. Standard processes. Catalogue maintained. |
| **L5** | Comprehensive linkage. Recall-by-genotype. UK-wide cohort integration. |

### A.4.2 Multi-Modal Data Access
**ENHANCEMENT** · **C3** · **System**

!!! note "Capability module"
    This indicator is mandatory only if claiming HDRS Capability 3 (Multi-modal data).

| Level | Description |
|:------|:------------|
| **L1** | Multi-modal data (imaging, genomics, pathology, clinical letters) not available. |
| **L2** | Strategy defined. Priority types identified. Pilot planned. |
| **L3** | Selected multi-modal available. Coverage incomplete; linkage partial. |
| **L4** | Routine access to >= 2 types with >= 25% coverage each. Linked to core datasets. |
| **L5** | Comprehensive access: imaging, genomics, pathology, clinical letters. Population-scale. NLP-processed text. |
