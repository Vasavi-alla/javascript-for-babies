import { useState } from 'react'
import { motion } from 'motion/react'
import { RoughEllipse, RoughRect } from '../../design/rough-svg'
import { StickyNote } from '../../design/StickyNote'
import { InkButton } from '../../design/InkButton'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 2.8 — Checkpoint: FizzBuzz, visualized
 * The famous interview question, with every gate decision animated —
 * plus an interactive explorer.
 */

const CODE = `for (let i = 1; i <= 15; i++) {
  if (i % 15 === 0) {
    console.log("FizzBuzz");
  } else if (i % 3 === 0) {
    console.log("Fizz");
  } else if (i % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}`

function fizzbuzz(n: number): string {
  if (n % 15 === 0) return 'FizzBuzz'
  if (n % 3 === 0) return 'Fizz'
  if (n % 5 === 0) return 'Buzz'
  return String(n)
}

function chipColor(value: string): string | undefined {
  if (value === 'FizzBuzz') return 'var(--color-marker-coral)'
  if (value === 'Fizz') return 'var(--color-marker-teal)'
  if (value === 'Buzz') return 'var(--color-marker-yellow)'
  return undefined
}

// which i the viz walks through, per step
const WALK: Array<number> = [0, 3, 5, 15, 15, 15, 15]

function FizzBuzzGates({ stepIndex }: { stepIndex: number }) {
  const n = WALK[stepIndex] ?? 0
  const showRun = stepIndex >= 6
  if (showRun) {
    return (
      <svg viewBox="0 0 440 300" className="w-full">
        <text x={40} y={30} fontFamily="var(--font-hand)" fontSize={19} fill="var(--color-ink-soft)">
          the full run, 1 → 15
        </text>
        {Array.from({ length: 15 }, (_, k) => {
          const value = fizzbuzz(k + 1)
          const col = k % 5
          const row = Math.floor(k / 5)
          return (
            <g key={k}>
              <RoughRect x={40 + col * 78} y={50 + row * 66} width={66} height={50} seed={520 + k} fill={chipColor(value)} strokeWidth={1.5} />
              <text x={73 + col * 78} y={80 + row * 66} textAnchor="middle" fontFamily="var(--font-code)" fontSize={value.length > 4 ? 9 : 13} fontWeight={600} fill="var(--color-ink)">
                {value}
              </text>
            </g>
          )
        })}
        <text x={40} y={272} fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-ink-soft)">
          the rhythm: every 3rd teal, every 5th yellow, every 15th coral
        </text>
      </svg>
    )
  }
  const gates = [
    { label: 'i % 15 === 0 ?', pass: n % 15 === 0, out: '"FizzBuzz"' },
    { label: 'i % 3 === 0 ?', pass: n % 3 === 0, out: '"Fizz"' },
    { label: 'i % 5 === 0 ?', pass: n % 5 === 0, out: '"Buzz"' },
  ]
  let stopped = false
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      <text x={40} y={30} fontFamily="var(--font-hand)" fontSize={19} fill="var(--color-ink-soft)">
        {n === 0 ? 'the gate corridor (from lesson 2.3)' : `walking i = ${n} through the gates`}
      </text>
      {n > 0 && (
        <g>
          <RoughEllipse cx={60} cy={80} width={56} height={40} seed={530} fill="var(--color-marker-yellow)" />
          <text x={60} y={87} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={20} fontWeight={700} fill="var(--color-ink)">
            {n}
          </text>
        </g>
      )}
      {gates.map((gate, idx) => {
        const y = 70 + idx * 62
        const reached = n > 0 && !stopped
        const won = reached && gate.pass
        const verdict = !reached ? undefined : gate.pass ? 'yes' : 'no'
        if (won) stopped = true
        return (
          <g key={idx} opacity={n > 0 && !reached ? 0.3 : 1}>
            <RoughRect x={130} y={y} width={160} height={44} seed={532 + idx} fill={won ? 'var(--color-marker-teal)' : undefined} />
            <text x={210} y={y + 27} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={600} fill="var(--color-ink)">
              {gate.label}
            </text>
            {verdict === 'yes' && (
              <text x={305} y={y + 27} fontFamily="var(--font-hand)" fontSize={17} fontWeight={700} fill="var(--color-marker-teal)">
                yes → {gate.out} ✓
              </text>
            )}
            {verdict === 'no' && (
              <text x={305} y={y + 27} fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-marker-coral)">
                no ↓
              </text>
            )}
          </g>
        )
      })}
      <g opacity={n > 0 && stopped ? 0.3 : 1}>
        <RoughRect x={130} y={256} width={160} height={40} seed={536} />
        <text x={210} y={281} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">
          else → print i
        </text>
      </g>
    </svg>
  )
}

