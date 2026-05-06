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
    function cleanRole(name) {
      if (!name) return "";
      return name.replace(/\s*\((her|you|him|me)\)/gi, "").trim();
    }

    function dialogueBlock() {
      const wrap = el("div", { class: "dialogue" });
      const roles = [cleanRole(conv.roles[0]), cleanRole(conv.roles[1])];
      (conv.dialogue || []).forEach((line) => {
        const whoName = line.who === "A" ? roles[0] : roles[1];
        const lineEl = el("div", { class: `line ${line.who}` }, [
          el("div", { class: "who" }, `${line.who}: ${whoName}`),
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

    // ===== New Components: Repeats & Practice =====
    function repeatsBlock() {
      const cur = State.getConvRepeats(w, d, conv.id);
      const wrap = el("div", { class: "repeats-card", style: "margin-bottom:20px; padding:16px; background:var(--card); border:2px solid var(--border); border-bottom-width:5px; border-radius:var(--r-lg)" }, [
        el("div", { class: "row", style: "justify-content:space-between; align-items:center" }, [
          el("div", null, [
            el("div", { style: "font-weight:900; font-size:15px; letter-spacing:-0.01em" }, "Practice Progress"),
            el("div", { class: "muted", style: "font-size:12px; margin-top:2px" }, "Complete 4 repeats to master this conversation"),
          ]),
          el("div", { class: "row", style: "gap:8px" }, [
            el("button", { 
              class: "btn ghost sm icon", 
              title: "Reset Progress",
              onclick: () => {
                if (confirm("Reset practice repeats for this task?")) {
                  State.setConvRepeats(w, d, conv.id, 0);
                  Speaking.render();
                }
              }
            }, "↺"),
            el("button", { class: "btn primary sm", onclick: () => openPracticeModal() }, [
              el("span", { style: "margin-right:6px" }, "▶"), "Practice Mode"
            ])
          ])
        ]),
        el("div", { class: "repeat-checks", style: "display:flex; gap:12px; margin-top:16px" }, [1, 2, 3, 4].map(i => {
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

    function openPracticeModal() {
      UI.modal((m, close) => {
        const content = el("div", { class: "col", style: "gap:24px; min-height:350px; justify-content:center; align-items:center; text-align:center" });
        m.appendChild(content);

        let session = { roles: { A: null, B: null }, step: 0 };
        let myRole = null; 

        function onSync(data) {
          if (data) {
            if (data.roles) session.roles = { ...session.roles, ...data.roles };
            if (data.step !== undefined) session.step = data.step;
            
            // Detect remote finish
            if (data.finished && !session.finished) {
              session.finished = true;
              finish(true); // true means remote triggered
              return;
            }
          }
          
          if (myRole === null) showRolePicker();
          else renderStep();
        }

        function showRolePicker() {
          UI.clear(content);
          content.appendChild(el("h2", { style: "margin:0" }, "Choose your role"));
          content.appendChild(el("div", { class: "muted", style: "margin-bottom:20px" }, "Select a role to start synced practice."));
          
          const roles = [cleanRole(conv.roles[0]), cleanRole(conv.roles[1])];
          const btns = el("div", { class: "row", style: "gap:12px; width:100%" }, [
            roleBtn("A", roles[0]),
            roleBtn("B", roles[1])
          ]);
          content.appendChild(btns);

          content.appendChild(el("div", { style: "margin-top:20px; border-top:1px solid var(--border); padding-top:20px; width:100%" }, [
            el("button", { class: "btn ghost sm", onclick: async () => {
              if (confirm("Reset current practice session?")) {
                await window.PracticeSync.clear();
                session = { roles: { A: null, B: null }, step: 0 };
                showRolePicker();
              }
            }}, "Reset Session")
          ]));
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
          const update = { roles: { [roleLabel]: window.SYNC_CLIENT_ID } };
          await window.PracticeSync.update(update);
          renderStep();
        }

        function renderStep() {
          UI.clear(content);
          const dialogue = conv.dialogue || [];
          const step = session.step;
          const roles = [cleanRole(conv.roles[0]), cleanRole(conv.roles[1])];

          if (step >= dialogue.length) {
            finish();
            return;
          }

          const line = dialogue[step];
          const isMe = line.who === myRole;
          const whoName = line.who === 'A' ? roles[0] : roles[1];
          
          content.appendChild(el("div", { class: "muted", style: "font-weight:800; font-size:12px; text-transform:uppercase; letter-spacing:0.05em" }, `Line ${step + 1} of ${dialogue.length}`));
          
          const turnBadge = el("div", { 
            style: `padding:6px 16px; border-radius:999px; font-weight:900; font-size:13px; margin-top:8px; background:${isMe ? 'var(--primary)' : 'var(--card-2)'}; color:${isMe ? 'white' : 'var(--text-soft)'}; border:2px solid ${isMe ? 'var(--primary-dark)' : 'var(--border)'}` 
          }, isMe ? `Your Turn (${line.who}: ${whoName})` : `${line.who}: ${whoName}'s Turn`);
          content.appendChild(turnBadge);

          const textDisplay = el("div", { 
            style: "margin: 30px 0; font-size:26px; font-weight:800; line-height:1.4; color:var(--text); min-height:120px; display:flex; align-items:center; justify-content:center; text-align:center" 
          }, line.line);
          content.appendChild(textDisplay);

          if (isMe) {
            content.appendChild(el("button", { 
              class: "btn big primary", 
              style: "width:100%; margin-top:20px; padding:20px; font-size:18px", 
              onclick: async () => {
                await window.PracticeSync.update({ step: step + 1 });
              }
            }, step === dialogue.length - 1 ? "Finish Session" : "I'm Done"));
          } else {
            content.appendChild(el("div", { 
              class: "thinking", 
              style: "margin-top:20px; justify-content:center; padding:20px; background:var(--card-2); border-color:var(--border)" 
            }, `Waiting for ${whoName}...`));
          }
        }

        function finish(remoteTriggered = false) {
          UI.clear(content);
          content.appendChild(el("div", { style: "text-align:center; padding:20px" }, [
            el("div", { style: "font-size:64px; margin-bottom:20px" }, "🎉"),
            el("h2", null, "Excellent work!"),
            el("p", { class: "muted" }, remoteTriggered ? "Your partner finished the session." : "You've completed this practice session together."),
            el("button", { 
              class: "btn big primary", 
              style: "width:100%; margin-top:30px", 
              onclick: async () => {
                // Increment locally on BOTH sides for real-time visual feedback
                State.incrementConvRepeats(w, d, conv.id);
                
                if (!remoteTriggered) {
                  await window.PracticeSync.update({ finished: true });
                }
                
                // Initiator clears the session data after a short delay
                if (!remoteTriggered) {
                  setTimeout(() => window.PracticeSync.clear(), 1500);
                }
                
                close();
                Speaking.render();
              }
            }, remoteTriggered ? "Close & Mark Done" : "Finish & Close")
          ]));
        }

        if (window.PracticeSync) {
          window.PracticeSync.join(conv.id, onSync);
          // Safety: Always trigger an initial render so it's not empty while waiting for cloud
          onSync(null); 
        } else {
          showRolePicker(); 
        }

        // Cleanup on close
        const checkClose = setInterval(() => {
          if (!document.body.contains(m)) {
            clearInterval(checkClose);
            if (window.PracticeSync) window.PracticeSync.leave();
          }
        }, 1000);
      });
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
          el("span", null, `TOEFL · Speaking · ${slot}`),
        ]),
        el("h1", null, conv.title),
      ]),
      el("div", { class: "actions" }, [
        el("span", { class: `chip ${slot === "together" ? "" : "blue"}` }, slot === "together" ? "Together" : "Solo"),
        el("button", { class: "btn", onclick: () => location.hash = `#/week/${w}/day/${d}` }, "Back"),
      ]),
    ]);
    mount.appendChild(head);

    const layout = el("div", { class: "speak-layout" });

    // LEFT: dialogue
    const left = el("div", { class: "col" });
    left.appendChild(repeatsBlock());
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
