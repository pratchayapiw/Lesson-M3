/* M3 Teaching Hub — slide engine + classroom tools.
   Unit content lives in units/uN.js (window.TEACH_UNITS[n]). */
(function(){
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let ME=null;try{ME=JSON.parse(localStorage.getItem('m3:me')||'null')}catch(e){}
const STU0=(()=>{try{return !window.TEACH_ASSETS&&sessionStorage.getItem('m3:t')!=='1'&&!!ME}catch(e){return false}})();
const U=window.TEACH_UNITS||{};
const A=window.TEACH_ASSETS||'../assets/';
const PAL={1:['#e2457a','#ffe3ee'],2:['#e8763a','#ffe6d2'],3:['#e7a21d','#fff1c9'],4:['#8b5cd6','#ece0ff'],5:['#4f9b3a','#e2f4d7'],6:['#3a7fd0','#dceeff'],7:['#d9467a','#ffe0ec'],8:['#3a8fd0','#dcefff']};
for(const n in U){if(PAL[n]){U[n].color=PAL[n][0];U[n].light=PAL[n][1]}}
const IMG=n=>A+'icons/unit'+n+'.png';
const PDFN={1:'Stories',2:'Then-and-Now',3:'Goals',4:'Spend',5:'A-Better-Place',6:'Experience',7:'My-Stuff',8:'Responsibility'};
const PDF=n=>'pdf/M3-Unit'+n+'-'+PDFN[n]+'.pdf';
/* in the Claude preview copy, files are saved through the viewer's download prompt */
if(window.TEACH_ASSETS){const toast=m=>{let t=document.getElementById('dlToast');if(!t){t=document.createElement('div');t.id='dlToast';t.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#3a2330;color:#fff;padding:10px 16px;border-radius:12px;font:500 15px Kanit,sans-serif;z-index:200;max-width:90vw;text-align:center';document.body.appendChild(t)}t.textContent=m;t.style.display='block';clearTimeout(t._h);t._h=setTimeout(()=>t.style.display='none',4000)};
  document.addEventListener('click',async e=>{const a=e.target.closest('a[download]');if(!a||!a.getAttribute('href')||a.getAttribute('href')==='#')return;e.preventDefault();e.stopPropagation();
    try{const dl=window.claude&&await window.claude.use('downloads');if(!dl){toast('ดาวน์โหลดไม่ได้ในหน้านี้ ใช้เว็บ pratchayapiw.github.io/Lesson-M3 แทน');return}
      toast('กำลังเตรียมไฟล์…');const href=a.getAttribute('href');const blob=await (await fetch(href)).blob();
      await dl.save({filename:href.split('/').pop(),data:blob});toast('✅ บันทึกไฟล์แล้ว')}
    catch(er){toast(er&&er.code==='declined'?'ยกเลิกการดาวน์โหลด':'ดาวน์โหลดไม่สำเร็จ ลองใหม่อีกครั้ง')}},true)}
/* ---- Grammar: Question → Guided discovery stages ---- */
const GSTEPS=[['q','❓','Question'],['notice','👀','Notice'],['compare','⚖️','Compare'],['meaning','💡','Meaning'],['detect','🚨','Detective'],['rule','🧩','Rule'],['practice','✍️','Practice']];
function expandGD(u){
  const G=(window.TEACH_GD||{})[u.n];
  if(G){u.detect=null;for(const k of ['gram','gram2']){if(!G[k])continue;const i=u.slides.findIndex(s=>s.sec===k);if(i<0)continue;
    u.slides=u.slides.filter(s=>!(s.sec===k&&['rule','compare'].includes(s.type)));u.slides.splice(i,0,Object.assign({sec:k,type:'gd'},G[k]))}}
  const out=[];let cur=null;
  for(const s of u.slides){
    if(s.type!=='gd'){ if(cur&&s.sec===cur&&['gaps','mcq','task'].includes(s.type)){s.gstep=s.gstep||'practice';s.kick=s.kick||'Practice · ฝึกใช้'} else if(s.sec!==cur) cur=null; out.push(s); continue }
    cur=s.sec;const g=s,nm=g.name;
    out.push({sec:g.sec,type:'gq',gstep:'q',min:3,title:'Question time!',sub:nm,kick:'Step 0 · Question · ถามนำ',q:g.q.q,frame:g.q.frame,ans:g.q.ans,
      notes:{goal:'ถามคำถามจริงที่ต้องใช้โครงสร้าง <b>'+nm+'</b> ก่อนสอนกฎ ให้นักเรียนลองตอบตามความเข้าใจ',say:[g.q.q].concat(g.q.say||[]),do:['ถามคำถามบนจอ สุ่ม 3–4 คนตอบ (ยังไม่แก้ไวยากรณ์)','กด → แสดงคำตอบตัวอย่างทีละประโยค ให้สังเกตคำที่ไฮไลต์','จดคำตอบนักเรียน 1–2 ประโยคบนกระดาน ไว้ย้อนกลับมาตรวจใน Step 4'],ans:g.q.ans.join('<br>')},tools:['picker']});
    out.push({sec:g.sec,type:'rule',gstep:'notice',min:4,title:'Look & notice',sub:nm,kick:'Step 1 · Look & Notice · สังเกต',ex:g.notice.ex,qs:g.notice.qs,
      notes:{goal:'ให้นักเรียนสังเกตรูปแบบจากตัวอย่างด้วยตนเอง (ครูยังไม่บอกกฎ)',say:['Look at the sentences. What is the same? What is different?'].concat(g.notice.say||[]),do:['ให้อ่านตัวอย่างพร้อมกัน 1 รอบ','ให้คู่คุยตอบคำถาม 🔍 ทีละข้อ 1 นาที แล้วสุ่มตอบ','กด → เฉลยทีละข้อ ชมคนที่ค้นพบเอง'],ans:g.notice.qs.map(q=>(q.match(/\[([^\]]+)\]/g)||[]).join(' ')).join(' · ')},tools:['picker','timer']});
    if(g.compare)out.push({sec:g.sec,type:'compare',gstep:'compare',min:4,title:g.compare.title||'Compare',sub:nm,kick:'Step 2 · Compare · เปรียบเทียบ',cols:g.compare.cols,qs:g.compare.qs,tip:g.compare.tip,
      notes:{goal:'เปรียบเทียบรูปแบบ/ความหมายสองแบบ ให้เห็นความต่างเอง',say:['What is different between the two boxes?'].concat(g.compare.say||[]),do:['กด → ให้ตัวอย่างขึ้นทีละกล่อง','ถามคำถาม 🔍 ให้คู่หาความต่าง แล้วจึงเฉลย'],ans:(g.compare.qs||[]).map(q=>(q.match(/\[([^\]]+)\]/g)||[]).join(' ')).join(' · ')},tools:['picker','sort']});
    out.push({sec:g.sec,type:'ccq',gstep:'meaning',min:3,title:'Check the meaning',sub:nm,kick:'Step 3 · Meaning · เช็กความหมาย',ex:g.meaning.ex,items:g.meaning.ccq,
      notes:{goal:'ใช้คำถามเช็กความเข้าใจ (CCQ) ให้แน่ใจว่าเข้าใจความหมาย ไม่ใช่แค่จำรูป',say:['Read the sentence. Answer my questions: YES or NO?'],do:['ให้ทั้งห้องชู 👍 (YES) หรือ 👎 (NO) ทุกข้อ','กด → เฉลยทีละข้อ ถ้าตอบผิดเยอะให้กลับไปดู Step 1'],ans:g.meaning.ccq.map(c=>c[0].replace(/<[^>]+>/g,'')+' → '+c[1]).join('<br>')},tools:['picker']});
    out.push({sec:g.sec,type:'gdet',gstep:'detect',min:4,title:'Grammar Detective',sub:nm,kick:'Step 4 · Detective · จับผิด',items:g.detect,
      notes:{goal:'วิเคราะห์ข้อผิดพลาดที่พบบ่อย ให้นักเรียนอธิบายเหตุผลเอง',say:['What is wrong? Why? Can you fix it?'],do:['ให้กลุ่มหาจุดผิด 1 นาที (กดจับเวลา)','กด → ขีดฆ่าจุดผิด แล้วกดอีกครั้งเพื่อแสดงประโยคที่ถูกและเหตุผล','ย้อนตรวจประโยคนักเรียนที่จดไว้ตอน Step 0','ให้คะแนนกลุ่มที่แก้ถูก'],ans:g.detect.map(d=>d[1].replace(/\*\*/g,'')).join('<br>')},tools:['timer','score','detect']});
    out.push({sec:g.sec,type:'rule',gstep:'rule',min:4,title:'Build the rule',sub:nm,kick:'Step 5 · Rule · สรุปกฎ',formula:g.rule.formula,table:g.rule.table,qs:g.rule.qs,tip:g.rule.tip,ex:g.rule.ex,
      notes:{goal:'ให้นักเรียนสรุปกฎจากสิ่งที่ค้นพบ แล้วครูยืนยัน',say:['So, what is the rule? Tell me!'].concat(g.rule.say||[]),do:['ให้ตัวแทนกลุ่มบอกกฎก่อน แล้วกด → เปิดสูตร/ตารางทีละส่วน','ใช้ 🧩 สร้างสูตร ให้ออกมาวางบนจอ','ให้จดสรุปลงสมุด'],ans:(g.rule.qs||[]).map(q=>(q.match(/\[([^\]]+)\]/g)||[]).join(' ')).join(' · ')},tools:['puzzle']});
    ((window.TEACH_GD_MORE||{})[u.n]||{})[g.sec]&&TEACH_GD_MORE[u.n][g.sec].forEach((m,mi,arr)=>out.push({sec:g.sec,type:'rule',gstep:'rule',min:4,title:m.title,sub:nm,kick:'Step 5 · Rule '+(mi+2)+'/'+(arr.length+1)+' · รายละเอียด',ex:m.ex,table:m.table,qs:m.qs,tip:m.tip,formula:m.formula,
      notes:{goal:'ลงรายละเอียดกฎ: '+m.title,say:['Look at the examples. What is the rule?'],do:['ให้นักเรียนอ่านตัวอย่าง แล้วตอบคำถาม 🔍 ก่อนกด → เฉลย','ให้ยกตัวอย่างประโยคของตัวเอง 1 ประโยค','ให้จดตาราง/กฎลงสมุด'],ans:(m.qs||[]).map(q=>(q.match(/\[([^\]]+)\]/g)||[]).join(' ')).join(' · ')},tools:['picker']}));
    {const pr=((window.TEACH_GD_PRAC||{})[u.n]||{})[g.sec];if(pr)out.push({sec:g.sec,type:'gaps',gstep:'practice',min:5,title:'Practice: all the rules',sub:nm,kick:'Practice · ฝึกทุกกฎ',items:pr,
      notes:{goal:'ฝึกทุกกฎของเรื่องนี้ (รวมรายละเอียด)',say:['Complete the sentences. Think about the rules.'],do:['ทำในสมุด 3 นาที','สุ่มเลขที่ตอบ แล้วกด → เฉลยทีละข้อ','ข้อที่ผิดเยอะ ย้อนไปดูสไลด์ Rule ที่เกี่ยวข้อง'],ans:pr.map(s=>(s.match(/\[([^\]]+)\]/g)||[]).join(' ')).join(' · ')},tools:['timer','picker']})}
  }
  u.slides=out.filter(s=>!['read','listen','speak','write'].includes(s.sec)).flatMap(s=>{
    if(!['gaps','choose'].includes(s.type)||(s.items||[]).length<=6)return [s];
    const n=Math.ceil(s.items.length/5),per=Math.ceil(s.items.length/n);
    return [...Array(n)].map((_,i)=>Object.assign({},s,{title:s.title+' ('+(i+1)+'/'+n+')',items:s.items.slice(i*per,(i+1)*per)}))});
  // vocabulary bank of the unit (cards) for matching
  const vw=[];u.slides.filter(s=>s.type==='cards').forEach(s=>s.items.forEach(c=>{if(c[2]&&!vw.some(x=>x[1]===c[1]))vw.push(c)}));u.vwords=vw;
  // cover goals follow the new focus: vocabulary + grammar + practice/quiz
  const cv=u.slides.find(s=>s.type==='cover');if(cv&&G)cv.goals=['คำศัพท์: ฟัง พูดตาม จำความหมาย และใช้ในบริบท','ไวยากรณ์: <b>'+G.gram.name+'</b>'+(G.gram2?' · <b>'+G.gram2.name+'</b>':''),'แบบฝึก + แบบทดสอบย่อย (ผ่าน 60%)'];
  // vocabulary review: match meanings + words in context, at the end of the vocabulary work
  const vc=(window.TEACH_VCTX||{})[u.n];
  if(vw.length){const pick=[];const v1=u.slides.filter(s=>s.type==='cards'&&s.sec==='vocab').flatMap(s=>s.items),v2=u.slides.filter(s=>s.type==='cards'&&s.sec==='vocab2').flatMap(s=>s.items);
    [...v1.slice(0,v2.length?4:8),...v2.slice(0,4)].forEach(c=>{if(pick.length<8&&c[2])pick.push(c)});
    const rv=[{sec:pick.length&&v2.length?'vocab2':'vocab',type:'vmatch',min:4,title:'Match the words',sub:'จับคู่คำศัพท์กับความหมาย',kick:'Vocabulary review · ทบทวนคำศัพท์',items:pick,
      notes:{goal:'ทบทวนความหมายคำศัพท์ของหน่วย',say:['Match the words with the meanings.'],do:['ให้คู่จับคู่ 2 นาที (จับเวลา)','ให้นักเรียนออกมาแตะคำ แล้วแตะความหมายบนจอ','กด → เฉลยทีละคู่'],ans:pick.map(c=>c[1]+' = '+c[2]).join(' · ')},tools:['timer','picker']}];
    if(vc)rv.push({sec:rv[0].sec,type:'choose',min:4,title:'Words in context',sub:'เลือกคำที่เหมาะกับประโยค',kick:'Vocabulary review · คำศัพท์ในบริบท',items:vc,
      notes:{goal:'ใช้คำศัพท์ในบริบทประโยค',say:['Read the sentence. Which word fits?'],do:['ให้ทั้งห้องเลือกคำตอบพร้อมกัน แล้วแตะตัวเลือกบนจอ','กด → เฉลยทีละข้อ'],ans:vc.map(s=>(s.match(/\{\{.*?([^|{]+)\*.*?\}\}/)||[])[1]).join(' · ')},tools:['picker','flash']});
    const after=rv[0].sec==='vocab2'?'vocab2':'vocab';let at=-1;u.slides.forEach((s,i)=>{if(s.sec===after)at=i});u.slides.splice(at+1,0,...rv)}
}
function expandWB(u){const W=(window.TEACH_WB||{})[u.n];if(!W)return;
  const add=[];W.wb.forEach((e,i)=>add.push({sec:'wb',type:e.type,min:5,title:e.title,sub:e.sub||'แบบฝึกหัดท้ายเล่ม (Grammar practice)',bank:e.bank,items:e.items,kick:'Workbook '+(i+1)+'/'+W.wb.length+' · แบบฝึกท้ายเล่ม',
    notes:{goal:'ฝึกไวยากรณ์ของหน่วยแบบเดียวกับแบบฝึกหัดท้ายเล่ม',say:['Do exercise '+'ABCD'[i]+' in your notebook. You have three minutes.'],do:['ให้ทำในสมุดหรือใบงาน 3–4 นาที (กดจับเวลา)','สุ่มเลขที่ตอบทีละข้อ แล้วกด → เฉลย','ข้อที่ผิดเยอะ ให้ย้อนไปดูสไลด์ Rule ของเรื่องนั้น'],ans:e.items.map(t=>(t.match(/\[([^\]]+)\]|\{\{[^}]*?([^|{]+)\*[^}]*\}\}/g)||[]).map(x=>x.replace(/\[|\]/g,'').replace(/\{\{.*?([^|{]+)\*.*\}\}/,'$1')).join(', ')).join(' · ')},tools:['timer','picker']}));
  add.push({sec:'quiz',type:'quiz',min:15,title:'Unit '+u.n+' Quiz',sub:'แบบทดสอบย่อย 10 ข้อ · ผ่าน 60%',kick:'แบบทดสอบย่อย',
    notes:{goal:'ประเมินความเข้าใจท้ายหน่วย (คำศัพท์ ไวยากรณ์ และภาษาที่ใช้สื่อสาร)',say:['It’s quiz time! Ten questions. Good luck!'],do:['กด ▶ เริ่มสอบ เพื่อแสดงทีละข้อบนจอ ให้นักเรียนเขียนคำตอบ A–D ในกระดาษ','หรือกด 🖨️ พิมพ์ข้อสอบ เพื่อแจกเป็นกระดาษ (มีเฉลยหน้าสุดท้าย)','เฉลยทีละข้อพร้อมเหตุผล ให้นักเรียนตรวจของตัวเอง แล้วบันทึกคะแนน'],ans:W.quiz.map((q,i)=>(i+1)+' '+'ABCD'[q[2]]).join(' · ')},tools:['quiz','timer']});
  {add.length=0;add.push({sec:'quiz',type:'stest',min:20,title:'แบบฝึก + แบบทดสอบย่อย',sub:'Unit '+u.n+' · ทำเองแล้วกดส่งคำตอบ',kick:'แบบฝึก + แบบทดสอบย่อย'})}
  const i=u.slides.findIndex(s=>s.sec==='review');u.slides.splice(i<0?u.slides.length:i,0,...add);u.quiz=W.quiz;u.wb=W.wb;}
