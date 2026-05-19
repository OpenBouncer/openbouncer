/**
 * Three feature columns. Engineered, monochrome, no illustrated icons —
 * each header is a geometric glyph drawn from the same family.
 */
export function FeatureRow() {
  return (
    <section
      id="how"
      className="border-y border-rule bg-page-2/40"
    >
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-10 flex items-baseline justify-between gap-4">
          <h2 className="mono-display text-[28px] sm:text-[34px]">
            How the door works.
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
            03 · architecture
          </span>
        </div>

        <div className="grid grid-cols-1 gap-px bg-rule sm:grid-cols-3">
          <Feature
            num="01"
            glyph={<GlyphKey />}
            title="Agent identity"
            body="Cryptographic attestation from major providers (Anthropic, OpenAI, Google) plus a fallback prompt-following challenge. The page itself proves who you are."
          />
          <Feature
            num="02"
            glyph={<GlyphDial />}
            title="Sub-40ms latency"
            body="A single signed lookup against the registry. Edge-deployed. Faster than the average reCAPTCHA, by design. No image grids, no audio puzzles."
          />
          <Feature
            num="03"
            glyph={<GlyphGrid />}
            title="Public registry"
            body="An open directory of sites that welcome verified agents. Indexed by Claude, ChatGPT, Operator. Replaces robots.txt for a web that's no longer just for humans."
          />
        </div>
      </div>
    </section>
  )
}

function Feature({
  num,
  glyph,
  title,
  body,
}: {
  num: string
  glyph: React.ReactNode
  title: string
  body: string
}) {
  return (
    <div className="bg-page p-7 sm:p-8">
      <div className="mb-8 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
          {num}
        </span>
        <div className="h-10 w-10">{glyph}</div>
      </div>
      <h3 className="mono-display mb-2 text-[20px]">{title}</h3>
      <p className="text-[14.5px] leading-[1.55] text-ink-soft">{body}</p>
    </div>
  )
}

// Geometric glyphs — drawn with consistent stroke, monoline
function GlyphKey() {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="#0e0e0c" strokeWidth={1.4}>
      <circle cx={13} cy={20} r={6} />
      <line x1={19} y1={20} x2={37} y2={20} />
      <line x1={31} y1={20} x2={31} y2={26} />
      <line x1={37} y1={20} x2={37} y2={24} />
    </svg>
  )
}
function GlyphDial() {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="#0e0e0c" strokeWidth={1.4}>
      <circle cx={20} cy={20} r={14} />
      <line x1={20} y1={20} x2={28} y2={14} />
      <circle cx={20} cy={20} r={1.6} fill="#0e0e0c" />
      <line x1={20} y1={4} x2={20} y2={7} />
      <line x1={36} y1={20} x2={33} y2={20} />
      <line x1={20} y1={36} x2={20} y2={33} />
      <line x1={4} y1={20} x2={7} y2={20} />
    </svg>
  )
}
function GlyphGrid() {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="#0e0e0c" strokeWidth={1.4}>
      <rect x={4} y={4} width={32} height={32} />
      <line x1={14} y1={4} x2={14} y2={36} />
      <line x1={26} y1={4} x2={26} y2={36} />
      <line x1={4} y1={14} x2={36} y2={14} />
      <line x1={4} y1={26} x2={36} y2={26} />
    </svg>
  )
}
