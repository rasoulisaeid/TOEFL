/* 100-Day Challenge — writing task view (grammar / words / essay) */
window.Views = window.Views || {};

window.Views.challengeWrite = function (mount, params) {
  const { el } = UI;
  UI.clear(mount);

  const dNum = parseInt(params.d, 10);
  const wIdx = parseInt(params.i, 10);
  const meta = (CHALLENGE100.days || []).find((x) => x.day === dNum);
  if (!meta || !meta.writing[wIdx]) {
    mount.innerHTML = "<div class='card empty'>Writing task not found.</div>";
    return;
  }
  const task = meta.writing[wIdx];
  const labelMap = { grammar: "Grammar", words: "Vocabulary", essay: "Free essay" };

  // Header
  mount.appendChild(el("div", { class: "page-head" }, [
    el("div", null, [
      el("div", { class: "breadcrumb" }, [
        el("a", { onclick: () => (location.hash = "#/c") }, "Challenge"),
        " · ",
        el("a", { onclick: () => (location.hash = `#/c/day/${dNum}`) }, `Day ${dNum}`),
        " · ",
        el("span", null, labelMap[task.type] || "Writing"),
      ]),
      el("h1", null, task.title || task.topic || task.subject),
      task.level ? el("div", { style: "margin-top:6px" }, el("span", { class: "chip blue" }, task.level)) : null,
    ]),
    el("div", { class: "actions" }, [
      el("button", { class: "btn", onclick: () => (location.hash = `#/c/day/${dNum}`) }, "Back"),
    ]),
  ]));

  if (task.type === "grammar") mount.appendChild(buildGrammar(dNum, task));
  else if (task.type === "words") mount.appendChild(buildWords(dNum, task));
  else if (task.type === "essay") mount.appendChild(buildEssay(dNum, task));
};

/* ============================================================
   GRAMMAR — explanation + 10 interactive exercises
   ============================================================ */
