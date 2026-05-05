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

    /* ===== Weeks / Days ===== */
    getWeek(w) {
      return Storage.get(`week:${w}`, defaultWeekState());
    },
    setWeek(w, val) {
      Storage.set(`week:${w}`, val);
    },
    getDay(w, d) {
      const wk = this.getWeek(w);
      return wk.days[d] || defaultDayState();
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
      const tasksPerDay = meta && meta.tasksPerDay ? meta.tasksPerDay : 8;
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
      // crude per-skill completion from tasks prefix sp:/li:/rd:/wr:
      const wk = this.getWeek(w);
      const out = { speaking: [0, 0], listening: [0, 0], reading: [0, 0], writing: [0, 0] };
      for (let d = 1; d <= 7; d++) {
        const day = wk.days[d] || { tasks: {} };
        Object.keys(day.tasks).forEach((id) => {
          const sk = id.startsWith("sp:") ? "speaking"
            : id.startsWith("li:") ? "listening"
            : id.startsWith("rd:") ? "reading"
            : id.startsWith("wr:") ? "writing"
            : null;
          if (!sk) return;
          out[sk][1] += 1;
          if (day.tasks[id].done) out[sk][0] += 1;
        });
      }
      const ratios = {};
      Object.keys(out).forEach((k) => {
        ratios[k] = out[k][1] ? out[k][0] / out[k][1] : 0;
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
