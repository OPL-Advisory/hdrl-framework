#!/usr/bin/env python3
"""Validate the published HDRL indicator catalogue against applied v1."""

from __future__ import annotations

import hashlib
import html
import json
import re
from pathlib import Path

import jsonschema


ROOT = Path(__file__).resolve().parents[1]
SOURCE = (
    ROOT
    / "reference"
    / "frozen-applied-v1"
    / "Health Data Readiness Level Framework V1.md"
)
CATALOGUE = ROOT / "docs" / "data" / "hdrl-indicators-v1.json"
SCHEMA = ROOT / "docs" / "data" / "hdrl-indicators-v1.schema.json"
CHECKSUMS = ROOT / "docs" / "data" / "hdrl-indicators-v1.sha256"
QUICK_REFERENCE = ROOT / "docs" / "framework" / "quick-reference.md"
DOMAINS_DIR = ROOT / "docs" / "domains"
DOMAINS_INDEX = DOMAINS_DIR / "index.md"
HOMEPAGE = ROOT / "docs" / "index.md"
LLMS = ROOT / "docs" / "llms.txt"
MKDOCS = ROOT / "mkdocs.yml"
BLOCKED_RESULT_KEYS = {
    "assessment_result",
    "assessed_level",
    "country",
    "evidence_record",
    "nation",
    "score",
}


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(message)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def normalise_markdown_value(value: str) -> str:
    value = re.sub(r"\\\\(.+?)\\\\", r"[\1]", value)
    value = re.sub(r"\\([\\<>=\-])", r"\1", value)
    return re.sub(r"\s+", " ", value).strip()


def parse_summary(markdown: str) -> dict[str, dict[str, object]]:
    section = markdown.split("# 5. Indicator summary", 1)[1].split(
        "# 6. Indicator catalogue", 1
    )[0]
    rows: dict[str, dict[str, object]] = {}
    pattern = re.compile(
        r"^\| \*\*([A-H]\.\d+\.\d+)\*\* \| ([^|]+) \| ([^|]+) \| "
        r"([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$",
        flags=re.MULTILINE,
    )
    for match in pattern.finditer(section):
        ref, name, indicator_type, indicator_class, unit, hdrs, alliance = (
            part.strip() for part in match.groups()
        )
        require(ref not in rows, f"Duplicate indicator in Section 5: {ref}")
        rows[ref] = {
            "name": name,
            "type": (
                "Enhancement" if indicator_type == "Enh" else indicator_type
            ),
            "applicability_class": indicator_class,
            "unit": unit,
            "hdrs": hdrs,
            "alliance": alliance.replace("\\-", "-"),
        }
    return rows


def parse_domains(markdown: str) -> dict[str, dict[str, str]]:
    catalogue_section = markdown.split("# 6. Indicator catalogue", 1)[1].split(
        "# 7. HDRS capability map", 1
    )[0]
    pattern = re.compile(
        r"^## Domain ([A-H]): (.+?)\n\n(.+?)\n\n### ",
        flags=re.MULTILINE | re.DOTALL,
    )
    return {
        match.group(1): {
            "ref": match.group(1),
            "name": match.group(2).strip(),
            "narrative": normalise_markdown_value(match.group(3)),
        }
        for match in pattern.finditer(catalogue_section)
    }


