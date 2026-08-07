const SERVICE_VERSION = "0.1.0";
const EVENT_SCHEMA_VERSION = "0.1.0";
const PRIVACY_NOTICE_VERSION = "beta-privacy-v0.2-draft";
const CONSENT_WORDING_VERSION = "beta-contact-v0.2";
const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store, max-age=0",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer"
};

const EVENT_ALLOWLIST = {
  assessment_started: ["entry_point"],
  domain_orientation_completed: ["completed_domain_count", "active_time_band"],
  snapshot_started: ["entry_point"],
  snapshot_domain_completed: ["domain_ref", "completed_indicator_count", "active_time_band"],
  snapshot_completed: ["completed_indicator_count", "completed_domain_count", "active_time_band"],
  evidence_workspace_started: ["entry_point"],
  report_unlocked: ["completed_indicator_count", "completed_domain_count"],
  report_download_requested: ["download_type", "completed_indicator_count"],
  feedback_prompt_seen: ["context"],
  feedback_submitted: [],
  feedback_skipped: ["context"],
  feedback_dismissed: ["context"],
  share_bundle_created: ["bundle_scope"]
};

const FEEDBACK_CONTEXT_ALLOWLIST = new Set([
  "tool_version", "framework_version", "catalogue_version", "view", "domain_ref",
  "indicator_ref", "completed_indicator_count", "completed_domain_count",
  "active_time_band", "viewport_band"
]);

const FEEDBACK_CATEGORIES = new Set([
  "overall_experience", "bug", "unclear_framework_wording", "unclear_tool_wording",
  "accessibility", "suggestion", "other", ""
]);

const ACTIVE_TIME_BANDS = new Set([
  "under_5_minutes", "5_to_15_minutes", "15_to_30_minutes",
  "30_to_60_minutes", "60_minutes_or_more"
]);
const VIEW_VALUES = new Set([
  "welcome", "boundary", "overview", "rapid-intro", "rapid", "rapid-summary",
  "snapshot-dashboard", "snapshot", "snapshot-review", "evidence", "indicator",
  "review", "gate", "report", "feedback", "share-results", "beta-activity",
  "resumed_snapshot", "resumed_evidence", "boundary_completed"
]);
const DOWNLOAD_TYPES = new Set(["print", "json", "snapshot-csv", "csv"]);
const VIEWPORT_BANDS = new Set(["small_mobile", "large_mobile", "tablet_or_small_desktop", "desktop"]);
const SHARE_FIELDS = new Set(["snapshot", "evidenceResults", "comments", "evidenceRecords"]);

class HttpError extends Error {
  constructor(status, message, code = "invalid_request") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const nowIso = () => new Date().toISOString();
const dateOnly = (date = new Date()) => date.toISOString().slice(0, 10);
const plusDays = (days) => new Date(Date.now() + days * 86400000).toISOString();
const plusMinutes = (minutes) => new Date(Date.now() + minutes * 60000).toISOString();
const uuid = () => crypto.randomUUID();

function base64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function fromBase64Url(value) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((value.length + 3) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function importHmac(secret) {
  if (!secret || secret.length < 24) throw new Error("A required service secret is missing or too short");
  return crypto.subtle.importKey("raw", textEncoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function hmac(secret, value) {
  const key = await importHmac(secret);
  return base64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, textEncoder.encode(value))));
}

async function verifyHmac(secret, value, signature) {
  try {
    const key = await importHmac(secret);
    return crypto.subtle.verify("HMAC", key, fromBase64Url(signature), textEncoder.encode(value));
  } catch {
    return false;
  }
}

async function encryptionKey(env) {
  const raw = Uint8Array.from(atob(env.DATA_ENCRYPTION_KEY_BASE64 || ""), (character) => character.charCodeAt(0));
  if (raw.length !== 32) throw new Error("DATA_ENCRYPTION_KEY_BASE64 must contain exactly 32 bytes");
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function encryptJson(env, value) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await encryptionKey(env), textEncoder.encode(JSON.stringify(value)));
  return `${base64Url(iv)}.${base64Url(new Uint8Array(encrypted))}`;
}

async function decryptJson(env, value) {
  const [ivPart, ciphertextPart] = String(value || "").split(".");
  if (!ivPart || !ciphertextPart) throw new Error("Encrypted data is malformed");
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromBase64Url(ivPart) }, await encryptionKey(env), fromBase64Url(ciphertextPart));
  return JSON.parse(textDecoder.decode(decrypted));
}

