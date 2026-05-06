/* Day view */
window.Views = window.Views || {};
window.Views.day = function (mount, params) {
  const { el } = UI;
  const w = parseInt(params.w, 10);
  const d = parseInt(params.d, 10);
  const meta = PLAN.weeks[w - 1];
  const content = w === 1 ? WEEK1 : null;
  const dayContent = content && content.days[d - 1];
  const readingDay = w === 1 ? WEEK1_READING.days[d - 1] : null;
  const listeningDay = w === 1 ? WEEK1_LISTENING.days[d - 1] : null;
  const writingDay = w === 1 ? WEEK1_WRITING.days[d - 1] : null;
  if (!meta || !dayContent) { mount.innerHTML = "<div class='empty'>Day not found.</div>"; return; }

  UI.clear(mount);

  const head = el("div", { class: "page-head" }, [
    el("div", null, [
      el("div", { class: "breadcrumb" }, [
        el("a", { onclick: () => location.hash = "#/dashboard" }, "Dashboard"),
        " · ",
        el("a", { onclick: () => location.hash = "#/week/" + w }, `Week ${w}`),
        " · ",
        el("span", null, `Day ${d}`),
      ]),
      el("h1", null, dayContent.topic),
      el("div", { class: "muted", style: "margin-top:6px" }, dayContent.summary),
    ]),
  ]);
  mount.appendChild(head);
  mount.appendChild(slotContent(w, d, dayContent, readingDay, listeningDay, writingDay));
};

function slotContent(w, d, dayContent, readingDay, listeningDay, writingDay) {
  const { el } = UI;
  const wrap = el("div", null);

  const conv1 = dayContent.conversations.find((c) => c.slot === "together");
  const conv2 = dayContent.conversations.find((c) => c.slot === "solo");
  const story1 = dayContent.stories.find((s) => s.slot === "together");
  const story2 = dayContent.stories.find((s) => s.slot === "solo");

  // ---- Speaking
  wrap.appendChild(el("div", { class: "section-title" }, "Speaking · 60 min"));

  wrap.appendChild(el("div", { class: "skill-block sp" }, [
    el("div", { class: "head" }, [
      el("div", { class: "icon" }, "🎙️"),
      el("div", null, [
        el("h3", null, "Speaking"),
        el("div", { class: "meta" }, "60 minutes — 2 conversations + 2 image stories"),
      ]),
    ]),
    el("div", { class: "tasks" }, [
      conv1 ? taskRow(w, d, conv1.id, `Conversation 1: ${conv1.title}`, "≈ 15 min", () => location.hash = `#/week/${w}/day/${d}/speaking/together/conv`) : null,
      story1 ? taskRow(w, d, story1.id, `Image 1: ${story1.title}`, "≈ 15 min", () => location.hash = `#/week/${w}/day/${d}/story/together`) : null,
      conv2 ? taskRow(w, d, conv2.id, `Conversation 2: ${conv2.title}`, "≈ 15 min", () => location.hash = `#/week/${w}/day/${d}/speaking/solo/conv`) : null,
      story2 ? taskRow(w, d, story2.id, `Image 2: ${story2.title}`, "≈ 15 min", () => location.hash = `#/week/${w}/day/${d}/story/solo`) : null,
    ]),
  ]));

  // ---- Reading
  wrap.appendChild(el("div", { class: "section-title" }, "Reading · 30 min"));
    wrap.appendChild(el("div", { class: "skill-block rd" }, [
      el("div", { class: "head" }, [
        el("div", { class: "icon" }, "📖"),
        el("div", null, [
          el("h3", null, "Reading"),
          el("div", { class: "meta" }, `3 short texts — general · science · art & style`),
        ]),
        el("span", { class: "spacer" }),
        readingDay ? el("button", {
          class: "btn primary sm",
          onclick: () => location.hash = `#/week/${w}/day/${d}/reading`,
        }, "Open all →") : el("span", { class: "chip muted" }, "soon"),
      ]),
      readingDay ? el("div", { class: "tasks" }, readingDay.readings.map((r, i) =>
        taskRow(w, d, r.id, r.title, catLabelHelper(r.category), () => {
          sessionStorage.setItem(`rd:active:${w}:${d}`, i);
          location.hash = `#/week/${w}/day/${d}/reading`;
        })
      )) : null,
    ]));

    wrap.appendChild(el("div", { class: "section-title" }, "Listening · 30 min"));
    wrap.appendChild(el("div", { class: "skill-block li" }, [
      el("div", { class: "head" }, [
        el("div", { class: "icon" }, "🎧"),
        el("div", null, [
          el("h3", null, "Listening"),
          el("div", { class: "meta" }, "3 short audio clips voiced by ElevenLabs"),
        ]),
        el("span", { class: "spacer" }),
        listeningDay ? el("button", {
          class: "btn primary sm",
          onclick: () => location.hash = `#/week/${w}/day/${d}/listening`,
        }, "Open all →") : el("span", { class: "chip muted" }, "soon"),
      ]),
      listeningDay ? el("div", { class: "tasks" }, listeningDay.tasks.map((t, i) =>
        taskRow(w, d, t.id, t.title, catLabelHelper(t.category), () => {
          sessionStorage.setItem(`li:active:${w}:${d}`, i);
          location.hash = `#/week/${w}/day/${d}/listening`;
        })
      )) : null,
    ]));

    wrap.appendChild(el("div", { class: "section-title" }, "Writing · 20 min"));
    wrap.appendChild(el("div", { class: "skill-block wr" }, [
      el("div", { class: "head" }, [
        el("div", { class: "icon" }, "✍️"),
        el("div", null, [
          el("h3", null, "Writing"),
          el("div", { class: "meta" }, "Fill the blanks · Rebuild phrases · Guided writing"),
        ]),
        el("span", { class: "spacer" }),
        writingDay ? el("button", {
          class: "btn primary sm",
          onclick: () => location.hash = `#/week/${w}/day/${d}/writing`,
        }, "Open all →") : el("span", { class: "chip muted" }, "soon"),
      ]),
      writingDay ? el("div", { class: "tasks" }, writingDay.tasks.map((t, i) =>
        taskRow(w, d, t.id, t.title, writingTypeLabel(t), () => {
          sessionStorage.setItem(`wr:active:${w}:${d}`, i);
          location.hash = `#/week/${w}/day/${d}/writing`;
        })
      )) : null,
    ]));

    wrap.appendChild(el("div", { class: "section-title" }, "Vocabulary review · 10 min"));
    const card = el("div", { class: "skill-block" }, [
      el("div", { class: "head" }, [
        el("div", { class: "icon" }, "📚"),
        el("div", null, [
          el("h3", null, "Leitner review"),
          el("div", { class: "meta" }, "Quick spaced-repetition pass on due cards"),
        ]),
        el("span", { class: "spacer" }),
        el("button", { class: "btn primary sm", onclick: () => location.hash = "#/leitner" }, "Open Leitner →"),
      ]),
    ]);
    wrap.appendChild(card);

  // Self-rating + notes
  wrap.appendChild(el("div", { class: "section-title" }, "How was today?"));
  wrap.appendChild(buildRatingsCard(w, d));

  return wrap;
}

