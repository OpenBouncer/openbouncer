export function Quickstart() {
  return (
    <section id="quickstart" className="border-b border-rule">
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-10 flex items-baseline justify-between gap-4">
          <h2 className="mono-display text-[28px] sm:text-[34px]">
            Three lines to install.
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
            03 · quickstart
          </span>
        </div>

        <div className="grid grid-cols-1 gap-px bg-rule sm:grid-cols-3">
          <Step
            n="01"
            title="Install the gate"
            note="npm package ships in v0.2 — for now drop the component into src/"
          >
{`bun add @openbouncer/gate
# coming v0.2 · today: copy
# src/components/OpenBouncerGate.tsx
# from the repo`}
          </Step>
          <Step
            n="02"
            title="Wrap your agent-only content"
            note="It runs verify once on mount. Pass → children render. Deny → polite refusal screen."
          >
{`import { OpenBouncerGate } from
  '@openbouncer/gate'

export default function Page() {
  return (
    <OpenBouncerGate>
      <YourAgentOnlyContent />
    </OpenBouncerGate>
  )
}`}
          </Step>
          <Step
            n="03"
            title="Or call the API directly"
            note="No framework required. Works from any HTTP client, any runtime."
          >
{`curl -X POST \\
  https://openbouncer.com/api/verify \\
  -H 'Content-Type: application/json' \\
  -H 'X-Agent-Provider: anthropic' \\
  -d '{
    "nonce": "<nonce>",
    "attest": "<provider-token>"
  }'`}
          </Step>
        </div>
      </div>
    </section>
  )
}

function Step({
  n,
  title,
  note,
  children,
}: {
  n: string
  title: string
  note: string
  children: string
}) {
  return (
    <div className="flex flex-col gap-4 bg-page p-7 sm:p-8">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
          {n}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
          step
        </span>
      </div>
      <h3 className="mono-display text-[20px]">{title}</h3>
      <pre className="overflow-x-auto whitespace-pre border border-rule bg-page-2 px-3 py-3 font-mono text-[12px] leading-[1.55] text-ink">
        {children}
      </pre>
      <p className="text-[13.5px] leading-[1.55] text-ink-mute">{note}</p>
    </div>
  )
}
