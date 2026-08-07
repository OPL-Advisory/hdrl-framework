# HDRL thin beta service

> **Superseded proof of concept — do not deploy.** The approved beta path is the dedicated Supabase London project in [`../../supabase`](../../supabase), with Plausible aggregate events and IONOS SMTP. This Worker is retained only as design/migration evidence and must not be configured as a second operational service.

This Cloudflare Worker was the first operational companion explored for the browser-only HDRL self-assessment. It stores beta administration and coarse funnel data only. It must never receive assessment levels, certainty, scope, comments, evidence or report content.

## Data boundary

- `POST /v1/sessions` creates a random pseudonymous session.
- `POST /v1/events` accepts only the versioned event and property allow-list.
- `POST /v1/verification/*` sends and confirms a single-use six-digit report code.
- `POST /v1/feedback` stores feedback separately, without a session or participant link unless contactable mode is explicitly selected.
- `POST /v1/privacy/*` provides verified access/export, profile correction and live deletion. Changing the verified email is handled through the published privacy contact.
- `/v1/admin/*` provides aggregate counts and a separately protected participant export.

Email and profile metadata are encrypted before D1 storage. Email addresses are indexed by a keyed digest. Request bodies, email addresses and OTPs must not be logged. Worker observability is disabled in the committed configuration.

## Activation gates

Before staging deployment:

1. Create D1 with `--jurisdiction=eu`; replace each environment's database ID in `wrangler.jsonc`.
2. Set independent Worker secrets for `DATA_ENCRYPTION_KEY_BASE64`, `HASH_SECRET`, `OTP_SECRET`, `RECEIPT_SECRET`, `ADMIN_TOKEN` and `RESEND_API_KEY`.
3. Verify the dedicated `beta.hdrlframework.org` sending subdomain with the transactional-email provider. The proposed sender is `HDRL beta <report@beta.hdrlframework.org>`; it need not be an inbound mailbox.
4. Confirm controller details, privacy contact, Article 28 terms, international-transfer assessment, retention and incident contacts.
5. Apply migrations and test only with synthetic records.
6. Keep the website's remote collection flag off until the privacy notice and production security review are approved.

The local development provider returns the test OTP only when both the environment is `local` and `ALLOW_DEVELOPMENT_OTP_RETURN=true`.

## Local verification

```console
npm install
npm run db:migrate:local
npm run check
npm run dev
```

Copy `.dev.vars.example` to the ignored `.dev.vars` file and replace every placeholder with independent synthetic-development values before starting the Worker. The website permits a local-only service override:

```text
http://127.0.0.1:8123/self-assessment/?beta-api=http://127.0.0.1:8787
```

The override is accepted only on `localhost`, `127.0.0.1` or a `.localhost` hostname. It cannot enable a service from the deployed website.

## Staging activation

After the activation gates have named approval:

1. Sign in with `npx wrangler login` using the organisation-controlled Cloudflare account with MFA.
2. Create `hdrl-beta-staging` and `hdrl-beta-production` with `npx wrangler d1 create <name> --jurisdiction=eu`.
3. Replace only the two cloud database placeholders in `wrangler.jsonc`; keep the local placeholder for local emulation.
4. In Resend, verify `beta.hdrlframework.org`, choose Ireland as the sending region and create a sending-only API key. Complete the DPA, subprocessor and US-metadata transfer review first.
5. Add each secret interactively with `npx wrangler secret put <NAME> --env staging`. Do not put secret values in command arguments, shell history, `.env`, GitHub Pages or the website configuration.
6. Run `npm run db:migrate:staging`, `npm run check`, `npm audit` and `WRANGLER_LOG_PATH=/tmp/hdrl-wrangler-dry-run.log npx wrangler deploy --dry-run --env staging`.
7. Run `npm run deploy:staging`. Keep `remote_collection_enabled` false and test the staging endpoint with synthetic identities from a local preview.
8. Inspect D1 directly to confirm event/property allow-lists, ciphertext participant profiles, unlinked without-contact feedback, retention dates and deletion.

Production needs fresh independent secrets, the production migration, an approved custom API hostname such as `beta-api.hdrlframework.org`, a production penetration/access-control check and an explicit website-config change. Do not reuse the staging Worker URL, database, keys or Resend API key.

## Operational endpoints

- `GET /health` is public and contains no database or participant detail.
- `GET /v1/admin/summary` requires `Authorization: Bearer …` and returns aggregate funnel counts.
- `GET /v1/admin/participants` requires the same credential and returns the minimum decrypted administration export. Use it only for an approved beta purpose and do not save it to an unmanaged device.

The administrator token is an interim thin-beta control. Store it in the approved password manager and access the Cloudflare account with MFA. Before a public beta, nominate a second authorised operator and a break-glass contact.

## Retention and recovery

The scheduled Worker runs daily. It removes expired verification and rate-limit rows, events/sessions after 183 days, participant and feedback records after 365 days, rights-request records after 24 months and administrative audit rows after 12 months. Verified deletion removes linked live records immediately; D1 recovery copies then expire after seven days on Free or 30 days on Paid.

Changing the encryption or email-index secret without migrating stored records makes those records unreadable or unfindable. Use a controlled re-encryption/re-index migration, or—if the approved incident plan permits—delete the small beta dataset and restart. OTP, receipt, administrator and Resend credentials can be rotated independently, with active codes/receipts invalidated where applicable.
