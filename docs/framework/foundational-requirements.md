---
title: Proposed Foundational Indicators
description: The five indicators that HDRL v1.0.1 proposes at Level 3 for its internal baseline profile, with their scope and limitations.
---

# Proposed Foundational Indicators

**Foundational Indicators** are the five indicators that the **Health Data Readiness Level (HDRL)** Framework designates as requiring a **minimum of Level 3** when assessing potential baseline participation within the framework. They represent proposed safety and governance conditions in HDRL's assessment logic.

!!! important "Proposed by HDRL"
    These indicators and the Level 3 threshold were offered as a contribution to the initial UK Health Data Research Service (HDRS) design conversation. They are not established or current HDRS participation requirements—or requirements for any other programme—and the framework does not itself confer or deny participation.

!!! warning "Minimum Level 3 within HDRL"
    Under HDRL's scoring logic, a system or service does not meet the framework's proposed baseline readiness profile if any Foundational Indicator is below Level 3, regardless of performance on other indicators.

---

## The Five Proposed Foundational Indicators

| ID | Indicator | Domain |
|:---|:----------|:-------|
| [C.1.1](../domains/c-governance-access.md#c11-legal-basis-for-processing) | Legal Basis for Processing | Governance & Access |
| [C.2.2](../domains/c-governance-access.md#c22-data-access-committee) | Data Access Committee | Governance & Access |
| [C.4.1](../domains/c-governance-access.md#c41-statistical-disclosure-control) | Statistical Disclosure Control | Governance & Access |
| [H.3.1](../domains/h-infrastructure.md#h31-security-certification-audit) | Security Certification & Audit | Infrastructure & Compute Capacity |
| [H.3.2](../domains/h-infrastructure.md#h32-security-operations) | Security Operations | Infrastructure & Compute Capacity |

---

## Why These Five?

These indicators represent the foundational safety and trust requirements without which data sharing would be inappropriate:

### Governance (Domain C)

**C.1.1 — Legal Basis for Processing**
:   Without a clear legal basis for research data processing, any data sharing activity is legally precarious. This is the foundational requirement for all downstream activities.

**C.2.2 — Data Access Committee**
:   An operational DAC with published criteria and public benefit assessment ensures that every data access decision is transparent, accountable, and proportionate.

**C.4.1 — Statistical Disclosure Control**
:   Systematic output checking prevents the release of potentially identifiable information. Without this, re-identification risks undermine the entire trust framework.

### Infrastructure (Domain H)

**H.3.1 — Security Certification & Audit**
:   Formal security certification (e.g., ISO 27001) and penetration testing provide assurance that the technical environment is secure against external threats.

**H.3.2 — Security Operations**
:   Operational security monitoring and incident response ensure that threats are detected and managed in real time, not discovered after a breach.

---

## What Level 3 Means for Each

| Indicator | Level 3 descriptor |
|:------------|:-------------------|
| **C.1.1** | Primary legal basis established. Controller/processor defined. Review process exists. |
| **C.2.2** | Operational DAC meeting monthly. Published criteria including NDG public benefit. Decisions documented. |
| **C.4.1** | Policy operational. Trained checkers. Manual review of outputs. |
| **H.3.1** | Controls implemented. ISO 27001 in progress. Penetration testing conducted. |
| **H.3.2** | Basic ops monitoring key systems. Incident plan documented and tested. |

<div class="hdrl-next" markdown>

## Continue exploring

<div class="hdrl-button-grid" markdown>

[Understand indicator classifications](classification.md){ .md-button .md-button--primary }
[How to apply HDRL](using-the-framework.md){ .md-button }
[Indicator quick reference](quick-reference.md){ .md-button }

</div>
</div>
