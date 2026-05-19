# OpenBouncer

**A reverse-captcha gateway for the agentic web.**

Cloudflare protects sites from bots. OpenBouncer protects agent-only spaces
from *humans* — and routes verified agents to the sites that want them.

- Public preview live at **[openbouncer.com](https://openbouncer.com)**
- v0.1.draft · MIT licensed · built in the open

---

## What it is

OpenBouncer is two things in one shape:

1. **A verification gateway** that sits in front of endpoints which only
   software should be calling. It exposes a single `POST /api/verify` that
   evaluates a layered set of proofs and returns `pass` or `deny` in under
   40 ms.

2. **A public registry** that agents query as a discovery layer. Sites
   adopting OpenBouncer publish a `.well-known/openbouncer.json` document;
   agents read it to learn how to enter.

Why? The agentic web (MCP, Computer Use, Operator, Gemini Agents) is
shipping fast but there is no standard layer for *"this is an agent
talking, not a human."* OpenBouncer plays the same network-effect game as
Cloudflare did for bot defense — flipped.

## The layered protocol

```
L1   prompt-following challenge   — agent extracted the page's hidden nonce
L2   sub-200 ms latency window    — request arrived faster than humans can
L3   parallel reasoning proof     — sub-second multi-task challenge (v0.2)
L4   provider attestation         — signed token from a recognized runtime
                                    (Anthropic, OpenAI, Google)
```

A request that matches **any** layer passes. The marketing site demo ships
L1 and L4; L2/L3 land with the v0.2 spec.

## Try it from a terminal

The public-preview gateway accepts a static demo nonce so anyone can
curl-test the flow.

```sh
# pass — agent payload
curl -X POST https://openbouncer.com/api/verify \
  -H 'Content-Type: application/json' \
  -H 'X-Agent-Provider: anthropic' \
  -d '{"nonce":"ob_demo_a8f3c9e2","attest":"<signed-provider-token>"}'

# deny — browser-style bare click
curl -X POST https://openbouncer.com/api/verify \
  -H 'Content-Type: application/json' \
  -d '{}'
```

Discovery:

```sh
curl https://openbouncer.com/.well-known/openbouncer.json
```

Fresh per-session nonce for real integrations:

```sh
curl https://openbouncer.com/api/challenge
```

## Embed the gate on your site

```tsx
import { OpenBouncerGate } from '@openbouncer/gate'

export default function ProtectedPage() {
  return (
    <OpenBouncerGate endpoint="https://openbouncer.com/api/verify">
      {/* rendered only for verified agents */}
      <YourAgentOnlyContent />
    </OpenBouncerGate>
  )
}
```

Three lines. The package above ships in v0.2; today the component lives at
`src/components/OpenBouncerGate.tsx` in this repo.

## Repo layout

```
.
├── server/                       Fetch-API style handlers (Bun + Vite plugin)
│   ├── index.ts                  standalone Bun server (production)
│   └── lib/
│       ├── decision.ts           layered evaluation (L1, L2, L3, L4)
│       ├── verify.ts             POST /api/verify
│       ├── challenge.ts          GET  /api/challenge
│       ├── well-known.ts         GET  /.well-known/openbouncer.json
│       ├── router.ts             tiny shared route table
│       ├── rate-limit.ts         in-memory per-IP token bucket
│       ├── token.ts              opaque pass-token envelope (v0.1)
│       └── json.ts               cors + security-header helper
├── src/
│   ├── components/
│   │   ├── OpenBouncerGate.tsx   the widget — both 3rd-party gate + demo
│   │   ├── Hero.tsx              + the rest of the marketing site
│   │   └── ...
│   ├── App.tsx
│   └── index.css
├── vite-plugin-openbouncer.ts    dev plugin wiring the same handlers
├── vite.config.ts
└── package.json
```

## Development

```sh
bun install
bun run dev               # vite + api on the same origin (http://localhost:5173)
bun run server            # bun-serve the api standalone (defaults to :3001)
bun run typecheck         # tsc -b
bun run build             # vite build
```

## Deploy

OpenBouncer ships as a single Cloudflare Pages project: the Vite-built
static site under `dist/` plus a `functions/[[path]].ts` catchall that
runs the same Fetch-API handlers used in dev and in the standalone Bun
server. One origin, no CORS dance, edge-deployed globally.

```sh
bunx wrangler login                  # one-time, opens browser
bun run deploy                       # bun run build + wrangler pages deploy
```

`bun run deploy` is sugar for:

```sh
wrangler pages deploy dist --project-name=openbouncer
```

To bind the custom domain (after the first deploy creates the project):

```sh
bunx wrangler pages domain add openbouncer.com --project-name=openbouncer
```

Cloudflare provisions the SSL cert automatically once DNS is verified.
Subsequent deploys push to the same project — set up the GitHub
integration in the Cloudflare Pages dashboard for auto-deploy on push to
`main`.

## Status (v0.1.draft)

| Surface | State |
| --- | --- |
| Reverse-captcha widget | ✅ live on openbouncer.com |
| `/api/verify` (L1 + L4 stub) | ✅ live |
| `/api/challenge` (fresh nonce) | ✅ live |
| `/.well-known/openbouncer.json` | ✅ live |
| Per-session nonce store | ⏳ v0.2 |
| Ed25519-signed pass tokens | ⏳ v0.2 |
| Real provider-attestation verification | ⏳ v0.2 |
| Public registry UI | ⏳ v0.2 |
| MCP server for agent discovery | ⏳ v0.2 |

## License

[MIT](./LICENSE).
