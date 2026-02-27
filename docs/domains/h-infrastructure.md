# Domain H: Infrastructure & Compute Capacity

<span class="domain-ref" style="color: #64748b;">THE ENGINE ROOM</span>

**Focus:** Technical infrastructure including SDEs, compute, security, AI capability

**Indicators:** 9 (6 Core, 3 Enhancement)

!!! quote "The business question"
    Is our tech safe and scalable? Ensures we can handle AI workloads and cyber threats.

Secure Data Environments (SDEs/TREs) are the technical backbone of health data research. As workloads shift toward machine learning and large-scale genomics, compute demands are growing exponentially while cyber threats intensify. This domain assesses whether infrastructure meets current standards (NHS SDE specs, SATRE, ISO 27001), can scale for emerging use cases, and maintains the security posture that underpins all other domains. Two of the five Foundational Requirements sit here.

!!! warning "Contains 2 Foundational Requirements"
    Indicators H.3.1 and H.3.2 are **Foundational Requirements** requiring a minimum of **Level 3** for baseline participation.

---

## Indicator Summary

| ID | Indicator | Type | Class | Unit | Foundational |
|:---|:----------|:-----|:------|:-----|:-------------|
| H.1.1 | SDE Architecture & Standards | Core | B0 | Service | |
| H.1.2 | User Environment & Experience | Core | B0 | Service | |
| H.2.1 | Compute Scalability | Core | B0 | Service | |
| H.2.2 | Storage & Data Management | Enhancement | O | Service | |
| H.3.1 | Security Certification & Audit | Core | B0 | Service | :warning: |
| H.3.2 | Security Operations | Core | B0 | Service | :warning: |
| H.3.3 | Privacy-Enhancing Technologies | Enhancement | O | Service | |
| H.4.1 | ML/AI Platform Capability | Enhancement | O | Service | |
| H.4.2 | Responsible AI Practices | Core | C3/4 | Service | |

---

## H.1 — Secure Data Environment

### H.1.1 SDE Architecture & Standards
**CORE** · **B0** · **Service**

| Level | Description |
|:------|:------------|
| **L1** | No dedicated SDE. Ad-hoc access. Controls inconsistent. |
| **L2** | SDE developing. Architecture defined. NHS SDE specs and SATRE reviewed. |
| **L3** | Operational meeting basic requirements. ISO 27001 in progress. Some gaps vs gold-standard/SATRE. |
| **L4** | Mature meeting NHS SDE gold-standard and SATRE mandatory. ISO 27001. DEA accredited. |
| **L5** | Advanced exceeding baseline. Most SATRE recommended. Enables emerging uses. Contributing to UK standards. |

### H.1.2 User Environment & Experience
**CORE** · **B0** · **Service**

| Level | Description |
|:------|:------------|
| **L1** | Poor experience. Difficult access. Tools outdated. Significant complaints. |
| **L2** | Issues identified. Roadmap defined. Upgrades underway. |
| **L3** | Functional. Standard tools (R, Python, SQL). Process works but cumbersome. |
| **L4** | Good with modern environment. Tools updated. Onboarding <1 day. Satisfaction tracked. |
| **L5** | Excellent matching commercial platforms. Rich tools. Rapid onboarding. >= 80% satisfaction. |

---

## H.2 — Compute & Storage

### H.2.1 Compute Scalability
**CORE** · **B0** · **Service**

| Level | Description |
|:------|:------------|
| **L1** | Severely limited. Analysis constrained. Frequent delays/failures. |
| **L2** | Assessed. Upgrade requirements defined. Cloud/HPC evaluated. |
| **L3** | Adequate for standard. Queuing for intensive. GPU limited. Cloud/HPC for exceptions. |
| **L4** | Scalable meeting demand with headroom. GPU for AI/ML. Scaling pathway. Cost management. |
| **L5** | Elastic auto-scaling. Advanced GPU. Cost-optimised. Benchmarked internationally. |

### H.2.2 Storage & Data Management
**ENHANCEMENT** · **O** · **Service**

