/**
 * Cloudflare Pages Functions catchall.
 *
 * Runs on every request. Delegates to the shared Fetch-API router; if the
 * route table doesn't recognize the path we fall through to the Pages
 * static asset handler via `next()`. Same handlers as the standalone Bun
 * server and the Vite dev plugin — only this thin adapter is platform-
 * specific.
 *
 * Worker runtime gives us crypto.getRandomValues, performance.now, atob/btoa
 * natively, so no shim layer is needed. Rate-limit state is per-instance
 * (each colo's worker keeps its own in-memory bucket) — acceptable for v0.1
 * public preview; v0.2 will move it to a Durable Object for global accuracy.
 */

import { route } from '../server/lib/router'

export const onRequest: PagesFunction = async (context) => {
  const handled = await route(context.request)
  if (handled) return handled
  return context.next()
}