/** Interactive FizzBuzz explorer. */
function FizzBuzzExplorer() {
  const [limit, setLimit] = useState('30')
  const [rows, setRows] = useState<string[] | null>(null)
  const parsed = Number(limit)
  const valid = Number.isInteger(parsed) && parsed >= 1 && parsed <= 100

  return (
    <StickyNote id="fizzbuzz-explorer" className="w-full max-w-2xl">
      <p className="font-hand text-2xl font-semibold">🎛️ Run the machine yourself</p>
      <p className="mt-1 text-[15px]">
        Pick how far to count (1–100) and watch the rhythm emerge — Fizz every 3rd, Buzz every 5th,
        FizzBuzz where the rhythms collide.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <label className="text-[15px]">count to:</label>
        <input
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="border-ink-soft/50 bg-paper-raised font-code w-20 rounded border border-dashed px-2 py-1.5 text-[13px] outline-none focus:border-ink"
        />
        <InkButton id="fizzbuzz-run" variant="primary" disabled={!valid} onClick={() => setRows(Array.from({ length: parsed }, (_, k) => fizzbuzz(k + 1)))}>
          run the loop
        </InkButton>
      </div>
      {rows && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex flex-wrap gap-1.5">
          {rows.map((value, k) => (
            <span
              key={k}
              className="font-code rounded px-2 py-0.5 text-[12px] font-semibold"
              style={{
                background: chipColor(value) ?? 'var(--color-paper-raised)',
                border: '1.5px solid var(--color-ink)',
              }}
            >
              {value}
            </span>
          ))}
        </motion.div>
      )}
      <div className="border-ink-soft/40 mt-4 border-t border-dashed pt-3 text-[15px]">
        <p className="font-hand text-xl font-semibold">🎓 The real graduation:</p>
        <p className="mt-1">
          Open your browser console (F12) and write FizzBuzz from scratch — no peeking at the code
          above. Then the twist interviewers love: change it to print “Jazz” for multiples of 7.
          Where does the new gate go, and why? (Think 21. Think 35. Think 105.)
        </p>
      </div>
    </StickyNote>
  )
}

