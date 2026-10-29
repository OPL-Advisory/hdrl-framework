// Focused, offline regressions of the application's actual storage helpers.
// The IndexedDB double stages mutations until completion and discards aborted
// transactions. It does not replace the separate real-browser concurrency tests.
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

async function until(predicate) {
  for (let i = 0; i < 50; i += 1) {
    if (predicate()) return;
    await new Promise((resolve) => setImmediate(resolve));
  }
  assert.fail("Synthetic transaction did not reach the expected state");
}

function harness() {
  let stored = { found: false, value: undefined };
  let holdNext = false;
  let abortNext = false;
  let timerId = 0;
  const timers = new Map();
  const clicks = new Map();
  const metrics = { transactions: [], puts: [], commits: [], announcements: [], opens: 0, closes: 0 };
  const root = {
    innerHTML: "", dataset: {}, setAttribute() {}, scrollIntoView() {}, querySelectorAll() { return []; },
    querySelector(selector) {
      if (selector === '[data-action="restore-cancel"]')
        return { addEventListener(_event, callback) { clicks.set("cancel", callback); } };
      return null;
    }
  };
  const document = {
    visibilityState: "visible", addEventListener() {}, querySelectorAll() { return []; },
    getElementById(id) {
      if (id === "hdrl-assessment-root") return root;
      if (id === "hdrl-assessment-status") return {
        setAttribute() {}, set textContent(message) { metrics.announcements.push(message); }
      };
      return null;
    }
  };
  const indexedDB = {
    open() {
      const request = {};
      metrics.opens += 1;
      queueMicrotask(() => {
        request.result = {
          close() { metrics.closes += 1; },
          transaction(_store, mode) {
            const record = { mode, operations: [], held: holdNext, abortOnCompletion: abortNext };
            holdNext = false; abortNext = false;
            metrics.transactions.push(record);
            let pending = 0;
            let finished = false;
            let staged = clone(stored);
            let mutated = false;
            const tx = {
              error: null,
              abort() {
                if (finished) return;
                finished = true;
                record.aborted = true;
                queueMicrotask(() => tx.onabort?.());
              },
              objectStore() { return store; }
            };
            function finish() {
              if (finished || pending || record.held) return;
              if (record.abortOnCompletion) {
                tx.error = new Error("Synthetic transaction abort");
                tx.abort();
                return;
              }
              finished = true;
              record.completed = true;
              if (mutated) {
                stored = clone(staged);
                metrics.commits.push(clone(stored));
              }
              tx.oncomplete?.();
            }
            function operation(name, result, mutation) {
              assert.equal(finished, false, "Requests must occur inside an active transaction");
              record.operations.push(name);
              pending += 1;
              const request = {};
              queueMicrotask(() => {
                if (finished) return;
                if (mutation) mutation();
                request.result = result();
                request.onsuccess?.();
                pending -= 1;
                queueMicrotask(finish);
              });
              return request;
            }
            const store = {
              get(key) { assert.equal(key, "current"); return operation("get", () => clone(staged.found ? staged.value : undefined)); },
              count(key) { assert.equal(key, "current"); return operation("count", () => Number(staged.found)); },
              put(value, key) {
                assert.equal(mode, "readwrite"); assert.equal(key, "current");
                const copy = clone(value); metrics.puts.push(copy);
                return operation("put", () => key, () => { staged = { found: true, value: copy }; mutated = true; });
              },
              delete(key) {
                assert.equal(mode, "readwrite"); assert.equal(key, "current");
                return operation("delete", () => undefined, () => { staged = { found: false, value: undefined }; mutated = true; });
              }
            };
            record.release = () => { record.held = false; finish(); };
            return tx;
          }
        };
        request.onsuccess();
      });
      return request;
    }
  };
  const context = vm.createContext({
    document, indexedDB, structuredClone, crypto: webcrypto, TextDecoder, console,
    setTimeout(callback) { const id = ++timerId; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); }, requestAnimationFrame(callback) { callback(); },
    window: {}, location: { hostname: "localhost" },
    fetch() { throw new Error("No network is permitted by this test harness"); }
  });
  const hook = `globalThis.testApi = {
    defaultState, sameStoredDraft, writeIfUnchanged, persist, scheduleSave, bindRestore,
    setInputs(c, g, b) { catalogue = c; content = g; betaConfig = b; },
    setState(value, baseline) { state = value; storageBaseline = baseline; storagePause = ""; },
    getState() { return state; }, getBaseline() { return storageBaseline; },
    getPause() { return storagePause; }, setPause(value) { storagePause = value; },
    setRestore(value) { restoreSession = value; }, getRestore() { return restoreSession; }
  };`;
  assert.match(source, /  init\(\);\n\}\)\(\);\s*$/);
  vm.runInContext(source.replace(/  init\(\);\n\}\)\(\);\s*$/, `${hook}\n})();`), context);
  const api = context.testApi;
  api.setInputs(clone(catalogue), clone(content), clone(betaConfig));
  const initial = plain(api.defaultState());
  initial.id = "invented-storage-assessment";
  initial.snapshot["C.1.1"] = { status: "rated", level: "L3", certainty: "low", certaintyReasons: [], clarity: "", note: "Original note", updatedAt: null };
  stored = { found: true, value: clone(initial) };
  api.setState(clone(initial), clone(stored));
  return {
    api, metrics, initial, timers,
    stored: () => clone(stored), externalWrite(value) { stored = { found: true, value: clone(value) }; },
    externalDelete() { stored = { found: false, value: undefined }; },
    holdNext() { holdNext = true; }, abortNext() { abortNext = true; },
    cancel() { assert.ok(clicks.has("cancel")); return clicks.get("cancel")(); }
  };
}

