/**
 * JSON Response helper with CORS + no-store defaults baked in. Centralized
 * so every API surface returns the same shape of headers.
 */

const BASE_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Agent-Provider, X-OB-Challenge-Age',
  'Access-Control-Expose-Headers':
    'ob-decision, ob-latency-ms, ob-reason, ob-matched-layers, x-ratelimit-remaining',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
} as const

export function jsonResponse(
  payload: unknown,
  init: { status?: number; headers?: Record<string, string> } = {},
): Response {
  return new Response(JSON.stringify(payload), {
    status: init.status ?? 200,
    headers: { ...BASE_HEADERS, ...(init.headers ?? {}) },
  })
}

export function corsPreflight(): Response {
  return new Response(null, { status: 204, headers: BASE_HEADERS })
}
