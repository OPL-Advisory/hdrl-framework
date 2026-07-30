import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TMP_DIR = path.join(ROOT_DIR, ".tmp", "hdrl-presentation-kit");
const FINAL_PPTX = path.join(ROOT_DIR, "docs", "downloads", "HDRL-Presentation-Kit-v1.1.0.pptx");
const HARDENER_PATH = path.join(ROOT_DIR, "scripts", "harden_presentation_kit.py");
const RENDER_DIR = path.join(TMP_DIR, "final-render");
const LAYOUT_DIR = path.join(TMP_DIR, "final-layout");
const CATALOGUE_PATH = path.join(ROOT_DIR, "docs", "data", "hdrl-indicators-v1.json");
const catalogue = JSON.parse(await fs.readFile(CATALOGUE_PATH, "utf-8"));
const FRAMEWORK_VERSION = catalogue.framework.version;
const CATALOGUE_VERSION = catalogue.catalogue_version;
const KIT_VERSION = "1.1.0";
const KIT_DATE = "30 July 2026";
const KIT_DATE_SHORT = "30 Jul 2026";
const SOURCE_HASH_SHORT = catalogue.source.sha256.slice(0, 12);
const execFileAsync = promisify(execFile);

const C = {
  navy: "#17395B",
  navy2: "#102E4A",
  teal: "#0F766E",
  teal2: "#0D9488",
  tealDark: "#115E59",
  mint: "#D8F3EE",
  mint2: "#A7E6DB",
  blue: "#3B82F6",
  bluePale: "#EAF2FF",
  ink: "#162B45",
  slate: "#5F7187",
  pale: "#F5F8FA",
  border: "#D5E3E3",
  white: "#FFFFFF",
  black: "#0B1726",
  amber: "#F59E0B",
  red: "#E94B66",
  green: "#10B981",
  violet: "#8B5CF6",
};

const DOMAIN_COLORS = [
  "#3B82F6",
  "#06B6D4",
  "#6366F1",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#F43F5E",
  "#64748B",
];

const URL = {
  home: "https://hdrlframework.org/",
  overview: "https://hdrlframework.org/framework/overview/",
  apply: "https://hdrlframework.org/framework/using-the-framework/",
  method: "https://hdrlframework.org/framework/methodology/",
  levels: "https://hdrlframework.org/framework/maturity-levels/",
  classification: "https://hdrlframework.org/framework/classification/",
  foundations: "https://hdrlframework.org/framework/foundational-requirements/",
  about: "https://hdrlframework.org/about/",
  paper: "https://www.medrxiv.org/content/10.64898/2026.07.23.26358713v1",
  doi: "https://doi.org/10.64898/2026.07.23.26358713",
  rds: "https://www.researchdata.scot/news-and-insights/new-independent-assessment-highlights-devolved-nations-leading-role-in-health-data-research/",
  satre: "https://satre-specification.readthedocs.io/en/stable/",
  licence: "https://creativecommons.org/licenses/by/4.0/",
  feedback: "https://docs.google.com/forms/d/e/1FAIpQLSdrcE7zwWvJ0Pu1klaKF1oAJA7lSyyMFnZp7BIJ6zSGJyk_NA/viewform",
  catalogue: "https://hdrlframework.org/data/hdrl-indicators-v1.json",
};

const UNIT_LABELS = {
  S: "System",
  V: "Service",
  B: "Both",
};

const DOMAIN_CONFIG = {
  A: {
    question: "Are the required data available, linked and current?",
    url: "https://hdrlframework.org/domains/a-data-coverage/",
  },
  B: {
    question: "Can researchers understand, assess and reuse the data consistently?",
    url: "https://hdrlframework.org/domains/b-data-semantics/",
  },
  C: {
    question: "Can safe, lawful research be approved and delivered efficiently?",
    url: "https://hdrlframework.org/domains/c-governance-access/",
  },
  D: {
    question: "Is the service supporting real research use and reproducible delivery?",
    url: "https://hdrlframework.org/domains/d-research-integration/",
  },
  E: {
    question: "Are transparency, public benefit and meaningful involvement built in?",
    url: "https://hdrlframework.org/domains/e-public-trust/",
  },
  F: {
    question: "Can the service sustain its people, platform and governance over time?",
    url: "https://hdrlframework.org/domains/f-sustainability/",
  },
  G: {
    question: "Are sufficient skills, capacity and service culture in place?",
    url: "https://hdrlframework.org/domains/g-workforce-culture/",
  },
  H: {
    question: "Is the environment secure, resilient and scalable?",
    url: "https://hdrlframework.org/domains/h-infrastructure/",
  },
};

const presentation = Presentation.create({
  slideSize: { width: 1280, height: 720 },
});

function addShape(slide, geometry, x, y, w, h, fill, lineFill = "none", lineWidth = 0, name = undefined) {
  return slide.shapes.add({
    geometry,
    ...(name ? { name } : {}),
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: "solid", fill: lineFill, width: lineWidth },
  });
}

function addText(slide, text, x, y, w, h, {
  size = 24,
  color = C.ink,
  bold = false,
  italic = false,
  align = "left",
  valign = "top",
  font = "Calibri",
  margin = 0,
  name = undefined,
} = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    ...(name ? { name } : {}),
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    fontSize: size,
    typeface: font,
    color,
    bold,
    italic,
    alignment: align,
    verticalAlignment: valign,
    autoFit: "none",
    wrap: "square",
    insets: { top: margin, right: margin, bottom: margin, left: margin },
  };
  return shape;
}

function addLink(shape, visibleText, uri) {
  shape.text.get(visibleText).link = { uri, isExternal: true };
  return shape;
}

function addLine(slide, x, y, w, h, color = C.border, width = 2) {
  return slide.shapes.add({
    geometry: "line",
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { style: "solid", fill: color, width },
  });
}

function addMiniBrand(slide, { dark = false, label = "HEALTH DATA READINESS LEVEL FRAMEWORK" } = {}) {
  const fg = dark ? C.white : C.teal;
  const oct = addShape(slide, "octagon", 58, 38, 54, 54, dark ? C.white : C.teal, "none", 0, "hdrl-mini-mark");
  addText(slide, "HDRL", 61, 53, 50, 22, {
    size: 10,
    color: dark ? C.teal : C.white,
    bold: true,
    align: "center",
    valign: "middle",
    name: "hdrl-mini-text",
  });
  addText(slide, label, 132, 52, 480, 20, {
    size: 16,
    color: fg,
    bold: true,
    valign: "middle",
    name: "brand-label",
  });
  return oct;
}

