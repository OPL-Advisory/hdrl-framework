---
title: HDRL self-assessment research prototype
description: Try a private on-device HDRL orientation, 64-indicator snapshot and evidence-led assessment without sending assessment information to a server.
robots: noindex, nofollow
analytics: false
hide:
  - navigation
  - toc
---

# HDRL self-assessment research prototype

<div class="hdrl-prototype-banner" role="note">
  <strong>Research prototype — not a live assessment service.</strong>
  Your entries stay in this browser on this device. Nothing is submitted, emailed or shared. Use non-sensitive test information.
</div>

This prototype explores how people and teams could learn the **Health Data Readiness Level (HDRL) Framework** by applying it at progressively greater depth. It is not accreditation, certification, an official standard, a validated benchmark or an endorsement.

<div
  id="hdrl-assessment-root"
  class="hdrl-assessment"
  data-catalogue-url="../../data/hdrl-indicators-v1.json"
  data-content-url="../../data/hdrl-assessment-content-v0.2.0.json"
  data-beta-config-url="../../data/hdrl-assessment-beta-config-v0.1.0.json"
  aria-busy="true"
>
  <p>Loading the assessment prototype…</p>
</div>

<noscript>
  <div class="admonition warning">
    <p class="admonition-title">JavaScript is required for this prototype</p>
    <p>You can still read the complete framework and use the downloadable catalogue without JavaScript.</p>
  </div>
</noscript>

## About this prototype

- The optional **eight-domain orientation** is designed for about 5–10 minutes. It does not calculate HDRL indicator or domain scores.
- The **whole-framework snapshot** covers all 64 indicators with a minimum of one canonical level/status selection and one certainty selection. It is explicitly provisional and does not require evidence.
- The **evidence-led pass** makes all 64 canonical indicators available and keeps the catalogue wording unchanged.
- Save and return uses browser storage on this device. Clearing browser data removes the draft.
- Evidence records contain references and notes only. There is no file upload.
- The report is generated on this device and can be printed or exported as JSON and CSV.
- A short optional feedback checkpoint appears before the first report export. It can be skipped; the prototype only saves the response on this device.
- The local beta record contains event names, coarse time bands and completion counts—not levels, certainty, assessment text, evidence or report contents—and can be inspected or downloaded.
- The report-information gate is a simulation: details entered there are not emailed or transmitted. A production beta would verify email without uploading assessment results.
- Results can leave the browser only when the user deliberately downloads an assessment export or creates a clearly labelled results share bundle.

Do not enter patient-level data, personal confidential data, passwords, API keys, access tokens or unnecessarily sensitive operational information.

<div class="hdrl-button-grid hdrl-button-grid--two" markdown>

[Read the design rationale](research-and-design.md){ .md-button }
[Review the v0.2 persona pass](persona-review-v0.2.md){ .md-button }
[Review privacy and data flow](privacy-and-data-flow.md){ .md-button }
[Read the product requirements](product-requirements.md){ .md-button }
[Review architecture and data](architecture-and-data.md){ .md-button }

</div>
