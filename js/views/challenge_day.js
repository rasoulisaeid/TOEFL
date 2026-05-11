/* 100-Day Challenge — single day overview with 3 speaking + 3 writing tasks. */
window.Views = window.Views || {};

window.Views.challengeDay = function (mount, params) {
  const { el } = UI;
  UI.clear(mount);

  const dNum = parseInt(params.d, 10);
  const meta = (CHALLENGE100.days || []).find((x) => x.day === dNum);
  if (!meta) {
    mount.innerHTML = `<div class='card empty'>Day ${dNum} content not available yet.</div>`;
    return;
  }
  const dayState = Challenge.getDay(dNum);
  const totalTasks = meta.speaking.length + meta.writing.length;
  const progress = Challenge.dayProgress(dNum, totalTasks);

  // ===== Header =====
  mount.appendChild(el("div", { class: "page-head" }, [
    el("div", null, [
      el("div", { class: "breadcrumb" }, [
        el("a", { onclick: () => (location.hash = "#/c") }, "Challenge"),
        " · ",
        el("span", null, `Day ${dNum}`),
      ]),
      el("h1", null, `Day ${dNum} — ${meta.title}`),
      el("div", { class: "muted", style: "margin-top:6px;max-width:640px" }, meta.blurb || ""),
    ]),
    el("div", { class: "actions" }, [
      el("span", { class: "chip" }, `${Math.round(progress * 100)}% done`),
      el("button", { class: "btn", onclick: () => (location.hash = "#/c") }, "Back"),
    ]),
  ]));

  // ===== Speaking section =====
  mount.appendChild(el("div", { class: "section-title" }, "🎙 Speaking — three 5-minute talks"));
  const speakGrid = el("div", { class: "task-grid" });
  meta.speaking.forEach((sp, i) => {
    const done = dayState.tasks[sp.id] && dayState.tasks[sp.id].done;
    const toneLabel = sp.tone === "formal" ? "Formal · Academic" : "General · Conversational";
    speakGrid.appendChild(el("div", {
      class: "task-tile speaking" + (done ? " done" : ""),
      onclick: () => (location.hash = `#/c/day/${dNum}/speak/${i}`),
    }, [
      el("div", { class: "tt-top" }, [
        el("span", { class: `tt-pill ${sp.tone === "formal" ? "formal" : "general"}` }, toneLabel),
        el("span", { class: "spacer" }),
        done ? el("span", { class: "tt-check" }, "✓") : null,
      ]),
      el("div", { class: "tt-subject" }, sp.subject),
      el("div", { class: "tt-meta" }, [
        el("span", null, `${sp.minutes || 5} min`),
        el("span", { class: "dot-sep" }, "·"),
        el("span", null, `${(sp.vocab || []).length} words`),
        el("span", { class: "dot-sep" }, "·"),
        el("span", null, "Record → AI feedback"),
      ]),
    ]));
  });
  mount.appendChild(speakGrid);

  // ===== Writing section =====
  mount.appendChild(el("div", { class: "section-title", style: "margin-top:28px" }, "✍️ Writing — three tasks"));
  const writeGrid = el("div", { class: "task-grid" });
  meta.writing.forEach((wr, i) => {
    const done = dayState.tasks[wr.id] && dayState.tasks[wr.id].done;
    let label, icon, summary;
    if (wr.type === "grammar") {
      label = "Grammar"; icon = "📐"; summary = wr.topic;
    } else if (wr.type === "words") {
      label = "Vocabulary"; icon = "🧩"; summary = "10 to describe · 10 to name";
    } else if (wr.type === "essay") {
      label = "Free essay"; icon = "📝"; summary = `${wr.minWords}–${wr.maxWords} words`;
    } else {
      label = wr.type; icon = "•"; summary = "";
    }
    writeGrid.appendChild(el("div", {
      class: "task-tile writing" + (done ? " done" : ""),
      onclick: () => (location.hash = `#/c/day/${dNum}/write/${i}`),
    }, [
      el("div", { class: "tt-top" }, [
        el("span", { class: "tt-pill writing" }, icon + " " + label),
        el("span", { class: "spacer" }),
        done ? el("span", { class: "tt-check" }, "✓") : null,
      ]),
      el("div", { class: "tt-subject" }, wr.title || wr.subject || wr.topic),
      el("div", { class: "tt-meta" }, summary),
    ]));
  });
  mount.appendChild(writeGrid);
};
