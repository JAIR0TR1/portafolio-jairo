/** Malla de gradientes del Hero (sin filtros blur: radial-gradients baratos). Sigue al --accent. */
export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -right-[20%] -top-[30%] h-[110%] w-[80%] animate-drift rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_55%,transparent),transparent)] opacity-70" />
      <div
        className="absolute -left-[25%] top-[10%] h-[90%] w-[70%] animate-drift rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_30%,var(--color-violet)_25%),transparent)] opacity-50"
        style={{ animationDelay: "-8s" }}
      />
      <div
        className="absolute -bottom-[40%] left-[25%] h-[80%] w-[70%] animate-drift rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_35%,var(--color-magenta)_20%),transparent)] opacity-40"
        style={{ animationDelay: "-15s" }}
      />
      {/* cuadrícula técnica */}
      <div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/.035)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_70%_60%_at_60%_40%,black,transparent)]" />
      {/* viñeta hacia obsidiana */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}
