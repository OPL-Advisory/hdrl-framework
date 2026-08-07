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
- an optional eight-question, 5–10 minute orientation using non-scoring impression bands;
- a low-burden whole-framework snapshot covering all 64 indicators with canonical level/status, certainty and optional clarity/comment fields;
- evidence-led access to all 64 canonical indicators;
- not known, not assessed and not applicable statuses;
- a binary judgement decision, reason when no judgement is made, maturity judgement, certainty, rationale, improvement note and evidence references;
- one operating-capacity and constraint note per domain, separate from indicator capability judgements;
- save and return;
- task-list, search and domain/status filtering;
- completeness review and a limited pre-gate summary;
- report-information gate with separate optional contact preferences;
- an optional, skippable feedback checkpoint before the first export, supporting feedback without contact details or contactable feedback;
- a privacy-minimised beta event contract containing coarse progress and action events but no assessment values or text;
- a deliberately user-created result share bundle, with no result category selected by default;
- accessible HTML/print report plus JSON and CSV exports;
- transparent rules-based findings;
- version provenance and on-device deletion;
- individual workflow and a designed team workflow; and
- a feature-flagged, no-backend research prototype, with remote transport hard-disabled in its versioned configuration.

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
- The whole-framework snapshot presents all five exact canonical descriptors for every indicator and clearly labels its profile provisional and not evidence-backed.
- Snapshot maturity choices are visually and programmatically separated from not known, not assessed and not applicable.
- A snapshot response requires certainty only when a maturity level is selected; clarity feedback and comments remain optional.
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

- Evidence record fields include title, type, URL/internal reference, owner/source, date, short note, limitations and review status. The form does not ask which level the user is trying to prove.
- Expandable evidence ideas combine indicator-specific canonical minimum-evidence wording with de-identified domain patterns synthesised from the three-nation application; they are labelled as prompts, not a checklist.
- The interface has no evidence-file upload.
- A persistent notice prohibits patient data, personal confidential data, credentials and unnecessarily sensitive operational information.
- User-supplied text is rendered as text, never executable HTML.

### Reporting

- The limited pre-gate summary contains completion and coverage only, not the full domain/indicator profile.
- The full report records boundary, method, versions, the rapid impression-by-certainty matrix, evidence-led median and observed range, evidence coverage, low certainty, gaps, domain constraints, dependencies, findings, actions and limitations.
- Every generated finding includes its source indicator and rule.
- Findings are separated into supported judgements, provisional interpretations, questions and potential actions.
- Potential actions are only the user's own notes in MVP.
- The report invites readers to read, critique, test and help validate HDRL.

### Public-beta learning and confidentiality

- Starting the snapshot requires no account or email and therefore keeps initial activation energy low.
- Before the first report/export action, the user may provide feedback or explicitly skip it; either disposition can be counted without collecting the feedback content in analytics.
- Production report access verifies an email address and records role, organisation, individual/team use and a broad intended-use category; name, region, service type and scale remain optional. It does not upload the assessment, levels, certainty, notes, evidence or report.
- Operational events use an allow-list and may include tool version, event name, coarse active-time band, completed indicator/domain counts and requested export type only. The application sends Plausible no participant, email, organisation or application-session identifier.
- “Download” measurement means a download was requested in the browser; the service must not claim it can prove that a file was retained or opened.
- Feedback submitted without contact details is stored separately from participant identity and session events. The notice explains that free text or unusual context may still identify the author, so it is not described as guaranteed anonymous.
- The service records that feedback was submitted or skipped in the funnel, but never copies feedback text into event analytics or logs.
- Assessment results are local by default. Optional result sharing requires a separate, explicit action and a preview of the included categories.

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

Operational measures may include starts, domain and stage completion, report unlock, download requests, feedback prompt/submission/skip, coarse active-time bands, save/return success, error rate, accessibility defects and deletion completion. Indicator wording clarity is collected as assessment-side feedback and stays local unless deliberately shared; it is not silently sent to analytics. Do not send response values, certainty, free text, boundary information, evidence or report contents to web analytics.

## Prioritised roadmap

### Prototype v0.3 — this branch

On-device orientation, 64-indicator snapshot, evidence register, local beta-event inspection, optional feedback checkpoint, explicit results share bundle, report gate simulation, rules-based report and exports. No transmission or real account system.

### Public beta — thin operational service

Keep assessment and report generation in the browser. Add privacy-reviewed email verification, beta participant records, allow-listed operational events and a separate feedback endpoint. Do not add a server-side assessment store. This is the preferred next release because it provides adoption and usability learning without asking organisations to disclose business-sensitive results.

### Evidence workspace pilot (optional later)

Only if user research demonstrates need: UK-hosted authenticated workspaces, emailed OTP, autosave, export/delete, application audit trail, operational admin, DPIA/security review and invited pilot cohort. Server-side assessment storage is a separate product and privacy decision, not an automatic beta upgrade.

### Team beta

Independent rounds, invitations and roles, disagreement views, action assignment, consensus audit and reviewer sign-off.

### Validation and research release

Content review, public contributor review, user research, inter-rater reliability study, scoring-convention sensitivity analysis and a governed aggregate-research pipeline.

### Later, only if justified

Accessible server-generated PDF, approved external sharing, version-to-version comparison and carefully governed cross-assessment learning. AI assistance remains off by default and requires a separate DPIA, explainability design and processor review.
