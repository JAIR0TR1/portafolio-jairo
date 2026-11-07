/**
 * Fondo de todo el sitio: rejilla de puntos muy tenue y viñeta hacia un --bg más oscuro.
 * El color lo pone el modo (variables --bg / --accent). El grano fino lo pone body::after.
 */
export function Aurora() {
  return (
    <div aria-hidden="true" className="aurora">
      <span className="aurora-dots" />
      <span className="aurora-vignette" />
    </div>
  );
}
