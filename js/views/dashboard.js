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

  const head = el("div", { class: "page-head" }, [
    el("div", null, [
      el("div", { class: "breadcrumb muted" }, "Welcome back"),
      el("h1", null, "Your 25-week pathway"),
      el("div", { class: "muted", style: "margin-top:6px" }, "Mid-Intermediate → solid B2 → TOEFL-ready. One step at a time."),
    ]),
    el("div", { class: "actions" }, [
      el("button", { class: "btn", onclick: () => location.hash = "#/leitner" }, "Open Leitner"),
      el("button", { class: "btn primary", onclick: () => goCurrentWeek() }, "Start today →"),
    ]),
  ]);
  mount.appendChild(head);

  const stats = el("div", { class: "stat-row" }, [
    statCard("Streak", `${streak} 🔥`, "Daily ping"),
    statCard("Weeks complete", `${weeksDone}/25`, "B1 → B2 → TOEFL", "warm"),
    statCard("Avg. progress", `${pct(avgProgress)}%`, "Across all weeks", "cool"),
    statCard("Words in Leitner", `${cardsLearned}`, "Active vocabulary"),
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
