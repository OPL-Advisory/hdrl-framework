#!/usr/bin/env python3
"""Validate the versioned, catalogue-driven HDRL Presentation Kit."""

from __future__ import annotations

import json
import hashlib
import re
import struct
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parents[1]
CATALOGUE_PATH = ROOT / "docs" / "data" / "hdrl-indicators-v1.json"
PRESENTATION_PATH = (
    ROOT / "docs" / "downloads" / "HDRL-Presentation-Kit-v1.1.0.pptx"
)
PREVIEW_PATH = (
    ROOT / "docs" / "assets" / "images"
    / "hdrl-presentation-kit-preview.png"
)
EXPECTED_PREVIEW_SHA256 = (
    "bf62bbdb31f8c12a1bf026d3120f038a4eaa5a7c5a1ed5d65fa136bacebfb8a5"
)
KIT_VERSION = "1.1.0"
KIT_DATE = "30 July 2026"
KIT_DATE_SHORT = "30 Jul 2026"
EXPECTED_SLIDES = 92
DRAWING_TEXT = "{http://schemas.openxmlformats.org/drawingml/2006/main}t"
PRESENTATION = "http://schemas.openxmlformats.org/presentationml/2006/main"
DRAWING = "http://schemas.openxmlformats.org/drawingml/2006/main"
RELATIONSHIPS = "http://schemas.openxmlformats.org/package/2006/relationships"
DECORATIVE = "http://schemas.microsoft.com/office/drawing/2017/decorative"
CORE = "http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
DC = "http://purl.org/dc/elements/1.1/"
EXTENDED = (
    "http://schemas.openxmlformats.org/officeDocument/2006/"
    "extended-properties"
)
EXPECTED_LINKS = {
    "home": "https://hdrlframework.org/",
    "licence": "https://creativecommons.org/licenses/by/4.0/",
    "paper": (
        "https://www.medrxiv.org/content/"
        "10.64898/2026.07.23.26358713v1"
    ),
    "feedback": (
        "https://docs.google.com/forms/d/e/"
        "1FAIpQLSdrcE7zwWvJ0Pu1klaKF1oAJA7lSyyMFnZp7BIJ6zSGJyk_NA/"
        "viewform"
    ),
}


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def numbered_parts(names: list[str], prefix: str, suffix: str) -> list[str]:
    pattern = re.compile(
        rf"^{re.escape(prefix)}(\d+){re.escape(suffix)}$"
    )
    matches: list[tuple[int, str]] = []
    for name in names:
        match = pattern.match(name)
        if match:
            matches.append((int(match.group(1)), name))
    return [name for _, name in sorted(matches)]


def text_runs(archive: zipfile.ZipFile, part_name: str) -> list[str]:
    root = ElementTree.fromstring(archive.read(part_name))
    return [element.text or "" for element in root.iter(DRAWING_TEXT)]


def part_text(
    archive: zipfile.ZipFile,
    part_name: str,
    namespace: str,
    local_name: str,
) -> str:
    root = ElementTree.fromstring(archive.read(part_name))
    element = root.find(f".//{{{namespace}}}{local_name}")
    return "" if element is None else element.text or ""


def external_links(
    archive: zipfile.ZipFile,
    names: list[str],
    slide_number: int,
) -> set[str]:
    relationship_part = (
        f"ppt/slides/_rels/slide{slide_number}.xml.rels"
    )
    if relationship_part not in names:
        return set()
    root = ElementTree.fromstring(archive.read(relationship_part))
    return {
        relationship.get("Target", "")
        for relationship in root.findall(
            f"{{{RELATIONSHIPS}}}Relationship"
        )
        if relationship.get("TargetMode") == "External"
    }


