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
  const CLIENT_ID   = Math.random().toString(36).slice(2); // Unique ID for this session

  let evtSource  = null;
  let pushTimer  = null;
  let lastPushed = null;

  /* ── REST helpers ──────────────────────────────────── */
  function apiUrl() {
    return `${DB_URL}/families/${FAMILY_KEY}/data.json`;
  }
  function imageApiUrl(id) {
    // Sanitize id for Firebase keys (replace : with _)
    const safeId = id.replace(/:/g, "_");
    return `${DB_URL}/families/${FAMILY_KEY}/images/${safeId}.json`;
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
      synced:  ["☁️", "Synced",      "synced"],
      saving:  ["⟳",  "Saving…",     "syncing"],
      error :  ["⚠️", "Sync error",  "error"],
      loading: ["⟳",  "Loading…",    "syncing"],
      offline: ["📡", "Offline",     "error"],
    };
    const [icon, label, cls] = map[s] || ["☁️", s, "synced"];
    el.textContent = `${icon} ${label}`;
    el.className   = `sync-badge ${cls}`;
    el.title       = label;
    el.style.cursor = "default";
  }

  window.addEventListener("online", () => {
    console.log("🌐 Back online, retrying sync...");
    pullOnce();
    subscribeSSE();
  });
  window.addEventListener("offline", () => {
    console.log("📡 Offline");
    setStatus("offline");
  });

  /* ── Push: local → Firebase (debounced 800ms) ──────── */
  function schedulePush() {
    if (!navigator.onLine) {
      setStatus("offline");
      return;
    }
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
          body   : JSON.stringify({ 
            payload: data, 
            updatedAt: Date.now(),
            clientId: CLIENT_ID // Tag this update as ours
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setStatus("synced");
      } catch (e) {
        lastPushed = null; 
        setStatus("error");
        console.error("🔴 Save failed:", e.message);
      }
    }, 800);
  }

  /* ── Pull: Firebase → local (one-time on load) ─────── */
  async function pullOnce() {
    if (!navigator.onLine) {
      setStatus("offline");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(apiUrl());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const remote = await res.json();
      if (remote && remote.payload) {
        writeLocal(remote.payload);
        lastPushed = JSON.stringify(remote.payload);
        // Refresh current view
        if (window.location.hash) {
          const ev = new HashChangeEvent("hashchange");
          window.dispatchEvent(ev);
        }
      }
      setStatus("synced");
    } catch (e) {
      setStatus("error");
      console.error("🔴 Load failed:", e.message);
    }
  }

  /* ── Real-time: SSE stream from Firebase ───────────── */
  function subscribeSSE() {
    if (!navigator.onLine) return;
    if (evtSource) evtSource.close();
    evtSource = new EventSource(apiUrl());

    evtSource.addEventListener("put", (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (!payload || !payload.data) return;
        
        const remoteData = payload.data;
        
        // CRITICAL: Ignore if the update came from US
        if (remoteData.clientId === CLIENT_ID) {
          return;
        }

        const incoming = remoteData.payload || remoteData;
        if (!incoming || typeof incoming !== "object") return;
        
        const incomingJson = JSON.stringify(incoming);
        if (incomingJson === lastPushed) return;

        writeLocal(incoming);
        lastPushed = incomingJson;
        setStatus("synced");
        
        // Only reload if the data actually changed from someone else
        window.dispatchEvent(new Event("hashchange"));
      } catch (err) {
        console.warn("SSE parse error", err);
      }
    });

    evtSource.addEventListener("patch", (e) => {
      // Patch is less common in this root-PUT setup but same logic applies
      try {
        const payload = JSON.parse(e.data);
        if (!payload || !payload.data) return;
        if (payload.data.clientId === CLIENT_ID) return;

        const local = readLocal();
        Object.assign(local, payload.data.payload || payload.data);
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

    // Patch ImageDB to sync large assets
    if (window.ImageDB) {
      const origImgSet = window.ImageDB.set.bind(window.ImageDB);
      window.ImageDB.set = async function (id, data) {
        await origImgSet(id, data);
        pushImage(id, data);
      };
      const origImgGet = window.ImageDB.get.bind(window.ImageDB);
      window.ImageDB.get = async function (id) {
        let local = await origImgGet(id);
        if (!local) {
          local = await pullImage(id);
          if (local) await origImgSet(id, local);
        }
        return local;
      };
      const origImgDel = window.ImageDB.delete.bind(window.ImageDB);
      window.ImageDB.delete = async function (id) {
        await origImgDel(id);
        deleteImage(id);
      };
    }
  }

  async function deleteImage(id) {
    try {
      await fetch(imageApiUrl(id), { method: "DELETE" });
    } catch (e) { console.error("🔴 Image delete failed:", e); }
  }

  async function pushImage(id, data) {
    try {
      await fetch(imageApiUrl(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, updatedAt: Date.now(), clientId: CLIENT_ID })
      });
    } catch (e) { console.error("🔴 Image push failed:", e); }
  }

  async function pullImage(id) {
    try {
      const res = await fetch(imageApiUrl(id));
      if (!res.ok) return null;
      const remote = await res.json();
      return remote ? remote.data : null;
    } catch (e) { return null; }
  }

  /* ── Bootstrap: runs automatically on page load ────── */
  async function init() {
    patchStorage();
    await pullOnce();
    subscribeSSE();
  }

  init();
})();
