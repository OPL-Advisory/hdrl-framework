(() => {
  "use strict";

  const root = document.getElementById("hdrl-assessment-root");
  if (!root) return;

  const VERSIONS = {
    framework: "1.0.1",
    catalogue: "1.0.2",
    tool: "0.1.0-prototype",
    guidance: "0.1.0",
    rules: "0.1.0",
    report: "0.1.0"
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
  let state;
  let saveTimer;
  let lastFocusId = "";

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
      schemaVersion: 1,
      id: makeId(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
      view: "welcome",
      rapidIndex: 0,
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
      indicators: {},
      registration: {
        unlocked: false,
        name: "",
        email: "",
        role: "",
        organisation: "",
        region: "",
        serviceType: "",
        scale: "",
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
        status: "unstarted",
        level: "",
        uncertainty: "",
        rationale: "",
        capacityNote: "",
        improvementNote: "",
        applicabilityReason: "",
        evidence: [],
        updatedAt: null
      };
    }
    return state.indicators[ref];
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

  function setView(view, focusId = "hdrl-view-title") {
    lastFocusId = focusId;
    state.view = view;
    scheduleSave();
    render();
    requestAnimationFrame(() => {
      const focusTarget = document.getElementById(focusId);
      focusTarget?.focus();
      root.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
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
          <span class="hdrl-stage-number">Stage 1</span>
          <h3>Rapid first pass</h3>
          <p>Eight guided domain impressions based on what you know now.</p>
          <dl>
            <div><dt>Time</dt><dd>About 5–10 minutes</dd></div>
            <div><dt>Evidence</dt><dd>Not required</dd></div>
            <div><dt>Output</dt><dd>Preliminary learning profile</dd></div>
          </dl>
        </article>
        <article class="hdrl-stage-card hdrl-stage-card--evidence">
          <span class="hdrl-stage-number">Stage 2</span>
          <h3>Evidence-led second pass</h3>
          <p>Review every relevant canonical indicator and record what supports the judgement.</p>
          <dl>
            <div><dt>Time</dt><dd>Several sessions</dd></div>
            <div><dt>Evidence</dt><dd>References, rationale and uncertainty</dd></div>
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
        || response.capacityNote
        || response.improvementNote
    );
    const hasDraft = Boolean(
      state.boundary.title || Object.keys(state.rapid).length || hasIndicatorWork
    );
    return shell(`
      <section class="hdrl-assessment-view" aria-labelledby="hdrl-view-title">
        <span class="hdrl-assessment-kicker">Learn by applying HDRL</span>
        <h2 id="hdrl-view-title" tabindex="-1">Two passes, one clearer picture</h2>
        <p class="hdrl-assessment-lede">Start with an honest gut reaction, then return with evidence. The tool keeps preliminary impressions visibly separate from evidence-led judgements.</p>
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
            <button type="submit" class="md-button md-button--primary">Continue to the rapid first pass</button>
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
    const response = state.rapid[q.domain] || { impression: "", uncertainty: "", note: "" };
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
            ${content.impression_bands.map((band) => radio("rapid-impression", band.value, band.label, band.description, response.impression)).join("")}
            ${radio("rapid-impression", "not_known", "Not known", "I do not know enough to form an impression.", response.impression)}
            ${radio("rapid-impression", "not_assessed", "Not assessed", "I am intentionally leaving this domain for later.", response.impression)}
          </fieldset>
          <fieldset class="hdrl-inline-radios">
            <legend>How certain are you?</legend>
            ${radio("rapid-uncertainty", "low", "Low uncertainty", "I am fairly confident in this impression.", response.uncertainty)}
            ${radio("rapid-uncertainty", "medium", "Some uncertainty", "Important details may change this impression.", response.uncertainty)}
            ${radio("rapid-uncertainty", "high", "High uncertainty", "This is a tentative view.", response.uncertainty)}
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

  function rapidSummaryView() {
    const answered = Object.values(state.rapid).filter((item) => item.impression).length;
    return shell(`
      <section class="hdrl-assessment-view" aria-labelledby="hdrl-view-title">
        <div class="hdrl-progress-label">Stage 1 complete · ${answered} of 8 domains answered</div>
        <h2 id="hdrl-view-title" tabindex="-1">Your preliminary learning profile</h2>
        <p class="hdrl-assessment-lede">This is a snapshot of initial impressions. It is not a full HDRL assessment and has no overall score.</p>
        <div class="hdrl-rapid-profile">
          ${catalogue.domains.map((domain) => {
            const response = state.rapid[domain.ref] || {};
            return `
              <article style="--domain-colour:${DOMAIN_COLOURS[domain.ref]}">
                <span>Domain ${domain.ref}</span>
                <h3>${esc(domain.name)}</h3>
                <strong>${esc(IMPRESSION_LABELS[response.impression] || "No impression recorded")}</strong>
                <p>${response.uncertainty ? `${esc(response.uncertainty[0].toUpperCase() + response.uncertainty.slice(1))} uncertainty` : "Uncertainty not recorded"}</p>
                <button type="button" class="hdrl-link-button" data-action="rapid-edit" data-domain="${domain.ref}">Change</button>
              </article>
            `;
          }).join("")}
        </div>
        <div class="hdrl-assessment-callout">
          <h3>Now test the impression</h3>
          <p>The evidence-led pass opens all applicable indicators, the exact maturity descriptors and minimum-evidence guidance. You may discover that capability is stronger than its evidence—or that operating capacity is the real constraint.</p>
        </div>
        <div class="hdrl-assessment-actions">
          <button type="button" class="md-button md-button--primary" data-action="evidence">Start the evidence-led pass</button>
          <button type="button" class="md-button" data-action="rapid-edit-first">Review rapid answers</button>
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
        <div class="hdrl-progress-label">Stage 2 of 2 · save and return at any time</div>
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

  function indicatorView(errors = {}) {
    const indicator = catalogue.indicators.find((item) => item.ref === state.activeIndicator);
    if (!indicator) return evidenceDashboardView();
    const response = indicatorResponse(indicator.ref);
    const domain = catalogue.domains.find((item) => item.ref === indicator.domain);
    const guidance = content.domain_guidance[indicator.domain];
    const index = catalogue.indicators.findIndex((item) => item.ref === indicator.ref);
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
            <legend>Applicability and assessment status</legend>
            ${radio("indicator-status", "rated", "Make a maturity judgement", "Compare the available evidence with all five descriptors.", response.status)}
            ${radio("indicator-status", "not_known", "Not known", "The right person or information is not currently available.", response.status)}
            ${radio("indicator-status", "not_assessed", "Not assessed", "Relevant, but intentionally left for a later review.", response.status)}
            ${radio("indicator-status", "not_applicable", "Not applicable", "Outside this explicit boundary; give a reason.", response.status)}
          </fieldset>
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
          <div id="hdrl-applicability-panel" ${response.status === "not_applicable" ? "" : "hidden"}>
            ${textareaField("indicator-applicability", "Why is this not applicable?", response.applicabilityReason, "Describe the boundary or service decision. Do not use N/A merely because evidence is missing.", true, errors["indicator-applicability"], 800)}
          </div>
          <div class="hdrl-form-grid">
            <div class="hdrl-field">
              <label for="indicator-uncertainty">Uncertainty</label>
              <p class="hdrl-hint" id="indicator-uncertainty-hint">Separate confidence in your interpretation from the maturity judgement.</p>
              <select id="indicator-uncertainty" name="indicator-uncertainty" aria-describedby="indicator-uncertainty-hint">
                <option value="">Choose uncertainty</option>
                <option value="low" ${response.uncertainty === "low" ? "selected" : ""}>Low uncertainty</option>
                <option value="medium" ${response.uncertainty === "medium" ? "selected" : ""}>Some uncertainty</option>
                <option value="high" ${response.uncertainty === "high" ? "selected" : ""}>High uncertainty</option>
              </select>
            </div>
            ${textareaField("indicator-rationale", "Rationale", response.rationale, "Why does the selected status or level best fit the current evidence?", false, "", 1800)}
          </div>
          <div class="hdrl-form-grid">
            ${textareaField("indicator-capacity", "Operating-capacity note", response.capacityNote, "Record delivery headroom, staffing or volume constraints separately from capability and evidence.", false, "", 1200)}
            ${textareaField("indicator-improvement", "Potential improvement note", response.improvementNote, "Your own proposed next step. The rules engine will not invent an action.", false, "", 1200)}
          </div>
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
                ${textField("evidence-review-period", "Review period", "", "When should its currency be reviewed?", false, "", 120)}
                <div class="hdrl-field">
                  <label for="evidence-supports">Judgement supported</label>
                  <select id="evidence-supports">
                    <option value="">Choose</option>
                    ${LEVELS.map((level) => `<option value="${level}">${level}</option>`).join("")}
                    <option value="applicability">Applicability/status only</option>
                  </select>
                </div>
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
          <p><strong>Supports:</strong> ${esc(item.supports || "Not specified")} · <strong>Status:</strong> ${esc(item.reviewStatus.replaceAll("_", " "))}</p>
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
      if (response.status === "not_applicable" && !response.applicabilityReason.trim()) issues.push({ ref: indicator.ref, type: "Missing N/A reason", text: "Not applicable has no boundary reason." });
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
    if (!values.length) return { label: "Insufficient assessed indicators", count: 0 };
    const middle = Math.floor(values.length / 2);
    if (values.length % 2) return { label: `L${values[middle]} · ${catalogue.maturity_level_names[`L${values[middle]}`]}`, count: values.length };
    const low = values[middle - 1];
    const high = values[middle];
    return { label: low === high ? `L${low} · ${catalogue.maturity_level_names[`L${low}`]}` : `L${low}–L${high} observed median range`, count: values.length };
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
    const errorSummary = Object.keys(errors).length
      ? `<div class="hdrl-error-summary" role="alert" tabindex="-1" id="hdrl-gate-errors"><h3>Check the report information</h3><ul>${Object.entries(errors).map(([id, message]) => `<li><a href="#${id}">${esc(message)}</a></li>`).join("")}</ul></div>`
      : "";
    return shell(`
      <section class="hdrl-assessment-view" aria-labelledby="hdrl-view-title">
        <div class="hdrl-progress-label">Limited completion summary</div>
        <h2 id="hdrl-view-title" tabindex="-1">Your assessment is ready to report</h2>
        <div class="hdrl-limited-summary">
          <div><strong>${Object.values(state.rapid).filter((item) => item.impression).length}/8</strong><span>rapid impressions</span></div>
          <div><strong>${s.judged}/64</strong><span>indicator judgements</span></div>
          <div><strong>${s.evidenceLinked}/64</strong><span>with evidence references</span></div>
          <div><strong>${s.unknown + s.notAssessed}</strong><span>unknown or not assessed</span></div>
        </div>
        <div class="hdrl-assessment-notice">
          <strong>Prototype gate.</strong> Nothing is emailed or transmitted. These fields test the minimum report-access journey and stay on this device. Use sample contact information if preferred.
        </div>
        ${errorSummary}
        <form id="hdrl-gate-form" novalidate>
          <div class="hdrl-form-grid">
            ${textField("gate-name", "Name", r.name, "Identifies the report recipient and assessment perspective.", true, errors["gate-name"], 120, "text", "name")}
            ${textField("gate-email", "Email address", r.email, "Production would verify access and deliver a report link. It is not marketing consent.", true, errors["gate-email"], 200, "email", "email")}
            ${textField("gate-role", "Role", r.role, "Helps readers understand the perspective behind the self-assessment.", true, errors["gate-role"], 120, "text", "organization-title")}
            ${textField("gate-organisation", "Organisation", r.organisation, "Provides the organisational context for the named service or ecosystem.", true, errors["gate-organisation"], 180, "text", "organization")}
            ${textField("gate-region", "Country or region", r.region, "Helps interpret the legal and operating context and route privacy rights.", true, errors["gate-region"], 120, "text", "country-name")}
            <div class="hdrl-field ${errors["gate-service-type"] ? "hdrl-field--error" : ""}">
              <label for="gate-service-type">Type of service <span aria-hidden="true">*</span></label>
              <p class="hdrl-hint" id="gate-service-type-hint">A broad category is enough for interpretation.</p>
              <select id="gate-service-type" aria-describedby="gate-service-type-hint${errors["gate-service-type"] ? " gate-service-type-error" : ""}">
                <option value="">Choose a broad type</option>
                ${["National or regional system", "Secure data environment or TRE", "Data service or platform", "Research network or federation", "Cohort, registry or biobank", "Other"].map((value) => `<option ${r.serviceType === value ? "selected" : ""}>${value}</option>`).join("")}
              </select>
              ${fieldError(errors["gate-service-type"], "gate-service-type")}
            </div>
            <div class="hdrl-field ${errors["gate-scale"] ? "hdrl-field--error" : ""}">
              <label for="gate-scale">Approximate scale <span aria-hidden="true">*</span></label>
              <p class="hdrl-hint" id="gate-scale-hint">Use a broad band; do not enter an exact patient population.</p>
              <select id="gate-scale" aria-describedby="gate-scale-hint${errors["gate-scale"] ? " gate-scale-error" : ""}">
                <option value="">Choose a broad band</option>
                ${["Single team or local service", "Multi-team or regional service", "Multi-organisation or national service", "Cross-border or international ecosystem", "Prefer not to categorise"].map((value) => `<option ${r.scale === value ? "selected" : ""}>${value}</option>`).join("")}
              </select>
              ${fieldError(errors["gate-scale"], "gate-scale")}
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
            <button type="button" class="md-button" data-action="review">Back to review</button>
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
      if (response.status === "not_known" || response.uncertainty === "high") {
        questions.push({
          ref: indicator.ref,
          text: `Who is closest to this capability, and what evidence would resolve the uncertainty?`,
          rule: "R-HIGH-UNCERTAINTY"
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
          <button type="button" class="md-button" data-action="export-csv">Download CSV</button>
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
          <div class="hdrl-report-domain-grid">
            ${catalogue.domains.map((domain) => {
              const response = state.rapid[domain.ref] || {};
              return `<div style="--domain-colour:${DOMAIN_COLOURS[domain.ref]}"><strong>${domain.ref} · ${esc(domain.name)}</strong><span>${esc(IMPRESSION_LABELS[response.impression] || "Not answered")}</span><small>${response.uncertainty ? `${esc(response.uncertainty)} uncertainty` : "Uncertainty not recorded"}</small></div>`;
            }).join("")}
          </div>
        </section>
        <section>
          <h3>Evidence-led domain profile</h3>
          <p>Summaries use applicable judged Core indicators and exclude Outcome/Context entries. Missing responses are not imputed. Even medians are ranges. No overall score is calculated.</p>
          <div class="hdrl-report-domain-grid">
            ${catalogue.domains.map((domain) => {
              const summary = domainSummary(domain.ref);
              return `<div style="--domain-colour:${DOMAIN_COLOURS[domain.ref]}"><strong>${domain.ref} · ${esc(domain.name)}</strong><span>${esc(summary.label)}</span><small>${summary.count} Core judgement${summary.count === 1 ? "" : "s"}</small></div>`;
            }).join("")}
          </div>
        </section>
        <section>
          <h3>Evidence, uncertainty and coverage</h3>
          <ul>
            <li>${s.judged} of 64 indicators have a maturity judgement.</li>
            <li>${s.evidenceLinked} indicators have one or more evidence references.</li>
            <li>${s.unknown} are not known; ${s.notAssessed} are not assessed or not started; ${s.notApplicable} are marked not applicable.</li>
            <li>An evidence reference is not independent verification. “Reviewed” means reviewed by the assessor or calibration group only.</li>
          </ul>
        </section>
        ${findingSection("Findings supported by referenced evidence status", findings.supported, "No maturity judgements have evidence marked reviewed or accepted.")}
        ${findingSection("Provisional interpretations", findings.provisional, "No provisional maturity judgements were generated by the current rule.")}
        ${findingSection("Suggested questions to investigate", findings.questions, "No uncertainty or unassessed prompts were generated.")}
        ${findingSection("Potential improvement actions", findings.actions, "No user-entered improvement actions were recorded. The tool does not invent actions.")}
        <section>
          <h3>Indicator-level results and derivation</h3>
          <div class="hdrl-report-table-wrap" role="region" aria-label="All indicator results" tabindex="0">
            <table>
              <thead><tr><th scope="col">Indicator</th><th scope="col">Status / judgement</th><th scope="col">Uncertainty</th><th scope="col">Evidence</th><th scope="col">Notes</th></tr></thead>
              <tbody>
                ${catalogue.indicators.map((indicator) => {
                  const response = indicatorResponse(indicator.ref);
                  const result = response.status === "rated" && response.level ? `${response.level} · ${catalogue.maturity_level_names[response.level]}` : STATUS_LABELS[response.status];
                  return `<tr><th scope="row">${indicator.ref} · ${esc(indicator.name)}</th><td>${esc(result)}</td><td>${esc(response.uncertainty || "Not recorded")}</td><td>${response.evidence.length}</td><td>${esc(response.rationale || response.applicabilityReason || "No rationale recorded")}</td></tr>`;
                }).join("")}
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <h3>Dependencies and constraints</h3>
          <p>HDRL is sociotechnical: domain patterns should be interpreted together. Review these dependencies where a domain is uncertain, thinly evidenced or constrained:</p>
          <ul>${catalogue.domains.map((domain) => `<li><strong>${domain.ref} · ${esc(domain.name)}:</strong> ${content.domain_guidance[domain.ref].dependencies.map(esc).join("; ")}.</li>`).join("")}</ul>
          <p>Operating-capacity notes are recorded separately from capability and evidence in the structured export.</p>
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
            <li>Rules version ${VERSIONS.rules} identifies coverage, evidence and uncertainty patterns only; it does not provide professional, legal or investment advice.</li>
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
        uncertainty: index % 3 === 0 ? "high" : "medium",
        note: "Synthetic example impression."
      };
    });
    catalogue.indicators.slice(0, 12).forEach((indicator, index) => {
      sample.indicators[indicator.ref] = {
        status: "rated",
        level: `L${(index % 3) + 2}`,
        uncertainty: index % 4 === 0 ? "high" : "medium",
        rationale: "Synthetic rationale used only to demonstrate the report.",
        capacityNote: index % 3 === 0 ? "Synthetic example: operating headroom should be checked." : "",
        improvementNote: index % 4 === 0 ? "Confirm the responsible owner and review the current operating evidence." : "",
        applicabilityReason: "",
        evidence: index % 2 === 0 ? [{
          id: makeId(),
          title: "Synthetic operating record",
          type: "Process or operating record",
          reference: "EXAMPLE-ONLY",
          owner: "Example team",
          date: today(),
          reviewPeriod: "Annual",
          note: "Demonstration record; not real evidence.",
          supports: `L${(index % 3) + 2}`,
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
      researchContact: false,
      newsletter: false
    };
    sample.view = "report";
    return sample;
  }

  function exportPayload() {
    return {
      export_schema: "hdrl-self-assessment-export-v0.1.0",
      exported_at: nowIso(),
      versions: { ...VERSIONS },
      assessment: {
        id: state.id,
        created_at: state.createdAt,
        updated_at: state.updatedAt,
        boundary: state.boundary,
        rapid_first_pass: state.rapid,
        evidence_led_responses: state.indicators,
        audit: state.audit
      },
      derived: {
        domain_summaries: Object.fromEntries(catalogue.domains.map((domain) => [domain.ref, domainSummary(domain.ref)])),
        findings: derivedFindings()
      },
      limitations: [
        "Self-assessment; not validation, accreditation or endorsement.",
        "Rapid impressions are not HDRL indicator scores.",
        "Evidence references are not independently verified.",
        "No overall HDRL score is calculated."
      ]
    };
  }

  function csvPayload() {
    const columns = ["indicator_ref", "indicator_name", "domain", "status", "level", "uncertainty", "rationale", "capacity_note", "improvement_note", "applicability_reason", "evidence_count", "evidence_titles"];
    const cell = (value) => {
      let safe = String(value ?? "");
      if (/^[=+\-@\t\r]/.test(safe)) safe = `'${safe}`;
      return `"${safe.replaceAll('"', '""')}"`;
    };
    const rows = catalogue.indicators.map((indicator) => {
      const response = indicatorResponse(indicator.ref);
      return [
        indicator.ref,
        indicator.name,
        indicator.domain,
        response.status,
        response.level,
        response.uncertainty,
        response.rationale,
        response.capacityNote,
        response.improvementNote,
        response.applicabilityReason,
        response.evidence.length,
        response.evidence.map((item) => item.title).join("; ")
      ].map(cell).join(",");
    });
    return [columns.join(","), ...rows].join("\n");
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
    URL.revokeObjectURL(url);
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

  function saveIndicatorForm(form) {
    const indicator = catalogue.indicators.find((item) => item.ref === state.activeIndicator);
    const response = indicatorResponse(indicator.ref);
    const previous = JSON.stringify(response);
    response.status = form.elements["indicator-status"].value || "unstarted";
    response.level = response.status === "rated" ? (form.elements["indicator-level"].value || "") : "";
    response.uncertainty = form.elements["indicator-uncertainty"].value;
    response.rationale = form.elements["indicator-rationale"].value.trim();
    response.capacityNote = form.elements["indicator-capacity"].value.trim();
    response.improvementNote = form.elements["indicator-improvement"].value.trim();
    response.applicabilityReason = response.status === "not_applicable" ? form.elements["indicator-applicability"].value.trim() : "";
    response.updatedAt = nowIso();
    if (JSON.stringify(response) !== previous) audit("indicator_response_changed", indicator.ref, "Prototype user edit");
    scheduleSave();
    return response;
  }

  function validateIndicator(form) {
    const errors = {};
    const status = form.elements["indicator-status"].value;
    if (status === "not_applicable" && !form.elements["indicator-applicability"].value.trim()) {
      errors["indicator-applicability"] = "Explain why this indicator is outside the assessment boundary.";
    }
    return errors;
  }

  function validateGate() {
    const errors = {};
    const required = {
      "gate-name": "Enter a name.",
      "gate-email": "Enter an email address.",
      "gate-role": "Enter a role.",
      "gate-organisation": "Enter an organisation.",
      "gate-region": "Enter a country or region."
    };
    Object.entries(required).forEach(([id, message]) => {
      if (!document.getElementById(id).value.trim()) errors[id] = message;
    });
    const email = document.getElementById("gate-email").value.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors["gate-email"] = "Enter an email address in the correct format.";
    if (!document.getElementById("gate-service-type").value) errors["gate-service-type"] = "Choose a broad service type.";
    if (!document.getElementById("gate-scale").value) errors["gate-scale"] = "Choose an approximate scale.";
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
        else if (action === "resume") setView(state.view === "welcome" ? "boundary" : state.view);
        else if (action === "sample") {
          if (confirm("Replace the current on-device draft with a synthetic sample?")) {
            state = sampleState();
            await persist();
            render();
          }
        } else if (action === "dashboard") setView(state.boundary.title ? "rapid-summary" : "boundary");
        else if (action === "rapid-start") {
          state.rapidIndex = 0;
          setView("rapid");
        } else if (action === "rapid-prev") {
          state.rapidIndex = Math.max(0, state.rapidIndex - 1);
          render();
        } else if (action === "rapid-summary") setView("rapid-summary");
        else if (action === "rapid-edit" || action === "rapid-edit-first") {
          state.rapidIndex = action === "rapid-edit-first"
            ? 0
            : content.rapid_questions.findIndex((item) => item.domain === target.dataset.domain);
          setView("rapid");
        } else if (action === "evidence") setView("evidence");
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
        else if (action === "print") window.print();
        else if (action === "export-json") {
          download(`hdrl-assessment-${today()}.json`, "application/json", JSON.stringify(exportPayload(), null, 2));
          audit("assessment_exported", "json");
          scheduleSave();
        } else if (action === "export-csv") {
          download(`hdrl-assessment-indicators-${today()}.csv`, "text/csv;charset=utf-8", csvPayload());
          audit("assessment_exported", "csv");
          scheduleSave();
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
      reviewPeriod: document.getElementById("evidence-review-period").value.trim(),
      note: document.getElementById("evidence-note").value.trim(),
      supports: document.getElementById("evidence-supports").value,
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
      setView("rapid-intro");
    });

    const rapidForm = document.getElementById("hdrl-rapid-form");
    rapidForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const domain = content.rapid_questions[state.rapidIndex].domain;
      const impression = rapidForm.elements["rapid-impression"].value;
      if (!impression) {
        announce("Choose an impression, not known or not assessed before continuing.", true);
        rapidForm.elements["rapid-impression"][0].focus();
        return;
      }
      state.rapid[domain] = {
        impression,
        uncertainty: rapidForm.elements["rapid-uncertainty"].value,
        note: rapidForm.elements["rapid-note"].value.trim()
      };
      audit("rapid_response_saved", domain);
      if (state.rapidIndex === 7) setView("rapid-summary");
      else {
        state.rapidIndex += 1;
        scheduleSave();
        render();
      }
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
    indicatorForm?.querySelectorAll('input[name="indicator-status"]').forEach((input) => {
      input.addEventListener("change", () => {
        document.getElementById("hdrl-level-panel").hidden = input.value !== "rated";
        document.getElementById("hdrl-applicability-panel").hidden = input.value !== "not_applicable";
      });
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
        researchContact: document.getElementById("gate-research").checked,
        newsletter: document.getElementById("gate-newsletter").checked
      };
      audit("prototype_report_gate_unlocked", "report", "No data transmitted");
      setView("report");
    });
  }

  function render() {
    const views = {
      welcome: welcomeView,
      boundary: boundaryView,
      "rapid-intro": rapidIntroView,
      rapid: rapidView,
      "rapid-summary": rapidSummaryView,
      evidence: evidenceDashboardView,
      indicator: indicatorView,
      review: reviewView,
      gate: gateView,
      report: reportView
    };
    root.innerHTML = (views[state.view] || welcomeView)();
    root.setAttribute("aria-busy", "false");
    bind();
    if (lastFocusId) {
      requestAnimationFrame(() => document.getElementById(lastFocusId)?.focus());
      lastFocusId = "";
    }
  }

  async function init() {
    try {
      const [catalogueResponse, contentResponse, draft] = await Promise.all([
        fetch(root.dataset.catalogueUrl, { credentials: "same-origin" }),
        fetch(root.dataset.contentUrl, { credentials: "same-origin" }),
        loadDraft()
      ]);
      if (!catalogueResponse.ok || !contentResponse.ok) throw new Error("Assessment data failed to load");
      catalogue = await catalogueResponse.json();
      content = await contentResponse.json();
      if (catalogue.framework.version !== VERSIONS.framework || catalogue.catalogue_version !== VERSIONS.catalogue || catalogue.indicator_count !== 64) {
        throw new Error("The prototype and canonical catalogue versions do not match");
      }
      const defaults = defaultState();
      state = draft && draft.schemaVersion === 1
        ? {
            ...defaults,
            ...draft,
            boundary: { ...defaults.boundary, ...draft.boundary },
            registration: { ...defaults.registration, ...draft.registration },
            versions: { ...VERSIONS }
          }
        : defaults;
      catalogue.indicators.forEach((indicator) => indicatorResponse(indicator.ref));
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
