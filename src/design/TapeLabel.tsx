import type { ReactNode } from 'react'
import { hashSeed, seededBetween } from './seed'

/** A washi-tape section header: translucent tape strip with handwritten text. */
export function TapeLabel({
  id,
  color = 'var(--color-marker-teal)',
  className,
  children,
}: {
  id: string
  color?: string
  className?: string
  children: ReactNode
}) {
  const rotation = seededBetween(hashSeed(id), -1.6, 1.6)

  return (
    <span
      className={`inline-block px-5 py-0.5 font-hand text-2xl font-semibold ${className ?? ''}`}
      style={{
        rotate: `${rotation}deg`,
        background: `color-mix(in srgb, ${color} 26%, transparent)`,
        boxShadow: '1px 2px 5px rgba(43,41,37,0.10)',
        // ragged tape ends
        clipPath:
          'polygon(1% 8%, 99% 0%, 100% 45%, 98.5% 95%, 1.5% 100%, 0% 52%)',
      }}
    >
      {children}
    </span>
  )
}
