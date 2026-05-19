/**
 * @openbouncer/gate — reverse-captcha gate for the agentic web.
 *
 * Wraps content that should only render for verified AI agents. Pure React,
 * zero CSS dependency, ESM + CJS + .d.ts. Targets React 18+.
 *
 *   import { OpenBouncerGate } from '@openbouncer/gate'
 *
 *   <OpenBouncerGate nonce={pageNonce} provider="anthropic">
 *     <YourAgentOnlyContent />
 *   </OpenBouncerGate>
 *
 * For non-React runtimes (Bun, Node, Workers, CLIs), import `verify`
 * directly — it is a pure async function returning the verify response.
 */

export { OpenBouncerGate } from './OpenBouncerGate'
export type {
  OpenBouncerGateProps,
  Verdict,
} from './OpenBouncerGate'

export { verify } from './verify'
export type { Provider, VerifyInput, VerifyResponse } from './verify'