def main() -> None:
    catalogue = json.loads(CATALOGUE_PATH.read_text(encoding="utf-8"))
    framework_version = catalogue["framework"]["version"]
    catalogue_version = catalogue["catalogue_version"]
    source_hash_short = catalogue["source"]["sha256"][:12]

    kit_files = sorted(
        (ROOT / "docs" / "downloads").glob(
            "HDRL-Presentation-Kit-v*.pptx"
        )
    )
    require(
        kit_files == [PRESENTATION_PATH],
        "Unexpected Presentation Kit versions in docs/downloads: "
        + ", ".join(path.name for path in kit_files),
    )
    built_downloads = ROOT / "site" / "downloads"
    if built_downloads.is_dir():
        built_kits = sorted(
            built_downloads.glob("HDRL-Presentation-Kit-v*.pptx")
        )
        expected_built = built_downloads / PRESENTATION_PATH.name
        require(
            built_kits == [expected_built],
            "Unexpected Presentation Kit versions in built site: "
            + ", ".join(path.name for path in built_kits),
        )
        require(
            expected_built.read_bytes() == PRESENTATION_PATH.read_bytes(),
            "Built-site Presentation Kit is stale",
        )

    require(PRESENTATION_PATH.is_file(), "Presentation Kit file is missing")
    require(PREVIEW_PATH.is_file(), "Presentation Kit preview image is missing")
    preview_bytes = PREVIEW_PATH.read_bytes()
    require(
        preview_bytes.startswith(b"\x89PNG\r\n\x1a\n")
        and len(preview_bytes) >= 24,
        "Presentation Kit preview is not a valid PNG",
    )
    require(
        struct.unpack(">II", preview_bytes[16:24]) == (1600, 900),
        "Presentation Kit preview must be a 1600 × 900 render of slide 2",
    )
    require(
        hashlib.sha256(preview_bytes).hexdigest()
        == EXPECTED_PREVIEW_SHA256,
        "Presentation Kit preview is stale or has not been regenerated "
        "from the approved slide 2 render",
    )
    with zipfile.ZipFile(PRESENTATION_PATH) as archive:
        names = archive.namelist()
        slides = numbered_parts(names, "ppt/slides/slide", ".xml")
        notes = numbered_parts(names, "ppt/notesSlides/notesSlide", ".xml")
        require(
            len(slides) == EXPECTED_SLIDES,
            f"Expected {EXPECTED_SLIDES} slides; found {len(slides)}",
        )
        require(
            len(notes) == EXPECTED_SLIDES,
            f"Expected {EXPECTED_SLIDES} speaker-note parts; found {len(notes)}",
        )

        slide_runs = {
            slide_number: text_runs(archive, part_name)
            for slide_number, part_name in enumerate(slides, start=1)
        }
        title_placeholders = 0
        decorative_objects = 0
        hyperlink_screentips = 0
        all_links: set[str] = set()
        for slide_number, part_name in enumerate(slides, start=1):
            root = ElementTree.fromstring(archive.read(part_name))
            title_placeholders += len(
                [
                    placeholder
                    for placeholder in root.findall(
                        f".//{{{PRESENTATION}}}ph"
                    )
                    if placeholder.get("type") in {"title", "ctrTitle"}
                ]
            )
            decorative_objects += len(
                root.findall(f".//{{{DECORATIVE}}}decorative")
            )
            hyperlinks = root.findall(
                f".//{{{DRAWING}}}hlinkClick"
            )
            hyperlink_screentips += len(
                [
                    hyperlink
                    for hyperlink in hyperlinks
                    if (hyperlink.get("tooltip") or "").strip()
                ]
            )
            require(
                all((hyperlink.get("tooltip") or "").strip() for hyperlink in hyperlinks),
                f"Slide {slide_number} has a hyperlink without a ScreenTip",
            )
            slide_links = external_links(archive, names, slide_number)
            all_links.update(slide_links)
            if slide_number != 2:
                require(
                    EXPECTED_LINKS["home"] in slide_links
                    and EXPECTED_LINKS["licence"] in slide_links,
                    f"Slide {slide_number} footer links are incomplete",
                )

        require(
            title_placeholders == EXPECTED_SLIDES,
            f"Expected {EXPECTED_SLIDES} title placeholders; "
            f"found {title_placeholders}",
        )
        require(
            decorative_objects > 0,
            "No decorative-object accessibility markers were found",
        )
        require(
            set(EXPECTED_LINKS.values()).issubset(all_links),
            "Required paper, framework, feedback or licence link is missing",
        )
        require(
            hyperlink_screentips > 0,
            "No hyperlink ScreenTips were found",
        )
        require(
            set(EXPECTED_LINKS.values()).issubset(
                external_links(archive, names, 20)
                | {EXPECTED_LINKS["licence"]}
            ),
            "Slide 20 must link to the paper, framework and feedback form",
        )

        require(
            part_text(archive, "docProps/core.xml", DC, "title")
            == "HDRL Presentation Kit v1.1.0",
            "File title metadata is incorrect",
        )
        require(
            part_text(archive, "docProps/core.xml", DC, "creator")
            == "OPL Advisory Ltd",
            "File author metadata is incorrect",
        )
        require(
            part_text(archive, "docProps/core.xml", DC, "subject")
            == (
                "Health Data Readiness Level Framework presentation "
                "and reference library"
            ),
            "File subject metadata is incorrect",
        )
        require(
            "HDRL" in part_text(
                archive,
                "docProps/core.xml",
                CORE,
                "keywords",
            ),
            "File keyword metadata is missing",
        )
        require(
            part_text(
                archive,
                "docProps/app.xml",
                EXTENDED,
                "Slides",
            )
            == str(EXPECTED_SLIDES)
            and part_text(
                archive,
                "docProps/app.xml",
                EXTENDED,
                "Notes",
            )
            == str(EXPECTED_SLIDES),
            "File slide/note metadata counts are incorrect",
        )

        standard_stamp = (
            f"HDRL v{framework_version}  •  Kit v{KIT_VERSION}  •  "
            f"{KIT_DATE_SHORT}"
        )
        title_stamp = (
            f"HDRL v{framework_version}  •  Presentation Kit v{KIT_VERSION}"
            f"  •  {KIT_DATE}"
        )
        for slide_number, runs in slide_runs.items():
            required_stamp = title_stamp if slide_number == 2 else standard_stamp
            require(
                required_stamp in runs,
                f"Slide {slide_number} is missing its version/date stamp",
            )

        page_number = 21
        checked_indicators = 0
        for domain in catalogue["domains"]:
            overview_text = "\n".join(slide_runs[page_number])
            require(
                f"Domain {domain['ref']} · {domain['name']}" in overview_text,
                f"Slide {page_number} is not the expected Domain "
                f"{domain['ref']} overview",
            )
            page_number += 1

            domain_indicators = [
                indicator
                for indicator in catalogue["indicators"]
                if indicator["domain"] == domain["ref"]
            ]
            for indicator in domain_indicators:
                runs = slide_runs[page_number]
                full_text = "\n".join(runs)
                require(
                    f"{indicator['ref']} · {indicator['name']}" in full_text,
                    f"Slide {page_number} is not the expected "
                    f"{indicator['ref']} detail slide",
                )
                for level_ref, descriptor in indicator[
                    "maturity_levels"
                ].items():
                    require(
                        descriptor in runs,
                        f"Slide {page_number} changes or omits "
                        f"{indicator['ref']} {level_ref}",
                    )
                for evidence_number, evidence in enumerate(
                    indicator["minimum_evidence"]["L4"], start=1
                ):
                    require(
                        evidence in runs,
                        f"Slide {page_number} changes or omits "
                        f"{indicator['ref']} Level 4 evidence "
                        f"{evidence_number}",
                    )
                require(
                    f"Catalogue v{catalogue_version}" in full_text
                    and f"Source {source_hash_short}" in full_text
                    and "Verbatim descriptors and evidence" in full_text,
                    f"Slide {page_number} lacks catalogue provenance",
                )
                checked_indicators += 1
                page_number += 1

        require(
            page_number == EXPECTED_SLIDES + 1,
            f"Indicator library ended at slide {page_number - 1}",
        )
        require(
            checked_indicators == catalogue["indicator_count"],
            f"Expected {catalogue['indicator_count']} indicators; "
            f"checked {checked_indicators}",
        )

    print("Presentation Kit validation passed")
    print(
        f"Slides: {EXPECTED_SLIDES}; notes: {EXPECTED_SLIDES}; "
        f"indicator detail slides: {checked_indicators}"
    )
    print(
        f"Framework v{framework_version}; catalogue v{catalogue_version}; "
        f"Presentation Kit v{KIT_VERSION}; {KIT_DATE}"
    )
    print(
        f"Verbatim checks: {checked_indicators * 5} maturity descriptors; "
        f"{checked_indicators * 3} Level 4 evidence requirements"
    )
    print(
        f"Accessibility and links: {title_placeholders} title placeholders; "
        f"{decorative_objects} decorative markers; "
        f"{hyperlink_screentips} hyperlink ScreenTips; "
        f"{len(all_links)} required link targets present"
    )


if __name__ == "__main__":
    try:
        main()
    except (KeyError, OSError, ValueError, zipfile.BadZipFile) as error:
        print(f"Presentation Kit validation failed: {error}", file=sys.stderr)
        raise SystemExit(1)
