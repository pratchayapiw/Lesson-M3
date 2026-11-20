/* M3 Teaching Hub — slide engine + classroom tools.
   Unit content lives in units/uN.js (window.TEACH_UNITS[n]). */
(function(){
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const U=window.TEACH_UNITS||{};
const A=window.TEACH_ASSETS||'../assets/';
const PAL={1:['#e2457a','#ffe3ee'],2:['#e8763a','#ffe6d2'],3:['#e7a21d','#fff1c9'],4:['#8b5cd6','#ece0ff'],5:['#4f9b3a','#e2f4d7'],6:['#3a7fd0','#dceeff'],7:['#d9467a','#ffe0ec'],8:['#3a8fd0','#dcefff']};
for(const n in U){if(PAL[n]){U[n].color=PAL[n][0];U[n].light=PAL[n][1]}}
const IMG=n=>A+'icons/unit'+n+'.png';
/* ---- Grammar: Question → Guided discovery stages ---- */
const GSTEPS=[['q','❓','Question'],['notice','👀','Notice'],['compare','⚖️','Compare'],['meaning','💡','Meaning'],['detect','🚨','Detective'],['rule','🧩','Rule'],['practice','✍️','Practice']];
function expandGD(u){
  const G=(window.TEACH_GD||{})[u.n];
  if(G){for(const k of ['gram','gram2']){if(!G[k])continue;const i=u.slides.findIndex(s=>s.sec===k);if(i<0)continue;
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
  }
  u.slides=out;
}
for(const n in U)expandGD(U[n]);
const SEC={
  warm:['Warm-up','อุ่นเครื่อง','#e07a2e'], vocab:['Vocabulary','คำศัพท์','#d9493f'], read:['Reading','การอ่าน','#2f6fb3'],
  gram:['Grammar 1','ไวยากรณ์ 1','#2f8a4f'], listen:['Listening','การฟัง','#7b4bb5'], vocab2:['Vocabulary 2','คำศัพท์ 2','#c2410c'],
  gram2:['Grammar 2','ไวยากรณ์ 2','#13867a'], speak:['Speaking','การพูด','#c94f7c'], write:['Writing','การเขียน','#a0662b'], review:['Review','ทบทวน','#4b5563']
};
const TOOLS={timer:'⏲️ จับเวลา',picker:'🎯 สุ่มเลขที่',score:'🏆 คะแนนกลุ่ม',flash:'🃏 แฟลชการ์ด',sort:'🔀 เกมแยกประเภท',detect:'🚨 จับผิดประโยค',puzzle:'🧩 สร้างสูตร',scramble:'🔤 เรียงประโยค',media:'📦 สื่อการสอน'};
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
let VOICES=[];
function loadVoices(){try{VOICES=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang))}catch(e){}}
try{loadVoices();speechSynthesis.onvoiceschanged=loadVoices}catch(e){}
function say(text,o={}){
  try{
    const u=new SpeechSynthesisUtterance(plain(text));
    u.lang='en-US';u.rate=o.rate||0.88;u.pitch=o.pitch||1;
    const pref=VOICES.filter(v=>/en-US|en-GB/.test(v.lang));
    const list=pref.length?pref:VOICES;
    if(list.length)u.voice=list[(o.v||0)%list.length];
    if(o.end)u.onend=o.end;
    if(!o.queue)speechSynthesis.cancel();
    speechSynthesis.speak(u);
    return u;
  }catch(e){o.end&&setTimeout(o.end,600)}
}
window.TSAY=say;

/* ---- state ---- */
let unit=null, idx=0, steps=[], si=0, notesOn=true;
const app=$('#app'), pickpage=$('#pickpage');

/* ================= UNIT PICKER ================= */
function showPicker(){
  app.classList.add('hidden');pickpage.classList.remove('hidden');
  document.title='Teaching Hub · Get Involved! M3';
  const g=$('#pkGrid');
  g.innerHTML=Object.keys(U).sort((a,b)=>a-b).map(n=>{const u=U[n];return `
   <button class="pk-card" data-u="${n}" style="--uc:${u.color};--ubg:${u.light}">
     <div class="pk-art"><span class="pk-term">เทอม ${u.term}</span><img src="${IMG(n)}" alt=""><span class="pk-pill">Unit ${n}</span></div>
     <div class="pk-body"><h3>${u.title}</h3><div class="th">${u.th}</div><div class="g">${u.gram}</div><div class="n">📽️ ${u.slides.length} สไลด์ · 🧰 เครื่องมือ ${3+['flash','sort','detect','puzzle','scramble','media'].filter(k=>u[k]).length} ชุด</div></div>
   </button>`}).join('');
  g.onclick=e=>{const b=e.target.closest('.pk-card');if(b)location.hash='u'+b.dataset.u};
}

/* ================= OPEN UNIT ================= */
function openUnit(n,s){
  unit=U[n];if(!unit){showPicker();return}
  pickpage.classList.add('hidden');app.classList.remove('hidden');
  document.title=`Unit ${n} ${unit.title} · Teaching Hub`;
  const r=document.documentElement.style;
  r.setProperty('--u',unit.color);r.setProperty('--u2',unit.light);
  $('#brandT').innerHTML=`${unit.art[0]} Unit ${n} · ${unit.title} <small>${unit.th}</small>`;
  // phases
  const secs=[];unit.slides.forEach((sl,i)=>{if(!secs.find(x=>x.k===sl.sec))secs.push({k:sl.sec,i})});
  unit._secs=secs;
  $('#phases').innerHTML=secs.map(x=>{const d=SEC[x.k];return `<button class="ph" data-k="${x.k}" data-i="${x.i}" style="background:${d[2]}" title="${d[1]}"><b>${d[0]}</b><span>${d[1]}</span></button>`}).join('');
  $('#phases').onclick=e=>{const b=e.target.closest('.ph');if(b)go(+b.dataset.i)};
  $('#thumbs').innerHTML=unit.slides.map((sl,i)=>`<button class="tb" data-i="${i}"><b>${i+1}</b><span>${esc(plain(sl.title))}</span><i style="background:${SEC[sl.sec][2]}"></i></button>`).join('');
  $('#thumbs').onclick=e=>{const b=e.target.closest('.tb');if(b)go(+b.dataset.i)};
  buildTools();
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
   return `<div class="sl">${head(sl,'Discovery · ค้นพบกฎด้วยตนเอง')}<div class="body"><div class="disc">
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
  steps=[...el.querySelectorAll('.st,.gp,.fc,.mk')].filter(x=>!(sl.type==='cards'&&sl.noflip&&x.classList.contains('fc')));
  si=0;updCounter();
  // phases + thumbs
  $$('.ph').forEach(b=>b.classList.toggle('on',b.dataset.k===sl.sec));
  $$('.tb').forEach(b=>b.classList.toggle('on',+b.dataset.i===idx));
  const th=$(`.tb[data-i="${idx}"]`);th&&th.scrollIntoView({block:'nearest',inline:'center'});
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
   ${(sl.tools||[]).length?`<div class="nsec">🧰 เครื่องมือของสไลด์นี้</div>${sl.tools.map(t=>`<button class="toolbtn" data-tool="${t}">${TOOLS[t]}</button>`).join('')}`:''}
   <div class="keys"><kbd>→</kbd>/<kbd>Space</kbd> เฉลยทีละขั้น แล้วไปสไลด์ถัดไป · <kbd>←</kbd> ย้อน · <kbd>A</kbd> เฉลยทั้งหมด · <kbd>H</kbd> ซ่อนเฉลย · <kbd>T</kbd> จับเวลา · <kbd>R</kbd> สุ่มเลขที่ · <kbd>F</kbd> เต็มจอ · <kbd>N</kbd> บทสอน</div>`;
}
function renderQuick(sl){
  $('#quick').innerHTML=(steps.length?`<button class="rv" id="qReveal">✨ เฉลย (→)</button>`:'')+(sl.tools||[]).slice(0,3).map(t=>`<button data-tool="${t}">${TOOLS[t]}</button>`).join('');
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
$('#notesBtn').onclick=()=>{notesOn=!notesOn;$('#main').classList.toggle('nonotes',!notesOn);$('#notesBtn').classList.toggle('on',notesOn);setTimeout(fit,30)};
$('#toolsBtn').onclick=()=>openTool(curTool||'timer');
$('#animBtn').onclick=()=>{document.body.classList.toggle('noanim');$('#animBtn').classList.toggle('on',!document.body.classList.contains('noanim'))};
$('#fsBtn').onclick=toggleFS;
function toggleFS(){try{if(!document.fullscreenElement)document.documentElement.requestFullscreen();else document.exitFullscreen()}catch(e){}setTimeout(fit,200)}
document.addEventListener('fullscreenchange',()=>setTimeout(fit,100));
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
function availTools(){return Object.keys(TOOLS).filter(k=>['timer','picker','score'].includes(k)||unit[k])}
function buildTools(){
  const av=availTools();unit.toolsCount=av.length;
  $('#tabs').innerHTML=av.map(k=>`<button class="tab" data-tab="${k}">${TOOLS[k]}</button>`).join('');
  $('#tabs').onclick=e=>{const b=e.target.closest('.tab');if(b)openTool(b.dataset.tab)};
  initFlash();initSort();initDetect();initPuzzle();initScramble();initMedia();drawTeams();
}
function openTool(k){
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

/* media */
function initMedia(){const m=unit.media;if(!m)return;const key='teach:media:u'+unit.n;const done=LS.get(key,{});
  const row=(x,k)=>`<label class="mi ${done[k]?'done':''}"><input type="checkbox" data-k="${k}" ${done[k]?'checked':''}><div><div class="mt">${x[0]}</div><div class="md">${x[1]}</div>${x[2]?`<a class="open" href="${x[2]}" target="_blank" rel="noopener">เปิด ↗</a>`:''}</div></label>`;
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
function route(){const m=location.hash.match(/^#u(\d+)(?:\/(\d+))?/);
  if(m){const n=+m[1];if(!unit||unit.n!==n)openUnit(n,(+m[2]||1)-1);else if(m[2]&&+m[2]-1!==idx)go(+m[2]-1)}else{unit=null;showPicker()}}
addEventListener('hashchange',route);
if(window.TEACH_HOME){const a=$('#pkHome');if(a){a.href=window.TEACH_HOME;a.classList.remove('hidden')}}
route();
window.TEACH={go,next,revealAll,openTool,closeTool,get state(){return{unit:unit&&unit.n,idx,si,steps:steps.length}}};
})();
