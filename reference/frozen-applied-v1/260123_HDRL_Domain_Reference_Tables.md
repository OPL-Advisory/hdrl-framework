# HDRL Domain Reference Tables

## For Claude Projects Assessment Use

**Framework Version:** 1.0  
**Document Purpose:** Companion reference for HDRL assessments  
**Date:** 23 January 2026

---

## Quick Reference: All Indicators Summary

| ID | Indicator | Type | Class | Tag | Hard Control |
|:---|:----------|:-----|:------|:----|:-------------|
| **Domain A: Data Coverage & Federation** |||||
| A.1.1 | Core Dataset Availability | Core | B0 | S | |
| A.1.2 | Data Currency & Timeliness | Core | B0 | S | |
| A.1.3 | Data Equity & Representativeness | Core | B0 | S | |
| A.2.1 | Patient Identifier Infrastructure | Core | B0 | S | |
| A.2.2 | Linkage Services | Core | B0 | B | |
| A.3.1 | Federated Query Capability | Enh | O | B | |
| A.3.2 | UK Gateway Connectivity | Core | B0 | B | |
| A.3.3 | Federation Operating Model & Assurance | Core | B0 | B | |
| A.4.1 | Consented Cohort Integration | Enh | C2 | S | |
| A.4.2 | Multi-Modal Data Access | Enh | C3 | S | |
| **Domain B: Data Semantics & Quality** |||||
| B.1.1 | Common Data Model Adoption | Core | C1 | B | |
| B.1.2 | Terminology Standards | Core | C1 | B | |
| B.2.1 | Quality Framework & Monitoring | Core | B0 | B | |
| B.2.2 | Data Documentation & Metadata | Core | B0 | B | |
| B.3.1 | Curated Dataset Availability | Enh | O | B | |
| B.3.2 | Phenotype Library & Validation | Enh | O | B | |
| **Domain C: Governance & Access** |||||
| C.1.1 | Legal Basis for Processing | Core | B0 | S | **⚠ HARD CONTROL** |
| C.1.2 | Legislative Environment | Enh | O | S | |
| C.2.1 | Time-to-Data | Core | B0 | B | |
| C.2.2 | Data Access Committee | Core | B0 | B | **⚠ HARD CONTROL** |
| C.2.3 | Ethics Pathway Integration | Core | B0 | B | |
| C.3.1 | Mutual Recognition & Standards | Core | B0 | B | |
| C.3.2 | Cross-Border Legal Alignment | Enh | O | S | |
| C.3.3 | Cross-sector Linkage Governance | Core | C6 | S | |
| C.4.1 | Statistical Disclosure Control | Core | B0 | V | **⚠ HARD CONTROL** |
| C.4.2 | Researcher Accreditation | Core | B0 | B | |
| C.4.3 | Consent, Permissions & Restrictions | Core | B0 | B | |
| **Domain D: Research Integration & Market** |||||
| D.1.1 | Active User Base | Core | Y | B | |
| D.1.2 | Research Output & Impact | Core | Y | B | |
| D.2.1 | Researcher Support & Helpdesk | Core | B0 | V | |
| D.2.2 | Training & Capability Building | Enh | O | V | |
| D.2.3 | Reproducibility & Provenance Support | Core | B0 | V | |
| D.3.1 | Multi-Site Research Capability | Core | B0 | B | |
| D.3.2 | Commercial Access Framework | Enh | O | B | |
| D.4.1 | Trial Data & Recruitment | Enh | C4 | B | |
| **Domain E: Public Trust & Transparency** |||||
| E.1.1 | Public Register of Data Uses | Core | B0 | B | |
| E.1.2 | Annual Transparency Reporting | Core | B0 | B | |
| E.2.1 | Lay Involvement in Governance | Core | B0 | B | |
| E.2.2 | Public Engagement Capacity | Enh | O | B | |
| E.3.1 | Opt-Out Management | Core | B0 | S | |
| E.3.2 | Public Benefit & Value | Core | B0 | B | |
| E.3.3 | Legitimacy, Assurance & Learning | Core | B0 | B | |
| **Domain F: Sustainability** |||||
| F.1.1 | Funding Horizon | Core | B0 | B | |
| F.1.2 | Financial Risk Management | Enh | O | B | |
| F.2.1 | Cost Recovery & Pricing | Core | B0 | B | |
| F.2.2 | Commercial Revenue & Partnerships | Enh | O | B | |
| F.3.1 | Economic Impact Assessment | Enh | Y | B | |
| F.3.2 | Value Demonstration | Enh | Y | B | |
| **Domain G: Workforce & Culture** |||||
| G.1.1 | Staff Capacity | Core | B0 | B | |
| G.1.2 | Staff Retention & Development | Enh | O | B | |
| G.1.3 | Strategic Workforce Planning | Enh | O | B | |
| G.2.1 | Role Definition & Professionalization | Core | B0 | B | |
| G.2.2 | Technical Skills | Core | B0 | B | |
| G.3.1 | Service Orientation | Core | B0 | V | |
| G.3.2 | Collaboration & Knowledge Sharing | Enh | O | B | |
| **Domain H: Infrastructure & Compute** |||||
| H.1.1 | SDE Architecture & Standards | Core | B0 | V | |
| H.1.2 | User Environment & Experience | Core | B0 | V | |
| H.2.1 | Compute Scalability | Core | B0 | V | |
| H.2.2 | Storage & Data Management | Enh | O | V | |
| H.3.1 | Security Certification & Audit | Core | B0 | V | **⚠ HARD CONTROL** |
| H.3.2 | Security Operations | Core | B0 | V | **⚠ HARD CONTROL** |
| H.3.3 | Privacy-Enhancing Technologies | Enh | O | V | |
| H.4.1 | ML/AI Platform Capability | Enh | O | V | |
| H.4.2 | Responsible AI Practices | Core | C3/4 | V | |

