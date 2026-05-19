import { useEffect, useState } from 'react'

/**
 * A real-looking terminal block with two side-by-side requests:
 *  - human view (denied)
 *  - agent view (passes the handshake)
 * Mono, dark surface, syntax-colored. Cursor blinks on the last line.
 *
 * The point: this is what the actual /api/verify call looks like.
 * It's the live demo of the product, shown as it would appear in a dev's terminal.
 */
export function CodeBlock() {
  const [tab, setTab] = useState<'agent' | 'human'>('agent')
  const [cursorOn, setCursorOn] = useState(true)

  useEffect(() => {
    const t = setInterval(() => setCursorOn((v) => !v), 580)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="overflow-hidden border border-rule-strong">
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-night-2 bg-night px-3 py-2 font-mono text-[11px] text-night-soft/60">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#3a3934]" />
          <span className="h-2 w-2 rounded-full bg-[#3a3934]" />
          <span className="h-2 w-2 rounded-full bg-[#3a3934]" />
          <span className="ml-3 text-[10px] uppercase tracking-[0.18em]">
            ~/openbouncer · demo
          </span>
        </div>
        <div className="flex">
          <Tab on={tab === 'agent'} onClick={() => setTab('agent')}>
            agent.sh
          </Tab>
          <Tab on={tab === 'human'} onClick={() => setTab('human')}>
            human.sh
          </Tab>
        </div>
      </div>

      <div className="code-surface px-4 py-4 text-[13px] leading-[1.6] sm:text-[13.5px]">
        {tab === 'agent' ? <AgentLines cursorOn={cursorOn} /> : <HumanLines cursorOn={cursorOn} />}
      </div>
    </div>
  )
}

function Tab({
  on,
  onClick,
  children,
}: {
  on: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`border-l border-night-2 px-3 py-1 font-mono text-[11px] transition-colors ${
        on
          ? 'bg-night-2 text-night-soft'
          : 'text-night-soft/50 hover:bg-night-2 hover:text-night-soft'
      }`}
    >
      {children}
    </button>
  )
}

function Line({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div>
      <span className="ln">{n}</span>
      <span>{children}</span>
    </div>
  )
}

function AgentLines({ cursorOn }: { cursorOn: boolean }) {
  return (
    <>
      <Line n={1}>
        <span className="cmt"># An agent solves the OpenBouncer challenge</span>
      </Line>
      <Line n={2}>
        <span className="cmd">curl</span>{' '}
        <span className="key">-X</span> POST <span className="url">https://openbouncer.com/api/verify</span> \
      </Line>
      <Line n={3}>
        &nbsp;&nbsp;<span className="key">-H</span>{' '}
        <span className="str">"Content-Type: application/json"</span> \
      </Line>
      <Line n={4}>
        &nbsp;&nbsp;<span className="key">-H</span>{' '}
        <span className="str">"X-Agent-Provider: anthropic"</span> \
      </Line>
      <Line n={5}>
        &nbsp;&nbsp;<span className="key">-d</span>{' '}
        <span className="str">
          '{'{'}"nonce":"ob_demo_a8f3c9e2","attest":"&lt;signed&gt;"{'}'}'
        </span>
      </Line>
      <Line n={6}>&nbsp;</Line>
      <Line n={7}>
        <span className="cmt">&lt; HTTP/2 200</span>
      </Line>
      <Line n={8}>
        <span className="cmt">&lt; ob-decision: </span>
        <span className="ok">pass</span>
      </Line>
      <Line n={9}>
        <span className="cmt">&lt; ob-latency-ms: </span>
        <span className="ok">31</span>
      </Line>
      <Line n={10}>
        {'{'}"agent":"claude-opus-4-7","ok":<span className="ok">true</span>,"door":"open"{'}'}
      </Line>
      <Line n={11}>&nbsp;</Line>
      <Line n={12}>
        <span className="cmt">$</span>{' '}
        <span className={cursorOn ? 'opacity-100' : 'opacity-0'}>▍</span>
      </Line>
    </>
  )
}

function HumanLines({ cursorOn }: { cursorOn: boolean }) {
  return (
    <>
      <Line n={1}>
        <span className="cmt"># A human in a browser hits the same endpoint</span>
      </Line>
      <Line n={2}>
        <span className="cmd">curl</span>{' '}
        <span className="key">-X</span> POST <span className="url">https://openbouncer.com/api/verify</span> \
      </Line>
      <Line n={3}>
        &nbsp;&nbsp;<span className="key">-H</span>{' '}
        <span className="str">"User-Agent: Mozilla/5.0"</span> \
      </Line>
      <Line n={4}>
        &nbsp;&nbsp;<span className="key">-d</span>{' '}
        <span className="str">'{'{'}"nonce":"???"{'}'}'</span>
      </Line>
      <Line n={5}>&nbsp;</Line>
      <Line n={6}>
        <span className="cmt">&lt; HTTP/2 403</span>
      </Line>
      <Line n={7}>
        <span className="cmt">&lt; ob-decision: </span>
        <span className="stamp">deny</span>
      </Line>
      <Line n={8}>
        <span className="cmt">&lt; ob-reason: </span>
        <span className="stamp">layer-1.instruction-not-followed</span>
      </Line>
      <Line n={9}>
        {'{'}"ok":<span className="stamp">false</span>,"door":"closed","retry":<span className="stamp">false</span>{'}'}
      </Line>
      <Line n={10}>&nbsp;</Line>
      <Line n={11}>
        <span className="cmt">$</span>{' '}
        <span className={cursorOn ? 'opacity-100' : 'opacity-0'}>▍</span>
      </Line>
    </>
  )
}
