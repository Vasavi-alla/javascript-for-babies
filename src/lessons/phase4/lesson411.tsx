import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 4.11 — Destructuring, spread & rest
 * Progressive disclosure: first the pain (one line per property), then the
 * pattern that mirrors the shape, then the REAL reason it exists — functions
 * taking an options object (how real libraries, incl. Playwright, design
 * their APIs). Rest gathers; spread spreads; position decides.
 */

const CODE = `const player = { name: "Vas", hp: 90, level: 4 };

// the old way — one line per property:
//   const hp = player.hp;
//   const level = player.level;

const { hp, level } = player;
console.log(hp);

const podium = ["gold", "silver", "bronze"];
const [first, , third] = podium;
console.log(third);

let a = 1;
let b = 2;
[a, b] = [b, a];
console.log(a);`

const OPTIONS_CODE = `function connect({ url, retries }) {
  return url + " ×" + retries;
}

const options = { url: "api.shop.com", retries: 3, log: true };
console.log(connect(options));

const [winner, ...others] = ["Ada", "Mo", "Liv"];
console.log(others.length);

const base = [1, 2];
const extended = [...base, 3];
console.log(extended);`

interface View {
  mode: 'object' | 'array' | 'swap' | 'params' | 'rest' | 'spread'
  console: string[]
  note: string
}

const VIEWS: View[] = [
  { mode: 'object', console: [], note: 'the pattern MIRRORS the shape — variables created from properties, by KEY' },
  { mode: 'object', console: ['90'], note: 'sugar, not magic: exactly the commented lines — copies of what the slots held (4.6 rules!)' },
  { mode: 'array', console: ['90', 'bronze'], note: 'arrays unpack by POSITION — the hole skips index 1 entirely' },
  { mode: 'swap', console: ['90', 'bronze', '2'], note: 'right side builds [2, 1] FIRST, then unpacks — a swap with no temp variable' },
  { mode: 'params', console: ['api.shop.com ×3'], note: 'THE real-world use: options objects — the function unpacks only what it names' },
  { mode: 'rest', console: ['api.shop.com ×3', '2'], note: '...rest GATHERS the leftovers into a fresh array' },
  { mode: 'spread', console: ['api.shop.com ×3', '2', '[1,2,3]'], note: 'same dots, opposite direction: in a literal, ...spreads OUT (shallow — 4.7!)' },
]