function addFooter(slide, pageNumber, { dark = false } = {}) {
  const lineColor = dark ? "#6F879B" : C.border;
  const textColor = dark ? "#B9CBD9" : C.slate;
  addLine(slide, 58, 674, 1164, 0, lineColor, 1);
  addText(
    slide,
    `HDRL v${FRAMEWORK_VERSION}  •  Kit v${KIT_VERSION}  •  ${KIT_DATE_SHORT}`,
    58,
    682,
    310,
    20,
    { size: 12, color: textColor, valign: "middle" },
  );
  const credit = addText(
    slide,
    "RDS: commissioner & IP owner  •  OPL Advisory: originator & developer  •  CC BY 4.0",
    370,
    682,
    640,
    20,
    { size: 11, color: textColor, align: "center", valign: "middle" },
  );
  addLink(credit, "CC BY 4.0", URL.licence);
  const site = addText(slide, `hdrlframework.org  •  ${pageNumber}`, 950, 682, 272, 20, {
    size: 12,
    color: textColor,
    align: "right",
    valign: "middle",
  });
  addLink(site, "hdrlframework.org", URL.home);
}

function addTitle(slide, title, subtitle = null, { dark = false, y = 116 } = {}) {
  addText(slide, title, 70, y, 1140, 104, {
    size: 49,
    color: dark ? C.white : C.ink,
    bold: true,
    name: "slide-title",
  });
  if (subtitle) {
    addText(slide, subtitle, 72, y + 110, 1040, 52, {
      size: 23,
      color: dark ? "#CBE3EA" : C.slate,
      name: "slide-subtitle",
    });
  }
}

function setNotes(slide, talkTrack, sources, route = "Use when relevant to the audience and discussion.") {
  const notes = [
    `Presenter guidance: ${talkTrack}`,
    `Suggested use: ${route}`,
    "",
    "[Sources]",
    ...sources.map((source) => `- ${source}`),
    "[/Sources]",
  ].join("\n");
  slide.speakerNotes.textFrame.setText(notes);
  slide.speakerNotes.setVisible(true);
}

function addBullet(slide, text, x, y, w, {
  size = 23,
  color = C.ink,
  bulletColor = C.teal,
  lineHeight = 42,
} = {}) {
  addShape(slide, "ellipse", x, y + 10, 10, 10, bulletColor);
  return addText(slide, text, x + 26, y, w - 26, lineHeight, { size, color });
}

function addLargeNumber(slide, value, label, x, y, color = C.teal) {
  addText(slide, value, x, y, 260, 96, { size: 80, color, bold: true });
  addText(slide, label, x + 4, y + 92, 340, 40, { size: 26, color: C.ink, bold: true });
}

function addDomainIndicatorSlide(domain, indicators, pageNumber) {
  const slide = presentation.slides.add();
  const config = DOMAIN_CONFIG[domain.ref];
  const color = DOMAIN_COLORS[domain.ref.charCodeAt(0) - 65];
  const coreCount = indicators.filter((indicator) => indicator.type === "Core").length;
  const enhancementCount = indicators.length - coreCount;
  const hasFoundational = indicators.some((indicator) => indicator.foundational);

  slide.background.fill = C.white;
  addMiniBrand(slide, { label: `DOMAIN ${domain.ref} • ALL INDICATORS` });
  addText(slide, `Domain ${domain.ref} · ${domain.name}`, 70, 116, 1140, 70, {
    size: 42,
    color: C.ink,
    bold: true,
    name: "slide-title",
  });
  addText(slide, config.question, 72, 190, 920, 36, {
    size: 23,
    color: C.slate,
  });
  addText(
    slide,
    `${indicators.length} indicators  •  ${coreCount} Core  •  ${enhancementCount} Enhancement`,
    72,
    232,
    620,
    30,
    { size: 19, color, bold: true },
  );

  const splitAt = Math.ceil(indicators.length / 2);
  const columns = [indicators.slice(0, splitAt), indicators.slice(splitAt)];
  columns.forEach((column, columnIndex) => {
    const x = 72 + columnIndex * 584;
    column.forEach((indicator, rowIndex) => {
      const y = 278 + rowIndex * 52;
      const ref = `${indicator.ref}${indicator.foundational ? "†" : ""}`;
      addText(slide, ref, x, y, 72, 26, { size: 17, color, bold: true });
      addText(slide, indicator.name, x + 76, y, 328, 42, {
        size: 18,
        color: C.ink,
        bold: true,
      });
      addText(
        slide,
        `${indicator.type === "Enhancement" ? "Enhancement" : "Core"} · ${UNIT_LABELS[indicator.unit]}`,
        x + 410,
        y + 2,
        150,
        32,
        { size: 14, color: C.slate, align: "right" },
      );
      if (rowIndex < column.length - 1) addLine(slide, x, y + 43, 560, 0, C.border, 1);
    });
  });

  const note = hasFoundational
    ? "Core and Enhancement are HDRL classifications—not official programme requirements.  † Proposed Foundational Indicator within HDRL."
    : "Core and Enhancement are HDRL classifications—not official programme requirements.";
  addText(slide, note, 72, 628, 1136, 28, {
    size: 14,
    color: C.slate,
    italic: true,
    align: "center",
  });
  addFooter(slide, pageNumber);
  setNotes(
    slide,
    `Use this slide to expose the full indicator structure for Domain ${domain.ref}. The classifications help organise the framework but do not create external participation requirements. It was generated for HDRL Presentation Kit v${KIT_VERSION} on ${KIT_DATE} from catalogue v${CATALOGUE_VERSION}; canonical source SHA-256: ${catalogue.source.sha256}. Indicators shown: ${indicators.map((indicator) => `${indicator.ref} ${indicator.name}`).join("; ")}.`,
    [config.url, URL.catalogue, URL.classification, ...(hasFoundational ? [URL.foundations] : [])],
    `Use as the contents slide for Domain ${domain.ref}; follow it with only the indicator-detail slides relevant to the audience.`,
  );
}