for(const n in U){expandGD(U[n]);expandWB(U[n])}
const SEC={
  warm:['Warm-up','อุ่นเครื่อง','#e07a2e'], vocab:['Vocabulary','คำศัพท์','#d9493f'], read:['Reading','การอ่าน','#2f6fb3'],
  gram:['Grammar 1','ไวยากรณ์ 1','#2f8a4f'], listen:['Listening','การฟัง','#7b4bb5'], vocab2:['Vocabulary 2','คำศัพท์ 2','#c2410c'],
  gram2:['Grammar 2','ไวยากรณ์ 2','#13867a'], speak:['Speaking','การพูด','#c94f7c'], write:['Writing','การเขียน','#a0662b'], wb:['Practice','แบบฝึก','#8a5a2b'], quiz:['Quiz','แบบทดสอบย่อย','#b8274f'], review:['Review','ทบทวน','#4b5563']
};
const TOOLS={stest:'📝 แบบฝึก + แบบทดสอบย่อย',quiz:'📝 สอบย่อย',timer:'⏲️ จับเวลา',picker:'🎯 สุ่มเลขที่',score:'🏆 คะแนนกลุ่ม',flash:'🃏 แฟลชการ์ด',sort:'🔀 เกมแยกประเภท',detect:'🚨 จับผิดประโยค',puzzle:'🧩 สร้างสูตร',scramble:'🔤 เรียงประโยค',media:'📦 สื่อการสอน'};
const LS={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---- text markup: **hi**  [gap answer]  {tag} ---- */
function md(s){
  return String(s)
    .replace(/\*\*(.+?)\*\*/g,'<mark class="k">$1</mark>')
    .replace(/\[([^\]]+)\]/g,(m,a)=>`<span class="gp"><span class="gb">?</span><span class="ga">${a}</span></span>`)
    .replace(/\{([^}]+)\}/g,'<span class="tag">$1</span>');
}
const plain=s=>String(s).replace(/<[^>]+>/g,'').replace(/\*\*|\{|\}/g,'').replace(/\[([^\]]+)\]/g,'$1').replace(/_{2,}/g,'blank');

/* ---- speech ---- */
const BADV=/Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Fred|Junior|Ralph|Kathy|Grandma|Grandpa|Rocko|Shelley|\bFlo\b|Eddy|Reed|Sandy|Deranged|Hysterical|Pipe Organ/i;
function rankVoices(vs){const sc=v=>(BADV.test(v.name)?-100:0)+(/Google US English|Samantha|Aria|Jenny|Zira|Natural|Enhanced|Premium|Ava|Allison|Susan/i.test(v.name)?6:0)+(/Microsoft.*Online|Google/i.test(v.name)?3:0)+(/en[-_]US/i.test(v.lang)?3:/en[-_]GB/i.test(v.lang)?2:0)+(v.localService?1:0);
  return vs.filter(v=>/^en/i.test(v.lang)&&!BADV.test(v.name)).sort((a,b)=>sc(b)-sc(a))}