function buildGrammar(dNum, task) {
  const { el } = UI;
  const wrap = el("div", { class: "col" });
  const stateKey = `c100:gr:${task.id}`;
  const state = Storage.get(stateKey, {
    answers: task.exercises.map(() => ({ value: "", checked: false, correct: false })),
    submitted: false,
  });
  const save = () => Storage.set(stateKey, state);

  // === Explanation card ===
  const explanationHtml = renderMarkdownish(task.explanation);
  wrap.appendChild(el("div", { class: "card grammar-explainer" }, [
    el("div", { class: "row" }, [
      el("span", { class: "chip" }, "📐 " + (task.topic || "Grammar")),
      el("span", { class: "spacer" }),
      el("button", {
        class: "btn sm",
        onclick: () => {
          if (!confirm("Reset answers for this grammar task?")) return;
          Storage.delete(stateKey);
          Views.challengeWrite(document.getElementById("view"), { d: dNum, i: getWriteIdx(task.id, dNum) });
        },
      }, "↺ Reset"),
    ]),
    el("h2", { style: "margin:10px 0 4px;font-size:22px" }, task.topic),
    el("div", { class: "grammar-body", html: explanationHtml }),
  ]));

  // === Exercises ===
  const exCard = el("div", { class: "card" }, [
    el("div", { style: "font-weight:800;font-size:15px" }, "Practice — " + task.exercises.length + " questions"),
    el("div", { class: "muted", style: "font-size:12px;margin-top:2px" }, "Pick the right option or fill the blank. Hit Check when you're done."),
  ]);
  wrap.appendChild(exCard);

  task.exercises.forEach((ex, i) => {
    const row = el("div", { class: "gr-ex" });
    row.appendChild(el("div", { class: "gr-q" }, [
      el("span", { class: "gr-num" }, (i + 1) + "."),
      el("span", null, ex.q),
    ]));

    if (ex.type === "mcq") {
      const opts = el("div", { class: "gr-opts" });
      ex.options.forEach((opt, j) => {
        const b = el("button", {
          class: "gr-opt" + (state.answers[i].value === j ? " selected" : ""),
          onclick: () => {
            if (state.submitted) return;
            state.answers[i].value = j;
            save();
            Array.from(opts.children).forEach((c, k) => c.classList.toggle("selected", k === j));
          },
        }, opt);
        opts.appendChild(b);
      });
      row.appendChild(opts);
    } else if (ex.type === "fill") {
      const input = el("input", {
        placeholder: "Type the answer…",
        value: state.answers[i].value || "",
        style: "width:100%;margin-top:6px",
      });
      input.addEventListener("input", () => {
        state.answers[i].value = input.value;
        save();
      });
      row.appendChild(input);
    }

    // Feedback area
    const fb = el("div", { class: "gr-fb" });
    row.appendChild(fb);
    if (state.submitted) renderExFeedback(fb, ex, state.answers[i]);

    exCard.appendChild(row);
  });

  // Actions
  const actions = el("div", { class: "row", style: "margin-top:14px;justify-content:flex-end;gap:10px" });
  const checkBtn = el("button", { class: "btn primary", text: "Check answers" });
  actions.appendChild(checkBtn);
  exCard.appendChild(actions);

  const summaryBox = el("div");
  exCard.appendChild(summaryBox);

  checkBtn.addEventListener("click", () => {
    let correct = 0;
    task.exercises.forEach((ex, i) => {
      const ans = state.answers[i];
      let isCorrect = false;
      if (ex.type === "mcq") {
        isCorrect = ans.value === ex.answer;
      } else if (ex.type === "fill") {
        const norm = (s) => String(s || "").trim().toLowerCase().replace(/[.,!?]+$/, "");
        const target = [ex.answer].concat(ex.accept || []).map(norm);
        isCorrect = !!ans.value && target.includes(norm(ans.value));
      }
      ans.checked = true;
      ans.correct = isCorrect;
      if (isCorrect) correct += 1;
    });
    state.submitted = true;
    save();
    // Refresh feedback
    Array.from(exCard.querySelectorAll(".gr-ex")).forEach((row, i) => {
      const fb = row.querySelector(".gr-fb");
      UI.clear(fb);
      renderExFeedback(fb, task.exercises[i], state.answers[i]);
    });

    UI.clear(summaryBox);
    summaryBox.appendChild(el("div", { class: "mcq-summary", style: "margin-top:18px" }, [
      el("div", { class: "big-score" }, correct + "/" + task.exercises.length),
      el("div", { class: "label" }, Math.round((correct / task.exercises.length) * 100) + "% correct"),
      el("div", { class: "msg" }, encourage(correct, task.exercises.length)),
      el("div", { class: "row", style: "justify-content:center;margin-top:14px;gap:10px" }, [
        el("button", { class: "btn", text: "Try again", onclick: () => {
          state.answers = task.exercises.map(() => ({ value: "", checked: false, correct: false }));
          state.submitted = false;
          save();
          Views.challengeWrite(document.getElementById("view"), { d: dNum, i: getWriteIdx(task.id, dNum) });
        }}),
        correct >= Math.ceil(task.exercises.length * 0.7)
          ? el("button", { class: "btn success", text: "Mark complete ✓", onclick: () => {
              Challenge.setTaskDone(dNum, task.id, true);
              Challenge.pingStreak();
              Challenge.addXP(6, "Grammar complete");
              UI.toast("Grammar complete ✓");
              setTimeout(() => (location.hash = `#/c/day/${dNum}`), 500);
            }})
          : null,
      ]),
    ]));
  });

  return wrap;
}

