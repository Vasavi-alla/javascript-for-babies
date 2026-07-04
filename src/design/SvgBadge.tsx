import { RoughRect } from './rough-svg'
import { wrapLines } from './WrapTspans'

/**
 * The stepper "badge": a small outlined annotation box whose HEIGHT sizes
 * itself to the wrapped text — fixed-height boxes spill once a badge wraps
 * to two lines. Anchored by its CENTER so growth spreads evenly up and down
 * instead of crashing into whatever sits below.
 */
interface SvgBadgeProps {
  text: string
  /** horizontal center */
  cx: number
  /** vertical center — pass oldBoxY + oldBoxHeight / 2 when replacing a fixed box */
  cy: number
  width: number
  fontSize: number
  seed: number
  /** a CSS var reference, e.g. "var(--color-pencil-blue)" — used for stroke, text, and the 10% fill */
  color: string
}

export function SvgBadge({ text, cx, cy, width, fontSize, seed, color }: SvgBadgeProps) {
  const lines = wrapLines(text, width - 22, fontSize)
  const lh = Math.round(fontSize * 1.15)
  const boxH = lines.length * lh + 10
  return (
    <>
      <RoughRect
        x={cx - width / 2}
        y={cy - boxH / 2}
        width={width}
        height={boxH}
        seed={seed}
        strokeWidth={1.7}
        stroke={color}
        fill={`color-mix(in srgb, ${color} 10%, transparent)`}
        fillStyle="solid"
      />
      <text textAnchor="middle" fontFamily="var(--font-hand)" fontSize={fontSize} fontWeight={700} fill={color}>
        {lines.map((l, i) => (
          <tspan key={i} x={cx} y={cy + (i - (lines.length - 1) / 2) * lh + fontSize * 0.35}>
            {l}
          </tspan>
        ))}
      </text>
    </>
  )
}
