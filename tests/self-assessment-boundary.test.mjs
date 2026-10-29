// Synthetic, offline regression of actual boundary submission and rendering.
// The small form double reads rendered fields; browser interaction is checked
// separately. No application functions are substituted or copied into tests.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { webcrypto } from "node:crypto";
import { test } from "node:test";
import vm from "node:vm";

const file = (path) => new URL(`../${path}`, import.meta.url);
const source = readFileSync(file("docs/assets/js/self-assessment.js"), "utf8");
const catalogue = JSON.parse(readFileSync(file("docs/data/hdrl-indicators-v1.json")));
const content = JSON.parse(readFileSync(file("docs/data/hdrl-assessment-content-v0.2.0.json")));
const betaConfig = JSON.parse(readFileSync(file("docs/data/hdrl-assessment-beta-config-v0.3.0.json")));
const clone = (value) => structuredClone(value);
const plain = (value) => JSON.parse(JSON.stringify(value));
const names = {
  title: "boundary-title", serviceName: "boundary-service", scope: "boundary-scope",
  timePeriod: "boundary-period", assessmentDate: "boundary-date", unit: "boundary-unit",
  method: "boundary-method", intendedUse: "boundary-use", declaredContext: "boundary-context"
};
const typed = {
  title: "  Invented new title  ", serviceName: "  Synthetic service  ",
  scope: "  New scope line one\nLine two & excluded work  ", timePeriod: "  Current test period  ",
  assessmentDate: "2026-10-29", unit: "dual", method: "team",
  intendedUse: "  Discuss invented improvement questions  ", declaredContext: "real"
};
const decode = (text) => text.replace(/&(quot|#039|lt|gt|amp);/g,
  (_whole, entity) => ({ quot: '"', "#039": "'", lt: "<", gt: ">", amp: "&" }[entity]));

function fieldsFromHtml(html) {
  const fields = {};
  for (const [key, name] of Object.entries(names)) {
    if (["scope", "intendedUse"].includes(key)) {
      const match = html.match(new RegExp(`<textarea\\b[^>]*name="${name}"[^>]*>([\\s\\S]*?)</textarea>`));
      assert.ok(match, `Rendered textarea ${name}`); fields[key] = decode(match[1]);
    } else if (["unit", "method"].includes(key)) {
      const choices = [...html.matchAll(new RegExp(`<input\\b[^>]*name="${name}"[^>]*>`, "g"))];
      const selected = choices.find(([tag]) => /\schecked(?:\s|>)/.test(tag));
      fields[key] = selected ? decode(selected[0].match(/\bvalue="([^"]*)"/)[1]) : "";
    } else if (key === "declaredContext") {
      const select = html.match(/<select\b[^>]*name="boundary-context"[^>]*>([\s\S]*?)<\/select>/);
      assert.ok(select, "Rendered context selector");
      const selected = [...select[1].matchAll(/<option\b[^>]*>/g)].find(([tag]) => /\sselected(?:\s|>)/.test(tag));
      assert.ok(selected, "An explicit context option is selected");
      fields[key] = decode(selected[0].match(/\bvalue="([^"]*)"/)[1]);
    } else {
      const match = html.match(new RegExp(`<input\\b[^>]*name="${name}"[^>]*value="([^"]*)"`));
      assert.ok(match, `Rendered input ${name}`); fields[key] = decode(match[1]);
    }
  }
  return fields;
}

function harness(existing = false) {
  let html = ""; let form = null; let stored; let timerId = 0;
  const timers = new Map(); const metrics = { transactions: 0, commits: 0, focused: [] };
  const root = {
    dataset: {}, setAttribute() {}, scrollIntoView() {}, querySelectorAll() { return []; }, querySelector() { return null; },
    get innerHTML() { return html; },
    set innerHTML(value) {
      html = value;
      if (!value.includes('<form id="hdrl-boundary-form"')) { form = null; return; }
      const fields = fieldsFromHtml(value);
      form = {
        elements: Object.fromEntries(Object.entries(names).map(([key, name]) => [name, { value: fields[key] }])),
        addEventListener(event, callback) { if (event === "submit") this.submit = callback; }
      };
    }
  };
  const document = {
    getElementById(id) {
      if (id === "hdrl-assessment-root") return root;
      if (id === "hdrl-boundary-form") return form;
      if (id === "hdrl-boundary-errors" || id === "hdrl-view-title") return { focus() { metrics.focused.push(id); } };
      if (id === "hdrl-assessment-status") return { setAttribute() {}, textContent: "" };
      return null;
    },
    querySelectorAll() { return []; }, addEventListener() {}, visibilityState: "visible"
  };
  const indexedDB = {
    open() {
      const opening = {};
      queueMicrotask(() => {
        opening.result = {
          close() {},
          transaction(_store, mode) {
            assert.equal(mode, "readwrite"); metrics.transactions += 1;
            const tx = {
              objectStore() { return {
                get() { const r = {}; queueMicrotask(() => { r.result = clone(stored.value); r.onsuccess(); }); return r; },
                count() { const r = {}; queueMicrotask(() => { r.result = Number(stored.found); r.onsuccess(); }); return r; },
                put(value) {
                  const copy = clone(value);
                  queueMicrotask(() => { stored = { found: true, value: copy }; metrics.commits += 1; tx.oncomplete(); });
                }
              }; },
              abort() { queueMicrotask(() => tx.onabort()); }
            };
            return tx;
          }
        };
        opening.onsuccess();
      });
      return opening;
    }
  };
  const context = vm.createContext({
    document, indexedDB, structuredClone, crypto: webcrypto, TextDecoder, console,
    setTimeout(callback) { const id = ++timerId; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); }, requestAnimationFrame(callback) { callback(); },
    window: {}, location: { hostname: "localhost" },
    fetch() { throw new Error("No network in boundary unit regressions"); }
  });
  const hook = `globalThis.testApi = {
    defaultState, boundaryView, bind,
    setInputs(c, g, b) { catalogue = c; content = g; betaConfig = b; },
    setState(value, baseline) { state = value; storageBaseline = baseline; },
    getState() { return state; }, getBaseline() { return storageBaseline; },
    whenSaved() { return storageQueue; }
  };`;
  assert.match(source, /  init\(\);\n\}\)\(\);\s*$/);
  vm.runInContext(source.replace(/  init\(\);\n\}\)\(\);\s*$/, `${hook}\n})();`), context);
  const api = context.testApi; api.setInputs(clone(catalogue), clone(content), clone(betaConfig));
  const initial = plain(api.defaultState()); initial.id = "synthetic-boundary-test"; initial.view = "boundary";
  initial.createdAt = "2026-10-28T09:00:00Z"; initial.updatedAt = "2026-10-28T10:00:00Z";
  if (existing) {
    initial.boundary = { title: "Original title", serviceName: "Original service", scope: "Original scope",
      timePeriod: "Original period", assessmentDate: "2026-10-28", unit: "service", method: "individual", intendedUse: "Original use" };
    initial.declaredContext = "synthetic";
    initial.snapshot["C.1.1"] = { status: "rated", level: "L3", certainty: "low", certaintyReasons: [], clarity: "", note: "Existing response retained", updatedAt: null };
  }
  stored = existing ? { found: true, value: clone(initial) } : { found: false, value: undefined };
  api.setState(clone(initial), clone(stored)); root.innerHTML = api.boundaryView(); api.bind();
  return {
    api, root, metrics, timers, initial, stored: () => clone(stored),
    enter(values) { for (const [key, value] of Object.entries(values)) form.elements[names[key]].value = value; },
    submit() { assert.ok(form.submit); let prevented = false; form.submit({ preventDefault() { prevented = true; } }); assert.equal(prevented, true); },
    fields: () => fieldsFromHtml(root.innerHTML),
    async flushSave() {
      const pending = [...timers.values()]; timers.clear();
      for (const callback of pending) callback();
      await api.whenSaved();
    }
  };
}

