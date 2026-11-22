/** Claves de almacenamiento compartidas (sin "use client" para poder usarlas en el servidor). */
export const EFFECTS_KEY = "jv-reduce-effects";
export const INTRO_KEY = "jv-intro-visto";
/** Lo pone "Ver intro otra vez": fuerza la intro (versión CSS en móvil). */
export const INTRO_REPLAY_KEY = "jv-intro-otra-vez";
/** Modo elegido por el usuario (jairo | dev | ai): define el color de todo el sitio. */
export const MODE_KEY = "jv-modo";
/** Pausa del movimiento automático ("1" pausado, "0" en marcha). */
export const PAUSE_KEY = "jv-pausa";
/** Tema elegido: "dark" (por defecto) | "light" | "system". */
export const THEME_KEY = "jv-tema";
/** Color de la barra del navegador en cada tema (= --bg). */
export const THEME_COLOR = { dark: "#0B0B0D", light: "#F5EFE6" } as const;

/**
 * Carpeta de las texturas de la intro según idioma y tema (capturas del sitio en public/intro/):
 * "" (español oscuro), "en/", "light/", "en-light/". El script de arranque repite esta regla.
 */
export function introDir(lang: string, theme: string) {
  const parts = [lang === "en" && "en", theme === "light" && "light"].filter(Boolean);
  return parts.length ? `${parts.join("-")}/` : "";
}

/**
 * Tema antes del primer pintado (sin parpadeo): lee la preferencia guardada, resuelve
 * «sistema» con prefers-color-scheme y deja data-theme / data-theme-pref en <html>.
 * Con «sistema», sigue los cambios del sistema operativo aunque el selector no esté montado.
 */
const themeBoot = `try{var d=document.documentElement,tp;try{tp=localStorage.getItem('${THEME_KEY}')}catch(e){}
if(tp!=='light'&&tp!=='system')tp='dark';d.dataset.themePref=tp;var mq=matchMedia('(prefers-color-scheme: light)');
var ap=function(){var p=d.dataset.themePref,t=p==='system'?(mq.matches?'light':'dark'):p;d.dataset.theme=t;
var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='light'?'${THEME_COLOR.light}':'${THEME_COLOR.dark}')};
ap();document.addEventListener('DOMContentLoaded',ap);mq.addEventListener('change',function(){if(d.dataset.themePref==='system')ap()});}catch(e){}`;

/**
 * Script en <head> (antes del primer pintado): aplica el tema, "Reducir efectos" y decide la intro.
 * data-intro = "webgl" → intro 3D (una vez por sesión, solo en el inicio de cada idioma). Sin WebGL no hay intro,
 * y tampoco con WebGL por software (failIfMajorPerformanceCaveat): sin GPU la escena se trabaría y
 * bloquearía la carga varios segundos; esos equipos entran directo al sitio.
 * Si el JS no llega a montar la intro en 8 s, se entra al sitio (nunca una pantalla vacía).
 */
export const bootScript = `${themeBoot}
try{var d=document.documentElement,s=sessionStorage;
if(localStorage.getItem('${EFFECTS_KEY}')==='1')d.dataset.effects='reduced';
var m=localStorage.getItem('${MODE_KEY}');if(m==='dev'||m==='ai')d.dataset.mode=m;
var r=s.getItem('${INTRO_REPLAY_KEY}')==='1';s.removeItem('${INTRO_REPLAY_KEY}');
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
var pa=localStorage.getItem('${PAUSE_KEY}');if(pa==='1'||d.dataset.effects==='reduced'||rm)d.dataset.anim='paused';
var lp=location.pathname;
if((lp==='/'||lp==='/en'||lp==='/en/')&&!s.getItem('${INTRO_KEY}')&&d.dataset.effects!=='reduced'&&!rm){
var c=document.createElement('canvas'),o={failIfMajorPerformanceCaveat:true},g=c.getContext('webgl2',o)||c.getContext('webgl',o);
if(g){var di=g.getExtension('WEBGL_debug_renderer_info'),rn=di?String(g.getParameter(di.UNMASKED_RENDERER_WEBGL)):'';if(/swiftshader|llvmpipe|softpipe|software|basic render/i.test(rn)){if(g.getExtension('WEBGL_lose_context'))g.getExtension('WEBGL_lose_context').loseContext();g=null;}}
if(g){d.dataset.intro='webgl';d.dataset.introKind='webgl';if(g.getExtension('WEBGL_lose_context'))g.getExtension('WEBGL_lose_context').loseContext();
var en=d.lang==='en',li=d.dataset.theme==='light',ib='/intro/'+(en&&li?'en-light/':en?'en/':li?'light/':'');
(innerWidth<768?[ib+'site-mobile.webp']:[ib+'site.webp',ib+'site-scroll.webp']).forEach(function(u){var l=document.createElement('link');l.rel='preload';l.as='image';l.crossOrigin='anonymous';l.href=u;l.fetchPriority='high';document.head.appendChild(l);});
setTimeout(function(){if(d.dataset.intro&&!d.dataset.introMounted){try{s.setItem('${INTRO_KEY}','1')}catch(e){}delete d.dataset.intro;delete d.dataset.introKind;}},8000);
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&d.dataset.intro&&!d.dataset.introMounted){try{s.setItem('${INTRO_KEY}','1')}catch(x){}delete d.dataset.intro;delete d.dataset.introKind;}});}}}catch(e){}`;
