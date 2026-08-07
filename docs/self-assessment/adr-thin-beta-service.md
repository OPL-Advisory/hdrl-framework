---
title: ADR — thin beta operations service
description: Decision record for verified email, privacy-preserving beta telemetry and optional feedback.
---

# ADR: thin beta operations service

**Status:** selected and deployed in a non-public activation state; production activation pending approval

**Decision date:** 7 August 2026

**Owners required before launch:** product, controller/privacy, security and operations

## Context

The public beta needs to count starts, progress, report unlocks, download requests and feedback choices, and to know who verified an email at the report gate. Central collection of maturity judgements, certainty, evidence or reports would raise activation energy, confidentiality risk and contractual burden. The static GitHub Pages site cannot safely verify email or enforce a server-side data contract.

## Decision

Keep the assessment and report local. Use a new dedicated Supabase Pro project in West Europe (London), IONOS authenticated SMTP and the existing Plausible account. Accept only three deliberately narrow streams:

1. anonymous aggregate, allow-listed Plausible events with no application identifier;
2. a minimum verified participant profile; and
3. feedback submitted either without contact details or explicitly contactable.

Send verification codes from `report@hdrlframework.org` using `smtp.ionos.co.uk`; use `privacy@hdrlframework.org` as the monitored rights contact. Use a six-digit email code rather than a magic-link token so email addresses, tokens and report data never enter URLs. Keep automatic public-site analytics disabled on the assessment route and emit only the explicitly allow-listed beta events when approved.

## Why this option

- It adds the missing operational capability without turning the beta into a hosted assessment database.
- One managed project provides email identity, Postgres, RLS, Edge Functions, retention scheduling and recovery controls, reducing the number of custom operational components.
- The user approved the dedicated project and its additional US$10 monthly charge. On 7 August 2026, IONOS Mail Basic was activated at £2.50/month excluding VAT and Plausible Business at £19/month excluding VAT; both remain subject to normal subscription review.
- London is available as the database region. Browser calls explicitly request the London Edge region and deployment checks verify the returned region header.
- The application contract and Postgres schema are deliberately small. A future authenticated workspace can extend the same platform or migrate to a sponsor platform without moving browser-local assessments.
- Plausible can answer starts, progress, report unlock requests, download requests and feedback choice without linking that activity to the participant profile.

## Consequences and accepted limits

- OPL Advisory can identify verified report unlockers, but cannot identify people who only open or abandon the beta. Plausible counts and Supabase participant records must not be joined.
- “Download requested” is measurable; successful saving or opening of a local file is not.
- Feedback submitted without contact details is unlinked by application design, but free text or provider security logs mean it must not be described as guaranteed anonymous.
- Disabling beta analytics stops subsequent funnel events, but email verification and deliberately submitted feedback still use the service.
- Browser-only drafts are not recoverable by OPL Advisory. Device loss or clearing browser data can remove them.
- Supabase, Plausible and IONOS remain processors/subprocessors requiring current contracts, location/transfer review, deletion terms and incident contacts.
- Benchmarking, uploaded evidence, team workspaces, central result storage and AI recommendations are excluded.

## Release conditions

The committed configuration stays off until the controller, privacy contact, lawful bases/LIA, processor DPAs and transfers, retention/recovery treatment, incident route, security tests and public privacy notice have named approval. IONOS SMTP and a token-only six-digit OTP journey were activated and tested with a synthetic identity on 7 August 2026; delivery and single use passed after operator credential rotation. The remaining wrong-code, expiry, abuse and log-content tests still require release evidence. Production requires a separate explicit change that publishes the browser-safe key and enables the Supabase and Plausible flags.

## Revisit triggers

Reconsider the architecture if more than one operator needs routine administration, team workspaces become a near-term commitment, the verified cohort outgrows the chosen tier, institutional procurement requires a different tenancy, or user research shows that the gate materially suppresses useful participation.

## Superseded staging decision

An earlier local proof of concept used Cloudflare Workers, D1 and Resend. It demonstrated the data boundary but is not the activation architecture. Its code may remain temporarily as migration evidence; it must not be deployed or configured as a second production path.
