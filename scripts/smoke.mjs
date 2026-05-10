import { existsSync, readFileSync } from 'node:fs';
for (const file of ['dist/index.html','dist/assets']) {
  if (!existsSync(file)) throw new Error(`Missing build artifact: ${file}`);
}
const html = readFileSync('dist/index.html','utf8');
for (const s of ['NoShow Kalkanı', 'Pilot talebi gönder', '/assets/']) {
  if (!html.includes(s)) throw new Error(`Smoke missing: ${s}`);
}
console.log('smoke ok');
