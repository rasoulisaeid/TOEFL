/* Week 1 — Writing content
 * Per day: 3 tasks (one per category, one per task type):
 *   1. cloze    (general)    — fill 10 blanks across 2 paragraphs from a word pool
 *   2. scramble (scientific) — rebuild 4-5 phrases from word chips
 *   3. guided   (fashion)    — 5-step paragraph, AI-refined
 */

window.WEEK1_WRITING = {
  number: 1,
  days: [
    /* ===================== DAY 1 ===================== */
    {
      day: 1,
      tasks: [
        {
          id: "wr:w1d1:cloze",
          type: "cloze",
          category: "general",
          title: "The morning rush",
          intro: "Fill the 10 blanks. Tap a word from the pool, tap a blank to drop it.",
          paragraphs: [
            "The morning {0} starts at 6:30. Maria makes her first {1} while the room is still dark. Outside, the city is just waking up, and the smell of fresh {2} moves out onto the wet street. By seven, a small {3} has already formed at the {4}.",
            "She {5} most of the faces. The man in the green coat always orders a flat white without {6}. The woman with the laptop orders a long {7} every Tuesday. Maria likes this part of the day: {8} is in a hurry, the music is {9}, and the world feels calm.",
          ],
          blanks: ["rush", "espresso", "coffee", "line", "counter", "knows", "sugar", "americano", "nobody", "soft"],
          pool: ["rush", "espresso", "coffee", "line", "counter", "knows", "sugar", "americano", "nobody", "soft",
                 "wave", "tea", "milk", "crowd", "kitchen", "sees", "cream", "macchiato", "everyone", "loud"],
        },
        {
          id: "wr:w1d1:scramble",
          type: "scramble",
          category: "scientific",
          title: "How caffeine wakes you up",
          intro: "Tap the words in the right order to rebuild each sentence.",
          phrases: [
            { correct: "Caffeine is a natural stimulant",                        scrambled: ["natural", "stimulant", "is", "a", "Caffeine"] },
            { correct: "It blocks the chemical that makes us feel tired",       scrambled: ["chemical", "makes", "us", "blocks", "the", "tired", "feel", "that", "It"] },
            { correct: "Within thirty minutes you feel more awake",             scrambled: ["awake", "thirty", "more", "Within", "minutes", "you", "feel"] },
            { correct: "But the effect does not last forever",                  scrambled: ["last", "the", "effect", "does", "not", "But", "forever"] },
          ],
        },
        {
          id: "wr:w1d1:guided",
          type: "guided",
          category: "fashion",
          title: "Describe a café you love",
          subject: "A café you love",
          brief: "Write 5 short sentences about a café that feels like 'yours'. Submit each sentence and Gemini will gently polish it — your ideas, your voice.",
          steps: [
            { prompt: "Set the scene: where is the café and what does it look like?",     hints: ["tucked", "cozy", "wooden"] },
            { prompt: "Describe the smells and sounds inside.",                            hints: ["aroma", "drift", "hum"] },
            { prompt: "Tell us about the people who go there.",                            hints: ["regulars", "students", "tourists"] },
            { prompt: "Pick one moment from this place that has stayed with you.",         hints: ["afternoon", "lingers", "comforting"] },
            { prompt: "End with what makes it feel like 'yours'.",                          hints: ["mine", "ritual", "belong"] },
          ],
        },
      ],
    },

    /* ===================== DAY 2 ===================== */
    {
      day: 2,
      tasks: [
        {
          id: "wr:w1d2:cloze",
          type: "cloze",
          category: "general",
          title: "A walk in the park",
          intro: "Pick the right word from the pool for each blank.",
          paragraphs: [
            "Every evening after work, Sara takes a {0} through the small park near her apartment. She does not bring her phone, only a thin {1} jacket and a pair of comfortable {2}. The path is short — about twenty {3} — but she goes around it twice. By the second {4}, her shoulders feel lighter.",
            "She is not trying to {5} weight or train for anything. She just likes the moment when the city {6} gets quieter and the light starts to {7} between the trees. Sometimes she meets a neighbor and they {8} for a few minutes; sometimes she walks the whole loop alone, thinking about {9} at all.",
          ],
          blanks: ["walk", "light", "shoes", "minutes", "loop", "lose", "noise", "fade", "chat", "nothing"],
          pool: ["walk", "light", "shoes", "minutes", "loop", "lose", "noise", "fade", "chat", "nothing",
                 "drive", "warm", "boots", "hours", "lap", "find", "smell", "shine", "argue", "everything"],
        },
        {
          id: "wr:w1d2:scramble",
          type: "scramble",
          category: "scientific",
          title: "Inside a sleep cycle",
          intro: "Rebuild each sentence by tapping the words in order.",
          phrases: [
            { correct: "A healthy sleep cycle lasts about ninety minutes",       scrambled: ["minutes", "cycle", "ninety", "about", "lasts", "sleep", "A", "healthy"] },
            { correct: "Deep sleep helps the body repair itself",                scrambled: ["the", "body", "Deep", "repair", "sleep", "itself", "helps"] },
            { correct: "REM sleep is when most dreaming happens",                scrambled: ["dreaming", "is", "happens", "when", "REM", "most", "sleep"] },
            { correct: "Waking between cycles feels much easier",                scrambled: ["easier", "between", "feels", "Waking", "much", "cycles"] },
          ],
        },
        {
          id: "wr:w1d2:guided",
          type: "guided",
          category: "fashion",
          title: "Why I wear what I wear",
          subject: "Your daily style",
          brief: "Write 5 short sentences about how you choose your clothes day to day. Be honest — comfort, mood, weather, all of it.",
          steps: [
            { prompt: "Describe one outfit you wear most often.",                          hints: ["jeans", "soft", "favorite"] },
            { prompt: "Why do you reach for it again and again?",                          hints: ["comfortable", "easy", "fits"] },
            { prompt: "How does your mood change what you wear?",                          hints: ["bright", "tired", "playful"] },
            { prompt: "Is there one item you would never give up?",                        hints: ["sweater", "scarf", "ring"] },
            { prompt: "End with what 'getting dressed' really feels like for you.",        hints: ["small ritual", "armor", "myself"] },
          ],
        },
      ],
    },

    /* ===================== DAY 3 ===================== */
    {
      day: 3,
      tasks: [
        {
          id: "wr:w1d3:cloze",
          type: "cloze",
          category: "general",
          title: "A typical Tuesday at work",
          intro: "Choose the best word for each blank.",
          paragraphs: [
            "Tuesdays at the office are always {0}. The first meeting starts at nine, and by the time it {1}, half her morning has disappeared. She {2} a coffee at the kitchen, says hi to two colleagues, and tries to {3} for thirty quiet minutes at her desk before the next call.",
            "Around two, she usually hits a small {4}. Her brain feels slower, her email pile feels {5}, and the office is too {6}. So she puts on her headphones, plays the same calm playlist, and {7} on one task at a time. By five, she has not finished {8}, but she has finished the {9} that mattered.",
          ],
          blanks: ["busy", "ends", "grabs", "focus", "wall", "endless", "noisy", "concentrates", "everything", "things"],
          pool: ["busy", "ends", "grabs", "focus", "wall", "endless", "noisy", "concentrates", "everything", "things",
                 "calm", "begins", "drinks", "rest", "win", "easy", "quiet", "panics", "anything", "tasks"],
        },
        {
          id: "wr:w1d3:scramble",
          type: "scramble",
          category: "scientific",
          title: "Notifications and attention",
          intro: "Build each sentence about why notifications hurt focus.",
          phrases: [
            { correct: "Each notification has a small but real cost",                          scrambled: ["small", "cost", "Each", "but", "notification", "has", "a", "real"] },
            { correct: "The brain switches modes for a moment",                                scrambled: ["for", "switches", "moment", "modes", "brain", "The", "a"] },
            { correct: "It takes minutes to return to deep focus",                             scrambled: ["return", "deep", "focus", "to", "minutes", "It", "takes", "to"] },
            { correct: "Turning notifications off is respectful of your attention",            scrambled: ["off", "respectful", "Turning", "your", "attention", "notifications", "of", "is"] },
          ],
        },
        {
          id: "wr:w1d3:guided",
          type: "guided",
          category: "fashion",
          title: "My ideal work outfit",
          subject: "Your ideal work outfit",
          brief: "Write 5 short sentences about an outfit that makes you feel ready to do good work.",
          steps: [
            { prompt: "Describe the top half: what are you wearing on top?",                   hints: ["soft", "blazer", "shirt"] },
            { prompt: "Describe the bottom half and shoes.",                                   hints: ["trousers", "sneakers", "comfortable"] },
            { prompt: "What colors do you usually pick for work, and why?",                    hints: ["neutral", "navy", "calm"] },
            { prompt: "Mention one small accessory that makes a difference.",                  hints: ["watch", "ring", "earrings"] },
            { prompt: "End with how this outfit makes you feel at the start of a meeting.",    hints: ["confident", "settled", "ready"] },
          ],
        },
      ],
    },

    /* ===================== DAY 4 ===================== */
    {
      day: 4,
      tasks: [
        {
          id: "wr:w1d4:cloze",
          type: "cloze",
          category: "general",
          title: "First evening in a new city",
          intro: "Fill in each blank with a word from the pool.",
          paragraphs: [
            "She arrives at the {0} just before sunset. The streets are full of {1} faces, and the language feels like a song she does not yet {2}. With a small map in her hand, she walks slowly, trying not to {3} too much like a tourist. Every corner reveals something {4}.",
            "By eight, she is hungry. She picks a tiny restaurant with handwritten menus and a kind {5} at the door. She points at a dish, smiles, and hopes for the best. The food arrives — warm, {6}, and clearly homemade. She eats it slowly, listens to a song from a {7} street, and writes one sentence in her {8}: {9} is good in this city already.",
          ],
          blanks: ["hotel", "unfamiliar", "understand", "look", "new", "owner", "delicious", "nearby", "notebook", "Something"],
          pool: ["hotel", "unfamiliar", "understand", "look", "new", "owner", "delicious", "nearby", "notebook", "Something",
                 "airport", "familiar", "speak", "feel", "old", "guide", "boring", "distant", "phone", "Nothing"],
        },
        {
          id: "wr:w1d4:scramble",
          type: "scramble",
          category: "scientific",
          title: "GPS and the hippocampus",
          intro: "Rebuild each sentence about how navigation shapes the brain.",
          phrases: [
            { correct: "The hippocampus stores spatial memory",                              scrambled: ["spatial", "stores", "The", "memory", "hippocampus"] },
            { correct: "London taxi drivers had unusually large hippocampi",                 scrambled: ["unusually", "had", "London", "hippocampi", "drivers", "taxi", "large"] },
            { correct: "Today most of us follow a blue dot on a screen",                    scrambled: ["screen", "blue", "follow", "of", "a", "us", "most", "Today", "dot", "a", "on"] },
            { correct: "Sometimes leave the phone and find the way yourself",               scrambled: ["the", "phone", "yourself", "leave", "Sometimes", "find", "way", "the", "and"] },
          ],
        },
        {
          id: "wr:w1d4:guided",
          type: "guided",
          category: "fashion",
          title: "An object I always carry",
          subject: "An object you always carry on a trip",
          brief: "Write 5 short sentences about a small object that always travels with you.",
          steps: [
            { prompt: "Name and describe the object.",                                       hints: ["delicate", "silver", "ring"] },
            { prompt: "Where did it come from?",                                             hints: ["market", "gift", "abroad"] },
            { prompt: "Why this object and not something more practical?",                   hints: ["meaning", "story", "tiny"] },
            { prompt: "Describe one moment you held it on a trip.",                          hints: ["airport", "hotel", "calm"] },
            { prompt: "End with what it really represents to you.",                          hints: ["home", "myself", "memory"] },
          ],
        },
      ],
    },

    /* ===================== DAY 5 ===================== */
    {
      day: 5,
      tasks: [
        {
          id: "wr:w1d5:cloze",
          type: "cloze",
          category: "general",
          title: "A small return",
          intro: "Pick a word from the pool for each blank.",
          paragraphs: [
            "She had been carrying the broken kettle around for almost a {0}. Every Sunday she said, this week I will {1} it. Every Sunday she did not. Finally, on a quiet Wednesday {2}, she put it back in the box, walked to the store, and joined the short {3} at customer service.",
            "The young man behind the counter looked at the kettle and {4}. 'Oh, this {5} happens — same model, same problem.' He gave her two options: a refund or a {6}. She chose the replacement. Five minutes later she was outside again, kettle in {7}, slightly {8} of how easy the whole thing had been. Why had she waited a {9} month for fifteen quick minutes?",
          ],
          blanks: ["month", "return", "evening", "queue", "smiled", "always", "replacement", "hand", "ashamed", "whole"],
          pool: ["month", "return", "evening", "queue", "smiled", "always", "replacement", "hand", "ashamed", "whole",
                 "year", "hide", "morning", "crowd", "shouted", "rarely", "discount", "bag", "proud", "single"],
        },
        {
          id: "wr:w1d5:scramble",
          type: "scramble",
          category: "scientific",
          title: "Why €99 feels less than €100",
          intro: "Rebuild each sentence about pricing tricks.",
          phrases: [
            { correct: "Many prices end in the number nine",                                 scrambled: ["the", "Many", "in", "nine", "prices", "end", "number"] },
            { correct: "Our brain reads prices from left to right",                          scrambled: ["right", "Our", "to", "from", "prices", "brain", "left", "reads"] },
            { correct: "The first digit shapes how big the number feels",                   scrambled: ["digit", "feels", "first", "the", "shapes", "number", "big", "The", "how"] },
            { correct: "Knowing the trick helps us slow down and check",                    scrambled: ["us", "trick", "slow", "and", "the", "down", "Knowing", "helps", "check"] },
          ],
        },
        {
          id: "wr:w1d5:guided",
          type: "guided",
          category: "fashion",
          title: "A market I'd love to visit",
          subject: "A market you'd love to visit",
          brief: "Write 5 short sentences about a market — real or imagined — that draws you in.",
          steps: [
            { prompt: "Where is the market and what does the entrance feel like?",           hints: ["narrow", "alley", "buzzing"] },
            { prompt: "Describe the smells and colors of the first few stalls.",             hints: ["spice", "fabric", "rich"] },
            { prompt: "Pick one item you would buy and why.",                                hints: ["scarf", "ceramic", "handmade"] },
            { prompt: "Describe a small interaction with a vendor.",                          hints: ["smile", "haggle", "tea"] },
            { prompt: "End with how you would feel walking out.",                            hints: ["tired", "lighter", "alive"] },
          ],
        },
      ],
    },

    /* ===================== DAY 6 ===================== */
    {
      day: 6,
      tasks: [
        {
          id: "wr:w1d6:cloze",
          type: "cloze",
          category: "general",
          title: "A weekend with friends",
          intro: "Choose the best word for each blank.",
          paragraphs: [
            "On Friday, she sent a single text to the group {0}: 'Sunday brunch?' Three minutes later, four people had {1}. They had not all been together for almost a {2}, and the small wave of {3} surprised her. By Sunday morning, she had even chosen what to {4}.",
            "Brunch ran long. They ordered too much food, told old {5}, and laughed at things that were not {6} that funny. Around three, they went for a slow walk along the river, just to {7} the moment. She got home tired, full, and slightly {8}. It was a quiet {9} that ordinary plans, made on time, are still the best ones.",
          ],
          blanks: ["chat", "replied", "year", "excitement", "wear", "stories", "even", "extend", "happy", "reminder"],
          pool: ["chat", "replied", "year", "excitement", "wear", "stories", "even", "extend", "happy", "reminder",
                 "screen", "ignored", "week", "panic", "say", "questions", "really", "end", "tired", "warning"],
        },
        {
          id: "wr:w1d6:scramble",
          type: "scramble",
          category: "scientific",
          title: "Dunbar's number",
          intro: "Rebuild each sentence about how many real friendships a brain can hold.",
          phrases: [
            { correct: "Humans can keep about one hundred fifty stable friendships",         scrambled: ["one", "stable", "Humans", "fifty", "friendships", "hundred", "keep", "about", "can"] },
            { correct: "Inside that number we find smaller circles",                          scrambled: ["that", "we", "find", "smaller", "Inside", "number", "circles"] },
            { correct: "Only about five people make the closest circle",                     scrambled: ["five", "circle", "people", "Only", "make", "the", "closest", "about"] },
            { correct: "Real connection takes time and time is finite",                      scrambled: ["finite", "is", "Real", "and", "time", "takes", "time", "connection"] },
          ],
        },
        {
          id: "wr:w1d6:guided",
          type: "guided",
          category: "fashion",
          title: "Hosting at home",
          subject: "Hosting at home",
          brief: "Write 5 short sentences about a small evening you would like to host at home.",
          steps: [
            { prompt: "Set the scene: which evening, who comes, where in the house?",        hints: ["Friday", "few", "kitchen"] },
            { prompt: "Describe the food you would make.",                                   hints: ["simple", "warm", "family"] },
            { prompt: "Describe the lighting and music.",                                    hints: ["candles", "soft", "playlist"] },
            { prompt: "Pick one small detail that makes guests feel welcome.",               hints: ["handwritten", "plant", "blanket"] },
            { prompt: "End with how the night should feel by ten o'clock.",                  hints: ["slow", "laughter", "full"] },
          ],
        },
      ],
    },

    /* ===================== DAY 7 ===================== */
    {
      day: 7,
      tasks: [
        {
          id: "wr:w1d7:cloze",
          type: "cloze",
          category: "general",
          title: "A book that changed my mind",
          intro: "Pick the best word for each blank.",
          paragraphs: [
            "For years she said she did not {0} science fiction. It was, she believed, all spaceships and {1} guns — not 'serious' literature. A friend kept telling her she was {2}. She kept smiling and changing the {3}. Finally, on her birthday, the friend handed her a small {4} and said, 'Just the first chapter. Then you can hate me.'",
            "She read the first chapter that night and stayed up until {5}. The next day she finished the book on the bus, on her lunch break, in {6} between meetings. She has not stopped reading the genre since. The lesson, she now {7}, is simple: it is {8} to dismiss a whole world based on two or three weak books from {9} ago.",
          ],
          blanks: ["like", "laser", "wrong", "subject", "novel", "midnight", "stolen moments", "admits", "easy", "years"],
          pool: ["like", "laser", "wrong", "subject", "novel", "midnight", "stolen moments", "admits", "easy", "years",
                 "love", "water", "right", "topic", "letter", "noon", "classes", "denies", "hard", "minutes"],
        },
        {
          id: "wr:w1d7:scramble",
          type: "scramble",
          category: "scientific",
          title: "How fiction grows empathy",
          intro: "Rebuild each sentence about reading and the brain.",
          phrases: [
            { correct: "Stories quietly train us to understand other people",                scrambled: ["other", "to", "Stories", "people", "us", "quietly", "understand", "train"] },
            { correct: "We follow a character through hundreds of pages",                    scrambled: ["a", "follow", "character", "through", "We", "of", "hundreds", "pages"] },
            { correct: "Step by step we practice another point of view",                     scrambled: ["another", "we", "Step", "view", "step", "of", "by", "practice", "point"] },
            { correct: "This is one of the deepest gifts of reading",                        scrambled: ["of", "is", "deepest", "the", "This", "gifts", "of", "one", "reading"] },
          ],
        },
        {
          id: "wr:w1d7:guided",
          type: "guided",
          category: "fashion",
          title: "An artwork that moved me",
          subject: "An artwork that moved you",
          brief: "Write 5 short sentences about a painting, song, photo, or film that has stayed with you.",
          steps: [
            { prompt: "Name the work and where you first saw or heard it.",                  hints: ["painting", "gallery", "concert"] },
            { prompt: "Describe what it looks (or sounds) like in one or two details.",      hints: ["colors", "soft", "rough"] },
            { prompt: "Where were you in your life when you found it?",                      hints: ["young", "moving", "lost"] },
            { prompt: "Describe the feeling it gave you that day.",                          hints: ["chills", "tears", "still"] },
            { prompt: "End with why it has stayed with you ever since.",                     hints: ["honest", "mine", "mirror"] },
          ],
        },
      ],
    },
  ],
};
