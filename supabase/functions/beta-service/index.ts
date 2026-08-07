import { createClient } from "npm:@supabase/supabase-js@2";
import { BoundaryError, cleanFeedback, cleanProfile } from "../_shared/privacy-boundary.mjs";

const SERVICE_VERSION = "0.3.0";
const ALLOWED_ORIGINS = new Set([
  "https://hdrlframework.org",
  "http://127.0.0.1:8123",
  "http://localhost:8123"
]);
const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store, max-age=0",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer"
};

function keyDictionary(name) {
  try {
    const parsed = JSON.parse(Deno.env.get(name) || "{}");
    return Object.values(parsed).filter((value) => typeof value === "string" && value.length > 20);
  } catch {
    return [];
  }
}

function projectKeys(dictionaryName, legacyName) {
  const keys = keyDictionary(dictionaryName);
  const legacy = Deno.env.get(legacyName) || "";
  if (legacy.length > 20) keys.push(legacy);
  return [...new Set(keys)];
}

function requirePublishableKey(request, keys) {
  const supplied = request.headers.get("apikey") || "";
  if (!keys.includes(supplied)) {
    throw new BoundaryError(401, "The beta service is not enabled for this client.", "invalid_client");
  }
}

function json(body, status = 200, origin = "") {
  const headers = new Headers(JSON_HEADERS);
  if (origin) {
    headers.set("access-control-allow-origin", origin);
    headers.set("vary", "Origin");
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function preflight(origin) {
  return new Response(null, { status: 204, headers: {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "Authorization,Content-Type,apikey",
    "access-control-max-age": "600",
    "vary": "Origin"
  }});
}

async function readJson(request, maximum = 8192) {
  if (!String(request.headers.get("content-type") || "").toLowerCase().startsWith("application/json")) {
    throw new BoundaryError(415, "Use application/json.");
  }
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > maximum) throw new BoundaryError(413, "The request is too large.");
  const text = await request.text();
  if (text.length > maximum) throw new BoundaryError(413, "The request is too large.");
  try { return JSON.parse(text); }
  catch { throw new BoundaryError(400, "The JSON could not be read."); }
}

async function digest(value) {
  const secret = Deno.env.get("RATE_LIMIT_SECRET") || "";
  if (secret.length < 24) throw new Error("RATE_LIMIT_SECRET is not configured");
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const signed = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
  return Array.from(signed, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function takeRateLimit(admin, request, route, subject, limit, minutes = 60) {
  const source = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("cf-connecting-ip") || "unknown";
  const now = new Date();
  const windowMs = minutes * 60000;
  const windowStart = new Date(Math.floor(now.getTime() / windowMs) * windowMs).toISOString();
  const keyDigest = await digest(`${now.toISOString().slice(0, 10)}:${source}:${subject}`);
  const { data: hits, error } = await admin.rpc("take_beta_rate_limit", {
    p_key_digest: keyDigest,
    p_route: route,
    p_window_start: windowStart,
    p_expires_at: new Date(new Date(windowStart).getTime() + windowMs * 2).toISOString()
  });
  if (error) throw error;
  if (hits > limit) throw new BoundaryError(429, "Too many attempts. Try again later.", "rate_limited");
}

async function authenticatedUser(request, supabaseUrl, anonKey) {
  const authorization = request.headers.get("authorization") || "";
  if (!authorization.startsWith("Bearer ")) throw new BoundaryError(401, "Verified email access is required.");
  const client = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { data, error } = await client.auth.getUser();
  if (error || !data.user?.id || !data.user.email) throw new BoundaryError(401, "Verified email access is required.");
  return data.user;
}

async function handle(request) {
  const url = new URL(request.url);
  const origin = request.headers.get("origin") || "";
  const route = url.pathname.split("/").filter(Boolean).at(-1) || "";
  if (request.method === "GET" && route === "health") {
    return json({ ok: true, service: "hdrl-supabase-beta-service", version: SERVICE_VERSION, result_storage: false });
  }
  if (!ALLOWED_ORIGINS.has(origin)) return json({ error: "origin_not_allowed", message: "This service accepts requests only from the HDRL assessment." }, 403);
  if (request.method === "OPTIONS") return preflight(origin);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const publishableKeys = projectKeys("SUPABASE_PUBLISHABLE_KEYS", "SUPABASE_ANON_KEY");
  const secretKeys = projectKeys("SUPABASE_SECRET_KEYS", "SUPABASE_SERVICE_ROLE_KEY");
  requirePublishableKey(request, publishableKeys);
  const anonKey = publishableKeys[0] || "";
  const serviceRole = secretKeys[0] || "";
  if (!supabaseUrl || !anonKey || !serviceRole) throw new Error("project_keys_unavailable");
  const admin = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false, autoRefreshToken: false } });

  if (request.method === "POST" && route === "participant") {
    const user = await authenticatedUser(request, supabaseUrl, anonKey);
    await takeRateLimit(admin, request, "participant", user.id, 20, 60);
    const profile = cleanProfile(await readJson(request));
    const now = new Date();
    const { error: profileError } = await admin.from("beta_participants").upsert({
      user_id: user.id,
      name: profile.name,
      role: profile.role,
      organisation: profile.organisation,
      region: profile.region,
      service_type: profile.service_type,
      scale: profile.scale,
      use_mode: profile.use_mode,
      report_use: profile.report_use,
      privacy_notice_version: profile.privacy_notice_version,
      last_seen_at: now.toISOString(),
      retention_at: new Date(now.getTime() + 365 * 86400000).toISOString()
    });
    if (profileError) throw profileError;
    const preferences = [
      ["research_contact", profile.research_contact],
      ["newsletter", profile.newsletter]
    ].map(([purpose, granted]) => ({
      user_id: user.id,
      purpose,
      granted,
      wording_version: profile.contact_wording_version,
      recorded_at: now.toISOString(),
      withdrawn_at: granted ? null : now.toISOString()
    }));
    const { error: preferenceError } = await admin.from("beta_contact_preferences").upsert(preferences);
    if (preferenceError) throw preferenceError;
    return json({ registered: true, email_verified: true, statement: "Assessment responses and reports were not received." }, 200, origin);
  }

  if (request.method === "POST" && route === "feedback") {
    const feedback = cleanFeedback(await readJson(request));
    let userId = null;
    if (feedback.mode === "contactable") userId = (await authenticatedUser(request, supabaseUrl, anonKey)).id;
    await takeRateLimit(admin, request, "feedback", feedback.mode, 20, 60);
    const { error } = await admin.from("beta_feedback").insert({
      contact_mode: feedback.mode,
      user_id: userId,
      rating: feedback.rating,
      category: feedback.category,
      comment: feedback.comment,
      context: feedback.context
    });
    if (error) throw error;
    return json({ received: true, contact_mode: feedback.mode }, 201, origin);
  }

  if (request.method === "GET" && route === "export") {
    const user = await authenticatedUser(request, supabaseUrl, anonKey);
    const [
      { data: participant, error: participantError },
      { data: preferences, error: preferenceError },
      { data: feedback, error: feedbackError }
    ] = await Promise.all([
      admin.from("beta_participants").select("name,role,organisation,region,service_type,scale,use_mode,report_use,privacy_notice_version,verified_at,last_seen_at,retention_at").eq("user_id", user.id).maybeSingle(),
      admin.from("beta_contact_preferences").select("purpose,granted,wording_version,recorded_at,withdrawn_at").eq("user_id", user.id),
      admin.from("beta_feedback").select("id,rating,category,comment,context,received_date,retention_at").eq("user_id", user.id)
    ]);
    if (participantError || preferenceError || feedbackError) throw participantError || preferenceError || feedbackError;
    await admin.from("beta_privacy_requests").insert({ request_type: "access_export", completed_at: new Date().toISOString(), status: "completed" });
    return json({ email: user.email, participant, preferences: preferences || [], contactable_feedback: feedback || [], statement: "Assessment responses, evidence and reports are not held by this service." }, 200, origin);
  }

  if (request.method === "POST" && route === "correct") {
    const user = await authenticatedUser(request, supabaseUrl, anonKey);
    const profile = cleanProfile(await readJson(request));
    const correctedAt = new Date().toISOString();
    const { error } = await admin.from("beta_participants").update({
      name: profile.name,
      role: profile.role,
      organisation: profile.organisation,
      region: profile.region,
      service_type: profile.service_type,
      scale: profile.scale,
      use_mode: profile.use_mode,
      report_use: profile.report_use,
      privacy_notice_version: profile.privacy_notice_version,
      last_seen_at: correctedAt
    }).eq("user_id", user.id);
    if (error) throw error;
    const preferences = [
      ["research_contact", profile.research_contact],
      ["newsletter", profile.newsletter]
    ].map(([purpose, granted]) => ({
      user_id: user.id,
      purpose,
      granted,
      wording_version: profile.contact_wording_version,
      recorded_at: correctedAt,
      withdrawn_at: granted ? null : correctedAt
    }));
    const { error: preferenceError } = await admin.from("beta_contact_preferences").upsert(preferences);
    if (preferenceError) throw preferenceError;
    await admin.from("beta_privacy_requests").insert({ request_type: "correction_applied", completed_at: new Date().toISOString(), status: "completed" });
    return json({ corrected: true, email_change_note: "Contact privacy@hdrlframework.org to change the verified email address." }, 200, origin);
  }

  if (request.method === "POST" && route === "delete") {
    const user = await authenticatedUser(request, supabaseUrl, anonKey);
    await takeRateLimit(admin, request, "delete", user.id, 3, 60);
    const completed = new Date().toISOString();
    const { error: feedbackError } = await admin.from("beta_feedback").delete().eq("user_id", user.id);
    if (feedbackError) throw feedbackError;
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
    if (deleteError) {
      await admin.from("beta_privacy_requests").insert({ request_type: "deletion_failed", completed_at: completed, status: "failed", detail: "Auth deletion failed; operator review required." });
      throw deleteError;
    }
    await admin.from("beta_privacy_requests").insert({ request_type: "deletion_completed", completed_at: completed, status: "completed" });
    return json({ deleted: true, recovery_note: "Provider recovery copies expire under the approved Supabase backup schedule." }, 200, origin);
  }

  return json({ error: "not_found", message: "Route not found." }, 404, origin);
}

Deno.serve(async (request) => {
  try { return await handle(request); }
  catch (error) {
    const requestOrigin = request.headers.get("origin") || "";
    const safeOrigin = ALLOWED_ORIGINS.has(requestOrigin) ? requestOrigin : "";
    if (error instanceof BoundaryError) return json({ error: error.code, message: error.message }, error.status, safeOrigin);
    const diagnostic = String(error?.code || error?.name || "unknown_error")
      .replace(/[^A-Za-z0-9_.:-]/g, "_")
      .slice(0, 80);
    console.error(`HDRL beta service error: ${diagnostic}`);
    return json({
      error: "service_error",
      reference: diagnostic,
      message: "The beta service is temporarily unavailable. No assessment information has been received."
    }, 503, safeOrigin);
  }
});