function taskRow(w, d, taskId, name, time, onClick) {
  const day = State.getDay(w, d);
  const done = !!(day.tasks[taskId] && day.tasks[taskId].done);
  const row = UI.el("div", { class: "task-row" + (done ? " done" : ""), onclick: onClick }, [
    UI.el("div", { class: "check" }, done ? "✓" : ""),
    UI.el("div", { class: "tname" }, name),
    UI.el("div", { class: "ttime" }, time),
  ]);
  return row;
}

function placeholderSkill(skClass, label, icon, time, msg, onClick) {
  return UI.el("div", { class: `skill-block ${skClass}` + (onClick ? "" : " locked"), onclick: onClick || null, style: onClick ? "cursor:pointer" : "" }, [
    UI.el("div", { class: "head" }, [
      UI.el("div", { class: "icon" }, icon),
      UI.el("div", null, [
        UI.el("h3", null, label),
        UI.el("div", { class: "meta" }, `${time}`),
      ]),
      UI.el("span", { class: "spacer" }),
      onClick ? null : UI.el("span", { class: "coming-soon-pill" }, "soon"),
    ]),
    UI.el("div", { class: "muted", style: "font-size:13px" }, msg || "Section reserved."),
  ]);
}

function catLabelHelper(c) {
  return c === "general" ? "🌍 General"
    : c === "scientific" ? "🔬 Science"
    : c === "fashion"    ? "🎨 Art & Style"
    : "";
}

function writingTypeLabel(t) {
  const ic = t.type === "cloze" ? "🧩" : t.type === "scramble" ? "🔀" : "✨";
  const lbl = t.type === "cloze" ? "Fill the blanks" : t.type === "scramble" ? "Rebuild phrases" : "Guided writing";
  return `${ic} ${lbl}`;
}

function buildRatingsCard(w, d) {
  const { el } = UI;
  const card = el("div", { class: "card" });
  const day = State.getDay(w, d);

  ["speaking"].forEach((sk) => {
    const cur = day.ratings[sk] || 0;
    const row = el("div", { class: "row", style: "margin-bottom:8px" }, [
      el("div", { style: "min-width:100px;text-transform:capitalize" }, sk + ":"),
      ratingBar(cur, (val) => {
        State.setRating(w, d, sk, val);
        UI.toast(`Speaking rated ${val}/10`);
      }),
    ]);
    card.appendChild(row);
  });

  const noteArea = el("textarea", { rows: 3, placeholder: "How did today feel? Anything tricky?", oninput: (e) => State.setNote(w, d, e.target.value) });
  noteArea.value = day.notes || "";
  card.appendChild(noteArea);
  return card;
}

function ratingBar(cur, onPick) {
  const wrap = UI.el("div", { class: "rating" });
  for (let i = 1; i <= 10; i++) {
    const b = UI.el("button", { class: i === cur ? "active" : "", text: i, onclick: () => {
      onPick(i);
      Array.from(wrap.children).forEach((c, idx) => c.classList.toggle("active", idx + 1 === i));
    }});
    wrap.appendChild(b);
  }
  return wrap;
}