**Legend:**
- **Type:** Core (essential) / Enh (Enhancement - good practice)
- **Class:** B0 (Baseline Core - mandatory), Cx (Capability x), O (Optional), Y (Outcome/Context - excluded from readiness scoring)
- **Tag:** S (System), V (Service), B (Both)
- **Hard Control:** These 5 indicators require minimum L3 for baseline participation

---

## Domain A: Data Coverage & Federation

**Focus:** Availability, linkage, and flow of health data for research  
**Indicators:** 10 (8 Core, 2 Enhancement)

### A.1.1 Core Dataset Availability [CORE] [B0] [System]

| Level | Description |
|:------|:------------|
| **L1** | No systematic inventory. Data flows ad-hoc. Core datasets (primary care, secondary care, prescribing, mortality) have unknown or highly restricted availability. |
| **L2** | Inventory initiated. Feasibility assessed. Strategy documented. Pilot agreements in discussion. |
| **L3** | Core datasets partially available: secondary care and mortality accessible; primary care <50% coverage or not refreshed; prescribing not linked. |
| **L4** | Core datasets available with >= 70% population coverage. Refreshed at least quarterly. Data sharing agreements with major providers. |
| **L5** | Core datasets >= 90% coverage with monthly refresh. Automated flows. Proactive provider engagement. Coverage gaps systematically addressed. |

### A.1.2 Data Currency & Timeliness [CORE] [B0] [System]

| Level | Description |
|:------|:------------|
| **L1** | Currency unknown or variable. Some datasets years out of date. No monitoring. |
| **L2** | Requirements defined. Baseline measured. Targets established but not achieved. |
| **L3** | Core datasets refreshed within 6 months. Latency monitored. Some achieve monthly; others delayed. |
| **L4** | Refreshed quarterly, median latency <= 120 days. SLAs met >= 80%. |
| **L5** | Median <= 60-day latency. Near-real-time for priority use cases. SLAs met >= 95%. |

### A.1.3 Data Equity & Representativeness [CORE] [B0] [System]

| Level | Description |
|:------|:------------|
| **L1** | No assessment of coverage by demographic/socioeconomic characteristics. Representativeness unknown. |
| **L2** | Equity dimensions identified (deprivation, ethnicity, geography, age, sex). Baseline assessment initiated. |
| **L3** | Coverage monitored by key dimensions. Known gaps documented. Improvement actions identified but not systematic. |
| **L4** | Routine monitoring by deprivation, ethnicity, geography, protected characteristics. Annual equity reporting. Active programmes to address gaps. |
| **L5** | Comprehensive equity framework with published reports. Demonstrated improvement. Equity embedded in acquisition priorities. Contributing to national guidance. |

### A.2.1 Patient Identifier Infrastructure [CORE] [B0] [System]

| Level | Description |
|:------|:------------|
| **L1** | No consistent identifier. Probabilistic matching with significant errors. |
| **L2** | National identifier exists but incomplete adoption. Strategy documented. Interim approaches defined. |
| **L3** | Identifier (CHI, NHS number) used in majority of datasets. Deterministic linkage for most core datasets. |
| **L4** | Identifier consistently applied across core datasets. Linkage accuracy >= 99%. Validation in place. |
| **L5** | Universal identifier across all datasets including cohorts and multi-modal. Externally validated. Supports cross-UK linkage. |

### A.2.2 Linkage Services [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No dedicated service. Linkage ad-hoc with inconsistent methodology. |
| **L2** | Function identified. Methodology documented. Available for selected projects. |
| **L3** | Operational service. Standard process. Turnaround variable (weeks to months). Limited combinations. |
| **L4** | Routinely available with SLAs. Turnaround <= 4 weeks. Flexible linkage. Quality metrics reported. |
| **L5** | Turnaround <= 2 weeks. Automated workflows. Advanced capabilities (fuzzy matching, privacy-preserving). |

### A.3.1 Federated Query Capability [ENHANCEMENT] [O] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No federated capability. All analysis requires data transfer. |
| **L2** | Concepts understood. Options assessed. Pilot in planning. |
| **L3** | Federated possible for selected datasets. Bespoke setup. Limited tools. |
| **L4** | Routinely supported. Standard APIs. Compatible with DataSHIELD, OHDSI. |
| **L5** | Default for appropriate uses. Rich API ecosystem. Active in UK/international networks. |

### A.3.2 UK Gateway Connectivity [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No awareness of UK Gateway specs. Architecture does not consider UK-wide interoperability. |
| **L2** | Specs reviewed. Gap analysis completed. Roadmap defined. |
| **L3** | Architecture aligned. Connectivity in development/testing. Manual workarounds required. |
| **L4** | Operational connectivity. Metadata discoverable. Standard requests flow through Gateway. |
| **L5** | Full integration with automated sync. Complex UK-wide queries supported. Contributing to standards. |

### A.3.3 Federation Operating Model & Assurance [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No federation operating model. Roles and cross-node processes undefined. |
| **L2** | Draft operating model. Limited bilateral agreements; inconsistent use. |
| **L3** | Model used for priority pathways. Issues logged; assurance limited. |
| **L4** | Standard model in routine use. Cross-node SOPs and performance reporting. |
| **L5** | Optimised federation. Joint improvement cycle and independent assurance/benchmarking. |

