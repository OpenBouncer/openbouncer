type Tier = {
  n: string
  ships: string
  title: string
  body: string
}

const CONTRACT = '4QyAdfEMBmPgMqtVy1gd6NthGsHzMctobUVEJqpwpump'
const PUMP_URL = `https://pump.fun/coin/${CONTRACT}`

const tiers: Tier[] = [
  {
    n: '01',
    ships: 'v0.2',
    title: 'Priority registry placement',
    body: 'Holder sites surface at the top of the public registry index — the discovery layer agents query first.',
  },
  {
    n: '02',
    ships: 'v0.2',
    title: 'Raised rate limits',
    body: 'Free tier ships 30 req / IP / min on the verify endpoint. Holders get a 10× ceiling, measured globally once the Durable Object backend lands.',
  },
  {
    n: '03',
    ships: 'v0.3',
    title: 'Custom provider keys',
    body: 'Run your own attestation lane for closed-ecosystem agents. Reserve a provider key in the registry; sign and verify against your own Ed25519 pair.',
  },
  {
    n: '04',
    ships: 'v0.3',
    title: 'Early v0.2 / v0.3 preview access',
    body: 'Durable Object nonce store, MCP discovery server, signed pass tokens — holders run them on production before the public rollout.',
  },
  {
    n: '05',
    ships: 'v1.0',
    title: 'White-label gate widget',
    body: '<OpenBouncerGate /> with your own brand, colors, and a removable footer attribution — for products that need to keep the doorman invisible.',
  },
]

export function Holders() {
  return (
    <section id="holders" className="border-b border-rule">
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-10 flex items-baseline justify-between gap-4">
          <h2 className="mono-display text-[28px] sm:text-[34px]">
            For $OB holders.
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
            09 · holders
          </span>
        </div>

        <p className="mb-8 max-w-[64ch] text-[15.5px] leading-[1.6] text-ink-soft">
          OpenBouncer ships a community token, <span className="text-ink">$OB</span>,
          to fund its own development. Creator rewards from every trade flow
          back to the project. Holders unlock premium gate capabilities as
          the roadmap moves. The open-source core stays free and MIT-licensed.
        </p>

        {/* Contract block */}
        <div className="mb-10 border border-rule bg-page-2 p-5 sm:p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
                  $OB · contract · solana
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#5fa84a]">
                  ● live
                </span>
              </div>
              <code className="select-all break-all font-mono text-[13px] text-ink sm:text-[14.5px]">
                {CONTRACT}
              </code>
            </div>
            <a
              href={PUMP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-2 border border-ink bg-ink px-4 py-2.5 font-mono text-[12px] text-page transition-colors hover:bg-stamp"
            >
              Trade on pump.fun <span aria-hidden>↗</span>
            </a>
          </div>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((t) => (
            <TierCard key={t.n} t={t} />
          ))}
        </div>

        <p className="mt-8 max-w-[64ch] text-[13.5px] leading-[1.55] text-ink-mute">
          Premium capabilities ship as the roadmap moves; until then, the
          full spec, the verify endpoint, the widget and the registry are
          open to everyone. Anyone can curl the gate today.
        </p>
      </div>
    </section>
  )
}

function TierCard({ t }: { t: Tier }) {
  return (
    <div className="bg-page p-6 sm:p-7">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
          {t.n}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-stamp">
          ships {t.ships}
        </span>
      </div>
      <h3 className="mono-display mt-3 text-[18px]">{t.title}</h3>
      <p className="mt-2 text-[13.5px] leading-[1.55] text-ink-soft">{t.body}</p>
    </div>
  )
}
