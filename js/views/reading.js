/* Reading view — 3 readings per day with vocab sidebar (Persian reveal) + MCQ */
window.Views = window.Views || {};
window.Views.reading = function (mount, params) {
  const { el } = UI;
  const w = parseInt(params.w, 10);
  const d = parseInt(params.d, 10);
  const data = w === 1 ? WEEK1_READING : null;
  const dayContent = data && data.days[d - 1];
  if (!dayContent) { mount.innerHTML = "<div class='empty'>Reading content for this day isn't available yet.</div>"; return; }

  UI.clear(mount);

  // Active reading index (0..2)
  let activeIdx = parseInt(sessionStorage.getItem(`rd:active:${w}:${d}`) || "0", 10);
  if (activeIdx < 0 || activeIdx >= dayContent.readings.length) activeIdx = 0;

  const head = el("div", { class: "page-head" }, [
    el("div", null, [
      el("div", { class: "breadcrumb" }, [
        el("a", { onclick: () => location.hash = "#/dashboard" }, "Dashboard"), " · ",
        el("a", { onclick: () => location.hash = "#/week/" + w }, `Week ${w}`), " · ",
        el("a", { onclick: () => location.hash = `#/week/${w}/day/${d}` }, `Day ${d}`), " · ",
        el("span", null, "Reading"),
      ]),
      el("h1", null, "Reading practice"),
      el("div", { class: "muted", style: "margin-top:6px" }, "Three short texts. Read calmly, tap any unknown word in the sidebar, then try the questions."),
    ]),
    el("div", { class: "actions" }, [
      el("button", { class: "btn", onclick: () => location.hash = `#/week/${w}/day/${d}` }, "Back"),
    ]),
  ]);
  mount.appendChild(head);

  // Tabs for the 3 readings
  const tabsRow = el("div", { class: "reading-tabs" });
  dayContent.readings.forEach((rd, i) => {
    const done = State.getDay(w, d).tasks[rd.id] && State.getDay(w, d).tasks[rd.id].done;
    const btn = el("button", {
      class: i === activeIdx ? "active" : "",
      onclick: () => { activeIdx = i; sessionStorage.setItem(`rd:active:${w}:${d}`, i); render(); },
    }, [
      el("span", { class: "cat-icon" }, catEmoji(rd.category)),
      el("span", null, catLabel(rd.category)),
      done ? el("span", { class: "cat-done", text: " ✓" }) : null,
    ]);
    tabsRow.appendChild(btn);
  });
  mount.appendChild(tabsRow);

  const body = el("div");
  mount.appendChild(body);

  function render() {
    UI.clear(body);
    Array.from(tabsRow.children).forEach((btn, i) => btn.classList.toggle("active", i === activeIdx));
    body.appendChild(buildReading(w, d, dayContent.readings[activeIdx]));
  }
  render();
};

function buildReading(w, d, rd) {
  const { el } = UI;
  const wrap = el("div", { class: "col" });

  wrap.appendChild(el("div", { class: "card" }, [
    el("div", { class: "row" }, [
      el("span", { class: `cat-pill ${rd.category}` }, [
        el("span", null, catEmoji(rd.category)), " ", catLabel(rd.category),
      ]),
      el("span", { class: "spacer" }),
    ]),
    el("h2", { style: "margin:10px 0 4px;font-size:24px" }, rd.title),
    rd.intro ? el("div", { class: "muted", style: "margin-bottom:10px" }, rd.intro) : null,
  ]));

  const layout = el("div", { class: "reading-layout" });
  const main = el("div", { class: "col" });
  const side = el("div", { class: "col" });

  // Passage
  main.appendChild(el("div", { class: "card" }, [
    el("div", { class: "passage" }, rd.paragraphs.map((p) => el("p", null, p))),
  ]));

  // MCQ
  main.appendChild(el("div", { class: "section-title" }, "Let's check your understanding"));
  main.appendChild(MCQ.build({
    questions: rd.mcqs,
    storageKey: `mcq:${rd.id}`,
    onComplete: (score, total) => {
      if (score >= Math.ceil(total * 0.67)) {
        State.setTaskDone(w, d, rd.id, true);
        State.pingStreak();
        UI.toast(`Reading complete · ${score}/${total} ✓`);
      } else {
        UI.toast(`${score}/${total} — try again whenever you like!`);
      }
    },
  }));

  // Sidebar — vocab
  side.appendChild(buildVocabCard(rd.vocab, w, d, "Reading vocabulary"));

  layout.appendChild(main);
  layout.appendChild(side);
  wrap.appendChild(layout);

  return wrap;
}


