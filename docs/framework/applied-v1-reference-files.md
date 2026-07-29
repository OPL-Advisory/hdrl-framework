---
title: Framework Files and Data
description: Download the complete HDRL Framework v1.0 method, machine-readable indicator catalogue, JSON Schema and checksums.
---

# Framework Files and Data

This page provides the versioned files for reading, applying and building with the **HDRL Framework v1.0**.

## Choose the right format

| If you need to… | Use |
|:--|:--|
| Read or apply the complete framework method | [Complete framework source — Markdown](#complete-framework-source-markdown) |
| Build an assessment tool or other software | [Indicator catalogue — JSON](#machine-readable-indicator-catalogue-json) |
| Validate the structure of the catalogue | [JSON Schema](#machine-readable-indicator-catalogue-json) |
| Verify the exact published files | [SHA-256 checksums](#versions-and-integrity) |
| Read the research account and compact indicator table | [medRxiv paper and Supplementary Table S1](#research-publication) |

!!! important "Source hierarchy"
    The Markdown file is the complete canonical method source for HDRL Framework v1.0. The JSON catalogue is its official machine-readable representation of the indicator records and is automatically checked against that Markdown. If a discrepancy is ever found, use the Markdown and [report it through GitHub](https://github.com/OPL-Advisory/hdrl-framework/issues){ target="_blank" rel="noopener" }.

## Complete framework source — Markdown

**Health Data Readiness Level Framework V1.md** contains the complete framework and method: purpose and scope, classifications, all 64 indicators and maturity descriptors, minimum evidence and assessor guidance, the historical project-specific capability map, and the methodology and evidence base.

<div class="hdrl-button-grid" markdown>

[Download the complete framework as Markdown :material-download:](/downloads/health-data-readiness-level-framework-v1.md){ .md-button .md-button--primary }

</div>

## Machine-readable indicator catalogue — JSON

The versioned JSON contains all 64 indicator references, names, domains, types, applicability classes, units, UK Health Data Research Alliance principle mappings, proposed Foundational Indicator flags, L1–L5 descriptors and minimum evidence requirements for L3–L5.

<div class="hdrl-button-grid hdrl-button-grid--two" markdown>

[Download the indicator catalogue (JSON) :material-download:](/data/hdrl-indicators-v1.json){ .md-button .md-button--primary }
[Download the JSON Schema](/data/hdrl-indicators-v1.schema.json){ .md-button }
[Download SHA-256 checksums](/data/hdrl-indicators-v1.sha256){ .md-button }

</div>

The JSON deliberately excludes the broader HDRS capability mappings that were specific to the initial 2025 project proposition. Those mappings remain in the Markdown for reproducibility, but should not be treated as current programme requirements or permanent properties of an indicator.

Future assessment-specific or purpose-specific indicator sets can reference the stable indicator `ref` values in separately versioned files. A set changes the reporting lens, not the underlying maturity descriptors or evidence requirements.

## Versions and integrity

| Artefact | Version | SHA-256 |
|:--|---:|:--|
| Complete Markdown method source | 1.0 | `fdf36fb92cd88319e3a9815aa14034fbc81c8ee66d3ef116e0175d5ea001c869` |
| Indicator catalogue | 1.0.0 | `e72bb4c1ffbdea0c7f3ea3010927d06092f4cd0ad83c4c938bf4e569710f0261` |
| JSON Schema | 1.0.0 | `dfab64595b16b1500e75d650469d748130ccb64d0923f30c78e2bf5decc9ed6b` |

The catalogue records the checksum of the exact Markdown source from which its descriptors and evidence requirements were verified. Framework, catalogue and Schema versions are recorded separately because a machine-readable format can be corrected or extended without silently changing the framework method.

## Research publication

The [medRxiv paper](https://www.medrxiv.org/content/10.64898/2026.07.23.26358713v1){ target="_blank" rel="noopener" } describes the development and formative application of HDRL. Its [Supplementary Table S1](https://www.medrxiv.org/content/medrxiv/early/2026/07/27/2026.07.23.26358713/DC3/embed/media-3.csv?download=true){ target="_blank" rel="noopener" } provides a compact published indicator list. The files above remain the complete public method and machine-readable catalogue.

## Scope and reuse

These files contain public framework methodology. They do **not** contain country or service scores, assessment findings, submitted evidence, detailed assessment records, Right of Reply material or unpublished findings.

The framework methodology and these public reference materials are available under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/){ target="_blank" rel="noopener" }, subject to the attribution and responsible-reuse guidance on this site.

<div class="hdrl-next" markdown>

## Continue exploring

<div class="hdrl-button-grid" markdown>

[Framework overview](overview.md){ .md-button .md-button--primary }
[How to apply HDRL](using-the-framework.md){ .md-button }
[About & reuse](../about.md){ .md-button }

</div>
</div>
