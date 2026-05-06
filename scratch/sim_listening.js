const text = "I never used to like coffee. For years I drank tea, even on cold mornings. Then I started a new job that began at seven, and tea simply was not enough. My boss took me to a small café around the corner on my first day. She ordered me a flat white, and I remember thinking — this is not really coffee, this is a hug in a cup. Now, three years later, my morning is the same: ten minutes at that little café, the same barista, the same flat white, and ten minutes of quiet before I open my laptop. Honestly, I do not even need the caffeine anymore. I just need the ten minutes.";

function tokenizeForDictation(text) {
  const tokens = [];
  let idx = 0;
  const parts = text.split(/(\s+|[.,!?;:()"—])/);
  parts.forEach(p => {
    if (!p) return;
    const clean = p.trim().toLowerCase().replace(/[^a-z]/g, "");
    tokens.push({ raw: p, clean, idx: idx++ });
  });
  return tokens;
}

function selectBlanks(tokens) {
  const words = tokens.filter(t => t.clean.length > 3);
  const count = Math.floor(words.length * 0.5);
  // Simulation: using a fixed seed or just first N for this test to show the user
  const shuffled = [...words].sort((a,b) => a.clean.localeCompare(b.clean)); 
  const selected = shuffled.slice(0, count);
  return selected.map(s => s.clean);
}

const tokens = tokenizeForDictation(text);
const blankedWords = selectBlanks(tokens);
console.log(JSON.stringify(blankedWords));
