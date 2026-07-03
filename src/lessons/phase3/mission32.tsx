import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { InkButton } from '../../design/InkButton'
import { CodePane } from '../../design/CodePane'
import { ConsolePane } from '../../design/ConsolePane'
import { StickyNote } from '../../design/StickyNote'
import { PredictionCard } from '../../engine/stepper/PredictionCard'
import { WhyCard } from '../../engine/mission/WhyCard'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { MissionDef } from '../../engine/mission/types'

/**
 * 3.2 — Parameters vs arguments · Machine Shop work order (BUILD JOB)
 * Marco's order-caller machine has TWO slots. The learner loads calls by hand
 * and discovers the machine matches values to slots purely by POSITION —
 * wrong order in, wrong shout out; a missing value quietly becomes undefined.
 */

const DEFINITION = `function callOut(customer, drink) {
  console.log(customer + ", your " + drink + " is ready!");
}`

function shoutFor(customer: string, drink: string | undefined) {
  return `${customer}, your ${drink} is ready!`
}

// ── the order-caller machine: two labeled slots ──────────────────────────

function Slot({ x, label, value }: { x: number; label: string; value: string | null }) {
  const isUndefined = value === 'undefined'
  return (
    <g>
      <text x={x + 54} y={78} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fontWeight={600} fill="var(--color-ink-soft)">
        {label}
      </text>
      <RoughRect
        x={x}
        y={86}
        width={108}
        height={40}
        seed={341 + x}
        fill={isUndefined ? 'color-mix(in srgb, var(--color-marker-coral) 30%, transparent)' : 'var(--color-paper, #fdf8ee)'}
        fillStyle="solid"
        strokeWidth={1.5}
      />
      <AnimatePresence mode="popLayout">
        {value ? (
          <motion.text
            key={value}
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            x={x + 54}
            y={111}
            textAnchor="middle"
            fontFamily="var(--font-code)"
            fontSize={12.5}
            fontWeight={600}
            fill={isUndefined ? 'var(--color-marker-coral)' : 'var(--color-ink)'}
          >
            {value}
          </motion.text>
        ) : (
          <text x={x + 54} y={111} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
            empty
          </text>
        )}
      </AnimatePresence>
    </g>
  )
}

function CafeMachine({ customer, drink }: { customer: string | null; drink: string | null }) {
  return (
    <svg viewBox="0 0 440 160" className="w-full">
      <RoughRect x={90} y={44} width={260} height={100} seed={342} fill="var(--color-sticky)" fillStyle="solid" />
      <RoughRect x={136} y={34} width={168} height={26} seed={343} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
      <text x={220} y={52} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill="var(--color-ink)">
        callOut
      </text>
      <Slot x={112} label="customer" value={customer} />
      <Slot x={228} label="drink" value={drink} />
      <text x={220} y={156} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
        slot 1 · slot 2 — in that order, always
      </text>
    </svg>
  )
}

/** The call being loaded, drawn as code with two visible positions. */
function CallStrip({ args }: { args: (string | null)[] }) {
  return (
    <p className="font-mono text-[15px]">
      callOut(
      <span className={args[0] ? 'font-bold' : 'text-ink-soft'}>{args[0] ? `"${args[0]}"` : ' ____ '}</span>
      ,{' '}
      <span className={args[1] ? 'font-bold' : 'text-ink-soft'}>{args[1] ? `"${args[1]}"` : ' ____ '}</span>)
    </p>
  )
}

// ── job step 1: load the slots, press GO ─────────────────────────────────

// Deliberately listed drink-first ("chai for Priya") — the tempting wrong order.
const CHIPS = ['chai', 'Priya']