function UnpackBoard({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      {view.mode === 'object' && (
        <g>
          <RoughRect x={30} y={50} width={170} height={100} seed={751} strokeWidth={2} fill="var(--color-sticky)" fillStyle="solid" />
          <text x={38} y={44} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">player</text>
          {['name: "Vas"', 'hp: 90', 'level: 4'].map((line, i) => (
            <text key={line} x={44} y={76 + i * 24} fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">{line}</text>
          ))}
          {[{ label: 'hp', val: '90', y: 70 }, { label: 'level', val: '4', y: 120 }].map((s, i) => (
            <motion.g key={s.label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.15 }}>
              <RoughRect x={300} y={s.y} width={96} height={36} seed={753 + i} strokeWidth={1.8} stroke="var(--color-marker-teal)" fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
              <text x={306} y={s.y - 5} fontFamily="var(--font-code)" fontSize={11} fontWeight={700} fill="var(--color-ink)">{s.label}</text>
              <text x={348} y={s.y + 23} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill="var(--color-ink)">{s.val}</text>
            </motion.g>
          ))}
          <HandArrow from={{ x: 202, y: 98 }} to={{ x: 296, y: 88 }} curve={0.1} seed={755} stroke="var(--color-marker-teal)" strokeWidth={2.2} headLength={9} />
          <HandArrow from={{ x: 202, y: 124 }} to={{ x: 296, y: 138 }} curve={-0.1} seed={756} stroke="var(--color-marker-teal)" strokeWidth={2.2} headLength={9} />
          <text x={220} y={190} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill="var(--color-ink)">
            {'const { hp, level } = player'}
          </text>
        </g>
      )}

      {view.mode === 'array' && (
        <g>
          {['"gold"', '"silver"', '"bronze"'].map((v, i) => (
            <g key={v}>
              <RoughRect x={50 + i * 116} y={54} width={100} height={44} seed={758 + i} strokeWidth={1.8} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
              <text x={100 + i * 116} y={81} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fill="var(--color-ink)">{v}</text>
              <text x={100 + i * 116} y={116} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink-soft)">{i}</text>
            </g>
          ))}
          <text x={100} y={160} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fontWeight={700} fill="var(--color-marker-teal)">first</text>
          <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={216} y={160} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
            (the hole — skipped)
          </motion.text>
          <text x={332} y={160} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fontWeight={700} fill="var(--color-marker-teal)">third</text>
          <HandArrow from={{ x: 100, y: 102 }} to={{ x: 100, y: 144 }} curve={0} seed={761} stroke="var(--color-marker-teal)" strokeWidth={2} headLength={8} />
          <HandArrow from={{ x: 332, y: 102 }} to={{ x: 332, y: 144 }} curve={0} seed={762} stroke="var(--color-marker-teal)" strokeWidth={2} headLength={8} />
          <text x={220} y={205} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill="var(--color-ink)">
            {'const [first, , third] = podium'}
          </text>
        </g>
      )}

      {view.mode === 'swap' && (
        <g>
          <RoughRect x={90} y={60} width={80} height={44} seed={763} strokeWidth={1.8} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={98} y={54} fontFamily="var(--font-code)" fontSize={11} fontWeight={700} fill="var(--color-ink)">a</text>
          <motion.text key="a-val" initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={130} y={88} textAnchor="middle" fontFamily="var(--font-code)" fontSize={15} fontWeight={700} fill="var(--color-ink)">2</motion.text>
          <RoughRect x={270} y={60} width={80} height={44} seed={764} strokeWidth={1.8} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={278} y={54} fontFamily="var(--font-code)" fontSize={11} fontWeight={700} fill="var(--color-ink)">b</text>
          <motion.text key="b-val" initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={310} y={88} textAnchor="middle" fontFamily="var(--font-code)" fontSize={15} fontWeight={700} fill="var(--color-ink)">1</motion.text>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <HandArrow from={{ x: 160, y: 112 }} to={{ x: 280, y: 70 }} curve={0.25} seed={765} stroke="var(--color-marker-coral)" strokeWidth={2} headLength={9} />
            <HandArrow from={{ x: 280, y: 112 }} to={{ x: 160, y: 70 }} curve={0.25} seed={766} stroke="var(--color-marker-teal)" strokeWidth={2} headLength={9} />
          </motion.g>
          <text x={220} y={165} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13.5} fontWeight={700} fill="var(--color-ink)">
            {'[a, b] = [b, a]'}
          </text>
          <text x={220} y={190} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
            right side is built completely before any unpacking starts
          </text>
        </g>
      )}

      {view.mode === 'params' && (
        <g>
          <RoughRect x={30} y={56} width={180} height={92} seed={767} strokeWidth={2} fill="var(--color-sticky)" fillStyle="solid" />
          <text x={38} y={50} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">options (one object argument)</text>
          {['url: "api.shop.com"', 'retries: 3', 'log: true'].map((line, i) => (
            <text key={line} x={42} y={80 + i * 22} fontFamily="var(--font-code)" fontSize={11.5} fill={line.startsWith('log') ? 'var(--color-ink-soft)' : 'var(--color-ink)'}>{line}</text>
          ))}
          <RoughRect x={264} y={56} width={150} height={92} seed={768} strokeWidth={2.2} fill="var(--color-marker-yellow)" fillStyle="solid" />
          <text x={339} y={80} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fontWeight={700} fill="var(--color-ink)">connect</text>
          <text x={339} y={102} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">{'({ url, retries })'}</text>
          <text x={339} y={124} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-ink-soft)">takes only what it names</text>
          <HandArrow from={{ x: 212, y: 90 }} to={{ x: 260, y: 96 }} curve={0.05} seed={769} stroke="var(--color-marker-teal)" strokeWidth={2.2} headLength={9} />
          <text x={220} y={190} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
            log rides along and is simply ignored — no error, no fuss
          </text>
        </g>
      )}

      {(view.mode === 'rest' || view.mode === 'spread') && (
        <g>
          {(view.mode === 'rest' ? ['"Ada"', '"Mo"', '"Liv"'] : ['1', '2', '+3']).map((v, i) => (
            <g key={v}>
              <RoughRect x={70 + i * 106} y={54} width={90} height={42} seed={771 + i} strokeWidth={1.8} stroke={view.mode === 'spread' && i === 2 ? 'var(--color-marker-coral)' : 'var(--color-ink)'} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
              <text x={115 + i * 106} y={80} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fill="var(--color-ink)">{v}</text>
            </g>
          ))}
          {view.mode === 'rest' ? (
            <g>
              <text x={115} y={130} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)">winner</text>
              <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                <RoughRect x={210} y={116} width={170} height={38} seed={775} strokeWidth={2} stroke="var(--color-marker-teal)" roughness={2} />
                <text x={295} y={140} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={700} fill="var(--color-ink)">others = ["Mo","Liv"]</text>
              </motion.g>
              <text x={220} y={190} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill="var(--color-ink)">{'const [winner, ...others] = …'}</text>
              <text x={220} y={214} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">the net: dots in a PATTERN gather leftovers</text>
            </g>
          ) : (
            <g>
              <text x={220} y={140} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill="var(--color-ink)">{'const extended = [...base, 3]'}</text>
              <text x={220} y={166} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
                dots in a LITERAL spread elements out into the new array
              </text>
              <text x={220} y={190} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-marker-coral)">
                base is untouched — and the copy is shallow (4.7)
              </text>
            </g>
          )}
        </g>
      )}

      {/* note + console */}
      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={240} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>
      <RoughRect x={40} y={256} width={360} height={36} seed={779} strokeWidth={1.5} />
      <text x={52} y={252} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">console</text>
      {view.console.length === 0 ? (
        <text x={220} y={279} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">(nothing printed yet)</text>
      ) : (
        <text x={58} y={279} fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">{view.console.join('   ·   ')}</text>
      )}
    </svg>
  )
}

