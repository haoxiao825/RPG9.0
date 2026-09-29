const SAVE="nova-rpg-final-v1";
const base={
 name:"Nova",level:0,xp:0,gold:250,gems:5,fame:0,hp:100,maxHp:100,energy:100,maxEnergy:100,
 quests:[
  {id:"m1",title:"離開星港城",type:"main",desc:"完成一次世界探索",reward:70,done:false},
  {id:"m2",title:"第一件戰利品",type:"main",desc:"獲得任意一件裝備",reward:100,done:false},
  {id:"d1",title:"今日探索",type:"daily",desc:"探索一次森林",reward:35,done:false},
  {id:"d2",title:"今天也冒險",type:"daily",desc:"完成任意一場戰鬥",reward:40,done:false}
 ],
 inventory:[],
 equipped:{weapon:null,armor:null,head:null,accessory:null,boots:null,special:null},
 pets:[
  {id:"fox",name:"星狐",icon:"🦊",rarity:"普通",level:1,intimacy:0,owned:true},
  {id:"dragon",name:"幼龍",icon:"🐉",rarity:"傳說",level:1,intimacy:0,owned:false},
  {id:"slime",name:"史萊姆",icon:"🟢",rarity:"稀有",level:1,intimacy:0,owned:false}
 ],
 achievements:[],world:{forest:0,dungeon:0,arena:0},wins:0,explores:0,learningWins:0,collection:0
};
let s=load(), currentQuestTab="main", currentShop="all", learnRound=0, learnQ=0;
const gear=[
 {id:"ironSword",name:"旅人鐵劍",icon:"⚔️",slot:"weapon",type:"gear",rarity:"普通",price:100,power:3,desc:"最可靠的第一把劍"},
 {id:"moonBlade",name:"月影之刃",icon:"🗡️",slot:"weapon",type:"gear",rarity:"史詩",price:500,power:10,desc:"探索時有機會找到額外金幣"},
 {id:"guardArmor",name:"守衛鎧甲",icon:"🛡️",slot:"armor",type:"gear",rarity:"稀有",price:250,power:6,desc:"增加冒險生存力"},
 {id:"wandererHood",name:"旅者兜帽",icon:"🧢",slot:"head",type:"gear",rarity:"普通",price:130,power:2,desc:"輕便又實用"},
 {id:"focusRing",name:"專注戒指",icon:"💍",slot:"accessory",type:"gear",rarity:"稀有",price:220,power:5,desc:"學院挑戰獎勵增加"},
 {id:"swiftBoots",name:"疾風靴",icon:"🥾",slot:"boots",type:"gear",rarity:"稀有",price:240,power:5,desc:"探索消耗能量降低"},
 {id:"starCharm",name:"星辰護符",icon:"📿",slot:"special",type:"gear",rarity:"傳說",price:800,power:15,desc:"所有冒險獎勵小幅增加"}
];
const consumables=[
 {id:"hp",name:"治療藥水",icon:"❤️‍🩹",type:"consumable",price:45,desc:"恢復 40 HP"},
 {id:"energy",name:"能量飲",icon:"⚡",type:"consumable",price:45,desc:"恢復 40 能量"},
 {id:"xp",name:"經驗卷軸",icon:"📜",type:"consumable",price:80,desc:"立即獲得 80 XP"}
];
const petsForSale=[
 {id:"dragon",name:"幼龍",icon:"🐉",rarity:"傳說",price:700},
 {id:"slime",name:"史萊姆",icon:"🟢",rarity:"稀有",price:300}
];
const questions=[
["JavaScript 主要能讓網頁做什麼？",["互動","增加螢幕尺寸","製造鍵盤"],0],
["CSS 主要負責？",["網頁外觀","資料庫備份","CPU"],0],
["Git 是什麼？",["版本控制工具","遊戲引擎","瀏覽器"],0],
["HTML 主要描述？",["網頁結構","網路速度","硬體溫度"],0],
["API 常用於？",["程式之間溝通","充電","壓縮螢幕"],0],
["Array 中文常稱？",["陣列","指標","伺服器"],0],
["function 中文常稱？",["函式","資料夾","圖片"],0],
["JSON 常用於？",["資料交換","繪圖","錄音"],0],
["GitHub 可以？",["託管與協作程式碼","取代作業系統","增加 RAM"],0],
["變數通常用來？",["保存資料","改變解析度","清潔硬碟"],0]
];

