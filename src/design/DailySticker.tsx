import { motion } from 'motion/react'
import type { DoodleKind } from '../content/motivation'

/**
 * The daily note as a notebook sticker: white die-cut vinyl with a dashed
 * inner frame, taped to the page with washi, carrying a hand-drawn doodle
 * that draws itself in and then idles (steam curls, leaves sway…).
 * Deliberately its own visual treatment — a sticker ON the sketchbook,
 * not another paper element OF it.
 */

const INK = 'var(--color-ink)'

function Stroke({ d, delay = 0, width = 2.4 }: { d: string; delay?: number; width?: number }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={INK}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.7, delay, ease: 'easeInOut' }}
    />
  )
}

function Tint({ d, color, delay = 0.8 }: { d: string; color: string; delay?: number }) {
  return (
    <motion.path
      d={d}
      fill={`color-mix(in srgb, ${color} 45%, transparent)`}
      stroke="none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    />
  )
}

function CoffeeDoodle() {
  const cup = 'M20,38 h34 v12 a12,12 0 0 1 -12,12 h-10 a12,12 0 0 1 -12,-12 z'
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full">
      <Tint d={cup} color="var(--color-marker-coral)" />
      <Stroke d={cup} />
      <Stroke d="M54,42 a8,8 0 1 1 0,13" delay={0.3} />
      <Stroke d="M16,68 h46" delay={0.45} />
      <motion.g
        animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Stroke d="M30,30 c-3,-5 3,-8 0,-14" delay={0.6} width={2} />
        <Stroke d="M43,30 c-3,-5 3,-8 0,-14" delay={0.7} width={2} />
      </motion.g>
    </svg>
  )
}

