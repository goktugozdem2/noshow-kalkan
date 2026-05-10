export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const body = req.body || {};
  if (!body.consent) return res.status(403).json({ error: 'consent_required' });
  const required = ['clinic', 'name', 'phone'];
  for (const field of required) {
    if (!String(body[field] || '').trim()) return res.status(400).json({ error: `${field}_required` });
  }
  const text = [
    '💸 NoShow Kalkanı yeni pilot talebi',
    `Klinik: ${body.clinic}`,
    `Yetkili: ${body.name}`,
    `Telefon: ${body.phone}`,
    `Haftalık kayıp: ${body.lost || '-'}`,
    'Next action: 24 saat içinde kayıp hesabı + pilot teklifi gönder',
    'Revenue at risk: klinik başına ₺4.900 setup + başarı primi'
  ].join('\n');
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    const tg = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text })
    });
    if (!tg.ok) return res.status(502).json({ error: 'telegram_failed' });
    return res.status(200).json({ ok: true });
  }
  return res.status(503).json({ error: 'No lead destination configured yet', fallback: 'mailto:goktug@datrick.com' });
}
