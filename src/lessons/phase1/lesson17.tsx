import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughEllipse, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 1.7 — Booleans, null & undefined
 * Viz: three boxes — a boolean, an empty never-touched box (undefined),
 * and a box holding a deliberate "nothing" token (null).
 */

const CODE = `let loggedIn = true;
console.log(10 > 3);
let nickname;
console.log(nickname);
let middleName = null;`

function NothingScene({ stepIndex }: { stepIndex: number }) {
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      {/* loggedIn: a boolean box */}
      <text x={30} y={62} fontFamily="var(--font-hand)" fontSize={22} fontWeight={700} fill="var(--color-ink)">
        loggedIn
      </text>
      <HandArrow from={{ x: 130, y: 55 }} to={{ x: 185, y: 55 }} curve={0.12} seed={211} />
      <RoughRect x={192} y={22} width={100} height={62} seed={212} />
      <RoughEllipse cx={242} cy={53} width={70} height={36} seed={213} fill="var(--color-marker-teal)" />
      <text x={242} y={60} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={20} fontWeight={700} fill="var(--color-ink)">
        true
      </text>

      {/* comparison factory */}
      <AnimatePresence>
        {stepIndex === 1 && (
          <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 15 }} style={{ transformOrigin: '360px 53px' }}>
            <RoughRect x={310} y={26} width={118} height={54} seed={214} fill="var(--color-sticky)" fillStyle="solid" strokeWidth={1.5} />
            <text x={369} y={48} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">
              10 &gt; 3
            </text>
            <text x={369} y={68} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)">
              → true
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* nickname: undefined */}
      <AnimatePresence>
        {stepIndex >= 2 && (
          <motion.g initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 16 }}>
            <text x={30} y={155} fontFamily="var(--font-hand)" fontSize={22} fontWeight={700} fill="var(--color-ink)">
              nickname
            </text>
            <HandArrow from={{ x: 130, y: 148 }} to={{ x: 185, y: 148 }} curve={0.12} seed={215} />
            <RoughRect x={192} y={115} width={100} height={62} seed={216} />
            <text x={242} y={152} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-ink-soft)" opacity={0.8}>
              (empty)
            </text>
            {stepIndex >= 4 && (
              <text x={310} y={152} fontFamily="var(--font-code)" fontSize={13} fill="var(--color-ink-soft)">
                › undefined
              </text>
            )}
          </motion.g>
        )}
      </AnimatePresence>

      {/* middleName: null */}
      <AnimatePresence>
        {stepIndex >= 5 && (
          <motion.g initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 16 }}>
            <text x={30} y={248} fontFamily="var(--font-hand)" fontSize={22} fontWeight={700} fill="var(--color-ink)">
              middleName
            </text>
            <HandArrow from={{ x: 155, y: 241 }} to={{ x: 185, y: 241 }} curve={0.12} seed={217} />
            <RoughRect x={192} y={208} width={100} height={62} seed={218} />
            <RoughEllipse cx={242} cy={239} width={54} height={34} seed={219} fill="var(--color-marker-coral)" />
            <text x={242} y={246} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={19} fontWeight={700} fill="var(--color-ink)">
              ∅
            </text>
            <text x={310} y={236} fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
              a deliberate “nothing”,
            </text>
            <text x={310} y={256} fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
              placed on purpose
            </text>
          </motion.g>
        )}
      </AnimatePresence>
      {stepIndex === 6 && (
        <text x={30} y={296} fontFamily="var(--font-hand)" fontSize={14.5} fontWeight={700} fill="var(--color-marker-teal)">
          undefined = never set · null = deliberately empty
        </text>
      )}
      {stepIndex >= 7 && (
        <text x={30} y={296} fontFamily="var(--font-hand)" fontSize={14.5} fontWeight={700} fill="var(--color-marker-coral)">
          gotcha: typeof null → "object" — the permanent 1995 bug
        </text>
      )}
    </svg>
  )
}

