#!/usr/bin/env python3
"""Check the built HDRL site for structural and editorial coherence."""

from __future__ import annotations

import hashlib
import json
import posixpath
import re
from collections import Counter, defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
SOURCE = (
    ROOT
    / "reference"
    / "frozen-applied-v1"
    / "Health Data Readiness Level Framework V1.md"
)
SOURCE_DOWNLOAD = (
    SITE / "downloads" / "health-data-readiness-level-framework-v1.md"
)
PRESENTATION_KIT = (
    SITE / "downloads" / "HDRL-Presentation-Kit-v1.1.0.pptx"
)
CANONICAL_ORIGIN = "https://hdrlframework.org"
INTERNAL_HOSTS = {
    "hdrlframework.org",
    "launch-review--hdrl-framework-pr10-review.netlify.app",
}


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(message)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def normalise_text(parts: list[str]) -> str:
    return re.sub(r"\s+", " ", " ".join(parts)).strip()


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.title_depth = 0
        self.h1_depth = 0
        self.main_depth = 0
        self.paragraph_depth = 0
        self.title_parts: list[str] = []
        self.current_h1: list[str] = []
        self.h1s: list[str] = []
        self.current_paragraph: list[str] = []
        self.paragraphs: list[str] = []
        self.description: str | None = None
        self.canonical: str | None = None
        self.robots: str | None = None
        self.ids: list[str] = []
        self.links: list[str] = []

    def handle_starttag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
        attributes = dict(attrs)
        if tag == "title":
            self.title_depth += 1
        if tag == "main":
            self.main_depth += 1
        if self.main_depth and tag == "h1":
            self.h1_depth += 1
            self.current_h1 = []
        if self.main_depth and tag == "p":
            self.paragraph_depth += 1
            self.current_paragraph = []

        if identifier := attributes.get("id"):
            self.ids.append(identifier)
        if tag == "a" and (href := attributes.get("href")):
            self.links.append(href)
        if tag == "meta" and attributes.get("name") == "description":
            self.description = attributes.get("content")
        if tag == "meta" and attributes.get("name") == "robots":
            self.robots = attributes.get("content")
        if tag == "link" and attributes.get("rel") == "canonical":
            self.canonical = attributes.get("href")

    def handle_endtag(self, tag: str) -> None:
        if tag == "title" and self.title_depth:
            self.title_depth -= 1
        if tag == "h1" and self.h1_depth:
            self.h1s.append(normalise_text(self.current_h1).replace("¶", "").strip())
            self.h1_depth -= 1
        if tag == "p" and self.paragraph_depth:
            paragraph = normalise_text(self.current_paragraph)
            if paragraph:
                self.paragraphs.append(paragraph)
            self.paragraph_depth -= 1
        if tag == "main" and self.main_depth:
            self.main_depth -= 1

    def handle_data(self, data: str) -> None:
        if self.title_depth:
            self.title_parts.append(data)
        if self.h1_depth:
            self.current_h1.append(data)
        if self.paragraph_depth:
            self.current_paragraph.append(data)

    @property
    def title(self) -> str:
        return normalise_text(self.title_parts)


def route_for(path: Path) -> str:
    relative = path.relative_to(SITE)
    if relative == Path("index.html"):
        return "/"
    return "/" + str(relative.parent).strip("/") + "/"


def target_for(current_route: str, href: str) -> tuple[Path, str] | None:
    parsed = urlparse(href)
    if parsed.scheme in {"mailto", "tel", "javascript"}:
        return None
    if parsed.scheme in {"http", "https"} and parsed.netloc not in INTERNAL_HOSTS:
        return None
    if parsed.scheme and parsed.scheme not in {"http", "https"}:
        return None

    raw_path = unquote(parsed.path)
    if not raw_path:
        path = current_route
    elif raw_path.startswith("/"):
        path = raw_path
    else:
        path = posixpath.join(current_route, raw_path)
    path = posixpath.normpath(path)
    if raw_path.endswith("/") and not path.endswith("/"):
        path += "/"
    if not path.startswith("/"):
        path = "/" + path

    suffix = Path(path).suffix
    if path.endswith("/") or not suffix:
        target = SITE / path.lstrip("/") / "index.html"
    else:
        target = SITE / path.lstrip("/")
    return target, parsed.fragment


