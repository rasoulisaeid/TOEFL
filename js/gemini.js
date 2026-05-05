/* Gemini API integration for word analysis */
window.Gemini = (function() {
  const API_KEY = "AIzaSyCihWzYeHx38dOd4YpPKLkW3_OtQCe60Og";
  const MODEL = "gemini-3-flash-preview"; 

  return {
    async analyzeWord(word) {
      const prompt = `Return a JSON object for the English word "${word}" with these fields: "word", "meaning" (concise Persian definition), "example" (a simple English sentence using the word), and "pos" (part of speech). Provide ONLY the raw JSON string.`;
      
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
      
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.1, // Low temp for more consistent JSON
            }
          })
        });
        
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.error("Gemini API Error:", errData);
          throw new Error(`Gemini API returned ${res.status}`);
        }
        
        const data = await res.json();
        const text = data.candidates[0].content.parts[0].text;
        
        // Robust JSON extraction (in case Gemini still wraps it in markdown)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found in response");
        
        const cleanJson = jsonMatch[0];
        return JSON.parse(cleanJson);
      } catch (e) {
        console.error("🔴 Gemini Analysis failed:", e.message);
        return null;
      }
    }
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