### A.4.1 Consented Cohort & Biobank Integration [ENHANCEMENT] [C2] [System]

| Level | Description |
|:------|:------------|
| **L1** | No systematic linkage to cohorts/biobanks. |
| **L2** | Key cohorts identified. Consent reviewed. Pilot planned. |
| **L3** | Selected cohorts linkable. Bespoke arrangements. Coverage incomplete. |
| **L4** | Major cohorts routinely linkable. Standard processes. Catalogue maintained. |
| **L5** | Comprehensive linkage. Recall-by-genotype. UK-wide cohort integration. |

### A.4.2 Multi-Modal Data Access [ENHANCEMENT] [C3] [System]

| Level | Description |
|:------|:------------|
| **L1** | Multi-modal data (imaging, genomics, pathology, clinical letters) not available. |
| **L2** | Strategy defined. Priority types identified. Pilot planned. |
| **L3** | Selected multi-modal available. Coverage incomplete; linkage partial. |
| **L4** | Routine access to >= 2 types with >= 25% coverage each. Linked to core datasets. |
| **L5** | Comprehensive access: imaging, genomics, pathology, clinical letters. Population-scale. NLP-processed text. |

---

## Domain B: Data Semantics & Quality

**Focus:** Standardisation, documentation, and quality assurance  
**Indicators:** 6 (4 Core, 2 Enhancement)

### B.1.1 Common Data Model Adoption [CORE] [C1] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No CDM. Data in source formats with bespoke schemas. |
| **L2** | CDM (OMOP, Sentinel, PCORnet, or equivalent) evaluated. Mapping assessed. Pilot planned. |
| **L3** | Core datasets partially mapped. Coverage <50%. CDM available but not routine. |
| **L4** | Core datasets mapped to recognised CDM with >= 60% coverage. CDM maintained and refreshed. Standard tools operational. |
| **L5** | Comprehensive CDM. Externally validated. Contributing to international networks. CDM-native services. |

### B.1.2 Terminology Standards [CORE] [C1] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No consistent standards. Codes as recorded (mixture of Read, ICD-10, OPCS, local). |
| **L2** | Strategy defined. Target standards identified. Baseline assessed. |
| **L3** | Primary standards adopted (SNOMED CT, dm+d for new systems). Legacy retains original. Partial mapping. |
| **L4** | SNOMED CT, dm+d, ICD-10/OPCS consistently applied. Terminology services operational. Limitations documented. |
| **L5** | Full SNOMED CT with semantic interoperability. Advanced services. Contributing to standards. |

### B.2.1 Quality Framework & Monitoring [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No framework. Issues ad-hoc. No monitoring. |
| **L2** | Framework defined. Dimensions identified. Baseline initiated. |
| **L3** | Metrics for core datasets. Annual reporting. Issues documented. Improvement underway. |
| **L4** | Comprehensive monitoring with automated checks. Metrics published. SLAs defined. Root cause analysis. |
| **L5** | Real-time monitoring. Benchmarked nationally/internationally. Certification or audit. |

### B.2.2 Data Documentation & Metadata [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | Minimal documentation. Tacit knowledge. No catalogue. |
| **L2** | Initiative underway. Basic documentation. Catalogue developing. |
| **L3** | Structured metadata for core datasets. Variable quality. |
| **L4** | Comprehensive, standardised metadata. Machine-readable. Searchable catalogue integrated with access. Regular updates. |
| **L5** | Rich ecosystem with automated generation. Provenance and lineage tracking. Community contributions. |

### B.3.1 Curated Dataset Availability [ENHANCEMENT] [O] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No curated datasets. Raw extracts requiring extensive cleaning. |
| **L2** | Needs assessed. Priority datasets identified. Pilot underway. |
| **L3** | Selected curated datasets. Methodology documented but not standardised. |
| **L4** | Portfolio with standard methodology. Derived variables, phenotypes, linked data. Version control. |
| **L5** | Comprehensive library. Community contributions. Automated pipelines. Benchmarked. |

### B.3.2 Phenotype Library & Validation [ENHANCEMENT] [O] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No library. Researchers define from scratch. |
| **L2** | Concept established. Initial phenotypes documented. No validation. |
| **L3** | Growing library. Selected phenotypes validated. Searchable but not integrated. |
| **L4** | Comprehensive with validated definitions. Standardised validation. Integrated with access. Version control. |
| **L5** | Internationally validated. Cross-references HDR UK/OHDSI. Phenotype-as-code. |

---

## Domain C: Governance & Access

**Focus:** Legal, regulatory, and procedural frameworks; UK-wide coordination  
**Indicators:** 11 (9 Core, 2 Enhancement)  
**⚠ Contains 3 Hard Controls: C.1.1, C.2.2, C.4.1**

### C.1.1 Legal Basis for Research Processing [CORE] [B0] [System] ⚠ HARD CONTROL

| Level | Description |
|:------|:------------|
| **L1** | Legal basis unclear. Reliance on consent for all research. No systematic review. |
| **L2** | Framework developing. Review initiated. GDPR options assessed. |
| **L3** | Primary basis established. Controller/processor defined. Review process exists. Some ambiguity. |
| **L4** | Comprehensive basis. Clear documentation per dataset. Agreements in place. Timely guidance. |
| **L5** | Robust framework. Proactive horizon scanning. Contributing to national guidance. UK-wide and international support. |

