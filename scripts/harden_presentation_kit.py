#!/usr/bin/env python3
"""Apply deterministic accessibility and metadata hardening to the HDRL deck.

The presentation itself is generated with artifact-tool. This post-export pass
only edits package-level OOXML that artifact-tool does not currently expose:
recognised title placeholders, decorative-object flags and file properties.
It deliberately does not alter slide text, geometry, styling or speaker notes.
"""

from __future__ import annotations

import argparse
import os
import re
import tempfile
import zipfile
from pathlib import Path
from xml.etree import ElementTree


P = "http://schemas.openxmlformats.org/presentationml/2006/main"
A = "http://schemas.openxmlformats.org/drawingml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PR = "http://schemas.openxmlformats.org/package/2006/relationships"
CP = "http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
DC = "http://purl.org/dc/elements/1.1/"
DCTERMS = "http://purl.org/dc/terms/"
XSI = "http://www.w3.org/2001/XMLSchema-instance"
EP = "http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
VT = "http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"
ADEC = "http://schemas.microsoft.com/office/drawing/2017/decorative"
DECORATIVE_EXTENSION_URI = "{FF2B5EF4-FFF2-40B4-BE49-F238E27FC236}"
DECORATIVE_TEXT_NAMES = {"hdrl-mini-text", "brand-label", "title-eyebrow"}
LINK_TOOLTIPS = {
    "https://hdrlframework.org/": "Open the HDRL Framework website",
    "https://creativecommons.org/licenses/by/4.0/": "Read the Creative Commons Attribution 4.0 licence",
    "https://www.medrxiv.org/content/10.64898/2026.07.23.26358713v1": "Read the HDRL Framework preprint on medRxiv",
    "https://docs.google.com/forms/d/e/1FAIpQLSdrcE7zwWvJ0Pu1klaKF1oAJA7lSyyMFnZp7BIJ6zSGJyk_NA/viewform": "Share structured feedback on the HDRL Framework",
}

for prefix, namespace in (
    ("p", P),
    ("a", A),
    ("r", R),
    ("cp", CP),
    ("dc", DC),
    ("dcterms", DCTERMS),
    ("xsi", XSI),
    ("", EP),
    ("vt", VT),
    ("adec", ADEC),
):
    ElementTree.register_namespace(prefix, namespace)


def q(namespace: str, local_name: str) -> str:
    return f"{{{namespace}}}{local_name}"


def numbered_slide_parts(names: list[str]) -> list[str]:
    pattern = re.compile(r"^ppt/slides/slide(\d+)\.xml$")
    parts: list[tuple[int, str]] = []
    for name in names:
        match = pattern.match(name)
        if match:
            parts.append((int(match.group(1)), name))
    return [name for _, name in sorted(parts)]


def set_text_child(root: ElementTree.Element, namespace: str, name: str, value: str) -> None:
    child = root.find(q(namespace, name))
    if child is None:
        child = ElementTree.SubElement(root, q(namespace, name))
    child.text = value


def c_nv_pr(shape: ElementTree.Element) -> ElementTree.Element | None:
    paths = {
        q(P, "sp"): f"./{q(P, 'nvSpPr')}/{q(P, 'cNvPr')}",
        q(P, "cxnSp"): f"./{q(P, 'nvCxnSpPr')}/{q(P, 'cNvPr')}",
        q(P, "pic"): f"./{q(P, 'nvPicPr')}/{q(P, 'cNvPr')}",
        q(P, "graphicFrame"): f"./{q(P, 'nvGraphicFramePr')}/{q(P, 'cNvPr')}",
    }
    path = paths.get(shape.tag)
    return shape.find(path) if path else None


def nv_pr(shape: ElementTree.Element) -> ElementTree.Element | None:
    paths = {
        q(P, "sp"): f"./{q(P, 'nvSpPr')}/{q(P, 'nvPr')}",
        q(P, "cxnSp"): f"./{q(P, 'nvCxnSpPr')}/{q(P, 'nvPr')}",
        q(P, "pic"): f"./{q(P, 'nvPicPr')}/{q(P, 'nvPr')}",
        q(P, "graphicFrame"): f"./{q(P, 'nvGraphicFramePr')}/{q(P, 'nvPr')}",
    }
    path = paths.get(shape.tag)
    return shape.find(path) if path else None


