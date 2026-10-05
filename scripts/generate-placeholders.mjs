// Genera imágenes placeholder SVG profesionales (sin dependencias externas)
// temáticas de transporte / telecomunicaciones / tecnología / infraestructura.
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "images");
fs.mkdirSync(OUT_DIR, { recursive: true });

const PALETTES = {
  transporte: ["#0B2447", "#1B4A8B"],
  aeropuertos: ["#0F3D6E", "#1868B0"],
  puertos: ["#0A2342", "#1B5E6B"],
  telecomunicaciones: ["#0F3D6E", "#2E6FAD"],
  infraestructura: ["#0A2342", "#2C5F8A"],
};

// Iconos de línea simples (24x24 viewBox) representativos por categoría.
const ICONS = {
  transporte:
    '<path d="M4 16h16M6 16v3M18 16v3M5 12l1.5-5A2 2 0 0 1 8.4 5.5h7.2A2 2 0 0 1 17.5 7L19 12v4H5v-4Z" fill="none" stroke="white" stroke-width="1.4" stroke-linejoin="round"/><circle cx="8" cy="19" r="1.2" fill="white"/><circle cx="16" cy="19" r="1.2" fill="white"/>',
  aeropuertos:
    '<path d="M2.5 16.5 21 11l.5 2-8 3.3.5 4.2-2.3 1-1.2-4.6-5 1.6-.6-1.6 3.7-2.6-5-1.8Z" fill="white" stroke="white" stroke-width="0.4" stroke-linejoin="round"/>',
  puertos:
    '<path d="M12 3v9M9 6h6M4 14l1.5 6h13L20 14M4 14h16M4 14l4-3M20 14l-4-3" fill="none" stroke="white" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"/>',
  telecomunicaciones:
    '<path d="M12 3v6M12 9a4 4 0 0 1 4 4M12 9a4 4 0 0 0-4 4M12 9a7 7 0 0 1 7 7M12 9a7 7 0 0 0-7 7" fill="none" stroke="white" stroke-width="1.3" stroke-linecap="round"/><circle cx="12" cy="3" r="1.5" fill="white"/>',
  infraestructura:
    '<path d="M4 20 10 6l4 8 2-4 4 10H4Z" fill="none" stroke="white" stroke-width="1.3" stroke-linejoin="round"/><path d="M3 20h18" stroke="white" stroke-width="1.3" stroke-linecap="round"/>',
};

function svgFor(category, seed) {
  const [c1, c2] = PALETTES[category] ?? PALETTES.infraestructura;
  const icon = ICONS[category] ?? ICONS.infraestructura;
  const angle = (seed * 37) % 360;
  const stripes = Array.from({ length: 5 }, (_, i) => {
    const x = (i * 180 + seed * 40) % 1200;
    return `<rect x="${x}" y="0" width="2" height="675" fill="white" opacity="0.04" transform="skewX(-20)"/>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${angle})">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#g)"/>
  ${stripes}
  <rect x="0" y="615" width="1200" height="6" fill="#FFC72C"/>
  <g transform="translate(540,255) scale(10)">${icon}</g>
</svg>`;
}

const jobs = JSON.parse(fs.readFileSync(process.argv[2], "utf-8"));
for (const job of jobs) {
  const svg = svgFor(job.category, job.seed);
  fs.writeFileSync(path.join(OUT_DIR, `${job.slug}.svg`), svg, "utf-8");
}
console.log(`Generadas ${jobs.length} imágenes en ${OUT_DIR}`);
