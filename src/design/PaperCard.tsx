import type { CSSProperties, ReactNode } from 'react'
import { hashSeed, seededBetween } from './seed'
import { RoughBox } from './RoughBox'

/**
 * A raised paper panel with a rough ink border and a faint seeded tilt.
 * `id` drives both the wobble and the tilt so each card is unique but stable.
 */
export function PaperCard({
  id,
  className,
  style,
  tilt = true,
  children,
}: {
  id: string
  className?: string
  style?: CSSProperties
  tilt?: boolean
  children: ReactNode
}) {
  const seed = hashSeed(id)
  const rotation = tilt ? seededBetween(seed, -0.4, 0.4) : 0

  return (
    <RoughBox
      seed={seed}
      className={`bg-paper-raised shadow-[2px_3px_8px_rgba(43,41,37,0.08)] ${className ?? ''}`}
      style={{ rotate: `${rotation}deg`, ...style }}
    >
      <div className="p-5">{children}</div>
    </RoughBox>
  )
}
