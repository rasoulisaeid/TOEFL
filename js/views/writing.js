/* Writing view — 3 task types per day:
 *   • cloze    (general subject)    — gap-fill from a word pool
 *   • scramble (scientific subject) — rebuild scrambled phrases
 *   • guided   (fashion subject)    — 5-step writing refined by Gemini
 */
window.Views = window.Views || {};
window.Views.writing = function (mount, params) {
  const { el } = UI;
  const w = parseInt(params.w, 10);
  const d = parseInt(params.d, 10);
  const data = w === 1 ? WEEK1_WRITING : null;
  const dayContent = data && data.days[d - 1];
  if (!dayContent) { mount.innerHTML = "<div class='empty'>Writing content for this day isn't available yet.</div>"; return; }

  UI.clear(mount);

  let activeIdx = parseInt(sessionStorage.getItem(`wr:active:${w}:${d}`) || "0", 10);
  if (activeIdx < 0 || activeIdx >= dayContent.tasks.length) activeIdx = 0;

  const head = el("div", { class: "page-head" }, [
    el("div", null, [
      el("div", { class: "breadcrumb" }, [
        el("a", { onclick: () => location.hash = "#/dashboard" }, "Dashboard"), " · ",
        el("a", { onclick: () => location.hash = "#/week/" + w }, `Week ${w}`), " · ",
        el("a", { onclick: () => location.hash = `#/week/${w}/day/${d}` }, `Day ${d}`), " · ",
        el("span", null, "Writing"),
      ]),
      el("h1", null, "Writing practice"),
      el("div", { class: "muted", style: "margin-top:6px" }, "Three small tasks. Take it slow — the goal is to play with words, not to be perfect."),
    ]),
    el("div", { class: "actions" }, [
      el("button", { class: "btn", onclick: () => location.hash = `#/week/${w}/day/${d}` }, "Back"),
    ]),
  ]);
  mount.appendChild(head);

  const tabsRow = el("div", { class: "reading-tabs" });
  dayContent.tasks.forEach((t, i) => {
    const done = State.getDay(w, d).tasks[t.id] && State.getDay(w, d).tasks[t.id].done;
    const btn = el("button", {
      class: i === activeIdx ? "active" : "",
      onclick: () => { activeIdx = i; sessionStorage.setItem(`wr:active:${w}:${d}`, i); render(); },
    }, [
      el("span", { class: "cat-icon" }, typeIcon(t.type)),
      el("span", null, typeLabel(t.type)),
      el("span", { class: "muted", style: "font-size:11px;font-weight:700;margin-left:4px" }, "· " + catLabelW(t.category)),
      done ? el("span", { class: "cat-done", text: " ✓" }) : null,
    ]);
    tabsRow.appendChild(btn);
  });
  mount.appendChild(tabsRow);

  const body = el("div");
  mount.appendChild(body);

  function render() {
    UI.clear(body);
    Array.from(tabsRow.children).forEach((btn, i) => btn.classList.toggle("active", i === activeIdx));
    const task = dayContent.tasks[activeIdx];
    if (task.type === "cloze")    body.appendChild(buildCloze(w, d, task));
    else if (task.type === "scramble") body.appendChild(buildScramble(w, d, task));
    else if (task.type === "guided")   body.appendChild(buildGuided(w, d, task));
  }
  render();
};

function typeIcon(t) {
  return t === "cloze" ? "🧩" : t === "scramble" ? "🔀" : t === "guided" ? "✨" : "✍️";
}
function typeLabel(t) {
  return t === "cloze" ? "Fill the blanks" : t === "scramble" ? "Rebuild phrases" : t === "guided" ? "Guided writing" : t;
}
function catLabelW(c) {
  return c === "general" ? "General" : c === "scientific" ? "Science" : c === "fashion" ? "Art & Style" : c;
}

/* ===========================================================
   CLOZE
   =========================================================== */
