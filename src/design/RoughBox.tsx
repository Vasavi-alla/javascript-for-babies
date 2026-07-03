import { useMemo, type CSSProperties, type ReactNode } from 'react'
import rough from 'roughjs'
import type { Options } from 'roughjs/bin/core'
import { useMeasure } from './useMeasure'
import { DrawablePaths, INK } from './rough-svg'

const gen = rough.generator()

/**
 * An HTML container with a hand-drawn border that follows its measured size.
 * The base building block for PaperCard, InkButton, etc.
 */
export function RoughBox({
  seed,
  stroke = INK,
  strokeWidth = 2,
  fill,
  fillStyle = 'hachure',
  roughness = 1.2,
  className,
  style,
  children,
}: {
  seed: number
  stroke?: string
  strokeWidth?: number
  fill?: string
  fillStyle?: Options['fillStyle']
  roughness?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
}) {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>()

  const inset = strokeWidth + 1.5
  const drawable = useMemo(() => {
    if (width < inset * 2 || height < inset * 2) return null
    return gen.rectangle(inset, inset, width - inset * 2, height - inset * 2, {
      stroke,
      strokeWidth,
      fill,
      fillStyle,
      fillWeight: 1.5,
      hachureGap: 6,
      roughness,
      bowing: 1,
      seed,
    })
  }, [width, height, inset, stroke, strokeWidth, fill, fillStyle, roughness, seed])

  return (
    <div ref={ref} className={`relative ${className ?? ''}`} style={style}>
      {drawable && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          width={width}
          height={height}
        >
          <DrawablePaths drawable={drawable} />
        </svg>
      )}
      <div className="relative">{children}</div>
    </div>
  )
}