test("stored-draft comparison rejects JSON-lossy aliases and detects changed content", () => {
  const { api, initial } = harness();
  const record = (value) => ({ found: true, value });
  assert.equal(api.sameStoredDraft(record(initial), record(clone(initial))), true);
  const changed = clone(initial); changed.snapshot["C.1.1"].note = "Another writer's note";
  assert.equal(api.sameStoredDraft(record(initial), record(changed)), false);
  changed.id = "another-assessment";
  assert.equal(api.sameStoredDraft(record(initial), record(changed)), false);
  for (const [unsafe, lossy] of [
    [{ field: undefined }, {}], [{ number: NaN }, { number: null }],
    [{ number: -0 }, { number: 0 }], [new Date("2026-10-29T00:00:00Z"), "2026-10-29T00:00:00.000Z"],
    [[, "kept"], [null, "kept"]], [new Map(), {}]
  ]) assert.equal(api.sameStoredDraft(record(unsafe), record(lossy)), false);
});

test("compare and put share one transaction; baseline advances only after commit", async () => {
  const h = harness(); const before = h.stored();
  const replacement = clone(h.initial); replacement.id = "invented-replacement";
  h.holdNext();
  const pending = h.api.writeIfUnchanged(replacement, before);
  await until(() => h.metrics.puts.length === 1);
  assert.deepEqual(h.stored(), before);
  assert.deepEqual(plain(h.api.getBaseline()), plain(before));
  assert.equal(h.metrics.transactions.length, 1);
  assert.equal(h.metrics.transactions[0].mode, "readwrite");
  assert.deepEqual(h.metrics.transactions[0].operations, ["get", "put"]);
  h.metrics.transactions[0].release();
  await pending;
  assert.deepEqual(h.stored(), { found: true, value: replacement });
  assert.deepEqual(plain(h.api.getBaseline()), { found: true, value: replacement });
  assert.equal(h.metrics.opens, h.metrics.closes);
});

test("queued own saves compare against the latest committed baseline", async () => {
  const h = harness(); h.holdNext();
  h.api.getState().snapshot["C.1.1"].note = "Own first edit";
  const first = h.api.persist();
  h.api.getState().snapshot["C.1.1"].note = "Own second edit";
  const second = h.api.persist();
  await until(() => h.metrics.puts.length === 1);
  assert.equal(h.metrics.transactions.length, 1, "Second queued writer waits for the first commit");
  assert.deepEqual(h.stored().value, h.initial);
  h.metrics.transactions[0].release();
  assert.deepEqual(await Promise.all([first, second]), [true, true]);
  assert.deepEqual(h.metrics.commits.map((entry) => entry.value.snapshot["C.1.1"].note), ["Own first edit", "Own second edit"]);
  assert.deepEqual(plain(h.api.getBaseline()), h.stored());
  assert.equal(h.api.getPause(), "");
});

