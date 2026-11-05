// Lista los TODO(Jairo) que faltan (archivo:línea).
// `npm run check:content -- --write` además regenera la sección automática de PENDIENTES.md.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const IGNORE = new Set(["node_modules", ".next", ".git", "out", "docs", "test-results", "playwright-report"]);
const EXT = /\.(tsx?|mjs|css|md)$/;
const SKIP_FILES = new Set(["PENDIENTES.md", "CLAUDE.md", "README.md", join("scripts", "check-content.mjs")]);
const MARK = "TODO" + "(Jairo)";

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (IGNORE.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (EXT.test(e.name)) out.push(p);
  }
  return out;
}

const hits = [];
for (const file of await walk(root)) {
  const rel = relative(root, file);
  if (SKIP_FILES.has(rel)) continue;
  const lines = (await readFile(file, "utf8")).split(/\r?\n/);
  lines.forEach((line, i) => {
    const at = line.indexOf(MARK);
    if (at === -1) return;
    const note = line.slice(at + MARK.length).replace(/^[:\s]+/, "").replace(/\*\/|\}$/g, "").trim();
    const code = line.slice(0, at).replace(/\/\/\s*$|\{\/\*\s*$/, "").trim().replaceAll("`", "").slice(0, 70);
    hits.push({ file: rel.split(sep).join("/"), line: i + 1, note: note || `completar: ${code}` });
  });
}

hits.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
for (const h of hits) console.log(`${h.file}:${h.line}  ${h.note}`);
console.log(`\n${hits.length} pendientes ${MARK}`);

if (process.argv.includes("--write")) {
  const path = join(root, "PENDIENTES.md");
  const md = await readFile(path, "utf8");
  const start = "<!-- AUTO:INICIO -->";
  const end = "<!-- AUTO:FIN -->";
  const table = [
    "| Archivo | Línea | Qué falta |",
    "| --- | --- | --- |",
    ...hits.map((h) => `| \`${h.file}\` | ${h.line} | ${h.note.replace(/\|/g, "\\|")} |`),
  ].join("\n");
  const next = md.replace(new RegExp(`${start}[\\s\\S]*${end}`), `${start}\n${table}\n${end}`);
  await writeFile(path, next);
  console.log("PENDIENTES.md actualizado");
}
