// Server-side helper to add a user to a Resend audience

export async function addToResendAudience(
  email: string,
  firstName: string,
  audienceId: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      first_name: firstName,
      unsubscribed: false,
    }),
  })
}