function speakClean(t){return String(t).replace(/<[^>]+>/g,'').replace(/\*\*|\{|\}/g,'').replace(/\[([^\]|]+)[^\]]*\]/g,'$1').replace(/_{2,}/g,' blank ').replace(/\s\/\s/g,' or ').replace(/\s*\([^)]*\)/g,'').replace(/[’‘]/g,"'").replace(/ '(ve|s|ll|re|m|d|t)\b/g,"'$1").replace(/\s+/g,' ').trim()}
let VOICES=[];
function loadVoices(){try{VOICES=rankVoices(speechSynthesis.getVoices());drawVoicePick()}catch(e){}}
try{loadVoices();speechSynthesis.addEventListener?speechSynthesis.addEventListener('voiceschanged',loadVoices):(speechSynthesis.onvoiceschanged=loadVoices)}catch(e){}
function pickVoice(k){const pref=LS.get('teach:voice','');const main=VOICES.find(v=>v.name===pref)||VOICES[0];
  if(!k)return main;const others=VOICES.filter(v=>v!==main).slice(0,3);return others.length?others[(k-1)%others.length]:main}
function drawVoicePick(){const s=document.getElementById('voicePick');if(!s)return;const cur=(pickVoice(0)||{}).name;
  s.innerHTML=VOICES.length?VOICES.slice(0,12).map(v=>`<option ${v.name===cur?'selected':''}>${esc(v.name)}</option>`).join(''):'<option>เสียงเริ่มต้นของเครื่อง</option>'}
function say(text,o={}){
  try{
    if(!('speechSynthesis' in window)){o.end&&setTimeout(o.end,300);return}
    const u=new SpeechSynthesisUtterance(speakClean(text));
    u.lang='en-US';u.rate=o.rate||LS.get('teach:rate',0.85);u.pitch=o.pitch||1;
    const v=pickVoice(o.v||0);if(v){u.voice=v;u.lang=v.lang}
    if(o.end){u.onend=o.end;u.onerror=o.end}
    const go=()=>{try{speechSynthesis.resume()}catch(e){}speechSynthesis.speak(u)};
    if(!o.queue&&(speechSynthesis.speaking||speechSynthesis.pending)){speechSynthesis.cancel();setTimeout(go,80)}else go();
    return u;
  }catch(e){o.end&&setTimeout(o.end,600)}
}
window.TSAY=say;

/* ---- state ---- */
let unit=null, idx=0, steps=[], si=0, notesOn=true;
/* who is using it: teacher (code 2536 on the home page), student (signed in), or the Claude preview copy */
let ROLE='t';try{if(!window.TEACH_ASSETS&&sessionStorage.getItem('m3:t')!=='1')ROLE=localStorage.getItem('m3:me')?'s':'none'}catch(e){}
if(ROLE==='none')location.replace('../index.html#login');
const STU=ROLE==='s';if(STU){notesOn=false;document.documentElement.classList.add('stu')}
const app=$('#app'), pickpage=$('#pickpage');

/* ================= UNIT PICKER ================= */
function drawProgress(){const el=$('#pkProg');if(!el)return;el.classList.remove('hidden');
  const rows=Object.keys(U).sort((a,b)=>a-b).map(n=>{const r=LS.get('teach:res:u'+n,null)||{},q=r.quiz,p=r.practice;
    return `<tr><td><a href="#u${n}">Unit ${n}</a> ${esc(U[n].title)}</td><td>${p?p.s+'/'+p.m:'–'}</td><td>${q?q.first.s+'/'+q.first.m:'–'}</td><td><b>${q?q.best.s+'/'+q.best.m:'–'}</b></td><td>${q?q.attempts:'–'}</td><td>${q?(q.passed?'<span class="ok">ผ่าน ✅</span>':'<span class="no">ยังไม่ผ่าน</span>'):'<a href="#u'+n+'/quiz">ไปทำ →</a>'}</td></tr>`}).join('');
  const pass=Object.keys(U).filter(n=>((LS.get('teach:res:u'+n,null)||{}).quiz||{}).passed).length;
  el.innerHTML=`<h2>📊 My Progress · สรุปคะแนนของฉัน</h2><p class="muted">${esc(ME?ME.name+' · ชั้น '+ME.cls+' · เลขที่ '+ME.no:'')} · ผ่านแล้ว ${pass}/8 หน่วย · คะแนนรวม = แบบทดสอบ 80% + แบบฝึก 20% · ผ่าน 60</p>
   <div class="rs-wrap"><table class="rs"><tr><th>หน่วย</th><th>แบบฝึก</th><th>คะแนนรวมครั้งแรก</th><th>สูงสุด</th><th>ครั้ง</th><th>ผล</th></tr>${rows}</table></div>`}
function showPicker(){
  app.classList.add('hidden');pickpage.classList.remove('hidden');
  document.title=STU?'บทเรียน ม.3 · Get Involved! M3':'Teaching Hub · Get Involved! M3';
  if(STU){const b=$('.pk-banner h1');if(b)b.innerHTML='บทเรียน ม.3 <span>Get Involved! M3</span>';const tg=$('.pk-banner .tagline');if(tg)tg.innerHTML='<b>เลือกหน่วยการเรียนรู้</b><small>เรียนจากสไลด์ ฟังเสียง ทำแบบฝึกท้ายเล่ม และสอบย่อยท้ายหน่วย</small>';
    drawProgress()}
  try{const g=$('#pkGuide');if(g&&STU&&!localStorage.getItem('m3:guideSeen')){g.classList.add('new');g.firstChild.textContent='👋 ครั้งแรก? อ่านก่อนเริ่ม: '}}catch(e){}
  const g=$('#pkGrid');
  g.innerHTML=Object.keys(U).sort((a,b)=>a-b).map(n=>{const u=U[n];return `<div class="pk-item">
   <button class="pk-card" data-u="${n}" style="--uc:${u.color};--ubg:${u.light}">
     <div class="pk-art"><span class="pk-term">เทอม ${u.term}</span><img src="${IMG(n)}" alt=""><span class="pk-pill">Unit ${n}</span></div>
     <div class="pk-body"><h3>${u.title}</h3><div class="th">${u.th}</div><div class="g">${u.gram}</div><div class="n">📽️ ${u.slides.length} สไลด์ · 🧰 เครื่องมือ ${3+['flash','sort','detect','puzzle','scramble','media'].filter(k=>u[k]).length} ชุด</div></div>
   </button><a class="pk-dl" href="${PDF(n)}" download>📥 ดาวน์โหลดสไลด์ Unit ${n} (PDF)</a></div>`}).join('');
  g.onclick=e=>{const b=e.target.closest('.pk-card');if(b)location.hash='u'+b.dataset.u};
}

/* ================= OPEN UNIT ================= */
function openUnit(n,s){
  unit=U[n];if(!unit){showPicker();return}
  pickpage.classList.add('hidden');app.classList.remove('hidden');
  document.title=`Unit ${n} ${unit.title} · Teaching Hub`;
  const r=document.documentElement.style;
  r.setProperty('--u',unit.color);r.setProperty('--u2',unit.light);
  $('#brandT').innerHTML=`${unit.art[0]} Unit ${n} · ${unit.title} <small>${unit.th}</small>`;{const d=$('#dlBtn');if(d){d.href=PDF(n);d.setAttribute('download','')}}
  // phases
  const secs=[];unit.slides.forEach((sl,i)=>{if(!secs.find(x=>x.k===sl.sec))secs.push({k:sl.sec,i})});
  unit._secs=secs;
  $('#phases').innerHTML=secs.map(x=>{const d=SEC[x.k];return `<button class="ph" data-k="${x.k}" data-i="${x.i}" style="background:${d[2]}" title="${d[1]}"><b>${d[0]}</b><span>${d[1]}</span></button>`}).join('');
  $('#phases').onclick=e=>{const b=e.target.closest('.ph');if(b)go(+b.dataset.i)};
  $('#thumbs').innerHTML=unit.slides.map((sl,i)=>`<button class="tb" data-i="${i}"><b>${i+1}</b><span>${esc(plain(sl.title))}</span><i style="background:${SEC[sl.sec][2]}"></i></button>`).join('');
  $('#thumbs').onclick=e=>{const b=e.target.closest('.tb');if(b)go(+b.dataset.i)};
  buildTools();
  $('#main').classList.toggle('nonotes',!notesOn);$('#notesBtn').classList.toggle('on',notesOn);
  go(Math.min(s||0,unit.slides.length-1),true);
}

/* ================= SLIDE RENDER ================= */
const SAKURA=`<svg class="sak s1" viewBox="0 0 200 200" aria-hidden="true">${[[40,40,26],[95,22,18],[22,105,16],[120,70,12],[70,95,10]].map(([x,y,r])=>`<g transform="translate(${x} ${y})">${[0,72,144,216,288].map(a=>`<ellipse rx="${r*.55}" ry="${r}" transform="rotate(${a}) translate(0 ${-r*.8})" fill="#f8b9cb"/>`).join('')}<circle r="${r*.3}" fill="#e2457a"/></g>`).join('')}</svg>`;
function fxHTML(){
  const em=unit.fx||unit.art;let h='';
  for(let i=0;i<9;i++){h+=`<span style="left:${4+i*11}%;top:${20+((i*37)%70)}%;--d:${9+i%4*2}s;--dl:${i*1.3}s;--mx:${(i%2?1:-1)*(20+i*6)}px">${em[i%em.length]}</span>`}
  return `<div class="fx">${h}</div>`;
}
function head(sl,kick){
  const d=SEC[sl.sec];
  const gs=sl.gstep?`<div class="gsteps an">${GSTEPS.filter(x=>x[0]!=='compare'||unit.slides.some(s=>s.sec===sl.sec&&s.gstep==='compare')).map(x=>`<span class="${x[0]===sl.gstep?'on':''}">${x[1]} ${x[2]}</span>`).join('')}</div>`:'';
  return `${gs}<div class="kick an" style="--sec:${d[2]}"><span class="chip">${d[0]}</span>${sl.kick||kick||d[1]}</div>
    <div class="stitle an" style="--i:1">${md(sl.title)}</div>${sl.sub?`<div class="ssub an" style="--i:2">${md(sl.sub)}</div>`:''}`;
}
const R={
 cover(sl){return `<div class="sl cover">
   <div class="ct"><span class="unitno an">UNIT ${unit.n}</span><h1 class="an" style="--i:1">${unit.title}</h1><div class="thn an" style="--i:2">${unit.th}</div>
   <div class="gl">${(sl.goals||[]).map((g,i)=>`<div class="an" style="--i:${3+i}"><b>${['🎯','🗣️','✍️','📖','🎧'][i%5]}</b>${md(g)}</div>`).join('')}</div></div>
   <div class="art an" style="--i:2"><img class="big" src="${IMG(unit.n)}" alt="">${unit.art.slice(1,4).map((e,i)=>`<span class="orb" style="${['left:-10px;top:40px','right:-20px;top:120px','left:60px;bottom:-10px'][i]};animation-delay:${i*.6}s">${e}</span>`).join('')}</div></div>`},
 warm(sl){return `<div class="sl">${head(sl)}<div class="body">
   <div class="qbig an" style="--i:2">${md(sl.q)}</div>
   <div class="pics">${(sl.pics||[]).map(p=>`<div class="pic st"><div class="e">${p[0]}</div><div class="l">${md(p[1])}</div></div>`).join('')}</div>
   ${sl.prompt?`<div class="prompt st">💬 ${md(sl.prompt)}</div>`:''}</div></div>`},
 cards(sl){const n=sl.items.length,cols=sl.cols||(n<=4?n:n<=8?4:6);
   return `<div class="sl">${head(sl)}<div class="body"><div class="cards ${cols>=6?'c6':''} ${sl.hideWord?'hidew':''}" style="--cols:${cols}">
   ${sl.items.map((c,i)=>`<div class="card an fc" style="--i:${2+i*0.6}" data-w="${esc(c[1])}"><div class="e">${c[0]}</div><div class="w">${c[1]}</div><div class="t">${c[2]||''}</div></div>`).join('')}
   </div></div></div>`},
 gaps(sl){return `<div class="sl">${head(sl)}<div class="body">
   ${sl.bank?`<div class="bank an" style="--i:2">${sl.bank.map(b=>`<span>${b}</span>`).join('')}</div>`:''}
   <div class="glist">${sl.items.map((t,i)=>`<div class="gitem an" style="--i:${2+i}"><span class="no">${i+1}</span><span>${md(t)}</span><button class="spk" data-say="${esc(plain(t))}">🔊</button></div>`).join('')}</div></div></div>`},
 mcq(sl){return `<div class="sl">${head(sl)}<div class="body">
   <div class="mq an" style="--i:2">${md(sl.q)}</div>
   <div class="opts">${sl.opts.map((o,i)=>`<button class="opt an" style="--i:${3+i}" data-i="${i}"><i>${'ABCD'[i]}</i><span>${md(o)}</span></button>`).join('')}</div>
   <div class="why st" data-mark="${sl.a}">✅ <b>${'ABCD'[sl.a]}</b> — ${md(sl.why||'')}</div></div></div>`},
 rule(sl){
   const t=sl.table?`<table class="rtable st"><tr>${sl.table.head.map(h=>`<th>${h}</th>`).join('')}</tr>${sl.table.rows.map(r=>`<tr>${r.map(c=>`<td>${md(c)}</td>`).join('')}</tr>`).join('')}</table>`:'';
   const f=sl.formula?`<div class="formula st">${sl.formula.map(p=>p.startsWith('+')||p==='?'||p===','?`<span class="p">${p}</span>`:`<span class="${/^c\d:/.test(p)?p.slice(0,2):''}">${p.replace(/^c\d:/,'')}</span>`).join('')}</div>`:'';
   return `<div class="sl">${head(sl,'Discovery · ค้นพบกฎด้วยตนเอง')}<div class="body"><div class="disc ${sl.table&&!(sl.ex||[]).length?'wide':''}">
   <div class="exs ${sl.table&&(sl.ex||[]).length>2?'g2':''}">${(sl.ex||[]).map((e,i)=>`<div class="ex an" style="--i:${2+i}">${md(e)}</div>`).join('')}${f}${t}</div>
   <div class="qs">${(sl.qs||[]).map(q=>`<div class="q st"><b>🔍</b> ${md(q)}</div>`).join('')}${sl.tip?`<div class="tip st">💡 ${md(sl.tip)}</div>`:''}</div>
   </div></div></div>`},
 compare(sl){return `<div class="sl">${head(sl)}<div class="body"><div class="cmp" style="--n:${sl.cols.length}">
   ${sl.cols.map((c,ci)=>`<div class="col an" style="--i:${2+ci};--cc:${c.c||'var(--u)'}"><h3>${c.h}${c.s?`<small>${c.s}</small>`:''}</h3>${c.items.map(it=>`<div class="it st">${md(it)}</div>`).join('')}</div>`).join('')}
   </div>${(sl.qs||[]).length?`<div class="cqs">${sl.qs.map(q=>`<div class="q st"><b>🔍</b> ${md(q)}</div>`).join('')}</div>`:''}${sl.tip?`<div class="tip st">💡 ${md(sl.tip)}</div>`:''}</div></div>`},
 gq(sl){return `<div class="sl">${head(sl)}<div class="body">
   <div class="qbig an" style="--i:2">❓ ${md(sl.q)}</div>
   ${sl.frame?`<div class="tframe an" style="--i:3">🗣️ ${md(sl.frame)}</div>`:''}
   <div class="gqa">${sl.ans.map((a,i)=>`<div class="gqb st ${i%2?'r':''}"><span class="av">${['🧑','👧','👦','👩'][i%4]}</span><span class="bb">${md(a)}</span></div>`).join('')}</div></div></div>`},
 ccq(sl){return `<div class="sl">${head(sl)}<div class="body">
   <div class="ccx an" style="--i:2">${(sl.ex||[]).map(e=>`<div>“${md(e)}”</div>`).join('')}</div>
   <div class="ccl">${sl.items.map((c,i)=>`<div class="cc an" style="--i:${3+i}"><span class="n">${i+1}</span><span class="t">${md(c[0])}</span><span class="yn st ${/^yes/i.test(c[1])?'y':/^no/i.test(c[1])?'n':''}">${/^yes/i.test(c[1])?'👍 ':/^no/i.test(c[1])?'👎 ':''}${md(c[1])}</span></div>`).join('')}</div></div></div>`},
 gdet(sl){return `<div class="sl">${head(sl)}<div class="body"><div class="gdl">
   ${sl.items.map((d,i)=>`<div class="gd an" style="--i:${2+i}"><span class="n">${i+1}</span><div class="w"><div class="bad">❌ ${d[0].replace(/<m>(.*?)<\/m>/g,'<mark class="mk">$1</mark>')}</div><div class="fix st">✅ ${md(d[1])} <small>${d[2]}</small></div></div></div>`).join('')}
   </div></div></div>`},
 vmatch(sl){const L='ABCDEFGH';const sh=sl._sh||(sl._sh=sl.items.map((_,i)=>i).sort(()=>Math.random()-.5));
   return `<div class="sl">${head(sl)}<div class="body"><div class="vmx"><div class="vml">${sl.items.map((c,i)=>`<button class="vw an" style="--i:${2+i*.4}" data-vi="${i}"><span>${i+1}</span>${c[0]} ${c[1]}</button>`).join('')}</div>
   <div class="vmr">${sh.map((j,k)=>`<button class="vt an" style="--i:${2+k*.4}" data-vj="${j}"><span class="vk mk" data-n="${j+1}">${L[k]}</span>${sl.items[j][2]}</button>`).join('')}</div></div></div></div>`},
 choose(sl){const ch=t=>md(t.replace(/\{\{(.*?)\}\}/g,(m,a)=>`<span class="chz">${a.split('|').map(o=>`<button class="o" data-ok="${o.endsWith('*')?1:0}">${o.replace(/\*$/,'')}</button>`).join('<i>/</i>')}</span>`));
   return `<div class="sl">${head(sl)}<div class="body"><div class="glist">${sl.items.map((t,i)=>`<div class="gitem an" style="--i:${2+i}"><span class="no">${i+1}</span><span>${ch(t)}</span><button class="spk" data-say="${esc(t.replace(/\{\{.*?([^|{]+)\*.*?\}\}/g,'$1'))}">🔊</button></div>`).join('')}</div></div></div>`},
 stest(sl){const nWB=(unit.wb||[]).reduce((s,e)=>s+e.items.reduce((a,t)=>a+(t.match(/\[[^\]]+\]|\{\{/g)||[]).length,0),0),last=LS.get('teach:res:u'+unit.n,null);
   return `<div class="sl">${head(sl)}<div class="body"><div class="qzcta"><div class="qzart an" style="--i:2"><span>📝</span></div>
   <div class="qzinfo an" style="--i:3"><b>แบบฝึก + แบบทดสอบย่อย</b><span>📒 แบบฝึกคำศัพท์และไวยากรณ์<br>📝 แบบทดสอบย่อย 10 ข้อ (สุ่มจาก ${(unit.quiz||[]).length} ข้อ ทุกครั้งไม่ซ้ำชุด)<br>⚖️ คะแนน = แบบทดสอบ 80% + แบบฝึก 20% · ผ่าน 60</span>${last&&last.quiz?`<span>${last.quiz.passed?'✅ ผ่านแล้ว':'⏳ ยังไม่ผ่าน'} · สูงสุด ${last.quiz.best.s}/${last.quiz.best.m} · ทำ ${last.quiz.attempts} ครั้ง</span>`:''}
   <div class="qzbtns"><button data-tool="stest" class="go">▶ เริ่มทำ</button></div></div></div></div></div>`},
 quiz(sl){const q=unit.quiz||[];return `<div class="sl">${head(sl)}<div class="body"><div class="qzcta">
   <div class="qzart an" style="--i:2"><span>📝</span></div>
   <div class="qzinfo an" style="--i:3"><b>10 ข้อ · สุ่มจากคลัง ${q.length} ข้อ</b><span>คำศัพท์ · ไวยากรณ์ · สลับข้อและตัวเลือกทุกครั้ง<br>คะแนนรวม = แบบทดสอบ 80% + แบบฝึก 20% · ผ่าน 60</span>
   <div class="qzbtns"><button data-tool="quiz" class="go">▶ เริ่มสอบบนจอ</button><button data-print="1">🖨️ พิมพ์ข้อสอบ</button></div></div></div></div></div>`},
 read(sl){return `<div class="sl">${head(sl)}<div class="body"><div class="rd">
   <div class="rtext an" style="--i:2"><div class="rh">${sl.h||''} <button class="spk" data-say="${esc(plain(sl.text.join(' ')))}">🔊</button></div>${sl.text.map(p=>`<p>${md(p)}</p>`).join('')}</div>
   <div class="rqs">${sl.qs.map((q,i)=>`<div class="rq st"><b>${i+1}.</b> ${md(q[0])}<span class="a">→ ${md(q[1])}</span></div>`).join('')}</div>
   </div></div></div>`},
 talk(sl){const sp=[...new Set(sl.lines.map(l=>l[0]))];
   return `<div class="sl">${head(sl)}<div class="body"><button class="playall" data-play="1">▶ ฟังบทสนทนา</button><div class="dlg ${sl.lines.length+(sl.phrases?1:0)>5?'many':''}">
   ${sl.lines.map(l=>{const k=sp.indexOf(l[0]);return `<div class="ln st ${k%2?'r':''}" data-v="${k}"><div class="av">${(sl.av||[])[k]||['🧑','👩'][k%2]}</div><div class="bb"><b>${l[0]}</b>${md(l[1])}</div><button class="spk" data-say="${esc(plain(l[1]))}" data-v="${k}">🔊</button></div>`}).join('')}
   </div>${sl.phrases?`<div class="phr an" style="--i:3">${sl.phrases.map(p=>`<span>${md(p)}</span>`).join('')}</div>`:''}</div></div>`},
 task(sl){return `<div class="sl">${head(sl)}<div class="body"><div class="task" style="--n:${sl.steps.length}">
   ${sl.steps.map(s=>`<div class="tk st"><div class="e">${s[0]}</div><div class="h">${s[1]}</div><div class="d">${md(s[2])}</div>${s[3]?`<button data-timer="${s[3]}">⏲️ ${s[3]>=60?Math.round(s[3]/60)+' นาที':s[3]+' วิ'}</button>`:''}</div>`).join('')}
   </div>${sl.frame?`<div class="tframe st">✏️ ${md(sl.frame)}</div>`:''}</div></div>`},
 write(sl){return `<div class="sl">${head(sl)}<div class="body"><div class="wr">
   <div class="wmodel an" style="--i:2">${sl.model.map(p=>`<p>${md(p)}</p>`).join('')}</div>
   <div class="wside">${sl.tips.map(t=>`<div class="wtip st">${md(t)}</div>`).join('')}</div></div></div></div>`},
 exit(sl){const cc=['#d9493f','#e07a2e','#2f8a4f'];
   return `<div class="sl">${head(sl)}<div class="body"><div class="exit">${sl.items.map((t,i)=>`<div class="ex3 st" style="--cc:${cc[i%3]}"><div class="n">${t[0]}</div><div class="h">${t[1]}</div><div class="d">${md(t[2])}</div></div>`).join('')}</div></div></div>`}
};

function render(){
  const sl=unit.slides[idx];
  const el=$('#slide');
  el.innerHTML=`<div class="sbg"><div class="dots"></div><div class="blob b1"></div><div class="blob b2"></div>${SAKURA}<img class="wm" src="${IMG(unit.n)}" alt=""></div>${fxHTML()}`+(R[sl.type]||R.gaps)(sl);
  steps=[...el.querySelectorAll('.st,.gp,.fc,.mk,.chz')].filter(x=>!(sl.type==='cards'&&sl.noflip&&x.classList.contains('fc')));
  si=0;updCounter();
  // phases + thumbs
  $$('.ph').forEach(b=>b.classList.toggle('on',b.dataset.k===sl.sec));
  $$('.tb').forEach(b=>b.classList.toggle('on',+b.dataset.i===idx));
  const th=$(`.tb[data-i="${idx}"]`),tw=$('#thumbs');if(th&&tw){tw.scrollTo({left:th.offsetLeft-tw.clientWidth/2+th.offsetWidth/2,behavior:'smooth'})}
  renderNotes(sl);renderQuick(sl);
  try{history.replaceState(null,'',`#u${unit.n}/${idx+1}`)}catch(e){}
}
function updCounter(){
  $('#counter').innerHTML=`${idx+1} / ${unit.slides.length}`+(steps.length?`<span class="stp">· เฉลย ${si}/${steps.length}</span>`:'');
  const q=$('#qReveal');if(q)q.classList.toggle('hidden',si>=steps.length);
}
function revealEl(x){
  if(x.classList.contains('fc')){x.classList.add('fl');say(x.dataset.w);return}
  x.classList.add('on');
  if(x.classList.contains('vk')){x.textContent=x.dataset.n;x.closest('.vt').classList.add('ok');const l=$(`#slide .vw[data-vi="${+x.dataset.n-1}"]`);l&&l.classList.add('ok')}
  if(x.classList.contains('chz'))x.querySelectorAll('.o').forEach(o=>o.classList.add(o.dataset.ok==='1'?'ok':'no'));
  if(x.classList.contains('gp')){const sp=document.createElement('span');sp.className='spark';sp.textContent='✨';x.appendChild(sp);setTimeout(()=>sp.remove(),1100)}
  if(x.dataset.mark!=null){const o=$$('#slide .opt')[+x.dataset.mark];o&&o.classList.add('ok');confetti(40)}
  if(x.classList.contains('st'))x.classList.add('hl');
}
function step(){ if(si<steps.length){revealEl(steps[si]);si++;updCounter();return true} return false }
function next(){ if(!step()) go(idx+1) }
function revealAll(){ while(si<steps.length){revealEl(steps[si]);si++} updCounter() }
function go(i,force){
  if(!unit)return;
  if(i<0||i>=unit.slides.length){if(!force)return;i=0}
  idx=i;try{speechSynthesis.cancel()}catch(e){}
  const fr=$('#slide');fr.style.animation='none';fr.offsetWidth;fr.style.animation='';
  render();fit();
}

document.addEventListener('change',e=>{if(e.target.id==='voicePick'){LS.set('teach:voice',e.target.value);say('Hello! This is my voice.')}if(e.target.id==='ratePick'){LS.set('teach:rate',+e.target.value)}});
/* notes */
function renderNotes(sl){
  const n=sl.notes||{};const d=SEC[sl.sec];
  $('#notes').innerHTML=`<span class="ntag" style="background:${d[2]}">${d[0]} · ${d[1]}</span>
   <div class="ntitle">${idx+1}. ${md(sl.title)}</div>
   <div class="nmeta">⏱ ประมาณ ${sl.min||3} นาที${steps.length?` · มีขั้นเฉลย ${steps.length} ขั้น`:''}</div>
   ${n.goal?`<div class="nsec">🎯 เป้าหมาย</div><div>${n.goal}</div>`:''}
   ${n.say?`<div class="nsec">🗣️ ครูพูด (Teacher talk)</div>${n.say.map(s=>`<div class="say"><span>${s}</span><button data-say="${esc(plain(s))}">🔊</button></div>`).join('')}`:''}
   ${n.do?`<div class="nsec">👣 ขั้นตอน</div><ul>${n.do.map(s=>`<li>${s}</li>`).join('')}</ul>`:''}
   ${n.ans?`<div class="nsec">🔑 เฉลย (แตะเพื่อดู)</div><div class="ans" id="ansBox">${n.ans}</div><p class="anshint">ซ่อนไว้ไม่ให้นักเรียนเห็นบนจอ</p>`:''}
   ${(sl.tools||[]).filter(t=>availTools().includes(t)).length?`<div class="nsec">🧰 เครื่องมือของสไลด์นี้</div>${sl.tools.filter(t=>availTools().includes(t)).map(t=>`<button class="toolbtn" data-tool="${t}">${TOOLS[t]}</button>`).join('')}`:''}
   <details class="keys"><summary>⚙️ เสียงอ่าน & ปุ่มลัด</summary>
   <label class="vrow">🔊 เสียง <select id="voicePick"></select></label>
   <label class="vrow">🐢 ความเร็ว <input type="range" id="ratePick" min="0.6" max="1.1" step="0.05" value="${LS.get('teach:rate',0.85)}"><button class="spk" data-say="Hello! Listen and repeat: do a bungee jump.">▶</button></label>
   <kbd>→</kbd>/<kbd>Space</kbd> เฉลยทีละขั้น แล้วไปสไลด์ถัดไป · <kbd>←</kbd> ย้อน · <kbd>A</kbd> เฉลยทั้งหมด · <kbd>H</kbd> ซ่อนเฉลย · <kbd>T</kbd> จับเวลา · <kbd>R</kbd> สุ่มเลขที่ · <kbd>F</kbd> เต็มจอ · <kbd>N</kbd> บทสอน</details>`;
  drawVoicePick();
}
function renderQuick(sl){
  $('#quick').innerHTML=(steps.length?`<button class="rv" id="qReveal">✨ เฉลย (→)</button>`:'')+(notesOn&&!document.fullscreenElement?'':(sl.tools||[]).filter(t=>availTools().includes(t)).slice(0,3).map(t=>`<button data-tool="${t}">${TOOLS[t]}</button>`).join(''));
  updCounter();
}

/* fit 1600x900 into stage */
function fit(){
  const st=$('#stage');if(!st||app.classList.contains('hidden'))return;
  const pd=2*(parseFloat(getComputedStyle(st).paddingLeft)||12);const W=st.clientWidth-pd,H=st.clientHeight-pd;const k=Math.min(W/1600,H/900);
  const fr=$('#frame');fr.style.width=1600*k+'px';fr.style.height=900*k+'px';
  $('#slide').style.transform=`scale(${k})`;
}
addEventListener('resize',fit);addEventListener('orientationchange',()=>setTimeout(fit,300));

/* ================= EVENTS ================= */
document.addEventListener('click',e=>{
  const t=e.target;
  const sp=t.closest('[data-say]');if(sp){e.stopPropagation();say(sp.dataset.say,{v:+(sp.dataset.v||0)});return}
  const tl=t.closest('[data-tool]');if(tl){openTool(tl.dataset.tool);return}
  const tm=t.closest('[data-timer]');if(tm){e.stopPropagation();openTool('timer');setTimer(+tm.dataset.timer);startTimer();return}
  if(t.closest('#qReveal')){step();return}
  if(t.closest('[data-play]')){playDialogue();return}
  if(t.id==='ansBox'||t.closest('#ansBox')){$('#ansBox').classList.toggle('show');return}
  const op=t.closest('#slide .opt');if(op){
    const sl=unit.slides[idx];const ok=+op.dataset.i===sl.a;op.classList.remove('no');op.offsetWidth;
    op.classList.add(ok?'ok':'no');if(ok){confetti(60);const w=$('#slide .why');if(w&&!w.classList.contains('on')){const k=steps.indexOf(w);if(k>=si){while(si<=k){revealEl(steps[si]);si++}updCounter()}}}
    return}
  const cd=t.closest('#slide .card');if(cd){cd.classList.toggle('fl');say(cd.dataset.w);cd.classList.add('say');setTimeout(()=>cd.classList.remove('say'),900);const k=steps.indexOf(cd);if(k===si){si++;updCounter()}return}
  const co=t.closest('#slide .chz .o');if(co){e.stopPropagation();const z=co.parentNode;co.classList.add(co.dataset.ok==='1'?'ok':'no');if(co.dataset.ok==='1'){z.classList.add('on');z.querySelectorAll('.o').forEach(o=>o.classList.add(o.dataset.ok==='1'?'ok':'no'));confetti(25);const k=steps.indexOf(z);if(k===si){si++;updCounter()}}return}
  const vw=t.closest('#slide .vw');if(vw){$$('#slide .vw').forEach(b=>b.classList.toggle('sel',b===vw));say(unit.slides[idx].items[+vw.dataset.vi][1]);return}
  const vt=t.closest('#slide .vt');if(vt){const s=$('#slide .vw.sel');if(!s)return;const ok=s.dataset.vi===vt.dataset.vj;
    if(ok){const k=vt.querySelector('.vk');if(!k.classList.contains('on')){revealEl(k);}s.classList.remove('sel');confetti(20)}else{vt.classList.remove('no');vt.offsetWidth;vt.classList.add('no')}return}
  if(t.closest('[data-print]')){printQuiz();return}
  const gp=t.closest('#slide .gp');if(gp){if(!gp.classList.contains('on')){revealEl(gp);const k=steps.indexOf(gp);if(k===si){si++;updCounter()}}return}
  const ln=t.closest('#slide .ln.on');if(ln){const s=ln.querySelector('.spk');s&&say(s.dataset.say,{v:+ln.dataset.v});return}
  if(t.closest('#slide')){next();return}
});
$('#prev').onclick=()=>go(idx-1);
/* touch: swipe left/right on the slide */
let tx=null,ty=null;
$('#stage').addEventListener('touchstart',e=>{const t=e.touches[0];tx=t.clientX;ty=t.clientY},{passive:true});
$('#stage').addEventListener('touchend',e=>{if(tx==null)return;const t=e.changedTouches[0],dx=t.clientX-tx,dy=t.clientY-ty;tx=null;
  if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5){e.preventDefault();dx<0?go(idx+1):go(idx-1)}},{passive:false});
/* small screens start without the notes panel in landscape */
if(matchMedia('(orientation:landscape) and (max-height:520px)').matches){notesOn=false;$('#main').classList.add('nonotes');$('#notesBtn').classList.remove('on')}
$('#next').onclick=()=>next();
$('#homeBtn').onclick=()=>{location.hash=''};
$('#notesBtn').onclick=()=>{notesOn=!notesOn;$('#main').classList.toggle('nonotes',!notesOn);$('#notesBtn').classList.toggle('on',notesOn);unit&&renderQuick(unit.slides[idx]);setTimeout(fit,30)};
$('#toolsBtn').onclick=()=>openTool(curTool||'timer');
$('#animBtn').onclick=()=>{document.body.classList.toggle('noanim');$('#animBtn').classList.toggle('on',!document.body.classList.contains('noanim'))};
$('#fsBtn').onclick=toggleFS;
function toggleFS(){try{if(!document.fullscreenElement)document.documentElement.requestFullscreen();else document.exitFullscreen()}catch(e){}setTimeout(fit,200)}
document.addEventListener('fullscreenchange',()=>{unit&&renderQuick(unit.slides[idx]);setTimeout(fit,100)});
document.addEventListener('keydown',e=>{
  if(!unit||app.classList.contains('hidden'))return;
  if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
  const ov=$('#ov').classList.contains('show');
  if(e.key==='Escape'){if(ov)closeTool();return}
  if(ov)return;
  const k=e.key;
  if(k==='ArrowRight'||k===' '||k==='PageDown'||k==='Enter'){e.preventDefault();if(e.shiftKey)go(idx+1);else next()}
  else if(k==='ArrowLeft'||k==='PageUp'){e.preventDefault();go(idx-1)}
  else if(k==='a'||k==='A'){revealAll()}
  else if(k==='h'||k==='H'){render()}
  else if(k==='f'||k==='F'){toggleFS()}
  else if(k==='n'||k==='N'){$('#notesBtn').click()}
  else if(k==='t'||k==='T'){openTool('timer')}
  else if(k==='r'||k==='R'){openTool('picker');pickGo()}
  else if(k==='Home'){go(0)}else if(k==='End'){go(unit.slides.length-1)}
});

function playDialogue(){
  const lines=$$('#slide .ln');let i=0;
  try{speechSynthesis.cancel()}catch(e){}
  const nx=()=>{ $$('#slide .ln').forEach(l=>l.classList.remove('talking'));
    if(i>=lines.length)return;const l=lines[i++];
    const k=steps.indexOf(l);if(k>=si){while(si<=k){revealEl(steps[si]);si++}updCounter()}
    l.querySelectorAll('.gp').forEach(g=>{if(!g.classList.contains('on')){revealEl(g);const kk=steps.indexOf(g);if(kk===si){si++;updCounter()}}});
    l.classList.add('talking');
    const s=l.querySelector('.spk');const v=+l.dataset.v;
    say(s.dataset.say,{v:v*3+1,pitch:v%2?1.15:0.95,end:()=>setTimeout(nx,350)});
  };nx();
}

/* lesson clock */
let lt=0,ltOn=false,ltInt=null;
$('#ltBtn').onclick=()=>{ltOn=!ltOn;$('#ltBtn').textContent=ltOn?'พัก':'เริ่มคาบ';clearInterval(ltInt);if(ltOn)ltInt=setInterval(()=>{lt++;drawLt()},1000)};
$('#ltReset').onclick=()=>{lt=0;drawLt()};
function drawLt(){const t=$('#lt');t.textContent=String(Math.floor(lt/60)).padStart(2,'0')+':'+String(lt%60).padStart(2,'0');t.classList.toggle('over',lt>50*60)}

/* ================= TOOLS ================= */
let curTool=null;
function availTools(){return Object.keys(TOOLS).filter(k=>k==='stest'?(unit.quiz||[]).length:(!STU||['flash','sort','puzzle','scramble','timer'].includes(k))&&(['timer','picker','score'].includes(k)||(k==='quiz'?(unit.quiz||[]).length:unit[k])))}
function buildTools(){
  const av=availTools();unit.toolsCount=av.length;
  $('#tabs').innerHTML=av.map(k=>`<button class="tab" data-tab="${k}">${TOOLS[k]}</button>`).join('');
  $('#tabs').onclick=e=>{const b=e.target.closest('.tab');if(b)openTool(b.dataset.tab)};
  initQuiz();initFlash();initSort();initDetect();initPuzzle();initScramble();initMedia();drawTeams();
}
function openTool(k){
  if(k==='quiz'&&curTool!=='quiz')initQuiz();
  if(k==='stest')initTest();
  $('#ov').classList.toggle('focus',k==='stest');
  if(!availTools().includes(k))k='timer';
  curTool=k;$('#ov').classList.add('show');
  $$('.tab').forEach(b=>b.classList.toggle('on',b.dataset.tab===k));
  $$('.tool').forEach(s=>s.classList.toggle('on',s.id==='t-'+k));
}
function closeTool(){$('#ov').classList.remove('show')}
$('#closeOv').onclick=closeTool;
$('#ov').addEventListener('click',e=>{if(e.target.id==='ov')closeTool()});

/* timer */
let tTotal=120,tLeft=120,tInt=null;
const PRE=[[30,'30 วิ'],[60,'1 นาที'],[120,'2 นาที'],[180,'3 นาที'],[300,'5 นาที'],[600,'10 นาที']];
$('#tPresets').innerHTML=PRE.map(p=>`<button class="btn alt" data-t="${p[0]}">${p[1]}</button>`).join('');
$('#tPresets').onclick=e=>{const b=e.target.closest('[data-t]');if(b){setTimer(+b.dataset.t)}};
function setTimer(s){stopTimer();tTotal=tLeft=s;drawT()}
function drawT(){const d=$('#tDisp');d.textContent=String(Math.floor(tLeft/60)).padStart(2,'0')+':'+String(tLeft%60).padStart(2,'0');
  d.className='tdisp'+(tLeft===0?' end':tLeft<=10?' warn':'');$('#tBar').style.width=(tTotal?tLeft/tTotal*100:0)+'%'}
function startTimer(){if(tInt){stopTimer();return}if(tLeft<=0)tLeft=tTotal;$('#tStart').textContent='⏸ Pause';
  tInt=setInterval(()=>{tLeft--;if(tLeft<=0){tLeft=0;stopTimer();beep();confetti(80)}drawT()},1000)}
function stopTimer(){clearInterval(tInt);tInt=null;$('#tStart').textContent='▶ Start'}
$('#tStart').onclick=startTimer;$('#tReset').onclick=()=>setTimer(tTotal);
$('#tMinus').onclick=()=>{tLeft=Math.max(0,tLeft-30);drawT()};$('#tPlus').onclick=()=>{tLeft+=30;tTotal=Math.max(tTotal,tLeft);drawT()};
function beep(){try{const a=new (window.AudioContext||window.webkitAudioContext)();[0,.35,.7].forEach(t=>{const o=a.createOscillator(),g=a.createGain();o.frequency.value=880;o.connect(g);g.connect(a.destination);g.gain.setValueAtTime(.25,a.currentTime+t);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+t+.3);o.start(a.currentTime+t);o.stop(a.currentTime+t+.3)})}catch(e){}}
drawT();

