import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "placeholder");
mkdirSync(OUT, { recursive: true });

const COLORS = ["#E8DCC8", "#D9C9AE", "#C9B593", "#B8A178"];

function svg(label, color, w = 1600, h = 1067) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${color}"/>
  <text x="50%" y="50%" fill="#8A7A5C" font-family="system-ui, sans-serif"
        font-size="${Math.round(w / 22)}" text-anchor="middle" dominant-baseline="middle">${label}</text>
</svg>`;
}

// 4 fotos por apartamento
for (let n = 1; n <= 5; n++) {
  for (let i = 1; i <= 4; i++) {
    writeFileSync(
      join(OUT, `apartamento-${n}-${i}.svg`),
      svg(`Apartamento ${n} · foto ${i}`, COLORS[(i - 1) % COLORS.length]),
    );
  }
}

// Imágenes sueltas
const singles = [
  ["hero", "Pozoblanco", 2400, 1350],
  ["zona-dehesa", "Dehesa de Los Pedroches", 1600, 1067],
  ["zona-que-ver", "Que ver", 1600, 1067],
  ["zona-donde-comer", "Donde comer", 1600, 1067],
  ["zona-como-llegar", "Como llegar", 1600, 1067],
];

for (const [name, label, w, h] of singles) {
  writeFileSync(join(OUT, `${name}.svg`), svg(label, "#E8DCC8", w, h));
}

console.log("Placeholders generados en public/placeholder");