for (const existing of [false, true]) {
  test(`${existing ? "editing" : "first entry"}: multiple validation errors retain every pending field without changing the assessment`, () => {
    const h = harness(existing); const before = h.stored(); const baseline = clone(h.api.getBaseline());
    const pending = { ...typed, unit: "", intendedUse: "  " };
    h.enter(pending); h.submit();
    assert.deepEqual(h.fields(), pending);
    assert.match(h.root.innerHTML, /Choose a unit of assessment/);
    assert.match(h.root.innerHTML, /Describe the intended use/);
    assert.deepEqual(plain(h.api.getState()), h.initial);
    assert.deepEqual(h.api.getBaseline(), baseline);
    assert.deepEqual(h.stored(), before);
    assert.equal(h.timers.size, 0); assert.equal(h.metrics.transactions, 0);
    assert.equal(h.metrics.focused.at(-1), "hdrl-boundary-errors");
  });

  test(`${existing ? "editing" : "first entry"}: a corrected valid submission saves once against the unchanged baseline`, async () => {
    const h = harness(existing); const before = h.stored();
    h.enter({ ...typed, intendedUse: "" }); h.submit();
    h.enter({ intendedUse: typed.intendedUse }); h.submit();
    const expected = Object.fromEntries(Object.entries(typed).filter(([key]) => key !== "declaredContext")
      .map(([key, value]) => [key, ["title", "serviceName", "scope", "timePeriod", "intendedUse"].includes(key) ? value.trim() : value]));
    assert.deepEqual(plain(h.api.getState().boundary), expected);
    assert.equal(h.api.getState().declaredContext, typed.declaredContext);
    assert.equal(h.api.getState().view, "overview");
    assert.deepEqual(h.stored(), before, "No storage commit before the scheduled save");
    assert.equal(h.timers.size, 1);
    await h.flushSave();
    assert.equal(h.metrics.commits, 1);
    assert.deepEqual(h.stored().value.boundary, expected);
    assert.equal(h.stored().value.declaredContext, typed.declaredContext);
    assert.equal(h.stored().value.id, h.initial.id);
    assert.equal(h.stored().value.createdAt, h.initial.createdAt);
    assert.deepEqual(h.stored().value.versions, h.initial.versions);
    assert.deepEqual(h.stored().value.provenance, h.initial.provenance);
    if (existing) assert.deepEqual(h.stored().value.snapshot["C.1.1"], h.initial.snapshot["C.1.1"]);
    assert.equal(h.stored().value.audit.filter((entry) => entry.type === "assessment_boundary_saved").length, 1);
    assert.deepEqual(plain(h.api.getBaseline()), h.stored());
  });
}