for (const kind of ["same assessment with a changed note", "different assessment identifier"]) {
  test(`another writer's ${kind} is preserved and pauses later saves`, async () => {
    const h = harness(); const other = clone(h.initial);
    other.snapshot["C.1.1"].note = "Another tab's saved change";
    if (kind.startsWith("different")) other.id = "other-writer-assessment";
    h.externalWrite(other);
    h.api.getState().snapshot["C.1.1"].note = "Stale local edit";
    const first = h.api.persist(); const queued = h.api.persist();
    assert.deepEqual(await Promise.all([first, queued]), [false, false]);
    assert.deepEqual(h.stored().value, other);
    assert.equal(h.metrics.puts.length, 0);
    assert.equal(h.metrics.transactions.length, 1, "Queued work refuses after the pause");
    assert.ok(h.api.getPause());
    const opens = h.metrics.opens;
    h.api.scheduleSave();
    assert.equal(h.timers.size, 0);
    assert.equal(await h.api.persist(), false);
    assert.equal(h.metrics.opens, opens);
  });
}

test("an aborted replacement keeps both the stored draft and original baseline", async () => {
  const h = harness(); const before = h.stored();
  h.abortNext();
  await assert.rejects(h.api.writeIfUnchanged({ ...h.initial, id: "never-committed" }, before));
  assert.equal(h.metrics.puts.length, 1, "The aborted write had reached put");
  assert.equal(h.metrics.commits.length, 0);
  assert.deepEqual(h.stored(), before);
  assert.deepEqual(plain(h.api.getBaseline()), plain(before));
  assert.equal(h.metrics.opens, h.metrics.closes);
});

test("an absent key is different from a stored undefined value", async () => {
  const h = harness(); h.externalWrite(undefined);
  await assert.rejects(h.api.writeIfUnchanged(h.initial, { found: false, value: undefined }));
  assert.deepEqual(h.stored(), { found: true, value: undefined });
  assert.deepEqual(h.metrics.transactions[0].operations, ["get", "count"]);
  assert.equal(h.metrics.puts.length, 0);
});

test("conditional deletion cannot remove a different writer's saved draft", async () => {
  const h = harness(); const before = h.stored();
  const other = { ...h.initial, id: "another-writer" }; h.externalWrite(other);
  await assert.rejects(h.api.writeIfUnchanged(undefined, before, true));
  assert.deepEqual(h.stored().value, other);
  assert.equal(h.metrics.commits.length, 0);
  assert.deepEqual(h.metrics.transactions[0].operations, ["get"]);
});

test("Cancel after a storage pause never schedules the interrupted local save", async () => {
  const h = harness(); const before = h.stored();
  h.api.setPause("Synthetic storage conflict: reload required");
  h.api.setRestore({ reading: false, pending: null, error: "Storage conflict", hadPendingSave: true });
  h.api.bindRestore(); await h.cancel();
  assert.equal(h.api.getRestore(), null);
  assert.equal(h.timers.size, 0);
  assert.equal(await h.api.persist(), false);
  assert.equal(h.metrics.transactions.length, 0);
  assert.deepEqual(h.stored(), before);
});

test("Cancel detects work saved by another tab while restore was open", async () => {
  const h = harness();
  h.api.setRestore({ reading: false, pending: null, error: "", hadPendingSave: true });
  const newer = clone(h.initial); newer.snapshot["C.1.1"].note = "Saved elsewhere during restore";
  h.externalWrite(newer);
  h.api.bindRestore(); await h.cancel();
  assert.equal(h.api.getRestore(), null);
  assert.ok(h.api.getPause());
  assert.equal(h.timers.size, 0);
  assert.equal(h.metrics.puts.length, 0);
  assert.equal(await h.api.persist(), false);
  assert.deepEqual(h.stored().value, newer);
});
