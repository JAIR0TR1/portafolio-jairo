"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, RoundedBox, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { introDir, introHeroFile } from "@/lib/keys";

/** Capturas del sitio en el idioma y tema actuales (public/intro/…). */
function introBase() {
  const d = document.documentElement;
  return `/intro/${introDir(d.lang, d.dataset.theme ?? "dark")}`;
}

/**
 * Celular. Trayectoria: UNA sola curva continua (Catmull-Rom centrípeta) desde la deriva alrededor de la
 * tablet hasta que su pantalla llena la ventana, recorrida por longitud de arco con UN único
 * ease-in-out en toda la duración. Así la cámara nunca se detiene entre «fases» (antes había
 * tres tramos con su propio ease y la cámara frenaba a cero dos veces: se sentía a tirones).
 * Los últimos puntos están sobre el eje de la pantalla: el tramo final es una entrada recta y
 * frontal. Todo lo demás (giro de la tablet, texturas, transparencia) depende del mismo avance
 * o de la escala real de la pantalla, nunca de relojes sueltos.
 */
type Geo = {
  H: number;
  Y: number;
  /** escala de la pantalla (fracción del alto de la ventana) durante la deriva */
  sDrift: number;
  y0: number;
  y1: number;
  aspect: [number, number];
  /** duración total del vuelo (s) */
  total: number;
  fade: number;
};
const DESKTOP: Geo = { H: 2.0, Y: 0.3, sDrift: 0.34, y0: 2.5, y1: 1.6, aspect: [0.6, 2.4], total: 4.5, fade: 0.8 };
const MOBILE: Geo = { H: 3.2, Y: 0.62, sDrift: 0.5, y0: 2.4, y1: 1.4, aspect: [0.42, 0.8], total: 4.6, fade: 0.8 };

/**
 * Escritorio: la coreografía de la intro original (antes de la Fase 5), que es la que mejor se veía.
 *  - Deriva: la cámara orbita la tablet de −0.42 a 0.24 rad, radio 8.6 → 7.0, altura 2.5 → 1.6.
 *  - Giro + entrada: la tablet gira hasta quedar de frente mientras la cámara entra hasta que la
 *    pantalla llena la ventana.
 * Cambios respecto a la original, solo para que sea continua:
 *  - Las dos fases se solapan (antes la cámara frenaba a cero a los 3.2 s entre una y otra).
 *  - La cámara llega al eje frontal de la pantalla en el 70 % de la entrada y el resto es una entrada
 *    recta: la pantalla es un rectángulo exacto y se funde con el sitio real (Handoff).
 */
