import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'
import { JobScene, Scene, Takeaway, Key, ReviewCard } from '../../design/JobScene'

/**
 * 8.4 — ES6+ grab bag: ?. and ??
 * Pays off 2.4's flagged promise. The undefined-property crash; ?. as the
 * guarded dot (short-circuit stops the whole chain); ?? as the honest
 * default (null/undefined only — 0 and "" survive); the ?.+?? pair; and a
 * FLAG-level peek at iterators (why for...of works on so many things).
 */

const CODE = `const user = { name: "Ada", pet: { name: "Rex" } };

// user.cat.name   ← TypeError! program dead
console.log(user.pet?.name);
console.log(user.cat?.name);

const volume = 0;
console.log(volume || 50);
console.log(volume ?? 50);

const label = user.cat?.name ?? "no pet";
console.log(label);`

interface ChainBox {
  label: string
  status: 'ok' | 'missing' | 'crash' | 'skipped' | 'value'
}
interface View {
  mode: 'chain' | 'defaults' | 'iter'
  chain?: ChainBox[]
  rayStopsAt?: number
  defaultsHot?: 'or' | 'nullish' | null
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'chain',
    chain: [{ label: 'user', status: 'ok' }, { label: '.cat → undefined', status: 'missing' }, { label: '.name 💥', status: 'crash' }],
    console: [],
    note: 'undefined has no properties — asking it for .name kills the whole program',
  },
  {
    mode: 'chain',
    chain: [{ label: 'user', status: 'ok' }, { label: '.cat → undefined', status: 'missing' }, { label: '.name 💥', status: 'crash' }],
    console: [],
    note: 'the dot needs an object on its left — the SECOND hop is the killer, not the first',
    badge: 'TypeError: Cannot read properties of undefined — the most-seen error message in all of JavaScript',
  },
  {
    mode: 'chain',
    chain: [{ label: 'user', status: 'ok' }, { label: '?.pet ✓', status: 'ok' }, { label: '.name → "Rex"', status: 'value' }],
    console: ['Rex'],
    note: 'when the left side IS an object, ?. behaves exactly like the plain dot',
  },
  {
    mode: 'chain',
    chain: [{ label: 'user', status: 'ok' }, { label: '?.cat ⛔ stop', status: 'missing' }, { label: '.name (never runs)', status: 'skipped' }],
    rayStopsAt: 1,
    console: ['Rex', 'undefined'],
    note: 'the ray STOPS at cat: answer undefined, chain abandoned — no crash, nothing after runs',
  },
  {
    mode: 'chain',
    chain: [{ label: 'user', status: 'ok' }, { label: '?.cat ⛔ stop', status: 'missing' }, { label: '.name (never runs)', status: 'skipped' }],
    rayStopsAt: 1,
    console: ['Rex', 'undefined'],
    note: 'use ?. where absence is NORMAL — never as armor on every dot',
    badge: 'a?.b?.c on data that SHOULD exist turns honest crashes into silent undefineds — bugs love the dark',
  },
  {
    mode: 'defaults', defaultsHot: 'or',
    console: ['Rex', 'undefined', '50'],
    note: '|| asks “falsy?” — and 0 IS falsy (1.8): the user’s deliberate volume gets stolen',
  },
  {
    mode: 'defaults', defaultsHot: 'nullish',
    console: ['Rex', 'undefined', '50', '0'],
    note: '?? asks only “null or undefined?” — 0 is a real value, so 0 survives',
  },
  {
    mode: 'chain',
    chain: [{ label: 'user.cat?.name', status: 'missing' }, { label: '→ undefined', status: 'skipped' }, { label: '?? "no pet"', status: 'value' }],
    console: ['Rex', 'undefined', '50', '0', 'no pet'],
    note: 'the pair: ?. turns a would-be crash into undefined, and ?? catches exactly that',
  },
  {
    mode: 'iter',
    console: ['Rex', 'undefined', '50', '0', 'no pet'],
    note: 'grab-bag flag: for...of works on ALL of these because each carries an ITERATOR — a standard plug',
    badge: 'its official name: Symbol.iterator. You can even make your own objects loopable. A preview, not homework.',
  },
  {
    mode: 'defaults', defaultsHot: null,
    console: ['Rex', 'undefined', '50', '0', 'no pet'],
    note: 'your modern reading kit: crash-proof lookups (?.) + honest defaults (??)',
    badge: 'you’ll type “?? and ?.” more than almost any feature from this phase — every API response has optional fields',
  },
]

