import { FAQ } from './components/FAQ'
import { FeatureRow } from './components/FeatureRow'
import { Hero } from './components/Hero'
import { Logomark } from './components/Logomark'
import { OpenBouncerGate } from './components/OpenBouncerGate'
import { Quickstart } from './components/Quickstart'
import { Registry } from './components/Registry'
import { Roadmap } from './components/Roadmap'
import { Security } from './components/Security'
import { SequenceDiagram } from './components/SequenceDiagram'
import { Spec } from './components/Spec'
import { TopNav } from './components/TopNav'
import { TrustedBy } from './components/TrustedBy'

function App() {
  return (
    <div className="min-h-svh bg-page text-ink">
      <TopNav />

      <main>
        <Hero />
        <TrustedBy />

        {/* 01 · How it works */}
        <FeatureRow />

        {/* 02 · The protocol */}
        <section id="protocol" className="border-b border-rule">
          <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-20">
            <div className="mb-10 flex items-baseline justify-between gap-4">
              <h2 className="mono-display text-[28px] sm:text-[34px]">
                The protocol, in one diagram.
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
                02 · protocol
              </span>
            </div>
            <SequenceDiagram />
            <p className="mt-6 max-w-[64ch] text-[15px] leading-[1.55] text-ink-soft">
              OpenBouncer is two things in one shape: a verification gateway
              that sits in front of agent-only endpoints, and a public
              registry that agents query to discover those endpoints. The full
              spec is below; the draft repo is at{' '}
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

        {/* 03 · Quickstart */}
        <Quickstart />

        {/* 04 · Try the gate */}
        <section id="try" className="border-b border-rule">
          <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-24">
            <div className="mb-10 flex items-baseline justify-between gap-4">
              <h2 className="mono-display text-[36px] sm:text-[48px] md:text-[56px]">
                Try the gate.
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
                04 · live
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
{`curl -X POST https://openbouncer.com/api/verify \\
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

        {/* 05 · Spec */}
        <Spec />

        {/* 06 · Security */}
        <Security />

        {/* 07 · Registry */}
        <Registry />

        {/* 08 · Roadmap */}
        <Roadmap />

        {/* 09 · FAQ */}
        <FAQ />

        {/* CTA strip */}
        <section className="border-b border-rule bg-ink text-page">
          <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-16">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                the agentic web starts here
              </span>
              <h3 className="mono-display mt-2 text-[26px] text-page sm:text-[32px]">
                Build for the software readers.
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/OpenBouncer/openbouncer"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-page px-4 py-2.5 font-mono text-[12.5px] text-ink transition-colors hover:bg-stamp hover:text-page"
              >
                Read the source <span aria-hidden>↗</span>
              </a>
              <a
                href="#try"
                className="inline-flex items-center gap-2 border border-page px-4 py-2.5 font-mono text-[12.5px] text-page transition-colors hover:border-stamp hover:text-stamp"
              >
                Try the gate
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-5 py-12 font-mono text-[12px] text-ink-mute sm:grid-cols-12 sm:px-8">
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
            <a
              href="https://github.com/OpenBouncer/openbouncer/stargazers"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 border border-rule px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-ink-mute hover:border-ink hover:text-ink"
            >
              ★ Star on GitHub
            </a>
          </div>
          <FootCol title="Product">
            <a href="#how" className="hover:text-ink">How it works</a>
            <a href="#protocol" className="hover:text-ink">Protocol diagram</a>
            <a href="#quickstart" className="hover:text-ink">Quickstart</a>
            <a href="#try" className="hover:text-ink">Try the gate</a>
            <a href="#registry" className="hover:text-ink">Registry</a>
          </FootCol>
          <FootCol title="Reference">
            <a href="#spec" className="hover:text-ink">Protocol spec</a>
            <a href="#security" className="hover:text-ink">Security model</a>
            <a href="#roadmap" className="hover:text-ink">Roadmap</a>
            <a href="#faq" className="hover:text-ink">FAQ</a>
            <a
              href="/.well-known/openbouncer.json"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink"
            >
              .well-known JSON ↗
            </a>
          </FootCol>
          <FootCol title="Open source">
            <a
              href="https://github.com/OpenBouncer/openbouncer"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink"
            >
              GitHub repo ↗
            </a>
            <a
              href="https://x.com/OpenBouncer"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink"
            >
              X · @OpenBouncer ↗
            </a>
            <a
              href="https://github.com/OpenBouncer/openbouncer/issues"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink"
            >
              Issues ↗
            </a>
            <a
              href="https://github.com/OpenBouncer/openbouncer/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink"
            >
              MIT license ↗
            </a>
            <a
              href="https://llmstxt.org"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink"
            >
              llms.txt ↗
            </a>
            <a
              href="https://modelcontextprotocol.io"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink"
            >
              MCP ↗
            </a>
          </FootCol>
        </div>
        <div className="border-t border-rule">
          <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-2 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <span>© {new Date().getFullYear()} OpenBouncer · MIT</span>
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
    <div className="sm:col-span-2 md:col-span-2">
      <div className="mb-3 text-[10px] uppercase tracking-[0.22em] text-ink-faint">
        {title}
      </div>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  )
}

export default App
