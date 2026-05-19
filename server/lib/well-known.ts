/**
 * GET /.well-known/openbouncer.json
 *
 * The site's self-description. Agents can hit this discovery endpoint to
 * learn that a site speaks OpenBouncer, what verify endpoint to call, and
 * which layers it accepts. Mirrors the pattern of `.well-known/security.txt`
 * or `.well-known/oauth-authorization-server`.
 */

import { jsonResponse } from './json'

const DOC = {
  $schema: 'https://openbouncer.com/spec/well-known.v0.1.json',
  name: 'openbouncer.com',
  description:
    'OpenBouncer — a reverse-captcha gateway and public registry for the agentic web.',
  version: '0.1.0-draft',
  license: 'MIT',
  agent_policy: 'welcomes',
  endpoints: {
    verify: 'https://openbouncer.com/api/verify',
    challenge: 'https://openbouncer.com/api/challenge',
    registry: 'https://openbouncer.com/api/registry',
  },
  layers_supported: [1, 2, 3, 4],
  providers_recognized: ['anthropic', 'openai', 'google'],
  registry: 'https://openbouncer.com/registry',
  spec: 'https://openbouncer.com/spec',
  repo: 'https://github.com/canmacth/openbouncer',
  contact: 'mailto:hello@openbouncer.com',
} as const

export async function wellKnownHandler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return jsonResponse({ ok: true })
  if (req.method !== 'GET') {
    return jsonResponse({ ok: false, reason: 'method-not-allowed' }, { status: 405 })
  }
  return jsonResponse(DOC, {
    headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' },
  })
}
