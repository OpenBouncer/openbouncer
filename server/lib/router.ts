/**
 * Tiny Fetch-API route table shared by the production Bun server and the
 * Vite dev plugin. Keep handlers pure (Request → Response) so the same code
 * runs in both contexts.
 */

import { challengeHandler } from './challenge'
import { corsPreflight } from './json'
import { verifyHandler } from './verify'
import { wellKnownHandler } from './well-known'

type Handler = (req: Request) => Promise<Response>

const routes: { method: string; path: string; handler: Handler }[] = [
  { method: 'POST', path: '/api/verify', handler: verifyHandler },
  { method: 'GET', path: '/api/challenge', handler: challengeHandler },
  { method: 'GET', path: '/.well-known/openbouncer.json', handler: wellKnownHandler },
]

const OPEN_PATHS = new Set(routes.map((r) => r.path))

export async function route(req: Request): Promise<Response | null> {
  const url = new URL(req.url)
  if (!OPEN_PATHS.has(url.pathname)) return null

  if (req.method === 'OPTIONS') return corsPreflight()

  const match = routes.find((r) => r.path === url.pathname && r.method === req.method)
  if (match) return match.handler(req)

  // Path exists, wrong method.
  return new Response(JSON.stringify({ ok: false, reason: 'method-not-allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function isHandled(pathname: string): boolean {
  return OPEN_PATHS.has(pathname)
}
