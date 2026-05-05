/* Storage layer — wraps localStorage with namespacing + JSON */
(function () {
  const KEY = "pathway:v1";

  function readAll() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn("Storage read error", e);
      return {};
    }
  }
  function writeAll(obj) {
    try {
      localStorage.setItem(KEY, JSON.stringify(obj));
    } catch (e) {
      console.warn("Storage write error", e);
    }
  }

  window.Storage = {
    get(k, def) {
      const all = readAll();
      const val = all[k];
      return (val === undefined || val === null) ? def : val;
    },
    set(k, v) {
      const all = readAll();
      all[k] = v;
      writeAll(all);
    },
    update(k, fn, def) {
      const cur = this.get(k, def);
      const next = fn(cur);
      this.set(k, next);
      return next;
    },
    delete(k) {
      const all = readAll();
      delete all[k];
      writeAll(all);
    },
    clearAll() {
      localStorage.removeItem(KEY);
    },
    exportJSON() {
      return JSON.stringify(readAll(), null, 2);
    },
  };
})();
