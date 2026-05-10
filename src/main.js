const slots = document.querySelector('#slots');
const ticket = document.querySelector('#ticket');
const rate = document.querySelector('#rate');
const output = document.querySelector('#roiOutput');
function formatTRY(value){return new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:0}).format(value)}
function calc(){const weekly=(Number(slots.value)||0)*(Number(ticket.value)||0)*((Number(rate.value)||0)/100); output.textContent=`Haftalık tahmini kurtarma: ${formatTRY(weekly)}`}
[slots,ticket,rate].forEach(el=>el?.addEventListener('input',calc)); calc();
const form = document.querySelector('#leadForm');
const status = document.querySelector('#formStatus');
form?.addEventListener('submit', async (event)=>{
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  if(!data.consent){ status.textContent='İletişim izni olmadan pilot talebi alamıyoruz.'; return; }
  status.textContent='Gönderiliyor...';
  try{
    const response = await fetch('/api/leads', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    if(!response.ok) throw new Error(await response.text());
    status.textContent='Talep alındı. 24 saat içinde dönüş yapılacak.';
    form.reset();
  }catch(error){
    const subject=encodeURIComponent('NoShow Kalkanı Pilot Talebi');
    const body=encodeURIComponent(`Klinik: ${data.clinic}\nYetkili: ${data.name}\nTelefon: ${data.phone}\nHaftalık kayıp: ${data.lost||'-'}`);
    window.location.href=`mailto:goktug@datrick.com?subject=${subject}&body=${body}`;
    status.textContent='Form altyapısı henüz bağlanmadı; e-posta taslağı açıldı.';
  }
});

const autoReportForm = document.querySelector('#autoReportForm');
const autoReportResult = document.querySelector('#autoReportResult');
autoReportForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(autoReportForm).entries());
  const slots = Number(data.slots || 0);
  const ticket = Number(data.ticket || 0);
  const rate = Number(data.rate || 0);
  const weekly = slots * ticket * (rate / 100);
  const monthly = weekly * 4;
  const payback = weekly > 0 ? (4900 / weekly).toFixed(1) : '—';
  const score = monthly >= 30000 ? 'yüksek öncelik' : monthly >= 12000 ? 'mantıklı pilot' : 'düşük hacim / dikkatli pilot';
  const title = encodeURIComponent(`Pilot talebi: ${data.clinic}`);
  const body = encodeURIComponent([
    '## NoShow Kalkanı pilot talebi',
    '',
    `Klinik: ${data.clinic}`,
    `Yetkili: ${data.name}`,
    `Telefon/WhatsApp: ${data.phone}`,
    `Haftalık kaçan slot: ${slots}`,
    `Ortalama işlem geliri: ₺${ticket.toLocaleString('tr-TR')}`,
    `Kurtarma hedefi: %${rate}`,
    `Haftalık tahmini kurtarma: ₺${Math.round(weekly).toLocaleString('tr-TR')}`,
    `Aylık tahmini kurtarma: ₺${Math.round(monthly).toLocaleString('tr-TR')}`,
    `Pilot geri ödeme süresi: ${payback} hafta`,
    `Skor: ${score}`,
    '',
    'Paket: 7 günlük pilot — ₺4.900 + opsiyonel başarı primi',
    'KVKK: Hasta adı yerine kod kullanılabilir; yalnızca iletişim izni olan hastalar.'
  ].join('\n'));
  const issueUrl = `https://github.com/goktugozdem2/noshow-kalkan/issues/new?title=${title}&body=${body}&labels=pilot-lead`;
  autoReportResult.innerHTML = `
    <strong>Haftalık tahmini kurtarma:</strong> ${formatTRY(weekly)}<br />
    <strong>Aylık tahmini kurtarma:</strong> ${formatTRY(monthly)}<br />
    <strong>₺4.900 pilot geri ödeme:</strong> yaklaşık ${payback} hafta<br />
    <strong>Skor:</strong> ${score}<br /><br />
    <a href="${issueUrl}" target="_blank" rel="noopener">Takip edilebilir pilot talebini otomatik aç</a>
  `;
});
