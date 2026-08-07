---
title: Self-assessment architecture and data model
description: Architecture decision, data model, versioning and security design for an HDRL self-assessment service.
---

# Self-assessment architecture and data model

## Current environment

The framework website is a static MkDocs Material build deployed by GitHub Actions to GitHub Pages. It has no application server, account system or secure assessment store. Plausible provides aggregate website analytics. A static page can host a research prototype, but it cannot safely implement multi-user workspaces, server-side authorisation, invitations, audit trails or reliable report delivery.

## Decision

### Prototype

Build the interaction inside the existing MkDocs site and store one draft in the browser's IndexedDB. Generate HTML, JSON and CSV locally. Tool v0.5 includes an optional eight-domain orientation, the complete 64-indicator snapshot and the evidence workspace. Its versioned public-beta configuration has operational collection and Plausible events disabled. It also omits the browser-safe Supabase key, so a configuration mistake cannot activate the service accidentally. Mark the page as a research prototype and keep it out of production search indexing.

### Recommended public beta: local assessment plus a thin operational service

Keep the assessment, notes, evidence references, report and exports in the browser. Add only a small, separately deployed beta service that can:

- use Plausible to count only versioned, allow-listed funnel events without an application session identifier;
- verify an email address at report unlock using a short-lived one-time code;
- store the minimum participant/service metadata needed for beta follow-up;
- accept feedback through a logically separate endpoint, either without contact details or explicitly contactable; and
- support access, correction and deletion of the participant record.

The service must never receive maturity levels, certainty, applicability, boundary text, comments entered as part of the assessment, evidence, report content or downloaded files. Report generation remains local after verification unlocks the interface. People who start but do not unlock a report can be counted in the anonymous aggregate funnel but cannot be identified by OPL Advisory. Report unlockers can be counted and followed up using the separately verified participant record. Plausible events are never joined to that record.

The approved thin-service architecture is a dedicated Supabase Pro project in **West Europe (London)**, IONOS transactional email from `report@hdrlframework.org`, and the existing Plausible account for anonymous aggregate events. The Supabase project, database migrations and Edge Function are deployed in a non-public activation state. The website configuration keeps both remote services off and does not publish the Supabase key. Custom SMTP, controller/processor review, final notices and production security approval remain release gates.

## Options considered

| Option | Cost and burden | Privacy and control | Lock-in and migration | Decision |
|:--|:--|:--|:--|:--|
| Keep everything on GitHub Pages/IndexedDB | Near-zero hosting cost and lowest operational burden. | Strong data minimisation because nothing leaves the device, but OPL Advisory cannot count use or receive feedback unless users send an exported bundle. | Low lock-in; local data are not recoverable by the operator. | Current research prototype. |
| Thin Cloudflare Workers + D1 beta service | Low entry cost, but adds a second application platform and separate transactional-email API. | A small surface is possible, but email encryption, authentication, rights tooling and operating controls become custom code. | Moderate runtime lock-in; the SQLite data are portable. | Superseded proof of concept; not the activation path. |
| Dedicated Supabase London project + IONOS SMTP + Plausible | The approved project adds US$10/month to the existing Pro organisation. The existing Plausible account is in trial and the HDRL domain has no IONOS mailbox licence, so both need a separately approved subscription/order. One Supabase dashboard covers Auth, Postgres, Edge Functions and scheduled retention. | London database, managed email OTP, RLS, backups and a narrow Edge API. Assessment data still remain local. Supplier terms, logs and subprocessors require review. | Moderate. Postgres and the small schema are portable; Auth/Edge integration would need adaptation. | **Selected for the beta**, subject to release conditions. |
| Azure UK South application + PostgreSQL | Typically higher baseline cost and operational complexity; pricing depends on provisioned compute, network and monitoring. | Strong regional and enterprise controls, private networking and established procurement routes. | Moderate-to-high service coupling, but PostgreSQL is portable. | Prefer if an institutional sponsor requires Azure tenancy, central identity or enterprise operations. |
| AWS London serverless stack | Can be low at small volume but has more services, policies and observability to operate. | Granular control and UK region; greater configuration risk and specialist burden. | Higher architectural coupling across Cognito, API Gateway/Lambda, database and email. | Not justified for the first pilot without an AWS operating team. |

