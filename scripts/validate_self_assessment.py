#!/usr/bin/env python3
"""Validate the versioned HDRL self-assessment research prototype."""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CATALOGUE_PATH = ROOT / "docs" / "data" / "hdrl-indicators-v1.json"
CONTENT_PATH = (
    ROOT / "docs" / "data" / "hdrl-assessment-content-v0.2.0.json"
)
BETA_CONFIG_PATH = (
    ROOT / "docs" / "data" / "hdrl-assessment-beta-config-v0.2.0.json"
)
APP_PATH = ROOT / "docs" / "assets" / "js" / "self-assessment.js"
PAGE_PATH = ROOT / "docs" / "self-assessment" / "index.md"
MKDOCS_PATH = ROOT / "mkdocs.yml"
SERVICE_PATH = ROOT / "services" / "beta-service" / "src" / "index.js"
SERVICE_SCHEMA_PATH = ROOT / "services" / "beta-service" / "migrations" / "0001_initial.sql"
WRANGLER_PATH = ROOT / "services" / "beta-service" / "wrangler.jsonc"
EXPECTED_DOMAINS = list("ABCDEFGH")
EXPECTED_RULES = {
    "R-EVIDENCE-GAP",
    "R-LOW-CERTAINTY",
    "R-NOT-ASSESSED",
    "R-USER-ACTION",
    "R-TEAM-DISAGREEMENT",
}


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(message)


def version_from_js(source: str, key: str) -> str:
    match = re.search(rf'\b{re.escape(key)}:\s*"([^"]+)"', source)
    require(match is not None, f"JavaScript version {key!r} is missing")
    return match.group(1)


