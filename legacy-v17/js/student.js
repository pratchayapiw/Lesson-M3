let S=null,current="overview";const PIN="2569";
function loginStudent(){const name=$("name").value.trim(),cls=$("cls").value.trim(),no=$("no").value,pin=$("pin").value;if(!name||!cls||!no||pin!==PIN)return alert("กรอกข้อมูลให้ครบ และใช้ PIN 2569");S={name,cls,no};sessionStorage.setItem("m3s",JSON.stringify(S));start()}
function start(){S=S||JSON.parse(sessionStorage.getItem("m3s")||"null");if(!S)return;$("login").classList.add("hidden");$("app").classList.remove("hidden");$("unitTitle").textContent=UNIT1.title;$("unitSubtitle").textContent=UNIT1.subtitle;renderNav();openSection(current)}
function $(id){return document.getElementById(id)}
function settingsNow(){return settings()}
function renderNav(){const st=settingsNow();let html='<div class="nav-group"><div class="nav-title">📚 UNIT 1</div>';if(!st.unitOpen){html+='<div class="lock-note">ครูยังไม่เปิด Unit นี้</div>';$("nav").innerHTML=html+'</div>';return}
const items=[["overview","ภาพรวมบทเรียน",true],["vocab","1. คำศัพท์",st.sections.vocab],["vocabPractice","↳ ฝึกและทบทวนคำศัพท์",st.sections.vocabPractice],["grammar","2. ไวยากรณ์",st.sections.grammar],["g1","↳ Present Simple",st.sections.g1],["g2","↳ Present Continuous",st.sections.g2],["g3","↳ Stative Verbs",st.sections.g3],["grammarPractice","↳ ฝึกไวยากรณ์ / เกม",st.sections.grammarPractice],["test","3. แบบทดสอบท้ายบท",st.sections.test]];for(const [id,label,on] of items)html+=`<button class="nav-btn ${on?'':'locked'} ${current===id?'active':''}" ${on?`onclick="openSection('${id}')"`:''}>${label}${on?'':' 🔒'}</button>`;$("nav").innerHTML=html+'</div>'}
function openSection(id){const st=settingsNow();if(id!=="overview"&&!st.unitOpen)return;current=id;renderNav();let h="";if(id==="overview")h=overview();if(id==="vocab")h=vocab();if(id==="vocabPractice")h=vocabPractice();if(id==="grammar")h=grammarAll();if(["g1","g2","g3"].includes(id))h=grammarOne(id);if(id==="grammarPractice")h=grammarPractice();if(id==="test")h=testIntro();$("content").innerHTML=h;updateProgress()}
function overview(){return `<div class="card"><span class="eyebrow">LEARNING PATH</span><h1>${UNIT1.title}</h1><p>เรียนรู้แบบเป็นขั้น: <b>รู้จักคำ → จำความหมาย → สะกด → ใช้คำ → เข้าใจ Grammar → ฝึก → เล่นเกม → Test</b></p></div><div class="card"><h2>🎯 เป้าหมายการเรียนรู้</h2><ul><li>บอกความหมายและสะกดคำศัพท์ได้</li><li>เลือกใช้ Present Simple / Present Continuous ได้</li><li>แยก stative verbs ที่พบบ่อยได้</li><li>ทำแบบทดสอบท้ายบทและเห็นพัฒนาการของตนเอง</li></ul></div>`}
function vocab(){return `<div class="card"><h2>1. คำศัพท์</h2><p class="muted">แบ่งเป็นหมวด เพื่อให้จำเป็นกลุ่มและนำไปใช้ได้</p>${UNIT1.vocabulary.map(g=>`<h3>${g.group}</h3><div class="vocab-grid">${g.items.map(x=>`<div class="vocab"><b>${x[0]}</b><br><span class="mini">${x[1]}</span></div>`).join("")}</div>`).join("")}</div>`}
function vocabPractice(){return `<div class="card"><h2>🎮 ฝึกและทบทวนคำศัพท์</h2><p>กิจกรรมไล่ระดับจากง่าย → ปานกลาง</p>${UNIT1.vocabActivities.map((a,i)=>`<div class="activity"><b>${i+1}. ${a.title}</b><span class="pill"> ${a.level}</span><p>${a.desc}</p><button class="ghost" onclick="alert('ต้นแบบกิจกรรม: ${a.title}\nคะแนนกิจกรรม ${a.points} คะแนน')">ลองกิจกรรม</button></div>`).join("")}</div>`}
function grammarAll(){return `<div class="card"><h2>2. ไวยากรณ์</h2><p class="muted">ครูสามารถแยกเปิด/ปิดแต่ละหัวข้อได้</p>${UNIT1.grammar.map(g=>`<div class="grammar-box"><h3>${g.title}</h3><p>${g.content[0]}</p><span class="pill">เปิดหัวข้อเพื่อเรียนเต็ม</span></div>`).join("")}</div>`}
function grammarOne(id){const g=UNIT1.grammar.find(x=>x.id===id);return `<div class="card"><span class="eyebrow">GRAMMAR LESSON</span><h2>${g.title}</h2>${g.content.map((x,i)=>`<div class="${i===1?'grammar-box':'activity'}">${x}</div>`).join("")}<div class="activity"><b>📎 เอกสารจากครู</b><p>${g.attachment?`มีไฟล์แนบ: ${g.attachment}`:"ยังไม่มีไฟล์แนบ — ครูสามารถแนบ PDF/PPTX/เอกสารภายนอกใน Dashboard"}</p></div></div>`}
function grammarPractice(){return `<div class="card"><h2>🧩 ฝึก Grammar + Games</h2>${UNIT1.grammarActivities.map((a,i)=>`<div class="activity"><b>${i+1}. ${a.title}</b><p>${a.desc}</p><button class="primary" onclick="quickGrammar(${i})">เริ่มกิจกรรม</button></div>`).join("")}</div>`}
function quickGrammar(i){const qs=[["She ___ to school every day.",["go","goes","is going"],1],["They ___ now.",["study","are studying","studied"],1],["I ___ the answer.",["am knowing","know","knowing"],1]];const q=qs[i];const ans=prompt(`${q[0]}\nA. ${q[1][0]}\nB. ${q[1][1]}\nC. ${q[1][2]}\nพิมพ์ A/B/C`);if(ans&&"ABC".indexOf(ans.toUpperCase())===q[2])alert("ถูกต้อง!");else alert("ลองทบทวน Grammar แล้วเล่นใหม่")}
let testState={questions:[],index:0,score:0,answered:false,timer:null,timeLeft:60,attemptId:""};

