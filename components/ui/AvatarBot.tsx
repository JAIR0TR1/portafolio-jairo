import type { CSSProperties } from "react";

type Props = {
  /** Color emisivo (ojos, antena, rim light). Por defecto el --accent global. */
  color?: string;
  blinking?: boolean;
  className?: string;
  style?: CSSProperties;
  /** id único para los gradientes cuando hay varias instancias. */
  uid?: string;
};

/**
 * Avatar PROVISIONAL original: casco con visor oscuro, dos ojos emisivos y antena que pulsa.
 * TODO(Jairo): reemplazar por los PNG de /public/avatar (dev.png, design.png, ai.png).
 */
export function AvatarBot({ color = "var(--accent)", blinking = false, className, style, uid = "a" }: Props) {
  const id = (s: string) => `${uid}-${s}`;
  const eyeScale = blinking ? 0.08 : 1;
  return (
    <svg viewBox="0 0 400 460" className={className} style={{ ...style, color }} aria-hidden="true">
      <defs>
        <radialGradient id={id("halo")} cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("shell")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a37" />
          <stop offset="55%" stopColor="#14141c" />
          <stop offset="100%" stopColor="#0b0b11" />
        </linearGradient>
        <linearGradient id={id("rim")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={id("visor")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14141f" />
          <stop offset="100%" stopColor="#030306" />
        </linearGradient>
        <linearGradient id={id("body")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d1d27" />
          <stop offset="100%" stopColor="#08080c" />
        </linearGradient>
        <filter id={id("glow")} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* halo y luz desde abajo */}
      <circle cx="200" cy="250" r="200" fill={`url(#${id("halo")})`} />
      <ellipse cx="200" cy="452" rx="150" ry="14" fill="currentColor" opacity="0.35" filter={`url(#${id("glow")})`} className="avatar-glow" />

      {/* cuerpo / hombros */}
      <path d="M78 460 C84 392 120 352 200 352 C280 352 316 392 322 460 Z" fill={`url(#${id("body")})`} />
      <path d="M78 460 C84 392 120 352 200 352 C280 352 316 392 322 460" fill="none" stroke={`url(#${id("rim")})`} strokeWidth="2" />
      <rect x="176" y="300" width="48" height="60" rx="14" fill="#0e0e15" />
      {/* insignia */}
      <circle cx="200" cy="410" r="7" fill="currentColor" filter={`url(#${id("glow")})`} className="avatar-glow" />

      {/* antena */}
      <line x1="200" y1="112" x2="200" y2="66" stroke="#2a2a37" strokeWidth="6" strokeLinecap="round" />
      <g className="origin-[200px_58px] md:animate-pulse-soft">
        <circle cx="200" cy="58" r="10" fill="currentColor" filter={`url(#${id("glow")})`} className="avatar-glow" />
      </g>

      {/* orejas */}
      <rect x="70" y="182" width="24" height="64" rx="12" fill={`url(#${id("shell")})`} stroke="rgb(255 255 255 / .08)" />
      <rect x="306" y="182" width="24" height="64" rx="12" fill={`url(#${id("shell")})`} stroke="rgb(255 255 255 / .08)" />

      {/* casco */}
      <rect x="88" y="108" width="224" height="208" rx="96" fill={`url(#${id("shell")})`} />
      <rect x="88" y="108" width="224" height="208" rx="96" fill="none" stroke={`url(#${id("rim")})`} strokeWidth="2.5" />
      {/* brillo superior */}
      <path d="M140 132 C170 118 230 118 260 132" stroke="#fff" strokeOpacity="0.18" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* visor */}
      <rect x="112" y="162" width="176" height="100" rx="50" fill={`url(#${id("visor")})`} stroke="rgb(255 255 255 / .07)" />
      <path d="M132 178 C150 170 175 168 196 170" stroke="#fff" strokeOpacity="0.1" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* ojos */}
      <g
        style={{
          // --lx/--ly los pone HeroAvatar (seguimiento del cursor sin re-render)
          transform: "translate(calc(var(--lx, 0) * 1px), calc(var(--ly, 0) * 1px))",
          transition: "transform 160ms ease-out",
        }}
      >
        <g
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            transform: `scaleY(${eyeScale})`,
            transition: "transform 90ms ease-out",
          }}
        >
          <rect x="156" y="194" width="20" height="38" rx="10" fill="currentColor" filter={`url(#${id("glow")})`} className="avatar-glow" />
          <rect x="224" y="194" width="20" height="38" rx="10" fill="currentColor" filter={`url(#${id("glow")})`} className="avatar-glow" />
        </g>
      </g>
    </svg>
  );
}
