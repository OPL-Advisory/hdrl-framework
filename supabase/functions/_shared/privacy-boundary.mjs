export class BoundaryError extends Error {
  constructor(status, message, code = "invalid_request") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const PROFILE_KEYS = new Set([
  "name", "role", "organisation", "region", "service_type", "scale",
  "use_mode", "report_use", "research_contact", "newsletter",
  "privacy_notice_version", "contact_wording_version"
]);
const FEEDBACK_KEYS = new Set(["mode", "rating", "category", "comment", "context"]);
const CONTEXT_KEYS = new Set([
  "tool_version", "framework_version", "catalogue_version", "view",
  "domain_ref", "indicator_ref", "completed_indicator_count",
  "completed_domain_count", "active_time_band", "viewport_band"
]);
const CATEGORIES = new Set([
  "overall_experience", "bug", "unclear_framework_wording", "unclear_tool_wording",
  "accessibility", "suggestion", "other", ""
]);
const ACTIVE_TIME_BANDS = new Set([
  "under_5_minutes", "5_to_15_minutes", "15_to_30_minutes",
  "30_to_60_minutes", "60_minutes_or_more"
]);
const VIEWS = new Set([
  "welcome", "boundary", "overview", "rapid-intro", "rapid", "rapid-summary",
  "snapshot-dashboard", "snapshot", "snapshot-review", "evidence", "indicator",
  "review", "gate", "report", "feedback", "share-results", "beta-activity"
]);
const VIEWPORTS = new Set(["small_mobile", "large_mobile", "tablet_or_small_desktop", "desktop"]);

export function assertKeys(value, allowed) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new BoundaryError(400, "A JSON object is required.");
  }
  if (Object.keys(value).some((key) => !allowed.has(key))) {
    throw new BoundaryError(400, "The request contains fields this service does not accept.", "privacy_boundary_violation");
  }
}

function cleanString(value, maximum, required = false) {
  const clean = typeof value === "string" ? value.trim().replaceAll("\u0000", "") : "";
  if (required && !clean) throw new BoundaryError(400, "A required field is missing.");
  if (clean.length > maximum) throw new BoundaryError(400, "A field is longer than permitted.");
  return clean;
}

function operationalValue(key, value) {
  if (["completed_indicator_count", "completed_domain_count"].includes(key)) {
    const maximum = key === "completed_indicator_count" ? 64 : 8;
    if (Number.isInteger(value) && value >= 0 && value <= maximum) return value;
  }
  if (key === "active_time_band" && ACTIVE_TIME_BANDS.has(value)) return value;
  if (key === "domain_ref" && typeof value === "string" && /^[A-H]$/.test(value)) return value;
  if (key === "indicator_ref" && typeof value === "string" && /^[A-H]\.\d+\.\d+$/.test(value)) return value;
  if (key === "view" && VIEWS.has(value)) return value;
  if (key === "viewport_band" && VIEWPORTS.has(value)) return value;
  if (["tool_version", "framework_version", "catalogue_version"].includes(key)
      && typeof value === "string" && /^[A-Za-z0-9.+_-]{1,50}$/.test(value)) return value;
  throw new BoundaryError(400, "An operational property is invalid.", "privacy_boundary_violation");
}

export function cleanProfile(body) {
  assertKeys(body, PROFILE_KEYS);
  return {
    name: cleanString(body.name, 120),
    role: cleanString(body.role, 120, true),
    organisation: cleanString(body.organisation, 180, true),
    region: cleanString(body.region, 120),
    service_type: cleanString(body.service_type, 120),
    scale: cleanString(body.scale, 120),
    use_mode: cleanString(body.use_mode, 120, true),
    report_use: cleanString(body.report_use, 120, true),
    research_contact: body.research_contact === true,
    newsletter: body.newsletter === true,
    privacy_notice_version: cleanString(body.privacy_notice_version, 80, true),
    contact_wording_version: cleanString(body.contact_wording_version, 80, true)
  };
}

export function cleanFeedback(body) {
  assertKeys(body, FEEDBACK_KEYS);
  if (!["without_contact", "contactable"].includes(body.mode)) {
    throw new BoundaryError(400, "Choose a recognised feedback contact mode.");
  }
  const rating = body.rating === null || body.rating === undefined || body.rating === "" ? null : Number(body.rating);
  if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    throw new BoundaryError(400, "Rating must be between one and five.");
  }
  const category = cleanString(body.category, 80);
  if (!CATEGORIES.has(category)) throw new BoundaryError(400, "Choose a recognised feedback category.");
  const comment = cleanString(body.comment, 2000);
  if (rating === null && !category && !comment) throw new BoundaryError(400, "Add a rating, category or comment.");
  const context = body.context || {};
  assertKeys(context, CONTEXT_KEYS);
  const cleanContext = {};
  for (const [key, value] of Object.entries(context)) cleanContext[key] = operationalValue(key, value);
  return { mode: body.mode, rating, category: category || null, comment: comment || null, context: cleanContext };
}

export const __test = { operationalValue, PROFILE_KEYS, FEEDBACK_KEYS, CONTEXT_KEYS };
