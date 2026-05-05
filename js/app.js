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
      a.classList.toggle("active", cur.startsWith(target));
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

  window.addEventListener("hashchange", route);

  // Initial paint
  if (!location.hash) location.hash = "#/dashboard";
  else route();
  highlightNav();
})();
