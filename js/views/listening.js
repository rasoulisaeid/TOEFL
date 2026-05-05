/* Listening view — 3 audio tasks per day with ElevenLabs TTS + MCQ */
window.Views = window.Views || {};
window.Views.listening = function (mount, params) {
  const { el } = UI;
  const w = parseInt(params.w, 10);
  const d = parseInt(params.d, 10);
  const data = w === 1 ? WEEK1_LISTENING : null;
  const dayContent = data && data.days[d - 1];
  if (!dayContent) { mount.innerHTML = "<div class='empty'>Listening for this day isn't available yet.</div>"; return; }

  UI.clear(mount);

  let activeIdx = parseInt(sessionStorage.getItem(`li:active:${w}:${d}`) || "0", 10);
  if (activeIdx < 0 || activeIdx >= dayContent.tasks.length) activeIdx = 0;

  const head = el("div", { class: "page-head" }, [
    el("div", null, [
      el("div", { class: "breadcrumb" }, [
        el("a", { onclick: () => location.hash = "#/dashboard" }, "Dashboard"), " · ",
        el("a", { onclick: () => location.hash = "#/week/" + w }, `Week ${w}`), " · ",
        el("a", { onclick: () => location.hash = `#/week/${w}/day/${d}` }, `Day ${d}`), " · ",
        el("span", null, "Listening"),
      ]),
      el("h1", null, "Listening practice"),
      el("div", { class: "muted", style: "margin-top:6px" }, "Three short clips voiced by ElevenLabs. Listen first; the transcript is hidden until you ask for it."),
    ]),
    el("div", { class: "actions" }, [
      el("button", { class: "btn", onclick: () => location.hash = `#/week/${w}/day/${d}` }, "Back"),
    ]),
  ]);
  mount.appendChild(head);

  const tabsRow = el("div", { class: "reading-tabs" });
  dayContent.tasks.forEach((t, i) => {
    const done = State.getDay(w, d).tasks[t.id] && State.getDay(w, d).tasks[t.id].done;
    const btn = el("button", {
      class: i === activeIdx ? "active" : "",
      onclick: () => { activeIdx = i; sessionStorage.setItem(`li:active:${w}:${d}`, i); render(); },
    }, [
      el("span", { class: "cat-icon" }, catEmojiL(t.category)),
      el("span", null, catLabelL(t.category)),
      done ? el("span", { class: "cat-done", text: " ✓" }) : null,
    ]);
    tabsRow.appendChild(btn);
  });
  mount.appendChild(tabsRow);

  const body = el("div");
  mount.appendChild(body);

  function render() {
    UI.clear(body);
    Array.from(tabsRow.children).forEach((btn, i) => btn.classList.toggle("active", i === activeIdx));
    body.appendChild(buildListening(w, d, dayContent.tasks[activeIdx]));
  }
  render();
};

function buildListening(w, d, t) {
  const { el } = UI;
  const wrap = el("div", { class: "col" });

  wrap.appendChild(el("div", { class: "card" }, [
    el("div", { class: "row" }, [
      el("span", { class: `cat-pill ${t.category}` }, [
        el("span", null, catEmojiL(t.category)), " ", catLabelL(t.category),
      ]),
      el("span", { class: "spacer" }),
      el("button", { class: "btn sm", onclick: () => openSettings() }, "⚙ API key"),
    ]),
    el("h2", { style: "margin:10px 0 4px;font-size:24px" }, t.title),
    t.intro ? el("div", { class: "muted", style: "margin-bottom:10px" }, t.intro) : null,
  ]));

  const layout = el("div", { class: "reading-layout" });
  const main = el("div", { class: "col" });
  const side = el("div", { class: "col" });

  main.appendChild(buildAudioCard(t));

  // Dictation Challenge
  main.appendChild(el("div", { class: "section-title" }, "Dictation challenge"));
  main.appendChild(buildDictationCard(t));

  // MCQ
  main.appendChild(el("div", { class: "section-title" }, "Quick comprehension check"));
  main.appendChild(MCQ.build({
    questions: t.mcqs,
    storageKey: `mcq:${t.id}`,
    onComplete: (score, total) => {
      if (score >= Math.ceil(total * 0.67)) {
        State.setTaskDone(w, d, t.id, true);
        State.pingStreak();
        UI.toast(`Listening complete · ${score}/${total} ✓`);
      } else {
        UI.toast(`${score}/${total} — listen again whenever you like!`);
      }
    },
  }));

  // Sidebar — vocab
  side.appendChild(buildVocabCard(t.vocab, w, d, "Listening vocabulary"));

  layout.appendChild(main);
  layout.appendChild(side);
  wrap.appendChild(layout);
  return wrap;
}