function renderExFeedback(fb, ex, ans) {
  const { el } = UI;
  if (!ans.checked) return;
  const correctStr = ex.type === "mcq" ? ex.options[ex.answer] : ex.answer;
  if (ans.correct) {
    fb.appendChild(el("div", { class: "gr-fb-ok" }, "✓ Correct" + (ex.why ? " — " + ex.why : "")));
  } else {
    fb.appendChild(el("div", { class: "gr-fb-bad" }, [
      el("div", null, "✗ Not quite"),
      el("div", { style: "margin-top:4px" }, [el("b", null, "Answer: "), correctStr]),
      ex.why ? el("div", { class: "muted", style: "margin-top:4px;font-size:13px" }, ex.why) : null,
    ]));
  }
}

/* ============================================================
   WORDS — Part A (describe 10) + Part B (name 10)
   ============================================================ */
function buildWords(dNum, task) {
  const { el } = UI;
  const wrap = el("div", { class: "col" });
  const stateKey = `c100:wd:${task.id}`;
  const state = Storage.get(stateKey, {
    partA: task.partA.words.map(() => ({ desc: "", result: null })),
    partB: task.partB.items.map(() => ({ answer: "", checked: false, correct: false })),
  });
  const save = () => Storage.set(stateKey, state);

  // === Header card ===
  wrap.appendChild(el("div", { class: "card" }, [
    el("div", { class: "row" }, [
      el("span", { class: "chip" }, "🧩 Vocabulary"),
      el("span", { class: "spacer" }),
      el("button", {
        class: "btn sm",
        onclick: () => {
          if (!confirm("Reset answers for this task?")) return;
          Storage.delete(stateKey);
          Views.challengeWrite(document.getElementById("view"), { d: dNum, i: getWriteIdx(task.id, dNum) });
        },
      }, "↺ Reset"),
    ]),
    el("h2", { style: "margin:10px 0 4px;font-size:22px" }, task.title),
  ]));

  // === Part A: describe in your own words ===
  const partA = el("div", { class: "card" });
  partA.appendChild(el("div", { style: "font-weight:800;font-size:15px" }, "Part A — describe in your own English"));
  partA.appendChild(el("div", { class: "muted", style: "font-size:12px;margin-top:2px" }, task.partA.intro));

  task.partA.words.forEach((entry, i) => {
    const row = el("div", { class: "word-row" });
    row.appendChild(el("div", { class: "word-row-head" }, [
      el("b", null, entry.word),
      el("span", { class: "muted", style: "margin-left:6px;font-size:12px" }, entry.pos),
      el("span", { class: "spacer" }),
      el("button", {
        class: "btn sm primary",
        text: "✨ Check",
        onclick: async (e) => {
          const ta = row.querySelector("textarea");
          const text = (ta.value || "").trim();
          if (!text || text.length < 6) {
            UI.toast("Write a description first (a sentence or two).");
            return;
          }
          const btn = e.target;
          btn.disabled = true;
          btn.textContent = "Checking…";
          try {
            const res = await Gemini.evaluateWordDescription({
              word: entry.word,
              pos: entry.pos,
              learnerDescription: text,
            });
            state.partA[i].desc = text;
            state.partA[i].result = res;
            save();
            renderPartAResult(row, res, entry);
          } catch (err) {
            UI.toast("Couldn't reach Gemini: " + (err.message || err));
          } finally {
            btn.disabled = false;
            btn.textContent = "✨ Check";
          }
        },
      }),
    ]));

    const ta = el("textarea", {
      rows: 3,
      placeholder: `Describe "${entry.word}" using other English words…`,
      style: "width:100%; min-height:80px; margin-top:8px"
    });
    ta.value = state.partA[i].desc || "";
    ta.addEventListener("input", () => {
      state.partA[i].desc = ta.value;
      save();
    });
    row.appendChild(ta);

    if (state.partA[i].result) {
      renderPartAResult(row, state.partA[i].result, entry);
    }

    partA.appendChild(row);
  });
  wrap.appendChild(partA);

  // === Part B: name the word ===
  const partB = el("div", { class: "card" });
  partB.appendChild(el("div", { style: "font-weight:800;font-size:15px" }, "Part B — guess the word"));
  partB.appendChild(el("div", { class: "muted", style: "font-size:12px;margin-top:2px" }, task.partB.intro));

  task.partB.items.forEach((it, i) => {
    const row = el("div", { class: "word-row" });
    row.appendChild(el("div", { class: "word-row-head" }, [
      el("span", { class: "muted", style: "font-weight:800" }, "Q" + (i + 1) + "."),
      el("span", null, it.description),
    ]));
    const input = el("input", { 
      placeholder: "Type the word…", 
      value: state.partB[i].answer || "",
      style: "width:100%"
    });
    input.addEventListener("input", () => {
      state.partB[i].answer = input.value;
      save();
    });
    const inputRow = el("div", { class: "row", style: "gap:8px;margin-top:6px" }, [input]);
    row.appendChild(inputRow);
    const fb = el("div", { class: "gr-fb" });
    row.appendChild(fb);
    if (state.partB[i].checked) renderPartBFeedback(fb, it, state.partB[i]);
    partB.appendChild(row);
  });

  const checkBBtn = el("button", { class: "btn primary", text: "Check Part B" });
  const summaryB = el("div");
  partB.appendChild(el("div", { class: "row", style: "margin-top:14px;justify-content:flex-end" }, [checkBBtn]));
  partB.appendChild(summaryB);

  checkBBtn.addEventListener("click", () => {
    const norm = (s) => String(s || "").trim().toLowerCase().replace(/[.,!?]+$/, "");
    let correct = 0;
    task.partB.items.forEach((it, i) => {
      const tgt = [it.answer].concat(it.accept || []).map(norm);
      const c = !!state.partB[i].answer && tgt.includes(norm(state.partB[i].answer));
      state.partB[i].checked = true;
      state.partB[i].correct = c;
      if (c) correct += 1;
    });
    save();
    // Refresh feedback per row
    const rows = partB.querySelectorAll(".word-row");
    rows.forEach((row, i) => {
      const fb = row.querySelector(".gr-fb");
      UI.clear(fb);
      renderPartBFeedback(fb, task.partB.items[i], state.partB[i]);
    });
    UI.clear(summaryB);
    summaryB.appendChild(el("div", { class: "mcq-summary", style: "margin-top:14px" }, [
      el("div", { class: "big-score" }, correct + "/" + task.partB.items.length),
      el("div", { class: "label" }, Math.round((correct / task.partB.items.length) * 100) + "% on Part B"),
      el("div", { class: "msg" }, encourage(correct, task.partB.items.length)),
    ]));
  });
  wrap.appendChild(partB);

  // === Bottom complete button ===
  wrap.appendChild(el("div", { class: "row", style: "margin-top:14px;justify-content:flex-end" }, [
    el("button", { class: "btn success", text: "Mark complete ✓", onclick: () => {
      Challenge.setTaskDone(dNum, task.id, true);
      Challenge.pingStreak();
      Challenge.addXP(8, "Vocabulary complete");
      UI.toast("Vocab complete ✓");
      setTimeout(() => (location.hash = `#/c/day/${dNum}`), 500);
    }}),
  ]));

  return wrap;
}

