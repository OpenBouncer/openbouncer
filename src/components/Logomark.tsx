/**
 * Inline SVG version of the OpenBouncer ring mark.
 * Four quadrants of a ring split by a horizontal door-gap:
 *   ┌─────────┬─────────┐
 *   │ hstrip  │ dstrip  │   top: horizontal | diagonal stripes
 *   ├─── door gap ──────┤
 *   │ hatch   │  solid  │   bottom: cross-hatch | solid
 *   └─────────┴─────────┘
 * Renders crisp at favicon-size and at hero-size from a single source.
 */
export function Logomark({
  size = 20,
  className = '',
}: {
  size?: number
  className?: string
}) {
  const id = 'lm-' + Math.random().toString(36).slice(2, 8)
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="OpenBouncer"
      className={className}
    >
      <defs>
        <pattern
          id={`${id}-h`}
          width="3"
          height="3"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="1" x2="3" y2="1" stroke="currentColor" strokeWidth="1.4" />
        </pattern>
        <pattern
          id={`${id}-d`}
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="4" stroke="currentColor" strokeWidth="1.4" />
        </pattern>
        <pattern
          id={`${id}-x`}
          width="3.4"
          height="3.4"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="3.4" stroke="currentColor" strokeWidth="0.9" />
          <line x1="0" y1="0" x2="3.4" y2="0" stroke="currentColor" strokeWidth="0.9" />
        </pattern>
        <mask id={`${id}-ring`}>
          <rect width="100" height="100" fill="black" />
          <circle cx="50" cy="50" r="46" fill="white" />
          <circle cx="50" cy="50" r="28" fill="black" />
          {/* door gap */}
          <rect x="0" y="45" width="100" height="10" fill="black" />
          {/* central vertical seam between quadrants */}
          <rect x="49.2" y="0" width="1.6" height="100" fill="black" />
        </mask>
      </defs>

      <g mask={`url(#${id}-ring)`}>
        {/* top-left: horizontal stripes */}
        <rect x="0" y="0" width="50" height="50" fill={`url(#${id}-h)`} />
        {/* top-right: diagonal stripes */}
        <rect x="50" y="0" width="50" height="50" fill={`url(#${id}-d)`} />
        {/* bottom-left: cross hatch */}
        <rect x="0" y="50" width="50" height="50" fill={`url(#${id}-x)`} />
        {/* bottom-right: solid */}
        <rect x="50" y="50" width="50" height="50" fill="currentColor" />
      </g>
    </svg>
  )
}
