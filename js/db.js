/* IndexedDB wrapper for large data (images) */
window.ImageDB = (function() {
  const DB_NAME = "PathwayImages";
  const STORE_NAME = "images";
  let db = null;

  async function getDB() {
    if (db) return db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = (e) => {
        db = e.target.result;
        resolve(db);
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }

  return {
    async get(id) {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const trans = db.transaction(STORE_NAME, "readonly");
        const store = trans.objectStore(STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    },
    async set(id, data) {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const trans = db.transaction(STORE_NAME, "readwrite");
        const store = trans.objectStore(STORE_NAME);
        const req = store.put(data, id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    },
    async delete(id) {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const trans = db.transaction(STORE_NAME, "readwrite");
        const store = trans.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    }
  };
})();
