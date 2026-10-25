/* Annoncer paa mobil (<=800px): ingen hoejrespalte. Foerste annonce kommer lige efter foerste opslag,
   de oevrige én ad gangen efter hvert tredje opslag. Paa sider uden opslag: efter foerste afsnit.
   Paa computer og tablet staar annoncerne i hoejre side som foer (denne fil goer intet). */
(function(){
var mq=window.matchMedia('(max-width:800px)');
function koer(){
  if(!mq.matches) return;
  var side=document.querySelector('aside.ads, aside.adscol'); if(!side) return;
  var ann=[].slice.call(side.children); if(!ann.length) return;
  var wrap=function(a){var d=document.createElement('div');d.className='ann-mobil';d.appendChild(a);return d;};
  var behold=document.querySelector('.feedcol, .content-column, .simple-content'); if(!behold) return;
  var poster=[];
  if(behold.classList.contains('feedcol')) poster=[].slice.call(behold.querySelectorAll(':scope > .fpost'));
  else if(behold.classList.contains('content-column')) poster=[].slice.call(behold.children).filter(function(x){return x.tagName!=='HR'&&x.textContent.trim()!==''||x.querySelector('img')});
  if(poster.length){
    var k=0;
    for(var i=0;i<poster.length&&k<ann.length;i+=3){ poster[i].parentNode.insertBefore(wrap(ann[k]),poster[i].nextSibling); k++; }
  } else {
    var p=behold.querySelector('p'); var ref=p;
    if(!ref){ var b=[].slice.call(behold.children).filter(function(x){return !x.classList.contains('page-title')}); ref=b[0]; }
    if(ref) ref.parentNode.insertBefore(wrap(ann[0]),ref.nextSibling);
  }
  side.style.display='none';
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',koer); else koer();
var sidste=mq.matches; mq.addEventListener&&mq.addEventListener('change',function(){ if(mq.matches!==sidste) location.reload(); });

// Computer/tablet: hoejre annoncekolonne staar fast (sticky). Er den hoejere end skaermen, saa den
// glider op til sit bund-stykke bliver synligt, saa alle annoncer kan ses naar man scroller.
function pasHoejde(){
  if(mq.matches) return;
  var s=document.querySelector('aside.ads, aside.adscol'); if(!s) return;
  s.style.transform='none'; s.style.transformOrigin='top center';
  var vh=window.innerHeight, h=s.offsetHeight, luft=18;
  var k=Math.min(1,(vh-2*luft)/h);          // er kolonnen for hoej, skaleres den saa alle annoncer er der paa en gang
  if(k<1) s.style.transform='scale('+k+')';
  s.style.top=luft+'px';
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',pasHoejde); else pasHoejde();
window.addEventListener('load',pasHoejde); window.addEventListener('resize',pasHoejde);
if(window.ResizeObserver){ var _s=document.querySelector('aside.ads, aside.adscol'); if(_s) new ResizeObserver(pasHoejde).observe(_s); }
})();
