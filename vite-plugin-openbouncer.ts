/**
 * Vite dev plugin that mounts the OpenBouncer API on the same dev server.
 * Same Fetch-API handlers as production — adapted to Connect/Node middleware.
 *
 * In production, Vite is only a build tool; the standalone Bun server in
 * server/index.ts serves the API. This plugin is dev-only.
 */

import type { Connect, Plugin } from 'vite'
import { isHandled, route } from './server/lib/router'

export function openbouncerApi(): Plugin {
  return {
    name: 'openbouncer-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? '/'
        const pathname = url.split('?')[0] ?? '/'
        if (!isHandled(pathname)) return next()
        try {
          const fetchReq = await toFetchRequest(req)
          const fetchRes = await route(fetchReq)
          if (!fetchRes) return next()
          await writeFetchResponse(res, fetchRes)
        } catch (err) {
          console.error('[openbouncer-api] handler error:', err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, decision: 'deny', reason: 'internal-error' }))
        }
      })
    },
  }
}

async function toFetchRequest(req: Connect.IncomingMessage): Promise<Request> {
  const host = req.headers.host ?? 'localhost'
  const protocol = (req.socket as { encrypted?: boolean }).encrypted ? 'https' : 'http'
  const url = `${protocol}://${host}${req.url ?? '/'}`

  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (value == null) continue
    if (Array.isArray(value)) for (const v of value) headers.append(key, v)
    else headers.set(key, value as string)
  }

  const method = req.method ?? 'GET'
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return new Request(url, { method, headers })
  }

  const body = await readBody(req)
  return new Request(url, { method, headers, body })
}

function readBody(req: Connect.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk: Buffer | string) => {
      data += typeof chunk === 'string' ? chunk : chunk.toString('utf8')
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

async function writeFetchResponse(res: import('http').ServerResponse, fetchRes: Response) {
  res.statusCode = fetchRes.status
  fetchRes.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })
  const text = await fetchRes.text()
  res.end(text)
}
