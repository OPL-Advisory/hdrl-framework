---
title: ADR — thin beta operations service
description: Decision record for verified email, privacy-preserving beta telemetry and optional feedback.
---

# ADR: thin beta operations service

**Status:** implemented for local and synthetic staging tests; external activation pending approval

**Decision date:** 7 August 2026

**Owners required before launch:** product, controller/privacy, security and operations

## Context

The public beta needs to count starts, progress, report unlocks, download requests and feedback choices, and to know who verified an email at the report gate. Central collection of maturity judgements, certainty, evidence or reports would raise activation energy, confidentiality risk and contractual burden. The static GitHub Pages site cannot safely verify email or enforce a server-side data contract.

## Decision

Keep the assessment and report local. Add a separately deployed Cloudflare Worker, an EU-jurisdiction D1 database and Resend transactional email. Accept only three deliberately narrow streams:

1. pseudonymous, allow-listed operational events;
2. a minimum verified participant profile; and
3. feedback submitted either without contact details or explicitly contactable.

Use `beta.hdrlframework.org` as a dedicated sending subdomain. Use a six-digit email code rather than a magic-link token so email addresses, tokens and report data never enter URLs. Keep public-site analytics disabled on the assessment route.

## Why this option

- It adds the missing operational capability without turning the beta into a hosted assessment database.
- One Worker, one small SQLite-compatible database and one email provider are proportionate for a one-person operator.
- Free tiers are sufficient to start; Cloudflare Workers Paid is an optional US$5/month choice if a 30-day rather than seven-day D1 recovery window is preferred.
- The application contract, schema and exports are small enough to migrate later. A full authenticated workspace can move to Postgres/Supabase or a sponsor platform without moving locally held assessments.
- Resend provides a simple transactional API and an Ireland sending region, but US metadata storage remains an explicit transfer-review item.

## Consequences and accepted limits

- OPL Advisory can identify verified report unlockers, but cannot identify people who only open or abandon the beta.
- “Download requested” is measurable; successful saving or opening of a local file is not.
- Feedback submitted without contact details is unlinked by application design, but free text or provider security logs mean it must not be described as guaranteed anonymous.
- Disabling operational telemetry stops subsequent funnel events, but email verification and deliberately submitted feedback still use the service.
- Browser-only drafts are not recoverable by OPL Advisory. Device loss or clearing browser data can remove them.
- Email metadata is an international-processing dependency. Resend activation requires DPA/subprocessor/transfer review and a verified domain.
- Benchmarking, uploaded evidence, team workspaces, central result storage and AI recommendations are excluded.

## Release conditions

The committed configuration stays off until the controller, privacy contact, lawful bases/LIA, processor DPAs and transfers, retention, incident route, sender domain, security tests and public privacy notice have named approval. Staging must use synthetic data first. Production requires a separate explicit configuration change and review.

## Revisit triggers

Reconsider the architecture if more than one operator needs routine administration, team workspaces become a near-term commitment, the verified cohort exceeds the free-tier envelope, institutional procurement requires a UK tenancy, or user research shows that the gate materially suppresses useful participation.
