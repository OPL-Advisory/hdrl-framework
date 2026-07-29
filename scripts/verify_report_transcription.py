#!/usr/bin/env python3
"""Compare the HTML transcription source with the authoritative RDS PDF.

The comparison accounts for PDF page furniture, Markdown syntax, table cell
reflow and line-end hyphenation. It combines a global token-order similarity
check with exact narrative-sentence coverage and table-cell coverage.
"""

from __future__ import annotations

import argparse
import difflib
import hashlib
import re
import shutil
import subprocess
import tempfile
import unicodedata
from pathlib import Path


EXPECTED_PDF_SHA256 = (
    "49953014b1aaa815259bd46204a04cc59752c47c8625f25f7e6ac090a19556de"
)
EXPECTED_PAGES = 29
MINIMUM_TOKEN_SIMILARITY = 0.99


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def extract_pdf(pdf: Path, pdftotext: str) -> list[str]:
    with tempfile.TemporaryDirectory() as temporary_directory:
        target = Path(temporary_directory) / "report.txt"
        subprocess.run(
            [pdftotext, str(pdf), str(target)],
            check=True,
            capture_output=True,
            text=True,
        )
        pages = target.read_text(encoding="utf-8").split("\f")
    if pages and not pages[-1].strip():
        pages.pop()
    return pages


def strip_front_matter(markdown: str) -> str:
    match = re.match(r"\A---\n.*?\n---\n", markdown, flags=re.DOTALL)
    if not match:
        raise ValueError("Report page front matter is missing")
    return markdown[match.end() :]


def remove_page_furniture(text: str) -> str:
    lines = text.splitlines()
    nonempty = [index for index, line in enumerate(lines) if line.strip()]
    footer_indexes = set(nonempty[-3:])
    cleaned = []
    for index, line in enumerate(lines):
        if line.strip() == "OFFICIAL":
            continue
        if index in footer_indexes and re.fullmatch(r"\s*\d+\s*", line):
            continue
        cleaned.append(line)
    return "\n".join(cleaned)


def normalise_tight(text: str) -> str:
    return "".join(
        character
        for character in unicodedata.normalize("NFKD", text).casefold()
        if character.isalnum()
    )


def word_tokens(text: str) -> list[str]:
    return re.findall(
        r"[a-z0-9]+(?:[’'][a-z0-9]+)?",
        unicodedata.normalize("NFKC", text).casefold(),
    )


def strip_markdown_links(text: str) -> str:
    """Remove navigational URLs while retaining their source-locked labels."""
    return re.sub(r"\[([^\]]+)\]\(https://[^)]+\)", r"\1", text)


def normalise_markdown_for_tokens(text: str) -> list[str]:
    text = strip_markdown_links(text)
    text = re.sub(
        r"^\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?$",
        " ",
        text,
        flags=re.MULTILINE,
    )
    text = re.sub(r"^#{1,6}\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"^>\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"^[-*+]\s+", "", text, flags=re.MULTILINE)
    text = text.replace("|", " ").replace("**", "").replace("`", "")
    return word_tokens(text.replace("✔", ""))


def narrative_sentences(markdown: str) -> list[str]:
    sentences: list[str] = []
    for line in markdown.splitlines():
        candidate = line.strip()
        if (
            not candidate
            or candidate == "---"
            or candidate.startswith("#")
            or candidate.startswith("|")
        ):
            continue
        candidate = re.sub(r"^>\s*", "", candidate)
        candidate = re.sub(r"^[-*+]\s+", "", candidate)
        candidate = re.sub(r"^\d+\.\s+", "", candidate)
        candidate = strip_markdown_links(candidate)
        candidate = candidate.replace("**", "").replace("`", "")
        for sentence in re.split(r"(?<=[.!?])\s+", candidate):
            if len(normalise_tight(sentence)) >= 30:
                sentences.append(sentence)
    return sentences


