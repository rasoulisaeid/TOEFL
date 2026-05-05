/* Firebase Cloud Sync
 * Stores the entire pathway:v1 blob under /families/{syncKey}/data
 * and keeps a real-time listener so both users see live updates.
 *
 * Architecture:
 *   - localStorage is the offline-first source of truth
 *   - Firebase mirrors that blob in the cloud
 *   - On write: localStorage → Firebase (debounced 1.5s)
 *   - On init: Firebase → localStorage (if cloud is newer)
 *   - Real-time listener: cloud changes update localStorage + re-route
 */

(function () {
  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBEC9fzNniD1eGS2fFAs5Grljjo4vZtSlM",
    authDomain: "toefl-c71e5.firebaseapp.com",
    databaseURL: "https://toefl-c71e5-default-rtdb.firebaseio.com",
    projectId: "toefl-c71e5",
    storageBucket: "toefl-c71e5.firebasestorage.app",
    messagingSenderId: "971631281942",
    appId: "1:971631281942:web:71c9003df2d61dd3d3b237",
  };

  const STORAGE_KEY = "pathway:v1";
  const SYNC_KEY_STORAGE = "pathway:syncKey";
  let db = null;
  let syncKey = null;
  let ignoreNextRemoteUpdate = false;
  let pushTimer = null;

  /* ── helpers ─────────────────────────────────────────── */
  function dbRef() {
    if (!db || !syncKey) return null;
    return firebase.database().ref("families/" + syncKey + "/data");
  }

  function readLocal() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
    catch (e) { return {}; }
  }

  function writeLocal(obj) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); }
    catch (e) { console.warn("Sync writeLocal error", e); }
  }

  /* Push local → Firebase, debounced so rapid writes don't spam */
  function schedulePush() {
    if (!dbRef()) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => {
      const data = readLocal();
      ignoreNextRemoteUpdate = true;
      dbRef().set({ payload: data, updatedAt: Date.now() })
        .then(() => {
          setSyncStatus("synced");
        })
        .catch((err) => {
          setSyncStatus("error");
          console.warn("Firebase push error:", err);
        });
    }, 1500);
  }

  /* Pull Firebase → local, merge (cloud wins on conflict) */
  async function pullFromCloud() {
    const ref = dbRef();
    if (!ref) return;
    setSyncStatus("syncing");
    try {
      const snap = await ref.get();
      if (snap.exists()) {
        const cloudData = snap.val();
        if (cloudData && cloudData.payload) {
          writeLocal(cloudData.payload);
        }
      }
      setSyncStatus("synced");
    } catch (e) {
      setSyncStatus("error");
      console.warn("Firebase pull error:", e);
    }
  }

  /* Subscribe to real-time changes */
  function subscribeRealtime() {
    const ref = dbRef();
    if (!ref) return;
    ref.on("value", (snap) => {
      if (ignoreNextRemoteUpdate) {
        ignoreNextRemoteUpdate = false;
        return;
      }
      if (snap.exists()) {
        const cloudData = snap.val();
        if (cloudData && cloudData.payload) {
          writeLocal(cloudData.payload);
          setSyncStatus("synced");
          // Re-render the current view silently
          const event = new Event("hashchange");
          window.dispatchEvent(event);
        }
      }
    });
  }

  /* ── UI status indicator ─────────────────────────────── */
  function setSyncStatus(status) {
    const el = document.getElementById("syncStatus");
    if (!el) return;
    const icons = { synced: "☁️", syncing: "⟳", error: "⚠️", offline: "📴", disconnected: "🔗" };
    const labels = { synced: "Synced", syncing: "Syncing…", error: "Sync error", offline: "Offline", disconnected: "Not syncing" };
    el.title = labels[status] || status;
    el.textContent = (icons[status] || "🔗") + " " + (labels[status] || "");
    el.className = "sync-badge " + status;
  }

  /* ── Public API ──────────────────────────────────────── */
  window.Sync = {
    getSyncKey() { return syncKey; },

    /* Called on each Storage.set() write */
    onWrite() { schedulePush(); setSyncStatus("syncing"); },

    /* Connect using a shared family key */
    async connect(key) {
      if (!key || key.trim().length < 4) {
        UI.toast("Sync key must be at least 4 characters.");
        return false;
      }
      syncKey = key.trim().toLowerCase().replace(/[^a-z0-9\-_]/g, "-");
      localStorage.setItem(SYNC_KEY_STORAGE, syncKey);
      setSyncStatus("syncing");
      await pullFromCloud();
      subscribeRealtime();
      UI.toast("☁️ Syncing with key: " + syncKey);
      return true;
    },

    disconnect() {
      if (dbRef()) dbRef().off();
      syncKey = null;
      localStorage.removeItem(SYNC_KEY_STORAGE);
      setSyncStatus("disconnected");
      UI.toast("Sync disconnected.");
    },

    openModal() {
      UI.modal((m, close) => {
        const cur = syncKey || "";
        const inp = UI.el("input", {
          value: cur,
          placeholder: "e.g. family-toefl-2025",
          style: "width:100%;margin-top:8px",
        });
        m.appendChild(UI.el("h2", null, "☁️ Cloud Sync"));
        m.appendChild(UI.el("div", { class: "muted", style: "margin:8px 0 12px" },
          "Enter the same sync key on both devices (you and your wife). " +
          "Your progress will merge automatically in real time."
        ));
        m.appendChild(UI.el("label", null, [
          UI.el("div", { class: "muted", style: "font-size:12px;margin-bottom:4px" }, "Sync Key"),
          inp,
        ]));
        m.appendChild(UI.el("div", { class: "muted", style: "font-size:11px;margin-top:6px" },
          "Use a private phrase only you two know (no spaces needed)."
        ));
        m.appendChild(UI.el("div", { class: "modal-actions", style: "margin-top:18px" }, [
          UI.el("button", { class: "btn", text: "Cancel", onclick: close }),
          cur ? UI.el("button", {
            class: "btn ghost danger",
            text: "Disconnect",
            onclick: () => { window.Sync.disconnect(); close(); },
          }) : null,
          UI.el("button", {
            class: "btn primary",
            text: syncKey ? "Update Key" : "Start Syncing",
            onclick: async () => {
              const ok = await window.Sync.connect(inp.value);
              if (ok) close();
            },
          }),
        ]));
      });
    },

    /* Auto-connect on page load if key is saved */
    async autoConnect() {
      const savedKey = localStorage.getItem(SYNC_KEY_STORAGE);
      if (!savedKey) { setSyncStatus("disconnected"); return; }
      await this.connect(savedKey);
    },
  };

  /* ── Patch Storage.set to trigger sync ──────────────── */
  function patchStorage() {
    const origSet = window.Storage.set.bind(window.Storage);
    window.Storage.set = function (k, v) {
      origSet(k, v);
      window.Sync.onWrite();
    };
    const origDelete = window.Storage.delete.bind(window.Storage);
    window.Storage.delete = function (k) {
      origDelete(k);
      window.Sync.onWrite();
    };
  }

  /* ── Bootstrap ───────────────────────────────────────── */
  function init() {
    // Init Firebase
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    db = firebase.database();

    patchStorage();

    // Firebase connection state
    firebase.database().ref(".info/connected").on("value", (snap) => {
      if (!syncKey) return;
      setSyncStatus(snap.val() ? "synced" : "offline");
    });

    // Auto-connect if previously set up
    window.Sync.autoConnect();
  }

  // Wait for Firebase SDK to be ready
  if (typeof firebase !== "undefined") {
    init();
  } else {
    window.addEventListener("load", () => {
      if (typeof firebase !== "undefined") init();
      else console.warn("Firebase SDK not loaded.");
    });
  }
})();