const TRIP_EXERCISE: CodeExerciseDef = {
  id: 'l411-trip',
  title: 'a function that reads like a form',
  task: 'Design a function the way real libraries do: it accepts ONE options object and unpacks only the fields it cares about — extra fields must ride along harmlessly.',
  steps: [
    <>
      Write a function <code>describe</code> that takes ONE object parameter and destructures{' '}
      <code>city</code> and <code>days</code> <em>directly in its parameter list</em>. It returns
      the string <code>city + " for " + days + " days"</code>.
    </>,
    <>
      Create <code>trip</code> with <code>city</code> = <code>"Goa"</code>, <code>days</code> ={' '}
      <code>5</code> — and a third property <code>budget</code> = <code>9000</code> that describe
      never mentions. Print <code>describe(trip)</code>.
    </>,
    <>
      Then: destructure <code>["Goa", "Hampi", "Ooty"]</code> so the first stop gets its own
      variable and the REST are gathered into another. Print how many stops the rest holds.
    </>,
  ],
  starter: '',
  expectedOutput: ['Goa for 5 days', '2'],
  mustUse: [
    { test: /\(\s*\{\s*\w+\s*,\s*\w+\s*\}\s*\)/, label: 'the parameter list itself destructures the object' },
    { test: /\[\s*\w+\s*,\s*\.\.\.\w+\s*\]/, label: 'rest gathers the remaining stops: [first, ...rest]' },
  ],
  mustNotUse: [
    { test: /trip\.city|trip\.days|\w+\.city\b|\w+\.days\b/, label: 'no dot access — the destructuring does the unpacking' },
    { test: /console\.log\s*\(\s*2\s*\)/, label: 'the 2 must come from the gathered array’s length' },
  ],
  modelAnswer: `function describe({ city, days }) {
  return city + " for " + days + " days";
}

const trip = { city: "Goa", days: 5, budget: 9000 };
console.log(describe(trip));

const [firstStop, ...otherStops] = ["Goa", "Hampi", "Ooty"];
console.log(otherStops.length);`,
}

