import { useState } from 'react'

type QA = { q: string; a: React.ReactNode }

const items: QA[] = [
  {
    q: 'Why is there a token?',
    a: (
      <>
        OpenBouncer ships a community token,{' '}
        <code className="font-mono text-ink">$OB</code>, to fund its own
        development. Creator rewards from every trade on{' '}
        <a
          href="https://pump.fun/coin/4QyAdfEMBmPgMqtVy1gd6NthGsHzMctobUVEJqpwpump"
          target="_blank"
          rel="noreferrer"
          className="border-b border-ink hover:border-stamp hover:text-stamp"
        >
          pump.fun
        </a>{' '}
        flow back into the project. Holders unlock premium gate
        capabilities — priority registry placement, 10× rate limits,
        custom provider keys — as the roadmap moves. See the{' '}
        <a
          href="#holders"
          className="border-b border-ink hover:border-stamp hover:text-stamp"
        >
          holders section
        </a>{' '}
        for the full tier list. The open-source core stays free and
        MIT-licensed.
      </>
    ),
  },
  {
    q: 'Is this a captcha?',
    a: (
      <>
        Yes — but inverted. Captchas exist to keep robots out. OpenBouncer
        exists to let robots in (and keep humans out). The visual is similar;
        the rule is flipped.
      </>
    ),
  },
  {
    q: 'How is this different from llms.txt or robots.txt?',
    a: (
      <>
        <code className="font-mono text-ink">robots.txt</code> tells crawlers
        which pages they may visit.{' '}
        <a
          href="https://llmstxt.org"
          target="_blank"
          rel="noreferrer"
          className="border-b border-ink hover:border-stamp hover:text-stamp"
        >
          <code className="font-mono text-ink">llms.txt</code>
        </a>{' '}
        tells LLMs which content is canonical. OpenBouncer is one layer deeper:
        an active per-request gate with cryptographic signals. The three
        coexist — OpenBouncer reads <code className="font-mono text-ink">llms.txt</code>{' '}
        where present.
      </>
    ),
  },
  {
    q: 'Can someone forge the agent attestation?',
    a: (
      <>
        In v0.1, yes — the gateway accepts any non-empty{' '}
        <code className="font-mono text-ink">attest</code> string. That is why
        the security section is upfront about it. v0.2 ships real Ed25519
        signature verification against a registry of provider public keys
        (Anthropic, OpenAI, Google). After that, forging requires stealing a
        provider&rsquo;s signing key.
      </>
    ),
  },
  {
    q: 'Why would a site want to deny humans?',
    a: (
      <>
        Structured agent-only APIs, AI-to-AI marketplaces, agent training
        sandboxes, low-latency machine endpoints where human noise causes
        emotional or unpredictable behaviour. The agentic web is starting to
        need its own infrastructure — OpenBouncer is the doorman.
      </>
    ),
  },
  {
    q: 'Is OpenBouncer owned by Cloudflare?',
    a: (
      <>
        No. It is hosted on Cloudflare Pages because their edge runtime is the
        best fit for Fetch-API handlers and the latency claim. The project is
        independent, MIT-licensed, and can be self-hosted on any Bun or Node
        server — the standalone entrypoint is{' '}
        <code className="font-mono text-ink">server/index.ts</code>.
      </>
    ),
  },
  {
    q: 'What happens if my agent fails verification?',
    a: (
      <>
        You get an HTTP 403 with a structured reason header{' '}
        <code className="font-mono text-ink">ob-reason</code>:{' '}
        <code className="font-mono text-ink">layer-1.nonce-missing</code>,{' '}
        <code className="font-mono text-ink">layer-1.instruction-not-followed</code>,{' '}
        <code className="font-mono text-ink">rate-limited</code>, etc. The
        reason tells you exactly which layer rejected the request so your
        runtime can correct the next attempt.
      </>
    ),
  },
  {
    q: 'Is this open source? Where is the code?',
    a: (
      <>
        Yes — MIT-licensed, full source at{' '}
        <a
          href="https://github.com/OpenBouncer/openbouncer"
          target="_blank"
          rel="noreferrer"
          className="border-b border-ink hover:border-stamp hover:text-stamp"
        >
          github.com/OpenBouncer/openbouncer
        </a>
        . Pull requests welcome. The marketing site, the API server, the
        widget, and the deploy config all live in the same repo.
      </>
    ),
  },
  {
    q: 'When does v0.2 ship?',
    a: (
      <>
        Soon — no public deadline by choice. The active track: per-session
        nonce persistence (Durable Object), Ed25519 token signing, provider
        key registry, the publishable{' '}
        <code className="font-mono text-ink">@openbouncer/gate</code> npm
        package, and an MCP server for discovery. Watch the open issues on
        GitHub for live status.
      </>
    ),
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="border-b border-rule">
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-10 flex items-baseline justify-between gap-4">
          <h2 className="mono-display text-[28px] sm:text-[34px]">
            Common questions.
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
            10 · faq
          </span>
        </div>

        <div className="border-t border-rule">
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={i} className="border-b border-rule">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="mono-display text-[18px] text-ink sm:text-[20px]">
                      {item.q}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 font-mono text-[14px] text-ink-mute transition-transform ${
                      isOpen ? 'rotate-45 text-stamp' : ''
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-6 pl-12 pr-2 text-[15px] leading-[1.6] text-ink-soft">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
