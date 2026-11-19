const state={role:'student',subject:'English',className:'M.3'};
const roleNames={student:'นักเรียน',teacher:'ครู'};
const $=s=>document.querySelector(s);
function bind(selector,key){document.querySelectorAll(selector).forEach(el=>el.addEventListener('click',()=>{state[key]=el.dataset[key];document.querySelectorAll(selector).forEach(x=>x.classList.remove('active'));el.classList.add('active');update()}))}
bind('[data-role]','role');bind('[data-subject]','subject');bind('[data-class]','className');
function update(){$('#sumRole').textContent=roleNames[state.role];$('#sumSubject').textContent=state.subject;$('#sumClass').textContent=state.className;$('#notice').textContent=''}
$('#enterBtn').addEventListener('click',()=>{localStorage.setItem('m3PortalSelection',JSON.stringify(state));if(state.role==='teacher'){location.href='teacherdashboard.html';return}if(state.subject==='English'&&state.className==='M.3'){location.href='student.html'}else $('#notice').textContent='บทเรียนสำหรับระดับชั้นนี้กำลังเตรียมระบบ'});update();
