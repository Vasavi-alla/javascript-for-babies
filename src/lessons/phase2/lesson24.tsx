import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughEllipse } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'
import { JobScene, Scene, Takeaway, Key, ReviewCard } from '../../design/JobScene'

/**
 * 2.4 — Ternary & short-circuit
 * Viz: a condition diamond picking between two VALUE tokens; then the
 * || default rail and the && guard rail.
 */

const CODE = `let age = 20;
let label = age >= 18 ? "adult" : "minor";
console.log(label);
let nickname = "" || "Anonymous";
console.log(nickname);
let user = null;
console.log(user && user.name);`

function TernaryScene({ stepIndex }: { stepIndex: number }) {
  // steps 0–1: ternary picker; 2–3: || rail; 4–5: && guard
  if (stepIndex <= 1) {
    const picked = stepIndex >= 1
    return (
      <svg viewBox="0 0 440 280" className="w-full">
        <text x={40} y={30} fontFamily="var(--font-hand)" fontSize={19} fill="var(--color-ink-soft)">
          a fork that hands you a VALUE
        </text>
        <RoughEllipse cx={220} cy={80} width={170} height={50} seed={400} fill="var(--color-sticky)" fillStyle="solid" />
        <text x={220} y={86} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={600} fill="var(--color-ink)">
          age &gt;= 18 ?
        </text>
        <g opacity={1}>
          <RoughEllipse cx={120} cy={175} width={110} height={44} seed={401} fill={picked ? 'var(--color-marker-teal)' : undefined} />
          <text x={120} y={182} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={600} fill="var(--color-ink)">
            "adult"
          </text>
        </g>
        <g opacity={picked ? 0.3 : 1}>
          <RoughEllipse cx={320} cy={175} width={110} height={44} seed={402} />
          <text x={320} y={182} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={600} fill="var(--color-ink)">
            "minor"
          </text>
        </g>
        <HandArrow from={{ x: 185, y: 105 }} to={{ x: 135, y: 148 }} seed={403} stroke={picked ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} />
        <HandArrow from={{ x: 255, y: 105 }} to={{ x: 305, y: 148 }} seed={404} stroke="var(--color-ink-soft)" />
        <AnimatePresence>
          {picked && (
            <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 15 }}>
              <HandArrow from={{ x: 120, y: 200 }} to={{ x: 120, y: 232 }} seed={405} stroke="var(--color-marker-teal)" />
              <text x={140} y={252} fontFamily="var(--font-hand)" fontSize={18} fontWeight={700} fill="var(--color-ink)">
                label gets "adult"
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    )
  }
  if (stepIndex <= 4) {
    const resolved = stepIndex >= 3
    return (
      <svg viewBox="0 0 440 280" className="w-full">
        <text x={40} y={30} fontFamily="var(--font-hand)" fontSize={19} fill="var(--color-ink-soft)">
          || — take the first truthy VALUE
        </text>
        <RoughEllipse cx={110} cy={100} width={90} height={44} seed={410} fill={resolved ? 'var(--color-marker-coral)' : undefined} />
        <text x={110} y={107} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={600} fill="var(--color-ink)">
          ""
        </text>
        <text x={110} y={145} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-marker-coral)">
          {resolved ? 'falsy → move on' : ''}
        </text>
        <text x={200} y={106} textAnchor="middle" fontFamily="var(--font-code)" fontSize={20} fontWeight={700} fill="var(--color-ink)">
          ||
        </text>
        <RoughEllipse cx={310} cy={100} width={150} height={44} seed={411} fill={resolved ? 'var(--color-marker-teal)' : undefined} />
        <text x={310} y={107} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={600} fill="var(--color-ink)">
          "Anonymous"
        </text>
        <AnimatePresence>
          {resolved && (
            <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 15 }}>
              <HandArrow from={{ x: 310, y: 125 }} to={{ x: 310, y: 165 }} seed={412} stroke="var(--color-marker-teal)" />
              <text x={190} y={192} fontFamily="var(--font-hand)" fontSize={18} fontWeight={700} fill="var(--color-ink)">
                nickname gets "Anonymous"
              </text>
              <text x={40} y={240} fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-ink-soft)">
                the whole || expression BECOMES one of its sides —
              </text>
              <text x={40} y={262} fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-ink-soft)">
                not a manufactured true/false
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 440 280" className="w-full">
      <text x={40} y={30} fontFamily="var(--font-hand)" fontSize={19} fill="var(--color-ink-soft)">
        && — the guard rail
      </text>
      <RoughEllipse cx={110} cy={100} width={100} height={44} seed={420} fill="var(--color-marker-coral)" />
      <text x={110} y={107} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={600} fill="var(--color-ink)">
        null
      </text>
      <text x={200} y={106} textAnchor="middle" fontFamily="var(--font-code)" fontSize={20} fontWeight={700} fill="var(--color-ink)">
        &&
      </text>
      <g opacity={0.3}>
        <RoughEllipse cx={315} cy={100} width={140} height={44} seed={421} />
        <text x={315} y={107} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={600} fill="var(--color-ink)">
          user.name
        </text>
      </g>
      <text x={315} y={145} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
        never touched — no crash!
      </text>
      <HandArrow from={{ x: 110, y: 125 }} to={{ x: 110, y: 165 }} seed={422} stroke="var(--color-marker-coral)" />
      <text x={130} y={190} fontFamily="var(--font-hand)" fontSize={18} fontWeight={700} fill="var(--color-ink)">
        result: null (the falsy side itself)
      </text>
      <text x={40} y={240} fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-ink-soft)">
        && stops at the first falsy — which here is exactly
      </text>
      <text x={40} y={262} fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-ink-soft)">
        what saves us from reading .name of null
      </text>
      {stepIndex >= 6 && (
        <text x={220} y={222} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fontWeight={700} fill="var(--color-marker-teal)">
          taste: ternaries for small either/or — two ?s deep means use if/else
        </text>
      )}
    </svg>
  )
}

