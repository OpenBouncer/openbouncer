import { FeatureRow } from './components/FeatureRow'
import { Hero } from './components/Hero'
import { Logomark } from './components/Logomark'
import { OpenBouncerGate } from './components/OpenBouncerGate'
import { SequenceDiagram } from './components/SequenceDiagram'
import { TopNav } from './components/TopNav'
import { TrustedBy } from './components/TrustedBy'

function App() {
  return (
    <div className="min-h-svh bg-page text-ink">
      <TopNav />

      <main>
        <Hero />
        <TrustedBy />
        <FeatureRow />

        <section id="spec" className="border-b border-rule">
          <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-20">
            <div className="mb-10 flex items-baseline justify-between gap-4">
              <h2 className="mono-display text-[28px] sm:text-[34px]">
                The protocol, in one diagram.
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
                04 · protocol
              </span>
            </div>
            <SequenceDiagram />
            <p className="mt-6 max-w-[64ch] text-[15px] leading-[1.55] text-ink-soft">
              OpenBouncer is two things in one shape: a verification gateway
              that sits in front of agent-only endpoints, and a public
              registry that agents query to discover those endpoints. The
              full draft spec lives at{' '}
              <a
                href="#spec"
                className="border-b border-ink text-ink hover:border-stamp hover:text-stamp"
              >
                openbouncer.com/spec
              </a>
              .
            </p>
          </div>
        </section>

        <section id="try" className="border-b border-rule">
          <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-24">
            <div className="mb-10 flex items-baseline justify-between gap-4">
              <h2 className="mono-display text-[36px] sm:text-[48px] md:text-[56px]">
                Try the gate.
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
                06 · live
              </span>
            </div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
              <div className="md:col-span-7">
                <OpenBouncerGate demoMode />
                <p className="mt-4 font-mono text-[11px] text-ink-mute">
                  Live request against{' '}
                  <code className="text-ink">/api/verify</code>. Your click is
                  honest: a real POST from a real browser, with no nonce and
                  no attestation. The endpoint denies it. That is OpenBouncer
                  working.
                </p>
              </div>

              <div className="md:col-span-5">
                <p className="max-w-[44ch] text-[17px] leading-[1.55] text-ink-soft">
                  You can&rsquo;t pass it. That&rsquo;s the demo. To see an
                  agent pass, run the protocol from a terminal or open this
                  page inside a runtime that can.
                </p>

                <div className="mt-7 border border-rule bg-page-2 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
                      run it as an agent
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#5fa84a]">
                      → 200 pass
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap break-all font-mono text-[12.5px] leading-[1.55] text-ink">
{`curl -X POST $ORIGIN/api/verify \\
  -H 'Content-Type: application/json' \\
  -H 'X-Agent-Provider: anthropic' \\
  -d '{
    "nonce": "ob_demo_a8f3c9e2",
    "attest": "<signed-provider-token>"
  }'`}
                  </pre>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  <Stat n="<40 ms" label="median decision · in-process" />
                  <Stat n="3 lines" label="install ·  &lt;OpenBouncerGate /&gt;" />
                  <Stat n="MIT" label="open source · spec on GitHub" />
                  <Stat n="L1–L4" label="layered defense · attestation last" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="registry" className="border-b border-rule bg-page-2/40">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 py-16 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:py-20">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
                05 · registry
              </span>
              <h2 className="mono-display mt-3 text-[32px] sm:text-[40px]">
                The agentic web has an
                <br />
                index now.
              </h2>
              <p className="mt-4 max-w-[48ch] text-[15.5px] leading-[1.55] text-ink-soft">
                When sites adopt OpenBouncer, they appear in a public registry
                that agents query as their default starting point. Think{' '}
                <code className="font-mono text-ink">robots.txt</code> for a
                web that&rsquo;s no longer just for humans.
              </p>
            </div>
            <a
              href="#registry"
              className="self-start border-b border-ink pb-0.5 font-mono text-[12.5px] text-ink hover:border-stamp hover:text-stamp sm:self-end"
            >
              Browse the registry &nbsp;→
            </a>
          </div>
        </section>
      </main>

      <footer>
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-5 py-10 font-mono text-[12px] text-ink-mute sm:grid-cols-12 sm:px-8">
          <div className="sm:col-span-5">
            <div className="flex items-center gap-2.5 text-ink">
              <Logomark size={22} />
              <span className="text-[13px] font-semibold text-ink">
                openbouncer
              </span>
            </div>
            <p className="mt-3 max-w-[36ch] text-[12px] text-ink-mute">
              Built in the open. MIT. The agentic web starts here.
            </p>
          </div>
          <FootCol title="Product">
            <a href="#how" className="hover:text-ink">How it works</a>
            <a href="#spec" className="hover:text-ink">Protocol spec</a>
            <a href="#try" className="hover:text-ink">Try the gate</a>
            <a href="#registry" className="hover:text-ink">Registry</a>
          </FootCol>
          <FootCol title="Open">
            <a href="https://github.com/" className="hover:text-ink">GitHub</a>
            <a href="#" className="hover:text-ink">MCP server</a>
            <a href="#" className="hover:text-ink">/.well-known schema</a>
            <a href="#" className="hover:text-ink">Roadmap</a>
          </FootCol>
          <FootCol title="Adjacent">
            <a href="#" className="hover:text-ink">llms.txt</a>
            <a href="#" className="hover:text-ink">A2A &amp; MCP</a>
            <a href="#" className="hover:text-ink">Agent attestation</a>
          </FootCol>
        </div>
        <div className="border-t border-rule">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint sm:px-8">
            <span>© {new Date().getFullYear()} OpenBouncer</span>
            <span>Cloudflare for agents</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-rule pb-3">
      <span className="mono-display text-[28px] text-ink">{n}</span>
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute">
        {label}
      </span>
    </div>
  )
}

function FootCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="sm:col-span-2">
      <div className="mb-3 text-[10px] uppercase tracking-[0.22em] text-ink-faint">
        {title}
      </div>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  )
}

export default App