def main() -> None:
    html_files = sorted(SITE.rglob("index.html"))
    require(html_files, "Built site is missing")

    pages: dict[str, tuple[Path, PageParser]] = {}
    descriptions: Counter[str] = Counter()
    paragraphs: defaultdict[str, set[str]] = defaultdict(set)
    link_count = 0

    for path in html_files:
        route = route_for(path)
        document = path.read_text(encoding="utf-8")
        parser = PageParser()
        parser.feed(document)
        pages[route] = (path, parser)

        require(len(parser.h1s) == 1, f"{route} must contain exactly one H1")
        require(parser.title, f"{route} has no page title")
        require(parser.description, f"{route} has no meta description")
        require(
            len(parser.description or "") >= 50,
            f"{route} has an unhelpfully short meta description",
        )
        expected_canonical = f"{CANONICAL_ORIGIN}{route}"
        require(
            parser.canonical == expected_canonical,
            f"{route} canonical URL is {parser.canonical!r}, "
            f"expected {expected_canonical!r}",
        )
        if route == "/self-assessment/":
            require(
                parser.robots and "noindex" in parser.robots.lower(),
                "Research prototype must remain excluded from indexing",
            )
            require(
                "plausible.io" not in document,
                "Assessment prototype must not initialise public-site analytics",
            )
        else:
            require(
                not parser.robots or "noindex" not in parser.robots.lower(),
                f"{route} contains an unintended noindex directive",
            )
        require(
            "Framework methodology and public framework materials:" in document,
            f"{route} does not scope the global CC BY statement",
        )
        descriptions[parser.description or ""] += 1
        for paragraph in parser.paragraphs:
            if len(paragraph.split()) >= 14:
                paragraphs[paragraph].add(route)

    repeated_descriptions = [
        description for description, count in descriptions.items() if count > 1
    ]
    require(
        not repeated_descriptions,
        f"Meta descriptions are duplicated across pages: {repeated_descriptions}",
    )

    allowed_repeat_starts = (
        "This is an Outcome/Context indicator",
        "Framework overview",
        "Use this source-defined minimum evidence",
    )
    repeated_paragraphs = {
        paragraph: routes
        for paragraph, routes in paragraphs.items()
        if len(routes) > 1
        and not paragraph.startswith(allowed_repeat_starts)
    }
    require(
        not repeated_paragraphs,
        "Unapproved repeated paragraphs found: "
        + "; ".join(
            f"{sorted(routes)}: {paragraph[:100]}"
            for paragraph, routes in repeated_paragraphs.items()
        ),
    )

    parsed_cache: dict[Path, PageParser] = {
        path: parser for path, parser in pages.values()
    }
    failures: list[str] = []
    for route, (_, parser) in pages.items():
        for href in parser.links:
            link_count += 1
            resolved = target_for(route, href)
            if resolved is None:
                continue
            target, fragment = resolved
            if not target.is_file():
                failures.append(f"{route} -> {href}: missing target")
                continue
            if fragment and target.suffix == ".html":
                target_parser = parsed_cache.get(target)
                if target_parser is None:
                    target_parser = PageParser()
                    target_parser.feed(target.read_text(encoding="utf-8"))
                    parsed_cache[target] = target_parser
                if fragment not in target_parser.ids:
                    failures.append(f"{route} -> {href}: missing anchor")
    require(not failures, "Broken internal links:\n" + "\n".join(failures))

    require(SOURCE_DOWNLOAD.is_file(), "Built framework Markdown download is missing")
    require(
        SOURCE_DOWNLOAD.read_bytes() == SOURCE.read_bytes(),
        "Built framework Markdown differs from the canonical source",
    )
    require(
        PRESENTATION_KIT.is_file(),
        "Built HDRL Presentation Kit download is missing",
    )

    quick_reference = (
        SITE / "framework" / "quick-reference" / "index.html"
    ).read_text(encoding="utf-8")
    require(
        'class="hdrl-table-scroll" role="region" '
        'aria-label="All 64 HDRL indicators" tabindex="0"' in quick_reference,
        "Indicator Quick Reference table is not a labelled keyboard region",
    )
    indicator_table = re.search(
        r'<table class="hdrl-indicator-table">.*?</table>',
        quick_reference,
        flags=re.DOTALL,
    )
    require(
        indicator_table is not None
        and indicator_table.group(0).count("<tbody>") == 8
        and indicator_table.group(0).count('scope="rowgroup"') == 8,
        "Indicator Quick Reference does not expose eight valid row groups",
    )
    three_nations = (
        SITE / "three-nations-assessment" / "index.html"
    ).read_text(encoding="utf-8")
    require(
        re.search(
            r'<div(?=[^>]*class="hdrl-table-scroll")'
            r'(?=[^>]*role="region")'
            r'(?=[^>]*aria-label="Historical capability mapping")'
            r'(?=[^>]*tabindex="0")[^>]*>',
            three_nations,
        )
        is not None,
        "Historical capability mapping is not a labelled keyboard region",
    )
    domain_evidence_count = sum(
        document.read_text(encoding="utf-8").count(
            'class="hdrl-minimum-evidence"'
        )
        for document in sorted((SITE / "domains").glob("*/index.html"))
    )
    require(
        domain_evidence_count == 64,
        f"Expected minimum evidence for 64 indicators, found "
        f"{domain_evidence_count}",
    )

    catalogue_path = SITE / "data" / "hdrl-indicators-v1.json"
    catalogue = json.loads(catalogue_path.read_text(encoding="utf-8"))
    require(
        catalogue["source"]["url"]
        == "https://hdrlframework.org/downloads/"
        "health-data-readiness-level-framework-v1.md",
        "Catalogue provenance URL is not the direct source artefact",
    )
    manifest = SITE / "data" / "hdrl-indicators-v1.sha256"
    manifest_entries = manifest.read_text(encoding="utf-8").splitlines()
    require(
        len(manifest_entries) == 3,
        "Release checksum manifest does not contain all three artefacts",
    )
    for line in manifest_entries:
        expected, filename = line.split("  ", 1)
        target = (manifest.parent / filename).resolve()
        require(
            target.is_relative_to(SITE.resolve()) and target.is_file(),
            f"Release manifest target is invalid: {filename}",
        )
        require(
            sha256(target) == expected,
            f"Release manifest checksum mismatch: {filename}",
        )

    homepage = (SITE / "index.html").read_text(encoding="utf-8")
    require(
        'class="hdrl-bridge" role="img"' not in homepage,
        "The meaningful homepage bridge is incorrectly exposed as one image",
    )
    require(
        "Commissioned by and intellectual property rights owned by "
        "Research Data Scotland" in homepage
        and "Read the medRxiv preprint" in homepage
        and "Further independent validation is required" in homepage
        and "Open framework · Version 1.0.1" in homepage,
        "Homepage provenance or validation status is incomplete",
    )
    about = (SITE / "about" / "index.html").read_text(encoding="utf-8")
    require(
        "Version 1.0.1 scope" in about
        and "Clarified programme status and participation language" in about,
        "The public framework version history is incomplete",
    )
    presentation_kit = (
        SITE / "presentation-kit" / "index.html"
    ).read_text(encoding="utf-8")
    require(
        "92 editable slides" in presentation_kit
        and "Presentation Kit v1.1.0" in presentation_kit
        and "indicator catalogue <strong>v1.0.2</strong>" in presentation_kit
        and "reliability, validity and fitness for accreditation"
        in presentation_kit
        and 'download="HDRL-Presentation-Kit-v1.1.0.pptx"'
        in presentation_kit
        and "Research Data Scotland" in presentation_kit
        and "OPL Advisory Ltd" in presentation_kit,
        "Presentation Kit page is missing scope, validation or attribution guidance",
    )
    keyboard_script = SITE / "assets" / "js" / "table-keyboard.js"
    require(
        keyboard_script.is_file()
        and 'event.key === "ArrowRight"' in keyboard_script.read_text(
            encoding="utf-8"
        ),
        "Keyboard support for horizontal table regions is missing",
    )

    print("Built site coherence checks passed")
    print(
        f"Pages: {len(pages)}; internal links and anchors: {link_count}; "
        "failures: 0"
    )
    print(f"Unique meta descriptions: {len(descriptions)}")
    print(f"Canonical framework download SHA-256: {sha256(SOURCE_DOWNLOAD)}")


if __name__ == "__main__":
    main()
