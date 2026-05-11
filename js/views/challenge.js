/* 100-Day Challenge — dashboard (10×10 grid) */
window.Views = window.Views || {};

window.Views.challenge = function (mount) {
  const { el } = UI;
  UI.clear(mount);

  const total = CHALLENGE100.totalDays || 100;
  const days = CHALLENGE100.days || [];

  // Derive stats
  let daysDone = 0;
  let avgProgress = 0;
  let counted = 0;
  days.forEach((d) => {
    const totalTasks = (d.speaking || []).length + (d.writing || []).length;
    const p = Challenge.dayProgress(d.day, totalTasks);
    avgProgress += p;
    counted += 1;
    if (p >= 0.99) daysDone += 1;
  });
  if (counted) avgProgress = avgProgress / counted;

  const streak = Challenge.getStreak().count;
  const xp = Challenge.getXP();
  const cardsCount = Challenge.getCards().length;
  const dueCount = Challenge.cardsDueToday().length;

  // ===== Hero =====
  const hero = el("div", { class: "hero-card challenge-hero" }, [
    el("div", { class: "hero-content" }, [
      el("div", { style: "font-size:13px;letter-spacing:.08em;text-transform:uppercase;font-weight:800;opacity:.85" }, "100-Day Challenge"),
      el("h1", { style: "margin:8px 0 6px" }, "Speak & write every single day"),
      el("div", { class: "muted", style: "color:rgba(255,255,255,.85); max-width:560px" },
        "Three speaking subjects (1 general, 2 academic) plus three writing tasks (grammar, vocab, free essay) — every day for 100 days. B2-C1."),
      el("div", { style: "margin-top:18px;display:flex;gap:10px;flex-wrap:wrap" }, [
        el("button", {
          class: "btn",
          style: "background:white;color:var(--primary-dark);border-color:rgba(0,0,0,.04);border-bottom-color:rgba(0,0,0,.08)",
          onclick: () => goCurrentChallengeDay(),
        }, "▶  Start today"),
        el("button", {
          class: "btn",
          style: "background:rgba(255,255,255,.16);color:white;border-color:rgba(255,255,255,.24);border-bottom-color:rgba(0,0,0,.18)",
          onclick: () => (location.hash = "#/c/leitner"),
        }, `📚  Words${dueCount ? " (" + dueCount + " due)" : ""}`),
      ]),
    ]),
    el("div", { class: "hero-stats" }, [
      el("div", { class: "hero-mini-stat" }, [
        el("div", { class: "label" }, "Days"),
        el("div", { class: "value" }, `${daysDone}/${total}`),
        el("div", { class: "hero-progress-bar" }, el("i", { style: `width:${(daysDone / total) * 100}%` })),
      ]),
      el("div", { class: "hero-mini-stat" }, [
        el("div", { class: "label" }, "Overall"),
        el("div", {
          class: "progress-circle",
          style: `background: conic-gradient(rgba(255,255,255,0.95) 0% ${UI.pct(avgProgress)}%, rgba(255,255,255,0.2) ${UI.pct(avgProgress)}% 100%)`,
        }, [el("span", null, `${UI.pct(avgProgress)}%`)]),
      ]),
      el("div", { class: "hero-mini-stat" }, [
        el("div", { class: "label" }, "Vocab"),
        el("div", { class: "value" }, cardsCount),
        el("div", { style: "font-size:10px;color:rgba(255,255,255,0.7)" }, dueCount ? `${dueCount} due today` : "—"),
      ]),
    ]),
  ]);
  mount.appendChild(hero);

  // Quick stat strip — independent XP/streak so this is visible inside the challenge
  const stats = el("div", { class: "challenge-stats" }, [
    el("div", { class: "cstat" }, [
      el("span", { class: "cstat-icon" }, "🔥"),
      el("div", null, [
        el("div", { class: "cstat-val" }, streak),
        el("div", { class: "cstat-lbl" }, "Day streak"),
      ]),
    ]),
    el("div", { class: "cstat" }, [
      el("span", { class: "cstat-icon" }, "⭐"),
      el("div", null, [
        el("div", { class: "cstat-val" }, xp.toLocaleString()),
        el("div", { class: "cstat-lbl" }, "Challenge XP"),
      ]),
    ]),
    el("div", { class: "cstat" }, [
      el("span", { class: "cstat-icon" }, "📚"),
      el("div", null, [
        el("div", { class: "cstat-val" }, cardsCount),
        el("div", { class: "cstat-lbl" }, "Words saved"),
      ]),
    ]),
  ]);
  mount.appendChild(stats);

  mount.appendChild(el("div", { class: "section-title" }, "All 100 days"));

  const grid = el("div", { class: "days-grid" });
  for (let n = 1; n <= total; n++) {
    const meta = days.find((d) => d.day === n);
    grid.appendChild(renderChallengeDayCard(n, meta));
  }
  mount.appendChild(grid);
};

function renderChallengeDayCard(n, meta) {
  const { el } = UI;
  const ready = !!meta;
  const totalTasks = meta ? (meta.speaking.length + meta.writing.length) : 6;
  const progress = ready ? Challenge.dayProgress(n, totalTasks) : 0;
  const status = progress >= 0.99 ? "done" : progress > 0 ? "active" : "";

  return el("div", {
    class: `day-card ${status} ${ready ? "" : "locked"}`,
    onclick: () => {
      if (ready) location.hash = `#/c/day/${n}`;
      else UI.toast("Day content coming soon");
    },
  }, [
    el("div", { class: "dc-num-row" }, [
      el("span", { class: "dc-num" }, `Day ${n}`),
      el("span", { class: "spacer" }),
      el("span", { class: "dc-state" }, progress >= 0.99 ? "✓" : (progress > 0 ? Math.round(progress * 100) + "%" : (ready ? "" : "🔒"))),
    ]),
    ready
      ? el("div", { class: "dc-theme" }, meta.title)
      : el("div", { class: "dc-theme muted" }, "Coming soon"),
    ready ? el("div", { class: "dc-bar" }, el("div", { style: `width:${UI.pct(progress)}%` })) : null,
  ]);
}

function goCurrentChallengeDay() {
  const next = (CHALLENGE100.days || []).find((d) => {
    const total = d.speaking.length + d.writing.length;
    return Challenge.dayProgress(d.day, total) < 0.99;
  });
  const day = next || (CHALLENGE100.days || [])[0];
  if (!day) {
    UI.toast("No challenge content yet");
    return;
  }
  location.hash = `#/c/day/${day.day}`;
}
