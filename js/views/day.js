/* Day view — together (1h) + solo (2h) tabs */
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
  if (!meta || !dayContent) { mount.innerHTML = "<div class='empty'>Day not found.</div>"; return; }

  UI.clear(mount);

  let activeSlot = sessionStorage.getItem("daySlot:" + w + ":" + d) || "together";

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
    ]),
  ]);
  mount.appendChild(head);

  // Tabs
  const tabs = el("div", { class: "day-tabs" }, [
    el("button", { class: activeSlot === "together" ? "active" : "", onclick: () => switchTab("together") }, "Together · 1h"),
    el("button", { class: activeSlot === "solo" ? "active" : "", onclick: () => switchTab("solo") }, "Solo · 2h"),
  ]);
  mount.appendChild(tabs);

  const body = el("div", { id: "dayBody" });
  mount.appendChild(body);
  render();

  function switchTab(slot) {
    activeSlot = slot;
    sessionStorage.setItem("daySlot:" + w + ":" + d, slot);
    Array.from(tabs.children).forEach((b, i) => {
      b.classList.toggle("active", (i === 0 && slot === "together") || (i === 1 && slot === "solo"));
    });
    render();
  }

  function render() {
    UI.clear(body);
    body.appendChild(slotContent(w, d, dayContent, readingDay, listeningDay, activeSlot));
  }
};

function slotContent(w, d, dayContent, readingDay, listeningDay, slot) {
  const { el } = UI;
  const wrap = el("div", null);

  const conv = dayContent.conversations.find((c) => c.slot === slot);
  const story = dayContent.stories.find((s) => s.slot === slot);
  const speakingMin = 30;

  // ---- Speaking
  wrap.appendChild(el("div", { class: "section-title" }, slot === "together" ? "Speaking together · 30 min" : "Speaking solo · 30 min"));

  wrap.appendChild(el("div", { class: "skill-block sp" }, [
    el("div", { class: "head" }, [
      el("div", { class: "icon" }, "🎙️"),
      el("div", null, [
        el("h3", null, "Speaking"),
        el("div", { class: "meta" }, `${speakingMin} minutes — 1 conversation + 1 image story`),
      ]),
    ]),
    el("div", { class: "tasks" }, [
      taskRow(w, d, conv.id, `Conversation: ${conv.title}`, "≈ 15 min", () => location.hash = `#/week/${w}/day/${d}/speaking/${slot}/conv`),
      taskRow(w, d, story.id, `Image story: ${story.title}`, "≈ 15 min", () => location.hash = `#/week/${w}/day/${d}/story/${slot}`),
    ]),
  ]));

  // ---- Together: vocab/writing micro-task placeholder | Solo: full reading & listening
  if (slot === "together") {
    wrap.appendChild(el("div", { class: "section-title" }, "Together · vocabulary & writing · 30 min"));
    const tg = el("div", { class: "skill-grid" });
    tg.appendChild(placeholderSkill("v",  "Vocabulary review", "📚", "15 min", "Run through Leitner cards together — short and warm. (Leitner page is live.)", () => location.hash = "#/leitner"));
    tg.appendChild(placeholderSkill("wr", "Writing",            "✍️", "15 min", "Mini-writing prompt arrives soon."));
    wrap.appendChild(tg);
  } else {
    // SOLO ↓ Reading + Listening + (writing/vocab placeholders)
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
    wrap.appendChild(placeholderSkill("wr", "Writing", "✍️", "20 min", "Daily writing prompt — coming soon."));

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
  }

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
