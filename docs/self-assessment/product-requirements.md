---
title: Self-assessment product requirements
description: Scope, functional requirements, acceptance criteria and roadmap for an HDRL self-assessment service.
---

# Self-assessment product requirements

## Product intent

Help people learn HDRL by applying it and create a proportionate, traceable improvement record. The service is not accreditation, certification, an official standard, a validated benchmark or an endorsement.

## MVP scope

### Included

- boundary-setting onboarding for system, service and dual assessments;
- an eight-question, 5–10 minute rapid first pass using non-scoring impression bands;
- evidence-led access to all 64 canonical indicators;
- not known, not assessed and not applicable statuses;
- maturity judgement, uncertainty, rationale, improvement note and evidence references;
- save and return;
- task-list, search and domain/status filtering;
- completeness review and a limited pre-gate summary;
- report-information gate with separate optional contact preferences;
- accessible HTML/print report plus JSON and CSV exports;
- transparent rules-based findings;
- version provenance and on-device deletion;
- individual workflow and a designed team workflow; and
- a feature-flagged, no-backend research prototype.

### Explicitly excluded from the first production release

- evidence-document uploads;
- AI-generated recommendations;
- public benchmarks, ranks or peer comparisons;
- an overall HDRL score;
- accreditation, badges or “passed” language;
- external sharing without an authenticated, user-initiated action;
- automated decisions about funding, accreditation or programme participation; and
- collection of patient-level or special-category data.

## Acceptance criteria

### Method and framework integrity

- The report names framework `1.0.1`, catalogue `1.0.2`, tool, guidance/rules and report versions plus assessment date.
- Evidence-led wording is read at runtime from the canonical JSON catalogue.
- All 64 indicators are reachable; scope suggestions do not silently exclude indicators.
- The rapid first pass contains eight domain prompts and never labels its output an HDRL level or score.
- No overall numeric score or peer rank is produced.
- Even-number medians are shown as an observed range, not a decimal midpoint.

### Guided use

- Before answering, a user records title, service/ecosystem, scope, unit, individual/team method and intended use.
- Rapid progress announces question number and total.
- Evidence-led progress separately shows reviewed, judged, evidence-linked, unknown and not-assessed counts.
- Each indicator shows all five canonical descriptors and relevant minimum-evidence wording.
- Each indicator offers concise expandable guidance, common mistakes and dependencies.
- A user can review and change answers without traversing all remaining questions.

### Evidence

- Evidence record fields include title, type, URL/internal reference, owner/source, date, review period, note, supported judgement, limitations and review status.
- The interface has no evidence-file upload.
- A persistent notice prohibits patient data, personal confidential data, credentials and unnecessarily sensitive operational information.
- User-supplied text is rendered as text, never executable HTML.

### Reporting

- The limited pre-gate summary contains completion and coverage only, not the full domain/indicator profile.
- The full report records boundary, method, versions, rapid impressions, evidence-led profile, evidence coverage, uncertainty, gaps, dependencies, findings, actions and limitations.
- Every generated finding includes its source indicator and rule.
- Findings are separated into supported judgements, provisional interpretations, questions and potential actions.
- Potential actions are only the user's own notes in MVP.
- The report invites readers to read, critique, test and help validate HDRL.

### Team workflow (production)

- Roles are owner, contributor and reviewer; a facilitator permission may be assigned to an owner or contributor.
- Invitees authenticate using an emailed one-time code; membership is bound to the invited email and workspace.
- Owners can see participation status but not answer values during an open independent round.
- Closing a round reveals distributions, rationales and evidence to authorised participants.
- The interface prioritises missing applicability agreement and spans greater than one level.
- Consensus requires a rationale and records participants, date, previous distribution and material changes.
- No mean is labelled as the team result.
- Evidence actions have owner, due date, status and indicator link.

### Privacy and security

- No email, score, evidence, rationale, token, report identifier or report content is placed in a URL.
- Assessment content is excluded from website analytics and application diagnostic logs.
- Server-side authorisation is enforced on every workspace record.
- Deletion removes live data promptly and explains backup expiry.
- Export and deletion are self-service for owners, with a documented support route.
- Production remains disabled until controller/processor terms, retention, privacy notice, DPIA and security review are approved.

### Accessibility

- Complete journeys work by keyboard without drag-only interaction.
- Status/save/error messages use appropriate live regions.
- Labels, names and instructions are programmatically associated.
- Validation errors explain the problem and how to fix it.
- Content reflows at 320 CSS pixels and at 400% zoom without loss of function.
- Text and non-text contrast meet WCAG 2.2 AA.
- Focus remains visible and unobscured.
- Reduced-motion preferences are respected.
- The HTML report remains the accessible source; the generated PDF is tagged or replaced with a documented accessible HTML alternative.

## Product metrics without benchmarking

Operational measures may include completion rate by stage, time spent by stage, save/return success, error rate, accessibility defects, deletion completion, evidence-reference coverage and the frequency with which indicator wording is marked unclear. Do not send response values or free text to web analytics.

## Prioritised roadmap

### Prototype — this branch

On-device individual journey, evidence register, report gate simulation, rules-based report and exports. No transmission or real account system.

### Production pilot

UK-hosted authenticated workspaces, emailed OTP, autosave, individual reports, export/delete, application audit trail, operational admin, DPIA/security review and invited pilot cohort. Team calibration may be enabled only after isolation testing.

### Team beta

Independent rounds, invitations and roles, disagreement views, action assignment, consensus audit and reviewer sign-off.

### Validation and research release

Content review, public contributor review, user research, inter-rater reliability study, scoring-convention sensitivity analysis and a governed aggregate-research pipeline.

### Later, only if justified

Accessible server-generated PDF, approved external sharing, version-to-version comparison and carefully governed cross-assessment learning. AI assistance remains off by default and requires a separate DPIA, explainability design and processor review.
