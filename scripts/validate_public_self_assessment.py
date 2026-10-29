#!/usr/bin/env python3
"""Check the narrow static public-test source tree without services or private inputs.

Run against the stripped release checkout, for example with --root <checkout>.
The development checkout deliberately fails if it still contains planning pages.
This checks release inputs; browser behavior and the deployed URL need separate checks.
"""

import argparse
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit


CATALOGUE = "data/hdrl-indicators-v1.json"
GUIDANCE = "data/hdrl-assessment-content-v0.2.0.json"
CONFIG = "data/hdrl-assessment-beta-config-v0.3.0.json"
PINS = {
    CATALOGUE: "442a10be23a0ddec889785577fb8853db2296cc5b3a50929849025e27077cd47",
    GUIDANCE: "1118cb773ca4ecc2bff06d2612d14b756134bda04603c43dd18604f4df36f92f",
}
PAGES = {"index.md", "test-privacy.md"}
VERSIONS = {
    "framework": "1.0.1", "catalogue": "1.0.2", "tool": "0.5.0-beta",
    "guidance": "0.2.0", "rules": "0.2.0", "report": "0.4.0", "beta": "0.3.0",
}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def frontmatter(source, name):
    match = re.match(r"\A---\s*\n(.*?)\n---(?:\s*\n|$)", source, re.S)
    require(match is not None, f"{name}: page metadata is missing")
    return match.group(1)


def local_link_exists(docs, page, link):
    """Check simple source-page links; MkDocs checks rendered links separately."""
    parsed = urlsplit(link)
    if parsed.scheme or parsed.netloc or not parsed.path:
        return True
    path = unquote(parsed.path)
    target = docs / path.lstrip("/") if path.startswith("/") else page.parent / path
    if target.is_file():
        return True
    return (target / "index.md").is_file() or target.with_suffix(".md").is_file()


def validate(root):
    docs = root / "docs"
    page_dir = docs / "self-assessment"
    actual = {p.relative_to(page_dir).as_posix() for p in page_dir.rglob("*") if p.is_file()}
    require(actual == PAGES,
            "Public self-assessment directory must contain only index.md and test-privacy.md; "
            f"unexpected={sorted(actual - PAGES)}, missing={sorted(PAGES - actual)}")

    for relative, expected in PINS.items():
        actual_hash = hashlib.sha256((docs / relative).read_bytes()).hexdigest()
        require(actual_hash == expected, f"Current-method pin changed: {relative}")

    config = json.loads((docs / CONFIG).read_text(encoding="utf-8"))
    transport = config.get("transport", {})
    flags = config.get("feature_flags", {})
    require(flags.get("public_test_mode") is True, "Public test mode must be explicitly enabled")
    for key in ("remote_collection_enabled", "local_preview_enabled"):
        require(transport.get(key) is False, f"transport.{key} must be false")
    require("supabase_publishable_key" in transport and transport["supabase_publishable_key"] is None,
            "The public test must not contain a publishable service key")
    require(config.get("plausible", {}).get("enabled") is False, "Plausible must be disabled")
    for key in ("local_beta_events", "feedback_checkpoint", "contactable_feedback",
                "feedback_without_contact_details", "email_verification",
                "remote_result_sharing", "benchmarking"):
        require(flags.get(key) is False, f"feature_flags.{key} must be false")

    pages = {}
    for name in sorted(PAGES):
        page = page_dir / name
        source = page.read_text(encoding="utf-8")
        pages[name] = source
        metadata = frontmatter(source, name)
        require(re.search(r"^analytics:\s*false\s*$", metadata, re.M),
                f"{name}: analytics must be false")
        robots = re.search(r"^robots:\s*(.+)$", metadata, re.M)
        require(robots and {"noindex", "nofollow"} <=
                {part.strip() for part in robots.group(1).split(",")},
                f"{name}: noindex, nofollow metadata is required")
        links = re.findall(r"\[[^\]]*\]\(<?([^\s)>]+)>?(?:\s+\"[^\"]*\")?\)", source)
        links += re.findall(r"href=[\"']([^\"']+)[\"']", source)
        for link in links:
            require(local_link_exists(docs, page, link), f"{name}: unresolved local link {link}")

    index = pages["index.md"]
    require("test-privacy.md" in index or "test-privacy/" in index,
            "Public test page must link to its test privacy information")
    for attribute, relative in (("catalogue", CATALOGUE), ("content", GUIDANCE), ("beta-config", CONFIG)):
        match = re.search(rf"data-{attribute}-url=[\"']([^\"']+)[\"']", index)
        require(match is not None, f"Public test page lacks data-{attribute}-url")
        resolved = urlsplit(urljoin("https://public-test.invalid/self-assessment/", match.group(1)))
        require(resolved.scheme == "https" and resolved.netloc == "public-test.invalid"
                and resolved.path == "/" + relative and not resolved.query and not resolved.fragment,
                f"Unexpected data-{attribute}-url: {resolved.geturl()}")

    app_path = "assets/js/self-assessment.js"
    css_path = "assets/css/self-assessment.css"
    portability_path = "assets/js/self-assessment-portability.js"
    app = (docs / app_path).read_text(encoding="utf-8")
    require((docs / css_path).is_file() and (docs / css_path).stat().st_size > 0,
            "Self-assessment stylesheet is missing or empty")
    version_block = re.search(r"const VERSIONS\s*=\s*\{(.*?)\};", app, re.S)
    require(version_block is not None, "Application method versions are missing")
    for key, version in VERSIONS.items():
        require(re.search(rf'\b{key}:\s*"{re.escape(version)}"', version_block.group(1)),
                f"Application {key} version changed")
    for constant, relative in (("CATALOGUE_SHA256", CATALOGUE), ("GUIDANCE_SHA256", GUIDANCE)):
        require(re.search(rf'const {constant}\s*=\s*"{PINS[relative]}";', app),
                f"Application {constant} does not match the pinned method")
    require("public_test_mode" in app, "Application does not recognise the public test mode")
    mkdocs = (root / "mkdocs.yml").read_text(encoding="utf-8")
    for entry in (app_path, css_path, portability_path, "self-assessment/index.md"):
        require(entry in mkdocs, f"MkDocs is missing {entry}")
    require((docs / portability_path).is_file()
            and mkdocs.index(portability_path) < mkdocs.index(app_path),
            "Local restore validator must load before the application")
    portability = (docs / portability_path).read_text(encoding="utf-8")
    require("fetch(" not in portability and "XMLHttpRequest" not in portability,
            "Restore validation must not fetch imported references")
    template = (root / "overrides/main.html").read_text(encoding="utf-8")
    require("page.meta.analytics == false" in template and "page.meta.robots" in template,
            "Page template must honour analytics and robots metadata")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1],
                        help="Stripped public-release repository root")
    args = parser.parse_args()
    try:
        validate(args.root.resolve())
    except (OSError, ValueError, TypeError, AttributeError) as exc:
        parser.exit(1, f"Public self-assessment source check failed: {exc}\n")
    print("Public self-assessment source check passed: unchanged method pins; two public pages; "
          "service, analytics, local event log, contact and feedback flags disabled.")
    print("This is a static source check, not deployed-site or browser verification.")


if __name__ == "__main__":
    main()
