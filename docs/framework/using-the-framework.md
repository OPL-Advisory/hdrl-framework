---
title: How to Apply HDRL
description: A practical guide to scoping, evidencing, scoring and interpreting an HDRL assessment responsibly.
---

# How to Apply HDRL

The **Health Data Readiness Level (HDRL)** Framework is designed to turn a complex sociotechnical operating environment into a structured evidence review and improvement roadmap. It can be applied at **system**, **service** or **dual** level, but the scope and evidence standard should be explicit before scoring begins.

!!! important "What an HDRL assessment is — and is not"
    An HDRL assessment is a structured maturity assessment. It is not accreditation, certification, a compliance audit or an official decision on participation in the UK Health Data Research Service (HDRS) or any other programme. Scores describe the evidence available at the time of assessment and should be interpreted alongside context, capacity and the needs of the intended research use case.

## A four-stage assessment

<div class="hdrl-process">
  <div class="hdrl-process-step">
    <span>1</span>
    <div>
      <h3>Define the assessment boundary</h3>
      <p>Choose system, service or dual-level assessment. Record the organisations, services, capabilities and time period in scope.</p>
    </div>
  </div>
  <div class="hdrl-process-step">
    <span>2</span>
    <div>
      <h3>Assemble the evidence</h3>
      <p>Collect public, auditable and internally verifiable material before interviews. Use stakeholder testimony to explain evidence and identify gaps, not as an automatic substitute for it.</p>
    </div>
  </div>
  <div class="hdrl-process-step">
    <span>3</span>
    <div>
      <h3>Score against the descriptors</h3>
      <p>Assess every applicable indicator against its five maturity descriptors in the <a href="/domains/">domain reference</a>. Record the evidence, rationale, uncertainty and evidence gap for each judgement.</p>
    </div>
  </div>
  <div class="hdrl-process-step">
    <span>4</span>
    <div>
      <h3>Calibrate and build the roadmap</h3>
      <p>Review scoring consistency, invite factual correction through Right of Reply, and translate domain patterns into sequenced improvement actions.</p>
    </div>
  </div>
</div>

## Evidence is part of maturity

The framework deliberately distinguishes operational assertion from demonstrable performance. A service may have strong capability but receive a lower score when the supporting documentation, metrics or external assurance are not available.

| Level | Evidence expectation |
|:--|:--|
| **L1 · Initial** | Minimal or no documented capability. |
| **L2 · Developing** | Capability is demonstrated but remains informal or is supported mainly by uncorroborated testimony. |
| **L3 · Defined** | Formal, documented processes and responsibilities are in place. |
| **L4 · Managed** | Performance is measured, standardised and at least partly published or externally verifiable. |
| **L5 · Optimising** | Systematic improvement and credible benchmarking can be demonstrated over time. |

This evidence hierarchy helps surface an important distinction:

- **Capability gap:** the function, resource or pathway does not yet exist at the required maturity.
- **Evidence gap:** capability may exist, but documentation, metrics, audit evidence or published performance do not yet demonstrate it.
- **Capacity gap:** capability exists, but staffing, funding or operating headroom limit the volume or pace that can be delivered.

!!! note "Capability and evidence visibility"
    HDRL v1.0.1 scores the capability demonstrated by the available evidence, so a result can reflect both operational maturity and the strength or visibility of its evidence. This protects against unsupported self-assessment, but the two concepts should be interpreted separately. A future validation phase should test whether capability maturity and evidence confidence are better recorded as distinct dimensions.

## Keep an auditable assessment record

The short Evidence Register example in the applied-v1 source is a starting point, not a complete audit trail. For each judgement, retain at least:

| Record field | What to capture |
|:--|:--|
| Scope and applicability | Organisation or service, assessment unit, time period, applicability class, and any N/A or inherited-score reason |
| Evidence | Evidence title, location, owner, date, access status, and the specific descriptor or minimum-evidence claim it supports |
| Judgement | Claimed level, assessor rationale, uncertainty or confidence, evidence gaps, assessor, and assessment date |
| Calibration | Review or calibration decision, participants, date, and reason for any change |
| Right of Reply | Factual correction or additional evidence received, adjudication, and resulting score change |
| Change history | Previous level, new level, author, date, and a concise reason |

Keep sensitive evidence and detailed assessment records within their authorised governance boundary. Publishing a maturity summary does not imply permission to publish its underlying evidence.

## Choose the right unit of assessment

