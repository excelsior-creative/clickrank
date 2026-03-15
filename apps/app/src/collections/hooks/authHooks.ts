import type { CollectionBeforeLoginHook } from 'payload'
import { verifyRecaptcha } from './recaptchaVerification'

/**
 * Hook to validate reCAPTCHA on login attempts
 * 
 * To enable reCAPTCHA protection:
 * 1. Set RECAPTCHA_SECRET_KEY and NEXT_PUBLIC_RECAPTCHA_SITE_KEY env vars
 * 2. Add a custom login component that includes the reCAPTCHA widget
 * 3. The widget should send the token in the request body as 'recaptchaToken'
 * 
 * If reCAPTCHA is not configured, this hook allows login to proceed normally.
 */
export const beforeLoginHook: CollectionBeforeLoginHook = async ({ req }) => {
  // Check if reCAPTCHA is configured
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    // reCAPTCHA not configured, allow login to proceed
    return
  }

  // Payload first-user bootstrap performs an internal login without recaptchaToken.
  const requestPath = req.url || ''
  const isFirstUserBootstrapRequest =
    requestPath.includes('/api/users/first-register') ||
    requestPath.includes('/admin/create-first-user')

  if (isFirstUserBootstrapRequest) {
    return
  }

  // Get the recaptcha token from the request body
  const recaptchaToken = req.data?.recaptchaToken

  if (!recaptchaToken) {
    throw new Error(
      'reCAPTCHA verification is required. Please complete the security challenge.'
    )
  }

  // Verify the token
  const result = await verifyRecaptcha(recaptchaToken)

  if (!result.valid) {
    console.warn('reCAPTCHA verification failed on login attempt', {
      score: result.score,
      email: req.data?.email,
      ip: req.headers?.get('x-forwarded-for') || req.headers?.get('x-real-ip') || 'unknown',
    })
    throw new Error('Security verification failed. Please try again.')
  }

  // reCAPTCHA passed, allow login to proceed
  console.log('reCAPTCHA verification passed', { score: result.score })
}

/**
 * Hook to log failed login attempts
 */
export const afterLoginFailedHook = async ({
  req,
  email,
}: {
  req: any
  email: string
}) => {
  const ip =
    req.headers?.['x-forwarded-for'] || req.headers?.['x-real-ip'] || 'unknown'

  console.warn('Failed login attempt', {
    email,
    ip,
    timestamp: new Date().toISOString(),
    userAgent: req.headers?.['user-agent'],
  })

  // TODO: Add email alerting here if desired
  // Example: Send email to admin after N failed attempts from same IP
}
