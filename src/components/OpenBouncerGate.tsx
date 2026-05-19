import { useEffect, useRef, useState } from 'react'
import { Logomark } from './Logomark'

/**
 * <OpenBouncerGate />
 *
 * Two faces of the same component:
 *
 *   1. As a third-party gate widget (default): wraps protected children,
 *      verifies the request on mount, renders children only on pass.
 *
 *   2. As the captcha-style live demo on openbouncer.com (`demoMode`):
 *      a single reCAPTCHA-styled card with a checkbox labelled
 *      "I'm not a human". Clicking it runs a *real* POST /api/verify
 *      from the browser. Because the browser has no way to inject a
 *      provider attestation, the request is honestly denied.
 *
 *      There is intentionally no "switch to agent" toggle — that would be
 *      a costume. To see the pass case, run the curl on the left or open
 *      the page in an agent runtime.
 *
 * Pure React, no external deps.
 */

type Verdict = 'idle' | 'verifying' | 'pass' | 'deny' | 'error'

type VerifyResponse = {
  ok: boolean
  decision: 'pass' | 'deny'
  reason?: string
  matched_layers: number[]
  agent_id?: string
  latency_ms: number
  door: 'open' | 'closed'
  token?: string
}

export type OpenBouncerGateProps = {
  endpoint?: string
  demoMode?: boolean
  children?: React.ReactNode
  onPass?: (token: string | undefined, response: VerifyResponse) => void
  onDeny?: (reason: string | undefined, response: VerifyResponse) => void
}

const MIN_SPINNER_MS = 700

