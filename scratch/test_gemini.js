const words = ["anymore","around","barista","before","began","boss","caffeine","coffee","cold","corner","drank","enough","even","first","flat","honestly","just","laptop","later","like","little","minutes","morning"];
const randomSeed = Math.random().toString(36).slice(2, 7);
const prompt = `
You are creating a listening dictation exercise. For each word, provide ONE real English word that SOUNDS SIMILAR (similar pronunciation/phonetics) but is a DIFFERENT word.
Variation seed: ${randomSeed}. 
Try to be creative and provide fresh, distinct distractors. Avoid obvious or repeating ones.

Rules:
- Every distractor MUST be a real English dictionary word
- Focus on SIMILAR PRONUNCIATION, rhyming, or minimal sound changes
- Examples: "coffee" → "toffee", "drank" → "frank", "morning" → "mourning", "started" → "charted"
- NEVER invent fake words. Every word must exist in an English dictionary.

Words: ${words.join(", ")}

Return JSON: {"word": "distractor", ...} — all lowercase.`;

async function test() {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=AIzaSyC-nfUeor4NWs6pMZj1dZl1jTCIYLBprhA', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 1.0, responseMimeType: 'application/json' }
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
test();
