"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, RoundedBox, useTexture } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

/* Línea de tiempo (s) */
const T = { fadeIn: 0.8, drift: 3.2, zoom: 4.4 };
const SCREEN_W = 3.2;
const SCREEN_H = 2.0;
const FOV = 35;
const DEVICE_Y = 0.3;

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
/* Sombra de contacto falsa */
const shadowFragment = /* glsl */ `
  varying vec2 vUv;
  void main() {
    float d = length((vUv - 0.5) * vec2(1.0, 1.6));
    gl_FragColor = vec4(0.0, 0.0, 0.0, smoothstep(0.5, 0.0, d) * 0.75);
  }
`;

function World({ onTick, onReady }: { onTick: (t: number) => void; onReady?: () => void }) {
  // A: página completa (scroll dentro de la pantalla) · B: Hero a 2880×1800 para el cierre nítido
  const [scrollTex, heroTex] = useTexture(["/intro/site-scroll.webp", "/intro/site.webp"]);
  const maxAniso = useThree((st) => st.gl.capabilities.getMaxAnisotropy());

  const { texA, texB, ry } = useMemo(() => {
    const fit = (t: THREE.Texture) => {
      const img = t.image as { width: number; height: number };
      return (SCREEN_H / SCREEN_W) * (img.width / img.height);
    };
    const setup = (t: THREE.Texture, repeatY: number) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = maxAniso; // anisotropía máxima del equipo
      t.magFilter = THREE.LinearFilter; // filtrado lineal (sin pixelado al acercar)
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.generateMipmaps = true;
      t.wrapS = THREE.ClampToEdgeWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      t.repeat.set(1, Math.min(1, repeatY));
      t.offset.set(0, 1 - Math.min(1, repeatY));
      t.needsUpdate = true;
      return t;
    };
    const ra = fit(scrollTex);
    return { texA: setup(scrollTex, ra), texB: setup(heroTex, fit(heroTex)), ry: Math.min(1, ra) };
  }, [scrollTex, heroTex, maxAniso]);

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
  const matB = useRef<THREE.MeshBasicMaterial>(null);
  const matA = useRef<THREE.MeshBasicMaterial>(null);
  const start = useRef<number | null>(null);
  const tmp = useMemo(() => ({ drift: new THREE.Vector3(), end: new THREE.Vector3(), look: new THREE.Vector3() }), []);

  useFrame((state) => {
    const now = state.clock.elapsedTime;
    if (start.current === null) {
      start.current = now;
      onReady?.(); // primer frame con la textura lista
    }
    const t = now - start.current;
    onTick(t);

    // 0–0.8 s: fundido desde negro + el rayo barre el piso
    const f = easeOut(clamp(t / T.fadeIn));
    floorMat.uniforms.uFade.value = f;
    floorMat.uniforms.uSweep.value = lerp(-7, 0, easeOut(clamp(t / 1.3)));
    beamMat.uniforms.uOpacity.value = 0.16 * easeOut(clamp((t - 0.3) / 0.9));
    state.gl.toneMappingExposure = 0.2 + 0.85 * f;

    // 0.8–3.2 s: cámara a la deriva (órbita suave + leve dolly)
    const k = easeInOut(clamp(t / T.drift));
    const a = lerp(-0.42, 0.24, k);
    const r = lerp(8.6, 7.0, k);
    tmp.drift.set(Math.sin(a) * r, lerp(2.5, 1.6, k), Math.cos(a) * r);

    // 3.2–4.4 s: la pantalla gira a frontal y la cámara entra hasta llenar el viewport
    const z = easeInOut(clamp((t - T.drift) / (T.zoom - T.drift)));
    const aspect = state.size.width / state.size.height;
    const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const dEnd = Math.min(SCREEN_H / 2 / tan, SCREEN_W / 2 / (tan * aspect)) * 0.97;
    tmp.end.set(0, DEVICE_Y, dEnd + 0.06);
    state.camera.position.lerpVectors(tmp.drift, tmp.end, z);
    tmp.look.set(0, lerp(0.2, DEVICE_Y, z), 0);
    state.camera.lookAt(tmp.look);

    // Dispositivo: flota, se inclina con el puntero y termina frontal
    const g = device.current;
    if (g) {
      const p = state.pointer;
      g.rotation.x = lerp(-0.52 + p.y * 0.1, 0, z);
      g.rotation.y = lerp(0.4 + p.x * 0.16, 0, z);
      g.rotation.z = lerp(0.05, 0, z);
      g.position.y = lerp(DEVICE_Y + 0.08 + Math.sin(now * 1.3) * 0.05, DEVICE_Y, z);
    }

    // El sitio hace scroll solo dentro de la pantalla; al final se ve el inicio (= Hero real)
    const sc = easeInOut(clamp((t - 0.5) / 2.9));
    texA.offset.y = 1 - ry - sc * (1 - ry) * 0.5;
    if (matA.current) matA.current.color.setScalar(0.25 + 0.75 * f);
    if (matB.current) matB.current.opacity = easeInOut(clamp((t - 3.25) / 0.7));
  });

  return (
    <>
      <ambientLight intensity={0.04} />
      {/* rim light blanco‑rosado en el bisel */}
      <pointLight position={[0.6, 2.6, -1.8]} color="#ffe0e0" intensity={28} distance={9} />
      {/* luz dura del rayo */}
      <spotLight position={[-7, 7.5, -4.5]} angle={0.14} penumbra={0.25} intensity={420} color="#f4f6ff" distance={20} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[0, 5, -4]} scale={[10, 1.2, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#e5383b" position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[4, 1, 1]} />
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
        <mesh position={[0, 0, 0.062]}>
          <planeGeometry args={[SCREEN_W, SCREEN_H]} />
          <meshBasicMaterial ref={matA} map={texA} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, 0.063]}>
          <planeGeometry args={[SCREEN_W, SCREEN_H]} />
          <meshBasicMaterial ref={matB} map={texB} toneMapped={false} transparent opacity={0} />
        </mesh>
      </group>
    </>
  );
}

export default function IntroScene({
  onTick,
  onFail,
  onReady,
}: {
  onTick: (t: number) => void;
  onFail: () => void;
  onReady?: () => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ fov: FOV, position: [0, 2.5, 8.6], near: 0.1, far: 60 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor("#0b0b0f")}
    >
      <PerformanceMonitor onDecline={onFail} />
      <Suspense fallback={null}>
        <World onTick={onTick} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