export const lesson28: LessonDef = {
  id: '2.8',
  hook: (
    <>
      <p>
        Checkpoint — and not just any exercise:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          FizzBuzz
        </HighlightMark>{' '}
        is the most famous interview question in software. The rules: count from 1 to 15; for
        multiples of 3 say “Fizz”, multiples of 5 say “Buzz”, multiples of BOTH say “FizzBuzz”,
        otherwise the number. Sounds trivial. Contains a trap that catches real candidates every
        single day. You already own every tool it needs.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'corridor',
      caption:
        'The solution: a for-machine (lesson 2.6) around a gate corridor (lesson 2.3), with the remainder operator % (lesson 1.5) asking “divisible?” — i % 3 === 0 means “dividing by 3 leaves nothing over.” Familiar parts, new song.',
      highlightLines: [1, 2],
    },
    {
      id: 'walk-3',
      caption:
        'Walk i = 3 through the corridor: %15 gate says no (3 leaves remainder 3)… %3 gate says YES → "Fizz", corridor over. First true wins, later gates never checked — the 2.3 rule doing its job.',
      highlightLines: [4, 5],
    },
    {
      id: 'walk-5',
      caption: 'i = 5: past the %15 gate (no), past the %3 gate (no, remainder 2), the %5 gate says YES → "Buzz".',
      highlightLines: [6, 7],
    },
    {
      id: 'predict-order',
      caption:
        'Now THE trap. i = 15 is divisible by 3 AND 5 AND 15. Our corridor checks %15 first. But suppose someone “simplifies” and puts the %3 gate FIRST. Predict what happens to 15.',
      highlightLines: [2, 4],
      prediction: {
        question: 'If the gates were ordered %3, %5, %15 — what would print for i = 15?',
        options: [
          '"FizzBuzz" — 15 is divisible by 15, so that gate still catches it',
          '"Fizz" — the %3 gate grabs 15 first, and the FizzBuzz branch becomes unreachable dead code',
          'An error — 15 matches multiple gates',
        ],
        correctIndex: 1,
        why: 'First true wins: 15 % 3 === 0 is true, so "Fizz" prints and the corridor ends — the %15 gate below is never consulted, for ANY number, ever. No error, no warning: the program runs happily and is simply wrong. This exact mistake — most specific condition not placed first — is why FizzBuzz filters candidates. You just passed.',
      },
    },
    {
      id: 'why-15',
      caption:
        'So the specific gate goes first: %15 catches “divisible by both” (3 × 5 = 15 — a number divisible by both 3 and 5 is exactly a multiple of 15). Order = logic, exactly as lesson 2.3 warned.',
      highlightLines: [2, 3],
    },
    {
      id: 'why-15-alt',
      caption:
        'The alternative spelling you’ll also see: i % 3 === 0 && i % 5 === 0 — same gate, using 1.10’s &&.',
      highlightLines: [2, 3],
    },
    {
      id: 'full-run',
      caption:
        'And the full run, 1 to 15 — see the rhythm: teal every 3rd, yellow every 5th, coral where the rhythms collide. One for-machine, one corridor, one % operator: everything Phase 2 taught, in twelve lines. Now scroll down and drive it yourself.',
      highlightLines: [1],
    },
  ],
  Viz: FizzBuzzGates,
  underTheHood: (
    <>
      <p>
        Why do interviewers adore something this small? Because FizzBuzz quietly tests four things
        at once: loop mechanics, the % operator, condition <em>ordering</em> (the trap), and
        whether you check your own edges (does 15 actually print FizzBuzz? does 1 print 1?). That
        last habit — <strong>picking the inputs that would expose the bug</strong> — is literally
        the tester’s craft.
      </p>
      <p>
        The values worth checking here: 1 (plain), 3 (Fizz), 5 (Buzz), 15 (the collision), and 0 or
        negative if the range ever changes. Choosing revealing inputs like that has a name you’ll
        meet formally in Phase 9: boundary testing.
      </p>
      <p>
        The dead-code failure mode deserves respect: a mis-ordered FizzBuzz never crashes, never
        warns — it just silently never says FizzBuzz. Software is full of exactly this: branches
        that can’t be reached, conditions that can’t be false, tests that can’t fail (the most
        dangerous kind!). None of them announce themselves. The instinct you practiced today —
        “walk a specific value through the gates and see which one grabs it” — is the manual
        version of what code-coverage tools automate, and it will serve you in every code review
        of your career.
      </p>
      <p>
        <strong style={{ color: 'var(--color-marker-coral)' }}>Fun fact:</strong> FizzBuzz began
        as a British children’s counting game (kids in a circle, replacing numbers with words,
        giggling at whoever slips). It entered programming lore in 2007, when developer Imran Ghory
        suggested it for screening candidates and blogger Jeff Atwood amplified it in a famous post
        titled “Why Can’t Programmers.. Program?” — reporting that a surprising share of applicants
        with impressive CVs couldn’t write it. Two decades later it’s still asked daily around the
        world — and still filtering — mostly on the exact gate-order trap you just sidestepped.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type what 12 % 5 gives:',
      accept: ['2'],
      placeholder: 'a number…',
      why: '% gives the remainder (lesson 1.5): 5 fits into 12 twice (=10), leaving 2 over. Remainder ZERO would mean “divides cleanly” — the %-equals-zero idiom is the standard “divisible by” test, and it powers every FizzBuzz gate.',
    },
    {
      kind: 'type-output',
      question: 'A broken FizzBuzz puts the %3 gate BEFORE the %15 gate. Type exactly what it prints for the number 15:',
      accept: ['Fizz', 'fizz'],
      placeholder: 'the exact word…',
      why: 'Fizz — the corridor stops at the first true (lesson 2.3), and 15 passes the %3 test too, so the looser gate steals it. The FizzBuzz branch is silently dead code. Most-specific-first is the rule, and this is its most famous illustration.',
    },
    {
      kind: 'type-output',
      question: 'You may test a FizzBuzz implementation with ONE single input. Type the number most likely to expose the classic bug.',
      accept: ['15', '30', '45', '60', '75', '90'],
      placeholder: 'a number…',
      why: 'A multiple of BOTH — 15 is the smallest. The mis-ordered version handles 3, 5 and 7 flawlessly; it only betrays itself on collision cases, printing "Fizz" instead of "FizzBuzz". One well-chosen input beats twenty lucky ones: that’s boundary thinking, the heart of test design.',
    },
  ],
  teachBack: {
    prompt:
      'The interview simulation: explain your FizzBuzz solution out loud — the loop, the % trick, and WHY the %15 gate must come first (prove it with the number 15).',
    modelAnswer:
      'I loop i from 1 to 15 with a for loop. Each lap, a chain of gates decides the output, using the remainder operator: i % n === 0 means i divides cleanly by n, i.e., it’s a multiple. The critical decision is gate ORDER: the chain stops at the first true, and every multiple of 15 is also a multiple of 3 and of 5 — so if the %3 gate came first, the number 15 would match it, print "Fizz", and the FizzBuzz branch would be unreachable dead code, silently. So the most specific check — %15, meaning divisible by both — must stand first, then %3, then %5, then the else prints the number itself. To verify any implementation, I’d feed it 15: the mis-ordered version passes every other small number and betrays itself only there.',
  },
  recap: [
    'FizzBuzz = for-machine + gate corridor + the % divisibility idiom (i % n === 0). Everything Phase 2 taught, twelve lines.',
    'The trap is gate ORDER: most specific first (%15), or the FizzBuzz branch becomes silent dead code. One input — 15 — exposes it.',
    'Phase 2 complete! 🎉 Your programs now choose and repeat. Next: Phase 3 — functions, the heart of JavaScript.',
  ],
  PlayExtra: FizzBuzzExplorer,
}