function addIndicatorDetailSlide(domain, indicator, pageNumber) {
  const slide = presentation.slides.add();
  const config = DOMAIN_CONFIG[domain.ref];
  const color = DOMAIN_COLORS[domain.ref.charCodeAt(0) - 65];
  const levelRefs = ["L1", "L2", "L3", "L4", "L5"];
  const levelNames = levelRefs.map((level) => catalogue.maturity_level_names[level]);

  slide.background.fill = C.pale;
  addMiniBrand(slide, { label: `DOMAIN ${domain.ref} • INDICATOR DETAIL` });
  addText(slide, `${indicator.ref} · ${indicator.name}`, 70, 116, 1140, 66, {
    size: 42,
    color: C.ink,
    bold: true,
    name: "slide-title",
  });
  addText(
    slide,
    `${indicator.type} indicator  •  ${UNIT_LABELS[indicator.unit]} level  •  HDRL class ${indicator.applicability_class}${indicator.foundational ? "  •  Proposed Foundational Indicator" : ""}`,
    72,
    186,
    1120,
    28,
    { size: 18, color, bold: true },
  );
  addText(slide, "The catalogue wording below is reproduced verbatim.", 72, 220, 1120, 30, {
    size: 18,
    color: C.slate,
    italic: true,
  });

  addLine(slide, 150, 278, 920, 0, C.mint2, 6);
  levelRefs.forEach((levelRef, index) => {
    const x = 58 + index * 230;
    addShape(slide, "ellipse", x + 70, 254, 48, 48, index === 4 ? color : C.white, color, 2);
    addText(slide, String(index + 1), x + 82, 266, 24, 24, {
      size: 20,
      color: index === 4 ? C.white : color,
      bold: true,
      align: "center",
      valign: "middle",
    });
    addText(slide, levelNames[index], x, 312, 188, 28, {
      size: 19,
      color: C.ink,
      bold: true,
      align: "center",
    });
    addText(slide, indicator.maturity_levels[levelRef], x, 346, 188, 180, {
      size: 16,
      color: C.slate,
      align: "center",
    });
  });

  addShape(slide, "roundRect", 72, 536, 1136, 110, C.white, C.border, 1);
  addText(slide, "Minimum evidence for a Level 4 judgement", 94, 546, 720, 28, {
    size: 21,
    color: C.tealDark,
    bold: true,
  });
  indicator.minimum_evidence.L4.forEach((evidence, index) => {
    const x = 94 + index * 372;
    addShape(slide, "ellipse", x, 586, 9, 9, color);
    addText(slide, evidence, x + 20, 578, 330, 62, {
      size: 16,
      color: C.ink,
    });
  });

  addText(
    slide,
    `Catalogue v${CATALOGUE_VERSION}  •  Source ${SOURCE_HASH_SHORT}  •  Verbatim descriptors and evidence  •  HDRL classifications are not official programme requirements.`,
    80,
    646,
    1120,
    18,
    { size: 12, color: C.slate, italic: true, align: "center" },
  );
  addFooter(slide, pageNumber);

  const fullDescriptors = ["L1", "L2", "L3", "L4", "L5"]
    .map((level) => `${level}: ${indicator.maturity_levels[level]}`)
    .join(" ");
  const fullEvidence = indicator.minimum_evidence.L4
    .map((item) => `- ${item}`)
    .join("\n");
  setNotes(
    slide,
    `This indicator-detail slide reproduces the canonical maturity descriptors and indicator-specific Level 4 minimum evidence verbatim from catalogue v${CATALOGUE_VERSION}. It was generated for HDRL Presentation Kit v${KIT_VERSION} on ${KIT_DATE}. Framework version: ${FRAMEWORK_VERSION}. Canonical source SHA-256: ${catalogue.source.sha256}.\n\nFull maturity descriptors:\n${fullDescriptors}\n\nIndicator-specific minimum evidence for Level 4:\n${fullEvidence}`,
    [config.url, URL.catalogue, URL.levels, URL.apply],
    `Select this slide when ${indicator.ref} is relevant to the audience. Invite challenge on both the descriptor progression and whether the evidence would support consistent scoring.`,
  );
}

// 1 — Presenter guide
{
  const slide = presentation.slides.add();
  slide.background.fill = C.pale;
  addMiniBrand(slide, { label: `PRESENTATION KIT • VERSION ${KIT_VERSION}` });
  addText(slide, "Use this deck your way", 70, 126, 720, 72, {
    size: 52,
    color: C.ink,
    bold: true,
    name: "slide-title",
  });
  addText(slide, "Select a route, remove this guide slide, and adapt the wording to your setting.", 72, 202, 980, 40, {
    size: 24,
    color: C.slate,
  });

  const routes = [
    ["5 minutes", "2 · 3 · 5 · 6 · 15 · 20", "A concise introduction and validation caveat"],
    ["10 minutes", "2–10 · 15 · 17 · 20", "A practical team briefing"],
    ["20 minutes", "2–17 · 20", "A seminar with method and context"],
    ["Workshop", "2–18 · 20", "A facilitated discussion using the prompts"],
    ["Domain / indicator", "6 · choose 21–92 · 15 · 20", "Reference / handout slides: present only one or two at a time"],
  ];
  routes.forEach((route, i) => {
    const y = 266 + i * 67;
    addText(slide, route[0], 74, y, 180, 32, { size: 21, color: C.teal, bold: true });
    addText(slide, route[1], 270, y, 300, 32, { size: 19, color: C.ink, bold: true });
    addText(slide, route[2], 588, y, 590, 32, { size: 19, color: C.slate });
    if (i < routes.length - 1) addLine(slide, 72, y + 46, 1100, 0, C.border, 1);
  });

  addShape(slide, "roundRect", 70, 614, 1110, 42, C.white, C.border, 1);
  addText(
    slide,
    "Reuse under CC BY 4.0. Retain the credit footer, link to the licence and identify any changes.",
    92,
    624,
    1064,
    24,
    { size: 17, color: C.slate, align: "center", valign: "middle" },
  );
  addFooter(slide, 1);
  setNotes(
    slide,
    "This slide is for presenters. Delete it before delivering the presentation. Individual slides can be copied into another template if the attribution is retained.",
    [URL.about, URL.licence],
    "Start here when preparing a presentation; do not present this slide to an external audience.",
  );
}

// 2 — Title
{
  const slide = presentation.slides.add();
  slide.background.fill = C.teal;
  addShape(slide, "rect", 940, 0, 340, 720, C.blue);
  addText(slide, "HEALTH DATA READINESS LEVEL FRAMEWORK", 74, 72, 680, 30, {
    size: 19,
    color: C.mint2,
    bold: true,
    name: "title-eyebrow",
  });
  addText(slide, "Make readiness for\nhealth data research\nvisible", 74, 174, 730, 254, {
    size: 67,
    color: C.white,
    bold: true,
    name: "slide-title",
  });
  addLine(slide, 74, 468, 690, 0, C.mint2, 3);
  addText(slide, "An open, evidence-informed maturity framework for trusted, federated health data research.", 76, 496, 720, 76, {
    size: 27,
    color: C.white,
  });
  addShape(slide, "octagon", 1002, 170, 214, 214, "none", C.white, 4);
  addShape(slide, "ellipse", 1044, 212, 130, 130, "none", C.mint2, 3);
  addText(slide, "HDRL", 1038, 250, 142, 54, {
    size: 34,
    color: C.white,
    bold: true,
    align: "center",
    valign: "middle",
  });
  addText(slide, "8 domains  •  64 indicators\n5 maturity levels", 968, 448, 284, 80, {
    size: 23,
    color: C.white,
    bold: true,
    align: "center",
  });
  addText(slide, `HDRL v${FRAMEWORK_VERSION}  •  Presentation Kit v${KIT_VERSION}  •  ${KIT_DATE}`, 76, 650, 680, 24, {
    size: 16,
    color: C.mint2,
  });
  const titleCredit = addText(
    slide,
    "RDS: commissioner & IP owner  •  OPL Advisory: originator & developer  •  CC BY 4.0",
    742,
    646,
    496,
    34,
    { size: 11, color: C.white, align: "right", valign: "middle" },
  );
  addLink(titleCredit, "CC BY 4.0", URL.licence);
  setNotes(
    slide,
    "Introduce HDRL as an open candidate framework for assessing system and service readiness. State at the outset that the framework is evidence-informed and formatively applied; further independent validation is required.",
    [URL.home, URL.about, URL.paper],
    "Use in every route.",
  );
}

