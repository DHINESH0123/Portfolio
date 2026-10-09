import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'send-email-api-dev',
        configureServer(server) {
          server.middlewares.use('/api/send-email', (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }
            let body = ''
            req.on('data', (chunk) => { body += chunk })
            req.on('end', async () => {
              try {
                const { name, email, subject, message } = JSON.parse(body || '{}')
                const apiKey = env.VITE_RESEND_API_KEY || process.env.VITE_RESEND_API_KEY
                if (!apiKey) {
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: 'VITE_RESEND_API_KEY is not defined in .env' }))
                  return
                }

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
                  res.statusCode = response.status
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: data.message || 'Failed to send email' }))
                  return
                }

                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, id: data.id }))
              } catch (err) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: err.message || 'Internal server error' }))
              }
            })
          })
        },
      },
    ],
  }
})