def has_visible_text(shape: ElementTree.Element) -> bool:
    return any((node.text or "").strip() for node in shape.iter(q(A, "t")))


def has_hyperlink(shape: ElementTree.Element) -> bool:
    return any(node.tag in {q(A, "hlinkClick"), q(A, "hlinkHover")} for node in shape.iter())


def mark_decorative(properties: ElementTree.Element) -> bool:
    ext_list = properties.find(q(A, "extLst"))
    if ext_list is None:
        ext_list = ElementTree.SubElement(properties, q(A, "extLst"))
    for extension in ext_list.findall(q(A, "ext")):
        if extension.get("uri") == DECORATIVE_EXTENSION_URI:
            decorative = extension.find(q(ADEC, "decorative"))
            if decorative is None:
                decorative = ElementTree.SubElement(extension, q(ADEC, "decorative"))
            decorative.set("val", "1")
            return False
    extension = ElementTree.SubElement(
        ext_list,
        q(A, "ext"),
        {"uri": DECORATIVE_EXTENSION_URI},
    )
    ElementTree.SubElement(extension, q(ADEC, "decorative"), {"val": "1"})
    return True


def harden_slide(
    xml_bytes: bytes,
    slide_number: int,
    relationship_targets: dict[str, str],
) -> tuple[bytes, int, int]:
    root = ElementTree.fromstring(xml_bytes)
    shape_tree = root.find(f"./{q(P, 'cSld')}/{q(P, 'spTree')}")
    if shape_tree is None:
        raise ValueError(f"Slide {slide_number} has no shape tree")

    title_count = 0
    decorative_count = 0
    for hyperlink in root.iter(q(A, "hlinkClick")):
        relationship_id = hyperlink.get(q(R, "id"), "")
        target = relationship_targets.get(relationship_id, "")
        if target in LINK_TOOLTIPS:
            hyperlink.set("tooltip", LINK_TOOLTIPS[target])

    shape_tags = {q(P, "sp"), q(P, "cxnSp"), q(P, "pic"), q(P, "graphicFrame")}
    for shape in shape_tree.iter():
        if shape.tag not in shape_tags:
            continue
        properties = c_nv_pr(shape)
        if properties is None:
            continue

        if properties.get("name") == "slide-title":
            title_count += 1
            holder = nv_pr(shape)
            if holder is None:
                raise ValueError(f"Slide {slide_number} title has no nvPr")
            for prior in holder.findall(q(P, "ph")):
                holder.remove(prior)
            placeholder = ElementTree.Element(
                q(P, "ph"),
                {"type": "ctrTitle" if slide_number == 2 else "title"},
            )
            ext_list = holder.find(q(P, "extLst"))
            if ext_list is None:
                holder.append(placeholder)
            else:
                holder.insert(list(holder).index(ext_list), placeholder)
            c_nv_sp_pr = shape.find(f"./{q(P, 'nvSpPr')}/{q(P, 'cNvSpPr')}")
            if c_nv_sp_pr is not None:
                c_nv_sp_pr.attrib.pop("txBox", None)
            title_text = " ".join(
                (node.text or "").strip()
                for node in shape.iter(q(A, "t"))
                if (node.text or "").strip()
            )
            properties.set("title", title_text)
            properties.set("descr", f"Slide title: {title_text}")
            continue

        if (
            properties.get("name") in DECORATIVE_TEXT_NAMES
            or (not has_visible_text(shape) and not has_hyperlink(shape))
        ):
            if mark_decorative(properties):
                decorative_count += 1

    if title_count != 1:
        raise ValueError(
            f"Slide {slide_number} must contain exactly one named title; found {title_count}"
        )
    return (
        ElementTree.tostring(root, encoding="utf-8", xml_declaration=True),
        title_count,
        decorative_count,
    )