// 3 — Thesis
{
  const slide = presentation.slides.add();
  slide.background.fill = C.navy;
  addMiniBrand(slide, { dark: true });
  addText(slide, "A secure platform is not yet a\nresearch-ready system.", 72, 144, 890, 154, {
    size: 55,
    color: C.white,
    bold: true,
    name: "slide-title",
  });
  addLine(slide, 74, 344, 760, 0, C.mint2, 3);
  addText(
    slide,
    "Readiness also depends on available and usable data, lawful access, research delivery, public legitimacy, sustainable funding and skilled people.",
    76,
    380,
    840,
    114,
    { size: 27, color: "#D9E8F1" },
  );
  addShape(slide, "octagon", 982, 154, 184, 184, "none", C.mint2, 4);
  const ringSizes = [142, 104, 66];
  ringSizes.forEach((s) => addShape(slide, "ellipse", 1074 - s / 2, 246 - s / 2, s, s, "none", "#7DD7CC", 2));
  addText(slide, "WHOLE\nSYSTEM", 1014, 215, 120, 62, {
    size: 22,
    color: C.white,
    bold: true,
    align: "center",
    valign: "middle",
  });
  addFooter(slide, 3, { dark: true });
  setNotes(
    slide,
    "Use the central proposition to widen the conversation beyond secure technology. A trusted environment is essential, but it sits inside a larger sociotechnical delivery system.",
    [URL.home, URL.overview],
    "Use in every route; it is the clearest opening thesis.",
  );
}

// 4 — Missing middle
{
  const slide = presentation.slides.add();
  slide.background.fill = C.white;
  addMiniBrand(slide);
  addTitle(slide, "HDRL makes the “missing middle” assessable", "It connects principles and detailed specifications to an evidence-led improvement roadmap.");

  const y = 312;
  addShape(slide, "rightArrow", 366, y + 57, 88, 42, C.border, "none", 0);
  addShape(slide, "rightArrow", 824, y + 57, 88, 42, C.border, "none", 0);

  addShape(slide, "roundRect", 72, y, 286, 166, C.pale, C.border, 1);
  addText(slide, "Principles and values", 94, y + 18, 242, 60, { size: 24, color: C.ink, bold: true, align: "center" });
  addText(slide, "Trustworthy use\nPublic benefit\nFive Safes", 104, y + 88, 222, 66, { size: 19, color: C.slate, align: "center" });

  addShape(slide, "roundRect", 454, y - 18, 370, 202, C.teal, C.teal, 1);
  addText(slide, "HDRL", 484, y + 12, 310, 40, { size: 34, color: C.white, bold: true, align: "center" });
  addText(slide, "Evidence • maturity • dependencies\nimprovement priorities", 478, y + 72, 322, 72, { size: 24, color: C.white, align: "center" });

  addShape(slide, "roundRect", 912, y, 296, 166, C.bluePale, "#BBD2FF", 1);
  addText(slide, "Specifications and assurance", 934, y + 20, 250, 58, { size: 25, color: C.ink, bold: true, align: "center" });
  addText(slide, "TRE requirements\nSecurity standards\nProgramme rules", 946, y + 88, 226, 64, { size: 20, color: C.slate, align: "center" });

  addText(slide, "HDRL complements these layers; it does not replace them.", 72, 550, 1136, 42, {
    size: 26,
    color: C.teal,
    bold: true,
    align: "center",
  });
  addFooter(slide, 4);
  setNotes(
    slide,
    "Explain HDRL as a maturity and improvement layer. Avoid presenting the layers as a formal hierarchy or implying that technical specifications are narrow: SATRE 2.0, for example, spans governance, public involvement, operations and federation as well as technology.",
    [URL.home, URL.overview, URL.satre],
    "Useful when audiences ask how HDRL relates to existing principles, standards or specifications.",
  );
}

// 5 — Is and is not
{
  const slide = presentation.slides.add();
  slide.background.fill = C.white;
  addMiniBrand(slide);
  addTitle(slide, "HDRL is an improvement framework—\nnot a verdict");
  addLine(slide, 640, 252, 0, 332, C.border, 2);
  addText(slide, "HDRL IS", 74, 254, 500, 42, { size: 28, color: C.teal, bold: true });
  addText(slide, "HDRL IS NOT", 704, 254, 500, 42, { size: 28, color: C.red, bold: true });

  [
    "A structured maturity assessment",
    "A common language across system and service",
    "A way to separate capability, evidence and capacity gaps",
    "A basis for prioritising improvement",
  ].forEach((t, i) => addBullet(slide, t, 76, 322 + i * 62, 520, { size: 24 }));

  [
    "Accreditation or certification",
    "An official HDRS standard or participation decision",
    "A substitute for legal, ethical or security assurance",
    "A guarantee of research delivery or outcomes",
  ].forEach((t, i) => addBullet(slide, t, 706, 322 + i * 62, 500, { size: 24, bulletColor: C.red }));

  addFooter(slide, 5);
  setNotes(
    slide,
    "Set the boundary clearly. HDRL supports structured assessment, comparison and planning, but it should not be presented as an accreditation instrument, programme gate or guarantee.",
    [URL.overview, URL.apply, URL.about],
    "Use in every route, especially with governance, assurance or programme audiences.",
  );
}

// 6 — Eight domains
{
  const slide = presentation.slides.add();
  slide.background.fill = C.white;
  addMiniBrand(slide);
  addTitle(slide, "Readiness depends on eight conditions working together");

  const domains = [
    ["A", "Data coverage\n& federation"],
    ["B", "Data semantics\n& quality"],
    ["C", "Governance\n& access"],
    ["D", "Research integration\n& market use"],
    ["E", "Public trust\n& transparency"],
    ["F", "Sustainability"],
    ["G", "Workforce\n& culture"],
    ["H", "Infrastructure\n& compute"],
  ];
  domains.forEach((d, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = 72 + col * 292;
    const y = 270 + row * 150;
    addShape(slide, "ellipse", x, y + 14, 52, 52, DOMAIN_COLORS[i]);
    addText(slide, d[0], x + 7, y + 25, 38, 24, {
      size: 20,
      color: C.white,
      bold: true,
      align: "center",
      valign: "middle",
    });
    addText(slide, d[1], x + 70, y, 204, 80, {
      size: 23,
      color: C.ink,
      bold: true,
      valign: "middle",
    });
    addLine(slide, x + 70, y + 88, 204, 0, DOMAIN_COLORS[i], 3);
  });
  addShape(slide, "roundRect", 260, 572, 760, 52, C.pale, C.border, 1);
  addText(slide, "A weakness in one domain can constrain value from otherwise mature capability.", 282, 585, 716, 26, {
    size: 21,
    color: C.tealDark,
    bold: true,
    align: "center",
    valign: "middle",
  });
  addFooter(slide, 6);
  setNotes(
    slide,
    "Walk across the eight domains at headline level. The point is interdependence: readiness is not the average of isolated technical components.",
    [URL.home, URL.overview],
    "Use in every route.",
  );
}

