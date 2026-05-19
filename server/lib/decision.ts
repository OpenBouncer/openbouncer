/**
 * OpenBouncer layered decision logic.
 *
 *   L1  prompt-following challenge   — the agent extracted the correct nonce
 *                                      from the hidden page instruction.
 *   L2  latency window                — request arrived within the window
 *                                      where humans cannot react.
 *   L3  parallel reasoning proof      — agent solved a sub-second multi-task
 *                                      challenge. (v0.2)
 *   L4  provider attestation          — request carries a signed token from a
 *                                      recognized provider runtime
 *                                      (Anthropic, OpenAI, Google).
 *
 * For v0.1.draft we ship L1 and L4 (best-effort). L2/L3 are stubbed until the
 * spec is final.
 *
 * The demo nonce ob_demo_a8f3c9e2 is the public, intentionally-known token
 * used on openbouncer.com's marketing page so anyone can curl-test the flow.
 * Real deployments mint per-session nonces via /api/challenge.
 */

export type Layer = 1 | 2 | 3 | 4
export type Provider = 'anthropic' | 'openai' | 'google' | 'unknown'

export type VerifyInput = {
  nonce?: string
  attest?: string
  provider?: Provider
  user_agent?: string
  challenge_age_ms?: number
}

export type VerifyResult = {
  ok: boolean
  decision: 'pass' | 'deny'
  reason?: string
  matched_layers: Layer[]
  agent_id?: string
}

export const DEMO_NONCE = 'ob_demo_a8f3c9e2'
export const KNOWN_PROVIDERS: Provider[] = ['anthropic', 'openai', 'google']

const NONCE_PATTERN = /^ob_[a-z0-9_]{6,48}$/i

export function evaluate(input: VerifyInput): VerifyResult {
  const matched: Layer[] = []

  // L1 — prompt-following: the page told the agent a specific nonce to send.
  // Demo nonce always works (public), session nonces validated elsewhere.
  if (typeof input.nonce === 'string' && NONCE_PATTERN.test(input.nonce)) {
    if (input.nonce === DEMO_NONCE) {
      matched.push(1)
    }
    // (real per-session nonce validation hooks in here in v0.2)
  }

  // L2 — latency window: stubbed until real challenge.age tracking lands.
  if (typeof input.challenge_age_ms === 'number' && input.challenge_age_ms < 800) {
    matched.push(2)
  }

  // L4 — provider attestation: presence of a plausible attest payload from a
  // known provider header. v0.1.draft accepts any non-empty string; v0.2 will
  // verify the signature against the registry's provider-key store.
  if (
    typeof input.attest === 'string' &&
    input.attest.length >= 8 &&
    input.attest.length <= 2048 &&
    input.provider &&
    KNOWN_PROVIDERS.includes(input.provider)
  ) {
    matched.push(4)
  }

  if (matched.length === 0) {
    const reason = !input.nonce
      ? 'layer-1.nonce-missing'
      : input.nonce !== DEMO_NONCE
        ? 'layer-1.instruction-not-followed'
        : 'no-layer-matched'
    return { ok: false, decision: 'deny', reason, matched_layers: [] }
  }

  return {
    ok: true,
    decision: 'pass',
    matched_layers: matched,
    agent_id: input.provider ?? 'unknown',
  }
}
