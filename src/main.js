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