function renderPartAResult(row, res, entry) {
  const { el } = UI;
  // Remove previous result block
  const prev = row.querySelector(".pa-result");
  if (prev) prev.remove();
  const ok = res && res.accurate;
  const block = el("div", { class: "pa-result " + (ok ? "ok" : "warn") }, [
    el("div", { class: "row" }, [
      el("span", { class: "chip " + (ok ? "" : "blue") }, ok ? "✓ Accurate" : "△ Almost"),
      el("span", { class: "spacer" }),
      res.score != null ? el("span", { class: "muted", style: "font-weight:800" }, res.score + "/10") : null,
    ]),
    res.feedback ? el("div", { style: "margin-top:6px" }, res.feedback) : null,
    res.modelDefinition ? el("div", { class: "muted", style: "margin-top:6px;font-size:13px" }, [
      el("b", null, "Reference: "), res.modelDefinition
    ]) : null,
    el("div", { class: "row", style: "margin-top:8px;justify-content:flex-end" }, [
      el("button", { class: "btn sm", text: "+ Save to vocab", onclick: () => {
        Challenge.addCard({
          word: entry.word,
          meaning: res.modelDefinition || "",
          pos: entry.pos || "",
        });
        UI.toast(`"${entry.word}" saved`);
      }}),
    ]),
  ]);
  row.appendChild(block);
}