const DESK = {
  drift: 3.4, // s: deriva (ease-in-out propio)
  zoomAt: 2.6, // s: empieza el giro + entrada (se solapa con el final de la deriva)
  zoom: 1.9, // s: duración del giro + entrada (termina en DESKTOP.total = 4.5 s)
  axis: 0.7, // fracción de la entrada en la que cámara y tablet quedan alineadas de frente
  angle: [-0.42, 0.24],
  radius: [8.6, 7.0],
} as const;
/** ease-in-out cúbico (el de la intro original) */
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Fin de la animación (la intro se retira en ese instante, sin fundido: ya es el sitio). */
export const introEnd = (mobile: boolean) => (mobile ? MOBILE : DESKTOP).total;
const FOV = 35;
/** Momento de la pantalla que se informa a la intro en cada frame del zoom final. */
export type Handoff = { scale: number; reveal: number };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Ease del vuelo completo: arranque y llegada suaves, velocidad continua en todo el trayecto. */
const easeFlight = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);
const smooth = (a: number, b: number, v: number) => {
  const x = clamp((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/* ─────────── Piso de concreto procedural + franja del rayo de luz ─────────── */
const floorVertex = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;
const floorFragment = /* glsl */ `
  uniform float uFade;
  uniform float uSweep;
  varying vec3 vWorld;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
  void main() {
    vec2 p = vWorld.xz;
    float n = fbm(p * 1.3) * 0.65 + fbm(p * 7.0) * 0.25 + noise(p * 48.0) * 0.1;
    float pores = step(0.92, noise(p * 26.0)) * 0.25;
    vec3 base = vec3(0.05, 0.05, 0.058) * (0.55 + n * 0.9 - pores);

    // rayo de luz duro en diagonal
    vec2 dir = normalize(vec2(1.0, 0.62));
    vec2 nrm = vec2(-dir.y, dir.x);
    float d = dot(p - vec2(0.2, 0.4), nrm) - uSweep;
    float along = dot(p, dir);
    float hard = 1.0 - smoothstep(0.24, 0.3, abs(d));
    float halo = exp(-abs(d) * 2.2) * 0.22;
    float fadeAlong = smoothstep(-9.0, -3.0, along) * (1.0 - smoothstep(3.5, 9.0, along));
    vec3 beam = vec3(1.0, 0.95, 0.98) * (hard * (0.55 + n * 0.5) + halo) * fadeAlong;

    vec3 col = base + beam;
    float r = length(p - vec2(0.0, -0.6));
    col *= smoothstep(10.0, 1.2, r);
    gl_FragColor = vec4(col * uFade, 1.0);
  }
`;

/* Haz volumétrico (plano aditivo) */
const beamFragment = /* glsl */ `
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float across = 1.0 - abs(vUv.x - 0.5) * 2.0;
    float a = pow(across, 3.0) * smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.75, vUv.y);
    gl_FragColor = vec4(vec3(1.0, 0.94, 0.98), a * uOpacity);
  }
`;
const uvVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
/*
 * Pantalla: sitio en scroll (A) → Hero (B) → transparente. Escribe color y alfa premultiplicados
 * sin mezcla: con uReveal = 1 la pantalla es un agujero en el canvas y se ve el DOM real detrás.
 */
const screenFragment = /* glsl */ `
  uniform sampler2D mapA;
  uniform sampler2D mapB;
  uniform vec4 uvA; // repeat.xy, offset.xy
  uniform vec4 uvB;
  uniform float uMix;
  uniform float uDim;
  uniform float uReveal;
  varying vec2 vUv;
  void main() {
    vec3 a = texture2D(mapA, vUv * uvA.xy + uvA.zw).rgb * uDim;
    vec3 b = texture2D(mapB, vUv * uvB.xy + uvB.zw).rgb;
    gl_FragColor = vec4(mix(a, b, uMix), 1.0);
    #include <colorspace_fragment>
    float k = 1.0 - uReveal;
    gl_FragColor = vec4(gl_FragColor.rgb * k, k);
  }
`;
/* Sombra de contacto falsa */
const shadowFragment = /* glsl */ `
  varying vec2 vUv;
  void main() {
    float d = length((vUv - 0.5) * vec2(1.0, 1.6));
    gl_FragColor = vec4(0.0, 0.0, 0.0, smoothstep(0.5, 0.0, d) * 0.75);
  }
`;

function World({
  onTick,
  onReady,
  onHandoff,
  mobile,
}: {
  onTick: (t: number) => void;
  onReady?: () => void;
  onHandoff?: (h: Handoff) => void;
  mobile: boolean;
}) {
  const G = mobile ? MOBILE : DESKTOP;
  const size = useThree((st) => st.size);
  // pantalla con la proporción de la ventana (fijada al montar: la intro dura ~5 s)
  const [aspect] = useState(() => clamp(size.width / Math.max(1, size.height), G.aspect[0], G.aspect[1]));
  const SCREEN_H = G.H;
  const SCREEN_W = G.H * aspect;
  const DEVICE_Y = G.Y;
  const SCREEN_Z = 0.062;
  // A: página completa (scroll dentro de la pantalla) · B: Hero nítido para el cierre del zoom.
  // Celular: captura móvil del Hero (390×844 a 3×) en ambas.
  const base = introBase();
  const [scrollTex, heroTex] = useTexture(
    mobile
      ? [`${base}site-mobile.webp`, `${base}site-mobile.webp`]
      : [`${base}site-scroll.webp`, `${base}${introHeroFile(size.width, size.height)}`],
  );
  const maxAniso = useThree((st) => st.gl.capabilities.getMaxAnisotropy());

  const screenMat = useMemo(() => {
    const setup = (t: THREE.Texture) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = maxAniso; // anisotropía máxima del equipo
      t.magFilter = THREE.LinearFilter; // filtrado lineal (sin pixelado al acercar)
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.generateMipmaps = true;
      t.wrapS = THREE.ClampToEdgeWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      t.needsUpdate = true;
      return t;
    };
    const dims = (t: THREE.Texture) => t.image as { width: number; height: number };
    // A: ancho completo, se recorre en vertical desde arriba
    const a = dims(scrollTex);
    const ra = Math.min(1, (SCREEN_H / SCREEN_W) * (a.width / a.height));
    // B: «cover» centrado en horizontal y anclado arriba (el Hero empieza arriba)
    const bImg = dims(heroTex);
    const tb = bImg.width / bImg.height;
    const rbx = tb > aspect ? aspect / tb : 1;
    const rby = tb > aspect ? 1 : tb / aspect;
    return new THREE.ShaderMaterial({
      vertexShader: uvVertex,
      fragmentShader: screenFragment,
      uniforms: {
        mapA: { value: setup(scrollTex) },
        mapB: { value: setup(heroTex === scrollTex ? heroTex.clone() : heroTex) },
        uvA: { value: new THREE.Vector4(1, ra, 0, 1 - ra) },
        uvB: { value: new THREE.Vector4(rbx, rby, (1 - rbx) / 2, 1 - rby) },
        uMix: { value: 0 },
        uDim: { value: 0.25 },
        uReveal: { value: 0 },
      },
      blending: THREE.NoBlending, // escribe el alfa tal cual: el «agujero» deja ver el DOM
      toneMapped: false,
    });
  }, [scrollTex, heroTex, maxAniso, SCREEN_H, SCREEN_W, aspect]);
  const raA = (screenMat.uniforms.uvA.value as THREE.Vector4).y;

  const floorMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: floorVertex,
        fragmentShader: floorFragment,
        uniforms: { uFade: { value: 0 }, uSweep: { value: -7 } },
      }),
    [],
  );
  const beamMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: uvVertex,
        fragmentShader: beamFragment,
        uniforms: { uOpacity: { value: 0 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const shadowMat = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: uvVertex, fragmentShader: shadowFragment, transparent: true, depthWrite: false }),
    [],
  );

  // Haz: de arriba‑izquierda hacia el piso, junto al dispositivo
  const beam = useMemo(() => {
    const from = new THREE.Vector3(-7, 7.5, -4.5);
    const to = new THREE.Vector3(0.6, -1.1, 0.9);
    const dir = to.clone().sub(from);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return { pos: from.clone().add(to).multiplyScalar(0.5), q, len: dir.length() };
  }, []);

  const device = useRef<THREE.Group>(null);
  const start = useRef<number | null>(null);
  const tmp = useMemo(() => ({ cam: new THREE.Vector3(), look: new THREE.Vector3(), tilt: { x: 0, y: 0 } }), []);

  /** Vuelo: una sola curva; los tres últimos puntos van sobre el eje frontal de la pantalla. */
  const flight = useMemo(() => {
    const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    /** distancia de la cámara a la que la pantalla ocupa la fracción `s` del alto de la ventana */
    const at = (s: number) => SCREEN_Z + SCREEN_H / (2 * tan * s);
    const R = at(G.sDrift);
    const orbit = (angle: number, r: number, y: number) => new THREE.Vector3(Math.sin(angle) * r, y, Math.cos(angle) * r);
    const points = [
      orbit(-0.46, R * 1.14, G.y0),
      orbit(-0.12, R * 1.1, lerp(G.y0, G.y1, 0.45)),
      orbit(0.24, R * 1.03, G.y1),
      new THREE.Vector3(0, DEVICE_Y, at(G.sDrift + 0.06)), // ya de frente
      new THREE.Vector3(0, DEVICE_Y, at(0.62)), // entrada recta
      new THREE.Vector3(0, DEVICE_Y, at(1)), // la pantalla llena la ventana
    ];
    return { curve: new THREE.CatmullRomCurve3(points, false, "centripetal"), axisZ: at(0.62), tan };
  }, [G, SCREEN_H, DEVICE_Y]);

  /**
   * Escritorio: posición de la cámara en el instante t (s). Deriva orbital + entrada; la entrada
   * lleva la cámara al eje frontal (x = 0, altura de la tablet) en DESK.axis y termina con la
   * pantalla llenando exactamente el alto de la ventana. Todas las curvas son C¹: nunca hay
   * cambios bruscos de velocidad.
   */
  const deskCam = (t: number, out: THREE.Vector3) => {
    const k = easeInOut(clamp(t / DESK.drift));
    const z = easeInOut(clamp((t - DESK.zoomAt) / DESK.zoom));
    const a = smooth(0, DESK.axis, z);
    const ang = lerp(DESK.angle[0], DESK.angle[1], k);
    const r = lerp(DESK.radius[0], DESK.radius[1], k);
    const endZ = SCREEN_Z + SCREEN_H / (2 * flight.tan);
    return out.set(Math.sin(ang) * r * (1 - a), lerp(lerp(G.y0, G.y1, k), DEVICE_Y, a), lerp(Math.cos(ang) * r, endZ, z));
  };

  // Preparación fuera de la línea de tiempo (el lienzo sigue invisible): subir las texturas a la GPU y
  // compilar los shaders antes del primer cuadro visible. Si no, ese trabajo (cientos de ms) cae en el
  // primer cuadro de la animación y el vuelo arranca con un salto.
  const gl = useThree((st) => st.gl);
  const scene = useThree((st) => st.scene);
  const camera = useThree((st) => st.camera);
  const warm = useRef<"pending" | "compiled">("pending");
  const settle = useRef(0);
  const warmFrom = useRef(0);
  useEffect(() => {
    let alive = true;
    warmFrom.current = performance.now();
    gl.initTexture(screenMat.uniforms.mapA.value as THREE.Texture);
    gl.initTexture(screenMat.uniforms.mapB.value as THREE.Texture);
    const done = () => alive && (warm.current = "compiled");
    gl.compileAsync(scene, camera).then(done, done);
    return () => {
      alive = false;
    };
  }, [gl, scene, camera, screenMat]);

  useFrame((state, delta) => {
    const now = state.clock.elapsedTime;
    if (start.current === null) {
      // dos cuadros limpios tras compilar (el primero también hornea el Environment): luego arranca el reloj.
      // Tope de 0.5 s de espera: la tarjeta del nombre no puede pasar de 1.5 s (IntroGate), así que en un
      // equipo lento se arranca igual antes que saltarse la intro.
      const waited = performance.now() - warmFrom.current > 500;
      if ((warm.current !== "compiled" && !waited) || ++settle.current < 3) {
        if (mobile) flight.curve.getPointAt(0, tmp.cam);
        else deskCam(0, tmp.cam);
        state.camera.position.copy(tmp.cam);
        state.camera.lookAt(0, mobile ? 0.15 : 0.2, 0);
        return;
      }
      start.current = now;
      onReady?.(); // primer cuadro visible: todo ya está en la GPU
    }
    const t = now - start.current;
    onTick(t);

    // Sala: fundido desde negro + el rayo barre el piso
    const f = easeOut(clamp(t / G.fade));
    floorMat.uniforms.uFade.value = f;
    floorMat.uniforms.uSweep.value = lerp(-7, 0, easeOut(clamp(t / (G.fade + 0.5))));
    beamMat.uniforms.uOpacity.value = 0.16 * easeOut(clamp((t - 0.3) / 0.9));
    state.gl.toneMappingExposure = 0.2 + 0.85 * f;

    // Cámara, giro de la tablet y pantalla. Todo es función del tiempo transcurrido (no de los fps).
    let front: number; // 0 = tablet inclinada (deriva) · 1 = de frente y quieta
    let scroll: number; // recorrido del sitio dentro de la pantalla
    let mix: number; // sitio en scroll → Hero
    let done: boolean; // la pantalla ya llena la ventana
    if (mobile) {
      // Celular: avance único sobre la curva (longitud de arco), siempre mirando a la tablet
      const u = easeFlight(clamp(t / G.total));
      flight.curve.getPointAt(u, tmp.cam);
      front = smooth(0.25, 0.72, u);
      tmp.look.set(0, lerp(0.15, DEVICE_Y, front), 0);
      scroll = smooth(0.06, 0.5, u);
      mix = smooth(0.42, 0.56, u);
      done = u >= 1;
    } else {
      deskCam(t, tmp.cam);
      front = smooth(0, DESK.axis, easeInOut(clamp((t - DESK.zoomAt) / DESK.zoom)));
      tmp.look.set(0, lerp(0.2, DEVICE_Y, front), 0);
      scroll = easeInOut(clamp((t - 0.5) / 2.9));
      mix = easeInOut(clamp((t - 2.9) / 0.6));
      done = t >= G.total;
    }
    state.camera.position.copy(tmp.cam);
    state.camera.lookAt(tmp.look);

    // Escala real de la pantalla (fracción del alto de la ventana): manda la transparencia
    const dist = tmp.cam.distanceTo(tmp.look) - SCREEN_Z;
    const scale = done ? 1 : clamp(SCREEN_H / (2 * flight.tan * Math.max(dist, 1e-3)), 0, 1);
    const onAxis = mobile ? tmp.cam.z <= flight.axisZ + 1e-3 : front >= 1;

    // Tablet: flota e inclina con el puntero (amortiguado con delta: igual a 30 o 144 fps) hasta quedar
    // de frente y quieta
    const g = device.current;
    if (g) {
      const damp = 1 - Math.exp(-delta * 4);
      tmp.tilt.x += (state.pointer.x - tmp.tilt.x) * damp;
      tmp.tilt.y += (state.pointer.y - tmp.tilt.y) * damp;
      const free = 1 - front;
      if (mobile) {
        g.rotation.x = (-0.5 + tmp.tilt.y * 0.08) * free;
        g.rotation.y = (0.38 + tmp.tilt.x * 0.12) * free;
      } else {
        g.rotation.x = (-0.52 + tmp.tilt.y * 0.1) * free;
        g.rotation.y = (0.4 + tmp.tilt.x * 0.16) * free;
      }
      g.rotation.z = 0.05 * free;
      g.position.y = DEVICE_Y + (0.08 + Math.sin(now * 1.3) * 0.05) * free;
    }

    // Pantalla: scroll del sitio → Hero → transparente (deja ver el sitio real detrás)
    (screenMat.uniforms.uvA.value as THREE.Vector4).w = 1 - raA - scroll * (1 - raA);
    screenMat.uniforms.uDim.value = 0.25 + 0.75 * f;
    screenMat.uniforms.uMix.value = mix;
    // la transparencia empieza solo con la cámara ya sobre el eje: el sitio encaja como rectángulo
    const reveal = onAxis ? (mobile ? smooth(0.62, 0.76, scale) : smooth(0.8, 0.93, scale)) : 0;
    screenMat.uniforms.uReveal.value = reveal;
    if (reveal > 0) onHandoff?.({ scale, reveal });
  });

  return (
    <>
      <ambientLight intensity={0.04} />
      {/* rim light blanco‑rosado en el bisel */}
      {!mobile && <pointLight position={[0.6, 2.6, -1.8]} color="#ffe0e0" intensity={28} distance={9} />}
      {/* luz dura del rayo */}
      <spotLight position={[-7, 7.5, -4.5]} angle={0.14} penumbra={0.25} intensity={420} color="#f4f6ff" distance={20} />
      <Environment resolution={mobile ? 64 : 128} frames={1}>
        <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[0, 5, -4]} scale={[10, 1.2, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#ff5a1f" position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[4, 1, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#2f6bff" position={[5, 1, 2]} rotation-y={-Math.PI / 2} scale={[4, 1, 1]} />
      </Environment>

      <mesh rotation-x={-Math.PI / 2} position={[0, -1.1, 0]} material={floorMat}>
        <planeGeometry args={[40, 40]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0.05, -1.09, 0.1]} material={shadowMat}>
        <planeGeometry args={[4.6, 3]} />
      </mesh>
      <mesh position={beam.pos} quaternion={beam.q} material={beamMat}>
        <planeGeometry args={[0.9, beam.len]} />
      </mesh>

      <group ref={device} position={[0, DEVICE_Y, 0]}>
        <RoundedBox args={[SCREEN_W + 0.22, SCREEN_H + 0.22, 0.12]} radius={0.1} smoothness={5}>
          <meshStandardMaterial color="#101116" metalness={0.85} roughness={0.26} envMapIntensity={1.2} />
        </RoundedBox>
        <mesh position={[0, 0, SCREEN_Z]} material={screenMat}>
          <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        </mesh>
      </group>
    </>
  );
}

