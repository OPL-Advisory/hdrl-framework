#!/usr/bin/env python3
"""Validate the published HDRL indicator catalogue against applied v1."""

from __future__ import annotations

import hashlib
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
        path = CHECKSUMS.parent / filename
        require(path.is_file(), f"Checksum target is missing: {filename}")
        require(
            sha256(path) == expected,
            f"Checksum mismatch for {filename}",
        )


def main() -> None:
    markdown = SOURCE.read_text(encoding="utf-8")
    catalogue = json.loads(CATALOGUE.read_text(encoding="utf-8"))
    schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
    jsonschema.Draft202012Validator.check_schema(schema)
    jsonschema.validate(catalogue, schema)

    require(
        catalogue["source"]["sha256"] == sha256(SOURCE),
        "Catalogue source checksum does not match applied v1",
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
    print("Project-specific HDRS mappings in core catalogue: 0")


if __name__ == "__main__":
    main()
