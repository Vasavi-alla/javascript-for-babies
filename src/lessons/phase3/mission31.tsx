import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
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

// ── the greeting machine drawing ──────────────────────────────────────────

type Spotlight = 'frame' | 'tape' | 'slot' | 'gear' | null

function Gear({ cx, cy, turning }: { cx: number; cy: number; turning: boolean }) {
  return (
    <motion.g
      animate={{ rotate: turning ? 150 : 0 }}
      transition={{ type: 'spring', damping: 14 }}
      style={{ originX: `${cx}px`, originY: `${cy}px` }}
    >
      <RoughEllipse cx={cx} cy={cy} width={44} height={44} seed={331} strokeWidth={2} />
      {[0, 60, 120].map((deg) => (
        <RoughLine
          key={deg}
          x1={cx + 21 * Math.cos((deg * Math.PI) / 180)}
          y1={cy + 21 * Math.sin((deg * Math.PI) / 180)}
          x2={cx - 21 * Math.cos((deg * Math.PI) / 180)}
          y2={cy - 21 * Math.sin((deg * Math.PI) / 180)}
          seed={332 + deg}
          strokeWidth={1.5}
        />
      ))}
    </motion.g>
  )
}

const SPOTLIGHTS: Record<Exclude<Spotlight, null>, { cx: number; cy: number; w: number; h: number }> = {
  frame: { cx: 220, cy: 134, w: 230, h: 210 },
  tape: { cx: 220, cy: 89, w: 130, h: 48 },
  slot: { cx: 220, cy: 176, w: 130, h: 38 },
  gear: { cx: 220, cy: 140, w: 76, h: 76 },
}