### C.1.2 Legislative Environment [ENHANCEMENT] [O] [System]

| Level | Description |
|:------|:------------|
| **L1** | Significant barriers. Key statutes block secondary use. No reform pathway. |
| **L2** | Barriers identified. Policy engagement initiated. Interim approaches defined. |
| **L3** | Permits research under conditions. Constraints remain. Active in legislative review. |
| **L4** | Enabling environment with safeguards. Clear pathway. Compatible with UK-wide operation. |
| **L5** | Actively enables research. Legislation updated. Supports innovation within ethics. |

### C.2.1 Time-to-Data [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No standard process. Case-by-case. >12 months where successful. |
| **L2** | Central function exists. Documentation drafted. Median 6-12 months. |
| **L3** | Operational process. Single application. Median 3-6 months. SLAs defined but not consistent. |
| **L4** | Single-gateway. Median <90 days. SLAs met >= 80%. Applicant support. |
| **L5** | Median <45 days. Tiered/fast-track approvals. Automated workflows. Top-quartile UK. |

### C.2.2 Data Access Committee [CORE] [B0] [Both] ⚠ HARD CONTROL

| Level | Description |
|:------|:------------|
| **L1** | No formal DAC. Ad-hoc decisions. No criteria. No public benefit assessment. |
| **L2** | DAC established/forming. Terms defined. Public benefit criteria developing. Infrequent meetings. |
| **L3** | Operational DAC meeting monthly. Published criteria including NDG public benefit. Decisions documented. Lay members initiated. |
| **L4** | Efficient with clear criteria. Public benefit per NDG for every decision. Lay >= 25% with voting. Decisions within 2 weeks. |
| **L5** | Streamlined with risk-proportionate pathways. Public benefit methodology shared. Appeal process. Lay co-governance. |

### C.2.3 Ethics Pathway Integration & Proportionality [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | Ethics pathway unclear or duplicative. Handled ad-hoc. |
| **L2** | Pathway mapped and documented. Proportionality intent stated. |
| **L3** | Standard ethics triage for common studies. Variable duplication remains. |
| **L4** | Integrated, risk-proportionate pathway. Tiered routes and SLAs tracked. |
| **L5** | Optimised pathway. Reuse/mutual recognition where lawful; learning loop and benchmarking. |

### C.3.1 Mutual Recognition & Standards [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No UK-wide engagement. Organisation-specific agreements. |
| **L2** | Standards reviewed. Gap analysis. Participation initiated. |
| **L3** | Partial adoption (Alliance DAA). Mutual recognition of some approvals. Additional steps for UK-wide. |
| **L4** | Full adoption of UK-standard DAA. Mutual accreditation recognition. Single approval for UK-wide. Participating in governance. |
| **L5** | Leading contributor. Full interoperability. Supporting others. Contributing to Alliance standards. |

### C.3.2 Cross-Border Legal Alignment [ENHANCEMENT] [O] [System]

| Level | Description |
|:------|:------------|
| **L1** | No consideration of cross-border issues. |
| **L2** | Issues identified (NI-Ireland, Scotland common law). Initial assessment. |
| **L3** | Complexities documented with workarounds. Some friction. |
| **L4** | Arrangements address cross-border. Controller agreements enable UK-wide. Manageable overhead. |
| **L5** | Framework designed for UK-wide. Proactive resolution. International arrangements where relevant. |

### C.3.3 Cross-sector Data Sharing & Linkage Governance [CORE] [C6] [System]

| Level | Description |
|:------|:------------|
| **L1** | No cross-sector pathway. Roles, decision rights and feasibility unclear. |
| **L2** | Priority sectors identified. Draft principles/templates; DPIA/TRA approach emerging. |
| **L3** | Governance operational for >=1 sector. Templates in use; pilot linkage delivered. |
| **L4** | Repeatable pathway for multiple sectors. Defined accountabilities; performance tracked. |
| **L5** | Scaled and assured cross-sector linkage. Quality/bias monitored; good practice shared. |

### C.4.1 Statistical Disclosure Control [CORE] [B0] [Service] ⚠ HARD CONTROL

| Level | Description |
|:------|:------------|
| **L1** | No systematic control. Outputs released without review. |
| **L2** | Policy drafted. Training identified. Manual checking for some. |
| **L3** | Policy operational. Trained checkers. Manual review. Some delays. |
| **L4** | Systematic with guidelines. Trained team with capacity. SLA met. Semi-automated tools. |
| **L5** | Advanced with automated tools. Risk-based. Contributing to standards. Rarely delays. |

### C.4.2 Researcher Accreditation & Training [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No requirements. Access without competency demonstration. |
| **L2** | Requirements defined. Curriculum developing. Enforcement not systematic. |
| **L3** | Accreditation required. Training available. Status tracked. Some legacy gaps. |
| **L4** | Comprehensive with mandatory training, renewal, enforcement. Aligned with ONS RAS. Integrated. |
| **L5** | Advanced pathway. Tiered accreditation. Contributing to UK standards. Mentorship. |

### C.4.3 Consent, Permissions & Restrictions Governance [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | Permissions/restrictions not captured. Applied inconsistently or discovered late. |
| **L2** | Inventory initiated. Key restrictions documented; enforcement mainly manual. |
| **L3** | Most restrictions documented and used in decisions. Manual checks common. |
| **L4** | Restrictions captured and enforced end-to-end. Audit trail and change control in place. |
| **L5** | Automated policy enforcement. Routine audits; scalable reuse (e.g., standard models where applicable). |

