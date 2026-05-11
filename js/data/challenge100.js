/* 100-Day Speaking & Writing Challenge — content
 *
 * Per day:
 *   • 3 speaking tasks (1 general tone, 2 formal/academic)
 *     - 5-minute talk on the subject
 *     - 8-12 useful words/expressions to plug in
 *     - Record → Gemini analyses vocab usage, grammar, native AmE alternatives
 *
 *   • 3 writing tasks
 *     - 1 grammar (B1-C1 flexible): explanation + ~10 exercises
 *     - 1 words: Part A = 10 words to describe, Part B = 10 descriptions to name
 *     - 1 free essay (120-150 words) on a subject → Gemini feedback
 *
 * Level: B2-C1 (grammar flexes to B1-C1).
 */

window.CHALLENGE100 = {
  totalDays: 100,
  days: [

    /* ============================== DAY 1 ============================== */
    {
      day: 1,
      title: "Hobbies, attention & the present perfect",
      blurb: "Talk about something you do for yourself, then about how attention is shifting in the digital era. Grammar is present perfect vs past simple.",
      speaking: [
        {
          id: "c1:d1:sp1",
          tone: "general",
          minutes: 5,
          subject: "A hobby you've recently picked up — or one you keep meaning to start",
          prompt: [
            "Talk for about five minutes about a hobby you've either taken up lately or have been planning to start.",
            "Walk through *why* it appeals to you, what's getting in your way, and what a good week with this hobby would look like."
          ].join(" "),
          guideQuestions: [
            "What first drew you to this activity?",
            "How does it fit (or not fit) into your weekly routine?",
            "What does progress look like for you — visible results, or just enjoyment?",
            "Is there a person, video, or book that nudged you toward it?",
            "Where do you see yourself with this hobby in a year?"
          ],
          vocab: [
            { w: "pick up",       p: "phrasal v",  m: "to start doing (a hobby, skill) somewhat casually" },
            { w: "dabble in",     p: "phrasal v",  m: "to try something briefly, without deep commitment" },
            { w: "get hooked",    p: "phrasal v",  m: "to become very interested in something" },
            { w: "unwind",        p: "v",          m: "to relax mentally after work or stress" },
            { w: "carve out time",p: "expression", m: "to intentionally make time for something" },
            { w: "creative outlet",p:"noun phrase", m: "an activity that lets you express yourself" },
            { w: "low-stakes",    p: "adj",        m: "where failure doesn't really cost much" },
            { w: "muscle memory", p: "noun phrase",m: "the body remembering a motion through repetition" },
            { w: "plateau",       p: "v / n",      m: "to stop improving after a period of progress" },
            { w: "stick with it", p: "expression", m: "to continue despite difficulty" }
          ],
          expressions: [
            "I've been meaning to ___ for a while now.",
            "What got me into it was ___.",
            "It's the kind of thing you can do without thinking too hard.",
            "I tend to hit a plateau after a few weeks.",
            "Honestly, it's less about being good at it and more about ___."
          ]
        },
        {
          id: "c1:d1:sp2",
          tone: "formal",
          minutes: 5,
          subject: "How short-form video is reshaping attention spans in young adults",
          prompt: [
            "Discuss, in an analytical tone, how platforms built around short-form video may be affecting the attention spans of people roughly between 16 and 30.",
            "Try to weigh evidence on both sides instead of taking the easiest position."
          ].join(" "),
          guideQuestions: [
            "What changes in behaviour are most often attributed to short-form content?",
            "How robust is the evidence — is it correlational or causal?",
            "Are there confounding factors (sleep, stress, smartphone use generally)?",
            "Could there be cognitive *benefits* to rapid-context switching?",
            "What interventions, at the level of the individual or the platform, might help?"
          ],
          vocab: [
            { w: "cognitive bandwidth", p: "noun phrase", m: "the mental capacity available at a given moment" },
            { w: "fragmented attention",p: "noun phrase", m: "attention split across many short stimuli" },
            { w: "engagement loop",     p: "noun phrase", m: "a designed cycle that keeps a user returning" },
            { w: "dopamine-driven",     p: "adj",         m: "powered by short bursts of reward" },
            { w: "correlation vs causation", p: "expression", m: "two things appearing together is not proof one causes the other" },
            { w: "self-regulation",     p: "noun",        m: "the ability to control one's own behaviour" },
            { w: "deliberate practice", p: "noun phrase", m: "focused, goal-directed practice on a hard task" },
            { w: "diminishing returns", p: "noun phrase", m: "each additional unit produces less benefit than the last" },
            { w: "moral panic",         p: "noun phrase", m: "widespread alarm over a perceived threat to society, often disproportionate" },
            { w: "compelling case",     p: "noun phrase", m: "an argument that is hard to dismiss" }
          ],
          expressions: [
            "There's a compelling case to be made that ___.",
            "That said, we should be careful not to conflate correlation with causation.",
            "One could argue, however, that ___.",
            "The evidence here is, at best, suggestive.",
            "A more nuanced reading would suggest that ___."
          ]
        },
        {
          id: "c1:d1:sp3",
          tone: "formal",
          minutes: 5,
          subject: "The case for and against a universal basic income",
          prompt: [
            "Present a balanced five-minute analysis of universal basic income (UBI) — what it is, the strongest arguments for it, and the strongest objections.",
            "Aim for an academic register: measured, qualified, and structured."
          ].join(" "),
          guideQuestions: [
            "How would you define UBI in one or two sentences?",
            "What macroeconomic concerns does it raise (inflation, labour participation)?",
            "What does the limited empirical evidence (e.g., Finland, Kenya, Stockton) actually show?",
            "Are there cheaper or better-targeted alternatives — negative income tax, expanded EITC?",
            "Under what conditions, if any, would you support it?"
          ],
          vocab: [
            { w: "unconditional transfer", p: "noun phrase", m: "money given without requirements to qualify" },
            { w: "labour-market participation", p: "noun phrase", m: "the rate at which people are working or seeking work" },
            { w: "fiscal sustainability", p: "noun phrase", m: "whether a policy is affordable long-term" },
            { w: "inflationary pressure", p: "noun phrase", m: "forces pushing prices upward" },
            { w: "means-tested",        p: "adj",          m: "available only to those below a certain income" },
            { w: "structural unemployment", p: "noun phrase", m: "joblessness caused by mismatches between skills and jobs" },
            { w: "pilot program",       p: "noun phrase",  m: "a small-scale trial of a policy" },
            { w: "in aggregate",        p: "expression",   m: "considered as a whole, summed across cases" },
            { w: "trade-off",           p: "noun",         m: "a choice that gives up one good for another" },
            { w: "ostensibly",          p: "adv",          m: "apparently, on the surface (often with implied doubt)" }
          ],
          expressions: [
            "Proponents argue that ___, whereas critics point out ___.",
            "The evidence, while preliminary, suggests ___.",
            "We must distinguish between the short-run and long-run effects.",
            "It is far from clear that ___.",
            "On balance, my view is ___, though with the caveat that ___."
          ]
        }
      ],

      writing: [
        {
          id: "c1:d1:gr",
          type: "grammar",
          level: "B2-C1",
          topic: "Present Perfect vs Past Simple",
          explanation: [
            "Both tenses look back from now, but they answer different questions.",
            "",
            "**Past Simple** locates an action at a *finished* time. The time is closed: yesterday, last week, in 2019, when I was a student.",
            "  · I *saw* her yesterday.",
            "  · We *lived* in Berlin for two years (and we don't anymore).",
            "",
            "**Present Perfect** connects a past action to *now*. The time is unfinished, or unspecified, or the result is still present.",
            "  · I *have seen* her three times this week. (this week isn't over)",
            "  · We *have lived* in Berlin for two years. (still live there)",
            "  · I *have lost* my keys. (and I still don't have them)",
            "",
            "Signals that pull each way:",
            "  · Past simple: yesterday, ago, last X, in 2010, when…",
            "  · Present perfect: ever / never, already / yet, since / for, so far, recently, lately, this week / month.",
            "",
            "B2 trap: AmE often allows past simple where BrE would prefer present perfect — *Did you eat yet?* vs *Have you eaten yet?* Both are heard; for academic writing, the present-perfect form is safer.",
            "",
            "C1 nuance: *have been -ing* (present perfect continuous) emphasises the activity and its duration; *have done* (present perfect simple) emphasises the *result*. — *I've been writing emails all morning* (focus: process). *I've written six emails* (focus: count, finished pieces)."
          ].join("\n"),
          exercises: [
            { type: "mcq", q: "She _____ in Paris from 2015 to 2019, but she lives in Madrid now.",
              options: ["has lived", "lived", "had lived"], answer: 1,
              why: "A finished period (2015–2019) takes past simple." },
            { type: "mcq", q: "I can't find my wallet. I think I _____ it on the bus.",
              options: ["have left", "left", "leave"], answer: 0,
              why: "The result (no wallet now) is present — use present perfect." },
            { type: "mcq", q: "How long _____ you _____ English?",
              options: ["did / study", "have / studied", "are / studying"], answer: 1,
              why: "Duration up to now — present perfect with 'for/since'." },
            { type: "mcq", q: "_____ you ever _____ to Japan?",
              options: ["Did / go", "Have / been", "Have / gone"], answer: 1,
              why: "Life experience question — *have been* (you came back). *Have gone* would imply still there." },
            { type: "fill", q: "We ___ (just / finish) dinner, so we're not hungry.",
              answer: "have just finished",
              accept: ["just finished", "'ve just finished"],
              why: "*Just* with present perfect signals very recent and the result (not hungry) is now." },
            { type: "fill", q: "When I was a kid, I ___ (read) every Harry Potter book the week it came out.",
              answer: "read",
              accept: ["used to read"],
              why: "*When I was a kid* is a closed time → past simple." },
            { type: "fill", q: "She ___ (work) on this paper since Monday and she still isn't done.",
              answer: "has been working",
              accept: ["has worked"],
              why: "Activity ongoing and emphasised → present perfect continuous." },
            { type: "mcq", q: "I _____ that movie three times — let's pick something else.",
              options: ["saw", "have seen", "had seen"], answer: 1,
              why: "Life count up to now — present perfect." },
            { type: "mcq", q: "He _____ his keys somewhere — that's why he can't open the door.",
              options: ["lost", "has lost", "was losing"], answer: 1,
              why: "Past action with a present result." },
            { type: "fill", q: "Sorry I'm late — I ___ (wait) for the bus for thirty minutes.",
              answer: "have been waiting",
              accept: ["was waiting", "have waited"],
              why: "Continuous waiting up to now → present perfect continuous is most natural." }
          ]
        },
        {
          id: "c1:d1:wd",
          type: "words",
          level: "B2-C1",
          title: "Vocabulary lab — Day 1",
          partA: {
            intro: "Describe each word's meaning in your *own* English (one or two sentences). After you submit, Gemini will tell you whether your description is accurate and natural.",
            words: [
              { word: "perseverance", pos: "noun" },
              { word: "meticulous",   pos: "adj"  },
              { word: "ambivalent",   pos: "adj"  },
              { word: "succinct",     pos: "adj"  },
              { word: "inevitable",   pos: "adj"  },
              { word: "articulate",   pos: "adj/verb" },
              { word: "daunting",     pos: "adj"  },
              { word: "nostalgic",    pos: "adj"  },
              { word: "pragmatic",    pos: "adj"  },
              { word: "scrutinize",   pos: "verb" }
            ]
          },
          partB: {
            intro: "Read each description and type the single word that best fits. Synonyms count if they're a near-match.",
            items: [
              { description: "having a strong dislike or opposition to something",                   answer: "averse",        accept: ["opposed"] },
              { description: "showing or demanding high standards; difficult to satisfy",            answer: "exacting",      accept: ["demanding"] },
              { description: "to make something less severe or painful",                              answer: "alleviate",     accept: ["mitigate", "ease"] },
              { description: "happening pleasantly by chance",                                         answer: "serendipitous", accept: ["fortuitous"] },
              { description: "a clever and witty remark, usually short",                              answer: "quip",          accept: ["wisecrack"] },
              { description: "to formally cancel or put an end to",                                   answer: "abolish",       accept: ["annul", "repeal"] },
              { description: "extremely angry",                                                       answer: "livid",         accept: ["furious", "incensed"] },
              { description: "lasting for only a very short time",                                     answer: "fleeting",      accept: ["ephemeral", "transient"] },
              { description: "to express disapproval, especially in a formal way",                    answer: "rebuke",        accept: ["reprove", "reprimand"] },
              { description: "extremely small",                                                       answer: "minuscule",     accept: ["minute", "tiny"] }
            ]
          }
        },
        {
          id: "c1:d1:es",
          type: "essay",
          level: "B2-C1",
          minWords: 120,
          maxWords: 150,
          title: "Free essay — Day 1",
          subject: "Some people argue that being fluent in more than one language is essential in today's world. Others see it as merely a useful skill. What is your position?",
          tips: [
            "Take a clear position in the first 1–2 sentences.",
            "Give one real example or scenario, not a long list of generic claims.",
            "Acknowledge the other side — briefly — before resolving back to your view.",
            "Aim for 5–7 sentences with varied length. Short sentences land well at the end."
          ]
        }
      ]
    },

    /* ============================== DAY 2 ============================== */
    {
      day: 2,
      title: "Place, climate & the conditional",
      blurb: "From a restaurant you love to renewable energy policy — and what *would* you do if. Conditionals: type 1, 2, 3.",
      speaking: [
        {
          id: "c1:d2:sp1",
          tone: "general",
          minutes: 5,
          subject: "A restaurant, café, or eating spot that has become 'yours'",
          prompt: [
            "Talk for five minutes about a place you keep coming back to for food or coffee.",
            "Make it specific — not 'a nice restaurant' but *that* corner table at *that* place on Tuesdays."
          ].join(" "),
          guideQuestions: [
            "What does the place look, sound, and smell like?",
            "Who's usually there — staff, regulars?",
            "Is there one dish or drink you almost always order? Why?",
            "What kind of mood brings you in — celebration, work, recovery?",
            "Have you ever brought someone there and watched them react?"
          ],
          vocab: [
            { w: "go-to",            p: "adj",       m: "the default choice for a situation" },
            { w: "tucked away",      p: "expression", m: "hidden, in a quiet or hard-to-spot location" },
            { w: "off the beaten path", p: "expression", m: "not in the obvious tourist areas" },
            { w: "regulars",         p: "noun",      m: "customers who come back often" },
            { w: "no-frills",        p: "adj",       m: "plain, without extras" },
            { w: "hole in the wall", p: "expression", m: "a small, modest place (often surprisingly good)" },
            { w: "to be a sucker for", p: "expression", m: "to find something irresistible" },
            { w: "comfort food",     p: "noun phrase", m: "food that gives emotional satisfaction" },
            { w: "atmosphere",       p: "noun",      m: "the mood or character of a place" },
            { w: "homey",            p: "adj",       m: "warm and welcoming like home" }
          ],
          expressions: [
            "It's a bit of a hole in the wall, but ___.",
            "Honestly, I'm a sucker for ___.",
            "If I had to recommend one dish, it would be ___.",
            "The thing that keeps me coming back is ___.",
            "It's not fancy, but that's kind of the point."
          ]
        },
        {
          id: "c1:d2:sp2",
          tone: "formal",
          minutes: 5,
          subject: "Should governments accelerate the transition to renewable energy, even at significant economic cost?",
          prompt: [
            "Present a structured argument about how aggressively governments should pursue the transition away from fossil fuels.",
            "Weigh climate urgency against economic disruption — and try not to caricature either position."
          ].join(" "),
          guideQuestions: [
            "What does 'significant economic cost' actually mean — jobs, prices, sovereign debt?",
            "Which sectors are hardest to decarbonise, and why?",
            "How do you weigh present economic harm against future climate harm?",
            "Are carbon pricing and subsidies complements or substitutes?",
            "What role should developing economies play, given their lower historical emissions?"
          ],
          vocab: [
            { w: "decarbonisation",  p: "noun",        m: "removing carbon emissions from the economy" },
            { w: "stranded assets",  p: "noun phrase", m: "assets (e.g. coal plants) that lose value before end-of-life" },
            { w: "just transition",  p: "noun phrase", m: "shifting away from fossil fuels while protecting workers" },
            { w: "carbon pricing",   p: "noun phrase", m: "putting a monetary price on CO2 emissions" },
            { w: "baseload power",   p: "noun phrase", m: "the minimum constant supply of electricity needed" },
            { w: "intermittency",    p: "noun",        m: "the on/off nature of solar and wind generation" },
            { w: "front-loaded cost",p: "noun phrase", m: "expense concentrated at the start of a project" },
            { w: "discount rate",    p: "noun phrase", m: "the rate used to value future outcomes today" },
            { w: "lock-in effect",   p: "noun phrase", m: "infrastructure choices that constrain future ones" },
            { w: "externalities",    p: "noun",        m: "costs (or benefits) that fall on third parties, not buyer/seller" }
          ],
          expressions: [
            "The core trade-off here is between ___ and ___.",
            "We risk locking in high-emission infrastructure for decades.",
            "Empirically, the costs are front-loaded, while the benefits accrue later.",
            "If we apply a low discount rate, the case for action strengthens considerably.",
            "It's not a question of *whether* but *how fast* and *who pays*."
          ]
        },
        {
          id: "c1:d2:sp3",
          tone: "formal",
          minutes: 5,
          subject: "Generative AI in higher education — tool, threat, or something in between?",
          prompt: [
            "Discuss how universities should respond to generative AI tools like ChatGPT.",
            "Try to move past the 'ban it / allow it' binary and consider what authentic learning even looks like in this environment."
          ].join(" "),
          guideQuestions: [
            "What is the function of an essay or homework assignment — output or process?",
            "Which assessments are most affected, which least?",
            "Are there pedagogical opportunities (feedback, scaffolding) that AI opens up?",
            "Is the goal to detect AI use, or to design around it?",
            "What does it mean to 'cheat' when the boundaries of authorship are shifting?"
          ],
          vocab: [
            { w: "pedagogy",         p: "noun",        m: "the practice and theory of teaching" },
            { w: "authentic assessment", p: "noun phrase", m: "evaluation that mirrors real-world tasks" },
            { w: "scaffolding",      p: "noun",        m: "structured support that's gradually removed as a learner gains skill" },
            { w: "formative feedback", p: "noun phrase", m: "feedback during learning, to guide improvement" },
            { w: "summative assessment", p: "noun phrase", m: "evaluation at the end, of what was learned" },
            { w: "academic integrity", p: "noun phrase", m: "honest and ethical conduct in academic work" },
            { w: "outsource",        p: "verb",        m: "to delegate work to another (here, to an AI)" },
            { w: "critical thinking", p: "noun phrase", m: "analysing claims and evidence rigorously" },
            { w: "epistemic humility", p: "noun phrase", m: "awareness of the limits of one's own knowledge" },
            { w: "moving target",    p: "expression",  m: "something that keeps changing as you try to address it" }
          ],
          expressions: [
            "Reframing the question, the issue is not detection but design.",
            "We should not conflate the symptom with the underlying problem.",
            "There is a real risk of outsourcing the very thinking we mean to develop.",
            "A more productive stance would be to ___.",
            "We are aiming at a moving target, which calls for institutional flexibility."
          ]
        }
      ],

      writing: [
        {
          id: "c1:d2:gr",
          type: "grammar",
          level: "B1-C1",
          topic: "Conditional sentences (Type 1, 2, 3) — and mixed conditionals",
          explanation: [
            "Conditionals come in three core shapes, plus mixed forms for when the two halves live in different time zones.",
            "",
            "**Type 1 — real / likely future.** *If* + present simple, *will* + base verb.",
            "  · If it *rains*, we *'ll cancel*.",
            "  · Use for things that *could realistically happen*.",
            "",
            "**Type 2 — unreal / hypothetical present or future.** *If* + past simple, *would* + base verb.",
            "  · If I *won* the lottery, I *would buy* a house.",
            "  · 'Were' is used for all persons in formal writing: *If I were you…*.",
            "",
            "**Type 3 — unreal past.** *If* + past perfect, *would have* + past participle.",
            "  · If I *had studied* harder, I *would have passed*.",
            "  · The past is fixed — we're imagining a counterfactual.",
            "",
            "**Mixed.** Past condition → present result:",
            "  · If I *had taken* the job, I *would be living* in Berlin now.",
            "Present condition → past result:",
            "  · If she *weren't* so shy, she *would have spoken* up at the meeting.",
            "",
            "B2 nuance: *unless* = *if not*, but only for the negative condition. *Unless you call me, I'll wait.* (= *If you don't call me, I'll wait.*)",
            "",
            "C1 nuance: in formal/literary style, you may see inversion in place of *if*:",
            "  · *Were he* to apologise, I would forgive him. (Type 2)",
            "  · *Had I known*, I would have helped. (Type 3)",
            "  · *Should you need anything*, please ask. (Type 1)"
          ].join("\n"),
          exercises: [
            { type: "mcq", q: "If I _____ you, I'd take the offer.",
              options: ["was", "were", "am"], answer: 1,
              why: "Formal Type 2 uses *were* for all persons." },
            { type: "mcq", q: "If she _____ harder last year, she would have won.",
              options: ["had trained", "trained", "would train"], answer: 0,
              why: "Type 3: past perfect in the *if*-clause." },
            { type: "mcq", q: "We _____ on time if the traffic isn't bad.",
              options: ["would arrive", "will arrive", "had arrived"], answer: 1,
              why: "Type 1: realistic future, *will* in the result." },
            { type: "fill", q: "Unless you ___ (hurry), we'll miss the train.",
              answer: "hurry",
              why: "*Unless* takes the present simple, like an *if* clause." },
            { type: "fill", q: "If she ___ (not be) so tired, she would come with us tonight.",
              answer: "weren't",
              accept: ["were not", "wasn't"],
              why: "Type 2: hypothetical present → *if* + past, *would* + base." },
            { type: "fill", q: "If I ___ (take) that job, I would be living in Tokyo now.",
              answer: "had taken",
              why: "Mixed conditional: past unreal cause → present result." },
            { type: "mcq", q: "_____ you need anything during your stay, just call reception.",
              options: ["Should", "Will", "Would"], answer: 0,
              why: "Formal Type 1 inversion: *Should you need* = *If you need*." },
            { type: "mcq", q: "If I had known about the meeting, I _____ earlier.",
              options: ["would leave", "had left", "would have left"], answer: 2,
              why: "Type 3: *would have* + past participle." },
            { type: "fill", q: "If the temperature ___ (drop) further, the lake will freeze.",
              answer: "drops",
              why: "Type 1: present simple in the *if* clause for a likely future." },
            { type: "fill", q: "___ she been more careful, the accident wouldn't have happened.",
              answer: "Had",
              why: "Formal Type 3 inversion: *Had she been* = *If she had been*." }
          ]
        },
        {
          id: "c1:d2:wd",
          type: "words",
          level: "B2-C1",
          title: "Vocabulary lab — Day 2",
          partA: {
            intro: "Describe each word in your own English. Concrete is better than abstract — give the situation in which you'd use it.",
            words: [
              { word: "resilient",   pos: "adj"  },
              { word: "scarcity",    pos: "noun" },
              { word: "deliberate",  pos: "adj/verb" },
              { word: "tangible",    pos: "adj"  },
              { word: "concede",     pos: "verb" },
              { word: "lucrative",   pos: "adj"  },
              { word: "redundant",   pos: "adj"  },
              { word: "tedious",     pos: "adj"  },
              { word: "embellish",   pos: "verb" },
              { word: "diligent",    pos: "adj"  }
            ]
          },
          partB: {
            intro: "Find the word that matches each description.",
            items: [
              { description: "a strong feeling of dislike or disgust",                              answer: "aversion",      accept: ["repugnance", "loathing"] },
              { description: "to officially confirm or support a decision",                         answer: "endorse",       accept: ["uphold", "ratify"] },
              { description: "lacking in originality; overused",                                    answer: "trite",         accept: ["hackneyed", "cliché", "clichéd"] },
              { description: "the quality of being able to last or continue for a long time",      answer: "durability",    accept: ["longevity"] },
              { description: "to make less harsh or severe",                                        answer: "soften",        accept: ["mitigate", "temper"] },
              { description: "an indirect or subtle reference",                                     answer: "allusion",      accept: ["hint"] },
              { description: "to deceive by trickery, often for personal gain",                    answer: "swindle",       accept: ["deceive", "defraud"] },
              { description: "a state of perfect balance or harmony",                              answer: "equilibrium",   accept: ["balance"] },
              { description: "extremely impressive or moving",                                     answer: "stirring",      accept: ["poignant", "stirring", "moving"] },
              { description: "willing to accept new ideas or change",                              answer: "receptive",     accept: ["open-minded", "amenable"] }
            ]
          }
        },
        {
          id: "c1:d2:es",
          type: "essay",
          level: "B2-C1",
          minWords: 120,
          maxWords: 150,
          title: "Free essay — Day 2",
          subject: "Remote work has been described as the biggest shift in office culture in a generation. In your view, is its impact mostly positive, mostly negative, or genuinely mixed?",
          tips: [
            "Anchor your view to a *specific* dimension (collaboration, well-being, career growth) — vague positions read as weaker.",
            "Cite a personal observation or a known case briefly; avoid invented statistics.",
            "Use one or two linking devices well rather than five mechanically.",
            "Don't end with 'In conclusion'. End with a sentence that *is* the conclusion."
          ]
        }
      ]
    },

    /* ============================== DAY 3 ============================== */
    {
      day: 3,
      title: "Stories, change & relative clauses",
      blurb: "A book or film that shifted you, urbanisation and culture, healthcare debates — and relative clauses, defining vs non-defining.",
      speaking: [
        {
          id: "c1:d3:sp1",
          tone: "general",
          minutes: 5,
          subject: "A book, film, or show that changed how you see something",
          prompt: [
            "Talk about a piece of media that genuinely shifted your thinking on a topic — relationships, work, politics, anything.",
            "Try to be specific about *what* changed, not just 'it was great'."
          ].join(" "),
          guideQuestions: [
            "What did you believe before, and what do you believe now?",
            "Was there a single scene, line, or chapter that did the work?",
            "Did anything in your own life prepare you to hear that message?",
            "Have you recommended it to others? How have they reacted?",
            "Looking back, do you think you'd still react the same way today?"
          ],
          vocab: [
            { w: "stick with",       p: "phrasal v", m: "(of an idea/story) to stay in your mind" },
            { w: "resonate with",    p: "phrasal v", m: "to connect with you emotionally or intellectually" },
            { w: "blow your mind",   p: "expression",m: "to surprise or impress you deeply" },
            { w: "see things in a new light", p: "expression", m: "to understand something differently" },
            { w: "underrated",       p: "adj",       m: "less well-regarded than it deserves" },
            { w: "slow burn",        p: "expression",m: "something that develops gradually but rewards patience" },
            { w: "plot twist",       p: "noun phrase",m: "an unexpected turn in a story" },
            { w: "character arc",    p: "noun phrase",m: "how a character changes over the story" },
            { w: "thought-provoking",p: "adj",       m: "making you think deeply" },
            { w: "in hindsight",     p: "expression",m: "looking back at something now" }
          ],
          expressions: [
            "The thing that really stuck with me was ___.",
            "It made me see ___ in a completely new light.",
            "There's this one scene where ___ — that was the turning point for me.",
            "In hindsight, I think I needed to hear ___.",
            "It's underrated — I keep recommending it and nobody's heard of it."
          ]
        },
        {
          id: "c1:d3:sp2",
          tone: "formal",
          minutes: 5,
          subject: "Rapid urbanisation and the future of traditional cultures",
          prompt: [
            "Analyse the tension between rapid urbanisation and the preservation of traditional ways of life.",
            "Resist a pure 'modernity bad, tradition good' framing — both sides have legitimate claims."
          ].join(" "),
          guideQuestions: [
            "What economic forces drive rural-to-urban migration?",
            "What is lost, concretely, when a community disperses — language, ritual, food, knowledge?",
            "Are there examples of cultures that adapted urban life without losing identity?",
            "What is the role of policy: preservation, integration, both?",
            "Is there a difference between *living* tradition and *museumified* tradition?"
          ],
          vocab: [
            { w: "rural exodus",     p: "noun phrase", m: "large-scale migration from countryside to city" },
            { w: "cultural erosion", p: "noun phrase", m: "gradual loss of cultural practices and identity" },
            { w: "intangible heritage", p: "noun phrase", m: "non-physical cultural elements: language, ritual, music" },
            { w: "ethnographic",     p: "adj",         m: "relating to the study of peoples and cultures" },
            { w: "diaspora",         p: "noun",        m: "people of a common origin scattered across regions" },
            { w: "homogenisation",   p: "noun",        m: "becoming more uniform; loss of variation" },
            { w: "syncretism",       p: "noun",        m: "the blending of different cultural traditions" },
            { w: "in tandem with",   p: "expression",  m: "alongside, together with" },
            { w: "preserve in aspic",p: "expression",  m: "to keep something frozen as a museum piece" },
            { w: "lived experience", p: "noun phrase", m: "first-hand experience as opposed to abstract description" }
          ],
          expressions: [
            "It is reductive to frame this as a binary between modernity and tradition.",
            "What is at stake here is not architecture but lived experience.",
            "We risk preserving cultures in aspic rather than allowing them to evolve.",
            "Empirically, urbanisation and cultural vitality are not mutually exclusive.",
            "There is a meaningful distinction between adaptation and assimilation."
          ]
        },
        {
          id: "c1:d3:sp3",
          tone: "formal",
          minutes: 5,
          subject: "Public vs private healthcare — where should the line be drawn?",
          prompt: [
            "Present an analysis of public versus private healthcare delivery.",
            "Aim for clarity about what each system does well, where each fails, and what hybrid approaches look like in practice."
          ].join(" "),
          guideQuestions: [
            "What outcomes should we judge a healthcare system by — life expectancy, equity, cost, choice?",
            "How do administrative costs compare across systems?",
            "What role does private insurance play in otherwise public systems (France, Germany)?",
            "How do you weight individual choice against collective coverage?",
            "Is the US a fair comparison, or an outlier in too many ways to generalise from?"
          ],
          vocab: [
            { w: "universal coverage",p: "noun phrase", m: "system in which all residents have access to care" },
            { w: "out-of-pocket cost",p: "noun phrase", m: "what the patient pays directly" },
            { w: "risk pooling",     p: "noun phrase", m: "spreading health-cost risk across a large group" },
            { w: "single-payer",     p: "adj",         m: "one public entity pays for healthcare" },
            { w: "two-tier system",  p: "noun phrase", m: "where private care exists alongside public" },
            { w: "moral hazard",     p: "noun phrase", m: "people use more when they don't bear full cost" },
            { w: "adverse selection",p: "noun phrase", m: "sicker people disproportionately buying insurance" },
            { w: "cost containment", p: "noun phrase", m: "policies to keep health spending from rising too fast" },
            { w: "deductible",       p: "noun",        m: "amount you pay before insurance kicks in" },
            { w: "rationing",        p: "noun",        m: "deciding who gets which treatment when resources are finite" }
          ],
          expressions: [
            "Every healthcare system rations care — the question is *how*.",
            "We should distinguish between universality and uniformity.",
            "The empirical record favours hybrid models over pure private or pure public.",
            "A useful frame is: what are you optimising for — access, choice, or efficiency?",
            "Cross-country comparisons must control for ___."
          ]
        }
      ],

      writing: [
        {
          id: "c1:d3:gr",
          type: "grammar",
          level: "B1-C1",
          topic: "Relative clauses: defining vs non-defining",
          explanation: [
            "A relative clause gives extra information about a noun. The big split is **defining** vs **non-defining**.",
            "",
            "**Defining (no commas).** The clause is *essential* — it tells you *which one* you're talking about.",
            "  · The book *that I borrowed last week* is overdue.",
            "  · Without the clause, you don't know which book.",
            "  · *That* and *which* are both fine for things; *who* for people.",
            "  · You can usually drop the relative pronoun when it's the object: *The book I borrowed is overdue.*",
            "",
            "**Non-defining (commas).** Extra information you could leave out.",
            "  · My oldest sister, *who lives in Madrid*, is visiting.",
            "  · Use *who* / *which* — **never** *that* in non-defining clauses.",
            "  · Don't drop the pronoun: *My oldest sister, lives in Madrid, is visiting* is wrong.",
            "",
            "**Other relative pronouns / adverbs.**",
            "  · *whose* — possession: *the writer whose book won the prize*.",
            "  · *where* — place: *the town where I grew up*.",
            "  · *when* — time: *the year when we moved* (also: *the year we moved* / *the year that we moved*).",
            "  · *why* — reason: *the reason why she left* (also: *the reason she left*).",
            "",
            "C1 nuance: preposition + *which* in formal writing.",
            "  · *the foundation on which the theory rests* (formal)",
            "  · *the foundation that the theory rests on* (neutral)",
            "  · *the foundation the theory rests on* (informal but fine)",
            "",
            "Trap: **commas with proper nouns + 'that'**. *My brother, Sam,* implies you have one brother. *My brother Sam* implies you have more than one and you're specifying which."
          ].join("\n"),
          exercises: [
            { type: "mcq", q: "She's the only person _____ understood what I meant.",
              options: ["which", "who", "whom"], answer: 1,
              why: "*Who* for people in a defining clause as subject." },
            { type: "mcq", q: "My laptop, _____ I bought last year, is already too slow.",
              options: ["that", "which", "what"], answer: 1,
              why: "Non-defining clause — *which* (never *that*)." },
            { type: "fill", q: "The town ___ I grew up has changed a lot.",
              answer: "where",
              accept: ["in which", "that"],
              why: "*Where* for place, or *in which* for formal style." },
            { type: "mcq", q: "I met a writer _____ novels I really admire.",
              options: ["who", "whose", "that"], answer: 1,
              why: "*Whose* shows possession (the writer's novels)." },
            { type: "fill", q: "The reason ___ she's late is the traffic.",
              answer: "why",
              accept: ["that", ""],
              why: "*Why* — but you can also omit it (*the reason she's late*)." },
            { type: "mcq", q: "Anna, _____ has lived here for ten years, doesn't speak the local language.",
              options: ["that", "who", "which"], answer: 1,
              why: "Non-defining clause with a person — *who*, not *that*." },
            { type: "fill", q: "The foundation on ___ the theory rests is shaky.",
              answer: "which",
              why: "Formal style: preposition + *which*, not *that*." },
            { type: "mcq", q: "I lost the keys _____ you gave me.",
              options: ["that", "what", "which"], answer: 0,
              why: "Defining clause for things — *that* or *which* both work; *what* is wrong here." },
            { type: "fill", q: "She mentioned a film ___ won three awards last year.",
              answer: "that",
              accept: ["which"],
              why: "Defining clause as subject — *that* or *which*." },
            { type: "mcq", q: "My uncle, _____ I haven't seen in years, is coming for dinner.",
              options: ["that", "whom", "which"], answer: 1,
              why: "Non-defining, object — *whom* is formally correct (*who* is also widely accepted)." }
          ]
        },
        {
          id: "c1:d3:wd",
          type: "words",
          level: "B2-C1",
          title: "Vocabulary lab — Day 3",
          partA: {
            intro: "For each word, describe what it means in your own English. Try to capture connotation, not just the bare definition.",
            words: [
              { word: "candid",       pos: "adj"  },
              { word: "obscure",      pos: "adj/verb" },
              { word: "compelling",   pos: "adj"  },
              { word: "discrepancy",  pos: "noun" },
              { word: "elusive",      pos: "adj"  },
              { word: "humble",       pos: "adj"  },
              { word: "tentative",    pos: "adj"  },
              { word: "vibrant",      pos: "adj"  },
              { word: "yield",        pos: "verb/noun" },
              { word: "vex",          pos: "verb" }
            ]
          },
          partB: {
            intro: "Type the word that fits each description.",
            items: [
              { description: "easily understood; clear",                                            answer: "lucid",         accept: ["clear", "intelligible"] },
              { description: "to make a situation worse",                                            answer: "exacerbate",    accept: ["aggravate", "worsen"] },
              { description: "a person who works very hard, often at the expense of leisure",       answer: "workaholic",    accept: [] },
              { description: "to express strong disagreement",                                       answer: "object",        accept: ["dissent", "protest"] },
              { description: "a sudden, brief outburst",                                             answer: "flare",         accept: ["outburst", "eruption"] },
              { description: "characterised by careful and reliable judgement",                      answer: "prudent",       accept: ["judicious", "circumspect"] },
              { description: "to look at someone or something with admiration",                      answer: "admire",        accept: ["regard"] },
              { description: "the act of refusing to obey",                                          answer: "defiance",      accept: ["disobedience"] },
              { description: "shockingly bad or unacceptable",                                      answer: "egregious",     accept: ["outrageous", "appalling"] },
              { description: "to spread out from a central point",                                  answer: "radiate",       accept: ["disperse", "emanate"] }
            ]
          }
        },
        {
          id: "c1:d3:es",
          type: "essay",
          level: "B2-C1",
          minWords: 120,
          maxWords: 150,
          title: "Free essay — Day 3",
          subject: "Some say that the resources spent on space exploration would be better used solving problems on Earth. To what extent do you agree?",
          tips: [
            "'To what extent' invites a *partial* answer — fully agree / fully disagree feels weaker.",
            "Be concrete about the spending: NASA's budget is well under 0.5% of US federal spending, for example.",
            "Tie space exploration to *terrestrial* benefits (GPS, materials science) if that helps your argument.",
            "Keep your conclusion in one sentence — sharp is better than thorough."
          ]
        }
      ]
    }
  ]
};
