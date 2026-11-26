// Henter det seneste "To do i ugen"/"Weekendguiden"-opslag fra Overblik
// og viser det i sin helhed her på Fælleskalenderen — så man ikke skal
// klikke sig videre til en anden side for at se det (fx når man kommer
// direkte hertil fra et link i Instagram-bioen). Opslaget hentes direkte
// fra forsiden (index.html), hvor opslagene ligger nyest øverst, så det
// første to-do-opslag er automatisk det seneste.
(function(){
  // Samme fold-ud-funktion som på Overblik, så knappen virker.
  window.toggleStoryList = function(btn){
    var list = btn.closest('.feature-summary').nextElementSibling;
    var isHidden = list.hasAttribute('hidden');
    if(isHidden){
      list.removeAttribute('hidden');
      btn.textContent = 'SE MINDRE ▴';
    }else{
      list.setAttribute('hidden','');
      btn.textContent = 'SE MERE ▾';
    }
  };

  // Stier i det hentede opslag er relative til Overblik (fx "assets/...")
  // og skal rettes til at pege korrekt herfra ("../assets/...").
  function fixSrc(src){
    return (src && !/^(https?:|data:|\.\.\/|\/)/.test(src)) ? "../" + src : src;
  }

  async function loadLatestTodo(){
    const box = document.getElementById("latestTodo");
    if(!box) return;
    try{
      const r = await fetch("../index.html", {cache:"no-store"});
      if(!r.ok) throw new Error("http "+r.status);
      const doc = new DOMParser().parseFromString(await r.text(), "text/html");
      const post = [...doc.querySelectorAll("section.fpost")].find(p=>/^(todoweekend|ugen)\d{4}$/.test(p.id));
      if(!post) return;

      const art = document.createElement("article");
      art.className = "feature";
      art.id = post.id;

      // Opslagets første to tavler (slides) øverst.
      const imgs = [...post.querySelectorAll(".strip .k-img img")].slice(0,2);
      if(imgs.length){
        const row = document.createElement("div");
        row.setAttribute("style","display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 0 14px;-webkit-overflow-scrolling:touch");
        imgs.forEach(im=>{
          const n = document.createElement("img");
          n.src = fixSrc(im.getAttribute("src"));
          n.alt = im.getAttribute("alt") || "";
          n.loading = "lazy";
          n.setAttribute("style","flex:0 0 auto;width:calc(50% - 5px);max-width:240px;height:auto;scroll-snap-align:start;border:1px solid #DCC8B0");
          row.appendChild(n);
        });
        art.appendChild(row);
      }

      // Dato, titel og teaser.
      const cap = post.querySelector(".fcap");
      const capTitle = cap && cap.querySelector("b");
      const title = capTitle ? capTitle.textContent.trim() : "";
      const teaser = cap ? cap.textContent.replace(title, "").trim() : "";
      const dateEl = post.querySelector(".fname span");
      const sum = document.createElement("div");
      sum.className = "feature-summary";
      const intro = document.createElement("div");
      intro.className = "feature-intro";
      const date = document.createElement("div");
      date.className = "feature-date";
      date.textContent = dateEl ? dateEl.textContent : "";
      const h = document.createElement("h2");
      h.className = "feature-headline";
      h.textContent = title;
      const p = document.createElement("p");
      p.className = "teaser";
      p.textContent = teaser;
      const btn = document.createElement("button");
      btn.className = "see-more";
      btn.setAttribute("onclick","toggleStoryList(this)");
      btn.textContent = "SE MINDRE ▴";
      intro.append(date, h, p, btn);
      sum.appendChild(intro);
      art.appendChild(sum);

      // Hele programmet, foldet ud med det samme — ingen ekstra klik.
      const list = document.createElement("div");
      list.className = "story-list";
      const alle = post.querySelector(".alle");
      if(alle) [...alle.children].forEach(c=>list.appendChild(document.importNode(c, true)));
      list.querySelectorAll("img[src]").forEach(img=>img.setAttribute("src", fixSrc(img.getAttribute("src"))));
      art.appendChild(list);

      box.innerHTML = "";
      box.appendChild(art);

      // Mobilannoncen sættes ind efter sidens første afsnit. Havner den inde
      // i opslaget, flyttes den ned lige under opslaget.
      const flytAnnonce = ()=>{ const a = box.querySelector(".ann-mobil"); if(a) box.after(a); };
      flytAnnonce();
      const obs = new MutationObserver(flytAnnonce);
      obs.observe(box, {childList:true, subtree:true});
      setTimeout(()=>obs.disconnect(), 10000);
    }catch(e){
      console.warn("Kunne ikke hente seneste to-do-opslag fra Overblik.", e);
    }
  }
  loadLatestTodo();
})();
