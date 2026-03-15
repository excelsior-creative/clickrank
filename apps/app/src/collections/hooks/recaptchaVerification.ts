type RecaptchaResponse = {
  success: boolean
  score?: number
  action?: string
  challenge_ts?: string
  hostname?: string
  'error-codes'?: string[]
}

export async function verifyRecaptcha(
  token: string
): Promise<{ valid: boolean; score?: number }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY not configured, skipping verification')
    return { valid: true }
  }

  try {
    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${secretKey}&response=${token}`,
      }
    )

    const data: RecaptchaResponse = await response.json()

    // reCAPTCHA v3 returns a score from 0.0 to 1.0
    // 1.0 is very likely a good interaction, 0.0 is very likely a bot
    const isValid =
      data.success && (data.score === undefined || data.score >= 0.5)

    return { valid: isValid, score: data.score }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return { valid: false }
  }
}
