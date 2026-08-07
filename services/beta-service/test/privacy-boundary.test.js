import test from "node:test";
import assert from "node:assert/strict";
import { __test } from "../src/index.js";

test("event properties are constrained to the server allow-list", () => {
  assert.deepEqual(__test.cleanEventProperties("snapshot_completed", {
    completed_indicator_count: 64,
    completed_domain_count: 8,
    active_time_band: "30_to_60_minutes"
  }), {
    completed_indicator_count: 64,
    completed_domain_count: 8,
    active_time_band: "30_to_60_minutes"
  });
  assert.throws(() => __test.cleanEventProperties("snapshot_completed", {
    completed_indicator_count: 64,
    level: "L4"
  }), /does not accept/);
  assert.throws(() => __test.cleanEventProperties("snapshot_completed", {
    completed_indicator_count: 6400
  }), /invalid/);
});

test("unknown event names are rejected", () => {
  assert.throws(() => __test.cleanEventProperties("assessment_score", { level: "L5" }));
});

test("feedback context cannot carry assessment content", () => {
  assert.deepEqual(__test.cleanFeedbackContext({
    tool_version: "0.4.0-beta",
    indicator_ref: "A.1.1",
    completed_indicator_count: 3
  }), {
    tool_version: "0.4.0-beta",
    indicator_ref: "A.1.1",
    completed_indicator_count: 3
  });
  assert.throws(() => __test.cleanFeedbackContext({
    tool_version: "0.4.0-beta",
    level: "L2"
  }), /does not accept/);
});

test("free-form text cannot be hidden inside an allow-listed property", () => {
  assert.throws(() => __test.cleanOperationalProperty("domain_ref", "A: internal programme name"), /invalid/);
  assert.throws(() => __test.cleanOperationalProperty("view", "report with sensitive note"), /invalid/);
  assert.equal(__test.cleanOperationalProperty("domain_ref", "A"), "A");
});

test("email validation normalises without broadening accepted fields", () => {
  assert.equal(__test.cleanEmail(" Person@Example.org "), "person@example.org");
  assert.throws(() => __test.cleanEmail("not-an-email"));
});

test("encryption round-trips profile metadata", async () => {
  const bytes = new Uint8Array(32).fill(7);
  const env = { DATA_ENCRYPTION_KEY_BASE64: Buffer.from(bytes).toString("base64") };
  const encrypted = await __test.encryptJson(env, { email: "person@example.org", role: "Analyst" });
  assert.equal(encrypted.includes("person@example.org"), false);
  assert.deepEqual(await __test.decryptJson(env, encrypted), { email: "person@example.org", role: "Analyst" });
});

test("receipts and digests use verifiable keyed HMACs", async () => {
  const secret = "a-strong-test-secret-that-is-long-enough";
  const signature = await __test.hmac(secret, "payload");
  assert.equal(await __test.verifyHmac(secret, "payload", signature), true);
  assert.equal(await __test.verifyHmac(secret, "changed", signature), false);
});