/** Celular: 30 fps (la escena solo se dibuja cuando se pide un frame). */
function FrameCap({ fps }: { fps: number }) {
  const invalidate = useThree((st) => st.invalidate);
  useEffect(() => {
    const id = window.setInterval(() => invalidate(), 1000 / fps);
    return () => window.clearInterval(id);
  }, [invalidate, fps]);
  return null;
}

// Precarga: las texturas se piden en cuanto se importa la escena; la animación arranca con todo listo.
if (typeof window !== "undefined") {
  const base = introBase();
  if (window.innerWidth < 768) useTexture.preload(`${base}site-mobile.webp`);
  else useTexture.preload([`${base}site-scroll.webp`, `${base}${introHeroFile(window.innerWidth, window.innerHeight)}`]);
}

export default function IntroScene({
  onTick,
  onFail,
  onReady,
  onHandoff,
}: {
  onTick: (t: number) => void;
  onFail: () => void;
  onReady?: () => void;
  onHandoff?: (h: Handoff) => void;
}) {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  const G = mobile ? MOBILE : DESKTOP;
  return (
    <Canvas
      // resolución real de la pantalla (devicePixelRatio con tope 2) y antialiasing
      dpr={[1, 2]}
      frameloop={mobile ? "demand" : "always"}
      camera={{ fov: FOV, position: [0, G.y0, 10], near: 0.1, far: 80 }} // la curva coloca la cámara desde el primer frame
      gl={{ antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor("#0b0b0d", 1)}
    >
      {mobile && <FrameCap fps={30} />}
      {/* Si el equipo no da abasto, se entra al sitio. En celular el tope es 30 fps a propósito:
          los umbrales se ajustan a ese tope (si no, 30 fps contaría como «lento» y cortaría la intro). */}
      <PerformanceMonitor onDecline={onFail} bounds={(refresh) => (mobile ? [18, 26] : [Math.min(45, refresh * 0.75), Math.min(55, refresh * 0.9)])} />
      <Suspense fallback={null}>
        <World onTick={onTick} onReady={onReady} onHandoff={onHandoff} mobile={mobile} />
      </Suspense>
    </Canvas>
  );
}
