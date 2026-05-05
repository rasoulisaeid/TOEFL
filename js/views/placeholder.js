/* Generic placeholder for views not yet implemented */
window.Views = window.Views || {};
window.Views.placeholder = function (mount, label) {
  UI.clear(mount);
  mount.appendChild(UI.el("div", { class: "page-head" }, [
    UI.el("div", null, [
      UI.el("h1", null, label || "Coming soon"),
      UI.el("div", { class: "muted" }, "This section is reserved."),
    ]),
  ]));
  mount.appendChild(UI.el("div", { class: "card empty" }, [
    UI.el("div", { style: "font-size:18px;font-weight:600;margin-bottom:6px" }, "Not built yet"),
    UI.el("div", null, "We'll add this once Week 1 speaking content is calibrated."),
  ]));
};