Current vendor facts should be rechecked at each material renewal or release: [Supabase regions](https://supabase.com/docs/guides/platform/regions), [regional Edge Function invocation](https://supabase.com/docs/guides/functions/regional-invocation), [Supabase pricing](https://supabase.com/pricing), [Supabase backups](https://supabase.com/docs/guides/platform/backups), [Supabase custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [Plausible custom events](https://plausible.io/docs/custom-event-goals), [Plausible privacy](https://plausible.io/privacy), [IONOS email-server settings](https://www.ionos.co.uk/help/email/general-topics/settings-for-your-email-programs-imap-pop3/) and [Azure PostgreSQL](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/service-overview).

Azure and AWS remain future enterprise-workspace options, not prerequisites for this browser-local beta.

## Public-beta data boundary

| Stream | May be sent | Must not be sent |
|:--|:--|:--|
| Operational funnel | allow-listed event name; tool/framework versions; coarse active-time band; completed indicator/domain counts; download-request type; feedback submitted/skipped disposition | application session or participant ID; email; organisation; level; certainty; applicability; assessment title/scope; comments; evidence; report content |
| Verified participant | email; role; organisation; individual/team use; broad intended-use category; optional name, region/service type/scale; verification/security state; separate optional contact preferences | assessment results, notes, evidence, report or export |
| Feedback without contact details | rating/category/comment plus allow-listed tool context and coarse completion/time bands | participant or analytics ID, email or organisation; exact assessment values; assessment text |
| Contactable feedback | the feedback fields above plus an explicit contact reference | assessment results unless separately and explicitly shared |
| Explicit results share | only categories reviewed and selected by the assessor in the locally created bundle | automatic/background upload of any result |

Feedback “without contact details” is safer wording than an absolute promise of anonymity. Free text can identify its author, and unusual context or network logs can create linkage risk. The feedback endpoint therefore uses no authentication token or analytics identifier, rounds timestamps, minimises IP/security-log retention and stores feedback separately from participant data.

The browser can observe that a download action was requested, but it cannot prove that the user retained or opened the file. Product reporting must use “download requested”, not “download completed”.

## Integration implications

- The public beta can remain a visually integrated static route on `hdrlframework.org`; it calls the thin service only for allow-listed operational, verification and feedback functions.
- A strict Content Security Policy should limit scripts and connections to the catalogue, Supabase and Plausible origins when the beta is enabled. Assessment content never appears in requests.
- If a later workspace application uses `assess.hdrlframework.org`, cross-navigation uses normal links and authentication cookies are scoped to that subdomain.
- The public catalogue can be read from `hdrlframework.org`, but each assessment release also stores the verified catalogue hash and an immutable snapshot so old reports remain interpretable.
- The assessment route keeps automatic public-site page views disabled. If the beta flag is enabled, Plausible receives only explicit product events from a versioned allow-list. Assessment values, text, email, organisation and Supabase identity are never event properties.

## Public-beta verification

1. A person can start and complete the local snapshot without registration.
2. Before viewing the full report or making the first export, the service requests email, role and organisation; other profile fields are optional.
3. The service sends a six-digit one-time code. The code expires quickly, is single-use and is never placed in a URL.
4. Successful verification unlocks local report generation and records that the participant reached the report gate; it does not upload assessment state.
5. Research contact and newsletter preferences are separate, optional and unchecked. Report access is not marketing consent.

## Implemented thin-service controls

- Plausible receives only versioned, allow-listed event names and coarse properties. The application sends no session, participant, email or organisation identifier and disables automatic page views for this route.
- Unexpected top-level fields and event properties are rejected, not silently discarded. This makes an accidental `level`, `certainty`, boundary, evidence or report upload fail closed.
- Supabase Auth stores and verifies the email identity. The beta schema stores the minimum participant profile against the Auth user ID; RLS is enabled and public table grants are revoked.
- OTPs are six digits and expire after 10 minutes. Endpoint throttling uses an HMAC-derived rate key; the application does not persist raw IP addresses.
- Feedback without contact details has no participant key. Contactable feedback requires a currently valid user access token held in memory only.
- The Edge Function exposes participant creation, feedback, verified export, correction and deletion. A scheduled Postgres function applies retention, including deletion of unverified Auth users after 24 hours.
- The browser supplies the publishable API key, but only the Edge Function holds a secret key. The Function validates origins, requires the API key, authenticates protected actions and records no request body or assessment content in application logs.
- The browser pins function requests to `eu-west-2`; deployment verification checks the `x-sb-edge-region` response. Database storage is in the London region.
- Remote collection is disabled in the committed configuration. Enabling the service requires the approved environment, the explicit remote flag, a browser-safe key and separately enabled Plausible configuration.

The beta integration does not write remote identifiers to cookies, local storage or session storage. The assessment draft remains in IndexedDB because local save-and-return is the product function; the interface provides a persistent analytics objection/disable control while leaving requested verification and deliberately submitted feedback available.

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
| `beta_participants` | Supabase Auth user reference, role, organisation, use mode, intended-use category, optional profile bands, verification/last-seen dates, retention date; email remains in Auth |
| `beta_contact_preferences` | participant, purpose, wording version, affirmative action, date, withdrawn date |
| `beta_feedback` | separate random id, contact mode, rating/category/comment, allow-listed coarse context, received date; nullable explicit participant reference |
| `beta_privacy_requests` | participant, request type/date/status and completion date |
| `beta_rate_limits` | keyed, expiring abuse-control counters; no raw IP address |
| `beta_admin_audit` | narrow administrative action metadata without request or assessment content |

Plausible holds the separate aggregate event stream under its own configured retention and access controls. There is deliberately no analytics/event table or join key in the Supabase project.

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
