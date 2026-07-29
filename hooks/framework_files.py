"""Publish the canonical HDRL method source with the built website."""

from __future__ import annotations

import shutil
from pathlib import Path


SOURCE_PATH = (
    Path("reference")
    / "frozen-applied-v1"
    / "Health Data Readiness Level Framework V1.md"
)
DOWNLOAD_PATH = Path("downloads") / "health-data-readiness-level-framework-v1.md"


def on_post_build(config) -> None:
    """Copy the exact canonical source into the deployable site."""

    repository_root = Path(config["config_file_path"]).resolve().parent
    source = repository_root / SOURCE_PATH
    target = Path(config["site_dir"]) / DOWNLOAD_PATH
    if not source.is_file():
        raise FileNotFoundError(f"Canonical framework source is missing: {source}")

    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, target)
