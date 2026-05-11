/* Gemini API integration for word analysis + writing refinement */
window.Gemini = (function() {
  const MODEL = "gemini-3.1-pro-preview";
  const FALLBACK_MODELS = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"];

  function getKey() {
    const configKey = (window.CONFIG && window.CONFIG.GEMINI_API_KEY) || "";
    const stored = localStorage.getItem("gemini:key");
    const final = (stored && typeof stored === "string" && stored.trim() !== "") ? stored : configKey;
    
    if (!final && !window._keyWarned) {
      window._keyWarned = true;
      console.warn("⚠️ No Gemini API key found.");
      setTimeout(() => {
        if (window.UI && UI.toast) UI.toast("AI Settings: Please set your Gemini API key.", 10000);
      }, 3000);
    }
    return final;
  }
  function url(model) {
    return `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${getKey()}`;
  }

  async function callRaw(prompt, opts = {}) {
    const tryModels = [opts.model || MODEL].concat(FALLBACK_MODELS).filter((m, i, a) => a.indexOf(m) === i);
    let lastErr;
    for (const m of tryModels) {
      try {
        const res = await fetch(url(m), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: opts.temperature != null ? opts.temperature : 0.3,
              responseMimeType: opts.json ? "application/json" : undefined,
            },
          }),
        });
        if (!res.ok) {
          if (res.status === 404) { lastErr = new Error("model_not_found:" + m); continue; }
          const t = await res.text().catch(() => "");
          throw new Error(`Gemini ${res.status}: ${t.slice(0,200)}`);
        }
        const data = await res.json();
        const text = (((data.candidates || [])[0] || {}).content || {}).parts || [];
        return text.map((p) => p.text || "").join("");
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error("Gemini call failed");
  }

  async function callJSON(prompt, opts = {}) {
    const raw = await callRaw(prompt, Object.assign({ json: true }, opts));
    try { return JSON.parse(raw); }
    catch (e) {
      const m = raw.match(/\{[\s\S]*\}/);
      if (m) { try { return JSON.parse(m[0]); } catch (e2) {} }
      return { _raw: raw };
    }
  }

  return {
    async analyzeWord(word) {
      const prompt = `Return a JSON object for the English word "${word}" with these fields: "word", "meaning" (concise Persian definition), "example" (a simple English sentence using the word), and "pos" (part of speech). Provide ONLY the raw JSON string.`;
      try {
        return await callJSON(prompt, { temperature: 0.1 });
      } catch (e) {
        console.error("🔴 Gemini Analysis failed:", e.message);
        return null;
      }
    },

    /**
     * Refine a single sentence/short paragraph for a B1 learner.
     * Returns { corrected, feedback, changes:[] } — gentle, non-rewriting.
     */
    async refineSentence({ studentText, stepPrompt, hints, level }) {
      const lvl = level || "B1";
      const hintLine = hints && hints.length ? `Optional hint words she could use naturally: ${hints.join(", ")}.` : "";
      const prompt = [
        `You are a kind, encouraging English writing coach for a ${lvl} learner.`,
        `She is writing a small paragraph step by step. Right now she is answering this sub-prompt:`,
        `> ${stepPrompt}`,
        hintLine,
        ``,
        `Her sentence(s):`,
        `"${studentText}"`,
        ``,
        `Your job:`,
        `- Make ONLY light corrections (grammar, articles, prepositions, awkward word order, missing punctuation).`,
        `- KEEP her ideas, voice, and most of her wording. Do not rewrite or expand. Do not add new content.`,
        `- If her sentence is already good, return it unchanged with empty "changes".`,
        `- Be warm, specific, and short.`,
        ``,
        `Return JSON exactly in this shape:`,
        `{`,
        `  "corrected": "her sentence with light fixes",`,
        `  "feedback": "1 short, warm, specific tip (under 22 words)",`,
        `  "changes": ["short note for each fix you made, max 3 items"]`,
        `}`,
      ].filter(Boolean).join("\n");
      return callJSON(prompt, { temperature: 0.25 });
    },

    /**
     * Analyse a spoken 5-minute response.
     *  - audioBase64: base64 string (no data URL prefix)
     *  - mimeType: e.g. "audio/webm"
     *  - subject: the question/topic the learner was asked
     *  - vocab: array of {w, m} the learner was expected to deploy
     *  - tone: "general" | "formal"
     * Returns structured feedback JSON.
     */
    async analyzeSpeakingAudio({ audioBase64, mimeType, subject, vocab, tone, level }) {
      const lvl = level || "B2-C1";
      const vocabList = (vocab || []).map((v) => `- ${v.w}${v.m ? " — " + v.m : ""}`).join("\n");
      const tonePhrase = tone === "formal"
        ? "an academic / formal register suitable for university discussion"
        : "an everyday conversational register";

      const prompt = [
        `You are an experienced ESL coach evaluating a 5-minute spoken response from a ${lvl} learner.`,
        ``,
        `Subject the learner was asked to discuss:`,
        `> ${subject}`,
        ``,
        `Target register: ${tonePhrase}.`,
        ``,
        vocabList ? `Target words/expressions the learner was offered (note which they actually used, and whether the usage was natural and correct):\n${vocabList}` : "",
        ``,
        `Listen to the audio carefully and return JSON in EXACTLY this shape:`,
        `{`,
        `  "summary": "2-3 sentence overall impression — warm, honest, specific",`,
        `  "scores": {`,
        `    "fluency": 0,         // 0-10`,
        `    "pronunciation": 0,   // 0-10`,
        `    "grammar": 0,         // 0-10`,
        `    "vocabulary": 0,      // 0-10`,
        `    "coherence": 0        // 0-10 (structure of ideas)`,
        `  },`,
        `  "vocabUsage": [`,
        `    { "word": "the target word", "used": true|false, "correctlyUsed": true|false, "comment": "short note (≤20 words)" }`,
        `  ],`,
        `  "grammarIssues": [`,
        `    { "youSaid": "verbatim phrase the learner said", "shouldBe": "corrected version", "rule": "1-line rule explanation" }`,
        `  ],`,
        `  "grammarStrengths": [ "1-line note about something the learner did well grammatically" ],`,
        `  "nativeAlternatives": [`,
        `    { "youSaid": "phrase the learner used", "nativeAmE": "how a native American speaker would more naturally phrase it", "why": "1-line note" }`,
        `  ],`,
        `  "fillersAndHesitations": "1-line note about filler words (um/like/you know) or repeated hedges",`,
        `  "topPriorities": [ "the 2-3 single highest-impact things to work on next time" ]`,
        `}`,
        ``,
        `Rules:`,
        `- For grammarIssues, give at MOST 6 of the most impactful issues — not every small slip.`,
        `- For nativeAlternatives, choose 4–6 places where the phrasing is technically correct but sounds non-native.`,
        `- Quote the learner verbatim in "youSaid" fields.`,
        `- If the learner did NOT use a target vocab word, mark used=false and leave correctlyUsed=false, with a brief comment on where it would have fit.`,
        `- Stay specific. "Work on grammar" is useless; "drop articles before uncountable abstract nouns like *information*" is useful.`,
        `- Return ONLY raw JSON. No prose, no markdown.`,
      ].filter(Boolean).join("\n");

      const tryModels = ["gemini-2.5-pro", "gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"];
      let lastErr;
      for (const m of tryModels) {
        try {
          const res = await fetch(url(m), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: prompt },
                  { inline_data: { mime_type: mimeType, data: audioBase64 } },
                ],
              }],
              generationConfig: {
                temperature: 0.3,
                responseMimeType: "application/json",
              },
            }),
          });
          if (!res.ok) {
            if (res.status === 404) { lastErr = new Error("model_not_found:" + m); continue; }
            const t = await res.text().catch(() => "");
            throw new Error(`Gemini ${res.status}: ${t.slice(0,200)}`);
          }
          const data = await res.json();
          const text = (((data.candidates || [])[0] || {}).content || {}).parts || [];
          const raw = text.map((p) => p.text || "").join("");
          try { return JSON.parse(raw); }
          catch (e) {
            const match = raw.match(/\{[\s\S]*\}/);
            if (match) { try { return JSON.parse(match[0]); } catch (e2) {} }
            return { _raw: raw };
          }
        } catch (e) { lastErr = e; }
      }
      throw lastErr || new Error("Speaking analysis failed");
    },

    /**
     * Analyse a free essay (120–150 words) — content + grammar + lexical range.
     * Returns structured JSON feedback.
     */
    async analyzeEssay({ essayText, subject, minWords, maxWords, level }) {
      const lvl = level || "B2-C1";
      const range = (minWords || 120) + "–" + (maxWords || 150);
      const wc = (essayText.trim().match(/\S+/g) || []).length;

      const prompt = [
        `You are an experienced writing tutor evaluating a free essay by a ${lvl} learner.`,
        ``,
        `Target length: ${range} words. Actual word count: ${wc}.`,
        ``,
        `Prompt the learner was given:`,
        `> ${subject}`,
        ``,
        `Learner's essay:`,
        `"""`,
        essayText,
        `"""`,
        ``,
        `Return JSON in EXACTLY this shape:`,
        `{`,
        `  "summary": "2-3 sentence honest overall impression — what worked, what didn't",`,
        `  "scores": {`,
        `    "taskResponse": 0,    // 0-10 — did they actually address the prompt?`,
        `    "coherence": 0,       // 0-10 — flow, paragraphing, linking`,
        `    "grammar": 0,         // 0-10`,
        `    "lexicalRange": 0,    // 0-10 — variety and precision of vocabulary`,
        `    "register": 0         // 0-10 — appropriate tone`,
        `  },`,
        `  "corrections": [`,
        `    { "original": "exact phrase from essay", "corrected": "fixed phrase", "explanation": "1-line rule" }`,
        `  ],`,
        `  "lexicalUpgrades": [`,
        `    { "original": "weak/plain word or phrase", "upgrade": "more precise/native alternative", "why": "1-line note" }`,
        `  ],`,
        `  "structuralFeedback": "2-3 sentences on how to strengthen the argument structure or paragraph flow",`,
        `  "modelRewrite": "OPTIONAL: a polished version of ONE weak sentence from the essay, kept short",`,
        `  "topPriorities": [ "the 2-3 highest-impact things to work on" ]`,
        `}`,
        ``,
        `Rules:`,
        `- Max 8 entries in "corrections", max 6 in "lexicalUpgrades". Choose the most impactful.`,
        `- Quote the learner verbatim in "original" fields.`,
        `- Be honest about scores; do not inflate.`,
        `- If word count is outside the range, mention it in "summary" once.`,
        `- Return ONLY raw JSON. No prose, no markdown.`,
      ].join("\n");

      return callJSON(prompt, { temperature: 0.25 });
    },

    /**
     * Evaluate a learner's own-words description of a vocabulary word (Part A of words task).
     * Quick yes/no plus a tiny piece of feedback.
     */
    async evaluateWordDescription({ word, pos, learnerDescription }) {
      const prompt = [
        `You are an English tutor. A ${`B2-C1`} learner is describing the meaning of the word "${word}" (${pos || "word"}) in their own English.`,
        ``,
        `Their description:`,
        `"${learnerDescription}"`,
        ``,
        `Return JSON:`,
        `{`,
        `  "accurate": true|false,    // does the description capture the core meaning?`,
        `  "natural": true|false,     // is the English itself natural and grammatical?`,
        `  "score": 0,                // 0-10`,
        `  "feedback": "1-2 sentences: warm, honest, specific",`,
        `  "modelDefinition": "a clean one-sentence dictionary-style definition the learner can compare against"`,
        `}`,
        ``,
        `Return ONLY raw JSON.`,
      ].join("\n");
      return callJSON(prompt, { temperature: 0.2 });
    },

    /**
     * Generate distractors for a list of words (one batch API call).
     * Returns { word: distractor } mapping.
     * @param {string[]} words - array of words to generate distractors for
     * @returns {Promise<Object>}
     */
    async generateDistractors(words, exclude = {}) {
      const unique = [...new Set(words.map(w => w.toLowerCase()))];
      const randomSeed = Math.random().toString(36).slice(2, 10) + "-" + Date.now().toString(36);

      let excludeSection = "";
      if (Object.keys(exclude).length > 0) {
        const lines = Object.entries(exclude).map(([w, d]) => `  "${w}": must NOT use "${d}"`).join("\n");
        excludeSection = `\nMANDATORY CONSTRAINT — for these words you MUST choose a DIFFERENT distractor than the one listed below. Using the same distractor again is wrong:\n${lines}\n`;
      }

      const prompt = [
        `Task: dictation exercise distractors. Session token: ${randomSeed}.`,
        ``,
        `For each word give ONE real English word that SOUNDS SIMILAR (rhyme / near-homophone / minimal phonetic change) but means something different.`,
        excludeSection,
        `Rules:`,
        `- Must be a real dictionary word`,
        `- Must sound similar to the target (same vowel sound, rhyme, or 1–2 phoneme swap)`,
        `- Examples: "coffee"→"toffee", "morning"→"mourning", "drank"→"frank", "started"→"charted"`,
        `- Never invent words`,
        `- Be varied and creative — avoid the most obvious choice when alternatives exist`,
        ``,
        `Words: ${unique.join(", ")}`,
        ``,
        `Return ONLY a JSON object: {"word": "distractor", ...} all lowercase.`,
      ].filter(s => s !== null).join("\n");

      const result = await callJSON(prompt, { temperature: 1.0, model: "gemini-3.1-pro-preview" });
      if (result && typeof result === "object" && !result._raw) return result;
      throw new Error("Invalid response format from Gemini");
    },
  };
})();

