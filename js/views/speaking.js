/* Speaking conversation view */
window.Views = window.Views || {};
window.Views.speaking = function (mount, params) {
  const { el } = UI;
  
  try {
    const w = parseInt(params.w, 10);
    const d = parseInt(params.d, 10);
    const slot = params.slot; // together / solo
    const content = w === 1 ? window.WEEK1 : null;
    const dayContent = content && content.days[d - 1];
    
    if (!dayContent) { 
      mount.innerHTML = "<div class='card empty'>Day content not found.</div>"; 
      return; 
    }

    const conv = dayContent.conversations.find((c) => c.slot === slot);
    if (!conv) { 
      mount.innerHTML = "<div class='card empty'>Conversation not found.</div>"; 
      return; 
    }

    UI.clear(mount);

    // ===== Helper Functions (Hoisted within try-catch) =====
    function dialogueBlock() {
      const wrap = el("div", { class: "dialogue" });
      (conv.dialogue || []).forEach((line) => {
        const whoName = (line.who === "A") ? (conv.roles && conv.roles[0]) : (conv.roles && conv.roles[1]);
        const lineEl = el("div", { class: `line ${line.who}` }, [
          el("div", { class: "who" }, whoName || line.who),
          el("div", { class: "what" }, line.line),
        ]);
        wrap.appendChild(lineEl);
      });
      return wrap;
    }

    function ratingForConv() {
      const k = "conv:" + conv.id + ":rating";
      const cur = Storage.get(k, 0);
      const bar = el("div", { class: "rating", style: "margin-top:10px" });
      for (let i = 1; i <= 10; i++) {
        const b = el("button", { class: i === cur ? "active" : "", text: i, onclick: () => {
          Storage.set(k, i);
          State.setRating(w, d, "speaking", i);
          Array.from(bar.children).forEach((c, idx) => c.classList.toggle("active", idx + 1 === i));
          UI.toast(`Rated ${i}/10`);
        }});
        bar.appendChild(b);
      }
      return bar;
    }

    function completeConversation() {
      State.setTaskDone(w, d, conv.id, true);
      State.pingStreak();
      UI.toast("Marked complete ✓");
      setTimeout(() => location.hash = `#/week/${w}/day/${d}`, 500);
    }

    // ===== Build Header =====
    const head = el("div", { class: "page-head" }, [
      el("div", null, [
        el("div", { class: "breadcrumb" }, [
          el("a", { onclick: () => location.hash = "#/dashboard" }, "Dashboard"),
          " · ",
          el("a", { onclick: () => location.hash = "#/week/" + w }, `Week ${w}`),
          " · ",
          el("a", { onclick: () => location.hash = `#/week/${w}/day/${d}` }, `Day ${d}`),
          " · ",
          el("span", null, `Speaking · ${slot}`),
        ]),
        el("h1", null, conv.title),
      ]),
      el("div", { class: "actions" }, [
        el("span", { class: `chip ${slot === "together" ? "" : "blue"}` }, slot === "together" ? "Together" : "Solo"),
        el("button", { class: "btn", onclick: () => exportConvPDF(conv, w, d) }, "📄 Export PDF"),
        el("button", { class: "btn", onclick: () => location.hash = `#/week/${w}/day/${d}` }, "Back"),
      ]),
    ]);
    mount.appendChild(head);

    const layout = el("div", { class: "speak-layout" });

    // LEFT: dialogue
    const left = el("div", { class: "col" });
    left.appendChild(el("div", { class: "card" }, [dialogueBlock()]));

    // RIGHT: vocab, rating, notes
    const right = el("div", { class: "col" });
    if (window.buildVocabCard) {
      right.appendChild(window.buildVocabCard(conv.vocab || [], w, d, "Vocabulary"));
    }

    // Rating
    right.appendChild(el("div", { class: "card" }, [
      el("div", { style: "font-weight:700;font-size:15px" }, "Rate this session"),
      el("div", { class: "muted", style: "font-size:12px;margin-top:4px" }, "1 = struggled · 10 = effortless"),
      ratingForConv(),
    ]));

    // Notes
    right.appendChild(el("div", { class: "card" }, [
      el("div", { style: "font-weight:700;font-size:15px;margin-bottom:8px" }, "Notes & new words"),
      el("textarea", { rows: 4, placeholder: "Anything tricky? Words that were new for her? Any aha moments?", id: "convNotes" }),
      el("div", { class: "row", style: "margin-top:10px" }, [
        el("button", { class: "btn", onclick: () => openAddWordModal(w, d) }, "+ Add a custom word"),
        el("span", { class: "spacer" }),
        el("button", { class: "btn primary", onclick: () => completeConversation() }, "Mark complete →"),
      ]),
    ]));

    layout.appendChild(left);
    layout.appendChild(right);
    mount.appendChild(layout);

    // Initial value for notes
    const convStateKey = `conv:${conv.id}:notes`;
    const savedNotes = Storage.get(convStateKey, "");
    const notesEl = document.getElementById("convNotes");
    if (notesEl) {
      notesEl.value = savedNotes;
      notesEl.addEventListener("input", (e) => {
        Storage.set(convStateKey, e.target.value);
      });
    }

  } catch (err) {
    console.error("Speaking view error:", err);
    mount.innerHTML = `<div class='card empty'><b style='color:red'>Error loading view:</b><div class='muted'>${err.message}</div></div>`;
  }
};

function openAddWordModal(w, d) {
  UI.modal((m, close) => {
    const wInput = UI.el("input", { placeholder: "word or phrase" });
    const pInput = UI.el("input", { placeholder: "part of speech (noun, verb, …)" });
    const mInput = UI.el("textarea", { rows: 2, placeholder: "meaning in simple English" });
    const eInput = UI.el("textarea", { rows: 2, placeholder: "example sentence (optional)" });
    m.appendChild(UI.el("h2", null, "Add a new word"));
    m.appendChild(UI.el("div", { class: "muted", style: "margin-bottom:12px" }, "It will start in Box 1 (review tomorrow)"));
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
          sourceWeek: w, sourceDay: d,
        });
        UI.toast(`"${word}" added`);
        close();
      }}),
    ]));
  });
}

function exportConvPDF(conv, w, d) {
  if (typeof PDF === "undefined") {
    UI.toast("PDF library not ready");
    return;
  }
  const node = PDF.buildConversationPDFNode(conv, w, d);
  document.body.appendChild(node);
  PDF.exportNode(node, `pathway-w${w}-d${d}-conv-${conv.slot}.pdf`).then(() => node.remove());
}
