/**
 * Wraps a string into <tspan> lines inside an existing SVG <text> element —
 * SVG text never wraps on its own, so long notes/badges silently clip at the
 * viewBox edge. Drop-in: replace the text element's `{string}` child with
 * `<WrapTspans text={string} x={sameXAsParent} maxPx={usableWidth} fontSize={parentFontSize} />`.
 *
 * Short strings render as a single tspan (pixel-identical to before); long
 * ones wrap greedily and the block stays vertically centered on the parent's y.
 * Width is estimated from average character width (Caveat ≈ 0.46 × fontSize,
 * JetBrains Mono ≈ 0.62) — deliberately a little generous, so lines break
 * early rather than ever overflow.
 */
interface WrapTspansProps {
  text: string
  /** same x as the parent <text> — each wrapped line resets to it */
  x: number
  /** usable line width, in viewBox units */
  maxPx: number
  /** the parent's fontSize — used to estimate character width */
  fontSize: number
  /** set when the parent uses the mono code font */
  code?: boolean
  /** line height in px; defaults to fontSize × 1.15 */
  lineHeight?: number
}

/** Greedy word-wrap by estimated character width. Exported for components that must size a container to the text (see SvgBadge). */
export function wrapLines(text: string, maxPx: number, fontSize: number, code?: boolean): string[] {
  const perChar = fontSize * (code ? 0.62 : 0.46)
  const maxChars = Math.max(10, Math.floor(maxPx / perChar))

  const lines: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    const candidate = line ? line + ' ' + word : word
    if (candidate.length > maxChars && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}

export function WrapTspans({ text, x, maxPx, fontSize, code, lineHeight }: WrapTspansProps) {
  const lines = wrapLines(text, maxPx, fontSize, code)
  const lh = lineHeight ?? Math.round(fontSize * 1.15)
  return (
    <>
      {lines.map((l, i) => (
        <tspan key={i} x={x} dy={i === 0 ? (-(lines.length - 1) * lh) / 2 : lh}>
          {l}
        </tspan>
      ))}
    </>
  )
}
