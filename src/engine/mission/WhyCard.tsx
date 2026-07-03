import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { StickyNote } from '../../design/StickyNote'

/**
 * The feedback card that appears after the learner acts inside a challenge —
 * where the explanation lands in a do-first lesson. 'aha' = something just
 * (deliberately) went sideways and that's the lesson; 'win' = it worked,
 * here's why.
 */
export function WhyCard({
  id,
  tone,
  title,
  children,
}: {
  id: string
  tone: 'aha' | 'win'
  title?: string
  children: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ type: 'spring', damping: 16 }}
    >
      <StickyNote id={id} color={tone === 'aha' ? 'pink' : 'yellow'} className="max-w-xl">
        <p className="font-hand text-2xl leading-snug font-semibold">
          {title ?? (tone === 'aha' ? '💡 That right there is the lesson:' : '✓ It worked — here’s why:')}
        </p>
        <div className="mt-1 flex flex-col gap-2">{children}</div>
      </StickyNote>
    </motion.div>
  )
}