| Level | Description |
|:------|:------------|
| **L1** | Constrained. Retention unclear. No tiering. Costs unmanaged. |
| **L2** | Assessment completed. Tiered strategy. Retention developing. |
| **L3** | Adequate with tiering. Retention operational. Costs monitored. |
| **L4** | Scalable. Comprehensive lifecycle. Costs optimised. Backup/DR tested. |
| **L5** | Advanced with automated tiering/lifecycle. Costs benchmarked. Multi-site resilience. |

---

## H.3 — Security

### H.3.1 Security Certification & Audit { .foundational-req }
**CORE** · **B0** · **Service** · :warning: **FOUNDATIONAL REQUIREMENT** (minimum L3)

| Level | Description |
|:------|:------------|
| **L1** | No certification. Controls undocumented/untested. |
| **L2** | Assessment initiated. Gap analysis vs ISO 27001. Remediation plan. |
| **L3** | Controls implemented. ISO 27001 in progress. Penetration testing. Incident process defined. |
| **L4** | ISO 27001 certified (full scope). Annual penetration with remediation. Incident management. DEA accredited. |
| **L5** | Continuous assurance and independent testing. Demonstrable security outcomes; additional certifications as appropriate. |

### H.3.2 Security Operations { .foundational-req }
**CORE** · **B0** · **Service** · :warning: **FOUNDATIONAL REQUIREMENT** (minimum L3)

| Level | Description |
|:------|:------------|
| **L1** | No dedicated ops. Monitoring ad-hoc. Incident response untested. |
| **L2** | Function identified. Monitoring implementing. Incident plan drafted. |
| **L3** | Basic ops monitoring key systems. Incident plan documented. |
| **L4** | Mature with comprehensive monitoring. 24/7 alerting. Incident tested. Metrics reported. |
| **L5** | Advanced with threat intelligence. Proactive hunting. Automated response. Benchmarked. |

### H.3.3 Privacy-Enhancing Technologies
**ENHANCEMENT** · **O** · **Service**

| Level | Description |
|:------|:------------|
| **L1** | No PETs. All analysis requires pseudonymised data in secure environment. |
| **L2** | Options assessed. Federated/differential privacy pilots planned. |
| **L3** | Selected capabilities (DataSHIELD, federated). Limited use cases. |
| **L4** | Routinely available (federated, secure computation, differential privacy). Support. Governance. |
| **L5** | Advanced with multiple technologies. PET default where appropriate. Contributing to standards. |

---

## H.4 — AI & Advanced Analytics

### H.4.1 ML/AI Platform Capability
**ENHANCEMENT** · **O** · **Service**

| Level | Description |
|:------|:------------|
| **L1** | No ML/AI capability. Cannot run ML workloads. |
| **L2** | Requirements assessed. Platform evaluated. Pilot planned. |
| **L3** | Basic with standard libraries. GPU limited. No MLOps. |
| **L4** | Mature with MLOps (tracking, registry, pipelines). GPU. Governance defined. |
| **L5** | Advanced full lifecycle. Automated pipelines. Monitoring. Synthetic data. Contributing to UK AI standards. |

### H.4.2 Responsible AI Practices
**CORE** · **C3/4** · **Service**

!!! note "Capability module"
    This indicator is mandatory if claiming HDRS Capabilities 3 or 4 (Multi-modal data / Trial acceleration).

| Level | Description |
|:------|:------------|
| **L1** | No consideration. Projects without ethics, bias assessment, or reporting. |
| **L2** | Principles acknowledged. STANDING Together, TRIPOD-AI, CONSORT-AI reviewed. Some awareness. |
| **L3** | Framework developing. Diversity assessed for some using STANDING Together. Guidelines referenced. Selected bias assessment. |
| **L4** | Comprehensive framework. All projects assess diversity per STANDING Together. TRIPOD-AI/CONSORT-AI mandated. Bias embedded. NICE AI aligned. |
| **L5** | Leading practice. Full STANDING Together. Contributing to standards. Advanced fairness monitoring. Scottish AI Playbook aligned. Sharing frameworks. |
