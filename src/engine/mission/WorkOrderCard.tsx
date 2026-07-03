import { hashSeed, seededBetween } from '../../design/seed'
import { PaperCard } from '../../design/PaperCard'
import { RoughBox } from '../../design/RoughBox'
import type { MissionDef } from './types'
import type { MissionTheme } from '../../content/phase-themes'

/** A rubber-stamp label (job type, SHIPPED ✓) — rough border, tilted, inky. */
export function Stamp({
  id,
  text,
  color = 'var(--color-marker-coral)',
  big = false,
}: {
  id: string
  text: string
  color?: string
  big?: boolean
}) {
  const rotation = seededBetween(hashSeed(id), -4, -1.5)
  return (
    <span className="inline-block" style={{ rotate: `${rotation}deg` }}>
      <RoughBox
        seed={hashSeed(id)}
        stroke={color}
        className={big ? 'px-5 py-1.5' : 'px-3 py-0.5'}
      >
        <span
          className={`font-hand font-bold tracking-wide uppercase ${big ? 'text-3xl' : 'text-lg'}`}
          style={{ color }}
        >
          {text}
        </span>
      </RoughBox>
    </span>
  )
}

/** The customer's order, pinned at the top of a mission: complaint + job-type stamp. */
export function WorkOrderCard({ def, theme }: { def: MissionDef; theme: MissionTheme }) {
  return (
    <PaperCard id={`workorder-${def.id}`} tilt={false} className="max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-ink-soft font-hand text-xl">
            {theme.workplace} · {theme.labels.workOrder} #{def.id}
          </p>
          <p className="text-ink-soft mt-1 text-sm">from: {def.workOrder.customer}</p>
        </div>
        <Stamp id={`stamp-${def.id}`} text={theme.jobTypeLabels[def.jobType]} />
      </div>
      <blockquote className="font-hand border-ink-soft/40 mt-4 border-l-2 pl-4 text-2xl leading-snug">
        {def.workOrder.request}
      </blockquote>
    </PaperCard>
  )
}
