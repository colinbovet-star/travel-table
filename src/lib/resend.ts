// Server-side Resend email helpers

const RESEND_API = 'https://api.resend.com'

async function send(body: object) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  await fetch(`${RESEND_API}/emails`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

/** Send a welcome email after signup */
export async function sendWelcomeEmail(email: string, firstName: string) {
  await send({
    from: process.env.RESEND_FROM_EMAIL || 'hello@datingtable.com',
    to: email,
    subject: 'Welcome to the Dating Table 💕',
    html: `
      <h2>Welcome, ${firstName}!</h2>
      <p>We're so glad you're here. Complete your profile to get the most out of your Dating Table experience.</p>
      <p>Once your profile is complete, you'll be able to join tables, connect with other members, and take charge of your love life.</p>
      <p>With love,<br/>The Dating Table Team</p>
    `,
  })
}

/** Send the Cinqe private matchmaking link */
export async function sendCinqeEmail(email: string, firstName: string) {
  const cinqeLink = process.env.CINQE_PROFILE_LINK || 'https://cinqe.com/apply'

  await send({
    from: process.env.RESEND_FROM_EMAIL || 'hello@datingtable.com',
    to: email,
    subject: 'Your private Cinqe matchmaking link',
    html: `
      <h2>Hi ${firstName},</h2>
      <p>You've been selected for our private Cinqe matchmaking experience. Click the link below to get started:</p>
      <p><a href="${cinqeLink}" style="color:#dba3a3;font-weight:600;">Access your Cinqe profile →</a></p>
      <p>This link is personal to you — please don't share it.</p>
      <p>With love,<br/>The Dating Table Team</p>
    `,
  })
}

/** Send a referral invite email */
export async function sendReferralInvite(
  inviteeEmail: string,
  referrerName: string,
  personalNote: string | null,
  referralLink: string
) {
  await send({
    from: process.env.RESEND_FROM_EMAIL || 'hello@datingtable.com',
    to: inviteeEmail,
    subject: `${referrerName} thinks you'd love the Dating Table`,
    html: `
      <h2>You've been invited 💕</h2>
      <p>${referrerName} thought you'd be a perfect fit for the Dating Table — a curated community for single women dating with intention.</p>
      ${personalNote ? `<p><em>"${personalNote}"</em></p>` : ''}
      <p><a href="${referralLink}" style="color:#dba3a3;font-weight:600;">Join the Dating Table →</a></p>
      <p>With love,<br/>The Dating Table Team</p>
    `,
  })
}
