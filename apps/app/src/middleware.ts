import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// In-memory rate limiting store
// NOTE: This is a simple implementation for single-instance deployments.
// For production at scale with serverless/edge, consider using @upstash/ratelimit with Redis
// for distributed rate limiting that persists across instances.
type RateLimitEntry = {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(
    () => {
      const now = Date.now()
      for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetTime < now) {
          rateLimitStore.delete(key)
        }
      }
    },
    5 * 60 * 1000
  )
}

type RateLimitConfig = {
  requests: number
  windowMs: number
}

function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // No existing entry or expired entry
  if (!entry || entry.resetTime < now) {
    const resetTime = now + config.windowMs
    rateLimitStore.set(identifier, { count: 1, resetTime })
    return { allowed: true, remaining: config.requests - 1, resetTime }
  }

  // Increment counter
  entry.count++
  rateLimitStore.set(identifier, entry)

  const remaining = Math.max(0, config.requests - entry.count)
  const allowed = entry.count <= config.requests

  return { allowed, remaining, resetTime: entry.resetTime }
}

function getClientIP(request: NextRequest): string {
  // Try to get real IP from headers (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIp) {
    return realIp
  }

  // Fallback to remote address (may not be available in all environments)
  return 'unknown'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const clientIP = getClientIP(request)

  // Redirect HTTP to HTTPS in production
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') === 'http'
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.nextUrl.pathname}${request.nextUrl.search}`,
      301
    )
  }

  // Define rate limit configs for different endpoints
  const rateLimits: Record<string, RateLimitConfig> = {
    '/api/users/login': { requests: 5, windowMs: 60 * 1000 }, // 5 per minute
    '/api/users/forgot-password': { requests: 3, windowMs: 60 * 1000 }, // 3 per minute
    '/api/users/reset-password': { requests: 5, windowMs: 60 * 1000 }, // 5 per minute
  }

  // Check for specific endpoint rate limits
  for (const [endpoint, config] of Object.entries(rateLimits)) {
    if (pathname.startsWith(endpoint)) {
      const identifier = `${endpoint}:${clientIP}`
      const result = checkRateLimit(identifier, config)

      if (!result.allowed) {
        return new NextResponse(
          JSON.stringify({
            error: 'Too many requests. Please try again later.',
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(Math.ceil((result.resetTime - Date.now()) / 1000)),
              'X-RateLimit-Limit': String(config.requests),
              'X-RateLimit-Remaining': String(result.remaining),
              'X-RateLimit-Reset': String(result.resetTime),
            },
          }
        )
      }

      // Add rate limit headers to successful responses
      const response = NextResponse.next()
      response.headers.set('X-RateLimit-Limit', String(config.requests))
      response.headers.set('X-RateLimit-Remaining', String(result.remaining))
      response.headers.set('X-RateLimit-Reset', String(result.resetTime))
      return response
    }
  }

  // General API rate limit (60 requests per minute)
  if (pathname.startsWith('/api/')) {
    const identifier = `api:${clientIP}`
    const generalConfig = { requests: 60, windowMs: 60 * 1000 }
    const result = checkRateLimit(identifier, generalConfig)

    if (!result.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests. Please try again later.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((result.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(generalConfig.requests),
            'X-RateLimit-Remaining': String(result.remaining),
            'X-RateLimit-Reset': String(result.resetTime),
          },
        }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes for HTTPS redirect, excluding Next.js internals and static assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
