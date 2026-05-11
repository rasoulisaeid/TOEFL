/* 100-Day Challenge — speaking task view.
 *
 * Flow:
 *   1. Show the subject + guide questions + vocab + handy expressions.
 *   2. Learner records audio (MediaRecorder). Auto-stops at 6 min.
 *   3. They can play it back or re-record.
 *   4. Submit → audio is sent to Gemini multimodal for structured feedback.
 *   5. Feedback panel: scores, vocab usage, grammar issues, native AmE
 *      alternatives, filler note, top priorities.
 */
window.Views = window.Views || {};

window.Views.challengeSpeak = function (mount, params) {
  const { el } = UI;
  UI.clear(mount);

  const dNum = parseInt(params.d, 10);
  const sIdx = parseInt(params.i, 10);
  const meta = (CHALLENGE100.days || []).find((x) => x.day === dNum);
  if (!meta || !meta.speaking[sIdx]) {
    mount.innerHTML = "<div class='card empty'>Speaking task not found.</div>";
    return;
  }
  const task = meta.speaking[sIdx];
  const taskState = Challenge.getTask(dNum, task.id);
  const savedPayload = (taskState && taskState.payload) || {};

  // ===== Header =====
  mount.appendChild(el("div", { class: "page-head" }, [
    el("div", null, [
      el("div", { class: "breadcrumb" }, [
        el("a", { onclick: () => (location.hash = "#/c") }, "Challenge"),
        " · ",
        el("a", { onclick: () => (location.hash = `#/c/day/${dNum}`) }, `Day ${dNum}`),
        " · ",
        el("span", null, `Speaking ${sIdx + 1}`),
      ]),
      el("h1", null, task.subject),
      el("div", { style: "margin-top:6px;display:flex;gap:8px;align-items:center;flex-wrap:wrap" }, [
        el("span", { class: `chip ${task.tone === "formal" ? "blue" : ""}` },
          task.tone === "formal" ? "Formal · Academic" : "General · Conversational"),
        el("span", { class: "chip muted" }, `${task.minutes || 5} minutes`),
      ]),
    ]),
    el("div", { class: "actions" }, [
      el("button", { class: "btn", onclick: () => (location.hash = `#/c/day/${dNum}`) }, "Back"),
    ]),
  ]));

  // ===== Layout: prompt | recorder + feedback =====
  const layout = el("div", { class: "speak-layout" });
  const left = el("div", { class: "col" });
  const right = el("div", { class: "col" });

  // === Prompt card ===
  left.appendChild(el("div", { class: "card" }, [
    el("div", { style: "font-weight:800;font-size:15px;margin-bottom:6px" }, "What to talk about"),
    el("div", null, task.prompt),
    task.guideQuestions && task.guideQuestions.length
      ? el("div", { style: "margin-top:14px" }, [
          el("div", { class: "muted", style: "font-weight:800;font-size:12px;letter-spacing:.06em;text-transform:uppercase" }, "Use these to keep going"),
          el("ul", { style: "padding-left:20px;margin:6px 0 0" },
            task.guideQuestions.map((q) => el("li", { style: "margin-bottom:4px" }, q))),
        ])
      : null,
  ]));

  // === Vocab card ===
  if (task.vocab && task.vocab.length) {
    const vocabCard = el("div", { class: "card" });
    vocabCard.appendChild(el("div", { class: "row" }, [
      el("div", { style: "font-weight:800;font-size:15px" }, "Words to use"),
      el("span", { class: "spacer" }),
      el("span", { class: "chip muted" }, `${task.vocab.length} items`),
    ]));
    vocabCard.appendChild(el("div", { class: "muted", style: "font-size:12px;margin-top:4px" },
      "Try to slip at least 6 of these into your talk. AI will tell you which you used naturally."));

    // Words grid — all visible at once
    const vocabGrid = el("div", {
      style: "display:flex;flex-wrap:wrap;gap:10px;margin-top:12px;padding:12px;background:var(--bg-2);border-radius:12px;border:1px solid var(--border)"
    });
    task.vocab.forEach((v) => {
      const inLeitner = Challenge.getCards().some((c) => c.word.toLowerCase() === v.w.toLowerCase());
      const btn = el("button", {
        class: "btn sm" + (inLeitner ? " ghost" : " primary"),
        text: inLeitner ? "✓" : "+",
      });
      btn.disabled = inLeitner;
      btn.addEventListener("click", () => {
        if (btn.disabled || btn.dataset.added === "1") return;
        Challenge.addCard({
          word: v.w,
          meaning: v.m || "",
          example: v.ex || "",
          pos: v.p || "",
          sourceDay: dNum,
        });
        btn.dataset.added = "1";
        btn.disabled = true;
        btn.classList.remove("primary");
        btn.classList.add("ghost");
        btn.textContent = "✓";
        UI.toast(`"${v.w}" saved`);
      });
      const chip = el("div", {
        style: "display:inline-flex;align-items:center;gap:6px;padding:8px 10px;background:var(--card);border:1.5px solid var(--border);border-radius:10px;font-size:13px;font-weight:700;white-space:nowrap"
      }, [
        el("span", null, v.w),
        btn,
      ]);
      vocabGrid.appendChild(chip);
    });
    vocabCard.appendChild(vocabGrid);
    left.appendChild(vocabCard);
  }

  // === Expressions card ===
  if (task.expressions && task.expressions.length) {
    left.appendChild(el("div", { class: "card" }, [
      el("div", { style: "font-weight:800;font-size:15px;margin-bottom:8px" }, "Handy expressions"),
      el("ul", { style: "padding-left:20px;margin:0" },
        task.expressions.map((e) => el("li", { style: "margin-bottom:4px;font-style:italic" }, e))),
    ]));
  }

  // === Recorder card ===
  const recorderState = {
    mediaStream: null,
    recorder: null,
    chunks: [],
    blob: savedPayload.audioBlob || null, // we don't persist actual blob across reloads (too big) — only the analysis
    audioUrl: null,
    started: 0,
    timerId: null,
    autoStopId: null,
    elapsed: 0,
  };

  const recorderCard = el("div", { class: "card recorder-card" });
  recorderCard.appendChild(el("div", { class: "row" }, [
    el("div", { style: "font-weight:800;font-size:15px" }, "Record yourself"),
    el("span", { class: "spacer" }),
    el("span", { class: "muted", style: "font-size:12px" }, "5 min target · auto-stops at 6 min"),
  ]));

  const status = el("div", { class: "rec-status" }, "Ready when you are.");
  const timer = el("div", { class: "rec-timer" }, "00:00");
  const liveLight = el("span", { class: "rec-light" });
  const recBtn = el("button", { class: "btn primary big rec-btn" }, "● Start recording");
  const stopBtn = el("button", { class: "btn rec-btn", style: "display:none" }, "■ Stop");
  const audioEl = el("audio", { controls: "controls", style: "width:100%;margin-top:12px;display:none" });
  const submitBtn = el("button", { class: "btn success big", style: "display:none" }, "✨ Get AI feedback");
  const reRecBtn = el("button", { class: "btn ghost", style: "display:none" }, "↺ Re-record");

  recorderCard.appendChild(el("div", { class: "rec-row" }, [liveLight, timer, status]));
  recorderCard.appendChild(el("div", { class: "rec-row", style: "margin-top:14px;gap:10px;flex-wrap:wrap" }, [recBtn, stopBtn, reRecBtn]));
  recorderCard.appendChild(audioEl);
  recorderCard.appendChild(el("div", { class: "row", style: "margin-top:14px;justify-content:flex-end" }, [submitBtn]));
  right.appendChild(recorderCard);

  // === Feedback container (filled after Gemini call) ===
  const feedbackContainer = el("div");
  right.appendChild(feedbackContainer);

  // If saved analysis exists, render it
  if (savedPayload.analysis) {
    renderAnalysis(savedPayload.analysis, feedbackContainer, () => {
      Challenge.setTaskDone(dNum, task.id, true);
      Challenge.pingStreak();
      Challenge.addXP(10, "Speaking complete");
      UI.toast("Marked complete ✓");
      setTimeout(() => (location.hash = `#/c/day/${dNum}`), 600);
    });
  }

  // ===== Recorder wire-up =====
  function fmt(s) {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const r = (s % 60).toString().padStart(2, "0");
    return `${m}:${r}`;
  }

  function tickTimer() {
    recorderState.elapsed = Math.floor((Date.now() - recorderState.started) / 1000);
    timer.textContent = fmt(recorderState.elapsed);
  }

  async function startRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      UI.toast("This browser doesn't support audio recording.");
      return;
    }
    try {
      recorderState.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      console.error(e);
      UI.toast("Microphone permission denied.");
      return;
    }
    const mime = pickMime();
    recorderState.recorder = new MediaRecorder(recorderState.mediaStream, mime ? { mimeType: mime } : undefined);
    recorderState.chunks = [];
    recorderState.recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) recorderState.chunks.push(e.data);
    };
    recorderState.recorder.onstop = onStop;
    recorderState.recorder.start();
    recorderState.started = Date.now();
    recorderState.elapsed = 0;
    timer.textContent = "00:00";
    status.textContent = "Recording… speak naturally.";
    liveLight.classList.add("on");
    recorderState.timerId = setInterval(tickTimer, 250);
    // Hard auto-stop at 6 minutes
    recorderState.autoStopId = setTimeout(() => {
      if (recorderState.recorder && recorderState.recorder.state === "recording") {
        UI.toast("6-minute cap reached — stopping.");
        stopRecording();
      }
    }, 6 * 60 * 1000);
    recBtn.style.display = "none";
    stopBtn.style.display = "";
  }

  function stopRecording() {
    if (recorderState.recorder && recorderState.recorder.state === "recording") {
      recorderState.recorder.stop();
    }
    if (recorderState.timerId) { clearInterval(recorderState.timerId); recorderState.timerId = null; }
    if (recorderState.autoStopId) { clearTimeout(recorderState.autoStopId); recorderState.autoStopId = null; }
    if (recorderState.mediaStream) {
      recorderState.mediaStream.getTracks().forEach((t) => t.stop());
      recorderState.mediaStream = null;
    }
    liveLight.classList.remove("on");
    stopBtn.style.display = "none";
  }

  function onStop() {
    const mime = (recorderState.recorder && recorderState.recorder.mimeType) || "audio/webm";
    const blob = new Blob(recorderState.chunks, { type: mime });
    recorderState.blob = blob;
    if (recorderState.audioUrl) URL.revokeObjectURL(recorderState.audioUrl);
    recorderState.audioUrl = URL.createObjectURL(blob);
    audioEl.src = recorderState.audioUrl;
    audioEl.style.display = "block";
    status.textContent = `Captured ${fmt(recorderState.elapsed)} of audio. Play it back or submit for feedback.`;
    submitBtn.style.display = "";
    reRecBtn.style.display = "";
    recBtn.style.display = "none";
  }

  function pickMime() {
    const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"];
    for (const c of candidates) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(c)) return c;
    }
    return "";
  }

  recBtn.onclick = startRecording;
  stopBtn.onclick = stopRecording;
  reRecBtn.onclick = () => {
    if (recorderState.audioUrl) { URL.revokeObjectURL(recorderState.audioUrl); recorderState.audioUrl = null; }
    audioEl.style.display = "none";
    submitBtn.style.display = "none";
    reRecBtn.style.display = "none";
    recBtn.style.display = "";
    timer.textContent = "00:00";
    status.textContent = "Ready when you are.";
    recorderState.blob = null;
    recorderState.chunks = [];
    UI.clear(feedbackContainer);
  };

  submitBtn.onclick = async () => {
    if (!recorderState.blob) {
      UI.toast("Record something first.");
      return;
    }
    const apiKey = (localStorage.getItem("gemini:key") || "").trim();
    if (!apiKey) {
      UI.toast("Set your Gemini API key in the sidebar settings first.", 4000);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending audio…";
    UI.clear(feedbackContainer);
    const thinking = el("div", { class: "thinking", style: "margin-top:14px" }, "Listening to your audio and writing feedback…");
    feedbackContainer.appendChild(thinking);

    try {
      const audioBase64 = await blobToBase64(recorderState.blob);
      const mimeType = (recorderState.blob.type || "audio/webm").split(";")[0]; // strip codec
      const analysis = await Gemini.analyzeSpeakingAudio({
        audioBase64,
        mimeType,
        subject: task.subject,
        vocab: task.vocab || [],
        tone: task.tone,
        level: task.level || "B2-C1",
      });
      thinking.remove();
      if (!analysis || analysis._raw) {
        feedbackContainer.appendChild(el("div", { class: "card empty" }, [
          el("div", { style: "color:var(--red);font-weight:700" }, "Couldn't parse Gemini's reply."),
          el("pre", { style: "white-space:pre-wrap;font-size:12px;margin-top:8px" }, (analysis && analysis._raw) || ""),
        ]));
        submitBtn.disabled = false;
        submitBtn.textContent = "✨ Get AI feedback";
        return;
      }
      // Persist analysis (without the audio blob — too large for localStorage)
      Challenge.setTaskPayload(dNum, task.id, { analysis, recordedAt: new Date().toISOString() });
      renderAnalysis(analysis, feedbackContainer, () => {
        Challenge.setTaskDone(dNum, task.id, true);
        Challenge.pingStreak();
        Challenge.addXP(10, "Speaking complete");
        UI.toast("Marked complete ✓");
        setTimeout(() => (location.hash = `#/c/day/${dNum}`), 600);
      });
      submitBtn.style.display = "none";
    } catch (e) {
      console.error(e);
      thinking.remove();
      feedbackContainer.appendChild(el("div", { class: "card empty" }, [
        el("div", { style: "color:var(--red);font-weight:700" }, "Analysis failed"),
        el("div", { class: "muted", style: "margin-top:6px" }, (e && e.message) || String(e)),
      ]));
      submitBtn.disabled = false;
      submitBtn.textContent = "✨ Get AI feedback";
    }
  };

  layout.appendChild(left);
  layout.appendChild(right);
  mount.appendChild(layout);
};

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const dataUrl = r.result || "";
      const idx = String(dataUrl).indexOf(",");
      resolve(idx >= 0 ? String(dataUrl).slice(idx + 1) : String(dataUrl));
    };
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

