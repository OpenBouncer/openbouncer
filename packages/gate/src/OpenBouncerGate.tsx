import {
  createElement,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import { verify, type Provider, type VerifyResponse } from './verify'

/**
 * <OpenBouncerGate>
 *
 * Wraps content that should only render for verified agents. On mount it
 * POSTs the supplied nonce + attestation to the OpenBouncer verify
 * endpoint. On pass it renders `children`. On deny it renders
 * `deniedFallback` (default: a minimal inline "denied" screen).
 *
 * The component is intentionally headless — its default visuals are
 * inline styles only, so it ships with zero CSS, zero asset dependency,
 * zero framework lock-in beyond React. Pass your own fallbacks to fully
 * brand the gate.
 */

export type Verdict = 'idle' | 'verifying' | 'pass' | 'deny' | 'error'

export type OpenBouncerGateProps = {
  /** Per-session nonce, typically rendered into the page server-side. */
  nonce: string
  /** Provider attestation payload. v0.1 accepts any non-empty string. */
  attest?: string
  /** Provider name (sent as X-Agent-Provider header). */
  provider?: Provider
  /** Verify endpoint URL. Defaults to https://openbouncer.com/api/verify. */
  endpoint?: string
  /** Optional milliseconds since /api/challenge was issued. */
  challengeAgeMs?: number
  /** Content rendered when the request passes. */
  children: ReactNode
  /** Element rendered while the verify request is in flight. */
  loadingFallback?: ReactNode
  /** Element rendered when verification is denied. */
  deniedFallback?: ReactNode | ((info: { reason?: string; response: VerifyResponse | null }) => ReactNode)
  /** Fires when verification succeeds. */
  onPass?: (token: string | undefined, response: VerifyResponse) => void
  /** Fires when verification fails. */
  onDeny?: (reason: string | undefined, response: VerifyResponse | null) => void
  /** If true, the gate runs the verify call again whenever the nonce changes. */
  reverifyOnNonceChange?: boolean
}

export function OpenBouncerGate(props: OpenBouncerGateProps) {
  const {
    nonce,
    attest,
    provider,
    endpoint,
    challengeAgeMs,
    children,
    loadingFallback,
    deniedFallback,
    onPass,
    onDeny,
    reverifyOnNonceChange = false,
  } = props

  const [verdict, setVerdict] = useState<Verdict>('idle')
  const [response, setResponse] = useState<VerifyResponse | null>(null)
  const ran = useRef(false)

  useEffect(() => {
    if (!reverifyOnNonceChange && ran.current) return
    ran.current = true
    const ac = new AbortController()
    let cancelled = false

    setVerdict('verifying')
    setResponse(null)

    verify({ nonce, attest, provider, endpoint, challengeAgeMs, signal: ac.signal })
      .then((data) => {
        if (cancelled) return
        setResponse(data)
        if (data.ok) {
          setVerdict('pass')
          onPass?.(data.token, data)
        } else {
          setVerdict('deny')
          onDeny?.(data.reason, data)
        }
      })
      .catch((err) => {
        if (cancelled) return
        if ((err as Error)?.name === 'AbortError') return
        setVerdict('error')
        onDeny?.(`network-error: ${String(err)}`, null)
      })

    return () => {
      cancelled = true
      ac.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reverifyOnNonceChange ? nonce : 'once'])

  if (verdict === 'pass') return <>{children}</>

  if (verdict === 'verifying' || verdict === 'idle') {
    return loadingFallback ? <>{loadingFallback}</> : <DefaultLoading />
  }

  // deny or error
  if (typeof deniedFallback === 'function') {
    return <>{deniedFallback({ reason: response?.reason, response })}</>
  }
  if (deniedFallback !== undefined) {
    return <>{deniedFallback}</>
  }
  return <DefaultDenied response={response} />
}

// ─── Default inline-styled fallbacks ─────────────────────────────────────
// Tiny, dependency-free, intentionally unbranded so consumers replace them.

function DefaultLoading() {
  return createElement(
    'div',
    {
      role: 'status',
      'aria-live': 'polite',
      style: {
        display: 'grid',
        placeItems: 'center',
        minHeight: '100svh',
        background: '#fafaf7',
        color: '#6c6a65',
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: 11,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
      },
    },
    'verifying agent…',
  )
}

function DefaultDenied({ response }: { response: VerifyResponse | null }) {
  return createElement(
    'div',
    {
      role: 'alert',
      style: {
        display: 'grid',
        placeItems: 'center',
        minHeight: '100svh',
        padding: '0 24px',
        textAlign: 'center',
        background: '#fafaf7',
        color: '#0e0e0c',
        fontFamily:
          '"Inter Tight", ui-sans-serif, system-ui, -apple-system, sans-serif',
      },
    },
    createElement(
      'div',
      { style: { maxWidth: '44ch' } },
      createElement(
        'div',
        {
          style: {
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#c8331f',
          },
        },
        'denied',
      ),
      createElement(
        'h2',
        {
          style: {
            margin: '12px 0 12px',
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: '-0.035em',
            lineHeight: 1.0,
          },
        },
        'This area is for verified agents.',
      ),
      createElement(
        'p',
        {
          style: {
            margin: 0,
            fontSize: 14.5,
            lineHeight: 1.55,
            color: '#2a2924',
          },
        },
        'OpenBouncer could not confirm that this request came from a recognized agent runtime. ',
        response?.reason
          ? createElement(
              'span',
              null,
              'Reason: ',
              createElement(
                'code',
                {
                  style: {
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  },
                },
                response.reason,
              ),
              '.',
            )
          : null,
      ),
    ),
  )
}
