/* ============================================================
   UNIT 4 — SPEND 💰  |  Grammar Core
   L6 Comparative · L7 Superlative · L8 (not) as...as · L9 Mixed
   ============================================================ */
const U4 = {
  id: 4, title: "SPEND", th: "การใช้จ่ายและการเปรียบเทียบ", color: "#fbbf24",

  /* ---------- ตารางอ้างอิงกลาง ---------- */
  adjTable: [
    { adj:"cheap",     comp:"cheaper",        sup:"the cheapest",       rule:"short" },
    { adj:"small",     comp:"smaller",        sup:"the smallest",       rule:"short" },
    { adj:"big",       comp:"bigger",         sup:"the biggest",        rule:"double" },
    { adj:"hot",       comp:"hotter",         sup:"the hottest",        rule:"double" },
    { adj:"happy",     comp:"happier",        sup:"the happiest",       rule:"y→i" },
    { adj:"healthy",   comp:"healthier",      sup:"the healthiest",     rule:"y→i" },
    { adj:"expensive", comp:"more expensive", sup:"the most expensive", rule:"long" },
    { adj:"important", comp:"more important", sup:"the most important", rule:"long" },
    { adj:"popular",   comp:"more popular",   sup:"the most popular",   rule:"long" },
    { adj:"good",      comp:"better",         sup:"the best",           rule:"irregular" },
    { adj:"bad",       comp:"worse",          sup:"the worst",          rule:"irregular" },
    { adj:"far",       comp:"farther",        sup:"the farthest",       rule:"irregular" }
  ],

  /* ============ LESSON 6 : COMPARATIVE ============ */
  L6: {
    key:"L6", icon:"⚖️", title:"Comparative Adjectives", th:"เปรียบเทียบ 2 สิ่ง",
    concept: [
      { h:"ใช้เมื่อไร", b:"เปรียบเทียบของ <b>2 สิ่ง</b> ว่าอันไหนมากกว่า/น้อยกว่า" },
      { h:"โครงสร้าง",  b:"A + is/are + <b>adj-er / more + adj</b> + <b>than</b> + B" }
    ],
    rules: [
      { r:"คำสั้น (1 พยางค์)", f:"+ er",            ex:"cheap → cheap<b>er</b>" },
      { r:"สระเดี่ยว+ตัวสะกดเดี่ยว", f:"ซ้ำตัวสะกด + er", ex:"big → bi<b>gger</b>" },
      { r:"ลงท้าย -y",        f:"y → i + er",       ex:"happy → happ<b>ier</b>" },
      { r:"คำยาว (2+ พยางค์)", f:"more + adj",       ex:"<b>more</b> expensive" },
      { r:"คำพิเศษ",          f:"จำเป็นรูป",         ex:"good → <b>better</b> / bad → <b>worse</b>" }
    ],
    examples: [
      "A phone is <b>more expensive than</b> a watch.",
      "A bike is <b>cheaper than</b> a car.",
      "Fruit is <b>healthier than</b> candy.",
      "This bag is <b>bigger than</b> that one.",
      "My score is <b>better than</b> yours."
    ],
    ex: [
      { type:"fill", q:"A car is ______ (expensive) than a bicycle.", a:["more expensive"] },
      { type:"fill", q:"A pencil is ______ (cheap) than a pen.",      a:["cheaper"] },
      { type:"fill", q:"Vegetables are ______ (healthy) than chips.", a:["healthier"] },
      { type:"fill", q:"My bag is ______ (big) than your bag.",       a:["bigger"] },
      { type:"fill", q:"This phone is ______ (good) than that one.",  a:["better"] },
      { type:"mcq",  q:"A computer is ______ a notebook.", opts:["more heavy than","heavier than","the heaviest"], a:1 },
      { type:"rewrite", q:"Phone A = ฿5,000 / Phone B = ฿8,000 → เขียนประโยคด้วย cheaper",
        a:["phone a is cheaper than phone b"], hint:"Phone A is ..." }
    ]
  },

  /* ============ LESSON 7 : SUPERLATIVE ============ */
  L7: {
    key:"L7", icon:"🏆", title:"Superlative Adjectives", th:"เปรียบเทียบ 3 สิ่งขึ้นไป",
    concept: [
      { h:"ใช้เมื่อไร", b:"เปรียบเทียบของ <b>3 สิ่งขึ้นไป</b> ว่าอันไหนที่สุด" },
      { h:"โครงสร้าง",  b:"A + is/are + <b>the</b> + adj-est / <b>the most</b> + adj" },
      { h:"ห้ามลืม",   b:"ต้องมี <b>the</b> เสมอ! ✅ the cheapest ❌ cheapest" }
    ],
    rules: [
      { r:"คำสั้น",    f:"the + adj + est", ex:"the cheap<b>est</b>" },
      { r:"ซ้ำตัวสะกด", f:"the + xx + est",  ex:"the bi<b>ggest</b>" },
      { r:"ลงท้าย -y", f:"the + i + est",   ex:"the happ<b>iest</b>" },
      { r:"คำยาว",     f:"the most + adj",  ex:"<b>the most</b> important" },
      { r:"คำพิเศษ",   f:"จำเป็นรูป",        ex:"the <b>best</b> / the <b>worst</b>" }
    ],
    examples: [
      "This is <b>the cheapest</b> phone in the shop.",
      "That is <b>the most expensive</b> item.",
      "She is <b>the happiest</b> person in class.",
      "This is <b>the worst</b> choice.",
      "Health is <b>the most important</b> thing."
    ],
    ex: [
      { type:"fill", q:"This is ______ (cheap) bag in the store.",     a:["the cheapest"] },
      { type:"fill", q:"He is ______ (happy) boy in the class.",       a:["the happiest"] },
      { type:"fill", q:"It is ______ (expensive) watch here.",         a:["the most expensive"] },
      { type:"fill", q:"That was ______ (bad) day of my life.",        a:["the worst"] },
      { type:"fill", q:"Money isn't ______ (important) thing.",        a:["the most important"] },
      { type:"mcq",  q:"Of the three shops, this one is ______.", opts:["cheaper","the cheapest","as cheap"], a:1 },
      { type:"rewrite", q:"A ฿200 · B ฿500 · C ฿900 → ข้อไหนแพงที่สุด (ใช้ expensive)",
        a:["c is the most expensive","item c is the most expensive"], hint:"C is ..." }
    ]
  },

  /* ============ LESSON 8 : (NOT) AS ... AS ============ */
  L8: {
    key:"L8", icon:"🟰", title:"(not) as … as", th:"เท่ากัน / ไม่เท่ากัน",
    concept: [
      { h:"เท่ากัน",     b:"A + is + <b>as</b> + adj + <b>as</b> + B" },
      { h:"ไม่เท่ากัน",  b:"A + <b>isn't</b> + <b>as</b> + adj + <b>as</b> + B" },
      { h:"⚠️ จุดที่เด็กพลาด", b:"ใช้ <b>adjective รูปธรรมดา</b> เท่านั้น ❌ as cheaper as ✅ as cheap as" }
    ],
    rules: [
      { r:"เท่ากัน",      f:"as + adj + as",      ex:"Math is <b>as difficult as</b> physics." },
      { r:"ไม่เท่ากัน",   f:"isn't as + adj + as", ex:"A phone <b>isn't as expensive as</b> a computer." },
      { r:"แปลงจาก Comparative", f:"A is cheaper than B = B isn't as cheap as A", ex:"สลับประธานด้วย!" }
    ],
    examples: [
      "Playing video games <b>isn't as exciting as</b> playing sports.",
      "A cell phone <b>isn't as expensive as</b> a computer.",
      "Math is <b>as difficult as</b> physics.",
      "My bedroom <b>isn't as clean as</b> the living room.",
      "Today is <b>as cold as</b> yesterday."
    ],
    ex: [
      { type:"fill", q:"A tablet isn't ______ ______ ______ (expensive) a laptop.", a:["as expensive as"] },
      { type:"fill", q:"Today is ______ ______ ______ (hot) yesterday. (เท่ากัน)",  a:["as hot as"] },
      { type:"mcq",  q:"เลือกประโยคที่ถูกต้อง",
        opts:["A bus isn't as faster as a train.","A bus isn't as fast as a train.","A bus isn't fast as a train."], a:1 },
      { type:"rewrite", q:"A car is more expensive than a bicycle. → A bicycle ______",
        a:["a bicycle isn't as expensive as a car","a bicycle is not as expensive as a car"], hint:"A bicycle isn't as ..." },
      { type:"rewrite", q:"Laptop ฿30,000 / Tablet ฿15,000 → เขียนด้วย (not) as ... as",
        a:["the tablet isn't as expensive as the laptop","tablet isn't as expensive as laptop","the tablet is not as expensive as the laptop"], hint:"The tablet isn't ..." }
    ]
  },

  /* ============ LESSON 9 : MIXED PRACTICE ============ */
  L9: {
    key:"L9", icon:"🧩", title:"Grammar Mixed Practice", th:"รวมทุกหัวข้อ + Quantifiers",
    concept: [
      { h:"รวมทุกอย่าง", b:"Comparative · Superlative · as…as · too much/many · enough" }
    ],
    rules: [
      { r:"too much", f:"+ นามนับไม่ได้", ex:"too much <b>money</b>" },
      { r:"too many", f:"+ นามนับได้พหูพจน์", ex:"too many <b>shops</b>" },
      { r:"enough",   f:"วางหลัง adj / หน้า noun", ex:"cheap <b>enough</b> · <b>enough</b> money" }
    ],
    examples: [
      "I spent <b>too much</b> money last month.",
      "There are <b>too many</b> people in the shop.",
      "I don't have <b>enough</b> money to buy it."
    ],
    ex: [
      { type:"fill", q:"I spent ______ money. (มากเกินไป)",                a:["too much"] },
      { type:"fill", q:"There are ______ shops in this mall. (เยอะเกินไป)", a:["too many"] },
      { type:"fill", q:"I don't have ______ money. (ไม่พอ)",               a:["enough"] },
      { type:"fill", q:"Gold is ______ (expensive) metal in this shop.",   a:["the most expensive"] },
      { type:"fill", q:"A bus ticket is ______ (cheap) than a plane ticket.", a:["cheaper"] },
      { type:"fill", q:"A pen isn't ______ ______ ______ (expensive) a book.", a:["as expensive as"] },
      { type:"mcq",  q:"Of all the phones, this is ______.", opts:["cheaper","as cheap","the cheapest"], a:2 },
      { type:"mcq",  q:"My old bag isn't ______ my new bag.", opts:["as nice as","nicer as","the nicest"], a:0 }
    ]
  },

  /* ============ FINAL EXAM WRITING MODE ============ */
  exam: {
    A: { title:"Section A — Complete the sentence", type:"fill", items:[
      { q:"A motorbike is ______ (cheap) than a car.",            a:["cheaper"] },
      { q:"Water is ______ (healthy) than soda.",                 a:["healthier"] },
      { q:"This is ______ (big) shop in town.",                   a:["the biggest"] },
      { q:"Gold is ______ (expensive) than silver.",              a:["more expensive"] },
      { q:"He got ______ (bad) score in the class.",              a:["the worst"] },
      { q:"Family is ______ (important) thing in life.",          a:["the most important"] },
      { q:"A tablet isn't as ______ (heavy) as a laptop.",        a:["heavy"] },
      { q:"She is ______ (happy) girl at the party.",             a:["the happiest"] },
      { q:"This shirt is ______ (good) than that one.",           a:["better"] },
      { q:"I have ______ (much) homework today. (มากเกินไป)",     a:["too much"] }
    ]},
    B: { title:"Section B — Write the correct form", type:"table", items:[
      { adj:"cheap",     a:["cheaper","the cheapest"] },
      { adj:"big",       a:["bigger","the biggest"] },
      { adj:"happy",     a:["happier","the happiest"] },
      { adj:"expensive", a:["more expensive","the most expensive"] },
      { adj:"good",      a:["better","the best"] },
      { adj:"bad",       a:["worse","the worst"] }
    ]},
    C: { title:"Section C — Rewrite the sentence", type:"rewrite", items:[
      { q:"A car is more expensive than a bicycle. → A bicycle ______",
        a:["a bicycle isn't as expensive as a car","a bicycle is not as expensive as a car"] },
      { q:"A computer isn't as cheap as a phone. → A phone ______",
        a:["a phone is cheaper than a computer"] },
      { q:"Book A ฿100 · Book B ฿100 → ______ (as ... as)",
        a:["book a is as expensive as book b","book a is as cheap as book b"] },
      { q:"No shop is cheaper than this shop. → This shop ______",
        a:["this shop is the cheapest","this shop is the cheapest shop"] },
      { q:"My bag isn't as new as your bag. → Your bag ______",
        a:["your bag is newer than my bag"] }
    ]},
    D: { title:"Section D — Use (not) as … as", type:"rewrite", items:[
      { q:"Laptop ฿30,000 / Tablet ฿15,000 (expensive)",
        a:["the tablet isn't as expensive as the laptop","tablet isn't as expensive as laptop"] },
      { q:"Today 30°C / Yesterday 30°C (hot)",
        a:["today is as hot as yesterday"] },
      { q:"Bag A 2 kg / Bag B 5 kg (heavy)",
        a:["bag a isn't as heavy as bag b"] },
      { q:"Math difficult = Physics difficult",
        a:["math is as difficult as physics"] },
      { q:"Video games / Sports (exciting) — เกมไม่สนุกเท่ากีฬา",
        a:["playing video games isn't as exciting as playing sports","video games aren't as exciting as sports"] }
    ]},
    E: { title:"Section E — Write your own sentences", type:"free", items:[
      { q:"เปรียบเทียบโทรศัพท์กับคอมพิวเตอร์ (comparative)", need:["than"], any:[["more expensive","cheaper","better","bigger","smaller"]] },
      { q:"เขียนประโยค Superlative เกี่ยวกับสิ่งของในห้องเรียน", need:["the"], any:[["est","most"]] },
      { q:"เขียนประโยค (not) as … as ของตัวเอง", need:["as"], any:[["as"]] }
    ]}
  }
};