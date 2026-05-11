/* 100-Day Challenge — independent Leitner box */
window.Views = window.Views || {};
window.Views.challengeLeitner = function (mount) {
  const { el } = UI;

  let selectedBoxes = JSON.parse(sessionStorage.getItem("c100:leitner:filter") || "[]");

  function render() {
    UI.clear(mount);
    mount.appendChild(el("div", { class: "page-head" }, [
      el("div", null, [
        el("div", { class: "breadcrumb" }, [
          el("a", { onclick: () => (location.hash = "#/c") }, "Challenge"),
          " · ",
          el("span", null, "Words"),
        ]),
        el("h1", null, "Challenge vocab"),
        el("div", { class: "muted", style: "margin-top:4px" }, "An independent Leitner box — separate from the main 25-week pathway."),
      ]),
      el("div", { class: "actions" }, [
        el("button", { class: "btn", onclick: () => openAddChallengeCardModal(render) }, "+ Add word"),
      ]),
    ]));

    const boxesData = Challenge.cardsByBox();
    const intervals = Challenge.LEITNER_INTERVALS;

    const filterRow = el("div", { class: "leitner-filter-row" });
    const dueCount = Challenge.cardsDueToday().length;
    const isDueOnly = selectedBoxes.length === 0;
    filterRow.appendChild(makeBoxFilter("Due", dueCount, isDueOnly, () => {
      selectedBoxes = [];
      sessionStorage.setItem("c100:leitner:filter", "[]");
      render();
    }, "Today's due"));
    boxesData.forEach((cards, idx) => {
      const boxNum = idx + 1;
      const active = selectedBoxes.length === 1 && selectedBoxes[0] === boxNum;
      filterRow.appendChild(makeBoxFilter(boxNum, cards.length, active, () => {
        selectedBoxes = [boxNum];
        sessionStorage.setItem("c100:leitner:filter", JSON.stringify(selectedBoxes));
        render();
      }, `every ${intervals[idx]}d`));
    });
    const allActive = selectedBoxes.includes("all");
    filterRow.appendChild(makeBoxFilter("All", Challenge.getCards().length, allActive, () => {
      selectedBoxes = ["all"];
      sessionStorage.setItem("c100:leitner:filter", JSON.stringify(selectedBoxes));
      render();
    }, "Whole collection"));
    mount.appendChild(filterRow);

    let pool = [];
    let title = "Nothing to review";
    if (selectedBoxes.length === 0) {
      pool = Challenge.cardsDueToday();
      title = pool.length ? `Today's review · ${pool.length} due` : "Nothing due today";
    } else if (selectedBoxes.includes("all")) {
      pool = Challenge.getCards();
      title = `All cards · ${pool.length} total`;
    } else {
      pool = Challenge.getCards().filter((c) => selectedBoxes.includes(c.box));
      title = `Box ${selectedBoxes.join(", ")} · ${pool.length} cards`;
    }
    mount.appendChild(el("div", { class: "section-title" }, title));

    if (pool.length) {
      const review = el("div");
      mount.appendChild(review);
      let queue = pool.slice();
      let idx = 0, revealed = false;
      function tick() {
        UI.clear(review);
        if (idx >= queue.length) {
          review.appendChild(el("div", { class: "review-card" }, [
            el("div", { style: "font-size:36px" }, "🎉"),
            el("div", { class: "word" }, "Session complete"),
            el("div", { class: "muted" }, `You finished ${queue.length} card${queue.length > 1 ? "s" : ""}.`),
            el("button", { class: "btn primary", style: "margin-top:20px", onclick: render }, "Back to start"),
          ]));
          return;
        }
        const c = queue[idx];
        review.appendChild(el("div", { class: "review-card" }, [
          el("div", { class: "muted" }, `Card ${idx + 1} of ${queue.length} · Box ${c.box}`),
          el("div", { class: "word" }, c.word),
          c.pos ? el("div", { class: "pos" }, c.pos) : null,
          revealed ? el("div", { class: "meaning" }, c.meaning || "(no meaning saved)") : null,
          revealed && c.example ? el("div", { class: "example" }, "ex: " + c.example) : null,
          revealed
            ? el("div", { class: "actions" }, [
                el("button", { class: "btn danger", onclick: () => answer(false) }, "✗ Forgot"),
                el("button", { class: "btn primary", onclick: () => answer(true) }, "✓ Got it"),
              ])
            : el("div", { class: "actions" }, [
                el("button", { class: "btn primary", onclick: () => { revealed = true; tick(); } }, "Show answer"),
                el("button", { class: "btn ghost", onclick: () => { idx += 1; revealed = false; tick(); } }, "Skip"),
              ]),
        ]));
      }
      function answer(correct) {
        Challenge.answerCard(queue[idx].id, correct);
        Challenge.addXP(1, "Vocab review");
        idx += 1; revealed = false;
        tick();
      }
      tick();
    }

    // List view
    mount.appendChild(el("div", { class: "section-title" }, "List view"));
    const list = el("div", { class: "col" });
    Challenge.getCards().slice().reverse().forEach((c) => list.appendChild(cardItem(c, render)));
    if (!Challenge.getCards().length) list.appendChild(el("div", { class: "empty" }, "No cards yet. Save words from the speaking tasks."));
    mount.appendChild(list);
  }

  function makeBoxFilter(label, count, active, onClick, sub) {
    return el("div", { class: "box-filter-card" + (active ? " active" : ""), onclick: onClick }, [
      el("div", { class: "bf-label" }, label === "Due" ? "DUE" : (label === "All" ? "ALL" : `B${label}`)),
      el("div", { class: "bf-count" }, count),
      el("div", { class: "bf-sub" }, sub),
    ]);
  }

  function cardItem(c, refresh) {
    return el("div", { class: "card compact row" }, [
      el("div", null, [
        el("div", null, [el("b", null, c.word), c.pos ? el("span", { class: "muted", style: "margin-left:6px;font-size:12px" }, c.pos) : null]),
        el("div", { class: "muted", style: "font-size:13px" }, c.meaning),
      ]),
      el("span", { class: "spacer" }),
      el("div", { class: "row", style: "gap:10px" }, [
        el("span", { class: "chip sm muted" }, `Box ${c.box}`),
        el("button", { class: "btn icon sm", onclick: () => {
          if (confirm(`Delete "${c.word}"?`)) {
            const cards = Challenge.getCards().filter((x) => x.id !== c.id);
            Challenge.setCards(cards);
            refresh();
          }
        }}, "🗑️"),
      ]),
    ]);
  }

  render();
};

