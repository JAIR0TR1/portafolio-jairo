/**
 * Fondo de todo el sitio: 3 auroras radiales con los colores del modo (animación lenta
 * de 20–30 s, quietas con reduced-motion), rejilla de puntos sutil y viñeta.
 * El grano fino lo pone body::after (globals.css).
 */
export function Aurora() {
  return (
    <div aria-hidden="true" className="aurora">
      <span className="aurora-blob" />
      <span className="aurora-blob" />
      <span className="aurora-blob" />
      <span className="aurora-dots" />
      <span className="aurora-vignette" />
    </div>
  );
}
