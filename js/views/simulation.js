/* Solo Roleplay Mode — game-like simulated environment
 * Sahar picks her role; AI voices the other character via ElevenLabs.
 *   - Conversations: alternate by line.who
 *   - Image stories: alternate panel-by-panel (A → 1,3,5,7 / B → 2,4,6,8)
 */
window.SimulationMode = (function () {
  const { el } = UI;

  function cleanRole(name) {
    if (!name) return "";
    return name.replace(/\s*\((her|you|him|me)\)/gi, "").trim();
  }

  // Heuristic gender hint from role name → voice
  function voiceForRoleName(name) {
    const lower = (name || "").toLowerCase();
    if (/\b(her|she|woman|girl|mother|sister|daughter|lady|wife|mom|mum|female|barista|nurse|hostess|aunt|niece|grandma)\b/.test(lower)) {
      return AudioTTS.voices.bella;
    }
    if (/\b(him|man|boy|father|brother|son|husband|guy|sir|male|doctor|coworker|boss|manager|uncle|grandpa)\b/.test(lower)) {
      return AudioTTS.voices.brian;
    }
    return null;
  }

  // Pick voice for the "other" character (the one Sahar isn't playing)
  function voiceForOther(otherRoleLabel, otherRoleName) {
    const hint = voiceForRoleName(otherRoleName);
    if (hint) return hint;
    // Default: Role A → Brian (male), Role B → Bella (female)
    return otherRoleLabel === "A" ? AudioTTS.voices.brian : AudioTTS.voices.bella;
  }

  function avatarFor(roleLabel, voiceId) {
    const isFemale = voiceId === AudioTTS.voices.bella || voiceId === AudioTTS.voices.lauren;
    return el("div", {
      class: "sim-avatar",
      style: `background: ${isFemale ? 'linear-gradient(135deg,#ec4899,#be185d)' : 'linear-gradient(135deg,#3b82f6,#1d4ed8)'}`,
    }, isFemale ? "👩" : "👨");
  }

  function avatarMine() {
    return el("div", {
      class: "sim-avatar mine",
      style: "background: linear-gradient(135deg,#f59e0b,#d97706)",
    }, "🎤");
  }

  function statTile(label, value) {
    return el("div", { class: "sim-stat" }, [
      el("div", { class: "sim-stat-val" }, String(value)),
      el("div", { class: "sim-stat-lbl" }, label),
    ]);
  }

  /* ============================================================
     CONVERSATION ROLEPLAY
  ============================================================ */
  function openConversation(conv, w, d, onClose) {
    const dialogue = conv.dialogue || [];
    const roles = [cleanRole(conv.roles[0]), cleanRole(conv.roles[1])];
    let myRole = null;        // "A" | "B"
    let otherVoice = null;
    let step = 0;
    let audioEl = null;

    const handle = UI.modal((m, close) => {
      m.classList.add("sim-modal");
      const stage = el("div", { class: "sim-stage" });
      m.appendChild(stage);

      render();

      function render() {
        UI.clear(stage);
        stopAudio();
        if (myRole === null) renderIntro();
        else if (step >= dialogue.length) renderFinish();
        else renderTurn();
      }

      function renderIntro() {
        const card = el("div", { class: "sim-intro" });
        card.appendChild(el("div", { class: "sim-act-label" }, "🎬 LIVE SCENE"));
        card.appendChild(el("h1", { class: "sim-title" }, conv.title));
        if (conv.scenario) card.appendChild(el("p", { class: "sim-scenario" }, conv.scenario));

        if (conv.goal) {
          card.appendChild(el("div", { class: "sim-goal" }, [
            el("div", { class: "sim-goal-label" }, "🎯 Your Mission"),
            el("div", { class: "sim-goal-text" }, conv.goal),
          ]));
        }

        card.appendChild(el("div", { class: "sim-cast-label" }, "Cast yourself"));
        const cast = el("div", { class: "sim-cast-picker" }, [
          castBtn("A", roles[0], 0),
          el("div", { class: "sim-vs" }, "vs"),
          castBtn("B", roles[1], 1),
        ]);
        card.appendChild(cast);

        card.appendChild(el("div", { class: "sim-fineprint" },
          "I'll voice the other character. Say your lines out loud, then tap continue."));
        stage.appendChild(card);
      }

      function castBtn(label, name, idx) {
        const otherIdx = idx === 0 ? 1 : 0;
        return el("button", {
          class: "sim-cast-btn",
          onclick: () => pickRole(label),
        }, [
          avatarMine(),
          el("div", { class: "sim-cast-name" }, name),
          el("div", { class: "sim-cast-tag" }, `Role ${label}`),
          el("div", { class: "sim-cast-pair" }, `AI plays ${roles[otherIdx]}`),
        ]);
      }

      function pickRole(label) {
        myRole = label;
        const otherIdx = label === "A" ? 1 : 0;
        const otherLabel = label === "A" ? "B" : "A";
        otherVoice = voiceForOther(otherLabel, roles[otherIdx]);
        step = 0;
        render();
        // Pre-fetch first line of dialogue if it's the "other" speaker
        if (dialogue[0] && dialogue[0].who !== myRole) {
          prefetchLine(0);
        }
      }

      function renderTurn() {
        const line = dialogue[step];
        const isMe = line.who === myRole;
        const whoLabel = line.who;
        const whoIdx = whoLabel === "A" ? 0 : 1;
        const whoName = roles[whoIdx];

        // Header: progress
        stage.appendChild(el("div", { class: "sim-turn-header" }, [
          el("div", { class: "sim-progress" }, `${step + 1} / ${dialogue.length}`),
          el("div", { class: "sim-progress-bar" }, [
            el("div", { class: "sim-progress-fill", style: `width:${((step + 1) / dialogue.length) * 100}%` }),
          ]),
        ]));

        const turnCard = el("div", { class: `sim-turn ${isMe ? "mine" : "theirs"}` });

        const speakerRow = el("div", { class: "sim-speaker" }, [
          isMe ? avatarMine() : avatarFor(whoLabel, otherVoice),
          el("div", null, [
            el("div", { class: "sim-speaker-name" }, whoName),
            el("div", { class: "sim-speaker-tag" }, isMe ? "YOU — say it out loud" : "🤖 AI voice"),
          ]),
        ]);
        turnCard.appendChild(speakerRow);

        const bubble = el("div", { class: `sim-bubble ${isMe ? "mine" : "theirs"}` }, line.line);
        turnCard.appendChild(bubble);

        if (isMe) {
          turnCard.appendChild(el("div", { class: "sim-mine-hint" },
            "👆 Read this line out loud, then tap continue."));
          turnCard.appendChild(el("button", {
            class: "btn big primary sim-continue",
            onclick: () => advance(),
          }, step === dialogue.length - 1 ? "Finish Scene 🎬" : "I said it ✓ →"));
          stage.appendChild(turnCard);
          // Pre-fetch next "other" line while she's reading
          const next = dialogue[step + 1];
          if (next && next.who !== myRole) prefetchLine(step + 1);
        } else {
          const statusEl = el("div", { class: "sim-audio-status" }, "🔊 Loading voice…");
          turnCard.appendChild(statusEl);

          const controls = el("div", { class: "sim-audio-controls" }, [
            el("button", { class: "btn sm", onclick: () => playLine(statusEl) }, "▶ Replay"),
            el("button", { class: "btn primary sm", onclick: () => advance() }, "Continue →"),
          ]);
          turnCard.appendChild(controls);

          stage.appendChild(turnCard);
          playLine(statusEl);
        }
      }

      function prefetchLine(idx) {
        const line = dialogue[idx];
        if (!line) return;
        const cacheId = `sim:${conv.id}:${idx}:${otherVoice}`;
        AudioTTS.getOrCreate(cacheId, line.line, otherVoice).catch(() => {});
      }

      async function playLine(statusEl) {
        const line = dialogue[step];
        const cacheId = `sim:${conv.id}:${step}:${otherVoice}`;
        try {
          stopAudio();
          if (statusEl) statusEl.textContent = "🔊 Loading voice…";
          const url = await AudioTTS.getOrCreate(cacheId, line.line, otherVoice);
          audioEl = new Audio(url);
          audioEl.play().catch(() => {});
          if (statusEl) statusEl.textContent = "🎙 Listening…";
          audioEl.onended = () => {
            if (statusEl) statusEl.textContent = "✓ Tap Continue when ready";
          };
        } catch (e) {
          console.error("Sim audio error", e);
          if (statusEl) statusEl.textContent = "⚠ Audio failed — read it yourself, then continue";
        }
      }

      function advance() {
        stopAudio();
        step++;
        render();
      }

      function stopAudio() {
        if (audioEl) {
          try { audioEl.pause(); } catch (e) {}
          audioEl = null;
        }
      }

      function renderFinish() {
        State.incrementConvRepeats(w, d, conv.id);
        State.addXP(5, "Roleplay scene");

        const myCount = dialogue.filter((l) => l.who === myRole).length;
        const theirCount = dialogue.length - myCount;

        const card = el("div", { class: "sim-finish" }, [
          el("div", { class: "sim-confetti" }, [
            el("span", null, "🎉"), el("span", null, "✨"),
            el("span", null, "🎊"), el("span", null, "⭐"), el("span", null, "🎬"),
          ]),
          el("h1", { class: "sim-finish-title" }, "Scene Complete!"),
          el("p", { class: "sim-finish-sub" }, "Brilliant performance, Sahar! 👏"),
          el("div", { class: "sim-finish-stats" }, [
            statTile("Lines Spoken", myCount),
            statTile("Lines Heard", theirCount),
            statTile("XP Earned", "+5"),
          ]),
          el("div", { class: "row sim-finish-actions" }, [
            el("button", { class: "btn", onclick: () => { close(); onClose && onClose(); } }, "Close"),
            el("button", {
              class: "btn primary",
              onclick: () => { myRole = null; step = 0; render(); },
            }, "Play again 🎭"),
          ]),
        ]);
        stage.appendChild(card);
      }
    });

    const root = handle.root;
    const checkClose = setInterval(() => {
      if (!document.body.contains(root)) {
        clearInterval(checkClose);
        if (audioEl) { try { audioEl.pause(); } catch (e) {} audioEl = null; }
      }
    }, 1000);
  }

  /* ============================================================
     IMAGE STORY ROLEPLAY
  ============================================================ */
  function openStory(story, w, d, slot, imageData, sliceFn, onClose) {
    const scenes = story.scenes || [];
    let myRole = null;     // "A" | "B"
    let otherVoice = null;
    let step = 0;
    let audioEl = null;

    const handle = UI.modal((m, close) => {
      m.classList.add("sim-modal");
      const stage = el("div", { class: "sim-stage" });
      m.appendChild(stage);

      render();

      function render() {
        UI.clear(stage);
        stopAudio();
        m.classList.remove("sim-story-modal");
        if (myRole === null) renderIntro();
        else if (step >= scenes.length) renderFinish();
        else renderTurn();
      }

      function renderIntro() {
        const card = el("div", { class: "sim-intro" });
        card.appendChild(el("div", { class: "sim-act-label" }, "📖 STORY TIME"));
        card.appendChild(el("h1", { class: "sim-title" }, story.title));
        card.appendChild(el("p", { class: "sim-scenario" },
          "We'll take turns describing the 8 panels. Listen carefully when I describe — I'll use the words you need on your turn!"));

        card.appendChild(el("div", { class: "sim-cast-label" }, "Who starts?"));
        const cast = el("div", { class: "sim-cast-picker" }, [
          orderBtn("A", "You first", "1, 3, 5, 7"),
          el("div", { class: "sim-vs" }, "or"),
          orderBtn("B", "I go first", "2, 4, 6, 8"),
        ]);
        card.appendChild(cast);

        card.appendChild(el("div", { class: "sim-fineprint" },
          "Tip: borrow my structure on your turn — same grammar, your own version."));
        stage.appendChild(card);
      }

      function orderBtn(label, name, panels) {
        const isYou = label === "A";
        return el("button", {
          class: "sim-cast-btn",
          onclick: () => pickRole(label),
        }, [
          el("div", {
            class: "sim-avatar",
            style: `background: ${isYou ? "linear-gradient(135deg,#f59e0b,#d97706)" : "linear-gradient(135deg,#8b5cf6,#6d28d9)"}`,
          }, isYou ? "🎤" : "🤖"),
          el("div", { class: "sim-cast-name" }, name),
          el("div", { class: "sim-cast-tag" }, `Your panels: ${panels}`),
        ]);
      }

      function pickRole(label) {
        myRole = label;
        // If she picks A, AI is female (Bella). If B, AI is male (Brian).
        otherVoice = label === "A" ? AudioTTS.voices.bella : AudioTTS.voices.brian;
        step = 0;
        render();
        // Pre-fetch the AI's first panel description if it comes first
        const firstIsAI = (0 % 2 === 0 && myRole === "B") || (0 % 2 === 1 && myRole === "A");
        if (firstIsAI) prefetchScene(0);
      }

      function renderTurn() {
        const scene = scenes[step];
        const isMe =
          (step % 2 === 0 && myRole === "A") ||
          (step % 2 === 1 && myRole === "B");

        m.classList.add("sim-story-modal");

        stage.appendChild(el("div", { class: "sim-turn-header" }, [
          el("div", { class: "sim-progress" }, `Panel ${step + 1} / ${scenes.length}`),
          el("div", { class: "sim-progress-bar" }, [
            el("div", { class: "sim-progress-fill", style: `width:${((step + 1) / scenes.length) * 100}%` }),
          ]),
        ]));

        const grid = el("div", { class: "sim-story-grid" });

        // LEFT: panel image
        const panel = el("div", { class: "sim-story-panel" });
        if (imageData && sliceFn) {
          const cv = el("canvas");
          panel.appendChild(cv);
          try { sliceFn(cv, imageData, step, true); } catch (e) { console.error(e); }
        } else {
          panel.appendChild(el("div", { class: "empty muted", style: "padding:40px;text-align:center" }, "No image uploaded yet — go back and paste one."));
        }
        grid.appendChild(panel);

        // RIGHT: turn info
        const right = el("div", { class: "sim-story-right" });

        const turnBadge = el("div", { class: `sim-turn-badge ${isMe ? "mine" : "theirs"}` },
          isMe ? "🎤 YOUR TURN" : "🤖 LISTEN — my turn");
        right.appendChild(turnBadge);

        right.appendChild(el("h2", { class: "sim-scene-title" }, `Scene ${step + 1} — ${scene.title}`));

        const vocabRow = el("div", { class: "sim-vocab-row" },
          (scene.vocab || []).map((v) => el("span", { class: "chip" }, v)));
        right.appendChild(vocabRow);

        if (isMe) {
          const hintBox = el("div", { class: "sim-hint hidden" });
          right.appendChild(hintBox);

          right.appendChild(el("div", { class: "row", style: "gap:8px;margin-top:8px" }, [
            el("button", {
              class: "btn sm",
              onclick: () => {
                if (hintBox.classList.contains("hidden")) {
                  hintBox.textContent = "💡 " + (scene.hint || "");
                  hintBox.classList.remove("hidden");
                } else {
                  hintBox.textContent = "";
                  hintBox.classList.add("hidden");
                }
              },
            }, "Show hint"),
          ]));

          right.appendChild(el("div", { class: "sim-mine-hint", style: "margin-top:18px" },
            "👆 Describe this panel out loud using the words above. Aim for 2-3 full sentences!"));

          right.appendChild(el("button", {
            class: "btn big primary sim-continue",
            style: "margin-top:14px",
            onclick: () => advance(),
          }, step === scenes.length - 1 ? "Finish Story 🎬" : "I described it ✓ →"));

          // Pre-fetch next AI panel while she's describing
          const nextIsAI = ((step + 1) % 2 === 0 && myRole === "B") || ((step + 1) % 2 === 1 && myRole === "A");
          if (step + 1 < scenes.length && nextIsAI) prefetchScene(step + 1);
        } else {
          const subtitleBox = el("div", { class: "sim-subtitle" }, "🔊 Loading voice…");
          right.appendChild(subtitleBox);

          right.appendChild(el("div", { class: "sim-mine-hint", style: "margin-top:18px" },
            "👂 Listen carefully — borrow my structure when it's your turn."));

          right.appendChild(el("div", { class: "row", style: "gap:8px;margin-top:12px" }, [
            el("button", { class: "btn sm", onclick: () => playScene(subtitleBox) }, "▶ Replay"),
            el("button", {
              class: "btn primary sm",
              onclick: () => advance(),
            }, step === scenes.length - 1 ? "Finish Story 🎬" : "Your turn next →"),
          ]));

          playScene(subtitleBox);
        }

        grid.appendChild(right);
        stage.appendChild(grid);
      }

      function prefetchScene(idx) {
        const s = scenes[idx];
        if (!s || !s.description) return;
        const cacheId = `simstory:${story.id}:${idx}:${otherVoice}`;
        AudioTTS.getOrCreate(cacheId, s.description, otherVoice).catch(() => {});
      }

      async function playScene(subtitleBox) {
        const scene = scenes[step];
        if (!scene || !scene.description) {
          subtitleBox.textContent = "(no description available)";
          return;
        }
        const cacheId = `simstory:${story.id}:${step}:${otherVoice}`;
        try {
          stopAudio();
          subtitleBox.textContent = "🔊 Loading voice…";
          subtitleBox.classList.remove("playing");
          const url = await AudioTTS.getOrCreate(cacheId, scene.description, otherVoice);
          audioEl = new Audio(url);
          subtitleBox.textContent = scene.description;
          subtitleBox.classList.add("playing");
          audioEl.play().catch(() => {});
          audioEl.onended = () => { subtitleBox.classList.remove("playing"); };
        } catch (e) {
          console.error("Sim story audio error", e);
          subtitleBox.textContent = scene.description + "\n\n⚠ Audio failed — read it yourself.";
        }
      }

      function advance() {
        stopAudio();
        step++;
        render();
      }

      function stopAudio() {
        if (audioEl) {
          try { audioEl.pause(); } catch (e) {}
          audioEl = null;
        }
      }

      function renderFinish() {
        State.incrementConvRepeats(w, d, story.id + ":story");
        State.addXP(8, "Story roleplay");

        const myCount = Math.ceil(scenes.length / 2);
        const theirCount = scenes.length - myCount;

        const card = el("div", { class: "sim-finish" }, [
          el("div", { class: "sim-confetti" }, [
            el("span", null, "🎉"), el("span", null, "📖"),
            el("span", null, "🎊"), el("span", null, "⭐"), el("span", null, "🎬"),
          ]),
          el("h1", { class: "sim-finish-title" }, "Story Complete!"),
          el("p", { class: "sim-finish-sub" }, "You told the whole story together. 👏"),
          el("div", { class: "sim-finish-stats" }, [
            statTile("Your Panels", myCount),
            statTile("My Panels", theirCount),
            statTile("XP Earned", "+8"),
          ]),
          el("div", { class: "row sim-finish-actions" }, [
            el("button", { class: "btn", onclick: () => { close(); onClose && onClose(); } }, "Close"),
            el("button", {
              class: "btn primary",
              onclick: () => { myRole = null; step = 0; render(); },
            }, "Play again 🎭"),
          ]),
        ]);
        stage.appendChild(card);
      }
    });

    const root = handle.root;
    const checkClose = setInterval(() => {
      if (!document.body.contains(root)) {
        clearInterval(checkClose);
        if (audioEl) { try { audioEl.pause(); } catch (e) {} audioEl = null; }
      }
    }, 1000);
  }

  return { openConversation, openStory };
})();