function buildAudioCard(t) {
  const { el } = UI;
  const card = el("div", { class: "audio-card" });

  const voiceId = WEEK1_LISTENING.voices[t.category] || AudioTTS.voices[t.category];
  const audio = new Audio();
  audio.preload = "metadata";

  const playBtn = el("button", { class: "audio-play", title: "Play / Pause", html: '<span class="material-symbols-rounded">play_arrow</span>' });
  const progress = el("div", { class: "audio-progress" }, el("div"));
  const time = el("span", { class: "audio-time" }, "0:00 / —:—");

  const status = el("div", { class: "audio-status" });
  const speedRow = el("div", { class: "audio-speed" });
  [0.85, 1.0, 1.25].forEach((s) => {
    const b = el("button", { class: s === 1.0 ? "active" : "", text: s + "×", onclick: () => {
      audio.playbackRate = s;
      Array.from(speedRow.children).forEach((bb) => bb.classList.toggle("active", bb === b));
    }});
    speedRow.appendChild(b);
  });

  card.appendChild(el("div", { class: "audio-controls" }, [playBtn, progress, time]));
  card.appendChild(el("div", { class: "row" }, [status, el("span", { class: "spacer" }), speedRow]));

  let loading = false;
  let loaded = false;

  async function ensureLoaded() {
    if (loaded || loading) return;
    loading = true;
    setStatus("Generating audio… (first time only)", false);
    playBtn.disabled = true;
    try {
      const url = await AudioTTS.getOrCreate(t.id, t.text, voiceId);
      audio.src = url;
      loaded = true;
      setStatus("Ready ✓", false);
    } catch (e) {
      console.error(e);
      setStatus("Failed: " + (e.message || "request error"), true);
    } finally {
      loading = false;
      playBtn.disabled = false;
    }
  }

  function setStatus(msg, isError) {
    UI.clear(status);
    status.classList.toggle("error", !!isError);
    status.appendChild(document.createTextNode(msg));
  }

  // Pre-check cache
  AudioTTS.isCached(t.id).then((cached) => {
    if (cached) {
      ensureLoaded();
    } else {
      setStatus("Tap play to generate audio (uses ElevenLabs)", false);
    }
  });

  playBtn.addEventListener("click", async () => {
    if (!loaded) await ensureLoaded();
    if (!loaded) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });
  audio.addEventListener("play", () => { playBtn.innerHTML = '<span class="material-symbols-rounded">pause</span>'; });
  audio.addEventListener("pause", () => { playBtn.innerHTML = '<span class="material-symbols-rounded">play_arrow</span>'; });
  audio.addEventListener("ended", () => { playBtn.innerHTML = '<span class="material-symbols-rounded">play_arrow</span>'; });
  audio.addEventListener("loadedmetadata", () => updateTime());
  audio.addEventListener("timeupdate", () => updateTime());
  progress.addEventListener("click", (e) => {
    if (!loaded || !audio.duration) return;
    const rect = progress.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  });
  function updateTime() {
    const cur = audio.currentTime || 0;
    const dur = audio.duration || 0;
    const bar = progress.firstChild;
    bar.style.width = dur ? Math.round((cur / dur) * 100) + "%" : "0%";
    time.textContent = fmt(cur) + " / " + (dur ? fmt(dur) : "—:—");
  }
  function fmt(s) {
    if (!isFinite(s)) return "—:—";
    s = Math.floor(s);
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }

  card.appendChild(el("div", { class: "row", style: "margin-top:4px" }, [
    el("span", { class: "muted", style: "font-size:12px" }, `Voice: ${voiceId.slice(0, 6)}…`),
    el("span", { class: "spacer" }),
    el("button", { class: "btn sm ghost", onclick: async () => {
      if (!confirm("Re-generate audio? This makes a new API call.")) return;
      await AudioTTS.clearCache(t.id);
      audio.src = "";
      loaded = false;
      ensureLoaded();
    }}, "Re-generate"),
  ]));

  return card;
}

