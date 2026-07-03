import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useMeasure } from '../design/useMeasure'

/**
 * Barnaby, the resident cat. Does nothing. Essential anyway.
 * A tiny behavior loop drives him: sleep (breathing, z's) → wake and sit
 * (blinks, tail flicks) → walk somewhere else on the desk (animated legs,
 * flips direction) → sit → maybe curl up again. Click to pet in any pose —
 * he purrs and floats hearts. No stats, no streaks, no purpose. A cat.
 */

const INK = 'var(--color-ink)'
const CAT_WIDTH = 128
const WALK_SPEED = 42 // px per second, ambling on his own
const CHASE_SPEED = 85 // px per second, following a finger/pencil

type Mood = 'sleeping' | 'sitting' | 'walking' | 'petted'

export function ResidentCat() {
  const [floorRef, { width: floorWidth }] = useMeasure<HTMLDivElement>()
  const [mood, setMood] = useState<Mood>('sleeping')
  const [x, setX] = useState(12)
  const [dir, setDir] = useState<1 | -1>(1)
  const [walkSeconds, setWalkSeconds] = useState(1)
  const [twitch, setTwitch] = useState(0)
  const [fidget, setFidget] = useState(0) // re-arms the sitting timer on "stay" rolls
  const [frame, setFrame] = useState(0) // walk-cycle sprite frame
  const [hearts, setHearts] = useState<number[]>([])
  const xLive = useRef(12)
  const heartId = useRef(0)
  const wakeTo = useRef<Mood>('sitting')

  // ── the behavior brain: one pending decision at a time ──
  useEffect(() => {
    if (mood === 'petted') return
    let timer: number

    if (mood === 'sleeping') {
      timer = window.setTimeout(() => setMood('sitting'), 9000 + Math.random() * 8000)
    } else if (mood === 'sitting') {
      timer = window.setTimeout(() => {
        const roll = Math.random()
        const roam = Math.max(0, floorWidth - CAT_WIDTH - 8)
        if (roll < 0.55 && roam > 60) {
          const target = 4 + Math.random() * roam
          const distance = Math.abs(target - xLive.current)
          if (distance < 40) {
            setTwitch((n) => n + 1) // too lazy for a two-step stroll
            setFidget((n) => n + 1)
            return
          }
          setDir(target > xLive.current ? 1 : -1)
          setWalkSeconds(distance / WALK_SPEED)
          setX(target)
          setMood('walking')
        } else if (roll < 0.8) {
          setMood('sleeping')
        } else {
          setTwitch((n) => n + 1) // just a tail flick, thanks
          setFidget((n) => n + 1)
        }
      }, 3500 + Math.random() * 4500)
    } else {
      // walking → sit down wherever he arrived (and trust the destination,
      // not the animation's live readout, as his resting position)
      timer = window.setTimeout(() => {
        xLive.current = x
        setMood('sitting')
      }, walkSeconds * 1000 + 150)
    }

    return () => window.clearTimeout(timer)
  }, [mood, fidget, floorWidth, walkSeconds, x])

  // The sprite-cycle trick: while walking, flip between drawn poses in
  // discrete steps (no tweening) — the snap between frames reads as a gait.
  useEffect(() => {
    if (mood !== 'walking') return
    const timer = window.setInterval(() => setFrame((f) => (f + 1) % 4), 130)
    return () => window.clearInterval(timer)
  }, [mood])

  // oneko-style: lead him with a finger, mouse, or hovering Pencil.
  function chase(e: React.PointerEvent<HTMLDivElement>) {
    if (mood === 'petted') return
    const rect = e.currentTarget.getBoundingClientRect()
    const roamMax = Math.max(4, rect.width - CAT_WIDTH - 4)
    const target = Math.min(roamMax, Math.max(4, e.clientX - rect.left - CAT_WIDTH / 2))
    const distance = Math.abs(target - xLive.current)
    if (distance < 28) return // close enough — cats don't fuss
    setDir(target > xLive.current ? 1 : -1)
    setWalkSeconds(distance / CHASE_SPEED)
    setX(target)
    setMood('walking')
  }

  function pet() {
    const id = ++heartId.current
    setHearts((h) => [...h, id])
    window.setTimeout(() => setHearts((h) => h.filter((v) => v !== id)), 1300)
    if (mood !== 'petted') {
      wakeTo.current = mood === 'sleeping' ? 'sleeping' : 'sitting'
      setX(xLive.current) // if mid-walk: stop right where he is
      setMood('petted')
    }
    window.setTimeout(() => setMood((m) => (m === 'petted' ? wakeTo.current : m)), 2600)
  }

  return (
    <div className="flex min-w-64 flex-1 flex-col self-stretch">
      <div ref={floorRef} onPointerMove={chase} className="relative min-h-28 flex-1" style={{ touchAction: 'none' }}>
        <motion.button
          type="button"
          onClick={pet}
          aria-label="pet Barnaby the cat"
          title="pet the cat"
          className="absolute bottom-0.5 left-0 cursor-pointer"
          animate={{ x }}
          transition={mood === 'walking' ? { duration: walkSeconds, ease: 'linear' } : { duration: 0.2 }}
          onUpdate={(latest) => {
            const v = latest.x
            const parsed = typeof v === 'number' ? v : parseFloat(String(v))
            if (!Number.isNaN(parsed)) xLive.current = parsed
          }}
        >
          {/* hearts + purr, floating above whatever pose he's in */}
          <AnimatePresence>
            {hearts.map((id) => (
              <motion.span
                key={id}
                className="text-marker-coral pointer-events-none absolute text-lg"
                style={{ left: 34 + (id % 3) * 16, top: -8 }}
                initial={{ opacity: 0.95, y: 0, scale: 0.9 }}
                animate={{ opacity: 0, y: -26, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              >
                ♥
              </motion.span>
            ))}
          </AnimatePresence>
          {mood === 'petted' && (
            <motion.span
              className="text-marker-coral font-hand pointer-events-none absolute -top-4 left-2 text-lg"
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            >
              prrrrr…
            </motion.span>
          )}

          <div style={{ transform: dir === -1 ? 'scaleX(-1)' : undefined }}>
            {mood === 'walking' ? (
              <WalkingPose frame={frame} />
            ) : mood === 'sleeping' ? (
              <SleepingPose twitch={twitch} />
            ) : (
              <SittingPose petted={mood === 'petted'} twitch={twitch} />
            )}
          </div>
        </motion.button>
        {/* the edge of the desk he patrols */}
        <div aria-hidden className="border-ink-soft/40 absolute right-0 bottom-0 left-0 border-t-2 border-dashed" />
      </div>
      <p className="text-ink-soft font-hand mt-1.5 text-center text-sm leading-tight">
        Barnaby, the resident cat. does nothing. essential.{' '}
        <span className="italic">(pet him — or lead him around with your finger)</span>
      </p>
    </div>
  )
}

// ── poses ─────────────────────────────────────────────────────────────────

function SleepingPose({ twitch }: { twitch: number }) {
  return (
    <svg viewBox="0 0 160 120" className="h-20 w-28">
      <motion.g
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '80px', originY: '101px' }}
      >
        <motion.path
          key={`tail-${twitch}`}
          d="M36,98 C18,96 12,82 23,72 C28,68 34,68 37,72"
          fill="none"
          stroke={INK}
          strokeWidth={2.6}
          strokeLinecap="round"
          animate={twitch > 0 ? { rotate: [0, 7, -4, 0] } : { rotate: 0 }}
          transition={{ duration: 0.6 }}
          style={{ originX: '38px', originY: '98px' }}
        />
        <path
          d="M32,94 C26,72 44,54 74,51 C106,48 130,60 133,80 C135,93 122,101 100,101 L48,101 C38,101 34,99 32,94 z"
          fill="color-mix(in srgb, var(--color-ink) 8%, transparent)"
          stroke={INK}
          strokeWidth={2.6}
          strokeLinejoin="round"
        />
        <path d="M90,101 q9,-7 18,0" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        <circle cx={112} cy={72} r={20} fill="var(--color-paper, #fdf8ee)" stroke={INK} strokeWidth={2.6} />
        <path d="M99,59 L102,44 L111,54 z" fill="color-mix(in srgb, var(--color-marker-coral) 30%, transparent)" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
        <motion.path
          key={`ear-${twitch}`}
          d="M117,52 L127,41 L129,56 z"
          fill="color-mix(in srgb, var(--color-marker-coral) 30%, transparent)"
          stroke={INK}
          strokeWidth={2.2}
          strokeLinejoin="round"
          animate={twitch > 0 ? { rotate: [0, -12, 7, 0] } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
          style={{ originX: '123px', originY: '55px' }}
        />
        <path d="M102,70 q3.5,1.5 7,0 M117,70 q3.5,1.5 7,0" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        <path d="M111,76 l5,0 l-2.5,3.5 z" fill={INK} />
      </motion.g>
      {[0, 1, 2].map((i) => (
        <motion.text
          key={i}
          x={44 + i * 13}
          y={42 - i * 12}
          fontFamily="var(--font-hand)"
          fontSize={12 + i * 4}
          fill="var(--color-ink-soft)"
          animate={{ opacity: [0, 1, 0], y: [-2, -8] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
        >
          z
        </motion.text>
      ))}
    </svg>
  )
}

function SittingPose({ petted, twitch }: { petted: boolean; twitch: number }) {
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24">
      <motion.path
        key={`tail-${twitch}-${petted}`}
        d="M84,103 C102,100 106,84 95,77"
        fill="none"
        stroke={INK}
        strokeWidth={2.6}
        strokeLinecap="round"
        animate={petted ? { rotate: [0, 10, -6, 8, 0] } : twitch > 0 ? { rotate: [0, 8, -5, 0] } : { rotate: 0 }}
        transition={{ duration: petted ? 1.6 : 0.6 }}
        style={{ originX: '85px', originY: '103px' }}
      />
      <path
        d="M34,105 C29,76 44,60 60,60 C76,60 91,76 86,105 z"
        fill="color-mix(in srgb, var(--color-ink) 8%, transparent)"
        stroke={INK}
        strokeWidth={2.6}
        strokeLinejoin="round"
      />
      <path d="M47,105 q4,-5 8,0 M63,105 q4,-5 8,0" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <circle cx={60} cy={44} r={20} fill="var(--color-paper, #fdf8ee)" stroke={INK} strokeWidth={2.6} />
      <path d="M46,31 L48,16 L58,26 z" fill="color-mix(in srgb, var(--color-marker-coral) 30%, transparent)" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M63,26 L73,14 L75,29 z" fill="color-mix(in srgb, var(--color-marker-coral) 30%, transparent)" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />

      {/* face */}
      {petted ? (
        <g>
          <path d="M50,42 q3.5,-3.5 7,0 M63,42 q3.5,-3.5 7,0" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
          <path d="M55,52 q2.5,2.5 5,0 q2.5,2.5 5,0" fill="none" stroke={INK} strokeWidth={1.7} strokeLinecap="round" />
        </g>
      ) : (
        <motion.g
          animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
          transition={{ duration: 4, times: [0, 0.44, 0.5, 0.56, 1], repeat: Infinity }}
          style={{ originX: '60px', originY: '43px' }}
        >
          <circle cx={53.5} cy={43} r={2.3} fill={INK} />
          <circle cx={66.5} cy={43} r={2.3} fill={INK} />
        </motion.g>
      )}
      <path d="M57.5,48 l5,0 l-2.5,3.5 z" fill={INK} />
      <path d="M46,47 h-12 M46,51 h-10 M74,47 h12 M74,51 h10" stroke={INK} strokeWidth={1.3} strokeLinecap="round" fill="none" opacity={0.7} />
    </svg>
  )
}

/**
 * Four keyframe poses of a quadruped walk — contact, passing, contact
 * (opposite), passing — snapped between like a sprite sheet. Each entry:
 * body lift, tail sway, and one rotation per leg
 * [nearFront, farFront, farBack, nearBack] (diagonal pairs move together).
 */
const WALK_FRAMES = [
  { body: 0, tail: 6, legs: [26, -18, 20, -24] },
  { body: -2.5, tail: 0, legs: [9, -5, 6, -8] },
  { body: 0, tail: -6, legs: [-24, 20, -18, 26] },
  { body: -2.5, tail: 0, legs: [-8, 6, -5, 9] },
]

function WalkingPose({ frame }: { frame: number }) {
  const pose = WALK_FRAMES[frame % WALK_FRAMES.length]
  return (
    <svg viewBox="0 0 140 90" className="h-20 w-32">
      <g transform={`translate(0 ${pose.body})`}>
        {/* upright tail, swaying with the stride */}
        <g transform={`rotate(${pose.tail} 33 49)`}>
          <path d="M32,48 C20,40 18,28 28,22" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
        </g>
        {/* far legs first — behind the body, lighter */}
        <WalkLeg x={90} rot={pose.legs[1]} far />
        <WalkLeg x={62} rot={pose.legs[2]} far />
        {/* body */}
        <path
          d="M30,52 C31,40 52,33 78,35 C99,37 110,45 109,55 C108,63 96,66 80,66 L46,66 C36,66 29,60 30,52 z"
          fill="color-mix(in srgb, var(--color-ink) 8%, transparent)"
          stroke={INK}
          strokeWidth={2.6}
          strokeLinejoin="round"
        />
        {/* head, looking ahead */}
        <circle cx={113} cy={38} r={16} fill="var(--color-paper, #fdf8ee)" stroke={INK} strokeWidth={2.4} />
        <path d="M101,28 L102,15 L111,23 z" fill="color-mix(in srgb, var(--color-marker-coral) 30%, transparent)" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <path d="M115,22 L124,12 L126,25 z" fill="color-mix(in srgb, var(--color-marker-coral) 30%, transparent)" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <circle cx={117} cy={36} r={2.1} fill={INK} />
        <path d="M124,42 l4,0 l-2,3 z" fill={INK} />
        {/* near legs — in front */}
        <WalkLeg x={102} rot={pose.legs[0]} />
        <WalkLeg x={50} rot={pose.legs[3]} />
      </g>
    </svg>
  )
}

/** One leg drawn at a fixed hip rotation — the frames do the animating. */
function WalkLeg({ x, rot, far = false }: { x: number; rot: number; far?: boolean }) {
  return (
    <g transform={`rotate(${rot} ${x} 62)`}>
      <path
        d={`M${x},62 L${x},82 L${x + 4},82`}
        fill="none"
        stroke={INK}
        strokeWidth={far ? 2.1 : 2.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={far ? 0.55 : 1}
      />
    </g>
  )
}
