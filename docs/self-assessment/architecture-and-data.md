---
title: Self-assessment architecture and data model
description: Architecture decision, data model, versioning and security design for an HDRL self-assessment service.
---

# Self-assessment architecture and data model

## Current environment

The framework website is a static MkDocs Material build deployed by GitHub Actions to GitHub Pages. It has no application server, account system or secure assessment store. Plausible provides aggregate website analytics. A static page can host a research prototype, but it cannot safely implement multi-user workspaces, server-side authorisation, invitations, audit trails or reliable report delivery.

## Decision

### Prototype

Build the interaction inside the existing MkDocs site and store one draft in the browser's IndexedDB. Generate HTML, JSON and CSV locally. The v0.3 prototype includes an optional eight-domain orientation, the complete 64-indicator snapshot and the evidence workspace. It records the proposed beta funnel locally for inspection, but its versioned configuration has no endpoints and refuses to start if remote collection is enabled. Do not send registration fields or assessment content anywhere. Mark the page as a research prototype and keep it out of production search indexing.

### Recommended public beta: local assessment plus a thin operational service

Keep the assessment, notes, evidence references, report and exports in the browser. Add only a small, separately deployed beta service that can:

- issue a random beta-session identifier and accept allow-listed funnel events;
- verify an email address at report unlock using a short-lived one-time code;
- store the minimum participant/service metadata needed for beta follow-up;
- accept feedback through a logically separate endpoint, either without contact details or explicitly contactable; and
- support access, correction and deletion of the participant record.

The service must never receive maturity levels, certainty, applicability, boundary text, comments, evidence, report content or downloaded files. Report generation remains local after the verification response unlocks the interface. People who start but do not unlock a report are visible only as pseudonymous funnel sessions; report unlockers can be counted and followed up using the verified participant record. This deliberately accepts that OPL Advisory will not know the identity of every person who merely opens or abandons the tool.

For the thin beta service, Cloudflare Workers plus D1 is the leading low-burden option; Supabase is the leading option if authenticated workspaces are likely soon. The final provider, email service, region, spend and processor terms require explicit approval before implementation. No provider has been activated by this branch.

## Options considered

| Option | Cost and burden | Privacy and control | Lock-in and migration | Decision |
|:--|:--|:--|:--|:--|
| Keep everything on GitHub Pages/IndexedDB | Near-zero hosting cost and lowest operational burden. | Strong data minimisation because nothing leaves the device, but OPL Advisory cannot count use or receive feedback unless users send an exported bundle. | Low lock-in; local data are not recoverable by the operator. | Current research prototype. |
| Thin Cloudflare Workers + D1 beta service | Workers Paid starts at US$5/month; D1 scales to zero and includes substantial usage. EU jurisdiction is available and Time Travel provides 30 days on paid plans. | Small data model and attack surface; requires a transactional-email processor, endpoint validation, deletion tooling and careful feedback separation. D1 jurisdiction is EU, not specifically UK. | Moderate runtime lock-in; the small SQLite dataset and versioned event contract are portable. | **Leading public-beta option**, subject to provider/privacy approval. |
| Supabase London + Cloudflare front end | From US$25/month plus SMTP and optional hosting. Lower build and support burden. | UK database region, OTP auth, Postgres, RLS and backups. Pro dashboard access roles and platform-log retention are limited; application audit logging remains necessary. | Moderate. Postgres schema and data are portable; Auth and edge integrations require migration work. | **Recommended for a controlled pilot**, subject to procurement and DPIA. |
| Azure UK South application + PostgreSQL | Typically higher baseline cost and operational complexity; pricing depends on provisioned compute, network and monitoring. | Strong regional and enterprise controls, private networking and established procurement routes. | Moderate-to-high service coupling, but PostgreSQL is portable. | Prefer if an institutional sponsor requires Azure tenancy, central identity or enterprise operations. |
| AWS London serverless stack | Can be low at small volume but has more services, policies and observability to operate. | Granular control and UK region; greater configuration risk and specialist burden. | Higher architectural coupling across Cognito, API Gateway/Lambda, database and email. | Not justified for the first pilot without an AWS operating team. |