function buildTranscriptCard(t) {
  const { el } = UI;
  const card = el("div", { class: "card" });
  const row = el("div", { class: "row" }, [
    el("div", { style: "font-weight:700;font-size:15px" }, "Transcript"),
    el("span", { class: "spacer" }),
    el("button", { class: "btn sm", onclick: () => transcript.classList.toggle("hidden") }, "Show / hide"),
  ]);
  card.appendChild(row);
  const transcript = el("div", { class: "transcript hidden" }, UI.clickableText(t.text, WordLookup.lookup));
  card.appendChild(transcript);
  card.appendChild(el("div", { class: "muted", style: "font-size:12px;margin-top:6px" }, "Tip: try listening twice without the transcript first."));
  return card;
}

function openSettings() {
  UI.modal((m, close) => {
    const cur = AudioTTS.getKey();
    const inp = UI.el("input", { value: cur, placeholder: "ElevenLabs API key" });
    inp.style.width = "100%";
    m.appendChild(UI.el("h2", null, "ElevenLabs API key"));
    m.appendChild(UI.el("div", { class: "muted", style: "margin-bottom:10px" }, "Audio generation runs through ElevenLabs. The default key is shared in this app, but you can swap it for your own."));
    m.appendChild(inp);
    m.appendChild(UI.el("div", { class: "modal-actions" }, [
      UI.el("button", { class: "btn", text: "Cancel", onclick: close }),
      UI.el("button", { class: "btn ghost danger", text: "Reset to default", onclick: () => {
        AudioTTS.setKey(AudioTTS.DEFAULT_KEY);
        UI.toast("Reset");
        close();
      }}),
      UI.el("button", { class: "btn primary", text: "Save", onclick: () => {
        AudioTTS.setKey(inp.value.trim() || AudioTTS.DEFAULT_KEY);
        UI.toast("Saved");
        close();
      }}),
    ]));
  });
}

/* ============================================================
   DICTATION CHALLENGE — fill-in-the-blank listening exercise
   ============================================================ */
const SKIP_WORDS = new Set([
  "a","an","the","i","is","am","are","was","were","be","been","being",
  "in","on","at","to","of","for","by","it","its","and","or","but","not",
  "my","me","we","us","he","she","him","her","his","they","them","so","do",
  "if","as","no","up","out","all","had","has","have","did","that","this",
  "with","from","will","can","just","very","too","also","than","then",
]);

