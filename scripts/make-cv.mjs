// Genera public/cv.pdf PROVISIONAL de una página. TODO(Jairo): reemplazar por tu CV real.
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { writeFile } from "node:fs/promises";

const pdf = await PDFDocument.create();
pdf.setTitle("CV — Jairo Vallejo Burbano (pendiente)");
pdf.setAuthor("Jairo Vallejo Burbano");
const page = pdf.addPage([595.28, 841.89]); // A4
const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
const reg = await pdf.embedFont(StandardFonts.Helvetica);

page.drawRectangle({ x: 0, y: 0, width: 595.28, height: 841.89, color: rgb(0.024, 0.024, 0.04) });
page.drawRectangle({ x: 56, y: 700, width: 6, height: 60, color: rgb(0.176, 0.482, 1) });
page.drawText("Jairo Vallejo Burbano", { x: 76, y: 735, size: 28, font: bold, color: rgb(0.96, 0.95, 0.98) });
page.drawText("Estudiante de Ingenieria de Software - Pasto, Colombia", {
  x: 76, y: 708, size: 13, font: reg, color: rgb(0.6, 0.6, 0.68),
});
page.drawText("CV pendiente", { x: 56, y: 470, size: 54, font: bold, color: rgb(0.96, 0.95, 0.98) });
page.drawText("La version completa de este CV se publicara pronto.", {
  x: 56, y: 430, size: 14, font: reg, color: rgb(0.6, 0.6, 0.68),
});
page.drawText("Mientras tanto, escribeme desde el formulario de contacto del portafolio.", {
  x: 56, y: 408, size: 14, font: reg, color: rgb(0.6, 0.6, 0.68),
});

await writeFile(new URL("../public/cv.pdf", import.meta.url), await pdf.save());
console.log("public/cv.pdf generado");