function renderAnalysis(a, container, onComplete) {
  const { el } = UI;
  UI.clear(container);
  const scores = a.scores || {};
  const card = el("div", { class: "card feedback-card" });

  // Summary
  card.appendChild(el("div", { class: "fb-summary" }, [
    el("div", { class: "fb-label" }, "✨ Overall"),
    el("div", { style: "margin-top:6px" }, a.summary || ""),
  ]));

  // Scores
  const scoreRow = el("div", { class: "fb-scores" });
  [
    ["Fluency",       scores.fluency],
    ["Pronunciation", scores.pronunciation],
    ["Grammar",       scores.grammar],
    ["Vocabulary",    scores.vocabulary],
    ["Coherence",     scores.coherence],
  ].forEach(([lbl, v]) => {
    const val = (v == null) ? "—" : v;
    scoreRow.appendChild(el("div", { class: "fb-score" }, [
      el("div", { class: "fb-score-val" }, String(val) + (v == null ? "" : "/10")),
      el("div", { class: "fb-score-lbl" }, lbl),
    ]));
  });
  card.appendChild(scoreRow);

  // Vocab usage
  if (Array.isArray(a.vocabUsage) && a.vocabUsage.length) {
    card.appendChild(el("div", { class: "fb-section-title" }, "🎯 Vocabulary usage"));
    const ul = el("ul", { class: "fb-list" });
    a.vocabUsage.forEach((v) => {
      const icon = !v.used ? "○" : (v.correctlyUsed ? "✓" : "△");
      const cls = !v.used ? "muted" : (v.correctlyUsed ? "ok" : "warn");
      ul.appendChild(el("li", { class: cls }, [
        el("span", { class: "fb-mark" }, icon),
        el("b", null, v.word || ""),
        v.comment ? el("span", { class: "muted", style: "margin-left:6px" }, "— " + v.comment) : null,
      ]));
    });
    card.appendChild(ul);
  }

  // Grammar issues
  if (Array.isArray(a.grammarIssues) && a.grammarIssues.length) {
    card.appendChild(el("div", { class: "fb-section-title" }, "📐 Grammar — fix these"));
    a.grammarIssues.forEach((g) => {
      card.appendChild(el("div", { class: "fb-diff" }, [
        el("div", { class: "diff-bad" }, [el("span", { class: "diff-tag" }, "You said"), el("span", null, g.youSaid || "")]),
        el("div", { class: "diff-good" }, [el("span", { class: "diff-tag" }, "Better"), el("span", null, g.shouldBe || "")]),
        g.rule ? el("div", { class: "muted", style: "font-size:13px;margin-top:4px" }, "Rule: " + g.rule) : null,
      ]));
    });
  }

  // Grammar strengths
  if (Array.isArray(a.grammarStrengths) && a.grammarStrengths.length) {
    card.appendChild(el("div", { class: "fb-section-title" }, "💪 Grammar wins"));
    const ul = el("ul", { class: "fb-list" });
    a.grammarStrengths.forEach((s) => ul.appendChild(el("li", { class: "ok" }, s)));
    card.appendChild(ul);
  }

  // Native AmE alternatives
  if (Array.isArray(a.nativeAlternatives) && a.nativeAlternatives.length) {
    card.appendChild(el("div", { class: "fb-section-title" }, "🇺🇸 More native-sounding (American English)"));
    a.nativeAlternatives.forEach((n) => {
      card.appendChild(el("div", { class: "fb-diff" }, [
        el("div", { class: "diff-bad" }, [el("span", { class: "diff-tag" }, "You said"), el("span", null, n.youSaid || "")]),
        el("div", { class: "diff-good" }, [el("span", { class: "diff-tag" }, "Native AmE"), el("span", null, n.nativeAmE || "")]),
        n.why ? el("div", { class: "muted", style: "font-size:13px;margin-top:4px" }, n.why) : null,
      ]));
    });
  }

  // Fillers
  if (a.fillersAndHesitations) {
    card.appendChild(el("div", { class: "fb-section-title" }, "🌫 Filler words / hesitations"));
    card.appendChild(el("div", { class: "muted" }, a.fillersAndHesitations));
  }

  // Top priorities
  if (Array.isArray(a.topPriorities) && a.topPriorities.length) {
    card.appendChild(el("div", { class: "fb-section-title" }, "⚡ Focus next time"));
    const ul = el("ul", { class: "fb-list priorities" });
    a.topPriorities.forEach((p) => ul.appendChild(el("li", null, p)));
    card.appendChild(ul);
  }

  // Mark complete
  card.appendChild(el("div", { class: "row", style: "margin-top:18px;justify-content:flex-end" }, [
    el("button", { class: "btn success", onclick: onComplete }, "Mark complete →"),
  ]));

  container.appendChild(card);
}