---

## Domain D: Research Integration & Market Use

**Focus:** Integration with research community; demonstrated use across sectors  
**Indicators:** 8 (6 Core, 2 Enhancement)

### D.1.1 Active User Base [CORE] [Y] [Both]

*Note: Y = Outcome/Context indicator - excluded from readiness scoring*

| Level | Description |
|:------|:------------|
| **L1** | Minimal activity. <10 projects. Internal researchers only. |
| **L2** | Growing with 10-30 projects. External engaging. Pipeline developing. |
| **L3** | Established with 30-75 projects. Mix of academic, NHS, commercial. Growing. |
| **L4** | Substantial >= 75 projects (or >= 15/million pop). Diverse community. Demand exceeds supply. |
| **L5** | Large >= 150 projects. International. High retention. Community promoting. |

### D.1.2 Research Output & Impact [CORE] [Y] [Both]

*Note: Y = Outcome/Context indicator - excluded from readiness scoring*

| Level | Description |
|:------|:------------|
| **L1** | No tracking. Publications and impacts unknown. |
| **L2** | Tracking initiated. Reporting requirement. Baseline identified. |
| **L3** | Regular tracking with annual reporting. Publications cited. Selected case studies. |
| **L4** | Comprehensive tracking. >= 30 publications/year (or >= 6/million pop). Health service impact. Policy influence. |
| **L5** | Leadership with high-impact publications. Influencing practice/policy. Economic impact quantified. International recognition. |

### D.2.1 Researcher Support & Helpdesk [CORE] [B0] [Service]

| Level | Description |
|:------|:------------|
| **L1** | No dedicated support. Researchers navigate independently. |
| **L2** | Function identified. Basic documentation/FAQs. Variable response. |
| **L3** | Dedicated helpdesk. Targets defined. Application and basic technical support. |
| **L4** | Comprehensive: pre-submission, guidance, technical, analytical. SLAs (2-day response). Satisfaction surveyed. |
| **L5** | Exemplary with proactive outreach. Account management. >= 80% satisfaction. |

### D.2.2 Training & Capability Building [ENHANCEMENT] [O] [Service]

| Level | Description |
|:------|:------------|
| **L1** | No provision. Researchers expected to have skills. |
| **L2** | Needs identified. Ad-hoc training. Strategy developing. |
| **L3** | Regular programme. Moderate uptake. |
| **L4** | Comprehensive with multiple levels. Regular schedule. Linked to accreditation. |
| **L5** | Extensive ecosystem. Co-developed. NHS analyst capacity building. Shared UK-wide. |

### D.2.3 Reproducibility & Analytic Provenance Support [CORE] [B0] [Service]

| Level | Description |
|:------|:------------|
| **L1** | No reproducibility support. Code/data/environments not versioned. |
| **L2** | Basic expectations documented. Tooling limited; relies on individuals. |
| **L3** | Standard tools available. Partial provenance; inconsistent adoption. |
| **L4** | Reproducibility-by-design. Versioned data/environments and provenance capture supported. |
| **L5** | Automated provenance and reusable pipelines. Routine reproducibility audit and sharing. |

### D.3.1 Multi-Site Research Capability [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No multi-site. Cannot combine with other UK nodes. |
| **L2** | Requirements understood. Barriers identified. Pilot planned. |
| **L3** | Possible with bespoke arrangements. >= 2 projects delivered. Effortful. |
| **L4** | Routine capability. Standard processes. Participating in federated networks. |
| **L5** | Leading capability. Proactively supporting UK-wide. Advanced federated. International. |

### D.3.2 Commercial Access Framework [ENHANCEMENT] [O] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No framework. Commercial access unclear. No IP policy. |
| **L2** | Policy developing. Pricing discussed. IP under review. Pilots exploring. |
| **L3** | Access permitted under conditions. Pricing exists. IP policy drafted. |
| **L4** | Clear framework with published pricing/terms. IP aligned with Fair Value principles. Revenue contributing. |
| **L5** | Mature offering. Competitive. Comprehensive IP. Diverse partnership models. Good practice. |

### D.4.1 Trial Data & Recruitment Support [ENHANCEMENT] [C4] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No integration. Trial data flows separate. |
| **L2** | Opportunities identified. Trials unit discussions. Feasibility assessed. |
| **L3** | Selected services (feasibility, site identification). Some trial data flows. |
| **L4** | Routine services. Follow-up linkable. IRAS/REC integration. |
| **L5** | Comprehensive integration. Real-time recruitment. Contributing to UK trial acceleration. |

---

## Domain E: Public Trust & Transparency

**Focus:** Engagement, transparency, and social licence  
**Indicators:** 7 (6 Core, 1 Enhancement)

### E.1.1 Public Register of Data Uses [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No register. Approved uses not disclosed. |
| **L2** | Register developing. Content/format defined. Alliance standard reviewed. |
| **L3** | Operational with basic info. Updates may be delayed. Partially aligned. |
| **L4** | Comprehensive meeting Alliance standard. Updated within 30 days. Searchable, promoted. |
| **L5** | Exemplary with outcomes. Public feedback. Aligned with HRA Make it Public. Good practice. |

### E.1.2 Annual Transparency Reporting [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No annual reporting. No public accountability. |
| **L2** | Report developing. Framework defined. |
| **L3** | Basic report (projects, releases, users). Published. |
| **L4** | Comprehensive: approvals, rejections, access times, satisfaction, outputs, incidents, plans. Within 3 months. |
| **L5** | Best-practice with independent assurance. Co-developed with public. Influences improvement. |

