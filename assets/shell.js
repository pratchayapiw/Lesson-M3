/* Shared sidebar shell. Usage:
   <script src="../assets/shell.js" data-root="../" data-wrap="#target" data-active="units"></script>
   Wraps the target (default: body) in the pink sidebar layout used by the home page. */
(function(){
  const me_=document.currentScript, R=me_.dataset.root||'', W=me_.dataset.wrap, ACT=me_.dataset.active||'', EMBED=me_.dataset.mode==='embed';
  const css=document.createElement('link');css.rel='stylesheet';css.href=me_.dataset.css||R+'assets/shell.css';document.head.appendChild(css);
  let teacher=false,me=null;
  try{teacher=sessionStorage.getItem('m3:t')==='1'}catch(e){}
  try{me=JSON.parse(localStorage.getItem('m3:me')||'null')}catch(e){}
  const I={home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',units:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
    slides:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8M10 8l4 2-4 2z"/>',prog:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',test:'<path d="M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>'};
  const svg=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${I[k]}</svg>`;
  const items=EMBED
    ?[['teach','#','slides','สไลด์สอน 8 หน่วย'],['hr'],['site',R,'home','เปิดเว็บไซต์เต็ม ↗']]
    :teacher
    ?[['home',R+'index.html#home','home','Home'],['units',R+'index.html#contents','units','Learning Units'],['teach',R+'teach/','slides','บทเรียน / สไลด์สอน'],['results',R+'unit6/#teacher-results','prog','ผลนักเรียน'],['map',R+'unit6/#map','test','ดูบทเรียน'],['hr'],['user',R+'index.html#login','user','ผู้ใช้งาน']]
    :[['home',R+'index.html#home','home','Home'],['units',R+'index.html#contents','units','Learning Units'],['teach',R+'teach/','slides','บทเรียนทุกหน่วย'],['map',R+'unit6/#map','test','Practice & Tests'],['summary',R+'unit6/#summary','prog','My Progress'],['hr'],['user',R+'index.html#login','user','ผู้ใช้งาน']];
  if(EMBED)teacher=true;
  const name=teacher?'Kru Pratchaya':me?me.name:'เลือกผู้ใช้งาน';
  const av=teacher?'KP':me?String(me.name).trim().slice(0,2):'?';
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function active(){const h=(location.hash||'').replace('#','').split('/')[0];
    if(ACT)return ACT; if(h==='teacher-results')return 'results'; if(h==='teacher')return teacher?'teach':'';
    if(['slides','summary'].includes(h))return h; return 'map';}
  function build(){
    const host=W?document.querySelector(W):document.body; if(!host)return;
    const wrap=document.createElement('div');wrap.className='shx';
    wrap.innerHTML=`<aside class="shx-side"><svg class="bloom" viewBox="0 0 250 130" aria-hidden="true"><g fill="#ffd3df"><circle cx="18" cy="16" r="10"/><circle cx="40" cy="8" r="7"/><circle cx="226" cy="22" r="9"/><circle cx="206" cy="10" r="6"/><circle cx="240" cy="52" r="6"/></g></svg>
      <div class="shx-brand"><div class="shx-crest">WR</div><b>Woraratchatinadamatuwittaya</b><small>อ23102 · ม.3 · ภาคเรียนที่ 2/2569</small></div>
      <nav class="shx-nav"></nav><p class="shx-foot">Get Involved! ม.3<br>ครูปรัชญา ทรงบรรพต</p></aside>
      <div class="shx-dim"></div>
      <div class="shx-main"><div class="shx-top"><button class="shx-menu" type="button">☰ เมนู</button><span class="sp"></span>
        <a class="shx-hello" ${EMBED?'':`href="${R}index.html#login"`}><span class="bell">🔔</span><span><small>Welcome!</small><b>${esc(name)}</b></span><span class="shx-av">${esc(av)}</span></a></div></div>`;
    const main=wrap.querySelector('.shx-main');
    while(host.firstChild){const n=host.firstChild;if(n.nodeName==='SCRIPT'&&host===document.body){break}main.appendChild(n)}
    host.insertBefore(wrap,host.firstChild);
    const nav=wrap.querySelector('.shx-nav');
    const draw=()=>{const a=active();nav.innerHTML=items.map(x=>x[0]==='hr'?'<hr>':`<a href="${x[1]}" ${x[0]==='site'?'target="_blank" rel="noopener"':''} class="${x[0]===a?'on':''}">${svg(x[2])}${x[3]}</a>`).join('')};
    draw();addEventListener('hashchange',draw);
    wrap.querySelector('.shx-menu').onclick=()=>wrap.classList.toggle('open');
    wrap.querySelector('.shx-dim').onclick=()=>wrap.classList.remove('open');
    nav.addEventListener('click',()=>wrap.classList.remove('open'));
    const p=document.createElement('div');p.className='shx-petals';p.setAttribute('aria-hidden','true');
    for(let i=0;i<10;i++)p.innerHTML+=`<i style="left:${(i*97)%100}%;animation-duration:${14+i%5*3}s;animation-delay:${-i*2.3}s"></i>`;
    document.body.appendChild(p);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();