def main() -> None:
    catalogue = json.loads(CATALOGUE_PATH.read_text(encoding="utf-8"))
    content = json.loads(CONTENT_PATH.read_text(encoding="utf-8"))
    beta = json.loads(BETA_CONFIG_PATH.read_text(encoding="utf-8"))
    app = APP_PATH.read_text(encoding="utf-8")
    page = PAGE_PATH.read_text(encoding="utf-8")
    mkdocs = MKDOCS_PATH.read_text(encoding="utf-8")

    domains = [domain["ref"] for domain in catalogue["domains"]]
    require(domains == EXPECTED_DOMAINS, "Canonical domains are not A–H")
    require(
        catalogue["indicator_count"] == len(catalogue["indicators"]) == 64,
        "Canonical catalogue must contain exactly 64 indicators",
    )
    require(
        content["framework_version"] == catalogue["framework"]["version"],
        "Assessment content framework version does not match catalogue",
    )
    require(
        content["catalogue_version"] == catalogue["catalogue_version"],
        "Assessment content catalogue version does not match catalogue",
    )
    require(
        content["tool_version"] == "0.4.0-beta"
        and content["content_version"] == "0.2.0"
        and content["recommendation_rules_version"] == "0.2.0"
        and content["report_generation_version"] == "0.4.0",
        "Assessment content release versions are unexpected",
    )

    rapid_domains = [item["domain"] for item in content["rapid_questions"]]
    require(
        rapid_domains == EXPECTED_DOMAINS
        and content["rapid_method"]["question_count"] == 8,
        "Rapid pass must contain one ordered question for every domain",
    )
    require(
        len(content["impression_bands"]) == 5
        and len({item["value"] for item in content["impression_bands"]}) == 5,
        "Rapid pass must contain five unique impression bands",
    )
    require(
        set(content["domain_guidance"]) == set(EXPECTED_DOMAINS),
        "Every domain needs versioned guidance",
    )
    require(
        set(content["domain_evidence_examples"]) == set(EXPECTED_DOMAINS)
        and all(len(items) >= 4 for items in content["domain_evidence_examples"].values()),
        "Every domain needs at least four three-nation evidence prompts",
    )
    require(
        {rule["id"] for rule in content["recommendation_rules"]}
        == EXPECTED_RULES,
        "Recommendation-rule identifiers are incomplete or unexpected",
    )

    js_versions = {
        "framework": version_from_js(app, "framework"),
        "catalogue": version_from_js(app, "catalogue"),
        "tool": version_from_js(app, "tool"),
        "guidance": version_from_js(app, "guidance"),
        "rules": version_from_js(app, "rules"),
        "report": version_from_js(app, "report"),
        "beta": version_from_js(app, "beta"),
    }
    require(js_versions["framework"] == content["framework_version"], "JS framework version mismatch")
    require(js_versions["catalogue"] == content["catalogue_version"], "JS catalogue version mismatch")
    require(js_versions["tool"] == content["tool_version"], "JS tool version mismatch")
    require(js_versions["guidance"] == content["content_version"], "JS guidance version mismatch")
    require(
        js_versions["rules"] == content["recommendation_rules_version"],
        "JS rules version mismatch",
    )
    require(
        js_versions["report"] == content["report_generation_version"],
        "JS report version mismatch",
    )
    require(
        js_versions["beta"] == beta["config_version"]
        and js_versions["tool"] == beta["tool_version"],
        "JS beta configuration version mismatch",
    )

    require(
        beta["transport"]["mode"] == "local-with-optional-service"
        and beta["transport"]["remote_collection_enabled"] is False
        and beta["transport"]["service_base_url"] is None,
        "Staging source must keep remote collection disabled until activation review",
    )
    prohibited_event_fields = {
        "level", "score", "certainty", "email", "comment", "rationale",
        "evidence", "assessment_title", "scope", "report",
    }
    configured_event_fields = {
        field
        for fields in beta["event_allowlist"].values()
        for field in fields
    }
    require(
        prohibited_event_fields.isdisjoint(configured_event_fields),
        "Beta event allow-list contains assessment content or direct identifiers",
    )

    require("localStorage" not in app and "sessionStorage" not in app, "Disallowed web storage found")
    require('type="file"' not in app and "type='file'" not in app, "File upload input found")
    require(
        app.count("fetch(") == 4
        and "root.dataset.catalogueUrl" in app
        and "root.dataset.contentUrl" in app,
        "Beta client may fetch only its three versioned data files and the configured service",
    )
    require("root.dataset.betaConfigUrl" in app, "Versioned beta configuration is not loaded")
    require(
        not re.search(r'fetch\(\s*["\']https?://', app),
        "Prototype contains an external fetch",
    )
    require(
        "No overall HDRL score is calculated." in app
        and "Rapid impressions are not HDRL indicator scores." in app,
        "Structured export limitations are incomplete",
    )
    require(
        "/^[=+\\-@\\t\\r]/" in app,
        "CSV export is missing spreadsheet-formula injection protection",
    )
    require(
        "catalogue.indicators.map" in app
        and "indicator.maturity_levels[level]" in app
        and "indicator.minimum_evidence[level]" in app,
        "Evidence-led UI must render every canonical indicator and descriptor",
    )
    require(
        '"indicator-decision"' in app
        and 'id="hdrl-nonjudgement-panel"' in app
        and "How certain are you?" in app,
        "Progressive indicator decision and certainty controls are missing",
    )
    require(
        'name="snapshot-level"' in app
        and 'name="snapshot-certainty"' in app
        and 'name="snapshot-status"' in app
        and "indicator.maturity_levels[level]" in app
        and "snapshot_completed" in app,
        "Whole-framework snapshot journey is incomplete",
    )
    require(
        'id="hdrl-feedback-form"' in app
        and '"feedback-mode", "without_contact"' in app
        and "feedback_skipped" in app
        and 'id="hdrl-share-form"' in app,
        "Beta feedback or explicit result-sharing controls are incomplete",
    )
    require(
        'id="gate-use-mode"' in app
        and 'id="gate-report-use"' in app
        and '"gate-email"' in app,
        "Minimum beta-participant gate fields are incomplete",
    )
    require(
        "domain_evidence_examples" in app
        and "indicatorEvidenceIdeas" in app
        and "evidence-review-period" not in app
        and "evidence-supports" not in app,
        "Simplified evidence guidance or fields are incorrect",
    )
    require(
        "rapidProfileMatrix" in app
        and "Observed range" in app
        and "domain_capacity_notes" in app,
        "Profile, report range or domain-capacity output is missing",
    )

    require("robots: noindex, nofollow" in page, "Prototype page must remain noindex")
    require("analytics: false" in page, "Prototype page must disable public-site analytics")
    require("data-beta-config-url" in page, "Prototype beta configuration is not wired")
    require("Staging prototype — not yet collecting public-beta data." in page, "Staging warning is missing")
    require("There is no file upload." in page, "No-upload notice is missing")
    require(
        "patient-level data" in page and "access tokens" in page,
        "Sensitive-data warning is incomplete",
    )
    require(
        "assets/css/self-assessment.css" in mkdocs
        and "assets/js/self-assessment.js" in mkdocs
        and "self-assessment/index.md" in mkdocs,
        "Self-assessment assets or navigation are not wired into MkDocs",
    )

    for filename in (
        "research-and-design.md",
        "persona-review-v0.2.md",
        "product-requirements.md",
        "architecture-and-data.md",
        "adr-thin-beta-service.md",
        "privacy-and-data-flow.md",
        "sample-individual-report.md",
        "sample-team-report.md",
        "operations-and-roadmap.md",
    ):
        require(
            (ROOT / "docs" / "self-assessment" / filename).is_file(),
            f"Required self-assessment deliverable is missing: {filename}",
        )

    service = SERVICE_PATH.read_text(encoding="utf-8")
    schema = SERVICE_SCHEMA_PATH.read_text(encoding="utf-8")
    wrangler = WRANGLER_PATH.read_text(encoding="utf-8")
    require(
        all(route in service for route in (
            "/v1/sessions", "/v1/events", "/v1/verification/request",
            "/v1/verification/confirm", "/v1/feedback", "/v1/privacy/request",
            "/v1/privacy/confirm", "/v1/privacy/correct", "/v1/admin/summary",
        )),
        "Thin beta service routes are incomplete",
    )
    prohibited_schema_terms = {
        "maturity_level", "certainty", "assessment_scope", "rationale",
        "evidence_record", "report_content",
    }
    require(
        all(term not in schema.lower() for term in prohibited_schema_terms),
        "Thin-service database schema crosses the assessment-data boundary",
    )
    require(
        '"observability": { "enabled": false }' in wrangler
        and '"ENVIRONMENT": "staging"' in wrangler,
        "Thin service must disable provider logging and define staging separately",
    )

    print("Self-assessment prototype validation passed")
    print(
        "Versions: "
        f"HDRL {js_versions['framework']}; catalogue {js_versions['catalogue']}; "
        f"tool {js_versions['tool']}; guidance/rules 0.2.0; report {js_versions['report']}"
    )
    print("Rapid questions: 8; snapshot/evidence indicators reachable: 64; remote beta transport: feature-flagged off")


if __name__ == "__main__":
    main()
