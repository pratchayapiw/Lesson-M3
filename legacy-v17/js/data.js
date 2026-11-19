const UNIT1={
id:1,title:"Unit 1: Present Time",subtitle:"Present Simple • Present Continuous • Stative Verbs",
vocabulary:[
{group:"Media & Entertainment",items:[["video game","วิดีโอเกม"],["documentary","สารคดี"],["music video","มิวสิกวิดีโอ"],["sports show","รายการกีฬา"],["romantic movie","ภาพยนตร์โรแมนติก"],["travel show","รายการท่องเที่ยว"],["science-fiction movie","ภาพยนตร์วิทยาศาสตร์"],["cooking show","รายการทำอาหาร"]]},
{group:"Useful Words",items:[["achievement","ความสำเร็จ"],["advertisement","โฆษณา"],["information","ข้อมูล"],["competition","การแข่งขัน"],["improve","ปรับปรุง/พัฒนา"],["invite","เชิญ"],["invention","สิ่งประดิษฐ์"],["agree","เห็นด้วย"]]}
],
grammar:[
{id:"g1",title:"Grammar 1: Present Simple",content:["ใช้พูดถึงกิจวัตร ความจริงทั่วไป และสถานการณ์ที่เป็นประจำ","รูปประโยค: S + V1(s/es)","ปฏิเสธ: do/does not + V1","คำถาม: Do/Does + subject + V1?","Signal words: always, usually, often, sometimes, never, every day"],attachment:""},
{id:"g2",title:"Grammar 2: Present Continuous",content:["ใช้พูดถึงสิ่งที่กำลังเกิดขึ้นตอนนี้ หรือสถานการณ์ชั่วคราว","รูปประโยค: S + am/is/are + V-ing","ปฏิเสธ: am/is/are not + V-ing","คำถาม: Am/Is/Are + subject + V-ing?","Signal words: now, right now, at the moment, today"],attachment:""},
{id:"g3",title:"Grammar 3: Stative Verbs",content:["กริยาที่บอกสภาวะ ความรู้สึก ความคิด หรือการครอบครอง","ตัวอย่าง: know, believe, understand, want, need, like, love, hate, prefer, remember, own, belong","โดยทั่วไปไม่ใช้ในรูป continuous เช่น I know the answer."],attachment:""}
],
vocabActivities:[
{id:"v1",title:"Flash Match",level:"ง่าย",desc:"เปิดการ์ดและจับคู่คำศัพท์กับความหมาย",points:5},
{id:"v2",title:"Meaning Rush",level:"ง่าย",desc:"เลือกความหมายภาษาไทยให้ตรงกับคำศัพท์ภายในเวลาที่กำหนด",points:5},
{id:"v3",title:"Spell It!",level:"ปานกลาง",desc:"ฟัง/ดูคำใบ้ แล้วเรียงตัวอักษรให้สะกดคำศัพท์ถูกต้อง",points:10},
{id:"v4",title:"Word Challenge",level:"ปานกลาง",desc:"อ่านสถานการณ์แล้วเลือกคำศัพท์ที่เหมาะสมที่สุด",points:10}
],
grammarActivities:[
{id:"a1",title:"Grammar Sort",desc:"แยกประโยคให้ถูกว่าเป็น Present Simple หรือ Present Continuous",points:10},
{id:"a2",title:"Sentence Builder",desc:"เรียงคำให้เป็นประโยคที่ถูกต้อง",points:10},
{id:"a3",title:"Grammar Escape",desc:"ผ่านด่าน 5 ข้อเพื่อปลดล็อกคำตอบสุดท้าย",points:15}
],
test:[
["My brother ___ football every Sunday.","plays",["play","plays","is playing","played"],1],
["Look! She ___ a music video.","is watching",["watches","watched","is watching","watch"],2],
["I ___ the answer.","know",["am knowing","know","knowing","am know"],1],
["We ___ documentaries every week.","watch",["are watching","watched","watch","have watched"],2],
["They ___ TV right now.","are watching",["watch","watched","are watching","watches"],2],
["She ___ romantic movies.","likes",["is liking","like","likes","liking"],2],
["Which word means 'สารคดี'?","documentary",["advertisement","documentary","competition","invention"],1],
["Which word means 'ความสำเร็จ'?","achievement",["achievement","information","improve","invite"],0],
["Choose the correct question.","Does he play tennis?",["Does he plays tennis?","Does he play tennis?","Is he play tennis?","He does play tennis?"],1],
["Choose the correct negative sentence.","They aren't reading now.",["They don't reading now.","They aren't read now.","They aren't reading now.","They not are reading now."],2]
]};
const DEFAULT_SETTINGS={unitOpen:true,sections:{vocab:true,vocabPractice:true,grammar:true,g1:true,g2:true,g3:true,grammarPractice:true,test:true}};
function settings(){return JSON.parse(localStorage.getItem("m3Unit1Settings")||JSON.stringify(DEFAULT_SETTINGS))}
function saveSettings(s){localStorage.setItem("m3Unit1Settings",JSON.stringify(s))}