export const lesson411: LessonDef = {
  id: '4.11',
  hook: (
    <>
      <p>
        By now you've written this shape a dozen times: <code>const hp = player.hp;</code>{' '}
        <code>const level = player.level;</code> — one ceremonial line per property, repeating the
        object's name like an incantation. JavaScript has a shortcut whose pattern{' '}
        <em>mirrors the shape of the data</em>:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          destructuring
        </HighlightMark>
        .
      </p>
      <p>
        But the shortcut is the small half of this lesson. The big half is <em>why it changed how
        functions are designed</em>: modern APIs take a single <strong>options object</strong> and
        destructure it in the parameter list — every Playwright call you'll ever write looks like
        that. Plus the three dots (<code>...</code>) that gather and spread — one syntax, two
        directions.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'mirror',
      caption:
        'Read line 7 as a stencil held against the object: const { hp, level } = player. The braces MIRROR the object’s shape, and each name inside becomes a real variable filled from the property with the SAME KEY. Order inside the braces is irrelevant — keys do the matching (this is object land, name-powered, like 4.4 taught).',
      highlightLines: [7, 8],
    },
    {
      id: 'sugar',
      caption:
        'Nothing magical happened: line 7 is EXACTLY the two commented lines, compressed. Each new variable receives a copy of what the property slot held — and all of 4.6 still applies: hp got the value 90 (a primitive, independent), but destructure a property holding an object and your new variable holds an ARROW to the same object.',
      highlightLines: [3, 4, 5, 7],
    },
    {
      id: 'array-pattern',
      caption:
        'Arrays destructure too — but by POSITION, not name, because that’s how arrays are found (4.2 forever). const [first, , third]: first takes index 0, the eerie empty gap is a HOLE that deliberately skips index 1, and third takes index 2. "silver" is simply never bound to anything.',
      highlightLines: [10, 11, 12],
    },
    {
      id: 'swap',
      caption:
        'The famous party trick: [a, b] = [b, a] swaps two variables with no temporary third. It works because of evaluation order you already know: the RIGHT side is built completely first — [b, a] becomes the real array [2, 1] — and only then does the left pattern unpack it by position. a gets 2, b gets 1.',
      highlightLines: [14, 15, 16, 17],
    },
    {
      id: 'options-object',
      caption:
        'Now the reason this syntax conquered JavaScript. New scene: a function with several settings. Passing them as five positional arguments is a memory test (was retries third or fourth?). Instead: the caller passes ONE object, and the function destructures it RIGHT IN THE PARAMETER LIST — connect({ url, retries }). It reads like a form: named fields, any order. And look at options: it carries log: true, which connect never names — extra fields are simply ignored. Every Playwright config and most modern APIs are shaped exactly like this.',
      codeOverride: OPTIONS_CODE,
      highlightLines: [1, 2, 3, 5, 6],
    },
    {
      id: 'rest',
      caption:
        'Three dots in a PATTERN gather. const [winner, ...others]: winner takes the first element, then ...others sweeps every leftover into a brand-new array ["Mo", "Liv"]. Rest must come last — it hoovers up everything remaining.',
      highlightLines: [8, 9],
    },
    {
      id: 'spread',
      caption:
        'The same three dots in a LITERAL do the opposite: spread OUT. [...base, 3] pours base’s elements into a fresh array and appends 3 — base itself is untouched. One syntax, two directions, and the position tells you which: in a pattern (left of =, or in parameters) it GATHERS; in a literal (building an array/object or calling a function) it SPREADS. And spreads are shallow — lesson 4.7’s warning travels with them.',
      highlightLines: [11, 12, 13],
    },
  ],
  Viz: UnpackBoard,
  underTheHood: (
    <>
      <p>
        Destructuring is pure convenience syntax — the engine performs the same property reads and
        index reads you'd have written by hand, including all the reference rules of 4.6. Two
        extras worth owning: defaults (<code>{'const { retries = 3 } = options'}</code> — used when
        the property is missing or undefined, exactly like 3.10's parameter defaults) and renaming
        (<code>{'const { url: address } = options'}</code> reads property <code>url</code> into a
        variable called <code>address</code>).
      </p>
      <p>
        The options-object pattern is the one to internalize as a future test engineer: it's why{' '}
        <code>{'page.goto(url, { waitUntil: "load" })'}</code> and{' '}
        <code>{'test.use({ viewport: … })'}</code> look the way they do. Named fields survive
        redesigns — adding a new option never breaks old callers, because extra and missing fields
        are handled gracefully.
      </p>
      <p>
        Keep the dots straight forever with one sentence: <strong>in a pattern, dots gather; in a
        literal, dots spread.</strong> Rest builds one new array from many values; spread pours one
        collection's values into a new home. Both are shallow — arrows copy as arrows.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type what b holds:',
      code: 'const { b } = { a: 1, b: 2 };',
      accept: ['2'],
      placeholder: 'a value…',
      why: 'Object destructuring matches by KEY: the pattern’s b finds the property b and takes its value, 2. The a property is simply not asked for.',
    },
    {
      kind: 'type-output',
      question: 'Type what second holds:',
      code: 'const [, second] = ["x", "y", "z"];',
      accept: ['y'],
      placeholder: 'a value…',
      why: 'Array destructuring matches by POSITION, and the leading hole skips index 0 — so second binds to index 1, "y".',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const [h, ...t] = [1, 2, 3];\nconsole.log(t.length);',
      accept: ['2'],
      placeholder: 'type the console output…',
      why: 'h takes 1; ...t gathers everything left into a NEW array [2, 3], whose length is 2. Dots in a pattern gather.',
    },
  ],
  PlayExtra: () => <CodeExercise def={TRIP_EXERCISE} />,
  teachBack: {
    prompt:
      'A friend sees function setup({ speed, mode }) and asks why the parameter has braces in it — and why the caller can pass an object with five extra fields without anything breaking. Explain the options-object pattern.',
    modelAnswer:
      'The braces are destructuring happening right in the parameter list. The caller passes ONE object; the function’s pattern unpacks just the properties it names — speed and mode become local variables, matched by key. That’s why extra fields are harmless: destructuring takes what it names and ignores the rest, so an object with five extra fields still fits the pattern. It reads like a form with named fields (no remembering argument order), and it survives change — new options can be added without breaking a single old caller. That’s why modern libraries, including Playwright, design almost every function this way. And the three dots: in a pattern they GATHER leftovers into a new array; in a literal they SPREAD a collection out into a new one — position decides the direction.',
  },
  recap: [
    'Destructuring mirrors shape: objects unpack by KEY (const { hp } = player), arrays by POSITION (const [a, , c] = list — holes skip).',
    'The options-object pattern: functions destructure ONE object parameter — named fields, any order, extras ignored. This is how Playwright APIs are shaped.',
    'Three dots: in a PATTERN they gather (rest → new array, must be last); in a LITERAL they spread out. Both shallow — 4.7 applies.',
  ],
}
