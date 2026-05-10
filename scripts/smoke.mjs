import { existsSync, readFileSync } from 'node:fs';
for (const file of ['dist/index.html','dist/assets','seo/dis-klinigi-randevu-hatirlatma.html','seo/kadikoy-dis-klinigi-randevu-kaybi.html']) {
  if (!existsSync(file)) throw new Error(`Missing build artifact: ${file}`);
}
const html = readFileSync('dist/index.html','utf8');
for (const s of ['NoShow Kalkanı', 'Pilot talebi gönder', '/assets/', 'Klinik randevu kaybı']) {
  if (!html.includes(s)) throw new Error(`Smoke missing: ${s}`);
}
console.log('smoke ok');
