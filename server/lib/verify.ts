/**
 * POST /api/verify
 *
 * The heart of OpenBouncer. An agent sends its proof; we return pass/deny.
 *
 * Request body (JSON):
 *   { nonce: string, attest?: string, provider?: string, challenge_age_ms?: number }
 *
 * Headers respected:
 *   X-Agent-Provider     overrides body.provider if present
 *   X-OB-Challenge-Age   overrides body.challenge_age_ms if present
 *
 * Response (200 pass / 403 deny):
 *   {
 *     ok, decision, reason?, matched_layers, agent_id,
 *     latency_ms, token?, door: "open" | "closed"
 *   }
 *
 * Response headers (so curl users see the decision without parsing JSON):
 *   ob-decision, ob-matched-layers, ob-latency-ms, ob-reason
 */

import { KNOWN_PROVIDERS, evaluate, type Provider } from './decision'
import { jsonResponse } from './json'
import { clientIp, rateLimit } from './rate-limit'
import { issueToken } from './token'

const MAX_BODY_BYTES = 8 * 1024 // 8 KB

export async function verifyHandler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return jsonResponse({ ok: true })
  }
  if (req.method !== 'POST') {
    return jsonResponse(
      { ok: false, decision: 'deny', reason: 'method-not-allowed' },
      { status: 405 },
    )
  }

  // Rate limit per IP, after method check.
  const ip = clientIp(req)
  const rl = rateLimit(ip)
  if (!rl.ok) {
    return jsonResponse(
      { ok: false, decision: 'deny', reason: 'rate-limited', retry_in_ms: rl.reset_in_ms },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rl.reset_in_ms / 1000)),
          'X-RateLimit-Remaining': '0',
        },
      },
    )
  }

  // Bounded body read.
  const contentLength = Number(req.headers.get('content-length') ?? '0')
  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse(
      { ok: false, decision: 'deny', reason: 'body-too-large' },
      { status: 413 },
    )
  }

  let raw: string
  try {
    raw = await req.text()
  } catch {
    return jsonResponse(
      { ok: false, decision: 'deny', reason: 'body-read-failed' },
      { status: 400 },
    )
  }
  if (raw.length > MAX_BODY_BYTES) {
    return jsonResponse(
      { ok: false, decision: 'deny', reason: 'body-too-large' },
      { status: 413 },
    )
  }

  let body: Record<string, unknown> = {}
  if (raw.trim().length > 0) {
    try {
      const parsed: unknown = JSON.parse(raw)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        body = parsed as Record<string, unknown>
      } else {
        return jsonResponse(
          { ok: false, decision: 'deny', reason: 'malformed-body' },
          { status: 400 },
        )
      }
    } catch {
      return jsonResponse(
        { ok: false, decision: 'deny', reason: 'malformed-json' },
        { status: 400 },
      )
    }
  }

  // Strict input shape — never trust user-supplied fields.
  const nonce = typeof body.nonce === 'string' && body.nonce.length <= 64 ? body.nonce : undefined
  const attest =
    typeof body.attest === 'string' && body.attest.length <= 2048 ? body.attest : undefined

  const providerHeader = req.headers.get('x-agent-provider')
  const providerRaw =
    typeof providerHeader === 'string' && providerHeader.length > 0
      ? providerHeader
      : typeof body.provider === 'string'
        ? body.provider
        : undefined
  const provider: Provider = KNOWN_PROVIDERS.includes(providerRaw as Provider)
    ? (providerRaw as Provider)
    : 'unknown'

  const ageHeader = req.headers.get('x-ob-challenge-age')
  const challenge_age_ms =
    typeof ageHeader === 'string' && /^\d+$/.test(ageHeader)
      ? Number(ageHeader)
      : typeof body.challenge_age_ms === 'number' && Number.isFinite(body.challenge_age_ms)
        ? body.challenge_age_ms
        : undefined

  const ua = req.headers.get('user-agent') ?? undefined

  const start = performance.now()
  const result = evaluate({ nonce, attest, provider, user_agent: ua, challenge_age_ms })
  const latency_ms = Math.round(performance.now() - start)

  const token = result.ok ? issueToken(provider, result.matched_layers) : undefined

  return jsonResponse(
    {
      ok: result.ok,
      decision: result.decision,
      reason: result.reason,
      matched_layers: result.matched_layers,
      agent_id: result.agent_id,
      latency_ms,
      door: result.ok ? 'open' : 'closed',
      token,
    },
    {
      status: result.ok ? 200 : 403,
      headers: {
        'ob-decision': result.decision,
        'ob-matched-layers': result.matched_layers.join(',') || 'none',
        'ob-latency-ms': String(latency_ms),
        ...(result.reason ? { 'ob-reason': result.reason } : {}),
        'X-RateLimit-Remaining': String(rl.remaining),
      },
    },
  )
}