function load(){try{return {...clone(base),...JSON.parse(localStorage.getItem(SAVE)||"{}")}}catch{return clone(base)}}
function clone(x){return JSON.parse(JSON.stringify(x))}
function esc(x){return String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function need(){return 100+s.level*55}
function save(){localStorage.setItem(SAVE,JSON.stringify(s));render();cloudSave()}
function xp(n){s.xp+=n;while(s.xp>=need()){s.xp-=need();s.level++;s.gold+=75;notify("✨ 升級！你現在是 Lv."+s.level)}}
function notify(t){const e=document.getElementById("authMsg");if(e){e.textContent=t;setTimeout(()=>{if(e.textContent===t)e.textContent=""},2400)}}
function go(id){document.querySelectorAll(".screen").forEach(x=>x.classList.toggle("active",x.id===id));window.scrollTo(0,0);render()}
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
document.querySelectorAll("[data-back]").forEach(b=>b.addEventListener("click",()=>go("world")));
document.getElementById("settingsBtn").onclick=()=>go("settings");

function render(){
 document.getElementById("heroName").textContent=s.name;document.getElementById("level").textContent=s.level;
 document.getElementById("className").textContent="冒險者";document.getElementById("gold").textContent=s.gold;document.getElementById("gems").textContent=s.gems;document.getElementById("fame").textContent=s.fame;
 document.getElementById("bagCount").textContent=s.inventory.length;
 document.getElementById("xpFill").style.width=Math.min(100,s.xp/need()*100)+"%";document.getElementById("xpText").textContent=`${s.xp} / ${need()} XP`;
 document.getElementById("hpText").textContent=`${s.hp}/${s.maxHp}`;document.getElementById("energyText").textContent=`${s.energy}/${s.maxEnergy}`;
 document.getElementById("hpFill").style.width=(s.hp/s.maxHp*100)+"%";document.getElementById("energyFill").style.width=(s.energy/s.maxEnergy*100)+"%";
 renderAdventure();renderDungeon();renderArena();renderQuests();renderShop();renderPets();renderInventory();renderAchievements();renderProfile();renderEvent();
}
function renderAdventure(){const b=document.getElementById("adventureBox");b.innerHTML=`<span class="tag">探索區域 ${s.world.forest}</span><h3>森林深處</h3><p class="muted">你可以遇到怪物、寶箱、商人或特殊事件。探索不是學習任務，完全獨立。</p><button id="explore" class="primary">🌲 探索一次（10 能量）</button><div id="adventureResult"></div>`;document.getElementById("explore").onclick=explore}
function explore(){if(s.energy<10){notify("⚡ 能量不足");return}s.energy-=10;s.explores++;s.world.forest++;const r=Math.random();let t;if(r<.48){const gold=30+Math.floor(Math.random()*71);s.gold+=gold;xp(15);t=`🪙 發現寶箱！+${gold} 金幣、+15 XP`}else if(r<.82){const dmg=5+Math.floor(Math.random()*16);s.hp=Math.max(1,s.hp-dmg);s.wins++;s.gold+=40;xp(30);t=`👾 遭遇森林魔物！勝利，受到 ${dmg} 傷害，獲得 40 金幣與 30 XP`}else{const gems=1+Math.floor(Math.random()*3);s.gems+=gems;s.fame+=5;xp(45);t=`✨ 發現古老祭壇！+${gems} 寶石、+5 聲望、+45 XP`}questProgress("d1");checkAch();save();setTimeout(()=>{const e=document.getElementById("adventureResult");if(e)e.innerHTML=`<div class="card">${t}</div>`},10)}
function renderDungeon(){const b=document.getElementById("dungeonBox");b.innerHTML=`<span class="tag">危險度 ★★★</span><h3>失落遺跡</h3><p class="muted">連續三次挑戰。最後有機會遇到 Boss 與稀有戰利品。</p><button id="dungeonRun" class="primary">🏰 挑戰遺跡（20 能量）</button><div id="dungeonResult"></div>`;document.getElementById("dungeonRun").onclick=dungeon}
function dungeon(){if(s.energy<20){notify("⚡ 能量不足");return}s.energy-=20;s.world.dungeon++;let reward=70+s.world.dungeon*10;s.gold+=reward;xp(55);let t=`🏰 通過遺跡！+${reward} 金幣、+55 XP`;if(s.world.dungeon%3===0){s.gems+=3;s.fame+=15;xp(100);t+="<br>👹 Boss 出現並被擊敗！額外 +3 寶石、+15 聲望、+100 XP";}save();document.getElementById("dungeonResult").innerHTML=`<div class="card">${t}</div>`}
function renderArena(){const b=document.getElementById("arenaBox");b.innerHTML=`<span class="tag">連勝 ${s.world.arena}</span><h3>冒險者競技場</h3><p class="muted">純 RPG 戰鬥玩法。每次勝利提高獎勵。</p><button id="arenaFight" class="primary">⚔️ 開始對戰（15 能量）</button><div id="arenaResult"></div>`;document.getElementById("arenaFight").onclick=arena}
function arena(){if(s.energy<15){notify("⚡ 能量不足");return}s.energy-=15;s.world.arena++;const reward=40+s.world.arena*8;s.gold+=reward;s.fame+=3;xp(35);if(s.world.arena%5===0){s.gems++;xp(80)}s.wins++;questProgress("d2");checkAch();save();document.getElementById("arenaResult").innerHTML=`<div class="card">🏆 勝利！連勝 ${s.world.arena}，獲得 ${reward} 金幣與 35 XP。</div>`}
function renderQuests(){const box=document.getElementById("questList");const qs=s.quests.filter(q=>q.type===currentQuestTab);box.innerHTML=qs.length?qs.map(q=>`<div class="quest"><div><h3>${esc(q.title)}</h3><small>${esc(q.desc)} · +${q.reward} XP</small></div><button ${q.done?"disabled":""} data-q="${q.id}">${q.done?"完成":"領取"}</button></div>`).join(""):`<div class="card">目前沒有這類任務。</div>`;box.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>completeQuest(b.dataset.q))}
document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{currentQuestTab=b.dataset.tab;renderQuests()});
function completeQuest(id){const q=s.quests.find(x=>x.id===id);if(!q||q.done)return;q.done=true;xp(q.reward);s.gold+=25;s.fame+=2;checkAch();save()}
function questProgress(type){const q=s.quests.find(x=>x.type===type&&!x.done);if(q){q.done=true;xp(q.reward);s.gold+=25}}
document.getElementById("addQuest").onclick=()=>{const title=prompt("輸入你的任務名稱");if(title?.trim()){s.quests.push({id:"p"+Date.now(),title:title.trim(),type:"personal",desc:"自己的冒險目標",reward:50,done:false});save()}}
function shopItems(){return currentShop==="gear"?gear:currentShop==="pet"?petsForSale:currentShop==="consumable"?consumables:[...gear,...consumables,...petsForSale]}
function renderShop(){const box=document.getElementById("shopList");box.innerHTML=shopItems().map(i=>`<div><div class="itemIcon">${i.icon}</div><b>${i.name}</b><div class="rarity">${i.rarity||"普通"} · ${i.desc||"特殊物品"}</div><div class="price">💰 ${i.price}</div><button data-buy="${i.id}">購買</button></div>`).join("");box.querySelectorAll("[data-buy]").forEach(b=>b.onclick=()=>buy(b.dataset.buy))}
document.querySelectorAll("[data-shop]").forEach(b=>b.onclick=()=>{currentShop=b.dataset.shop;renderShop()});
function buy(id){const i=shopItems().find(x=>x.id===id);if(!i)return;if(s.gold<i.price){notify("💰 金幣不足");return}s.gold-=i.price;if(i.type==="consumable"){s.inventory.push({...i,uid:Date.now()})}else if(petsForSale.some(x=>x.id===id)){const p=s.pets.find(x=>x.id===id);if(p?.owned){s.gold+=i.price;notify("你已經擁有這隻寵物");return}if(p)p.owned=true}else{s.inventory.push({...i,uid:Date.now(),equipped:false})}checkAch();save()}
function renderPets(){const box=document.getElementById("petList");box.innerHTML=s.pets.map(p=>`<div><div class="itemIcon">${p.icon}</div><b>${p.name}</b><div class="rarity">${p.rarity} · Lv.${p.level}</div><div class="petBottom"><small>親密度 ${p.intimacy}/100</small><button data-feed="${p.id}" ${p.owned?"":"disabled"}>${p.owned?"🍖 餵食":"🔒 未解鎖"}</button></div></div>`).join("");box.querySelectorAll("[data-feed]").forEach(b=>b.onclick=()=>feed(b.dataset.feed))}
function feed(id){const p=s.pets.find(x=>x.id===id);if(!p||!p.owned)return;if(s.gold<20){notify("需要 20 金幣購買寵物食物");return}s.gold-=20;p.intimacy+=20;if(p.intimacy>=100){p.level++;p.intimacy-=100;xp(40);notify(`${p.name} 升到 Lv.${p.level}！`)}else xp(10);save()}
function renderInventory(){const eq=document.getElementById("equipped");eq.innerHTML=Object.entries(s.equipped).map(([slot,id])=>{const i=s.inventory.find(x=>x.uid===id);return `<div class="slot"><b>${slot}</b><span>${i?.icon||"＋"}</span><small>${i?.name||"空"}</small></div>`}).join("");const box=document.getElementById("inventoryList");box.innerHTML=s.inventory.length?s.inventory.map(i=>`<div class="item"><div class="itemIcon">${i.icon}</div><div class="itemInfo"><strong>${i.name}</strong><small>${i.rarity||"普通"} · ${i.desc||""}</small></div><button data-item="${i.uid}">${i.type==="consumable"?"使用":s.equipped[i.slot]===i.uid?"卸下":"裝備"}</button></div>`).join(""):`<div class="card">背包目前是空的。去商會或冒險取得戰利品吧。</div>`;box.querySelectorAll("[data-item]").forEach(b=>b.onclick=()=>useItem(Number(b.dataset.item)))}
function useItem(uid){const i=s.inventory.find(x=>x.uid===uid);if(!i)return;if(i.type==="consumable"){if(i.id==="hp")s.hp=Math.min(s.maxHp,s.hp+40);if(i.id==="energy")s.energy=Math.min(s.maxEnergy,s.energy+40);if(i.id==="xp")xp(80);s.inventory=s.inventory.filter(x=>x.uid!==uid)}else{if(s.equipped[i.slot]===uid)s.equipped[i.slot]=null;else s.equipped[i.slot]=uid}checkAch();save()}
function renderProfile(){document.getElementById("profileName").textContent=s.name;document.getElementById("profileLevel").textContent=s.level;document.getElementById("profileStats").innerHTML=[["⚔️","勝利",s.wins],["🌲","探索",s.explores],["📚","學院",s.learningWins],["🏆","成就",s.achievements.length],["🐾","寵物",s.pets.filter(p=>p.owned).length],["🗺️","地城",s.world.dungeon]].map(x=>`<div>${x[0]}<br><b>${x[2]}</b><small>${x[1]}</small></div>`).join("")}
function renderAchievements(){const all=[["first","第一步","完成第一個任務"],["level","冒險者","達到 Lv.5"],["forest","森林居民","探索森林 10 次"],["dungeon","遺跡獵人","完成 3 次遺跡"],["arena","競技王","競技場連勝 5"],["pet","馴獸師","擁有 2 隻寵物"],["learning","學院挑戰者","完成一次學院挑戰"],["rich","小富翁","持有 1000 金幣"]];const box=document.getElementById("achievementList");box.innerHTML=all.map(a=>{const ok=s.achievements.includes(a[0]);return `<div class="item"><div class="itemIcon">${ok?"🏆":"🔒"}</div><div class="itemInfo"><strong>${a[1]}</strong><small>${a[2]}</small></div></div>`}).join("")}
function checkAch(){const a=s.achievements;const add=(id,ok)=>{if(ok&&!a.includes(id))a.push(id)};add("first",s.quests.some(q=>q.done));add("level",s.level>=5);add("forest",s.explores>=10);add("dungeon",s.world.dungeon>=3);add("arena",s.world.arena>=5);add("pet",s.pets.filter(p=>p.owned).length>=2);add("learning",s.learningWins>=1);add("rich",s.gold>=1000)}
function renderEvent(){const events=[["森林的神秘商人","今天探索森林時，可能遇到額外寶藏。"],["星港的節慶","城鎮今天特別熱鬧，聲望活動增加。"],["流星雨","天空出現流星，今晚可能找到寶石。"]];const e=events[new Date().getDate()%events.length];document.getElementById("eventTitle").textContent=e[0];document.getElementById("eventText").textContent=e[1];document.getElementById("eventBtn").onclick=()=>{s.gold+=25;s.fame+=2;xp(20);save();notify("✨ 事件完成！獲得獎勵")}}
document.getElementById("startLearn").onclick=startLearning;
function startLearning(){learnRound=0;learnQ=0;showLearn()}
function showLearn(){const q=questions[learnQ%questions.length],box=document.getElementById("learnBox");box.innerHTML=`<div class="card learnQ"><div class="muted">學院挑戰 ${learnQ+1}/10</div><h3>${q[0]}</h3><div class="choice">${q[1].map((x,i)=>`<button data-a="${i}">${String.fromCharCode(65+i)}. ${x}</button>`).join("")}</div></div>`;box.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>{if(Number(b.dataset.a)!==q[2]){notify("❌ 答錯了，可以繼續下一題");learnQ++;setTimeout(showLearn,500);return}xp(20);s.gold+=15;learnQ++;if(learnQ>=10){s.learningWins++;s.fame+=10;xp(100);s.gems++;checkAch();save();box.innerHTML=`<div class="card"><h3>🎓 挑戰完成！</h3><p class="muted">你得到學院獎勵，但冒險世界還有更多事情可以做。</p><button class="primary" onclick="go('world')">回到世界</button></div>`}else{save();showLearn()}})}
function setSync(on){document.getElementById("syncDot").className="dot "+(on?"on":"");document.getElementById("syncText").textContent=on?"雲端同步":"本機存檔"}
async function initCloud(){if(!RPG_CONFIG.supabaseUrl||!RPG_CONFIG.supabaseAnonKey)return;try{const m=await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");window.sb=m.createClient(RPG_CONFIG.supabaseUrl,RPG_CONFIG.supabaseAnonKey);const {data}=await sb.auth.getUser();if(data.user){document.getElementById("accountInfo").textContent="已登入："+data.user.email;setSync(true);await pullCloud()}}catch(e){notify("雲端功能初始化失敗，目前仍可正常遊玩")}}
async function auth(mode){if(!window.sb){notify("請先設定 Supabase");return}const email=document.getElementById("email").value.trim(),password=document.getElementById("password").value;if(!email||password.length<6){notify("請輸入 Email 與至少 6 位密碼");return}const r=mode==="signup"?await sb.auth.signUp({email,password}):await sb.auth.signInWithPassword({email,password});if(r.error){notify(r.error.message);return}document.getElementById("accountInfo").textContent="已登入："+email;setSync(true);await pullCloud();notify("登入成功")}
async function pullCloud(){if(!window.sb)return;const {data:u}=await sb.auth.getUser();if(!u.user)return;const {data,error}=await sb.from("rpg_saves").select("save_data").eq("user_id",u.user.id).maybeSingle();if(!error&&data?.save_data){s={...clone(base),...data.save_data};localStorage.setItem(SAVE,JSON.stringify(s));render()}}
async function cloudSave(){if(!window.sb)return;try{const {data:u}=await sb.auth.getUser();if(!u.user)return;const {error}=await sb.from("rpg_saves").upsert({user_id:u.user.id,save_data:s,updated_at:new Date().toISOString()},{onConflict:"user_id"});if(error)throw error;setSync(true)}catch(e){setSync(false)}}
document.getElementById("signup").onclick=()=>auth("signup");document.getElementById("login").onclick=()=>auth("login");document.getElementById("syncNow").onclick=cloudSave;
document.getElementById("logout").onclick=async()=>{if(window.sb)await sb.auth.signOut();setSync(false);document.getElementById("accountInfo").textContent="本機模式：資料只存在目前裝置。"};
render();initCloud();