// 7 — Indicator architecture
{
  const slide = presentation.slides.add();
  slide.background.fill = C.pale;
  addMiniBrand(slide);
  addTitle(slide, "Sixty-four indicators make the readiness picture actionable");
  addLargeNumber(slide, "64", "indicators", 76, 256);
  addText(slide, "Every indicator has:", 416, 258, 360, 34, { size: 26, color: C.ink, bold: true });

  const rows = [
    ["A unit", "System • service • dual level"],
    ["A role", "Core • Enhancement • Outcome/Context"],
    ["Five descriptors", "Initial → Optimising"],
    ["Evidence expectations", "Including indicator-specific minimum evidence"],
  ];
  rows.forEach((r, i) => {
    const y = 322 + i * 68;
    addText(slide, r[0], 420, y, 230, 34, { size: 23, color: C.teal, bold: true });
    addText(slide, r[1], 660, y, 530, 34, { size: 22, color: C.slate });
    if (i < rows.length - 1) addLine(slide, 420, y + 44, 760, 0, C.border, 1);
  });
  addShape(slide, "roundRect", 76, 514, 286, 94, C.white, C.border, 1);
  addText(slide, "5 proposed\nFoundational Indicators", 94, 530, 250, 58, {
    size: 22,
    color: C.red,
    bold: true,
    align: "center",
  });
  addText(slide, "Proposals within HDRL’s own logic—not official programme requirements.", 412, 602, 770, 28, {
    size: 17,
    color: C.slate,
    italic: true,
  });
  addFooter(slide, 7);
  setNotes(
    slide,
    "Explain that the 64 indicators are not a checklist to complete mechanically. Units, classifications, descriptors and evidence requirements help teams interpret each judgement in context. The five Foundational Indicators remain proposals within HDRL.",
    [URL.classification, URL.foundations, URL.apply],
    "Useful for audiences asking what sits beneath the eight-domain summary.",
  );
}

// 8 — Levels
{
  const slide = presentation.slides.add();
  slide.background.fill = C.white;
  addMiniBrand(slide);
  addText(slide, "Five levels describe\nincreasingly evidenced maturity", 70, 116, 1140, 136, {
    size: 46,
    color: C.ink,
    bold: true,
    name: "slide-title",
  });

  addLine(slide, 148, 394, 980, 0, C.mint2, 7);
  const levels = [
    ["1", "Initial", "Activity is\nemerging"],
    ["2", "Developing", "Plans and\npilots"],
    ["3", "Defined", "Documented\noperation"],
    ["4", "Managed", "Measured\nperformance"],
    ["5", "Optimising", "Benchmarking\nand learning"],
  ];
  levels.forEach((l, i) => {
    const x = 102 + i * 236;
    const active = i === 4;
    addShape(slide, "ellipse", x, 342, 106, 106, active ? C.teal : C.pale, C.teal, 3);
    addText(slide, l[0], x + 23, 368, 60, 48, {
      size: 34,
      color: active ? C.white : C.teal,
      bold: true,
      align: "center",
      valign: "middle",
    });
    addText(slide, l[1], x - 30, 468, 166, 36, {
      size: 23,
      color: C.ink,
      bold: true,
      align: "center",
    });
    addText(slide, l[2], x - 42, 512, 190, 58, {
      size: 19,
      color: C.slate,
      align: "center",
    });
  });
  addShape(slide, "roundRect", 164, 594, 952, 46, C.mint, "none", 0);
  addText(slide, "The purpose is not a league table: it is to reveal dependencies, evidence gaps and what to improve next.", 184, 604, 912, 26, {
    size: 19,
    color: C.tealDark,
    bold: true,
    align: "center",
    valign: "middle",
  });
  addFooter(slide, 8);
  setNotes(
    slide,
    "Describe the progression as ordered maturity, not a pass/fail scale. A higher level requires increasingly formal, measured and externally credible evidence.",
    [URL.levels, URL.apply],
    "Use when explaining how scoring works.",
  );
}

// 9 — Evidence
{
  const slide = presentation.slides.add();
  slide.background.fill = C.navy;
  addMiniBrand(slide, { dark: true });
  addTitle(slide, "Evidence is part of maturity", "A strong assertion is not the same as demonstrable performance.", { dark: true });

  const items = [
    ["CAPABILITY", "Does the function, resource or pathway exist?", C.blue],
    ["EVIDENCE", "Can documentation, metrics or assurance demonstrate it?", C.teal2],
    ["CAPACITY", "Can the capability operate at the required volume and pace?", C.amber],
  ];
  items.forEach((it, i) => {
    const y = 308 + i * 94;
    addText(slide, it[0], 88, y, 210, 34, { size: 23, color: it[2], bold: true });
    addLine(slide, 306, y + 18, 96, 0, it[2], 4);
    addText(slide, it[1], 430, y - 2, 740, 46, { size: 25, color: C.white });
  });
  addShape(slide, "roundRect", 82, 594, 1098, 52, "#234D6B", "#5D7890", 1);
  addText(slide, "Interpret these gaps separately—even when they contribute to the same maturity judgement.", 102, 606, 1058, 28, {
    size: 20,
    color: "#D8E8F1",
    align: "center",
    valign: "middle",
  });
  addFooter(slide, 9, { dark: true });
  setNotes(
    slide,
    "Use the three distinctions explicitly. A service can possess a capability but lack published evidence, or have the capability documented but lack operating headroom.",
    [URL.apply],
    "Use in practical or methodological briefings.",
  );
}

// 10 — Four stages
{
  const slide = presentation.slides.add();
  slide.background.fill = C.white;
  addMiniBrand(slide);
  addTitle(slide, "Apply HDRL as an evidence review and improvement cycle");

  // arrows first so they sit behind the nodes
  [302, 592, 882].forEach((x) => addShape(slide, "rightArrow", x, 378, 80, 40, C.mint2));
  const stages = [
    ["1", "Define the boundary", "System, service or dual level; organisations, capabilities and period in scope."],
    ["2", "Assemble evidence", "Collect auditable material before using testimony to explain gaps."],
    ["3", "Score descriptors", "Record evidence, rationale, uncertainty and applicability for each judgement."],
    ["4", "Calibrate and plan", "Invite factual correction and turn domain patterns into sequenced actions."],
  ];
  stages.forEach((s, i) => {
    const x = 72 + i * 290;
    addShape(slide, "ellipse", x + 82, 314, 72, 72, i === 3 ? C.teal : C.pale, C.teal, 3);
    addText(slide, s[0], x + 97, 330, 42, 38, {
      size: 28,
      color: i === 3 ? C.white : C.teal,
      bold: true,
      align: "center",
      valign: "middle",
    });
    addText(slide, s[1], x, 416, 236, 54, { size: 25, color: C.ink, bold: true, align: "center" });
    addText(slide, s[2], x, 486, 236, 108, { size: 19, color: C.slate, align: "center" });
  });
  addFooter(slide, 10);
  setNotes(
    slide,
    "Emphasise assessment discipline: define scope before scoring, privilege auditable evidence, record uncertainty and use calibration or Right of Reply to correct facts rather than negotiate scores.",
    [URL.apply],
    "Use when a team is considering a trial application.",
  );
}

