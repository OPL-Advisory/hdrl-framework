# HDRL Framework

The **Health Data Readiness Level (HDRL) Assessment Framework** is a practical, evidence-informed maturity framework for assessing organisational and system readiness for trusted, federated health data research.

HDRL brings data coverage, semantics, governance, research integration, public trust, sustainability, workforce and infrastructure into one assessment instrument. It was developed from a review of 56 source frameworks and first applied across Scotland, Wales and Northern Ireland.

The framework was commissioned by and its intellectual property rights are owned by **Research Data Scotland**. It was originated and developed by **OPL Advisory Ltd**.

**Framework at a glance:** 8 domains · 64 indicators · 5 maturity levels · 5 proposed Foundational Indicators

## Public website

The framework is published at <https://hdrlframework.org/>. The original GitHub Pages address remains available as a redirect.

A concise machine-readable guide to the public site is available at <https://hdrlframework.org/llms.txt>.

The [complete method, machine-readable indicator catalogue, JSON Schema and checksums](https://hdrlframework.org/framework/applied-v1-reference-files/) are published together for people and tools that need versioned framework files.

The site includes:

- the complete 8-domain, 64-indicator reference;
- maturity levels and indicator classifications;
- guidance for scoping, evidencing and interpreting an assessment;
- methodology, current validation status and limitations;
- context on the 3 Nations Readiness Assessment and accessible HTML and Markdown transcriptions of its published Final Report; and
- citation, licensing and responsible-reuse guidance.

HDRL supports planning and improvement in the UK and internationally. Its first application informed discussion about the emerging UK Health Data Research Service (HDRS), but it is not an official HDRS standard, accreditation scheme or participation decision.

## Framework files and data

[`Health Data Readiness Level Framework V1.md`](reference/frozen-applied-v1/Health%20Data%20Readiness%20Level%20Framework%20V1.md) is the complete canonical framework and method reference for HDRL v1.0. Its SHA-256 checksum is recorded alongside it. The website's [development evidence and validation status](https://hdrlframework.org/framework/methodology/) provide the intended public interpretation: HDRL v1.0 has been formatively applied, but is not a fully validated accreditation instrument.

This file contains framework definitions and descriptors. It does not contain country-level evidence, detailed assessment records or unpublished scores.

The machine-readable catalogue deliberately excludes the project-specific HDRS capability mappings retained in the applied-v1 Markdown. Contextual indicator sets should reference stable indicator IDs separately rather than redefine the indicators or their maturity descriptors.

## Local development

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
mkdocs serve
```

Run a production-equivalent build before opening a pull request:

```bash
mkdocs build --strict
```

## Deployment

GitHub Actions builds and deploys the site to GitHub Pages on every push to `main`. The workflow can also be run manually.

## Publication boundary

The public site contains the framework and approved high-level context only. Do not add detailed country assessment records, unpublished evidence or country/indicator-specific findings that have not been authorised for release through the 3 Nations Final Report.

The authorised Final Report was published by Research Data Scotland on 14 July 2026: [New independent assessment highlights devolved nations’ leading role in health data research](https://www.researchdata.scot/news-and-insights/new-independent-assessment-highlights-devolved-nations-leading-role-in-health-data-research/).

With permission from Research Data Scotland, the site provides accessible [HTML](https://hdrlframework.org/explore-report/) and [Markdown](https://hdrlframework.org/downloads/three-nations-readiness-assessment-final-report.md) transcriptions of the published Final Report. The RDS PDF remains the authoritative version. The site does not reproduce the underlying detailed country assessment records, indicator-level scoring matrix, submitted evidence or right-of-reply material.

The framework-development and formative-application paper is available as a version 1 medRxiv preprint: [Seymour D, Halliday R, Smart J, Burns F. *Development and formative application of the Health Data Readiness Level framework for federated health-data services*](https://www.medrxiv.org/content/10.64898/2026.07.23.26358713v1). It has not been certified by peer review.

## Version and licence

**HDRL Framework v1.0** — January 2026.

The framework methodology and public framework materials—including the frozen applied-v1 Markdown method source—are licensed under [Creative Commons Attribution 4.0 International](LICENSE.md). This licence does not publish or license unpublished assessment evidence, detailed country-level assessment records or other controlled project materials.

The website's software and theme customisations are not included in the CC BY 4.0 licence. No separate software licence is granted; third-party dependencies remain subject to their own licences.
