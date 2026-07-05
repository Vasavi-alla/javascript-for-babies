import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughEllipse, RoughRect } from '../../design/rough-svg'
import { StickyNote } from '../../design/StickyNote'
import { InkButton } from '../../design/InkButton'
import { CodePane } from '../../design/CodePane'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 1.11 — Checkpoint: the Mad Libs machine
 * Everything from Phase 1 in one small program — then the learner builds
 * their own with real values, and takes it to a real browser console.
 */

const CODE = `const hero = "Ada";
const place = "Chennai";
let power = 9000;
power = power + 1;
console.log(\`\${hero} of \${place} has power \${power}!\`);`

function CheckpointScene({ stepIndex }: { stepIndex: number }) {
  const power = stepIndex >= 1 ? '9001' : '9000'
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      <text x={250} y={30} fontFamily="var(--font-hand)" fontSize={20} fill="var(--color-ink-soft)">
        memory
      </text>

      {/* hero (const) */}
      <text x={30} y={70} fontFamily="var(--font-hand)" fontSize={22} fontWeight={700} fill="var(--color-ink)">
        hero 🔒
      </text>
      <HandArrow from={{ x: 115, y: 62 }} to={{ x: 175, y: 62 }} curve={0.12} seed={300} />
      <RoughRect x={182} y={35} width={120} height={54} seed={301} />
      <text x={242} y={68} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fill="var(--color-ink)">
        "Ada"
      </text>

      {/* place (const) */}
      <text x={30} y={140} fontFamily="var(--font-hand)" fontSize={22} fontWeight={700} fill="var(--color-ink)">
        place 🔒
      </text>
      <HandArrow from={{ x: 118, y: 132 }} to={{ x: 175, y: 132 }} curve={0.12} seed={302} />
      <RoughRect x={182} y={105} width={120} height={54} seed={303} />
      <text x={242} y={138} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fill="var(--color-ink)">
        "Chennai"
      </text>

      {/* power (let, reassigned) */}
      <text x={30} y={210} fontFamily="var(--font-hand)" fontSize={22} fontWeight={700} fill="var(--color-ink)">
        power
      </text>
      <HandArrow from={{ x: 110, y: 202 }} to={{ x: 175, y: 202 }} curve={0.12} seed={304} />
      <RoughRect x={182} y={175} width={120} height={54} seed={305} />
      <AnimatePresence mode="popLayout">
        <motion.g key={power} initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ type: 'spring', damping: 15 }}>
          <RoughEllipse cx={242} cy={202} width={84} height={38} seed={power === '9000' ? 306 : 307} fill="var(--color-marker-yellow)" />
          <text x={242} y={209} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={20} fontWeight={700} fill="var(--color-ink)">
            {power}
          </text>
        </motion.g>
      </AnimatePresence>

      {/* the story rolls out */}
      <AnimatePresence>
        {stepIndex >= 3 && (
          <motion.g initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 16 }}>
            <RoughRect x={30} y={252} width={385} height={40} seed={308} fill="var(--color-sticky)" fillStyle="solid" strokeWidth={1.5} />
            <text x={45} y={277} fontFamily="var(--font-code)" fontSize={12.5} fill="var(--color-ink)">
              › Ada of Chennai has power 9001!
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