| Approach | Use when | Key consideration |
|:--|:--|:--|
| **System-level** | Assessing a nation or health system as a potential node. | Service-level indicators need a defined primary service or a transparent aggregation method. |
| **Service-level** | Assessing an individual secure data environment (SDE), trusted research environment (TRE) or data service. | System indicators should be inherited from the relevant national context or marked not applicable. |
| **Dual-level** | Distinguishing systemic constraints from operational service gaps. | Keep the two evidence records explicit; a shared context does not mean identical scores. |

### Applicability, inheritance and local scoring conventions

The applied-v1 method provides these rules:

- System indicators (**S**) may be inherited by a service unless there is a clearly evidenced service-specific deviation.
- Capability-specific indicators (**Cx**) may be marked not applicable when the service or system is not claiming that historical capability.
- Outcome/Context indicators (**Y**) are reported separately where data exist and do not contribute to readiness scoring.
- Where a system contains multiple services, report the chosen aggregation approach and its coverage basis explicitly.

HDRL v1.0.1 does not prescribe every implementation detail needed for interchangeable automated scoring. Before assessment begins, record how the team will handle partially applicable indicators, multi-part descriptors, even-number medians and display rounding. Do not compare or combine results that use materially different conventions.

## Interpret the result responsibly

HDRL supports roadmap development rather than pass/fail judgements. For a general domain summary, applied v1 defines the score as the median of applicable Core indicators, excluding Outcome/Context indicators. Baseline interpretation separately focuses on the B0 subset; do not present an all-Core domain median as if it were the complete baseline result. Claims at L3–L5 should use the indicator-specific minimum evidence published in the [domain reference](../domains/index.md) and machine-readable catalogue.

### Indicative readiness profiles

| Profile | Characteristics |
|:--|:--|
| **Emerging** | Majority of Baseline Core at Level 1–2. Significant foundational work required. |
| **Developing** | Majority of Baseline Core at Level 2–3. Active improvement. May participate with a roadmap and support. |
| **Managed** | Majority of Baseline Core at Level 3–4, with none below Level 2. Meets the framework's internal baseline profile. |
| **Optimising** | Majority of Baseline Core at Level 4–5. Exceeds the framework's internal baseline profile and may offer examples for others. |

!!! important "Planning profiles, not accreditation"
    These profiles support interpretation and improvement planning. A maturity profile does not guarantee delivery performance or determine participation in HDRS or any other programme.

### An assessment can support

- a shared view of strengths, constraints and missing evidence;
- comparison of maturity patterns across domains;
- prioritisation of policy, service, workforce and infrastructure improvements;
- capability-specific planning for different research offers; and
- repeat assessment to track documented progress over time.

### An assessment should not be used to

- treat a single overall score as a complete verdict;
- rank organisations without considering scope, evidence availability and institutional context;
- imply that one level guarantees delivery time, quality or participation;
- replace legal, ethical, security or data-controller decisions; or
- publish sensitive evidence or detailed assessment records without the relevant permissions.

## Proposed Foundational Indicators

HDRL designates five indicators as Foundational Indicators and assumes a minimum of Level 3 for baseline participation **within the framework's own assessment logic**. The 3 Nations Final Report explicitly presents these as proposed conditions and a contribution to the initial HDRS design conversation, not as established or current HDRS requirements. Other programmes and international users should determine their own governance requirements rather than treating the five indicators as an externally mandated threshold.

[Review the five proposed Foundational Indicators](foundational-requirements.md){ .md-button }

## Current validation status

HDRL has been applied formatively through one multi-jurisdiction assessment across three distinct UK health data systems. That application demonstrates practical feasibility, but it does not establish reliability, validity or accreditation fitness. Priorities for further work include independent expert and public content-validity review, scoring by multiple assessors, formal inter-rater reliability testing, sensitivity analysis, prospective application and refinement of Level 4 and Level 5 thresholds using UK and international benchmark data.

!!! tip "Good assessment discipline"
    Preserve an auditable record of the evidence, rationale, assessor judgement, uncertainty, Right of Reply and any score change. Readiness is dynamic, so always state the assessment date.

<div class="hdrl-next" markdown>

## Continue exploring

<div class="hdrl-button-grid" markdown>

[Development and evidence](methodology.md){ .md-button .md-button--primary }
[See the maturity levels](maturity-levels.md){ .md-button }
[Indicator quick reference](quick-reference.md){ .md-button }
[Framework files and data](applied-v1-reference-files.md){ .md-button }

</div>
</div>
