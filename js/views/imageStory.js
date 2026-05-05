/* Image story view — 8-panel grid splitter + per-scene description */
window.Views = window.Views || {};
window.Views.imageStory = function (mount, params) {
  const { el } = UI;
  const w = parseInt(params.w, 10);
  const d = parseInt(params.d, 10);
  const slot = params.slot;
  const content = w === 1 ? WEEK1 : null;
  const dayContent = content && content.days[d - 1];
  if (!dayContent) { mount.innerHTML = "<div class='empty'>Not found.</div>"; return; }
  const story = dayContent.stories.find((s) => s.slot === slot);
  if (!story) { mount.innerHTML = "<div class='empty'>Story not found.</div>"; return; }

  UI.clear(mount);

  let session = State.getStorySession(w, d, slot);
  let turn = sessionStorage.getItem("turn:" + story.id) || "her";
  let imageData = null;
  State.getStoryImage(w, d, slot).then(data => {
    if (data) {
      imageData = data;
      // Re-render only parts that need the image
      rerenderImageParts();
    }
  });

  const head = el("div", { class: "page-head" }, [
    el("div", null, [
      el("div", { class: "breadcrumb" }, [
        el("a", { onclick: () => location.hash = "#/dashboard" }, "Dashboard"),
        " · ",
        el("a", { onclick: () => location.hash = "#/week/" + w }, `Week ${w}`),
        " · ",
        el("a", { onclick: () => location.hash = `#/week/${w}/day/${d}` }, `Day ${d}`),
        " · ",
        el("span", null, `Image story · ${slot}`),
      ]),
      el("h1", null, story.title),
      el("div", { class: "muted", style: "margin-top:6px" }, "Generate the 8-panel grid in Gemini Nano Banana, paste it below, then describe each scene one by one."),
    ]),
    el("div", { class: "actions" }, [
      el("button", { class: "btn", onclick: () => location.hash = `#/week/${w}/day/${d}` }, "Back"),
    ]),
  ]);
  mount.appendChild(head);

  function exportStoryPDF() {
    if (!imageData) {
      UI.toast("Paste the image first");
      return;
    }
    const canvases = [];
    let pending = 8;
    for (let i = 0; i < 8; i++) {
      const cv = document.createElement("canvas");
      const img = new Image();
      img.onload = () => {
        const cols = 4, rows = 2;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const panelW = img.width / cols;
        const panelH = img.height / rows;
        cv.width = panelW;
        cv.height = panelH;
        const ctx = cv.getContext("2d");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, col * panelW, row * panelH, panelW, panelH, 0, 0, panelW, panelH);
        canvases[i] = cv;
        if (--pending === 0) {
          const node = PDF.buildStoryPDFNode(story, canvases);
          document.body.appendChild(node);
          PDF.exportNode(node, `pathway-w${w}-d${d}-story-${slot}.pdf`).then(() => node.remove());
        }
      };
      img.src = imageData;
    }
  }

  const layout = el("div", { class: "img-story-area" });

  // LEFT: prompt
  const left = el("div", { class: "col" });
  left.appendChild(promptCard());
  const pasteSection = el("div", null, pasteCard());
  left.appendChild(pasteSection);
  left.appendChild(turnCard());

  // RIGHT: scene grid
  const right = el("div", { class: "col" });
  const gridSection = el("div", null, sceneGridCard());
  right.appendChild(gridSection);

  layout.appendChild(left);
  layout.appendChild(right);
  mount.appendChild(layout);

  function rerenderImageParts() {
    UI.clear(pasteSection);
    pasteSection.appendChild(pasteCard());
    UI.clear(gridSection);
    gridSection.appendChild(sceneGridCard());
  }

  // ===== blocks =====
  function promptCard() {
    const card = el("div", { class: "card" });
    card.appendChild(el("div", { class: "row" }, [
      el("div", { style: "font-weight:700;font-size:15px" }, "1) Generate the image"),
      el("span", { class: "spacer" }),
      el("button", { class: "btn sm", onclick: () => {
        navigator.clipboard.writeText(story.imagePrompt).then(() => UI.toast("Prompt copied"));
      }}, "Copy prompt"),
    ]));
    card.appendChild(el("div", { class: "muted", style: "font-size:12px;margin-top:4px" }, "Paste this into Gemini Nano Banana to generate one 4×2 grid image."));
    const ta = el("textarea", { rows: 8, style: "margin-top:10px;width:100%;font-family:ui-monospace,monospace;font-size:12px" });
    ta.value = story.imagePrompt;
    ta.readOnly = true;
    card.appendChild(ta);
    return card;
  }

  function pasteCard() {
    const card = el("div", { class: "card" });
    card.appendChild(el("div", { class: "row" }, [
      el("div", { style: "font-weight:700;font-size:15px" }, "2) Paste the generated image"),
      el("span", { class: "spacer" }),
      session.imageData ? el("button", { class: "btn sm danger", onclick: () => clearImage() }, "Remove") : null,
    ]));
    card.appendChild(el("div", { class: "muted", style: "font-size:12px;margin-top:4px" }, "Paste an image from clipboard (Ctrl+V), drag a file in, or click to browse."));

    const zone = el("div", { class: "paste-zone" });
    zone.tabIndex = 0;
    zone.appendChild(el("div", null, [
      el("div", { style: "font-weight:600" }, "Drop · Paste · Click"),
      el("div", { class: "muted", style: "font-size:12px;margin-top:6px" }, "Press Ctrl+V here, or click to choose a file"),
    ]));
    const fileInput = el("input", { type: "file", accept: "image/*" });
    fileInput.addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (f) handleFile(f);
    });
    zone.appendChild(fileInput);
    zone.addEventListener("click", () => fileInput.click());
    zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("drag"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("drag");
      const f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) handleFile(f);
    });
    zone.addEventListener("paste", onPaste);
    document.addEventListener("paste", onPaste);

    function onPaste(e) {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const f = items[i].getAsFile();
          handleFile(f);
          break;
        }
      }
    }

    function handleFile(f) {
      const reader = new FileReader();
      reader.onload = () => {
        imageData = reader.result;
        session.described = session.described || {};
        // Note: imageData will be extracted and saved to ImageDB in setStorySession
        State.setStorySession(w, d, slot, Object.assign({}, session, { imageData }));
        rerenderImageParts();
      };
      reader.readAsDataURL(f);
    }

    if (imageData) {
      const preview = el("img", { src: imageData });
      preview.style.cssText = "max-width:100%;max-height:280px;border-radius:10px;border:1px solid var(--border)";
      const wrap = el("div", { style: "margin-top:12px" }, preview);
      card.appendChild(wrap);
    } else {
      card.appendChild(zone);
    }
    return card;
  }

  function turnCard() {
    const card = el("div", { class: "card" });
    card.appendChild(el("div", { class: "row" }, [
      el("div", { style: "font-weight:700;font-size:15px" }, "Whose turn?"),
      el("span", { class: "spacer" }),
      el("div", { class: "role-toggle" }, [
        el("button", { class: turn === "her" ? "active" : "", onclick: () => setTurn("her") }, "Her"),
        el("button", { class: turn === "you" ? "active" : "", onclick: () => setTurn("you") }, "You"),
      ]),
    ]));
    card.appendChild(el("div", { class: "muted", style: "font-size:12px;margin-top:4px" },
      slot === "together"
        ? "Take turns describing scenes. After each, switch turn so she stretches between roles."
        : "Solo session — she describes all 8. Use the hints if she's stuck."));
    card.appendChild(el("div", { class: "row", style: "margin-top:10px" }, [
      el("button", { class: "btn", onclick: () => completeStory() }, "Mark story complete →"),
    ]));
    return card;

    function setTurn(t) {
      turn = t;
      sessionStorage.setItem("turn:" + story.id, t);
      Array.from(card.querySelectorAll(".role-toggle button")).forEach((btn, i) => {
        btn.classList.toggle("active", (i === 0 && t === "her") || (i === 1 && t === "you"));
      });
    }
  }

  function sceneGridCard() {
    const card = el("div", { class: "card" });
    card.appendChild(el("div", { class: "row" }, [
      el("div", { style: "font-weight:700;font-size:15px" }, "3) The 8 scenes"),
      el("span", { class: "spacer" }),
      el("span", { class: "chip muted" }, `${countDescribed()} / 8 described`),
    ]));
    card.appendChild(el("div", { class: "muted", style: "font-size:12px;margin-top:4px" },
      "Click any panel to enter scene mode. Each scene has a hint and a model description (hidden by default)."));

    const grid = el("div", { class: "scene-grid" });
    for (let i = 0; i < 8; i++) {
      const cell = el("div", { class: "scene" + (session.described && session.described[i] ? " described" : "") });
      cell.appendChild(el("div", { class: "num" }, String(i + 1)));
      if (imageData) {
        const cv = el("canvas");
        cell.appendChild(cv);
        sliceTo(cv, imageData, i);
      } else {
        cell.appendChild(el("div", { class: "empty muted", style: "padding:0;display:grid;place-items:center;height:100%" }, "—"));
      }
      cell.addEventListener("click", () => openSceneModal(i));
      grid.appendChild(cell);
    }
    card.appendChild(grid);
    return card;
  }

  function rerender() {
    UI.clear(mount);
    Views.imageStory(mount, params);
  }

  function clearImage() {
    UI.confirmDialog("Remove image?", "This won't delete the scene descriptions you've already viewed.", () => {
      imageData = null;
      ImageDB.delete(`story:${w}:${d}:${slot}`).catch(console.error);
      State.setStorySession(w, d, slot, session);
      rerenderImageParts();
    });
  }

  function countDescribed() {
    if (!session.described) return 0;
    return Object.values(session.described).filter(Boolean).length;
  }

  function openSceneModal(idx) {
    const scene = story.scenes[idx];
    let descShown = false;
    let hintShown = false;

    UI.modal((m, close) => {
      m.classList.add("scene-modal");

      // LEFT SIDE
      const left = UI.el("div", { class: "modal-left" });
      const cWrap = UI.el("div", { class: "canvas-wrap" });
      const cv = document.createElement("canvas");
      cWrap.appendChild(cv);
      left.appendChild(cWrap);
      if (imageData) sliceTo(cv, imageData, idx, /*hi-res*/ true);
      else cWrap.appendChild(UI.el("div", { class: "empty" }, "No image pasted"));
      m.appendChild(left);

      // RIGHT SIDE
      const right = UI.el("div", { class: "modal-right" });
      right.appendChild(UI.el("h2", null, `Scene ${idx + 1} — ${scene.title}`));
      right.appendChild(UI.el("div", { class: "muted", style: "font-size:13px" }, slot === "together" ? `Whose turn: ${turn === "her" ? "her" : "you"}` : "Her turn"));

      const descBox = UI.el("div", { class: "hidden-text" }, "(model description hidden)");
      const hintBox = UI.el("div", { class: "hidden-text" }, "(tap 'Show hint')");
      const vocabRow = UI.el("div", { class: "row", style: "flex-wrap:wrap;gap:6px" },
        (scene.vocab || []).map((v) => UI.el("span", { class: "chip" }, v)));

      const actions = UI.el("div", { class: "row", style: "margin-top:6px" }, [
        UI.el("button", { class: "btn sm", onclick: () => {
          hintShown = !hintShown;
          if (hintShown) { hintBox.textContent = scene.hint; hintBox.classList.add("show"); }
          else { hintBox.textContent = "(tap 'Show hint')"; hintBox.classList.remove("show"); }
        }}, "Show hint"),
        UI.el("button", { class: "btn sm", onclick: () => {
          descShown = !descShown;
          if (descShown) { descBox.textContent = scene.description; descBox.classList.add("show"); }
          else { descBox.textContent = "(model description hidden)"; descBox.classList.remove("show"); }
        }}, "Show description"),
        UI.el("button", { class: "btn sm", onclick: () => switchTurnInModal() }, "🔄"),
      ]);

      right.appendChild(UI.el("div", { class: "desc-area" }, [
        UI.el("div", { class: "muted", style: "font-size:11px;text-transform:uppercase;letter-spacing:.08em" }, "Useful words"),
        vocabRow,
        hintBox,
        descBox,
        actions,
      ]));

      const turnLabel = UI.el("span", { class: "muted", style: "font-size:13px" }, "");
      function refreshTurnLabel() {
        turnLabel.textContent = slot === "together" ? `Turn: ${turn === "her" ? "her" : "you"}` : "Solo";
      }
      refreshTurnLabel();

      right.appendChild(UI.el("div", { class: "modal-actions", style: "margin-top:auto" }, [
        UI.el("button", { class: "btn", text: "Close", onclick: close }),
        UI.el("button", { class: "btn primary", text: session.described && session.described[idx] ? "Undo ✓" : "Done ✓", onclick: () => {
          session.described = session.described || {};
          session.described[idx] = !session.described[idx];
          State.setStorySession(w, d, slot, session);
          close();
          rerender();
        }}),
      ]));
      m.appendChild(right);

      function switchTurnInModal() {
        turn = turn === "her" ? "you" : "her";
        sessionStorage.setItem("turn:" + story.id, turn);
        refreshTurnLabel();
      }
    });
  }

  function completeStory() {
    State.setTaskDone(w, d, story.id, true);
    State.pingStreak();
    UI.toast("Story complete ✓");
    setTimeout(() => location.hash = `#/week/${w}/day/${d}`, 500);
  }
};

/* Slice a 4×2 grid into 8 panels — index 0..7, row-major */
function sliceTo(canvas, dataUrl, idx, hires) {
  const img = new Image();
  img.onload = () => {
    const cols = 4, rows = 2;
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const panelW = img.width / cols;
    const panelH = img.height / rows;
    const sx = col * panelW;
    const sy = row * panelH;

    const targetW = hires ? panelW : 240;
    const targetH = hires ? panelH : (panelH * (240 / panelW));
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, sx, sy, panelW, panelH, 0, 0, targetW, targetH);
  };
  img.src = dataUrl;
}