function renderPartBFeedback(fb, item, ans) {
  const { el } = UI;
  if (!ans.checked) return;
  if (ans.correct) {
    fb.appendChild(el("div", { class: "gr-fb-ok" }, "✓ Yes — " + item.answer));
  } else {
    fb.appendChild(el("div", { class: "gr-fb-bad" }, [
      el("div", null, "✗ Not quite"),
      el("div", { style: "margin-top:4px" }, [el("b", null, "Answer: "), item.answer]),
      item.accept && item.accept.length ? el("div", { class: "muted", style: "font-size:13px;margin-top:4px" },
        "Also accepted: " + item.accept.join(", ")) : null,
    ]));
  }
}

/* ============================================================
   ESSAY — write 120-150 words → Gemini analysis
   ============================================================ */
function buildEssay(dNum, task) {
  const { el } = UI;
  const wrap = el("div", { class: "col" });
  const stateKey = `c100:es:${task.id}`;
  const state = Storage.get(stateKey, { draft: "", analysis: null });
  const save = () => Storage.set(stateKey, state);

  wrap.appendChild(el("div", { class: "card" }, [
    el("div", { class: "row" }, [
      el("span", { class: "chip" }, "📝 Free essay"),
      el("span", { class: "spacer" }),
      el("span", { class: "chip muted" }, `${task.minWords}–${task.maxWords} words`),
      el("button", {
        class: "btn sm",
        style: "margin-left:8px",
        onclick: () => {
          if (!confirm("Reset this essay?")) return;
          Storage.delete(stateKey);
          Views.challengeWrite(document.getElementById("view"), { d: dNum, i: getWriteIdx(task.id, dNum) });
        },
      }, "↺ Reset"),
    ]),
    el("h2", { style: "margin:10px 0 6px;font-size:20px" }, "Prompt"),
    el("div", { style: "padding:12px 14px;background:var(--card-2);border-left:3px solid var(--primary);border-radius:8px" }, task.subject),
    task.tips && task.tips.length ? el("div", { style: "margin-top:14px" }, [
      el("div", { class: "muted", style: "font-weight:800;font-size:12px;letter-spacing:.06em;text-transform:uppercase" }, "Tips"),
      el("ul", { style: "padding-left:20px;margin:6px 0 0" }, task.tips.map((t) => el("li", { style: "margin-bottom:4px" }, t))),
    ]) : null,
  ]));

  // Writing card
  const writeCard = el("div", { class: "card" });
  const ta = el("textarea", { rows: 12, placeholder: "Write your essay here…" });
  ta.value = state.draft || "";
  const wcEl = el("span", { class: "muted", style: "font-size:13px" });
  function refreshWc() {
    const wc = (ta.value.trim().match(/\S+/g) || []).length;
    let cls = "muted";
    if (wc >= task.minWords && wc <= task.maxWords) cls = "ok";
    else if (wc > task.maxWords + 30 || (wc > 0 && wc < task.minWords - 30)) cls = "warn";
    wcEl.className = cls;
    wcEl.textContent = `${wc} words (target ${task.minWords}–${task.maxWords})`;
  }
  ta.addEventListener("input", () => { state.draft = ta.value; save(); refreshWc(); });
  writeCard.appendChild(el("div", { class: "row" }, [
    el("div", { style: "font-weight:800;font-size:15px" }, "Your draft"),
    el("span", { class: "spacer" }),
    wcEl,
  ]));
  writeCard.appendChild(ta);

  const analyzeBtn = el("button", { class: "btn primary", text: "✨ Get AI feedback" });
  writeCard.appendChild(el("div", { class: "row", style: "margin-top:12px;justify-content:flex-end" }, [analyzeBtn]));
  wrap.appendChild(writeCard);
  refreshWc();

  // Feedback container
  const fbContainer = el("div");
  wrap.appendChild(fbContainer);

  if (state.analysis) renderEssayAnalysis(state.analysis, fbContainer, () => completeEssay(dNum, task.id));

  analyzeBtn.addEventListener("click", async () => {
    const text = (ta.value || "").trim();
    if (text.length < 40) {
      UI.toast("Write a fuller draft first.");
      return;
    }
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "Analysing…";
    UI.clear(fbContainer);
    const thinking = el("div", { class: "thinking", style: "margin-top:14px" }, "Reading your essay…");
    fbContainer.appendChild(thinking);
    try {
      const res = await Gemini.analyzeEssay({
        essayText: text,
        subject: task.subject,
        minWords: task.minWords,
        maxWords: task.maxWords,
        level: task.level || "B2-C1",
      });
      thinking.remove();
      if (!res || res._raw) {
        fbContainer.appendChild(el("div", { class: "card empty" }, [
          el("div", { style: "color:var(--red);font-weight:700" }, "Couldn't parse Gemini's reply."),
          el("pre", { style: "white-space:pre-wrap;font-size:12px;margin-top:8px" }, (res && res._raw) || ""),
        ]));
      } else {
        state.analysis = res;
        save();
        renderEssayAnalysis(res, fbContainer, () => completeEssay(dNum, task.id));
      }
    } catch (e) {
      thinking.remove();
      UI.toast("Analysis failed: " + (e.message || e));
    } finally {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = "✨ Get AI feedback (again)";
    }
  });

  return wrap;
}