function buildCloze(w, d, task) {
  const { el } = UI;
  const wrap = el("div", { class: "col" });

  // Header card
  wrap.appendChild(el("div", { class: "card" }, [
    el("div", { class: "row" }, [
      el("span", { class: `cat-pill ${task.category}` }, [el("span", null, "🌍"), " ", catLabelW(task.category)]),
      el("span", { class: "spacer" }),
      el("button", {
        class: "btn sm",
        onclick: () => {
          Storage.delete(`cloze:${task.id}`);
          UI.toast("Reset");
          location.reload();
        },
      }, "↺ Reset"),
    ]),
    el("h2", { style: "margin:10px 0 4px;font-size:24px" }, task.title),
    task.intro ? el("div", { class: "muted", style: "margin-bottom:6px" }, task.intro) : null,
  ]));

  // State: which word is in which blank (index → poolIndex), which pool words used
  const stateKey = `cloze:${task.id}`;
  const state = Storage.get(stateKey, {
    placed: {},   // blankIdx (string) -> poolIdx
    activeBlank: 0,
    checked: false,
  });
  function save() { Storage.set(stateKey, state); }

  // Build passage with blanks
  const passage = el("div", { class: "cloze-passage" });
  let blankCounter = 0;
  task.paragraphs.forEach((p) => {
    const para = el("p", null);
    const tokens = p.split(/(\{\d+\})/g);
    tokens.forEach((tok) => {
      const m = tok.match(/^\{(\d+)\}$/);
      if (m) {
        const idx = parseInt(m[1], 10);
        para.appendChild(makeBlank(idx));
      } else {
        para.appendChild(document.createTextNode(tok));
      }
    });
    passage.appendChild(para);
  });
  wrap.appendChild(passage);

  // Word pool
  const poolEl = el("div", { class: "word-pool" });
  task.pool.forEach((word, i) => {
    poolEl.appendChild(makePoolWord(word, i));
  });
  wrap.appendChild(el("div", { class: "section-title" }, "Word pool"));
  wrap.appendChild(poolEl);

  // Actions
  const actions = el("div", { class: "row", style: "margin-top:14px;justify-content:flex-end" });
  const checkBtn = el("button", { class: "btn primary", text: "Check answers", onclick: () => check() });
  const showBtn = el("button", { class: "btn", text: "Show answers", onclick: () => showAll() });
  actions.appendChild(showBtn);
  actions.appendChild(checkBtn);
  wrap.appendChild(actions);

  refreshAll();
  return wrap;

  // ============ helpers ============
  function makeBlank(idx) {
    const b = el("span", {
      class: "cloze-blank empty",
      onclick: () => {
        if (state.checked) return;
        // Toggle: if filled, remove and put back into pool
        if (state.placed[idx] != null) {
          delete state.placed[idx];
          state.activeBlank = idx;
          save();
          refreshAll();
          return;
        }
        state.activeBlank = idx;
        save();
        refreshAll();
      },
    }, "_____");
    b.dataset.blankIdx = idx;
    return b;
  }
  function makePoolWord(word, i) {
    const w = el("span", { class: "pool-word", text: word, onclick: () => {
      if (state.checked) return;
      // Already used?
      if (Object.values(state.placed).includes(i)) return;
      // Find target blank
      let target = state.activeBlank;
      // If active blank already filled, find first empty
      if (state.placed[target] != null) {
        target = nextEmptyBlank();
      }
      if (target == null) return;
      state.placed[target] = i;
      state.activeBlank = nextEmptyBlank();
      save();
      refreshAll();
    }});
    w.dataset.poolIdx = i;
    return w;
  }
  function nextEmptyBlank() {
    for (let i = 0; i < task.blanks.length; i++) {
      if (state.placed[i] == null) return i;
    }
    return null;
  }
  function refreshAll() {
    const blanks = passage.querySelectorAll(".cloze-blank");
    blanks.forEach((b) => {
      const idx = parseInt(b.dataset.blankIdx, 10);
      b.classList.remove("empty", "active", "correct", "wrong");
      const placed = state.placed[idx];
      if (placed != null) {
        b.textContent = task.pool[placed];
      } else {
        b.textContent = "_____";
        b.classList.add("empty");
      }
      if (!state.checked) {
        if (idx === state.activeBlank && state.placed[idx] == null) b.classList.add("active");
      } else {
        const correctWord = task.blanks[idx];
        if (placed != null && task.pool[placed].toLowerCase() === correctWord.toLowerCase()) {
          b.classList.add("correct");
        } else {
          b.classList.add("wrong");
        }
      }
    });
    Array.from(poolEl.children).forEach((p) => {
      const i = parseInt(p.dataset.poolIdx, 10);
      const used = Object.values(state.placed).includes(i);
      p.classList.toggle("used", used);
    });
  }
  function check() {
    state.checked = true;
    save();
    refreshAll();
    let correct = 0;
    for (let i = 0; i < task.blanks.length; i++) {
      const placed = state.placed[i];
      if (placed != null && task.pool[placed].toLowerCase() === task.blanks[i].toLowerCase()) correct++;
    }
    const total = task.blanks.length;
    const result = el("div", { class: "mcq-summary", style: "margin-top:18px" }, [
      el("div", { class: "big-score" }, `${correct}/${total}`),
      el("div", { class: "label" }, `${Math.round((correct/total)*100)}% correct`),
      el("div", { class: "msg" }, encourage(correct, total)),
      el("div", { class: "row", style: "justify-content:center;margin-top:14px;gap:10px" }, [
        el("button", { class: "btn", text: "Try again", onclick: () => {
          state.placed = {}; state.activeBlank = 0; state.checked = false; save();
          location.reload();
        }}),
        correct >= Math.ceil(total * 0.7)
          ? el("button", { class: "btn success", text: "Mark complete ✓", onclick: () => {
              State.setTaskDone(w, d, task.id, true); State.pingStreak();
              UI.toast("Writing complete ✓");
              setTimeout(() => location.hash = `#/week/${w}/day/${d}`, 500);
            }})
          : null,
      ]),
    ]);
    wrap.appendChild(result);
    if (correct >= Math.ceil(total * 0.7)) {
      State.setTaskDone(w, d, task.id, true);
    }
  }
  function showAll() {
    for (let i = 0; i < task.blanks.length; i++) {
      const correctWord = task.blanks[i];
      const poolIdx = task.pool.findIndex((p, j) => p.toLowerCase() === correctWord.toLowerCase() && !Object.values(state.placed).filter((x, k) => k !== i).includes(j));
      if (poolIdx !== -1) state.placed[i] = poolIdx;
    }
    state.checked = true;
    save();
    refreshAll();
  }
}

