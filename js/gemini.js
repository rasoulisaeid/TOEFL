/* Gemini API integration for word analysis + writing refinement */
window.Gemini = (function() {
  const MODEL = "gemini-3-pro-preview";
  const FALLBACK_MODELS = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"];

  function getKey() {
    const configKey = (window.CONFIG && window.CONFIG.GEMINI_API_KEY) || "";
    const stored = (window.Storage && Storage.get) ? Storage.get("gemini:key") : null;
    // Only use stored key if it's a non-empty string
    return (stored && typeof stored === "string" && stored.trim() !== "") ? stored : configKey;
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
     * Generate distractors for a list of words (one batch API call).
     * Returns { word: distractor } mapping.
     * @param {string[]} words - array of words to generate distractors for
     * @returns {Promise<Object>}
     */
    async generateDistractors(words) {
      const unique = [...new Set(words.map(w => w.toLowerCase()))];
      const prompt = [
        `You are creating a listening dictation exercise. For each word, provide ONE real English word that SOUNDS SIMILAR (similar pronunciation/phonetics) but is a DIFFERENT word.`,
        ``,
        `Rules:`,
        `- Every distractor MUST be a real English dictionary word`,
        `- Focus on SIMILAR PRONUNCIATION, rhyming, or minimal sound changes`,
        `- Examples: "coffee" → "toffee", "drank" → "drank" is wrong → use "frank", "morning" → "mourning", "used" → "mused", "started" → "charted", "remember" → "ember", "quiet" → "quite", "white" → "write", "need" → "knead", "even" → "oven"`,
        `- NEVER invent fake words. Every word must exist in an English dictionary.`,
        ``,
        `Words: ${unique.join(", ")}`,
        ``,
        `Return JSON: {"word": "distractor", ...} — all lowercase.`,
      ].join("\n");
      try {
        const result = await callJSON(prompt, { temperature: 0.4, model: "gemini-3-pro-preview" });
        if (result && typeof result === "object" && !result._raw) return result;
        return {};
      } catch (e) {
        console.error("🔴 Distractor generation failed:", e.message);
        return {};
      }
    },
  };
})();

/* Helper to handle word clicks across the app */
window.WordLookup = {
  async lookup(word) {
    if (!word || word.length < 2) return;
    
    UI.toast(`Analyzing "${word}" with Gemini...`, 2000);
    
    const result = await Gemini.analyzeWord(word);
    if (!result) {
      UI.toast("Failed to get word info. Check your connection or API key.", 3000);
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
