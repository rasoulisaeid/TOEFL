/* Week 1 — Listening content
 * 3 listening tasks per day (general / scientific / fashion-art) — voiced via ElevenLabs.
 * Each text is ~100-140 words → ~45-60s of audio. 3 MCQs per text.
 */
window.WEEK1_LISTENING = {
  number: 1,
  voices: {
    general:    "pVnrL6sighQX7hVz89cp",
    scientific: "DODLEQrClDo8wCz460ld",
    fashion:    "r4iCyrmUEMCbsi7eGtf8",
  },
  days: [
    /* ===== DAY 1 ===== */
    {
      day: 1,
      tasks: [
        {
          id: "li:w1d1:general",
          category: "general",
          title: "Sara's coffee ritual",
          intro: "A short, friendly monologue.",
          text: "I never used to like coffee. For years I drank tea, even on cold mornings. Then I started a new job that began at seven, and tea was not enough. My boss took me to a small café around the corner on my first day. She ordered me a flat white, and I remember thinking — this is not really coffee, this is a hug in a cup. Now, three years later, my morning is the same: ten minutes at that little café, the same barista, the same flat white, and ten minutes of quiet before I open my laptop. Honestly, I do not even need the caffeine anymore. I just need the ten minutes.",
          vocab: [
            { w: "ritual", p: "noun", m: "a regular meaningful routine", ex: "Coffee is part of her ritual." },
            { w: "barista", p: "noun", m: "the person who makes coffee at a café", ex: "The same barista every morning." },
            { w: "hug in a cup", p: "phrase", m: "warm and comforting (about a drink)", ex: "It tasted like a hug in a cup." },
            { w: "to need (someone/something)", p: "verb", m: "must have", ex: "I need ten minutes alone." },
            { w: "around the corner", p: "phrase", m: "very close by", ex: "The café around the corner." },
          ],
          mcqs: [
            {
              q: "Why did Sara stop drinking only tea?",
              opts: [
                "She moved to a colder country.",
                "Her new job started early and tea was not enough.",
                "Her boss banned tea.",
                "She wanted to lose weight.",
              ],
              correct: 1,
              explanation: "Sara mentions a 7am job and that tea wasn't enough as the trigger.",
            },
            {
              q: "What does Sara mean by 'I do not even need the caffeine anymore'?",
              opts: [
                "She switched to decaf coffee.",
                "The ritual matters more to her than the caffeine.",
                "She drinks tea again now.",
                "She quit her job.",
              ],
              correct: 1,
              explanation: "She says she just needs the 'ten minutes' — the experience, not the caffeine.",
            },
            {
              q: "How long has Sara had this routine?",
              opts: ["A few weeks.", "About a year.", "Three years.", "Ten years."],
              correct: 2,
              explanation: "She says 'three years later, my morning is the same.'",
            },
          ],
        },
        {
          id: "li:w1d1:scientific",
          category: "scientific",
          title: "Why coffee gives a 'second wind'",
          intro: "A short explanation in calm, lecture style.",
          text: "Most people know that coffee can wake them up. What fewer people know is that coffee often gives a second, smaller boost of energy about ninety minutes after the first cup. This is sometimes called the 'second wind.' The reason is interesting: caffeine takes time to fully circulate in the body, and it also blocks the adenosine receptors in the brain at different speeds. Some receptors are blocked quickly, others more slowly. As the slower ones are reached, your alertness goes up again. The second push is softer than the first one, but it explains why a cup of coffee at nine in the morning can still help you focus at eleven. The brain, like a complicated machine, wakes up in stages.",
          vocab: [
            { w: "second wind", p: "phrase", m: "a renewed energy after a tired moment", ex: "The runner got a second wind." },
            { w: "to circulate", p: "verb", m: "to move through the body", ex: "Caffeine takes time to circulate." },
            { w: "adenosine receptor", p: "phrase", m: "place in the brain that signals tiredness", ex: "Caffeine blocks adenosine receptors." },
            { w: "alertness", p: "noun", m: "the state of being awake and focused", ex: "Coffee increases alertness." },
            { w: "in stages", p: "phrase", m: "step by step", ex: "The brain wakes in stages." },
          ],
          mcqs: [
            {
              q: "What is the 'second wind' from coffee?",
              opts: [
                "A bigger energy peak than the first.",
                "A smaller boost about ninety minutes after the first cup.",
                "An energy crash after coffee.",
                "A second cup of coffee at noon.",
              ],
              correct: 1,
              explanation: "The speaker explains a smaller second boost about 90 minutes later.",
            },
            {
              q: "Why does the second wind happen?",
              opts: [
                "Caffeine blocks all adenosine receptors at the same speed.",
                "Caffeine reaches different receptors at different speeds.",
                "We drink a second cup automatically.",
                "Adenosine increases ninety minutes after coffee.",
              ],
              correct: 1,
              explanation: "Different receptors are blocked at different rates, causing a delayed second peak.",
            },
            {
              q: "Which comparison does the speaker use?",
              opts: [
                "The brain is like a sports car.",
                "The brain is like a complicated machine that wakes up in stages.",
                "The brain is like a coffee cup.",
                "The brain is like a battery.",
              ],
              correct: 1,
              explanation: "The closing metaphor compares the brain to a complex machine waking in stages.",
            },
          ],
        },
        {
          id: "li:w1d1:fashion",
          category: "fashion",
          title: "Café Central, Vienna",
          intro: "A short cultural description.",
          text: "Step into Café Central in Vienna and you step into another century. The ceilings are high and curved, painted in soft cream. Marble columns rise like the inside of a small cathedral. At the back, there is a piano, and somebody is almost always playing something gentle. In the early nineteen hundreds, this café was a regular meeting place for writers, scientists, and political thinkers — Trotsky, Freud, even Stefan Zweig. They would sit for hours over a single coffee, reading newspapers, talking softly. Today, tourists fill most of the seats, but if you arrive before ten in the morning, you can still find a quiet table, order a Viennese melange, and pretend, just for a while, that you are part of that older conversation.",
          vocab: [
            { w: "ornate", p: "adj", m: "richly decorated", ex: "An ornate ceiling." },
            { w: "marble", p: "noun", m: "a hard, polished stone used in fancy buildings", ex: "Marble columns." },
            { w: "patron", p: "noun", m: "a regular customer or supporter", ex: "Famous patrons of the café." },
            { w: "to reign", p: "verb", m: "to dominate or rule", ex: "Quiet reigns in the morning." },
            { w: "melange", p: "noun (German/French)", m: "a Viennese coffee with milk foam", ex: "A Viennese melange, please." },
          ],
          mcqs: [
            {
              q: "What atmosphere does the café create?",
              opts: [
                "Modern and minimalist.",
                "Old, ornate, like a small cathedral.",
                "Loud and crowded all day.",
                "Bright and full of children.",
              ],
              correct: 1,
              explanation: "The text describes high arched ceilings and marble columns — like a cathedral.",
            },
            {
              q: "Who used to meet at Café Central?",
              opts: [
                "Famous singers only.",
                "Writers, scientists, and political thinkers.",
                "Royal families.",
                "Football teams.",
              ],
              correct: 1,
              explanation: "The text mentions Trotsky, Freud, and Stefan Zweig.",
            },
            {
              q: "What advice does the speaker give modern visitors?",
              opts: [
                "Visit only on weekends.",
                "Arrive before ten in the morning to find a quiet table.",
                "Avoid ordering coffee there.",
                "Bring your own piano.",
              ],
              correct: 1,
              explanation: "The speaker recommends arriving before ten to enjoy quiet time.",
            },
          ],
        },
      ],
    },

    /* ===== DAY 2 ===== */
    {
      day: 2,
      tasks: [
        {
          id: "li:w1d2:general",
          category: "general",
          title: "Why I started walking",
          intro: "A short personal story.",
          text: "Two years ago, I had knee surgery. Nothing serious, but the doctor told me I would have to forget running for about a year. At first, I thought walking would be boring. It is not exciting, it is not impressive — nobody posts a photo on social media after a long walk. But the first time I went out on a quiet Sunday morning, I noticed something I had been missing for years: time to think. By the third week, I was walking forty-five minutes every day. My knee healed. My head also felt clearer. Two years later, I still walk almost every day. I never went back to running, and honestly, I do not miss it.",
          vocab: [
            { w: "knee surgery", p: "phrase", m: "an operation on the knee", ex: "He had knee surgery last year." },
            { w: "low-impact", p: "adj", m: "gentle on the body", ex: "Walking is low-impact." },
            { w: "to clear one's head", p: "phrase", m: "to think clearly again", ex: "A walk clears my head." },
            { w: "to heal", p: "verb", m: "to get better (an injury)", ex: "My knee healed." },
            { w: "to miss (something)", p: "verb", m: "to feel sad it is gone", ex: "I do not miss running." },
          ],
          mcqs: [
            {
              q: "Why did the speaker start walking?",
              opts: [
                "He wanted to lose weight.",
                "His doctor told him to stop running for a year.",
                "He wanted to take photos for social media.",
                "He could no longer afford a gym.",
              ],
              correct: 1,
              explanation: "He explicitly says the doctor said no running for a year.",
            },
            {
              q: "What unexpected benefit did he find?",
              opts: [
                "Faster running speed.",
                "Time to think and a clearer head.",
                "More social media followers.",
                "Lower blood pressure.",
              ],
              correct: 1,
              explanation: "He calls 'time to think' the thing he had been missing for years.",
            },
            {
              q: "Did he go back to running?",
              opts: [
                "Yes, immediately after recovery.",
                "Yes, after a year.",
                "No, and he does not miss it.",
                "No, but he misses it deeply.",
              ],
              correct: 2,
              explanation: "The closing line says he never went back and does not miss it.",
            },
          ],
        },
        {
          id: "li:w1d2:scientific",
          category: "scientific",
          title: "The hidden cost of sleep loss",
          intro: "A short academic-style talk.",
          text: "Most adults need between seven and nine hours of sleep per night. Yet many of us regularly sleep five or six. We tell ourselves this is fine, but research strongly disagrees. Even one hour less sleep per night for a week leads to measurable drops in attention, memory, and emotional control. Worse, this 'sleep debt' does not simply disappear when we sleep in on the weekend. The brain repays it slowly. Long-term, regular sleep loss is now linked to higher risks of weight gain, anxiety, and even certain forms of dementia. The takeaway is simple: sleep is not a luxury, and short-term shortcuts always come with a long-term bill.",
          vocab: [
            { w: "sleep debt", p: "phrase", m: "the missing sleep you owe your body", ex: "She has built up a sleep debt." },
            { w: "to repay", p: "verb", m: "to give back over time", ex: "The body repays sleep debt slowly." },
            { w: "long-term", p: "adj", m: "over a long period", ex: "Long-term effects of poor sleep." },
            { w: "anxiety", p: "noun", m: "worry, nervousness", ex: "Sleep loss increases anxiety." },
            { w: "luxury", p: "noun", m: "something nice but not necessary", ex: "Sleep is not a luxury." },
          ],
          mcqs: [
            {
              q: "How much sleep do most adults need?",
              opts: ["4–5 hours", "5–6 hours", "7–9 hours", "10–12 hours"],
              correct: 2,
              explanation: "The talk states 7 to 9 hours.",
            },
            {
              q: "Can sleep debt be paid back by sleeping in on the weekend?",
              opts: [
                "Yes, completely.",
                "No — the brain repays it slowly over time.",
                "Only if you sleep more than 12 hours.",
                "Only with medication.",
              ],
              correct: 1,
              explanation: "The speaker says the debt 'does not simply disappear' on the weekend.",
            },
            {
              q: "What is the speaker's takeaway?",
              opts: [
                "Sleep is a luxury for rich people.",
                "Sleep is not a luxury — short cuts come at a long-term cost.",
                "You should always sleep ten hours.",
                "Sleep is no longer well understood.",
              ],
              correct: 1,
              explanation: "The closing line directly delivers this message.",
            },
          ],
        },
        {
          id: "li:w1d2:fashion",
          category: "fashion",
          title: "How yoga pants conquered the office",
          intro: "A short cultural piece.",
          text: "Twenty-five years ago, you would not see a single pair of yoga pants outside a gym. They were sportswear, full stop. Then in two thousand, a small Canadian company called Lululemon opened in Vancouver. Their leggings were better cut, more comfortable, and surprisingly flattering. Slowly, women began wearing them after class — to brunch, to the grocery store, even to the office on Fridays. Today, athleisure is a forty-billion-dollar industry, and the line between gym and street has almost disappeared. Designers from Paris and Milan now show leggings in their main collections. Sweatpants, of all things, have become high fashion.",
          vocab: [
            { w: "leggings", p: "noun", m: "tight stretchy pants", ex: "Black leggings under a long shirt." },
            { w: "flattering", p: "adj", m: "making someone look attractive", ex: "A flattering cut." },
            { w: "athleisure", p: "noun", m: "sport-style clothing for daily wear", ex: "Athleisure is mainstream now." },
            { w: "high fashion", p: "phrase", m: "exclusive, designer-level fashion", ex: "Sweatpants on a high-fashion runway." },
            { w: "of all things", p: "phrase", m: "expressing surprise", ex: "Sweatpants, of all things, are fashionable." },
          ],
          mcqs: [
            {
              q: "Where did Lululemon open?",
              opts: ["New York", "Toronto", "Vancouver", "Los Angeles"],
              correct: 2,
              explanation: "The speaker mentions Vancouver.",
            },
            {
              q: "What surprised customers about Lululemon's leggings?",
              opts: [
                "They were cheap.",
                "They were better cut, comfortable, and flattering.",
                "They were waterproof.",
                "They were only for yoga teachers.",
              ],
              correct: 1,
              explanation: "The talk explicitly lists these three qualities.",
            },
            {
              q: "What is the speaker's main observation?",
              opts: [
                "Athleisure is a small niche market.",
                "The line between gym wear and daily wear has nearly disappeared.",
                "Yoga is more popular than running.",
                "Sweatpants are still considered ugly by most designers.",
              ],
              correct: 1,
              explanation: "The closing point: gym and street have merged.",
            },
          ],
        },
      ],
    },

    /* ===== DAY 3 ===== */
    {
      day: 3,
      tasks: [
        {
          id: "li:w1d3:general",
          category: "general",
          title: "First week on a hybrid team",
          intro: "A casual reflection.",
          text: "My first week at the new company was honestly a bit confusing. The office is open three days a week — Tuesday, Wednesday, and Thursday — and on those days the place is alive. People bring their dogs, the kitchen is full at lunch, meetings spill out into the corridor. But on Mondays and Fridays, the building is almost empty. I tried to come in last Monday, just to settle in quietly. There were maybe eight people on the whole floor. It was peaceful, but it also felt strange, like a hotel after the guests have left. By Friday I had figured it out: hybrid is a rhythm, not a rule. You learn the days the building has energy, and you plan your work around them.",
          vocab: [
            { w: "hybrid (work)", p: "adj", m: "mixing office and remote", ex: "A hybrid team." },
            { w: "to spill (out)", p: "verb", m: "to extend beyond a place naturally", ex: "Meetings spill into the hallway." },
            { w: "to figure out", p: "phrasal v.", m: "to understand", ex: "I figured it out by Friday." },
            { w: "rhythm (vs. rule)", p: "noun", m: "a flow you learn, not a strict order", ex: "Hybrid is a rhythm." },
            { w: "to settle in", p: "phrasal v.", m: "to get used to a new place", ex: "I came in to settle in." },
          ],
          mcqs: [
            {
              q: "Which days are the office busiest?",
              opts: ["Monday, Tuesday, Friday", "Tuesday, Wednesday, Thursday", "Every weekday", "Friday only"],
              correct: 1,
              explanation: "The speaker explicitly lists Tuesday, Wednesday, Thursday.",
            },
            {
              q: "What did the speaker realize by Friday?",
              opts: [
                "Hybrid work doesn't really work.",
                "Hybrid is a rhythm, not a strict rule.",
                "Working from home is always better.",
                "He should change companies.",
              ],
              correct: 1,
              explanation: "The closing line is exactly this insight.",
            },
            {
              q: "What comparison does the speaker use for the empty office?",
              opts: [
                "A church on a weekday.",
                "A hotel after the guests have left.",
                "An old library.",
                "An airport at night.",
              ],
              correct: 1,
              explanation: "The hotel-after-guests metaphor is in the text.",
            },
          ],
        },
        {
          id: "li:w1d3:scientific",
          category: "scientific",
          title: "Notifications and attention",
          intro: "A short academic-style talk.",
          text: "Every notification on your phone has a small but real cost. When you hear a ping, even if you do not pick up the phone, your brain briefly switches modes — from focused work to scanning for new information. That switch takes roughly a second to begin and longer to recover from. A study at the University of California suggested that, after an interruption, it can take more than twenty minutes to fully return to deep concentration. Multiply that by the dozens of notifications most of us receive each day, and the picture becomes clear: notifications do not just steal seconds, they break the structure of an entire morning. Turning them off is not laziness. It is, in fact, the most respectful thing you can do for your attention.",
          vocab: [
            { w: "notification", p: "noun", m: "a small alert from an app", ex: "Constant notifications hurt focus." },
            { w: "to ping", p: "verb", m: "to make a short alert sound", ex: "His phone pinged again." },
            { w: "to break (concentration)", p: "verb", m: "to interrupt", ex: "A ping breaks concentration." },
            { w: "to recover", p: "verb", m: "to return to a previous state", ex: "It takes minutes to recover focus." },
            { w: "respectful (of)", p: "adj", m: "showing care for", ex: "Respectful of your attention." },
          ],
          mcqs: [
            {
              q: "How long can it take to fully return to deep concentration after an interruption?",
              opts: [
                "About one minute.",
                "About five minutes.",
                "More than twenty minutes.",
                "An hour.",
              ],
              correct: 2,
              explanation: "The University of California study suggested 'more than twenty minutes.'",
            },
            {
              q: "What happens to the brain when you hear a notification?",
              opts: [
                "Nothing happens.",
                "It switches briefly from focused work to scanning.",
                "It enters deep sleep.",
                "It speeds up to work faster.",
              ],
              correct: 1,
              explanation: "The talk says the brain switches modes briefly.",
            },
            {
              q: "What is the speaker's recommendation?",
              opts: [
                "Check phone every ten minutes.",
                "Turn off notifications — it is respectful of your attention.",
                "Use only one app.",
                "Switch to a louder ringtone.",
              ],
              correct: 1,
              explanation: "The speaker explicitly says turning notifications off is respectful of attention.",
            },
          ],
        },
        {
          id: "li:w1d3:fashion",
          category: "fashion",
          title: "Why startups still wear hoodies",
          intro: "A short cultural commentary.",
          text: "Walk into any tech startup and you will probably see hoodies, sneakers, and a lot of jeans. The look has not changed much since two thousand and ten, even as startups have become richer, larger, and more powerful. Some people see this as laziness, but the original idea was different. Wearing a hoodie was a quiet statement: 'we are not the old corporate world. We are not impressed by suits. We are here to build things.' Today, that statement is less radical, but the uniform survives. A hoodie costs almost nothing to wash, fits in any bag, and signals that you are doing the work, not performing it. In a strange way, it has become its own kind of suit.",
          vocab: [
            { w: "hoodie", p: "noun", m: "a sweatshirt with a hood", ex: "He wore a black hoodie to work." },
            { w: "uniform", p: "noun", m: "the same clothes a group wears", ex: "Hoodies are the startup uniform." },
            { w: "to signal", p: "verb", m: "to show or indicate", ex: "The hoodie signals casual focus." },
            { w: "to perform", p: "verb", m: "to act for an audience", ex: "Doing work, not performing it." },
            { w: "radical", p: "adj", m: "very different from the norm", ex: "It used to be radical to wear a hoodie." },
          ],
          mcqs: [
            {
              q: "What was the original idea behind hoodies in tech?",
              opts: [
                "They were warm.",
                "A quiet rejection of the corporate suit world.",
                "They signaled wealth.",
                "They were the only thing available.",
              ],
              correct: 1,
              explanation: "The speaker describes the hoodie as a statement against old corporate culture.",
            },
            {
              q: "Why does the speaker think hoodies have survived?",
              opts: [
                "They are required by law.",
                "They are practical and signal real work, not performance.",
                "They are all sold at one store.",
                "They protect from rain.",
              ],
              correct: 1,
              explanation: "Practical comfort plus the 'doing not performing' message.",
            },
            {
              q: "What is the closing observation?",
              opts: [
                "The hoodie has become its own kind of suit.",
                "Most workers will return to wearing suits.",
                "Hoodies will soon disappear.",
                "Startups have officially banned them.",
              ],
              correct: 0,
              explanation: "The final line is exactly this metaphor.",
            },
          ],
        },
      ],
    },

    /* ===== DAY 4 ===== */
    {
      day: 4,
      tasks: [
        {
          id: "li:w1d4:general",
          category: "general",
          title: "My first solo trip",
          intro: "A short personal story.",
          text: "I was twenty-six the first time I traveled alone. I went to Lisbon for ten days, with no real plan beyond a flight and a small hotel. The first two evenings were rough. I sat in restaurants pretending to read, listening to other people laugh at other tables. By day three, something shifted. I joined a free walking tour, met a woman from Brazil, and we ended up eating dinner together that night. After that, the trip just opened up. By the end of the week, I was the one starting conversations. I came home tired, sun-burnt, and slightly different. I'm not sure I can explain it well — but I trust myself a little more now.",
          vocab: [
            { w: "rough (adj.)", p: "adj", m: "difficult, not easy", ex: "The first two days were rough." },
            { w: "to shift", p: "verb", m: "to change", ex: "Something shifted on day three." },
            { w: "walking tour", p: "phrase", m: "a guided walk through a city", ex: "I joined a free walking tour." },
            { w: "to open up", p: "phrasal v.", m: "to become better, friendlier, or fuller", ex: "The trip opened up." },
            { w: "to trust oneself", p: "phrase", m: "to believe in your own judgment", ex: "I trust myself more now." },
          ],
          mcqs: [
            {
              q: "How did the speaker feel during the first two evenings?",
              opts: [
                "Excited and confident.",
                "Lonely and a bit awkward.",
                "Bored but happy.",
                "Sick from the flight.",
              ],
              correct: 1,
              explanation: "She describes pretending to read while listening to others — clearly lonely.",
            },
            {
              q: "What changed on day three?",
              opts: [
                "She booked a return flight.",
                "She joined a walking tour and made a friend.",
                "She got a job offer.",
                "She switched hotels.",
              ],
              correct: 1,
              explanation: "Day three brought the walking tour and the woman from Brazil.",
            },
            {
              q: "How does the speaker describe herself afterward?",
              opts: [
                "She regrets the trip.",
                "She trusts herself a little more.",
                "She will never travel alone again.",
                "She feels unchanged.",
              ],
              correct: 1,
              explanation: "The closing line states it directly.",
            },
          ],
        },
        {
          id: "li:w1d4:scientific",
          category: "scientific",
          title: "Why airline food tastes weird",
          intro: "A short curious-science piece.",
          text: "Have you ever wondered why food on planes tastes so different from food on the ground? It is not just because airlines use cheap ingredients. At thirty-five thousand feet, the cabin air is dry, the air pressure is lower, and the constant background noise is roughly that of a busy restaurant. All three of these factors dull the senses. Studies have shown that our ability to taste sweet and salty drops by about thirty percent in the cabin. That is why tomato juice — a drink that few people order on the ground — is one of the most popular orders on flights. Its strong umami flavor cuts through the dullness. So no, it is not your imagination, and it is not just the ingredients. The sky changes how your tongue listens.",
          vocab: [
            { w: "cabin (plane)", p: "noun", m: "the inside of a plane", ex: "The cabin air is dry." },
            { w: "air pressure", p: "phrase", m: "the force of air around us", ex: "Low air pressure on planes." },
            { w: "to dull (the senses)", p: "verb", m: "to weaken", ex: "Noise dulls your taste." },
            { w: "umami", p: "noun (Japanese)", m: "savory taste (5th basic taste)", ex: "Umami flavor like tomato or cheese." },
            { w: "imagination", p: "noun", m: "things that exist only in your mind", ex: "It's not your imagination." },
          ],
          mcqs: [
            {
              q: "Which of the following is NOT a reason food tastes different on planes?",
              opts: [
                "Dry cabin air.",
                "Low air pressure.",
                "Loud background noise.",
                "The plane's altitude makes food spoil faster.",
              ],
              correct: 3,
              explanation: "The talk lists dry air, low pressure, and noise — not spoilage.",
            },
            {
              q: "Why is tomato juice so popular on flights?",
              opts: [
                "It is free.",
                "Its umami flavor cuts through the dulled senses.",
                "It is easier to digest.",
                "Pilots recommend it.",
              ],
              correct: 1,
              explanation: "The speaker explains tomato juice's umami works against the dulled taste.",
            },
            {
              q: "By how much does our ability to taste sweet and salty drop in the cabin?",
              opts: ["10%", "20%", "About 30%", "50%"],
              correct: 2,
              explanation: "The talk gives the figure as roughly 30%.",
            },
          ],
        },
        {
          id: "li:w1d4:fashion",
          category: "fashion",
          title: "Bracelets from Bali",
          intro: "A traveler's note about jewelry traditions.",
          text: "If you walk through a market in Ubud, Bali, you will see hundreds of small handmade bracelets — woven cotton, silver, beaded, sometimes with tiny shells. They are cheap, often less than five dollars, and many travelers buy them on impulse. But the most interesting part is what locals say about them: each color is meant to carry an intention. Red for courage. Green for healing. Blue for calm. Whether or not you believe in such things, there is something nice about choosing a color for a feeling you want more of. I came home with three bracelets, all different shades of green. Two years later, I still wear them. They are starting to fade, but the meaning has not.",
          vocab: [
            { w: "handmade", p: "adj", m: "made by hand, not machine", ex: "Handmade bracelets." },
            { w: "woven", p: "adj", m: "made by weaving threads together", ex: "Woven cotton bracelets." },
            { w: "intention", p: "noun", m: "a meaning or purpose", ex: "Each color has an intention." },
            { w: "courage", p: "noun", m: "the ability to face fear", ex: "Red represents courage." },
            { w: "to fade", p: "verb", m: "to lose color over time", ex: "The bracelets are starting to fade." },
          ],
          mcqs: [
            {
              q: "What materials are the bracelets made from?",
              opts: [
                "Plastic and rubber.",
                "Woven cotton, silver, beads, sometimes shells.",
                "Pure gold only.",
                "Wood and stone.",
              ],
              correct: 1,
              explanation: "The speaker lists exactly these materials.",
            },
            {
              q: "What do the colors represent, according to locals?",
              opts: [
                "Royal status.",
                "An intention or feeling — red for courage, green for healing, blue for calm.",
                "Family origin.",
                "How much money you have.",
              ],
              correct: 1,
              explanation: "The speaker lists these specific color meanings.",
            },
            {
              q: "What is the speaker's final reflection?",
              opts: [
                "The bracelets are pointless.",
                "Even as they fade, the meaning has stayed.",
                "She wishes she had bought more.",
                "She lost all her bracelets.",
              ],
              correct: 1,
              explanation: "The closing line: bracelets fade, but the meaning has not.",
            },
          ],
        },
      ],
    },

    /* ===== DAY 5 ===== */
    {
      day: 5,
      tasks: [
        {
          id: "li:w1d5:general",
          category: "general",
          title: "A return that turned out kindly",
          intro: "A short, warm story.",
          text: "Last winter, I bought my partner a sweater for his birthday. Cashmere, a beautiful gray, expensive. He opened it, smiled, and very gently said it was a size too small. I felt terrible. The next day I went back to the shop, expecting an awkward conversation about the receipt. The shop assistant — a kind woman in her fifties — listened, then said, 'Honey, do not worry. We do this every week.' She not only exchanged the sweater for the right size, she also offered me free gift wrapping for the second try. Such a small thing, but I left the shop almost in tears. Sometimes a tiny piece of human kindness in a normal day is more memorable than an expensive gift.",
          vocab: [
            { w: "to exchange", p: "verb", m: "to swap for a different one", ex: "She exchanged the sweater." },
            { w: "shop assistant", p: "phrase", m: "a person who helps customers in a store", ex: "A kind shop assistant helped me." },
            { w: "gift wrapping", p: "phrase", m: "decorative paper around a gift", ex: "Free gift wrapping included." },
            { w: "in tears", p: "phrase", m: "crying", ex: "I almost left in tears." },
            { w: "memorable", p: "adj", m: "easy to remember", ex: "A memorable moment of kindness." },
          ],
          mcqs: [
            {
              q: "Why did the speaker need to return the sweater?",
              opts: [
                "It was the wrong color.",
                "It was a size too small.",
                "It was damaged.",
                "Her partner already had one.",
              ],
              correct: 1,
              explanation: "The speaker explicitly says the sweater was a size too small.",
            },
            {
              q: "What kind extra did the shop assistant offer?",
              opts: [
                "Free coffee.",
                "Free gift wrapping for the second try.",
                "A discount voucher.",
                "Free delivery.",
              ],
              correct: 1,
              explanation: "Free gift wrapping was specifically mentioned.",
            },
            {
              q: "What is the speaker's main point?",
              opts: [
                "Gifts should always be expensive.",
                "Small kindness can be more memorable than expensive gifts.",
                "Returns are usually unpleasant.",
                "Cashmere sweaters are too expensive.",
              ],
              correct: 1,
              explanation: "The closing reflection captures this exact theme.",
            },
          ],
        },
        {
          id: "li:w1d5:scientific",
          category: "scientific",
          title: "Why we spend more on payday",
          intro: "A short economics talk.",
          text: "Most people know that we tend to spend more right after we are paid. But the reason is more interesting than it sounds. Behavioral economists have shown that, after a salary lands in our account, the brain briefly experiences what is called a 'wealth effect.' Even though our long-term financial situation has not really changed, we feel temporarily richer. Studies have found that people are far more likely to make impulse purchases — fancy coffees, online clothing, takeaway dinners — within the first three days of payday. The advice from researchers is simple but useful: do nothing big for forty-eight hours after you are paid. Pay your fixed bills, then wait. Most of the regret comes from those first two days.",
          vocab: [
            { w: "wealth effect", p: "phrase", m: "feeling richer after receiving money", ex: "The wealth effect on payday." },
            { w: "impulse purchase", p: "phrase", m: "a quick, unplanned buy", ex: "Lots of impulse purchases on Friday." },
            { w: "behavioral economics", p: "phrase", m: "the study of how psychology affects spending", ex: "Behavioral economics looks at habits." },
            { w: "fixed bills", p: "phrase", m: "regular costs you must pay (rent, utilities)", ex: "Pay your fixed bills first." },
            { w: "regret", p: "noun", m: "feeling sorry about a decision", ex: "Most regret comes early." },
          ],
          mcqs: [
            {
              q: "What is the 'wealth effect'?",
              opts: [
                "When you actually become rich.",
                "A short feeling of being richer after a salary arrives.",
                "A government tax policy.",
                "A bank fee.",
              ],
              correct: 1,
              explanation: "The talk defines it as feeling temporarily richer.",
            },
            {
              q: "What kinds of purchases are most common after payday?",
              opts: [
                "Houses and cars.",
                "Long-term investments.",
                "Impulse purchases like takeaway dinners and online clothes.",
                "Insurance plans.",
              ],
              correct: 2,
              explanation: "The talk lists these specific impulse buys.",
            },
            {
              q: "What advice do researchers give?",
              opts: [
                "Spend as soon as the money lands.",
                "Wait 48 hours and pay fixed bills first.",
                "Always invest the full salary.",
                "Get paid weekly instead of monthly.",
              ],
              correct: 1,
              explanation: "The closing recommendation is the 48-hour rule.",
            },
          ],
        },
        {
          id: "li:w1d5:fashion",
          category: "fashion",
          title: "Inside a Marrakech market",
          intro: "A short travel-style description.",
          text: "Walking into the main square of Marrakech feels like stepping into a film. The smell of orange blossom and grilled lamb mixes with the sharp scent of leather and dye. To one side, women paint henna designs on tourists' hands. To another, an old man balances three teapots in a slow, careful arc, pouring mint tea into glass cups from above his head. The fabric stalls are overflowing — silk scarves in sunset colors, hand-stitched bags, kaftans with tiny mirrors sewn into them. If you stop too long at any stall, the seller will smile and start a friendly conversation about price. Bargaining is expected. Walking away is also expected. By the third day, you start to enjoy the dance.",
          vocab: [
            { w: "stall", p: "noun", m: "a small open shop in a market", ex: "Fabric stalls in the bazaar." },
            { w: "henna", p: "noun", m: "natural plant dye for skin/hair", ex: "Henna designs on the hands." },
            { w: "kaftan", p: "noun", m: "a long, loose Middle-Eastern robe", ex: "A bright kaftan with mirrors." },
            { w: "to bargain", p: "verb", m: "to negotiate a price", ex: "Bargaining is expected." },
            { w: "the dance (idiom)", p: "phrase", m: "the back-and-forth ritual", ex: "You start to enjoy the dance." },
          ],
          mcqs: [
            {
              q: "What does the speaker compare entering the market to?",
              opts: [
                "Walking into a library.",
                "Stepping into a film.",
                "Entering a museum.",
                "Going to a quiet café.",
              ],
              correct: 1,
              explanation: "The opening line states it directly.",
            },
            {
              q: "How is mint tea poured at the market?",
              opts: [
                "Quickly into paper cups.",
                "From above the head into glass cups, in a slow careful arc.",
                "Cold over ice.",
                "Through a tea bag.",
              ],
              correct: 1,
              explanation: "The talk describes this exact image of pouring from above the head.",
            },
            {
              q: "What does 'enjoy the dance' refer to?",
              opts: [
                "A traditional Moroccan dance show.",
                "The back-and-forth process of bargaining.",
                "Tourists dancing in the square.",
                "Music coming from the stalls.",
              ],
              correct: 1,
              explanation: "It's a metaphor for the bargaining ritual.",
            },
          ],
        },
      ],
    },

    /* ===== DAY 6 ===== */
    {
      day: 6,
      tasks: [
        {
          id: "li:w1d6:general",
          category: "general",
          title: "Our 'plan jar' at home",
          intro: "A small lifestyle story.",
          text: "Last year my partner and I started something simple. We took an empty jar, kept it on the kitchen shelf, and every weekend we wrote one small idea for a future plan on a slip of paper and dropped it in. Anything counted: visit the new bakery, watch a documentary on Sunday, take a long walk by the river. Every Friday evening we pull out one slip together and that becomes our weekend plan. It sounds silly, but it has been one of the best things we have done for our relationship. We argue less about what to do, we feel like we always have something to look forward to, and on a hard week, even reaching into the jar makes us smile.",
          vocab: [
            { w: "jar", p: "noun", m: "a glass container with a lid", ex: "We use an empty glass jar." },
            { w: "slip (of paper)", p: "noun", m: "a small piece of paper", ex: "A slip with one idea on it." },
            { w: "to look forward to", p: "phrase", m: "to feel excited about (future)", ex: "Always something to look forward to." },
            { w: "to argue", p: "verb", m: "to disagree out loud", ex: "We argue less now." },
            { w: "silly", p: "adj", m: "a bit foolish, simple", ex: "It sounds silly, but it works." },
          ],
          mcqs: [
            {
              q: "How is the jar used?",
              opts: [
                "For storing money.",
                "For dropping in small plan ideas each weekend.",
                "For collecting candles.",
                "For decoration only.",
              ],
              correct: 1,
              explanation: "The speaker explains they drop ideas into the jar.",
            },
            {
              q: "Which benefit is mentioned?",
              opts: [
                "Saving money on dates.",
                "They argue less about what to do together.",
                "It made them famous.",
                "It improved their cooking.",
              ],
              correct: 1,
              explanation: "She specifically says they argue less.",
            },
            {
              q: "What can we infer about the couple?",
              opts: [
                "They prefer pure spontaneity over planning.",
                "Small planned moments work for them.",
                "They mostly travel internationally.",
                "They never go out anymore.",
              ],
              correct: 1,
              explanation: "The whole story shows the couple values these small planned weekend moments.",
            },
          ],
        },
        {
          id: "li:w1d6:scientific",
          category: "scientific",
          title: "How the brain tracks 'best friends'",
          intro: "A short academic-style piece.",
          text: "Researchers studying social neuroscience have found something interesting: the brain seems to dedicate more processing power to a small number of close friends than to a wider social circle. Brain scans show that when we hear the names of people in our 'inner circle,' regions linked to emotion and memory light up strongly, while names of acquaintances barely register. This may explain why we remember the small details of close friends so easily — what they like to drink, what they wore last summer, the silly thing they said in two thousand and nineteen. The brain treats those people almost as extensions of ourselves. Outer-circle friends are processed more like background information.",
          vocab: [
            { w: "inner circle", p: "phrase", m: "your closest few friends", ex: "Her inner circle is small." },
            { w: "acquaintance", p: "noun", m: "someone you know but not closely", ex: "He is more acquaintance than friend." },
            { w: "to register", p: "verb", m: "to be noticed or recorded", ex: "The name barely registered." },
            { w: "extension (of)", p: "noun", m: "a part that feels connected to something", ex: "Close friends feel like an extension of you." },
            { w: "background information", p: "phrase", m: "things known but not central", ex: "Acquaintances become background information." },
          ],
          mcqs: [
            {
              q: "What did brain scans show?",
              opts: [
                "All names cause the same brain reaction.",
                "Inner-circle names activate emotion and memory areas strongly.",
                "Acquaintances activate the brain more than friends.",
                "Brain scans showed nothing.",
              ],
              correct: 1,
              explanation: "The talk states this difference clearly.",
            },
            {
              q: "Why do we remember small details about close friends so easily?",
              opts: [
                "We write them down.",
                "The brain treats close friends almost as extensions of ourselves.",
                "Best friends share their memories with us.",
                "We have unlimited memory for friends.",
              ],
              correct: 1,
              explanation: "The 'extensions of ourselves' phrasing is in the talk.",
            },
            {
              q: "How are acquaintances processed?",
              opts: [
                "As emotional core information.",
                "More like background information.",
                "They are forgotten completely.",
                "They are stored in the same area as close friends.",
              ],
              correct: 1,
              explanation: "The closing line: outer-circle friends are processed like background.",
            },
          ],
        },
        {
          id: "li:w1d6:fashion",
          category: "fashion",
          title: "Decorating for a surprise party",
          intro: "A short, warm anecdote.",
          text: "Throwing a surprise party for my best friend was harder than I expected. I had three hours and no patience for fancy decoration, so I went with simple things. Long strings of warm fairy lights — the kind you actually want to keep up after the party. White paper lanterns, balloons in only two colors so the apartment did not look like a children's birthday. A small homemade sign above the kitchen counter that just said her name in soft gold letters. The trick I learned: less is more, but lighting is everything. People always remember how a room felt, not how many balloons were in it. When she finally walked through the door, her face lit up before she had even seen the cake.",
          vocab: [
            { w: "fairy lights", p: "phrase", m: "small string lights for decoration", ex: "Warm fairy lights everywhere." },
            { w: "lantern", p: "noun", m: "a hanging or carried light", ex: "White paper lanterns." },
            { w: "to light up (face)", p: "phrase", m: "to suddenly look very happy", ex: "Her face lit up." },
            { w: "decoration", p: "noun", m: "items added to look nice", ex: "Simple decoration is enough." },
            { w: "less is more", p: "phrase", m: "simpler is often better", ex: "Less is more for parties." },
          ],
          mcqs: [
            {
              q: "How long did the speaker have to prepare?",
              opts: ["One hour", "Three hours", "A whole day", "A week"],
              correct: 1,
              explanation: "She mentions three hours.",
            },
            {
              q: "What lesson did she learn about decoration?",
              opts: [
                "Bright colors and lots of balloons.",
                "Less is more, but lighting is everything.",
                "Stick to one color of balloons only.",
                "Always rent professional equipment.",
              ],
              correct: 1,
              explanation: "Her exact phrase is in the talk.",
            },
            {
              q: "What does the speaker say people remember?",
              opts: [
                "How many balloons were in the room.",
                "How a room felt, not how many balloons it had.",
                "The exact food served.",
                "Who arrived first.",
              ],
              correct: 1,
              explanation: "She makes this point directly.",
            },
          ],
        },
      ],
    },

    /* ===== DAY 7 ===== */
    {
      day: 7,
      tasks: [
        {
          id: "li:w1d7:general",
          category: "general",
          title: "A book that changed my mind",
          intro: "A reflective short anecdote.",
          text: "I used to dislike science fiction. I thought it was all spaceships and laser guns, and I told myself, with some pride, that I read 'serious' literature. Then a friend, almost as a joke, gave me a short novel by Ursula K. Le Guin. I read the first chapter at night, expecting to put it down quickly. Instead, I stayed up until three in the morning. That book taught me a lesson I have not forgotten: my opinion of an entire genre was based on almost nothing, just two or three weak books from years ago. Since then, I try to ask myself one question whenever I dismiss something: 'Have I actually read it, or am I rejecting an idea of it?' Most of the time, the answer is the second one.",
          vocab: [
            { w: "science fiction", p: "phrase", m: "a genre about future / imagined science", ex: "She used to avoid science fiction." },
            { w: "genre", p: "noun", m: "a category of book / film / music", ex: "An entire genre dismissed unfairly." },
            { w: "to dismiss", p: "verb", m: "to reject without giving a chance", ex: "I dismissed the genre." },
            { w: "to reject", p: "verb", m: "to refuse or push away", ex: "Rejecting an idea of it." },
            { w: "to put down (a book)", p: "phrase", m: "to stop reading", ex: "I couldn't put it down." },
          ],
          mcqs: [
            {
              q: "What was the speaker's old opinion of science fiction?",
              opts: [
                "It was the highest form of literature.",
                "It was just spaceships and lasers — not 'serious' literature.",
                "It was too short to enjoy.",
                "It was only for children.",
              ],
              correct: 1,
              explanation: "The opening lines describe exactly this prejudice.",
            },
            {
              q: "What did the Le Guin novel teach the speaker?",
              opts: [
                "That science fiction is the only good genre.",
                "That her opinion was based on almost nothing.",
                "That novels are too long.",
                "That she should write her own book.",
              ],
              correct: 1,
              explanation: "The lesson she learned: her dismissal was uninformed.",
            },
            {
              q: "What is her new question to herself when dismissing things?",
              opts: [
                "'Is it expensive?'",
                "'Have I actually read/seen it, or am I rejecting an idea of it?'",
                "'Will my friends like it?'",
                "'Is it popular?'",
              ],
              correct: 1,
              explanation: "She quotes this question directly.",
            },
          ],
        },
        {
          id: "li:w1d7:scientific",
          category: "scientific",
          title: "How fiction increases empathy",
          intro: "A short academic-style talk.",
          text: "It might sound strange, but reading made-up stories may quietly make us kinder. A study from York University tested how well people could read the emotions of others — guessing feelings from photographs of just the eyes. The participants who regularly read literary fiction scored significantly higher than those who only read non-fiction or did not read much at all. The leading theory is straightforward. When we follow a character through hundreds of pages, we practice imagining what it feels like to be someone else. Over time, that practice builds something close to a muscle — an ability to step briefly out of our own perspective and into another's. In a world full of disagreement, this might be one of the most underrated skills we have.",
          vocab: [
            { w: "empathy", p: "noun", m: "understanding what others feel", ex: "Fiction trains empathy." },
            { w: "literary fiction", p: "phrase", m: "novels focused on style and inner life", ex: "Literary fiction develops empathy." },
            { w: "perspective", p: "noun", m: "point of view", ex: "Step into another's perspective." },
            { w: "to score", p: "verb", m: "to get a result on a test", ex: "They scored higher on the test." },
            { w: "underrated", p: "adj", m: "valued less than it deserves", ex: "An underrated skill." },
          ],
          mcqs: [
            {
              q: "What did the York University study test?",
              opts: [
                "How fast people read.",
                "How well people could read others' emotions from photos of eyes.",
                "How many books people owned.",
                "How long people slept after reading.",
              ],
              correct: 1,
              explanation: "The talk describes the eye-photograph emotion task.",
            },
            {
              q: "Who scored highest?",
              opts: [
                "Non-fiction-only readers.",
                "People who did not read much.",
                "Regular readers of literary fiction.",
                "People who only read poetry.",
              ],
              correct: 2,
              explanation: "The talk says literary fiction readers scored significantly higher.",
            },
            {
              q: "What is the leading theory for this effect?",
              opts: [
                "Books are written by smart people.",
                "Following characters builds the mental practice of stepping into others' perspectives.",
                "Reading is good exercise for the eyes.",
                "Fiction has more facts than non-fiction.",
              ],
              correct: 1,
              explanation: "The talk describes practice in stepping into another's perspective.",
            },
          ],
        },
        {
          id: "li:w1d7:fashion",
          category: "fashion",
          title: "My first art exhibit at twelve",
          intro: "A short, warm story.",
          text: "When I was twelve, my mother took me to my first real art exhibit. It was an Impressionist show in Paris — Monet, Renoir, a few smaller names I have since forgotten. I was bored for the first room. I was hungry. I wanted to leave. Then we walked into a smaller side gallery and I saw a single painting of a woman standing on a balcony at sunset. I do not know why, but I started to cry, very quietly, in front of it. My mother did not say anything; she just stood next to me. It was the first time I understood that a painting could be a kind of small private conversation between you and someone who lived a hundred years ago. Twenty years later, I still remember the exact feeling.",
          vocab: [
            { w: "art exhibit", p: "phrase", m: "a public showing of artwork", ex: "An Impressionist exhibit in Paris." },
            { w: "Impressionist", p: "adj/noun", m: "a 19th-century art style (light, soft brushstrokes)", ex: "An Impressionist painter." },
            { w: "gallery (side gallery)", p: "noun", m: "a smaller exhibit room", ex: "A small side gallery." },
            { w: "to come to life", p: "phrase", m: "to feel suddenly alive", ex: "The painting came to life." },
            { w: "private conversation", p: "phrase", m: "a personal exchange (here metaphorical)", ex: "A private conversation across time." },
          ],
          mcqs: [
            {
              q: "How did the speaker feel during the first room?",
              opts: [
                "Excited and curious.",
                "Bored and hungry.",
                "Afraid of crowds.",
                "Sleepy from the trip.",
              ],
              correct: 1,
              explanation: "The talk describes both feelings clearly.",
            },
            {
              q: "What happened in the side gallery?",
              opts: [
                "She got lost from her mother.",
                "She quietly cried in front of one painting.",
                "She tried to touch a painting.",
                "She fell asleep.",
              ],
              correct: 1,
              explanation: "The story turns on this moment.",
            },
            {
              q: "What did the speaker realize that day?",
              opts: [
                "Paintings are decoration only.",
                "A painting can be a private conversation across a hundred years.",
                "Impressionism is the best art movement.",
                "She wanted to be a painter herself.",
              ],
              correct: 1,
              explanation: "The closing reflection states this exact insight.",
            },
          ],
        },
      ],
    },
  ],
};
