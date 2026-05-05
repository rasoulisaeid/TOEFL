/* Firebase Cloud Sync — REST API + SSE (Server-Sent Events)
 *
 * Writes:  HTTPS PUT  → instant push on every Storage change
 * Reads:   EventSource SSE → Firebase pushes changes in real-time (no polling)
 *
 * Works on GitHub Pages, file://, anywhere — no WebSocket required.
 */

(function () {
  const DB_URL       = "https://toefl-c71e5-default-rtdb.firebaseio.com";
  const STORAGE_KEY  = "pathway:v1";
  const SYNC_KEY_LOC = "pathway:syncKey";

  let syncKey    = null;
  let pushTimer  = null;
  let lastPushed = null;   // avoid redundant pushes
  let evtSource  = null;   // SSE connection

  /* ── REST URL ──────────────────────────────────────── */
  function url() {
    return `${DB_URL}/families/${syncKey}/data.json`;
  }

  /* ── Local helpers ─────────────────────────────────── */
  function readLocal() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function writeLocal(obj) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); }
    catch (e) { console.warn("writeLocal error", e); }
  }

  /* ── Status badge ──────────────────────────────────── */
  function setStatus(s) {
    const el = document.getElementById("syncStatus");
    if (!el) return;
    const map = {
      synced      : ["☁️",  "Synced",      "synced"],
      syncing     : ["⟳",   "Syncing…",    "syncing"],
      error       : ["⚠️",  "Sync error",  "error"],
      disconnected: ["🔗",  "Not syncing", "disconnected"],
    };
    const [icon, label, cls] = map[s] || ["🔗", s, "disconnected"];
    el.textContent = `${icon} ${label}`;
    el.className   = `sync-badge ${cls}`;
    el.title       = label;
  }

  /* ── Push: local → cloud ────────────────────────────
     Debounced 1 s so rapid consecutive writes only hit
     Firebase once.                                      */
  function schedulePush() {
    if (!syncKey) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(async () => {
      const data   = readLocal();
      const asJson = JSON.stringify(data);
      if (asJson === lastPushed) return;   // nothing new
      setStatus("syncing");
      try {
        const res = await fetch(url(), {
          method : "PUT",
          headers: { "Content-Type": "application/json" },
          body   : JSON.stringify({ payload: data, updatedAt: Date.now() }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        lastPushed = asJson;
        setStatus("synced");
      } catch (e) {
        setStatus("error");
        console.error("🔴 Sync push failed:", e.message);
      }
    }, 1000);
  }

  /* ── Initial pull: cloud → local ───────────────────── */
  async function pullOnce() {
    setStatus("syncing");
    try {
      const res = await fetch(url());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const remote = await res.json();
      if (remote && remote.payload) {
        const remoteJson = JSON.stringify(remote.payload);
        const localJson  = JSON.stringify(readLocal());
        if (remoteJson !== localJson) {
          writeLocal(remote.payload);
          lastPushed = remoteJson;
        } else {
          lastPushed = localJson;
        }
      }
      setStatus("synced");
    } catch (e) {
      setStatus("error");
      console.error("🔴 Sync pull failed:", e.message);
    }
  }

  /* ── Real-time listener via SSE ─────────────────────
     Firebase Realtime Database supports EventSource —
     the server pushes a 'put' event whenever data changes.
     No polling, no WebSocket — purely HTTP streaming.   */
  function subscribeSSE() {
    if (evtSource) { evtSource.close(); evtSource = null; }

    evtSource = new EventSource(url());

    evtSource.addEventListener("put", (e) => {
      try {
        const { data } = JSON.parse(e.data);   // { path, data }
        if (!data) return;                      // null = deleted
        const incoming = data.payload || data;  // handle root vs nested
        if (!incoming || typeof incoming !== "object") return;

        const incomingJson = JSON.stringify(incoming);
        if (incomingJson === lastPushed) return;  // our own write reflected back

        writeLocal(incoming);
        lastPushed = incomingJson;
        setStatus("synced");
        // Silently refresh the current view so partner's progress appears
        window.dispatchEvent(new Event("hashchange"));
      } catch (err) {
        console.warn("SSE parse error", err);
      }
    });

    evtSource.onopen = () => setStatus("synced");

    evtSource.onerror = () => {
      setStatus("error");
      // SSE auto-reconnects on its own — no manual retry needed
    };
  }

  /* ── Modal ─────────────────────────────────────────── */
  function openModal() {
    UI.modal((m, close) => {
      const cur = syncKey || "";
      const inp = UI.el("input", {
        value      : cur,
        placeholder: "e.g. family-toefl-2025",
        style      : "width:100%;margin-top:8px",
      });
      m.appendChild(UI.el("h2", null, "☁️ Cloud Sync"));
      m.appendChild(UI.el("div", { class: "muted", style: "margin:8px 0 12px" },
        "Enter the same sync key on both devices. " +
        "Changes sync in real-time the moment either of you does something."
      ));
      m.appendChild(UI.el("label", null, [
        UI.el("div", { class: "muted", style: "font-size:12px;margin-bottom:4px" }, "Sync Key"),
        inp,
      ]));
      m.appendChild(UI.el("div", { class: "muted", style: "font-size:11px;margin-top:6px" },
        "Use a private phrase only you two know."
      ));
      m.appendChild(UI.el("div", { class: "modal-actions", style: "margin-top:18px" }, [
        UI.el("button", { class: "btn", text: "Cancel", onclick: close }),
        cur ? UI.el("button", {
          class: "btn ghost danger", text: "Disconnect",
          onclick: () => { window.Sync.disconnect(); close(); },
        }) : null,
        UI.el("button", {
          class: "btn primary",
          text : syncKey ? "Update Key" : "Start Syncing",
          onclick: async () => {
            const ok = await window.Sync.connect(inp.value);
            if (ok) close();
          },
        }),
      ]));
    });
  }

  /* ── Public API ────────────────────────────────────── */
  window.Sync = {
    getSyncKey() { return syncKey; },

    onWrite() { schedulePush(); },

    async connect(key) {
      if (!key || key.trim().length < 4) {
        UI.toast("Sync key must be at least 4 characters.");
        return false;
      }
      // disconnect old SSE if key is changing
      if (evtSource) { evtSource.close(); evtSource = null; }

      syncKey = key.trim().toLowerCase().replace(/[^a-z0-9\-_]/g, "-");
      localStorage.setItem(SYNC_KEY_LOC, syncKey);

      await pullOnce();      // get latest state first
      subscribeSSE();        // then subscribe to live updates
      UI.toast("☁️ Syncing as: " + syncKey);
      return true;
    },

    disconnect() {
      if (evtSource) { evtSource.close(); evtSource = null; }
      clearTimeout(pushTimer);
      syncKey = null;
      localStorage.removeItem(SYNC_KEY_LOC);
      setStatus("disconnected");
      UI.toast("Sync disconnected.");
    },

    openModal,

    async autoConnect() {
      const saved = localStorage.getItem(SYNC_KEY_LOC);
      if (!saved) { setStatus("disconnected"); return; }
      syncKey = saved;
      await pullOnce();
      subscribeSSE();
    },
  };

  /* ── Patch Storage.set to trigger push ─────────────── */
  const origSet = window.Storage.set.bind(window.Storage);
  window.Storage.set = function (k, v) {
    origSet(k, v);
    window.Sync.onWrite();
  };
  const origDel = window.Storage.delete.bind(window.Storage);
  window.Storage.delete = function (k) {
    origDel(k);
    window.Sync.onWrite();
  };

  /* ── Bootstrap ─────────────────────────────────────── */
  window.Sync.autoConnect();
})();
