/** Claves de almacenamiento compartidas (sin "use client" para poder usarlas en el servidor). */
export const EFFECTS_KEY = "jv-reduce-effects";
export const INTRO_KEY = "jv-intro-visto";
/** Lo pone "Ver intro otra vez": fuerza la intro (versión CSS en móvil). */
export const INTRO_REPLAY_KEY = "jv-intro-otra-vez";
/** Modo elegido por el usuario (jairo | dev | ai): define el color de todo el sitio. */
export const MODE_KEY = "jv-modo";
/** Pausa del movimiento automático ("1" pausado, "0" en marcha). */
export const PAUSE_KEY = "jv-pausa";

/**
 * Script en <head> (antes del primer pintado): aplica "Reducir efectos" y decide la intro.
 * data-intro = "webgl" → intro 3D (una vez por sesión, solo en "/"). Sin WebGL no hay intro.
 * Si el JS no llega a montar la intro en 8 s, se entra al sitio (nunca una pantalla vacía).
 */
export const bootScript = `try{var d=document.documentElement,s=sessionStorage;
if(localStorage.getItem('${EFFECTS_KEY}')==='1')d.dataset.effects='reduced';
var m=localStorage.getItem('${MODE_KEY}');if(m==='dev'||m==='ai')d.dataset.mode=m;
var r=s.getItem('${INTRO_REPLAY_KEY}')==='1';s.removeItem('${INTRO_REPLAY_KEY}');
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
var pa=localStorage.getItem('${PAUSE_KEY}');if(pa==='1'||d.dataset.effects==='reduced'||rm)d.dataset.anim='paused';
if(location.pathname==='/'&&!s.getItem('${INTRO_KEY}')&&d.dataset.effects!=='reduced'&&!rm){
var c=document.createElement('canvas'),g=c.getContext('webgl2')||c.getContext('webgl');
if(g){d.dataset.intro='webgl';d.dataset.introKind='webgl';if(g.getExtension('WEBGL_lose_context'))g.getExtension('WEBGL_lose_context').loseContext();
(innerWidth<768?['/intro/site-mobile.webp']:['/intro/site.webp','/intro/site-scroll.webp']).forEach(function(u){var l=document.createElement('link');l.rel='preload';l.as='image';l.href=u;l.fetchPriority='high';document.head.appendChild(l);});
setTimeout(function(){if(d.dataset.intro&&!d.dataset.introMounted){try{s.setItem('${INTRO_KEY}','1')}catch(e){}delete d.dataset.intro;delete d.dataset.introKind;}},8000);
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&d.dataset.intro&&!d.dataset.introMounted){try{s.setItem('${INTRO_KEY}','1')}catch(x){}delete d.dataset.intro;delete d.dataset.introKind;}});}}}catch(e){}`;
