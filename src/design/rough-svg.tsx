import { useMemo } from 'react'
import rough from 'roughjs'
import type { Drawable, Options } from 'roughjs/bin/core'

/**
 * SVG-native rough.js primitives. Every shape takes a `seed` so its wobble is
 * stable across renders (design rule: wobble never changes unless we mean it to).
 * These render inside an existing <svg>; for HTML layout boxes use RoughBox.
 */

const gen = rough.generator()

export const INK = 'var(--color-ink)'

export interface RoughShapeStyle {
  stroke?: string
  strokeWidth?: number
  fill?: string
  fillStyle?: Options['fillStyle']
  roughness?: number
  bowing?: number
  /** rough.js double-draws strokes by default; true = one clean sketchy pass */
  disableMultiStroke?: boolean
  seed: number
}

function toOptions(style: RoughShapeStyle): Options {
  return {
    stroke: style.stroke ?? INK,
    strokeWidth: style.strokeWidth ?? 2,
    fill: style.fill,
    fillStyle: style.fillStyle ?? 'hachure',
    fillWeight: 1.5,
    hachureGap: 6,
    roughness: style.roughness ?? 1.2,
    bowing: style.bowing ?? 1,
    disableMultiStroke: style.disableMultiStroke ?? false,
    seed: style.seed,
  }
}

/** Closed sketchy polygon (pine trees, flags, signs). */
export function RoughPolygon(props: { points: Point[] } & RoughShapeStyle) {
  const { points } = props
  const drawable = useMemo(
    () => gen.polygon(points.map((p) => [p.x, p.y] as [number, number]), toOptions(props)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(points), props.stroke, props.strokeWidth, props.fill, props.fillStyle, props.roughness, props.seed],
  )
  return <DrawablePaths drawable={drawable} />
}

export function DrawablePaths({ drawable }: { drawable: Drawable }) {
  const paths = useMemo(() => gen.toPaths(drawable), [drawable])
  return (
    <>
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          fill={p.fill ?? 'none'}
          strokeLinecap="round"
        />
      ))}
    </>
  )
}

export function RoughRect(
  props: { x: number; y: number; width: number; height: number } & RoughShapeStyle,
) {
  const { x, y, width, height } = props
  const drawable = useMemo(
    () => gen.rectangle(x, y, width, height, toOptions(props)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [x, y, width, height, props.stroke, props.strokeWidth, props.fill, props.fillStyle, props.roughness, props.bowing, props.seed],
  )
  return <DrawablePaths drawable={drawable} />
}

export function RoughEllipse(
  props: { cx: number; cy: number; width: number; height: number } & RoughShapeStyle,
) {
  const { cx, cy, width, height } = props
  const drawable = useMemo(
    () => gen.ellipse(cx, cy, width, height, toOptions(props)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cx, cy, width, height, props.stroke, props.strokeWidth, props.fill, props.fillStyle, props.roughness, props.bowing, props.seed],
  )
  return <DrawablePaths drawable={drawable} />
}

export function RoughLine(
  props: { x1: number; y1: number; x2: number; y2: number } & RoughShapeStyle,
) {
  const { x1, y1, x2, y2 } = props
  const drawable = useMemo(
    () => gen.line(x1, y1, x2, y2, toOptions(props)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [x1, y1, x2, y2, props.stroke, props.strokeWidth, props.roughness, props.bowing, props.seed],
  )
  return <DrawablePaths drawable={drawable} />
}

export interface Point {
  x: number
  y: number
}

/**
 * A sketchy freehand curve through a set of points — the Excalidraw stroke.
 * Optional dash pattern turns it into a pencil-dotted route.
 */
export function RoughCurve(
  props: { points: Point[]; strokeDasharray?: string; opacity?: number } & RoughShapeStyle,
) {
  const { points, strokeDasharray, opacity } = props
  const paths = useMemo(() => {
    if (points.length < 2) return []
    const drawable = gen.curve(
      points.map((p) => [p.x, p.y] as [number, number]),
      toOptions(props),
    )
    return gen.toPaths(drawable)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(points), props.stroke, props.strokeWidth, props.roughness, props.bowing, props.seed])

  return (
    <g opacity={opacity}>
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
        />
      ))}
    </g>
  )
}

/** Curved hand-drawn arrow. `curve` bends the midpoint sideways (0 = straight). */
export function HandArrow({
  from,
  to,
  curve = 0.2,
  seed,
  stroke = 'var(--color-pencil-blue)',
  strokeWidth = 2.5,
  headLength = 12,
}: {
  from: Point
  to: Point
  curve?: number
  seed: number
  stroke?: string
  strokeWidth?: number
  headLength?: number
}) {
  const { body, head } = useMemo(() => {
    const mid = {
      x: (from.x + to.x) / 2 + (to.y - from.y) * curve,
      y: (from.y + to.y) / 2 + (from.x - to.x) * curve,
    }
    const opts: Options = { stroke, strokeWidth, roughness: 1, bowing: 1, seed }
    const body = gen.curve(
      [
        [from.x, from.y],
        [mid.x, mid.y],
        [to.x, to.y],
      ],
      opts,
    )
    const angle = Math.atan2(to.y - mid.y, to.x - mid.x)
    const wing = (offset: number) =>
      gen.line(
        to.x,
        to.y,
        to.x - headLength * Math.cos(angle + offset),
        to.y - headLength * Math.sin(angle + offset),
        { ...opts, seed: seed + 1 },
      )
    return { body, head: [wing(0.5), wing(-0.5)] }
  }, [from.x, from.y, to.x, to.y, curve, seed, stroke, strokeWidth, headLength])

  return (
    <>
      <DrawablePaths drawable={body} />
      {head.map((h, i) => (
        <DrawablePaths key={i} drawable={h} />
      ))}
    </>
  )
}