// 11 — Units
{
  const slide = presentation.slides.add();
  slide.background.fill = C.pale;
  addMiniBrand(slide);
  addTitle(slide, "Choose the unit before interpreting the score");

  addShape(slide, "roundRect", 76, 286, 330, 266, C.white, C.border, 1);
  addText(slide, "SYSTEM", 104, 314, 274, 40, { size: 28, color: C.blue, bold: true, align: "center" });
  addText(slide, "Nation, region or health system", 108, 378, 266, 52, { size: 23, color: C.ink, bold: true, align: "center" });
  addText(slide, "Best for policy, shared infrastructure and system constraints.", 112, 454, 258, 74, { size: 20, color: C.slate, align: "center" });

  addShape(slide, "roundRect", 474, 286, 330, 266, C.white, C.border, 1);
  addText(slide, "SERVICE", 502, 314, 274, 40, { size: 28, color: C.teal, bold: true, align: "center" });
  addText(slide, "TRE, SDE or data service", 506, 378, 266, 52, { size: 23, color: C.ink, bold: true, align: "center" });
  addText(slide, "Best for operational capability and service improvement.", 510, 454, 258, 74, { size: 20, color: C.slate, align: "center" });

  addShape(slide, "roundRect", 872, 268, 330, 302, C.teal, C.teal, 1);
  addText(slide, "DUAL LEVEL", 900, 302, 274, 40, { size: 28, color: C.white, bold: true, align: "center" });
  addText(slide, "System context + service evidence", 904, 370, 266, 60, { size: 23, color: C.white, bold: true, align: "center" });
  addText(slide, "Separates shared constraints from local capability while keeping both evidence records explicit.", 908, 450, 258, 96, { size: 18, color: C.white, align: "center" });

  addText(slide, "State the boundary, date, evidence standard and aggregation convention whenever results are shared.", 84, 602, 1110, 38, {
    size: 21,
    color: C.tealDark,
    bold: true,
    align: "center",
  });
  addFooter(slide, 11);
  setNotes(
    slide,
    "Explain that the same label can mean different things if scope is not explicit. A dual-level assessment is valuable when national context and a named service need to be distinguished.",
    [URL.apply, URL.overview],
    "Use when agreeing assessment scope or comparing settings.",
  );
}

// 12 — Responsible interpretation
{
  const slide = presentation.slides.add();
  slide.background.fill = C.white;
  addMiniBrand(slide);
  addTitle(slide, "Use the result for a roadmap—not a single verdict");

  addText(slide, "AN ASSESSMENT CAN SUPPORT", 76, 266, 520, 34, { size: 24, color: C.teal, bold: true });
  addText(slide, "IT SHOULD NOT BE USED TO", 690, 266, 520, 34, { size: 24, color: C.red, bold: true });

  [
    "Build a shared view of strengths and constraints",
    "Compare maturity patterns across domains",
    "Prioritise policy, service, workforce and infrastructure actions",
    "Track documented progress over time",
  ].forEach((t, i) => addBullet(slide, t, 80, 330 + i * 62, 520, { size: 22 }));
  [
    "Collapse readiness into one overall score",
    "Rank organisations without scope and context",
    "Replace legal, ethical or security decisions",
    "Publish sensitive evidence without permission",
  ].forEach((t, i) => addBullet(slide, t, 694, 330 + i * 62, 500, { size: 22, bulletColor: C.red }));

  addFooter(slide, 12);
  setNotes(
    slide,
    "Frame the output as a pattern of strengths, dependencies and evidence gaps that informs action. Avoid league tables and avoid treating a level as proof of delivery performance.",
    [URL.apply, URL.about],
    "Use with leadership, governance or comparative-assessment audiences.",
  );
}

// 13 — Development
{
  const slide = presentation.slides.add();
  slide.background.fill = C.pale;
  addMiniBrand(slide);
  addTitle(slide, "HDRL combines evidence synthesis with first-principles design");
  addLargeNumber(slide, "56", "source frameworks", 74, 262);

  const strands = [
    ["Structured landscape review", "Three AI models searched and synthesised the landscape; retained claims were checked by a human reviewer against primary or authoritative sources."],
    ["First-principles analysis", "Necessary, enabling and excellence conditions were derived independently for trusted health-data research."],
    ["Stakeholder calibration", "The emerging model was refined through practical engagement and its first field application."],
  ];
  strands.forEach((s, i) => {
    const y = 266 + i * 108;
    addText(slide, `0${i + 1}`, 402, y, 60, 34, { size: 22, color: C.teal, bold: true });
    addText(slide, s[0], 474, y, 650, 34, { size: 25, color: C.ink, bold: true });
    addText(slide, s[1], 474, y + 42, 680, 64, { size: 18, color: C.slate });
  });
  addShape(slide, "roundRect", 76, 516, 282, 92, C.white, C.border, 1);
  addText(slide, "AI supported synthesis.\nIt was not a source of authority.", 94, 534, 246, 54, {
    size: 20,
    color: C.tealDark,
    bold: true,
    align: "center",
  });
  addFooter(slide, 13);
  setNotes(
    slide,
    "Describe the development approach accurately. The AI models widened search and made agreement visible, but framework-design decisions and source verification remained human responsibilities.",
    [URL.method, URL.paper],
    "Use in academic, methodological or governance discussions.",
  );
}

// 14 — Formative application
{
  const slide = presentation.slides.add();
  slide.background.fill = C.white;
  addMiniBrand(slide);
  addTitle(slide, "The first application tested one framework across three different systems");

  const nations = [
    ["SCOTLAND", C.blue],
    ["WALES", C.teal2],
    ["NORTHERN IRELAND", C.violet],
  ];
  nations.forEach((n, i) => {
    const x = 86 + i * 392;
    addShape(slide, "octagon", x, 276, 82, 82, n[1]);
    addText(slide, `${i + 1}`, x + 18, 297, 46, 34, { size: 26, color: C.white, bold: true, align: "center" });
    addText(slide, n[0], x + 104, 292, 246, 42, { size: 23, color: C.ink, bold: true, valign: "middle" });
  });

  addLine(slide, 86, 402, 1094, 0, C.border, 2);
  const evidence = [
    "Documentary evidence",
    "Stakeholder interviews",
    "National workshops",
    "Structured Right of Reply",
    "Cross-nation calibration",
    "Two research use-case stress tests",
  ];
  evidence.forEach((e, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    addBullet(slide, e, 96 + col * 382, 438 + row * 64, 346, { size: 21, bulletColor: DOMAIN_COLORS[i] });
  });

  addText(slide, "The purpose was a consistent, decision-useful view—not a national league table.", 96, 594, 1088, 38, {
    size: 22,
    color: C.tealDark,
    bold: true,
    align: "center",
  });
  addFooter(slide, 14);
  setNotes(
    slide,
    "Describe the multi-jurisdiction application without disclosing unpublished scores or detailed evidence. It tested practical use across heterogeneous institutional models.",
    [URL.paper, URL.rds, URL.home],
    "Use when explaining the field test or the framework’s origin.",
  );
}

