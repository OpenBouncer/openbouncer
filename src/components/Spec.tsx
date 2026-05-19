export function Spec() {
  return (
    <section id="spec" className="border-b border-rule bg-page-2/40">
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-10 flex items-baseline justify-between gap-4">
          <h2 className="mono-display text-[28px] sm:text-[34px]">
            The spec — v0.1.draft.
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
            05 · spec
          </span>
        </div>

        <p className="mb-10 max-w-[64ch] text-[15.5px] leading-[1.6] text-ink-soft">
          OpenBouncer is a single verify endpoint plus a discovery document.
          Everything else is layered on top. The draft below is what ships
          today at <code className="font-mono text-ink">openbouncer.com</code>;
          a frozen v1 RFC is on the roadmap.
        </p>

        {/* Endpoint reference */}
        <div className="grid grid-cols-1 gap-px bg-rule">
          <Endpoint
            method="POST"
            path="/api/verify"
            blurb="Evaluate a verification request against the layered protocol. Returns pass or deny in <40 ms (in-process)."
            request={`{
  "nonce": "ob_<16-hex>",         // required · per-session or demo
  "attest": "<provider-token>",   // optional · raw provider attestation
  "provider": "anthropic"         // optional · echoed by X-Agent-Provider
}`}
            response={`{
  "ok": true,
  "decision": "pass",             // or "deny"
  "matched_layers": [1, 4],
  "agent_id": "anthropic",
  "latency_ms": 0,
  "door": "open",                 // or "closed"
  "token": "ob_<base64url-payload>"
}`}
            headers={[
              ['Content-Type', 'application/json'],
              ['X-Agent-Provider', 'anthropic | openai | google'],
              ['X-OB-Challenge-Age', 'milliseconds since /api/challenge'],
            ]}
            responseHeaders={[
              ['ob-decision', 'pass | deny'],
              ['ob-matched-layers', '"1,4" or "none"'],
              ['ob-latency-ms', 'integer'],
              ['ob-reason', 'present on deny'],
              ['x-ratelimit-remaining', 'integer · per-IP bucket'],
            ]}
            codes={[
              ['200', 'pass — door open'],
              ['400', 'malformed-body or malformed-json'],
              ['403', 'deny — layer-N.reason'],
              ['405', 'method-not-allowed'],
              ['413', 'body-too-large (> 8 KB)'],
              ['429', 'rate-limited (30 / IP / 60 s)'],
            ]}
          />

          <Endpoint
            method="GET"
            path="/api/challenge"
            blurb="Mint a fresh per-session nonce. Site owners call this server-side per page load, embed the returned instruction in the HTML, and accept /api/verify only with the matching nonce."
            response={`{
  "ok": true,
  "nonce": "ob_<16-hex>",
  "issued_at": 1779209977326,
  "expires_at": 1779210277326,
  "ttl_ms": 300000,                // 5 minutes
  "verify_endpoint": "/api/verify",
  "layers_supported": [1, 2, 3, 4],
  "instruction": "..."             // the text to embed for LLM readers
}`}
            responseHeaders={[
              ['ob-nonce', 'the issued nonce, header-shortcut'],
              ['cache-control', 'no-store'],
            ]}
            codes={[
              ['200', 'fresh nonce issued'],
              ['405', 'method-not-allowed (GET only)'],
            ]}
          />

          <Endpoint
            method="GET"
            path="/.well-known/openbouncer.json"
            blurb="The site's self-description. Cached for 300 s. Agents read this to learn that a site speaks OpenBouncer and where to call."
            response={`{
  "$schema": "https://openbouncer.com/spec/well-known.v0.1.json",
  "name": "openbouncer.com",
  "version": "0.1.0-draft",
  "license": "MIT",
  "agent_policy": "welcomes",
  "endpoints": { "verify": ".../api/verify",
                  "challenge": ".../api/challenge" },
  "layers_supported": [1, 2, 3, 4],
  "providers_recognized": ["anthropic", "openai", "google"]
}`}
            responseHeaders={[
              ['cache-control', 'public, max-age=300, s-maxage=300'],
            ]}
            codes={[
              ['200', 'discovery doc'],
            ]}
          />
        </div>

        {/* Layered protocol */}
        <div className="mt-12 border-t border-rule pt-10">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h3 className="mono-display text-[20px] sm:text-[22px]">
              Layered evaluation.
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
              L1 → L4
            </span>
          </div>
          <div className="grid grid-cols-1 gap-px bg-rule md:grid-cols-2">
            <Layer
              n="L1"
              status="live"
              title="Prompt-following challenge"
              body="The page exposes a nonce in a hidden instruction the page renders to LLMs (HTML comment + cream-on-cream span). The agent reads it and POSTs it back. Browsers never see it."
            />
            <Layer
              n="L2"
              status="v0.2"
              title="Sub-200 ms latency window"
              body="The window between challenge issue and verify call. Humans cannot read, parse and POST in <200 ms; agents routinely do. Currently stubbed — enforcement lands with the per-session nonce store."
            />
            <Layer
              n="L3"
              status="v0.3"
              title="Parallel reasoning proof"
              body="Sub-second multi-task challenge — for example, 'compute the SHA-256 of this 4 KB block, the moving median of these 100 values, and the determinant of this 8×8 matrix.' Agents stream the solution; humans cannot read it in time."
            />
            <Layer
              n="L4"
              status="stub · v0.2"
              title="Provider cryptographic attestation"
              body="Ed25519-signed token from a recognized provider runtime (Anthropic, OpenAI, Google). v0.1 accepts any non-empty attest payload as a placeholder. v0.2 verifies the signature against a registry of public keys — forging this layer requires stealing the provider's signing key."
            />
          </div>
        </div>

        <p className="mt-8 text-[14px] leading-[1.55] text-ink-mute">
          Read the full draft on GitHub:{' '}
          <a
            href="https://github.com/OpenBouncer/openbouncer"
            target="_blank"
            rel="noreferrer"
            className="border-b border-ink text-ink hover:border-stamp hover:text-stamp"
          >
            github.com/OpenBouncer/openbouncer
          </a>
          .
        </p>
      </div>
    </section>
  )
}

