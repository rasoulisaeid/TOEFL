/* Plan overview view */
window.Views = window.Views || {};
window.Views.plan = function (mount) {
  UI.clear(mount);
  const { el } = UI;
  mount.appendChild(el("div", { class: "page-head" }, [
    el("div", null, [
      el("div", { class: "breadcrumb" }, [
        el("a", { onclick: () => location.hash = "#/dashboard" }, "Dashboard"), " · ",
        el("span", null, "Plan"),
      ]),
      el("h1", null, "The 25-week roadmap"),
      el("div", { class: "muted", style: "margin-top:6px" }, `${PLAN.weeklyHours} hours per week — 1h together + 2h solo, every day. Mid-Intermediate → solid B2 → TOEFL.`),
    ]),
  ]));

  const phases = {};
  PLAN.weeks.forEach((w) => {
    phases[w.phase] = phases[w.phase] || [];
    phases[w.phase].push(w);
  });

  Object.keys(phases).forEach((phase) => {
    mount.appendChild(el("div", { class: "section-title" }, phase));
    const list = el("div", { class: "col" });
    phases[phase].forEach((w) => {
      list.appendChild(el("div", { class: "card compact row" }, [
        el("span", { class: "chip" }, "W" + w.i),
        el("div", null, [
          el("div", { style: "font-weight:600" }, w.theme),
          el("div", { class: "muted", style: "font-size:13px" }, w.sub),
        ]),
        el("span", { class: "spacer" }),
        w.contentReady
          ? el("button", { class: "btn sm primary", onclick: () => location.hash = "#/week/" + w.i }, "Open")
          : el("span", { class: "chip muted" }, "soon"),
      ]));
    });
    mount.appendChild(list);
  });
};
