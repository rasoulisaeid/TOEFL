/* UI helpers — DOM creation, modals, toasts */
(function () {
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((k) => {
        const v = attrs[k];
        if (v == null || v === false) return;
        if (k === "class") node.className = v;
        else if (k === "style") node.setAttribute("style", v);
        else if (k === "html") node.innerHTML = v;
        else if (k === "text") node.textContent = v;
        else if (k.startsWith("on") && typeof v === "function") {
          node.addEventListener(k.slice(2).toLowerCase(), v);
        } else if (k.startsWith("data-") || k === "id" || k === "type" || k === "value" || k === "placeholder" || k === "title" || k === "href" || k === "for" || k === "name" || k === "min" || k === "max" || k === "step" || k === "rows" || k === "accept") {
          node.setAttribute(k, v);
        } else {
          node[k] = v;
        }
      });
    }
    if (children) appendChildren(node, children);
    return node;
  }
  function appendChildren(node, children) {
    if (children == null) return;
    if (Array.isArray(children)) {
      children.forEach((c) => appendChildren(node, c));
    } else if (children instanceof Node) {
      node.appendChild(children);
    } else {
      node.appendChild(document.createTextNode(String(children)));
    }
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function modal(content, opts = {}) {
    const root = document.getElementById("modalRoot");
    const overlay = el("div", { class: "modal-overlay", onclick: (e) => {
      if (e.target === overlay && opts.dismissOnBackdrop !== false) close();
    }});
    const m = el("div", { class: "modal" });
    if (typeof content === "function") content(m, close);
    else appendChildren(m, content);
    overlay.appendChild(m);
    root.appendChild(overlay);
    function close() { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }
    return { close, root: overlay, modal: m };
  }

  let toastTimer = null;
  function toast(msg, duration = 1800) {
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();
    
    const t = el("div", { class: "toast", text: msg });
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    
    if (toastTimer) clearTimeout(toastTimer);
    
    const dismiss = () => {
      t.classList.remove("show");
      setTimeout(() => t.remove(), 250);
    };

    if (duration > 0) {
      toastTimer = setTimeout(dismiss, duration);
    }
    
    return { dismiss };
  }

  function confirmDialog(title, message, onYes) {
    modal((m, close) => {
      appendChildren(m, [
        el("h2", { text: title }),
        el("p", { class: "muted", text: message }),
        el("div", { class: "modal-actions" }, [
          el("button", { class: "btn", text: "Cancel", onclick: close }),
          el("button", { class: "btn primary", text: "Yes", onclick: () => { close(); onYes && onYes(); } }),
        ]),
      ]);
    });
  }

  function pct(x) { return Math.round((x || 0) * 100); }

  function clickableText(text, onWordClick) {
    const container = el("div", { class: "clickable-container" });
    const tokens = text.split(/(\s+|[.,!?;:()"])/);
    tokens.forEach(t => {
      if (t.trim() && /^[a-zA-Z'-]+$/.test(t)) {
        container.appendChild(el("span", { 
          class: "clickable-word", 
          text: t,
          onclick: (e) => {
            e.stopPropagation();
            onWordClick && onWordClick(t.replace(/[^a-zA-Z'-]/g, ""));
          }
        }));
      } else {
        container.appendChild(document.createTextNode(t));
      }
    });
    return container;
  }

  window.UI = { el, clear, modal, toast, confirmDialog, pct, clickableText };

  /* Shared vocabulary components */
  window.buildVocabCard = function (vocabList, w, d, title) {
    const { el } = UI;
    const card = el("div", { class: "card" });
    card.appendChild(el("div", { class: "row" }, [
      el("div", { style: "font-weight:700;font-size:15px" }, title || "Vocabulary"),
      el("span", { class: "spacer" }),
      el("span", { class: "chip muted" }, vocabList.length + " words"),
    ]));
    card.appendChild(el("div", { class: "muted", style: "font-size:12px;margin-top:4px" }, "Tap the gray bar to reveal Persian. Use + to save into Leitner."));

    const list = el("div", { class: "kv-list", style: "margin-top:10px;grid-template-columns:1fr" });
    vocabList.forEach((v) => list.appendChild(buildVocabItem(v, w, d)));
    card.appendChild(list);
    return card;
  };

  window.buildVocabItem = function (v, w, d) {
    const { el } = UI;
    const fa = window.tFa ? tFa(v.w) : null;
    const inLeitner = State.getCards().some((c) => c.word.toLowerCase() === v.w.toLowerCase());

    const item = el("div", { class: "kv-item" + (fa ? " has-fa" : "") }, [
      el("div", null, [
        el("b", null, v.w),
        v.p ? el("span", { class: "muted", style: "margin-left:6px;font-size:12px" }, v.p) : null,
      ]),
      el("div", null, v.m),
      v.ex ? el("div", { class: "ex" }, "ex: " + v.ex) : null,
    ]);

    if (fa) {
      const faRow = el("div", { class: "fa-row" });
      const faText = el("div", {
        class: "fa-text hidden",
        title: "Tap to reveal Persian",
        onclick: function () {
          this.classList.toggle("hidden");
          this.textContent = this.classList.contains("hidden") ? "" : fa;
        },
      });
      faRow.appendChild(faText);
      item.appendChild(faRow);
    }

    // Build the action button once. On click we mutate it in place — no DOM rebuild,
    // no waiting for sync echo, truly instant.
    const btn = el("button", {
      class: "btn sm" + (inLeitner ? " ghost" : " primary"),
      text: inLeitner ? "✓ in Leitner" : "+ Leitner",
    });
    btn.disabled = inLeitner;
    btn.addEventListener("click", () => {
      if (btn.disabled || btn.dataset.added === "1") return;
      const persian = window.tFa ? tFa(v.w) : null;
      State.addCard({
        word: v.w,
        meaning: v.m + (persian ? `\n${persian}` : ""),
        example: v.ex || "",
        pos: v.p || "",
        sourceWeek: w, sourceDay: d,
      });
      // Update button in place — instant feedback regardless of sync.
      btn.dataset.added = "1";
      btn.disabled = true;
      btn.classList.remove("primary");
      btn.classList.add("ghost");
      btn.textContent = "✓ in Leitner";
      btn.style.transition = "transform .15s";
      btn.style.transform = "scale(1.08)";
      setTimeout(() => { btn.style.transform = ""; }, 160);
      UI.toast(`"${v.w}" added`);
    });

    item.appendChild(el("div", { class: "row", style: "margin-top:6px" }, [
      el("span", { class: "spacer" }),
      btn,
    ]));

    return item;
  };
})();
