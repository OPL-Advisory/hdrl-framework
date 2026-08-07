import test from "node:test";
import assert from "node:assert/strict";
import { cleanFeedback, cleanProfile } from "../functions/_shared/privacy-boundary.mjs";

test("profile accepts only beta-administration fields", () => {
  const profile = cleanProfile({
    name: "Test person",
    role: "Reviewer",
    organisation: "Example organisation",
    region: "UK",
    service_type: "Data service",
    scale: "Regional",
    use_mode: "Individual exploration",
    report_use: "Beta testing",
    research_contact: false,
    newsletter: false,
    privacy_notice_version: "beta-v0.3",
    contact_wording_version: "contact-v0.3"
  });
  assert.equal(profile.organisation, "Example organisation");
  assert.throws(() => cleanProfile({ ...profile, maturity_level: "L4" }), /does not accept/);
});

test("feedback without contact has no identity field", () => {
  const feedback = cleanFeedback({
    mode: "without_contact",
    rating: 4,
    category: "suggestion",
    comment: "Synthetic feedback",
    context: { tool_version: "0.5.0-beta", completed_indicator_count: 16, viewport_band: "desktop" }
  });
  assert.deepEqual(Object.keys(feedback).sort(), ["category", "comment", "context", "mode", "rating"]);
});

test("assessment content is rejected from feedback and context", () => {
  assert.throws(() => cleanFeedback({
    mode: "without_contact",
    rating: 4,
    category: "suggestion",
    comment: "Synthetic feedback",
    context: { maturity_level: "L4" }
  }), /does not accept/);
  assert.throws(() => cleanFeedback({
    mode: "without_contact",
    rating: 4,
    category: "suggestion",
    comment: "Synthetic feedback",
    context: { domain_ref: "A: confidential programme" }
  }), /invalid/);
});
