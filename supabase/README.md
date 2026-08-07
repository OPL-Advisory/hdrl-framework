# HDRL thin beta operations service

This is the selected server-side companion for the browser-local HDRL self-assessment. It stores verified beta-participant administration, contact preferences, deliberately submitted feedback and privacy-request/audit records. It has no tables or endpoints for assessment responses, evidence or reports.

## Deployed staging project

- Supabase project: `HDRL Framework Beta`
- project reference: `grajbgnnnlhzvdxhldvy`
- database region: West Europe (London)
- Edge Function: `beta-service`, browser calls pinned to `eu-west-2`
- public activation: **off** in `docs/data/hdrl-assessment-beta-config-v0.3.0.json`

The project may contain synthetic security-test identities only until the release gate in `docs/self-assessment/operations-and-roadmap.md` is approved. Do not put the Supabase secret key, SMTP password or Auth access token in Git, website configuration, URLs, analytics, application logs or support tickets.

## Source layout

- `migrations/20260807123000_thin_beta_service.sql`: tables, default-deny RLS, rate limiter and scheduled retention.
- `migrations/20260807124500_service_role_grants.sql`: explicit least-privilege service-role grants.
- `migrations/20260807130000_unverified_auth_retention.sql`: 24-hour cleanup for abandoned email verification records.
- `migrations/20260807131500_harden_rls_auto_enable.sql`: removes API-role execution of the platform auto-RLS helper.
- `functions/beta-service/index.ts`: origin-checked participant, feedback, access, correction and deletion API.
- `functions/_shared/privacy-boundary.mjs`: fail-closed request allow-lists.
- `tests/privacy-boundary.test.mjs`: executable boundary tests.

The initial project was bootstrapped through the Supabase dashboard. The baseline migration uses `if not exists` for tables and indexes so it can later be adopted by Supabase CLI migration history without trying to replace deployed records. Use the CLI's documented migration-repair workflow when linking the project; do not invent migration-history rows by hand.

## Verification

Run locally from the repository root:

```console
node --check supabase/functions/beta-service/index.ts
node --check supabase/functions/_shared/privacy-boundary.mjs
node --test supabase/tests/privacy-boundary.test.mjs
./.venv/bin/python scripts/validate_self_assessment.py
```

In Supabase, rerun Security Advisor after every schema change. The expected baseline is zero errors and zero warnings. Its six informational `RLS Enabled No Policy` notices are deliberate: public and authenticated table grants are revoked, no client policy exists, and only the Edge Function service role has the explicit grants above.

For a synthetic remote check:

1. confirm `GET /functions/v1/beta-service/health?forceFunctionRegion=eu-west-2` returns service version `0.3.0`;
2. confirm the response header reports Edge region `eu-west-2`;
3. confirm a write without an approved publishable API key returns `invalid_client`;
4. confirm a feedback request containing an assessment-like field returns `privacy_boundary_violation`;
5. delete every synthetic Auth, participant or feedback record; and
6. confirm all six beta tables retain RLS and the daily `hdrl-beta-retention` cron job exists.

Never use a real assessment or business-sensitive text in these tests.

## IONOS SMTP activation

The following non-public staging configuration was activated and tested on 7 August 2026:

- `report@hdrlframework.org` is an IONOS Mail Basic mailbox and the authenticated sender;
- `privacy@hdrlframework.org` forwards to a monitored OPL Advisory inbox;
- Supabase uses `smtp.ionos.co.uk`, port `587`, STARTTLS, username `report@hdrlframework.org` and sender name `HDRL Framework beta`;
- Supabase's separate pre-sign-in email-confirmation step is disabled so new and returning users use the same passwordless OTP template;
- both the confirm-sign-up and magic-link templates contain the six-digit token, a 10-minute expiry statement, the privacy contact and no link; and
- a synthetic request was delivered through IONOS and the correct OTP returned HTTP 200 from Supabase verification.

Before public activation:

1. confirm the privacy forwarding test arrived at the monitored destination;
2. place the mailbox credential in the approved password manager and document the named operators without copying it into this repository;
3. test a wrong code, code reuse, expiry, rate limiting and registered/unregistered timing with synthetic addresses;
4. check that Auth, Function and IONOS logs contain no email body, OTP, assessment information or report content; and
5. record privacy/processor, security and operational approval in the release evidence.

## Public activation

Activation is a reviewed code change, not a dashboard-only switch. It must:

1. complete the release gates and record named approval;
2. put only the browser-safe `sb_publishable_…` key into the versioned beta configuration;
3. set `remote_collection_enabled` and `plausible.enabled` to `true` together with the approved privacy-notice version;
4. ensure the assessment route still disables automatic page views;
5. run the full local/site/security test suite and a synthetic end-to-end OTP journey; and
6. deploy through the normal branch/PR review process.

Rolling back means restoring the two flags to `false` and removing the public key from the website configuration. That stops new public calls; it does not replace the rights, retention and incident procedures for data already held.