export function OpenBouncerGate({
  endpoint = '/api/verify',
  demoMode = false,
  children,
  onPass,
  onDeny,
}: OpenBouncerGateProps) {
  const [verdict, setVerdict] = useState<Verdict>('idle')
  const [data, setData] = useState<VerifyResponse | null>(null)
  const [attempts, setAttempts] = useState(0)
  const ran = useRef(false)

  async function tryIt(): Promise<void> {
    setVerdict('verifying')
    setData(null)
    setAttempts((n) => n + 1)
    const start = performance.now()

    try {
      const [res] = await Promise.all([
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Honest minimal payload from a real browser click. We do not
          // forge a nonce or attestation — that's the whole point.
          body: JSON.stringify({}),
        }),
        new Promise((r) => setTimeout(r, MIN_SPINNER_MS)),
      ])
      const json = (await res.json()) as VerifyResponse
      json.latency_ms = Math.round(performance.now() - start)
      setData(json)
      setVerdict(json.ok ? 'pass' : 'deny')
      if (json.ok) onPass?.(json.token, json)
      else onDeny?.(json.reason, json)
    } catch (err) {
      setVerdict('error')
      setData({
        ok: false,
        decision: 'deny',
        reason: `network-error: ${String(err)}`,
        matched_layers: [],
        latency_ms: Math.round(performance.now() - start),
        door: 'closed',
      })
    }
  }

  useEffect(() => {
    if (demoMode) return
    if (ran.current) return
    ran.current = true
    // For real gate use, the page would attach a fresh per-session nonce + an
    // attestation header before mount. The bare call below will deny in this
    // skeleton — that's expected; real wiring lands in v0.2.
    void tryIt()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoMode])

  // ── Non-demo (real gate) render ────────────────────────────────────
  if (!demoMode) {
    if (verdict === 'pass') return <>{children}</>
    if (verdict === 'verifying' || verdict === 'idle') {
      return (
        <div className="grid min-h-svh place-items-center bg-page text-ink">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-mute">
            verifying agent…
          </div>
        </div>
      )
    }
    return (
      <div className="grid min-h-svh place-items-center bg-page px-6 text-center text-ink">
        <div className="max-w-[42ch]">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-stamp">
            denied
          </div>
          <h2 className="mono-display mt-3 text-[28px]">
            This area is for verified agents.
          </h2>
          <p className="mt-3 text-[14.5px] text-ink-soft">
            OpenBouncer could not confirm that this request came from a
            recognized agent runtime. Reason:{' '}
            <code className="font-mono text-ink">{data?.reason ?? 'unknown'}</code>.
          </p>
        </div>
      </div>
    )
  }

  // ── Demo render: one honest captcha card ───────────────────────────
  return (
    <div className="flex flex-col items-stretch gap-5">
      <div
        className={`relative w-full select-none border bg-surface ${
          verdict === 'pass'
            ? 'border-[#5fa84a]'
            : verdict === 'deny' || verdict === 'error'
              ? 'border-stamp'
              : 'border-rule-strong'
        }`}
        style={{ boxShadow: verdict === 'idle' ? '0 1px 0 rgba(14,14,12,0.04)' : 'none' }}
      >
        <div className="flex items-center gap-5 px-5 py-5 sm:gap-7 sm:px-7 sm:py-6">
          <button
            onClick={() => tryIt()}
            disabled={verdict === 'verifying'}
            aria-label="I'm not a human"
            className={`grid h-9 w-9 shrink-0 place-items-center border-2 transition-colors disabled:cursor-default sm:h-10 sm:w-10 ${
              verdict === 'pass'
                ? 'border-[#5fa84a] bg-[#5fa84a]'
                : verdict === 'deny' || verdict === 'error'
                  ? 'border-stamp bg-page-2'
                  : 'border-ink bg-page-2 hover:border-stamp'
            }`}
          >
            {verdict === 'idle' && <span className="sr-only">checkbox</span>}
            {verdict === 'verifying' && <Spinner />}
            {verdict === 'pass' && <CheckIcon />}
            {(verdict === 'deny' || verdict === 'error') && <CrossIcon />}
          </button>

          <div className="flex-1">
            <button
              onClick={() => tryIt()}
              disabled={verdict === 'verifying'}
              className="text-left text-[16px] font-medium text-ink hover:text-stamp disabled:hover:text-ink sm:text-[17px]"
            >
              I&rsquo;m not a human
            </button>
            <div className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-faint">
              click to verify
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 text-right text-ink">
            <Logomark size={28} />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute">
              OpenBouncer
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-ink-faint">
              reverse&nbsp;captcha
            </span>
          </div>
        </div>
      </div>

      <StatusLine verdict={verdict} data={data} attempts={attempts} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────
// Bits
// ─────────────────────────────────────────────────────────────────────────

function StatusLine({
  verdict,
  data,
  attempts,
}: {
  verdict: Verdict
  data: VerifyResponse | null
  attempts: number
}) {
  if (verdict === 'idle') {
    return (
      <p className="font-mono text-[11px] text-ink-mute">
        no browser can pass this — that&rsquo;s the entire product
      </p>
    )
  }
  if (verdict === 'verifying') {
    return (
      <p className="font-mono text-[11px] text-ink-mute">
        verifying… <span className="animate-pulse">▍</span>
      </p>
    )
  }
  if (verdict === 'pass' && data) {
    return (
      <p className="font-mono text-[11px] text-ink-soft">
        <span className="text-[#5fa84a]">● pass</span>
        <span className="mx-1.5 text-ink-faint">·</span>
        matched layers&nbsp;
        <span className="text-ink">
          L{data.matched_layers.join(' + L')}
        </span>
        <span className="mx-1.5 text-ink-faint">·</span>
        {data.latency_ms}ms
      </p>
    )
  }
  if ((verdict === 'deny' || verdict === 'error') && data) {
    const isHigh = attempts >= 3
    return (
      <div className="space-y-2 font-mono text-[11px] text-ink-soft">
        <p>
          <span className="text-stamp">● deny</span>
          <span className="mx-1.5 text-ink-faint">·</span>
          you appear to be human
          <span className="mx-1.5 text-ink-faint">·</span>
          {data.latency_ms}ms
        </p>
        <p className="text-ink-mute">
          reason&nbsp;<span className="text-ink">{data.reason ?? 'unknown'}</span>
          <span className="mx-1.5 text-ink-faint">·</span>
          {data.door}
        </p>
        {isHigh && (
          <p className="text-ink-mute">
            <span className="text-stamp">↳</span> still trying? you can&rsquo;t
            pass from a browser. agents reading this page complete the
            handshake via the protocol on the left.
          </p>
        )}
      </div>
    )
  }
  return null
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 animate-spin sm:h-6 sm:w-6"
      aria-label="verifying"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="#a8a59c"
        strokeWidth="2"
        strokeDasharray="42 16"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" aria-label="pass">
      <path
        d="M5 12.5l4.2 4.2L19 7"
        fill="none"
        stroke="#fafaf7"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" aria-label="deny">
      <path
        d="M6 6 L18 18 M18 6 L6 18"
        fill="none"
        stroke="#c8331f"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  )
}
