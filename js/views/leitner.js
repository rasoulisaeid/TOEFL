/* Leitner box review view */
window.Views = window.Views || {};
window.Views.leitner = function (mount) {
  const { el } = UI;
  UI.clear(mount);

  function render() {
    UI.clear(mount);
    const head = el("div", { class: "page-head" }, [
      el("div", null, [
        el("div", { class: "breadcrumb" }, [
          el("a", { onclick: () => location.hash = "#/dashboard" }, "Dashboard"), " · ",
          el("span", null, "Leitner"),
        ]),
        el("h1", null, "Leitner box"),
        el("div", { class: "muted", style: "margin-top:6px" }, "Spaced repetition for active vocabulary. Box 1 → daily, Box 5 → monthly."),
      ]),
      el("div", { class: "actions" }, [
        el("button", { class: "btn", onclick: () => openAddCardModal(render) }, "+ Add word"),
      ]),
    ]);
    mount.appendChild(head);

    // boxes
    const boxes = State.cardsByBox();
    const intervals = State.LEITNER_INTERVALS;
    const grid = el("div", { class: "leitner-grid" });
    boxes.forEach((cards, idx) => {
      grid.appendChild(el("div", { class: "box-card" }, [
        el("div", { class: "bn" }, `Box ${idx + 1}`),
        el("div", { class: "bcount" }, cards.length),
        el("div", { class: "bint" }, `every ${intervals[idx]} day${intervals[idx] > 1 ? "s" : ""}`),
      ]));
    });
    mount.appendChild(grid);

    const due = State.cardsDueToday();
    mount.appendChild(el("div", { class: "section-title" }, due.length ? `Today's review · ${due.length} due` : "Nothing due today"));

    if (due.length) {
      const review = el("div", { id: "reviewArea" });
      mount.appendChild(review);
      let queue = due.slice();
      let idx = 0;
      let revealed = false;

      function tick() {
        UI.clear(review);
        if (idx >= queue.length) {
          review.appendChild(el("div", { class: "review-card" }, [
            el("div", { style: "font-size:36px" }, "🎉"),
            el("div", { class: "word" }, "Done for today"),
            el("div", { class: "muted" }, `You reviewed ${queue.length} card${queue.length > 1 ? "s" : ""}.`),
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
                el("button", { class: "btn danger", onclick: () => answer(false) }, "✗ Forgot — back to Box 1"),
                el("button", { class: "btn primary", onclick: () => answer(true) }, "✓ Got it — promote"),
              ])
            : el("div", { class: "actions" }, [
                el("button", { class: "btn primary", onclick: () => { revealed = true; tick(); } }, "Show answer"),
                el("button", { class: "btn ghost", onclick: () => skip() }, "Skip"),
              ]),
        ]));
      }
      function answer(correct) {
        State.answerCard(c_id(), correct);
        idx += 1; revealed = false;
        tick();
      }
      function c_id() { return queue[idx].id; }
      function skip() { idx += 1; revealed = false; tick(); }
      tick();
    }

    // All cards
    mount.appendChild(el("div", { class: "section-title" }, `All cards (${State.getCards().length})`));
    const list = el("div", { class: "col" });
    State.getCards().slice().reverse().forEach((c) => list.appendChild(cardListItem(c, render)));
    if (!State.getCards().length) list.appendChild(el("div", { class: "empty" }, "No cards yet. Add words from speaking practice or click '+ Add word'."));
    mount.appendChild(list);
  }
  render();
};

function cardListItem(c, refresh) {
  return UI.el("div", { class: "card compact row" }, [
    UI.el("div", null, [
      UI.el("div", null, [UI.el("b", null, c.word), c.pos ? UI.el("span", { class: "muted", style: "margin-left:6px;font-size:12px" }, c.pos) : null]),
      UI.el("div", { class: "muted", style: "font-size:13px" }, c.meaning),
    ]),
    UI.el("span", { class: "spacer" }),
    UI.el("span", { class: "chip muted" }, `Box ${c.box}`),
    UI.el("span", { class: "chip muted" }, `due ${c.nextDue}`),
    UI.el("button", { class: "btn sm danger", onclick: () => {
      UI.confirmDialog("Delete card?", `Remove "${c.word}" from Leitner?`, () => {
        const cards = State.getCards().filter((x) => x.id !== c.id);
        State.setCards(cards);
        refresh();
      });
    }}, "Delete"),
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
