---
title: Sample team self-assessment report
description: A synthetic team report showing independent distributions, calibration, disagreement and evidence actions without averaging responses.
---

# Sample team self-assessment report

!!! warning "Synthetic workflow example"
    This report contains fictional responses from a four-person team. It demonstrates a proposed production workflow that is not implemented by the on-device prototype. It is not validation, accreditation, benchmarking or endorsement.

## Assessment identity and method

| Field | Synthetic value |
|:--|:--|
| Assessment | Example cross-organisation data service |
| Assessment date | 30 July 2026 |
| Boundary | The service’s current operational capability; national policy is inherited context |
| Independent round | Four contributors submitted before seeing one another’s answers |
| Calibration | Facilitated meeting with the owner, three contributors and one read-only reviewer |
| Versions | HDRL Framework 1.0.1 · catalogue 1.0.2 · tool/team-workflow design 0.2.0 · guidance 0.2.0 · rules 0.2.0 · report 0.2.0 |

The independent distributions are evidence about differing knowledge and interpretation. The consensus column is a facilitated working judgement, not an average or objective truth.

## Calibration overview

| Indicator | Independent responses | Why selected | Facilitated result | Remaining uncertainty / low certainty |
|:--|:--|:--|:--|:--|
| A.1.1 · Core Dataset Availability | L2 × 1; L3 × 2; L4 × 1 | Three-level span and different coverage denominators | L3 · Defined | Primary-care coverage denominator needs confirmation |
| A.1.2 · Data Currency & Timeliness | L3 × 3; Not known × 1 | One participant could not locate refresh evidence | L3 · Defined | Two datasets lack a current refresh log |
| B.2.1 · Quality Framework & Monitoring | L2 × 2; L3 × 2 | Adjacent-level interpretation difference | L2 · Developing | Routine monitoring is not evidenced for all pipelines |
| C.1.2 · Data Access Governance | L3 × 3; L4 × 1 | Disagreement about whether monitoring is systematic | L3 · Defined | Decision-time metric requires a stable denominator |
| H.2.1 · Security Certification & Compliance | L4 × 2; Not applicable × 1; Not known × 1 | Applicability and inheritance were interpreted differently | Unresolved | Confirm which assurance belongs to the service and which is inherited |

No mean has been calculated. A narrow distribution does not prove correctness, and consensus does not erase the original responses.

## Calibration record: A.1.1

**What differed:** Participants used different definitions of “available” and different population denominators. One counted technically ingestible data; others counted data routinely accessible for approved research.

**Evidence considered:** synthetic dataset inventory, two dated refresh summaries and an unreviewed draft coverage note. None has been independently verified.

**Working judgement:** L3 · Defined.

**Rationale:** The team agreed that partial core-dataset access is evidenced, but the material available in the meeting did not substantiate the published L4 threshold.

**Dissent retained:** One contributor considered current agreements sufficient for L4 and asked for the denominator decision to be documented.

**Rule trace:** R-TEAM-DISAGREEMENT selected the item because independent responses spanned more than one adjacent level.

## Evidence actions

| Indicator | Action | Owner | Due | Status |
|:--|:--|:--|:--|:--|
| A.1.1 | Reconcile provider coverage against an agreed population denominator | Data partnerships lead | 28 August 2026 | Open |
| A.1.2 | Export representative refresh logs for the two datasets with missing records | Data operations lead | 14 August 2026 | Open |
| B.2.1 | Compare the quality policy with monitoring records from three recent pipelines | Data quality lead | 4 September 2026 | In progress |
| H.2.1 | Map service-owned and inherited assurance controls | Security lead | 21 August 2026 | Open |

Actions are allocated evidence-gathering work. They do not imply that completing the action automatically changes a maturity judgement.

## Material-change audit excerpt

| Time | Actor role | Event | Recorded reason |
|:--|:--|:--|:--|
| 30 July 2026, 10:14 | Facilitator | A.1.1 consensus set to L3 | Coverage denominator not sufficient for L4 |
| 30 July 2026, 10:31 | Contributor | A.1.2 evidence action assigned | Refresh evidence missing for two datasets |
| 30 July 2026, 11:02 | Reviewer | H.2.1 left unresolved | Service/inherited control boundary requires owner confirmation |

Production audit events should preserve the prior distribution or a redacted change snapshot, actor, time and reason without copying assessment text into infrastructure logs.

## Report findings

### Findings supported by referenced evidence status

- A.1.1 has a calibrated L3 working judgement linked to dated synthetic records reviewed by the team. The sources and judgement have not been independently verified.
- C.1.2 has a calibrated L3 working judgement; routine decision-time monitoring remains incompletely evidenced.

### Provisional interpretations

- B.2.1 remains provisional because the team could not establish that the documented quality framework operates across all relevant pipelines.

### Questions to investigate

- Which population and service boundary should govern A.1.1 coverage?
- What evidence would resolve the ownership and applicability difference for H.2.1?
- Does the access-time measure describe all requests or only completed approvals?

### Potential improvement actions

Only the team-authored actions in the evidence-action register are carried into this section. The rules engine does not invent actions.

## Limitations and responsible use

- This is a synthetic design sample, not a result for any real service.
- Independent views and facilitated consensus are self-reported and not independent assurance.
- Disagreement may indicate ambiguity, different evidence access, different boundaries or genuine differences in judgement.
- HDRL’s reliability, validity and fitness for accreditation are not established.
- No result may be used as a badge, rank, accreditation decision, funding decision or programme-participation decision.

## Help validate HDRL

Read, critique and test the proposed team method. In particular, test whether blind independent rounds reduce anchoring, whether disagreement is explained clearly and whether the consensus record preserves useful dissent.
