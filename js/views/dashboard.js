/* Dashboard view — 25 week grid + stats */
window.Views = window.Views || {};
window.Views.dashboard = function (mount) {
  const { el, pct } = UI;
  UI.clear(mount);

  // === stats ===
  const streak = State.getStreak().count;
  let weeksDone = 0;
  let totalProgress = 0;
  PLAN.weeks.forEach((w) => {
    const p = State.weekProgress(w.i);
    totalProgress += p;
    if (p >= 0.95) weeksDone += 1;
  });
  const avgProgress = totalProgress / PLAN.weeks.length;
  const cardsLearned = State.getCards().length;

  const hero = el("div", { class: "hero-card" }, [
    el("div", { style: "position:relative;z-index:1" }, [
      el("div", { style: "font-size:13px;letter-spacing:.08em;text-transform:uppercase;font-weight:800;opacity:.85" }, "Welcome back ✨"),
      el("h1", { style: "margin:8px 0 6px" }, "Let's keep going"),
      el("div", { class: "sub" }, `${weeksDone}/25 weeks · ${pct(avgProgress)}% overall · ${cardsLearned} words in Leitner`),
      el("div", { style: "margin-top:18px;display:flex;gap:10px;flex-wrap:wrap" }, [
        el("button", {
          class: "btn",
          style: "background:white;color:var(--primary-dark);border-color:rgba(0,0,0,.04);border-bottom-color:rgba(0,0,0,.08)",
          onclick: () => goCurrentWeek(),
        }, "▶  Start today"),
        el("button", {
          class: "btn",
          style: "background:rgba(255,255,255,.16);color:white;border-color:rgba(255,255,255,.24);border-bottom-color:rgba(0,0,0,.18)",
          onclick: () => location.hash = "#/leitner",
        }, "📚  Review words"),
      ]),
    ]),
  ]);
  mount.appendChild(hero);

  const stats = el("div", { class: "stat-row" }, [
    statCard("Streak", `🔥 ${streak}`, ""),
    statCard("Weeks complete", `${weeksDone}/25`, ""),
    statCard("Overall", `${pct(avgProgress)}%`, ""),
    statCard("Vocabulary", `${cardsLearned}`, ""),
  ]);
  mount.appendChild(stats);

  mount.appendChild(el("div", { class: "section-title" }, "All weeks"));

  const grid = el("div", { class: "weeks-grid" });
  PLAN.weeks.forEach((w) => grid.appendChild(weekCard(w)));
  mount.appendChild(grid);
};

function statCard(label, value, sub, modifier) {
  return UI.el("div", { class: "stat" + (modifier ? " " + modifier : "") }, [
    UI.el("div", { class: "label" }, label),
    UI.el("div", { class: "value" }, value),
    UI.el("div", { class: "delta" }, sub),
  ]);
}

function weekCard(meta) {
  const progress = State.weekProgress(meta.i);
  const skills = State.skillProgress(meta.i);
  const status = progress >= 0.95 ? "done" : progress > 0 ? "active" : "";
  const card = UI.el("div", { class: `week-card ${status} ${meta.contentReady ? "" : "locked"}`, onclick: () => {
    if (meta.contentReady) location.hash = `#/week/${meta.i}`;
    else UI.toast("Week content coming soon");
  }}, [
    UI.el("div", { class: "wnum" }, [
      UI.el("span", { class: "dot" }),
      UI.el("span", null, `Week ${meta.i}`),
      UI.el("span", { class: "spacer" }),
      UI.el("span", { class: "muted" }, meta.phase.split(" ").slice(0,1)[0]),
    ]),
    UI.el("div", { class: "wtheme" }, meta.theme),
    UI.el("div", { class: "wsub" }, meta.sub),
    UI.el("div", { class: "wbar" }, UI.el("div", { style: `width:${UI.pct(progress)}%` })),
    UI.el("div", { class: "skills" }, [
      skillBar("sk-sp", skills.speaking),
      skillBar("sk-li", skills.listening),
      skillBar("sk-rd", skills.reading),
      skillBar("sk-wr", skills.writing),
    ]),
  ]);
  return card;
}

function skillBar(klass, ratio) {
  return UI.el("span", { class: klass }, [UI.el("i", { style: `width:${UI.pct(ratio)}%` })]);
}

function goCurrentWeek() {
  // jump to first week with content that isn't 100% done; default to W1
  const first = PLAN.weeks.find((w) => w.contentReady && State.weekProgress(w.i) < 0.95) || PLAN.weeks[0];
  location.hash = `#/week/${first.i}`;
}