function tokenizeForDictation(text) {
  // Split into tokens preserving punctuation and whitespace
  const raw = text.split(/(\s+|[.,!?;:()""''\-—])/);
  return raw.map((token, idx) => {
    const clean = token.replace(/[^a-zA-Z'-]/g, "").toLowerCase();
    const isWord = /^[a-zA-Z'-]{4,}$/.test(token.trim());
    const isSkipped = SKIP_WORDS.has(clean);
    return { raw: token, clean, idx, isWord: isWord && !isSkipped };
  });
}

function selectBlanks(tokens, ratio = 0.5) {
  const eligible = tokens.filter(t => t.isWord);
  const count = Math.round(eligible.length * ratio);
  // Deterministic shuffle using simple hash
  const shuffled = eligible.slice().sort((a, b) => {
    const ha = (a.idx * 2654435761) >>> 0;
    const hb = (b.idx * 2654435761) >>> 0;
    return ha - hb;
  });
  const selected = new Set(shuffled.slice(0, count).map(t => t.idx));
  return selected;
}

function buildDictationCard(t) {
  const { el } = UI;
  const card = el("div", { class: "card dictation-card" });
  const storageKey = `dictation:v3:${t.id}`;
  const cacheKey = `dictation:distractors:v3:${t.id}`;

  // Header
  card.appendChild(el("div", { class: "row" }, [
    el("span", { class: "material-symbols-rounded", style: "font-size:22px;color:var(--blue)" }, "hearing"),
    el("div", { style: "font-weight:700;font-size:15px" }, "Fill in the blanks"),
    el("span", { class: "spacer" }),
    el("span", { class: "chip muted" }, "~50% hidden"),
  ]));
  card.appendChild(el("div", { class: "muted", style: "font-size:12px;margin-top:4px;margin-bottom:14px" }, "Listen and pick the correct word from each pair to fill the numbered blanks."));

  const body = el("div", { class: "dictation-body" });
  card.appendChild(body);

  const tokens = tokenizeForDictation(t.text);
  const blankIndices = selectBlanks(tokens);
  const blankedWords = tokens.filter(tk => blankIndices.has(tk.idx)).map(tk => tk.clean);

  let state = Storage.get(storageKey, { answers: {}, completed: false });
  const cached = Storage.get(cacheKey, null);

  if (cached) {
    renderDictation(body, tokens, blankIndices, cached, state, storageKey);
  } else {
    const loading = el("div", { class: "thinking" }, "Generating exercise with Gemini Pro...");
    body.appendChild(loading);
    Gemini.generateDistractors(blankedWords).then(distractors => {
      Storage.set(cacheKey, distractors);
      UI.clear(body);
      renderDictation(body, tokens, blankIndices, distractors, state, storageKey);
    }).catch(err => {
      UI.clear(body);
      body.appendChild(el("div", { class: "muted", style: "text-align:center;padding:20px" }, "Failed to generate exercise. " + (err.message || "")));
    });
  }

  return card;
}

function renderDictation(body, tokens, blankIndices, distractors, state, storageKey) {
  const { el } = UI;
  UI.clear(body);

  // Number the blanks
  const blankList = [];
  let num = 0;
  const blankMap = {}; // idx -> { num, correctWord, correctLower, distractor }
  tokens.forEach(tk => {
    if (blankIndices.has(tk.idx)) {
      num++;
      const correctWord = tk.raw.trim();
      const correctLower = tk.clean;
      const distractor = distractors[correctLower] || fallbackDistractor(correctLower);
      blankMap[tk.idx] = { num, correctWord, correctLower, distractor };
      blankList.push({ num, idx: tk.idx, correctWord, correctLower, distractor });
    }
  });

  const totalBlanks = blankList.length;

  // Score
  const scoreLabel = el("span", { class: "muted", style: "font-size:13px" });
  const scoreBar = el("div", { class: "dictation-score-bar" });
  const scoreFill = el("div");
  scoreBar.appendChild(scoreFill);

  const blankElements = {}; // idx -> DOM element for the blank in the passage

  function updateScore() {
    const correctCount = Object.values(state.answers).filter(a => a === true).length;
    scoreLabel.textContent = `${correctCount} / ${totalBlanks} correct`;
    const pct = totalBlanks > 0 ? Math.round((correctCount / totalBlanks) * 100) : 0;
    scoreFill.style.width = pct + "%";
    if (correctCount === totalBlanks && !state.completed) {
      state.completed = true;
      Storage.set(storageKey, state);
      UI.toast("🎉 Dictation complete!");
    }
  }

  body.appendChild(el("div", { class: "row", style: "margin-bottom:12px" }, [
    scoreLabel, el("span", { class: "spacer" }), scoreBar,
    el("button", { class: "btn sm ghost", style: "margin-left:8px", onclick: () => {
      state.answers = {};
      state.completed = false;
      Storage.set(storageKey, state);
      renderDictation(body, tokens, blankIndices, distractors, state, storageKey);
    }}, "Reset"),
  ]));

  // === WORD BANK (pairs box above the passage) ===
  const wordBank = el("div", { class: "dict-word-bank" });
  wordBank.appendChild(el("div", { class: "dict-bank-label" }, "Word bank — pick the correct word"));

  const pairsWrap = el("div", { class: "dict-pairs" });

  blankList.forEach(b => {
    const answered = state.answers[b.idx];
    const pairEl = el("div", { class: "dict-pair" + (answered != null ? " answered" : "") });
    pairEl.appendChild(el("span", { class: "dict-pair-num" }, String(b.num)));

    // Build two options, shuffled
    const options = [
      { text: b.correctWord, isCorrect: true },
      { text: b.distractor, isCorrect: false },
    ];
    if ((b.idx * 7) % 3 !== 0) options.reverse();

    if (answered != null) {
      // Already answered — show result
      options.forEach(opt => {
        const cls = opt.isCorrect ? "dict-pair-word correct" : "dict-pair-word faded";
        pairEl.appendChild(el("span", { class: cls }, opt.text));
      });
    } else {
      // Clickable options
      options.forEach(opt => {
        const btn = el("button", {
          class: "dict-pair-word clickable",
          text: opt.text,
          onclick: () => {
            state.answers[b.idx] = opt.isCorrect;
            Storage.set(storageKey, state);
            // Update the blank in passage
            const blankEl = blankElements[b.idx];
            if (blankEl) {
              UI.clear(blankEl);
              blankEl.textContent = b.correctWord;
              blankEl.className = "dict-blank " + (opt.isCorrect ? "correct" : "revealed");
            }
            // Update the pair
            UI.clear(pairEl);
            pairEl.classList.add("answered");
            pairEl.appendChild(el("span", { class: "dict-pair-num" }, String(b.num)));
            options.forEach(o => {
              const cls = o.isCorrect ? "dict-pair-word correct" : "dict-pair-word faded";
              pairEl.appendChild(el("span", { class: cls }, o.text));
            });
            updateScore();
          }
        });
        pairEl.appendChild(btn);
      });
    }

    pairsWrap.appendChild(pairEl);
  });

  wordBank.appendChild(pairsWrap);
  body.appendChild(wordBank);

  // === PASSAGE with numbered blanks ===
  const passage = el("div", { class: "dictation-passage" });

  tokens.forEach(tk => {
    if (blankIndices.has(tk.idx)) {
      const b = blankMap[tk.idx];
      const answered = state.answers[tk.idx];
      let cls = "dict-blank";
      let text;

      if (answered === true) {
        cls += " correct";
        text = b.correctWord;
      } else if (answered === false) {
        cls += " revealed";
        text = b.correctWord;
      } else {
        text = "";
      }

      const blankEl = el("span", { class: cls });
      if (text) {
        blankEl.textContent = text;
      } else {
        blankEl.appendChild(el("span", { class: "dict-blank-num" }, String(b.num)));
        blankEl.appendChild(el("span", { class: "dict-blank-line" }));
      }
      blankElements[tk.idx] = blankEl;
      passage.appendChild(blankEl);
    } else {
      passage.appendChild(document.createTextNode(tk.raw));
    }
  });

  body.appendChild(passage);
  updateScore();
}

// Real English words as fallback distractors
const FALLBACK_POOL = {
  verb: ["think","believe","wonder","notice","expect","imagine","decide","suggest","consider","realize","understand","discover","explain","describe","mention","recall","forget","prefer","enjoy","avoid"],
  noun: ["moment","reason","feeling","thought","option","method","detail","pattern","signal","habit","effort","result","chance","factor","nature","period","memory","purpose","context","source"],
  adj:  ["quiet","simple","gentle","common","sudden","recent","likely","slight","entire","proper","normal","steady","actual","narrow","bitter","bright","clever","empty","smooth","rough"],
  misc: ["morning","evening","kitchen","window","garden","corner","bridge","forest","market","bottle","letter","mirror","basket","candle","pillow","shadow","silver","golden","flavor","shelter"]
};
const ALL_FALLBACKS = [].concat(...Object.values(FALLBACK_POOL));

function fallbackDistractor(word) {
  const len = word.length;
  const candidates = ALL_FALLBACKS.filter(w => Math.abs(w.length - len) <= 2 && w !== word);
  if (candidates.length === 0) return ALL_FALLBACKS[word.charCodeAt(0) % ALL_FALLBACKS.length];
  return candidates[(word.charCodeAt(0) + word.charCodeAt(Math.min(1, word.length - 1))) % candidates.length];
}

function catEmojiL(c) {
  return c === "general" ? "🌍" : c === "scientific" ? "🔬" : c === "fashion" ? "🎨" : "🎧";
}
function catLabelL(c) {
  return c === "general" ? "General" : c === "scientific" ? "Science" : c === "fashion" ? "Art & Style" : c;
}
