(function(){
var NS='http://www.w3.org/2000/svg';
var RED='#C8432B',BLUE='#2F6FC4',GREEN='#4A5A2C',ORANGE='#E09A2B';
// skyline-style objects, origin = centre of ground line, y up = negative. [colour, [paths]]
var OBJ={
home:[RED,['M-13 -30 L-7 -32 L3 -35 L11 -31','M-13 -30 V-1','M-7 -32 V0','M3 -35 V0','M11 -31 V-2','M-5 -33.5 V-37.5 L-1 -39 H4 V-34.8','M-0.5 -39 V-46',
 'M-11 -27 v2.5 M-9 -27 v2.5 M-11 -21 v2.5 M-9 -21 v2.5 M-11 -15 v2.5 M-9 -15 v2.5 M-11 -9 v2.5 M-9 -9 v2.5 M-11 -3 v2.5 M-9 -3 v2.5','M-5 -29 v2.5 M-2 -29 v2.5 M-5 -23 v2.5 M-2 -23 v2.5 M-5 -17 v2.5 M-2 -17 v2.5 M-5 -11 v2.5 M-2 -11 v2.5 M-5 -5 v2.5 M-2 -5 v2.5','M6 -26 v2 M9 -26 v2 M6 -20 v2 M9 -20 v2 M6 -14 v2 M9 -14 v2 M6 -8 v2 M9 -8 v2']],
cal:[BLUE,['M-12 -1 V-30 Q-12 -32 -10 -32 H10 Q12 -32 12 -30 V-1','M-12 -24 H12','M-6 -35 V-28','M6 -35 V-28',
 'M-8 -18 h3 M-1.5 -18 h3 M5 -18 h3','M-8 -12 h3 M-1.5 -12 h3 M5 -12 h3','M-8 -6 h3 M-1.5 -6 h3']],
meme:[GREEN,['M-13 -30 Q-13 -37 -6 -37 H6 Q13 -37 13 -30 V-19 Q13 -12 6 -12 H-2 L-9 -3 L-8 -12 H-6 Q-13 -12 -13 -19 Z','M-7 -29 H7','M-7 -23 H2']],
arkiv:[ORANGE,['M-14 -34 H14 V-26 H-14 Z','M-12 -26 V-1 M12 -26 V-1','M-4 -19 H4','M-12 -14 H-10 M10 -14 H12']],
guides:['#C4631F',['M0 -1 V-43','M-1 -41 H10 L13 -37.5 L10 -34 H-1','M1 -31 H-10 L-13 -27.5 L-10 -24 H1']],
tilbud:[RED,['M-9 -29 L-5 -36 H5 L9 -29 V-2 H-9 Z','M-1.8 -30.5 a1.8 1.8 0 1 0 3.6 0 a1.8 1.8 0 1 0 -3.6 0','M-1.4 -31.5 C-6 -40 -4 -47 0 -47 C4 -47 6 -40 1.4 -31.5']],
kunst:[BLUE,['M-13 -42 H13 V-20 H-13 Z','M-7 -24 Q-3 -34 2 -29 T9 -36','M-6 -20 L-10 -1 M6 -20 L10 -1 M0 -20 V-6']],
info:[GREEN,['M0 -9 C0 -15 0 -17 0 -20 C0 -28 9 -27 8 -35 C7 -43 -8 -42 -8 -34','M0 -4 m-1.6 0 a1.6 1.6 0 1 0 3.2 0 a1.6 1.6 0 1 0 -3.2 0']]
};
function el(n,a){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);return e}
// Hvert menupunkt er en lille skyline-tegning (tynd streg) paa en kort bolget grundlinje.
function tegn(it){
 var k=it.getAttribute('data-k'),o=OBJ[k],sv=it.querySelector('svg');if(!o||!sv)return;
 sv.innerHTML='';sv.setAttribute('viewBox','0 0 40 56');
 var g=el('g',{fill:'none','stroke-linecap':'round','stroke-linejoin':'round'});
 var h=el('g',{transform:'translate(20 49)'});
 o[1].forEach(function(d){h.appendChild(el('path',{d:d,stroke:o[0],'stroke-width':1.5}))});
 g.appendChild(h);sv.appendChild(g)}
function all(){[].forEach.call(document.querySelectorAll('nav.rail .ri,nav.tabbar .ri'),tegn)}
all();
})();
