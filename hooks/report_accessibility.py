"""Build-time accessibility enhancements for the report transcription."""

from __future__ import annotations

import html as html_module
import re


TABLE_RE = re.compile(r"<table>.*?</table>", flags=re.DOTALL)
THEAD_RE = re.compile(r"<thead>.*?</thead>", flags=re.DOTALL)
TBODY_RE = re.compile(r"<tbody>.*?</tbody>", flags=re.DOTALL)
ROW_RE = re.compile(r"<tr>.*?</tr>", flags=re.DOTALL)


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


def _enhance_table(table: str, index: int, caption: str) -> str:
    caption_id = f"report-table-{index}-caption"
    safe_caption = html_module.escape(caption)
    table = table.replace(
        "<table>",
        f'<table class="hdrl-report-table"><caption id="{caption_id}" '
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
    return (
        '<div class="md-typeset__table hdrl-report-table-wrapper" '
        f'tabindex="0" role="region" aria-labelledby="{caption_id}">'
        f"{table}</div>"
    )


def on_page_content(html: str, page, config, files) -> str:
    if page.url != "explore-report/":
        return html

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
