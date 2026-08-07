---
title: Self-assessment architecture and data model
description: Architecture decision, data model, versioning and security design for an HDRL self-assessment service.
---

# Self-assessment architecture and data model

## Current environment

The framework website is a static MkDocs Material build deployed by GitHub Actions to GitHub Pages. It has no application server, account system or secure assessment store. Plausible provides aggregate website analytics. A static page can host a research prototype, but it cannot safely implement multi-user workspaces, server-side authorisation, invitations, audit trails or reliable report delivery.

## Decision

### Prototype

Build the interaction inside the existing MkDocs site and store one draft in the browser's IndexedDB. Generate HTML, JSON and CSV locally. Do not send registration fields or assessment content anywhere. Mark the page as a research prototype and keep it out of production search indexing.

### Recommended production pilot

Use a separate application at a subdomain such as `assess.hdrlframework.org`, visually linked to the main site:

- static or server-rendered TypeScript application on Cloudflare Pages/Workers;
- Supabase Postgres and Auth in **AWS London (`eu-west-2`)**;
- email one-time passcodes rather than magic-link tokens in URLs;
- Postgres row-level security plus explicit application checks for every workspace operation;
- an application-owned immutable audit table;
- reports generated as accessible HTML, with print/PDF and structured exports;
- custom SMTP in an approved region; and
- no object store in MVP because evidence documents are not uploaded.

Supabase currently lists London as a specific region, offers a production plan from **US$25/month**, seven days of daily backups and Postgres row-level security. A custom SMTP service and front-end hosting add a small variable cost. Before procurement, confirm sterling cost, taxes, sub-processors, support terms, transfer arrangements, deletion behaviour and security evidence.

## Options considered

| Option | Cost and burden | Privacy and control | Lock-in and migration | Decision |
|:--|:--|:--|:--|:--|
| Keep everything on GitHub Pages/IndexedDB | Near-zero hosting cost and lowest operational burden. | Strong data minimisation because nothing leaves the device, but no multi-device return, team workspace, account recovery or service-side deletion/export. | Low lock-in; data are hard to support or recover. | Research prototype only. |
| Cloudflare Workers + D1 | Workers Paid starts at US$5/month; D1 scales to zero and includes substantial usage. EU jurisdiction is available and Time Travel provides 30 days on paid plans. | Small attack surface and simple deployment, but authentication, email, workspace authorisation and operational tooling must be built carefully. D1 jurisdiction is EU, not specifically UK. | Moderate platform lock-in; SQLite is portable but runtime APIs are specific. | Credible low-cost alternative if a dedicated engineering owner accepts the auth burden. |
| Supabase London + Cloudflare front end | From US$25/month plus SMTP and optional hosting. Lower build and support burden. | UK database region, OTP auth, Postgres, RLS and backups. Pro dashboard access roles and platform-log retention are limited; application audit logging remains necessary. | Moderate. Postgres schema and data are portable; Auth and edge integrations require migration work. | **Recommended for a controlled pilot**, subject to procurement and DPIA. |
| Azure UK South application + PostgreSQL | Typically higher baseline cost and operational complexity; pricing depends on provisioned compute, network and monitoring. | Strong regional and enterprise controls, private networking and established procurement routes. | Moderate-to-high service coupling, but PostgreSQL is portable. | Prefer if an institutional sponsor requires Azure tenancy, central identity or enterprise operations. |
| AWS London serverless stack | Can be low at small volume but has more services, policies and observability to operate. | Granular control and UK region; greater configuration risk and specialist burden. | Higher architectural coupling across Cognito, API Gateway/Lambda, database and email. | Not justified for the first pilot without an AWS operating team. |

Current vendor facts should be rechecked at procurement: [Cloudflare D1 location](https://developers.cloudflare.com/d1/configuration/data-location/), [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [Supabase regions](https://supabase.com/docs/guides/platform/regions), [Supabase pricing](https://supabase.com/pricing), [Supabase backups](https://supabase.com/docs/guides/platform/backups), [Azure PostgreSQL overview](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/service-overview).

## Integration implications

- The public framework remains at `hdrlframework.org`; the application uses the same header, typography, colours and content provenance but has an explicit “Assessment workspace” identity.
- Cross-navigation uses normal links. Authentication cookies are scoped to the assessment subdomain and are not shared with the public site.
- A strict Content Security Policy limits scripts and connections to the application, catalogue origin, authentication/database endpoint and approved error reporting.
- The public catalogue can be read from `hdrlframework.org`, but each assessment release also stores the verified catalogue hash and an immutable snapshot so old reports remain interpretable.
- Plausible may receive a page view on the public launch page, but the authenticated application must either have no product analytics in MVP or use a separate event pipeline containing only allow-listed operational events. Assessment values and text are never event properties.

## Authentication and invitations

1. User enters an email address.
2. Service sends a six-digit OTP; the login page contains no secret URL parameter.
3. OTP expires after 10 minutes, is single-use, rate-limited and protected against enumeration with neutral responses.
4. An invitation is a workspace membership record keyed to a normalised email, role and expiry. The email links to the general sign-in page without an invitation token. After OTP authentication, the server resolves pending memberships for that address.
5. Sessions use secure, HttpOnly, SameSite cookies where the chosen framework supports them. Rotation, revocation and idle/absolute expiry are enforced.
6. Every data query checks both authenticated user and current workspace membership server-side. RLS is defence in depth, not the sole control.

Email OTP avoids putting invitation or authentication secrets in URLs. Supabase documents [email OTP](https://supabase.com/docs/guides/auth/auth-email-passwordless), [rate limits](https://supabase.com/docs/guides/auth/rate-limits) and [RLS](https://supabase.com/docs/guides/api/securing-your-api). NCSC advises choosing authentication methods in proportion to the user and service risk.

## Data model

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