function LoadChallenge({ onComplete }: { onComplete: () => void }) {
  const [args, setArgs] = useState<(string | null)[]>([null, null])
  const [ran, setRan] = useState(false)
  const [lines, setLines] = useState<string[]>([])
  const [failedOnce, setFailedOnce] = useState(false)
  const [solved, setSolved] = useState(false)

  const loaded = args.every(Boolean)
  const wrongOrder = ran && args[0] === 'chai'

  function addChip(chip: string) {
    if (ran || args.includes(chip)) return
    setArgs((a) => (a[0] === null ? [chip, a[1]] : [a[0], chip]))
  }

  function go() {
    if (!loaded || ran) return
    setRan(true)
    window.setTimeout(() => {
      setLines((l) => [...l, shoutFor(args[0]!, args[1]!)])
      if (args[0] === 'Priya') {
        setSolved(true)
        onComplete()
      } else {
        setFailedOnce(true)
      }
    }, 600)
  }

  function reset() {
    setArgs([null, null])
    setRan(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid items-start gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <CodePane code={DEFINITION} />
          <CallStrip args={args} />
          <div className="flex flex-wrap items-center gap-3">
            {CHIPS.map((chip) => (
              <InkButton id={`m32-chip-${chip}`} key={chip} disabled={ran || args.includes(chip)} onClick={() => addChip(chip)}>
                "{chip}"
              </InkButton>
            ))}
            <InkButton id="m32-go-1" variant="primary" disabled={!loaded || ran} onClick={go}>
              GO ▸
            </InkButton>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <CafeMachine customer={ran ? `"${args[0]}"` : null} drink={ran ? `"${args[1]}"` : null} />
          <ConsolePane lines={lines} />
        </div>
      </div>

      {wrongOrder && !solved && (
        <div className="flex flex-col gap-3">
          <p className="font-hand text-2xl">“…the whole café is laughing again.” — Marco</p>
          <WhyCard id="m32-why-wrong" tone="aha">
            <p>
              You dropped <code>"chai"</code> in first, so it landed in <strong>slot 1 —</strong>{' '}
              <code>customer</code>. The machine has no idea chai is a drink and Priya is a person.{' '}
              <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
                Values fill slots by position — first value, first slot. Nothing else matters.
              </HighlightMark>{' '}
              Clear it and load Priya first.
            </p>
          </WhyCard>
          <div>
            <InkButton id="m32-reset-1" onClick={reset}>
              clear the call, reload ↺
            </InkButton>
          </div>
        </div>
      )}

      {solved && (
        <WhyCard id="m32-why-right" tone="win">
          <p>
            “Priya, your chai is ready!” — perfect. Notice <em>why</em> it worked:{' '}
            <code>"Priya"</code> was first in the call, so it landed in the first slot,{' '}
            <code>customer</code>. The slots’ names are called <strong>parameters</strong>; the
            values you drop in are <strong>arguments</strong> — and the only thing connecting them
            is <em>position</em>.
            {failedOnce && (
              <>
                {' '}
                You saw the proof first-hand: same two values, opposite order, nonsense out.
              </>
            )}
          </p>
        </WhyCard>
      )}
    </div>
  )
}

// ── job step 2: Marco's scribbled ticket (predict, run, swap) ────────────

function TicketChallenge({ onComplete }: { onComplete: () => void }) {
  const [answered, setAnswered] = useState<number | undefined>(undefined)
  const [stage, setStage] = useState<'predict' | 'ran' | 'swapped' | 'done'>('predict')
  const [lines, setLines] = useState<string[]>([])

  const args = stage === 'swapped' || stage === 'done' ? ['Ben', 'coffee'] : ['coffee', 'Ben']
  const code = `${DEFINITION}\n\ncallOut("${args[0]}", "${args[1]}");`

  function go() {
    if (stage === 'predict' && answered !== undefined) {
      window.setTimeout(() => setLines((l) => [...l, shoutFor('coffee', 'Ben')]), 500)
      setStage('ran')
    } else if (stage === 'swapped') {
      window.setTimeout(() => {
        setLines((l) => [...l, shoutFor('Ben', 'coffee')])
        setStage('done')
        onComplete()
      }, 500)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid items-start gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <StickyNote id="m32-ticket" color="pink" className="max-w-56">
            <p className="font-hand text-xl leading-snug">
              ☕ order ticket, scribbled in a hurry:
              <br />
              <span className="text-2xl font-bold">“coffee — Ben”</span>
            </p>
          </StickyNote>
          <CodePane code={code} highlightLines={[5]} />
        </div>
        <div className="flex flex-col gap-3">
          <CafeMachine
            customer={stage === 'predict' ? null : `"${args[0]}"`}
            drink={stage === 'predict' ? null : `"${args[1]}"`}
          />
          <ConsolePane lines={lines} />
        </div>
      </div>

      {stage === 'predict' && (
        <div className="flex flex-col gap-3">
          <PredictionCard
            heading="🔮 Predict before you press GO:"
            prediction={{
              question:
                'Marco copied the ticket top to bottom: callOut("coffee", "Ben"). What will the machine shout?',
              options: [
                '“Ben, your coffee is ready!” — it can tell coffee is a drink',
                '“coffee, your Ben is ready!”',
                'An error — the values are in the wrong slots',
              ],
              correctIndex: 1,
              why: 'The machine can’t tell drinks from people — no error, no common sense. Whatever arrives first BECOMES the customer, because customer is slot 1. Position is the only rule there is.',
            }}
            answered={answered}
            onAnswer={setAnswered}
          />
          {answered !== undefined && (
            <div>
              <InkButton id="m32-go-2" variant="primary" onClick={go}>
                GO ▸
              </InkButton>
            </div>
          )}
        </div>
      )}

      {stage === 'ran' && (
        <div className="flex flex-col gap-3">
          <p className="font-hand text-2xl">“NOT AGAIN!” — Marco, hiding behind the espresso machine</p>
          <WhyCard id="m32-why-ticket" tone="aha">
            <p>
              The machine did <em>exactly</em> what it was told: first value → first slot. Garbage
              order in, garbage shout out — and no error anywhere, because to JavaScript nothing
              went wrong. The fix isn’t a smarter machine; it’s a caller who respects the slot
              order. Swap the two values.
            </p>
          </WhyCard>
          <div>
            <InkButton id="m32-swap" variant="primary" onClick={() => setStage('swapped')}>
              swap the two values ⇄
            </InkButton>
          </div>
        </div>
      )}

      {stage === 'swapped' && (
        <div>
          <InkButton id="m32-go-3" variant="primary" onClick={go}>
            GO again ▸
          </InkButton>
        </div>
      )}

      {stage === 'done' && (
        <WhyCard id="m32-why-fixed" tone="win">
          <p>
            “Ben, your coffee is ready!” — order restored. Remember what the fix was:{' '}
            <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-teal) 35%, transparent)">
              you didn’t change the machine, you changed the order of the arguments.
            </HighlightMark>{' '}
            When a function call misbehaves, checking the argument order is one of the first things
            real programmers (and testers!) do.
          </p>
        </WhyCard>
      )}
    </div>
  )
}

