(() => {
  const $  = (s, r = document) => r.querySelector(s);
  const $ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Context ---------- */
  const p = new URLSearchParams(location.search);
  const s = JSON.parse(localStorage.getItem("ELP_SESSION") || "{}");
  const CTX = {
    uid: (typeof getUID === "function" ? getUID() : "guest"),
    name: p.get("name") || s.name || "ผู้เรียน",
    subject: p.get("subject") || s.subject || "English",
    level: p.get("class") || s.level || "M3",
    role: p.get("role") || s.role || "student"
  };
  window.ELP_CTX = CTX;
  $("#chipUser").textContent = "👨‍🎓 " + CTX.name;

  /* ---------- Answer normalizer ---------- */
  const CONTRACT = [
    [/isn'?t/g,"is not"], [/aren'?t/g,"are not"], [/don'?t/g,"do not"],
    [/doesn'?t/g,"does not"], [/it'?s/g,"it is"], [/that'?s/g,"that is"]
  ];
  function norm(str) {
    let t = (str || "").toLowerCase().trim();
    CONTRACT.forEach(([re, rep]) => t = t.replace(re, rep));
    return t.replace(/[.,!?;:"'’]/g, "").replace(/\s+/g, " ").trim();
  }
  const match = (input, answers) => answers.some(a => norm(a) === norm(input));

  /* ---------- Progress store ---------- */
  const PK = `ELP_U4_${CTX.uid}`;
  const store = JSON.parse(localStorage.getItem(PK) || "{}");
  const save = () => localStorage.setItem(PK, JSON.stringify(store));

  const LESSONS = ["L6","L7","L8","L9"];

  /* ---------- Tabs ---------- */
  function renderTabs(active) {
    $("#tabs").innerHTML = LESSONS.map(k => {
      const L = U4[k], sc = store[k];
      return `<button class="tab ${active===k?"on":""}" data-go="${k}">
        ${L.icon} ${L.title}${sc ? `<b class="tab-score">${sc.percent}%</b>` : ""}
      </button>`;
    }).join("") +
    `<button class="tab exam ${active==="EXAM"?"on":""}" data-go="EXAM">
       ✍️ Final Exam Writing${store.EXAM ? `<b class="tab-score">${store.EXAM.percent}%</b>` : ""}
     </button>`;
    $("[data-go]").forEach(b => b.onclick = () => route(b.dataset.go));
  }

  /* ---------- Lesson view ---------- */
  function renderLesson(key) {
    const L = U4[key];
    $("#view").innerHTML = `
      <article class="lesson-card">
        <div class="lesson-head">
          <span class="l-icon">${L.icon}</span>
          <div><h2>${L.title}</h2><p class="unit-th">${L.th}</p></div>
        </div>

        <div class="concept-row">
          ${L.concept.map(c => `<div class="concept"><h4>${c.h}</h4><p>${c.b}</p></div>`).join("")}
        </div>

        <h3 class="blk-title">📐 กฎการใช้</h3>
        <div class="table-wrap">
          <table class="data-table rules">
            <thead><tr><th>รูปแบบ</th><th>วิธีสร้าง</th><th>ตัวอย่าง</th></tr></thead>
            <tbody>${L.rules.map(r => `<tr><td><b>${r.r}</b></td><td>${r.f}</td><td>${r.ex}</td></tr>`).join("")}</tbody>
          </table>
        </div>

        <h3 class="blk-title">💬 ตัวอย่างประโยค</h3>
        <ul class="ex-list">${L.examples.map(e => `<li>${e}</li>`).join("")}</ul>

        ${key === "L6" || key === "L7" ? adjTableHTML() : ""}

        <h3 class="blk-title">📝 แบบฝึกหัด <small>(${L.ex.length} ข้อ)</small></h3>
        <div class="quiz" id="quiz">${L.ex.map((q,i) => itemHTML(q,i)).join("")}</div>

        <div class="quiz-bar">
          <button class="btn-primary" id="btnCheck">✅ ตรวจคำตอบ</button>
          <button class="btn-back" id="btnReset">🔄 ทำใหม่</button>
        </div>
        <div class="result" id="result" hidden></div>
      </article>`;

    $("#btnCheck").onclick = () => checkLesson(key);
    $("#btnReset").onclick = () => renderLesson(key);
  }

  function adjTableHTML() {
    return `
      <h3 class="blk-title">📋 ตารางที่ต้องจำ</h3>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Adjective</th><th>Comparative</th><th>Superlative</th><th>กฎ</th></tr></thead>
        <tbody>${U4.adjTable.map(a => `
          <tr><td><b>${a.adj}</b></td><td>${a.comp}</td><td>${a.sup}</td>
          <td><span class="tag">${a.rule}</span></td></tr>`).join("")}</tbody>
      </table></div>`;
  }

  /* ---------- Item renderer ---------- */
  function itemHTML(q, i) {
    const no = `<span class="q-no">${i+1}</span>`;
    if (q.type === "mcq")
      return `<div class="q-item" data-i="${i}">${no}<div class="q-body">
        <p class="q-text">${q.q}</p>
        <div class="opts">${q.opts.map((o,j) =>
          `<label class="opt"><input type="radio" name="q${i}" value="${j}"><span>${o}</span></label>`).join("")}</div>
        <p class="fb" hidden></p></div></div>`;

    return `<div class="q-item" data-i="${i}">${no}<div class="q-body">
      <p class="q-text">${q.q}</p>
      <input type="text" class="ans" placeholder="${q.hint || "พิมพ์คำตอบ..."}" autocomplete="off">
      <p class="fb" hidden></p></div></div>`;
  }

  /* ---------- Check lesson ---------- */
  function checkLesson(key) {
    const L = U4[key];
    let correct = 0;

    $(".q-item").forEach(el => {
      const i = +el.dataset.i, q = L.ex[i], fb = $(".fb", el);
      let ok = false, given = "";

      if (q.type === "mcq") {
        const sel = $(`input[name="q${i}"]:checked`, el);
        given = sel ? q.opts[+sel.value] : "";
        ok = sel && +sel.value === q.a;
      } else {
        given = $(".ans", el).value;
        ok = given.trim() && match(given, q.a);
      }

      el.classList.remove("ok","no");
      el.classList.add(ok ? "ok" : "no");
      fb.hidden = false;
      fb.className = "fb " + (ok ? "good" : "bad");
      fb.innerHTML = ok ? "✅ ถูกต้อง!"
        : `❌ คำตอบที่ถูก: <b>${q.type === "mcq" ? q.opts[q.a] : q.a[0]}</b>`;
      if (ok) correct++;
    });

    finish(key, correct, L.ex.length);
  }

  /* ---------- Exam view ---------- */
  function renderExam() {
    const E = U4.exam;
    let n = 0;
    const sec = (k) => {
      const S = E[k];
      if (S.type === "table")
        return `<div class="exam-sec"><h3 class="blk-title">${S.title}</h3>
          <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Adjective</th><th>Comparative</th><th>Superlative</th></tr></thead>
          <tbody>${S.items.map((it,i) => `
            <tr data-sec="${k}" data-i="${i}">
              <td><b>${it.adj}</b></td>
              <td><input class="ans cell" data-p="0" placeholder="..."></td>
              <td><input class="ans cell" data-p="1" placeholder="..."></td>
            </tr>`).join("")}</tbody></table></div></div>`;

      return `<div class="exam-sec"><h3 class="blk-title">${S.title}</h3>
        ${S.items.map((it,i) => `
          <div class="q-item" data-sec="${k}" data-i="${i}">
            <span class="q-no">${++n}</span>
            <div class="q-body">
              <p class="q-text">${it.q}</p>
              <input type="text" class="ans" placeholder="เขียนคำตอบ...">
              <p class="fb" hidden></p>
            </div></div>`).join("")}</div>`;
    };

    $("#view").innerHTML = `
      <article class="lesson-card exam-card">
        <div class="lesson-head">
          <span class="l-icon">✍️</span>
          <div><h2>Unit 4 — Final Exam Writing</h2>
          <p class="unit-th">ข้อเขียนเต็มรูปแบบ · ตรวจอัตโนมัติ · ส่งผลให้ครูทันที</p></div>
        </div>
        <div class="exam-note">💡 พิมพ์ประโยคเต็ม เว้นวรรคตามปกติ ระบบไม่สนใจตัวพิมพ์เล็ก/ใหญ่ และรับทั้ง <code>isn't</code> / <code>is not</code></div>
        ${["A","B","C","D","E"].map(sec).join("")}
        <div class="quiz-bar">
          <button class="btn-primary" id="btnSubmit">📤 ส่งข้อสอบ</button>
          <button class="btn-back" id="btnReset">🔄 เริ่มใหม่</button>
        </div>
        <div class="result" id="result" hidden></div>
      </article>`;

    $("#btnSubmit").onclick = checkExam;
    $("#btnReset").onclick  = renderExam;
  }

  function checkExam() {
    const E = U4.exam;
    let correct = 0, total = 0;

    ["A","C","D","E"].forEach(k => {
      const S = E[k];
      $(`.q-item[data-sec="${k}"]`).forEach(el => {
        const it = S.items[+el.dataset.i], v = $(".ans", el).value, fb = $(".fb", el);
        let ok;

        if (S.type === "free") {
          const t = norm(v);
          ok = !!t && it.need.every(w => t.includes(w))
                   && it.any.every(g => g.some(w => t.includes(w)));
        } else {
          ok = !!v.trim() && match(v, it.a);
        }

        total++; if (ok) correct++;
        el.classList.add(ok ? "ok" : "no");
        fb.hidden = false;
        fb.className = "fb " + (ok ? "good" : "bad");
        fb.innerHTML = ok ? "✅ ถูกต้อง"
          : S.type === "free" ? "⚠️ ลองใช้โครงสร้างให้ครบ เช่น <b>… more expensive than …</b>"
          : `❌ เฉลย: <b>${it.a[0]}</b>`;
      });
    });

    /* Section B (ตาราง 2 ช่อง) */
    $('tr[data-sec="B"]').forEach(tr => {
      const it = E.B.items[+tr.dataset.i];
      $(".cell", tr).forEach(inp => {
        const ok = !!inp.value.trim() && match(inp.value, [it.a[+inp.dataset.p]]);
        total++; if (ok) correct++;
        inp.classList.add(ok ? "cell-ok" : "cell-no");
        if (!ok) inp.placeholder = it.a[+inp.dataset.p];
      });
    });

    finish("EXAM", correct, total);
  }

  /* ---------- Finish & submit ---------- */
  function finish(key, correct, total) {
    const pct = Math.round(correct / total * 100);
    store[key] = { correct, total, percent: pct, ts: Date.now() };
    save();

    const grade = pct >= 80 ? { t:"ยอดเยี่ยม! 🎉", c:"good" }
                : pct >= 60 ? { t:"ผ่านแล้ว เก่งมาก 👍", c:"mid" }
                :             { t:"ลองทบทวนอีกครั้งนะคะ 💪", c:"low" };

    const r = $("#result");
    r.hidden = false;
    r.className = "result " + grade.c;
    r.innerHTML = `
      <div class="res-score">${correct}<small>/${total}</small></div>
      <div class="res-pct">${pct}%</div>
      <p class="res-msg">${grade.t}</p>
      <p class="res-sent">📡 ส่งผลให้ครูเรียบร้อยแล้ว</p>`;
    r.scrollIntoView({ behavior:"smooth", block:"center" });

    submitToTeacher(key, correct, total, pct);
    renderTabs(key);
    renderRing();
  }

  function submitToTeacher(key, score, total, percent) {
    if (typeof Sync === "undefined") return;
    const label = key === "EXAM" ? "Final Exam Writing" : U4[key].title;
    Sync.saveResult({
      uid: CTX.uid, name: CTX.name, subject: CTX.subject, level: CTX.level,
      unit: 4, unitTitle: `U4 · ${label}`,
      score, total, percent,
      status: percent >= 100 ? "done" : "doing"
    });
  }

  /* ---------- Overall ring ---------- */
  function renderRing() {
    const keys = [...LESSONS, "EXAM"];
    const sum = keys.reduce((a,k) => a + (store[k]?.percent || 0), 0);
    const avg = Math.round(sum / keys.length);
    const c = 2 * Math.PI * 52, ring = $("#ringFg");
    ring.style.strokeDasharray = c;
    ring.style.strokeDashoffset = c - c * avg / 100;
    $("#u4pct").textContent = avg + "%";
  }

  /* ---------- Router ---------- */
  function route(key) {
    renderTabs(key);
    key === "EXAM" ? renderExam() : renderLesson(key);
    window.scrollTo({ top: 0, behavior:"smooth" });
  }

  /* ---------- Heartbeat ---------- */
  if (typeof Sync !== "undefined") {
    const beat = () => Sync.heartbeat({
      uid: CTX.uid, name: CTX.name, subject: CTX.subject,
      level: CTX.level, page: "unit4"
    });
    beat(); setInterval(beat, 20000);
  }

  route("L6");
  renderRing();
})();