def harden_core_properties(xml_bytes: bytes) -> bytes:
    root = ElementTree.fromstring(xml_bytes)
    values = {
        (DC, "title"): "HDRL Presentation Kit v1.1.0",
        (DC, "creator"): "OPL Advisory Ltd",
        (DC, "subject"): "Health Data Readiness Level Framework presentation and reference library",
        (
            CP,
            "keywords",
        ): "HDRL, health data, research readiness, maturity framework, federated research, trusted research environments",
        (
            DC,
            "description",
        ): "A 92-slide editable presentation kit for introducing, discussing and independently testing the Health Data Readiness Level Framework v1.0.1.",
        (CP, "lastModifiedBy"): "OPL Advisory Ltd",
    }
    for (namespace, name), value in values.items():
        set_text_child(root, namespace, name, value)
    return ElementTree.tostring(root, encoding="utf-8", xml_declaration=True)


def harden_extended_properties(xml_bytes: bytes, slide_count: int, note_count: int) -> bytes:
    root = ElementTree.fromstring(xml_bytes)
    values = {
        "Application": "OPL Advisory Ltd Presentation Kit generator",
        "PresentationFormat": "On-screen Show (16:9)",
        "Slides": str(slide_count),
        "Notes": str(note_count),
        "Company": "OPL Advisory Ltd",
        "AppVersion": "1.1.0",
    }
    for name, value in values.items():
        set_text_child(root, EP, name, value)
    return ElementTree.tostring(root, encoding="utf-8", xml_declaration=True)


def harden_presentation(presentation_path: Path) -> tuple[int, int]:
    if not presentation_path.is_file():
        raise FileNotFoundError(presentation_path)

    with zipfile.ZipFile(presentation_path, "r") as source:
        names = source.namelist()
        slide_parts = numbered_slide_parts(names)
        note_count = len(
            [
                name
                for name in names
                if re.match(r"^ppt/notesSlides/notesSlide\d+\.xml$", name)
            ]
        )
        if not slide_parts:
            raise ValueError("No slide parts found")

        replacements: dict[str, bytes] = {}
        title_total = 0
        decorative_total = 0
        for slide_number, part_name in enumerate(slide_parts, start=1):
            relationship_part = (
                f"ppt/slides/_rels/slide{slide_number}.xml.rels"
            )
            relationship_targets: dict[str, str] = {}
            if relationship_part in names:
                relationship_root = ElementTree.fromstring(
                    source.read(relationship_part)
                )
                relationship_targets = {
                    relationship.get("Id", ""): relationship.get("Target", "")
                    for relationship in relationship_root.findall(
                        q(PR, "Relationship")
                    )
                    if relationship.get("TargetMode") == "External"
                }
            hardened, title_count, decorative_count = harden_slide(
                source.read(part_name),
                slide_number,
                relationship_targets,
            )
            replacements[part_name] = hardened
            title_total += title_count
            decorative_total += decorative_count

        replacements["docProps/core.xml"] = harden_core_properties(
            source.read("docProps/core.xml")
        )
        replacements["docProps/app.xml"] = harden_extended_properties(
            source.read("docProps/app.xml"),
            len(slide_parts),
            note_count,
        )

        descriptor, temporary_name = tempfile.mkstemp(
            prefix=f".{presentation_path.stem}-",
            suffix=".pptx",
            dir=presentation_path.parent,
        )
        os.close(descriptor)
        temporary_path = Path(temporary_name)
        try:
            with zipfile.ZipFile(
                temporary_path,
                "w",
                compression=zipfile.ZIP_DEFLATED,
                compresslevel=9,
            ) as target:
                for item in source.infolist():
                    target.writestr(item, replacements.get(item.filename, source.read(item.filename)))
            os.replace(temporary_path, presentation_path)
            os.chmod(presentation_path, 0o644)
        finally:
            temporary_path.unlink(missing_ok=True)

    return title_total, decorative_total


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("presentation", type=Path)
    arguments = parser.parse_args()
    titles, decorative = harden_presentation(arguments.presentation.resolve())
    print(
        f"Hardened {arguments.presentation}: {titles} title placeholders; "
        f"{decorative} decorative objects marked."
    )


if __name__ == "__main__":
    main()