function BulbDoodle() {
  const bulb = 'M40,12 a17,17 0 0 1 9,31 c-2,2 -3,4 -3,8 h-12 c0,-4 -1,-6 -3,-8 a17,17 0 0 1 9,-31 z'
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full">
      <Tint d={bulb} color="var(--color-marker-yellow)" />
      <Stroke d={bulb} />
      <Stroke d="M35,57 h10 M36,62 h8" delay={0.35} width={2} />
      <Stroke d="M35,42 l5,-8 l5,8" delay={0.5} width={2} />
      <motion.g
        animate={{ opacity: [0.15, 1, 0.15] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Stroke d="M40,2 v6" delay={0.7} width={2} />
        <Stroke d="M17,12 l5,5" delay={0.7} width={2} />
        <Stroke d="M63,12 l-5,5" delay={0.7} width={2} />
      </motion.g>
    </svg>
  )
}

function SproutDoodle() {
  const leafL = 'M40,40 c-10,-1 -15,-8 -15,-16 c9,0 14,7 15,16 z'
  const leafR = 'M40,32 c10,-1 15,-8 15,-16 c-9,0 -14,7 -15,16 z'
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full">
      <Tint d="M26,52 h28 l-4,18 h-20 z" color="var(--color-marker-coral)" delay={0.2} />
      <Stroke d="M24,52 h32 M28,52 l4,18 h16 l4,-18" />
      <motion.g
        style={{ originX: '40px', originY: '52px' }}
        animate={{ rotate: [-2.5, 2.5, -2.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Stroke d="M40,52 c0,-8 0,-14 0,-22" delay={0.3} />
        <Tint d={leafL} color="var(--color-marker-teal)" delay={0.9} />
        <Stroke d={leafL} delay={0.45} width={2} />
        <Tint d={leafR} color="var(--color-marker-teal)" delay={1} />
        <Stroke d={leafR} delay={0.6} width={2} />
      </motion.g>
    </svg>
  )
}

function FlagDoodle() {
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full">
      <Tint d="M10,66 L34,26 L47,46 L57,34 L72,66 z" color="var(--color-marker-teal)" />
      <Stroke d="M10,66 L34,26 L47,46 L57,34 L72,66" />
      <Stroke d="M34,26 v-14" delay={0.4} width={2} />
      <motion.g
        style={{ originX: '34px', originY: '12px' }}
        animate={{ skewX: [0, -6, 0, 4, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Tint d="M34,10 h13 l-4,4 l4,4 h-13 z" color="var(--color-marker-coral)" delay={0.7} />
        <Stroke d="M34,10 h13 l-4,4 l4,4 h-13" delay={0.55} width={2} />
      </motion.g>
    </svg>
  )
}

function TurtleDoodle() {
  const shell = 'M22,52 a18,15 0 0 1 36,0 z'
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full">
      <motion.g animate={{ x: [0, 4, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
        <Tint d={shell} color="var(--color-marker-teal)" />
        <Stroke d={shell} />
        <Stroke d="M30,44 c3,4 5,4 8,0 c3,4 5,4 8,0" delay={0.35} width={2} />
        <Stroke d="M58,52 a5,5 0 1 1 10,-2 a5,5 0 0 1 -4,5" delay={0.5} width={2} />
        <Stroke d="M28,52 l-2,7 M38,52 l0,7 M48,52 l2,7" delay={0.6} width={2} />
      </motion.g>
      <Stroke d="M12,60 h58" delay={0.75} width={2} />
    </svg>
  )
}

function SparkDoodle() {
  const star = 'M40,14 l5,14 l15,2 l-11,10 l3,15 l-12,-8 l-12,8 l3,-15 l-11,-10 l15,-2 z'
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full">
      <Tint d={star} color="var(--color-marker-yellow)" />
      <Stroke d={star} />
      <motion.g animate={{ opacity: [1, 0.15, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
        <Stroke d="M14,18 v8 M10,22 h8" delay={0.5} width={2} />
      </motion.g>
      <motion.g animate={{ opacity: [0.15, 1, 0.15] }} transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}>
        <Stroke d="M64,54 v8 M60,58 h8" delay={0.65} width={2} />
      </motion.g>
    </svg>
  )
}

const DOODLE_ART: Record<DoodleKind, () => React.JSX.Element> = {
  coffee: CoffeeDoodle,
  bulb: BulbDoodle,
  sprout: SproutDoodle,
  flag: FlagDoodle,
  turtle: TurtleDoodle,
  spark: SparkDoodle,
}

export function DailySticker({ day, text, doodle }: { day: string; text: string; doodle: DoodleKind }) {
  const Art = DOODLE_ART[doodle]
  const friendlyDate = new Date(`${day}T12:00:00`).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, rotate: 4 }}
      animate={{ opacity: 1, y: 0, rotate: 1.5 }}
      transition={{ type: 'spring', damping: 15 }}
      className="relative max-w-80"
    >
      {/* washi tape holding the sticker to the page */}
      <div
        aria-hidden
        className="absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2"
        style={{
          background: 'color-mix(in srgb, var(--color-marker-teal) 30%, transparent)',
          rotate: '-4deg',
          clipPath: 'polygon(2% 10%, 98% 0%, 100% 55%, 97% 95%, 2% 100%, 0% 45%)',
          boxShadow: '1px 2px 5px rgba(43,41,37,0.12)',
        }}
      />
      {/* the die-cut vinyl sticker */}
      <div className="rounded-[22px] bg-white p-1.5 shadow-[3px_7px_16px_rgba(43,41,37,0.22)]">
        <div className="border-ink-soft/40 rounded-[16px] border-2 border-dashed px-4 pt-4 pb-3">
          <div className="flex items-start gap-3">
            <div className="h-20 w-20 shrink-0">
              <Art />
            </div>
            <div>
              <p className="font-hand text-xl leading-tight font-bold">📌 today’s note from the shop</p>
              <p className="mt-1.5 text-[14.5px] leading-snug">{text}</p>
            </div>
          </div>
          <p className="text-ink-soft font-hand mt-2 text-right text-sm">{friendlyDate}</p>
        </div>
      </div>
    </motion.div>
  )
}
