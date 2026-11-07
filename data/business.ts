/** Emprendimiento @jairovende_ (sección extra de la guía). */
export const business = {
  brand: "@jairovende_",
  founded: "finales de 2024",
  slogan: "Celulares y accesorios en Pasto, con garantía y crédito.",
  intro:
    "Desde finales de 2024 vendo celulares iPhone y Android de todas las marcas y rangos de precio, además de accesorios. Toda la mercancía es importada, sellada y con garantía.",
  offer: [
    { title: "iPhone y Android", text: "Todas las marcas y rangos de precio, importados y sellados." },
    { title: "Accesorios", text: "Lo necesario para tu equipo, con la misma garantía." },
    { title: "Crédito", text: "Financia tu celular con ADDI, Sistecrédito o Banco de Bogotá." },
  ],
  instagram: "https://instagram.com/jairovende_",
  whatsapp:
    "https://wa.me/573013917671?text=Hola%2C%20vi%20tu%20cat%C3%A1logo%20de%20%40jairovende_%20y%20quiero%20informaci%C3%B3n",
  /** Carpetas en public/ (si están vacías, el bloque no se muestra). */
  flyersDir: "images/negocio",
  clientsDir: "images/clientes",
  clientVideosDir: "videos/clientes",
  /** Texto alternativo de cada flyer (por nombre de archivo). Sin entrada, se usa el nombre. */
  alts: {
    "flyer-1.jpg":
      "Flyer de @jairovende_: tres iPhone sellados en la mano; mercancía importada, todas las referencias y crédito con ADDI, Sistecrédito y Banco de Bogotá.",
  } as Record<string, string>,
} as const;