def parse_details(markdown: str) -> dict[str, dict[str, object]]:
    catalogue_section = markdown.split("# 6. Indicator catalogue", 1)[1].split(
        "# 7. HDRS capability map", 1
    )[0]
    entry_starts = list(
        re.finditer(
            r"^### ([A-H]\.\d+\.\d+) (.+)$",
            catalogue_section,
            flags=re.MULTILINE,
        )
    )
    details: dict[str, dict[str, object]] = {}

    for index, match in enumerate(entry_starts):
        ref, name = match.groups()
        end = (
            entry_starts[index + 1].start()
            if index + 1 < len(entry_starts)
            else len(catalogue_section)
        )
        segment = catalogue_section[match.start() : end]
        metadata = re.search(
            r"^(Core|Enh) • Class ([^•\n]+) • Unit ([^•\n]+) • "
            r"HDRS ([^•\n]+?)(?: • Alliance ([^\n]+))?$",
            segment,
            flags=re.MULTILINE,
        )
        require(metadata is not None, f"Cannot parse indicator metadata: {ref}")
        indicator_type, indicator_class, unit, hdrs, alliance = (
            metadata.groups()
        )

        levels = {
            level: normalise_markdown_value(value)
            for level, value in re.findall(
                r"^\| \*\*(L[1-5])\*\* \| (.*?) \|$",
                segment,
                flags=re.MULTILINE,
            )
        }

        evidence: dict[str, list[str]] = {}
        current_level: str | None = None
        for line in segment.splitlines():
            heading = re.match(
                r"^\*\*(L[3-5]) \(minimum evidence\):\*\*$", line
            )
            if heading:
                current_level = heading.group(1)
                evidence[current_level] = []
                continue
            if line.startswith("**L") or line.startswith("### "):
                current_level = None
            if current_level and line.startswith("- "):
                evidence[current_level].append(
                    normalise_markdown_value(line[2:])
                )

        details[ref] = {
            "ref": ref,
            "name": name.strip(),
            "type": (
                "Enhancement" if indicator_type == "Enh" else indicator_type
            ),
            "applicability_class": indicator_class.strip(),
            "unit": unit.strip(),
            "hdrs": hdrs.strip(),
            "alliance": alliance.strip() if alliance else "-",
            "maturity_levels": levels,
            "minimum_evidence": evidence,
        }
    return details


def find_blocked_keys(value: object, path: str = "$") -> list[str]:
    findings: list[str] = []
    if isinstance(value, dict):
        for key, child in value.items():
            child_path = f"{path}.{key}"
            if key.lower() in BLOCKED_RESULT_KEYS:
                findings.append(child_path)
            findings.extend(find_blocked_keys(child, child_path))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            findings.extend(find_blocked_keys(child, f"{path}[{index}]"))
    return findings


def validate_checksums() -> None:
    for line in CHECKSUMS.read_text(encoding="utf-8").splitlines():
        expected, filename = line.split("  ", 1)
        path = (
            SOURCE
            if filename
            == "../downloads/health-data-readiness-level-framework-v1.md"
            else CHECKSUMS.parent / filename
        )
        require(path.is_file(), f"Checksum target is missing: {filename}")
        require(
            sha256(path) == expected,
            f"Checksum mismatch for {filename}",
        )


def strip_heading_attributes(value: str) -> str:
    return re.sub(r"\s*\{[^}]+\}\s*$", "", value).strip()


def parse_public_indicator_names() -> tuple[
    dict[str, str],
    dict[str, str],
    dict[str, str],
    dict[str, str],
]:
    quick_text = QUICK_REFERENCE.read_text(encoding="utf-8")
    quick_names = {
        ref: html.unescape(re.sub(r"<[^>]+>", "", name)).strip()
        for ref, name in re.findall(
            r'<tr><th scope="row">([A-H]\.\d+\.\d+)</th><td>(.*?)</td>',
            quick_text,
        )
    }
    quick_domains = {
        ref: html.unescape(name).strip()
        for ref, name in re.findall(
            r"Domain ([A-H]): ([^<]+)</th></tr>",
            quick_text,
        )
    }

    summary_names: dict[str, str] = {}
    heading_names: dict[str, str] = {}
    page_domains: dict[str, str] = {}
    for path in sorted(DOMAINS_DIR.glob("*.md")):
        if path == DOMAINS_INDEX:
            continue
        text = path.read_text(encoding="utf-8")
        heading = re.search(r"^# Domain ([A-H]): (.+)$", text, flags=re.MULTILINE)
        require(heading is not None, f"Domain page has no canonical H1: {path}")
        domain_ref, domain_name = heading.groups()
        page_domains[domain_ref] = domain_name.strip()

        for ref, name in re.findall(
            r"^\| ([A-H]\.\d+\.\d+) \| ([^|]+) \|",
            text,
            flags=re.MULTILINE,
        ):
            require(ref not in summary_names, f"Duplicate public summary row: {ref}")
            summary_names[ref] = name.strip()

        for ref, name in re.findall(
            r"^### ([A-H]\.\d+\.\d+) (.+)$",
            text,
            flags=re.MULTILINE,
        ):
            require(ref not in heading_names, f"Duplicate public indicator heading: {ref}")
            heading_names[ref] = strip_heading_attributes(name)

    return quick_names, summary_names, heading_names, {
        **{f"page:{ref}": name for ref, name in page_domains.items()},
        **{f"quick:{ref}": name for ref, name in quick_domains.items()},
    }


