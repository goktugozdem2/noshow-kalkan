import { readFileSync } from 'node:fs';
const html = readFileSync('index.html','utf8');
const must = ['Boş kalan randevu slotlarını', '₺4.900', '7 günlük pilot', 'goktug@datrick.com', 'sales/pilot-proposal.html'];
for (const s of must) {
  if (!html.includes(s)) throw new Error(`Missing copy: ${s}`);
}
console.log('copy ok');
