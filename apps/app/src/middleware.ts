import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

type RateLimitEntry = {
  count: number
  resetTime: number
}

// In-memory fallback (per-lambda). Used when Upstash is not configured.
// Per-lambda isolation means a determined attacker can rotate instances; for
// production scale, configure UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.
const rateLimitStore = new Map<string, RateLimitEntry>()

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
    5 * 60 * 1000,
  )
}

type RateLimitConfig = {
  requests: number
  windowMs: number
}

type RateLimitResult = {
  allowed: boolean
  remaining: number
  resetTime: number
}

const upstashEnabled = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
)

const upstashRedis = upstashEnabled
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null

const upstashLimiterCache = new Map<string, Ratelimit>()

function getUpstashLimiter(config: RateLimitConfig): Ratelimit | null {
  if (!upstashRedis) return null
  const key = `${config.requests}:${config.windowMs}`
  const cached = upstashLimiterCache.get(key)
  if (cached) return cached
  const limiter = new Ratelimit({
    redis: upstashRedis,
    limiter: Ratelimit.slidingWindow(config.requests, `${config.windowMs} ms`),
    analytics: false,
    prefix: 'clickrank_rl',
  })
  upstashLimiterCache.set(key, limiter)
  return limiter
}

async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const upstash = getUpstashLimiter(config)
  if (upstash) {
    const { success, remaining, reset } = await upstash.limit(identifier)
    return { allowed: success, remaining, resetTime: reset }
  }

  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || entry.resetTime < now) {
    const resetTime = now + config.windowMs
    rateLimitStore.set(identifier, { count: 1, resetTime })
    return { allowed: true, remaining: config.requests - 1, resetTime }
  }

  entry.count++
  rateLimitStore.set(identifier, entry)

  const remaining = Math.max(0, config.requests - entry.count)
  const allowed = entry.count <= config.requests

  return { allowed, remaining, resetTime: entry.resetTime }
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIp) {
    return realIp
  }

  return 'unknown'
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const clientIP = getClientIP(request)

  // Redirect HTTP to HTTPS in production
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') === 'http'
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.nextUrl.pathname}${request.nextUrl.search}`,
      301,
    )
  }

  const rateLimits: Record<string, RateLimitConfig> = {
    '/api/users/login': { requests: 5, windowMs: 60 * 1000 },
    '/api/users/forgot-password': { requests: 3, windowMs: 60 * 1000 },
    '/api/users/reset-password': { requests: 5, windowMs: 60 * 1000 },
  }

  for (const [endpoint, config] of Object.entries(rateLimits)) {
    if (pathname.startsWith(endpoint)) {
      const identifier = `${endpoint}:${clientIP}`
      const result = await checkRateLimit(identifier, config)

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
          },
        )
      }

      const response = NextResponse.next()
      response.headers.set('X-RateLimit-Limit', String(config.requests))
      response.headers.set('X-RateLimit-Remaining', String(result.remaining))
      response.headers.set('X-RateLimit-Reset', String(result.resetTime))
      return response
    }
  }

  if (pathname.startsWith('/api/')) {
    const identifier = `api:${clientIP}`
    const generalConfig = { requests: 60, windowMs: 60 * 1000 }
    const result = await checkRateLimit(identifier, generalConfig)

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
        },
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
