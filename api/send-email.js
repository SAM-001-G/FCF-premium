export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { to, subject, html } = req.body || {}

    if (!to || !subject || !html) {
      return res.status(400).json({
        error: 'Missing required fields: to, subject, html',
      })
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FCF <noreply@faithinchristfellowship.ac.ke>',
        to: [to],
        subject,
        html,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Resend error:', data)
      return res.status(response.status).json({
        error: data.message || 'Failed to send email',
      })
    }

    return res.status(200).json({
      success: true,
      id: data.id,
    })
  } catch (error) {
    console.error('Email function error:', error)

    return res.status(500).json({
      error: 'Internal server error',
    })
  }
}
