import { AnimatePresence, motion } from 'motion/react'
import { StickyNote } from './StickyNote'

/** Console output as a stack of small sticky notes, newest sliding in. */
export function ConsolePane({ lines, className }: { lines: string[]; className?: string }) {
  return (
    <div className={`flex flex-col items-start gap-2 ${className ?? ''}`}>
      <span className="font-hand text-ink-soft text-xl">console</span>
      <AnimatePresence initial={false}>
        {lines.map((line, i) => (
          <motion.div
            key={`${i}-${line}`}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 18, stiffness: 260 }}
          >
            <StickyNote id={`console-${i}`}>
              <code className="text-[14px]">{line}</code>
            </StickyNote>
          </motion.div>
        ))}
      </AnimatePresence>
      {lines.length === 0 && (
        <span className="text-ink-soft text-sm italic">(nothing logged yet)</span>
      )}
    </div>
  )
}