function encourage(correct, total) {
  const r = correct / total;
  if (r === 1) return "Perfect! 🌟 Every word landed where it belonged.";
  if (r >= 0.8) return "Beautiful — you read carefully and it shows.";
  if (r >= 0.6) return "Solid work — a couple of tricky ones, totally normal.";
  if (r >= 0.4) return "Good try — re-read it once more, you'll see them now.";
  return "Don't worry — these are gentle traps. You'll get them next pass.";
}

/* ===========================================================
   SCRAMBLE
   =========================================================== */
function buildScramble(w, d, task) {
  const { el } = UI;
  const wrap = el("div", { class: "col" });

  wrap.appendChild(el("div", { class: "card" }, [
    el("div", { class: "row" }, [
      el("span", { class: `cat-pill ${task.category}` }, [el("span", null, "🔬"), " ", catLabelW(task.category)]),
      el("span", { class: "spacer" }),
      el("button", { class: "btn sm", onclick: () => {
        Storage.delete(`scramble:${task.id}`);
        UI.toast("Reset");
        location.reload();
      }}, "↺ Reset"),
    ]),
    el("h2", { style: "margin:10px 0 4px;font-size:24px" }, task.title),
    task.intro ? el("div", { class: "muted", style: "margin-bottom:6px" }, task.intro) : null,
  ]));

  const stateKey = `scramble:${task.id}`;
  const state = Storage.get(stateKey, {
    chosen: task.phrases.map(() => []), // per-phrase: [chipIdx in scrambled order]
    solved: task.phrases.map(() => false),
  });
  function save() { Storage.set(stateKey, state); }

  const list = el("div", { class: "scramble-list" });

  task.phrases.forEach((phrase, idx) => list.appendChild(buildRow(phrase, idx)));
  wrap.appendChild(list);

  const actions = el("div", { class: "row", style: "margin-top:14px;justify-content:flex-end" });
  actions.appendChild(el("button", { class: "btn primary", text: "Mark complete ✓", onclick: () => {
    const allSolved = state.solved.every(Boolean);
    if (!allSolved) {
      UI.toast("Try to solve all phrases first 💪");
      return;
    }
    State.setTaskDone(w, d, task.id, true); State.pingStreak();
    UI.toast("Writing complete ✓");
    setTimeout(() => location.hash = `#/week/${w}/day/${d}`, 500);
  }}));
  wrap.appendChild(actions);

  return wrap;

  function buildRow(phrase, idx) {
    const row = el("div", { class: "scramble-row" + (state.solved[idx] ? " solved" : "") });

    const chipsBox = el("div", { class: "scramble-chips" });
    phrase.scrambled.forEach((word, i) => {
      const chip = el("span", { class: "scramble-chip", text: word, onclick: () => {
        if (state.solved[idx]) return;
        if (state.chosen[idx].includes(i)) return;
        state.chosen[idx] = state.chosen[idx].concat(i);
        save();
        refreshRow();
      }});
      chip.dataset.chipIdx = i;
      chipsBox.appendChild(chip);
    });

    const answer = el("div", { class: "scramble-answer" });

    const checkBtn = el("button", { class: "btn sm primary", text: "Check", onclick: () => check() });
    const clearBtn = el("button", { class: "btn sm", text: "Clear", onclick: () => {
      if (state.solved[idx]) return;
      state.chosen[idx] = [];
      save();
      refreshRow();
    }});

    row.appendChild(el("div", { class: "muted", style: "font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase" }, `Phrase ${idx + 1}`));
    row.appendChild(chipsBox);
    row.appendChild(answer);
    row.appendChild(el("div", { class: "row" }, [el("span", { class: "spacer" }), clearBtn, checkBtn]));

    refreshRow();

    return row;

    function refreshRow() {
      // Update chips (used)
      Array.from(chipsBox.children).forEach((chip) => {
        const i = parseInt(chip.dataset.chipIdx, 10);
        chip.classList.toggle("used", state.chosen[idx].includes(i));
      });
      // Update answer area
      UI.clear(answer);
      answer.classList.remove("correct", "wrong");
      state.chosen[idx].forEach((chipI) => {
        const tok = el("span", { class: "answer-token", text: phrase.scrambled[chipI], onclick: () => {
          if (state.solved[idx]) return;
          state.chosen[idx] = state.chosen[idx].filter((x) => x !== chipI);
          save();
          refreshRow();
        }});
        answer.appendChild(tok);
      });
      if (state.solved[idx]) {
        answer.classList.add("correct");
        row.classList.add("solved");
      }
    }

    function check() {
      const built = state.chosen[idx].map((i) => phrase.scrambled[i]).join(" ").trim();
      const target = phrase.correct.trim();
      if (built.toLowerCase() === target.toLowerCase()) {
        state.solved[idx] = true;
        save();
        UI.toast("✨ Nicely done");
        refreshRow();
      } else {
        answer.classList.add("wrong");
        UI.toast("Not quite — adjust and try again");
        setTimeout(() => answer.classList.remove("wrong"), 320);
      }
    }
  }
}