function cleanString(value, max, required = false) {
  const cleaned = typeof value === "string" ? value.trim().replaceAll("\u0000", "") : "";
  if (required && !cleaned) throw new HttpError(400, "A required field is missing.");
  if (cleaned.length > max) throw new HttpError(400, "A field is longer than permitted.");
  return cleaned;
}

function cleanEmail(value) {
  const email = cleanString(value, 254, true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, "Enter an email address in the correct format.");
  return email;
}

function assertKeys(object, allowed) {
  if (!object || typeof object !== "object" || Array.isArray(object)) throw new HttpError(400, "A JSON object is required.");
  const unexpected = Object.keys(object).filter((key) => !allowed.has(key));
  if (unexpected.length) throw new HttpError(400, "The request contains fields that this service does not accept.", "privacy_boundary_violation");
}

async function readJson(request, allowedKeys, maxBytes = 16384) {
  if (!String(request.headers.get("content-type") || "").toLowerCase().startsWith("application/json")) {
    throw new HttpError(415, "Use application/json.");
  }
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > maxBytes) throw new HttpError(413, "The request is too large.");
  const text = await request.text();
  if (text.length > maxBytes) throw new HttpError(413, "The request is too large.");
  let body;
  try { body = JSON.parse(text); } catch { throw new HttpError(400, "The JSON could not be read."); }
  assertKeys(body, allowedKeys);
  return body;
}

function allowedOrigin(request, env) {
  const origin = request.headers.get("origin") || "";
  const allowed = String(env.ALLOWED_ORIGINS || "").split(",").map((item) => item.trim()).filter(Boolean);
  return origin && allowed.includes(origin) ? origin : "";
}

