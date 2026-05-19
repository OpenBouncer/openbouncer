/**
 * In-memory token bucket per IP. Good enough for the v0.1 public preview;
 * before going production-traffic we swap this for an Upstash/Redis backend.
 *
 * Defaults: 30 requests per IP per 60s. Returns remaining capacity so the
 * caller can set X-RateLimit-Remaining header if it wants to.
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

const MAX_BUCKETS = 5000 // prevent unbounded memory growth

export function rateLimit(
  ip: string,
  limit = 30,
  windowMs = 60_000,
): { ok: boolean; remaining: number; reset_in_ms: number } {
  const now = Date.now()

  // Crude eviction: if we hit the cap, drop expired buckets first.
  if (buckets.size > MAX_BUCKETS) {
    for (const [k, b] of buckets) {
      if (b.resetAt < now) buckets.delete(k)
      if (buckets.size <= MAX_BUCKETS / 2) break
    }
  }

  const bucket = buckets.get(ip)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, reset_in_ms: windowMs }
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, reset_in_ms: bucket.resetAt - now }
  }

  bucket.count++
  return { ok: true, remaining: limit - bucket.count, reset_in_ms: bucket.resetAt - now }
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') ?? '0.0.0.0'
}