def table_cells(markdown: str) -> list[str]:
    cells: list[str] = []
    for line in markdown.splitlines():
        if not line.startswith("|") or re.fullmatch(r"\|?[\s:|-]+\|?", line):
            continue
        for cell in line.strip("|").split("|"):
            cell = strip_markdown_links(cell.strip())
            if word_tokens(cell):
                cells.append(cell)
    return cells


def is_bounded_subsequence(query: list[str], source: list[str]) -> bool:
    if not query:
        return True
    maximum_span = max(len(query) * 5, 30)
    for start, token in enumerate(source):
        if token != query[0]:
            continue
        position = start
        end = min(len(source), start + maximum_span)
        for expected in query[1:]:
            try:
                position = source.index(expected, position + 1, end)
            except ValueError:
                break
        else:
            return True
    return False


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("markdown", type=Path)
    parser.add_argument("--pdftotext", default=shutil.which("pdftotext"))
    args = parser.parse_args()

    if not args.pdftotext:
        raise SystemExit("pdftotext was not found; pass --pdftotext /path/to/pdftotext")

    actual_sha256 = sha256(args.pdf)
    if actual_sha256 != EXPECTED_PDF_SHA256:
        raise SystemExit(
            f"PDF checksum mismatch: expected {EXPECTED_PDF_SHA256}, got {actual_sha256}"
        )

    pages = extract_pdf(args.pdf, args.pdftotext)
    if len(pages) != EXPECTED_PAGES:
        raise SystemExit(f"PDF page-count mismatch: expected {EXPECTED_PAGES}, got {len(pages)}")

    # The Markdown transcription replaces the print contents pages with HTML
    # navigation. Compare document control (page 2) and report body (pages 5–29).
    selected_pages = pages[1:2] + pages[4:29]
    pdf_body = "\n".join(remove_page_furniture(page) for page in selected_pages)
    markdown = strip_front_matter(args.markdown.read_text(encoding="utf-8"))

    forbidden = ("Internal " + "working file", "." + "docx")
    leaked = [phrase for phrase in forbidden if phrase in markdown]
    if leaked:
        raise SystemExit(f"Internal conversion material leaked into page: {', '.join(leaked)}")

    pdf_tokens = word_tokens(pdf_body.replace("✔", ""))
    markdown_tokens = normalise_markdown_for_tokens(markdown)
    matcher = difflib.SequenceMatcher(
        None, pdf_tokens, markdown_tokens, autojunk=False
    )
    similarity = matcher.ratio()

    tight_pdf = normalise_tight(pdf_body)
    sentences = narrative_sentences(markdown)
    missing_sentences = [
        sentence
        for sentence in sentences
        if normalise_tight(sentence) not in tight_pdf
    ]

    cells = table_cells(markdown)
    missing_cells = []
    for cell in cells:
        if normalise_tight(cell) in tight_pdf:
            continue
        if not is_bounded_subsequence(word_tokens(cell), pdf_tokens):
            missing_cells.append(cell)

    print(f"PDF SHA-256: {actual_sha256}")
    print(f"PDF pages: {len(pages)}")
    print(
        f"Token similarity: {similarity:.6f} "
        f"({len(pdf_tokens)} PDF / {len(markdown_tokens)} Markdown tokens)"
    )
    print(f"Narrative sentences matched: {len(sentences) - len(missing_sentences)}/{len(sentences)}")
    print(f"Table cells matched: {len(cells) - len(missing_cells)}/{len(cells)}")

    failures = []
    if similarity < MINIMUM_TOKEN_SIMILARITY:
        failures.append(
            f"token similarity {similarity:.6f} is below {MINIMUM_TOKEN_SIMILARITY:.2f}"
        )
    if missing_sentences:
        failures.append(f"{len(missing_sentences)} narrative sentence(s) missing")
    if missing_cells:
        failures.append(f"{len(missing_cells)} table cell(s) missing")
    if failures:
        for sentence in missing_sentences:
            print(f"MISSING SENTENCE: {sentence}")
        for cell in missing_cells:
            print(f"MISSING TABLE CELL: {cell}")
        raise SystemExit("Transcription verification failed: " + "; ".join(failures))


if __name__ == "__main__":
    main()
