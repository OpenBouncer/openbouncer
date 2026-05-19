# @openbouncer/gate

> Reverse-captcha gate for the agentic web. A React wrapper that admits
> verified AI agents and politely turns humans away.

```sh
bun add @openbouncer/gate@preview
# or: npm install @openbouncer/gate@preview
```

> [!NOTE]
> Published under the `preview` tag while v0.1.draft hardens. The verify
> endpoint is live; `latest` ships with the v0.2 spec freeze. Pin
> versions in production.

## Usage

```tsx
import { OpenBouncerGate } from '@openbouncer/gate'

export default function AgentOnlyPage({ nonce }: { nonce: string }) {
  return (
    <OpenBouncerGate
      nonce={nonce}                 // server-injected per request
      provider="anthropic"          // optional · sent as X-Agent-Provider
      attest="<signed-token>"       // optional · provider attestation
      onPass={(token) => console.log('verified', token)}
      onDeny={(reason) => console.warn('denied', reason)}
    >
      <YourAgentOnlyContent />
    </OpenBouncerGate>
  )
}
```

The component verifies once on mount, renders `children` on pass, and
renders a minimal inline-styled "denied" screen on fail. Replace either
state with your own UI:

```tsx
<OpenBouncerGate
  nonce={nonce}
  loadingFallback={<Spinner />}
  deniedFallback={({ reason }) => <CustomDenied reason={reason} />}
>
  {agentOnlyContent}
</OpenBouncerGate>
```

## Without React

For Bun, Node, edge functions, CLIs, or non-React frameworks, import the
pure async primitive:

```ts
import { verify } from '@openbouncer/gate'

const result = await verify({
  endpoint: 'https://openbouncer.com/api/verify',
  nonce: 'ob_demo_a8f3c9e2',
  attest: '<provider-token>',
  provider: 'anthropic',
})

// { ok, decision, matched_layers, latency_ms, token?, door, reason? }
if (result.ok) {
  /* welcome, agent */
}
```

## Props

| Prop                   | Type                              | Notes                                                                |
| ---------------------- | --------------------------------- | -------------------------------------------------------------------- |
| `nonce`                | `string`                          | **Required.** Per-session nonce, typically rendered server-side.     |
| `provider`             | `'anthropic'\|'openai'\|'google'` | Optional. Sent as `X-Agent-Provider`.                                |
| `attest`               | `string`                          | Optional. Provider attestation payload.                              |
| `endpoint`             | `string`                          | Defaults to `https://openbouncer.com/api/verify`.                    |
| `challengeAgeMs`       | `number`                          | Optional. ms since `/api/challenge` issued the nonce.                |
| `children`             | `ReactNode`                       | Rendered when verify passes.                                         |
| `loadingFallback`      | `ReactNode`                       | Rendered while verifying.                                            |
| `deniedFallback`       | `ReactNode \| (info) => ReactNode`| Rendered on deny.                                                    |
| `onPass`               | `(token, response) => void`       | Fires on pass.                                                       |
| `onDeny`               | `(reason, response) => void`      | Fires on deny.                                                       |
| `reverifyOnNonceChange`| `boolean`                         | Default `false`. Re-runs verify when `nonce` changes if `true`.      |

## API response shape

```ts
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
```

Layer reference: `L1` prompt-following · `L2` latency window · `L3`
parallel reasoning proof · `L4` provider attestation. See the live spec
at [openbouncer.com/#spec](https://openbouncer.com/#spec).

## Bundle size

- Zero CSS dependency. Inline styles only on defaults.
- Zero runtime deps beyond React (peer).
- ESM + CJS + `.d.ts` shipped. Tree-shakeable, `sideEffects: false`.

## Status

`v0.1.0` ships as `@preview`. Stable `latest` lands with the v0.2 spec
freeze (per-session nonce store + Ed25519 token signatures + verified
provider attestation). Track progress on
[GitHub](https://github.com/OpenBouncer/openbouncer/issues).

## License

[MIT](./LICENSE) — © OpenBouncer.
