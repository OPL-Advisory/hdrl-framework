#!/usr/bin/env python3
"""Validate optional report-media metadata in explore-report.md."""

from __future__ import annotations

import argparse
import re
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

import yaml


ALLOWED_TYPES = {"audio", "video", "infographic"}
ALLOWED_STATUSES = {"draft", "published"}
COMMON_REQUIRED = {
    "id",
    "type",
    "status",
    "title",
    "description",
    "tool",
}
PUBLISHED_REQUIRED = {"reviewed_by", "reviewed_on"}
TYPE_REQUIRED = {
    "audio": {"url", "mime_type", "transcript_url"},
    "video": {"url", "mime_type", "captions_url", "transcript_url"},
    "infographic": {"image_url", "alt", "long_description_url"},
}


def load_front_matter(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    match = re.match(r"\A---\n(.*?)\n---\n", text, flags=re.DOTALL)
    if not match:
        raise ValueError("YAML front matter is missing or malformed")
    metadata = yaml.safe_load(match.group(1))
    if not isinstance(metadata, dict):
        raise ValueError("YAML front matter must be a mapping")
    return metadata


def validate_url(value: object, field: str) -> None:
    if not isinstance(value, str) or not value:
        raise ValueError(f"{field} must be a non-empty URL")
    parsed = urlparse(value)
    if parsed.scheme == "https" and parsed.netloc:
        return
    if value.startswith("/assets/report-media/"):
        return
    raise ValueError(
        f"{field} must be an HTTPS URL or a root-relative /assets/report-media/ path"
    )


def validate_item(item: object, index: int) -> None:
    if not isinstance(item, dict):
        raise ValueError(f"report_media[{index}] must be a mapping")

    media_type = item.get("type")
    if media_type not in ALLOWED_TYPES:
        raise ValueError(f"report_media[{index}].type must be one of {sorted(ALLOWED_TYPES)}")
    if item.get("status") not in ALLOWED_STATUSES:
        raise ValueError(
            f"report_media[{index}].status must be one of {sorted(ALLOWED_STATUSES)}"
        )

    required = COMMON_REQUIRED | TYPE_REQUIRED[media_type]
    if item.get("status") == "published":
        required |= PUBLISHED_REQUIRED
    missing = sorted(required - item.keys())
    if missing:
        raise ValueError(f"report_media[{index}] is missing: {', '.join(missing)}")

    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", str(item["id"])):
        raise ValueError(f"report_media[{index}].id must be a lowercase slug")

    for field in {"title", "description", "tool"} | (
        PUBLISHED_REQUIRED if item.get("status") == "published" else set()
    ):
        value = item.get(field)
        if field == "reviewed_on" and isinstance(value, date):
            continue
        if not isinstance(value, str) or not value.strip():
            raise ValueError(f"report_media[{index}].{field} must be non-empty")

    reviewed_on = item.get("reviewed_on")
    if isinstance(reviewed_on, str) and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", reviewed_on):
        raise ValueError(f"report_media[{index}].reviewed_on must be YYYY-MM-DD")

    for field in TYPE_REQUIRED[media_type]:
        if field.endswith("url") or field in {"url", "image_url"}:
            validate_url(item[field], f"report_media[{index}].{field}")
    if item.get("poster_url"):
        validate_url(item["poster_url"], f"report_media[{index}].poster_url")

    mime_type = item.get("mime_type")
    if media_type in {"audio", "video"} and not str(mime_type).startswith(
        f"{media_type}/"
    ):
        raise ValueError(
            f"report_media[{index}].mime_type must start with {media_type}/"
        )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("page", type=Path)
    args = parser.parse_args()

    metadata = load_front_matter(args.page)
    media = metadata.get("report_media")
    if not isinstance(media, list):
        raise SystemExit("report_media must be a list")
    for index, item in enumerate(media):
        validate_item(item, index)
    identifiers = [item["id"] for item in media]
    if len(identifiers) != len(set(identifiers)):
        raise SystemExit("report_media ids must be unique")
    print(f"Validated {len(media)} report media item(s)")


if __name__ == "__main__":
    main()