### E.2.1 Lay Involvement in Governance [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No lay involvement. Decisions without public input. |
| **L2** | Approach defined. Recruitment initiated. NIHR standards reviewed. |
| **L3** | Lay members appointed. Limited influence. Perspective sought but not embedded. |
| **L4** | Meaningful: >= 25% lay DAC. Voting rights. Support, remuneration per NIHR. Demonstrably influences. |
| **L5** | Exemplary in strategic and operational. Lay co-chairs. Diverse. Contributing to engagement. PEDRI aligned. |

### E.2.2 Public Engagement Capacity [ENHANCEMENT] [O] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No dedicated capacity. Reactive, ad-hoc. |
| **L2** | Strategy developing. Responsibility assigned. Activities planned. |
| **L3** | Some activities. Not systematic or evaluated. |
| **L4** | Dedicated function with budget/staff. Diverse audiences. Evaluated. Two-way dialogue. |
| **L5** | Comprehensive with multiple channels. Co-designed. Social media. Proactive. Capacity shared. |

### E.3.1 Opt-Out Management [CORE] [B0] [System]

| Level | Description |
|:------|:------------|
| **L1** | No mechanism or not operational. Choices not respected. |
| **L2** | Mechanism exists but incomplete. Some opted-out data may be included. |
| **L3** | Operational. Opted-out excluded. Audit. Rate monitored. |
| **L4** | Robust mechanism with routine auditing. Opt-outs applied consistently across all relevant data flows. Clear public information available and maintained. |
| **L5** | Mature preferences management (granular where policy permits). Auditable, timely updates and proactive communications; opt-out rates reported contextually. |

### E.3.2 Public Benefit & Value Demonstration [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No articulation. Benefits without visibility. No framework. |
| **L2** | Framework developing using NDG. Commitment expressed. Initial mechanisms. |
| **L3** | Benefit articulated using NDG. Examples. Commercial income partially reinvested. Statement required. |
| **L4** | Clear proposition. NDG methodology applied consistently. Revenue supports public. Principles published. |
| **L5** | Comprehensive with measurable return. Methodology contributes to sector. Community agreements. Public involved. |

### E.3.3 Legitimacy, Assurance & Learning [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No meaningful assurance or learning. Issues repeat; accountability weak. |
| **L2** | Assurance/learning plan exists. Complaints/appeals defined but not embedded. |
| **L3** | Periodic internal assurance. Learning after incidents; limited visibility. |
| **L4** | Regular independent review. Systematic learning with published actions. |
| **L5** | Trusted model. Routine independent assurance; confidence measures tracked; good practice shared. |

---

## Domain F: Sustainability

**Focus:** Financial sustainability and economic contribution  
**Indicators:** 6 (2 Core, 4 Enhancement)

### F.1.1 Funding Horizon [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | Precarious. Short-term grants. Gap within 12 months. |
| **L2** | Secured 1-2 years. Not baselined. Grant-dependent. |
| **L3** | Core secured 2-3 years. Mixed baseline/grant. Medium-term concerns. |
| **L4** | Core >= 3 years. Baseline covers essentials. Grants supplement not sustain. |
| **L5** | Long-term >= 5 years. Diverse sources. Reserves. Enables innovation. |

### F.1.2 Financial Risk Management [ENHANCEMENT] [O] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No management. Single funder. No contingency. |
| **L2** | Risks identified. Mitigation discussed. Limited diversification. |
| **L3** | Basic with risks/mitigations. Some diversification. Minor contingency. |
| **L4** | Active with register, plans, review. >= 3 sources. 3+ months reserves. |
| **L5** | Comprehensive resilience. Scenario planning. Counter-cyclical. Enables opportunistic investment. |

### F.2.1 Cost Recovery & Pricing [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No recovery. Services free/subsidised. True cost unknown. |
| **L2** | Analysis initiated. Unit costs calculated. Principles discussed. |
| **L3** | Model with pricing for some services. Partial recovery. Basic IP terms. |
| **L4** | Comprehensive with rate card. Tiered. >= 50% recovery. IP aligned with Fair Value principles. |
| **L5** | Transparent, sustainable pricing model (published rate card, justified subsidies, predictable invoicing). Fair Value aligned. |

### F.2.2 Commercial Revenue & Partnerships [ENHANCEMENT] [O] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No commercial revenue. No partnership framework. |
| **L2** | Opportunities identified. Pilots initiated. Principles developing. |
| **L3** | Some revenue (<10%). Offering exists. Basic agreements. |
| **L4** | Significant (10-30%). Active pipeline. Competitive. LSSD2 aligned. IP defined. |
| **L5** | Substantial (>30%). Major partnerships. Sophisticated models. Good practice. |

### F.3.1 Economic Impact Assessment [ENHANCEMENT] [Y] [Both]

*Note: Y = Outcome/Context indicator - excluded from readiness scoring*

| Level | Description |
|:------|:------------|
| **L1** | No assessment. Contribution not quantified. |
| **L2** | Commissioned/planned. Methodology developing. |
| **L3** | Initial completed. Headlines available. May be limited. |
| **L4** | Proportionate assessment within 3 years. Methodology documented. Findings published. |
| **L5** | Regular. Validated. Trajectory tracked. Influences policy. Contributing nationally. |

### F.3.2 Value Demonstration [ENHANCEMENT] [Y] [Both]

