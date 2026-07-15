#!/usr/bin/env python3
"""Prepare the source-locked report transcription for MkDocs.

The operator-provided Markdown is a conversion aid, not an authoritative
source. This script accepts only the audited input checksum, removes its
internal working preamble, normalises heading levels for a single-page HTML
document, and adds page metadata. The published RDS PDF remains the sole
authoritative content source and must be checked separately.
"""

from __future__ import annotations

import argparse
import hashlib
import re
from pathlib import Path


EXPECTED_INPUT_SHA256 = (
    "62e9126d3f48880816a6f74aa846656518b634255788910051f2cd47e2c6b7d3"
)

FRONT_MATTER = """---
title: Explore the Final Report
description: An accessible HTML transcription of the published Three Nations Readiness Assessment Final Report, with the RDS PDF retained as the authoritative version.
schema_type: report
template: report.html
report_media: []
report_table_captions:
  - Document control
  - Glossary of terms and abbreviations
  - Overall readiness verdict
  - Score distribution across 64 indicators
  - HDRL domains
  - Cross-nation readiness profiles
  - Foundational indicators
  - COVID-era enablers and current status
  - Pathfinder propositions
  - Risk mitigation
  - Considerations for HDRS design
  - Immediate actions
---

"""


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def prepare(source: Path) -> str:
    actual_sha256 = sha256(source)
    if actual_sha256 != EXPECTED_INPUT_SHA256:
        raise SystemExit(
            "Refusing unaudited transcription input: "
            f"expected {EXPECTED_INPUT_SHA256}, got {actual_sha256}"
        )

    text = source.read_text(encoding="utf-8")
    marker = "\n---\n"
    if marker not in text:
        raise SystemExit("The expected internal-preamble delimiter is missing")

    body = text.split(marker, 1)[1].lstrip()

    # The page template supplies the report cover as the document's sole H1.
    # Shift source headings down one level without changing their wording.
    body = re.sub(
        r"^(#{1,5})(?=\s)",
        lambda match: "#" + match.group(1),
        body,
        flags=re.MULTILINE,
    )

    # The published contents identifies this line as a subsection heading,
    # although its source styling was body text. Restore semantic hierarchy.
    body = body.replace(
        "\nScore distribution across 64 indicators\n",
        "\n### Score distribution across 64 indicators\n",
        1,
    )

    # Non-breaking spaces in the transcription are layout artefacts from the
    # word-processing source and impede natural text wrapping in HTML.
    body = re.sub(r" *\u00a0 *", " ", body)

    return FRONT_MATTER + body.rstrip() + "\n"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    rendered = prepare(args.source)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(rendered, encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()