// 15 — Showed / did not establish
{
  const slide = presentation.slides.add();
  slide.background.fill = C.navy;
  addMiniBrand(slide, { dark: true });
  addTitle(slide, "Formative use showed practical value—not validation", null, { dark: true });

  addText(slide, "THE APPLICATION SHOWED HDRL CAN", 76, 254, 520, 36, { size: 23, color: C.mint2, bold: true });
  addText(slide, "IT DID NOT ESTABLISH", 690, 254, 490, 36, { size: 23, color: "#FF9FB2", bold: true });

  [
    "Structure evidence consistently",
    "Surface dependencies and evidence gaps",
    "Support cross-setting calibration",
    "Focus improvement planning",
  ].forEach((t, i) => addBullet(slide, t, 82, 322 + i * 62, 520, { size: 24, color: C.white, bulletColor: C.mint2 }));

  [
    "Content validity",
    "Inter-rater reliability",
    "Responsiveness or predictive validity",
    "Fitness for accreditation",
  ].forEach((t, i) => addBullet(slide, t, 696, 322 + i * 62, 470, { size: 24, color: C.white, bulletColor: "#FF7E97" }));

  addShape(slide, "roundRect", 156, 594, 968, 48, "#234D6B", "#5D7890", 1);
  addText(slide, "Evidence-informed and formatively applied. Further independent validation is required.", 176, 605, 928, 26, {
    size: 20,
    color: "#D9E8F1",
    bold: true,
    align: "center",
  });
  addFooter(slide, 15, { dark: true });
  setNotes(
    slide,
    "This is the central claims-discipline slide. Practical feasibility and usefulness are supported by formative application; reliability and validity remain open empirical questions.",
    [URL.paper, URL.method, URL.about],
    "Use in every route.",
  );
}

// 16 — SATRE
{
  const slide = presentation.slides.add();
  slide.background.fill = C.white;
  addMiniBrand(slide);
  addText(slide, "SATRE 2.0 and HDRL answer related—but\ndifferent—questions", 70, 116, 1140, 104, {
    size: 42,
    color: C.ink,
    bold: true,
    name: "slide-title",
  });

  addShape(slide, "roundRect", 74, 268, 486, 274, C.bluePale, "#BBD2FF", 1);
  addText(slide, "SATRE 2.0", 106, 300, 420, 42, { size: 32, color: C.blue, bold: true, align: "center" });
  addText(slide, "What should a safe, effective TRE or federation implement?", 116, 372, 400, 76, {
    size: 26,
    color: C.ink,
    bold: true,
    align: "center",
  });
  addText(slide, "Detailed requirements and evaluation evidence for individual and federated TREs.", 120, 462, 392, 68, {
    size: 17,
    color: C.slate,
    align: "center",
  });

  addShape(slide, "roundRect", 720, 268, 486, 274, "#EDF8F6", C.border, 1);
  addText(slide, "HDRL", 752, 300, 420, 42, { size: 32, color: C.teal, bold: true, align: "center" });
  addText(slide, "How mature and evidenced is the wider health-data research system or service?", 762, 360, 400, 92, {
    size: 26,
    color: C.ink,
    bold: true,
    align: "center",
  });
  addText(slide, "A staged maturity view across data, delivery, trust, sustainability, workforce, governance and infrastructure.", 766, 458, 392, 76, {
    size: 16,
    color: C.slate,
    align: "center",
  });

  addShape(slide, "roundRect", 266, 552, 748, 66, C.white, C.teal, 2);
  addText(slide, "Complementary—not interchangeable. Do not convert one score mechanically into the other.", 294, 565, 692, 40, {
    size: 18,
    color: C.tealDark,
    bold: true,
    align: "center",
  });
  addFooter(slide, 16);
  setNotes(
    slide,
    "SATRE 2.0 is not merely technical: it includes governance, public involvement, supporting capabilities and a federation extension. A current SATRE evaluation can supply detailed evidence for parts of an HDRL assessment, but the conclusions remain separate.",
    [URL.satre, URL.overview, URL.method],
    "Use when the audience works with TREs, SDEs, federation or assurance.",
  );
}

// 17 — Validation agenda
{
  const slide = presentation.slides.add();
  slide.background.fill = C.pale;
  addMiniBrand(slide);
  addTitle(slide, "The next phase is independent testing across different settings");

  const priorities = [
    ["01", "Content validity", "Independent expert and public review"],
    ["02", "Reliability", "Multiple assessors and inter-rater testing"],
    ["03", "Sensitivity", "Test aggregation and scoring conventions"],
    ["04", "Prospective use", "Apply before and after improvement activity"],
    ["05", "Benchmarks", "Refine Level 4 and 5 thresholds with UK and international data"],
    ["06", "Transferability", "Test across different jurisdictions, architectures and service models"],
  ];
  priorities.forEach((p, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 80 + col * 590;
    const y = 270 + row * 104;
    addText(slide, p[0], x, y, 54, 32, { size: 20, color: C.teal, bold: true });
    addText(slide, p[1], x + 70, y, 240, 34, { size: 25, color: C.ink, bold: true });
    addText(slide, p[2], x + 70, y + 42, 450, 52, { size: 19, color: C.slate });
    if (row < 2) addLine(slide, x + 70, y + 90, 450, 0, C.border, 1);
  });
  addText(slide, "Useful challenge is more valuable than premature endorsement.", 80, 596, 1110, 40, {
    size: 24,
    color: C.tealDark,
    bold: true,
    align: "center",
  });
  addFooter(slide, 17);
  setNotes(
    slide,
    "Invite contribution around a concrete validation agenda. International comparators are particularly valuable for transferability and benchmark refinement, provided their context and data-generating processes are explicit.",
    [URL.method, URL.apply, URL.paper],
    "Use when seeking collaborators or responding to offers of comparative evidence.",
  );
}

// 18 — Discussion prompts
{
  const slide = presentation.slides.add();
  slide.background.fill = C.white;
  addMiniBrand(slide);
  addTitle(slide, "Four questions for a constructive team discussion");

  const qs = [
    ["1", "Where does this framework fit—or fail to fit—our setting?"],
    ["2", "Which indicators would be difficult to evidence consistently?"],
    ["3", "What would make the maturity descriptors more reliable between assessors?"],
    ["4", "What comparison or prospective test would add the most knowledge?"],
  ];
  qs.forEach((q, i) => {
    const y = 260 + i * 88;
    addShape(slide, "octagon", 90, y, 52, 52, i % 2 === 0 ? C.teal : C.blue);
    addText(slide, q[0], 102, y + 12, 28, 28, {
      size: 20,
      color: C.white,
      bold: true,
      align: "center",
      valign: "middle",
    });
    addText(slide, q[1], 172, y - 2, 980, 54, { size: 27, color: C.ink, bold: true, valign: "middle" });
    if (i < qs.length - 1) addLine(slide, 172, y + 66, 980, 0, C.border, 1);
  });
  addFooter(slide, 18);
  setNotes(
    slide,
    "Use these prompts to turn a presentation into structured critique. Capture disagreements, ambiguous descriptors and evidence difficulties as potential validation data rather than treating them as objections to overcome.",
    [URL.feedback, URL.paper],
    "Use in workshops, team meetings and conference discussion sessions.",
  );
}

