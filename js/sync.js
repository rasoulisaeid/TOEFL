/* Firebase Cloud Sync — fully automatic, zero setup
 *
 * Firebase is the shared database. localStorage is just a fast cache.
 * On load: Firebase → localStorage, then subscribe to live updates via SSE.
 * On write: localStorage + Firebase simultaneously.
 *
 * No sync key, no modal, no buttons. It just works.
 */

(function () {
  const DB_URL      = "https://toefl-c71e5-default-rtdb.firebaseio.com";
  const FAMILY_KEY  = "rasoulisaeid";
  const STORAGE_KEY = "pathway:v1";

  let evtSource  = null;
  let pushTimer  = null;
  let lastPushed = null;

  /* ── REST helpers ──────────────────────────────────── */
  function apiUrl() {
    return `${DB_URL}/families/${FAMILY_KEY}/data.json`;
  }

  /* ── Local cache ───────────────────────────────────── */
  function readLocal() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function writeLocal(obj) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); }
    catch (e) { console.warn("cache write error", e); }
  }

  /* ── Status badge (passive indicator only) ─────────── */
  function setStatus(s) {
    const el = document.getElementById("syncStatus");
    if (!el) return;
    const map = {
      synced: ["☁️", "Synced",     "synced"],
      saving: ["⟳",  "Saving…",    "syncing"],
      error : ["⚠️", "Sync error", "error"],
      loading:["⟳",  "Loading…",   "syncing"],
    };
    const [icon, label, cls] = map[s] || ["☁️", s, "synced"];
    el.textContent = `${icon} ${label}`;
    el.className   = `sync-badge ${cls}`;
    el.title       = label;
    el.style.cursor = "default";
  }

  /* ── Push: local → Firebase (debounced 800ms) ──────── */
  function schedulePush() {
    clearTimeout(pushTimer);
    pushTimer = setTimeout(async () => {
      const data   = readLocal();
      const asJson = JSON.stringify(data);
      if (asJson === lastPushed) return;
      lastPushed = asJson;
      setStatus("saving");
      try {
        const res = await fetch(apiUrl(), {
          method : "PUT",
          headers: { "Content-Type": "application/json" },
          body   : JSON.stringify({ payload: data, updatedAt: Date.now() }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setStatus("synced");
      } catch (e) {
        lastPushed = null; // reset on error so we can retry
        setStatus("error");
        console.error("🔴 Save failed:", e.message);
      }
    }, 800);
  }

  /* ── Pull: Firebase → local (one-time on load) ─────── */
  async function pullOnce() {
    setStatus("loading");
    try {
      const res = await fetch(apiUrl());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const remote = await res.json();
      if (remote && remote.payload) {
        writeLocal(remote.payload);
        lastPushed = JSON.stringify(remote.payload);
      }
      setStatus("synced");
    } catch (e) {
      setStatus("error");
      console.error("🔴 Load failed:", e.message);
    }
  }

  /* ── Real-time: SSE stream from Firebase ───────────── */
  function subscribeSSE() {
    if (evtSource) evtSource.close();
    evtSource = new EventSource(apiUrl());

    evtSource.addEventListener("put", (e) => {
      try {
        const { data } = JSON.parse(e.data);
        if (!data) return;
        const incoming = data.payload || data;
        if (!incoming || typeof incoming !== "object") return;
        const incomingJson = JSON.stringify(incoming);
        if (incomingJson === lastPushed) return;  // own write echoed back
        writeLocal(incoming);
        lastPushed = incomingJson;
        setStatus("synced");
        window.dispatchEvent(new Event("hashchange"));
      } catch (err) {
        console.warn("SSE parse error", err);
      }
    });

    evtSource.addEventListener("patch", (e) => {
      try {
        const { data } = JSON.parse(e.data);
        if (!data) return;
        const local = readLocal();
        Object.assign(local, data.payload || data);
        writeLocal(local);
        lastPushed = JSON.stringify(local);
        setStatus("synced");
        window.dispatchEvent(new Event("hashchange"));
      } catch (err) {
        console.warn("SSE patch error", err);
      }
    });

    evtSource.onopen = () => setStatus("synced");
    evtSource.onerror = () => setStatus("error");
  }

  /* ── Patch Storage to auto-sync every write ────────── */
  function patchStorage() {
    const origSet = window.Storage.set.bind(window.Storage);
    window.Storage.set = function (k, v) {
      origSet(k, v);
      schedulePush();
    };
    const origDel = window.Storage.delete.bind(window.Storage);
    window.Storage.delete = function (k) {
      origDel(k);
      schedulePush();
    };
  }

  /* ── Bootstrap: runs automatically on page load ────── */
  async function init() {
    patchStorage();
    await pullOnce();
    subscribeSSE();
  }

  init();
})();
