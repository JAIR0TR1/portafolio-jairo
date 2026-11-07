/** Claves de almacenamiento compartidas (sin "use client" para poder usarlas en el servidor). */
export const EFFECTS_KEY = "jv-reduce-effects";
export const INTRO_KEY = "jv-intro-visto";
/** Lo pone "Ver intro otra vez": fuerza la intro (versión CSS en móvil). */
export const INTRO_REPLAY_KEY = "jv-intro-otra-vez";
/** Modo elegido por el usuario (jairo | dev | ai): define el color de todo el sitio. */
export const MODE_KEY = "jv-modo";

/**
 * Script en <head> (antes del primer pintado): aplica "Reducir efectos" y decide la intro.
 * data-intro = "webgl" | "css" → se muestra la intro (una vez por sesión, solo en "/").
 */
export const bootScript = `try{var d=document.documentElement,s=sessionStorage;
if(localStorage.getItem('${EFFECTS_KEY}')==='1')d.dataset.effects='reduced';
var m=localStorage.getItem('${MODE_KEY}');if(m==='dev'||m==='ai')d.dataset.mode=m;
var r=s.getItem('${INTRO_REPLAY_KEY}')==='1';s.removeItem('${INTRO_REPLAY_KEY}');
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(location.pathname==='/'&&!s.getItem('${INTRO_KEY}')&&d.dataset.effects!=='reduced'&&!rm){
if(innerWidth>=768){var c=document.createElement('canvas'),g=c.getContext('webgl2')||c.getContext('webgl');
d.dataset.intro=g?'webgl':'css';if(g&&g.getExtension('WEBGL_lose_context'))g.getExtension('WEBGL_lose_context').loseContext();}
else if(r){d.dataset.intro='css';}
if(d.dataset.intro){d.dataset.introKind=d.dataset.intro;var l=document.createElement('link');l.rel='preload';l.as='image';l.href='/intro/site.webp';l.fetchPriority='high';document.head.appendChild(l);
// Sin JS (o si tarda): la intro se puede saltar y termina sola; IntroGate toma el control al montar.
var end=function(){if(!d.dataset.intro||d.dataset.introMounted)return;try{s.setItem('${INTRO_KEY}','1')}catch(e){}delete d.dataset.intro;delete d.dataset.introKind;delete d.dataset.introGl;var h=decodeURIComponent(location.hash.slice(1)),t=h&&document.getElementById(h);if(t)t.scrollIntoView();};
setTimeout(end,6500);
document.addEventListener('click',function(e){var x=e.target;if(x&&x.closest&&x.closest('[data-intro-skip]')){e.preventDefault();end();}});
document.addEventListener('keydown',function(e){if(e.key==='Escape')end();});}}}catch(e){}`;
