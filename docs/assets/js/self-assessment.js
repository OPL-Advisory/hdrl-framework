(() => {
  "use strict";

  const root = document.getElementById("hdrl-assessment-root");
  if (!root) return;

  const VERSIONS = {
    framework: "1.0.1",
    catalogue: "1.0.2",
    tool: "0.3.0-prototype",
    guidance: "0.2.0",
    rules: "0.2.0",
    report: "0.3.0",
    beta: "0.1.0"
  };

  const DB_NAME = "hdrl-self-assessment-prototype";
  const STORE_NAME = "drafts";
  const ACTIVE_KEY = "current";
  const LEVELS = ["L1", "L2", "L3", "L4", "L5"];
  const STATUS_LABELS = {
    unstarted: "Not started",
    rated: "Judged",
    not_known: "Not known",
    not_assessed: "Not assessed",
    not_applicable: "Not applicable"
  };
  const IMPRESSION_LABELS = {
    starting: "Starting",
    developing: "Developing",
    defined: "Defined",
    managed: "Managed",
    improving: "Continuously improving",
    not_known: "Not known",
    not_assessed: "Not assessed"
  };
  const DOMAIN_COLOURS = {
    A: "#2563eb",
    B: "#0891b2",
    C: "#4f46e5",
    D: "#7c3aed",
    E: "#047857",
    F: "#a16207",
    G: "#be123c",
    H: "#475569"
  };

  let catalogue;
  let content;
  let betaConfig;
  let state;
  let saveTimer;
  let lastFocusId = "";
  let lastActivityTick = Date.now();

  const esc = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const nowIso = () => new Date().toISOString();
  const today = () => new Date().toISOString().slice(0, 10);
  const makeId = () =>
    globalThis.crypto?.randomUUID?.() ||
    `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  function defaultState() {
    return {
      schemaVersion: 3,
      id: makeId(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
      view: "welcome",
      rapidIndex: 0,
      snapshotIndex: 0,
      activeIndicator: null,
      boundary: {
        title: "",
        serviceName: "",
        scope: "",
        timePeriod: "",
        assessmentDate: today(),
        unit: "",
        method: "individual",
        intendedUse: ""
      },
      rapid: {},
      snapshot: {},
      indicators: {},
      domainNotes: {},
      beta: {
        sessionId: makeId(),
        startedAt: nowIso(),
        activeSeconds: 0,
        lastActivityAt: nowIso(),
        events: [],
        feedback: [],
        feedbackCheckpointAnswered: false,
        feedbackContext: {},
        pendingExport: ""
      },
      registration: {
        unlocked: false,
        name: "",
        email: "",
        role: "",
        organisation: "",
        region: "",
        serviceType: "",
        scale: "",
        useMode: "",
        reportUse: "",
        researchContact: false,
        newsletter: false
      },
      audit: [],
      versions: { ...VERSIONS }
    };
  }

  function indicatorResponse(ref) {
    if (!state.indicators[ref]) {
      state.indicators[ref] = {
        decision: "",
        status: "unstarted",
        level: "",
        certainty: "",
        rationale: "",
        improvementNote: "",
        statusReason: "",
        evidence: [],
        updatedAt: null
      };
    }
    return state.indicators[ref];
  }

  function snapshotResponse(ref) {
    if (!state.snapshot[ref]) {
      state.snapshot[ref] = {
        status: "unstarted",
        level: "",
        certainty: "",
        certaintyReasons: [],
        clarity: "",
        note: "",
        updatedAt: null
      };
    }
    return state.snapshot[ref];
  }

  function openDb() {
    return new Promise((resolve, reject) => {
      if (!("indexedDB" in globalThis)) {
        reject(new Error("IndexedDB is unavailable"));
        return;
      }
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function loadDraft() {
    try {
      const db = await openDb();
      const draft = await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const request = tx.objectStore(STORE_NAME).get(ACTIVE_KEY);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      db.close();
      return draft || null;
    } catch {
      return null;
    }
  }

  async function persist() {
    state.updatedAt = nowIso();
    try {
      const db = await openDb();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put(state, ACTIVE_KEY);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
      db.close();
      announce(`Saved on this device at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`);
    } catch {
      announce("This browser could not save the draft. Keep this page open to continue.", true);
    }
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persist, 350);
  }

  async function clearDraft() {
    try {
      const db = await openDb();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).delete(ACTIVE_KEY);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
      db.close();
    } catch {
      // The in-memory reset below still works when IndexedDB is unavailable.
    }
    state = defaultState();
    render();
    announce("The on-device draft has been deleted.");
  }

  function announce(message, assertive = false) {
    const live = document.getElementById("hdrl-assessment-status");
    if (!live) return;
    live.setAttribute("aria-live", assertive ? "assertive" : "polite");
    live.textContent = message;
  }

  function audit(type, ref, reason = "") {
    state.audit.push({
      id: makeId(),
      type,
      ref,
      reason,
      at: nowIso()
    });
    if (state.audit.length > 250) state.audit = state.audit.slice(-250);
  }

  function updateActiveTime() {
    const now = Date.now();
    const elapsed = Math.max(0, Math.min(60, Math.round((now - lastActivityTick) / 1000)));
    if (document.visibilityState === "visible") state.beta.activeSeconds += elapsed;
    lastActivityTick = now;
    state.beta.lastActivityAt = nowIso();
  }

  function activeTimeBand() {
    const minutes = state.beta.activeSeconds / 60;
    if (minutes < 5) return "under_5_minutes";
    if (minutes < 15) return "5_to_15_minutes";
    if (minutes < 30) return "15_to_30_minutes";
    if (minutes < 60) return "30_to_60_minutes";
    return "60_minutes_or_more";
  }

  function snapshotStats() {
    const responses = catalogue.indicators.map((indicator) => snapshotResponse(indicator.ref));
    const completed = responses.filter((response) => response.status !== "unstarted").length;
    const judged = responses.filter((response) => response.status === "rated" && response.level).length;
    const lowCertainty = responses.filter((response) => response.status === "rated" && response.certainty === "low").length;
    const clarityFlags = responses.filter((response) => ["some_overlap", "unclear"].includes(response.clarity)).length;
    const completedDomains = catalogue.domains.filter((domain) => catalogue.indicators
      .filter((indicator) => indicator.domain === domain.ref)
      .every((indicator) => snapshotResponse(indicator.ref).status !== "unstarted")).length;
    return { completed, judged, lowCertainty, clarityFlags, completedDomains };
  }

  function viewportBand() {
    if (innerWidth < 480) return "small_mobile";
    if (innerWidth < 768) return "large_mobile";
    if (innerWidth < 1100) return "tablet_or_small_desktop";
    return "desktop";
  }

  function recordBetaEvent(name, payload = {}) {
    if (!betaConfig?.feature_flags?.local_beta_events) return;
    const allowed = betaConfig.event_allowlist[name];
    if (!allowed) return;
    updateActiveTime();
    const clean = {};
    allowed.forEach((key) => {
      if (payload[key] !== undefined && ["string", "number", "boolean"].includes(typeof payload[key])) clean[key] = payload[key];
    });
    state.beta.events.push({
      id: makeId(),
      name,
      at: nowIso(),
      active_time_band: activeTimeBand(),
      ...clean
    });
    if (state.beta.events.length > 500) state.beta.events = state.beta.events.slice(-500);
    scheduleSave();
  }

  function hasBetaEvent(name) {
    return state.beta.events.some((event) => event.name === name);
  }

  function feedbackContext() {
    const s = snapshotStats();
    const indicator = ["snapshot", "indicator"].includes(state.view)
      ? catalogue.indicators.find((item) => item.ref === state.activeIndicator)
      : null;
    return {
      tool_version: VERSIONS.tool,
      framework_version: VERSIONS.framework,
      catalogue_version: VERSIONS.catalogue,
      view: state.view,
      domain_ref: indicator?.domain || "",
      indicator_ref: indicator?.ref || "",
      completed_indicator_count: s.completed,
      completed_domain_count: s.completedDomains,
      active_time_band: activeTimeBand(),
      viewport_band: viewportBand()
    };
  }

  function setView(view, focusId = "hdrl-view-title") {
    lastFocusId = focusId;
    state.view = view;
    scheduleSave();
    render();
  }

  function certaintyLabel(value) {
    return value ? `${value[0].toUpperCase()}${value.slice(1)} certainty` : "Certainty not recorded";
  }

  function shell(body) {
    const boundaryReady = Boolean(state.boundary.title);
    return `
      <div id="hdrl-assessment-status" class="hdrl-assessment-sr" role="status" aria-live="polite"></div>
      <div class="hdrl-assessment-toolbar">
        <div>
          <span class="hdrl-assessment-chip">Prototype · on-device only</span>
          <span class="hdrl-assessment-version">Framework ${VERSIONS.framework} · catalogue ${VERSIONS.catalogue} · tool ${VERSIONS.tool}</span>
        </div>
        <div class="hdrl-assessment-toolbar__actions">
          ${boundaryReady ? `<button type="button" class="hdrl-link-button" data-action="dashboard">Assessment overview</button>` : ""}
          <button type="button" class="hdrl-link-button hdrl-link-button--danger" data-action="clear">Delete on-device draft</button>
        </div>
      </div>
      ${body}
    `;
  }

  function stageCards() {
    return `
      <div class="hdrl-stage-grid">
        <article class="hdrl-stage-card">
          <span class="hdrl-stage-number">Optional orientation</span>
          <h3>Eight-domain first impression</h3>
          <p>Eight guided domain impressions based on what you know now.</p>
          <dl>
            <div><dt>Time</dt><dd>About 5–10 minutes</dd></div>
            <div><dt>Evidence</dt><dd>Not required</dd></div>
            <div><dt>Output</dt><dd>Preliminary learning profile</dd></div>
          </dl>
        </article>
        <article class="hdrl-stage-card hdrl-stage-card--snapshot">
          <span class="hdrl-stage-number">Stage 1</span>
          <h3>Whole-framework snapshot</h3>
          <p>Select a canonical level and certainty for every indicator. Comments and wording feedback are optional.</p>
          <dl>
            <div><dt>Time</dt><dd>About 30–60 minutes; pause by domain</dd></div>
            <div><dt>Coverage</dt><dd>All 64 indicators</dd></div>
            <div><dt>Minimum</dt><dd>Two selections each</dd></div>
            <div><dt>Output</dt><dd>Provisional readiness profile</dd></div>
          </dl>
        </article>
        <article class="hdrl-stage-card hdrl-stage-card--evidence">
          <span class="hdrl-stage-number">Stage 2</span>
          <h3>Evidence-led second pass</h3>
          <p>Review every relevant canonical indicator and record what supports the judgement.</p>
          <dl>
            <div><dt>Time</dt><dd>Several sessions</dd></div>
            <div><dt>Evidence</dt><dd>References, rationale and certainty</dd></div>
            <div><dt>Output</dt><dd>Traceable assessment report</dd></div>
          </dl>
        </article>
      </div>
    `;
  }

  function welcomeView() {
    const hasIndicatorWork = Object.values(state.indicators).some(
      (response) =>
        response.status !== "unstarted"
        || response.evidence.length
        || response.rationale
        || response.improvementNote
    );
    const hasDraft = Boolean(
      state.boundary.title
      || Object.keys(state.rapid).length
      || Object.values(state.snapshot).some((response) => response.status !== "unstarted")
      || Object.keys(state.domainNotes).length
      || hasIndicatorWork
    );
    return shell(`
      <section class="hdrl-assessment-view" aria-labelledby="hdrl-view-title">
        <span class="hdrl-assessment-kicker">Learn by applying HDRL</span>
        <h2 id="hdrl-view-title" tabindex="-1">Start lightly, deepen when useful</h2>
        <p class="hdrl-assessment-lede">Get oriented, take a provisional snapshot across all 64 indicators, then gather evidence where deeper assurance or planning would add value.</p>
        ${stageCards()}
        <div class="hdrl-assessment-callout">
          <h3>What this cannot establish</h3>
          <p>A self-assessment cannot validate, accredit or endorse a service. It reflects a stated boundary, the people involved and the evidence available on the assessment date.</p>
        </div>
        <div class="hdrl-assessment-actions">
          <button type="button" class="md-button md-button--primary" data-action="${hasDraft ? "resume" : "start"}">${hasDraft ? "Resume draft" : "Set the assessment boundary"}</button>
          <button type="button" class="md-button" data-action="sample">Open a sample assessment</button>
        </div>
      </section>
    `);
  }

  function overviewView() {
    const rapidCompleted = Object.values(state.rapid).filter((item) => item.impression).length;
    const snapshot = snapshotStats();
    const evidence = stats();
    return shell(`
      <section class="hdrl-assessment-view hdrl-assessment-view--wide" aria-labelledby="hdrl-view-title">
        <span class="hdrl-assessment-kicker">${esc(state.boundary.title)}</span>
        <h2 id="hdrl-view-title" tabindex="-1">Assessment overview</h2>
        <p class="hdrl-assessment-lede">Choose the depth that is useful now. Each layer remains visibly distinct in the report.</p>
        <div class="hdrl-overview-grid">
          <article>
            <span>Optional orientation</span>
            <h3>Eight-domain first impression</h3>
            <strong>${rapidCompleted}/8 domains</strong>
            <p>A brief, non-evidenced introduction to the shape of HDRL.</p>
            <button type="button" class="md-button" data-action="${rapidCompleted ? "rapid-summary" : "rapid-intro"}">${rapidCompleted ? "Review orientation" : "Start orientation"}</button>
          </article>
          <article class="hdrl-overview-card--primary">
            <span>Stage 1</span>
            <h3>Whole-framework snapshot</h3>
            <strong>${snapshot.completed}/64 indicators</strong>
            <p>Provisional level and certainty across the complete framework.</p>
            <button type="button" class="md-button md-button--primary" data-action="snapshot-dashboard">${snapshot.completed ? "Continue snapshot" : "Start snapshot"}</button>
          </article>
          <article>
            <span>Stage 2</span>
            <h3>Evidence workspace</h3>
            <strong>${evidence.judged}/64 judgements</strong>
            <p>Rationale, evidence references, gaps and domain constraints.</p>
            <button type="button" class="md-button" data-action="evidence">Open evidence workspace</button>
          </article>
        </div>
        <div class="hdrl-assessment-actions">
          <button type="button" class="md-button" data-action="boundary">Edit assessment boundary</button>
          <button type="button" class="hdrl-link-button" data-action="beta-activity">Review local beta activity</button>
        </div>
      </section>
    `);
  }

  function boundaryView(errors = {}) {
    const b = state.boundary;
    const errorSummary = Object.keys(errors).length
      ? `<div class="hdrl-error-summary" role="alert" tabindex="-1" id="hdrl-boundary-errors">
          <h3>Check the assessment boundary</h3>
          <ul>${Object.entries(errors).map(([id, message]) => `<li><a href="#${id}">${esc(message)}</a></li>`).join("")}</ul>
        </div>`
      : "";
    return shell(`
      <section class="hdrl-assessment-view" aria-labelledby="hdrl-view-title">
        <div class="hdrl-progress-label">Onboarding · about 2 minutes</div>
        <h2 id="hdrl-view-title" tabindex="-1">Define what you are assessing</h2>
        <p class="hdrl-assessment-lede">A precise boundary makes every later judgement easier to interpret. You can change it before generating the report.</p>
        <div class="hdrl-assessment-notice">
          <strong>Use non-sensitive information.</strong> Do not include patient data, credentials or detailed security weaknesses. This prototype saves only to this browser.
        </div>
        ${errorSummary}
        <form id="hdrl-boundary-form" novalidate>
          <div class="hdrl-form-grid">
            ${textField("boundary-title", "Assessment title", b.title, "A short name used in the report.", true, errors["boundary-title"], 120)}
            ${textField("boundary-service", "Service or ecosystem name", b.serviceName, "The service, network or system whose readiness you want to explore.", true, errors["boundary-service"], 160)}
          </div>
          ${textareaField("boundary-scope", "Assessment scope and boundary", b.scope, "State what is included, excluded, and which organisations or capabilities are in scope.", true, errors["boundary-scope"], 1200)}
          <div class="hdrl-form-grid">
            ${textField("boundary-period", "Time period", b.timePeriod, "For example, “current position” or a defined operating year.", true, errors["boundary-period"], 120)}
            ${textField("boundary-date", "Assessment date", b.assessmentDate, "The date to which this self-assessment relates.", true, errors["boundary-date"], 10, "date")}
          </div>
          <div class="hdrl-form-grid">
            <div class="hdrl-field ${errors["boundary-unit"] ? "hdrl-field--error" : ""}">
              <fieldset>
                <legend>Unit of assessment <span aria-hidden="true">*</span></legend>
                <p class="hdrl-hint">This suggests relevance but never silently hides an indicator.</p>
                ${radio("boundary-unit", "system", "System", "Policy, legal framework or population infrastructure.", b.unit)}
                ${radio("boundary-unit", "service", "Service", "An individual data service, SDE or TRE.", b.unit)}
                ${radio("boundary-unit", "dual", "Dual", "Systemic context and operational service separately.", b.unit)}
              </fieldset>
              ${fieldError(errors["boundary-unit"])}
            </div>
            <div class="hdrl-field">
              <fieldset>
                <legend>How will this be completed?</legend>
                <p class="hdrl-hint">Team mode is represented in the report, but secure invitations require the future production service.</p>
                ${radio("boundary-method", "individual", "Individual", "One person's perspective.", b.method)}
                ${radio("boundary-method", "team", "Team", "Independent views followed by calibration.", b.method)}
              </fieldset>
            </div>
          </div>
          ${textareaField("boundary-use", "Intended use", b.intendedUse, "What decision, conversation or improvement planning should this assessment inform?", true, errors["boundary-use"], 600)}
          <div class="hdrl-assessment-actions">
            <button type="submit" class="md-button md-button--primary">Save boundary and choose assessment stage</button>
            <button type="button" class="md-button" data-action="welcome">Back</button>
          </div>
        </form>
      </section>
    `);
  }

  function textField(id, label, value, hint, required = false, error = "", maxlength = 250, type = "text", autocomplete = "") {
    return `
      <div class="hdrl-field ${error ? "hdrl-field--error" : ""}">
        <label for="${id}">${esc(label)}${required ? ` <span aria-hidden="true">*</span>` : ""}</label>
        <p class="hdrl-hint" id="${id}-hint">${esc(hint)}</p>
        <input id="${id}" name="${id}" type="${type}" value="${esc(value)}" maxlength="${maxlength}" ${required ? "required" : ""} ${autocomplete ? `autocomplete="${autocomplete}"` : ""} aria-describedby="${id}-hint${error ? ` ${id}-error` : ""}">
        ${fieldError(error, id)}
      </div>
    `;
  }

  function textareaField(id, label, value, hint, required = false, error = "", maxlength = 2000) {
    return `
      <div class="hdrl-field ${error ? "hdrl-field--error" : ""}">
        <label for="${id}">${esc(label)}${required ? ` <span aria-hidden="true">*</span>` : ""}</label>
        <p class="hdrl-hint" id="${id}-hint">${esc(hint)}</p>
        <textarea id="${id}" name="${id}" rows="4" maxlength="${maxlength}" ${required ? "required" : ""} aria-describedby="${id}-hint${error ? ` ${id}-error` : ""}">${esc(value)}</textarea>
        ${fieldError(error, id)}
      </div>
    `;
  }

  function fieldError(error, id = "") {
    return error ? `<p class="hdrl-field-error" ${id ? `id="${id}-error"` : ""}><span class="hdrl-assessment-sr">Error:</span> ${esc(error)}</p>` : "";
  }

  function radio(name, value, label, hint, checkedValue) {
    const id = `${name}-${value}`;
    return `
      <div class="hdrl-radio">
        <input id="${id}" name="${name}" type="radio" value="${value}" ${checkedValue === value ? "checked" : ""}>
        <label for="${id}"><strong>${esc(label)}</strong><span>${esc(hint)}</span></label>
      </div>
    `;
  }

  function rapidIntroView() {
    return shell(`
      <section class="hdrl-assessment-view" aria-labelledby="hdrl-view-title">
        <div class="hdrl-progress-label">Stage 1 of 2 · about 5–10 minutes</div>
        <h2 id="hdrl-view-title" tabindex="-1">Give your first impression</h2>
        <p class="hdrl-assessment-lede">There is one prompt for each HDRL domain. Answer from current knowledge without gathering evidence. “Not known” is useful—it points to a knowledge gap.</p>
        <div class="hdrl-assessment-callout">
          <h3>Preliminary, not evidence-backed</h3>
          <p>The five impression bands resemble a maturity journey but are not canonical indicator levels. This pass does not cover all 64 indicators and cannot be described as a full HDRL assessment.</p>
        </div>
        <ul class="hdrl-check-list">
          <li>Use your gut reaction.</li>
          <li>Record how certain you are.</li>
          <li>Add a short note only if it will help the second pass.</li>
          <li>Expect to revise your view when you inspect evidence.</li>
        </ul>
        <div class="hdrl-assessment-actions">
          <button type="button" class="md-button md-button--primary" data-action="rapid-start">Start question 1 of 8</button>
          <button type="button" class="md-button" data-action="boundary">Change boundary</button>
        </div>
      </section>
    `);
  }

  function rapidView() {
    const q = content.rapid_questions[state.rapidIndex];
    const domain = catalogue.domains.find((item) => item.ref === q.domain);
    const response = state.rapid[q.domain] || { impression: "", certainty: "", note: "" };
    const hasImpression = content.impression_bands.some((band) => band.value === response.impression);
    const completed = Object.values(state.rapid).filter((item) => item.impression).length;
    const percent = Math.round((completed / content.rapid_questions.length) * 100);
    return shell(`
      <section class="hdrl-assessment-view" aria-labelledby="hdrl-view-title">
        <div class="hdrl-progress" aria-label="${completed} of 8 rapid questions answered">
          <div class="hdrl-progress__meta"><span>Rapid first pass</span><span>Question ${state.rapidIndex + 1} of 8</span></div>
          <div class="hdrl-progress__track"><span style="width:${percent}%"></span></div>
        </div>
        <span class="hdrl-domain-label" style="--domain-colour:${DOMAIN_COLOURS[q.domain]}">Domain ${q.domain} · ${esc(domain.name)}</span>
        <h2 id="hdrl-view-title" tabindex="-1">${esc(q.question)}</h2>
        <p>${esc(q.consider)}</p>
        <details class="hdrl-guidance">
          <summary>Why this domain matters</summary>
          <p>${esc(q.why)}</p>
        </details>
        <form id="hdrl-rapid-form">
          <fieldset class="hdrl-impression-options">
            <legend>Choose the closest initial impression</legend>
            <p class="hdrl-hint">These are impression bands, not HDRL indicator scores.</p>
            <div class="hdrl-impression-band-group">
              ${content.impression_bands.map((band) => radio("rapid-impression", band.value, band.label, band.description, response.impression)).join("")}
            </div>
            <div class="hdrl-impression-deferred">
              <p><strong>Cannot make an initial impression</strong></p>
              ${radio("rapid-impression", "not_known", "Not known", "I do not know enough to form an impression.", response.impression)}
              ${radio("rapid-impression", "not_assessed", "Not assessed", "I am intentionally leaving this domain for later.", response.impression)}
            </div>
          </fieldset>
          <fieldset class="hdrl-inline-radios" id="hdrl-rapid-certainty-panel" ${hasImpression ? "" : "hidden"}>
            <legend>How certain are you?</legend>
            ${radio("rapid-certainty", "high", "High", "I am fairly certain this impression reflects the current position.", response.certainty)}
            ${radio("rapid-certainty", "medium", "Medium", "Some important details could change this impression.", response.certainty)}
            ${radio("rapid-certainty", "low", "Low", "This is tentative and should be checked.", response.certainty)}
          </fieldset>
          ${textareaField("rapid-note", "Optional note", response.note, "What shaped this impression, or what should you check later?", false, "", 600)}
          <div class="hdrl-assessment-actions">
            <button type="submit" class="md-button md-button--primary">${state.rapidIndex === 7 ? "Review rapid summary" : "Save and continue"}</button>
            ${state.rapidIndex > 0 ? `<button type="button" class="md-button" data-action="rapid-prev">Previous domain</button>` : ""}
            <button type="button" class="hdrl-link-button" data-action="rapid-summary">Skip to summary</button>
          </div>
        </form>
      </section>
    `);
  }

  function rapidProfileMatrix({ interactive = true, id = "rapid-profile" } = {}) {
    const unknown = [];
    const rows = ["high", "medium", "low"];
    const matrix = rows.map((certainty) => `
      <tr>
        <th scope="row">${certainty[0].toUpperCase()}${certainty.slice(1)}</th>
        ${content.impression_bands.map((band) => {
          const domains = catalogue.domains.filter((domain) => {
            const response = state.rapid[domain.ref] || {};
            return response.impression === band.value && response.certainty === certainty;
          });
          return `<td data-band="${band.value}" data-certainty="${certainty}">
            ${domains.map((domain) => interactive
              ? `<button type="button" class="hdrl-domain-dot" style="--domain-colour:${DOMAIN_COLOURS[domain.ref]}" data-action="rapid-edit" data-domain="${domain.ref}" aria-label="Domain ${domain.ref}, ${esc(domain.name)}: ${esc(band.label)}, ${certainty} certainty">${domain.ref}</button>`
              : `<span class="hdrl-domain-dot" style="--domain-colour:${DOMAIN_COLOURS[domain.ref]}" title="${esc(domain.name)}">${domain.ref}<span class="hdrl-assessment-sr"> · ${esc(domain.name)}</span></span>`
            ).join("") || `<span class="hdrl-empty-cell" aria-hidden="true">—</span>`}
          </td>`;
        }).join("")}
      </tr>
    `).join("");
    catalogue.domains.forEach((domain) => {
      const response = state.rapid[domain.ref] || {};
      if (!content.impression_bands.some((band) => band.value === response.impression) || !response.certainty) {
        unknown.push({ domain, response });
      }
    });
    return `
      <div class="hdrl-profile-visual" aria-labelledby="${id}-title">
        <div class="hdrl-profile-visual__heading">
          <div>
            <h3 id="${id}-title">Impression by certainty</h3>
            <p>Position shows an impression band and certainty—not an evidence-led HDRL score.</p>
          </div>
          <span class="hdrl-profile-arrow" aria-hidden="true">Lower impression → Higher impression</span>
        </div>
        <div class="hdrl-profile-matrix-wrap" role="region" aria-label="Rapid profile matrix" tabindex="0">
          <table class="hdrl-profile-matrix">
            <caption class="hdrl-assessment-sr">Domains arranged by initial impression and certainty</caption>
            <thead><tr><th scope="col">Certainty</th>${content.impression_bands.map((band) => `<th scope="col">${esc(band.label)}</th>`).join("")}</tr></thead>
            <tbody>${matrix}</tbody>
          </table>
        </div>
        ${unknown.length ? `<div class="hdrl-profile-unplaced"><strong>Not positioned on the matrix</strong><div>${unknown.map(({ domain, response }) => {
          const label = IMPRESSION_LABELS[response.impression] || "Not answered";
          return interactive
            ? `<button type="button" data-action="rapid-edit" data-domain="${domain.ref}" style="--domain-colour:${DOMAIN_COLOURS[domain.ref]}"><strong>${domain.ref}</strong><span>${esc(domain.name)}</span><small>${esc(label)}${response.impression && !["not_known", "not_assessed"].includes(response.impression) ? " · certainty not recorded" : ""}</small></button>`
            : `<div style="--domain-colour:${DOMAIN_COLOURS[domain.ref]}"><strong>${domain.ref}</strong><span>${esc(domain.name)}</span><small>${esc(label)}</small></div>`;
        }).join("")}</div></div>` : ""}
      </div>
    `;
  }

  function rapidSummaryView() {
    const answered = Object.values(state.rapid).filter((item) => item.impression).length;
    return shell(`
      <section class="hdrl-assessment-view" aria-labelledby="hdrl-view-title">
        <div class="hdrl-progress-label">Stage 1 complete · ${answered} of 8 domains answered</div>
        <h2 id="hdrl-view-title" tabindex="-1">Your preliminary learning profile</h2>
        <p class="hdrl-assessment-lede">This is a snapshot of initial impressions. It is not a full HDRL assessment and has no overall score.</p>
        ${rapidProfileMatrix({ interactive: true, id: "rapid-summary-profile" })}
        <details class="hdrl-guidance">
          <summary>View the profile as a domain list</summary>
          <div class="hdrl-rapid-profile">
          ${catalogue.domains.map((domain) => {
            const response = state.rapid[domain.ref] || {};
            return `
              <article style="--domain-colour:${DOMAIN_COLOURS[domain.ref]}">
                <span>Domain ${domain.ref}</span>
                <h3>${esc(domain.name)}</h3>
                <strong>${esc(IMPRESSION_LABELS[response.impression] || "No impression recorded")}</strong>
                <p>${esc(certaintyLabel(response.certainty))}</p>
                <button type="button" class="hdrl-link-button" data-action="rapid-edit" data-domain="${domain.ref}">Change</button>
              </article>
            `;
          }).join("")}
          </div>
        </details>
        <div class="hdrl-assessment-callout">
          <h3>Now cover the complete framework</h3>
          <p>The whole-framework snapshot presents every canonical indicator and level. Select the closest description and how certain you are; evidence is not required at this stage.</p>
        </div>
        <div class="hdrl-assessment-actions">
          <button type="button" class="md-button md-button--primary" data-action="snapshot-dashboard">Start the 64-indicator snapshot</button>
          <button type="button" class="md-button" data-action="rapid-edit-first">Review rapid answers</button>
        </div>
      </section>
    `);
  }

  function snapshotDomainProgress(domainRef) {
    const indicators = catalogue.indicators.filter((indicator) => indicator.domain === domainRef);
    const completed = indicators.filter((indicator) => snapshotResponse(indicator.ref).status !== "unstarted").length;
    return { completed, total: indicators.length };
  }

  function nextSnapshotRef(domainRef = "") {
    const candidates = domainRef
      ? catalogue.indicators.filter((indicator) => indicator.domain === domainRef)
      : catalogue.indicators;
    return candidates.find((indicator) => snapshotResponse(indicator.ref).status === "unstarted")?.ref
      || candidates[0]?.ref
      || catalogue.indicators[0].ref;
  }

  function snapshotDashboardView() {
    const s = snapshotStats();
    const percent = Math.round((s.completed / catalogue.indicators.length) * 100);
    return shell(`
      <section class="hdrl-assessment-view hdrl-assessment-view--wide" aria-labelledby="hdrl-view-title">
        <div class="hdrl-progress-label">Stage 1 · about 30–60 minutes · save and return</div>
        <h2 id="hdrl-view-title" tabindex="-1">Whole-framework snapshot</h2>
        <p class="hdrl-assessment-lede">For each indicator, choose the canonical description that best fits your current understanding and record certainty. No evidence is required and every answer remains provisional.</p>
        <div class="hdrl-assessment-notice">
          <strong>Assessment results stay on this device.</strong> Local beta activity records completion counts and timing bands, never the levels, certainty, notes or report contents.
        </div>
        <div class="hdrl-progress" aria-label="${s.completed} of 64 snapshot indicators completed">
          <div class="hdrl-progress__meta"><span>Snapshot progress</span><span>${s.completed} of 64</span></div>
          <div class="hdrl-progress__track"><span style="width:${percent}%"></span></div>
        </div>
        <div class="hdrl-stat-row" aria-label="Snapshot summary">
          ${statCard(s.completed, "Completed", "of 64")}
          ${statCard(s.judged, "Level selected", "provisional")}
          ${statCard(s.lowCertainty, "Low certainty", "review prompts")}
          ${statCard(s.clarityFlags, "Wording flags", "optional feedback")}
          ${statCard(s.completedDomains, "Domains complete", "of 8")}
        </div>
        <div class="hdrl-assessment-actions">
          <button type="button" class="md-button md-button--primary" data-action="open-snapshot" data-ref="${nextSnapshotRef()}">${s.completed ? "Continue with next unfinished indicator" : "Start indicator 1 of 64"}</button>
          ${s.completed ? `<button type="button" class="md-button" data-action="snapshot-review">Review snapshot results</button>` : ""}
          <button type="button" class="hdrl-link-button" data-action="overview">Assessment overview</button>
        </div>
        <div class="hdrl-snapshot-domains">
          ${catalogue.domains.map((domain) => {
            const progress = snapshotDomainProgress(domain.ref);
            const complete = progress.completed === progress.total;
            return `<article style="--domain-colour:${DOMAIN_COLOURS[domain.ref]}">
              <span>Domain ${domain.ref}</span>
              <h3>${esc(domain.name)}</h3>
              <strong>${progress.completed}/${progress.total} indicators</strong>
              <div class="hdrl-mini-progress" aria-hidden="true"><span style="width:${Math.round((progress.completed / progress.total) * 100)}%"></span></div>
              <button type="button" class="md-button" data-action="open-snapshot" data-ref="${nextSnapshotRef(domain.ref)}">${complete ? "Review domain" : progress.completed ? "Continue domain" : "Start domain"}</button>
              <details>
                <summary>View indicator list</summary>
                <ul>${catalogue.indicators.filter((indicator) => indicator.domain === domain.ref).map((indicator) => {
                  const response = snapshotResponse(indicator.ref);
                  const result = response.status === "rated" ? response.level : STATUS_LABELS[response.status];
                  return `<li><button type="button" class="hdrl-link-button" data-action="open-snapshot" data-ref="${indicator.ref}">${indicator.ref} · ${esc(indicator.name)}</button><span>${esc(result)}</span></li>`;
                }).join("")}</ul>
              </details>
            </article>`;
          }).join("")}
        </div>
      </section>
    `);
  }

  function snapshotIndicatorView(errors = {}) {
    const indicator = catalogue.indicators.find((item) => item.ref === state.activeIndicator);
    if (!indicator) return snapshotDashboardView();
    const response = snapshotResponse(indicator.ref);
    const domain = catalogue.domains.find((item) => item.ref === indicator.domain);
    const index = catalogue.indicators.findIndex((item) => item.ref === indicator.ref);
    const errorSummary = Object.keys(errors).length
      ? `<div class="hdrl-error-summary" role="alert" tabindex="-1" id="hdrl-snapshot-errors"><h3>Check this snapshot response</h3><ul>${Object.entries(errors).map(([id, message]) => `<li><a href="#${id}">${esc(message)}</a></li>`).join("")}</ul></div>`
      : "";
    return shell(`
      <section class="hdrl-assessment-view" aria-labelledby="hdrl-view-title">
        <button type="button" class="hdrl-back-link" data-action="snapshot-dashboard">← Back to snapshot overview</button>
        <div class="hdrl-progress-label">Indicator ${index + 1} of 64 · Domain ${indicator.domain}</div>
        <span class="hdrl-domain-label" style="--domain-colour:${DOMAIN_COLOURS[indicator.domain]}">${indicator.domain} · ${esc(domain.name)}</span>
        <h2 id="hdrl-view-title" tabindex="-1">${indicator.ref} · ${esc(indicator.name)}</h2>
        <p class="hdrl-assessment-lede">Choose the description that best fits your current understanding. This is a provisional snapshot, not an evidence-backed judgement.</p>
        ${errorSummary}
        <form id="hdrl-snapshot-form" novalidate>
          <fieldset class="hdrl-level-options hdrl-snapshot-levels" id="snapshot-levels">
            <legend>Select the closest canonical description</legend>
            <p class="hdrl-hint">Use keys 1–5 to select a level. Exact catalogue wording is reproduced below.</p>
            ${LEVELS.map((level) => `<div class="hdrl-level-option">
              <input id="snapshot-level-${level}" name="snapshot-level" type="radio" value="${level}" ${response.level === level ? "checked" : ""}>
              <label for="snapshot-level-${level}"><span><strong>${level} · ${esc(catalogue.maturity_level_names[level])}</strong></span><span>${esc(indicator.maturity_levels[level])}</span></label>
            </div>`).join("")}
            <div class="hdrl-snapshot-deferred">
              <strong>Cannot select a level now</strong>
              ${radio("snapshot-status", "not_known", "Not known", "I do not know this part of the service well enough.", response.status)}
              ${radio("snapshot-status", "not_assessed", "Not assessed", "I am intentionally leaving this indicator for later.", response.status)}
              ${radio("snapshot-status", "not_applicable", "Not applicable", "This indicator is outside the stated assessment boundary.", response.status)}
            </div>
          </fieldset>
          <div id="hdrl-snapshot-certainty-panel" ${response.status === "rated" ? "" : "hidden"}>
            <fieldset class="hdrl-inline-radios">
              <legend>How certain are you?</legend>
              <p class="hdrl-hint">Use H, M or L. This describes confidence in your selection—not the maturity level.</p>
              ${radio("snapshot-certainty", "high", "High", "I know this area and the description fits clearly.", response.certainty)}
              ${radio("snapshot-certainty", "medium", "Medium", "Some details could change the selection.", response.certainty)}
              ${radio("snapshot-certainty", "low", "Low", "This should be checked with another person or evidence.", response.certainty)}
            </fieldset>
            <fieldset class="hdrl-certainty-reasons" id="hdrl-certainty-reasons" ${response.certainty === "low" ? "" : "hidden"}>
              <legend>What contributes to low certainty? <span class="hdrl-optional-label">Optional</span></legend>
              ${betaConfig.certainty_reasons.map((reason) => `<div class="hdrl-checkbox"><input id="snapshot-reason-${reason.value}" name="snapshot-reason" type="checkbox" value="${reason.value}" ${response.certaintyReasons.includes(reason.value) ? "checked" : ""}><label for="snapshot-reason-${reason.value}">${esc(reason.label)}</label></div>`).join("")}
            </fieldset>
            <fieldset class="hdrl-clarity-options">
              <legend>How clear were the differences between levels? <span class="hdrl-optional-label">Optional</span></legend>
              ${betaConfig.clarity_options.map((option) => radio("snapshot-clarity", option.value, option.label, option.description, response.clarity)).join("")}
            </fieldset>
          </div>
          <details class="hdrl-snapshot-note" ${response.note ? "open" : ""}>
            <summary>Add an optional comment or justification</summary>
            ${textareaField("snapshot-note", "Your note", response.note, "Keep this concise and non-sensitive. It stays on this device unless you explicitly include it in a share bundle.", false, "", 1200)}
          </details>
          <div class="hdrl-assessment-actions">
            <button type="submit" class="md-button md-button--primary">Save and open next indicator</button>
            <button type="button" class="md-button" data-action="snapshot-dashboard">Return without saving</button>
          </div>
        </form>
      </section>
    `);
  }

  function summariseLevelValues(values) {
    const sorted = values.slice().sort((a, b) => a - b);
    if (!sorted.length) return { label: "Insufficient completed indicators", median: "—", range: "—", count: 0 };
    const middle = Math.floor(sorted.length / 2);
    const low = sorted.length % 2 ? sorted[middle] : sorted[middle - 1];
    const high = sorted.length % 2 ? sorted[middle] : sorted[middle];
    const median = low === high ? `L${low}` : `L${low}–L${high}`;
    const range = `L${sorted[0]}–L${sorted[sorted.length - 1]}`;
    return { label: low === high ? `${median} · ${catalogue.maturity_level_names[median]}` : `${median} median range`, median, range, count: sorted.length };
  }

  function snapshotDomainSummary(domainRef) {
    const values = catalogue.indicators
      .filter((indicator) => indicator.domain === domainRef && indicator.type === "Core" && indicator.applicability_class !== "Y")
      .map((indicator) => snapshotResponse(indicator.ref))
      .filter((response) => response.status === "rated" && LEVELS.includes(response.level))
      .map((response) => Number(response.level.slice(1)));
    return summariseLevelValues(values);
  }

  function snapshotReviewView() {
    const s = snapshotStats();
    const revisit = catalogue.indicators.filter((indicator) => {
      const response = snapshotResponse(indicator.ref);
      return response.status === "unstarted" || response.certainty === "low" || ["some_overlap", "unclear"].includes(response.clarity);
    });
    return shell(`
      <section class="hdrl-assessment-view hdrl-assessment-view--wide" aria-labelledby="hdrl-view-title">
        <div class="hdrl-progress-label">Stage 1 review · ${s.completed} of 64 indicators completed</div>
        <h2 id="hdrl-view-title" tabindex="-1">Review the provisional snapshot</h2>
        <p class="hdrl-assessment-lede">This profile reflects current understanding and certainty. It is not evidence-backed, validated or suitable for benchmarking.</p>
        <div class="hdrl-stat-row">
          ${statCard(s.judged, "Level selected", "provisional")}
          ${statCard(s.lowCertainty, "Low certainty", "investigate")}
          ${statCard(s.clarityFlags, "Wording flags", "framework feedback")}
          ${statCard(64 - s.completed, "Not completed", "visible gaps")}
          ${statCard(s.completedDomains, "Domains complete", "of 8")}
        </div>
        <div class="hdrl-report-table-wrap" role="region" aria-label="Provisional snapshot domain profile" tabindex="0">
          <table class="hdrl-domain-summary-table">
            <thead><tr><th scope="col">Domain</th><th scope="col">Core median</th><th scope="col">Observed range</th><th scope="col">Completed</th></tr></thead>
            <tbody>${catalogue.domains.map((domain) => {
              const summary = snapshotDomainSummary(domain.ref);
              const progress = snapshotDomainProgress(domain.ref);
              return `<tr><th scope="row"><span class="hdrl-domain-key" style="--domain-colour:${DOMAIN_COLOURS[domain.ref]}">${domain.ref}</span> ${esc(domain.name)}</th><td><strong>${esc(summary.median)}</strong></td><td>${esc(summary.range)}</td><td>${progress.completed}/${progress.total}</td></tr>`;
            }).join("")}</tbody>
          </table>
        </div>
        <h3>Indicators to revisit</h3>
        <div class="hdrl-review-issues">
          ${revisit.slice(0, 40).map((indicator) => {
            const response = snapshotResponse(indicator.ref);
            const reason = response.status === "unstarted" ? "Not completed" : response.certainty === "low" ? "Low certainty" : "Level wording flagged";
            return `<button type="button" data-action="open-snapshot" data-ref="${indicator.ref}"><span>${esc(reason)}</span><strong>${indicator.ref}</strong><small>${esc(indicator.name)}</small></button>`;
          }).join("") || `<p class="hdrl-success-panel">No snapshot completeness, low-certainty or wording flags remain.</p>`}
        </div>
        ${revisit.length > 40 ? `<p>${revisit.length - 40} additional indicators to revisit remain visible in the snapshot overview and exports.</p>` : ""}
        <div class="hdrl-assessment-actions">
          <button type="button" class="md-button md-button--primary" data-action="gate">Prepare report and exports</button>
          <button type="button" class="md-button" data-action="evidence">Start evidence gathering</button>
          <button type="button" class="hdrl-link-button" data-action="snapshot-dashboard">Return to snapshot overview</button>
        </div>
      </section>
    `);
  }

  function stats() {
    const responses = catalogue.indicators.map((indicator) => indicatorResponse(indicator.ref));
    const judged = responses.filter((response) => response.status === "rated" && response.level).length;
    const evidenceLinked = responses.filter((response) => response.evidence.length > 0).length;
    const unknown = responses.filter((response) => response.status === "not_known").length;
    const notAssessed = responses.filter((response) => ["unstarted", "not_assessed"].includes(response.status)).length;
    const notApplicable = responses.filter((response) => response.status === "not_applicable").length;
    return { judged, evidenceLinked, unknown, notAssessed, notApplicable };
  }

  function relevance(indicator) {
    if (state.boundary.unit === "dual" || indicator.unit === "B") return "Directly review";
    if (state.boundary.unit === "system" && indicator.unit === "S") return "Directly review";
    if (state.boundary.unit === "service" && indicator.unit === "V") return "Directly review";
    if (state.boundary.unit === "service" && indicator.unit === "S") return "Consider inherited context";
    if (state.boundary.unit === "system" && indicator.unit === "V") return "Choose representative service or mark N/A";
    return "Review applicability";
  }

  function evidenceDashboardView(filters = {}) {
    const s = stats();
    const domainFilter = filters.domain || "";
    const statusFilter = filters.status || "";
    const search = (filters.search || "").trim().toLowerCase();
    const visible = catalogue.indicators.filter((indicator) => {
      const response = indicatorResponse(indicator.ref);
      return (!domainFilter || indicator.domain === domainFilter)
        && (!statusFilter || response.status === statusFilter)
        && (!search || `${indicator.ref} ${indicator.name}`.toLowerCase().includes(search));
    });
    return shell(`
      <section class="hdrl-assessment-view hdrl-assessment-view--wide" aria-labelledby="hdrl-view-title">
        <div class="hdrl-progress-label">Stage 2 · evidence gathering · save and return</div>
        <h2 id="hdrl-view-title" tabindex="-1">Evidence-led indicator review</h2>
        <p class="hdrl-assessment-lede">All 64 indicators remain available. Scope tags are prompts, not automatic exclusions.</p>
        <div class="hdrl-assessment-notice">
          <strong>References and notes only—no files.</strong> Do not enter patient-level data, personal confidential data, credentials or unnecessarily sensitive operational information.
        </div>
        <div class="hdrl-stat-row" aria-label="Evidence-led progress">
          ${statCard(s.judged, "Judged", "of 64")}
          ${statCard(s.evidenceLinked, "With evidence", "references")}
          ${statCard(s.unknown, "Not known", "knowledge gaps")}
          ${statCard(s.notAssessed, "Not assessed", "including not started")}
          ${statCard(s.notApplicable, "Not applicable", "with reason")}
        </div>
        <details class="hdrl-domain-notes">
          <summary>Record domain-level operating capacity and constraints</summary>
          <p>Keep this separate from maturity and evidence. Note whether the domain can operate reliably under current demand—for example staffing headroom, throughput, funding or technical capacity.</p>
          <form id="hdrl-domain-notes-form">
            <div class="hdrl-domain-note-grid">
              ${catalogue.domains.map((domain) => textareaField(
                `domain-capacity-${domain.ref}`,
                `${domain.ref} · ${domain.name}`,
                state.domainNotes[domain.ref] || "",
                "Optional domain-level capacity or constraint note.",
                false,
                "",
                1200
              )).join("")}
            </div>
            <button type="submit" class="md-button">Save domain notes</button>
          </form>
        </details>
        <div class="hdrl-assessment-workspace">
          <aside class="hdrl-assessment-filters" aria-label="Filter indicators">
            <form id="hdrl-filter-form">
              <label for="filter-search">Find an indicator</label>
              <input id="filter-search" name="search" type="search" value="${esc(filters.search || "")}" placeholder="Reference or name">
              <label for="filter-domain">Domain</label>
              <select id="filter-domain" name="domain">
                <option value="">All domains</option>
                ${catalogue.domains.map((domain) => `<option value="${domain.ref}" ${domainFilter === domain.ref ? "selected" : ""}>${domain.ref} · ${esc(domain.name)}</option>`).join("")}
              </select>
              <label for="filter-status">Status</label>
              <select id="filter-status" name="status">
                <option value="">All statuses</option>
                ${Object.entries(STATUS_LABELS).map(([value, label]) => `<option value="${value}" ${statusFilter === value ? "selected" : ""}>${label}</option>`).join("")}
              </select>
              <button type="submit" class="md-button">Apply filters</button>
            </form>
            <div class="hdrl-assessment-actions hdrl-assessment-actions--stack">
              <button type="button" class="md-button md-button--primary" data-action="review">Review and prepare report</button>
              <button type="button" class="hdrl-link-button" data-action="rapid-summary">Compare rapid impressions</button>
            </div>
          </aside>
          <div class="hdrl-indicator-list" aria-live="polite">
            <p><strong>${visible.length}</strong> indicator${visible.length === 1 ? "" : "s"} shown</p>
            ${visible.map(indicatorListItem).join("") || `<p>No indicators match these filters.</p>`}
          </div>
        </div>
      </section>
    `);
  }

  function statCard(value, label, note) {
    return `<div><strong>${value}</strong><span>${esc(label)}</span><small>${esc(note)}</small></div>`;
  }

  function indicatorListItem(indicator) {
    const response = indicatorResponse(indicator.ref);
    const status = response.status === "rated" && response.level
      ? `${response.level} · ${catalogue.maturity_level_names[response.level]}`
      : STATUS_LABELS[response.status];
    return `
      <article class="hdrl-indicator-row" style="--domain-colour:${DOMAIN_COLOURS[indicator.domain]}">
        <div class="hdrl-indicator-row__main">
          <div class="hdrl-indicator-meta">
            <span>${indicator.ref}</span>
            <span>${esc(indicator.type)}</span>
            <span>${esc(indicator.applicability_class)}</span>
            <span>${esc(relevance(indicator))}</span>
          </div>
          <h3>${esc(indicator.name)}</h3>
          <p>${esc(status)}${response.evidence.length ? ` · ${response.evidence.length} evidence reference${response.evidence.length === 1 ? "" : "s"}` : ""}</p>
        </div>
        <button type="button" class="md-button" data-action="open-indicator" data-ref="${indicator.ref}">${response.status === "unstarted" ? "Review" : "Edit"} <span class="hdrl-assessment-sr">${esc(indicator.ref)} ${esc(indicator.name)}</span></button>
      </article>
    `;
  }

  function indicatorEvidenceIdeas(indicator) {
    const canonicalIdeas = [...new Set(
      LEVELS.flatMap((level) => indicator.minimum_evidence[level] || [])
    )].slice(0, 4);
    const domainIdeas = content.domain_evidence_examples[indicator.domain] || [];
    return `
      <details class="hdrl-evidence-ideas">
        <summary>Evidence ideas for this indicator</summary>
        <div class="hdrl-assessment-notice">
          <strong>Prompts, not an exam or checklist.</strong> Use only evidence that fits this assessment boundary and date. These examples do not prove a maturity level.
        </div>
        ${canonicalIdeas.length ? `<h4>Indicator-specific prompts from the canonical catalogue</h4><ul>${canonicalIdeas.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : ""}
        <h4>Patterns seen across the three-nation application</h4>
        <ul>${domainIdeas.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
        <p class="hdrl-hint">${esc(content.evidence_guidance.caution)}</p>
      </details>
    `;
  }

  function indicatorView(errors = {}) {
    const indicator = catalogue.indicators.find((item) => item.ref === state.activeIndicator);
    if (!indicator) return evidenceDashboardView();
    const response = indicatorResponse(indicator.ref);
    const domain = catalogue.domains.find((item) => item.ref === indicator.domain);
    const guidance = content.domain_guidance[indicator.domain];
    const index = catalogue.indicators.findIndex((item) => item.ref === indicator.ref);
    const decision = response.decision || (response.status === "rated"
      ? "rated"
      : ["not_known", "not_assessed", "not_applicable"].includes(response.status)
        ? "not_judged"
        : "");
    const snapshot = snapshotResponse(indicator.ref);
    const errorSummary = Object.keys(errors).length
      ? `<div class="hdrl-error-summary" role="alert" tabindex="-1" id="hdrl-indicator-errors">
          <h3>Check this indicator response</h3>
          <ul>${Object.entries(errors).map(([id, message]) => `<li><a href="#${id}">${esc(message)}</a></li>`).join("")}</ul>
        </div>`
      : "";
    return shell(`
      <section class="hdrl-assessment-view" aria-labelledby="hdrl-view-title">
        <button type="button" class="hdrl-back-link" data-action="evidence">← Back to all indicators</button>
        <div class="hdrl-progress-label">Indicator ${index + 1} of 64 · Domain ${indicator.domain}</div>
        <div class="hdrl-indicator-meta">
          <span>${indicator.ref}</span><span>${esc(indicator.type)}</span><span>Class ${esc(indicator.applicability_class)}</span><span>Unit ${esc(indicator.unit)}</span>
          ${indicator.foundational ? `<span class="hdrl-meta-warning">Proposed foundational indicator</span>` : ""}
        </div>
        <h2 id="hdrl-view-title" tabindex="-1">${esc(indicator.name)}</h2>
        <p class="hdrl-assessment-lede"><strong>What this establishes:</strong> the maturity and evidence for ${esc(indicator.name.toLowerCase())} within ${esc(domain.name.toLowerCase())}.</p>
        ${snapshot.status !== "unstarted" ? `<div class="hdrl-snapshot-reference"><strong>Provisional snapshot:</strong> ${esc(snapshot.status === "rated" ? `${snapshot.level} · ${certaintyLabel(snapshot.certainty)}` : STATUS_LABELS[snapshot.status])}. Review it against evidence rather than silently carrying it forward.</div>` : ""}
        <p><span class="hdrl-assessment-chip">${esc(relevance(indicator))}</span> This is a scope suggestion only. Record your applicability decision below.</p>
        <details class="hdrl-guidance">
          <summary>Why it matters, common mistakes and dependencies</summary>
          <p>${esc(content.rapid_questions.find((item) => item.domain === indicator.domain).why)}</p>
          <p><strong>Common interpretation mistake:</strong> ${esc(guidance.common_mistake)}</p>
          <p><strong>Dependencies to consider:</strong> ${guidance.dependencies.map(esc).join("; ")}.</p>
        </details>
        ${errorSummary}
        <form id="hdrl-indicator-form" novalidate>
          <fieldset class="hdrl-status-options">
            <legend>Will you make a maturity judgement?</legend>
            <p class="hdrl-hint">Start with this choice. The form will show only the fields relevant to it.</p>
            ${radio("indicator-decision", "rated", "Make a maturity judgement", "Compare the available evidence with all five canonical descriptors.", decision)}
            ${radio("indicator-decision", "not_judged", "Do not make a judgement", "Record why this indicator cannot or will not be judged now.", decision)}
          </fieldset>
          <div id="hdrl-nonjudgement-panel" ${decision === "not_judged" ? "" : "hidden"}>
            <fieldset class="hdrl-status-options" id="indicator-nonjudgement">
              <legend>Why are you not making a judgement?</legend>
              ${radio("indicator-status", "not_known", "Not known", "The right person or information is not currently available.", response.status)}
              ${radio("indicator-status", "not_assessed", "Not assessed", "Relevant, but intentionally left for a later review.", response.status)}
              ${radio("indicator-status", "not_applicable", "Not applicable", "Outside this explicit assessment boundary.", response.status)}
            </fieldset>
            ${textareaField("indicator-status-reason", "Short explanation", response.statusReason, "Record the knowledge gap, planned follow-up or boundary reason. Missing evidence alone does not make an indicator not applicable.", true, errors["indicator-status-reason"], 800)}
          </div>
          <div id="hdrl-level-panel" ${response.status === "rated" ? "" : "hidden"}>
            <fieldset class="hdrl-level-options">
              <legend>Canonical maturity descriptors</legend>
              <p class="hdrl-hint">Choose the closest descriptor supported by available evidence. Do not interpolate a decimal level.</p>
              ${LEVELS.map((level) => `
                <div class="hdrl-level-option">
                  <input id="indicator-level-${level}" name="indicator-level" type="radio" value="${level}" ${response.level === level ? "checked" : ""}>
                  <label for="indicator-level-${level}">
                    <span><strong>${level} · ${esc(catalogue.maturity_level_names[level])}</strong></span>
                    <span>${esc(indicator.maturity_levels[level])}</span>
                  </label>
                  ${indicator.minimum_evidence[level] ? `
                    <details>
                      <summary>Minimum evidence published for ${level}</summary>
                      <ul>${indicator.minimum_evidence[level].map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
                    </details>` : ""}
                </div>
              `).join("")}
            </fieldset>
          </div>
          <div class="hdrl-form-grid" id="hdrl-judgement-details" ${response.status === "rated" ? "" : "hidden"}>
            <div class="hdrl-field">
              <label for="indicator-certainty">How certain are you?</label>
              <p class="hdrl-hint" id="indicator-certainty-hint">Record confidence in this interpretation separately from the maturity judgement.</p>
              <select id="indicator-certainty" name="indicator-certainty" aria-describedby="indicator-certainty-hint">
                <option value="">Choose certainty</option>
                <option value="high" ${response.certainty === "high" ? "selected" : ""}>High</option>
                <option value="medium" ${response.certainty === "medium" ? "selected" : ""}>Medium</option>
                <option value="low" ${response.certainty === "low" ? "selected" : ""}>Low</option>
              </select>
            </div>
            ${textareaField("indicator-rationale", "Rationale", response.rationale, "Why does the selected level best fit the current evidence?", false, "", 1800)}
          </div>
          <div class="hdrl-form-grid" id="hdrl-judgement-notes" ${response.status === "rated" ? "" : "hidden"}>
            ${textareaField("indicator-improvement", "Potential improvement note", response.improvementNote, "Your own proposed next step. The rules engine will not invent an action.", false, "", 1200)}
          </div>
          <div id="hdrl-evidence-panel" ${response.status === "rated" ? "" : "hidden"}>
          ${indicatorEvidenceIdeas(indicator)}
          <section class="hdrl-evidence-register" aria-labelledby="hdrl-evidence-title">
            <div>
              <h3 id="hdrl-evidence-title">Evidence references</h3>
              <p>References do not mean evidence has been independently reviewed.</p>
            </div>
            ${response.evidence.length ? response.evidence.map((item, evidenceIndex) => evidenceCard(item, evidenceIndex)).join("") : `<p class="hdrl-empty-state">No evidence reference added. The report will treat a maturity judgement as provisional.</p>`}
            <details class="hdrl-evidence-form" id="hdrl-add-evidence">
              <summary>Add an evidence reference</summary>
              <div class="hdrl-assessment-notice"><strong>No uploads.</strong> Use a reference and concise note. Never enter patient data, credentials or detailed exploitable security information.</div>
              <div class="hdrl-form-grid">
                ${textField("evidence-title", "Evidence title", "", "A recognisable document, metric, record or source name.", false, "", 180)}
                <div class="hdrl-field">
                  <label for="evidence-type">Evidence type</label>
                  <select id="evidence-type">
                    <option value="">Choose type</option>
                    <option>Policy or strategy</option>
                    <option>Process or operating record</option>
                    <option>Performance metric</option>
                    <option>Assurance or audit</option>
                    <option>Transparency publication</option>
                    <option>Stakeholder testimony</option>
                    <option>Other</option>
                  </select>
                </div>
                ${textField("evidence-reference", "URL or internal reference", "", "Do not paste access tokens or secret document links.", false, "", 500)}
                ${textField("evidence-owner", "Owner or source", "", "The team, role or public source responsible for it.", false, "", 180)}
                ${textField("evidence-date", "Evidence date", "", "Use the date on the evidence where possible.", false, "", 10, "date")}
                <div class="hdrl-field">
                  <label for="evidence-review-status">Review status</label>
                  <select id="evidence-review-status">
                    <option value="unreviewed">Unreviewed reference</option>
                    <option value="reviewed">Reviewed by assessor</option>
                    <option value="accepted">Accepted in calibration</option>
                    <option value="needs_update">Needs update</option>
                  </select>
                </div>
              </div>
              ${textareaField("evidence-note", "Short explanatory note", "", "What claim does this source help establish?", false, "", 900)}
              ${textareaField("evidence-limitations", "Limitations or uncertainty", "", "Coverage, date, scope, independence or access limitations.", false, "", 900)}
              <button type="button" class="md-button" data-action="add-evidence">Add reference</button>
            </details>
          </section>
          </div>
          <div class="hdrl-assessment-actions">
            <button type="submit" class="md-button md-button--primary">Save and return to indicators</button>
            ${index < 63 ? `<button type="button" class="md-button" data-action="save-next">Save and open next indicator</button>` : ""}
          </div>
        </form>
      </section>
    `);
  }

  function evidenceCard(item, index) {
    return `
      <article class="hdrl-evidence-card">
        <div>
          <span class="hdrl-assessment-chip">${esc(item.type || "Evidence")}</span>
          <h4>${esc(item.title)}</h4>
          <p>${esc(item.reference || "No external reference")} · ${esc(item.owner || "No owner recorded")}</p>
          <p><strong>Status:</strong> ${esc(item.reviewStatus.replaceAll("_", " "))}${item.date ? ` · <strong>Date:</strong> ${esc(item.date)}` : ""}</p>
          ${item.note ? `<p>${esc(item.note)}</p>` : ""}
          ${item.limitations ? `<p><strong>Limitations:</strong> ${esc(item.limitations)}</p>` : ""}
        </div>
        <button type="button" class="hdrl-link-button hdrl-link-button--danger" data-action="remove-evidence" data-index="${index}">Remove <span class="hdrl-assessment-sr">${esc(item.title)}</span></button>
      </article>
    `;
  }

  function reviewIssues() {
    const issues = [];
    catalogue.indicators.forEach((indicator) => {
      const response = indicatorResponse(indicator.ref);
      if (response.status === "rated" && !response.level) issues.push({ ref: indicator.ref, type: "Missing level", text: "Maturity judgement selected without a level." });
      if (response.status === "rated" && !response.rationale.trim()) issues.push({ ref: indicator.ref, type: "Missing rationale", text: "Judgement has no rationale." });
      if (response.status === "rated" && response.evidence.length === 0) issues.push({ ref: indicator.ref, type: "Evidence gap", text: "Judgement has no evidence reference and will be provisional." });
      if (["not_known", "not_assessed", "not_applicable"].includes(response.status) && !response.statusReason.trim()) issues.push({ ref: indicator.ref, type: "Missing explanation", text: "The decision not to make a judgement has no explanation." });
      if (response.status === "not_known") issues.push({ ref: indicator.ref, type: "Knowledge gap", text: "The response is not known." });
      if (["unstarted", "not_assessed"].includes(response.status)) issues.push({ ref: indicator.ref, type: "Not assessed", text: "The indicator is not assessed." });
    });
    return issues;
  }

  function domainSummary(domainRef) {
    const values = catalogue.indicators
      .filter((indicator) => indicator.domain === domainRef && indicator.type === "Core" && indicator.applicability_class !== "Y")
      .map((indicator) => indicatorResponse(indicator.ref))
      .filter((response) => response.status === "rated" && LEVELS.includes(response.level))
      .map((response) => Number(response.level.slice(1)))
      .sort((a, b) => a - b);
    if (!values.length) return { label: "Insufficient assessed indicators", median: "—", range: "—", count: 0 };
    const middle = Math.floor(values.length / 2);
    const low = values.length % 2 ? values[middle] : values[middle - 1];
    const high = values.length % 2 ? values[middle] : values[middle];
    const median = low === high ? `L${low}` : `L${low}–L${high}`;
    const range = `L${values[0]}–L${values[values.length - 1]}`;
    const label = low === high
      ? `${median} · ${catalogue.maturity_level_names[median]}`
      : `${median} core median range`;
    return { label, median, range, count: values.length };
  }

  function reviewView() {
    const s = stats();
    const issues = reviewIssues();
    return shell(`
      <section class="hdrl-assessment-view hdrl-assessment-view--wide" aria-labelledby="hdrl-view-title">
        <div class="hdrl-progress-label">Review before report · nothing will be submitted</div>
        <h2 id="hdrl-view-title" tabindex="-1">Check coverage and limitations</h2>
        <p class="hdrl-assessment-lede">Missing and uncertain responses are valid when they are visible. The report will not impute them.</p>
        <div class="hdrl-stat-row">
          ${statCard(s.judged, "Judged", "of 64")}
          ${statCard(s.evidenceLinked, "With evidence", "references")}
          ${statCard(s.unknown, "Not known", "knowledge gaps")}
          ${statCard(s.notAssessed, "Not assessed", "including not started")}
        </div>
        <h3>Domain summary convention</h3>
        <p>Based on applicable judged Core indicators, excluding Outcome/Context entries. Missing responses are not imputed; even medians are shown as a range. There is no overall score.</p>
        <div class="hdrl-review-domains">
          ${catalogue.domains.map((domain) => {
            const summary = domainSummary(domain.ref);
            return `<div style="--domain-colour:${DOMAIN_COLOURS[domain.ref]}"><span>${domain.ref}</span><strong>${esc(domain.name)}</strong><p>${esc(summary.label)}</p><small>${summary.count} Core judgement${summary.count === 1 ? "" : "s"} included</small></div>`;
          }).join("")}
        </div>
        <h3>Items to understand before reporting</h3>
        ${issues.length ? `
          <div class="hdrl-review-issues">
            ${issues.slice(0, 30).map((issue) => `
              <button type="button" data-action="open-indicator" data-ref="${issue.ref}">
                <span>${esc(issue.type)}</span><strong>${esc(issue.ref)}</strong><small>${esc(issue.text)}</small>
              </button>`).join("")}
          </div>
          ${issues.length > 30 ? `<p>${issues.length - 30} additional items will be listed in the report.</p>` : ""}` : `<p class="hdrl-success-panel">No obvious completeness issues were found. This does not validate the judgements or evidence.</p>`}
        ${state.boundary.method === "team" ? teamReviewPanel() : ""}
        <div class="hdrl-assessment-actions">
          <button type="button" class="md-button md-button--primary" data-action="gate">Continue to report information</button>
          <button type="button" class="md-button" data-action="evidence">Return to indicators</button>
        </div>
      </section>
    `);
  }

  function teamReviewPanel() {
    return `
      <div class="hdrl-assessment-callout">
        <h3>Team method in this prototype</h3>
        <p>This on-device prototype records one working set of responses. The production workflow will collect independent submissions before revealing a distribution, then record a separate facilitated consensus and unresolved disagreement. A team average will never be presented as truth.</p>
      </div>
    `;
  }

  function gateView(errors = {}) {
    const r = state.registration;
    const s = stats();
    const snapshot = snapshotStats();
    const errorSummary = Object.keys(errors).length
      ? `<div class="hdrl-error-summary" role="alert" tabindex="-1" id="hdrl-gate-errors"><h3>Check the report information</h3><ul>${Object.entries(errors).map(([id, message]) => `<li><a href="#${id}">${esc(message)}</a></li>`).join("")}</ul></div>`
      : "";
    return shell(`
      <section class="hdrl-assessment-view" aria-labelledby="hdrl-view-title">
        <div class="hdrl-progress-label">Limited completion summary</div>
        <h2 id="hdrl-view-title" tabindex="-1">Your assessment is ready to report</h2>
        <div class="hdrl-limited-summary">
          <div><strong>${Object.values(state.rapid).filter((item) => item.impression).length}/8</strong><span>rapid impressions</span></div>
          <div><strong>${snapshot.completed}/64</strong><span>snapshot indicators</span></div>
          <div><strong>${s.judged}/64</strong><span>indicator judgements</span></div>
          <div><strong>${s.evidenceLinked}/64</strong><span>with evidence references</span></div>
        </div>
        <div class="hdrl-assessment-notice">
          <strong>Prototype gate.</strong> Nothing is emailed or transmitted. These fields test the minimum report-access journey and stay on this device. Use sample contact information if preferred.
        </div>
        ${errorSummary}
        <form id="hdrl-gate-form" novalidate>
          <div class="hdrl-form-grid">
            ${textField("gate-name", "Name (optional)", r.name, "Used only if you choose contactable feedback or follow-up; it is not shown in the assessment report.", false, errors["gate-name"], 120, "text", "name")}
            ${textField("gate-email", "Email address", r.email, "A public beta would verify this address before unlocking the locally generated report. It is not marketing consent.", true, errors["gate-email"], 200, "email", "email")}
            ${textField("gate-role", "Role", r.role, "Helps OPL Advisory understand which professional perspectives the beta is reaching; it is not shown in the assessment report.", true, errors["gate-role"], 120, "text", "organization-title")}
            ${textField("gate-organisation", "Organisation", r.organisation, "Lets OPL Advisory administer beta participation and avoid treating repeat use as separate organisations; it is not shown in the assessment report.", true, errors["gate-organisation"], 180, "text", "organization")}
            ${textField("gate-region", "Country or region (optional)", r.region, "Provides broad operating context without requiring a precise location.", false, errors["gate-region"], 120, "text", "country-name")}
            <div class="hdrl-field ${errors["gate-service-type"] ? "hdrl-field--error" : ""}">
              <label for="gate-service-type">Type of service (optional)</label>
              <p class="hdrl-hint" id="gate-service-type-hint">A broad category is enough for interpretation.</p>
              <select id="gate-service-type" aria-describedby="gate-service-type-hint${errors["gate-service-type"] ? " gate-service-type-error" : ""}">
                <option value="">Choose a broad type</option>
                ${["National or regional system", "Secure data environment or TRE", "Data service or platform", "Research network or federation", "Cohort, registry or biobank", "Other"].map((value) => `<option ${r.serviceType === value ? "selected" : ""}>${value}</option>`).join("")}
              </select>
              ${fieldError(errors["gate-service-type"], "gate-service-type")}
            </div>
            <div class="hdrl-field ${errors["gate-scale"] ? "hdrl-field--error" : ""}">
              <label for="gate-scale">Approximate scale (optional)</label>
              <p class="hdrl-hint" id="gate-scale-hint">Use a broad band; do not enter an exact patient population.</p>
              <select id="gate-scale" aria-describedby="gate-scale-hint${errors["gate-scale"] ? " gate-scale-error" : ""}">
                <option value="">Choose a broad band</option>
                ${["Single team or local service", "Multi-team or regional service", "Multi-organisation or national service", "Cross-border or international ecosystem", "Prefer not to categorise"].map((value) => `<option ${r.scale === value ? "selected" : ""}>${value}</option>`).join("")}
              </select>
              ${fieldError(errors["gate-scale"], "gate-scale")}
            </div>
            <div class="hdrl-field ${errors["gate-use-mode"] ? "hdrl-field--error" : ""}">
              <label for="gate-use-mode">Individual or team use <span aria-hidden="true">*</span></label>
              <p class="hdrl-hint" id="gate-use-mode-hint">Helps OPL Advisory understand whether the beta is supporting individual reflection or an internal team exercise.</p>
              <select id="gate-use-mode" required aria-describedby="gate-use-mode-hint${errors["gate-use-mode"] ? " gate-use-mode-error" : ""}">
                <option value="">Choose one</option>
                ${["Individual exploration", "Several independent team responses", "Facilitated team discussion", "Another approach"].map((value) => `<option ${r.useMode === value ? "selected" : ""}>${value}</option>`).join("")}
              </select>
              ${fieldError(errors["gate-use-mode"], "gate-use-mode")}
            </div>
            <div class="hdrl-field ${errors["gate-report-use"] ? "hdrl-field--error" : ""}">
              <label for="gate-report-use">Main intended use <span aria-hidden="true">*</span></label>
              <p class="hdrl-hint" id="gate-report-use-hint">A broad category is enough; do not describe sensitive plans.</p>
              <select id="gate-report-use" required aria-describedby="gate-report-use-hint${errors["gate-report-use"] ? " gate-report-use-error" : ""}">
                <option value="">Choose one</option>
                ${["Learn about HDRL", "Internal readiness discussion", "Improvement planning", "Team calibration", "Prepare for an evidence review", "Test and give beta feedback", "Another use"].map((value) => `<option ${r.reportUse === value ? "selected" : ""}>${value}</option>`).join("")}
              </select>
              ${fieldError(errors["gate-report-use"], "gate-report-use")}
            </div>
          </div>
          <fieldset class="hdrl-optional-consents">
            <legend>Optional contact choices</legend>
            <p>Both are separate, optional and unchecked. They do not affect report access.</p>
            <div class="hdrl-checkbox">
              <input id="gate-research" type="checkbox" ${r.researchContact ? "checked" : ""}>
              <label for="gate-research">OPL Advisory may email me about voluntary HDRL research or testing. I can withdraw at any time.</label>
            </div>
            <div class="hdrl-checkbox">
              <input id="gate-newsletter" type="checkbox" ${r.newsletter ? "checked" : ""}>
              <label for="gate-newsletter">OPL Advisory may email me occasional HDRL updates. I can unsubscribe at any time.</label>
            </div>
          </fieldset>
          <div class="hdrl-assessment-actions">
            <button type="submit" class="md-button md-button--primary">Unlock the on-device report</button>
            <button type="button" class="md-button" data-action="overview">Back to assessment overview</button>
          </div>
        </form>
      </section>
    `);
  }

  function derivedFindings() {
    const supported = [];
    const provisional = [];
    const questions = [];
    const actions = [];
    catalogue.indicators.forEach((indicator) => {
      const response = indicatorResponse(indicator.ref);
      if (response.status === "rated" && response.level) {
        const reviewed = response.evidence.filter((item) => ["reviewed", "accepted"].includes(item.reviewStatus));
        if (reviewed.length) {
          supported.push({
            ref: indicator.ref,
            text: `${response.level} judgement has ${reviewed.length} evidence reference${reviewed.length === 1 ? "" : "s"} marked reviewed or accepted by the assessor.`,
            rule: "Direct evidence-status summary"
          });
        } else {
          provisional.push({
            ref: indicator.ref,
            text: `${response.level} judgement has no evidence reference marked reviewed or accepted.`,
            rule: "R-EVIDENCE-GAP"
          });
        }
      }
      if (response.status === "not_known" || response.certainty === "low") {
        questions.push({
          ref: indicator.ref,
          text: `Who is closest to this capability, and what evidence would resolve the uncertainty?`,
          rule: "R-LOW-CERTAINTY"
        });
      } else if (["unstarted", "not_assessed"].includes(response.status)) {
        questions.push({
          ref: indicator.ref,
          text: `Is this indicator relevant, who should review it, and by when?`,
          rule: "R-NOT-ASSESSED"
        });
      }
      if (response.improvementNote.trim()) {
        actions.push({
          ref: indicator.ref,
          text: response.improvementNote.trim(),
          rule: "R-USER-ACTION"
        });
      }
    });
    return { supported, provisional, questions, actions };
  }

  function reportView() {
    if (!state.registration.unlocked) return gateView();
    const s = stats();
    const findings = derivedFindings();
    const assessedDate = state.boundary.assessmentDate || today();
    const generatedDate = today();
    return shell(`
      <article class="hdrl-generated-report" id="hdrl-generated-report" aria-labelledby="hdrl-view-title">
        <header class="hdrl-report-header">
          <span class="hdrl-assessment-kicker">HDRL self-assessment report</span>
          <h2 id="hdrl-view-title" tabindex="-1">${esc(state.boundary.title)}</h2>
          <p>${esc(state.boundary.serviceName)} · ${esc(assessedDate)}</p>
          <div class="hdrl-report-warning"><strong>Self-assessment—not validation or accreditation.</strong> Results depend on the stated boundary, participants and evidence available at the assessment date.</div>
        </header>
        <div class="hdrl-report-actions">
          <button type="button" class="md-button md-button--primary" data-action="print">Print or save PDF</button>
          <button type="button" class="md-button" data-action="export-json">Download JSON</button>
          <button type="button" class="md-button" data-action="export-snapshot-csv">Download snapshot CSV</button>
          <button type="button" class="md-button" data-action="export-csv">Download evidence CSV</button>
          <button type="button" class="md-button" data-action="feedback">Share feedback</button>
          <button type="button" class="md-button" data-action="share-results">Create optional share bundle</button>
          <button type="button" class="md-button" data-action="review">Revise assessment</button>
        </div>
        <section>
          <h3>Assessment identity and method</h3>
          <dl class="hdrl-report-definition">
            <div><dt>Service or ecosystem</dt><dd>${esc(state.boundary.serviceName)}</dd></div>
            <div><dt>Scope</dt><dd>${esc(state.boundary.scope)}</dd></div>
            <div><dt>Time period</dt><dd>${esc(state.boundary.timePeriod)}</dd></div>
            <div><dt>Assessment date</dt><dd>${esc(assessedDate)}</dd></div>
            <div><dt>Unit</dt><dd>${esc(state.boundary.unit)}</dd></div>
            <div><dt>Method</dt><dd>${state.boundary.method === "team" ? "Team workflow represented by one prototype working set; production requires independent blind submissions and calibration." : "Individual self-assessment."}</dd></div>
            <div><dt>Intended use</dt><dd>${esc(state.boundary.intendedUse)}</dd></div>
            <div><dt>Versions</dt><dd>HDRL ${VERSIONS.framework}; catalogue ${VERSIONS.catalogue}; tool ${VERSIONS.tool}; guidance ${VERSIONS.guidance}; rules ${VERSIONS.rules}; report ${VERSIONS.report}.</dd></div>
          </dl>
        </section>
        <section>
          <h3>Rapid first pass</h3>
          <p>These are preliminary domain impressions based on current knowledge. They are not evidence-led HDRL scores.</p>
          ${rapidProfileMatrix({ interactive: false, id: "report-rapid-profile" })}
        </section>
        <section>
          <h3>Whole-framework snapshot</h3>
          <p>These are provisional selections made without an evidence requirement. They show current understanding and certainty, not validated maturity.</p>
          <div class="hdrl-report-table-wrap" role="region" aria-label="Provisional snapshot domain profile" tabindex="0">
            <table class="hdrl-domain-summary-table">
              <thead><tr><th scope="col">Domain</th><th scope="col">Core median</th><th scope="col">Observed range</th><th scope="col">Completed</th></tr></thead>
              <tbody>${catalogue.domains.map((domain) => {
                const summary = snapshotDomainSummary(domain.ref);
                const progress = snapshotDomainProgress(domain.ref);
                return `<tr><th scope="row"><span class="hdrl-domain-key" style="--domain-colour:${DOMAIN_COLOURS[domain.ref]}">${domain.ref}</span> ${esc(domain.name)}</th><td><strong>${esc(summary.median)}</strong></td><td>${esc(summary.range)}</td><td>${progress.completed}/${progress.total}</td></tr>`;
              }).join("")}</tbody>
            </table>
          </div>
          <ul>
            <li>${snapshotStats().lowCertainty} rated indicators have low certainty.</li>
            <li>${snapshotStats().clarityFlags} indicators have optional wording or level-distinction flags.</li>
            <li>${64 - snapshotStats().completed} indicators were not completed.</li>
          </ul>
        </section>
        <section>
          <h3>Evidence-led domain profile</h3>
          <p>Summaries use applicable judged Core indicators and exclude Outcome/Context entries. Missing responses are not imputed. Even medians are ranges. No overall score is calculated.</p>
          <div class="hdrl-report-table-wrap" role="region" aria-label="Evidence-led domain profile" tabindex="0">
            <table class="hdrl-domain-summary-table">
              <thead><tr><th scope="col">Domain</th><th scope="col">Core median</th><th scope="col">Observed range</th><th scope="col">Coverage</th></tr></thead>
              <tbody>${catalogue.domains.map((domain) => {
                const summary = domainSummary(domain.ref);
                return `<tr><th scope="row"><span class="hdrl-domain-key" style="--domain-colour:${DOMAIN_COLOURS[domain.ref]}">${domain.ref}</span> ${esc(domain.name)}</th><td><strong>${esc(summary.median)}</strong></td><td>${esc(summary.range)}</td><td>${summary.count} Core judgement${summary.count === 1 ? "" : "s"}</td></tr>`;
              }).join("")}</tbody>
            </table>
          </div>
        </section>
        <section>
          <h3>Evidence, certainty and coverage</h3>
          <ul>
            <li>${s.judged} of 64 indicators have a maturity judgement.</li>
            <li>${s.evidenceLinked} indicators have one or more evidence references.</li>
            <li>${s.unknown} are not known; ${s.notAssessed} are not assessed or not started; ${s.notApplicable} are marked not applicable.</li>
            <li>An evidence reference is not independent verification. “Reviewed” means reviewed by the assessor or calibration group only.</li>
          </ul>
        </section>
        ${findingSection("Findings supported by referenced evidence status", findings.supported, "No maturity judgements have evidence marked reviewed or accepted.")}
        ${findingSection("Provisional interpretations", findings.provisional, "No provisional maturity judgements were generated by the current rule.")}
        ${findingSection("Suggested questions to investigate", findings.questions, "No low-certainty or unassessed prompts were generated.")}
        ${findingSection("Potential improvement actions", findings.actions, "No user-entered improvement actions were recorded. The tool does not invent actions.")}
        <section>
          <h3>Indicator-level results and derivation</h3>
          <div class="hdrl-report-table-wrap" role="region" aria-label="All indicator results" tabindex="0">
            <table>
              <thead><tr><th scope="col">Indicator</th><th scope="col">Status / judgement</th><th scope="col">Certainty</th><th scope="col">Evidence</th><th scope="col">Notes</th></tr></thead>
              <tbody>
                ${catalogue.indicators.map((indicator) => {
                  const response = indicatorResponse(indicator.ref);
                  const result = response.status === "rated" && response.level ? `${response.level} · ${catalogue.maturity_level_names[response.level]}` : STATUS_LABELS[response.status];
                  return `<tr><th scope="row">${indicator.ref} · ${esc(indicator.name)}</th><td>${esc(result)}</td><td>${esc(certaintyLabel(response.certainty))}</td><td>${response.evidence.length}</td><td>${esc(response.rationale || response.statusReason || "No rationale recorded")}</td></tr>`;
                }).join("")}
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <h3>Dependencies and constraints</h3>
          <p>HDRL is sociotechnical: domain patterns should be interpreted together. Review these dependencies where a domain is uncertain, thinly evidenced or constrained:</p>
          <div class="hdrl-constraint-list">${catalogue.domains.map((domain) => `<div style="--domain-colour:${DOMAIN_COLOURS[domain.ref]}"><h4>${domain.ref} · ${esc(domain.name)}</h4><p><strong>Dependencies:</strong> ${content.domain_guidance[domain.ref].dependencies.map(esc).join("; ")}.</p><p><strong>Operating capacity or constraints:</strong> ${esc(state.domainNotes[domain.ref] || "No domain-level note recorded.")}</p></div>`).join("")}</div>
        </section>
        ${state.boundary.method === "team" ? `
          <section>
            <h3>Team disagreement and calibration</h3>
            <p>This prototype contains one working set and cannot show a genuine team distribution. A production team report must preserve independent responses, applicability differences, calibration rationale, unresolved disagreement, action ownership and material-change history. A team average must not be presented as objective truth.</p>
          </section>` : ""}
        <section>
          <h3>Limitations and responsible use</h3>
          <ul>
            <li>This report is self-reported and has not been independently validated, assured or endorsed.</li>
            <li>HDRL remains evidence-informed and formatively applied; reliability, validity and accreditation fitness are not established.</li>
            <li>A maturity judgement describes the available evidence at a date and does not guarantee delivery, legal compliance, funding or programme participation.</li>
            <li>Rapid impressions and evidence-led judgements use different methods and should not be combined.</li>
            <li>Rules version ${VERSIONS.rules} identifies coverage, evidence and certainty patterns only; it does not provide professional, legal or investment advice.</li>
          </ul>
        </section>
        <footer class="hdrl-report-footer">
          <h3>Help validate HDRL</h3>
          <p>Read, critique and test the framework. Share where wording is unclear, which evidence is difficult to obtain and where the tool risks oversimplifying reality.</p>
          <p>Generated on ${esc(generatedDate)} using report generation ${VERSIONS.report}. The HTML report is the accessible source; browser-created PDFs must be checked before distribution.</p>
        </footer>
      </article>
    `);
  }

  function findingSection(title, items, empty) {
    return `
      <section>
        <h3>${esc(title)}</h3>
        ${items.length ? `<ul class="hdrl-finding-list">${items.slice(0, 25).map((item) => `<li><strong>${esc(item.ref)}</strong> ${esc(item.text)} <small>Derivation: ${esc(item.rule)}</small></li>`).join("")}</ul>${items.length > 25 ? `<p>${items.length - 25} additional items are included in the JSON export.</p>` : ""}` : `<p>${esc(empty)}</p>`}
      </section>
    `;
  }

  function betaActivityView() {
    const s = snapshotStats();
    const counts = Object.fromEntries(betaConfig.event_allowlist && Object.keys(betaConfig.event_allowlist).map((name) => [name, state.beta.events.filter((event) => event.name === name).length]));
    return shell(`
      <section class="hdrl-assessment-view hdrl-assessment-view--wide" aria-labelledby="hdrl-view-title">
        <div class="hdrl-progress-label">Local beta diagnostics · no remote collection</div>
        <h2 id="hdrl-view-title" tabindex="-1">What the beta activity record contains</h2>
        <p class="hdrl-assessment-lede">This prototype records a privacy-minimised event funnel on this device so the proposed contract can be inspected before any backend is selected.</p>
        <div class="hdrl-data-boundary-grid">
          <article><h3>Operational beta record</h3><ul>${betaConfig.privacy_boundary.operational_by_default.map((item) => `<li>${esc(item.replaceAll("_", " "))}</li>`).join("")}</ul></article>
          <article><h3>Always local by default</h3><ul>${betaConfig.privacy_boundary.local_only.map((item) => `<li>${esc(item.replaceAll("_", " "))}</li>`).join("")}</ul></article>
          <article><h3>Explicit sharing only</h3><ul>${betaConfig.privacy_boundary.explicit_share_only.map((item) => `<li>${esc(item.replaceAll("_", " "))}</li>`).join("")}</ul></article>
        </div>
        <h3>Current local funnel</h3>
        <div class="hdrl-beta-funnel">
          ${statCard(counts.assessment_started || 0, "Started", "session event")}
          ${statCard(counts.snapshot_completed || 0, "Snapshot completed", `${s.completed}/64 now`)}
          ${statCard(counts.report_unlocked || 0, "Report unlocked", "verified gate simulation")}
          ${statCard(counts.report_download_requested || 0, "Download requests", "all formats")}
          ${statCard(counts.feedback_submitted || 0, "Feedback submitted", `${counts.feedback_skipped || 0} skipped`)}
        </div>
        <div class="hdrl-assessment-notice"><strong>No event transport is active.</strong> No beta activity, identity, feedback or assessment data leave this device in v0.3 until a provider, notice, retention rule and production security review are approved.</div>
        <div class="hdrl-assessment-actions">
          <button type="button" class="md-button" data-action="export-beta-activity">Download local beta activity record</button>
          ${state.beta.feedback.length ? `<button type="button" class="md-button" data-action="export-feedback">Download saved feedback bundle</button>` : ""}
          <button type="button" class="md-button" data-action="overview">Return to assessment overview</button>
        </div>
      </section>
    `);
  }

  function feedbackView() {
    const context = Object.keys(state.beta.feedbackContext || {}).length ? state.beta.feedbackContext : feedbackContext();
    return shell(`
      <section class="hdrl-assessment-view" aria-labelledby="hdrl-view-title">
        <div class="hdrl-progress-label">About 15 seconds · optional</div>
        <h2 id="hdrl-view-title" tabindex="-1">Help improve the HDRL beta</h2>
        <p class="hdrl-assessment-lede">A quick rating or a specific problem is useful. You can continue without providing feedback.</p>
        <div class="hdrl-assessment-notice"><strong>Local prototype.</strong> Feedback is saved on this device and can be downloaded as a deliberately shareable bundle. It is not transmitted to OPL Advisory yet.</div>
        <form id="hdrl-feedback-form">
          <fieldset class="hdrl-feedback-rating">
            <legend>Overall, how easy was this experience?</legend>
            ${[[1,"Very difficult"],[2,"Difficult"],[3,"Mixed"],[4,"Easy"],[5,"Very easy"]].map(([value,label]) => radio("feedback-rating", String(value), String(value), label, "")).join("")}
          </fieldset>
          <div class="hdrl-field">
            <label for="feedback-category">What is this feedback mainly about?</label>
            <select id="feedback-category" name="feedback-category"><option value="">Choose a category</option>${betaConfig.feedback_categories.map((category) => `<option value="${category}">${esc(category.replaceAll("_", " "))}</option>`).join("")}</select>
          </div>
          ${textareaField("feedback-comment", "Optional comment", "", "Do not include assessment results or unnecessarily identifying or sensitive information.", false, "", 1600)}
          <fieldset class="hdrl-status-options">
            <legend>How should this feedback be shared?</legend>
            ${radio("feedback-mode", "without_contact", "Without contact details", "Include limited tool context but no email, participant ID or persistent session identifier. Free text may still identify you.", "without_contact")}
            ${radio("feedback-mode", "contactable", "With my beta contact details", "Allow OPL Advisory to follow up about this feedback after remote submission is approved.", "without_contact")}
          </fieldset>
          <details class="hdrl-guidance">
            <summary>Context that would accompany feedback without contact details</summary>
            <dl class="hdrl-report-definition">${Object.entries(context).filter(([,value]) => value !== "").map(([key,value]) => `<div><dt>${esc(key.replaceAll("_", " "))}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl>
            <p>No selected level, certainty, assessment title, scope, note, evidence or report content is included.</p>
          </details>
          <div class="hdrl-assessment-actions">
            <button type="submit" class="md-button md-button--primary">Save feedback and continue</button>
            <button type="button" class="md-button" data-action="skip-feedback">Not now—continue</button>
          </div>
        </form>
      </section>
    `);
  }

  function shareResultsView() {
    return shell(`
      <section class="hdrl-assessment-view" aria-labelledby="hdrl-view-title">
        <div class="hdrl-progress-label">Explicit sharing · local file only</div>
        <h2 id="hdrl-view-title" tabindex="-1">Create a results share bundle</h2>
        <p class="hdrl-assessment-lede">Nothing is selected by default. Review each category and include only what the intended recipient needs.</p>
        <div class="hdrl-assessment-callout"><h3>Business-sensitive information</h3><p>A share bundle may reveal perceived strengths, gaps and uncertainty. It is downloaded to this device and is never sent automatically. Use an organisation-approved transfer route.</p></div>
        <form id="hdrl-share-form">
          <fieldset class="hdrl-share-options">
            <legend>Choose information to include</legend>
            <div class="hdrl-checkbox"><input id="share-snapshot" name="share-snapshot" type="checkbox"><label for="share-snapshot"><strong>Whole-framework snapshot</strong><span>Indicator status, level, certainty and clarity flag.</span></label></div>
            <div class="hdrl-checkbox"><input id="share-evidence-results" name="share-evidence-results" type="checkbox"><label for="share-evidence-results"><strong>Evidence-led results</strong><span>Status, level, certainty and evidence counts.</span></label></div>
            <div class="hdrl-checkbox"><input id="share-comments" name="share-comments" type="checkbox"><label for="share-comments"><strong>Comments and rationale</strong><span>Snapshot notes, evidence-led rationale and improvement notes.</span></label></div>
            <div class="hdrl-checkbox"><input id="share-evidence-records" name="share-evidence-records" type="checkbox"><label for="share-evidence-records"><strong>Evidence reference details</strong><span>Titles, references, owners, notes and limitations.</span></label></div>
          </fieldset>
          <div class="hdrl-assessment-actions"><button type="submit" class="md-button md-button--primary">Review and download bundle</button><button type="button" class="md-button" data-action="report">Return to report</button></div>
        </form>
      </section>
    `);
  }

  function sampleState() {
    const sample = defaultState();
    sample.boundary = {
      title: "Example regional research data service",
      serviceName: "Example service (synthetic)",
      scope: "A fictional regional research data service and its current system dependencies. No real organisation or evidence is represented.",
      timePeriod: "Synthetic snapshot at July 2026",
      assessmentDate: "2026-07-30",
      unit: "dual",
      method: "individual",
      intendedUse: "Learn how the HDRL assessment journey and report work."
    };
    content.rapid_questions.forEach((question, index) => {
      sample.rapid[question.domain] = {
        impression: ["developing", "defined", "defined", "developing", "managed", "developing", "defined", "managed"][index],
        certainty: index % 3 === 0 ? "low" : "medium",
        note: "Synthetic example impression."
      };
    });
    catalogue.indicators.forEach((indicator, index) => {
      sample.snapshot[indicator.ref] = {
        status: "rated",
        level: `L${(index % 4) + 2}`,
        certainty: index % 7 === 0 ? "low" : index % 3 === 0 ? "high" : "medium",
        certaintyReasons: index % 7 === 0 ? ["knowledge_gap", "evidence_gap"] : [],
        clarity: index % 9 === 0 ? "some_overlap" : index % 13 === 0 ? "unclear" : "clear",
        note: index % 11 === 0 ? "Synthetic snapshot note; no real service is represented." : "",
        updatedAt: nowIso()
      };
    });
    catalogue.domains.forEach((domain, index) => {
      sample.domainNotes[domain.ref] = index % 3 === 0 ? "Synthetic example: operating headroom should be checked at domain level." : "";
    });
    catalogue.indicators.slice(0, 12).forEach((indicator, index) => {
      sample.indicators[indicator.ref] = {
        decision: "rated",
        status: "rated",
        level: `L${(index % 3) + 2}`,
        certainty: index % 4 === 0 ? "low" : "medium",
        rationale: "Synthetic rationale used only to demonstrate the report.",
        improvementNote: index % 4 === 0 ? "Confirm the responsible owner and review the current operating evidence." : "",
        statusReason: "",
        evidence: index % 2 === 0 ? [{
          id: makeId(),
          title: "Synthetic operating record",
          type: "Process or operating record",
          reference: "EXAMPLE-ONLY",
          owner: "Example team",
          date: today(),
          note: "Demonstration record; not real evidence.",
          limitations: "Synthetic and not independently reviewed.",
          reviewStatus: index % 4 === 0 ? "reviewed" : "unreviewed"
        }] : [],
        updatedAt: nowIso()
      };
    });
    sample.registration = {
      unlocked: true,
      name: "Sample user",
      email: "sample@example.invalid",
      role: "Service lead",
      organisation: "Synthetic organisation",
      region: "United Kingdom",
      serviceType: "Secure data environment or TRE",
      scale: "Multi-team or regional service",
      useMode: "Individual exploration",
      reportUse: "Learn about HDRL",
      researchContact: false,
      newsletter: false
    };
    sample.beta.events = [{ id: makeId(), name: "assessment_started", at: nowIso(), active_time_band: "15_to_30_minutes", entry_point: "synthetic_sample" }, { id: makeId(), name: "snapshot_completed", at: nowIso(), active_time_band: "15_to_30_minutes", completed_indicator_count: 64, completed_domain_count: 8 }];
    sample.view = "report";
    return sample;
  }

  function exportPayload() {
    return {
      export_schema: "hdrl-self-assessment-export-v0.3.0",
      exported_at: nowIso(),
      versions: { ...VERSIONS },
      assessment: {
        id: state.id,
        created_at: state.createdAt,
        updated_at: state.updatedAt,
        boundary: state.boundary,
        rapid_first_pass: state.rapid,
        whole_framework_snapshot: state.snapshot,
        domain_capacity_notes: state.domainNotes,
        evidence_led_responses: state.indicators,
        audit: state.audit
      },
      derived: {
        snapshot_domain_summaries: Object.fromEntries(catalogue.domains.map((domain) => [domain.ref, snapshotDomainSummary(domain.ref)])),
        domain_summaries: Object.fromEntries(catalogue.domains.map((domain) => [domain.ref, domainSummary(domain.ref)])),
        findings: derivedFindings()
      },
      limitations: [
        "Self-assessment; not validation, accreditation or endorsement.",
        "Rapid impressions are not HDRL indicator scores.",
        "Whole-framework snapshot selections are provisional and not evidence-backed.",
        "Evidence references are not independently verified.",
        "No overall HDRL score is calculated."
      ]
    };
  }

  function csvPayload() {
    const columns = ["indicator_ref", "indicator_name", "domain", "status", "level", "certainty", "rationale", "domain_capacity_note", "improvement_note", "status_reason", "evidence_count", "evidence_titles"];
    const rows = catalogue.indicators.map((indicator) => {
      const response = indicatorResponse(indicator.ref);
      return [
        indicator.ref,
        indicator.name,
        indicator.domain,
        response.status,
        response.level,
        response.certainty,
        response.rationale,
        state.domainNotes[indicator.domain] || "",
        response.improvementNote,
        response.statusReason,
        response.evidence.length,
        response.evidence.map((item) => item.title).join("; ")
      ].map(csvCell).join(",");
    });
    return [columns.join(","), ...rows].join("\n");
  }

  function csvCell(value) {
    let safe = String(value ?? "");
    if (/^[=+\-@\t\r]/.test(safe)) safe = `'${safe}`;
    return `"${safe.replaceAll('"', '""')}"`;
  }

  function snapshotCsvPayload() {
    const columns = ["indicator_ref", "indicator_name", "domain", "status", "level", "certainty", "certainty_reasons", "level_clarity", "optional_note"];
    const rows = catalogue.indicators.map((indicator) => {
      const response = snapshotResponse(indicator.ref);
      return [indicator.ref, indicator.name, indicator.domain, response.status, response.level, response.certainty, response.certaintyReasons.join("; "), response.clarity, response.note].map(csvCell).join(",");
    });
    return [columns.join(","), ...rows].join("\n");
  }

  function betaActivityPayload() {
    updateActiveTime();
    return {
      schema: "hdrl-beta-activity-v0.1.0",
      exported_at: nowIso(),
      beta_session_id: state.beta.sessionId,
      versions: { ...VERSIONS },
      active_time_band: activeTimeBand(),
      events: state.beta.events,
      statement: "Contains operational beta events only. No maturity level, certainty, assessment text, evidence or report content is included."
    };
  }

  function feedbackBundlePayload() {
    return {
      schema: "hdrl-beta-feedback-v0.1.0",
      exported_at: nowIso(),
      feedback: state.beta.feedback.map((item) => {
        const exported = {
          mode: item.mode,
          rating: item.rating,
          category: item.category,
          comment: item.comment,
          context: Object.fromEntries(betaConfig.feedback_context_allowlist
            .filter((key) => item.context?.[key] !== undefined)
            .map((key) => [key, item.context[key]])),
          received_date: String(item.at || today()).slice(0, 10)
        };
        if (item.mode === "contactable") exported.beta_contact = {
          name: state.registration.name,
          email: state.registration.email,
          role: state.registration.role,
          organisation: state.registration.organisation
        };
        return exported;
      }),
      statement: "Entries without contact details exclude the beta session identifier and report or assessment results. Free text may still identify its author."
    };
  }

  function shareBundlePayload(options) {
    const payload = {
      schema: "hdrl-explicit-results-share-v0.1.0",
      created_at: nowIso(),
      versions: { ...VERSIONS },
      boundary_summary: { assessment_date: state.boundary.assessmentDate, unit: state.boundary.unit },
      included: options,
      limitations: ["Explicitly created by the assessor", "Self-assessment; not validation, accreditation or endorsement", "May contain business-sensitive information"]
    };
    if (options.snapshot) payload.snapshot = Object.fromEntries(catalogue.indicators.map((indicator) => {
      const response = snapshotResponse(indicator.ref);
      const result = { status: response.status, level: response.level, certainty: response.certainty, clarity: response.clarity };
      if (options.comments) result.note = response.note;
      return [indicator.ref, result];
    }));
    if (options.evidenceResults) payload.evidence_led = Object.fromEntries(catalogue.indicators.map((indicator) => {
      const response = indicatorResponse(indicator.ref);
      const result = { status: response.status, level: response.level, certainty: response.certainty, evidence_count: response.evidence.length };
      if (options.comments) Object.assign(result, { rationale: response.rationale, improvement_note: response.improvementNote, status_reason: response.statusReason });
      if (options.evidenceRecords) result.evidence = response.evidence;
      return [indicator.ref, result];
    }));
    return payload;
  }

  function performExport(action) {
    if (action === "print") window.print();
    else if (action === "export-json") download(`hdrl-assessment-${today()}.json`, "application/json", JSON.stringify(exportPayload(), null, 2));
    else if (action === "export-snapshot-csv") download(`hdrl-snapshot-${today()}.csv`, "text/csv;charset=utf-8", snapshotCsvPayload());
    else if (action === "export-csv") download(`hdrl-evidence-led-${today()}.csv`, "text/csv;charset=utf-8", csvPayload());
    else return;
    recordBetaEvent("report_download_requested", { download_type: action.replace("export-", ""), completed_indicator_count: snapshotStats().completed });
    audit("assessment_exported", action);
  }

  function requestExport(action) {
    if (betaConfig.feature_flags.feedback_checkpoint && !state.beta.feedbackCheckpointAnswered) {
      state.beta.pendingExport = action;
      state.beta.feedbackContext = feedbackContext();
      recordBetaEvent("feedback_prompt_seen", { context: state.view });
      setView("feedback");
      return;
    }
    performExport(action);
  }

  function continueAfterFeedback() {
    const pending = state.beta.pendingExport;
    state.beta.pendingExport = "";
    state.beta.feedbackCheckpointAnswered = true;
    if (pending === "share-results") {
      setView("share-results");
      return;
    }
    setView("report");
    if (pending && pending !== "none") setTimeout(() => performExport(pending), 0);
  }

  function download(filename, type, data) {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function validateBoundary(form) {
    const errors = {};
    if (!form.elements["boundary-title"].value.trim()) errors["boundary-title"] = "Enter an assessment title.";
    if (!form.elements["boundary-service"].value.trim()) errors["boundary-service"] = "Enter the service or ecosystem name.";
    if (!form.elements["boundary-scope"].value.trim()) errors["boundary-scope"] = "Describe the assessment scope and boundary.";
    if (!form.elements["boundary-period"].value.trim()) errors["boundary-period"] = "Enter a time period or snapshot date.";
    if (!form.elements["boundary-date"].value) errors["boundary-date"] = "Enter the assessment date.";
    if (!form.elements["boundary-unit"].value) errors["boundary-unit"] = "Choose a unit of assessment.";
    if (!form.elements["boundary-use"].value.trim()) errors["boundary-use"] = "Describe the intended use.";
    return errors;
  }

  function saveSnapshotForm(form) {
    const indicator = catalogue.indicators.find((item) => item.ref === state.activeIndicator);
    const response = snapshotResponse(indicator.ref);
    const previous = JSON.stringify(response);
    const level = form.elements["snapshot-level"].value;
    response.status = level ? "rated" : (form.elements["snapshot-status"].value || "unstarted");
    response.level = level;
    response.certainty = level ? form.elements["snapshot-certainty"].value : "";
    response.certaintyReasons = response.certainty === "low" ? [...form.querySelectorAll('input[name="snapshot-reason"]:checked')].map((input) => input.value) : [];
    response.clarity = level ? form.elements["snapshot-clarity"].value : "";
    response.note = form.elements["snapshot-note"].value.trim();
    response.updatedAt = nowIso();
    if (JSON.stringify(response) !== previous) audit("snapshot_response_changed", indicator.ref, "Prototype user edit");
    scheduleSave();
    return response;
  }

  function validateSnapshot(form) {
    const errors = {};
    const level = form.elements["snapshot-level"].value;
    const status = form.elements["snapshot-status"].value;
    if (!level && !status) errors["snapshot-levels"] = "Choose a level, not known, not assessed or not applicable.";
    if (level && !form.elements["snapshot-certainty"].value) errors["hdrl-snapshot-certainty-panel"] = "Choose high, medium or low certainty.";
    return errors;
  }

  function saveIndicatorForm(form) {
    const indicator = catalogue.indicators.find((item) => item.ref === state.activeIndicator);
    const response = indicatorResponse(indicator.ref);
    const previous = JSON.stringify(response);
    const decision = form.elements["indicator-decision"].value;
    response.decision = decision;
    response.status = decision === "rated" ? "rated" : (form.elements["indicator-status"].value || "unstarted");
    response.level = response.status === "rated" ? (form.elements["indicator-level"].value || "") : "";
    response.certainty = response.status === "rated" ? form.elements["indicator-certainty"].value : "";
    response.rationale = response.status === "rated" ? form.elements["indicator-rationale"].value.trim() : "";
    response.improvementNote = response.status === "rated" ? form.elements["indicator-improvement"].value.trim() : "";
    response.statusReason = response.status === "rated" ? "" : form.elements["indicator-status-reason"].value.trim();
    response.updatedAt = nowIso();
    if (JSON.stringify(response) !== previous) audit("indicator_response_changed", indicator.ref, "Prototype user edit");
    scheduleSave();
    return response;
  }

  function validateIndicator(form) {
    const errors = {};
    const decision = form.elements["indicator-decision"].value;
    if (!decision) errors["indicator-decision-rated"] = "Choose whether to make a maturity judgement.";
    if (decision === "rated" && !form.elements["indicator-level"].value) {
      errors["hdrl-level-panel"] = "Choose the closest canonical maturity descriptor.";
    }
    if (decision === "rated" && !form.elements["indicator-certainty"].value) {
      errors["indicator-certainty"] = "Choose high, medium or low certainty.";
    }
    if (decision === "not_judged" && !form.elements["indicator-status"].value) {
      errors["indicator-nonjudgement"] = "Choose why you are not making a judgement.";
    }
    if (decision === "not_judged" && !form.elements["indicator-status-reason"].value.trim()) {
      errors["indicator-status-reason"] = "Add a short explanation for this decision.";
    }
    return errors;
  }

  function validateGate() {
    const errors = {};
    const required = {
      "gate-email": "Enter an email address.",
      "gate-role": "Enter a role.",
      "gate-organisation": "Enter an organisation.",
      "gate-use-mode": "Choose whether this is individual or team use.",
      "gate-report-use": "Choose the main intended use."
    };
    Object.entries(required).forEach(([id, message]) => {
      if (!document.getElementById(id).value.trim()) errors[id] = message;
    });
    const email = document.getElementById("gate-email").value.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors["gate-email"] = "Enter an email address in the correct format.";
    return errors;
  }

  function bindCommonActions() {
    root.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const target = event.currentTarget;
        const action = target.dataset.action;
        if (action === "clear") {
          if (confirm("Delete the entire on-device assessment draft? This cannot be undone.")) await clearDraft();
        } else if (action === "welcome") setView("welcome");
        else if (action === "start" || action === "boundary") setView("boundary");
        else if (action === "resume") setView(state.view === "welcome" ? (state.boundary.title ? "overview" : "boundary") : state.view);
        else if (action === "sample") {
          if (confirm("Replace the current on-device draft with a synthetic sample?")) {
            state = sampleState();
            await persist();
            render();
          }
        } else if (action === "dashboard" || action === "overview") setView(state.boundary.title ? "overview" : "boundary");
        else if (action === "rapid-intro") setView("rapid-intro");
        else if (action === "rapid-start") {
          state.rapidIndex = 0;
          setView("rapid");
        } else if (action === "rapid-prev") {
          state.rapidIndex = Math.max(0, state.rapidIndex - 1);
          lastFocusId = "hdrl-view-title";
          render();
        } else if (action === "rapid-summary") setView("rapid-summary");
        else if (action === "rapid-edit" || action === "rapid-edit-first") {
          state.rapidIndex = action === "rapid-edit-first"
            ? 0
            : content.rapid_questions.findIndex((item) => item.domain === target.dataset.domain);
          setView("rapid");
        } else if (action === "snapshot-dashboard") {
          if (!hasBetaEvent("assessment_started")) recordBetaEvent("assessment_started", { entry_point: "resumed_snapshot" });
          if (!hasBetaEvent("snapshot_started")) recordBetaEvent("snapshot_started", { entry_point: state.view });
          setView("snapshot-dashboard");
        } else if (action === "open-snapshot") {
          state.activeIndicator = target.dataset.ref;
          setView("snapshot");
        } else if (action === "snapshot-review") setView("snapshot-review");
        else if (action === "evidence") {
          if (!hasBetaEvent("assessment_started")) recordBetaEvent("assessment_started", { entry_point: "resumed_evidence" });
          if (!hasBetaEvent("evidence_workspace_started")) recordBetaEvent("evidence_workspace_started", { entry_point: state.view });
          setView("evidence");
        }
        else if (action === "open-indicator") {
          try {
            state.activeIndicator = target.dataset.ref;
            setView("indicator");
          } catch (error) {
            console.error("Unable to open the selected indicator", error);
            announce("The indicator could not be opened. Return to the list and try again.", true);
          }
        } else if (action === "review") setView("review");
        else if (action === "gate") setView("gate");
        else if (action === "report") setView("report");
        else if (["print", "export-json", "export-snapshot-csv", "export-csv"].includes(action)) requestExport(action);
        else if (action === "feedback") {
          state.beta.pendingExport = "none";
          state.beta.feedbackContext = feedbackContext();
          recordBetaEvent("feedback_prompt_seen", { context: state.view });
          setView("feedback");
        } else if (action === "skip-feedback") {
          recordBetaEvent("feedback_skipped", { context: state.beta.feedbackContext?.view || state.view });
          continueAfterFeedback();
        } else if (action === "share-results") {
          if (betaConfig.feature_flags.feedback_checkpoint && !state.beta.feedbackCheckpointAnswered) {
            state.beta.pendingExport = "share-results";
            state.beta.feedbackContext = feedbackContext();
            recordBetaEvent("feedback_prompt_seen", { context: state.view });
            setView("feedback");
          } else setView("share-results");
        }
        else if (action === "beta-activity") setView("beta-activity");
        else if (action === "export-beta-activity") {
          download(`hdrl-beta-activity-${today()}.json`, "application/json", JSON.stringify(betaActivityPayload(), null, 2));
        } else if (action === "export-feedback") {
          download(`hdrl-beta-feedback-${today()}.json`, "application/json", JSON.stringify(feedbackBundlePayload(), null, 2));
        } else if (action === "remove-evidence") {
          const response = indicatorResponse(state.activeIndicator);
          const removed = response.evidence.splice(Number(target.dataset.index), 1)[0];
          audit("evidence_reference_removed", state.activeIndicator, removed?.title || "");
          scheduleSave();
          render();
        } else if (action === "add-evidence") {
          const form = document.getElementById("hdrl-indicator-form");
          if (form) saveIndicatorForm(form);
          addEvidence();
        } else if (action === "save-next") {
          const form = document.getElementById("hdrl-indicator-form");
          const response = saveIndicatorForm(form);
          const errors = validateIndicator(form);
          if (Object.keys(errors).length) {
            root.innerHTML = indicatorView(errors);
            bind();
            document.getElementById("hdrl-indicator-errors")?.focus();
            return;
          }
          const index = catalogue.indicators.findIndex((item) => item.ref === state.activeIndicator);
          state.activeIndicator = catalogue.indicators[Math.min(index + 1, 63)].ref;
          if (response.status === "rated" && !response.level) announce("Saved without a maturity level; the review will flag this.", true);
          lastFocusId = "hdrl-view-title";
          render();
        }
      });
    });
  }

  function addEvidence() {
    const title = document.getElementById("evidence-title").value.trim();
    if (!title) {
      announce("Enter an evidence title before adding the reference.", true);
      document.getElementById("evidence-title").focus();
      return;
    }
    const item = {
      id: makeId(),
      title,
      type: document.getElementById("evidence-type").value,
      reference: document.getElementById("evidence-reference").value.trim(),
      owner: document.getElementById("evidence-owner").value.trim(),
      date: document.getElementById("evidence-date").value,
      note: document.getElementById("evidence-note").value.trim(),
      limitations: document.getElementById("evidence-limitations").value.trim(),
      reviewStatus: document.getElementById("evidence-review-status").value
    };
    indicatorResponse(state.activeIndicator).evidence.push(item);
    audit("evidence_reference_added", state.activeIndicator, item.title);
    scheduleSave();
    render();
    announce("Evidence reference added.");
  }

  function bind() {
    bindCommonActions();

    const boundaryForm = document.getElementById("hdrl-boundary-form");
    boundaryForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const errors = validateBoundary(boundaryForm);
      if (Object.keys(errors).length) {
        root.innerHTML = boundaryView(errors);
        bind();
        document.getElementById("hdrl-boundary-errors")?.focus();
        return;
      }
      state.boundary = {
        title: boundaryForm.elements["boundary-title"].value.trim(),
        serviceName: boundaryForm.elements["boundary-service"].value.trim(),
        scope: boundaryForm.elements["boundary-scope"].value.trim(),
        timePeriod: boundaryForm.elements["boundary-period"].value.trim(),
        assessmentDate: boundaryForm.elements["boundary-date"].value,
        unit: boundaryForm.elements["boundary-unit"].value,
        method: boundaryForm.elements["boundary-method"].value,
        intendedUse: boundaryForm.elements["boundary-use"].value.trim()
      };
      audit("assessment_boundary_saved", "boundary");
      if (!hasBetaEvent("assessment_started")) recordBetaEvent("assessment_started", { entry_point: "boundary_completed" });
      setView("overview");
    });

    const rapidForm = document.getElementById("hdrl-rapid-form");
    rapidForm?.querySelectorAll('input[name="rapid-impression"]').forEach((input) => {
      input.addEventListener("change", () => {
        const isBand = content.impression_bands.some((band) => band.value === input.value);
        const panel = document.getElementById("hdrl-rapid-certainty-panel");
        panel.hidden = !isBand;
        if (!isBand) rapidForm.querySelectorAll('input[name="rapid-certainty"]').forEach((choice) => { choice.checked = false; });
      });
    });
    rapidForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const domain = content.rapid_questions[state.rapidIndex].domain;
      const impression = rapidForm.elements["rapid-impression"].value;
      if (!impression) {
        announce("Choose an impression, not known or not assessed before continuing.", true);
        rapidForm.elements["rapid-impression"][0].focus();
        return;
      }
      const isImpressionBand = content.impression_bands.some((band) => band.value === impression);
      if (isImpressionBand && !rapidForm.elements["rapid-certainty"].value) {
        announce("Choose high, medium or low certainty before continuing.", true);
        rapidForm.elements["rapid-certainty"][0].focus();
        return;
      }
      state.rapid[domain] = {
        impression,
        certainty: isImpressionBand ? rapidForm.elements["rapid-certainty"].value : "",
        note: rapidForm.elements["rapid-note"].value.trim()
      };
      audit("rapid_response_saved", domain);
      if (state.rapidIndex === 7) {
        if (!hasBetaEvent("domain_orientation_completed")) recordBetaEvent("domain_orientation_completed", { completed_domain_count: Object.keys(state.rapid).length });
        setView("rapid-summary");
      }
      else {
        state.rapidIndex += 1;
        scheduleSave();
        lastFocusId = "hdrl-view-title";
        render();
      }
    });

    const snapshotForm = document.getElementById("hdrl-snapshot-form");
    snapshotForm?.querySelectorAll('input[name="snapshot-level"]').forEach((input) => {
      input.addEventListener("change", () => {
        snapshotForm.querySelectorAll('input[name="snapshot-status"]').forEach((choice) => { choice.checked = false; });
        document.getElementById("hdrl-snapshot-certainty-panel").hidden = false;
      });
    });
    snapshotForm?.querySelectorAll('input[name="snapshot-status"]').forEach((input) => {
      input.addEventListener("change", () => {
        snapshotForm.querySelectorAll('input[name="snapshot-level"]').forEach((choice) => { choice.checked = false; });
        document.getElementById("hdrl-snapshot-certainty-panel").hidden = true;
      });
    });
    snapshotForm?.querySelectorAll('input[name="snapshot-certainty"]').forEach((input) => {
      input.addEventListener("change", () => {
        document.getElementById("hdrl-certainty-reasons").hidden = input.value !== "low";
      });
    });
    snapshotForm?.addEventListener("keydown", (event) => {
      if (event.target.matches("textarea, select, input:not([type=radio])")) return;
      const level = /^[1-5]$/.test(event.key) ? `L${event.key}` : "";
      const certainty = { h: "high", m: "medium", l: "low" }[event.key.toLowerCase()];
      const choice = level
        ? snapshotForm.querySelector(`input[name="snapshot-level"][value="${level}"]`)
        : certainty && !document.getElementById("hdrl-snapshot-certainty-panel").hidden
          ? snapshotForm.querySelector(`input[name="snapshot-certainty"][value="${certainty}"]`)
          : null;
      if (choice) {
        event.preventDefault();
        choice.click();
      }
    });
    snapshotForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const errors = validateSnapshot(snapshotForm);
      if (Object.keys(errors).length) {
        root.innerHTML = snapshotIndicatorView(errors);
        bind();
        document.getElementById("hdrl-snapshot-errors")?.focus();
        return;
      }
      const indicator = catalogue.indicators.find((item) => item.ref === state.activeIndicator);
      const domainProgressBefore = snapshotDomainProgress(indicator.domain);
      saveSnapshotForm(snapshotForm);
      const domainProgressAfter = snapshotDomainProgress(indicator.domain);
      if (domainProgressBefore.completed < domainProgressBefore.total && domainProgressAfter.completed === domainProgressAfter.total
        && !state.beta.events.some((item) => item.name === "snapshot_domain_completed" && item.domain_ref === indicator.domain)) {
        recordBetaEvent("snapshot_domain_completed", { domain_ref: indicator.domain, completed_indicator_count: snapshotStats().completed });
      }
      const snapshotProgress = snapshotStats();
      if (snapshotProgress.completed === catalogue.indicators.length && !hasBetaEvent("snapshot_completed")) {
        recordBetaEvent("snapshot_completed", { completed_indicator_count: snapshotProgress.completed, completed_domain_count: snapshotProgress.completedDomains });
      }
      const currentIndex = catalogue.indicators.findIndex((item) => item.ref === indicator.ref);
      const next = catalogue.indicators.slice(currentIndex + 1).find((item) => snapshotResponse(item.ref).status === "unstarted")
        || catalogue.indicators.find((item) => snapshotResponse(item.ref).status === "unstarted");
      if (next) {
        state.activeIndicator = next.ref;
        lastFocusId = "hdrl-view-title";
        render();
      } else setView("snapshot-review");
    });

    const indicatorForm = document.getElementById("hdrl-indicator-form");
    indicatorForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      saveIndicatorForm(indicatorForm);
      const errors = validateIndicator(indicatorForm);
      if (Object.keys(errors).length) {
        root.innerHTML = indicatorView(errors);
        bind();
        document.getElementById("hdrl-indicator-errors")?.focus();
        return;
      }
      setView("evidence");
    });
    indicatorForm?.querySelectorAll('input[name="indicator-decision"]').forEach((input) => {
      input.addEventListener("change", () => {
        const rated = input.value === "rated";
        document.getElementById("hdrl-level-panel").hidden = !rated;
        document.getElementById("hdrl-judgement-details").hidden = !rated;
        document.getElementById("hdrl-judgement-notes").hidden = !rated;
        document.getElementById("hdrl-evidence-panel").hidden = !rated;
        document.getElementById("hdrl-nonjudgement-panel").hidden = rated;
      });
    });

    const domainNotesForm = document.getElementById("hdrl-domain-notes-form");
    domainNotesForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      catalogue.domains.forEach((domain) => {
        state.domainNotes[domain.ref] = domainNotesForm.elements[`domain-capacity-${domain.ref}`].value.trim();
      });
      audit("domain_capacity_notes_saved", "domains");
      scheduleSave();
      announce("Domain-level operating capacity and constraint notes saved.");
    });

    const filterForm = document.getElementById("hdrl-filter-form");
    filterForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      root.innerHTML = evidenceDashboardView({
        search: filterForm.elements.search.value,
        domain: filterForm.elements.domain.value,
        status: filterForm.elements.status.value
      });
      bind();
      document.getElementById("filter-search")?.focus();
    });

    const feedbackForm = document.getElementById("hdrl-feedback-form");
    feedbackForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const rating = feedbackForm.elements["feedback-rating"].value;
      const category = feedbackForm.elements["feedback-category"].value;
      const comment = feedbackForm.elements["feedback-comment"].value.trim();
      if (!rating && !category && !comment) {
        announce("Add a quick rating, choose a category or enter a comment before saving feedback.", true);
        feedbackForm.elements["feedback-rating"][0].focus();
        return;
      }
      const mode = feedbackForm.elements["feedback-mode"].value || "without_contact";
      const context = Object.keys(state.beta.feedbackContext || {}).length ? state.beta.feedbackContext : feedbackContext();
      state.beta.feedback.push({ id: makeId(), mode, rating: rating ? Number(rating) : null, category, comment, context, at: nowIso() });
      recordBetaEvent("feedback_submitted", { feedback_mode: mode, feedback_category: category || "not_selected", context: context.view || "unknown" });
      continueAfterFeedback();
    });

    const shareForm = document.getElementById("hdrl-share-form");
    shareForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const options = {
        snapshot: shareForm.elements["share-snapshot"].checked,
        evidenceResults: shareForm.elements["share-evidence-results"].checked,
        comments: shareForm.elements["share-comments"].checked,
        evidenceRecords: shareForm.elements["share-evidence-records"].checked
      };
      if (!options.snapshot && !options.evidenceResults) {
        announce("Choose the snapshot, evidence-led results or both before creating a share bundle.", true);
        shareForm.elements["share-snapshot"].focus();
        return;
      }
      if (options.evidenceRecords && !options.evidenceResults) {
        announce("Select evidence-led results before including evidence reference details.", true);
        shareForm.elements["share-evidence-results"].focus();
        return;
      }
      download(`hdrl-explicit-share-${today()}.json`, "application/json", JSON.stringify(shareBundlePayload(options), null, 2));
      recordBetaEvent("share_bundle_created", { bundle_scope: Object.entries(options).filter(([, included]) => included).map(([name]) => name).join(",") });
      audit("explicit_share_bundle_created", "local_download");
      setView("report");
    });

    const gateForm = document.getElementById("hdrl-gate-form");
    gateForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const errors = validateGate();
      if (Object.keys(errors).length) {
        root.innerHTML = gateView(errors);
        bind();
        document.getElementById("hdrl-gate-errors")?.focus();
        return;
      }
      state.registration = {
        unlocked: true,
        name: document.getElementById("gate-name").value.trim(),
        email: document.getElementById("gate-email").value.trim(),
        role: document.getElementById("gate-role").value.trim(),
        organisation: document.getElementById("gate-organisation").value.trim(),
        region: document.getElementById("gate-region").value.trim(),
        serviceType: document.getElementById("gate-service-type").value,
        scale: document.getElementById("gate-scale").value,
        useMode: document.getElementById("gate-use-mode").value,
        reportUse: document.getElementById("gate-report-use").value,
        researchContact: document.getElementById("gate-research").checked,
        newsletter: document.getElementById("gate-newsletter").checked
      };
      audit("prototype_report_gate_unlocked", "report", "No data transmitted");
      if (!hasBetaEvent("report_unlocked")) {
        const s = snapshotStats();
        recordBetaEvent("report_unlocked", { completed_indicator_count: s.completed, completed_domain_count: s.completedDomains });
      }
      setView("report");
    });
  }

  function render() {
    const views = {
      welcome: welcomeView,
      boundary: boundaryView,
      overview: overviewView,
      "rapid-intro": rapidIntroView,
      rapid: rapidView,
      "rapid-summary": rapidSummaryView,
      "snapshot-dashboard": snapshotDashboardView,
      snapshot: snapshotIndicatorView,
      "snapshot-review": snapshotReviewView,
      evidence: evidenceDashboardView,
      indicator: indicatorView,
      review: reviewView,
      gate: gateView,
      report: reportView,
      feedback: feedbackView,
      "share-results": shareResultsView,
      "beta-activity": betaActivityView
    };
    root.innerHTML = (views[state.view] || welcomeView)();
    root.setAttribute("aria-busy", "false");
    bind();
    if (lastFocusId) {
      const focusId = lastFocusId;
      requestAnimationFrame(() => {
        root.scrollIntoView({ block: "start", behavior: "auto" });
        document.getElementById(focusId)?.focus({ preventScroll: true });
      });
      lastFocusId = "";
    }
  }

  function migrateDraft(draft, defaults) {
    if (!draft || ![1, 2, 3].includes(draft.schemaVersion)) return defaults;
    if ([2, 3].includes(draft.schemaVersion)) {
      return {
        ...defaults,
        ...draft,
        schemaVersion: 3,
        boundary: { ...defaults.boundary, ...draft.boundary },
        registration: { ...defaults.registration, ...draft.registration },
        domainNotes: { ...defaults.domainNotes, ...draft.domainNotes },
        rapid: { ...defaults.rapid, ...draft.rapid },
        snapshot: { ...defaults.snapshot, ...draft.snapshot },
        indicators: { ...defaults.indicators, ...draft.indicators },
        beta: {
          ...defaults.beta,
          ...(draft.beta || {}),
          events: Array.isArray(draft.beta?.events) ? draft.beta.events : [],
          feedback: Array.isArray(draft.beta?.feedback) ? draft.beta.feedback : []
        },
        versions: { ...VERSIONS }
      };
    }
    const certaintyFromUncertainty = { low: "high", medium: "medium", high: "low" };
    const domainNotes = {};
    const rapid = Object.fromEntries(Object.entries(draft.rapid || {}).map(([domain, response]) => [domain, {
      impression: response.impression || "",
      certainty: certaintyFromUncertainty[response.uncertainty] || "",
      note: response.note || ""
    }]));
    const indicators = Object.fromEntries(Object.entries(draft.indicators || {}).map(([ref, response]) => {
      const indicator = catalogue.indicators.find((item) => item.ref === ref);
      if (indicator && response.capacityNote) {
        const prefix = domainNotes[indicator.domain] ? `${domainNotes[indicator.domain]}\n` : "";
        domainNotes[indicator.domain] = `${prefix}${ref}: ${response.capacityNote}`;
      }
      return [ref, {
        decision: response.status === "rated" ? "rated" : ["not_known", "not_assessed", "not_applicable"].includes(response.status) ? "not_judged" : "",
        status: response.status || "unstarted",
        level: response.level || "",
        certainty: certaintyFromUncertainty[response.uncertainty] || "",
        rationale: response.rationale || "",
        improvementNote: response.improvementNote || "",
        statusReason: response.applicabilityReason || "",
        evidence: (response.evidence || []).map(({ supports, reviewPeriod, ...item }) => item),
        updatedAt: response.updatedAt || null
      }];
    }));
    return {
      ...defaults,
      ...draft,
      schemaVersion: 3,
      boundary: { ...defaults.boundary, ...draft.boundary },
      registration: { ...defaults.registration, ...draft.registration },
      rapid,
      snapshot: {},
      indicators,
      domainNotes,
      beta: { ...defaults.beta },
      versions: { ...VERSIONS }
    };
  }

  async function init() {
    try {
      const [catalogueResponse, contentResponse, betaResponse, draft] = await Promise.all([
        fetch(root.dataset.catalogueUrl, { credentials: "same-origin" }),
        fetch(root.dataset.contentUrl, { credentials: "same-origin" }),
        fetch(root.dataset.betaConfigUrl, { credentials: "same-origin" }),
        loadDraft()
      ]);
      if (!catalogueResponse.ok || !contentResponse.ok || !betaResponse.ok) throw new Error("Assessment data failed to load");
      catalogue = await catalogueResponse.json();
      content = await contentResponse.json();
      betaConfig = await betaResponse.json();
      if (catalogue.framework.version !== VERSIONS.framework || catalogue.catalogue_version !== VERSIONS.catalogue || catalogue.indicator_count !== 64) {
        throw new Error("The prototype and canonical catalogue versions do not match");
      }
      if (betaConfig.config_version !== VERSIONS.beta || betaConfig.tool_version !== VERSIONS.tool) {
        throw new Error("The beta configuration and assessment tool versions do not match");
      }
      if (betaConfig.transport.remote_collection_enabled || betaConfig.transport.mode !== "local-only") {
        throw new Error("Remote beta collection cannot be enabled in this local prototype");
      }
      const defaults = defaultState();
      state = migrateDraft(draft, defaults);
      catalogue.indicators.forEach((indicator) => {
        indicatorResponse(indicator.ref);
        const existing = snapshotResponse(indicator.ref);
        state.snapshot[indicator.ref] = {
          status: "unstarted",
          level: "",
          certainty: "",
          certaintyReasons: [],
          clarity: "",
          note: "",
          updatedAt: null,
          ...existing,
          certaintyReasons: Array.isArray(existing.certaintyReasons) ? existing.certaintyReasons : []
        };
      });
      lastActivityTick = Date.now();
      document.addEventListener("visibilitychange", () => {
        updateActiveTime();
        scheduleSave();
      });
      render();
    } catch (error) {
      root.setAttribute("aria-busy", "false");
      root.innerHTML = `
        <div class="hdrl-error-summary" role="alert">
          <h2>We could not load the assessment prototype</h2>
          <p>${esc(error.message)}. Refresh the page or use the canonical catalogue directly.</p>
        </div>
      `;
    }
  }

  init();
})();
