import type { Tx } from "@/lib/i18n";

/** Emprendimiento @jairovende_ (sección extra de la guía). */
export const business = {
  brand: "@jairovende_",
  founded: { es: "finales de 2024", en: "late 2024" } satisfies Tx,
  slogan: {
    es: "Celulares y accesorios en Pasto, con garantía y crédito.",
    en: "Phones and accessories in Pasto, with warranty and financing.",
  } satisfies Tx,
  intro: {
    es: "Desde finales de 2024 vendo celulares iPhone y Android de todas las marcas y rangos de precio, además de accesorios. Toda la mercancía es importada, sellada y con garantía.",
    en: "Since late 2024 I've been selling iPhone and Android phones of every brand and price range, plus accessories. All stock is imported, factory-sealed and under warranty.",
  } satisfies Tx,
  offer: [
    {
      title: { es: "iPhone y Android", en: "iPhone and Android" },
      text: { es: "Todas las marcas y rangos de precio, importados y sellados.", en: "Every brand and price range, imported and factory-sealed." },
    },
    {
      title: { es: "Accesorios", en: "Accessories" },
      text: { es: "Lo necesario para tu equipo, con la misma garantía.", en: "What your phone needs, with the same warranty." },
    },
    {
      title: { es: "Crédito", en: "Financing" },
      text: { es: "Financia tu celular con ADDI, Sistecrédito o Banco de Bogotá.", en: "Finance your phone with ADDI, Sistecrédito or Banco de Bogotá." },
    },
  ] satisfies { title: Tx; text: Tx }[],
  instagram: "https://instagram.com/jairovende_",
  whatsapp:
    "https://wa.me/573013917671?text=Hola%2C%20vi%20tu%20cat%C3%A1logo%20de%20%40jairovende_%20y%20quiero%20informaci%C3%B3n",
  /** Carpetas en public/ (si están vacías, el bloque no se muestra). */
  flyersDir: "images/negocio",
  clientsDir: "images/clientes",
  clientVideosDir: "videos/clientes",
  /** Texto alternativo de cada flyer (por nombre de archivo). Sin entrada, se usa el nombre. */
  alts: {
    "flyer-1.jpg": {
      es: "Flyer de @jairovende_: tres iPhone sellados en la mano; mercancía importada, todas las referencias y crédito con ADDI, Sistecrédito y Banco de Bogotá.",
      en: "@jairovende_ flyer: three sealed iPhones in hand; imported stock, every model and financing with ADDI, Sistecrédito and Banco de Bogotá.",
    },
  } as Record<string, Tx>,
} as const;