export const lesson24: LessonDef = {
  id: '2.4',
  hook: (
    <>
      <p>
        if/else decides which code <em>runs</em>. But often you just need to decide which{' '}
        <em>value</em> to use — “adult or minor?”, “their nickname or a default?”. For that,
        JavaScript has decisions that are <em>expressions</em>: the{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          ternary operator
        </HighlightMark>
        .
      </p>
      <p>
        And a secret lesson 1.10 already whispered: <code>||</code> and <code>&&</code> don’t
        return manufactured booleans, they return one of their own sides. Today that secret becomes
        two of the most-used idioms in all of JavaScript.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'ternary',
      caption:
        'Line 2, read aloud: “age at least 18? then "adult", otherwise "minor".” Anatomy: condition ? valueIfTrue : valueIfFalse. It’s a fork — but instead of choosing a road, it chooses a VALUE, and the whole expression becomes that value.',
      highlightLines: [2],
    },
    {
      id: 'pick',
      caption:
        'age >= 18 → true → the expression becomes "adult", which flows straight into label. One line replaced four lines of if/else. That’s the ternary’s whole job: small value choices, inline. (The name: it’s the only operator in JavaScript that takes THREE operands — “ternary” like “binary”, but three.)',
      highlightLines: [2, 3],
    },
    {
      id: 'predict-default',
      caption: 'Line 4 uses || in a way that looks odd after lesson 1.10: assigning it to a variable. What ends up in nickname?',
      highlightLines: [4],
      prediction: {
        question: 'let nickname = "" || "Anonymous"; — what ends up in nickname?',
        options: [
          'true — || produces a boolean',
          '"Anonymous" — || hands back the first truthy VALUE it meets',
          '"" — the left side always wins',
        ],
        correctIndex: 1,
        why: 'The honest disclosure from 1.10, now in action: || evaluates left to right and returns the first TRUTHY value itself (not true/false!). "" is falsy (lesson 2.2’s list), so || moves on and hands back "Anonymous". This is THE default-value idiom — you’ll read it a thousand times.',
      },
    },
    {
      id: 'default-idiom',
      caption:
        'nickname gets "Anonymous" — a fallback in one line. One caution, straight from lesson 2.2: || treats ALL falsy values as “missing”, so a legitimate 0 or "" gets replaced too.',
      highlightLines: [4, 5],
    },
    {
      id: 'nullish-coalescing',
      caption:
        'Modern JavaScript added ?? (nullish coalescing) for exactly that: it falls back ONLY on null/undefined, letting 0 and "" through. Prefer ?? when zero is a real answer.',
      highlightLines: [4, 5],
    },
    {
      id: 'guard',
      caption:
        'Lines 6–7: the && guard. user is null — and reading user.name from null would CRASH (a TypeError you can now read). But && short-circuits at the first falsy: null && anything stops immediately, returns null, and user.name is never touched. The falsy value itself is the result; the danger zone is never entered.',
      highlightLines: [6, 7],
    },
    {
      id: 'taste',
      caption:
        'Taste rules, honestly: ternaries shine for small either/or values and die horribly when nested — if you need two ?s, use if/else.',
    },
    {
      id: 'modern-cousins',
      caption:
        'The || default and && guard idioms are everywhere in real code; modern code often upgrades them to ?? and ?. (optional chaining — Phase 8), but you must read the originals fluently first. Now you do.',
    },
  ],
  Viz: TernaryScene,
  underTheHood: (
    <>
      <p>
        The deep idea unifying this lesson: <strong>expressions compose</strong>. A ternary is an
        expression, so it can live anywhere a value can. Inside a template slot (
        <code>{'`'}You are ${'{age >= 18 ? "in" : "out"}'}{'`'}</code>). Inside an argument.
        Inside another expression. Statements (if/else) cannot do that — they do not{' '}
        <em>become</em> anything. Knowing which tool produces a value and which performs an
        action is a quiet superpower for reading code.
      </p>
      <p>
        The exact return rules, for reference: <code>a || b</code> → a if a is truthy, else b.{' '}
        <code>a && b</code> → a if a is <em>falsy</em>, else b. <code>a ?? b</code> → a unless a is
        null/undefined, else b.
      </p>
      <p>
        All three short-circuit: the right side isn’t just ignored — it’s <em>never evaluated</em>,
        side effects and all.
      </p>
      <p>
        <strong style={{ color: 'var(--color-marker-coral)' }}>Fun fact:</strong> the{' '}
        <code>?:</code> operator is older than almost everything you have learned. It comes from
        the C language (1972) — JavaScript borrowed its syntax from C wholesale: braces,
        semicolons, for loops, switch… and this. The <code>??</code> operator is the opposite:
        one of the newest things in this curriculum, added to JavaScript in 2020. A 48-year age
        gap, between two operators that sit three lines apart in our code.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type the value of fee:',
      code: 'let age = 3;\nlet fee = age < 5 ? 0 : 100;',
      accept: ['0'],
      placeholder: 'a value…',
      why: '3 < 5 → true → the expression becomes the FIRST value, 0. Note the order: condition ? whenTrue : whenFalse — swapping the two values is the classic ternary typo (and a lovely test case).',
    },
    {
      kind: 'type-output',
      question: 'The user deliberately chose volume 0. Type what setting ends up as:',
      code: 'let volume = 0;\nlet setting = volume || 50;',
      accept: ['50'],
      placeholder: 'a value…',
      why: '50 — || can’t tell “missing” from “legitimately zero”: 0 is falsy, so the default fires and stomps the user’s choice. volume ?? 50 would keep the 0 (?? only falls back on null/undefined). The 2.2 quantity bug, wearing a default-value costume.',
    },
    {
      kind: 'type-output',
      question: 'Same guard, new data: type what 0 && "pizza" evaluates to.',
      accept: ['0'],
      placeholder: 'a value…',
      why: '0 — && returns its FIRST falsy side and never evaluates past it. "pizza" is never even looked at. That stop-at-falsy behavior is exactly what made user && user.name crash-proof in the lesson. (Modern cousin: user?.name — Phase 8.)',
    },
  ],
  onTheJob: (
    <JobScene>
      <Scene>One day, you will read test code like this:</Scene>
      <ReviewCard
        file="login.spec.js"
        lines={[
          { text: 'const timeout = config.timeout ?? 30000;' },
          { text: 'if (element && element.click()) { ... }' },
        ]}
      />
      <Takeaway>
        Real test code reads like <Key>short sentences once you know ?? and &&</Key>.
      </Takeaway>
    </JobScene>
  ),
  teachBack: {
    prompt:
      'Explain to a friend: how does a ternary differ from if/else, and how do the || default and && guard idioms work — including the 0-gets-stomped trap and which operator fixes it?',
    modelAnswer:
      'if/else chooses which code runs; a ternary chooses which VALUE an expression becomes — condition ? valueIfTrue : valueIfFalse — so you can put the decision right where the value is needed. The idioms come from a secret of || and &&: they return one of their own sides, not true/false. a || b hands back the first truthy value, which makes name || "Anonymous" a one-line default — but it treats EVERY falsy value as missing, so a legitimate 0 or "" gets replaced too; the newer ?? operator fixes that by falling back only on null/undefined. a && b stops at the first falsy side and returns it, which makes user && user.name a guard: when user is null, the crash-prone user.name is never even evaluated.',
  },
  recap: [
    'Ternary = a fork that yields a VALUE: condition ? whenTrue : whenFalse. Great inline, terrible nested.',
    '|| returns the first truthy VALUE (default idiom) — but stomps legit 0/"" ; ?? only falls back on null/undefined.',
    '&& returns the first falsy side and never evaluates past it — the guard idiom that makes crashes unreachable.',
  ],
}
