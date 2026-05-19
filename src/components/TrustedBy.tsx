/**
 * Typographic "trusted by" strip. We don't have real customer logos yet, so
 * we show the agent runtimes we interoperate with — wordmarks set in our own
 * mono, not their brand assets. Honest, restrained, builder-facing.
 */
export function TrustedBy() {
  const items = [
    'Claude',
    'ChatGPT',
    'Operator',
    'Gemini',
    'Computer Use',
    'browser-use',
    'OpenInterpreter',
  ]
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
            interoperates with agent runtimes
          </span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[13px] text-ink-soft">
            {items.map((n, i) => (
              <span key={n} className="flex items-center gap-6">
                <span>{n}</span>
                {i < items.length - 1 && (
                  <span className="text-ink-faint" aria-hidden>
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
