/** Claves de almacenamiento compartidas (sin "use client" para poder usarlas en el servidor). */
export const EFFECTS_KEY = "jv-reduce-effects";
export const INTRO_KEY = "jv-intro-visto";
/** Lo pone "Ver intro otra vez": fuerza la intro (versión CSS en móvil). */
export const INTRO_REPLAY_KEY = "jv-intro-otra-vez";

/**
 * Script en <head> (antes del primer pintado): aplica "Reducir efectos" y decide la intro.
 * data-intro = "webgl" | "css" → se muestra la intro (una vez por sesión, solo en "/").
 */
export const bootScript = `try{var d=document.documentElement,s=sessionStorage;
if(localStorage.getItem('${EFFECTS_KEY}')==='1')d.dataset.effects='reduced';
var r=s.getItem('${INTRO_REPLAY_KEY}')==='1';s.removeItem('${INTRO_REPLAY_KEY}');
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(location.pathname==='/'&&!s.getItem('${INTRO_KEY}')&&d.dataset.effects!=='reduced'&&!rm){
if(innerWidth>=768){var c=document.createElement('canvas'),g=c.getContext('webgl2')||c.getContext('webgl');
d.dataset.intro=g?'webgl':'css';if(g&&g.getExtension('WEBGL_lose_context'))g.getExtension('WEBGL_lose_context').loseContext();}
else if(r){d.dataset.intro='css';}
if(d.dataset.intro)d.dataset.introKind=d.dataset.intro;}}catch(e){}`;