// ── job step 3: the forgotten drink (missing argument → undefined) ───────

function ForgotChallenge({ onComplete }: { onComplete: () => void }) {
  const [answered, setAnswered] = useState<number | undefined>(undefined)
  const [stage, setStage] = useState<'predict' | 'ran' | 'done'>('predict')
  const [lines, setLines] = useState<string[]>([])

  const code =
    stage === 'done'
      ? `${DEFINITION}\n\ncallOut("Aisha", "chai");`
      : `${DEFINITION}\n\ncallOut("Aisha");`

  function go() {
    if (answered === undefined || stage !== 'predict') return
    window.setTimeout(() => setLines((l) => [...l, shoutFor('Aisha', undefined)]), 500)
    setStage('ran')
  }

  function fix() {
    window.setTimeout(() => {
      setLines((l) => [...l, shoutFor('Aisha', 'chai')])
      setStage('done')
      onComplete()
    }, 500)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid items-start gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <CodePane code={code} highlightLines={[5]} />
        </div>
        <div className="flex flex-col gap-3">
          <CafeMachine
            customer={stage === 'predict' ? null : '"Aisha"'}
            drink={stage === 'predict' ? null : stage === 'ran' ? 'undefined' : '"chai"'}
          />
          <ConsolePane lines={lines} />
        </div>
      </div>

      {stage === 'predict' && (
        <div className="flex flex-col gap-3">
          <PredictionCard
            heading="🔮 Predict before you press GO:"
            prediction={{
              question:
                'Closing time. Marco’s ticket just says “Aisha” — no drink. The call is callOut("Aisha"): two slots, one value. What happens?',
              options: [
                'An error — the machine refuses to run with an empty slot',
                '“Aisha, your undefined is ready!”',
                'The machine waits until someone supplies a second value',
              ],
              correctIndex: 1,
              why: 'JavaScript quietly runs anyway. A slot that no value arrived in holds undefined — the very same “never set” value you met in lesson 1.7. No error, no waiting: just undefined, glued right into the sentence.',
            }}
            answered={answered}
            onAnswer={setAnswered}
          />
          {answered !== undefined && (
            <div>
              <InkButton id="m32-go-4" variant="primary" onClick={go}>
                GO ▸
              </InkButton>
            </div>
          )}
        </div>
      )}

      {stage === 'ran' && (
        <div className="flex flex-col gap-3">
          <WhyCard id="m32-why-undef" tone="aha">
            <p>
              There it is, in the flesh: the <code>drink</code> slot got nothing, so it holds{' '}
              <code>undefined</code> — lesson 1.7’s “never set” value, making its promised
              comeback. The machine didn’t crash and didn’t warn you; it just shouted nonsense.
              Silent <code>undefined</code>s exactly like this cause a huge share of real-world
              JavaScript bugs — you’ll hunt them for a living as a tester.
            </p>
          </WhyCard>
          <div>
            <InkButton id="m32-fix" variant="primary" onClick={fix}>
              hand it the missing "chai" and GO ▸
            </InkButton>
          </div>
        </div>
      )}

      {stage === 'done' && (
        <WhyCard id="m32-why-fixed-3" tone="win">
          <p>
            “Aisha, your chai is ready!” — and the shop closes on a good note. Two slots, two
            values, right order: that’s a healthy function call. One more thing worth noticing:
            each call today got <em>fresh, empty slots</em> — nothing left over from the call
            before. Keep that in your notebook; a spectacular exception is coming in work order
            3.7.
          </p>
        </WhyCard>
      )}
    </div>
  )
}

