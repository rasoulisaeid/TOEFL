/* ElevenLabs TTS module with IndexedDB caching for generated audio */
(function () {
  /* Default API key — overridable via Storage.set('elevenlabs:key', '...') */
  const DEFAULT_KEY = "7f3d792a118b0ce45551c3fa3e55ad13e66b53b0be88a6ecf4a09b2350712299";
  const MODEL_ID = "eleven_multilingual_v2";

  const DB_NAME = "PathwayAudio";
  const STORE_NAME = "audio";
  let _db = null;

  function getDB() {
    if (_db) return Promise.resolve(_db);
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
      req.onerror = (e) => reject(e.target.error);
    });
  }

  window.AudioDB = {
    async get(id) {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const r = tx.objectStore(STORE_NAME).get(id);
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(r.error);
      });
    },
    async set(id, val) {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const r = tx.objectStore(STORE_NAME).put(val, id);
        r.onsuccess = () => resolve();
        r.onerror = () => reject(r.error);
      });
    },
    async delete(id) {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const r = tx.objectStore(STORE_NAME).delete(id);
        r.onsuccess = () => resolve();
        r.onerror = () => reject(r.error);
      });
    }
  };

  function getKey() {
    return Storage.get("elevenlabs:key", DEFAULT_KEY);
  }
  function setKey(k) {
    Storage.set("elevenlabs:key", k);
  }

  /**
   * Generates audio for the given text+voice, caching the result by id.
   * Returns a Blob URL that can be set as <audio src="...">.
   */
  async function getOrCreate(id, text, voiceId, opts = {}) {
    const cached = await AudioDB.get(id);
    if (cached) {
      if (cached instanceof Blob) return URL.createObjectURL(cached);
      if (cached.byteLength) return URL.createObjectURL(new Blob([cached], { type: "audio/mpeg" }));
      // If it's a base64 string (from Firebase)
      if (typeof cached === "string" && cached.startsWith("data:audio")) {
        return cached;
      }
    }

    const key = getKey();
    if (!key) throw new Error("ElevenLabs API key not set");

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    const body = {
      text,
      model_id: opts.model || MODEL_ID,
      voice_settings: {
        stability: opts.stability != null ? opts.stability : 0.5,
        similarity_boost: opts.similarity != null ? opts.similarity : 0.75,
        style: opts.style != null ? opts.style : 0.0,
        use_speaker_boost: true,
      },
    };

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      throw new Error(`ElevenLabs ${resp.status}: ${errText.slice(0, 200)}`);
    }
    const blob = await resp.blob();
    try { await AudioDB.set(id, blob); } catch (e) { console.warn("audio cache set failed", e); }
    return URL.createObjectURL(blob);
  }

  async function clearCache(id) {
    if (id) return AudioDB.delete(id);
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).clear();
      tx.oncomplete = () => resolve();
    });
  }

  async function isCached(id) {
    const v = await AudioDB.get(id);
    return !!v;
  }

  window.AudioTTS = {
    getOrCreate,
    clearCache,
    isCached,
    getKey,
    setKey,
    DEFAULT_KEY,
    voices: {
      general:    "pVnrL6sighQX7hVz89cp",
      scientific: "DODLEQrClDo8wCz460ld",
      fashion:    "r4iCyrmUEMCbsi7eGtf8",
    },
  };
})();
