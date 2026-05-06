/* Week 1 — Reading content
 * 3 short readings per day across 7 days (general / scientific / fashion-art).
 * Each ~2 short paragraphs, with vocabulary and 3 multiple-choice questions.
 */
window.WEEK1_READING = {
  number: 1,
  days: [
    /* ===== DAY 1 — Cafés & mornings ===== */
    {
      day: 1,
      readings: [
        {
          id: "rd:w1d1:general",
          category: "general",
          title: "The Morning Coffee Ritual",
          intro: "How people around the world begin their day.",
          paragraphs: [
            "For millions of people, the first sip of coffee is more than a simple drink — it is a small daily ritual. In Italy, a quick espresso at the counter usually takes less than two minutes. In Vietnam, the famous egg coffee is the opposite: slow, sweet, and made to be enjoyed for a long time. In Turkey, the warm aroma of fresh ground beans has filled morning kitchens for more than five hundred years.",
            "What ties these traditions together is not the recipe but the moment itself. The act of brewing, smelling, and sipping the coffee helps people pause before a busy day starts. Even when the cup is small, the ritual gives the morning a clear shape. As one café owner in Rome once joked, 'I don't sell coffee — I sell ten quiet minutes.'",
          ],
          vocab: [
            { w: "ritual", p: "noun", m: "a regular, meaningful routine", ex: "Morning coffee is a daily ritual." },
            { w: "to brew", p: "verb", m: "to prepare a hot drink (coffee, tea)", ex: "He brews fresh coffee every morning." },
            { w: "aroma", p: "noun", m: "a pleasant smell, usually of food", ex: "The aroma of coffee filled the room." },
            { w: "to linger", p: "verb", m: "to stay or last longer than expected", ex: "She likes to linger over breakfast." },
            { w: "to tie together", p: "phrase", m: "to connect or unite (ideas)", ex: "What ties these traditions together is the moment." },
          ],
          mcqs: [
            {
              q: "What is the main point of the reading?",
              opts: [
                "Italian coffee is the best in the world.",
                "Coffee rituals around the world share a common purpose.",
                "Egg coffee is the slowest type of coffee.",
                "Coffee should always be served in small cups.",
              ],
              correct: 1,
              explanation: "The text explicitly says it's not the recipe but 'the moment itself' — the shared purpose of pausing — that ties the traditions together.",
            },
            {
              q: "What does the café owner in Rome mean by 'I do not sell coffee — I sell ten quiet minutes'?",
              opts: [
                "He charges customers for their time.",
                "His coffee takes ten minutes to brew.",
                "He values the experience more than the drink itself.",
                "His café is only open for ten minutes a day.",
              ],
              correct: 2,
              explanation: "He's saying the real value is the calm pause, not the coffee — the experience matters more than the product.",
            },
            {
              q: "Which detail is mentioned about Turkish coffee?",
              opts: [
                "It is sweet and contains eggs.",
                "It takes two minutes to drink.",
                "It has been part of mornings for over 500 years.",
                "It is served only in cafés.",
              ],
              correct: 2,
              explanation: "The reading says Turkish coffee 'has filled morning kitchens for over five centuries' — over 500 years.",
            },
          ],
        },
        {
          id: "rd:w1d1:scientific",
          category: "scientific",
          title: "How Caffeine Wakes You Up",
          intro: "A simple look at what coffee actually does to your brain.",
          paragraphs: [
            "Most of us reach for coffee when we feel tired, but the caffeine in our cup does not really give us new energy. Instead, it tricks the brain. As the day goes on, a chemical called adenosine builds up and makes us feel sleepy. Adenosine works by attaching to special receptors in the brain. The more it attaches, the more tired we feel.",
            "Caffeine has a similar shape to adenosine, so it can fit into those same receptors and block them. While caffeine is sitting there, the tiredness signal cannot get through. This is why we feel more alert about thirty minutes after a cup. The energy was already inside us — we just stopped feeling the brakes.",
          ],
          vocab: [
            { w: "adenosine", p: "noun", m: "a chemical in the brain that makes us feel tired", ex: "Adenosine builds up during the day." },
            { w: "receptor", p: "noun", m: "a place on a cell where a chemical can attach", ex: "Caffeine fits into adenosine receptors." },
            { w: "to block", p: "verb", m: "to stop something from happening or passing", ex: "Caffeine blocks the tiredness signal." },
            { w: "alert", p: "adj", m: "awake and paying attention", ex: "I feel more alert after coffee." },
            { w: "to mimic", p: "verb", m: "to copy or look like something", ex: "Caffeine mimics adenosine in shape." },
            { w: "the brakes", p: "phrase (idiom)", m: "what stops or slows something", ex: "Coffee removes the brakes on alertness." },
          ],
          mcqs: [
            {
              q: "According to the text, why does caffeine make us feel awake?",
              opts: [
                "It directly creates new energy in the brain.",
                "It blocks the chemical that causes tiredness.",
                "It increases the amount of adenosine in the brain.",
                "It puts the brain to sleep first, then wakes it up.",
              ],
              correct: 1,
              explanation: "The text says caffeine sits in adenosine's receptors, blocking the tiredness signal — it doesn't add energy, it removes the brakes.",
            },
            {
              q: "What can we infer about a person who drinks coffee?",
              opts: [
                "They are creating new energy with caffeine.",
                "They are stopping the feeling of tiredness, not the cause.",
                "They are removing adenosine from their brain.",
                "They feel awake instantly after drinking.",
              ],
              correct: 1,
              explanation: "The author makes clear that caffeine masks the tiredness signal — adenosine is still being made; we just don't feel it.",
            },
            {
              q: "What does the metaphor 'we just stopped feeling the brakes' mean?",
              opts: [
                "Coffee is dangerous, like a car without brakes.",
                "Caffeine slows the brain like a brake.",
                "We stopped feeling what was slowing us down.",
                "Caffeine acts as a brake on adenosine production.",
              ],
              correct: 2,
              explanation: "Adenosine is the 'brake' on alertness; caffeine doesn't remove it, but it stops us from feeling its effect.",
            },
          ],
        },
        {
          id: "rd:w1d1:fashion",
          category: "fashion",
          title: "The Look of a Specialty Café",
          intro: "Why so many modern cafés look almost the same.",
          paragraphs: [
            "Walk into a specialty coffee shop in Tokyo, Berlin, or Mexico City and the design will probably feel familiar. You will see exposed wood, white walls, soft lighting, a minimalist counter, and a few green plants. This look did not happen by accident. Starting in the 2010s, café owners around the world began borrowing ideas from Scandinavian design — clean lines, natural materials, and a calm, neutral palette.",
            "The goal of this style is to evoke quiet focus and a hand-made feeling. Without strong colors or much decoration, your attention moves to the coffee itself: the smell, the cup, the slow hands of the barista. Some critics call this style 'too uniform,' but its fans say that a calm space is exactly what a busy person needs in the middle of a noisy city.",
          ],
          vocab: [
            { w: "minimalist", p: "adj", m: "using very few elements; simple in style", ex: "A minimalist counter with no clutter." },
            { w: "exposed (wood/brick)", p: "adj", m: "left visible instead of being covered", ex: "Exposed wood beams give a natural feel." },
            { w: "neutral palette", p: "phrase", m: "a set of soft, non-bright colors (white, beige, gray)", ex: "The walls follow a neutral palette." },
            { w: "to evoke", p: "verb", m: "to bring up a feeling or idea", ex: "The design evokes calm and focus." },
            { w: "uniform (adj.)", p: "adj", m: "the same everywhere; lacking variety", ex: "Some say the cafés look too uniform." },
            { w: "to borrow ideas", p: "phrase", m: "to take and use ideas from another source", ex: "Owners borrowed ideas from Scandinavian design." },
          ],
          mcqs: [
            {
              q: "What is the author's main observation?",
              opts: [
                "Specialty cafés are losing their popularity.",
                "Specialty cafés around the world share a similar visual style.",
                "Scandinavian people drink the most coffee.",
                "Critics dislike all modern café designs.",
              ],
              correct: 1,
              explanation: "The first paragraph notes that cafés in many cities share the same look, and the second explains why.",
            },
            {
              q: "Why do café owners use this style, according to the author?",
              opts: [
                "It is the cheapest way to decorate.",
                "It directs attention to the coffee and craft.",
                "It is required by city laws.",
                "It is the easiest to clean.",
              ],
              correct: 1,
              explanation: "The text says without bold decoration 'attention shifts to the coffee itself.'",
            },
            {
              q: "What do critics of this style argue?",
              opts: [
                "It is too cold and bright.",
                "It is too uniform — the cafés all look alike.",
                "It uses too many colors.",
                "It is too expensive for most cities.",
              ],
              correct: 1,
              explanation: "The text directly quotes critics calling the style 'too uniform.'",
            },
          ],
        },
      ],
    },

    /* ===== DAY 2 — Health & wellness ===== */
    {
      day: 2,
      readings: [
        {
          id: "rd:w1d2:general",
          category: "general",
          title: "Why Walking Is Underrated",
          intro: "The simplest exercise might be the best one.",
          paragraphs: [
            "When people think of exercise, they often imagine running, lifting weights, or sweating in a gym. Walking is rarely the first thing that comes to mind. But a daily thirty-minute walk has a long list of benefits: better mood, healthier heart, lower blood pressure, and a clearer head. Compared to hard workouts, walking is gentle on the joints and easy to start.",
            "Maybe the best part is how little it needs from you. You do not need special equipment, a gym card, or a partner. You simply put on shoes and step outside. For many busy people, that low barrier is the real key. A modest habit done every day usually beats an ambitious plan you cannot keep.",
          ],
          vocab: [
            { w: "underrated", p: "adj", m: "valued less than it deserves", ex: "Walking is an underrated form of exercise." },
            { w: "low-impact", p: "adj", m: "gentle, with little stress on the body", ex: "Walking is a low-impact activity." },
            { w: "to boost", p: "verb", m: "to improve or increase", ex: "Walking can boost your mood." },
            { w: "modest", p: "adj", m: "small but real", ex: "A modest daily habit is powerful." },
            { w: "barrier", p: "noun", m: "something that makes an action harder to start", ex: "Walking has a low barrier — no equipment needed." },
          ],
          mcqs: [
            {
              q: "What is the main point of the reading?",
              opts: [
                "Walking is harder than running.",
                "Walking is a small habit with big effects.",
                "Going to the gym is a waste of time.",
                "Most people walk too much already.",
              ],
              correct: 1,
              explanation: "The text praises walking as simple but powerful and emphasizes the benefit of small daily habits.",
            },
            {
              q: "Which of the following is NOT mentioned as a benefit of walking?",
              opts: ["Better mood.", "Lower blood pressure.", "Stronger arm muscles.", "A clearer head."],
              correct: 2,
              explanation: "The text lists mood, heart, blood pressure, and clarity — not arm strength.",
            },
            {
              q: "What does the author mean by 'a modest habit done every day usually beats an ambitious plan you cannot keep'?",
              opts: [
                "Big plans are always better than small ones.",
                "Small consistent actions are more effective than large unrealistic plans.",
                "Walking should always replace running.",
                "Habits are difficult to build.",
              ],
              correct: 1,
              explanation: "The author is making a classic point about consistency over intensity.",
            },
          ],
        },
        {
          id: "rd:w1d2:scientific",
          category: "scientific",
          title: "Inside a Sleep Cycle",
          intro: "What your brain is doing at three in the morning.",
          paragraphs: [
            "A good night of sleep is not just one thing. It is a series of cycles. Each cycle lasts about ninety minutes and has several stages inside it. After you fall asleep, your brain quickly moves into deep sleep, where the body fixes its muscles and its immune system. Later in the cycle comes REM sleep — the stage of dreaming, when the brain works through your feelings.",
            "If you wake up suddenly in the middle of deep sleep, you often feel groggy and confused. But waking up near the end of a cycle, in lighter sleep, is much easier. This is why some people feel better after six hours than after seven and a half: they happened to wake up between cycles. Over time, missing too many cycles creates a 'sleep debt' that the body slowly tries to pay back.",
          ],
          vocab: [
            { w: "REM sleep", p: "noun", m: "the dream stage of sleep, with rapid eye movement", ex: "REM sleep helps process emotions." },
            { w: "deep sleep", p: "noun", m: "the heaviest stage of sleep, when the body repairs", ex: "Deep sleep restores the body." },
            { w: "to consolidate", p: "verb", m: "to make stronger, especially memory", ex: "Sleep consolidates memory." },
            { w: "groggy", p: "adj", m: "sleepy and unable to think clearly after waking", ex: "I felt groggy this morning." },
            { w: "sleep debt", p: "phrase", m: "the missing sleep your body still needs", ex: "Late nights create sleep debt." },
            { w: "to accumulate", p: "verb", m: "to grow over time", ex: "Sleep debt accumulates during the week." },
          ],
          mcqs: [
            {
              q: "Why might six hours of sleep feel better than seven and a half?",
              opts: [
                "Six hours always gives more REM sleep.",
                "You may have woken between cycles, in lighter sleep.",
                "Less sleep is healthier overall.",
                "Sleep cycles last six hours each.",
              ],
              correct: 1,
              explanation: "The text directly explains that waking near the end of a cycle (lighter sleep) feels easier than waking in deep sleep.",
            },
            {
              q: "What happens during deep sleep?",
              opts: [
                "We dream the most vivid dreams.",
                "The body repairs muscles and the immune system.",
                "Eyes move rapidly side to side.",
                "We are easy to wake up.",
              ],
              correct: 1,
              explanation: "The text says deep sleep is when 'the body repairs muscles and the immune system.'",
            },
            {
              q: "What does 'sleep debt' mean here?",
              opts: [
                "Money you owe for sleep medicine.",
                "Sleep your body still needs to recover.",
                "An hour of REM sleep.",
                "Sleeping too much in one night.",
              ],
              correct: 1,
              explanation: "The text defines it as missing cycles that the body 'slowly tries to pay back.'",
            },
          ],
        },
        {
          id: "rd:w1d2:fashion",
          category: "fashion",
          title: "Athleisure: Sweatpants Got Glamorous",
          intro: "When workout clothes became everyday clothes.",
          paragraphs: [
            "Twenty years ago, wearing yoga pants to a coffee shop would have raised eyebrows. Today, no one looks twice. The rise of 'athleisure' — clothing designed for both the gym and ordinary life — is one of the biggest shifts in modern fashion. Brands like Lululemon and Alo built billion-dollar businesses by mixing performance fabrics with the cuts and colors of streetwear.",
            "Why did this happen? Comfort is the obvious answer, but it is not the only one. Athleisure also signals a certain lifestyle: active, healthy, intentional. A pair of high-quality leggings has become a wardrobe staple in many cities, blurring the line between what we wear to exercise and what we wear to live. For better or worse, the gym has come home with us.",
          ],
          vocab: [
            { w: "athleisure", p: "noun", m: "clothing designed for both sport and casual wear", ex: "Athleisure is now standard daily wear." },
            { w: "leggings", p: "noun", m: "tight stretchy pants", ex: "She wore leggings to brunch." },
            { w: "performance fabric", p: "phrase", m: "fabric designed for sport (stretchy, breathable)", ex: "These leggings use a performance fabric." },
            { w: "wardrobe staple", p: "phrase", m: "a basic, essential clothing item", ex: "A black blazer is a wardrobe staple." },
            { w: "to blur (the line)", p: "verb", m: "to make the difference less clear", ex: "Athleisure blurs the line between sport and life." },
            { w: "to raise eyebrows", p: "phrase (idiom)", m: "to surprise or shock people mildly", ex: "Yoga pants used to raise eyebrows." },
          ],
          mcqs: [
            {
              q: "What change does the article describe?",
              opts: [
                "Sportswear is no longer popular.",
                "Workout clothes have become acceptable for daily life.",
                "Yoga is more popular than running.",
                "Designer brands no longer make sportswear.",
              ],
              correct: 1,
              explanation: "The text describes the rise of 'athleisure' — exercise clothes worn casually.",
            },
            {
              q: "According to the author, why did athleisure become popular?",
              opts: [
                "It is cheaper than other fashion.",
                "It is comfortable AND signals a healthy lifestyle.",
                "It can only be bought in gyms.",
                "It is required by most workplaces.",
              ],
              correct: 1,
              explanation: "The text gives both comfort and lifestyle-signaling as reasons.",
            },
            {
              q: "What does 'For better or worse, the gym has come home with us' suggest?",
              opts: [
                "Most people now have home gyms.",
                "The boundary between exercise and daily life has changed.",
                "Gyms have closed in many places.",
                "It is dangerous to exercise at home.",
              ],
              correct: 1,
              explanation: "It's a metaphor for the line blurring — sport-style clothes are now part of normal life.",
            },
          ],
        },
      ],
    },

    /* ===== DAY 3 — Work & coworkers ===== */
    {
      day: 3,
      readings: [
        {
          id: "rd:w1d3:general",
          category: "general",
          title: "The Hybrid Work Compromise",
          intro: "Three days at the office, two days at home — does it actually work?",
          paragraphs: [
            "Since 2020, hybrid work has gone from a strange experiment to the new normal in many companies. The idea is simple: spend part of the week at the office, part at home. In theory, you get the best of both worlds — focus at home, collaboration at the office. In practice, it is messier. Teams must agree on which days are 'in person,' and managers must learn to lead people they cannot see all day.",
            "What seems to work best is a small amount of structure. When teams pick fixed days together — say, Tuesday and Thursday — they can plan meetings and lunches with confidence. The rest of the week becomes deep work time at home. Without that structure, the office can feel half-empty every day, and the benefits of being together quietly disappear.",
          ],
          vocab: [
            { w: "hybrid work", p: "noun", m: "mixing office and remote work", ex: "She likes the hybrid work model." },
            { w: "compromise", p: "noun", m: "a middle solution that gives each side something", ex: "Hybrid is a compromise between two camps." },
            { w: "to collaborate", p: "verb", m: "to work together", ex: "The team collaborates on Tuesdays." },
            { w: "structure", p: "noun", m: "a clear plan or set of rules", ex: "Structure helps remote teams." },
            { w: "deep work", p: "phrase", m: "long, focused, uninterrupted work", ex: "Mornings at home are for deep work." },
          ],
          mcqs: [
            {
              q: "What is the main idea of the reading?",
              opts: [
                "Hybrid work has failed in most companies.",
                "Hybrid work works best when teams agree on fixed in-person days.",
                "Working from home is always better than the office.",
                "Hybrid work was popular only in 2020.",
              ],
              correct: 1,
              explanation: "The text concludes that 'a small amount of structure' — fixed shared days — is what makes hybrid work succeed.",
            },
            {
              q: "What problem does the author mention without fixed shared days?",
              opts: [
                "Workers are paid less.",
                "The office feels half-empty every day.",
                "Internet connections fail.",
                "Managers must come every day.",
              ],
              correct: 1,
              explanation: "The text says without structure 'the office can feel half-empty every day.'",
            },
            {
              q: "What does the phrase 'best of both worlds' refer to here?",
              opts: [
                "Two different jobs at once.",
                "Focus at home and collaboration at the office.",
                "Two offices in different cities.",
                "Earning two salaries.",
              ],
              correct: 1,
              explanation: "The text describes the two worlds as home (focus) and office (collaboration).",
            },
          ],
        },
        {
          id: "rd:w1d3:scientific",
          category: "scientific",
          title: "Open Offices and Concentration",
          intro: "Did knocking down the walls really make us more creative?",
          paragraphs: [
            "When companies began opening up their offices in the 1990s, the promise was simple: more conversation, more ideas, better teamwork. Fast-forward thirty years, and the picture is more complicated. A study from Harvard tracked employees before and after a move to an open-plan office. Surprisingly, face-to-face conversation dropped by about seventy percent, while emails and chat messages went up. With no walls to filter noise, people retreated into headphones.",
            "The lesson is not that open offices always fail, but that human attention is fragile. Even small interruptions — a phone ringing, a colleague walking by — can break a chain of thought that took twenty minutes to build. Designers now favor mixed spaces: open zones for chats and quiet rooms for focus, giving people a real choice about how they want to work.",
          ],
          vocab: [
            { w: "open office", p: "noun", m: "an office without walls between desks", ex: "Many startups use open offices." },
            { w: "concentration", p: "noun", m: "the ability to focus your mind on one task", ex: "Open offices hurt concentration." },
            { w: "interruption", p: "noun", m: "something that breaks your focus", ex: "An interruption ruins deep work." },
            { w: "productivity", p: "noun", m: "the amount of useful work you do in a time", ex: "Productivity drops with too many meetings." },
            { w: "to retreat", p: "verb", m: "to move away or hide", ex: "People retreat into headphones." },
            { w: "fragile", p: "adj", m: "easily broken", ex: "Attention is fragile." },
          ],
          mcqs: [
            {
              q: "What did the Harvard study find?",
              opts: [
                "Open offices made face-to-face conversation increase.",
                "Open offices made face-to-face conversation drop sharply.",
                "Open offices made employees happier.",
                "Open offices saved companies money.",
              ],
              correct: 1,
              explanation: "The text says face-to-face conversation 'dropped by about seventy percent.'",
            },
            {
              q: "What is the author's main argument?",
              opts: [
                "Open offices should be banned.",
                "Quiet zones are better than open zones.",
                "Workers need both open spaces AND quiet rooms.",
                "Headphones make work impossible.",
              ],
              correct: 2,
              explanation: "The conclusion praises mixed spaces — open zones plus quiet rooms.",
            },
            {
              q: "Why does the author mention twenty minutes?",
              opts: [
                "It is the average length of a meeting.",
                "It is how long it takes to build deep focus that one interruption can break.",
                "It is how long open offices have existed.",
                "It is the maximum useful work session.",
              ],
              correct: 1,
              explanation: "The detail illustrates how fragile concentration is — small interruptions undo a long buildup.",
            },
          ],
        },
        {
          id: "rd:w1d3:fashion",
          category: "fashion",
          title: "Smart Casual: A New Office Uniform",
          intro: "How dress codes changed after the pandemic.",
          paragraphs: [
            "For decades, the office uniform was clear: a suit, a tie, polished shoes. The pandemic broke that habit overnight. After months of working in pajamas, very few people wanted to return to stiff collars and tight jackets. What replaced the suit was 'smart casual': clean sneakers, well-cut jeans or chinos, a soft blazer, and a simple shirt. The look says, 'I am here to work, but I am also a person.'",
            "Smart casual is not lazy — it is just smarter. The fabrics are still high quality, the cuts are still sharp, but everything feels lighter. For many companies, this shift signals a deeper change: success is no longer measured by how uncomfortable your clothes are, but by what you actually deliver. The blazer remains; the tie has quietly disappeared.",
          ],
          vocab: [
            { w: "smart casual", p: "phrase", m: "neat but not formal clothing", ex: "Smart casual is the new office norm." },
            { w: "blazer", p: "noun", m: "a soft jacket that is less formal than a suit", ex: "She wore a blazer over a t-shirt." },
            { w: "post-pandemic", p: "adj", m: "after the COVID-19 pandemic", ex: "Post-pandemic offices are different." },
            { w: "to shed", p: "verb", m: "to take off or get rid of", ex: "Workers shed their old suits." },
            { w: "polished", p: "adj", m: "neat, clean, careful in appearance", ex: "Even smart casual should look polished." },
            { w: "stiff", p: "adj", m: "hard and not comfortable to move in", ex: "Stiff collars are uncomfortable." },
          ],
          mcqs: [
            {
              q: "What does the article describe?",
              opts: [
                "How most workers now wear pajamas to the office.",
                "How office dress codes shifted from formal suits to 'smart casual.'",
                "How blazers became too expensive.",
                "How sneakers were banned from offices.",
              ],
              correct: 1,
              explanation: "The text walks through suits → smart casual as a post-pandemic shift.",
            },
            {
              q: "According to the author, what does the smart-casual shift signal?",
              opts: [
                "A loss of professionalism in offices.",
                "A change in what success looks like — output matters more than discomfort.",
                "Companies have lower budgets now.",
                "Suits are illegal in some countries.",
              ],
              correct: 1,
              explanation: "The text says success is now measured 'by what you actually deliver,' not by uncomfortable clothes.",
            },
            {
              q: "What is the meaning of 'The blazer remains; the tie has quietly disappeared'?",
              opts: [
                "Blazers are now banned but ties are required.",
                "Some formality stays, but the strictest part has gone.",
                "All formal clothing is gone from offices.",
                "Blazers are sold without ties now.",
              ],
              correct: 1,
              explanation: "It's a summary line: a piece of formality (blazer) survives, the most rigid piece (tie) is gone.",
            },
          ],
        },
      ],
    },

    /* ===== DAY 4 — Travel & directions ===== */
    {
      day: 4,
      readings: [
        {
          id: "rd:w1d4:general",
          category: "general",
          title: "Why Solo Travel Changes You",
          intro: "What happens when there's no one to translate your hesitation.",
          paragraphs: [
            "Traveling alone forces a quiet kind of growth. With no friend to make decisions for you, every choice — from where to eat to which train to take — lands fully on your shoulders. At first, this can feel uncomfortable, even lonely. But after a few days, something unexpected happens: you start to trust yourself faster. Small daily wins, like ordering food in a new language or finding your hostel after dark, build a quiet kind of confidence that stays with you long after the trip ends.",
            "Solo travel is also a strangely social experience. When you eat alone in a café, you are easier to approach. When you stand at a station with a confused look, someone usually offers help. The world opens up to people who are clearly out of their comfort zone. By the time you return home, you carry not only photos but a slightly larger sense of what you can handle.",
          ],
          vocab: [
            { w: "to broaden one's horizons", p: "phrase", m: "to expand what you know and feel", ex: "Travel broadens your horizons." },
            { w: "comfort zone", p: "noun", m: "the safe, familiar area of life", ex: "Solo travel pulls you out of your comfort zone." },
            { w: "humbling", p: "adj", m: "making you feel small or modest in a good way", ex: "Asking for help in a new language is humbling." },
            { w: "self-reliance", p: "noun", m: "the ability to depend on yourself", ex: "Solo travel builds self-reliance." },
            { w: "to land on someone's shoulders", p: "phrase", m: "to become someone's responsibility", ex: "Every choice lands on your shoulders." },
          ],
          mcqs: [
            {
              q: "According to the author, what is the main effect of solo travel?",
              opts: [
                "It teaches you how to plan trips efficiently.",
                "It quietly increases your confidence in yourself.",
                "It makes you avoid social interaction.",
                "It is mostly lonely and disappointing.",
              ],
              correct: 1,
              explanation: "The text emphasizes 'quiet kind of confidence' and 'a slightly larger sense of what you can handle.'",
            },
            {
              q: "Why does the author call solo travel 'a strangely social experience'?",
              opts: [
                "Travelers must speak constantly to others.",
                "Other people often approach or help solo travelers.",
                "Hostels force everyone to socialize.",
                "Solo travel cures shyness completely.",
              ],
              correct: 1,
              explanation: "The text says solo travelers are 'easier to approach' and others tend to help.",
            },
            {
              q: "What does 'a slightly larger sense of what you can handle' mean?",
              opts: [
                "You become physically stronger.",
                "You realize you can manage more than you thought.",
                "You learn to carry more luggage.",
                "You take longer trips next time.",
              ],
              correct: 1,
              explanation: "It refers to expanded confidence in your own capability.",
            },
          ],
        },
        {
          id: "rd:w1d4:scientific",
          category: "scientific",
          title: "GPS and Your Hippocampus",
          intro: "Why your sense of direction may be fading.",
          paragraphs: [
            "The hippocampus is a small region of the brain involved in memory and spatial awareness. London taxi drivers, who once had to memorize thousands of streets, were found to have an unusually large posterior hippocampus — a kind of mental map shaped by years of practice. The brain, it turns out, builds the muscle it uses most.",
            "Today, almost everyone follows the blue dot on a phone screen. Studies show that when we use GPS, the hippocampus is much less active than when we navigate from memory. Some scientists worry this 'outsourcing' of direction could slowly weaken our internal maps. The advice is simple but useful: every now and then, leave the phone in your pocket and try to find the way yourself.",
          ],
          vocab: [
            { w: "to navigate", p: "verb", m: "to find your way", ex: "She navigates without GPS." },
            { w: "hippocampus", p: "noun", m: "a brain region for memory and direction", ex: "The hippocampus stores spatial maps." },
            { w: "spatial memory", p: "noun", m: "memory for places and directions", ex: "Spatial memory weakens without practice." },
            { w: "to atrophy", p: "verb", m: "to grow weaker or smaller from disuse", ex: "Skills atrophy if not practiced." },
            { w: "mental map", p: "phrase", m: "a remembered map of a place in your mind", ex: "He has a mental map of the old city." },
            { w: "to outsource", p: "verb", m: "to give a task to someone or something else", ex: "We outsource navigation to apps." },
          ],
          mcqs: [
            {
              q: "What was special about London taxi drivers?",
              opts: [
                "They had smaller hippocampi than most people.",
                "They had unusually large posterior hippocampi from memorizing streets.",
                "They drove without GPS by law.",
                "They were the first to test GPS.",
              ],
              correct: 1,
              explanation: "The text states their posterior hippocampus was 'unusually large,' shaped by practice.",
            },
            {
              q: "What is the author's concern about GPS?",
              opts: [
                "It is too expensive.",
                "It might weaken our natural sense of direction over time.",
                "It tells us the wrong directions.",
                "It runs out of battery quickly.",
              ],
              correct: 1,
              explanation: "The text worries about 'outsourcing' weakening our 'internal maps.'",
            },
            {
              q: "What practical advice does the author give?",
              opts: [
                "Stop using GPS forever.",
                "Sometimes navigate without your phone for practice.",
                "Memorize all your city's streets.",
                "Always trust the blue dot.",
              ],
              correct: 1,
              explanation: "The advice is moderate: 'every now and then' put the phone away.",
            },
          ],
        },
        {
          id: "rd:w1d4:fashion",
          category: "fashion",
          title: "Travel Jewelry: Small Things You Carry",
          intro: "Why we bring tiny treasures back from a journey.",
          paragraphs: [
            "Long before souvenirs filled airport shops, travelers were already collecting small pieces of jewelry as a way to remember a journey. A silver ring from a market in Marrakech, a delicate evil-eye charm from Athens, a wooden bead bracelet from Bali — each carries a story far bigger than its size. Unlike fridge magnets or plastic models, jewelry stays close to the skin and travels with us into ordinary life.",
            "Designers have noticed this attachment. Some luxury houses now release 'travel collections' — small, light, easy-to-pack pieces inspired by particular cities or cultures. Critics say this is romanticizing tourism, but defenders argue that a thoughtful keepsake is one of the most personal ways to carry a place with you. After all, places change; a small piece of metal does not.",
          ],
          vocab: [
            { w: "memento", p: "noun", m: "an object kept as a reminder", ex: "She kept the ring as a memento." },
            { w: "charm bracelet", p: "noun", m: "a bracelet with small decorative pieces (charms)", ex: "Her charm bracelet has pieces from each trip." },
            { w: "delicate", p: "adj", m: "fine, small, and easy to break", ex: "A delicate silver chain." },
            { w: "to commemorate", p: "verb", m: "to honor and remember", ex: "The ring commemorates the trip." },
            { w: "keepsake", p: "noun", m: "a small object kept for memory", ex: "The shell is a keepsake from Bali." },
            { w: "to romanticize", p: "verb", m: "to make something seem more beautiful than it is", ex: "Critics say it romanticizes tourism." },
          ],
          mcqs: [
            {
              q: "Why does the author say jewelry is special among travel items?",
              opts: [
                "It is always more expensive than other souvenirs.",
                "It stays close to us and travels into daily life.",
                "It is easier to find at airports.",
                "It is the most fashionable item to wear.",
              ],
              correct: 1,
              explanation: "The text contrasts jewelry with magnets/models, noting it 'stays close to the skin.'",
            },
            {
              q: "What is the author's view of luxury 'travel collections'?",
              opts: [
                "They are completely worthless.",
                "They are debated — critics dislike them, defenders see real value.",
                "They are illegal in many countries.",
                "They are only sold in airports.",
              ],
              correct: 1,
              explanation: "The text presents both critics and defenders without taking a strong side.",
            },
            {
              q: "What does the closing line, 'places change; a small piece of metal does not,' suggest?",
              opts: [
                "Jewelry is more important than experience.",
                "A keepsake can hold a memory of a place that no longer exists as you remember it.",
                "Metal jewelry never breaks.",
                "Travelers should not visit the same city twice.",
              ],
              correct: 1,
              explanation: "It captures why a small object can carry a large memory across time.",
            },
          ],
        },
      ],
    },

    /* ===== DAY 5 — Shopping & complaints ===== */
    {
      day: 5,
      readings: [
        {
          id: "rd:w1d5:general",
          category: "general",
          title: "Why We Don't Return Things",
          intro: "Why that broken item is still sitting in your drawer.",
          paragraphs: [
            "Most stores have generous return policies, and yet many of us hold on to broken or unwanted items for months — sometimes years. Why? Part of it is simple inertia: returning something takes time, packaging, and a small mental cost. But there is also something deeper. Once we own an item, we slightly overestimate its value compared with the same item still in the store. Psychologists call this the 'endowment effect.'",
            "Knowing about the effect is half the battle. The next time you find a defective product gathering dust at home, try this: imagine you do not own it yet. Would you go out and buy it again today? If the answer is no, treat the return as one quick task and finish it. The effort is almost always smaller than we fear.",
          ],
          vocab: [
            { w: "inertia", p: "noun", m: "tendency to stay still and not act", ex: "Returning is hard because of simple inertia." },
            { w: "endowment effect", p: "phrase", m: "valuing something more once you own it", ex: "The endowment effect makes us keep junk." },
            { w: "to overestimate", p: "verb", m: "to think something is worth more than it is", ex: "We overestimate what we own." },
            { w: "defective", p: "adj", m: "broken or not working correctly", ex: "A defective product." },
            { w: "to gather dust", p: "phrase", m: "to be unused for a long time", ex: "It's been gathering dust in the drawer." },
          ],
          mcqs: [
            {
              q: "What is the 'endowment effect'?",
              opts: [
                "Stores giving free items to customers.",
                "The tendency to overvalue items we already own.",
                "A discount when you return something.",
                "A type of insurance on shopping.",
              ],
              correct: 1,
              explanation: "The text directly defines it as overestimating the value of what we own.",
            },
            {
              q: "What practical trick does the author suggest?",
              opts: [
                "Always return items immediately.",
                "Imagine you don't own the item — would you buy it again today?",
                "Throw the item away.",
                "Sell the item online instead.",
              ],
              correct: 1,
              explanation: "The mental trick described directly counters the endowment effect.",
            },
            {
              q: "Why don't people return broken things, according to the text?",
              opts: [
                "Stores refuse most returns.",
                "Inertia and a psychological bias both play a role.",
                "Returns require expensive shipping.",
                "It is illegal in many places.",
              ],
              correct: 1,
              explanation: "The text gives both inertia and the endowment effect as causes.",
            },
          ],
        },
        {
          id: "rd:w1d5:scientific",
          category: "scientific",
          title: "Why €99 Feels Less Than €100",
          intro: "A tiny trick of pricing that almost always works.",
          paragraphs: [
            "If you have ever wondered why prices end so often in 99 cents, the answer is not laziness — it is psychology. We read prices left to right, and our brain forms a quick first impression based on the leftmost digit. €9.99 starts with a 9, while €10.00 starts with a 1 followed by a zero. Our brain registers them as belonging to different price ranges, even though the difference is one cent.",
            "This is sometimes called the 'left-digit effect.' Studies in supermarkets have shown that products priced at $1.99 sell measurably better than the exact same product at $2.00. Knowing the trick does not make us immune to it — but it does help us slow down and check the real number before deciding.",
          ],
          vocab: [
            { w: "perceived value", p: "phrase", m: "what something feels like it's worth", ex: "Perceived value matters more than real value." },
            { w: "to round up", p: "verb", m: "to move a number up to the nearest whole", ex: "Round 1.99 up to 2.00." },
            { w: "subconscious", p: "adj", m: "happening in the mind without awareness", ex: "Our subconscious sees 9.99 as smaller." },
            { w: "savvy", p: "adj", m: "smart and informed (especially as a buyer)", ex: "Savvy shoppers ignore .99 prices." },
            { w: "anchor pricing", p: "phrase", m: "showing a high price first to make later prices feel low", ex: "The first price acts as an anchor." },
            { w: "immune (to)", p: "adj", m: "not affected by something", ex: "We're not immune to the trick." },
          ],
          mcqs: [
            {
              q: "Why do many prices end in .99?",
              opts: [
                "It is required by tax law.",
                "Our brain reads the first digit and feels the price is in a lower range.",
                "Stores cannot calculate to exact cents.",
                "It is easier for cashiers to count.",
              ],
              correct: 1,
              explanation: "The text describes the 'left-digit effect' that makes 9.99 feel smaller than 10.00.",
            },
            {
              q: "Does knowing about the trick fix the problem?",
              opts: [
                "Yes, completely.",
                "Mostly — knowing makes us fully immune.",
                "No, we are not immune, but it helps us slow down.",
                "No — it makes the problem worse.",
              ],
              correct: 2,
              explanation: "The text says we are not immune but knowing helps us slow down.",
            },
            {
              q: "What evidence does the author give?",
              opts: [
                "A theory with no studies.",
                "Lab studies on rats.",
                "Supermarket studies showing $1.99 sells better than $2.00.",
                "A government report.",
              ],
              correct: 2,
              explanation: "The text cites supermarket studies as evidence.",
            },
          ],
        },
        {
          id: "rd:w1d5:fashion",
          category: "fashion",
          title: "The Lost Art of Haggling",
          intro: "In some cultures, paying the asking price is rude.",
          paragraphs: [
            "In a Moroccan souk or an Istanbul bazaar, a fixed price is rare. The first number a vendor gives is more like an invitation — it begins a conversation that may last twenty minutes and include three glasses of tea. Haggling, in places where it is normal, is not just about money. It is a form of social play: a test of patience, charm, and confidence on both sides.",
            "Modern shopping has erased this art in most large stores, where every label is final. Some travelers find this a relief; others miss the playful give-and-take. When you do find a place where bargaining is alive, the rules are simple: stay friendly, never insult the product, walk away once if you can, and remember that the seller is rarely losing money. The price you settle on is a kind of small piece of theater — and a souvenir in itself.",
          ],
          vocab: [
            { w: "haggling", p: "noun", m: "negotiating prices in a back-and-forth way", ex: "Haggling is normal in some markets." },
            { w: "to bargain", p: "verb", m: "to discuss price to get a lower one", ex: "She bargained for a fair price." },
            { w: "vendor", p: "noun", m: "someone selling goods, especially in a market or stall", ex: "The vendor poured us tea." },
            { w: "stall", p: "noun", m: "a small open shop in a market", ex: "Each stall has its own products." },
            { w: "souvenir", p: "noun", m: "an object kept to remember a place", ex: "She bought a souvenir at the souk." },
            { w: "ritualistic", p: "adj", m: "done in a ceremonial, traditional way", ex: "Haggling is almost ritualistic in some cities." },
          ],
          mcqs: [
            {
              q: "What does the author say about haggling in some cultures?",
              opts: [
                "It is mostly about money.",
                "It is a kind of social play with rules.",
                "It is illegal in most places.",
                "It always ends in an argument.",
              ],
              correct: 1,
              explanation: "The text calls it 'a form of social play' — patience, charm, and confidence.",
            },
            {
              q: "What rule does the author NOT mention?",
              opts: [
                "Stay friendly.",
                "Never insult the product.",
                "Always pay the first price asked.",
                "Walk away once if you can.",
              ],
              correct: 2,
              explanation: "The whole point of haggling is NOT to pay the first price.",
            },
            {
              q: "What does the closing line — 'a small piece of theater, and a souvenir in itself' — mean?",
              opts: [
                "The negotiation itself becomes a memory worth keeping.",
                "Theater tickets are the best souvenirs.",
                "Souvenirs should always be bought from theaters.",
                "Haggling is dishonest, like an act.",
              ],
              correct: 0,
              explanation: "The author means the experience and memory of bargaining is part of what you take home.",
            },
          ],
        },
      ],
    },

    /* ===== DAY 6 — Friends & social plans ===== */
    {
      day: 6,
      readings: [
        {
          id: "rd:w1d6:general",
          category: "general",
          title: "Why Plans Matter More Than We Think",
          intro: "The science of looking forward to something.",
          paragraphs: [
            "Researchers studying happiness have noticed something interesting: the act of looking forward to something often gives more pleasure than the event itself. A weekend trip with friends booked three weeks in advance brightens not just the weekend but every commute, every dull Tuesday lunch, every late-night moment of doubt in between. Anticipation, it turns out, is a quiet kind of gift you give your future self.",
            "This is one reason many psychologists recommend planning at least one small social event per week. It does not need to be expensive. Coffee on Saturday with an old friend, a phone call with someone far away, a homemade dinner — all of these offer the same brain benefit. The shared moment matters, but so does the warm thought of it on the way.",
          ],
          vocab: [
            { w: "anticipation", p: "noun", m: "the feeling of looking forward to something", ex: "Anticipation can be the best part." },
            { w: "to look forward to", p: "phrase", m: "to feel excited about a future event", ex: "I'm looking forward to the weekend." },
            { w: "to lift one's mood", p: "phrase", m: "to make someone feel better", ex: "Plans lift her mood all week." },
            { w: "spontaneity", p: "noun", m: "doing things without planning", ex: "Spontaneity is fun, but plans matter too." },
            { w: "to brighten", p: "verb", m: "to make something feel happier", ex: "The plan brightens my Tuesday." },
          ],
          mcqs: [
            {
              q: "What is the main idea?",
              opts: [
                "Planning is more important than the event itself for happiness.",
                "Spontaneous events are always best.",
                "Travel is the only thing worth planning.",
                "Plans should be made one day in advance.",
              ],
              correct: 0,
              explanation: "The text emphasizes anticipation as a major source of happiness, sometimes greater than the event.",
            },
            {
              q: "What kinds of plans does the author recommend?",
              opts: [
                "Only large, expensive trips.",
                "Small social events, including simple ones like coffee or a call.",
                "Solo activities only.",
                "One big plan per year.",
              ],
              correct: 1,
              explanation: "The text suggests at least one small social event per week, including simple options.",
            },
            {
              q: "What does 'a quiet kind of gift you give your future self' mean?",
              opts: [
                "A wrapped gift you save for later.",
                "Something that makes your future days happier without you noticing.",
                "A long-term investment.",
                "An expensive present.",
              ],
              correct: 1,
              explanation: "It refers to anticipation gently improving your future days.",
            },
          ],
        },
        {
          id: "rd:w1d6:scientific",
          category: "scientific",
          title: "Dunbar's Number: Why You Have About 150 Friends",
          intro: "A surprising research finding about how many real relationships fit in a brain.",
          paragraphs: [
            "In the 1990s, anthropologist Robin Dunbar studied the size of social groups in primates and humans. He noticed a strong relationship between brain size and group size, and predicted that humans could maintain stable social relationships with about 150 people. Within that 150, smaller circles emerge: roughly 50 close friends, 15 you trust deeply, and 5 you would call at midnight in a crisis.",
            "This number, now known as 'Dunbar's number,' shows up everywhere — from the size of military companies to the average number of contacts on a phone we actually message. The lesson is not that 150 is a strict limit, but that real connection takes time, and time is finite. Most of us have to choose where it goes.",
          ],
          vocab: [
            { w: "Dunbar's number", p: "phrase", m: "about 150 — the size of stable social networks", ex: "Dunbar's number predicts social limits." },
            { w: "social circle", p: "noun", m: "a group of people you regularly interact with", ex: "Her close social circle is small." },
            { w: "cognitive limit", p: "phrase", m: "a mental upper boundary on what we can manage", ex: "There is a cognitive limit on relationships." },
            { w: "intimate", p: "adj", m: "very close and personal", ex: "Five intimate friends, no more." },
            { w: "acquaintance", p: "noun", m: "someone you know but not closely", ex: "A coworker is more acquaintance than friend." },
            { w: "finite", p: "adj", m: "limited; not endless", ex: "Time and attention are finite." },
          ],
          mcqs: [
            {
              q: "What does Dunbar's number suggest?",
              opts: [
                "Humans can have unlimited friends.",
                "Humans can maintain about 150 stable relationships.",
                "Brain size has nothing to do with friendships.",
                "We need at least 150 friends to be happy.",
              ],
              correct: 1,
              explanation: "The text directly explains Dunbar's prediction of about 150 stable relationships.",
            },
            {
              q: "What is the size of the smallest, most intimate inner circle?",
              opts: ["50", "15", "5", "150"],
              correct: 2,
              explanation: "The text says about 5 — those you would call at midnight in a crisis.",
            },
            {
              q: "What does the author conclude from this research?",
              opts: [
                "We must keep our networks under 150 people exactly.",
                "Real connection needs time, and time is limited.",
                "Phone contacts should be limited to 150.",
                "Larger social circles are always better.",
              ],
              correct: 1,
              explanation: "The text closes with the lesson that real connection requires time and that time is finite.",
            },
          ],
        },
        {
          id: "rd:w1d6:fashion",
          category: "fashion",
          title: "A Short History of Birthday Cakes",
          intro: "Why we put fire on a sweet thing once a year.",
          paragraphs: [
            "Some say the modern birthday cake comes from ancient Greece, where round honey cakes were made for the moon goddess Artemis. Candles on top represented the moon's glow. Others trace the tradition to medieval Germany, where families baked sweet bread for children's birthdays and added a single candle for each year of life. Whichever story you prefer, by the nineteenth century the cake had become a central part of birthday celebrations across Europe.",
            "Today, birthday cakes are as much about design as flavor. Bakeries compete in elaborate sugar flowers, mirror glaze, and themed decorations. Yet in many homes, the simplest cake — round, iced, with a candle wobbling in the middle — still feels the most magical. The recipe has changed; the meaning has not.",
          ],
          vocab: [
            { w: "candle", p: "noun", m: "a stick of wax that gives light when burned", ex: "Light the candles!" },
            { w: "to crown", p: "verb", m: "to place on top, like a crown; to finish nicely", ex: "Candles crown the cake." },
            { w: "iced (cake)", p: "adj", m: "covered with sweet sugar coating", ex: "An iced cake with sprinkles." },
            { w: "tradition", p: "noun", m: "a long-established custom", ex: "Cakes are a birthday tradition." },
            { w: "decoration", p: "noun", m: "items added to make something look nice", ex: "Sugar flowers as decoration." },
            { w: "elaborate", p: "adj", m: "very detailed and complex", ex: "An elaborate design." },
          ],
          mcqs: [
            {
              q: "Where does one origin story place birthday cakes?",
              opts: [
                "Ancient Egypt.",
                "Ancient Greece, with honey cakes for Artemis.",
                "Medieval France.",
                "Twentieth-century America.",
              ],
              correct: 1,
              explanation: "The text mentions ancient Greece and the goddess Artemis.",
            },
            {
              q: "What did Germans add to children's birthday bread?",
              opts: [
                "A single candle for each year of life.",
                "A sugar crown.",
                "A small toy.",
                "A specific flavor for each age.",
              ],
              correct: 0,
              explanation: "The text mentions a candle per year of life in medieval Germany.",
            },
            {
              q: "What does the author conclude?",
              opts: [
                "Modern elaborate cakes have lost meaning.",
                "Recipes change, but the meaning of birthday cake stays.",
                "All cakes should be made at home.",
                "Mirror glaze is the most popular style.",
              ],
              correct: 1,
              explanation: "The text closes with 'The recipe has changed; the meaning has not.'",
            },
          ],
        },
      ],
    },

    /* ===== DAY 7 — Opinions & culture ===== */
    {
      day: 7,
      readings: [
        {
          id: "rd:w1d7:general",
          category: "general",
          title: "Why Documentaries Hit Differently",
          intro: "Why a real story can feel heavier than a movie.",
          paragraphs: [
            "We know a film is fiction, even when it makes us cry. Documentaries play by different rules. The voice on screen is a real person; the mistakes are real mistakes; the cost was paid by someone we can almost reach through the screen. Because we cannot soothe ourselves with 'it's just a story,' a documentary lingers longer in the mind, sometimes for days.",
            "This is also why the best documentaries do not need to be loud. A quiet shot of a person making tea can carry more weight than a dramatic scene in a Hollywood movie. The camera asks one question — 'are you really paying attention?' — and the patient viewer is rewarded.",
          ],
          vocab: [
            { w: "documentary", p: "noun", m: "a non-fiction film about real events or people", ex: "A documentary about jazz music." },
            { w: "to resonate", p: "verb", m: "to have a deep emotional effect", ex: "That story resonated with me." },
            { w: "raw (emotion)", p: "adj", m: "honest and unfiltered", ex: "The interview was raw and powerful." },
            { w: "to linger", p: "verb", m: "to stay in the mind", ex: "The film lingers for days." },
            { w: "to soothe oneself", p: "phrase", m: "to comfort or calm yourself", ex: "We soothe ourselves with stories." },
          ],
          mcqs: [
            {
              q: "Why do documentaries 'hit differently' according to the author?",
              opts: [
                "They use better cameras than fiction films.",
                "They are shorter than movies.",
                "Because they show real people, viewers cannot dismiss them as 'just a story.'",
                "They are always sad.",
              ],
              correct: 2,
              explanation: "The text says we cannot use 'it's just a story' to soothe ourselves with documentaries.",
            },
            {
              q: "What kind of documentary scene does the author praise?",
              opts: [
                "Loud, dramatic, action-packed scenes.",
                "Quiet, patient scenes that reward attention.",
                "Scenes with celebrities.",
                "Scenes filmed in studios.",
              ],
              correct: 1,
              explanation: "The author specifically praises quiet shots over loud Hollywood-style drama.",
            },
            {
              q: "What does the metaphor 'are you really paying attention?' suggest?",
              opts: [
                "Documentaries should warn viewers loudly.",
                "Documentaries reward viewers who watch carefully.",
                "Documentaries are too boring for most people.",
                "Camera operators must shout during filming.",
              ],
              correct: 1,
              explanation: "The metaphor implies viewer attention is rewarded by the form.",
            },
          ],
        },
        {
          id: "rd:w1d7:scientific",
          category: "scientific",
          title: "Stories Light Up the Brain",
          intro: "What brain scans show when we hear a good story.",
          paragraphs: [
            "When a person hears facts — say, 'the price increased by twelve percent' — only the language areas of the brain are active. But put those facts inside a story — 'last week, my neighbor stood at the supermarket and saw the price had jumped twelve percent' — and many more parts of the brain begin to fire. Areas linked to movement, smell, and emotion all join in, as if the listener is partly inside the story.",
            "Researchers call this 'neural coupling.' The brains of the storyteller and the listener begin to mirror each other, lighting up in similar patterns. This is one of the deepest reasons why we remember stories long after we forget the data inside them. If you want a fact to stick, wrap it in a story first.",
          ],
          vocab: [
            { w: "neural", p: "adj", m: "related to nerves and the brain", ex: "Neural activity increases with stories." },
            { w: "to light up", p: "phrase", m: "to become active (in brain scans)", ex: "Memory areas light up." },
            { w: "engagement", p: "noun", m: "active mental involvement", ex: "Stories cause higher engagement." },
            { w: "fMRI", p: "noun (abbr.)", m: "a brain scan that shows active areas", ex: "fMRI shows the brain at work." },
            { w: "to mirror", p: "verb", m: "to match or copy", ex: "Listener brains mirror the storyteller's." },
            { w: "to wrap (a fact)", p: "phrase", m: "to put inside something else (here: a story)", ex: "Wrap a fact in a story." },
          ],
          mcqs: [
            {
              q: "What does the research show about plain facts vs. stories?",
              opts: [
                "Plain facts cause more brain activity.",
                "Stories activate many more brain areas than plain facts.",
                "Facts and stories are processed identically.",
                "Stories deactivate the brain completely.",
              ],
              correct: 1,
              explanation: "The text says many more parts of the brain fire when facts are inside a story.",
            },
            {
              q: "What is 'neural coupling'?",
              opts: [
                "When two brains light up in similar patterns during storytelling.",
                "A type of brain medicine.",
                "A specific area of the language brain.",
                "When two people speak at the same time.",
              ],
              correct: 0,
              explanation: "The text defines it as the matching brain patterns between speaker and listener.",
            },
            {
              q: "What practical advice does the author give?",
              opts: [
                "Avoid stories — they distort facts.",
                "If you want a fact to stick, wrap it in a story.",
                "Memorize numbers without context.",
                "Tell only short stories.",
              ],
              correct: 1,
              explanation: "The closing line gives this exact advice.",
            },
          ],
        },
        {
          id: "rd:w1d7:fashion",
          category: "fashion",
          title: "The Art of the Book Cover",
          intro: "How a thin layer of paper sells (or sinks) a story.",
          paragraphs: [
            "We are told not to judge a book by its cover, but publishers happily ignore this advice. A great cover earns a few extra seconds of attention in a crowded bookstore — and sometimes that is all it takes for a reader to pick the book up. Designers think carefully about color, typography, the spine, and even the texture of the paper. A glossy thriller and a rough literary novel say something different long before a single page is read.",
            "Some covers become more famous than the books themselves: the simple white background of a Penguin Classic, the bright stripes of a children's series, the foggy photo on a quiet memoir. The best covers are not just decoration; they are a quiet first conversation between the reader and the book, conducted with no words at all.",
          ],
          vocab: [
            { w: "book cover", p: "noun", m: "the outer paper or board on a book", ex: "The book cover is bright orange." },
            { w: "typography", p: "noun", m: "the design and arrangement of letters", ex: "Good typography matters on a cover." },
            { w: "spine (book)", p: "noun", m: "the side of a book where pages are joined", ex: "The title is on the spine." },
            { w: "to flip through", p: "phrase", m: "to look quickly at pages", ex: "He flipped through the book." },
            { w: "first impression", p: "phrase", m: "the first feeling you have about something", ex: "The cover is your first impression." },
            { w: "compelling", p: "adj", m: "strongly attracting your attention", ex: "A compelling cover sells books." },
          ],
          mcqs: [
            {
              q: "What is the author's view of the saying 'don't judge a book by its cover'?",
              opts: [
                "Publishers and readers follow it carefully.",
                "Publishers ignore it because covers really do influence buyers.",
                "Only librarians follow it.",
                "It only applies to old books.",
              ],
              correct: 1,
              explanation: "The text says 'publishers happily ignore this advice' because covers really do work.",
            },
            {
              q: "Which design elements are mentioned?",
              opts: [
                "Color, typography, spine, paper texture.",
                "Music, smell, and movement.",
                "Page numbers and word count.",
                "Author photos only.",
              ],
              correct: 0,
              explanation: "The text lists color, typography, spine, and texture.",
            },
            {
              q: "What is the author's main point about good covers?",
              opts: [
                "They are pure decoration.",
                "They are a wordless first conversation between reader and book.",
                "They should match the book's genre exactly.",
                "They are always more important than the writing.",
              ],
              correct: 1,
              explanation: "The closing image — 'a quiet first conversation … with no words' — captures the author's view.",
            },
          ],
        },
      ],
    },
  ],
};
