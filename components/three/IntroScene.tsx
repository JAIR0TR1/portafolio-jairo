"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, RoundedBox, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { introDir } from "@/lib/keys";

/** Capturas del sitio en el idioma y tema actuales (public/intro/…). */
function introBase() {
  const d = document.documentElement;
  return `/intro/${introDir(d.lang, d.dataset.theme ?? "dark")}`;
}

/**
 * Línea de tiempo (s, desde que la escena está lista). Todo con ease-in-out:
 *  fade   aparece la sala (el rayo barre el piso)
 *  drift  la cámara orbita a la deriva mientras el sitio hace scroll dentro de la pantalla
 *  turn   la tablet gira a frontal y la cámara se coloca de frente (la pantalla ocupa SMID del alto)
 *  dolly  la cámara entra en línea recta hasta que la pantalla llena exactamente la ventana
 *  cross  la pantalla se vuelve transparente y deja ver EL SITIO REAL, escalado por CSS al mismo
 *         rectángulo en cada frame (elemento compartido): al terminar, la pantalla ES el inicio.
 */
type Timeline = { fade: number; drift: number; turn: [number, number]; dolly: [number, number]; cross: [number, number] };
const TL_DESKTOP: Timeline = { fade: 0.9, drift: 3.0, turn: [2.4, 3.6], dolly: [3.6, 5.0], cross: [3.75, 4.35] };
const TL_MOBILE: Timeline = { fade: 0.8, drift: 2.6, turn: [2.0, 3.1], dolly: [3.1, 4.3], cross: [3.2, 3.75] };
/** Fin de la animación (la intro se retira en ese instante, sin fundido: ya es el sitio). */
export const introEnd = (mobile: boolean) => (mobile ? TL_MOBILE : TL_DESKTOP).dolly[1];
const SMID = 0.52;
const FOV = 35;
/**
 * Geometría por formato: escritorio = tablet horizontal; celular = tablet vertical, cámara más cerca.
 * El ANCHO de la pantalla se calcula con la proporción real de la ventana (H × aspecto): así, al
 * final del zoom, la pantalla cubre la ventana exactamente y el sitio real encaja sin bordes.
 */
type Geo = { H: number; Y: number; r0: number; r1: number; y0: number; y1: number; aspect: [number, number] };
const DESKTOP: Geo = { H: 2.0, Y: 0.3, r0: 8.6, r1: 7.0, y0: 2.5, y1: 1.6, aspect: [1.25, 2.4] };
const MOBILE: Geo = { H: 3.2, Y: 0.62, r0: 9.4, r1: 8.2, y0: 2.4, y1: 1.6, aspect: [0.42, 0.8] };
/** Momento de la pantalla que se informa a la intro en cada frame del zoom final. */
export type Handoff = { scale: number; reveal: number };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
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
  const TL = mobile ? TL_MOBILE : TL_DESKTOP;
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
    mobile ? [`${base}site-mobile.webp`, `${base}site-mobile.webp`] : [`${base}site-scroll.webp`, `${base}site.webp`],
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
  const tmp = useMemo(
    () => ({ drift: new THREE.Vector3(), mid: new THREE.Vector3(), cam: new THREE.Vector3(), look: new THREE.Vector3(), lookMid: new THREE.Vector3() }),
    [],
  );

  useFrame((state) => {
    const now = state.clock.elapsedTime;
    if (start.current === null) {
      start.current = now;
      onReady?.(); // primer frame con la textura lista
    }
    const t = now - start.current;
    onTick(t);
    const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    /** Distancia de la cámara a la que la pantalla ocupa la fracción `s` del alto de la ventana. */
    const distFor = (s: number) => SCREEN_H / (2 * tan * s);

    // Sala: fundido desde negro + el rayo barre el piso
    const f = easeOut(clamp(t / TL.fade));
    floorMat.uniforms.uFade.value = f;
    floorMat.uniforms.uSweep.value = lerp(-7, 0, easeOut(clamp(t / (TL.fade + 0.5))));
    beamMat.uniforms.uOpacity.value = 0.16 * easeOut(clamp((t - 0.3) / 0.9));
    state.gl.toneMappingExposure = 0.2 + 0.85 * f;

    // Deriva: órbita suave + leve dolly
    const k = easeInOut(clamp(t / TL.drift));
    const a = lerp(-0.42, 0.24, k);
    const r = lerp(G.r0, G.r1, k);
    tmp.drift.set(Math.sin(a) * r, lerp(G.y0, G.y1, k), Math.cos(a) * r);

    // Giro a frontal: la cámara se coloca de frente a la pantalla (ocupa SMID del alto)
    const u1 = easeInOut(clamp((t - TL.turn[0]) / (TL.turn[1] - TL.turn[0])));
    tmp.mid.set(0, DEVICE_Y, SCREEN_Z + distFor(SMID));
    // Entrada en línea recta: se interpola la ESCALA de la pantalla (no la distancia): zoom parejo
    const u2 = easeInOut(clamp((t - TL.dolly[0]) / (TL.dolly[1] - TL.dolly[0])));
    const scale = lerp(SMID, 1, u2);
    if (u2 > 0) tmp.cam.set(0, DEVICE_Y, SCREEN_Z + distFor(scale));
    else tmp.cam.lerpVectors(tmp.drift, tmp.mid, u1);
    state.camera.position.copy(tmp.cam);
    tmp.lookMid.set(0, DEVICE_Y, 0);
    tmp.look.set(0, 0.2, 0).lerp(tmp.lookMid, u1);
    state.camera.lookAt(tmp.look);

    // Dispositivo: flota y se inclina con el puntero; frontal y quieto al terminar el giro
    const g = device.current;
    if (g) {
      const p = state.pointer;
      g.rotation.x = lerp(-0.52 + p.y * 0.1, 0, u1);
      g.rotation.y = lerp(0.4 + p.x * 0.16, 0, u1);
      g.rotation.z = lerp(0.05, 0, u1);
      g.position.y = lerp(DEVICE_Y + 0.08 + Math.sin(now * 1.3) * 0.05, DEVICE_Y, u1);
    }

    // Pantalla: scroll del sitio → Hero → transparente (se ve el sitio real detrás)
    const sc = easeInOut(clamp((t - 0.5) / (TL.drift - 0.4)));
    (screenMat.uniforms.uvA.value as THREE.Vector4).w = 1 - raA - sc * (1 - raA);
    screenMat.uniforms.uDim.value = 0.25 + 0.75 * f;
    screenMat.uniforms.uMix.value = easeInOut(clamp((t - (TL.turn[0] + 0.3)) / 0.7));
    const reveal = easeInOut(clamp((t - TL.cross[0]) / (TL.cross[1] - TL.cross[0])));
    screenMat.uniforms.uReveal.value = reveal;
    if (u2 > 0 || reveal > 0) onHandoff?.({ scale, reveal });
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
  else useTexture.preload([`${base}site-scroll.webp`, `${base}site.webp`]);
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
      camera={{ fov: FOV, position: [0, G.y0, G.r0], near: 0.1, far: 60 }}
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