function GreetMachine({
  hasTape,
  hasSlot,
  hasGear,
  input,
  running,
  shake = 0,
  spotlight = null,
}: {
  hasTape: boolean
  hasSlot: boolean
  hasGear: boolean
  input: string | null
  running: boolean
  shake?: number
  spotlight?: Spotlight
}) {
  const complete = hasTape && hasSlot && hasGear
  const ring = spotlight ? SPOTLIGHTS[spotlight] : null
  return (
    <svg viewBox="0 0 440 250" className="w-full">
      <motion.g
        key={shake}
        animate={shake > 0 ? { x: [0, -5, 5, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
      >
        {/* the frame — hopper, housing, chute */}
        <motion.g animate={{ opacity: complete ? 1 : 0.35 }}>
          <RoughLine x1={155} y1={38} x2={195} y2={86} seed={333} strokeWidth={2} />
          <RoughLine x1={285} y1={38} x2={245} y2={86} seed={334} strokeWidth={2} />
          <text x={322} y={50} fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
            input hopper
          </text>
          <RoughRect x={148} y={86} width={144} height={108} seed={335} fill="var(--color-sticky)" fillStyle="solid" />
          <RoughLine x1={292} y1={175} x2={340} y2={215} seed={337} strokeWidth={2} />
          <RoughLine x1={272} y1={192} x2={318} y2={230} seed={338} strokeWidth={2} />
          <text x={348} y={202} fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
            output chute
          </text>
        </motion.g>

        <AnimatePresence>
          {hasTape && (
            <motion.g initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
              <RoughRect x={175} y={76} width={90} height={26} seed={336} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
              <text x={220} y={94} textAnchor="middle" fontFamily="var(--font-code)" fontSize={14} fontWeight={700} fill="var(--color-ink)">
                greet
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {hasGear && <Gear cx={220} cy={140} turning={running} />}

        <AnimatePresence>
          {hasSlot && (
            <motion.text
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              x={220}
              y={182}
              textAnchor="middle"
              fontFamily="var(--font-code)"
              fontSize={11.5}
              fill="var(--color-ink-soft)"
            >
              slot: name
            </motion.text>
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

      <AnimatePresence>
        {input && (
          <motion.g
            key={input}
            initial={{ x: 220, y: 4, opacity: 0 }}
            animate={{ x: 220, y: 52, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <RoughRect x={-42} y={-14} width={84} height={28} seed={339} fill="var(--color-marker-teal)" fillStyle="solid" strokeWidth={1.5} />
            <text x={0} y={5} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={600} fill="var(--color-ink)">
              {input}
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
    heading: '(name) — the input slot',
    explain: (
      <>
        The <strong>input slot</strong> — the machine’s only door for stuff from outside. Whatever
        value the caller drops in will be known as <code>name</code> while the machine runs. (Rosa’s
        machine needs exactly one input: who just walked in.)
      </>
    ),
  },
  {
    key: 'body',
    spotlight: 'gear',
    heading: 'the body — the work',
    explain: (
      <>
        Between the braces lives the <strong>body</strong>: the actual work. Here it glues{' '}
        <code>"Hello, "</code> + the name + <code>"!"</code> and prints it. One crucial secret:{' '}
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

  const tok = (key: string, text: string) => (
    <button
      type="button"
      onClick={() => look(key)}
      className="cursor-pointer rounded-sm px-0.5 font-bold transition-colors"
      style={{
        background:
          active === key
            ? 'color-mix(in srgb, var(--color-marker-yellow) 55%, transparent)'
            : 'color-mix(in srgb, var(--color-marker-yellow) 18%, transparent)',
        textDecoration: visited[key] ? 'none' : 'underline dashed',
        textUnderlineOffset: 4,
      }}
    >
      {text}
    </button>
  )

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
              : `${ANATOMY.filter((p) => visited[p.key]).length} of 4 parts inspected — the dashed ones are still waiting.`}
          </p>
        </div>
        <GreetMachine
          hasTape
          hasSlot
          hasGear
          input={null}
          running={false}
          spotlight={activePart?.spotlight ?? null}
        />
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
  { key: 'tape', label: '🏷️ the name tape: greet', code: 'greet' },
  { key: 'slot', label: '📥 the input slot: name', code: 'name' },
  { key: 'gear', label: '⚙️ the work: print “Hello, ‹name›!”', code: 'console.log("Hello, " + name + "!");' },
] as const

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
            <Blank filled={Boolean(placed.gear)} text='console.log("Hello, " + name + "!");' width="20" />
            {'\n'}
            {'}'}
          </pre>
          <p className="font-hand text-xl">parts tray:</p>
          <div className="flex flex-col items-start gap-2">
            {PARTS.map((part) => (
              <InkButton
                id={`m31-part-${part.key}`}
                key={part.key}
                disabled={Boolean(placed[part.key])}
                onClick={() => setPlaced((s) => ({ ...s, [part.key]: true }))}
              >
                {placed[part.key] ? `✓ ${part.label}` : part.label}
              </InkButton>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <GreetMachine
            hasTape={Boolean(placed.tape)}
            hasSlot={Boolean(placed.slot)}
            hasGear={Boolean(placed.gear)}
            input={null}
            running={false}
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
  const rushDone = served.length === RUSH.length

  function tryPlain() {
    setShake((n) => n + 1)
    setTriedPlain(true)
  }

  function tryCall() {
    if (phase !== 'idle') return
    setPhase('dropping')
    setDropping('"Rosa"')
    window.setTimeout(() => {
      setServed(['Rosa'])
      setDropping(null)
      setPhase('rush')
    }, 700)
  }

  function serve(visitor: string) {
    if (dropping || served.includes(visitor)) return
    setDropping(`"${visitor}"`)
    window.setTimeout(() => {
      setServed((s) => {
        const next = [...s, visitor]
        if (next.length === RUSH.length + 1) onComplete()
        return next
      })
      setDropping(null)
    }, 650)
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
          <GreetMachine
            hasTape
            hasSlot
            hasGear
            input={dropping}
            running={dropping !== null}
            shake={shake}
          />
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
          No one touches a workbench before the knowledge transfer. Below is a finished blueprint
          for Rosa’s machine — real JavaScript. It has exactly <strong>four parts</strong>. Click
          each highlighted part of the code to learn what it is; watch which piece of the machine
          lights up.
        </p>
      ),
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
          Now you build. The frame is already on the bench — the word <code>function</code> and the
          braces <code>{'{ }'}</code>. Three holes in the blueprint, three parts in the tray: bolt
          each one in and watch the code and the machine grow <em>together</em>.
        </p>
      ),
      Interactive: AssembleChallenge,
      stuck: (
        <>
          Click the three parts-tray buttons in any order — each fills its blank in the code AND
          appears on the machine. When all three are in, look at the console under the machine and
          read Rosa’s reaction. The surprise (nothing printed!) is the lesson.
        </>
      ),
    },
    {
      id: 'm31-go',
      title: 'find the GO button',
      prompt: (
        <p>
          The machine is built — but it’s sitting there, off. Rosa steps up to test it. Two things
          you could type are below. <strong>Trying things is free in programming</strong> — worst
          case, you learn something. Make it greet her, then handle the morning rush.
        </p>
      ),
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
          Watching is easy — <strong>this shop pays for working code</strong>. Type the whole thing
          with your own fingers: definition, body, and two calls. Press RUN and the machine really
          executes what you wrote — the inspection tells you exactly what’s right and what isn’t.
        </p>
      ),
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
      kind: 'choice',
      question:
        'The engine reads a function definition — function tellJoke() { console.log("…") } — and moves on. What ran at that moment?',
      options: [
        'The body ran once, as a test',
        'Nothing in the body ran — the machine was built and stored under its name',
        'The body runs every time the engine re-reads the file',
      ],
      correctIndex: 1,
      why: 'Defining is construction, not execution. The engine stores the body and ties the name to it — the code inside waits, inert, until somebody calls. Define a function and never call it? Its body never runs at all.',
    },
    {
      kind: 'type-output',
      question: 'No options this time — type exactly what the console shows:',
      code: `function shout(word) {\n  console.log(word + "!");\n}\n\nshout("tools");`,
      accept: ['tools!'],
      why: 'The value "tools" drops into the slot called word, and the body glues a "!" onto it. (No quotes in the output — quotes live in code, not on the console.)',
    },
    {
      kind: 'choice',
      question: 'You have been calling a function since lesson 0.3. Which one?',
      options: [
        'let — it creates variables',
        'console.log — name, parentheses, a value dropped in: a machine',
        'The = sign',
      ],
      correctIndex: 1,
      why: 'console.log(...) has the full machine shape: a name, the GO-button parentheses, and a value in the hopper. let and = are keywords/operators, not functions. You were a function CALLER from day one — today you became a BUILDER.',
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