def parse_public_domain_names() -> dict[str, dict[str, str]]:
    index_text = DOMAINS_INDEX.read_text(encoding="utf-8")
    homepage_text = HOMEPAGE.read_text(encoding="utf-8")
    llms_text = LLMS.read_text(encoding="utf-8")
    mkdocs_text = MKDOCS.read_text(encoding="utf-8")

    return {
        "index": {
            ref: name.strip()
            for ref, name in re.findall(
                r"^\| \*\*\[([A-H])\]\([^)]+\)\*\* \| ([^|]+) \|",
                index_text,
                flags=re.MULTILINE,
            )
        },
        "homepage": {
            ref.upper(): html.unescape(name).strip()
            for ref, name in re.findall(
                r'class="hdrl-domain-card domain-([a-h])".*?'
                r"<h3>(.*?)</h3>",
                homepage_text,
                flags=re.DOTALL,
            )
        },
        "llms": {
            ref: name.strip()
            for ref, name in re.findall(
                r"^- \[Domain ([A-H]): (.+?)\]\(",
                llms_text,
                flags=re.MULTILINE,
            )
        },
        "navigation": {
            ref: name.strip()
            for ref, name in re.findall(
                r'^\s+- "([A-H]): (.+?)": domains/',
                mkdocs_text,
                flags=re.MULTILINE,
            )
        },
    }


def validate_public_domain_counts(catalogue: dict) -> None:
    for path in sorted(DOMAINS_DIR.glob("[a-h]-*.md")):
        text = path.read_text(encoding="utf-8")
        heading = re.search(r"^# Domain ([A-H]):", text, flags=re.MULTILINE)
        counts = re.search(
            r"^\*\*Indicators:\*\* (\d+) \((\d+) Core, (\d+) Enhancement\)$",
            text,
            flags=re.MULTILINE,
        )
        require(
            heading is not None and counts is not None,
            f"Domain page has no parseable indicator count: {path}",
        )
        domain_ref = heading.group(1)
        indicators = [
            indicator
            for indicator in catalogue["indicators"]
            if indicator["domain"] == domain_ref
        ]
        expected = (
            len(indicators),
            sum(indicator["type"] == "Core" for indicator in indicators),
            sum(indicator["type"] == "Enhancement" for indicator in indicators),
        )
        published = tuple(int(value) for value in counts.groups())
        require(
            published == expected,
            f"Domain {domain_ref} indicator-count summary differs from the catalogue: "
            f"{published} != {expected}",
        )