function Endpoint({
  method,
  path,
  blurb,
  request,
  response,
  headers,
  responseHeaders,
  codes,
}: {
  method: 'GET' | 'POST'
  path: string
  blurb: string
  request?: string
  response: string
  headers?: [string, string][]
  responseHeaders?: [string, string][]
  codes: [string, string][]
}) {
  return (
    <div className="bg-page p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline gap-3">
        <span
          className={`px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] ${
            method === 'POST' ? 'bg-stamp text-page' : 'border border-ink text-ink'
          }`}
        >
          {method}
        </span>
        <code className="mono-display text-[18px] text-ink sm:text-[20px]">
          {path}
        </code>
      </div>
      <p className="mt-3 max-w-[68ch] text-[14.5px] leading-[1.55] text-ink-soft">
        {blurb}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {request && (
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
              request body
            </div>
            <pre className="overflow-x-auto whitespace-pre border border-rule bg-page-2 px-3 py-3 font-mono text-[12.5px] leading-[1.55] text-ink">
              {request}
            </pre>
          </div>
        )}
        <div className={request ? '' : 'md:col-span-2'}>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
            response body
          </div>
          <pre className="overflow-x-auto whitespace-pre border border-rule bg-page-2 px-3 py-3 font-mono text-[12.5px] leading-[1.55] text-ink">
            {response}
          </pre>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-3">
        {headers && (
          <KeyValueList title="request headers" items={headers} />
        )}
        {responseHeaders && (
          <KeyValueList title="response headers" items={responseHeaders} />
        )}
        <KeyValueList title="status codes" items={codes} />
      </div>
    </div>
  )
}

function KeyValueList({
  title,
  items,
}: {
  title: string
  items: [string, string][]
}) {
  return (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
        {title}
      </div>
      <dl className="space-y-1.5 font-mono text-[12px]">
        {items.map(([k, v]) => (
          <div key={k} className="flex items-start gap-2">
            <dt className="shrink-0 text-ink">{k}</dt>
            <dd className="text-ink-mute">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function Layer({
  n,
  status,
  title,
  body,
}: {
  n: string
  status: string
  title: string
  body: string
}) {
  const liveStatus = status === 'live'
  return (
    <div className="bg-page p-6 sm:p-7">
      <div className="flex items-baseline justify-between gap-3">
        <span className="mono-display text-[24px] text-ink">{n}</span>
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
            liveStatus ? 'text-[#5fa84a]' : 'text-ink-mute'
          }`}
        >
          {liveStatus && <span className="mr-1">●</span>}
          {status}
        </span>
      </div>
      <h4 className="mono-display mt-2 text-[18px]">{title}</h4>
      <p className="mt-2 text-[14px] leading-[1.55] text-ink-soft">{body}</p>
    </div>
  )
}