// ── job step 4: write a two-slot machine yourself, for real ──────────────

const PICKUP_EXERCISE: CodeExerciseDef = {
  id: 'm32-pickup',
  title: 'the bakery’s machine',
  task: 'The bakery two doors down wants Marco’s trick for pickup orders. Two slots this time — and the order of the slots is the whole lesson.',
  steps: [
    <>
      A function named <code>pickup</code> with TWO input slots: <code>customer</code> first, then{' '}
      <code>item</code>.
    </>,
    <>
      Each call prints <code>&lt;customer&gt;, your &lt;item&gt; is ready to pick up!</code> —
      built from the two slots, matching the expected output <em>exactly</em>.
    </>,
    <>
      Two orders to announce: Noor picking up bread, then Eli picking up cake. Remember Marco’s
      café — the <em>order of your arguments</em> decides which value lands in which slot.
    </>,
  ],
  starter: '// build the pickup machine here — two slots!\n\n\n// then GO for Noor’s bread and Eli’s cake\n',
  expectedOutput: ['Noor, your bread is ready to pick up!', 'Eli, your cake is ready to pick up!'],
  mustUse: [
    { test: /function\s+pickup\s*\(\s*\w+\s*,\s*\w+\s*\)/, label: 'defines pickup with two input slots' },
    { test: /pickup\s*\(\s*["']Noor["']\s*,\s*["']bread["']\s*\)/, label: 'calls pickup("Noor", "bread") — person first!' },
    { test: /pickup\s*\(\s*["']Eli["']\s*,\s*["']cake["']\s*\)/, label: 'calls pickup("Eli", "cake")' },
  ],
  mustNotUse: [
    {
      test: /console\.log\s*\(\s*["'](Noor|Eli),/,
      label: 'no fair typing the finished sentences by hand — the machine must build them from its two slots',
    },
  ],
  modelAnswer: `function pickup(customer, item) {
  console.log(customer + ", your " + item + " is ready to pick up!");
}

pickup("Noor", "bread");
pickup("Eli", "cake");`,
}

function WriteChallenge({ onComplete }: { onComplete: () => void }) {
  return <CodeExercise def={PICKUP_EXERCISE} onPass={onComplete} />
}

// ── the mission ───────────────────────────────────────────────────────────

export const mission32: MissionDef = {
  id: '3.2',
  jobType: 'build',
  workOrder: {
    customer: 'Marco — the corner café',
    request: (
      <>
        “When an order’s ready I shout the customer’s name and their drink: ‘Priya, your chai is
        ready!’ Yesterday in the rush I shouted ‘Chai, your Priya is ready!’ and the whole café
        laughed at me. Build me a machine that <em>never</em> mixes them up.”
      </>
    ),
  },
  challenges: [
    {
      id: 'm32-load',
      title: 'load the slots, press GO',
      prompt: (
        <p>
          Marco’s machine has <strong>two</strong> input slots: <code>customer</code> and{' '}
          <code>drink</code>. First order of the day: <em>chai for Priya</em>.
        </p>
      ),
      action: <>Load the call with the two chips, then press GO</>,
      Interactive: LoadChallenge,
      stuck: (
        <>
          Click the two value chips to fill the call’s two positions — the first chip you click
          lands in position 1, which pours into slot 1 (<code>customer</code>). For “chai for
          Priya” the <em>person</em> must go first: <code>callOut("Priya", "chai")</code>. If the
          shout comes out scrambled, hit “clear the call” and load Priya first.
        </>
      ),
    },
    {
      id: 'm32-ticket',
      title: 'Marco’s scribbled ticket',
      prompt: (
        <p>
          Rush hour. Marco copies the scribbled ticket into a call, top to bottom, without
          thinking.
        </p>
      ),
      action: <>Predict what the machine will shout — then press GO</>,
      Interactive: TicketChallenge,
      stuck: (
        <>
          Answer the prediction first (any answer unlocks GO — being wrong is useful!). Press GO
          and watch slot 1 swallow <code>"coffee"</code>. Then press “swap the two values” and GO
          again to ship the fix.
        </>
      ),
    },
    {
      id: 'm32-forgot',
      title: 'the forgotten drink',
      prompt: (
        <p>
          Closing time, one last ticket — and Marco only wrote the name. Two slots, one value.
        </p>
      ),
      action: <>Predict, press GO — then fix the call</>,
      Interactive: ForgotChallenge,
      stuck: (
        <>
          Pick a prediction answer, press GO, and watch the <code>drink</code> slot: nothing
          arrived, so it holds <code>undefined</code> and the shout glues that word right in. Then
          press the fix button to supply <code>"chai"</code> and run it properly.
        </>
      ),
    },
    {
      id: 'm32-write',
      title: 'now write one yourself',
      prompt: (
        <p>
          You’ve loaded Marco’s machine every way it can be loaded. The inspection checks your
          output, your syntax, <em>and</em> your argument order.
        </p>
      ),
      action: <>Write the two-slot machine yourself, then press RUN</>,
      Interactive: WriteChallenge,
      stuck: (
        <>
          Same shape as Marco’s: <code>function pickup(customer, item) {'{ … }'}</code> with one{' '}
          <code>console.log</code> inside gluing <code>customer + ", your " + item + " is ready to
          pick up!"</code>. Then two calls — person first, food second:{' '}
          <code>pickup("Noor", "bread");</code>. If inspection stays red, “show the answer”
          compares the master’s solution to yours line by line.
        </>
      ),
    },
  ],
  shelfItem: { emoji: '☕', label: 'callOut' },
  shopNotes: (
    <div className="grid items-start gap-4 md:grid-cols-3">
      <StickyNote id="m32-note-words" className="h-full">
        <p className="font-hand text-2xl font-bold">two words, owned ✍️</p>
        <p className="mt-1 text-[15px]">
          A <strong>parameter</strong> is a slot’s <em>name</em>, written once in the blueprint —{' '}
          <code>customer</code>, <code>drink</code>. An <strong>argument</strong> is the actual{' '}
          <em>value</em> dropped in at one call — <code>"Priya"</code>, <code>"chai"</code>.
          Parameters live in the definition; arguments arrive at GO time.
        </p>
      </StickyNote>
      <StickyNote id="m32-note-position" className="h-full">
        <p className="font-hand text-2xl font-bold">position is the only rule 🎯</p>
        <p className="mt-1 text-[15px]">
          First argument → first slot. Second → second. The engine never reads intentions. Too few
          arguments? The leftover slot holds <code>undefined</code> (lesson 1.7’s “never set”) —
          no crash, just confident nonsense. Too many? Extras quietly ignored. Testers get paid to
          catch exactly these.
        </p>
      </StickyNote>
      <StickyNote id="m32-note-fresh" color="pink" className="h-full">
        <p className="font-hand text-2xl font-bold">fresh slots, every call 🔄</p>
        <p className="mt-1 text-[15px]">
          Every call gets brand-new, empty slots — Priya’s order never lingered into Ben’s. Slots
          are born at the call and destroyed when it ends. Hold onto that: in work order{' '}
          <strong>3.7</strong> you’ll meet the spectacular exception — a machine that walks away{' '}
          <em>still carrying its slots</em>.
        </p>
      </StickyNote>
    </div>
  ),
  finalCheck: [
    {
      kind: 'type-output',
      question: 'No options — type exactly what the console shows:',
      code: `function tag(animal, sound) {\n  console.log(animal + " says " + sound);\n}\n\ntag("moo", "cow");`,
      accept: ['moo says cow'],
      why: 'Position, not meaning: "moo" arrived first so it landed in the animal slot, and "cow" fell into sound. The machine happily reports that moo says cow — no error, just an argument order the caller got backwards.',
    },
    {
      kind: 'choice',
      question: 'In the call callOut("Priya", "chai") — what is "chai"?',
      options: [
        'A parameter — it’s one of the machine’s slot names',
        'An argument — a value dropped into slot 2 for this one call',
        'The return value',
      ],
      correctIndex: 1,
      why: 'Arguments are the values that arrive at call time; parameters are the slot names in the definition (customer, drink). "chai" is a value arriving second, so it’s the argument that fills the second parameter.',
    },
  ],
  teachBack: {
    prompt:
      'Tomorrow’s apprentice asks: “parameter, argument — same thing, right?” Set them straight: explain the difference, and why callOut("coffee", "Ben") comes out wrong even though both values are right there.',
    modelAnswer:
      'Not the same thing! A parameter is a slot NAME written in the machine’s blueprint — callOut has two: customer and drink. An argument is the actual VALUE you drop in when you press GO, like "Priya" or "chai". The machine matches them by position only: the first argument pours into the first slot, the second into the second. That’s why callOut("coffee", "Ben") goes wrong — "coffee" arrives first, so it becomes the customer, and the machine shouts “coffee, your Ben is ready!” without any error, because the machine can’t know coffee isn’t a person. And if an argument is missing entirely, its slot quietly holds undefined — the “never set” value — which is why you always check the order and count of what you pass in.',
  },
  recap: [
    'Parameter = the slot’s NAME in the definition. Argument = the VALUE you drop in at one call.',
    'Matching is pure position: first argument → first slot. The machine never guesses meaning.',
    'A slot no value arrived in holds undefined — no error, just confident nonsense in the output.',
    'Every call gets fresh empty slots, wiped after. (The spectacular exception lives in 3.7…)',
  ],
}
