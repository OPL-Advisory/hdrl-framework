# HDRL Framework

The **Health Data Readiness Level (HDRL) Assessment Framework** is a practical, evidence-led maturity framework for assessing organisational and system readiness for trusted, federated health data research.

HDRL brings data coverage, semantics, governance, research integration, public trust, sustainability, workforce and infrastructure into one assessment instrument. It was developed from a review of 56 source frameworks and first applied across Scotland, Wales and Northern Ireland.

The framework was commissioned by and its intellectual property rights are owned by **Research Data Scotland**. It was originated and developed by **OPL Advisory Ltd**.

**Framework at a glance:** 8 domains · 64 indicators · 5 maturity levels · 5 proposed Foundational Indicators

## Public website

The framework is published at <https://hdrlframework.org/>. The original GitHub Pages address remains available as a redirect.

The site includes:

- the complete 8-domain, 64-indicator reference;
- maturity levels and indicator classifications;
- guidance for scoping, evidencing and interpreting an assessment;
- methodology, current validation status and limitations;
- context on the 3 Nations Readiness Assessment; and
- citation, licensing and responsible-reuse guidance.

HDRL supports planning and improvement in the UK and internationally. Its first application informed discussion about the emerging UK Health Data Research Service (HDRS), but it is not an official HDRS standard, accreditation scheme or participation decision.

## Applied v1 reference files

The two reference files at the repository root preserve the framework and domain reference tables used for the 3 Nations field application, including their original development-stage terminology. They are retained for reproducibility rather than presented as current validation claims. The website's [methodology and validation status](https://hdrlframework.org/framework/methodology/) provide the intended public interpretation: HDRL v1.0 has been formatively applied, but is not a fully validated accreditation instrument.

These files contain framework definitions and descriptors. They do not contain country-level evidence, detailed assessment records or unpublished scores.

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

The site links to the public report but does not reproduce the detailed country-level assessment records, indicator-level scores, submitted evidence or right-of-reply material.

## Version and licence

**HDRL Framework v1.0** — January 2026.

The framework methodology and public framework materials are licensed under [Creative Commons Attribution 4.0 International](LICENSE.md). This licence does not publish or license unpublished assessment evidence, detailed country-level assessment records or other controlled project materials. Code and third-party dependencies remain subject to their own licences.