function catEmoji(c) {
  return c === "general" ? "🌍" : c === "scientific" ? "🔬" : c === "fashion" ? "🎨" : "📖";
}
function catLabel(c) {
  return c === "general" ? "General" : c === "scientific" ? "Science" : c === "fashion" ? "Art & Style" : c;
}

function exportReadingPDF(rd, w, d) {
  const { el } = UI;
  const root = document.createElement("div");
  root.style.cssText = "font-family: ui-sans-serif, system-ui, sans-serif; color:#0f172a; padding:8px; max-width:720px; margin:auto;";
  const fa = window.tFa;
  const escapeHTML = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
  root.innerHTML = `
    <div style="border-bottom:2px solid #7c3aed;padding-bottom:12px;margin-bottom:14px">
      <div style="font-size:12px;color:#7c3aed;font-weight:700;letter-spacing:.06em;text-transform:uppercase">
        Pathway · Week ${w} · Day ${d} · Reading
      </div>
      <h1 style="margin:6px 0 4px;font-size:24px">${escapeHTML(rd.title)}</h1>
      <div style="color:#475569;font-size:13px">${escapeHTML(rd.intro || "")}</div>
    </div>
    <div style="font-size:14px;line-height:1.7">
      ${rd.paragraphs.map(p => `<p style="margin:0 0 12px">${escapeHTML(p)}</p>`).join("")}
    </div>
    <div style="margin-top:18px">
      <div style="font-weight:700;font-size:13px;color:#7c3aed;letter-spacing:.05em;text-transform:uppercase;margin-bottom:8px">Vocabulary</div>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        ${rd.vocab.map(v => {
          const persian = fa ? fa(v.w) : null;
          return `
            <tr style="border-bottom:1px solid #e2e8f0">
              <td style="padding:8px;vertical-align:top;width:30%"><b style="color:#7c3aed">${escapeHTML(v.w)}</b>${v.p ? ` <span style='color:#94a3b8'>${escapeHTML(v.p)}</span>` : ""}</td>
              <td style="padding:8px;vertical-align:top">
                <div>${escapeHTML(v.m)}</div>
                ${v.ex ? `<div style="color:#64748b;font-style:italic;margin-top:2px">ex: ${escapeHTML(v.ex)}</div>` : ""}
                ${persian ? `<div dir="rtl" style="text-align:right;color:#7c3aed;font-weight:600;margin-top:4px;font-family:Vazirmatn,Tahoma">${escapeHTML(persian)}</div>` : ""}
              </td>
            </tr>`;
        }).join("")}
      </table>
    </div>
    <div style="margin-top:18px">
      <div style="font-weight:700;font-size:13px;color:#7c3aed;letter-spacing:.05em;text-transform:uppercase;margin-bottom:8px">Questions</div>
      ${rd.mcqs.map((q, i) => `
        <div style="margin-bottom:12px;padding:10px;border:1px solid #e2e8f0;border-radius:8px">
          <div style="font-weight:600;font-size:13px">${i + 1}. ${escapeHTML(q.q)}</div>
          ${q.opts.map((o, j) => `<div style="font-size:13px;margin-top:4px">${"ABCD"[j]}. ${escapeHTML(o)}</div>`).join("")}
        </div>
      `).join("")}
    </div>
  `;
  document.body.appendChild(root);
  PDF.exportNode(root, `pathway-w${w}-d${d}-reading-${rd.category}.pdf`).then(() => root.remove());
}