/** The learner's own Mad Libs machine. */
function MadLibsBuilder() {
  const [hero, setHero] = useState('')
  const [place, setPlace] = useState('')
  const [power, setPower] = useState('9000')
  const [generated, setGenerated] = useState<{ code: string; story: string } | null>(null)

  const canBuild = hero.trim() !== '' && place.trim() !== '' && /^\d+$/.test(power.trim())

  const build = () => {
    const heroValue = hero.trim()
    const placeValue = place.trim()
    const powerValue = Number(power.trim())
    const code = `const hero = "${heroValue}";
const place = "${placeValue}";
let power = ${powerValue};
power = power + 1;
console.log(\`\${hero} of \${place} has power \${power}!\`);`
    const story = `${heroValue} of ${placeValue} has power ${powerValue + 1}!`
    setGenerated({ code, story })
  }

  const field = 'border-ink-soft/50 bg-paper-raised font-code rounded border border-dashed px-2 py-1.5 text-[13px] outline-none focus:border-ink'

  return (
    <StickyNote id="madlibs-builder" className="w-full max-w-2xl">
      <p className="font-hand text-2xl font-semibold">🏗️ Build YOUR Mad Libs machine</p>
      <p className="mt-1 text-[15px]">
        Choose your values — the app writes the program, exactly as you would. Then comes the real
        challenge below.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[15px]">
        <label>hero:</label>
        <input value={hero} onChange={(e) => setHero(e.target.value)} placeholder="your name?" className={field} size={12} />
        <label>place:</label>
        <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="your city?" className={field} size={12} />
        <label>power (a number):</label>
        <input value={power} onChange={(e) => setPower(e.target.value)} className={field} size={7} />
        <InkButton id="madlibs-build" variant="primary" disabled={!canBuild} onClick={build}>
          write my program
        </InkButton>
      </div>
      {!canBuild && power.trim() !== '' && !/^\d+$/.test(power.trim()) && (
        <p className="text-marker-coral mt-2 text-sm">
          power must be digits only — remember, "9000" in quotes would GLUE instead of add (lesson 1.9)!
        </p>
      )}
      {generated && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex flex-col gap-3">
          <CodePane code={generated.code} />
          <div>
            <span className="font-hand text-xl">and when it runs: </span>
            <code className="bg-paper-raised rounded px-2 py-1 text-[13px]">› {generated.story}</code>
          </div>
          <div className="border-ink-soft/40 border-t border-dashed pt-3 text-[15px]">
            <p className="font-hand text-xl font-semibold">🎓 The real graduation:</p>
            <ol className="mt-1 list-decimal pl-5">
              <li>
                On a computer: press F12 in this very browser → open the Console tab. (On iPad
                there’s no console — save this step for the next time you’re at a computer.)
              </li>
              <li>Type your five lines yourself (typos welcome — you can read errors now).</li>
              <li>
                Then break it on purpose: try reassigning hero. Read the TypeError like the old
                friend it is.
              </li>
            </ol>
          </div>
        </motion.div>
      )}
    </StickyNote>
  )
}

