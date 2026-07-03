import type { ReactNode } from 'react'
import { hashSeed, seededBetween } from './seed'

const COLORS = {
  yellow: 'var(--color-sticky)',
  pink: 'var(--color-sticky-pink)',
} as const

/** A sticky note with a folded bottom-right corner and a seeded tilt. */
export function StickyNote({
  id,
  color = 'yellow',
  className,
  children,
}: {
  id: string
  color?: keyof typeof COLORS
  className?: string
  children: ReactNode
}) {
  const rotation = seededBetween(hashSeed(id), -1.5, 1.5)
  const bg = COLORS[color]

  return (
    <div
      className={`relative inline-block px-4 py-3 shadow-[2px_4px_10px_rgba(43,41,37,0.15)] ${className ?? ''}`}
      style={{
        background: bg,
        rotate: `${rotation}deg`,
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)',
      }}
    >
      {children}
      {/* the folded corner */}
      <div
        aria-hidden
        className="absolute right-0 bottom-0 h-4 w-4"
        style={{
          background: `color-mix(in srgb, ${bg} 72%, var(--color-ink))`,
          clipPath: 'polygon(0 100%, 100% 0, 0 0)',
        }}
      />
    </div>
  )
}
