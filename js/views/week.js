/* Week view — 7 days + reflection */
window.Views = window.Views || {};
window.Views.week = function (mount, params) {
  const { el } = UI;
  const w = parseInt(params.w, 10);
  const meta = PLAN.weeks[w - 1];
  if (!meta) { mount.innerHTML = "<div class='empty'>Unknown week.</div>"; return; }

  UI.clear(mount);

  const content = w === 1 ? WEEK1 : null;

  const head = el("div", { class: "page-head" }, [
    el("div", null, [
      el("div", { class: "breadcrumb muted" }, [
        el("a", { onclick: () => location.hash = "#/dashboard" }, "Dashboard"),
        " · ",
        el("span", null, `Week ${w}`),
      ]),
      el("h1", null, meta.theme),
      el("div", { class: "muted", style: "margin-top:6px" }, content ? content.intro : meta.sub),
    ]),
    el("div", { class: "actions" }, [
      el("span", { class: "chip muted" }, meta.phase),
    ]),
  ]);
  mount.appendChild(head);

  if (!content) {
    mount.appendChild(el("div", { class: "card empty" }, [
      el("div", { style: "font-size:18px;font-weight:600;margin-bottom:6px" }, "Content coming soon"),
      el("div", null, "We're focusing on Week 1 first to calibrate her level. Future weeks will be generated based on her performance."),
    ]));
    return;
  }

  mount.appendChild(el("div", { class: "section-title" }, "7 days"));

  const grid = el("div", { class: "days-grid" });
  content.days.forEach((d) => grid.appendChild(dayCard(w, d)));
  mount.appendChild(grid);

  // Reflection note
  mount.appendChild(el("div", { class: "section-title" }, "Week reflection"));
  const wkState = State.getWeek(w);
  const refTextarea = el("textarea", { rows: 4, placeholder: "How did this week feel? What was hard? Any wins?", oninput: (e) => {
    wkState.reflection = e.target.value;
    State.setWeek(w, wkState);
  }});
  refTextarea.value = wkState.reflection || "";
  mount.appendChild(el("div", { class: "card" }, refTextarea));
};

function dayCard(w, d) {
  const day = State.getDay(w, d.day);
  const taskCount = Object.keys(day.tasks).filter(k => day.tasks[k].done).length;
  const totalTasks = (PLAN.weeks[w - 1] && PLAN.weeks[w - 1].tasksPerDay) || 13;
  const progress = Math.min(1, taskCount / totalTasks);
  return UI.el("div", { class: "day-card", onclick: () => location.hash = `#/week/${w}/day/${d.day}` }, [
    UI.el("div", { class: "dnum" }, `Day ${d.day}`),
    UI.el("div", { class: "dtopic" }, d.topic),
    UI.el("div", { class: "dsub" }, d.summary),
    UI.el("div", { class: "dprog" }, UI.el("div", { style: `width:${UI.pct(progress)}%` })),
    UI.el("div", { class: "muted", style: "font-size:12px" }, `${taskCount}/${totalTasks} tasks`),
  ]);
}
