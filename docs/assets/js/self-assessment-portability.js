/* Pure, offline validation of full assessment backups. No storage or rendering. */
(() => {
  "use strict";

  const MAX_BYTES = 2 * 1024 * 1024;
  const MAX_DEPTH = 32;
  const VERSIONS = Object.freeze({ framework: "1.0.1", catalogue: "1.0.2", tool: "0.5.0-beta",
    guidance: "0.2.0", rules: "0.2.0", report: "0.4.0", beta: "0.3.0" });
  const CATALOGUE_PIN = "442a10be23a0ddec889785577fb8853db2296cc5b3a50929849025e27077cd47";
  const GUIDANCE_PIN = "1118cb773ca4ecc2bff06d2612d14b756134bda04603c43dd18604f4df36f92f";
  const SCHEMAS = ["hdrl-self-assessment-export-v0.4.0", "hdrl-self-assessment-export-v0.5.0"];
  const PRIVATE_FIELDS = ["registration", "contact", "contacts", "consent", "consents", "beta",
    "session", "sessions", "settings", "auth", "accessToken", "refreshToken", "analytics", "telemetry"];
  const STATUS = ["unstarted", "rated", "not_known", "not_assessed", "not_applicable"];
  const CERTAINTY = ["", "low", "medium", "high"];
  const LEVEL = ["", "L1", "L2", "L3", "L4", "L5"];
  const FORBIDDEN_KEYS = new Set(["__proto__", "prototype", "constructor"]);
  const has = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const fail = (message) => { throw new Error(message); };
  const require = (condition, message) => { if (!condition) fail(message); };

  function validUnicode(value) {
    for (let i = 0; i < value.length; i += 1) {
      const code = value.charCodeAt(i);
      if (code >= 0xd800 && code <= 0xdbff) {
        const next = value.charCodeAt(++i);
        if (!(next >= 0xdc00 && next <= 0xdfff)) return false;
      } else if (code >= 0xdc00 && code <= 0xdfff) return false;
    }
    return true;
  }

  // JSON.parse alone silently accepts duplicate keys. This bounded syntax pass
  // compares decoded keys, including escaped-equivalent spellings, first.
  function parseJson(text) {
    require(typeof text === "string", "Choose a full assessment JSON backup.");
    require(text.length <= MAX_BYTES && new TextEncoder().encode(text).byteLength <= MAX_BYTES,
      "The backup exceeds the 2 MiB restore limit.");
    let cursor = 0;
    const space = () => { while (/[\x20\t\r\n]/.test(text[cursor] || "\0")) cursor += 1; };
    function string() {
      const start = cursor++;
      while (cursor < text.length) {
        const char = text[cursor++];
        if (char === '"') {
          let value;
          try { value = JSON.parse(text.slice(start, cursor)); }
          catch { fail("The backup contains an invalid JSON string."); }
          require(validUnicode(value), "The backup contains an invalid Unicode string.");
          return value;
        }
        if (char === "\\") cursor += 1;
      }
      fail("The backup contains an unfinished JSON string.");
    }
    function value(depth) {
      require(depth <= MAX_DEPTH, "The backup is nested too deeply.");
      space();
      const first = text[cursor];
      if (first === '"') { string(); return; }
      if (first === "{" || first === "[") {
        const object = first === "{";
        const close = object ? "}" : "]";
        const keys = new Set();
        cursor += 1; space();
        if (text[cursor] === close) { cursor += 1; return; }
        while (cursor < text.length) {
          if (object) {
            require(text[cursor] === '"', "The backup contains an invalid JSON object.");
            const key = string();
            require(!keys.has(key), "The backup contains a duplicate JSON field.");
            require(!FORBIDDEN_KEYS.has(key), "The backup contains an unsafe object field.");
            keys.add(key); space();
            require(text[cursor++] === ":", "The backup contains an invalid JSON object.");
          }
          value(depth + 1); space();
          if (text[cursor] === close) { cursor += 1; return; }
          require(text[cursor++] === ",", "The backup contains invalid JSON punctuation.");
          space();
        }
        fail("The backup contains an unfinished JSON container.");
      }
      const token = /^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(text.slice(cursor));
      require(token, "The backup is not valid JSON.");
      if (!/^(true|false|null)$/.test(token[0])) {
        const number = Number(token[0]);
        require(Number.isFinite(number) && Math.abs(number) <= Number.MAX_SAFE_INTEGER
          && !Object.is(number, -0)
          && !(number === 0 && /[1-9]/.test(token[0].split(/[eE]/)[0])),
        "The backup contains an unsupported numeric value.");
      }
      cursor += token[0].length;
    }
    value(0); space();
    require(cursor === text.length, "The backup contains trailing or invalid JSON content.");
    try { return JSON.parse(text); }
    catch { fail("The backup is not valid JSON."); }
  }

  function object(value, name, fields, required = fields) {
    require(value !== null && typeof value === "object" && !Array.isArray(value), `${name} must be an object.`);
    for (const key of Object.keys(value)) require(fields.includes(key), `${name} contains an unsupported field: ${key}.`);
    for (const key of required) require(has(value, key), `${name} is missing ${key}.`);
    return value;
  }

  function text(value, name, limit = 20000, nonempty = false) {
    require(typeof value === "string" && value.length <= limit && (!nonempty || value.trim().length),
      `${name} must be ${nonempty ? "non-empty " : ""}text of at most ${limit} characters.`);
    return value;
  }

  function choice(value, allowed, name) {
    require(typeof value === "string" && allowed.includes(value), `${name} has an unsupported value.`);
    return value;
  }

  function calendar(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return false;
    const [, year, month, day] = match.map(Number);
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    return year >= 1 && month >= 1 && month <= 12 && day >= 1
      && day <= [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  }

  function date(value, name, allowEmpty = true, allowNull = false) {
    if ((allowNull && value === null) || (allowEmpty && value === "")) return value;
    require(typeof value === "string" && calendar(value), `${name} must be a valid date.`);
    return value;
  }

  function timestamp(value, name, nullable = true) {
    if (nullable && value === null) return null;
    require(typeof value === "string", `${name} must be an ISO timestamp or null.`);
    const parts = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/.exec(value);
    require(parts && calendar(parts[1]) && +parts[2] < 24 && +parts[3] < 60 && +parts[4] < 60,
      `${name} must be a valid ISO timestamp.`);
    if (parts[5] !== "Z") {
      const hours = +parts[5].slice(1, 3), minutes = +parts[5].slice(4, 6);
      require(hours <= 14 && minutes < 60 && (hours < 14 || minutes === 0), `${name} has an invalid timezone.`);
    }
    require(Number.isFinite(Date.parse(value)), `${name} must be a valid ISO timestamp.`);
    return value;
  }

  function mapped(value, name, refs, clean) {
    object(value, name, [...refs], []);
    return Object.fromEntries(Object.entries(value).map(([ref, item]) => [ref, clean(item, `${name}.${ref}`)]));
  }

  function responseBase(value, name, snapshot) {
    const fields = snapshot
      ? ["status", "level", "certainty", "certaintyReasons", "clarity", "note", "updatedAt"]
      : ["decision", "status", "level", "certainty", "rationale", "improvementNote", "statusReason", "evidence", "updatedAt"];
    object(value, name, fields);
    const status = choice(value.status, STATUS, `${name}.status`);
    const level = choice(value.level, LEVEL, `${name}.level`);
    const certainty = choice(value.certainty, CERTAINTY, `${name}.certainty`);
    if (status !== "rated") require(!level && !certainty, `${name}: a non-rated response cannot carry a level or certainty.`);
    if (snapshot && status === "rated") require(level && certainty, `${name}: a rated snapshot needs both level and certainty.`);
    return { status, level, certainty, updatedAt: timestamp(value.updatedAt, `${name}.updatedAt`) };
  }

  function snapshot(value, name) {
    const result = responseBase(value, name, true);
    require(Array.isArray(value.certaintyReasons) && value.certaintyReasons.length <= 5
      && new Set(value.certaintyReasons).size === value.certaintyReasons.length,
    `${name}.certaintyReasons must be a list of distinct known reasons.`);
    result.certaintyReasons = value.certaintyReasons.map((reason) => choice(reason,
      ["knowledge_gap", "evidence_gap", "descriptors_overlap", "scope_unclear", "other"], `${name}.certaintyReasons`));
    require(result.certainty === "low" || !result.certaintyReasons.length,
      `${name}: certainty reasons require low certainty.`);
    result.clarity = choice(value.clarity, ["", "clear", "some_overlap", "unclear"], `${name}.clarity`);
    result.note = text(value.note, `${name}.note`);
    return result;
  }

  function evidenceItem(value, name) {
    const fields = ["id", "title", "type", "reference", "owner", "date", "note", "limitations", "reviewStatus"];
    object(value, name, fields);
    return {
      id: text(value.id, `${name}.id`, 200, true), title: text(value.title, `${name}.title`, 20000, true),
      type: choice(value.type, ["", "Policy or strategy", "Process or operating record", "Performance metric",
        "Assurance or audit", "Transparency publication", "Stakeholder testimony", "Other"], `${name}.type`),
      reference: text(value.reference, `${name}.reference`), owner: text(value.owner, `${name}.owner`),
      date: date(value.date, `${name}.date`), note: text(value.note, `${name}.note`),
      limitations: text(value.limitations, `${name}.limitations`),
      reviewStatus: choice(value.reviewStatus, ["unreviewed", "reviewed", "accepted", "needs_update"], `${name}.reviewStatus`)
    };
  }

  function evidenceResponse(value, name, incomplete) {
    const result = responseBase(value, name, false);
    result.decision = choice(value.decision, ["", "rated", "not_judged"], `${name}.decision`);
    require(result.status === "rated" ? result.decision === "rated"
      : result.status === "unstarted" ? result.decision !== "rated" : result.decision === "not_judged",
    `${name}: decision and status disagree.`);
    for (const key of ["rationale", "improvementNote", "statusReason"]) result[key] = text(value[key], `${name}.${key}`);
    require(Array.isArray(value.evidence), `${name}.evidence must be a list.`);
    result.evidence = value.evidence.map((item, index) => evidenceItem(item, `${name}.evidence[${index}]`));
    require(new Set(result.evidence.map((item) => item.id)).size === result.evidence.length,
      `${name}: evidence reference identifiers must be distinct within a response.`);
    if ((result.status === "rated" && (!result.level || !result.certainty))
        || (result.decision === "not_judged" && result.status === "unstarted")
        || (["not_known", "not_assessed", "not_applicable"].includes(result.status) && !result.statusReason.trim())) incomplete.push(name);
    return result;
  }

  function parseBackup(raw, catalogue) {
    const data = parseJson(raw);
    if (typeof data?.schema === "string" && data.schema.startsWith("hdrl-explicit-results-share"))
      fail("This minimised share is not a full backup. Choose the full assessment JSON backup.");
    if (typeof data?.export_schema === "string" && data.export_schema.startsWith("hdrl-self-assessment-recovery"))
      fail("This recovery file preserves an unsupported draft. Choose a compatible full assessment JSON backup.");
    const envelope = ["export_schema", "exported_at", "versions", "provenance", "generated_by", "assessment", "derived", "limitations"];
    object(data, "Backup", [...envelope, ...PRIVATE_FIELDS], ["export_schema", "versions", "provenance", "assessment"]);
    choice(data.export_schema, SCHEMAS, "Backup format (use full assessment JSON, not a share or recovery file)");
    if (has(data, "exported_at")) timestamp(data.exported_at, "exported_at", false);
    object(data.versions, "versions", Object.keys(VERSIONS));
    for (const [key, expected] of Object.entries(VERSIONS)) require(data.versions[key] === expected,
      `This backup needs its original ${key} version; it cannot be relabelled.`);
    object(data.provenance, "provenance", ["status", "catalogue_sha256", "guidance_sha256", "implementation_candidate"]);
    require(data.provenance.status === "recorded" && data.provenance.catalogue_sha256 === CATALOGUE_PIN
      && data.provenance.guidance_sha256 === GUIDANCE_PIN, "The backup does not identify this exact method.");
    text(data.provenance.implementation_candidate, "provenance.implementation_candidate", 200, true);
    require(catalogue?.framework?.version === VERSIONS.framework && catalogue?.catalogue_version === VERSIONS.catalogue
      && catalogue?.indicator_count === 64 && Array.isArray(catalogue.indicators) && catalogue.indicators.length === 64,
    "The current catalogue is unavailable or incompatible.");
    const refs = new Set(catalogue.indicators.map((item) => item.ref));
    require(refs.size === 64 && [...refs].every((ref) => typeof ref === "string" && /^[A-H]\.\d+\.\d+$/.test(ref)),
      "The current catalogue has invalid indicator references.");
    const domains = new Set("ABCDEFGH".split(""));
    const fields = ["id", "created_at", "updated_at", "boundary", "rapid_first_pass", "whole_framework_snapshot",
      "domain_capacity_notes", "evidence_led_responses", "audit"];
    const assessment = object(data.assessment, "assessment", [...fields, "declared_context", ...PRIVATE_FIELDS], fields);
    const legacy = data.export_schema === SCHEMAS[0];
    require(!legacy || !has(assessment, "declared_context"), "The older backup format cannot declare a newer context field.");
    const context = legacy ? "unspecified" : choice(assessment.declared_context,
      ["synthetic", "real", "unspecified"], "assessment.declared_context");
    const boundaryFields = ["title", "serviceName", "scope", "timePeriod", "assessmentDate", "unit", "method", "intendedUse"];
    object(assessment.boundary, "assessment.boundary", boundaryFields);
    const boundary = {};
    for (const key of ["title", "serviceName", "scope", "timePeriod", "intendedUse"])
      boundary[key] = text(assessment.boundary[key], `boundary.${key}`);
    boundary.assessmentDate = date(assessment.boundary.assessmentDate, "boundary.assessmentDate", true, true);
    boundary.unit = choice(assessment.boundary.unit, ["", "system", "service", "dual"], "boundary.unit");
    boundary.method = choice(assessment.boundary.method, ["", "individual", "team"], "boundary.method");
    const rapid = mapped(assessment.rapid_first_pass, "rapid_first_pass", domains, (item, name) => {
      object(item, name, ["impression", "certainty", "note"]);
      const impression = choice(item.impression, ["", "starting", "developing", "defined", "managed", "improving", "not_known", "not_assessed"], `${name}.impression`);
      const certainty = choice(item.certainty, CERTAINTY, `${name}.certainty`);
      require(!["", "not_known", "not_assessed"].includes(impression) ? Boolean(certainty) : !certainty,
        `${name}: impression and certainty disagree.`);
      return { impression, certainty, note: text(item.note, `${name}.note`) };
    });
    require(Array.isArray(assessment.audit) && assessment.audit.length <= 250, "assessment.audit must be a list of at most 250 events.");
    for (const [index, event] of assessment.audit.entries()) {
      object(event, `audit[${index}]`, ["id", "type", "ref", "reason", "at"]);
      for (const key of ["id", "type", "ref", "reason"]) text(event[key], `audit[${index}].${key}`);
      timestamp(event.at, `audit[${index}].at`, false);
    }
    const incomplete = [];
    const sanitized = {
      id: text(assessment.id, "assessment.id", 200, true),
      created_at: timestamp(assessment.created_at, "assessment.created_at"),
      updated_at: timestamp(assessment.updated_at, "assessment.updated_at"),
      declared_context: context, boundary, rapid_first_pass: rapid,
      whole_framework_snapshot: mapped(assessment.whole_framework_snapshot, "whole_framework_snapshot", refs, snapshot),
      domain_capacity_notes: mapped(assessment.domain_capacity_notes, "domain_capacity_notes", domains, (item, name) => text(item, name)),
      evidence_led_responses: mapped(assessment.evidence_led_responses, "evidence_led_responses", refs,
        (item, name) => evidenceResponse(item, name, incomplete)),
      audit: []
    };
    return {
      assessment: sanitized, versions: { ...data.versions }, provenance: { ...data.provenance }, sourceSchema: data.export_schema,
      compatibilityNote: ["Original assessment identity, dates, method and entered responses are preserved; no reassessment is performed.",
        legacy ? "This older file has no declared context, so its context is unspecified; no real or synthetic identity was inferred." : "The file's declared context is preserved as supplied, not independently verified.",
        "Contact and consent records, sessions, settings, analytics, prior event history and supplied derived results are not restored. Text and evidence references may still contain information entered by the assessor.",
        ...(incomplete.length ? [`${incomplete.length} incomplete evidence response(s) are preserved for correction, without filling in missing values.`] : [])].join(" ")
    };
  }

  globalThis.HDRLPortability = Object.freeze({ parseBackup });
})();
