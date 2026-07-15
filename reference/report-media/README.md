# Optional report-media metadata

The accessible report template can display approved audio, video and infographic supplements without adding an empty placeholder to the public page. Configure items in the `report_media` list in `docs/explore-report.md`; only entries with `status: published` are rendered.

These supplements are not part of the Final Report. They must be derived only from the published RDS PDF, reviewed for factual fidelity and accessibility, and approved for publication before their status changes to `published`. Do not use unpublished assessments, evidence packs, working drafts or other project material.

Run the metadata check before building:

```console
python scripts/validate_report_media.py docs/explore-report.md
```

## Audio example

```yaml
report_media:
  - id: overview-audio
    type: audio
    status: draft
    title: Audio overview
    description: A clearly labelled AI-assisted audio rendering derived from the published report.
    url: /assets/report-media/overview.mp3
    mime_type: audio/mpeg
    transcript_url: /assets/report-media/overview-transcript/
    tool: NotebookLM
    reviewed_by: Reviewer name
    reviewed_on: 2026-07-15
```

## Video example

Video entries additionally require `captions_url`. An optional `poster_url` may be supplied.

```yaml
  - id: overview-video
    type: video
    status: draft
    title: Video overview
    description: A clearly labelled AI-assisted video rendering derived from the published report.
    url: /assets/report-media/overview.mp4
    mime_type: video/mp4
    captions_url: /assets/report-media/overview-captions.vtt
    transcript_url: /assets/report-media/overview-video-transcript/
    poster_url: /assets/report-media/overview-video-poster.webp
    tool: NotebookLM
    reviewed_by: Reviewer name
    reviewed_on: 2026-07-15
```

## Infographic example

Infographics require concise alternative text plus a detailed text description.

```yaml
  - id: report-infographic
    type: infographic
    status: draft
    title: Report infographic
    description: A clearly labelled AI-assisted visual overview derived from the published report.
    image_url: /assets/report-media/report-infographic.webp
    alt: Concise description of the infographic's purpose and principal structure.
    long_description_url: /assets/report-media/report-infographic-description/
    tool: NotebookLM
    reviewed_by: Reviewer name
    reviewed_on: 2026-07-15
```