*Note: Y = Outcome/Context indicator - excluded from readiness scoring*

| Level | Description |
|:------|:------------|
| **L1** | No systematic demonstration. Benefits claimed not evidenced. |
| **L2** | Proposition articulated. Case studies developing. Metrics defined. |
| **L3** | Portfolio of case studies. Metrics tracked. Communicated. |
| **L4** | Comprehensive framework with multiple dimensions. Regular reporting. Supports funding case. |
| **L5** | Sophisticated with attribution. ROI quantified. Influences policy. Framework shared. |

---

## Domain G: Workforce & Culture

**Focus:** Human capacity, capability, and culture  
**Indicators:** 7 (4 Core, 3 Enhancement)

### G.1.1 Staff Capacity [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | Critical shortages. Key roles vacant. Insufficient. High temp reliance. |
| **L2** | Challenges identified. Recruitment underway. Below requirements. |
| **L3** | Adequate for core. Constraints in peak/specialist. Vacancy <15%. |
| **L4** | Meets requirements with headroom. Vacancy <10%. Planning enables recruitment. |
| **L5** | Optimal with strategic capacity. Vacancy <5%. Strong pipeline. Flexible surge. |

### G.1.2 Staff Retention & Development [ENHANCEMENT] [O] [Both]

| Level | Description |
|:------|:------------|
| **L1** | High turnover. Limited development. Knowledge lost. |
| **L2** | Concerns identified. Opportunities expanding. Exit interviews informing. |
| **L3** | Moderate (<20% turnover). Pathways exist. Some progression. |
| **L4** | Good (<15%). Clear pathways. Regular review. Succession identified. Satisfaction surveyed. |
| **L5** | Excellent (<10%). Employer of choice. Comprehensive development. Alumni network. |

### G.1.3 Strategic Workforce Planning [ENHANCEMENT] [O] [Both]

| Level | Description |
|:------|:------------|
| **L1** | No planning. Reactive recruitment. No future view. |
| **L2** | Planning initiated. Workforce profiled. Requirements scoped. |
| **L3** | Basic 1-2 year plan. Key gaps identified. Annual review. |
| **L4** | Comprehensive 3+ years aligned to strategy. Scenario planning. Pipeline development. |
| **L5** | Sophisticated with workforce as asset. Long-term pipelines. Integrated with financial. Contributing nationally. |

### G.2.1 Role Definition & Professionalization [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | Undefined. Staff outside competencies. No framework. |
| **L2** | Definitions developing. Frameworks reviewed. Gap analysis. |
| **L3** | Key roles defined. Framework for some. Job families emerging. |
| **L4** | Comprehensive aligned to DDaT/SFIA. All mapped. Competency informs development. |
| **L5** | Mature professional workforce. Contributing to standards. Recognised leader. |

### G.2.2 Technical Skills [CORE] [B0] [Both]

| Level | Description |
|:------|:------------|
| **L1** | Critical gaps (engineering, governance, analysis, AI/ML). Limited specialist access. |
| **L2** | Assessment completed. Priority training. Development underway. Gaps remain. |
| **L3** | Core skills present. Development programme. Specialists via partnerships. |
| **L4** | Comprehensive across engineering, governance, security, analysis, data science/AI. Skills matrix. CPD. |
| **L5** | Advanced including AI/ML, federated, PETs. Contributing to standards. Attracts talent. |

### G.3.1 Service Orientation [CORE] [B0] [Service]

| Level | Description |
|:------|:------------|
| **L1** | "Computer says no". Requests as burden. Defensive. |
| **L2** | Improvement priority. Feedback collected. Culture change initiated. |
| **L3** | Improving. Feedback reviewed. Some embrace service culture. |
| **L4** | Embedded. Needs prioritised. "How can we help?" Satisfaction tracked. Standards published. |
| **L5** | Exemplary with proactive engagement. Empowered staff. Continuous improvement. Externally recognised. |

### G.3.2 Collaboration & Knowledge Sharing [ENHANCEMENT] [O] [Both]

| Level | Description |
|:------|:------------|
| **L1** | Siloed. Limited collaboration. Knowledge held by individuals. |
| **L2** | Improvement identified. Knowledge management started. Cross-team emerging. |
| **L3** | Regular cross-team. Knowledge documented. Some external collaboration. |
| **L4** | Strong collaborative culture. Communities of practice. Knowledge accessible. UK/international networks. |
| **L5** | Collaborative leadership. Anchors networks. Knowledge flows. Attracts opportunities. |

---

## Domain H: Infrastructure & Compute Capacity

**Focus:** Technical infrastructure including SDEs, compute, security, AI capability  
**Indicators:** 9 (6 Core, 3 Enhancement)  
**⚠ Contains 2 Hard Controls: H.3.1, H.3.2**

### H.1.1 SDE Architecture & Standards [CORE] [B0] [Service]

| Level | Description |
|:------|:------------|
| **L1** | No dedicated SDE. Ad-hoc access. Controls inconsistent. |
| **L2** | SDE developing. Architecture defined. NHS SDE specs and SATRE reviewed. |
| **L3** | Operational meeting basic requirements. ISO 27001 in progress. Some gaps vs gold-standard/SATRE. |
| **L4** | Mature meeting NHS SDE gold-standard and SATRE mandatory. ISO 27001. DEA accredited. |
| **L5** | Advanced exceeding baseline. Most SATRE recommended. Enables emerging uses. Contributing to UK standards. |

### H.1.2 User Environment & Experience [CORE] [B0] [Service]

