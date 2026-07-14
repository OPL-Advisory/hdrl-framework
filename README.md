# HDRL Framework

The **Health Data Readiness Level (HDRL) Assessment Framework** is a practical, evidence-led maturity framework for assessing organisational and system readiness for trusted, federated health data research.

HDRL brings data coverage, semantics, governance, research integration, public trust, sustainability, workforce and infrastructure into one assessment instrument. It was developed from a review of 56 source frameworks and first applied across Scotland, Wales and Northern Ireland.

**Framework at a glance:** 8 domains · 64 indicators · 5 maturity levels · 5 proposed Foundational Indicators

## Public website

The framework is published at <https://opl-advisory.github.io/hdrl-framework/>.

The site includes:

- the complete 8-domain, 64-indicator reference;
- maturity levels and indicator classifications;
- guidance for scoping, evidencing and interpreting an assessment;
- methodology, current validation status and limitations;
- context on the 3 Nations Readiness Assessment; and
- citation, licensing and responsible-reuse guidance.

HDRL supports planning and improvement. It is not an official HDRS standard, accreditation scheme or participation decision.

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

Framework content is licensed under [Creative Commons Attribution 4.0 International](LICENSE.md). Code and third-party dependencies remain subject to their own licences.
