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
  main.appendChild(buildTranscriptCard(t));

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

  const playBtn = el("button", { class: "audio-play", title: "Play / Pause", text: "▶" });
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
  audio.addEventListener("play", () => { playBtn.textContent = "⏸"; });
  audio.addEventListener("pause", () => { playBtn.textContent = "▶"; });
  audio.addEventListener("ended", () => { playBtn.textContent = "▶"; });
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

function catEmojiL(c) {
  return c === "general" ? "🌍" : c === "scientific" ? "🔬" : c === "fashion" ? "🎨" : "🎧";
}
function catLabelL(c) {
  return c === "general" ? "General" : c === "scientific" ? "Science" : c === "fashion" ? "Art & Style" : c;
}