function testKey(){return "m3Unit1Test_"+S.name+"_"+S.cls+"_"+S.no}
function shuffle(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  return a;
}
function buildTestQuestions(){
  // สุ่มลำดับคำถาม และสุ่มตัวเลือกทุกครั้งที่เริ่มรอบใหม่
  return shuffle(UNIT1.test).map((q,idx)=>({
    id:"u1q_"+idx+"_"+Date.now(),
    question:q[0],
    answer:q[1],
    options:shuffle(q[2].map((text,i)=>({text,correct:i===q[3]})))
  }));
}
function hasCompletedTest(){return !!localStorage.getItem(testKey())}
function testIntro(){
  const done=hasCompletedTest();
  return `<div class="card"><span class="eyebrow">END-OF-UNIT ASSESSMENT</span>
  <h2>📝 แบบทดสอบท้ายบทเรียน</h2>
  <div class="lock-note"><b>กติกาการทำแบบทดสอบ</b><br>
  • สุ่มคำถามทุกครั้งที่เริ่มรอบใหม่<br>
  • สลับลำดับตัวเลือกทุกข้อ<br>
  • ข้อละ <b>60 วินาที</b><br>
  • เมื่อหมดเวลา ระบบจะข้ามไปข้อถัดไปอัตโนมัติ<br>
  • หลังส่งคำตอบแล้วไม่สามารถย้อนกลับไปแก้ข้อเดิมได้</div>
  ${done?`<div class="score">คุณทำแบบทดสอบ Unit 1 แล้ว<br><b>${localStorage.getItem(testKey())}</b></div>`:
  `<button class="primary" onclick="runTest()">เริ่มแบบทดสอบ</button>`}</div>`;
}
function runTest(){
  if(hasCompletedTest()){alert("คุณทำแบบทดสอบท้ายบทนี้แล้ว");openSection("test");return}
  testState={questions:buildTestQuestions(),index:0,score:0,answered:false,timer:null,timeLeft:60,attemptId:Date.now()};
  renderTestQuestion();
}
function renderTestQuestion(){
  clearInterval(testState.timer);
  const q=testState.questions[testState.index];
  if(!q){finishTest();return}
  testState.answered=false;
  testState.timeLeft=60;
  $("content").innerHTML=`<div class="card">
    <div class="section-head">
      <div><span class="eyebrow">UNIT 1 TEST</span><h2>ข้อ ${testState.index+1} / ${testState.questions.length}</h2></div>
      <div class="timer" id="questionTimer">01:00</div>
    </div>
    <div class="progress"><i id="questionTimeBar" style="width:100%"></i></div>
    <div class="activity"><h3>${q.question}</h3>
      <div class="choices">${q.options.map((o,i)=>`<button class="choice" onclick="selectTestAnswer(${i})">${String.fromCharCode(65+i)}. ${o.text}</button>`).join("")}</div>
    </div>
    <p class="mini">เวลาข้อนี้เหลือ 60 วินาที</p>
  </div>`;
  testState.timer=setInterval(()=>{
    testState.timeLeft--;
    updateQuestionTimer();
    if(testState.timeLeft<=0){
      clearInterval(testState.timer);
      submitTestAnswer(-1,true);
    }
  },1000);
}
function updateQuestionTimer(){
  const t=Math.max(0,testState.timeLeft);
  const m=String(Math.floor(t/60)).padStart(2,"0"),sec=String(t%60).padStart(2,"0");
  if($("questionTimer"))$("questionTimer").textContent=`${m}:${sec}`;
  if($("questionTimeBar"))$("questionTimeBar").style.width=`${(t/60)*100}%`;
}
function selectTestAnswer(i){
  if(testState.answered)return;
  submitTestAnswer(i,false);
}
function submitTestAnswer(i,timedOut){
  if(testState.answered)return;
  testState.answered=true;
  clearInterval(testState.timer);
  const q=testState.questions[testState.index];
  const buttons=[...document.querySelectorAll(".choice")];
  buttons.forEach(b=>b.disabled=true);
  if(i>=0 && q.options[i].correct){
    testState.score++;
    buttons[i].classList.add("good");
  }else if(i>=0){
    buttons[i].classList.add("bad");
    const correctIndex=q.options.findIndex(o=>o.correct);
    if(correctIndex>=0)buttons[correctIndex].classList.add("good");
  }
  setTimeout(()=>{
    testState.index++;
    renderTestQuestion();
  },timedOut?300:450);
}
function finishTest(){
  clearInterval(testState.timer);
  const total=testState.questions.length;
  const pct=Math.round(testState.score/total*100);
  const resultText=`${testState.score}/${total} (${pct}%)`;
  localStorage.setItem(testKey(),resultText);
  saveResult(testState.score);
  $("content").innerHTML=`<div class="score"><span class="eyebrow">COMPLETED</span><h2>ทำแบบทดสอบเสร็จแล้ว</h2><div style="font-size:42px;font-weight:700">${resultText}</div><p>${pct>=70?"ผ่านเกณฑ์ 70%":"ยังไม่ถึงเกณฑ์ 70% — แนะนำให้ทบทวนบทเรียนแล้วทำกิจกรรมฝึกเพิ่มเติม"}</p><button class="primary" onclick="openSection('test')">กลับหน้าผลแบบทดสอบ</button></div>`;
  updateProgress();
}
function saveResult(score){const rows=JSON.parse(localStorage.getItem("m3Unit1Results")||"[]");rows.push({name:S.name,cls:S.cls,no:S.no,score,total:10,date:new Date().toLocaleString("th-TH")});localStorage.setItem("m3Unit1Results",JSON.stringify(rows))}
function updateProgress(){let p=current==="overview"?5:current==="test"?100:Math.min(90,20+Object.keys({vocab:1,vocabPractice:1,grammar:1,g1:1,g2:1,g3:1,grammarPractice:1}).indexOf(current)*10);if(current==="test"&&localStorage.getItem("m3Unit1Test_"+S.name+"_"+S.no))p=100;$("progressPct").textContent=p+"%";$("progressBar").style.width=p+"%"}
start();