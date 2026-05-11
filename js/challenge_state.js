/* Challenge100 state — fully independent from main TOEFL state.
 *
 * Storage namespace: all keys are prefixed `c100:` and do not touch
 * any pre-existing keys (week:*, leitner:cards, totalXP, streak, …).
 */
(function () {
  const TODAY = () => new Date().toISOString().slice(0, 10);
  const LEITNER_INTERVALS = [1, 3, 7, 14, 30];

  function defaultDay() {
    return {
      tasks: {},     // taskId -> { done, completedAt, payload?:... }
      ratings: {},   // taskId -> 1..10
      timeSpent: 0,
    };
  }

  const Challenge = {
    LEITNER_INTERVALS,
    today: TODAY,

    /* ===== Day / Task ===== */
    getDay(d) {
      return Storage.get(`c100:day:${d}`, defaultDay());
    },
    setDay(d, val) {
      Storage.set(`c100:day:${d}`, val);
    },
    updateDay(d, fn) {
      const cur = this.getDay(d);
      const next = fn(cur);
      this.setDay(d, next);
      return next;
    },
    setTaskDone(d, taskId, done) {
      return this.updateDay(d, (day) => {
        const t = day.tasks[taskId] || {};
        t.done = !!done;
        t.completedAt = done ? new Date().toISOString() : null;
        day.tasks[taskId] = t;
        return day;
      });
    },
    setTaskPayload(d, taskId, payload) {
      return this.updateDay(d, (day) => {
        const t = day.tasks[taskId] || {};
        t.payload = payload;
        day.tasks[taskId] = t;
        return day;
      });
    },
    getTask(d, taskId) {
      const day = this.getDay(d);
      return day.tasks[taskId] || { done: false };
    },
    dayProgress(d, totalTasks) {
      const day = this.getDay(d);
      const ids = Object.keys(day.tasks);
      const doneCount = ids.filter((k) => day.tasks[k].done).length;
      return totalTasks ? Math.min(1, doneCount / totalTasks) : 0;
    },

    /* ===== XP ===== */
    getXP() {
      return Storage.get("c100:xp", 0);
    },
    addXP(amount, reason = "Practice") {
      const next = this.getXP() + amount;
      Storage.set("c100:xp", next);
      if (typeof UI !== "undefined" && UI.toastXP) {
        UI.toastXP(amount, reason);
      }
      return next;
    },

    /* ===== Streak ===== */
    getStreak() {
      return Storage.get("c100:streak", { count: 0, lastDay: null });
    },
    pingStreak() {
      const today = TODAY();
      const s = this.getStreak();
      if (s.lastDay === today) return s;
      const yesterday = (() => {
        const t = new Date();
        t.setDate(t.getDate() - 1);
        return t.toISOString().slice(0, 10);
      })();
      if (s.lastDay === yesterday) s.count += 1;
      else s.count = 1;
      s.lastDay = today;
      Storage.set("c100:streak", s);
      return s;
    },

    /* ===== Leitner (independent box) ===== */
    getCards() {
      return Storage.get("c100:leitner:cards", []);
    },
    setCards(cards) {
      Storage.set("c100:leitner:cards", cards);
    },
    addCard(card) {
      const cards = this.getCards();
      // Skip if same word already exists (case-insensitive)
      if (cards.some((c) => c.word.toLowerCase() === (card.word || "").toLowerCase())) {
        return null;
      }
      const id = "cc_" + Date.now().toString(36) + "_" + Math.floor(Math.random() * 1e6).toString(36);
      const newCard = Object.assign({
        id,
        word: "",
        meaning: "",
        example: "",
        pos: "",
        box: 1,
        nextDue: TODAY(),
        history: [],
        addedAt: new Date().toISOString(),
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
      c.box = correct ? Math.min(5, c.box + 1) : 1;
      const interval = LEITNER_INTERVALS[c.box - 1];
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
    getDueCount() {
      return this.cardsDueToday().length;
    },
  };

  window.Challenge = Challenge;
})();