export const lesson111: LessonDef = {
  id: '1.11',
  hook: (
    <>
      <p>
        Checkpoint time. No new concepts — instead, one five-line program that uses{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-teal) 35%, transparent)">
          everything you’ve learned in Phase 1
        </HighlightMark>
        : const and let, a reassignment, strings, a template literal, and the evaluate-first rule.
        First we watch it run. Then you build your own. Then — for real — you type it into an
        actual browser console with your own hands.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'consts',
      caption:
        'Lines 1–2: two const declarations. Narrate along: box borrowed, string placed, label welded on (🔒 — these never change). You can draw this in your sleep now, which is exactly the point of a checkpoint.',
      highlightLines: [1, 2],
    },
    {
      id: 'reassign',
      caption:
        'Lines 3–4: power is a let — because it changes. The read-change-store pattern from lesson 1.3: right side first (9000 + 1 → 9001), then the swap. It’s over 9000.',
      highlightLines: [3, 4],
    },
    {
      id: 'predict-story',
      caption: 'Line 5 is one template literal with three slots. What exactly comes out?',
      highlightLines: [5],
      prediction: {
        question: 'What exactly does line 5 print?',
        options: [
          '${hero} of ${place} has power ${power}! — literally',
          'Ada of Chennai has power 9001!',
          'An error — const variables can’t be used inside templates',
        ],
        correctIndex: 1,
        why: 'Backticks switch the slots on (lesson 1.6): each ${…} is EVALUATED — labels followed, boxes opened — and the results are spliced into the train. hero → "Ada", place → "Chennai", power → 9001 (the reassigned value!). const variables can absolutely be READ anywhere; const only forbids reassigning them.',
      },
    },
    {
      id: 'slots-walk',
      caption:
        'Watch the slots fill, one by one: ${hero} — label followed, box opened, "Ada" spliced in. ${place} — "Chennai". ${power} — 9001, the RE-ASSIGNED value, because a slot reads the box as it is NOW.',
      highlightLines: [5],
    },
    {
      id: 'story',
      caption:
        'And there’s the story, built from three boxes and a template. Count what this little program used: declarations, const vs let, reassignment, numbers, strings, template slots, evaluation order, and the label-following that happens every time a name appears. That’s the entire phase, in five lines.',
      highlightLines: [5],
    },
    {
      id: 'coercion-trap',
      caption:
        'One character could have ruined it: had line 3 been let power = "9000" — in quotes — line 4’s + would GLUE instead of add: "90001". The 1.9 trap lives everywhere form data goes. Now scroll down — it’s your turn.',
      highlightLines: [3, 4],
    },
  ],
  Viz: CheckpointScene,
  underTheHood: (
    <>
      <p>
        Why a silly story generator, of all things? Because “Mad Libs” is secretly the shape of an
        enormous amount of real software: <em>fixed template + variable data = output</em>. A
        welcome email is a Mad Lib (<code>`Hi ${'{name}'}, your order ${'{id}'} shipped`</code>). A
        web page is a Mad Lib filled with database values. And — here’s your future — a test
        report is a Mad Lib: <code>`Expected ${'{expected}'} but received ${'{actual}'}`</code>.
        You just practiced the fundamental move of generating output from data.
      </p>
      <p>
        Checkpoint advice, honestly meant. If any step above felt foggy, go re-run that lesson{' '}
        <em>now</em>, while the gap is small and cheap. Foggy means: you could not have predicted
        the output, or the 🔒 needed explaining. The phases ahead assume this one is solid, the
        way a building assumes its foundation. There is zero shame in a second pass. There is
        only expensive confusion in skipping it. (Your teach-back journal is your own textbook —
        reread yourself!)
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'If line 3 used const instead of let, line 4 (the reassignment) would halt the program. Type the error’s NAME.',
      accept: ['TypeError'],
      placeholder: 'SomethingError…',
      why: 'TypeError: Assignment to constant variable. The professional default is const UNTIL a reassignment is needed (lesson 1.4) — and line 4 needs one, so let is the honest choice for a value that varies.',
    },
    {
      kind: 'type-output',
      question: 'If line 3 were let power = "9000" (in quotes), type what line 4 (power = power + 1) would make power:',
      accept: ['90001', '"90001"'],
      why: 'The + meets a string → coercion glues (lesson 1.9): "9000" + 1 → "90001". One pair of quotes turns a power-up into a five-digit typo. This is the exact bug shape that leaks out of form inputs in real apps — and that your future tests will catch.',
    },
    {
      kind: 'type-output',
      question: 'Type the exact string `${2 + 3}` produces:',
      accept: ['5'],
      why: 'The slot runs the full evaluate-first machinery: 2 + 3 becomes 5, then gets spliced into the train. Any expression works — ${power + 1}, ${hero.toUpperCase()}. Ordinary quotes would have printed the slot literally; backticks switch the slots on.',
    },
  ],
  teachBack: {
    prompt:
      'The grand tour: walk a friend through ALL five lines of the Mad Libs program — what the machine does at each line, using every picture you’ve collected (boxes, labels, locks, trains, slots).',
    modelAnswer:
      'Lines 1–2: the machine borrows two memory boxes, puts the strings "Ada" and "Chennai" inside, and ties on the labels hero and place — welded (const), so they can never point elsewhere. Line 3: another box for power, holding the number 9000, with an ordinary let label since it will change. Line 4: reassignment — the right side is evaluated first using the current value (9000 + 1 = 9001), then 9001 replaces 9000 in the same box. Line 5: a template literal — the machine walks the text, and at each ${…} slot it evaluates: follows the label, opens the box, splices the value into the character train. Out comes "Ada of Chennai has power 9001!" — printed to the console, where only developers see it. Five lines: boxes, values, labels, a lock, a swap, and a train with filled slots. That’s Phase 1.',
  },
  recap: [
    'Template + data = output. That shape — Mad Libs — is welcome emails, web pages, and every test failure message you’ll ever write.',
    'The five-line tour used it all: const locks, let for change, right-side-first reassignment, and ${…} slots evaluated into the string.',
    'Phase 1 complete. 🎉 If anything felt foggy, re-run that lesson now — Phase 2 (decisions & loops) builds directly on these boxes.',
  ],
  PlayExtra: MadLibsBuilder,
}