function completeEssay(dNum, taskId) {
  Challenge.setTaskDone(dNum, taskId, true);
  Challenge.pingStreak();
  Challenge.addXP(12, "Essay complete");
  UI.toast("Essay complete ✓");
  setTimeout(() => (location.hash = `#/c/day/${dNum}`), 500);
}

function renderEssayAnalysis(a, container, onComplete) {
  const { el } = UI;
  UI.clear(container);
  const scores = a.scores || {};
  const card = el("div", { class: "card feedback-card" });

  card.appendChild(el("div", { class: "fb-summary" }, [
    el("div", { class: "fb-label" }, "✨ Overall"),
    el("div", { style: "margin-top:6px" }, a.summary || ""),
  ]));

  const scoreRow = el("div", { class: "fb-scores" });
  [
    ["Task response", scores.taskResponse],
    ["Coherence",     scores.coherence],
    ["Grammar",       scores.grammar],
    ["Lexical range", scores.lexicalRange],
    ["Register",      scores.register],
  ].forEach(([lbl, v]) => {
    scoreRow.appendChild(el("div", { class: "fb-score" }, [
      el("div", { class: "fb-score-val" }, (v == null ? "—" : v) + (v == null ? "" : "/10")),
      el("div", { class: "fb-score-lbl" }, lbl),
    ]));
  });
  card.appendChild(scoreRow);

  if (Array.isArray(a.corrections) && a.corrections.length) {
    card.appendChild(el("div", { class: "fb-section-title" }, "📐 Corrections"));
    a.corrections.forEach((c) => {
      card.appendChild(el("div", { class: "fb-diff" }, [
        el("div", { class: "diff-bad" }, [el("span", { class: "diff-tag" }, "Wrote"), el("span", null, c.original || "")]),
        el("div", { class: "diff-good" }, [el("span", { class: "diff-tag" }, "Fix"), el("span", null, c.corrected || "")]),
        c.explanation ? el("div", { class: "muted", style: "font-size:13px;margin-top:4px" }, c.explanation) : null,
      ]));
    });
  }

  if (Array.isArray(a.lexicalUpgrades) && a.lexicalUpgrades.length) {
    card.appendChild(el("div", { class: "fb-section-title" }, "📚 Lexical upgrades"));
    a.lexicalUpgrades.forEach((u) => {
      card.appendChild(el("div", { class: "fb-diff" }, [
        el("div", { class: "diff-bad" }, [el("span", { class: "diff-tag" }, "Plain"), el("span", null, u.original || "")]),
        el("div", { class: "diff-good" }, [el("span", { class: "diff-tag" }, "Upgrade"), el("span", null, u.upgrade || "")]),
        u.why ? el("div", { class: "muted", style: "font-size:13px;margin-top:4px" }, u.why) : null,
      ]));
    });
  }

  if (a.structuralFeedback) {
    card.appendChild(el("div", { class: "fb-section-title" }, "🧱 Structure"));
    card.appendChild(el("div", null, a.structuralFeedback));
  }

  if (a.modelRewrite) {
    card.appendChild(el("div", { class: "fb-section-title" }, "🎯 Model rewrite of one sentence"));
    card.appendChild(el("div", { class: "diff-good", style: "padding:10px 12px;border-radius:10px;background:var(--green-soft)" }, a.modelRewrite));
  }

  if (Array.isArray(a.topPriorities) && a.topPriorities.length) {
    card.appendChild(el("div", { class: "fb-section-title" }, "⚡ Focus next time"));
    const ul = el("ul", { class: "fb-list priorities" });
    a.topPriorities.forEach((p) => ul.appendChild(el("li", null, p)));
    card.appendChild(ul);
  }

  card.appendChild(el("div", { class: "row", style: "margin-top:18px;justify-content:flex-end" }, [
    el("button", { class: "btn success", onclick: onComplete }, "Mark complete →"),
  ]));

  container.appendChild(card);
}

