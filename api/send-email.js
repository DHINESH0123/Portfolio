export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, subject, message } = req.body || {}

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' })
  }
  const apiKey = process.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Resend API key is not configured' })
  }
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: ['dhinesh280105@gmail.com'],
        reply_to: email,
        subject: `📬 New message from ${name}${subject ? ` — ${subject}` : ''}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
            <div style="background:#0E1D61;padding:24px 32px;border-radius:12px 12px 0 0;">
              <h2 style="color:#B89A5A;margin:0;font-size:22px;">New Portfolio Message</h2>
            </div>
            <div style="padding:32px;border:1px solid #e2d9c9;border-top:none;border-radius:0 0 12px 12px;background:#fefdfa;">
              <p style="margin:0 0 12px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin:0 0 12px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color:#0E1D61;">${email}</a></p>
              <p style="margin:0 0 16px 0;"><strong>Subject:</strong> ${subject || '—'}</p>
              <div style="background:#f7f4ef;padding:18px;border-radius:8px;border-left:4px solid #B89A5A;margin-top:16px;">
                <p style="margin:0;white-space:pre-wrap;line-height:1.6;font-size:15px;">${message}</p>
              </div>
              <p style="font-size:12px;color:#888;margin-top:28px;border-top:1px solid #eee;padding-top:16px;">
                Hit Reply to respond directly to ${email} · Dhinesh AI Portfolio
              </p>
            </div>
          </div>
        `,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Failed to send email' })
    }

    return res.status(200).json({ success: true, id: data.id })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