function ShortCircuitRay({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'chain' && view.chain && (
        <g>
          <text x={24} y={34} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the lookup chain, hop by hop
          </text>
          {view.chain.map((box, i) => {
            const color =
              box.status === 'crash' ? 'var(--color-marker-coral)'
              : box.status === 'missing' ? 'var(--color-marker-coral)'
              : box.status === 'skipped' ? 'var(--color-ink-soft)'
              : box.status === 'value' ? 'var(--color-marker-teal)'
              : 'var(--color-ink)'
            return (
              <g key={i} opacity={box.status === 'skipped' ? 0.45 : 1}>
                <RoughRect x={30 + i * 136} y={64} width={120} height={54} seed={1601 + i} strokeWidth={2} stroke={color} roughness={box.status === 'crash' ? 2.6 : 1.4} fill={box.status === 'value' ? 'color-mix(in srgb, var(--color-marker-teal) 10%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
                <text x={90 + i * 136} y={95} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink)">{box.label}</text>
                {i < view.chain!.length - 1 && (
                  <text x={152 + i * 136} y={95} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">→</text>
                )}
              </g>
            )
          })}
          {typeof view.rayStopsAt === 'number' && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <HandArrow from={{ x: 40, y: 150 }} to={{ x: 96 + view.rayStopsAt * 136, y: 124 }} curve={-0.2} seed={1610} stroke="var(--color-marker-teal)" strokeWidth={2.2} />
              <text x={60} y={172} fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)">
                the ray stops HERE — answer: undefined
              </text>
            </motion.g>
          )}
        </g>
      )}

      {view.mode === 'defaults' && (
        <g>
          <text x={24} y={34} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            two defaults, two different questions
          </text>
          {[
            { key: 'or', expr: 'volume || 50', q: 'is volume FALSY?', verdict: '0 is falsy → replaced', out: '50', color: 'var(--color-marker-coral)' },
            { key: 'nullish', expr: 'volume ?? 50', q: 'is volume null / undefined?', verdict: '0 is a real value → kept', out: '0', color: 'var(--color-marker-teal)' },
          ].map((row, i) => {
            const hot = view.defaultsHot === row.key
            return (
              <g key={row.key} opacity={view.defaultsHot && !hot ? 0.4 : 1}>
                <RoughRect x={30} y={56 + i * 78} width={380} height={64} seed={1620 + i} strokeWidth={hot ? 2.6 : 1.6} stroke={row.color} fill={hot ? `color-mix(in srgb, ${row.color} 8%, transparent)` : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
                <text x={48} y={82 + i * 78} fontFamily="var(--font-code)" fontSize={12} fontWeight={700} fill="var(--color-ink)">{row.expr}</text>
                <text x={48} y={104 + i * 78} fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-ink-soft)">{row.q}  ·  {row.verdict}</text>
                <text x={392} y={92 + i * 78} textAnchor="end" fontFamily="var(--font-code)" fontSize={16} fontWeight={700} fill={row.color}>{row.out}</text>
              </g>
            )
          })}
        </g>
      )}

      {view.mode === 'iter' && (
        <g>
          <text x={24} y={34} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            everything for...of can walk
          </text>
          {[
            { label: '[1, 2, 3]', sub: 'array' },
            { label: '"Ada"', sub: 'string' },
            { label: 'Map { … }', sub: 'Map (4.12)' },
          ].map((it, i) => (
            <g key={it.sub}>
              <RoughRect x={40 + i * 128} y={60} width={112} height={70} seed={1630 + i} strokeWidth={2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
              <text x={96 + i * 128} y={90} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">{it.label}</text>
              <text x={96 + i * 128} y={110} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">{it.sub}</text>
              <text x={96 + i * 128} y={146} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13}>🔌</text>
            </g>
          ))}
          <text x={220} y={172} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-marker-teal)">
            same plug on each: the iterator — the loop just asks for it
          </text>
        </g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={230} width={392} fontSize={9.5} seed={1640} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={278} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={12} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={310} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink-soft)">
          console: {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const SAFE_READ_EXERCISE: CodeExerciseDef = {
  id: 'l84-safe-reader',
  title: 'the crash-proof pet reader',
  task: 'A user list where some users have a pet and some don’t — exactly the shape every real API sends. Read every pet name without a single crash and without a single if.',
  steps: [
    <>
      Create <code>users</code>: an array of three objects — <code>{'{ name: "Ada", pet: { name: "Rex" } }'}</code>,{' '}
      <code>{'{ name: "Mo" }'}</code>, and <code>{'{ name: "Liv", pet: { name: "Tuna" } }'}</code>.
    </>,
    <>
      Write <code>petLabel(user)</code> returning the user’s pet’s name — or <code>"no pet"</code>{' '}
      when there isn’t one. No <code>if</code> allowed: today’s two operators do it in one line.
    </>,
    <>
      Loop over <code>users</code> (for...of) and print each label, in order.
    </>,
  ],
  starter: '',
  expectedOutput: ['Rex', 'no pet', 'Tuna'],
  mustUse: [
    { test: /\?\./, label: 'the lookup is guarded with ?.' },
    { test: /\?\?/, label: 'the default arrives via ??' },
    { test: /function\s+petLabel\s*\(|const\s+petLabel\s*=/, label: 'a function named petLabel' },
    { test: /for\s*\(\s*const\s+\w+\s+of\s+users\s*\)/, label: 'a for...of loop over users' },
  ],
  mustNotUse: [
    { test: /if\s*\(/, label: 'no if — ?. and ?? replace it entirely here' },
    { test: /&&/, label: 'no && guard — that was 2.4; use the modern pair' },
    { test: /console\.log\s*\(\s*["']Rex["']\s*\)/, label: 'no hard-coded names — read them from the data' },
  ],
  modelAnswer: `const users = [
  { name: "Ada", pet: { name: "Rex" } },
  { name: "Mo" },
  { name: "Liv", pet: { name: "Tuna" } },
];

function petLabel(user) {
  return user.pet?.name ?? "no pet";
}

for (const user of users) {
  console.log(petLabel(user));
}`,
}

export const lesson84: LessonDef = {
  id: '8.4',
  hook: (
    <>
      <p>
        Back in 2.4 you learned <code>||</code> defaults and <code>&&</code> guards — and a note
        said modern code upgrades them to <code>??</code> and <code>?.</code>, “Phase 8.” Welcome
        to the payoff. These two tiny operators kill{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          the single most common error in JavaScript: reading a property off undefined
        </HighlightMark>{' '}
        — and fix a genuine bug hiding in <code>||</code>.
      </p>
      <p>
        Every API response, every optional field, every “this user has no pet” — this is the
        grammar real data is read with.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-crash',
      caption:
        'Meet the most common error in the language. user has no cat property, so user.cat evaluates to undefined (1.7) — and asking undefined for .name doesn’t answer undefined. It CRASHES: TypeError, program dead, nothing below ever runs.',
      highlightLines: [3],
    },
    {
      id: 'why-it-crashes',
      caption:
        'Why: the dot (4.4) demands an object on its left. user.cat produced undefined — not an object, nothing to look inside. Notice the killer is the SECOND hop: the first lookup succeeded and answered undefined; the crash comes from dotting into that answer.',
      highlightLines: [3],
    },
    {
      id: 'optional-chaining',
      caption:
        '?. is the dot with a guard built in: “if my left side is null or undefined, STOP and answer undefined; otherwise behave exactly like a normal dot.” Line 4: pet exists, so user.pet?.name walks through and prints Rex — identical to the plain dot.',
      highlightLines: [4],
    },
    {
      id: 'short-circuit',
      caption:
        'Line 5 is the rescue: user.cat?.name. The ray reaches cat, finds undefined, and STOPS — the whole rest of the chain is abandoned, and the expression’s answer is undefined. Printed, not crashed. The program lives on.',
      highlightLines: [5],
    },
    {
      id: 'restraint',
      caption:
        'Now the professional restraint: use ?. where absence is NORMAL — optional fields, maybe-missing data. Don’t armor every dot: a?.b?.c on data that SHOULD exist converts honest crashes into silent undefineds, and silent wrong data is the hardest bug to find. A crash is a loud, truthful witness.',
      highlightLines: [4, 5],
    },
    {
      id: 'or-problem',
      caption:
        'Second act — the || bug from 2.4, finally exposed. volume || 50 asks “is volume falsy?” And 0 IS falsy (1.8’s list). The user deliberately set volume to 0 — silence — and || throws that away and answers 50. Same betrayal for "" — real values, stolen.',
      highlightLines: [7, 8],
    },
    {
      id: 'nullish',
      caption:
        '?? asks a narrower, more honest question: “is the left side null or undefined?” NOTHING else counts as missing. volume ?? 50 → 0 survives, because 0 is a real value that happens to be falsy. Missing means missing — not “looks empty-ish.”',
      highlightLines: [9],
    },
    {
      id: 'the-pair',
      caption:
        'And the two were built for each other: user.cat?.name ?? "no pet". The ?. turns a would-be crash into undefined; the ?? catches exactly that undefined and supplies the default. One line reads an optional path AND handles its absence — you’ll write this shape constantly.',
      highlightLines: [11, 12],
    },
    {
      id: 'iterators-flag',
      caption:
        'One grab-bag flag before we close — a preview, not homework. Ever notice for...of (4.8) walks arrays, strings, AND Maps? Each of them carries an ITERATOR: a standard plug the loop asks for. Its official name is Symbol.iterator, and custom objects can offer one too. File it away.',
      highlightLines: [1],
    },
    {
      id: 'roundup',
      caption:
        'Your modern reading kit, complete: ?. makes lookups crash-proof where absence is legitimate; ?? supplies defaults without stealing 0 and "". Combined with template literals (1.6, already yours), this is most of what “modern JS” means in day-to-day code.',
      highlightLines: [4, 9, 11],
    },
  ],
  Viz: ShortCircuitRay,
  underTheHood: (
    <>
      <p>
        The family has two more members: <code>user.greet?.()</code> calls a method{' '}
        <em>only if it exists</em>, and <code>arr?.[0]</code> guards bracket lookups. Same rule
        everywhere: null/undefined on the left → stop, answer undefined.
      </p>
      <p>
        The stop is <strong>total</strong>. In <code>a?.b.c.d()</code>, if <code>a</code> is
        missing, then <code>.b</code>, <code>.c</code> and the call never happen — including
        any side effects they would have had. That’s why it’s called short-circuiting, the same
        word from 2.4.
      </p>
      <p>
        A designed-in safety rule: you may not mix <code>||</code> and <code>??</code> bare —{' '}
        <code>a || b ?? c</code> is a SyntaxError. The language forces parentheses so nobody has
        to memorize which operator wins. When in doubt, parenthesize — 1.10’s advice, now
        enforced by the grammar.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'const volume = 0. What does console.log(volume ?? 50) print?',
      accept: ['0'],
      why: '?? only treats null and undefined as missing. 0 is a real value — it survives. (|| would have printed 50, stealing the user’s setting.)',
    },
    {
      kind: 'type-output',
      question: 'user has no cat property. What does console.log(user.cat?.name) print?',
      accept: ['undefined'],
      why: 'The ray stops at cat: ?. sees undefined on its left, abandons the chain, and answers undefined — printed, not crashed.',
    },
    {
      kind: 'type-output',
      question: 'Which operator treats the empty string "" as missing and replaces it — || or ?? ?',
      accept: ['||', 'or', 'OR'],
      placeholder: '|| or ??…',
      why: '"" is falsy, so || replaces it. ?? keeps it, because "" is neither null nor undefined. That difference is the whole reason ?? exists.',
    },
  ],
  onTheJob: (
    <JobScene>
      <Scene>One day, you will write a check shaped like this:</Scene>
      <ReviewCard file="user.spec.js" lines={[{ text: 'body.user?.address?.city ?? "unknown"' }]} />
      <Takeaway>
        document.querySelector answers null when nothing matches, so el?.textContent is daily
        DOM grammar. <Key>Optional fields are the shape of half the checks you will write.</Key>
      </Takeaway>
    </JobScene>
  ),
  PlayExtra: () => <CodeExercise def={SAFE_READ_EXERCISE} />,
  interview: {
    question: 'What do ?. and ?? do?',
    say: '?. reads a property and stops safely if the thing before it is null or undefined, returning undefined instead of throwing. ?? gives a fallback only when the value is null or undefined. That makes ?? the safe default operator.',
    example: {
      code: 'const city = user?.address?.city // undefined if any hop is missing\n\nconst port = config.port ?? 3000 // 3000 only if null or undefined\nconst bad = config.port || 3000  // wrong: also replaces 0',
      note: '?. stops safely on a missing hop. ?? falls back only on null or undefined, unlike || which also replaces 0.',
    },
    deeper:
      '?? differs from || because || also replaces 0 and empty string (8.4). ?? treats those as real values, so it is the safe choice for a default.',
    dontSay: {
      wrong: '?? is the same as ||.',
      why: '|| replaces any falsy value, including 0 and empty string. ?? only replaces null and undefined (8.4).',
    },
  },
  teachBack: {
    prompt:
      'Explain to a friend why user.cat.name crashes but user.cat?.name doesn’t, and why volume ?? 50 is safer than volume || 50 when volume is 0.',
    modelAnswer:
      'user.cat.name crashes because of the second hop: user.cat succeeds and evaluates to undefined (there’s no cat property), but then .name asks undefined for a property — and undefined isn’t an object, so the program dies with a TypeError. The optional chain user.cat?.name adds a guard at that exact spot: ?. checks its left side first, and if it’s null or undefined it STOPS the whole chain and answers undefined instead of crashing — nothing after the stop even runs. For defaults: volume || 50 asks “is volume falsy?”, and 0 is falsy, so a user who deliberately set volume to 0 gets 50 — their real setting stolen. volume ?? 50 asks the narrower question “is volume null or undefined?” — 0 is neither, so 0 survives. ?? means genuinely missing; || means merely falsy. And the two combine beautifully: user.cat?.name ?? "no pet" turns a would-be crash into undefined and then catches that undefined with an honest default.',
  },
  recap: [
    '?. = the dot with a guard: left side null/undefined → STOP, answer undefined; otherwise a normal dot. The stop abandons the entire rest of the chain (?.() and ?.[ ] exist too).',
    '?? = the honest default: only null/undefined count as missing — 0 and "" survive. (|| replaces anything falsy; mixing || and ?? without parens is a SyntaxError by design.)',
    'The pair user.pet?.name ?? "no pet" reads optional data in one line. Use ?. where absence is normal — not as armor on every dot; silent undefineds hide real bugs.',
  ],
}