/* picker */
let picked=[];
function pickGo(){
  const mode=$('#pMode').value,d=$('#pDisp');
  let pool;
  if(mode==='team'){pool=teamNames()}else{const n=+$('#pN').value||40;pool=[...Array(n)].map((_,i)=>String(i+1))}
  pool=pool.filter(x=>!picked.includes(x));if(!pool.length){picked=[];pool=mode==='team'?teamNames():[...Array(+$('#pN').value||40)].map((_,i)=>String(i+1))}
  d.className='pick'+(mode==='team'?' small':'');let c=0;
  const iv=setInterval(()=>{d.textContent=pool[Math.floor(Math.random()*pool.length)];if(++c>14){clearInterval(iv);const w=pool[Math.floor(Math.random()*pool.length)];d.textContent=w;picked.push(w);$('#pList').innerHTML=picked.map(p=>`<span>${p}</span>`).join('');confetti(30)}},70);
}
$('#pGo').onclick=pickGo;$('#pReset').onclick=()=>{picked=[];$('#pList').innerHTML='';$('#pDisp').textContent='?'};

/* scoreboard */
const TC=['#d9493f','#2f6fb3','#2f8a4f','#7b4bb5','#e07a2e','#c94f7c','#13867a','#a0662b','#4b5563','#b8860b'];
function teams(){return LS.get('teach:teams',null)||[...Array(6)].map((_,i)=>({n:'กลุ่ม '+(i+1),s:0}))}
function teamNames(){return teams().map(t=>t.n)}
function drawTeams(){const ts=teams();$('#sN').value=ts.length;
  $('#teams').innerHTML=ts.map((t,i)=>`<div class="team" style="background:${TC[i%10]}"><input value="${esc(t.n)}" data-i="${i}"><div class="s">${t.s}</div><button data-d="-1" data-i="${i}">−</button><button data-d="1" data-i="${i}">+</button></div>`).join('')}