/* ===========================================================
   GUIDED (AI-assisted)
   =========================================================== */
function buildGuided(w, d, task) {
  const { el } = UI;
  const wrap = el("div", { class: "col" });

  wrap.appendChild(el("div", { class: "card" }, [
    el("div", { class: "row" }, [
      el("span", { class: `cat-pill ${task.category}` }, [el("span", null, "🎨"), " ", catLabelW(task.category)]),
      el("span", { class: "spacer" }),
      el("button", { class: "btn sm", onclick: () => {
        Storage.delete(`guided:${task.id}`);
        UI.toast("Reset");
        location.reload();
      }}, "↺ Reset"),
    ]),
    el("h2", { style: "margin:10px 0 4px;font-size:24px" }, task.title),
    el("div", { class: "muted", style: "margin-bottom:4px" }, task.brief),
    el("div", { style: "margin-top:6px;font-weight:800;font-size:14px;color:var(--primary-dark)" }, `Subject: ${task.subject}`),
  ]));

  const stateKey = `guided:${task.id}`;
  const state = Storage.get(stateKey, {
    steps: task.steps.map(() => ({ draft: "", refined: null, accepted: false })),
    activeStep: 0,
  });
  function save() { Storage.set(stateKey, state); }

  task.steps.forEach((step, i) => wrap.appendChild(buildStep(step, i)));

  // Final paragraph
  const finalCard = el("div", { class: "guided-final", style: "display:none" }, [
    el("h3", null, "Your paragraph 🌟"),
    el("div", { class: "final-text", id: "guided-final-text" }, ""),
    el("div", { class: "row", style: "margin-top:14px;justify-content:flex-end;gap:10px" }, [
      el("button", { class: "btn", text: "📋 Copy", onclick: () => {
        const t = document.getElementById("guided-final-text").textContent;
        navigator.clipboard.writeText(t).then(() => UI.toast("Copied"));
      }}),
      el("button", { class: "btn success", text: "Mark complete ✓", onclick: () => {
        State.setTaskDone(w, d, task.id, true);
        State.pingStreak();
        UI.toast("Writing complete ✓");
        setTimeout(() => location.hash = `#/week/${w}/day/${d}`, 500);
      }}),
    ]),
  ]);
  wrap.appendChild(finalCard);

  refreshAll();

  return wrap;

  function buildStep(step, i) {
    const cls = state.steps[i].accepted ? "guided-step done" : (i === state.activeStep ? "guided-step active" : (i < state.activeStep ? "guided-step" : "guided-step locked"));
    const stepWrap = el("div", { class: cls });
    stepWrap.dataset.stepIdx = i;

    stepWrap.appendChild(el("div", { class: "guided-step-head" }, [
      el("div", { class: "guided-step-num" }, state.steps[i].accepted ? "✓" : (i + 1)),
      el("div", { class: "guided-step-prompt" }, step.prompt),
    ]));

    // Hints
    if (step.hints && step.hints.length) {
      const hintsRow = el("div", { class: "hint-words" }, [
        el("span", { class: "hint-label" }, "Hints"),
        ...step.hints.map((h) => el("span", { class: "hint-word", text: h, onclick: () => {
          // Append to textarea
          const cur = ta.value.trim();
          ta.value = cur ? cur + (cur.endsWith(" ") ? "" : " ") + h : h;
          ta.focus();
          state.steps[i].draft = ta.value;
          save();
        }})),
      ]);
      stepWrap.appendChild(hintsRow);
    }

    const ta = el("textarea", { rows: 3, placeholder: "Type one or two short sentences..." });
    ta.value = state.steps[i].draft || "";
    ta.addEventListener("input", () => {
      state.steps[i].draft = ta.value;
      save();
    });
    stepWrap.appendChild(ta);

    const btnRow = el("div", { class: "row" }, [
      el("span", { class: "muted", style: "font-size:12px" }, "We'll gently polish, not rewrite."),
      el("span", { class: "spacer" }),
    ]);
    const refineBtn = el("button", { class: "btn primary", text: "✨ Refine with Gemini" });
    btnRow.appendChild(refineBtn);
    stepWrap.appendChild(btnRow);

    refineBtn.addEventListener("click", async () => {
      const text = ta.value.trim();
      if (!text) {
        UI.toast("Write a sentence first");
        return;
      }
      refineBtn.disabled = true;
      refineBtn.textContent = "Thinking…";
      const thinking = el("div", { class: "thinking" }, "Polishing your sentence");
      stepWrap.appendChild(thinking);
      const t = UI.toast("Polishing your sentence...", 0);
      try {
        const res = await Gemini.refineSentence({
          studentText: text,
          stepPrompt: step.prompt,
          hints: step.hints,
          level: "B1",
        });
        thinking.remove();
        t.dismiss();
        if (res && res.corrected) {
          state.steps[i].refined = res;
          save();
          showRefined(stepWrap, i);
        } else {
          UI.toast("Gemini didn't return a clean answer — try again.");
        }
      } catch (e) {
        thinking.remove();
        t.dismiss();
        console.error(e);
        UI.toast("Refine failed: " + (e.message || e));
      } finally {
        refineBtn.disabled = false;
        refineBtn.textContent = "✨ Refine again";
      }
    });

    return stepWrap;
  }

  function showRefined(stepWrap, i) {
    // Remove any previous refined block
    const prev = stepWrap.querySelector(".refined-block");
    if (prev) prev.remove();
    const prevActions = stepWrap.querySelector(".refined-actions");
    if (prevActions) prevActions.remove();

    const data = state.steps[i].refined;
    const block = el("div", { class: "refined-block" }, [
      el("div", { class: "label" }, "✨ Polished"),
      el("div", { class: "corrected", text: data.corrected }),
      data.feedback ? el("div", { class: "feedback", text: data.feedback }) : null,
      data.changes && data.changes.length ? el("ul", { class: "changes" }, data.changes.map((c) => el("li", null, c))) : null,
    ]);
    stepWrap.appendChild(block);

    const actions = el("div", { class: "row refined-actions", style: "margin-top:8px;justify-content:flex-end;gap:8px" }, [
      el("button", { class: "btn", text: "Edit and try again", onclick: () => {
        // Remove block; user can re-edit
        block.remove();
        actions.remove();
      }}),
      el("button", { class: "btn success", text: "Accept ✓", onclick: () => {
        state.steps[i].draft = data.corrected;
        state.steps[i].accepted = true;
        // Move on
        if (i === state.activeStep) state.activeStep = Math.min(task.steps.length, state.activeStep + 1);
        save();
        UI.toast("Saved! Onto the next step.");
        // Re-render this section
        const all = wrap.querySelectorAll(".guided-step");
        all.forEach((node) => node.remove());
        finalCard.remove();
        // Rebuild
        task.steps.forEach((step, idx) => wrap.insertBefore(buildStep(step, idx), finalCard));
        wrap.appendChild(finalCard);
        refreshAll();
      }}),
    ]);
    stepWrap.appendChild(actions);
  }

  function refreshAll() {
    // Show final card if all steps accepted
    const allDone = state.steps.every((s) => s.accepted);
    finalCard.style.display = allDone ? "" : "none";
    if (allDone) {
      const txt = state.steps.map((s) => s.draft.trim()).filter(Boolean).join(" ");
      const final = document.getElementById("guided-final-text");
      if (final) final.textContent = txt;
    }
    // Show prior refined blocks
    const stepNodes = wrap.querySelectorAll(".guided-step");
    stepNodes.forEach((node) => {
      const i = parseInt(node.dataset.stepIdx, 10);
      if (state.steps[i] && state.steps[i].refined && !state.steps[i].accepted) {
        showRefined(node, i);
      }
    });
  }
}