// 19 — Reuse and credit
{
  const slide = presentation.slides.add();
  slide.background.fill = C.pale;
  addMiniBrand(slide, { label: "OPEN FRAMEWORK • RESPONSIBLE REUSE" });
  addTitle(slide, "Reuse and adapt the slides—with clear credit");

  const licenceTitle = addText(slide, "CC BY 4.0", 76, 260, 340, 72, { size: 52, color: C.teal, bold: true });
  addLink(licenceTitle, "CC BY 4.0", URL.licence);
  addText(slide, "You may share and adapt the public framework materials, including for international and commercial use.", 78, 338, 440, 110, {
    size: 23,
    color: C.ink,
  });

  addText(slide, "Retain:", 604, 254, 510, 34, { size: 26, color: C.ink, bold: true });
  const retainItems = [
    "Research Data Scotland — commissioner and IP rights owner",
    "OPL Advisory Ltd — originator and developer",
    "A link to the CC BY 4.0 licence",
    "A clear indication of any changes",
  ].map((t, i) => addBullet(slide, t, 608, 300 + i * 52, 560, { size: 20 }));
  addLink(retainItems[2], "A link to the CC BY 4.0 licence", URL.licence);

  addShape(slide, "roundRect", 76, 512, 1090, 116, C.white, C.border, 1);
  addText(slide, "Suggested framework citation", 98, 528, 310, 28, { size: 19, color: C.teal, bold: true });
  const citation = addText(
    slide,
    "OPL Advisory Ltd. Health Data Readiness Level (HDRL) Assessment Framework. Version 1.0.1. 29 July 2026. Commissioned by and intellectual property rights owned by Research Data Scotland. https://hdrlframework.org/",
    98,
    562,
    1034,
    50,
    { size: 17, color: C.slate },
  );
  addLink(citation, "https://hdrlframework.org/", URL.home);
  addFooter(slide, 19);
  setNotes(
    slide,
    "The public framework materials are openly licensed. Adaptation does not imply endorsement by OPL Advisory, Research Data Scotland, the assessed nations or HDRS. Detailed unpublished assessment evidence is outside the public licence.",
    [URL.about, URL.licence],
    "Keep in the downloadable master. Present only when reuse or licensing is relevant.",
  );
}

// 20 — Close
{
  const slide = presentation.slides.add();
  slide.background.fill = C.navy;
  addMiniBrand(slide, { dark: true, label: "AN OPEN CONTRIBUTION" });
  addText(slide, "Open for scrutiny.", 76, 162, 860, 78, {
    size: 66,
    color: C.white,
    bold: true,
    name: "slide-title",
  });
  addText(slide, "Read. Critique. Test. Help validate.", 78, 264, 980, 52, {
    size: 36,
    color: C.mint2,
    bold: true,
  });
  addLine(slide, 78, 344, 1098, 0, "#628197", 2);

  const actions = [
    ["READ", "Explore the preprint and framework"],
    ["CRITIQUE", "Challenge the method and assumptions"],
    ["TEST", "Apply it with explicit scope and evidence"],
    ["VALIDATE", "Share reliability, benchmark and transferability evidence"],
  ];
  actions.forEach((a, i) => {
    const y = 382 + i * 58;
    addText(slide, `0${i + 1}`, 82, y, 62, 28, { size: 20, color: C.mint2, bold: true });
    addText(slide, a[0], 164, y, 190, 30, { size: 23, color: C.white, bold: true });
    addText(slide, a[1], 382, y, 760, 30, { size: 22, color: "#D5E4EC" });
  });

  addShape(slide, "roundRect", 78, 610, 1096, 42, "#234D6B", "#5D7890", 1);
  const closeLinks = addText(slide, "Read the paper  •  Explore the framework  •  Share structured feedback", 96, 620, 1060, 24, {
    size: 17,
    color: C.white,
    align: "center",
    valign: "middle",
  });
  addLink(closeLinks, "Read the paper", URL.paper);
  addLink(closeLinks, "Explore the framework", URL.home);
  addLink(closeLinks, "Share structured feedback", URL.feedback);
  addFooter(slide, 20, { dark: true });
  setNotes(
    slide,
    "Close with the agreed call to action: read and critique the paper, then help test and validate the framework. Do not ask the audience to adopt HDRL.",
    [URL.paper, URL.doi, URL.home, URL.feedback],
    "Use in every route.",
  );
}

// 21–92 — Modular domain and indicator library
{
  let pageNumber = 21;
  catalogue.domains.forEach((domain) => {
    const indicators = catalogue.indicators.filter((indicator) => indicator.domain === domain.ref);
    addDomainIndicatorSlide(domain, indicators, pageNumber);
    pageNumber += 1;
    indicators.forEach((indicator) => {
      addIndicatorDetailSlide(domain, indicator, pageNumber);
      pageNumber += 1;
    });
  });
  if (pageNumber !== 93) throw new Error(`Expected 92 slides; next page number is ${pageNumber}`);
}

async function writeBlob(filePath, blob) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
}

async function main() {
  await fs.mkdir(path.dirname(FINAL_PPTX), { recursive: true });
  await fs.rm(RENDER_DIR, { recursive: true, force: true });
  await fs.rm(LAYOUT_DIR, { recursive: true, force: true });
  await fs.mkdir(RENDER_DIR, { recursive: true });
  await fs.mkdir(LAYOUT_DIR, { recursive: true });

  for (const [index, slide] of presentation.slides.items.entries()) {
    const stem = `slide-${String(index + 1).padStart(2, "0")}`;
    await writeBlob(path.join(RENDER_DIR, `${stem}.png`), await presentation.export({ slide, format: "png", scale: 1.2 }));
    const layout = await slide.export({ format: "layout" });
    await fs.writeFile(path.join(LAYOUT_DIR, `${stem}.layout.json`), await layout.text());
  }

  await writeBlob(
    path.join(TMP_DIR, "HDRL-Presentation-Kit-montage.webp"),
    await presentation.export({ format: "webp", montage: true, scale: 1 }),
  );

  const snapshot = await presentation.inspect({
    kind: "slide,textbox,shape,notes",
    maxChars: 240000,
  });
  await fs.writeFile(path.join(TMP_DIR, "final-inspect.ndjson"), snapshot.ndjson);

  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(FINAL_PPTX);
  await execFileAsync("python3", [HARDENER_PATH, FINAL_PPTX]);
  await fs.rm(`${FINAL_PPTX}.inspect.ndjson`, { force: true });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
