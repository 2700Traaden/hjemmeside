// Henter det seneste "To do i ugen"/"To do i weekenden"-opslag fra Overblik
// og viser det i sin helhed her på Fælleskalenderen — så man ikke skal
// klikke sig videre til en anden side for at se det (fx når man kommer
// direkte hertil fra et link i Instagram-bioen). Opslagene på Overblik
// ligger altid nyest øverst, så det første to-do-opslag er automatisk
// det seneste.
(function(){
  // Samme fold-ud-funktion som på Overblik, så den kopierede markup virker.
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

  async function loadLatestTodo(){
    const box = document.getElementById("latestTodo");
    if(!box) return;
    try{
      const r = await fetch("../overblik-kilde.html", {cache:"no-store"});
      if(!r.ok) throw new Error("http "+r.status);
      const html = await r.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const articles = [...doc.querySelectorAll("article.feature")];
      const todo = articles.find(a=>{
        const img = a.querySelector(".segment-sign");
        const src = img ? (img.getAttribute("src")||"") : "";
        return /segment-todougen|segment-todoweekend/.test(src);
      });
      if(!todo) return;

      // Billedstier i det hentede opslag er relative til Overblik (fx
      // "assets/...") og skal rettes til at pege korrekt herfra
      // ("../assets/...").
      todo.querySelectorAll("img[src]").forEach(img=>{
        const src = img.getAttribute("src");
        if(src && !/^https?:\/\//.test(src) && !src.startsWith("../")){
          img.setAttribute("src", "../" + src);
        }
      });

      // Vis opslaget fuldt foldet ud med det samme — ingen ekstra klik.
      const list = todo.querySelector(".story-list");
      if(list) list.removeAttribute("hidden");
      const seeMoreBtn = todo.querySelector(".see-more");
      if(seeMoreBtn) seeMoreBtn.textContent = "SE MINDRE ▴";

      // Opslagets tavler (slides) vises i stedet for det lille skilt, hvis opslaget har egne billeder.
      try{
        const r2 = await fetch("../index.html", {cache:"no-store"});
        if(r2.ok){
          const d2 = new DOMParser().parseFromString(await r2.text(), "text/html");
          const post = d2.getElementById(todo.id);
          const imgs = post ? [...post.querySelectorAll(".strip .k-img img")].slice(0,2) : [];
          const sign = todo.querySelector(".feature-summary .segment-sign");
          if(imgs.length && sign){
            const row = document.createElement("div");
            row.setAttribute("style","display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 0 14px;-webkit-overflow-scrolling:touch");
            imgs.forEach(im=>{
              const n = document.createElement("img");
              n.src = "../" + im.getAttribute("src");
              n.alt = im.getAttribute("alt") || "";
              n.loading = "lazy";
              n.setAttribute("style","flex:0 0 auto;width:calc(50% - 5px);max-width:240px;height:auto;scroll-snap-align:start;border:1px solid #DCC8B0");
              row.appendChild(n);
            });
            sign.remove();
            todo.insertBefore(row, todo.firstChild);
          }
        }
      }catch(e){}

      box.innerHTML = "";
      box.appendChild(todo);
    }catch(e){
      console.warn("Kunne ikke hente seneste to-do-opslag fra Overblik.", e);
    }
  }
  loadLatestTodo();
})();
