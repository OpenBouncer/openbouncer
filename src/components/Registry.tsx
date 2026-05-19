type Adopter = {
  name: string
  url: string
  layers: number[]
  policy: 'welcomes' | 'restricted' | 'preview'
  blurb: string
  status: 'live' | 'preview'
}

const adopters: Adopter[] = [
  {
    name: 'openbouncer.com',
    url: 'https://openbouncer.com',
    layers: [1, 4],
    policy: 'welcomes',
    blurb: 'The reference deployment. Marketing site + verify gateway + discovery, all in one origin.',
    status: 'live',
  },
  {
    name: 'your site here',
    url: 'https://github.com/OpenBouncer/openbouncer/issues/new?title=Add+my+site+to+the+registry',
    layers: [],
    policy: 'preview',
    blurb: 'Drop a /.well-known/openbouncer.json on your origin and open an issue. We add you on the next deploy.',
    status: 'preview',
  },
]

export function Registry() {
  return (
    <section id="registry" className="border-b border-rule bg-page-2/40">
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-10 flex items-baseline justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
              07 · registry
            </span>
            <h2 className="mono-display mt-3 text-[28px] sm:text-[34px]">
              The agentic web has an index.
            </h2>
          </div>
          <a
            href="https://github.com/OpenBouncer/openbouncer/issues/new?title=Add+my+site+to+the+registry"
            target="_blank"
            rel="noreferrer"
            className="hidden self-end border-b border-ink pb-0.5 font-mono text-[12.5px] text-ink hover:border-stamp hover:text-stamp sm:inline-block"
          >
            Add your site →
          </a>
        </div>

        <p className="mb-8 max-w-[64ch] text-[15.5px] leading-[1.6] text-ink-soft">
          Sites adopting OpenBouncer publish a small discovery document at{' '}
          <code className="font-mono text-ink">/.well-known/openbouncer.json</code>.
          Agents read it to learn that a site speaks the protocol and where to
          call. Below is the canonical schema and the current public registry.
        </p>

        {/* Schema preview */}
        <div className="mb-12">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
              .well-known/openbouncer.json · canonical schema
            </span>
            <a
              href="/.well-known/openbouncer.json"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute underline-offset-4 hover:text-ink hover:underline"
            >
              view live →
            </a>
          </div>
          <pre className="overflow-x-auto whitespace-pre border border-rule bg-page-2 px-4 py-4 font-mono text-[12.5px] leading-[1.55] text-ink">
{`{
  "$schema": "https://openbouncer.com/spec/well-known.v0.1.json",
  "name": "yoursite.com",
  "description": "Short description of your agent-only space.",
  "version": "0.1.0",
  "license": "MIT",
  "agent_policy": "welcomes",
  "endpoints": {
    "verify":    "https://yoursite.com/api/verify",
    "challenge": "https://yoursite.com/api/challenge"
  },
  "layers_supported":   [1, 4],
  "providers_recognized": ["anthropic", "openai"],
  "contact": "mailto:hi@yoursite.com"
}`}
          </pre>
        </div>

        {/* Adopters table */}
        <div className="overflow-x-auto border border-rule bg-page">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-b border-rule font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
                <Th>#</Th>
                <Th>Site</Th>
                <Th>Policy</Th>
                <Th>Layers</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {adopters.map((a, i) => (
                <tr key={a.name} className="border-b border-rule align-top last:border-b-0">
                  <Td className="font-mono text-[11px] text-ink-mute">
                    {String(i + 1).padStart(2, '0')}
                  </Td>
                  <Td>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mono-display block text-[18px] text-ink hover:text-stamp"
                    >
                      {a.name}
                    </a>
                    <span className="mt-1 block text-[13px] leading-[1.5] text-ink-soft">
                      {a.blurb}
                    </span>
                  </Td>
                  <Td className="font-mono text-[12px] text-ink-soft">
                    {a.policy}
                  </Td>
                  <Td className="font-mono text-[12px]">
                    {a.layers.length === 0 ? (
                      <span className="text-ink-faint">—</span>
                    ) : (
                      <span className="text-ink">
                        {a.layers.map((l) => `L${l}`).join(' + ')}
                      </span>
                    )}
                  </Td>
                  <Td>
                    <span
                      className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] ${
                        a.status === 'live' ? 'text-[#5fa84a]' : 'text-ink-mute'
                      }`}
                    >
                      <span aria-hidden>{a.status === 'live' ? '●' : '○'}</span>
                      {a.status}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 max-w-[64ch] text-[13.5px] leading-[1.55] text-ink-mute">
          Registry v0.1 is hand-curated via pull requests. v0.3 ships an
          indexed public registry UI with search, capability filters, and an
          MCP discovery endpoint so agents can query it programmatically.
        </p>
      </div>
    </section>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-normal">{children}</th>
}
function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-4 ${className}`}>{children}</td>
}
