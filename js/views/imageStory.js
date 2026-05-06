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
  let imageData = null;

  State.getStoryImage(w, d, slot).then(data => {
    if (data) {
      imageData = data;
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
        el("span", null, `Image story · ${slot === "together" ? "Image 1" : "Image 2"}`),
      ]),
      el("h1", null, story.title),
      el("div", { class: "muted", style: "margin-top:4px" }, "Describe the story panel by panel to practice your speaking and narrative skills."),
    ]),
    el("div", { class: "actions" }, [
      el("button", { class: "btn", onclick: () => location.hash = `#/week/${w}/day/${d}` }, "Back"),
    ]),
  ]);
  mount.appendChild(head);

  // --- Paste Logic ---
  function handleFile(f) {
    const reader = new FileReader();
    reader.onload = () => {
      imageData = reader.result;
      session.described = session.described || {};
      State.setStorySession(w, d, slot, Object.assign({}, session, { imageData }));
      rerenderImageParts();
    };
    reader.readAsDataURL(f);
  }

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

  // Manage global listener to avoid duplicates while allowing page-wide paste
  if (window._storyPasteHandler) {
    window.removeEventListener("paste", window._storyPasteHandler);
  }
  window._storyPasteHandler = (e) => {
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
    onPaste(e);
  };
  window.addEventListener("paste", window._storyPasteHandler);

  const layout = el("div", { class: "img-story-layout" });

  const gridSection = el("div", { style: "margin-bottom:20px" }, sceneGridCard());
  const repeatsSection = el("div", { style: "margin-bottom:20px" }, repeatsStoryBlock());
  const pasteSection = el("div", { style: "flex:1" }, pasteCard());

  const setupRow = el("div", { class: "row", style: "gap:20px; align-items: flex-start; margin-bottom:20px" }, [
    el("div", { style: "flex:1" }, promptCard()),
    pasteSection,
  ]);

  const completeRow = el("div", { style: "margin-top:20px" }, [
    el("button", { class: "btn primary", style: "width:100%", onclick: () => completeStory() }, "Mark story complete →"),
  ]);

  layout.appendChild(repeatsSection);
  layout.appendChild(setupRow);
  layout.appendChild(gridSection);
  layout.appendChild(completeRow);
  mount.appendChild(layout);

  function rerenderImageParts() {
    UI.clear(pasteSection);
    pasteSection.appendChild(pasteCard());
    UI.clear(gridSection);
    gridSection.appendChild(sceneGridCard());
  }

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
      imageData ? el("button", { class: "btn sm danger", onclick: () => clearImage() }, "Remove") : null,
    ]));

    if (imageData) {
      const preview = el("img", { src: imageData });
      preview.style.cssText = "max-width:100%;max-height:280px;border-radius:10px;border:1px solid var(--border)";
      card.appendChild(el("div", { style: "margin-top:12px" }, preview));
    } else {
      card.appendChild(el("div", { class: "muted", style: "font-size:12px;margin-top:4px" }, "Paste an image from clipboard (Ctrl+V), or click to browse."));
      const zone = el("div", { class: "paste-zone", tabIndex: 0 }, [
        el("div", null, [
          el("div", { style: "font-weight:600" }, "Drop · Paste · Click"),
          el("div", { class: "muted", style: "font-size:12px;margin-top:6px" }, "Press Ctrl+V here, or click to choose a file"),
        ])
      ]);
      const fileInput = el("input", { type: "file", accept: "image/*", style: "display:none" });
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
      card.appendChild(zone);
    }
    return card;
  }


  function sceneGridCard() {
    const card = el("div", { class: "card" });
    card.appendChild(el("div", { class: "row" }, [
      el("div", { style: "font-weight:700;font-size:15px" }, "3) The 8 scenes"),
      el("span", { class: "spacer" }),
      el("span", { class: "chip muted" }, `${countDescribed()} / 8 described`),
    ]));
    card.appendChild(el("div", { class: "muted", style: "font-size:12px;margin-top:4px" }, "Click any panel to enter scene mode."));

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

  function clearImage() {
    UI.confirmDialog("Remove image?", "This won't delete descriptions.", () => {
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
      const left = UI.el("div", { class: "modal-left" });
      const cWrap = UI.el("div", { class: "canvas-wrap" });
      const cv = document.createElement("canvas");
      cWrap.appendChild(cv);
      left.appendChild(cWrap);
      if (imageData) sliceTo(cv, imageData, idx, true);
      else cWrap.appendChild(UI.el("div", { class: "empty" }, "No image pasted"));
      m.appendChild(left);

      const right = UI.el("div", { class: "modal-right" });
      right.appendChild(UI.el("h2", null, `Scene ${idx + 1} — ${scene.title}`));
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
      ]);

      right.appendChild(UI.el("div", { class: "desc-area" }, [
        UI.el("div", { class: "muted", style: "font-size:11px;text-transform:uppercase" }, "Useful words"),
        vocabRow, hintBox, descBox, actions
      ]));

      right.appendChild(UI.el("div", { class: "modal-actions", style: "margin-top:auto" }, [
        UI.el("button", { class: "btn", text: "Close", onclick: close }),
        UI.el("button", { class: "btn primary", text: session.described && session.described[idx] ? "Undo ✓" : "Done ✓", onclick: () => {
          session.described = session.described || {};
          session.described[idx] = !session.described[idx];
          State.setStorySession(w, d, slot, session);
          close();
          rerenderImageParts();
        }}),
      ]));
      m.appendChild(right);
    });
  }

  function repeatsStoryBlock() {
    const cur = State.getConvRepeats(w, d, story.id + ":story");
    const wrap = el("div", { class: "repeats-card", style: "padding:16px; background:var(--card); border:2px solid var(--border); border-bottom-width:5px; border-radius:var(--r-lg)" }, [
      el("div", { class: "row", style: "justify-content:space-between; align-items:center" }, [
        el("div", null, [
          el("div", { style: "font-weight:900; font-size:15px; letter-spacing:-0.01em" }, "Story Practice Progress"),
          el("div", { class: "muted", style: "font-size:12px; margin-top:2px" }, "Complete 2 shared descriptions to master this story"),
        ]),
        el("div", { class: "row", style: "gap:8px" }, [
          el("button", { 
            class: "btn ghost sm icon", 
            title: "Reset Progress",
            onclick: () => {
              if (confirm("Reset practice repeats for this story?")) {
                State.setConvRepeats(w, d, story.id + ":story", 0);
                Views.imageStory(mount, params);
              }
            }
          }, "↺"),
          el("button", { class: "btn primary sm", onclick: () => openStoryPracticeModal() }, [
            el("span", { style: "margin-right:6px" }, "▶"), "Practice Mode"
          ])
        ])
      ]),
      el("div", { class: "repeat-checks", style: "display:flex; gap:12px; margin-top:16px" }, [1, 2].map(i => {
        const active = i <= cur;
        return el("div", {
          style: `flex:1; height:44px; border-radius:12px; border:2.5px solid ${active ? 'var(--primary)' : 'var(--border)'}; background:${active ? 'var(--primary-soft)' : 'var(--card-2)'}; display:grid; place-items:center; cursor:default; transition: all .1s;`,
        }, [
          el("span", { style: `font-size:18px; font-weight:900; color:${active ? 'var(--primary-dark)' : 'var(--text-soft)'}` }, active ? "✓" : i)
        ]);
      }))
    ]);
    return wrap;
  }

  function openStoryPracticeModal() {
    UI.modal((m, close) => {
      let session = { roles: { A: null, B: null }, step: 0 };
      let myRole = null; 

      function onSync(data) {
        if (data) {
          if (data.roles) session.roles = { ...session.roles, ...data.roles };
          if (data.step !== undefined) session.step = data.step;
          if (data.finished && !session.finished) {
            session.finished = true;
            finish(true);
            return;
          }
        }
        if (myRole === null) showRolePicker();
        else renderStep();
      }

      function showRolePicker() {
        UI.clear(m);
        m.classList.remove("scene-modal");
        
        const content = el("div", { class: "col", style: "gap:24px; min-height:300px; justify-content:center; align-items:center; text-align:center" });
        content.appendChild(el("h2", { style: "margin:0" }, "Role A or B?"));
        content.appendChild(el("div", { class: "muted", style: "margin-bottom:20px" }, "Select a role to start synced practice."));
        
        const btns = el("div", { class: "row", style: "gap:12px; width:100%" }, [
          roleBtn("A", "First Person"),
          roleBtn("B", "Second Person")
        ]);
        content.appendChild(btns);

        content.appendChild(el("div", { style: "margin-top:20px; border-top:1px solid var(--border); padding-top:20px; width:100%" }, [
          el("button", { class: "btn ghost sm", onclick: async () => {
            if (confirm("Reset current story session?")) {
              await window.PracticeSync.clear();
              session = { roles: { A: null, B: null }, step: 0 };
              showRolePicker();
            }
          }}, "Reset Session")
        ]));
        m.appendChild(content);
      }

      function roleBtn(label, name) {
        const owner = session.roles[label];
        const isTaken = owner && owner !== window.SYNC_CLIENT_ID;
        const isMe = owner === window.SYNC_CLIENT_ID;
        return el("button", { 
          class: `btn big ${isMe ? 'primary' : (isTaken ? 'ghost' : 'primary')}`, 
          style: `flex:1; padding:25px 10px; position:relative; ${isTaken ? 'opacity:0.5; pointer-events:none' : ''}`, 
          onclick: () => startPractice(label) 
        }, [
          el("div", { style: "font-size:12px; opacity:0.8; margin-bottom:4px" }, `Role ${label}`),
          el("div", { style: "font-size:20px; font-weight:900" }, name),
          isTaken ? el("div", { style: "font-size:10px; margin-top:4px; color:var(--red)" }, "ALREADY TAKEN") : null
        ]);
      }

      async function startPractice(roleLabel) {
        myRole = roleLabel;
        await window.PracticeSync.update({ roles: { [roleLabel]: window.SYNC_CLIENT_ID } });
      }

      function renderStep() {
        UI.clear(m);
        const scenes = story.scenes || [];
        const step = session.step;
        if (step >= scenes.length) { finish(); return; }

        const scene = scenes[step];
        const isMe = (step % 2 === 0 && myRole === 'A') || (step % 2 === 1 && myRole === 'B');
        const whoName = step % 2 === 0 ? "First Person (A)" : "Second Person (B)";

        // IMPORTANT: Add class to 'm' (the modal root) for grid layout
        m.classList.add("scene-modal");
        
        // LEFT: Image
        const left = el("div", { class: "modal-left" });
        const cWrap = el("div", { class: "canvas-wrap" });
        const cv = el("canvas");
        cWrap.appendChild(cv);
        left.appendChild(cWrap);
        if (imageData) sliceTo(cv, imageData, step, true);
        else cWrap.appendChild(el("div", { class: "empty" }, "No image uploaded"));
        m.appendChild(left);

        // RIGHT: Practice Info
        const right = el("div", { class: "modal-right" });
        
        // Turn Badge
        const turnBadge = el("div", { 
          style: `display:inline-block; padding:6px 16px; border-radius:999px; font-weight:900; font-size:13px; margin-bottom:12px; background:${isMe ? 'var(--primary)' : 'var(--card-2)'}; color:${isMe ? 'white' : 'var(--text-soft)'}; border:2px solid ${isMe ? 'var(--primary-dark)' : 'var(--border)'}` 
        }, isMe ? "Your Turn to Describe" : `Waiting for ${whoName}...`);
        right.appendChild(turnBadge);

        right.appendChild(el("h2", null, `Scene ${step + 1} — ${scene.title}`));
        
        const vocabRow = el("div", { class: "row", style: "flex-wrap:wrap;gap:6px; margin:10px 0" },
          (scene.vocab || []).map((v) => el("span", { class: "chip" }, v)));
        
        const descBox = el("div", { class: "hidden-text" }, "(model description hidden)");
        const hintBox = el("div", { class: "hidden-text" }, "(tap 'Show hint')");
        
        const actions = el("div", { class: "row", style: "margin-top:6px" }, [
          el("button", { class: "btn sm", onclick: () => {
            if (hintBox.classList.contains("show")) {
              hintBox.textContent = "(tap 'Show hint')";
              hintBox.classList.remove("show");
            } else {
              hintBox.textContent = scene.hint;
              hintBox.classList.add("show");
            }
          }}, "Show hint"),
          el("button", { class: "btn sm", onclick: () => {
            if (descBox.classList.contains("show")) {
              descBox.textContent = "(model description hidden)";
              descBox.classList.remove("show");
            } else {
              descBox.textContent = scene.description;
              descBox.classList.add("show");
            }
          }}, "Show description"),
        ]);

        right.appendChild(el("div", { class: "desc-area" }, [
          el("div", { class: "muted", style: "font-size:11px;text-transform:uppercase" }, "Useful words"),
          vocabRow,
          hintBox,
          descBox,
          actions
        ]));

        // Footer Actions
        const footer = el("div", { class: "modal-actions", style: "margin-top:auto" }, []);
        if (isMe) {
          footer.appendChild(el("button", { 
            class: "btn big primary", 
            style: "width:100%; padding:20px; font-size:18px", 
            onclick: async () => { await window.PracticeSync.update({ step: step + 1 }); }
          }, step === scenes.length - 1 ? "Finish Session" : "Done with this Panel →"));
        } else {
          footer.appendChild(el("div", { class: "thinking", style: "width:100%; padding:20px; justify-content:center" }, `Waiting for ${whoName}...`));
        }
        right.appendChild(footer);
        m.appendChild(right);
      }

      function finish(remoteTriggered = false) {
        UI.clear(m);
        m.classList.remove("scene-modal");
        const content = el("div", { class: "col", style: "text-align:center; padding:20px; justify-content:center; align-items:center; min-height:300px" }, [
          el("div", { style: "font-size:64px; margin-bottom:20px" }, "🎊"),
          el("h2", null, "Story Complete!"),
          el("p", { class: "muted" }, remoteTriggered ? "Your partner finished the session." : "You've finished the shared narrative practice."),
          el("button", { 
            class: "btn big primary", 
            style: "width:100%; margin-top:30px", 
            onclick: async () => {
              State.incrementConvRepeats(w, d, story.id + ":story");
              if (!remoteTriggered) {
                await window.PracticeSync.update({ finished: true });
                setTimeout(() => window.PracticeSync.clear(), 1500);
              }
              close();
              Views.imageStory(mount, params);
            }
          }, remoteTriggered ? "Close" : "Finish & Close")
        ]);
        m.appendChild(content);
      }

      if (window.PracticeSync) {
        window.PracticeSync.join(story.id + ":story", onSync);
        onSync(null); 
      } else {
        showRolePicker(); 
      }

      const checkClose = setInterval(() => {
        if (!document.body.contains(m)) {
          clearInterval(checkClose);
          if (window.PracticeSync) window.PracticeSync.leave();
        }
      }, 1000);
    });
  }

  function completeStory() {
    State.setTaskDone(w, d, story.id, true);
    State.pingStreak();
    UI.toast("Story complete ✓");
    setTimeout(() => location.hash = `#/week/${w}/day/${d}`, 500);
  }
};

function sliceTo(canvas, dataUrl, idx, hires) {
  const img = new Image();
  img.onload = () => {
    const cols = 4, rows = 2;
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const panelW = img.width / cols;
    const panelH = img.height / rows;
    const targetW = hires ? Math.min(1000, panelW * 2) : 240;
    const targetH = hires ? (panelH * (targetW / panelW)) : (panelH * (240 / panelW));
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, col * panelW, row * panelH, panelW, panelH, 0, 0, targetW, targetH);
  };
  img.src = dataUrl;
}