/* ============================================================
   Shared helpers
   ============================================================ */
function getWriteIdx(taskId, dNum) {
  const meta = (CHALLENGE100.days || []).find((x) => x.day === dNum);
  if (!meta) return 0;
  return Math.max(0, meta.writing.findIndex((t) => t.id === taskId));
}

function encourage(correct, total) {
  const r = correct / total;
  if (r === 1) return "Perfect run.";
  if (r >= 0.8) return "Strong work — small things to polish.";
  if (r >= 0.6) return "Solid — re-read the ones you missed.";
  if (r >= 0.4) return "Halfway there — give it another pass.";
  return "Worth re-reading the explanation, then trying again.";
}

/* Minimal markdown-ish renderer for grammar explanations.
 *  - **bold**
 *  - blank lines → paragraphs
 *  - lines starting with "  · " → indented bullets
 *  - lines starting with "  · " inside paragraphs stay grouped
 */
function renderMarkdownish(text) {
  const lines = String(text || "").split("\n");
  let html = "";
  let listOpen = false;
  for (const raw of lines) {
    const line = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    if (/^\s*·\s/.test(line) || /^\s+·\s/.test(line)) {
      if (!listOpen) { html += "<ul class='gr-bullets'>"; listOpen = true; }
      html += "<li>" + applyInline(line.replace(/^\s*·\s/, "")) + "</li>";
    } else if (!line.trim()) {
      if (listOpen) { html += "</ul>"; listOpen = false; }
      html += "<div class='gr-spacer'></div>";
    } else {
      if (listOpen) { html += "</ul>"; listOpen = false; }
      html += "<p>" + applyInline(line) + "</p>";
    }
  }
  if (listOpen) html += "</ul>";
  return html;
}
function applyInline(s) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/\*([^*]+)\*/g, "<i>$1</i>");
}
