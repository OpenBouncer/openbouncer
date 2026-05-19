/**
 * Engineered sequence diagram. SVG, monochrome with single stamp accent.
 * Reads as a real RFC/protocol diagram, not an illustration.
 *
 * Lanes:  AGENT  ──  SITE  ──  OPENBOUNCER  ──  REGISTRY
 * Steps:  1. discover  2. handshake  3. challenge  4. verify  5. decision
 */
export function SequenceDiagram() {
  return (
    <div className="border border-rule bg-page-2/40">
      {/* Header row */}
      <div className="grid grid-cols-4 border-b border-rule font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute">
        <Header>Agent</Header>
        <Header>Site</Header>
        <Header className="text-ink">OpenBouncer</Header>
        <Header>Registry</Header>
      </div>

      <div className="relative">
        <svg
          viewBox="0 0 800 320"
          preserveAspectRatio="xMidYMid meet"
          className="block w-full"
          role="img"
          aria-label="Sequence diagram: agent discovers a site, OpenBouncer verifies via registry, decision returned"
        >
          {/* Vertical lifelines */}
          {[100, 300, 500, 700].map((x) => (
            <line
              key={x}
              x1={x}
              y1={4}
              x2={x}
              y2={316}
              stroke="#c9c5b9"
              strokeWidth={1}
              strokeDasharray="2 4"
            />
          ))}

          {/* Lane dots at top */}
          {[100, 300, 500, 700].map((x) => (
            <circle key={x} cx={x} cy={4} r={3} fill="#0e0e0c" />
          ))}

          {/* Step 1: agent → site (discover) */}
          <Arrow x1={100} x2={300} y={48} label="01  discover  ·  GET /.well-known/openbouncer.json" />

          {/* Step 2: site → agent (challenge metadata) */}
          <Arrow
            x1={300}
            x2={100}
            y={92}
            label="02  challenge  ·  hidden instruction + nonce"
            dashed
          />

          {/* Step 3: agent → openbouncer (POST /verify) */}
          <Arrow
            x1={100}
            x2={500}
            y={140}
            label="03  POST /api/verify  ·  nonce + provider attestation"
            color="#c8331f"
          />

          {/* Step 4: openbouncer → registry (lookup) */}
          <Arrow
            x1={500}
            x2={700}
            y={184}
            label="04  lookup signer key  ·  registry.openbouncer.com"
          />

          {/* Step 5: registry → openbouncer (key) */}
          <Arrow x1={700} x2={500} y={216} dashed />

          {/* Step 6: openbouncer → agent (decision) */}
          <Arrow
            x1={500}
            x2={100}
            y={252}
            label="05  ob-decision: pass  ·  31ms"
            color="#0e0e0c"
            bold
          />

          {/* Step 7: agent → site (carrying token) */}
          <Arrow x1={100} x2={300} y={296} label="06  enter  ·  Authorization: Bearer ob_token" />
        </svg>
      </div>

      <div className="border-t border-rule px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute">
        protocol &nbsp;·&nbsp; v0.1.draft &nbsp;·&nbsp; layers L1–L4
      </div>
    </div>
  )
}

function Header({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`border-r border-rule px-5 py-3 last:border-r-0 ${className}`}>
      {children}
    </div>
  )
}

function Arrow({
  x1,
  x2,
  y,
  label,
  color = '#0e0e0c',
  dashed = false,
  bold = false,
}: {
  x1: number
  x2: number
  y: number
  label?: string
  color?: string
  dashed?: boolean
  bold?: boolean
}) {
  const goingRight = x2 > x1
  const headX = x2
  const headY = y
  const headPath = goingRight
    ? `M ${headX} ${headY} l -6 -4 l 0 8 z`
    : `M ${headX} ${headY} l 6 -4 l 0 8 z`

  return (
    <g>
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke={color}
        strokeWidth={bold ? 1.6 : 1.1}
        strokeDasharray={dashed ? '4 4' : undefined}
      />
      <path d={headPath} fill={color} />
      {label && (
        <text
          x={(x1 + x2) / 2}
          y={y - 6}
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize={10}
          fill="#0e0e0c"
          letterSpacing={0.6}
        >
          {label}
        </text>
      )}
    </g>
  )
}
