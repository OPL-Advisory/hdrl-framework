PRAGMA foreign_keys = ON;

CREATE TABLE beta_sessions (
  id TEXT PRIMARY KEY,
  schema_version TEXT NOT NULL,
  tool_version TEXT NOT NULL,
  framework_version TEXT NOT NULL,
  catalogue_version TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_event_at TEXT NOT NULL,
  retention_at TEXT NOT NULL,
  participant_id TEXT,
  telemetry_disabled_at TEXT,
  FOREIGN KEY (participant_id) REFERENCES beta_participants(id) ON DELETE SET NULL
);

CREATE TABLE beta_events (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  properties_json TEXT NOT NULL DEFAULT '{}',
  schema_version TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES beta_sessions(id) ON DELETE CASCADE
);

CREATE TABLE beta_participants (
  id TEXT PRIMARY KEY,
  email_digest TEXT NOT NULL UNIQUE,
  encrypted_profile TEXT NOT NULL,
  verified_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  retention_at TEXT NOT NULL,
  privacy_notice_version TEXT NOT NULL
);

CREATE TABLE contact_preferences (
  participant_id TEXT NOT NULL,
  purpose TEXT NOT NULL,
  granted INTEGER NOT NULL CHECK (granted IN (0, 1)),
  wording_version TEXT NOT NULL,
  recorded_at TEXT NOT NULL,
  withdrawn_at TEXT,
  PRIMARY KEY (participant_id, purpose),
  FOREIGN KEY (participant_id) REFERENCES beta_participants(id) ON DELETE CASCADE
);

CREATE TABLE verification_challenges (
  id TEXT PRIMARY KEY,
  purpose TEXT NOT NULL,
  session_id TEXT,
  email_digest TEXT NOT NULL,
  encrypted_payload TEXT NOT NULL,
  code_digest TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  FOREIGN KEY (session_id) REFERENCES beta_sessions(id) ON DELETE CASCADE
);

CREATE TABLE beta_feedback (
  id TEXT PRIMARY KEY,
  contact_mode TEXT NOT NULL CHECK (contact_mode IN ('without_contact', 'contactable')),
  participant_id TEXT,
  rating INTEGER CHECK (rating IS NULL OR (rating BETWEEN 1 AND 5)),
  category TEXT,
  comment TEXT,
  context_json TEXT NOT NULL DEFAULT '{}',
  received_date TEXT NOT NULL,
  retention_at TEXT NOT NULL,
  FOREIGN KEY (participant_id) REFERENCES beta_participants(id) ON DELETE SET NULL
);

CREATE TABLE rights_requests (
  id TEXT PRIMARY KEY,
  participant_id TEXT,
  request_type TEXT NOT NULL,
  requested_at TEXT NOT NULL,
  completed_at TEXT,
  status TEXT NOT NULL,
  FOREIGN KEY (participant_id) REFERENCES beta_participants(id) ON DELETE SET NULL
);

CREATE TABLE rate_limits (
  key_digest TEXT NOT NULL,
  route TEXT NOT NULL,
  window_start TEXT NOT NULL,
  hits INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  PRIMARY KEY (key_digest, route, window_start)
);

CREATE TABLE admin_audit (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT ''
);

CREATE INDEX idx_beta_events_session ON beta_events(session_id, occurred_at);
CREATE INDEX idx_beta_events_name_date ON beta_events(event_name, occurred_at);
CREATE INDEX idx_beta_sessions_retention ON beta_sessions(retention_at);
CREATE INDEX idx_beta_sessions_participant ON beta_sessions(participant_id);
CREATE INDEX idx_beta_participants_retention ON beta_participants(retention_at);
CREATE INDEX idx_challenges_expiry ON verification_challenges(expires_at);
CREATE INDEX idx_feedback_retention ON beta_feedback(retention_at);
CREATE INDEX idx_rate_limits_expiry ON rate_limits(expires_at);

PRAGMA optimize;
