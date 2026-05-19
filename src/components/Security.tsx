export function Security() {
  return (
    <section id="security" className="border-b border-rule">
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-10 flex items-baseline justify-between gap-4">
          <h2 className="mono-display text-[28px] sm:text-[34px]">
            Security model.
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
            06 · security
          </span>
        </div>

        <p className="mb-10 max-w-[64ch] text-[15.5px] leading-[1.6] text-ink-soft">
          What OpenBouncer claims, what it does not, and how the gaps close in
          v0.2. Read this before relying on the gate for anything that matters.
        </p>

        <div className="grid grid-cols-1 gap-px bg-rule md:grid-cols-2">
          <Pillar
            title="What we claim"
            tone="claim"
            items={[
              {
                head: 'Layered evaluation, structured deny reasons',
                body: 'Every reject carries an ob-reason header so the caller knows which layer failed and what to fix.',
              },
              {
                head: 'Sub-millisecond in-process decision',
                body: 'No external lookups on the hot path in v0.1. The full HTTP round trip from a Cloudflare edge PoP is the dominant cost.',
              },
              {
                head: 'Boring transport posture',
                body: 'CORS open (public API), Cache-Control no-store on dynamic, X-Content-Type-Options nosniff, Referrer-Policy no-referrer. Bodies bounded at 8 KB. Strict input shape validation.',
              },
              {
                head: 'Per-IP rate limit',
                body: 'In-memory token bucket: 30 requests per IP per 60 s, per edge node. Surfaced via X-RateLimit-Remaining.',
              },
            ]}
          />
          <Pillar
            title="What we do NOT claim"
            tone="warn"
            items={[
              {
                head: 'L4 is a stub today',
                body: 'v0.1 accepts any non-empty attest string when a recognized provider is named. Do not rely on the L4 layer for security-critical gating until v0.2 ships Ed25519 verification against the provider key registry.',
              },
              {
                head: 'Rate limit is per-node, not global',
                body: 'Distributed clients can outrun the in-memory bucket. v0.2 moves the bucket into a Durable Object so the count is correct across the global edge.',
              },
              {
                head: 'Not anti-DDoS, not anti-phishing',
                body: "Cloudflare sits in front of us for DDoS. Phishing is out of scope — OpenBouncer signals 'this looks like an agent,' nothing more.",
              },
              {
                head: 'Not a user-identity layer',
                body: 'A pass token says the request came from a recognized agent runtime. It does not bind to a downstream user account. Wire your own auth on top.',
              },
            ]}
          />
        </div>

        {/* Token + limits strip */}
        <div className="mt-10 grid grid-cols-2 gap-px bg-rule sm:grid-cols-4">
          <Limit n="8 KB" label="max body size" />
          <Limit n="30 / 60s" label="rate limit · per IP" />
          <Limit n="5 min" label="token TTL · v0.1" />
          <Limit n="Ed25519" label="signed tokens · v0.2" />
        </div>

        <p className="mt-10 max-w-[64ch] text-[14px] leading-[1.6] text-ink-mute">
          The threat model lives in the repo at{' '}
          <a
            href="https://github.com/OpenBouncer/openbouncer/blob/main/server/lib/decision.ts"
            target="_blank"
            rel="noreferrer"
            className="border-b border-ink text-ink hover:border-stamp hover:text-stamp"
          >
            server/lib/decision.ts
          </a>{' '}
          — read the comments at the top, the actual layer code below them.
          Disclosure: open a GitHub issue. We will credit responsible
          reporters in the changelog.
        </p>
      </div>
    </section>
  )
}

function Pillar({
  title,
  tone,
  items,
}: {
  title: string
  tone: 'claim' | 'warn'
  items: { head: string; body: string }[]
}) {
  const accent = tone === 'claim' ? 'text-[#5fa84a]' : 'text-stamp'
  return (
    <div className="bg-page p-6 sm:p-8">
      <div className="mb-5 flex items-baseline gap-3">
        <span className={`text-[14px] leading-none ${accent}`}>●</span>
        <h3 className="mono-display text-[20px]">{title}</h3>
      </div>
      <ul className="space-y-5">
        {items.map((it) => (
          <li key={it.head}>
            <div className="font-mono text-[12px] text-ink">{it.head}</div>
            <p className="mt-1 text-[13.5px] leading-[1.55] text-ink-soft">
              {it.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Limit({ n, label }: { n: string; label: string }) {
  return (
    <div className="bg-page p-5">
      <div className="mono-display text-[22px] text-ink">{n}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
        {label}
      </div>
    </div>
  )
}