$('#teams').addEventListener('click',e=>{const b=e.target.closest('button[data-d]');if(!b)return;const ts=teams();ts[+b.dataset.i].s+=+b.dataset.d;LS.set('teach:teams',ts);drawTeams();if(+b.dataset.d>0)confetti(25)});
$('#teams').addEventListener('change',e=>{const ts=teams();ts[+e.target.dataset.i].n=e.target.value;LS.set('teach:teams',ts)});
$('#sN').onchange=()=>{const n=Math.max(2,Math.min(10,+$('#sN').value));let ts=teams();while(ts.length<n)ts.push({n:'กลุ่ม '+(ts.length+1),s:0});ts=ts.slice(0,n);LS.set('teach:teams',ts);drawTeams()};
$('#sReset').onclick=()=>{const ts=teams().map(t=>({n:t.n,s:0}));LS.set('teach:teams',ts);drawTeams()};

/* flashcards */
let fl=[],fi=0;
function initFlash(){fl=(unit.flash||[]).slice();fi=0;drawFlash()}
function drawFlash(){if(!fl.length)return;const c=fl[fi],q=$('#fQuiz').checked;const f=$('#flash');
  f.className='flash hide'+(q?' quizmode':'');f.innerHTML=`<div class="e">${c[0]}</div><div class="w">${c[1]}</div><div class="t">${c[2]}</div><div class="x2">${c[3]?md(c[3]):''}</div>`;$('#fNo').textContent=`${fi+1} / ${fl.length}`}
$('#flash').onclick=()=>{const f=$('#flash');if(f.classList.contains('hide')){f.classList.remove('hide');say(fl[fi][1])}else{fi=(fi+1)%fl.length;drawFlash()}};
$('#fSay').onclick=()=>fl.length&&say(fl[fi][1]);
$('#fPrev').onclick=()=>{fi=(fi-1+fl.length)%fl.length;drawFlash()};$('#fNext').onclick=()=>{fi=(fi+1)%fl.length;drawFlash()};
$('#fShuf').onclick=()=>{fl.sort(()=>Math.random()-.5);fi=0;drawFlash()};$('#fQuiz').onchange=drawFlash;

/* sort game */
let so=[],soi=0,soS=0,soD=0;
function initSort(){const s=unit.sort;if(!s)return;$('#soT').textContent=s.title;$('#soSub').textContent=s.sub||'ให้ทั้งห้องโหวต แล้วกดคำตอบที่ห้องเลือก ระบบเฉลยพร้อมเหตุผล';
  $('#soBtns').innerHTML=s.cats.map((c,i)=>`<button data-c="${i}" style="background:${c[2]||TC[i]}">${c[0]}<br><small style="font-size:16px">${c[1]}</small></button>`).join('');
  so=s.items.slice().sort(()=>Math.random()-.5);soi=0;soS=0;soD=0;drawSort()}
function drawSort(){const it=so[soi];$('#soCard').innerHTML=md(it[0]);$('#soFb').innerHTML='';$('#soCount').textContent=`ข้อ ${soi+1}/${so.length}`;$('#soScore').textContent=`ถูก ${soS}/${soD}`;$('#soBtns').dataset.done=''}
$('#soBtns').onclick=e=>{const b=e.target.closest('[data-c]');if(!b||$('#soBtns').dataset.done)return;const it=so[soi];const ok=+b.dataset.c===it[1];soD++;if(ok){soS++;confetti(40)}
  $('#soBtns').dataset.done='1';$('#soFb').innerHTML=`<b class="${ok?'ok':'no'}">${ok?'✅ ถูกต้อง!':'❌ ยังไม่ใช่'}</b> คำตอบ: <b>${unit.sort.cats[it[1]][0]}</b><br>${md(it[2]||'')}`;$('#soScore').textContent=`ถูก ${soS}/${soD}`;say(it[0])};
$('#soNext').onclick=()=>{soi=(soi+1)%so.length;if(soi===0){so.sort(()=>Math.random()-.5)}drawSort()};

/* detective */
function initDetect(){if(!unit.detect)return;$('#detList').innerHTML=unit.detect.map((d,i)=>`<div class="dcase" data-i="${i}"><div class="w">${i+1}. ${d[0].replace(/<m>(.*?)<\/m>/g,'<mark>$1</mark>')}</div>
  <div class="row" style="margin-top:8px"><button class="btn alt" data-a="pt">🔍 ชี้จุดผิด</button><button class="btn" data-a="open">✅ เฉลย</button></div>
  <div class="fix"><div class="c">✔ ${md(d[1])}</div><div>${d[2]}</div></div></div>`).join('')}
$('#detList').onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const c=b.closest('.dcase');c.classList.add(b.dataset.a==='pt'?'pt':'open');if(b.dataset.a==='open'){c.classList.add('pt');say(plain(unit.detect[+c.dataset.i][1]))}};

/* puzzle */
let pzSel=null;
function initPuzzle(){const p=unit.puzzle;if(!p)return;$('#pzT').textContent=p.title;
  $('#pzRows').innerHTML=p.rows.map(r=>`<div class="prow"><div class="lab">${r[0]}</div>${r[1].map(x=>x.startsWith('#')?`<div class="slot" data-k="${x.slice(1)}"></div>`:`<span>${x}</span>`).join('')}</div>`).join('');
  const pcs=p.pieces.map((x,i)=>({t:x[1],k:x[0],i})).sort(()=>Math.random()-.5);
  $('#pieces').innerHTML=pcs.map(x=>`<button class="piece" data-k="${x.k}">${x.t}</button>`).join('');$('#pzFb').innerHTML='';pzSel=null}
