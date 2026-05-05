/* Reusable MCQ (multiple choice question) component */
(function () {
  const CHEERS = [
    "Nice work! 🌟",
    "You're getting it! ✨",
    "Beautiful — keep going!",
    "Crisp answer 👏",
    "That's the one!",
    "Lovely. ⭐",
  ];
  const ENCOURAGE = [
    "No worries — let's understand it together.",
    "Tricky one. Read the explanation below.",
    "Almost! These ones train the eye.",
    "It's okay — this is exactly how we learn.",
  ];

  /**
   * Build a complete MCQ block.
   * @param {Object} opts
   * @param {Array}  opts.questions  list of { q, opts:[], correct, explanation }
   * @param {String} opts.storageKey persistent state key
   * @param {Function} opts.onComplete called with (score, total)
   * @returns {HTMLElement}
   */
  function build(opts) {
    const wrap = UI.el("div", { class: "col" });
    const state = Storage.get(opts.storageKey, { current: 0, answers: [], completed: false });
    const total = opts.questions.length;

    const card = UI.el("div", { class: "mcq-card" });
    wrap.appendChild(card);

    function save() { Storage.set(opts.storageKey, state); }

    function renderProgress() {
      const dots = UI.el("div", { class: "dots" });
      for (let i = 0; i < total; i++) {
        const span = UI.el("span", null);
        if (state.answers[i] != null) span.classList.add("done");
        else if (i === state.current) span.classList.add("cur");
        dots.appendChild(span);
      }
      return UI.el("div", { class: "mcq-progress" }, [
        UI.el("span", { class: "muted", style: "font-size:13px" }, `Question ${Math.min(state.current + 1, total)} of ${total}`),
        UI.el("button", { 
          class: "btn sm ghost", 
          style: "margin-left:8px;font-size:11px;padding:2px 6px;height:auto",
          onclick: () => {
            state.current = 0; state.answers = []; state.tries = {}; state.completed = false; save();
            renderQ();
          }
        }, "Reset"),
        UI.el("span", { class: "spacer" }),
        dots,
      ]);
    }

    function renderQ() {
      UI.clear(card);
      if (state.completed) return renderSummary();

      const q = opts.questions[state.current];
      card.appendChild(renderProgress());
      card.appendChild(UI.el("div", { class: "mcq-q" }, q.q));

      const optsWrap = UI.el("div", { class: "mcq-opts" });
      
      // state.answers[i] = the FIRST choice the user made
      // state.tries = { [qIdx]: [tried indices] }
      if (!state.tries) state.tries = {};
      const triedIndices = state.tries[state.current] || [];
      const correctlyAnswered = triedIndices.includes(q.correct);
      const letters = ["A", "B", "C", "D", "E"];

      q.opts.forEach((text, i) => {
        let cls = "mcq-opt";
        const wasTried = triedIndices.includes(i);
        
        if (correctlyAnswered) {
          cls += " locked";
          if (i === q.correct) cls += " correct";
          else if (wasTried) cls += " wrong";
        } else {
          if (wasTried) cls += " wrong locked";
        }

        const btn = UI.el("button", {
          class: cls,
          onclick: () => {
            if (correctlyAnswered || wasTried) return;
            
            // Record first attempt for scoring
            if (state.answers[state.current] == null) {
              state.answers[state.current] = i;
            }

            // Record this try
            if (!state.tries[state.current]) state.tries[state.current] = [];
            state.tries[state.current].push(i);
            
            save();
            renderQ();
          },
        }, [
          UI.el("span", { class: "letter" }, letters[i]),
          UI.el("span", null, text),
        ]);
        optsWrap.appendChild(btn);
      });
      card.appendChild(optsWrap);

      if (correctlyAnswered) {
        const firstTry = state.answers[state.current];
        const wasCorrectFirstTime = firstTry === q.correct;
        
        const cheerMsg = wasCorrectFirstTime
          ? CHEERS[Math.floor(Math.random() * CHEERS.length)]
          : "You got it! (after a few tries)";

        card.appendChild(UI.el("div", { class: "cheer" + (wasCorrectFirstTime ? "" : " warn") }, cheerMsg));
        card.appendChild(UI.el("div", { class: "mcq-explain" }, q.explanation));

        const nextLabel = state.current + 1 < total ? "Next question →" : "See your results →";
        card.appendChild(UI.el("div", { class: "row", style: "margin-top:8px" }, [
          UI.el("span", { class: "spacer" }),
          UI.el("button", {
            class: "btn primary",
            onclick: () => {
              if (state.current + 1 < total) {
                state.current += 1;
                save();
                renderQ();
              } else {
                state.completed = true;
                save();
                renderSummary();
                if (typeof opts.onComplete === "function") {
                  const score = state.answers.reduce((acc, a, i) => acc + (a === opts.questions[i].correct ? 1 : 0), 0);
                  opts.onComplete(score, total);
                }
              }
            },
          }, nextLabel),
        ]));
      } else if (triedIndices.length > 0) {
        // User tried but hasn't got it right yet
        card.appendChild(UI.el("div", { class: "cheer warn", style: "margin-top:10px" }, "Not quite — try another option!"));
      }
    }

    function renderSummary() {
      UI.clear(card);
      const score = state.answers.reduce((acc, a, i) => acc + (a === opts.questions[i].correct ? 1 : 0), 0);
      const pct = Math.round((score / total) * 100);
      let msg;
      if (pct === 100) msg = "Perfect! You crushed it on the first try. 🌟";
      else if (pct >= 67) msg = "Great work — solid understanding, even if a few took two tries.";
      else if (pct >= 34) msg = "Nice — you're building it. Keep pushing until they all feel easy.";
      else msg = "That's totally fine. You found all the right answers eventually — that's how we learn!";

      card.appendChild(UI.el("div", { class: "mcq-summary" }, [
        UI.el("div", { class: "big-score" }, `${score}/${total}`),
        UI.el("div", { class: "label" }, `First-attempt accuracy: ${pct}%`),
        UI.el("div", { class: "msg" }, msg),
        UI.el("div", { class: "row", style: "justify-content:center;margin-top:20px;gap:12px" }, [
          UI.el("button", {
            class: "btn primary",
            onclick: () => {
              state.current = 0; state.answers = []; state.tries = {}; state.completed = false; save();
              renderQ();
            },
          }, "Restart Quiz"),
        ]),
      ]));
    }

    renderQ();
    return wrap;
  }

  window.MCQ = { build };
})();
