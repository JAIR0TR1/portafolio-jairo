# Jairo Vallejo — Guía de uso del logo

## 1. El logo
- **Idea (JV · Forja):** la J de acero y una V de dos hojas que no llegan a tocarse; donde se encontrarían, salta la
  chispa. Es la paleta *Ember & Steel* hecha forma: acero (J y V) y fuego (la chispa).
- **Construcción:** J con asta de 30 u y gancho redondo (r 50/20) · V de dos hojas de 30 u a 75° exactos · chispa
  en rombo a 45° apoyada en la misma línea base que la J · retícula de 256 u.
- **Versiones** (`brand/logo/`):

| Archivo | Uso |
|---|---|
| `jv-symbol.svg` | Símbolo a color sobre fondos claros |
| `jv-symbol-reversed.svg` | Símbolo a color sobre fondos oscuros (trazo un 3 % más fino: compensa la irradiación) |
| `jv-symbol-small.svg` · `-small-reversed.svg` | **Corte pequeño** para 32 px o menos (trazo más grueso, chispa más grande) |
| `jv-horizontal.svg` · `-reversed.svg` | Logo principal: símbolo + «JAIRO VALLEJO» (Michroma, convertido a trazos) |
| `jv-stacked.svg` · `-reversed.svg` | Apilado, para formatos cuadrados o verticales |
| `jv-app-icon.svg` | Ícono de app: placa `#0B0B0D` con el corte pequeño invertido |
| `variants/` | Una tinta: negro, blanco y azul acero; versión cuadrada para avatar |
| `web/` | `favicon.ico`, PNG 16/32/48, `apple-touch-icon.png` (180), `icon-192/512.png`, `maskable-512.png`, `site.webmanifest` |

En el sitio, el componente `components/ui/Logo.tsx` dibuja el mismo logo: la J toma el color del texto del tema (oscuro o
claro) y elige solo la versión normal o la invertida.

## 2. Espacio libre
Alrededor del logo deja libre **1 × la altura de la chispa** por cada lado (en el símbolo, la chispa mide un 20 % de
la altura del monograma). El espacio crece y se encoge con el logo.

## 3. Tamaño mínimo
| Versión | Pantalla | Impresión |
|---|---|---|
| Símbolo (maestro) | 40 px de alto | 10 mm |
| Símbolo **corte pequeño** | 16 px (favicon) | 5 mm |
| Horizontal | 140 px de ancho | 35 mm |

Por debajo de 40 px usa siempre el corte pequeño: en el maestro, la chispa y el aire entre las hojas se empastan.

## 4. Color
| Nombre | HEX | RGB | CMYK (aprox.) | Rol |
|---|---|---|---|---|
| Tinta | `#0B0B0D` | 11 11 13 | 15 15 0 95 | J y nombre sobre fondos claros; placa del ícono |
| Papel | `#F5F3F0` | 245 243 240 | 0 1 2 4 | J y nombre sobre fondos oscuros |
| Azul acero | `#2F6BFF` | 47 107 255 | 82 58 0 0 | La V |
| Fuego | `#FF5A1F` | 255 90 31 | 0 65 88 0 | La chispa (en web puede llevar el degradado `#FF5A1F → #FFB020`) |

- **Pares aprobados:** color sobre blanco o crema `#F5EFE6` · invertido sobre `#0B0B0D` · blanco sobre azul acero ·
  negro sobre blanco.
- **Contraste:** azul acero sobre tinta 4.4:1 y sobre crema 3.9:1. La chispa de fuego sobre crema queda en 2.7:1; es
  un acento del logotipo (exento de WCAG) y la J y la V llevan la lectura.
- **CMYK aproximado:** para impresión, pide prueba de color a la imprenta. No se definieron tintas Pantone.

## 5. Tipografía
- **Nombre en el logo:** Michroma (Google Fonts, licencia SIL OFL: uso en logos permitido), mayúsculas, tracking
  +0.06 em, convertida a trazos. No la reescribas con el teclado: usa los archivos.
- **En el sitio:** Michroma para títulos grandes · Archivo para textos · JetBrains Mono para etiquetas.

## 6. No hagas
No estires ni deformes · no cambies los colores fuera de la tabla · no gires el logo · no agregues sombras, bordes,
brillos ni efectos · no muevas ni cambies el tamaño de las partes (J, V, chispa, nombre) · no uses el maestro por
debajo de 40 px · no pongas la versión a color sobre fondos oscuros (usa la invertida) · no lo pongas sobre fotos
recargadas sin la placa.

## 7. Archivos y notas
- Masters SVG en `brand/logo/`; presentación con maquetas en `brand/presentacion/` (los nombres de usuario y
  dominios que aparecen en las maquetas son ilustrativos).
- Pruebas hechas: auditoría SVG (98–99/100), prueba de píxel a 16/32/48 px, una tinta, invertido, escala de 16 a
  256 px, sobre fondo oscuro y crema.
- La marca no está registrada: antes de usarla comercialmente, haz una búsqueda de marcas (SIC en Colombia) y una
  búsqueda inversa de imágenes.
