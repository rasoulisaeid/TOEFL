/* PDF export helpers — wraps html2pdf.bundle */
(function () {
  function exportNode(node, filename) {
    if (!window.html2pdf) {
      UI.toast("PDF library not loaded");
      return;
    }
    UI.toast("Building PDF…");
    const opts = {
      margin: [10, 10, 10, 10],
      filename: filename || "pathway.pdf",
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };
    return html2pdf().set(opts).from(node).save();
  }

  /* Build a printable conversation document from a conversation object */
  function buildConversationPDFNode(conv, weekNum, dayNum) {
    const root = document.createElement("div");
    root.style.cssText = "font-family: ui-sans-serif, system-ui, sans-serif; color: #0f172a; padding: 8px; max-width: 720px; margin: auto;";
    root.innerHTML = `
      <div style="border-bottom:2px solid #7c3aed;padding-bottom:12px;margin-bottom:14px">
        <div style="font-size:12px;color:#7c3aed;font-weight:700;letter-spacing:.06em;text-transform:uppercase">Pathway · Week ${weekNum} · Day ${dayNum}</div>
        <h1 style="margin:6px 0 4px;font-size:24px">${escapeHTML(conv.title)}</h1>
        <div style="color:#475569;font-size:13px">${escapeHTML(conv.scenario || "")}</div>
        <div style="color:#475569;font-size:13px;margin-top:6px"><b>Goal:</b> ${escapeHTML(conv.goal || "")}</div>
      </div>
      <div style="margin-bottom:18px">
        <div style="font-weight:700;font-size:13px;color:#7c3aed;letter-spacing:.05em;text-transform:uppercase;margin-bottom:8px">Dialogue</div>
        ${conv.dialogue.map(line => {
          const role = line.who === "A" ? (conv.roles && conv.roles[0]) : (conv.roles && conv.roles[1]);
          const align = line.who === "B" ? "left" : "right";
          const bg    = line.who === "B" ? "#f1f5f9" : "#ede9fe";
          const color = line.who === "B" ? "#1e293b" : "#4338ca";
          return `
            <div style="text-align:${align};margin-bottom:8px">
              <div style="display:inline-block;text-align:left;max-width:85%;background:${bg};border:1px solid #e2e8f0;border-radius:14px;padding:8px 12px">
                <div style="font-size:11px;color:${color};font-weight:700;margin-bottom:2px">${escapeHTML(role || line.who)}</div>
                <div style="font-size:14px;line-height:1.5">${escapeHTML(line.line)}</div>
              </div>
            </div>`;
        }).join("")}
      </div>
      <div>
        <div style="font-weight:700;font-size:13px;color:#7c3aed;letter-spacing:.05em;text-transform:uppercase;margin-bottom:8px">Vocabulary</div>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          ${conv.vocab.map(v => {
            const fa = window.tFa ? tFa(v.w) : null;
            return `
              <tr style="border-bottom:1px solid #e2e8f0">
                <td style="padding:8px;vertical-align:top;width:30%"><b style="color:#7c3aed">${escapeHTML(v.w)}</b>${v.p ? ` <span style='color:#94a3b8'>${escapeHTML(v.p)}</span>` : ""}</td>
                <td style="padding:8px;vertical-align:top">
                  <div>${escapeHTML(v.m)}</div>
                  ${v.ex ? `<div style="color:#64748b;font-style:italic;margin-top:2px">ex: ${escapeHTML(v.ex)}</div>` : ""}
                  ${fa ? `<div dir="rtl" style="text-align:right;color:#7c3aed;font-weight:600;margin-top:4px;font-family:Vazirmatn,Tahoma">${escapeHTML(fa)}</div>` : ""}
                </td>
              </tr>`;
          }).join("")}
        </table>
      </div>`;
    return root;
  }

  /* Build a printable image-story document from 8 sliced canvases */
  function buildStoryPDFNode(story, sceneCanvases) {
    const root = document.createElement("div");
    root.style.cssText = "font-family: ui-sans-serif, system-ui, sans-serif; color: #0f172a; padding: 8px; max-width: 720px; margin: auto;";
    const head = document.createElement("div");
    head.innerHTML = `
      <div style="border-bottom:2px solid #7c3aed;padding-bottom:12px;margin-bottom:14px">
        <div style="font-size:12px;color:#7c3aed;font-weight:700;letter-spacing:.06em;text-transform:uppercase">Pathway · Image Story</div>
        <h1 style="margin:6px 0 4px;font-size:24px">${escapeHTML(story.title)}</h1>
      </div>`;
    root.appendChild(head);

    const grid = document.createElement("div");
    grid.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:10px";
    story.scenes.forEach((s, i) => {
      const cell = document.createElement("div");
      cell.style.cssText = "border:1px solid #e2e8f0;border-radius:10px;padding:10px;page-break-inside:avoid;background:#fff";
      const num = document.createElement("div");
      num.style.cssText = "font-size:11px;color:#7c3aed;font-weight:700;letter-spacing:.04em";
      num.textContent = `SCENE ${i + 1}`;
      const ttl = document.createElement("div");
      ttl.style.cssText = "font-weight:700;font-size:14px;margin:2px 0 6px";
      ttl.textContent = s.title;
      cell.appendChild(num);
      cell.appendChild(ttl);

      if (sceneCanvases && sceneCanvases[i]) {
        const img = document.createElement("img");
        img.style.cssText = "width:100%;height:auto;border-radius:6px;border:1px solid #e2e8f0";
        try { img.src = sceneCanvases[i].toDataURL("image/jpeg", 0.9); } catch (e) {}
        cell.appendChild(img);
      } else {
        const ph = document.createElement("div");
        ph.style.cssText = "border:1px dashed #cbd5e1;border-radius:6px;padding:30px;text-align:center;color:#94a3b8;font-size:12px";
        ph.textContent = "(no image pasted yet)";
        cell.appendChild(ph);
      }

      const desc = document.createElement("div");
      desc.style.cssText = "margin-top:6px;font-size:12px;color:#475569;line-height:1.45";
      desc.textContent = s.description;
      cell.appendChild(desc);

      if (s.vocab && s.vocab.length) {
        const v = document.createElement("div");
        v.style.cssText = "margin-top:6px;font-size:11px;color:#7c3aed";
        v.textContent = "vocab: " + s.vocab.join(" · ");
        cell.appendChild(v);
      }

      grid.appendChild(cell);
    });
    root.appendChild(grid);
    return root;
  }

  function escapeHTML(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  window.PDF = { exportNode, buildConversationPDFNode, buildStoryPDFNode };
})();
