#!/usr/bin/env python3
"""Static checks for the built accessible report page."""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path


EXPECTED_REPORT_ID = "https://hdrlframework.org/explore-report/#report"
EXPECTED_REPORT_URL = "https://hdrlframework.org/explore-report/"
EXPECTED_PDF_URL = "https://www.researchdata.scot/media/icxggzvo/rds-branded-three-nations-readiness-report.pdf"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(message)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("html", type=Path)
    args = parser.parse_args()

    document = args.html.read_text(encoding="utf-8")

    require('lang="en"' in document, "The document language is not English")
    require(
        f'<link rel="canonical" href="{EXPECTED_REPORT_URL}">' in document,
        "The canonical report URL is missing",
    )
    require(len(re.findall(r"<h1(?:\s|>)", document)) == 1, "Expected exactly one H1")

    heading_levels = [int(level) for level in re.findall(r"<h([1-6])(?:\s|>)", document)]
    require(heading_levels and heading_levels[0] == 1, "The first heading is not H1")
    require(
        all(current <= previous + 1 for previous, current in zip(heading_levels, heading_levels[1:])),
        f"Heading order skips a level: {heading_levels}",
    )

    identifiers = re.findall(r'\bid="([^"]+)"', document)
    duplicates = sorted(identifier for identifier, count in Counter(identifiers).items() if count > 1)
    require(not duplicates, f"Duplicate HTML ids: {', '.join(duplicates)}")

    require('name="robots" content="noindex' not in document.lower(), "Unexpected noindex directive")
    require("Internal " + "working file" not in document, "Internal working preamble leaked")
    require("." + "docx" not in document, "Working-document name leaked")
    require('class="hdrl-report-media"' not in document, "Empty media section rendered")

    json_ld_blocks = re.findall(
        r'<script type="application/ld\+json">\s*(.*?)\s*</script>',
        document,
        flags=re.DOTALL,
    )
    require(len(json_ld_blocks) == 1, "Expected exactly one JSON-LD block")
    metadata = json.loads(json_ld_blocks[0])
    require(metadata.get("@type") == "Report", "JSON-LD type is not Report")
    require(metadata.get("@id") == EXPECTED_REPORT_ID, "JSON-LD @id is not canonical")
    require(metadata.get("url") == EXPECTED_REPORT_URL, "JSON-LD URL is not canonical")
    require(metadata.get("sameAs") == EXPECTED_PDF_URL, "JSON-LD authoritative PDF is missing")

    tables = re.findall(r'<table class="hdrl-report-table">.*?</table>', document, flags=re.DOTALL)
    wrappers = re.findall(
        r'<div class="md-typeset__table hdrl-report-table-wrapper" '
        r'tabindex="0" role="region" aria-labelledby="([^"]+)">',
        document,
    )
    require(len(tables) == 12, f"Expected 12 report tables, found {len(tables)}")
    require(len(wrappers) == len(tables), "Every report table must have a keyboard-focusable region")

    for index, table in enumerate(tables, start=1):
        caption_id = f"report-table-{index}-caption"
        require(f'<caption id="{caption_id}"' in table, f"Table {index} caption is missing")
        thead_match = re.search(r"<thead>.*?</thead>", table, flags=re.DOTALL)
        tbody_match = re.search(r"<tbody>.*?</tbody>", table, flags=re.DOTALL)
        require(thead_match is not None and tbody_match is not None, f"Table {index} structure is incomplete")
        column_headers = re.findall(r'<th scope="col"', thead_match.group(0))
        rows = re.findall(r"<tr>.*?</tr>", tbody_match.group(0), flags=re.DOTALL)
        require(column_headers, f"Table {index} has no scoped column headers")
        require(rows, f"Table {index} has no body rows")
        require(
            all(re.search(r'<tr>\s*<th scope="row"', row) for row in rows),
            f"Table {index} has a body row without a scoped row header",
        )
        require(wrappers[index - 1] == caption_id, f"Table {index} region is not labelled by its caption")

    require(
        f'href="{EXPECTED_PDF_URL}"' in document,
        "The authoritative PDF link is missing",
    )
    require("RDS publication page" in document, "The RDS publication-page link is missing")

    print("Built report checks passed")
    print(f"Headings: {len(heading_levels)}; tables: {len(tables)}; scoped row headers: {document.count('scope=\"row\"')}")
    print(f"JSON-LD: {metadata['@type']} {metadata['@id']}")


if __name__ == "__main__":
    main()