function openAddChallengeCardModal(onAdd) {
  UI.modal((m, close) => {
    const w = UI.el("input", { placeholder: "word or phrase" });
    const p = UI.el("input", { placeholder: "part of speech" });
    const mm = UI.el("textarea", { rows: 2, placeholder: "meaning" });
    const e = UI.el("textarea", { rows: 2, placeholder: "example sentence" });
    m.appendChild(UI.el("h2", null, "Add a new word"));
    m.appendChild(UI.el("div", { class: "col" }, [
      UI.el("label", null, [UI.el("div", { class: "muted", style: "font-size:12px" }, "Word"), w]),
      UI.el("label", null, [UI.el("div", { class: "muted", style: "font-size:12px" }, "Part of speech"), p]),
      UI.el("label", null, [UI.el("div", { class: "muted", style: "font-size:12px" }, "Meaning"), mm]),
      UI.el("label", null, [UI.el("div", { class: "muted", style: "font-size:12px" }, "Example"), e]),
    ]));
    m.appendChild(UI.el("div", { class: "modal-actions" }, [
      UI.el("button", { class: "btn", text: "Cancel", onclick: close }),
      UI.el("button", { class: "btn primary", text: "Add", onclick: () => {
        const word = w.value.trim();
        if (!word) return;
        Challenge.addCard({ word, meaning: mm.value.trim(), example: e.value.trim(), pos: p.value.trim() });
        UI.toast(`"${word}" added`);
        close();
        onAdd && onAdd();
      }}),
    ]));
  });
}
