"""Build-time accessibility enhancements for the report transcription."""

from __future__ import annotations

import html as html_module
import re
from pathlib import Path


MARKDOWN_DOWNLOAD_PATH = (
    "downloads/three-nations-readiness-assessment-final-report.md"
)
MARKDOWN_PREAMBLE = """# Health Data Research Service: Three Nations Readiness Assessment

**Final Report · accessible Markdown transcription**

**David Seymour, OPL Advisory · July 2026 · V1.0**

Commissioned by Research Data Scotland on behalf of the three devolved nations.

> This Markdown transcription preserves the wording and tables of the published
> report. The [RDS PDF](https://www.researchdata.scot/media/icxggzvo/rds-branded-three-nations-readiness-report.pdf)
> remains the authoritative version. Navigation and links are accessibility
> additions and are not part of the report text. See the
> [RDS publication page](https://www.researchdata.scot/news-and-insights/new-independent-assessment-highlights-devolved-nations-leading-role-in-health-data-research/).

> The published cover is dated July 2026, while the report's Document Control
> table records April 2026; both dates are preserved as published. Research Data
> Scotland published the Final Report on 14 July 2026.

> The CC BY 4.0 terms for the HDRL Framework methodology and public framework
> materials do not automatically extend to this Final Report.

> **Editorial terminology note:** the report wording below uses "Level 2
> (Repeatable)". The HDRL v1.0.1 framework reference uses "Level 2
> (Developing)". The report wording is preserved unchanged.

"""


TABLE_RE = re.compile(r"<table>.*?</table>", flags=re.DOTALL)
THEAD_RE = re.compile(r"<thead>.*?</thead>", flags=re.DOTALL)
TBODY_RE = re.compile(r"<tbody>.*?</tbody>", flags=re.DOTALL)
ROW_RE = re.compile(r"<tr>.*?</tr>", flags=re.DOTALL)
HEADER_CELL_RE = re.compile(r"<th[^>]*>(.*?)</th>", flags=re.DOTALL)
BODY_CELL_RE = re.compile(r"<(?:th|td)[^>]*>(.*?)</(?:th|td)>", flags=re.DOTALL)
TAG_RE = re.compile(r"<[^>]+>")
MOBILE_CARD_TABLES = {3, 6, 7, 8, 9, 10, 11, 12}


def _add_column_scopes(thead: str) -> str:
    return re.sub(
        r"<th(?=[\s>])(?![^>]*\bscope=)([^>]*)>",
        r'<th scope="col"\1>',
        thead,
    )


def _add_row_scope(row: str) -> str:
    return re.sub(
        r"(<tr>\s*)<td([^>]*)>(.*?)</td>",
        r'\1<th scope="row"\2>\3</th>',
        row,
        count=1,
        flags=re.DOTALL,
    )


def _plain_text(fragment: str) -> str:
    return html_module.unescape(TAG_RE.sub("", fragment)).strip()


def _build_mobile_cards(table: str, index: int, caption: str) -> str:
    if index not in MOBILE_CARD_TABLES:
        return ""

    thead = THEAD_RE.search(table)
    tbody = TBODY_RE.search(table)
    if not thead or not tbody:
        raise ValueError(f"Report table {index} cannot be converted to mobile cards")

    headers = [_plain_text(cell) for cell in HEADER_CELL_RE.findall(thead.group(0))]
    rows = ROW_RE.findall(tbody.group(0))
    label_id = f"report-table-{index}-cards-label"
    safe_caption = html_module.escape(caption)
    cards = [
        f'<div class="hdrl-report-cards hdrl-report-cards--{index}" '
        f'role="list" aria-labelledby="{label_id}">',
        f'<p id="{label_id}" class="hdrl-visually-hidden">{safe_caption}, mobile layout</p>',
    ]

    for row in rows:
        cells = BODY_CELL_RE.findall(row)
        if len(cells) != len(headers):
            raise ValueError(
                f"Report table {index} mobile-card metadata mismatch: "
                f"{len(headers)} header(s), {len(cells)} cell(s)"
            )
        title = html_module.escape(_plain_text(cells[0]))
        cards.append('<section class="hdrl-report-card" role="listitem">')
        cards.append(f'<p class="hdrl-report-card-title">{title}</p><dl>')
        for label, value in zip(headers[1:], cells[1:]):
            safe_label = html_module.escape(label or "Value")
            cards.append(f"<div><dt>{safe_label}</dt><dd>{value}</dd></div>")
        cards.append("</dl></section>")

    cards.append("</div>")
    return "".join(cards)


def _enhance_table(table: str, index: int, caption: str) -> str:
    caption_id = f"report-table-{index}-caption"
    safe_caption = html_module.escape(caption)
    table = table.replace(
        "<table>",
        f'<table class="hdrl-report-table hdrl-report-table--{index}"><caption id="{caption_id}" '
        f'class="hdrl-visually-hidden">{safe_caption}</caption>',
        1,
    )
    table = THEAD_RE.sub(lambda match: _add_column_scopes(match.group(0)), table)
    table = TBODY_RE.sub(
        lambda match: ROW_RE.sub(
            lambda row_match: _add_row_scope(row_match.group(0)), match.group(0)
        ),
        table,
    )
    accessibility_attributes = ""
    if index in MOBILE_CARD_TABLES:
        accessibility_attributes = (
            ' role="region" tabindex="0" '
            f'aria-label="{safe_caption}, scrollable table"'
        )
    table_layout = (
        '<div class="md-typeset__table hdrl-report-table-wrapper '
        f'hdrl-report-table-wrapper--{index}"{accessibility_attributes}>'
        f"{table}</div>"
    )
    return table_layout + _build_mobile_cards(table, index, caption)


def on_page_content(html: str, page, config, files) -> str:
    if page.url != "explore-report/":
        return html

    html, notice_heading_count = re.subn(
        r'<h2 id="report-source-note-title">.*?</h2>',
        "",
        html,
        count=1,
        flags=re.DOTALL,
    )
    if notice_heading_count != 1:
        raise ValueError(
            "The report accessibility notice heading metadata is missing"
        )

    captions = page.meta.get("report_table_captions", [])
    tables = list(TABLE_RE.finditer(html))
    if len(tables) != len(captions):
        raise ValueError(
            "Report table accessibility metadata mismatch: "
            f"found {len(tables)} table(s), configured {len(captions)} caption(s)"
        )

    caption_iter = iter(enumerate(captions, start=1))
    html = TABLE_RE.sub(
        lambda match: _enhance_table(match.group(0), *next(caption_iter)), html
    )

    return html


def on_post_build(config) -> None:
    """Publish the verified report transcription as downloadable Markdown."""

    source = Path(config["docs_dir"]) / "explore-report.md"
    target = Path(config["site_dir"]) / MARKDOWN_DOWNLOAD_PATH
    text = source.read_text(encoding="utf-8")
    front_matter = re.match(r"\A---\n.*?\n---\n+", text, flags=re.DOTALL)
    if not front_matter:
        raise ValueError("The report Markdown front matter is missing")

    report_text = text[front_matter.end() :].lstrip()
    report_text, notice_heading_count = re.subn(
        r"\A## About this accessible version "
        r"\{ #report-source-note-title \}\n+",
        "",
        report_text,
        count=1,
    )
    if notice_heading_count != 1:
        raise ValueError(
            "The report accessibility notice heading metadata is missing"
        )

    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(
        MARKDOWN_PREAMBLE + report_text,
        encoding="utf-8",
        newline="\n",
    )