export const lesson17: LessonDef = {
  id: '1.7',
  hook: (
    <>
      <p>
        Three small values, three big jobs. <code>true</code> and <code>false</code> — the boolean
        pair — will power every decision your programs ever make. And then JavaScript has{' '}
        <em>two</em> different ways of saying “nothing”:{' '}
        <HighlightMark type="underline" color="var(--color-marker-coral)">undefined</HighlightMark>{' '}
        and <HighlightMark type="underline" color="var(--color-marker-coral)">null</HighlightMark>.
        Two nothings sounds absurd — until you see that they answer two different questions, and
        that telling them apart is a daily skill in test automation.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'boolean',
      caption:
        'Line 1: a boolean in its box. The boolean type has exactly two values in the whole universe — true and false. No “maybe”, no “mostly”. It exists to answer yes/no questions.',
      highlightLines: [1],
    },
    {
      id: 'factory',
      caption:
        'And here’s where booleans come from: line 2 asks 10 > 3, and the machine EVALUATES it (that rule again!) into the value true. Every comparison is a little boolean factory. In Phase 2, these answers will steer your programs around forks in the road.',
      highlightLines: [2],
    },
    {
      id: 'declare-empty',
      caption:
        'Line 3 is legal and strange: let nickname; — a declaration with no value. The machine does its dance: box borrowed, label tied… but nothing was placed inside. An empty box, never touched.',
      highlightLines: [3],
    },
    {
      id: 'predict-undefined',
      caption: 'So what happens when line 4 opens that empty box?',
      highlightLines: [4],
      prediction: {
        question: 'nickname was declared but never given a value. What does console.log(nickname) print?',
        options: [
          'ReferenceError — nickname doesn’t exist',
          'undefined — the box exists, but nothing was ever put in it',
          'An empty text: ""',
        ],
        correctIndex: 1,
        why: 'The label exists in the machine’s table (so no ReferenceError — compare lesson 1.2’s quiz!), but the box was never filled. For that, JavaScript has a special value: undefined, meaning “never set.” It’s not an error and not empty text — it’s the machine’s way of saying “nobody ever put anything here.”',
      },
    },
    {
      id: 'undefined',
      caption:
        'undefined — the machine’s own word for “never set.” Important: you rarely WRITE undefined yourself. It appears on its own, as a signal — and when you see it unexpectedly, it usually means some assignment you thought happened… didn’t. A clue, not a crime.',
      highlightLines: [4],
    },
    {
      id: 'null',
      caption:
        'Line 5 is different in spirit: middleName = null. Here a PERSON chose to store “nothing” — this user simply has no middle name, and the code says so explicitly. null is deliberate, meaningful emptiness.',
      highlightLines: [5],
    },
    {
      id: 'two-nothings',
      caption:
        'Side by side now: undefined answers “nobody ever set this” — the machine’s nothing. null answers “deliberately left empty” — the programmer’s nothing. Two different answers to two different questions.',
      highlightLines: [3, 5],
    },
    {
      id: 'typeof-null',
      caption:
        'One famous crook before you go: ask typeof null and the machine answers "object". That’s flatly wrong — a 1995 bug that can never be fixed, because too much of the web depends on it. The full story waits below; interviewers adore it.',
      highlightLines: [5],
    },
  ],
  Viz: NothingScene,
  underTheHood: (
    <>
      <p>
        The clean mental model: <strong>undefined is the machine’s nothing; null is the
        programmer’s nothing.</strong>
      </p>
      <p>
        undefined shows up uninvited in a few predictable places: a declared-but-unassigned
        variable (you just saw it), a function that returns nothing (Phase 3), a missing property
        on an object or an off-the-end array position (both Phase 4).
      </p>
      <p>
        null never appears on its own — if you see null, a human (or an API — the way your code
        asks another program, often a server, for data) put it there to say “this field is
        intentionally empty.”
      </p>
      <p>
        <span style={{ color: 'var(--color-marker-coral)', fontWeight: 700 }}>Gotcha! </span>
        Ask the machine <code>typeof null</code> and it answers… <code>"object"</code>. That is
        flatly wrong — null is its own primitive type — and it’s one of the most famous bugs in
        computing history: it slipped into the very first JavaScript engine in 1995, and by the
        time anyone could fix it, too many programs depended on it. It will never be fixed. Interviewers
        adore this question; now you have the story, not just the trivia.
      </p>
      <p>
        Why testers care, concretely: API responses are full of nulls (
        <code>"middleName": null</code> means the field exists and is deliberately empty), while
        undefined typically means a field is <em>missing entirely</em> — and “empty on purpose”
        versus “forgot to include it” are different bugs with different fixes. Your future
        assertions will distinguish the two constantly.
      </p>
      <p>
        One preview for lesson 1.9, where you’ll meet JavaScript’s two ways of asking “are these
        equal?”: the loose way (written <code>==</code>) considers the two nothings equal —{' '}
        <code>null == undefined</code> is true — while the strict way (<code>===</code>) knows
        better: <code>null === undefined</code> is false.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type exactly what prints:',
      code: 'let score;\nconsole.log(score);',
      accept: ['undefined'],
      why: 'Declared = the label exists, so no ReferenceError. Never assigned = the box is empty, so the machine reports undefined. (It is NOT 0 — JavaScript never invents a default number for you.)',
    },
    {
      kind: 'type-output',
      question: 'JavaScript has two “nothings.” A profile field the person deliberately left empty should hold which one? Type it.',
      accept: ['null'],
      placeholder: 'one of the two nothings…',
      why: 'null — the programmer’s nothing, a purposeful statement of emptiness (like "spouse": null in an API response). A field that was never set at all would read as undefined instead. Distinguishing the two is bread-and-butter API testing.',
    },
    {
      kind: 'type-output',
      question: 'What value does the expression 5 === 4 produce? Type it.',
      accept: ['false'],
      placeholder: 'a value…',
      why: 'A comparison never errors just because the answer is no — it EVALUATES to the boolean false, a perfectly good value you can store, print, or hand to an if. Comparisons are boolean factories.',
    },
  ],
  teachBack: {
    prompt:
      'Explain to a friend: why does JavaScript have TWO kinds of “nothing”, and how would you decide whether a nothing you found is undefined or null territory?',
    modelAnswer:
      'JavaScript’s two nothings answer different questions. undefined is the machine’s nothing — it appears automatically when something was never set: a variable declared without a value, a missing field, a function that returned nothing. null is the programmer’s nothing — a human deliberately stored “empty” to say “this is intentionally blank,” like a person with no middle name. So when you meet a nothing: if nobody ever filled the box, it’s undefined; if someone filled it with an on-purpose blank, it’s null. In testing this matters constantly — an API field that’s null (deliberately empty) versus missing (undefined) are two different situations, and often two different bugs.',
  },
  recap: [
    'boolean = exactly two values, true and false — and every comparison (10 > 3) is a factory that produces one.',
    'undefined = the machine’s nothing: “never set.” It appears by itself, as a signal — you rarely write it.',
    'null = the programmer’s nothing: deliberately stored emptiness. And typeof null === "object" is a famous, permanent 1995 bug — great interview story.',
  ],
}
