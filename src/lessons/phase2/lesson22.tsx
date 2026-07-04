import { AnimatePresence, motion } from 'motion/react'
import { RoughLine, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 2.2 — Truthy & falsy
 * Viz: the Boolean-izer — a funnel that converts ANY value into yes/no;
 * tokens land in the truthy or falsy bin.
 */

const CODE = `let username = "";
if (username) {
  console.log("Hello, " + username);
} else {
  console.log("Please log in");
}`

function Chip({ x, y, label, tone }: { x: number; y: number; label: string; tone: 'falsy' | 'truthy' | 'neutral' }) {
  const bg =
    tone === 'falsy'
      ? 'color-mix(in srgb, var(--color-marker-coral) 35%, var(--color-paper-raised))'
      : tone === 'truthy'
        ? 'color-mix(in srgb, var(--color-marker-teal) 35%, var(--color-paper-raised))'
        : 'var(--color-paper-raised)'
  const width = Math.max(46, label.length * 9 + 14)
  return (
    <g>
      <rect x={x - width / 2} y={y - 13} width={width} height={26} rx={9} fill={bg} stroke="var(--color-ink)" strokeWidth={1.4} />
      <text x={x} y={y + 5} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={600} fill="var(--color-ink)">
        {label}
      </text>
    </g>
  )
}

function BooleanizerViz({ stepIndex }: { stepIndex: number }) {
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      {/* the funnel */}
      <RoughLine x1={140} y1={30} x2={195} y2={85} seed={340} strokeWidth={2} />
      <RoughLine x1={300} y1={30} x2={245} y2={85} seed={341} strokeWidth={2} />
      <RoughLine x1={195} y1={85} x2={195} y2={110} seed={342} strokeWidth={2} />
      <RoughLine x1={245} y1={85} x2={245} y2={110} seed={343} strokeWidth={2} />
      <text x={220} y={22} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={18} fill="var(--color-ink-soft)">
        the Boolean-izer — any value goes in
      </text>

      {/* bins */}
      <RoughRect x={40} y={190} width={170} height={80} seed={344} stroke="var(--color-marker-coral)" />
      <text x={125} y={288} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={19} fontWeight={700} fill="var(--color-marker-coral)">
        falsy → “no”
      </text>
      <RoughRect x={235} y={190} width={170} height={80} seed={345} stroke="var(--color-marker-teal)" />
      <text x={320} y={288} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={19} fontWeight={700} fill="var(--color-marker-teal)">
        truthy → “yes”
      </text>

      {/* the falsy six */}
      <AnimatePresence>
        {stepIndex >= 1 && (
          <motion.g initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 16 }}>
            <Chip x={80} y={210} label="false" tone="falsy" />
            <Chip x={150} y={210} label="0" tone="falsy" />
            <Chip x={80} y={242} label={'""'} tone="falsy" />
            <Chip x={150} y={242} label="null" tone="falsy" />
            <Chip x={90} y={172} label="undefined" tone="falsy" />
            <Chip x={175} y={172} label="NaN" tone="falsy" />
          </motion.g>
        )}
      </AnimatePresence>

      {/* "" dropping through */}
      <AnimatePresence>
        {(stepIndex === 3 || stepIndex === 4) && (
          <motion.g
            initial={{ x: 220, y: 45 }}
            animate={stepIndex === 4 ? { x: 125, y: 140 } : { x: 220, y: 45 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <Chip x={0} y={0} label='username: ""' tone={stepIndex === 4 ? 'falsy' : 'neutral'} />
          </motion.g>
        )}
      </AnimatePresence>

      {/* the surprises */}
      <AnimatePresence>
        {stepIndex >= 5 && (
          <motion.g initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 15 }}>
            <Chip x={280} y={210} label='"0"' tone="truthy" />
            <Chip x={340} y={210} label='" "' tone="truthy" />
            <Chip x={300} y={242} label='"false"' tone="truthy" />
            <Chip x={370} y={242} label="-7" tone="truthy" />
            <text x={320} y={172} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-marker-coral)">
              ⚠ surprises live here
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

export const lesson22: LessonDef = {
  id: '2.2',
  hook: (
    <>
      <p>
        Yesterday’s fork demanded a boolean. But look at today’s code:{' '}
        <code>if (username)</code> — that’s a <em>string</em> in the condition slot, not a boolean!
        JavaScript doesn’t complain. Instead, when a condition demands yes/no, it converts{' '}
        <em>any</em> value into one. This is the third arena of coercion that lesson 1.9 promised —
        and the rule is beautifully simple:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-coral) 30%, transparent)">
          six values count as “no”; everything else counts as “yes.”
        </HighlightMark>
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'machine',
      caption:
        'Meet the Boolean-izer. Whenever a yes/no is demanded — an if condition, a ! operator — the machine drops the value through this funnel and out comes true or false. No error, no question asked. Your job: know which bin each value lands in.',
      highlightLines: [2],
    },
    {
      id: 'falsy-first-half',
      caption:
        'Memorize the entire “no” bin — there are only SIX falsy values. First three: false (obviously), 0, and "" (empty string).',
      highlightLines: [2],
    },
    {
      id: 'falsy-second-half',
      caption:
        'The other three: null, undefined, and NaN. Notice the theme — they’re all flavors of nothing: no, zero, no text, deliberate nothing, never-set, failed math. EVERYTHING else in the language is truthy.',
      highlightLines: [2],
    },
    {
      id: 'predict-empty',
      caption: 'Our username is "" — an empty string, fresh from an untouched login form. It drops into the funnel…',
      highlightLines: [1, 2],
      prediction: {
        question: 'username is "". Which message does the program print?',
        options: [
          '"Hello, " — the if branch runs with an empty name',
          '"Please log in" — "" is falsy, so the fork takes the else road',
          'An error — a string can’t be a condition',
        ],
        correctIndex: 1,
        why: '"" is one of the six falsy values, so if (username) becomes if (false) → the else road. And feel how natural the code reads: “if username… else ask them to log in.” Truthy/falsy exists exactly so conditions can read like that sentence.',
      },
    },
    {
      id: 'else',
      caption:
        '"" lands in the falsy bin, the traveler takes the else road: "Please log in". This is THE idiom — if (username) means “if we actually have a username”: not empty, not null, not undefined. One little condition guards against three kinds of missing at once.',
      highlightLines: [5],
    },
    {
      id: 'surprises',
      caption:
        'Now the trap door. These land in the TRUTHY bin and surprise everyone: "0" (a string with a character in it — not the number 0!) and " " (a space is a character too).',
      highlightLines: [2],
    },
    {
      id: 'surprises-more',
      caption:
        'Also truthy: "false" (five characters of text!) and every non-zero number, including negatives. The bin is decided by the six-item list — never by what the value “looks like.”',
      highlightLines: [2],
    },
    {
      id: 'wrap-explicit',
      caption: 'When you need the conversion explicitly — say, to store the yes/no — call Boolean(value).',
    },
    {
      id: 'wrap-precision',
      caption:
        'And when precision matters more than convenience, compare directly: username === "" says exactly what you mean. Idiom for flow, precision for logic.',
    },
  ],
  Viz: BooleanizerViz,
  underTheHood: (
    <>
      <p>
        The official mechanics: conditions perform <strong>boolean coercion</strong> — the same
        silent conversion family as lesson 1.9, aimed at true/false.
      </p>
      <p>
        The complete falsy list is specified in the language standard; it’s genuinely just those
        six (plus two exotic cousins you’ll never meet: <code>-0</code> and BigInt’s{' '}
        <code>0n</code>).
      </p>
      <p>
        This is why interviewers love the question “name the falsy values” — it’s a five-second
        test of whether someone knows the rulebook or just vibes.
      </p>
      <p>
        The tester angle is sharp here: truthy/falsy bugs are <em>silent</em>. A form that checks{' '}
        <code>if (quantity)</code> will treat a legitimate quantity of <code>0</code> as “missing”
        — the user typed zero, the code thought nothing was entered. No error is thrown; the
        program confidently walks the wrong road. These are exactly the bugs that only reveal
        themselves under deliberate test inputs — <code>0</code>, <code>""</code>, a lone space —
        which is why testers keep a mental list of “edge values” that starts suspiciously like the
        falsy list. You now own that list.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Careful, this one bites: type what Boolean("0") evaluates to.',
      accept: ['true'],
      placeholder: 'a value…',
      why: 'true! The falsy list contains the NUMBER 0 and the EMPTY string "" — but "0" is a non-empty string (one character aboard the train), so it’s truthy. The bin is decided by the list, not by looks.',
    },
    {
      kind: 'type-output',
      question: 'The user legitimately ordered zero items. Which function runs — type its name.',
      code: 'let items = 0;\nif (items) { ship(); } else { askAgain(); }',
      accept: ['askAgain', 'askAgain()', 'askagain'],
      placeholder: 'function name…',
      why: 'askAgain() — the classic silent truthy/falsy bug: 0 is a perfectly meaningful quantity, but it’s falsy, so if (items) can’t tell “zero” from “nothing entered.” The fix is precision: if (items !== undefined). Test inputs like 0 and "" exist to smoke out exactly this.',
    },
    {
      kind: 'type-output',
      question: 'How many falsy values are there in the everyday list? Type the number.',
      accept: ['6', 'six', 'Six'],
      placeholder: 'a number…',
      why: 'Six — false, 0, "", null, undefined, NaN — fixed by the language standard; everything else is truthy. Small enough to memorize, and worth it: this list is a favorite interview quickie and a tester’s edge-case checklist in disguise.',
    },
  ],
  teachBack: {
    prompt:
      'Explain truthy/falsy to a friend: what does the machine do when an if gets a non-boolean, which six values mean “no”, and what’s the sneaky bug with checking if (quantity)?',
    modelAnswer:
      'When an if condition gets something that isn’t a boolean, JavaScript silently converts it: every value counts as either “yes” (truthy) or “no” (falsy). The falsy list is exactly six values — false, 0, "" (empty string), null, undefined, and NaN — all flavors of nothing. Everything else is truthy, including surprises like "0" and " " (they’re non-empty strings). This makes code read nicely — if (username) means “if we have a username” — but it hides a classic bug: if (quantity) treats a legitimate 0 as “missing”, because 0 is falsy. When an exact check matters, compare precisely (quantity !== undefined) instead of leaning on the funnel.',
  },
  recap: [
    'Conditions Boolean-ize any value: six falsy values — false, 0, "", null, undefined, NaN — everything else is truthy.',
    'Surprises: "0", " ", and "false" are truthy strings. The list decides, not the looks.',
    'if (username) is idiomatic “if we have one” — but 0 being falsy makes if (quantity) a silent bug. Testers probe with 0, "", and a space on purpose.',
  ],
}
