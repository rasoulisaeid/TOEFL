/* Leitner box review view */
window.Views = window.Views || {};
window.Views.leitner = function (mount) {
  const { el } = UI;
  
  // Persistence for selection
  let selectedBoxes = JSON.parse(sessionStorage.getItem("leitner:filter") || "[]"); // empty = due only
  
  function render() {
    UI.clear(mount);
    const head = el("div", { class: "page-head" }, [
      el("div", null, [
        el("div", { class: "breadcrumb" }, [
          el("a", { onclick: () => location.hash = "#/dashboard" }, "Dashboard"), " · ",
          el("span", null, "Leitner"),
        ]),
        el("h1", null, "Leitner box"),
      ]),
      el("div", { class: "actions" }, [
        el("button", { class: "btn", onclick: () => openAddCardModal(render) }, "+ Add word"),
      ]),
    ]);
    mount.appendChild(head);

    // Filter bar
    const boxesData = State.cardsByBox();
    const intervals = State.LEITNER_INTERVALS;
    
    const filterRow = el("div", { class: "leitner-filter-row" });
    
    // "Due Today" pseudo-box
    const dueCount = State.cardsDueToday().length;
    const isDueOnly = selectedBoxes.length === 0;
    filterRow.appendChild(makeBoxFilter("Due", dueCount, isDueOnly, () => {
      selectedBoxes = [];
      sessionStorage.setItem("leitner:filter", "[]");
      render();
    }, "Today's due"));

    boxesData.forEach((cards, idx) => {
      const boxNum = idx + 1;
      const active = selectedBoxes.length === 1 && selectedBoxes[0] === boxNum;
      filterRow.appendChild(makeBoxFilter(boxNum, cards.length, active, () => {
        selectedBoxes = [boxNum];
        sessionStorage.setItem("leitner:filter", JSON.stringify(selectedBoxes));
        render();
      }, `every ${intervals[idx]}d`));
    });

    // "All" box
    const allActive = selectedBoxes.includes("all");
    filterRow.appendChild(makeBoxFilter("All", State.getCards().length, allActive, () => {
      selectedBoxes = ["all"];
      sessionStorage.setItem("leitner:filter", JSON.stringify(selectedBoxes));
      render();
    }, "Whole collection"));

    mount.appendChild(filterRow);

    // Determine review pool
    let pool = [];
    let title = "Nothing to review";
    
    if (selectedBoxes.length === 0) {
      pool = State.cardsDueToday();
      title = pool.length ? `Today's review · ${pool.length} due` : "Nothing due today";
    } else if (selectedBoxes.includes("all")) {
      pool = State.getCards();
      title = `Reviewing all cards · ${pool.length} total`;
    } else {
      pool = State.getCards().filter(c => selectedBoxes.includes(c.box));
      title = `Reviewing Boxes ${selectedBoxes.join(", ")} · ${pool.length} cards`;
    }

    mount.appendChild(el("div", { class: "section-title" }, title));

    if (pool.length) {
      const review = el("div", { id: "reviewArea" });
      mount.appendChild(review);
      let queue = pool.slice();
      let idx = 0;
      let revealed = false;

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
                el("button", { class: "btn ghost", onclick: () => skip() }, "Skip"),
              ]),
        ]));
      }
      function answer(correct) {
        State.answerCard(queue[idx].id, correct);
        State.addXP(1, "Vocab review");
        idx += 1; revealed = false;
        tick();
      }
      function skip() { idx += 1; revealed = false; tick(); }
      tick();
    }

    // All cards list
    mount.appendChild(el("div", { class: "section-title" }, `List view` ));
    const list = el("div", { class: "col" });
    State.getCards().slice().reverse().forEach((c) => list.appendChild(cardListItem(c, render)));
    if (!State.getCards().length) list.appendChild(el("div", { class: "empty" }, "No cards yet."));
    mount.appendChild(list);
  }

  function makeBoxFilter(label, count, active, onClick, sub) {
    const b = el("div", { 
      class: "box-filter-card" + (active ? " active" : ""),
      onclick: onClick
    }, [
      el("div", { class: "bf-label" }, label === "Due" ? "DUE" : (label === "All" ? "ALL" : `B${label}`)),
      el("div", { class: "bf-count" }, count),
      el("div", { class: "bf-sub" }, sub)
    ]);
    return b;
  }

  render();
};

function cardListItem(c, refresh) {
  const { el } = UI;
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
          const cards = State.getCards().filter(x => x.id !== c.id);
          State.setCards(cards);
          refresh();
        }
      }}, "🗑️")
    ])
  ]);
}

function openAddCardModal(onAdd) {
  UI.modal((m, close) => {
    const wInput = UI.el("input", { placeholder: "word or phrase" });
    const pInput = UI.el("input", { placeholder: "part of speech" });
    const mInput = UI.el("textarea", { rows: 2, placeholder: "meaning" });
    const eInput = UI.el("textarea", { rows: 2, placeholder: "example sentence" });
    m.appendChild(UI.el("h2", null, "Add a new word"));
    m.appendChild(UI.el("div", { class: "col" }, [
      UI.el("label", null, [UI.el("div", { class: "muted", style: "font-size:12px" }, "Word"), wInput]),
      UI.el("label", null, [UI.el("div", { class: "muted", style: "font-size:12px" }, "Part of speech"), pInput]),
      UI.el("label", null, [UI.el("div", { class: "muted", style: "font-size:12px" }, "Meaning"), mInput]),
      UI.el("label", null, [UI.el("div", { class: "muted", style: "font-size:12px" }, "Example"), eInput]),
    ]));
    m.appendChild(UI.el("div", { class: "modal-actions" }, [
      UI.el("button", { class: "btn", text: "Cancel", onclick: close }),
      UI.el("button", { class: "btn primary", text: "Add", onclick: () => {
        const word = wInput.value.trim();
        if (!word) return;
        State.addCard({
          word,
          meaning: mInput.value.trim(),
          example: eInput.value.trim(),
          pos: pInput.value.trim(),
        });
        UI.toast(`"${word}" added`);
        close();
        onAdd && onAdd();
      }}),
    ]));
  });
}