def main() -> None:
    markdown = SOURCE.read_text(encoding="utf-8")
    catalogue = json.loads(CATALOGUE.read_text(encoding="utf-8"))
    schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
    jsonschema.Draft202012Validator.check_schema(schema)
    jsonschema.validate(catalogue, schema)

    require(
        "# Annex A: HDRL Framework v1.0.1 and Methodology" in markdown
        and "| **1.0.1** | 29 July 2026 |" in markdown,
        "The framework source version or change log is incomplete",
    )
    for retired_wording in (
        'mandatory for any system or service claiming HDRS participation',
        "treated as non-negotiable for baseline participation",
        "B0 = Baseline Core (mandatory for any HDRS participation)",
        "B0** indicators are baseline prerequisites for participation",
    ):
        require(
            retired_wording not in markdown,
            f"Retired programme-gate wording remains: {retired_wording}",
        )
    require(
        catalogue["framework"]["version"] == "1.0.1",
        "Catalogue framework version is not 1.0.1",
    )
    require(
        catalogue["source"]["sha256"] == sha256(SOURCE),
        "Catalogue source checksum does not match applied v1",
    )
    require(
        catalogue["source"]["url"]
        == "https://hdrlframework.org/downloads/"
        "health-data-readiness-level-framework-v1.md",
        "Catalogue source URL does not resolve directly to the source artefact",
    )
    validate_checksums()

    summary = parse_summary(markdown)
    details = parse_details(markdown)
    domains = parse_domains(markdown)
    require(len(summary) == 64, f"Expected 64 Section 5 rows, found {len(summary)}")
    require(len(details) == 64, f"Expected 64 detailed entries, found {len(details)}")
    require(len(domains) == 8, f"Expected 8 domains, found {len(domains)}")

    for ref, summary_item in summary.items():
        detail = details.get(ref)
        require(detail is not None, f"Section 6 is missing {ref}")
        for field in (
            "name",
            "type",
            "applicability_class",
            "unit",
            "hdrs",
            "alliance",
        ):
            require(
                summary_item[field] == detail[field],
                f"Section 5/6 mismatch for {ref} {field}: "
                f"{summary_item[field]!r} != {detail[field]!r}",
            )

    foundational_section = markdown.split(
        "## 4.5 Foundational indicators", 1
    )[1].split("## 4.6 Capability module reporting", 1)[0]
    foundational_refs = set(
        re.findall(r"\*\*([A-H]\.\d+\.\d+)\*\*", foundational_section)
    )
    require(
        len(foundational_refs) == 5,
        f"Expected 5 foundational indicators, found {len(foundational_refs)}",
    )

    published_domains = {item["ref"]: item for item in catalogue["domains"]}
    require(
        published_domains == domains,
        "Published domain metadata differs from applied v1",
    )

    quick_names, summary_names, heading_names, embedded_domains = (
        parse_public_indicator_names()
    )
    expected_names = {ref: item["name"] for ref, item in details.items()}
    for label, names in (
        ("Indicator Quick Reference", quick_names),
        ("domain summary tables", summary_names),
        ("domain indicator headings", heading_names),
    ):
        require(
            names == expected_names,
            f"{label} indicator names differ from the canonical catalogue",
        )

    expected_domain_names = {
        ref: item["name"] for ref, item in domains.items()
    }
    for key, name in embedded_domains.items():
        source, ref = key.split(":", 1)
        require(
            name == expected_domain_names[ref],
            f"{source} domain name differs for Domain {ref}: "
            f"{name!r} != {expected_domain_names[ref]!r}",
        )
    for source, names in parse_public_domain_names().items():
        require(
            names == expected_domain_names,
            f"{source} domain names differ from the canonical catalogue",
        )
    validate_public_domain_counts(catalogue)

    published_refs: list[str] = []
    for indicator in catalogue["indicators"]:
        ref = indicator["ref"]
        published_refs.append(ref)
        detail = details.get(ref)
        require(detail is not None, f"Catalogue contains unknown indicator: {ref}")
        require(
            "hdrs_capabilities" not in indicator,
            f"Project-specific HDRS mapping leaked into core catalogue: {ref}",
        )
        for field in (
            "name",
            "type",
            "applicability_class",
            "unit",
            "maturity_levels",
            "minimum_evidence",
        ):
            require(
                indicator[field] == detail[field],
                f"Catalogue/source mismatch for {ref} {field}",
            )
        require(
            indicator["domain"] == ref[0],
            f"Invalid domain reference for {ref}",
        )
        require(
            indicator["domain_name"] == domains[ref[0]]["name"],
            f"Invalid domain name for {ref}",
        )
        expected_alliance = (
            []
            if detail["alliance"] == "-"
            else [int(value) for value in str(detail["alliance"]).split(",")]
        )
        require(
            indicator["alliance_principles"] == expected_alliance,
            f"Alliance mapping mismatch for {ref}",
        )
        require(
            indicator["foundational"] == (ref in foundational_refs),
            f"Foundational flag mismatch for {ref}",
        )

    require(len(set(published_refs)) == 64, "Indicator refs are not unique")
    require(
        published_refs == list(summary),
        "Catalogue indicator order differs from Section 5",
    )
    blocked_keys = find_blocked_keys(catalogue)
    require(
        not blocked_keys,
        "Assessment-result fields are not permitted: " + ", ".join(blocked_keys),
    )

    print("Indicator catalogue validation passed")
    print(f"Source SHA-256: {catalogue['source']['sha256']}")
    print("Domains: 8; indicators: 64; foundational indicators: 5")
    print("Section 5/6 metadata: consistent")
    print("Public indicator/domain names: consistent")
    print("Project-specific HDRS mappings in core catalogue: 0")


if __name__ == "__main__":
    main()