$('#pieces').onclick=e=>{const b=e.target.closest('.piece');if(!b)return;$$('.piece').forEach(x=>x.classList.remove('sel'));pzSel=b;b.classList.add('sel')};
$('#pzRows').onclick=e=>{const s=e.target.closest('.slot');if(!s||!pzSel||s.classList.contains('ok'))return;
  if(s.dataset.k===pzSel.dataset.k){s.textContent=pzSel.textContent;s.classList.add('ok');pzSel.classList.add('used');pzSel.classList.remove('sel');pzSel=null;
    if(!$$('#pzRows .slot:not(.ok)').length){$('#pzFb').innerHTML='<b class="ok">🎉 สร้างสูตรครบแล้ว!</b> '+(unit.puzzle.done||'');confetti(120)}}
  else{s.classList.remove('bad');s.offsetWidth;s.classList.add('bad');$('#pzFb').innerHTML='<b class="no">ยังไม่ใช่ ลองใหม่</b>'}};
$('#pzReset').onclick=initPuzzle;

/* scramble */
let sc=[],sci=0,built=[];
function initScramble(){if(!unit.scramble)return;sc=unit.scramble.slice();sci=0;drawScr()}
function drawScr(){const s=sc[sci];const w=s.replace(/[.?!]$/,'').split(' ');built=[];
  const sh=w.map((x,i)=>({x,i})).sort(()=>Math.random()-.5);
  $('#scrIn').innerHTML=sh.map(o=>`<button class="wtile" data-i="${o.i}">${o.x}</button>`).join('');$('#scrOut').className='scr-out';$('#scrOut').innerHTML='';$('#scrNo').textContent=`ข้อ ${sci+1}/${sc.length}`;$('#scrFb').innerHTML=''}
$('#scrIn').onclick=e=>{const b=e.target.closest('.wtile');if(!b)return;b.classList.add('used');built.push(b.textContent);const o=document.createElement('button');o.className='wtile';o.textContent=b.textContent;o.dataset.i=b.dataset.i;$('#scrOut').appendChild(o);
  const s=sc[sci].replace(/[.?!]$/,'');if(built.length===s.split(' ').length){const ok=built.join(' ')===s;$('#scrOut').classList.add(ok?'ok':'bad');$('#scrFb').innerHTML=ok?'<b class="ok">✅ ถูกต้อง!</b> '+sc[sci]:'<b class="no">❌ ลองใหม่</b> (กด ↺)';if(ok){confetti(50);say(sc[sci])}}};
$('#scrOut').onclick=e=>{const b=e.target.closest('.wtile');if(!b||$('#scrOut').classList.contains('ok'))return;const t=$(`#scrIn .wtile[data-i="${b.dataset.i}"]`);t&&t.classList.remove('used');built.splice([...$('#scrOut').children].indexOf(b),1);b.remove();$('#scrOut').className='scr-out'};
$('#scrReset').onclick=drawScr;$('#scrNext').onclick=()=>{sci=(sci+1)%sc.length;drawScr()};$('#scrAns').onclick=()=>{$('#scrFb').innerHTML='🔑 '+sc[sci];say(sc[sci])};

