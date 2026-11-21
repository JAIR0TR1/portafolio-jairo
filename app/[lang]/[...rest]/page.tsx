import { notFound } from "next/navigation";

/** Cualquier ruta desconocida muestra la página 404 del idioma, dentro del layout del sitio. */
export default function UnknownRoute() {
  notFound();
}
