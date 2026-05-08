/* App router + init */
(function () {
  const view = document.getElementById("view");

  function parseHash() {
    const h = location.hash || "#/dashboard";
    const path = h.replace(/^#/, "");
    const parts = path.split("/").filter(Boolean);
    return parts;
  }

  window.updateSidebarXP = function (val) {
    const xpEl = document.getElementById("xpNum");
    if (xpEl) xpEl.textContent = val.toLocaleString();
  };

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
    
    // Streak update
    const streakEl = document.getElementById("streakBadge");
    const s = State.getStreak().count;
    if (streakEl) {
      const numEl = streakEl.querySelector(".streak-num");
      if (numEl) numEl.textContent = s;
    }

    // XP update
    updateSidebarXP(State.getXP());
  }

  let lastHash = "";
  function route() {
    const curHash = location.hash || "#/dashboard";
    const isNewPage = curHash !== lastHash;
    const oldScroll = window.scrollY;
    lastHash = curHash;

    const parts = parseHash(); 
    const head = parts[0] || "dashboard";

    try {
      if (isNewPage) window.scrollTo(0, 0);
      
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

      if (!isNewPage) {
        requestAnimationFrame(() => window.scrollTo(0, oldScroll));
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

  // AI Settings Status Logic
  function updateAIStatus() {
    const icon = document.getElementById("aiStatusIcon");
    if (!icon) return;
    const curKey = localStorage.getItem("gemini:key") || "";
    const isSet = curKey && curKey.length > 10;
    
    if (isSet) {
      icon.textContent = "check_circle";
      icon.style.color = "var(--green)";
      icon.title = "Gemini API Connected";
    } else {
      icon.textContent = "radio_button_unchecked";
      icon.style.color = "var(--text-soft)";
      icon.title = "Gemini API Disconnected";
    }
  }

  const VocabularyReminder = {
    ADVICE: [
      "Reviewing words at the right time is the secret to long-term memory.",
      "A quick 5-minute review now saves hours of re-learning later.",
      "Consistency beats intensity. Keep your word boxes moving!",
      "Every word you review today is one step closer to TOEFL fluency.",
      "Don't let your hard-earned words fade away. Quick check-in?"
    ],
    check(isReload = false) {
      const due = State.getDueCount();
      if (due === 0) {
        this.renderSidebar(0);
        return;
      }

      const now = new Date();
      const hour = now.getHours();
      const lastShownHour = parseInt(localStorage.getItem("vrm:lastHour") || "-1", 10);
      
      let shouldShow = isReload;
      
      // Show on every 3rd hour (0, 3, 6, 9, 12, 15, 18, 21)
      if (hour % 3 === 0 && hour !== lastShownHour) {
        shouldShow = true;
        localStorage.setItem("vrm:lastHour", hour);
      }

      if (shouldShow) {
        this.showModal(due);
      }
      this.renderSidebar(due);
    },
    startTimer() {
      // Check every minute for the "3rd hour" trigger
      setInterval(() => this.check(false), 60000);
    },
    showModal(due) {
      // Don't show if another modal is already open
      if (document.querySelector(".modal-overlay")) return;
      
      UI.modal((m, close) => {
        const advice = this.ADVICE[Math.floor(Math.random() * this.ADVICE.length)];
        m.innerHTML = `
          <div class="vocab-reminder-modal">
            <span class="vrm-icon">🚀</span>
            <div class="vrm-title">Ready for a boost?</div>
            <p class="muted" style="font-size:16px">You have <b>${due}</b> words due for review!</p>
            <div class="vrm-advice">${advice}</div>
            <div class="modal-actions" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:24px">
              <button class="btn" id="vrmDismiss">Maybe later</button>
              <button class="btn primary" id="vrmGo">Review Now</button>
            </div>
          </div>
        `;
        m.querySelector("#vrmDismiss").onclick = () => { close(); this.renderSidebar(due); };
        m.querySelector("#vrmGo").onclick = () => { close(); location.hash = "#/leitner"; };
      });
    },
    renderSidebar(due) {
      const container = document.getElementById("vocabReminder");
      if (!container) return;
      UI.clear(container);
      if (due > 0) {
        const widget = UI.el("div", { class: "vocab-reminder-sidebar", onclick: () => location.hash = "#/leitner" }, [
          UI.el("div", { class: "vrs-head" }, [
            UI.el("span", { class: "vrs-icon" }, "🚀"),
            UI.el("span", { class: "vrs-text" }, "Quest")
          ]),
          UI.el("div", { class: "vrs-body" }, [
            UI.el("span", { class: "vrs-count-pill" }, due),
            UI.el("span", { class: "vrs-label" }, "Words")
          ])
        ]);
        container.appendChild(widget);
      }
    }
  };

  // AI Settings Modal
  document.getElementById("openSettings")?.addEventListener("click", () => {
    UI.modal((m, close) => {
      const curKey = localStorage.getItem("gemini:key") || "";
      const isSet = curKey && curKey.length > 10;
      const masked = isSet ? (curKey.slice(0, 4) + "..." + curKey.slice(-4)) : "Not set";
      
      m.innerHTML = `
        <div class="word-modal-content">
          <div class="row" style="justify-content:space-between; align-items:center; margin-bottom:15px">
            <h2 style="margin:0">Gemini API</h2>
            ${isSet ? '<span style="color:var(--green); font-size:12px; font-weight:700">● Connected</span>' : '<span style="color:var(--text-soft); font-size:12px">○ Disconnected</span>'}
          </div>
          
          <p class="muted" style="font-size:13px; margin-bottom:20px">
            Enter your API key from Google AI Studio. It is stored locally in this browser.
          </p>

          <div class="col" style="gap:12px">
            <div class="row" style="justify-content:space-between">
              <label style="font-size:12px; font-weight:700">Current Key</label>
              <span style="font-family:monospace; font-size:11px; color:var(--text-soft)">${masked}</span>
            </div>
            <input type="password" id="geminiKeyInput" class="input" value="${curKey}" placeholder="Paste new key (AIza...)" style="width:100%; padding:12px; border:1.5px solid var(--border); border-radius:10px; font-size:14px">
          </div>

          <div class="modal-actions" style="margin-top:25px; display:flex; gap:10px">
            <button class="btn" id="cancelSettings" style="flex:1">Cancel</button>
            <button class="btn primary" id="saveSettings" style="flex:2">Save & Refresh</button>
          </div>
        </div>
      `;
      const input = m.querySelector("#geminiKeyInput");
      const saveBtn = m.querySelector("#saveSettings");
      
      const doSave = () => {
        const val = input.value.trim();
        localStorage.setItem("gemini:key", val);
        saveBtn.textContent = "✓ Saved!";
        saveBtn.style.background = "var(--green)";
        UI.toast(val ? "Key saved! App refreshing..." : "Key cleared.");
        updateAIStatus();
        setTimeout(() => location.reload(), 600);
      };

      input.onkeydown = (e) => { if (e.key === "Enter") doSave(); };
      m.querySelector("#cancelSettings").onclick = close;
      saveBtn.onclick = doSave;
    });
  });

  updateAIStatus();

  window.addEventListener("hashchange", route);

  // Silent cross-user sync: when remote storage changes, soft-refresh the
  // view ONLY if the user isn't actively interacting. Skips re-render while
  // the user is typing, dragging, or has a modal open — which preserves
  // focus, in-progress drags, and modal state across remote updates.
  let pendingSync = false;
  function isUserInteracting() {
    const a = document.activeElement;
    if (a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA" || a.isContentEditable)) return true;
    if (document.querySelector(".scramble-chip.dragging, .answer-token.dragging")) return true;
    if (document.querySelector(".modal-overlay, .scene-modal")) return true;
    return false;
  }
  window.addEventListener("storage-synced", () => {
    if (isUserInteracting()) {
      // Defer — we'll re-check when interaction ends
      pendingSync = true;
      return;
    }
    route();
  });
  // Catch the moment interaction ends to flush a deferred re-render
  ["focusout", "dragend", "mouseup"].forEach((ev) => {
    document.addEventListener(ev, () => {
      if (!pendingSync) return;
      // Wait a tick so the DOM settles after the interaction
      setTimeout(() => {
        if (pendingSync && !isUserInteracting()) {
          pendingSync = false;
          route();
        }
      }, 50);
    });
  });

  // Initial paint
  if (!location.hash) location.hash = "#/dashboard";
  else route();
  highlightNav();
  VocabularyReminder.check(true);
  VocabularyReminder.startTimer();
})();
