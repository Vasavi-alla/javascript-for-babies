import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { hashSeed } from '../../design/seed'
import { RoughBox } from '../../design/RoughBox'
import { RoughEllipse, RoughLine, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { InkButton } from '../../design/InkButton'
import { CodePane } from '../../design/CodePane'
import { ConsolePane } from '../../design/ConsolePane'
import { StickyNote } from '../../design/StickyNote'
import { WhyCard } from '../../engine/mission/WhyCard'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { MissionDef } from '../../engine/mission/types'

/**
 * 3.1 — What is a function? · Machine Shop work order (BUILD JOB)
 * Teach-first flow (user feedback 2026-07-03): (1) KT — read the blueprint,
 * every part explained; (2) assemble it, blanks filling in the code as parts
 * bolt on — and discover nothing runs; (3) find the GO button + serve the
 * rush; (4) write a whole function from scratch, run and validated for real.
 */

const DEFINITION = `function greet(name) {
  console.log("Hello, " + name + "!");
}`

// ── the greeting machine: an assembly line, work visible inside ──────────
// Left-to-right flow: a value rides the belt in through the input window,
// the workbench inside visibly glues "Hello, " + value + "!", and the
// finished sentence rides out toward the console. No abstract gears.

type Spotlight = 'frame' | 'tape' | 'slot' | 'work' | null

const SPOTLIGHTS: Record<Exclude<Spotlight, null>, { cx: number; cy: number; w: number; h: number }> = {
  frame: { cx: 233, cy: 118, w: 268, h: 168 },
  tape: { cx: 233, cy: 59, w: 156, h: 48 },
  slot: { cx: 120, cy: 150, w: 78, h: 66 },
  work: { cx: 245, cy: 101, w: 200, h: 74 },
}

/** One puzzle piece on the workbench. */
function Piece({ x, w, text, teal, dashed }: { x: number; w: number; text: string; teal?: boolean; dashed?: boolean }) {
  return (
    <g>
      <RoughRect
        x={x}
        y={88}
        width={w}
        height={26}
        seed={410 + x}
        fill={teal ? 'var(--color-marker-teal)' : 'var(--color-paper, #fdf8ee)'}
        fillStyle="solid"
        strokeWidth={1.2}
        roughness={dashed ? 2.2 : 1.2}
      />
      <text
        x={x + w / 2}
        y={105}
        textAnchor="middle"
        fontFamily="var(--font-code)"
        fontSize={11}
        fontWeight={600}
        fill={dashed ? 'var(--color-ink-soft)' : 'var(--color-ink)'}
      >
        {text}
      </text>
    </g>
  )
}

function GreetMachine({
  hasTape,
  hasSlot,
  hasWork,
  input,
  output,
  shake = 0,
  spotlight = null,
}: {
  hasTape: boolean
  hasSlot: boolean
  hasWork: boolean
  /** value currently riding the belt into the input window, e.g. '"Rosa"' */
  input: string | null
  /** finished sentence currently riding out, e.g. 'Hello, Rosa!' */
  output?: string | null
  shake?: number
  spotlight?: Spotlight
}) {
  const complete = hasTape && hasSlot && hasWork
  const ring = spotlight ? SPOTLIGHTS[spotlight] : null
  // While a value is inside, the workbench shows it in the name piece.
  const working = input !== null
  return (
    <svg viewBox="0 0 470 215" className="w-full">
      <motion.g
        key={shake}
        animate={shake > 0 ? { x: [0, -5, 5, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
      >
        {/* the belt: in on the left, out on the right */}
        <RoughLine x1={10} y1={150} x2={92} y2={150} seed={401} strokeWidth={2} />
        <RoughLine x1={84} y1={144} x2={94} y2={150} seed={402} strokeWidth={2} />
        <RoughLine x1={84} y1={156} x2={94} y2={150} seed={403} strokeWidth={2} />
        <text x={8} y={196} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
          values ride in →
        </text>
        <RoughLine x1={352} y1={150} x2={448} y2={150} seed={404} strokeWidth={2} />
        <RoughLine x1={440} y1={144} x2={450} y2={150} seed={405} strokeWidth={2} />
        <RoughLine x1={440} y1={156} x2={450} y2={150} seed={406} strokeWidth={2} />
        <text x={340} y={196} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
          → result rides out
        </text>

        {/* the frame — a pencil sketch until every part is bolted on */}
        <motion.g animate={{ opacity: complete ? 1 : 0.35 }}>
          <RoughRect x={102} y={44} width={262} height={130} seed={407} fill="var(--color-sticky)" fillStyle="solid" />
        </motion.g>

        {/* part: the name tape on top */}
        <AnimatePresence>
          {hasTape && (
            <motion.g initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
              <RoughRect x={173} y={46} width={120} height={26} seed={408} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
              <text x={233} y={64} textAnchor="middle" fontFamily="var(--font-code)" fontSize={14} fontWeight={700} fill="var(--color-ink)">
                greet
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* part: the input window on the left wall */}
        <AnimatePresence>
          {hasSlot && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <RoughRect x={96} y={132} width={48} height={36} seed={409} fill="var(--color-paper, #fdf8ee)" fillStyle="solid" strokeWidth={1.5} />
              <text x={120} y={126} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink-soft)">
                in: name
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* part: the workbench — the sentence being glued, visibly */}
        <AnimatePresence>
          {hasWork && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={160} y={82} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
                the work: glue the sentence
              </text>
              <Piece x={158} w={62} text={'"Hello, "'} />
              {working ? (
                <motion.g key={input} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ originX: '256px', originY: '101px' }}>
                  <Piece x={224} w={64} text={input ?? ''} teal />
                </motion.g>
              ) : (
                <Piece x={224} w={64} text="name" dashed />
              )}
              <Piece x={292} w={28} text={'"!"'} />
            </motion.g>
          )}
        </AnimatePresence>

        {/* KT spotlight ring */}
        {ring && (
          <motion.g
            key={spotlight}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ originX: `${ring.cx}px`, originY: `${ring.cy}px` }}
          >
            <RoughEllipse
              cx={ring.cx}
              cy={ring.cy}
              width={ring.w}
              height={ring.h}
              seed={390}
              stroke="var(--color-marker-coral)"
              strokeWidth={2.5}
            />
          </motion.g>
        )}
      </motion.g>

      {/* a value riding the belt into the input window */}
      <AnimatePresence>
        {input && (
          <motion.g
            key={input}
            initial={{ x: -95, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 16 }}
          >
            <RoughRect x={78} y={136} width={84} height={28} seed={411} fill="var(--color-marker-teal)" fillStyle="solid" strokeWidth={1.5} />
            <text x={120} y={155} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={600} fill="var(--color-ink)">
              {input}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* the finished sentence riding out toward the console */}
      <AnimatePresence>
        {output && (
          <motion.g
            key={output}
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 16 }}
          >
            <RoughRect x={342} y={124} width={120} height={26} seed={412} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
            <text x={402} y={141} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fontWeight={600} fill="var(--color-ink)">
              {output}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

// ── job step 1: KT — read the blueprint (teach FIRST, work after) ─────────

const ANATOMY: Array<{ key: string; spotlight: Spotlight; heading: string; explain: ReactNode }> = [
  {
    key: 'keyword',
    spotlight: 'frame',
    heading: 'function — the magic word',
    explain: (
      <>
        <code>function</code> is a signpost for the engine: <em>“a machine blueprint starts
        HERE.”</em> It, together with the braces <code>{'{ }'}</code> at the end, is the machine’s
        frame — every machine you’ll ever build starts with this word.
      </>
    ),
  },
  {
    key: 'name',
    spotlight: 'tape',
    heading: 'greet — the name tape',
    explain: (
      <>
        The machine’s <strong>name</strong>. The engine files the finished machine in memory under
        this label — the same label-on-a-box idea from Phase 1, except the box holds a machine.
        Later, this name is how you find it and use it.
      </>
    ),
  },
  {
    key: 'param',
    spotlight: 'slot',
    heading: '(name) — the input window',
    explain: (
      <>
        The <strong>input window</strong> — the only way in. Values ride the belt from the left and
        enter here; whatever arrives will be known as <code>name</code> while the machine works.
        (Rosa’s machine needs exactly one input: who just walked in.)
      </>
    ),
  },
  {
    key: 'body',
    spotlight: 'work',
    heading: 'the body — the work',
    explain: (
      <>
        Between the braces lives the <strong>body</strong>: the actual work. Look at the workbench
        inside the machine — three pieces waiting to be glued: <code>"Hello, "</code>, whatever’s
        in the window, and <code>"!"</code>. One crucial secret:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          writing the work down does NOT do the work
        </HighlightMark>{' '}
        — you’ll prove that yourself in the next step.
      </>
    ),
  },
]

function BlueprintChallenge({ onComplete }: { onComplete: () => void }) {
  const [active, setActive] = useState<string | null>(null)
  const [visited, setVisited] = useState<Record<string, boolean>>({})
  const activePart = ANATOMY.find((p) => p.key === active)
  const allVisited = ANATOMY.every((p) => visited[p.key])

  function look(key: string) {
    setActive(key)
    setVisited((v) => ({ ...v, [key]: true }))
  }

  const tok = (key: string, text: string) => {
    const isActive = active === key
    const isVisited = Boolean(visited[key])
    return (
      <button
        type="button"
        onClick={() => look(key)}
        title="click to inspect this part"
        className="cursor-pointer rounded-sm px-1.5 py-0.5 font-bold transition-transform hover:-translate-y-px"
        style={{
          // three unmistakable states: to-do = bright yellow + dashed border,
          // being inspected = coral border (matches the ring on the machine),
          // done = calm teal tint
          background: isActive
            ? 'color-mix(in srgb, var(--color-marker-yellow) 75%, transparent)'
            : isVisited
              ? 'color-mix(in srgb, var(--color-marker-teal) 22%, transparent)'
              : 'color-mix(in srgb, var(--color-marker-yellow) 50%, transparent)',
          border: isActive
            ? '1.5px solid var(--color-marker-coral)'
            : isVisited
              ? '1.5px solid transparent'
              : '1.5px dashed var(--color-ink-soft)',
        }}
      >
        {text}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid items-start gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <pre className="bg-paper-shade rounded-md px-5 py-4 font-mono text-[15px] leading-[2]">
            {tok('keyword', 'function')} {tok('name', 'greet')}
            {tok('param', '(name)')} {'{'}
            {'\n  '}
            {tok('body', 'console.log("Hello, " + name + "!");')}
            {'\n'}
            {'}'}
          </pre>
          <p className="text-ink-soft text-sm">
            {allVisited
              ? 'All four parts inspected ✓'
              : `${ANATOMY.filter((p) => visited[p.key]).length} of 4 parts inspected — the bright yellow ones with dashed borders are still waiting for a click. (Teal = already done.)`}
          </p>
        </div>
        <GreetMachine hasTape hasSlot hasWork input={null} spotlight={activePart?.spotlight ?? null} />
      </div>

      {activePart && (
        <motion.div
          key={activePart.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-marker-coral/60 max-w-2xl border-l-2 pl-4"
        >
          <p className="font-hand text-2xl font-semibold">{activePart.heading}</p>
          <p className="mt-1">{activePart.explain}</p>
        </motion.div>
      )}

      {allVisited && (
        <div>
          <InkButton id="m31-kt-done" variant="primary" onClick={onComplete}>
            I can read the blueprint — to the workbench! →
          </InkButton>
        </div>
      )}
    </div>
  )
}

// ── job step 2: assemble — blanks fill in as parts bolt on ───────────────

const PARTS = [
  { key: 'tape', code: 'greet', caption: '🏷️ the machine’s name' },
  { key: 'slot', code: 'name', caption: '📥 the input window' },
  { key: 'work', code: 'console.log("Hello, " + name + "!");', caption: '🧩 the work' },
] as const

/** A part in the tray IS a piece of code — the caption says which part it is. */
function TrayPart({
  id,
  code,
  caption,
  placed,
  onClick,
}: {
  id: string
  code: string
  caption: string
  placed: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={placed}
      onClick={onClick}
      className="group cursor-pointer text-left disabled:cursor-not-allowed disabled:opacity-45"
    >
      <RoughBox
        seed={hashSeed(id)}
        fill={placed ? undefined : 'var(--color-marker-yellow)'}
        fillStyle="hachure"
        className="px-3 py-1.5 transition-transform group-hover:-translate-y-px group-active:scale-[0.97]"
      >
        <span className="font-mono block text-[13px] font-bold">
          {placed ? '✓ ' : ''}
          {code}
        </span>
        <span className="text-ink-soft font-hand block text-lg leading-tight">{caption}</span>
      </RoughBox>
    </button>
  )
}

function Blank({ filled, text, width }: { filled: boolean; text: string; width: string }) {
  return filled ? (
    <motion.span
      initial={{ background: 'color-mix(in srgb, var(--color-marker-yellow) 65%, transparent)' }}
      animate={{ background: 'color-mix(in srgb, var(--color-marker-yellow) 0%, transparent)' }}
      transition={{ duration: 1.6 }}
      className="rounded-sm font-bold"
    >
      {text}
    </motion.span>
  ) : (
    <span className="text-ink-soft select-none">{'_'.repeat(Number(width))}</span>
  )
}

function AssembleChallenge({ onComplete }: { onComplete: () => void }) {
  const [placed, setPlaced] = useState<Record<string, boolean>>({})
  const complete = PARTS.every((p) => placed[p.key])

  return (
    <div className="flex flex-col gap-4">
      <div className="grid items-start gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <p className="font-hand text-xl">the blueprint on the bench — three holes to fill:</p>
          <pre className="bg-paper-shade rounded-md px-5 py-4 font-mono text-[14px] leading-[2]">
            function <Blank filled={Boolean(placed.tape)} text="greet" width="5" />(
            <Blank filled={Boolean(placed.slot)} text="name" width="4" />) {'{'}
            {'\n  '}
            <Blank filled={Boolean(placed.work)} text='console.log("Hello, " + name + "!");' width="20" />
            {'\n'}
            {'}'}
          </pre>
          <p className="font-hand text-xl">
            parts tray — each part is a real piece of code. Click one to bolt it into its hole:
          </p>
          <div className="flex flex-col items-start gap-2">
            {PARTS.map((part) => (
              <TrayPart
                id={`m31-part-${part.key}`}
                key={part.key}
                code={part.code}
                caption={part.caption}
                placed={Boolean(placed[part.key])}
                onClick={() => setPlaced((s) => ({ ...s, [part.key]: true }))}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <GreetMachine
            hasTape={Boolean(placed.tape)}
            hasSlot={Boolean(placed.slot)}
            hasWork={Boolean(placed.work)}
            input={null}
          />
          {complete && <ConsolePane lines={[]} />}
        </div>
      </div>

      {complete && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-col gap-4">
          <p className="font-hand text-2xl">“Beautiful machine! So… where’s my greeting?” — Rosa</p>
          <WhyCard id="m31-why-define" tone="aha">
            <p>
              Check the console: <em>(nothing logged yet)</em>. And that’s correct! A blueprint —
              even a finished one — is just a <strong>description</strong> of work. When the engine
              reads those three lines, it builds the machine and files it in memory under{' '}
              <code>greet</code>… and then moves on. Not one letter printed.
            </p>
            <p>
              <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
                Defining a function runs nothing. Only calling it does.
              </HighlightMark>{' '}
              Hold this sentence tight — it’s the most important one in the whole phase.
            </p>
          </WhyCard>
          <div>
            <InkButton id="m31-continue-1" variant="primary" onClick={onComplete}>
              so how do we switch it ON? →
            </InkButton>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ── job step 3: find the GO button, then serve the rush ──────────────────

const RUSH = ['Amara', 'Ben', 'Chen']

function GoChallenge({ onComplete }: { onComplete: () => void }) {
  const [shake, setShake] = useState(0)
  const [triedPlain, setTriedPlain] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'dropping' | 'rush'>('idle')
  const [served, setServed] = useState<string[]>([])
  const [dropping, setDropping] = useState<string | null>(null)
  const [outChip, setOutChip] = useState<string | null>(null)
  const rushDone = served.length === RUSH.length

  function tryPlain() {
    setShake((n) => n + 1)
    setTriedPlain(true)
  }

  // The little play: value rides in (t=0), result rides out (t≈500ms),
  // console line lands and the belt clears (t≈1100ms).
  function animateRun(visitor: string, andThen: () => void) {
    setDropping(`"${visitor}"`)
    window.setTimeout(() => setOutChip(`Hello, ${visitor}!`), 500)
    window.setTimeout(() => {
      setDropping(null)
      setOutChip(null)
      andThen()
    }, 1100)
  }

  function tryCall() {
    if (phase !== 'idle') return
    setPhase('dropping')
    animateRun('Rosa', () => {
      setServed(['Rosa'])
      setPhase('rush')
    })
  }

  function serve(visitor: string) {
    if (dropping || served.includes(visitor)) return
    animateRun(visitor, () => {
      setServed((s) => {
        const next = [...s, visitor]
        if (next.length === RUSH.length + 1) onComplete()
        return next
      })
    })
  }

  const code = [
    DEFINITION,
    '',
    ...(phase === 'idle' ? ['// the machine is OFF. How do we press GO?'] : served.map((n) => `greet("${n}");`)),
  ].join('\n')

  return (
    <div className="flex flex-col gap-4">
      <div className="grid items-start gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <CodePane code={code} />
          {phase === 'idle' && (
            <>
              <p className="font-hand text-xl">two things you could type — try them:</p>
              <div className="flex flex-wrap gap-3">
                <InkButton id="m31-try-plain" onClick={tryPlain}>
                  greet
                </InkButton>
                <InkButton id="m31-try-call" onClick={tryCall}>
                  greet("Rosa")
                </InkButton>
              </div>
            </>
          )}
          {phase === 'rush' && !rushDone && (
            <>
              <p className="font-hand text-xl">…and here comes the morning rush — GO, GO, GO:</p>
              <div className="flex flex-wrap gap-3">
                {RUSH.map((visitor) => (
                  <InkButton
                    id={`m31-rush-${visitor}`}
                    key={visitor}
                    disabled={dropping !== null || served.includes(visitor)}
                    onClick={() => serve(visitor)}
                  >
                    {served.includes(visitor) ? `✓ greet("${visitor}")` : `greet("${visitor}")`}
                  </InkButton>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <GreetMachine hasTape hasSlot hasWork input={dropping} output={outChip} shake={shake} />
          <ConsolePane lines={served.map((n) => `Hello, ${n}!`)} />
        </div>
      </div>

      {triedPlain && phase === 'idle' && (
        <WhyCard id="m31-why-plain" tone="aha" title="💡 The machine only shivered:">
          <p>
            Typing just <code>greet</code> <em>points</em> at the machine — like saying “that one,
            over there.” The engine looks the name up, finds the machine, and… that’s the whole
            story. No run. Now look at the other option: what’s different about it?
          </p>
        </WhyCard>
      )}

      {phase === 'rush' && served.length === 1 && (
        <WhyCard id="m31-why-call" tone="win">
          <p>
            The parentheses <code>( )</code> are the{' '}
            <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
              GO button
            </HighlightMark>
            : <code>greet("Rosa")</code> means <em>run the machine, now, with "Rosa" in the slot</em>.
            This is called <strong>calling</strong> the function.
            {!triedPlain && (
              <>
                {' '}
                (Plain <code>greet</code> without parentheses would only have <em>pointed</em> at
                the machine — nothing would run.)
              </>
            )}
          </p>
        </WhyCard>
      )}

      {rushDone && (
        <WhyCard id="m31-why-rush" tone="win" title="✓ Four greetings — and this is the whole point:">
          <p>
            The sentence exists <strong>once</strong>, inside the machine — yet every visitor got a
            personal greeting. Rosa used to type it a hundred times a day; now she presses GO.{' '}
            <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-teal) 35%, transparent)">
              Build once, call forever.
            </HighlightMark>{' '}
            Hidden superpower: want “Welcome” instead of “Hello”? Change <em>one line inside the
            machine</em> and every call, everywhere, updates instantly.
          </p>
        </WhyCard>
      )}
    </div>
  )
}

// ── job step 4: write one yourself, for real ─────────────────────────────

const WELCOME_EXERCISE: CodeExerciseDef = {
  id: 'm31-welcome',
  title: 'the gift shop’s machine',
  task: 'The gift shop next door saw Rosa relaxing and wants a greeting machine of their own. Same blueprint shape as greet — different name, different sentence.',
  steps: [
    <>
      A function named <code>welcome</code> with one input slot: <code>name</code>.
    </>,
    <>
      Each call prints <code>Welcome to the gift shop, &lt;name&gt;!</code> — built from whatever
      is in the slot, matching the expected output <em>exactly</em> (mind the comma, the spaces,
      the <code>!</code>).
    </>,
    <>
      Prove it works: one call for <code>"Ida"</code>, one for <code>"Omar"</code>, in that order.
    </>,
  ],
  starter: '// build the welcome machine here\n\n\n// then press GO for "Ida" and for "Omar"\n',
  expectedOutput: ['Welcome to the gift shop, Ida!', 'Welcome to the gift shop, Omar!'],
  mustUse: [
    { test: /function\s+welcome\s*\(\s*\w+\s*\)/, label: 'defines a machine named welcome with one input slot' },
    { test: /welcome\s*\(\s*["']Ida["']\s*\)/, label: 'presses GO for "Ida"' },
    { test: /welcome\s*\(\s*["']Omar["']\s*\)/, label: 'presses GO for "Omar"' },
  ],
  mustNotUse: [
    {
      test: /console\.log\s*\(\s*["']Welcome to the gift shop, (Ida|Omar)/,
      label: 'no fair typing the finished sentences by hand — the machine must build them from its slot',
    },
  ],
  modelAnswer: `function welcome(name) {
  console.log("Welcome to the gift shop, " + name + "!");
}

welcome("Ida");
welcome("Omar");`,
}

function WriteChallenge({ onComplete }: { onComplete: () => void }) {
  return <CodeExercise def={WELCOME_EXERCISE} onPass={onComplete} />
}

// ── the mission ───────────────────────────────────────────────────────────

const REPEATED = ['Sam', 'Maya', 'Priya']

export const mission31: MissionDef = {
  id: '3.1',
  jobType: 'build',
  workOrder: {
    customer: 'Rosa — the town welcome desk',
    request: (
      <>
        “Every morning it’s the same dance. The door opens, I check the visitor’s badge, and I
        type out the whole welcome — <em>‘Hello Sam, very good morning! Have a great day.’</em> —
        letter by letter. The door opens again, and I type it all again for Maya. And again for
        Priya. By the fortieth visitor my wrists ache, and yesterday I typed{' '}
        <em>‘Hello Hello’</em> to the mayor. Look at my messages — the sentence never changes,
        only the name does! There must be a smarter way.”
      </>
    ),
  },
  brief: (
    <>
      <p>Here are Rosa’s last three messages. Spot what changes — and what never does:</p>
      <div className="flex flex-wrap items-start gap-3">
        {REPEATED.map((visitor) => (
          <StickyNote id={`m31-note-${visitor}`} key={visitor} className="max-w-56">
            <p className="text-[15px]">
              Hello{' '}
              <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-coral) 40%, transparent)">
                {visitor}
              </HighlightMark>
              , very good morning! Have a great day.
            </p>
          </StickyNote>
        ))}
      </div>
      <p>
        Everything except <em>one word</em> is identical. That feeling of “I’m doing the same thing
        again and again with one tiny change” is the exact signal that a <strong>machine</strong>{' '}
        should be doing it. Programmers even have a rule about it —{' '}
        <strong>DRY: Don’t Repeat Yourself.</strong> Today you build your first repetition-killing
        machine. In JavaScript it’s called a <strong>function</strong>.
      </p>
    </>
  ),
  challenges: [
    {
      id: 'm31-blueprint',
      title: 'first, the KT: read a blueprint',
      prompt: (
        <p>
          No one touches a workbench before the KT. This is Rosa’s machine as real JavaScript —{' '}
          <strong>four parts, four yellow chips</strong> right inside the code.
        </p>
      ),
      action: <>Click all four yellow chips, one by one</>,
      Interactive: BlueprintChallenge,
      stuck: (
        <>
          Click all four yellow-tinted pieces of the code, one by one: <code>function</code>, then{' '}
          <code>greet</code>, then <code>(name)</code>, then the <code>console.log(…)</code> line.
          Each click explains that part and circles it on the machine. Once all four are inspected,
          a button appears.
        </>
      ),
    },
    {
      id: 'm31-assemble',
      title: 'assemble it on the bench',
      prompt: (
        <p>
          Now you build. The frame — <code>function</code> and the braces — is already on the
          bench. Three holes in the blueprint, three pieces of code in the tray.
        </p>
      ),
      action: <>Click each piece in the tray to bolt it in</>,
      Interactive: AssembleChallenge,
      stuck: (
        <>
          Click the three code pieces in the tray, in any order, and watch where each one lands:{' '}
          <code>greet</code> right after <code>function</code>, <code>name</code> between the
          parentheses, and the <code>console.log(…)</code> line between the braces. When all three
          are in, look at the console under the machine and read Rosa’s reaction — the surprise
          (nothing printed!) is the lesson.
        </>
      ),
    },
    {
      id: 'm31-go',
      title: 'find the GO button',
      prompt: (
        <p>
          The machine is built — but sitting there, OFF. Rosa steps up to test it.{' '}
          <strong>Trying things is free in programming</strong> — worst case, you learn something.
        </p>
      ),
      action: <>Try both buttons under the code — make it greet Rosa</>,
      Interactive: GoChallenge,
      stuck: (
        <>
          Try plain <code>greet</code> first to see what <em>doesn’t</em> happen, then{' '}
          <code>greet("Rosa")</code> — the parentheses make it run. After Rosa, click each of the
          three rush buttons once, letting the machine finish between clicks.
        </>
      ),
    },
    {
      id: 'm31-write',
      title: 'now write one yourself',
      prompt: (
        <p>
          Watching is easy — <strong>this shop pays for working code</strong>. Press RUN and your
          code really executes; the inspection shows exactly what’s right and what isn’t.
        </p>
      ),
      action: <>Write the whole thing yourself, then press RUN</>,
      Interactive: WriteChallenge,
      stuck: (
        <>
          Follow the blueprint shape from step 1: <code>function welcome(name) {'{ … }'}</code>{' '}
          with a <code>console.log</code> inside that glues <code>"Welcome to the gift shop, "</code>{' '}
          + <code>name</code> + <code>"!"</code>. Then two calls below it. If the inspection stays
          red, “show the answer” gives you the master’s solution with a line-by-line comparison to
          yours — read it, then type it out and RUN again.
        </>
      ),
    },
  ],
  shelfItem: { emoji: '📣', label: 'greet' },
  shopNotes: (
    <div className="grid items-start gap-4 md:grid-cols-3">
      <StickyNote id="m31-note-names" className="h-full">
        <p className="font-hand text-2xl font-bold">the real names 🏷️</p>
        <p className="mt-1 text-[15px]">
          The whole recipe is a <strong>function declaration</strong>. <code>greet</code> is its{' '}
          <strong>name</strong> · <code>name</code> is a <strong>parameter</strong> (the input
          slot) · the lines in the braces are the <strong>body</strong> (the work) ·{' '}
          <code>greet("Rosa")</code> is a <strong>call</strong>, and <code>"Rosa"</code> is what
          you dropped in.
        </p>
      </StickyNote>
      <StickyNote id="m31-note-engine" className="h-full">
        <p className="font-hand text-2xl font-bold">no gears inside 🔩</p>
        <p className="mt-1 text-[15px]">
          Really, the engine saves the body’s lines in memory and ties the name to them — Phase 1’s
          label-on-a-box, with <em>code</em> in the box. A call = jump to the saved lines, run top
          to bottom, jump back. That’s the entire trick. <code>console.log</code>? A machine
          somebody else built — you’ve pressed its GO since lesson 0.3, and every Playwright line
          in your future (<code>page.click()</code>, <code>expect()</code>) is the same move.
        </p>
      </StickyNote>
      <StickyNote id="m31-note-fun" color="pink" className="h-full">
        <p className="font-hand text-2xl font-bold">fun fact 🕰️</p>
        <p className="mt-1 text-[15px]">
          In 1995 Brendan Eich joined Netscape to put <em>Scheme</em> — a language built entirely
          around functions — into the browser. Management said “make it look like Java,” so he kept
          the Java-ish braces but smuggled Scheme’s function-loving soul inside… in about ten days.
          The syntax is a costume; underneath, functions rule.
        </p>
      </StickyNote>
    </div>
  ),
  finalCheck: [
    {
      kind: 'type-output',
      question: 'A function is defined but NOBODY ever calls it. How many times does its body run? Type the number.',
      code: 'function tellJoke() {\n  console.log("…");\n}',
      accept: ['0', 'zero'],
      placeholder: 'a number…',
      why: 'Zero — defining is construction, not execution. The engine stores the body and ties the name to it; the code inside waits, inert, until somebody calls. No call, no run. Ever.',
    },
    {
      kind: 'type-output',
      question: 'No options this time — type exactly what the console shows:',
      code: `function shout(word) {\n  console.log(word + "!");\n}\n\nshout("tools");`,
      accept: ['tools!'],
      why: 'The value "tools" drops into the slot called word, and the body glues a "!" onto it. (No quotes in the output — quotes live in code, not on the console.)',
    },
    {
      kind: 'type-output',
      question: 'You have been pressing one machine’s GO button since lesson 0.3. Type its full name.',
      accept: ['console.log', 'console.log()'],
      placeholder: 'the machine’s name…',
      why: 'console.log — it has the full machine shape: a name, the GO-button parentheses, and a value dropped in. Someone else built it; you were a function CALLER from day one. Today you became a BUILDER.',
    },
  ],
  teachBack: {
    prompt:
      'A new apprentice starts tomorrow. Explain to them what a function is, using Rosa’s story — and make sure they understand why building one prints nothing, but pressing GO does something.',
    modelAnswer:
      'Rosa typed the same greeting a hundred times a day with only the name changing — a function ends that. It’s a machine you build inside your program: a name, an input slot, and a body of code that does the work. Writing the definition — function greet(name) { … } — only BUILDS the machine and stores it in memory under its name; none of the code inside runs yet, which is why defining prints nothing. To make it go you CALL it: greet("Rosa") — the parentheses are the GO button, and the value between them drops into the slot. Build once, call forever — and fixing a bug once fixes it for every call. Even console.log is such a machine; we’ve pressed its GO button since our very first lesson.',
  },
  recap: [
    'Typing the same thing over and over with one small change = a function’s job. DRY: Don’t Repeat Yourself.',
    'Four parts: the word function (frame), a name, an input slot (parameter), a body (the work).',
    'Defining runs NOTHING. Parentheses are the GO button: greet("Rosa") runs the body with "Rosa" in the slot.',
    'You’ve called functions since day one — console.log is a machine someone else built.',
  ],
}
