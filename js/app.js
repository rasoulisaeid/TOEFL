/* App router + init */
(function () {
  const view = document.getElementById("view");

  function parseHash() {
    const h = location.hash || "#/dashboard";
    const path = h.replace(/^#/, "");
    const parts = path.split("/").filter(Boolean);
    return parts;
  }

  function highlightNav() {
    const cur = location.hash || "#/dashboard";
    document.querySelectorAll(".nav-link").forEach((a) => {
      const target = a.getAttribute("data-link");
      let active = cur.startsWith(target);
      
      // If we are in a week or day content, highlight the 'Home' (Dashboard) tab
      if (target === "#/dashboard" && (cur.startsWith("#/week") || cur.startsWith("#/day"))) {
        active = true;
      }
      
      a.classList.toggle("active", active);
    });
    const streakEl = document.getElementById("streakBadge");
    const s = State.getStreak().count;
    if (streakEl) {
      const numEl = streakEl.querySelector(".streak-num");
      if (numEl) numEl.textContent = s;
      else streakEl.innerHTML = `<span class="streak-flame">🔥</span><span class="streak-num">${s}</span>`;
    }
  }

  function route() {
    const parts = parseHash(); // e.g. ["week","1","day","3","speaking","together","conv"]
    const head = parts[0] || "dashboard";

    try {
      window.scrollTo(0, 0);
      switch (head) {
        case "dashboard":
          Views.dashboard(view);
          break;
        case "plan":
          Views.plan(view);
          break;
        case "leitner":
          Views.leitner(view);
          break;
        case "week": {
          const w = parts[1];
          if (parts[2] === "day") {
            const d = parts[3];
            if (parts[4] === "speaking") {
              const slot = parts[5]; // together / solo
              Views.speaking(view, { w, d, slot });
            } else if (parts[4] === "story") {
              const slot = parts[5];
              Views.imageStory(view, { w, d, slot });
            } else if (parts[4] === "reading") {
              Views.reading(view, { w, d });
            } else if (parts[4] === "listening") {
              Views.listening(view, { w, d });
            } else if (parts[4] === "writing") {
              Views.writing(view, { w, d });
            } else {
              Views.day(view, { w, d });
            }
          } else {
            Views.week(view, { w });
          }
          break;
        }
        default:
          Views.placeholder(view, "Page not found");
      }
    } catch (e) {
      console.error(e);
      view.innerHTML = `<div class="card empty"><div style="font-weight:600;margin-bottom:6px">Something went wrong</div><div class="muted">${e.message || e}</div></div>`;
    }
    highlightNav();
  }

  // Click handlers for [data-link] elements
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-link]");
    if (!t) return;
    const link = t.getAttribute("data-link");
    if (link.startsWith("#")) {
      e.preventDefault();
      location.hash = link;
    }
  });

  // AI Settings Modal
  document.getElementById("openSettings")?.addEventListener("click", () => {
    UI.modal((m, close) => {
      const curKey = Storage.get("gemini:key", "");
      m.innerHTML = `
        <div class="word-modal-content">
          <h2>AI Settings</h2>
          <p class="muted" style="font-size:13px; margin-bottom:15px">
            Enter your Gemini API key here. It will be saved in your browser's local storage only.
          </p>
          <div class="col" style="gap:10px">
            <label style="font-size:12px; font-weight:700">Gemini API Key</label>
            <input type="password" id="geminiKeyInput" class="input" value="${curKey}" placeholder="AIza..." style="width:100%; padding:10px; border:1.5px solid var(--border); border-radius:8px">
          </div>
          <div class="modal-actions" style="margin-top:20px">
            <button class="btn" id="cancelSettings">Cancel</button>
            <button class="btn primary" id="saveSettings">Save Changes</button>
          </div>
        </div>
      `;
      m.querySelector("#cancelSettings").onclick = close;
      m.querySelector("#saveSettings").onclick = () => {
        const val = m.querySelector("#geminiKeyInput").value.trim();
        Storage.set("gemini:key", val);
        UI.toast("Settings saved! Refreshing...");
        close();
        setTimeout(() => location.reload(), 800);
      };
    });
  });

  window.addEventListener("hashchange", route);

  // Initial paint
  if (!location.hash) location.hash = "#/dashboard";
  else route();
  highlightNav();
})();
