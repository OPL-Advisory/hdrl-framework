---
title: Machine-readable Indicator Catalogue
description: Download the canonical HDRL applied-v1 indicator catalogue, JSON Schema and SHA-256 checksums.
---

# Machine-readable Indicator Catalogue

The HDRL applied-v1 indicator catalogue is available as versioned JSON for assessment tools, validation workflows and other software that needs the framework's indicators without parsing Markdown.

It contains all 64 indicator references, names, domains, types, applicability classes, units, Alliance mappings, proposed Foundational Indicator flags, L1–L5 descriptors and minimum evidence requirements for L3–L5.

<div class="hdrl-button-grid hdrl-button-grid--two" markdown>

[Download the indicator catalogue (JSON) :material-download:](/data/hdrl-indicators-v1.json){ .md-button .md-button--primary }
[Download the JSON Schema](/data/hdrl-indicators-v1.schema.json){ .md-button }
[Download SHA-256 checksums](/data/hdrl-indicators-v1.sha256){ .md-button }
[Applied v1 Markdown source](applied-v1-reference-files.md){ .md-button }

</div>

## Versions and integrity

| Artefact | Version | SHA-256 |
|---|---:|---|
| Applied-v1 Markdown source | 1.0 | `fdf36fb92cd88319e3a9815aa14034fbc81c8ee66d3ef116e0175d5ea001c869` |
| Indicator catalogue | 1.0.0 | `e72bb4c1ffbdea0c7f3ea3010927d06092f4cd0ad83c4c938bf4e569710f0261` |
| JSON Schema | 1.0.0 | `dfab64595b16b1500e75d650469d748130ccb64d0923f30c78e2bf5decc9ed6b` |

The catalogue records the checksum of the exact applied-v1 Markdown source from which its descriptors and evidence requirements were verified. Consumers should pin both the catalogue version and checksum when reproducibility matters.

## Core catalogue and contextual indicator sets

HDRS capability mappings were specific to the initial 2025 capability proposition used in the 3 Nations assessment. The applied-v1 Markdown retains them as project context, but they are deliberately excluded from the canonical indicator JSON so they are not mistaken for current programme requirements or permanent properties of an indicator.

Future assessment-specific or purpose-specific indicator sets can reference the stable indicator `ref` values in a separately versioned file. A set changes the reporting lens, not the underlying maturity descriptors or evidence requirements.

## Publication boundary

The catalogue contains public framework methodology only. It contains no country or service scores, assessment findings, submitted evidence, detailed assessment records or right-of-reply material.

The compact indicator list published as [Supplementary Table S1 with the medRxiv preprint](https://www.medrxiv.org/content/medrxiv/early/2026/07/27/2026.07.23.26358713/DC3/embed/media-3.csv?download=true){ target="_blank" rel="noopener" } confirms the public indicator references, types, applicability classes and proposed Foundational Indicator flags. The JSON catalogue retains the full applied-v1 labels and adds the published descriptors and evidence requirements.

The catalogue and Schema are public framework materials available under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/){ target="_blank" rel="noopener" }, subject to the attribution and responsible-reuse guidance on this site.