| Level | Description |
|:------|:------------|
| **L1** | Poor experience. Difficult access. Tools outdated. Significant complaints. |
| **L2** | Issues identified. Roadmap defined. Upgrades underway. |
| **L3** | Functional. Standard tools (R, Python, SQL). Process works but cumbersome. |
| **L4** | Good with modern environment. Tools updated. Onboarding <1 day. Satisfaction tracked. |
| **L5** | Excellent matching commercial platforms. Rich tools. Rapid onboarding. >= 80% satisfaction. |

### H.2.1 Compute Scalability [CORE] [B0] [Service]

| Level | Description |
|:------|:------------|
| **L1** | Severely limited. Analysis constrained. Frequent delays/failures. |
| **L2** | Assessed. Upgrade requirements defined. Cloud/HPC evaluated. |
| **L3** | Adequate for standard. Queuing for intensive. GPU limited. Cloud/HPC for exceptions. |
| **L4** | Scalable meeting demand with headroom. GPU for AI/ML. Scaling pathway. Cost management. |
| **L5** | Elastic auto-scaling. Advanced GPU. Cost-optimised. Benchmarked internationally. |

### H.2.2 Storage & Data Management [ENHANCEMENT] [O] [Service]

| Level | Description |
|:------|:------------|
| **L1** | Constrained. Retention unclear. No tiering. Costs unmanaged. |
| **L2** | Assessment completed. Tiered strategy. Retention developing. |
| **L3** | Adequate with tiering. Retention operational. Costs monitored. |
| **L4** | Scalable. Comprehensive lifecycle. Costs optimised. Backup/DR tested. |
| **L5** | Advanced with automated tiering/lifecycle. Costs benchmarked. Multi-site resilience. |

### H.3.1 Security Certification & Audit [CORE] [B0] [Service] ⚠ HARD CONTROL

| Level | Description |
|:------|:------------|
| **L1** | No certification. Controls undocumented/untested. |
| **L2** | Assessment initiated. Gap analysis vs ISO 27001. Remediation plan. |
| **L3** | Controls implemented. ISO 27001 in progress. Penetration testing. Incident process defined. |
| **L4** | ISO 27001 certified (full scope). Annual penetration with remediation. Incident management. DEA accredited. |
| **L5** | Continuous assurance and independent testing. Demonstrable security outcomes; additional certifications as appropriate. |

### H.3.2 Security Operations [CORE] [B0] [Service] ⚠ HARD CONTROL

| Level | Description |
|:------|:------------|
| **L1** | No dedicated ops. Monitoring ad-hoc. Incident response untested. |
| **L2** | Function identified. Monitoring implementing. Incident plan drafted. |
| **L3** | Basic ops monitoring key systems. Incident plan documented. |
| **L4** | Mature with comprehensive monitoring. 24/7 alerting. Incident tested. Metrics reported. |
| **L5** | Advanced with threat intelligence. Proactive hunting. Automated response. Benchmarked. |

### H.3.3 Privacy-Enhancing Technologies [ENHANCEMENT] [O] [Service]

| Level | Description |
|:------|:------------|
| **L1** | No PETs. All analysis requires pseudonymised data in secure environment. |
| **L2** | Options assessed. Federated/differential privacy pilots planned. |
| **L3** | Selected capabilities (DataSHIELD, federated). Limited use cases. |
| **L4** | Routinely available (federated, secure computation, differential privacy). Support. Governance. |
| **L5** | Advanced with multiple technologies. PET default where appropriate. Contributing to standards. |

### H.4.1 ML/AI Platform Capability [ENHANCEMENT] [O] [Service]

| Level | Description |
|:------|:------------|
| **L1** | No ML/AI capability. Cannot run ML workloads. |
| **L2** | Requirements assessed. Platform evaluated. Pilot planned. |
| **L3** | Basic with standard libraries. GPU limited. No MLOps. |
| **L4** | Mature with MLOps (tracking, registry, pipelines). GPU. Governance defined. |
| **L5** | Advanced full lifecycle. Automated pipelines. Monitoring. Synthetic data. Contributing to UK AI standards. |

### H.4.2 Responsible AI Practices [CORE] [C3/4] [Service]

| Level | Description |
|:------|:------------|
| **L1** | No consideration. Projects without ethics, bias assessment, or reporting. |
| **L2** | Principles acknowledged. STANDING Together, TRIPOD-AI, CONSORT-AI reviewed. Some awareness. |
| **L3** | Framework developing. Diversity assessed for some using STANDING Together. Guidelines referenced. Selected bias assessment. |
| **L4** | Comprehensive framework. All projects assess diversity per STANDING Together. TRIPOD-AI/CONSORT-AI mandated. Bias embedded. NICE AI aligned. |
| **L5** | Leading practice. Full STANDING Together. Contributing to standards. Advanced fairness monitoring. Scottish AI Playbook aligned. Sharing frameworks. |

---

## Framework Statistics

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

### Hard Controls Summary (Minimum L3 Required)

| ID | Indicator | Domain |
|:---|:----------|:-------|
| C.1.1 | Legal Basis for Processing | Governance |
| C.2.2 | Data Access Committee | Governance |
| C.4.1 | Statistical Disclosure Control | Governance |
| H.3.1 | Security Certification & Audit | Infrastructure |
| H.3.2 | Security Operations | Infrastructure |

---

*Document generated: 23 January 2026*  
*Source: Health Data Readiness Level Framework v1.0*  
*For use with: RDS01 HDRS Readiness Assessment*
