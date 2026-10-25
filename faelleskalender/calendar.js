
// Kalenderen forsøger først at hente friske data live fra Google Sheets.
// Hvis det af en eller anden grund fejler (Google-tjenesten er nede, linket er
// ændret, midlertidig netværksfejl osv.), falder den automatisk tilbage til de
// senest kendte data (events-data.js), så siden aldrig fremstår tom eller i stykker.
const CSV_URL = "https://docs.google.com/spreadsheets/d/1PWLmtu42SbQSfXVM2TlnvUH8TZwIJMstVzK55UTZTmA/gviz/tq?tqx=out:csv&gid=1471785629";

let events=[], activeCat="Alle", view="cards";

function parseCSV(text){
  const rows=[]; let row=[], cell="", q=false;
  for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];
    if(c=='"' && q && n=='"'){cell+='"';i++;continue}
    if(c=='"'){q=!q;continue}
    if(c==',' && !q){row.push(cell);cell="";continue}
    if((c=='\n'||c=='\r')&&!q){if(c=='\r'&&n=='\n')i++;row.push(cell);cell="";if(row.some(x=>x.trim()))rows.push(row);row=[];continue}
    cell+=c;
  }
  if(cell.length||row.length){row.push(cell);rows.push(row)}
  return rows;
}
function normalizeDate(s){
  s=(s||"").trim().replace(/^"|"$/g,"");
  // Googles eget "gviz"-dataformat pakker nogle gange datoer ind sådan: Date(2026,7,22)
  // (bemærk: måneden er her allerede 0-indekseret af Google selv)
  let m=s.match(/^Date\((\d+),\s*(\d+),\s*(\d+)/);
  if(m){
    const d=new Date(Number(m[1]),Number(m[2]),Number(m[3]));
    d.setHours(0,0,0,0);
    return d;
  }
  m=s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})/);
  if(m){
    const d=new Date(Number(m[3]),Number(m[2])-1,Number(m[1]));
    d.setHours(0,0,0,0);
    return d;
  }
  m=s.match(/^(\d{1,2})[\/.\-](\d{1,2})(?:\s|$)/);
  if(m){
    const year=new Date().getFullYear();
    const d=new Date(year,Number(m[2])-1,Number(m[1]));
    d.setHours(0,0,0,0);
    return d;
  }
  m=s.match(/^(\d{4})[\/.\-](\d{1,2})[\/.\-](\d{1,2})/);
  if(m){
    const d=new Date(Number(m[1]),Number(m[2])-1,Number(m[3]));
    d.setHours(0,0,0,0);
    return d;
  }
  return null;
}
function classify(s){
  return (s||"").trim() || "Andet";
}
function usableUrl(s){s=(s||"").trim();if(!s)return false;try{const u=new URL(s);return u.protocol==="http:"||u.protocol==="https:"}catch(e){return false}}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function fmtDate(d){return d?d.toLocaleDateString("da-DK",{day:"2-digit",month:"short"}).replace(".","").toUpperCase():""}
// Fælles kort-skabelon, så et event altid ser ens ud — uanset om det vises
// under "KOMMENDE" eller som dagens arrangementer i "KALENDER"-visningen.
function eventCard(e){
  return `
    <article class="card cat-${e.cats[0].toLowerCase().replaceAll(" ","-")}">
      <div class="card-top">
        <div class="datebox">
          <span class="day">${e.date.getDate()}</span>
          <span class="mon">${e.date.toLocaleDateString("da-DK",{month:"short"}).replace(".","").toUpperCase()}</span>
          <span class="dow">${e.date.toLocaleDateString("da-DK",{weekday:"short"}).toUpperCase()}</span>
        </div>
        <h3>${esc(e.title)}</h3>
      </div>
      <div class="title-divider"></div>
      <div class="tags-row">${e.cats.map(c=>`<span class="tag tag-${c.toLowerCase().replaceAll(" ","-")}">${esc(c.toUpperCase())}</span>`).join("")}</div>
      ${e.place?`<div class="meta">⌖ ${esc(e.place)}</div>`:""}
      ${e.time?`<div class="meta">◷ ${esc(e.time)}</div>`:""}
      ${e.desc?`<div class="desc">${esc(e.desc)}</div>`:""}
      <div class="card-footer">
        ${usableUrl(e.link)?`<a href="${esc(e.link)}" target="_blank" rel="noopener">SE ARRANGEMENT →</a>`:""}
      </div>
    </article>`;
}
function renderCategories(){
  const cats=["Sport","Børnekultur","Voksenkultur","Loppemarked","Lokalsamfund","Natur"];
  const box=document.getElementById("cats");
  box.innerHTML=cats.map(c=>`<button class="cat" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
  const allBtn=document.getElementById("catAllBtn");
  allBtn.classList.add("active");
  allBtn.onclick=()=>{
    box.querySelectorAll(".cat").forEach(x=>x.classList.remove("active"));
    allBtn.classList.add("active");
    activeCat="Alle";
    render();
  };
  box.querySelectorAll(".cat").forEach(btn=>btn.onclick=()=>{
    box.querySelectorAll(".cat").forEach(x=>x.classList.remove("active"));
    allBtn.classList.remove("active");
    btn.classList.add("active");
    activeCat=btn.dataset.cat;
    render();
  });
  // Kommer man fra et menu-link med fx ?cat=Sport, forvælges den kategori.
  const catParam=new URLSearchParams(location.search).get("cat");
  if(catParam && cats.includes(catParam)){
    const match=[...box.querySelectorAll(".cat")].find(b=>b.dataset.cat===catParam);
    if(match) match.click();
  }
}
function render(){
  const q=document.getElementById("search").value.toLowerCase().trim();
  const now=new Date(); now.setHours(0,0,0,0);
  const list=events
    .filter(e=>e.date instanceof Date && !isNaN(e.date) && e.date>=now)
    .filter(e=>(activeCat==="Alle"||e.cats.includes(activeCat)))
    .filter(e=>!q||[e.title,e.place,e.desc,e.type].join(" ").toLowerCase().includes(q))
    .sort((a,b)=>a.date-b.date||a.time.localeCompare(b.time));

  if(view==="calendar"){renderCalendar(list);return}
  document.getElementById("cards").style.display="grid";
  document.getElementById("calendar").style.display="none";
  document.getElementById("cards").innerHTML=list.length?list.map(eventCard).join(""):`<div class="empty">Ingen kommende arrangementer matcher dit valg.</div>`;
}
let selectedCalendarDate=null;
function monthKey(d){
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-01";
}
function dayKey(d){
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}
function renderCalendar(list){
  document.getElementById("cards").style.display="none";
  document.getElementById("calendar").style.display="block";
  const base=selectedCalendarDate?new Date(selectedCalendarDate+"T12:00:00"):new Date();
  const y=base.getFullYear(),m=base.getMonth();
  const first=new Date(y,m,1),days=new Date(y,m+1,0).getDate(),start=(first.getDay()+6)%7;
  const today=new Date();today.setHours(0,0,0,0);
  let h=`<div class="calendar-nav"><button class="control" id="prevMonth" type="button">←</button><strong>${first.toLocaleDateString("da-DK",{month:"long",year:"numeric"})}</strong><button class="control" id="nextMonth" type="button">→</button></div>`;
  h+='<div class="calgrid">'+["MAN","TIR","ONS","TOR","FRE","LØR","SØN"].map(x=>`<div class="dowh">${x}</div>`).join("");
  for(let i=0;i<start;i++)h+='<div class="calblank"></div>';
  for(let day=1;day<=days;day++){
    const d=new Date(y,m,day);d.setHours(0,0,0,0);const key=dayKey(d);
    const ev=list.filter(e=>e.date&&dayKey(e.date)===key);
    const past=d<today;
    h+=`<button type="button" class="daycell${past?" past":""}${selectedCalendarDate===key?" selected":""}" data-day="${key}"><div class="num">${day}</div>${past?"":ev.slice(0,3).map(e=>`<span class="eventdot">${esc(e.title)}</span>`).join("")}</button>`;
  }
  h+='</div><div id="agenda" style="margin-top:18px"></div>';
  document.getElementById("calendar").innerHTML=h;
  document.getElementById("prevMonth").onclick=()=>{const d=new Date(y,m-1,1);selectedCalendarDate=monthKey(d);renderCalendar(list)};
  document.getElementById("nextMonth").onclick=()=>{const d=new Date(y,m+1,1);selectedCalendarDate=monthKey(d);renderCalendar(list)};
  document.querySelectorAll("#calendar .daycell:not(.past)").forEach(btn=>btn.onclick=()=>{selectedCalendarDate=btn.dataset.day;renderCalendar(list)});
  const chosen=selectedCalendarDate||dayKey(today),cd=new Date(chosen+"T12:00:00");
  const dayEvents=cd<today?[]:list.filter(e=>e.date&&dayKey(e.date)===chosen);
  document.getElementById("agenda").innerHTML=dayEvents.length?`<h3 style="margin:0 0 10px;text-transform:capitalize">${cd.toLocaleDateString("da-DK",{weekday:"long",day:"numeric",month:"long"})}</h3><div class="grid">${dayEvents.map(eventCard).join("")}</div>`:`<div class="empty">Ingen kommende arrangementer denne dag.</div>`;
}
function rowsToEvents(rows){
  const catMap={"demokrati":"Lokalsamfund"};
  const normalizeCat=(s)=>{
    s=(s||"").trim();
    const mapped=catMap[s.toLowerCase()];
    return mapped||s;
  };
  // Splitter "Børnekultur, Voksenkultur" op i to selvstændige kategorier,
  // så eventet dukker op under begge kategori-knapper i stedet for at danne
  // en ny, sammensat kategori.
  const splitCats=(s)=>(s||"").split(",").map(x=>normalizeCat(x)).filter(Boolean);
  return rows.map(r=>{
    const cats=splitCats(r[3]);
    return {
      date:normalizeDate(r[0]),
      time:(r[1]||"").trim(),
      title:(r[2]||"").trim(),
      type:normalizeCat(r[3]),
      place:(r[4]||"").trim(),
      desc:(r[5]||"").trim(),
      link:(r[6]||"").trim(),
      image:"",
      cats:cats.length?cats:["Andet"]
    };
  }).filter(e=>e.title && e.date);
}
async function load(){
  // Forsøg 1: hent friske data live fra Google Sheets
  try{
    const r=await fetch(CSV_URL+"&_="+Date.now(),{cache:"no-store"});
    if(!r.ok)throw new Error("http "+r.status);
    const rows=parseCSV(await r.text());
    if(!rows.length)throw new Error("tomt svar");
    const head=rows.shift().map(x=>(x||"").trim().toLowerCase());
    const idx=(...names)=>{for(const n of names){const i=head.indexOf(n.toLowerCase());if(i>=0)return i}return -1};
    const iDate=idx("dato"),iTime=idx("tidspunkt","tid"),iTitle=idx("titel","arrangementsnavn","arrangementets navn","title"),
          iType=idx("arrangementstype","kategori","category"),iPlace=idx("sted","location"),
          iDesc=idx("kort beskrivelse","beskrivelse","description"),iLink=idx("link til event","link til begivenhed","link","url");
    const mapped=rows.map(r=>[r[iDate],r[iTime],r[iTitle],r[iType],r[iPlace],r[iDesc],r[iLink]]);
    const liveEvents=rowsToEvents(mapped);
    if(!liveEvents.length)throw new Error("ingen gyldige rækker efter tolkning");
    events=liveEvents;
    console.log("Kalender: hentede",events.length,"arrangementer live fra Google Sheets");
  }catch(err){
    // Forsøg 2: brug de senest kendte, faste data i stedet
    console.warn("Kalender: kunne ikke hente live data, bruger fast backup i stedet.",err);
    events=(typeof STATIC_EVENTS!=="undefined")?rowsToEvents(STATIC_EVENTS):[];
  }
  try{
    renderCategories();
    render();
  }catch(e){
    document.getElementById("empty").style.display="block";
    document.getElementById("empty").textContent="Kunne ikke hente kalenderdata. Tjek CSV-linket.";
  }
}

document.getElementById("search").oninput=render;

document.getElementById("upcomingBtn").onclick=()=>{view="cards";document.getElementById("upcomingBtn").classList.add("active");document.getElementById("calendarBtn").classList.remove("active");render()};
document.getElementById("calendarBtn").onclick=()=>{view="calendar";document.getElementById("calendarBtn").classList.add("active");document.getElementById("upcomingBtn").classList.remove("active");render()};
load();