Current vendor facts should be rechecked at procurement: [Cloudflare D1 location](https://developers.cloudflare.com/d1/configuration/data-location/), [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [Supabase regions](https://supabase.com/docs/guides/platform/regions), [Supabase pricing](https://supabase.com/pricing), [Supabase backups](https://supabase.com/docs/guides/platform/backups), [Azure PostgreSQL overview](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/service-overview).

The Supabase, Azure and AWS rows describe a later server-side workspace service, not a prerequisite for the public beta.

## Public-beta data boundary

| Stream | May be sent | Must not be sent |
|:--|:--|:--|
| Operational funnel | random beta-session ID; tool/framework versions; event/time; coarse active-time band; completed indicator/domain counts; download-request type; feedback submitted/skipped disposition | email; organisation; level; certainty; applicability; assessment title/scope; comments; evidence; report content |
| Verified participant | email; role; organisation; individual/team use; broad intended-use category; optional name, region/service type/scale; verification/security state; separate optional contact preferences | assessment results, notes, evidence, report or export |
| Feedback without contact details | rating/category/comment plus allow-listed tool context and coarse completion/time bands | participant/session ID, email or organisation; exact assessment values; assessment text |
| Contactable feedback | the feedback fields above plus an explicit contact reference | assessment results unless separately and explicitly shared |
| Explicit results share | only categories reviewed and selected by the assessor in the locally created bundle | automatic/background upload of any result |

Feedback “without contact details” is safer wording than an absolute promise of anonymity. Free text can identify its author, and unusual context or network logs can create linkage risk. The feedback endpoint should therefore use no authentication cookie or beta-session identifier, round timestamps, minimise IP/security-log retention and store feedback separately from participant/event tables.

The browser can observe that a download action was requested, but it cannot prove that the user retained or opened the file. Product reporting must use “download requested”, not “download completed”.

## Integration implications

- The public beta can remain a visually integrated static route on `hdrlframework.org`; it calls the thin service only for allow-listed operational, verification and feedback functions.
- A strict Content Security Policy limits scripts and connections to the catalogue and approved beta-service origins. Assessment content never appears in requests.
- If a later workspace application uses `assess.hdrlframework.org`, cross-navigation uses normal links and authentication cookies are scoped to that subdomain.
- The public catalogue can be read from `hdrlframework.org`, but each assessment release also stores the verified catalogue hash and an immutable snapshot so old reports remain interpretable.
- Plausible may receive a page view on the public launch page, but the assessment route keeps public-site analytics disabled. Product learning uses the separate event pipeline and its versioned allow-list. Assessment values and text are never event properties.

## Public-beta verification

1. A person can start and complete the local snapshot without registration.
2. Before viewing the full report or making the first export, the service requests email, role and organisation; other profile fields are optional.
3. The service sends a six-digit one-time code. The code expires quickly, is single-use and is never placed in a URL.
4. Successful verification unlocks local report generation and records that the participant reached the report gate; it does not upload assessment state.
5. Research contact and newsletter preferences are separate, optional and unchecked. Report access is not marketing consent.

## Later workspace authentication and invitations

1. User enters an email address.
2. Service sends a six-digit OTP; the login page contains no secret URL parameter.
3. OTP expires after 10 minutes, is single-use, rate-limited and protected against enumeration with neutral responses.
4. An invitation is a workspace membership record keyed to a normalised email, role and expiry. The email links to the general sign-in page without an invitation token. After OTP authentication, the server resolves pending memberships for that address.
5. Sessions use secure, HttpOnly, SameSite cookies where the chosen framework supports them. Rotation, revocation and idle/absolute expiry are enforced.
6. Every data query checks both authenticated user and current workspace membership server-side. RLS is defence in depth, not the sole control.

Email OTP avoids putting invitation or authentication secrets in URLs. Supabase documents [email OTP](https://supabase.com/docs/guides/auth/auth-email-passwordless), [rate limits](https://supabase.com/docs/guides/auth/rate-limits) and [RLS](https://supabase.com/docs/guides/api/securing-your-api). NCSC advises choosing authentication methods in proportion to the user and service risk.

## Data model

### Thin public-beta service

| Entity | Essential fields |
|:--|:--|
| `beta_sessions` | random id, tool/framework versions, created/last-event dates, retention date; optional participant link only after verified unlock |
| `beta_events` | session, allow-listed event name, timestamp or time bucket, coarse duration/progress properties, schema version |
| `beta_participants` | verified email, role, organisation, use mode, intended-use category, optional profile bands, verification/last-seen dates, retention date |
| `contact_preferences` | participant, purpose, wording version, affirmative action, date, withdrawn date |
| `feedback` | separate random id, contact mode, rating/category/comment, allow-listed coarse context, received date; nullable explicit contact reference and no beta-session reference |
| `rights_requests` | participant or feedback reference, request type/date/status, completion evidence |

### Later server-side assessment workspace

| Entity | Essential fields |
|:--|:--|
| `users` | id, verified email, name, role, organisation, region, created/last-seen timestamps, status |
| `workspaces` | id, title, service/ecosystem, service type/scale, boundary, unit, intended use, method, owner, status, retention date |
| `memberships` | workspace, user or invited email digest, role, invitation state/expiry, joined date |
| `assessment_releases` | framework, catalogue, tool, guidance, rules and report versions; hashes; immutable release timestamp |
| `assessments` | workspace, release, stage, round, status, assessment date, local conventions |
| `rapid_responses` | assessment, domain, impression band or deferred status, certainty, note, author, timestamp |
| `indicator_responses` | assessment, indicator ref, judgement decision, no-judgement status/reason, maturity judgement, certainty, rationale, improvement note, author, timestamps |
| `domain_capacity_notes` | assessment, domain ref, operating-capacity or constraint note, author, timestamps |
| `evidence_records` | workspace, title, type, URL/internal reference, owner/source, evidence date, short note, limitation, review status |
| `evidence_links` | evidence record, indicator response, supported level or claim |
| `round_submissions` | assessment, participant, submitted/withdrawn timestamps, hidden-until-close state |
| `consensus_decisions` | indicator, independent distribution snapshot, agreed judgement/status, rationale, facilitator, participants, date |
| `actions` | indicator, owner, description, due date, status |
| `audit_events` | workspace, actor, event type, entity/id, material before/after digest or redacted diff, reason, timestamp |
| `reports` | assessment, report version, generated date, derivation snapshot, status; no public URL |
| `contact_preferences` | user, purpose, channel, wording version, affirmative action, date, withdrawn date |
| `deletion_jobs` | scope, requested by/date, state, completion date, backup-expiry date |

Free text is length-limited and escaped on output. URLs are normalised and displayed with `rel="noopener noreferrer"`. Evidence records do not accept files in MVP.

## Versioning and provenance

Each assessment and report stores:

- HDRL Framework version;
- indicator-catalogue version and SHA-256;
- tool version;
- guidance/rapid-question version;
- recommendation-rules version;
- report-generation version;
- assessment date and time zone;
- local scoring conventions; and
- immutable descriptor/evidence snapshots or a release foreign key.

Changing guidance or rules creates a new release even when the framework and catalogue do not change. Re-running a report against new rules creates a new report version; it does not overwrite the original.

## Scoring and derivation

- Rapid impressions are categorical domain impressions and are never included in HDRL domain calculations.
- Evidence-led domain summaries use applicable **Core** indicator judgements and exclude Outcome/Context (`Y`) entries, consistent with the published method.
- Missing, not known, not assessed and not applicable responses are not imputed.
- For an odd count, report the observed middle level. For an even count, report the two middle observed levels as a range when they differ.
- Enhancement indicators appear in the profile and roadmap but do not silently alter the general domain summary.
- No cross-domain overall result is calculated.

## Security baseline

- TLS in transit; managed encryption at rest; separate secrets manager; key rotation.
- MFA for administrators and least-privilege production roles.
- RLS and application authorisation tests for every role and entity.
- Parameterised queries, output encoding, CSP and strict file-free input surface.
- Rate limiting and bot protection on OTP, registration, invite and report generation.
- Unpredictable internal identifiers; no record identifiers or secrets in public report URLs.
- Structured logs with field allow-lists; request bodies, query strings, emails and assessment content are redacted.
- Audit material changes, membership changes, exports, report access and deletion.
- Dependency, SAST, secret and container scans in CI; annual penetration test and pre-release access-control test.
- Restore tests and a deletion-aware backup runbook.

## AI recommendation decision

AI recommendations are **not included**. Sending assessment content to a third-party model would introduce new processors, international-transfer questions, prompt-injection and confidentiality risks, unpredictable cost and weaker traceability. Any future experiment requires an approved DPIA, processor review, redaction/minimisation design, human review, versioned prompts/models and a non-AI route. It must be opt-in and must never be the default report generator.