/* ===== student: แบบฝึก (practice, shown but not counted) + แบบทดสอบย่อย (counted, pass 60%, retake until pass) ===== */
const CFG=window.M3_CONFIG||{};
const PASS=0.6;
let T=null,retakeT=null;
function expand(s){s=String(s).toLowerCase().replace(/[’‘`]/g,"'").replace(/[.!?,]+$/,'').replace(/\s+/g,' ').trim();
  const a=s.replace(/n't\b/g,' not').replace(/\bcan not\b/g,'cannot').replace(/'ve\b/g,' have').replace(/'m\b/g,' am').replace(/'re\b/g,' are').replace(/'ll\b/g,' will').replace(/'d\b/g,' would');
  return [...new Set([s,a,a.replace(/'s\b/g,' has'),a.replace(/'s\b/g,' is')])].map(x=>x.replace(/^(i|you|we|they|he|she|it) /,'').replace(/\s+/g,' ').trim()).concat([s])}
function same(given,ans){const g=expand(given),a=expand(ans);return g.some(x=>x&&a.includes(x))}
const shuffle=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(p=>p[1]);
function allWords(){const out=[],seen=new Set();const add=c=>{const w=String(c[1]||'').trim(),k=w.toLowerCase();if(w&&c[2]&&!seen.has(k)){seen.add(k);out.push([c[0],w,c[2]])}};
  (unit.vwords||[]).forEach(add);(unit.flash||[]).forEach(add);return out}
/* vocabulary pair game: rounds of 6, half the rounds are listen-only; first-try matches are the practice score */
function vgInit(words,start){T.vg={words,start,per:6,round:0,sel:null,done:{},miss:{},streak:0,best:0,pts:0,t0:Date.now()}}
function vgRounds(){const g=T.vg;return Math.ceil(g.words.length/g.per)}
function vgDraw(){const g=T.vg,box=$('#vgame');if(!g||!box)return;const R=vgRounds();
  if(g.round>=R){const ok=g.words.filter((w,i)=>!g.miss[i]).length;const pct=Math.round(ok/g.words.length*100);
    box.innerHTML=`<div class="vg-end"><div class="vg-emo">${pct>=80?'🏆':pct>=60?'🌟':'💪'}</div><b>จับคู่ครบ ${g.words.length} คำ!</b><span>ถูกตั้งแต่ครั้งแรก ${ok}/${g.words.length} คำ · คอมโบสูงสุด 🔥${g.best} · ${Math.round((Date.now()-g.t0)/1000)} วินาที</span>
      ${pct<100?`<p class="vg-tip">คำที่ควรทบทวน (แตะเพื่อฟังเสียง)</p><div class="vg-rev">${g.words.map((w,i)=>g.miss[i]?`<button class="vg-r" data-say="${esc(w[1])}">${w[0]} ${esc(w[1])} = ${esc(w[2])} 🔊</button>`:'').join('')}</div>`:''}</div>`;return}
  const idx=[...Array(g.words.length).keys()].slice(g.round*g.per,(g.round+1)*g.per);
  const listen=g.round%2===1;g.order=g.order&&g.order.round===g.round?g.order:{round:g.round,L:shuffle(idx.slice()),Rt:shuffle(idx.slice())};
  box.innerHTML=`<div class="vg-head"><span>รอบ ${g.round+1}/${R} · ${listen?'🎧 ฟังแล้วจับคู่ความหมาย':'👀 จับคู่คำกับความหมาย'}</span><span class="vg-pts">⭐ ${g.pts} ${g.streak>1?`<b class="vg-combo">🔥x${g.streak}</b>`:''}</span></div>
   <div class="vg-bar"><i style="width:${Object.keys(g.done).length/g.words.length*100}%"></i></div>
   <div class="vg-grid"><div class="vg-col">${g.order.L.map(i=>`<button class="vg-w ${g.done[i]?'gone':''} ${g.sel===i?'sel':''}" data-vw="${i}">${listen?`<span class="vg-ear">🔊</span><small>${g.words[i][0]}</small>`:`<span>${g.words[i][0]}</span>${esc(g.words[i][1])}`}</button>`).join('')}</div>
   <div class="vg-col">${g.order.Rt.map(i=>`<button class="vg-m ${g.done[i]?'gone':''}" data-vm="${i}">${esc(g.words[i][2])}</button>`).join('')}</div></div>
   <p class="vg-tip">${listen?'แตะ 🔊 เพื่อฟัง แล้วแตะความหมายที่ตรงกัน':'แตะคำศัพท์ (มีเสียงอ่าน) แล้วแตะความหมายที่ตรงกัน'} · จับคู่ถูกติดกันได้คอมโบ 🔥</p>`}
function vgTone(ok){try{const a=new (window.AudioContext||window.webkitAudioContext)();const o=a.createOscillator(),g=a.createGain();o.type=ok?'triangle':'sawtooth';
  o.frequency.setValueAtTime(ok?660:200,a.currentTime);if(ok)o.frequency.setValueAtTime(990,a.currentTime+.09);g.gain.setValueAtTime(.12,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.25);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.26)}catch(e){}}
document.addEventListener('click',e=>{if(!T||!T.vg)return;const g=T.vg,t=e.target;
  const w=t.closest('.vg-w');if(w&&!w.classList.contains('gone')&&!g.done[+w.dataset.vw]&&!g.busy){g.sel=+w.dataset.vw;$$('.vg-w').forEach(b=>b.classList.toggle('sel',b===w));say(g.words[g.sel][1]);return}
  const m=t.closest('.vg-m');if(m&&!m.classList.contains('gone')&&!g.done[+m.dataset.vm]&&!g.busy){if(g.sel==null){m.classList.remove('nudge');m.offsetWidth;m.classList.add('nudge');return}
    const i=+m.dataset.vm;if(i===g.sel){g.done[i]=1;g.streak++;g.best=Math.max(g.best,g.streak);g.pts+=10+(g.streak>1?5*(g.streak-1):0);T.ans[g.start+i]=!g.miss[i];
      vgTone(true);const wb=$(`.vg-w[data-vw="${i}"]`);[wb,m].forEach(x=>x&&x.classList.add('pop'));g.sel=null;
      const left=g.order.L.filter(k=>!g.done[k]).length;
      if(!left)g.busy=1;setTimeout(()=>{if(!left){g.round++;g.busy=0;confetti(50)}vgDraw();const s=$('.tw-top span');if(s)s.textContent='ตอบแล้ว '+answered()+'/'+T.items.length},left?380:700)}
    else{g.miss[g.sel]=1;g.streak=0;vgTone(false);m.classList.remove('bad');m.offsetWidth;m.classList.add('bad');const p=$('.vg-pts');if(p)p.innerHTML='⭐ '+g.pts}
    return}
});
function practiceSets(){const sets=[];
  const vw=shuffle(allWords());
  if(vw.length)sets.push({type:'vgame',part:'vocab',title:'① เกมจับคู่คำศัพท์ · ครบ '+vw.length+' คำของหน่วย',words:vw});
  const vc=(window.TEACH_VCTX||{})[unit.n];if(vc)sets.push({type:'choose',part:'vocab',title:'② คำศัพท์ในบริบท · เลือกคำที่เหมาะสม',items:vc});
  (unit.wb||[]).forEach(e=>sets.push(Object.assign({part:'grammar'},e,{title:'③ ไวยากรณ์ · '+e.title})));
  return sets}
const QN=10,WQ=0.8,WP=0.2;
function drawSet(){const Q=unit.quiz||[],key='teach:qlast:u'+unit.n,last=LS.get(key,[]);
  const fresh=shuffle(Q.map((_,i)=>i).filter(i=>!last.includes(i))),old=shuffle(last.filter(i=>i<Q.length));
  const set=fresh.concat(old).slice(0,Math.min(QN,Q.length));LS.set(key,set);
  const opt={};set.forEach(i=>opt[i]=shuffle(Q[i][1].map((_,k)=>k)));return {order:shuffle(set),opt}}
function initTest(){clearInterval(retakeT);
  const sets=practiceSets(),items=[];
  sets.forEach((e,ei)=>{if(e.type==='vgame'){e.start=items.length;e.words.forEach((w,ti)=>items.push({kind:'vg',ei,ti,part:e.part,a:w[2],q:w[1]}));return}
    e.items.forEach((t,ti)=>{
    if(e.type==='choose')(t.match(/\{\{(.*?)\}\}/g)||[]).forEach(m=>{const os=m.slice(2,-2).split('|');items.push({kind:'ch',ei,ti,part:e.part,opts:os.map(o=>o.replace(/\*$/,'')),a:os.findIndex(o=>o.endsWith('*'))})});
    else (t.match(/\[([^\]]+)\]/g)||[]).forEach(m=>items.push({kind:'gap',ei,ti,part:e.part,a:m.slice(1,-1)}))})});
  const prev=LS.get('teach:res:u'+unit.n,null);
  T={sets,items,ans:{},qa:[],qi:0,order:[],stage:'wb',opt:{},practice:null,attempt:prev&&prev.quiz?prev.quiz.attempts:0};const d=drawSet();T.order=d.order;T.opt=d.opt;drawTest()}
function setsHTML(){let k=0;return T.sets.map(e=>`<div class="tw-ex"><h4>${esc(e.title)}</h4>${e.bank?`<div class="tw-bank">${e.bank.map(b=>`<span>${esc(b)}</span>`).join('')}</div>`:''}
  ${e.type==='vgame'?(k+=e.words.length,'<div class="vg" id="vgame"></div>'):''}<ol>${e.type==='vgame'?'':e.items.map(t=>`<li>${e.type==='choose'?t.replace(/\{\{(.*?)\}\}/g,(m,a)=>{const id=k++;return `<span class="tw-ch" data-k="${id}">${a.split('|').map((o,oi)=>`<button type="button" data-k="${id}" data-o="${oi}" class="${T.ans[id]===oi?'on':''}">${esc(o.replace(/\*$/,''))}</button>`).join('')}</span>`}).replace(/\*\*/g,'')
   :t.replace(/\[([^\]]+)\]/g,()=>{const id=k++;return `<input class="tw-in" data-k="${id}" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(T.ans[id]||'')}" size="${Math.max(6,T.items[id].a.length+2)}">`}).replace(/\*\*/g,'')}</li>`).join('')}</ol></div>`).join('')}
const answered=()=>Object.keys(T.ans).filter(k=>T.ans[k]!=null&&String(T.ans[k]).trim()!=='').length;
function drawTest(){const b=$('#twBody');if(!b||!T)return;const Q=unit.quiz||[];
  if(T.stage==='wb'){b.innerHTML=`<div class="tw-top"><b>📒 แบบฝึก</b><span>ตอบแล้ว ${answered()}/${T.items.length}</span></div>
    <p class="tw-hint">คะแนนรวม = แบบทดสอบย่อย <b>80%</b> + แบบฝึกนี้ <b>20%</b> · ต้องได้ 60 ขึ้นไป · ทำแล้วไปต่อที่แบบทดสอบย่อย</p>${setsHTML()}
    <div class="tw-foot"><button class="btn big" id="twToQuiz">ต่อไป: 📝 แบบทดสอบย่อย ${T.order.length} ข้อ →</button></div>`;
    const vs=T.sets.find(s=>s.type==='vgame');if(vs){if(!T.vg)vgInit(vs.words,vs.start);vgDraw()}return}
  if(T.stage==='quiz'){const qn=T.order[T.qi],q=Q[qn];b.innerHTML=`<div class="tw-top"><b>📝 แบบทดสอบย่อย${T.attempt?` · ครั้งที่ ${T.attempt+1}`:''}</b><span>ข้อ ${T.qi+1} / ${T.order.length}</span></div><div class="tw-bar"><i style="width:${T.qi/T.order.length*100}%"></i></div>
    <div class="qzq">${md(q[0])} <button class="spk" data-say="${esc(q[0])}">🔊</button></div>
    <div class="qzo tw-qo">${(T.opt[qn]||[0,1,2,3]).map((oi,k)=>`<button data-tq="${oi}" class="c${k}"><i>${'ABCD'[k]}</i>${md(q[1][oi])}</button>`).join('')}</div>
    <div class="tw-foot"><button class="btn alt" id="twBack">‹ ${T.qi?'ข้อก่อนหน้า':(T.practice?'':'กลับไปแบบฝึก')}</button></div>`;
    if(!T.qi&&T.practice)$('#twBack').remove();return}
  if(T.stage==='check'){const nb=T.items.length-answered();
    b.innerHTML=`<div class="tw-done"><div class="tw-emo">📮</div><h3>พร้อมส่งคำตอบ?</h3><p>${T.practice?'':`แบบฝึกตอบแล้ว ${T.items.length-nb}/${T.items.length} ข้อ${nb?` <span style="color:#c0392b">(ยังว่าง ${nb} ข้อ)</span>`:''} · `}แบบทดสอบย่อยตอบครบ ${T.order.length} ข้อ</p>
    <div class="row" style="justify-content:center">${T.practice?'':'<button class="btn alt" id="twEdit">‹ กลับไปแก้แบบฝึก</button>'}<button class="btn big" id="twSend">📤 ส่งคำตอบ</button></div></div>`;return}
  if(T.stage==='done')b.innerHTML=T.html}
function gradePractice(){const by={vocab:[0,0],grammar:[0,0]},wrong=[];
  T.items.forEach((it,i)=>{const g=T.ans[i];const ok=it.kind==='ch'?g===it.a:it.kind==='vg'?g===true:same(g||'',it.a);by[it.part][1]++;if(ok)by[it.part][0]++;
    else{const e=T.sets[it.ei];wrong.push({p:'wb',ex:e.title.split('·')[0].trim(),q:it.kind==='vg'?it.q+' = '+it.a:e.items[it.ti].replace(/\{\{.*?\}\}|\[[^\]]+\]/g,'____').replace(/\*\*/g,''),your:it.kind==='ch'?(g==null?'—':it.opts[g]):it.kind==='vg'?(g===false?'จับคู่ผิดครั้งแรก':'ยังไม่ได้เล่น'):(g||'—'),a:it.kind==='ch'?it.opts[it.a]:it.a})}});
  return {vocab:by.vocab[0],vocabMax:by.vocab[1],gram:by.grammar[0],gramMax:by.grammar[1],s:by.vocab[0]+by.grammar[0],m:by.vocab[1]+by.grammar[1],wrong}}
function gradeQuiz(){const Q=unit.quiz||[];let s=0;const wrong=[];
  T.order.forEach((qn,i)=>{const q=Q[qn];if(T.qa[i]===q[2])s++;else wrong.push({p:'quiz',ex:'ข้อ '+(i+1),q:q[0].replace(/\*\*/g,''),your:T.qa[i]==null?'—':q[1][T.qa[i]],a:q[1][q[2]],why:q[3]})});
  return {s,m:T.order.length,wrong}}
function flushQueue(){if(!CFG.supabaseUrl)return;const q=LS.get('m3:queue',[]);if(!q.length)return;const keep=[];
  Promise.all(q.map(row=>fetch(`${CFG.supabaseUrl}/rest/v1/${CFG.table}`,{method:'POST',headers:{apikey:CFG.supabaseKey,Authorization:`Bearer ${CFG.supabaseKey}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(row)}).then(r=>{if(!r.ok)keep.push(row)}).catch(()=>keep.push(row)))).then(()=>LS.set('m3:queue',keep))}
setTimeout(flushQueue,1500);addEventListener('online',flushQueue);
async function vcode(s){try{const h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('m3-check:'+s));return [...new Uint8Array(h)].slice(0,3).map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase()}catch(e){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h.toString(16).slice(0,6).toUpperCase()}}
function saveRes(p,q,passed){const key='teach:res:u'+unit.n,r=LS.get(key,{})||{};
  if(!r.practice)r.practice={s:p.s,m:p.m,vocab:p.vocab,vocabMax:p.vocabMax,gram:p.gram,gramMax:p.gramMax};
  const z=r.quiz||{attempts:0};z.attempts++;const cur={s:q.total,m:100,qs:q.s,qm:q.m};if(!z.first)z.first=cur;if(!z.best||q.total>z.best.s)z.best=cur;z.last=cur;z.passed=z.passed||passed;r.quiz=z;LS.set(key,r);return r}
async function sendRow(p,q,passed,code,ts,attempt){if(!STU)return 'teacher';if(!CFG.supabaseUrl||!ME)return 'local';
  const row={unit:'unit'+unit.n+'-test',student_name:ME.name,class:ME.cls,student_no:ME.no,kind:'quiz',skill:'all',score:q.total,max_score:100,
    detail:{part:'practice+quiz',total:q.total,quiz:{s:q.s,m:q.m,w:q.qw},code,ts,attempt,passed,practice:{s:p.s,m:p.m,vocab:p.vocab,vocabMax:p.vocabMax,gram:p.gram,gramMax:p.gramMax},wrong:q.wrong.map(w=>w.q).slice(0,10)}};
  try{const x=await fetch(`${CFG.supabaseUrl}/rest/v1/${CFG.table}`,{method:'POST',keepalive:true,headers:{apikey:CFG.supabaseKey,Authorization:`Bearer ${CFG.supabaseKey}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(row)});
    if(!x.ok)throw 0;return 'sent'}catch(e){const qq=LS.get('m3:queue',[]);qq.push(row);LS.set('m3:queue',qq.slice(-50));return 'queued'}}
let liveT=null;
async function submitTest(){const p=T.practice||gradePractice();T.practice=p;const q=gradeQuiz();const qp=q.s/q.m,pp=p.m?p.s/p.m:0;
  const qw=Math.round(qp*WQ*1000)/10,pw=Math.round(pp*WP*1000)/10,total=Math.round((qw+pw)*10)/10,passed=total>=PASS*100;q.total=total;q.qw=qw;q.pw=pw;T.attempt++;
  const now=new Date(),ts=now.toISOString(),me=STU&&ME?ME:{name:'ครู (ทดลองทำ · ไม่ส่งคะแนน)',cls:'-',no:'-'};
  const code=await vcode([me.name,me.cls,me.no,unit.n,total,q.s,q.m,ts].join('|'));
  const res=saveRes(p,q,passed);
  const dt=now.toLocaleString('th-TH',{dateStyle:'medium',timeStyle:'medium'});
  const wm=Array(18).fill(`<span>${esc(me.name)} · ${esc(me.cls)} · ${esc(me.no)}</span>`).join('');
  const qpct=Math.round(qp*100),ppct=p.m?Math.round(p.s/p.m*100):0;
  T.stage='done';
  T.html=`<div class="tw-card"><div class="tw-wm" aria-hidden="true">${wm}</div>
   <div class="tw-id"><div><small>สรุปคะแนน · Unit ${unit.n} ${esc(unit.title)}</small><b>${esc(me.name)}</b><span>ชั้น ${esc(me.cls)} · เลขที่ ${esc(me.no)}</span></div>
   <div class="tw-code"><small>รหัสตรวจสอบ</small><b>${code.slice(0,3)}-${code.slice(3)}</b></div></div>
   <div class="tw-time"><span>📤 ส่งเมื่อ ${dt} · ครั้งที่ ${T.attempt}</span><span class="tw-live">🔴 เวลาขณะนี้ <b id="twClock"></b></span></div>
   <div class="tw-done"><div class="tw-emo">${passed?'🏆':'💪'}</div>
   <div class="tw-big ${passed?'ok':'no'}"><small>คะแนนรวมของหน่วย (เต็ม 100)</small><b>${total}</b><span>${passed?'ผ่านเกณฑ์ 60% ✅':'ยังไม่ผ่านเกณฑ์ 60%'}</span></div>
   <div class="tw-sum"><div><b>${qw}<small>/80</small></b><span>📝 แบบทดสอบย่อย ${q.s}/${q.m} ข้อ (80%)</span></div><div><b>${pw}<small>/20</small></b><span>📒 แบบฝึก ${p.s}/${p.m} (20%)</span></div><div><b>${p.vocab}/${p.vocabMax} · ${p.gram}/${p.gramMax}</b><span>แบบฝึกคำศัพท์ · ไวยากรณ์</span></div></div>
   <p id="twSent" class="muted">กำลังส่งคะแนน…</p>
   ${passed?'':`<div class="tw-retry">⏳ ต้องทำแบบทดสอบย่อยใหม่ (ชุดคำถามใหม่) · เริ่มอัตโนมัติใน <b id="twCount">15</b> วินาที <button class="btn" id="twRetry">เริ่มเลย</button></div>`}</div></div>
   <p class="tw-note">👩‍🏫 ครูตรวจได้: ชื่อและรหัสตรวจสอบต้องตรงกับหน้า “สรุปคะแนนนักเรียน” · นาฬิกาสีแดงเดินอยู่ตลอด (ภาพที่ถ่ายไว้จะไม่เดิน)</p>
   ${q.wrong.length?`<h4 class="tw-h">📝 แบบทดสอบย่อย: ข้อที่ผิด (${q.wrong.length})</h4><p class="tw-hint">ทบทวนเนื้อหาแล้วลองใหม่ · รอบใหม่จะได้คำถามชุดใหม่และสลับตัวเลือก</p>`:''}
   ${!passed?'':q.wrong.length?`<div class="tw-wrong">${q.wrong.map(w=>`<div><small>${esc(w.ex)}</small><div>${esc(w.q)}</div><div>คำตอบของฉัน: <s>${esc(w.your)}</s> → <b>${esc(w.a)}</b>${w.why?` <small>(${esc(w.why)})</small>`:''}</div></div>`).join('')}</div>`:''}
   ${p.wrong.length&&T.attempt===1?`<h4 class="tw-h">📒 แบบฝึก: ข้อที่ต้องทบทวน (${p.wrong.length})</h4><div class="tw-wrong">${p.wrong.map(w=>`<div><small>${esc(w.ex)}</small><div>${esc(w.q)}</div><div>คำตอบของฉัน: <s>${esc(w.your)}</s> → <b>${esc(w.a)}</b></div></div>`).join('')}</div>`:''}
   <div class="tw-foot">${passed?`<button class="btn alt" id="twAgain">↺ ฝึกอีกครั้ง</button><a class="btn" href="#progress">📊 ดูสรุปทุกหน่วย</a>`:''}</div>`;
  drawTest();if(passed)confetti(140);
  clearInterval(liveT);const tick=()=>{const c=$('#twClock');if(!c){clearInterval(liveT);return}c.textContent=new Date().toLocaleTimeString('th-TH')};tick();liveT=setInterval(tick,1000);
  if(!passed){let n=15;clearInterval(retakeT);retakeT=setInterval(()=>{n--;const c=$('#twCount');if(!c){clearInterval(retakeT);return}c.textContent=n;if(n<=0)startRetake()},1000)}
  const s=await sendRow(p,q,passed,code,ts,T.attempt);const el=$('#twSent');if(el)el.textContent=s==='sent'?'✅ ส่งคะแนนถึงครูแล้ว':s==='queued'?'📶 ยังส่งไม่ได้ (ไม่มีอินเทอร์เน็ต) ระบบจะลองส่งใหม่':s==='teacher'?'👩‍🏫 โหมดครู: ทดลองทำ ไม่ส่งคะแนน (นักเรียนจะเห็นหน้านี้เหมือนกันทุกอย่าง)':'บันทึกในเครื่องนี้แล้ว'}
function startRetake(){clearInterval(retakeT);T.qa=[];T.qi=0;{const d=drawSet();T.order=d.order;T.opt=d.opt}T.stage='quiz';drawTest();const tb=$('.tbody');if(tb)tb.scrollTop=0}
document.addEventListener('input',e=>{const t=e.target;if(T&&(t.classList.contains('tw-in')||t.classList.contains('tw-sel'))){T.ans[+t.dataset.k]=t.value;const s=$('.tw-top span');if(s)s.textContent='ตอบแล้ว '+answered()+'/'+T.items.length}});
document.addEventListener('change',e=>{const t=e.target;if(T&&t.classList.contains('tw-sel')){T.ans[+t.dataset.k]=t.value;const s=$('.tw-top span');if(s)s.textContent='ตอบแล้ว '+answered()+'/'+T.items.length}});
document.addEventListener('click',e=>{const t=e.target;if(!T)return;
  const c=t.closest('.tw-ch button');if(c){T.ans[+c.dataset.k]=+c.dataset.o;c.parentNode.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===c));const s=$('.tw-top span');if(s)s.textContent='ตอบแล้ว '+answered()+'/'+T.items.length;return}
  if(t.id==='twToQuiz'){T.stage='quiz';drawTest();$('.tbody').scrollTop=0;return}
  const q=t.closest('[data-tq]');if(q&&!T.lock){T.lock=1;T.qa[T.qi]=+q.dataset.tq;q.classList.add('pick');
    setTimeout(()=>{T.lock=0;T.qi++;if(T.qi>=T.order.length)T.stage='check';drawTest();$('.tbody').scrollTop=0},450);return}
  if(t.id==='twBack'){if(T.qi>0)T.qi--;else T.stage='wb';drawTest();return}
  if(t.id==='twEdit'){T.stage='wb';drawTest();$('.tbody').scrollTop=0;return}
  if(t.id==='twSend'){submitTest();$('.tbody').scrollTop=0;return}
  if(t.id==='twRetry'){startRetake();return}
  if(t.id==='twAgain'){initTest();$('.tbody').scrollTop=0;return}
});

/* ===== teacher: results of the self-test ===== */
async function initResults(){const b=$('#rsBody');if(!b)return;let pin='';try{pin=sessionStorage.getItem('m3:tp')||''}catch(e){}
  b.innerHTML='<p>กำลังโหลด…</p>';
  try{const r=await fetch(`${CFG.supabaseUrl}/rest/v1/rpc/${CFG.teacherFn}`,{method:'POST',headers:{apikey:CFG.supabaseKey,Authorization:`Bearer ${CFG.supabaseKey}`,'Content-Type':'application/json'},body:JSON.stringify({p_pin:pin,p_unit:'unit'+unit.n+'-test'})});
    if(!r.ok)throw new Error(r.status===400||r.status===404?'ต้องเข้าโหมดครูด้วยรหัสจากหน้าแรกก่อน':'โหลดไม่ได้ ('+r.status+')');
    const rows=(await r.json()).slice().sort((a,b)=>String(a.created_at).localeCompare(String(b.created_at)));const by={};
    rows.forEach(x=>{const k=(x.class||'')+'|'+(x.student_no||'')+'|'+x.student_name;(by[k]=by[k]||{c:x.class,no:x.student_no,n:x.student_name,first:x,last:x,times:0,codes:[]});by[k].last=x;by[k].times++;if((x.detail||{}).code)by[k].codes.push(x.detail.code)});
    const list=Object.values(by).sort((a,b)=>String(a.c).localeCompare(String(b.c))||(parseInt(a.no)||0)-(parseInt(b.no)||0));
    if(!list.length){b.innerHTML='<p class="sub">ยังไม่มีนักเรียนส่งแบบฝึก + สอบย่อย ของหน่วยนี้</p>';return}
    const d=x=>x.detail||{};
    b.innerHTML=`<div class="row" style="margin-bottom:8px"><b>${list.length} คน</b><span style="flex:1"></span><button class="btn alt" id="rsCsv">⬇️ ดาวน์โหลด CSV</button></div>
    <div class="rs-wrap"><table class="rs"><tr><th>ห้อง</th><th>เลขที่</th><th>ชื่อ</th><th>แบบฝึก</th><th>สอบย่อย</th><th>รวม (ครั้งแรก)</th><th>%</th><th>ทำ</th><th>รหัสตรวจสอบ (ทุกครั้ง)</th><th>ส่งล่าสุด</th></tr>
    ${list.map(s=>{const f=s.first,p=Math.round(f.score/f.max_score*100);return `<tr><td>${esc(s.c)}</td><td>${esc(s.no)}</td><td>${esc(s.n)}</td><td>${d(f).wb}/${d(f).wbMax}</td><td>${d(f).quiz}/${d(f).quizMax}</td><td><b>${f.score}/${f.max_score}</b></td><td class="${p>=70?'ok':'no'}">${p}%</td><td>${s.times}</td><td>${s.codes.map(c=>esc(c.slice(0,3)+'-'+c.slice(3))).join(' ')}</td><td>${esc(new Date(s.last.created_at).toLocaleString('th-TH',{dateStyle:'short',timeStyle:'short'}))}</td></tr>`}).join('')}</table></div>`;
    $('#rsCsv').onclick=()=>{const csv='\ufeffห้อง,เลขที่,ชื่อ,แบบฝึก,สอบย่อย,รวม,เต็ม,เปอร์เซ็นต์,จำนวนครั้ง,รหัสตรวจสอบ\n'+list.map(s=>{const f=s.first;return [s.c,s.no,s.n,d(f).wb,d(f).quiz,f.score,f.max_score,Math.round(f.score/f.max_score*100),s.times,s.codes.join(' ')].map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')}).join('\n');
      const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='unit'+unit.n+'-results.csv';a.click()}
  }catch(er){b.innerHTML=`<div class="fb"><b class="no">${esc(er.message)}</b></div>`}}

/* unit quiz */
let qz=0,qzScore=0,qzDone=[];
function pickQuiz(n){const B=unit.quiz||[];return shuffle(B.map((_,i)=>i)).slice(0,Math.min(n||10,B.length)).map(i=>{const q=B[i],p=shuffle(q[1].map((_,k)=>k));return [q[0],p.map(k=>q[1][k]),p.indexOf(q[2]),q[3]]})}
let TQ=[];
function initQuiz(){qz=0;qzScore=0;qzDone=[];TQ=pickQuiz(10);drawQuiz()}
function drawQuiz(){const Q=TQ;const b=$('#qzBody');if(!b)return;
  if(qz>=Q.length){b.innerHTML=`<div class="qzend"><div class="big">🏁</div><h3>จบแบบทดสอบ</h3><p>ทั้งห้องตอบถูก <b>${qzScore}</b> / ${Q.length} ข้อ</p><button class="btn big" id="qzAgain">↺ เริ่มใหม่</button></div>`;confetti(120);return}
  const q=Q[qz];b.innerHTML=`<div class="row"><span class="qzn">ข้อ ${qz+1} / ${Q.length}</span><span style="flex:1"></span><span class="qzn">✔ ${qzScore}</span></div>
   <div class="qzq">${md(q[0])} <button class="spk" data-say="${esc(q[0])}">🔊</button></div>
   <div class="qzo">${q[1].map((o,i)=>`<button data-qa="${i}" class="c${i}"><i>${'ABCD'[i]}</i>${md(o)}</button>`).join('')}</div>
   <div class="fb" id="qzFb"></div>
   <div class="row" style="justify-content:center"><button class="btn alt" id="qzShow">🔑 เฉลย</button><button class="btn" id="qzNext">ข้อต่อไป →</button></div>`}
document.addEventListener('click',e=>{const t=e.target;if(!unit)return;
  const a=t.closest('[data-qa]');if(a){const q=TQ[qz];const ok=+a.dataset.qa===q[2];if(qzDone[qz]==null){qzDone[qz]=ok;if(ok)qzScore++}
    $$('#qzBody [data-qa]').forEach(b=>b.classList.toggle('ok',+b.dataset.qa===q[2]));if(!ok)a.classList.add('no');
    $('#qzFb').innerHTML=`<b class="${ok?'ok':'no'}">${ok?'✅ ถูกต้อง!':'❌ ยังไม่ใช่'}</b> คำตอบ <b>${'ABCD'[q[2]]}</b> — ${q[3]||''}`;if(ok)confetti(50);return}
  if(t.id==='qzShow'){const q=TQ[qz];$$('#qzBody [data-qa]').forEach(b=>b.classList.toggle('ok',+b.dataset.qa===q[2]));$('#qzFb').innerHTML=`คำตอบ <b>${'ABCD'[q[2]]}</b> — ${q[3]||''}`;return}
  if(t.id==='qzNext'){qz++;drawQuiz();return}
  if(t.id==='qzAgain'){initQuiz();return}
  if(t.id==='qzPrint'){printQuiz();return}
});
function printQuiz(){const Q=pickQuiz(10);let fr=document.getElementById('printFrame');if(!fr){fr=document.createElement('iframe');fr.id='printFrame';fr.style.cssText='position:fixed;width:0;height:0;border:0;right:0;bottom:0';document.body.appendChild(fr)}const w={document:fr.contentWindow.document};
  const st=s=>String(s).replace(/\*\*/g,'');
  w.document.write(`<!doctype html><meta charset="utf-8"><title>Unit ${unit.n} Quiz</title><style>body{font-family:Sarabun,Tahoma,sans-serif;max-width:760px;margin:30px auto;padding:0 20px;font-size:17px;line-height:1.5}h1{font-size:24px;margin:0}.hd{display:flex;justify-content:space-between;border-bottom:2px solid #333;padding-bottom:8px;margin-bottom:14px}ol>li{margin:0 0 12px}.op{display:grid;grid-template-columns:1fr 1fr;gap:2px 20px;margin-top:4px}.key{page-break-before:always}</style>
  <div class="hd"><div><h1>Unit ${unit.n} ${unit.title} – Quiz</h1>Get Involved! M3 · อ23102</div><div>ชื่อ ..............................<br>ชั้น ......... เลขที่ ......... คะแนน ...... / ${Q.length}</div></div>
  <ol>${Q.map(q=>`<li>${st(q[0])}<div class="op">${q[1].map((o,i)=>`<span>${'abcd'[i]}) ${st(o)}</span>`).join('')}</div></li>`).join('')}</ol>
  <div class="key"><h1>เฉลย Unit ${unit.n}</h1><ol>${Q.map(q=>`<li><b>${'abcd'[q[2]]}</b> ${st(q[1][q[2]])} — ${q[3]||''}</li>`).join('')}</ol></div>`);w.document.close();setTimeout(()=>{try{fr.contentWindow.focus();fr.contentWindow.print()}catch(e){}},400)}

/* media */
function initMedia(){const m=unit.media;if(!m)return;const key='teach:media:u'+unit.n;const done=LS.get(key,{});
  const row=(x,k)=>`<label class="mi ${done[k]?'done':''}"><input type="checkbox" data-k="${k}" ${done[k]?'checked':''}><div><div class="mt">${x[0]}</div><div class="md">${x[1]}</div>${x[2]?`<a class="open" href="${x[2]}">เปิด ↗</a>`:''}</div></label>`;
  $('#mHand').innerHTML=m.hand.map((x,i)=>row(x,'h'+i)).join('');$('#mOnline').innerHTML=m.online.map((x,i)=>row(x,'o'+i)).join('');
  const prog=()=>{const d=LS.get(key,{});const n=Object.values(d).filter(Boolean).length;$('#mProg').textContent=`เตรียมแล้ว ${n} / ${m.hand.length+m.online.length} รายการ`};prog();
  $('#t-media').onchange=e=>{const k=e.target.dataset.k;if(!k)return;const d=LS.get(key,{});d[k]=e.target.checked;LS.set(key,d);e.target.closest('.mi').classList.toggle('done',e.target.checked);prog()};
  $('#mReset').onclick=()=>{LS.set(key,{});initMedia()}}

/* confetti */
const cv=$('#conf'),cx=cv.getContext('2d');let parts=[],craf=null;
function confetti(n){if(document.body.classList.contains('noanim'))return;cv.width=innerWidth;cv.height=innerHeight;
  for(let i=0;i<n;i++)parts.push({x:innerWidth/2+(Math.random()-.5)*innerWidth*.5,y:innerHeight*.35,vx:(Math.random()-.5)*12,vy:-Math.random()*12-4,c:TC[i%10],r:Math.random()*6+4,a:Math.random()*6,l:90});
  if(!craf)loop()}
function loop(){cx.clearRect(0,0,cv.width,cv.height);parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.35;p.a+=.2;p.l--;cx.save();cx.translate(p.x,p.y);cx.rotate(p.a);cx.fillStyle=p.c;cx.fillRect(-p.r/2,-p.r/2,p.r,p.r*.6);cx.restore()});
  parts=parts.filter(p=>p.l>0&&p.y<innerHeight+20);craf=parts.length?requestAnimationFrame(loop):null;if(!craf)cx.clearRect(0,0,cv.width,cv.height)}

/* ================= ROUTER ================= */
function route(){if(location.hash==='#progress'){unit=null;showPicker();setTimeout(()=>{const p=$('#pkProg');p&&p.scrollIntoView({behavior:'smooth'})},200);return}
  const sm=location.hash.match(/^#u(\d+)\/([a-z]+\d?)$/);
  if(sm&&U[sm[1]]){const i=U[sm[1]].slides.findIndex(s=>s.sec===sm[2]);location.replace('#u'+sm[1]+'/'+(Math.max(0,i)+1));return}
  const m=location.hash.match(/^#u(\d+)(?:\/(\d+))?/);
  if(m){const n=+m[1];if(!unit||unit.n!==n)openUnit(n,(+m[2]||1)-1);else if(m[2]&&+m[2]-1!==idx)go(+m[2]-1)}else{unit=null;showPicker()}}
addEventListener('hashchange',route);
if(window.TEACH_HOME){const a=$('#pkHome');if(a){a.href=window.TEACH_HOME;a.classList.remove('hidden')}}
route();
window.TEACH={go,next,revealAll,openTool,closeTool,get state(){return{unit:unit&&unit.n,idx,si,steps:steps.length}}};
})();
