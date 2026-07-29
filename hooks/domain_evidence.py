"""Add source-verified minimum-evidence guidance to the domain reference."""

from __future__ import annotations

import html as html_module
import json
import re
from pathlib import Path


CATALOGUE_PATH = Path("docs") / "data" / "hdrl-indicators-v1.json"
DOMAIN_ROUTE_RE = re.compile(r"^domains/[a-h]-")


def _evidence_block(indicator: dict[str, object]) -> str:
    ref = str(indicator["ref"])
    anchor = ref.lower().replace(".", "")
    evidence = indicator["minimum_evidence"]
    if not isinstance(evidence, dict):
        raise ValueError(f"Minimum evidence is not an object for {ref}")

    parts = [
        f'<details class="hdrl-minimum-evidence" '
        f'data-hdrl-indicator="{html_module.escape(ref)}">',
        "<summary>Minimum evidence for L3–L5</summary>",
        "<p>Use this source-defined minimum evidence with the maturity "
        "descriptors above. Record the artefact, date, scope and the claim it "
        "supports.</p>",
    ]
    for level in ("L3", "L4", "L5"):
        items = evidence.get(level)
        if not isinstance(items, list) or not items:
            raise ValueError(f"{ref} is missing {level} minimum evidence")
        parts.append(
            f'<h4 id="{anchor}-{level.lower()}-minimum-evidence">'
            f"{level} minimum evidence</h4><ul>"
        )
        parts.extend(
            f"<li>{html_module.escape(str(item))}</li>" for item in items
        )
        parts.append("</ul>")
    parts.append("</details>")
    return "".join(parts)


def on_page_content(html: str, page, config, files) -> str:
    if not DOMAIN_ROUTE_RE.match(page.url):
        return html

    repository_root = Path(config["config_file_path"]).resolve().parent
    catalogue = json.loads(
        (repository_root / CATALOGUE_PATH).read_text(encoding="utf-8")
    )
    domain_ref = page.url.removeprefix("domains/")[0].upper()
    indicators = [
        indicator
        for indicator in catalogue["indicators"]
        if indicator["domain"] == domain_ref
    ]
    if not indicators:
        raise ValueError(f"No catalogue indicators found for {page.url}")

    inserted = 0
    for indicator in indicators:
        ref = str(indicator["ref"])
        heading_prefix = ref.lower().replace(".", "")
        heading = re.search(
            rf'<h3\b[^>]*\bid="{re.escape(heading_prefix)}-[^"]*"'
            rf"[^>]*>.*?</h3>",
            html,
            flags=re.DOTALL,
        )
        if not heading:
            raise ValueError(f"Cannot find the rendered heading for {ref}")
        next_heading = re.search(r'<h3 id="', html[heading.end() :])
        segment_end = (
            heading.end() + next_heading.start()
            if next_heading
            else len(html)
        )
        table_end = html.find("</table>", heading.end(), segment_end)
        if table_end == -1:
            raise ValueError(f"Cannot find the descriptor table for {ref}")
        insertion_point = table_end + len("</table>")
        html = (
            html[:insertion_point]
            + _evidence_block(indicator)
            + html[insertion_point:]
        )
        inserted += 1

    if inserted != len(indicators):
        raise ValueError(
            f"Evidence injection mismatch for {page.url}: "
            f"{inserted} of {len(indicators)}"
        )

    h1_end = html.find("</h1>")
    if h1_end == -1:
        raise ValueError(f"Cannot find the domain H1 for {page.url}")
    note = (
        '<div class="admonition info hdrl-domain-evidence-note">'
        '<p class="admonition-title">Using the domain reference</p>'
        f"<p>Domain {domain_ref} includes the five maturity descriptors and "
        "the source-verified minimum evidence for L3–L5. Expand the evidence "
        "section beneath each indicator and retain an auditable assessment "
        'record. See <a href="/framework/using-the-framework/">How to Apply '
        "HDRL</a>.</p></div>"
    )
    insertion_point = h1_end + len("</h1>")
    return html[:insertion_point] + note + html[insertion_point:]
