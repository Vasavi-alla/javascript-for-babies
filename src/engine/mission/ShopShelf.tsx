import { hashSeed } from '../../design/seed'
import { RoughBox } from '../../design/RoughBox'
import type { MissionTheme } from '../../content/phase-themes'

export interface ShelfSlot {
  lessonId: string
  /** Present once the lesson exists as a mission. */
  emoji?: string
  label?: string
  done: boolean
}

/**
 * The phase page's cumulative trophy strip: one slot per work order. Shipped
 * machines sit inked on the shelf; the rest wait as pencil outlines.
 */
export function ShopShelf({ slots, theme }: { slots: ShelfSlot[]; theme: MissionTheme }) {
  const doneCount = slots.filter((s) => s.done).length

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        {slots.map((slot) =>
          slot.done ? (
            <RoughBox
              key={slot.lessonId}
              seed={hashSeed(`shelf-${slot.lessonId}`)}
              fill="var(--color-sticky)"
              fillStyle="solid"
              className="w-20 px-1 py-2 text-center"
            >
              <div className="text-2xl">{slot.emoji ?? '✓'}</div>
              <div className="font-mono mt-0.5 truncate text-[11px] font-semibold">
                {slot.label ?? slot.lessonId}
              </div>
            </RoughBox>
          ) : (
            <div
              key={slot.lessonId}
              className="border-ink-soft/40 text-ink-soft w-20 rounded-sm border border-dashed px-1 py-2 text-center opacity-70"
            >
              <div className="text-2xl">·</div>
              <div className="font-hand mt-0.5 text-sm">{slot.lessonId}</div>
            </div>
          ),
        )}
      </div>
      {/* the shelf board they all stand on */}
      <div
        aria-hidden
        className="bg-ink-soft/60 mt-1 h-1 max-w-3xl rounded-full"
        style={{ rotate: '-0.4deg' }}
      />
      <p className="text-ink-soft font-hand mt-2 text-xl">
        {theme.labels.shelfCount.replace('{done}', String(doneCount)).replace('{total}', String(slots.length))}
      </p>
    </div>
  )
}
