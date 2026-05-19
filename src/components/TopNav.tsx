import { Logomark } from './Logomark'

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-page/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5 text-ink">
          <Logomark size={22} />
          <span className="font-mono text-[13px] font-semibold tracking-[-0.02em] text-ink">
            openbouncer
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
            v0.1
          </span>
        </a>

        <nav className="hidden items-center gap-7 font-mono text-[12px] text-ink-mute md:flex">
          <a href="#how" className="hover:text-ink">How</a>
          <a href="#quickstart" className="hover:text-ink">Quickstart</a>
          <a href="#spec" className="hover:text-ink">Spec</a>
          <a href="#registry" className="hover:text-ink">Registry</a>
          <a href="#faq" className="hover:text-ink">FAQ</a>
          <a
            href="https://github.com/OpenBouncer/openbouncer"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink"
          >
            GitHub ↗
          </a>
          <a
            href="https://x.com/OpenBouncer"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink"
          >
            X ↗
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint sm:inline">
            MIT
          </span>
          <a
            href="#try"
            className="inline-flex items-center gap-1.5 bg-ink px-3 py-1.5 font-mono text-[12px] text-page transition-colors hover:bg-stamp"
          >
            Try the gate <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </header>
  )
}