/* Helper to handle word clicks across the app */
window.WordLookup = {
  async lookup(word) {
    if (!word || word.length < 2) return;
    
    const loadingToast = UI.toast(`Analyzing "${word}" with Gemini...`, 0);
    
    const result = await Gemini.analyzeWord(word);
    loadingToast.dismiss();

    if (!result) {
      UI.toast("Failed to get word info. Check your connection or API key.", 4000);
      return;
    }
    
    // Show a modal with the result and option to add to Leitner
    UI.modal((m, close) => {
      m.innerHTML = `
        <div class="word-modal-content">
          <div class="row" style="align-items:flex-start">
            <div class="col">
              <h2 style="margin:0">${result.word}</h2>
              <div class="muted" style="font-size:14px;font-style:italic">${result.pos || ""}</div>
            </div>
            <span class="spacer"></span>
          </div>
          <div class="hr"></div>
          <div class="meaning-box" dir="rtl" style="font-family:Vazirmatn; font-size:18px; color:var(--primary-dark); font-weight:600; margin-bottom:12px">
            ${result.meaning}
          </div>
          <div class="example-box" style="font-style:italic; color:var(--text-soft); font-size:14px; background:var(--bg-2); padding:10px; border-radius:8px">
            "${result.example}"
          </div>
          <div class="modal-actions" style="margin-top:20px">
            <button class="btn" id="closeWordModal">Close</button>
            <button class="btn primary" id="addToLeitner">Add to Leitner Box 1</button>
          </div>
        </div>
      `;
      
      m.querySelector("#closeWordModal").onclick = close;
      m.querySelector("#addToLeitner").onclick = () => {
        State.addCard({
          word: result.word,
          meaning: result.meaning,
          example: result.example,
          pos: result.pos
        });
        UI.toast(`"${result.word}" added to Leitner!`);
        close();
      };
    });
  }
};
