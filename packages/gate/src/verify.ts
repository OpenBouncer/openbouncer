/**
 * Low-level verify primitive. No React, no DOM. Use this from any runtime
 * (Bun, Node, Workers, edge functions, CLIs). The React `<OpenBouncerGate>`
 * component below is a thin wrapper around this function.
 */

export type Provider = 'anthropic' | 'openai' | 'google'

export type VerifyInput = {
  /** OpenBouncer endpoint. Defaults to https://openbouncer.com/api/verify. */
  endpoint?: string
  /** The page-issued nonce. Use the public demo nonce only for local testing. */
  nonce: string
  /** Provider attestation payload (signed token in v0.2; any non-empty string in v0.1.draft). */
  attest?: string
  /** Provider name. Also sent as X-Agent-Provider header. */
  provider?: Provider
  /** Milliseconds since /api/challenge was issued. Optional; enables L2 in v0.2. */
  challengeAgeMs?: number
  /** AbortSignal for the underlying fetch. */
  signal?: AbortSignal
}

export type VerifyResponse = {
  ok: boolean
  decision: 'pass' | 'deny'
  reason?: string
  matched_layers: number[]
  agent_id?: string
  latency_ms: number
  door: 'open' | 'closed'
  token?: string
}

const DEFAULT_ENDPOINT = 'https://openbouncer.com/api/verify'

export async function verify(input: VerifyInput): Promise<VerifyResponse> {
  const endpoint = input.endpoint ?? DEFAULT_ENDPOINT
  const body: Record<string, unknown> = { nonce: input.nonce }
  if (input.attest) body.attest = input.attest
  if (input.provider) body.provider = input.provider
  if (typeof input.challengeAgeMs === 'number') body.challenge_age_ms = input.challengeAgeMs

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (input.provider) headers['X-Agent-Provider'] = input.provider
  if (typeof input.challengeAgeMs === 'number') {
    headers['X-OB-Challenge-Age'] = String(input.challengeAgeMs)
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: input.signal,
  })

  // Always parse — both 200 and 403 carry a structured JSON body.
  return (await res.json()) as VerifyResponse
}
