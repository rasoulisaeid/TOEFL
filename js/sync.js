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

    // Patch AudioDB to sync ElevenLabs audio
    if (window.AudioDB) {
      const origAudioSet = window.AudioDB.set.bind(window.AudioDB);
      window.AudioDB.set = async function (id, data) {
        await origAudioSet(id, data);
        let syncData = data;
        if (data instanceof Blob) {
          syncData = await blobToBase64(data);
        }
        pushAudio(id, syncData);
      };
      const origAudioGet = window.AudioDB.get.bind(window.AudioDB);
      window.AudioDB.get = async function (id) {
        let local = await origAudioGet(id);
        if (!local) {
          local = await pullAudio(id);
          if (local) await origAudioSet(id, local);
        }
        return local;
      };
      const origAudioDel = window.AudioDB.delete.bind(window.AudioDB);
      window.AudioDB.delete = async function (id) {
        await origAudioDel(id);
        deleteAudio(id);
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

  function audioApiUrl(id) {
    const safeId = id.replace(/:/g, "_");
    return `${DB_URL}/families/${FAMILY_KEY}/audio/${safeId}.json`;
  }
 
  async function pushAudio(id, data) {
    try {
      await fetch(audioApiUrl(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, updatedAt: Date.now(), clientId: CLIENT_ID })
      });
    } catch (e) { console.error("🔴 Audio push failed:", e); }
  }
 
  async function pullAudio(id) {
    try {
      const res = await fetch(audioApiUrl(id));
      if (!res.ok) return null;
      const remote = await res.json();
      return remote ? remote.data : null;
    } catch (e) { return null; }
  }
 
  async function deleteAudio(id) {
    try {
      await fetch(audioApiUrl(id), { method: "DELETE" });
    } catch (e) { console.error("🔴 Audio delete failed:", e); }
  }
 
  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /* ── Practice Sync: real-time turn-based sync ─────── */
  const PracticeSync = {
    _sse: null,
    _taskId: null,
    _cb: null,

    async join(taskId, callback) {
      this.leave(); 
      this._taskId = taskId;
      this._cb = callback;
      
      const safeId = taskId.replace(/:/g, "_");
      const url = `${DB_URL}/families/${FAMILY_KEY}/sessions/${safeId}.json`;
      
      this._sse = new EventSource(url);
      this._sse.addEventListener("put", (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload && payload.path === "/" && payload.data) callback(payload.data);
        } catch(err) {}
      });
      this._sse.addEventListener("patch", (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload && payload.data) callback(payload.data);
        } catch(err) {}
      });

      // Initial pull
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data) callback(data);
        }
      } catch(e) {}
    },

    async update(data) {
      if (!this._taskId) return;
      const safeId = this._taskId.replace(/:/g, "_");
      const url = `${DB_URL}/families/${FAMILY_KEY}/sessions/${safeId}.json`;
      await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, updatedAt: Date.now(), lastClientId: CLIENT_ID })
      });
    },

    async clear() {
      if (!this._taskId) return;
      const safeId = this._taskId.replace(/:/g, "_");
      const url = `${DB_URL}/families/${FAMILY_KEY}/sessions/${safeId}.json`;
      await fetch(url, { method: "DELETE" });
    },

    leave() {
      if (this._sse) this._sse.close();
      this._sse = null;
      this._taskId = null;
    }
  };
  window.PracticeSync = PracticeSync;
  window.SYNC_CLIENT_ID = CLIENT_ID;

  /* ── Bootstrap: runs automatically on page load ────── */
  async function init() {
    patchStorage();
    await pullOnce();
    subscribeSSE();
  }

  init();
})();