function response(body, status = 200, origin = "") {
  const headers = new Headers(JSON_HEADERS);
  if (origin) {
    headers.set("access-control-allow-origin", origin);
    headers.set("vary", "Origin");
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function noContent(origin) {
  const headers = new Headers({
    "cache-control": "no-store",
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "Content-Type,Authorization",
    "access-control-max-age": "600",
    "vary": "Origin"
  });
  return new Response(null, { status: 204, headers });
}

async function rateLimit(env, request, route, subject, limit, windowMinutes = 60) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const keyDigest = await hmac(env.HASH_SECRET, `${dateOnly()}:${ip}:${subject}`);
  const now = new Date();
  const windowMs = windowMinutes * 60000;
  const windowStart = new Date(Math.floor(now.getTime() / windowMs) * windowMs).toISOString();
  const expiresAt = new Date(new Date(windowStart).getTime() + windowMs * 2).toISOString();
  await env.DB.prepare(`
    INSERT INTO rate_limits (key_digest, route, window_start, hits, expires_at)
    VALUES (?, ?, ?, 1, ?)
    ON CONFLICT(key_digest, route, window_start) DO UPDATE SET hits = hits + 1
  `).bind(keyDigest, route, windowStart, expiresAt).run();
  const row = await env.DB.prepare("SELECT hits FROM rate_limits WHERE key_digest = ? AND route = ? AND window_start = ?")
    .bind(keyDigest, route, windowStart).first();
  if (Number(row?.hits || 0) > limit) throw new HttpError(429, "Too many attempts. Try again later.", "rate_limited");
}

function sixDigitCode() {
  const bytes = crypto.getRandomValues(new Uint32Array(1));
  return String(bytes[0] % 1000000).padStart(6, "0");
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

async function sendCode(env, email, code, purpose) {
  const label = purpose === "report_unlock" ? "unlock your HDRL beta report" : `confirm your HDRL privacy ${purpose}`;
  if (env.EMAIL_PROVIDER === "development") return { provider: "development" };
  if (env.EMAIL_PROVIDER !== "resend" || !env.RESEND_API_KEY) throw new Error("Transactional email is not configured");
  const subject = "Your HDRL beta verification code";
  const text = `Use this code to ${label}: ${code}\n\nThe code expires in 10 minutes and can be used once. Your assessment answers and report have not been sent to OPL Advisory.\n\nIf you did not request this code, you can ignore this email.`;
  const html = `<p>Use this code to ${escapeHtml(label)}:</p><p style="font-size:28px;font-weight:700;letter-spacing:.18em">${escapeHtml(code)}</p><p>The code expires in 10 minutes and can be used once. Your assessment answers and report have not been sent to OPL Advisory.</p><p>If you did not request this code, you can ignore this email.</p>`;
  const sent = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "authorization": `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ from: env.EMAIL_FROM, to: [email], subject, text, html })
  });
  if (!sent.ok) throw new Error(`Email provider rejected the message (${sent.status})`);
  return { provider: "resend" };
}

async function createSession(request, env, origin) {
  await rateLimit(env, request, "session", "new", 20, 60);
  const body = await readJson(request, new Set(["schema_version", "tool_version", "framework_version", "catalogue_version"]), 2048);
  const values = {
    schema: cleanString(body.schema_version, 30, true),
    tool: cleanString(body.tool_version, 50, true),
    framework: cleanString(body.framework_version, 30, true),
    catalogue: cleanString(body.catalogue_version, 30, true)
  };
  const id = uuid();
  const now = nowIso();
  await env.DB.prepare(`INSERT INTO beta_sessions
    (id, schema_version, tool_version, framework_version, catalogue_version, created_at, last_event_at, retention_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, values.schema, values.tool, values.framework, values.catalogue, now, now, plusDays(183)).run();
  return response({ session_id: id, service_version: SERVICE_VERSION, retention_days: 183 }, 201, origin);
}

function cleanEventProperties(name, properties) {
  const allowed = EVENT_ALLOWLIST[name];
  if (!allowed) throw new HttpError(400, "This event is not accepted.");
  if (!properties || typeof properties !== "object" || Array.isArray(properties)) return {};
  assertKeys(properties, new Set(allowed));
  const clean = {};
  for (const key of allowed) {
    const value = properties[key];
    if (value !== undefined) clean[key] = cleanOperationalProperty(key, value);
  }
  return clean;
}

function cleanOperationalProperty(key, value) {
  if (["completed_indicator_count", "completed_domain_count"].includes(key)) {
    const maximum = key === "completed_indicator_count" ? 64 : 8;
    if (!Number.isInteger(value) || value < 0 || value > maximum) throw new HttpError(400, "An operational count is invalid.");
    return value;
  }
  if (key === "active_time_band" && ACTIVE_TIME_BANDS.has(value)) return value;
  if (key === "domain_ref" && /^[A-H]$/.test(value)) return value;
  if (key === "indicator_ref" && /^[A-H]\.\d+\.\d+$/.test(value)) return value;
  if (["entry_point", "context", "view"].includes(key) && VIEW_VALUES.has(value)) return value;
  if (key === "download_type" && DOWNLOAD_TYPES.has(value)) return value;
  if (key === "viewport_band" && VIEWPORT_BANDS.has(value)) return value;
  if (["tool_version", "framework_version", "catalogue_version"].includes(key)
      && typeof value === "string" && /^[A-Za-z0-9.+_-]{1,50}$/.test(value)) return value;
  if (key === "bundle_scope" && typeof value === "string") {
    const fields = value.split(",").filter(Boolean);
    if (fields.length && fields.length <= SHARE_FIELDS.size && fields.every((field) => SHARE_FIELDS.has(field))) return fields.join(",");
  }
  throw new HttpError(400, "An operational property is invalid.", "privacy_boundary_violation");
}

async function acceptEvents(request, env, origin) {
  const body = await readJson(request, new Set(["session_id", "events"]), 24576);
  const sessionId = cleanString(body.session_id, 80, true);
  if (!Array.isArray(body.events) || body.events.length < 1 || body.events.length > 25) throw new HttpError(400, "Send between one and 25 events.");
  await rateLimit(env, request, "events", sessionId, 300, 60);
  const session = await env.DB.prepare("SELECT id, telemetry_disabled_at FROM beta_sessions WHERE id = ?").bind(sessionId).first();
  if (!session) throw new HttpError(404, "The beta session was not found.");
  if (session.telemetry_disabled_at) return response({ accepted: 0, telemetry_disabled: true }, 202, origin);
  const statements = [];
  for (const event of body.events) {
    assertKeys(event, new Set(["id", "name", "at", "properties"]));
    const id = cleanString(event.id, 80, true);
    const name = cleanString(event.name, 80, true);
    const at = cleanString(event.at, 40, true);
    if (Number.isNaN(Date.parse(at))) throw new HttpError(400, "An event date is invalid.");
    const occurredAt = new Date(Math.floor(Date.parse(at) / 3600000) * 3600000).toISOString();
    const properties = cleanEventProperties(name, event.properties);
    statements.push(env.DB.prepare(`INSERT OR IGNORE INTO beta_events
      (id, session_id, event_name, occurred_at, properties_json, schema_version)
      VALUES (?, ?, ?, ?, ?, ?)`)
      .bind(id, sessionId, name, occurredAt, JSON.stringify(properties), EVENT_SCHEMA_VERSION));
  }
  statements.push(env.DB.prepare("UPDATE beta_sessions SET last_event_at = ?, retention_at = ? WHERE id = ?")
    .bind(nowIso(), plusDays(183), sessionId));
  await env.DB.batch(statements);
  return response({ accepted: body.events.length }, 202, origin);
}

async function disableTelemetry(request, env, origin) {
  const body = await readJson(request, new Set(["session_id"]), 1024);
  const sessionId = cleanString(body.session_id, 80, true);
  await env.DB.prepare("UPDATE beta_sessions SET telemetry_disabled_at = ? WHERE id = ?").bind(nowIso(), sessionId).run();
  return response({ telemetry_disabled: true }, 200, origin);
}

function participantProfile(body) {
  return {
    email: cleanEmail(body.email),
    name: cleanString(body.name, 120),
    role: cleanString(body.role, 120, true),
    organisation: cleanString(body.organisation, 180, true),
    region: cleanString(body.region, 120),
    service_type: cleanString(body.service_type, 120),
    scale: cleanString(body.scale, 120),
    use_mode: cleanString(body.use_mode, 120, true),
    report_use: cleanString(body.report_use, 120, true),
    research_contact: body.research_contact === true,
    newsletter: body.newsletter === true
  };
}

async function requestVerification(request, env, origin) {
  const body = await readJson(request, new Set([
    "session_id", "email", "name", "role", "organisation", "region", "service_type", "scale",
    "use_mode", "report_use", "research_contact", "newsletter", "privacy_notice_version"
  ]), 12288);
  const sessionId = cleanString(body.session_id, 80, true);
  const session = await env.DB.prepare("SELECT id FROM beta_sessions WHERE id = ?").bind(sessionId).first();
  if (!session) throw new HttpError(400, "Start a beta session before requesting a report code.");
  const profile = participantProfile(body);
  if (cleanString(body.privacy_notice_version, 80, true) !== PRIVACY_NOTICE_VERSION) {
    throw new HttpError(409, "The privacy information has changed. Review it before continuing.", "privacy_notice_changed");
  }
  const emailDigest = await hmac(env.HASH_SECRET, profile.email);
  await rateLimit(env, request, "verification_request", `${sessionId}:${emailDigest}`, 4, 60);
  const challengeId = uuid();
  const code = sixDigitCode();
  const created = nowIso();
  const expires = plusMinutes(10);
  await env.DB.prepare(`INSERT INTO verification_challenges
    (id, purpose, session_id, email_digest, encrypted_payload, code_digest, created_at, expires_at)
    VALUES (?, 'report_unlock', ?, ?, ?, ?, ?, ?)`)
    .bind(challengeId, sessionId, emailDigest, await encryptJson(env, profile), await hmac(env.OTP_SECRET, `${challengeId}:${code}`), created, expires).run();
  try {
    await sendCode(env, profile.email, code, "report_unlock");
  } catch (error) {
    await env.DB.prepare("DELETE FROM verification_challenges WHERE id = ?").bind(challengeId).run();
    throw error;
  }
  const payload = { challenge_id: challengeId, expires_in_seconds: 600, message: "If the address can receive mail, a code has been sent." };
  if (env.ENVIRONMENT === "local" && env.ALLOW_DEVELOPMENT_OTP_RETURN === "true") payload.development_code = code;
  return response(payload, 202, origin);
}

async function signReceipt(env, participantId, sessionId) {
  const payload = base64Url(textEncoder.encode(JSON.stringify({ participant_id: participantId, session_id: sessionId, exp: Date.now() + 86400000 })));
  return `${payload}.${await hmac(env.RECEIPT_SECRET, payload)}`;
}

async function readReceipt(env, receipt) {
  const [payload, signature] = String(receipt || "").split(".");
  if (!payload || !signature || !(await verifyHmac(env.RECEIPT_SECRET, payload, signature))) throw new HttpError(401, "Verification is required.");
  let decoded;
  try { decoded = JSON.parse(textDecoder.decode(fromBase64Url(payload))); } catch { throw new HttpError(401, "Verification is required."); }
  if (!decoded.participant_id || Number(decoded.exp) < Date.now()) throw new HttpError(401, "Verification has expired.");
  return decoded;
}

async function confirmVerification(request, env, origin) {
  const body = await readJson(request, new Set(["challenge_id", "code"]), 2048);
  const challengeId = cleanString(body.challenge_id, 80, true);
  const code = cleanString(body.code, 6, true);
  if (!/^\d{6}$/.test(code)) throw new HttpError(400, "Enter the six-digit code.");
  await rateLimit(env, request, "verification_confirm", challengeId, 12, 60);
  const challenge = await env.DB.prepare("SELECT * FROM verification_challenges WHERE id = ?").bind(challengeId).first();
  if (!challenge || challenge.purpose !== "report_unlock" || challenge.consumed_at || Date.parse(challenge.expires_at) < Date.now()) {
    throw new HttpError(400, "The code is invalid or has expired.", "invalid_code");
  }
  if (Number(challenge.attempts) >= 5) throw new HttpError(429, "Too many incorrect codes. Request a new code.", "challenge_locked");
  if (!(await verifyHmac(env.OTP_SECRET, `${challengeId}:${code}`, challenge.code_digest))) {
    await env.DB.prepare("UPDATE verification_challenges SET attempts = attempts + 1 WHERE id = ?").bind(challengeId).run();
    throw new HttpError(400, "The code is invalid or has expired.", "invalid_code");
  }
  const profile = await decryptJson(env, challenge.encrypted_payload);
  const existing = await env.DB.prepare("SELECT id FROM beta_participants WHERE email_digest = ?").bind(challenge.email_digest).first();
  const participantId = existing?.id || uuid();
  const now = nowIso();
  const encryptedProfile = await encryptJson(env, profile);
  if (existing) {
    await env.DB.prepare(`UPDATE beta_participants SET encrypted_profile = ?, last_seen_at = ?, retention_at = ?,
      privacy_notice_version = ? WHERE id = ?`)
      .bind(encryptedProfile, now, plusDays(365), PRIVACY_NOTICE_VERSION, participantId).run();
  } else {
    await env.DB.prepare(`INSERT INTO beta_participants
      (id, email_digest, encrypted_profile, verified_at, last_seen_at, retention_at, privacy_notice_version)
      VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .bind(participantId, challenge.email_digest, encryptedProfile, now, now, plusDays(365), PRIVACY_NOTICE_VERSION).run();
  }
  const preferenceStatements = [
    ["research_contact", profile.research_contact], ["newsletter", profile.newsletter]
  ].map(([purpose, granted]) => env.DB.prepare(`INSERT INTO contact_preferences
    (participant_id, purpose, granted, wording_version, recorded_at, withdrawn_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(participant_id, purpose) DO UPDATE SET granted = excluded.granted,
      wording_version = excluded.wording_version, recorded_at = excluded.recorded_at,
      withdrawn_at = excluded.withdrawn_at`)
    .bind(participantId, purpose, granted ? 1 : 0, CONSENT_WORDING_VERSION, now, granted ? null : now));
  await env.DB.batch([
    ...preferenceStatements,
    env.DB.prepare("UPDATE beta_sessions SET participant_id = ? WHERE id = ?").bind(participantId, challenge.session_id),
    env.DB.prepare("UPDATE verification_challenges SET consumed_at = ?, encrypted_payload = '' WHERE id = ?").bind(now, challengeId)
  ]);
  return response({ verified: true, receipt: await signReceipt(env, participantId, challenge.session_id), receipt_expires_in_seconds: 86400 }, 200, origin);
}

function cleanFeedbackContext(context) {
  if (!context || typeof context !== "object" || Array.isArray(context)) return {};
  assertKeys(context, FEEDBACK_CONTEXT_ALLOWLIST);
  const clean = {};
  for (const [key, value] of Object.entries(context)) {
    clean[key] = cleanOperationalProperty(key, value);
  }
  return clean;
}

async function acceptFeedback(request, env, origin) {
  const body = await readJson(request, new Set(["mode", "rating", "category", "comment", "context", "receipt"]), 8192);
  if (!["contactable", "without_contact"].includes(body.mode)) throw new HttpError(400, "Choose a recognised feedback contact mode.");
  const mode = body.mode;
  const rating = body.rating === null || body.rating === undefined || body.rating === "" ? null : Number(body.rating);
  if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) throw new HttpError(400, "Rating must be between one and five.");
  const category = cleanString(body.category, 80);
  if (!FEEDBACK_CATEGORIES.has(category)) throw new HttpError(400, "Choose a recognised feedback category.");
  const comment = cleanString(body.comment, 2000);
  if (rating === null && !category && !comment) throw new HttpError(400, "Add a rating, category or comment.");
  let participantId = null;
  if (mode === "contactable") participantId = (await readReceipt(env, body.receipt)).participant_id;
  await rateLimit(env, request, "feedback", mode, 20, 60);
  const receivedDate = dateOnly();
  await env.DB.prepare(`INSERT INTO beta_feedback
    (id, contact_mode, participant_id, rating, category, comment, context_json, received_date, retention_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(uuid(), mode, participantId, rating, category || null, comment || null,
      JSON.stringify(cleanFeedbackContext(body.context)), receivedDate, plusDays(365)).run();
  return response({ received: true, contact_mode: mode }, 201, origin);
}

async function requestPrivacyAction(request, env, origin) {
  const body = await readJson(request, new Set(["email", "action"]), 2048);
  const email = cleanEmail(body.email);
  const action = ["access", "correct", "delete"].includes(body.action) ? body.action : "access";
  const emailDigest = await hmac(env.HASH_SECRET, email);
  await rateLimit(env, request, "privacy_request", emailDigest, 3, 60);
  const challengeId = uuid();
  const code = sixDigitCode();
  await env.DB.prepare(`INSERT INTO verification_challenges
    (id, purpose, email_digest, encrypted_payload, code_digest, created_at, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .bind(challengeId, action, emailDigest, await encryptJson(env, { email, action }),
      await hmac(env.OTP_SECRET, `${challengeId}:${code}`), nowIso(), plusMinutes(10)).run();
  try { await sendCode(env, email, code, action); }
  catch (error) { await env.DB.prepare("DELETE FROM verification_challenges WHERE id = ?").bind(challengeId).run(); throw error; }
  const payload = { challenge_id: challengeId, expires_in_seconds: 600, message: "If the address can receive mail, a code has been sent." };
  if (env.ENVIRONMENT === "local" && env.ALLOW_DEVELOPMENT_OTP_RETURN === "true") payload.development_code = code;
  return response(payload, 202, origin);
}

async function confirmPrivacyAction(request, env, origin) {
  const body = await readJson(request, new Set(["challenge_id", "code"]), 2048);
  const challengeId = cleanString(body.challenge_id, 80, true);
  const code = cleanString(body.code, 6, true);
  const challenge = await env.DB.prepare("SELECT * FROM verification_challenges WHERE id = ?").bind(challengeId).first();
  if (!challenge || !["access", "correct", "delete"].includes(challenge.purpose) || challenge.consumed_at || Date.parse(challenge.expires_at) < Date.now()) {
    throw new HttpError(400, "The code is invalid or has expired.", "invalid_code");
  }
  if (Number(challenge.attempts) >= 5 || !(await verifyHmac(env.OTP_SECRET, `${challengeId}:${code}`, challenge.code_digest))) {
    await env.DB.prepare("UPDATE verification_challenges SET attempts = attempts + 1 WHERE id = ?").bind(challengeId).run();
    throw new HttpError(400, "The code is invalid or has expired.", "invalid_code");
  }
  const participant = await env.DB.prepare("SELECT * FROM beta_participants WHERE email_digest = ?").bind(challenge.email_digest).first();
  const requestId = uuid();
  const now = nowIso();
  if (!participant) {
    await env.DB.batch([
      env.DB.prepare("INSERT INTO rights_requests (id, request_type, requested_at, completed_at, status) VALUES (?, ?, ?, ?, 'completed_no_record')")
        .bind(requestId, challenge.purpose, now, now),
      env.DB.prepare("UPDATE verification_challenges SET consumed_at = ?, encrypted_payload = '' WHERE id = ?").bind(now, challengeId)
    ]);
    return response({ completed: true, record_found: false }, 200, origin);
  }
  if (["access", "correct"].includes(challenge.purpose)) {
    const preferences = await env.DB.prepare("SELECT purpose, granted, recorded_at, withdrawn_at FROM contact_preferences WHERE participant_id = ?")
      .bind(participant.id).all();
    await env.DB.batch([
      env.DB.prepare("INSERT INTO rights_requests (id, participant_id, request_type, requested_at, completed_at, status) VALUES (?, ?, ?, ?, ?, 'completed')")
        .bind(requestId, participant.id, challenge.purpose, now, now),
      env.DB.prepare("UPDATE verification_challenges SET consumed_at = ?, encrypted_payload = '' WHERE id = ?").bind(now, challengeId)
    ]);
    const payload = {
      completed: true,
      record_found: true,
      participant: await decryptJson(env, participant.encrypted_profile),
      preferences: preferences.results || [],
      verified_at: participant.verified_at,
      retention_at: participant.retention_at,
      statement: "Assessment responses, evidence and reports are not held by this service."
    };
    if (challenge.purpose === "correct") {
      payload.correction_receipt = await signReceipt(env, participant.id, "privacy-correction");
      payload.correction_receipt_expires_in_seconds = 86400;
      payload.email_correction_note = `To change the verified email address, contact ${env.PRIVACY_CONTACT_EMAIL || "the published privacy contact"}.`;
    }
    return response(payload, 200, origin);
  }
  const sessionRows = await env.DB.prepare("SELECT id FROM beta_sessions WHERE participant_id = ?").bind(participant.id).all();
  const statements = [];
  for (const row of sessionRows.results || []) statements.push(env.DB.prepare("DELETE FROM beta_sessions WHERE id = ?").bind(row.id));
  statements.push(env.DB.prepare("DELETE FROM beta_feedback WHERE participant_id = ?").bind(participant.id));
  statements.push(env.DB.prepare("DELETE FROM beta_participants WHERE id = ?").bind(participant.id));
  statements.push(env.DB.prepare("INSERT INTO rights_requests (id, request_type, requested_at, completed_at, status) VALUES (?, 'delete', ?, ?, 'completed')").bind(requestId, now, now));
  statements.push(env.DB.prepare("UPDATE verification_challenges SET consumed_at = ?, encrypted_payload = '' WHERE id = ?").bind(now, challengeId));
  await env.DB.batch(statements);
  return response({ completed: true, record_found: true, deleted: true, backup_note: "Deleted live records may persist in provider backups until the documented backup window expires." }, 200, origin);
}

async function correctParticipant(request, env, origin) {
  const body = await readJson(request, new Set([
    "receipt", "name", "role", "organisation", "region", "service_type", "scale", "use_mode", "report_use"
  ]), 8192);
  const verified = await readReceipt(env, body.receipt);
  if (verified.session_id !== "privacy-correction") throw new HttpError(401, "A correction verification is required.");
  const participant = await env.DB.prepare("SELECT encrypted_profile FROM beta_participants WHERE id = ?").bind(verified.participant_id).first();
  if (!participant) throw new HttpError(404, "The participant record was not found.");
  const current = await decryptJson(env, participant.encrypted_profile);
  const corrected = {
    ...current,
    name: cleanString(body.name, 120),
    role: cleanString(body.role, 120, true),
    organisation: cleanString(body.organisation, 180, true),
    region: cleanString(body.region, 120),
    service_type: cleanString(body.service_type, 120),
    scale: cleanString(body.scale, 120),
    use_mode: cleanString(body.use_mode, 120, true),
    report_use: cleanString(body.report_use, 120, true)
  };
  const now = nowIso();
  await env.DB.batch([
    env.DB.prepare("UPDATE beta_participants SET encrypted_profile = ?, last_seen_at = ?, retention_at = ? WHERE id = ?")
      .bind(await encryptJson(env, corrected), now, plusDays(365), verified.participant_id),
    env.DB.prepare("INSERT INTO rights_requests (id, participant_id, request_type, requested_at, completed_at, status) VALUES (?, ?, 'correction_applied', ?, ?, 'completed')")
      .bind(uuid(), verified.participant_id, now, now)
  ]);
  return response({ completed: true, corrected: true, statement: "The verified email address and assessment data were not changed." }, 200, origin);
}

async function requireAdmin(request, env) {
  const supplied = String(request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!env.ADMIN_TOKEN || !supplied || !(await verifyHmac(env.HASH_SECRET, supplied, await hmac(env.HASH_SECRET, env.ADMIN_TOKEN)))) {
    throw new HttpError(401, "Administrator authentication is required.");
  }
}

async function adminSummary(request, env) {
  await requireAdmin(request, env);
  const counts = await env.DB.prepare(`SELECT event_name, COUNT(*) AS event_count,
    COUNT(DISTINCT session_id) AS session_count FROM beta_events GROUP BY event_name ORDER BY event_name`).all();
  const totals = await env.DB.prepare(`SELECT
    (SELECT COUNT(*) FROM beta_sessions) AS sessions,
    (SELECT COUNT(*) FROM beta_participants) AS verified_participants,
    (SELECT COUNT(*) FROM beta_feedback WHERE contact_mode = 'without_contact') AS feedback_without_contact,
    (SELECT COUNT(*) FROM beta_feedback WHERE contact_mode = 'contactable') AS contactable_feedback`).first();
  await env.DB.prepare("INSERT INTO admin_audit (id, action, occurred_at, detail) VALUES (?, 'summary_viewed', ?, '')")
    .bind(uuid(), nowIso()).run();
  return response({ generated_at: nowIso(), service_version: SERVICE_VERSION, totals, events: counts.results || [], caveat: "Download events mean requested, not completed. Team or repeated use must not be treated as unique organisations." });
}

async function adminParticipants(request, env) {
  await requireAdmin(request, env);
  const rows = await env.DB.prepare(`SELECT p.id, p.encrypted_profile, p.verified_at, p.last_seen_at, p.retention_at,
    MAX(CASE WHEN c.purpose = 'research_contact' THEN c.granted ELSE 0 END) AS research_contact,
    MAX(CASE WHEN c.purpose = 'newsletter' THEN c.granted ELSE 0 END) AS newsletter
    FROM beta_participants p LEFT JOIN contact_preferences c ON c.participant_id = p.id
    GROUP BY p.id ORDER BY p.verified_at DESC LIMIT 500`).all();
  const participants = [];
  for (const row of rows.results || []) participants.push({
    id: row.id,
    ...(await decryptJson(env, row.encrypted_profile)),
    verified_at: row.verified_at,
    last_seen_at: row.last_seen_at,
    retention_at: row.retention_at,
    research_contact: Boolean(row.research_contact),
    newsletter: Boolean(row.newsletter)
  });
  await env.DB.prepare("INSERT INTO admin_audit (id, action, occurred_at, detail) VALUES (?, 'participants_exported', ?, ?)")
    .bind(uuid(), nowIso(), `count:${participants.length}`).run();
  return response({ generated_at: nowIso(), participants, statement: "This export contains beta administration data and no assessment responses or report content." });
}

async function scheduledRetention(env) {
  const now = nowIso();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM verification_challenges WHERE expires_at < ?").bind(now),
    env.DB.prepare("DELETE FROM rate_limits WHERE expires_at < ?").bind(now),
    env.DB.prepare("DELETE FROM beta_feedback WHERE retention_at < ?").bind(now),
    env.DB.prepare("DELETE FROM beta_sessions WHERE retention_at < ?").bind(now),
    env.DB.prepare("DELETE FROM beta_participants WHERE retention_at < ?").bind(now),
    env.DB.prepare("DELETE FROM rights_requests WHERE requested_at < datetime(?, '-24 months')").bind(now),
    env.DB.prepare("DELETE FROM admin_audit WHERE occurred_at < datetime(?, '-12 months')").bind(now)
  ]);
}

export async function handleRequest(request, env) {
  const url = new URL(request.url);
  const origin = allowedOrigin(request, env);
  if (request.method === "GET" && url.pathname === "/health") {
    return response({ ok: true, service: "hdrl-beta-service", version: SERVICE_VERSION, environment: env.ENVIRONMENT || "unknown", result_storage: false });
  }
  if (request.method === "GET" && url.pathname === "/v1/admin/summary") return adminSummary(request, env);
  if (request.method === "GET" && url.pathname === "/v1/admin/participants") return adminParticipants(request, env);
  if (!origin) return response({ error: "origin_not_allowed", message: "This service accepts requests only from the HDRL assessment." }, 403);
  if (request.method === "OPTIONS") return noContent(origin);
  if (request.method === "POST" && url.pathname === "/v1/sessions") return createSession(request, env, origin);
  if (request.method === "POST" && url.pathname === "/v1/events") return acceptEvents(request, env, origin);
  if (request.method === "POST" && url.pathname === "/v1/telemetry/disable") return disableTelemetry(request, env, origin);
  if (request.method === "POST" && url.pathname === "/v1/verification/request") return requestVerification(request, env, origin);
  if (request.method === "POST" && url.pathname === "/v1/verification/confirm") return confirmVerification(request, env, origin);
  if (request.method === "POST" && url.pathname === "/v1/feedback") return acceptFeedback(request, env, origin);
  if (request.method === "POST" && url.pathname === "/v1/privacy/request") return requestPrivacyAction(request, env, origin);
  if (request.method === "POST" && url.pathname === "/v1/privacy/confirm") return confirmPrivacyAction(request, env, origin);
  if (request.method === "POST" && url.pathname === "/v1/privacy/correct") return correctParticipant(request, env, origin);
  return response({ error: "not_found", message: "Route not found." }, 404, origin);
}

export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env);
    } catch (error) {
      if (error instanceof HttpError) return response({ error: error.code, message: error.message }, error.status, allowedOrigin(request, env));
      return response({ error: "service_error", message: "The beta service is temporarily unavailable. No assessment information has been received." }, 503, allowedOrigin(request, env));
    }
  },
  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(scheduledRetention(env));
  }
};

export const __test = {
  EVENT_ALLOWLIST,
  FEEDBACK_CONTEXT_ALLOWLIST,
  PRIVACY_NOTICE_VERSION,
  cleanEventProperties,
  cleanFeedbackContext,
  cleanOperationalProperty,
  cleanEmail,
  encryptJson,
  decryptJson,
  hmac,
  verifyHmac
};
