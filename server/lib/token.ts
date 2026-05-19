/**
 * Opaque pass-token. v0.1.draft uses an unsigned base64 envelope that any
 * downstream service can read but anyone can also forge — fine for the demo,
 * not for production. v0.2 switches to Ed25519-signed JWT using a key issued
 * via the registry.
 *
 * Token format: `ob_<base64url(json-payload)>`
 *   payload: { provider, layers, iat, exp }
 */

import { KNOWN_PROVIDERS, type Layer, type Provider } from './decision'

const TOKEN_TTL_MS = 5 * 60_000 // 5 minutes

type TokenPayload = {
  v: 1
  provider: Provider
  layers: Layer[]
  iat: number
  exp: number
}

function b64urlEncode(s: string): string {
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64urlDecode(s: string): string {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/')
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
  return atob(padded + pad)
}

export function issueToken(provider: Provider, layers: Layer[]): string {
  const now = Date.now()
  const payload: TokenPayload = {
    v: 1,
    provider,
    layers,
    iat: now,
    exp: now + TOKEN_TTL_MS,
  }
  return 'ob_' + b64urlEncode(JSON.stringify(payload))
}

export function inspectToken(token: string): TokenPayload | null {
  if (!token.startsWith('ob_')) return null
  try {
    const data = JSON.parse(b64urlDecode(token.slice(3))) as TokenPayload
    if (data.v !== 1) return null
    if (typeof data.exp !== 'number' || data.exp < Date.now()) return null
    if (!KNOWN_PROVIDERS.includes(data.provider) && data.provider !== 'unknown') return null
    return data
  } catch {
    return null
  }
}