test("repeated invalid submissions preserve prior pending edits and the latest corrections", () => {
  const h = harness(true); const before = h.stored();
  let pending = { ...typed, scope: "", assessmentDate: "", unit: "" };
  h.enter(pending); h.submit(); assert.deepEqual(h.fields(), pending);
  pending = { ...pending, scope: "  Corrected scope\nSecond line  ", unit: "system", title: " Latest pending title " };
  h.enter(pending); h.submit(); assert.deepEqual(h.fields(), pending);
  assert.match(h.root.innerHTML, /Enter the assessment date/);
  assert.doesNotMatch(h.root.innerHTML, /Describe the assessment scope and boundary\.<\/a>/);
  assert.deepEqual(plain(h.api.getState()), h.initial);
  assert.deepEqual(h.stored(), before); assert.equal(h.timers.size, 0);
});

test("all explicit context choices survive an error without being committed or inferred", () => {
  for (const declaredContext of ["synthetic", "real", "unspecified"]) {
    const h = harness(true); const pending = { ...typed, intendedUse: "", declaredContext };
    h.enter(pending); h.submit();
    assert.equal(h.fields().declaredContext, declaredContext);
    assert.equal(h.api.getState().declaredContext, "synthetic");
    assert.equal(h.metrics.transactions, 0);
  }
});

test("pending Unicode and markup are retained as escaped text on error", () => {
  const h = harness(true);
  const pending = { ...typed, title: '<img src="x" onerror="bad()"> & café 😀',
    scope: '  </textarea><script>bad()</script>\n"Quoted" & literal &amp;  ', intendedUse: "" };
  h.enter(pending); h.submit();
  assert.deepEqual(h.fields(), pending);
  assert.doesNotMatch(h.root.innerHTML, /<img src="x"|<script>bad\(\)<\/script>/);
  assert.deepEqual(plain(h.api.getState()), h.initial);
  assert.equal(h.metrics.transactions, 0);
});
