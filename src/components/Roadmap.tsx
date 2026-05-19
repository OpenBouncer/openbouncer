type Item = {
  version: string
  state: 'shipped' | 'active' | 'planned'
  items: string[]
}

const milestones: Item[] = [
  {
    version: 'v0.1.draft',
    state: 'shipped',
    items: [
      'Public preview at openbouncer.com',
      'POST /api/verify with L1 + L4-stub evaluation',
      'GET /api/challenge with per-session fresh nonces',
      'GET /.well-known/openbouncer.json discovery',
      '<OpenBouncerGate /> widget (gate + live demo)',
      '@openbouncer/gate npm package (preview tag)',
      'Cloudflare Pages deploy, MIT-licensed on GitHub',
    ],
  },
  {
    version: 'v0.2',
    state: 'active',
    items: [
      'Per-session nonce store (Durable Object)',
      'Ed25519-signed pass tokens',
      'Real provider attestation signature verification',
      'Stable @openbouncer/gate on the latest tag',
      'MCP server for agent-side discovery',
      'Global rate limit via Durable Object counters',
    ],
  },
  {
    version: 'v0.3',
    state: 'planned',
    items: [
      'Public registry UI (search, filters, capabilities)',
      'L2 latency-window enforcement',
      'L3 parallel reasoning challenge',
      'Pluggable provider key store',
      'Self-host guide (Bun, Node, Fly, Cloudflare)',
    ],
  },
  {
    version: 'v1.0',
    state: 'planned',
    items: [
      'Frozen v1 spec (RFC-style)',
      'Stable @openbouncer/gate package',
      'Audited threat model',
      'Reference implementations in multiple runtimes',
    ],
  },
]

export function Roadmap() {
  return (
    <section id="roadmap" className="border-b border-rule">
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-10 flex items-baseline justify-between gap-4">
          <h2 className="mono-display text-[28px] sm:text-[34px]">
            Roadmap.
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
            08 · roadmap
          </span>
        </div>

        <p className="mb-10 max-w-[64ch] text-[15.5px] leading-[1.6] text-ink-soft">
          Built in the open. v0.2 is up next — no fixed date, watch the
          issues. Milestones live on{' '}
          <a
            href="https://github.com/OpenBouncer/openbouncer/issues"
            target="_blank"
            rel="noreferrer"
            className="border-b border-ink text-ink hover:border-stamp hover:text-stamp"
          >
            GitHub
          </a>
          .
        </p>

        <div className="grid grid-cols-1 gap-px bg-rule md:grid-cols-4">
          {milestones.map((m) => (
            <Milestone key={m.version} m={m} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Milestone({ m }: { m: Item }) {
  const tone =
    m.state === 'shipped'
      ? 'text-[#5fa84a]'
      : m.state === 'active'
        ? 'text-stamp'
        : 'text-ink-mute'

  const stateLabel =
    m.state === 'shipped'
      ? '● shipped'
      : m.state === 'active'
        ? '◐ active'
        : '○ planned'

  return (
    <div className="bg-page p-6 sm:p-7">
      <div className="flex items-baseline justify-between">
        <span className="mono-display text-[22px] text-ink">{m.version}</span>
        <span className={`font-mono text-[10px] uppercase tracking-[0.22em] ${tone}`}>
          {stateLabel}
        </span>
      </div>
      <ul className="mt-5 space-y-2.5 text-[13.5px] leading-[1.5] text-ink-soft">
        {m.items.map((i) => (
          <li key={i} className="flex items-baseline gap-2">
            <span
              aria-hidden
              className={`font-mono text-[10px] ${m.state === 'shipped' ? 'text-[#5fa84a]' : 'text-ink-faint'}`}
            >
              {m.state === 'shipped' ? '✓' : '–'}
            </span>
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
