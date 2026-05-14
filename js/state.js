/* App state model — derived from storage */
(function () {
  const TODAY = () => new Date().toISOString().slice(0, 10);
  const SKILLS = ["speaking", "listening", "reading", "writing"];
  const SESSIONS = ["together", "solo"]; // 1h together + 2h solo

  function defaultDayState() {
    return {
      tasks: {}, // taskId -> { done: bool, completedAt }
      ratings: {}, // skill -> 1..10
      newWords: [], // [wordIds added today]
      notes: "",
      timeSpent: 0, // minutes
    };
  }

  function defaultWeekState() {
    return {
      days: {}, // 1..7 -> defaultDayState
      reflection: "",
      perfSummary: null, // computed at week end
    };
  }

  const State = {
    SKILLS, SESSIONS,
    today: TODAY,

    /* ===== XP System ===== */
    getXP() {
      return Storage.get("totalXP", 0);
    },
    addXP(amount, reason = "Practice") {
      const cur = this.getXP();
      const next = cur + amount;
      Storage.set("totalXP", next);
      if (typeof UI !== "undefined" && UI.toastXP) {
        UI.toastXP(amount, reason);
      }
      // Trigger sidebar update if app.js is ready
      if (window.updateSidebarXP) window.updateSidebarXP(next);
      return next;
    },
    migrateXP() {
      if (Storage.get("xp_migrated_v4", false)) return;
      
      let total = 0;
      const allData = Storage.getAll();
      console.log("XP Migration v4 started. Keys found:", Object.keys(allData).length);

      // 1. Scan all weeks for core tasks
      for (let w = 1; w <= 25; w++) {
        const wk = allData[`week:${w}`];
        if (!wk || !wk.days) continue;
        Object.keys(wk.days).forEach(dNum => {
          const day = wk.days[dNum];
          if (!day || !day.tasks) return;
          Object.keys(day.tasks).forEach(tid => {
            const t = day.tasks[tid];
            if (!t) return;

            // Repeats (Speaking/Story)
            const reps = parseInt(t.repeats || 0);
            if (reps > 0) {
              if (tid.includes("story")) {
                total += reps * 5;
                console.log(`+${reps * 5} XP (Story ${tid} repeats: ${reps})`);
              } else if (tid.includes("together") || tid.includes("solo")) {
                total += reps * 3;
                console.log(`+${reps * 3} XP (Speaking ${tid} repeats: ${reps})`);
              }
            }
            
            // Writing completions (Done status)
            if (t.done) {
              if (tid.includes("cloze")) {
                total += 3;
                console.log("+3 XP (Cloze complete)");
              } else if (tid.includes("scramble")) {
                total += 5;
                console.log("+5 XP (Scramble complete)");
              } else if (tid.includes("guided")) {
                total += 10;
                console.log("+10 XP (Guided complete)");
              } else if (!tid.includes("together") && !tid.includes("solo")) {
                total += 1;
                console.log("+1 XP (Task complete)");
              }
            }
          });
        });
      }
      
      // 2. MCQs and Dictation
      Object.keys(allData).forEach(k => {
        if (k.startsWith("mcq:")) {
          const s = allData[k];
          if (s && s.answers) {
            const count = s.answers.filter(a => a != null).length;
            if (count > 0) {
              total += count;
              console.log(`+${count} XP (MCQ questions)`);
            }
          }
        } else if (k.startsWith("dictation:")) {
          const s = allData[k];
          if (s && s.completed) {
            total += 3;
            console.log("+3 XP (Dictation complete)");
          }
        }
      });
      
      // 3. Leitner
      const cards = this.getCards();
      let lCount = 0;
      cards.forEach(c => {
        lCount += (c.history || []).length;
      });
      if (lCount > 0) {
        total += lCount;
        console.log(`+${lCount} XP (Vocab reviews)`);
      }

      Storage.set("totalXP", total);
      Storage.set("xp_migrated_v4", true);
      console.log(`XP Migration v4 complete. TOTAL: ${total} XP.`);
    },

    /* ===== Weeks / Days ===== */
    getWeek(w) {
      return Storage.get(`week:${w}`, defaultWeekState());
    },
    setWeek(w, val) {
      Storage.set(`week:${w}`, val);
    },
    getDay(w, d) {
      const wk = this.getWeek(w);
      const day = wk.days[d] || {};
      return { ...defaultDayState(), ...day };
    },
    setDay(w, d, val) {
      const wk = this.getWeek(w);
      wk.days[d] = val;
      this.setWeek(w, wk);
    },
    updateDay(w, d, fn) {
      const cur = this.getDay(w, d);
      const next = fn(cur);
      this.setDay(w, d, next);
      return next;
    },

    /* Task progress */
    toggleTask(w, d, taskId) {
      return this.updateDay(w, d, (day) => {
        const t = day.tasks[taskId] || { done: false };
        t.done = !t.done;
        t.completedAt = t.done ? new Date().toISOString() : null;
        day.tasks[taskId] = t;
        return day;
      });
    },
    setTaskDone(w, d, taskId, done) {
      return this.updateDay(w, d, (day) => {
        const t = day.tasks[taskId] || {};
        t.done = !!done;
        t.completedAt = done ? new Date().toISOString() : null;
        day.tasks[taskId] = t;
        return day;
      });
    },

    /* Repeats for speaking */
    getConvRepeats(w, d, taskId) {
      const day = this.getDay(w, d);
      return (day.tasks[taskId] && day.tasks[taskId].repeats) || 0;
    },
    incrementConvRepeats(w, d, taskId, max) {
      const limit = max || 4;
      return this.updateDay(w, d, (day) => {
        const t = day.tasks[taskId] || { done: false };
        t.repeats = Math.min(limit, (t.repeats || 0) + 1);
        if (t.repeats >= limit) t.done = true; // Auto-complete if all repeats done
        day.tasks[taskId] = t;
        return day;
      });
    },
    setConvRepeats(w, d, taskId, count) {
      return this.updateDay(w, d, (day) => {
        const t = day.tasks[taskId] || { done: false };
        t.repeats = count;
        day.tasks[taskId] = t;
        return day;
      });
    },

    /* Self-rating */
    setRating(w, d, skill, val) {
      return this.updateDay(w, d, (day) => {
        day.ratings[skill] = val;
        return day;
      });
    },

    /* Notes */
    setNote(w, d, note) {
      return this.updateDay(w, d, (day) => {
        day.notes = note;
        return day;
      });
    },

    /* Aggregations */
    weekProgress(w) {
      // Returns 0..1 fraction of tasks done across 7 days (assume 8 tasks/day for now)
      const wk = this.getWeek(w);
      let done = 0, total = 0;
      const meta = window.PLAN.weeks[w - 1];
      const tasksPerDay = meta && meta.tasksPerDay ? meta.tasksPerDay : 13;
      for (let d = 1; d <= 7; d++) {
        const day = wk.days[d] || { tasks: {} };
        const taskIds = Object.keys(day.tasks);
        const dDone = taskIds.filter((k) => day.tasks[k].done).length;
        done += Math.min(dDone, tasksPerDay);
        total += tasksPerDay;
      }
      return total ? done / total : 0;
    },
    skillProgress(w) {
      // Weekly totals: 4 speaking + 3 each for others per day = 28/21/21/21 per week
      const wk = this.getWeek(w);
      const done = { speaking: 0, listening: 0, reading: 0, writing: 0 };
      const totals = { speaking: 28, listening: 21, reading: 21, writing: 21 };
      
      for (let d = 1; d <= 7; d++) {
        const day = wk.days[d] || { tasks: {} };
        Object.keys(day.tasks).forEach((id) => {
          const sk = id.startsWith("sp:") ? "speaking"
            : id.startsWith("li:") ? "listening"
            : id.startsWith("rd:") ? "reading"
            : id.startsWith("wr:") ? "writing"
            : null;
          if (sk && day.tasks[id].done) {
            done[sk] += 1;
          }
        });
      }
      
      const ratios = {};
      Object.keys(totals).forEach((k) => {
        // Cap done at total in case of data oddities
        ratios[k] = Math.min(1, done[k] / totals[k]);
      });
      return ratios;
    },

    /* ===== Streak ===== */
    getStreak() {
      return Storage.get("streak", { count: 0, lastDay: null });
    },
    pingStreak() {
      const today = TODAY();
      const s = this.getStreak();
      if (s.lastDay === today) return s;
      const yesterday = (() => {
        const t = new Date(); t.setDate(t.getDate() - 1);
        return t.toISOString().slice(0, 10);
      })();
      if (s.lastDay === yesterday) s.count += 1;
      else s.count = 1;
      s.lastDay = today;
      Storage.set("streak", s);
      return s;
    },

    /* ===== Leitner ===== */
    // Boxes 1..5 with intervals (days): 1, 3, 7, 14, 30
    LEITNER_INTERVALS: [1, 3, 7, 14, 30],
    getCards() {
      return Storage.get("leitner:cards", []);
    },
    getDueCount() {
      const today = TODAY();
      return this.getCards().filter(c => c.nextDue <= today).length;
    },
    setCards(cards) {
      Storage.set("leitner:cards", cards);
    },
    addCard(card) {
      const cards = this.getCards();
      const id = "c_" + Date.now().toString(36) + "_" + Math.floor(Math.random() * 1e6).toString(36);
      const today = TODAY();
      const newCard = Object.assign({
        id,
        word: "",
        meaning: "",
        example: "",
        pos: "",
        box: 1,
        nextDue: today,
        history: [],
        addedAt: new Date().toISOString(),
        sourceWeek: null,
        sourceDay: null,
      }, card);
      cards.push(newCard);
      this.setCards(cards);
      return newCard;
    },
    answerCard(id, correct) {
      const cards = this.getCards();
      const c = cards.find((x) => x.id === id);
      if (!c) return null;
      if (!c.history) c.history = [];
      c.history.push({ at: new Date().toISOString(), correct });
      if (correct) {
        c.box = Math.min(5, c.box + 1);
      } else {
        c.box = 1;
      }
      const interval = this.LEITNER_INTERVALS[c.box - 1];
      const next = new Date();
      next.setDate(next.getDate() + interval);
      c.nextDue = next.toISOString().slice(0, 10);
      this.setCards(cards);
      return c;
    },
    cardsDueToday() {
      const today = TODAY();
      return this.getCards().filter((c) => c.nextDue <= today);
    },
    cardsByBox() {
      const out = [[], [], [], [], []];
      this.getCards().forEach((c) => out[(c.box || 1) - 1].push(c));
      return out;
    },

    /* ===== Image story session state ===== */
    getStorySession(w, d, slot) {
      const k = `story:${w}:${d}:${slot}`;
      const session = Storage.get(k, { described: {} });
      // Remove legacy imageData if it exists in localStorage to free up space
      if (session.imageData) {
        console.log("Migrating image data from localStorage to ImageDB...");
        const data = session.imageData;
        delete session.imageData;
        Storage.set(k, session);
        ImageDB.set(k, data).catch(console.error);
      }
      return session;
    },
    setStorySession(w, d, slot, val) {
      const k = `story:${w}:${d}:${slot}`;
      // Separate imageData from metadata
      if (val.imageData) {
        ImageDB.set(k, val.imageData).catch(console.error);
        delete val.imageData;
      }
      Storage.set(k, val);
    },
    async getStoryImage(w, d, slot) {
      return ImageDB.get(`story:${w}:${d}:${slot}`);
    }
  };

  window.State = State;
})();
