/**
 * Standalone Bun server entry point for production.
 *
 * Run:   bun run server      (or: PORT=3001 bun run server/index.ts)
 *
 * Frontend (Vite-built static files) is served by a CDN; this process only
 * answers the API + well-known routes. In dev we use the Vite plugin in
 * vite-plugin-openbouncer.ts so the same handlers run on the same port.
 */

import { route } from './lib/router'

const port = Number(process.env.PORT ?? 3001)

Bun.serve({
  port,
  hostname: '0.0.0.0',
  async fetch(req) {
    const response = await route(req)
    if (response) return response
    return new Response('Not found', { status: 404 })
  },
})

// eslint-disable-next-line no-console
console.log(`[openbouncer] api listening on :${port}`)
