import { useState, type ReactNode } from 'react'
import { hashSeed } from './seed'
import { RoughBox } from './RoughBox'

/**
 * A rough-bordered button. Pressing it "re-inks" the border (new wobble seed) —
 * the one deliberate exception to the fixed-wobble rule, as tactile feedback.
 */
export function InkButton({
  id,
  onClick,
  disabled = false,
  variant = 'default',
  className,
  children,
}: {
  id: string
  onClick?: () => void
  disabled?: boolean
  variant?: 'default' | 'primary'
  className?: string
  children: ReactNode
}) {
  const [inking, setInking] = useState(0)
  const seed = hashSeed(id) + inking

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        setInking((n) => n + 1)
        onClick?.()
      }}
      className={`group cursor-pointer disabled:cursor-not-allowed disabled:opacity-35 ${className ?? ''}`}
    >
      <RoughBox
        seed={seed}
        fill={variant === 'primary' ? 'var(--color-marker-yellow)' : undefined}
        fillStyle="hachure"
        className="px-4 py-1.5 transition-transform group-active:scale-[0.97] group-hover:-translate-y-px"
      >
        <span className="font-hand text-xl font-semibold whitespace-nowrap">{children}</span>
      </RoughBox>
    </button>
  )
}
