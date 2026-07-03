import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 3.5 — Scope 🎬 hero lesson
 * Viz: ScopeLens — nested translucent bubbles on paper. A "lookup ray"
 * shoots OUTWARD from where a name is used, through bubble walls, until it
 * finds a match. Inner sees outer, never the reverse; blocks pop; shadowing.
 */

const CODE = `let planet = "Earth";

function mission() {
  let ship = "Falcon";

  if (ship === "Falcon") {
    let fuel = 100;
    console.log(fuel + " left on " + ship);
  }

  console.log(ship + " from " + planet);
  console.log(fuel);
}

mission();`

const SHADOW_CODE = `let name = "outer";

function test() {
  let name = "inner";
  console.log(name);
}

test();`

interface View {
  mode: 'main' | 'shadow'
  /** if-block bubble: alive, popped (faded + label), or hidden */
  block: 'alive' | 'popped'
  rays: Array<{ from: { x: number; y: number }; to: { x: number; y: number }; blocked?: boolean }>
  rayLabel?: string
  console: string[]
}

const USE_IN_BLOCK = { x: 330, y: 185 } // "line 8" usage point, inside the if bubble
const USE_IN_FN = { x: 330, y: 100 } // "line 11/12" usage point, inside mission()
const CHIP_PLANET = { x: 75, y: 62 }
const CHIP_SHIP = { x: 150, y: 102 }
const CHIP_FUEL = { x: 235, y: 142 }

const VIEWS: View[] = [
  { mode: 'main', block: 'alive', rays: [], console: [] },
  {
    mode: 'main', block: 'alive', console: ['100 left on Falcon'],
    rays: [
      { from: USE_IN_BLOCK, to: { x: CHIP_FUEL.x + 30, y: CHIP_FUEL.y + 10 } },
      { from: USE_IN_BLOCK, to: { x: CHIP_SHIP.x + 30, y: CHIP_SHIP.y + 10 } },
    ],
    rayLabel: 'the ray shoots OUTWARD until it finds the name',
  },
  {
    mode: 'main', block: 'popped', console: ['100 left on Falcon', 'Falcon from Earth'],
    rays: [{ from: USE_IN_FN, to: { x: CHIP_PLANET.x + 30, y: CHIP_PLANET.y + 10 } }],
    rayLabel: 'two walls out — still fine',
  },
  { mode: 'main', block: 'popped', rays: [], console: ['100 left on Falcon', 'Falcon from Earth'] },
  {
    mode: 'main', block: 'popped', console: ['100 left on Falcon', 'Falcon from Earth', 'ReferenceError: fuel is not defined'],
    rays: [{ from: USE_IN_FN, to: { x: CHIP_FUEL.x + 30, y: CHIP_FUEL.y + 10 }, blocked: true }],
    rayLabel: 'rays NEVER travel inward — and the bubble is gone',
  },
  { mode: 'shadow', block: 'alive', rays: [], console: ['inner'] },
  { mode: 'main', block: 'popped', rays: [], console: ['100 left on Falcon', 'Falcon from Earth', 'ReferenceError: fuel is not defined'] },
]

function NameChip({ x, y, label, dead }: { x: number; y: number; label: string; dead?: boolean }) {
  return (
    <g opacity={dead ? 0.3 : 1}>
      <RoughRect x={x} y={y} width={62} height={22} seed={391 + x} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
      <text x={x + 31} y={y + 15} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fontWeight={600} fill="var(--color-ink)">
        {label}
      </text>
    </g>
  )
}

function ScopeLens({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]

  if (view.mode === 'shadow') {
    return (
      <svg viewBox="0 0 440 320" className="w-full">
        <RoughRect x={30} y={40} width={380} height={210} seed={401} strokeWidth={2} fill="color-mix(in srgb, var(--color-marker-teal) 8%, transparent)" fillStyle="solid" />
        <text x={44} y={62} fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">global bubble</text>
        <NameChip x={50} y={72} label='name="outer"' />
        <RoughRect x={140} y={100} width={240} height={120} seed={402} strokeWidth={2} fill="color-mix(in srgb, var(--color-marker-teal) 12%, transparent)" fillStyle="solid" />
        <text x={154} y={122} fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">test()</text>
        <NameChip x={160} y={132} label='name="inner"' />
        {/* the ray stops at the FIRST match */}
        <HandArrow from={{ x: 330, y: 190 }} to={{ x: 226, y: 145 }} seed={403} curve={0.15} />
        <text x={330} y={210} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink)">
          console.log(name)
        </text>
        <text x={220} y={244} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-marker-coral)">
          nearest bubble wins — the outer name is “shadowed”
        </text>
        <RoughRect x={40} y={262} width={360} height={46} seed={404} strokeWidth={1.5} />
        <text x={52} y={258} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">console</text>
        <text x={58} y={290} fontFamily="var(--font-code)" fontSize={12.5} fill="var(--color-ink)">inner</text>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {/* global bubble */}
      <RoughRect x={20} y={40} width={400} height={200} seed={405} strokeWidth={2} fill="color-mix(in srgb, var(--color-marker-teal) 6%, transparent)" fillStyle="solid" />
      <text x={34} y={60} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">global bubble</text>
      <NameChip x={CHIP_PLANET.x} y={CHIP_PLANET.y} label="planet" />

      {/* mission() bubble */}
      <RoughRect x={95} y={80} width={305} height={150} seed={406} strokeWidth={2} fill="color-mix(in srgb, var(--color-marker-teal) 10%, transparent)" fillStyle="solid" />
      <text x={109} y={99} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">mission()</text>
      <NameChip x={CHIP_SHIP.x} y={CHIP_SHIP.y} label="ship" />

      {/* if-block bubble */}
      <g opacity={view.block === 'popped' ? 0.3 : 1}>
        <RoughRect x={210} y={120} width={175} height={95} seed={407} strokeWidth={2} fill="color-mix(in srgb, var(--color-marker-teal) 14%, transparent)" fillStyle="solid" />
        <text x={224} y={138} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">if block</text>
        <NameChip x={CHIP_FUEL.x} y={CHIP_FUEL.y} label="fuel" dead={view.block === 'popped'} />
        {view.block === 'popped' && (
          <text x={297} y={205} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-marker-coral)">
            popped when the block ended
          </text>
        )}
      </g>

      {/* lookup rays */}
      <AnimatePresence>
        {view.rays.map((ray, i) => (
          <motion.g key={`${stepIndex}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HandArrow
              from={ray.from}
              to={ray.to}
              seed={408 + i}
              curve={0.12}
              stroke={ray.blocked ? 'var(--color-marker-coral)' : undefined}
            />
            {ray.blocked && (
              <text x={(ray.from.x + ray.to.x) / 2 + 14} y={(ray.from.y + ray.to.y) / 2} fontFamily="var(--font-hand)" fontSize={18} fontWeight={700} fill="var(--color-marker-coral)">
                ✗
              </text>
            )}
          </motion.g>
        ))}
      </AnimatePresence>
      {view.rayLabel && (
        <text x={220} y={256} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink)">
          {view.rayLabel}
        </text>
      )}

      {/* console strip */}
      <RoughRect x={40} y={264} width={360} height={50} seed={409} strokeWidth={1.5} />
      <text x={52} y={260} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">console</text>
      {view.console.slice(-2).map((line, i) => (
        <motion.text
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          x={58}
          y={281 + i * 16}
          fontFamily="var(--font-code)"
          fontSize={11.5}
          fill={line.startsWith('ReferenceError') ? 'var(--color-marker-coral)' : 'var(--color-ink)'}
        >
          {line}
        </motion.text>
      ))}
    </svg>
  )
}

const PRICE_TAG_EXERCISE: CodeExerciseDef = {
  id: 'd3a-price-tag',
  title: 'everything at once',
  task: 'A store prints price tags: item, price, and the store’s name on every tag. The function reads a constant from the OUTER bubble — scope in action.',
  steps: [
    <>
      The store’s name — <code>"Code Corner"</code> — lives in a variable named{' '}
      <code>shopName</code>, declared OUTSIDE the function. It never changes; store it accordingly.
    </>,
    <>
      A function named <code>priceTag</code> takes two inputs: <code>item</code> first, then{' '}
      <code>price</code> — and its lookup ray reaches outward to find <code>shopName</code>.
    </>,
    <>
      Each call prints one tag matching the expected output below <em>exactly</em> — built from
      the inputs and <code>shopName</code>, never typed by hand. (Copy the long dash — from the
      expected output; it’s not the minus key.)
    </>,
    <>Two tags to print: gear at 5, spring at 2.</>,
  ],
  starter: '',
  expectedOutput: ['gear — $5 (at Code Corner)', 'spring — $2 (at Code Corner)'],
  mustUse: [
    { test: /const\s+shopName\s*=\s*["']Code Corner["']/, label: 'the never-changing store name is stored permanently' },
    { test: /function\s+priceTag\s*\(\s*\w+\s*,\s*\w+\s*\)/, label: 'priceTag is a function with two input slots' },
    { test: /priceTag\s*\(\s*["']gear["']\s*,\s*5\s*\)/, label: 'called for gear at 5 — item first, price second' },
    { test: /priceTag\s*\(\s*["']spring["']\s*,\s*2\s*\)/, label: 'called for spring at 2' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["'](gear|spring)/, label: 'tags are built from the slots — no hand-typed tags' },
  ],
  modelAnswer: `const shopName = "Code Corner";

function priceTag(item, price) {
  console.log(item + " — $" + price + " (at " + shopName + ")");
}

priceTag("gear", 5);
priceTag("spring", 2);`,
}

export const lesson35: LessonDef = {
  id: '3.5',
  hook: (
    <>
      <p>
        Here's a question that has quietly followed you since Phase 1: when a line of code says{' '}
        <code>ship</code>, how does the engine know <em>which</em> ship — and why can some lines
        see a variable while others act like it doesn't exist? The answer is{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          scope
        </HighlightMark>
        : every variable lives inside a bubble, and bubbles nest inside each other like soap
        bubbles on paper.
      </p>
      <p>
        The rule of the whole lesson fits in one line: <strong>inner bubbles can see outward;
        outer bubbles can never see in.</strong> Master that one-way glass and you'll never be
        surprised by "is not defined" again — and you'll be ready for closures, the most
        magical thing in JavaScript, two lessons from now.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'bubbles',
      caption:
        'Three bubbles, drawn straight from the braces: the global bubble (the whole file), mission()’s bubble, and the if block’s bubble. Every { } pair blows a new bubble. A variable lives in the bubble where its let happened: planet in global, ship in mission, fuel in the if block.',
      highlightLines: [1, 4, 7],
    },
    {
      id: 'lookup-inner',
      caption:
        'Line 8 runs INSIDE the if block and needs fuel and ship. The engine shoots a lookup ray outward from where the name is used: fuel is found right here in the block’s own bubble. ship isn’t — so the ray passes through the bubble wall and finds it one bubble out, in mission(). Inner sees outer. The log works.',
      highlightLines: [8],
    },
    {
      id: 'lookup-far',
      caption:
        'The if block ended at line 9 — and look: its bubble POPPED, taking fuel with it. Block variables live exactly as long as their block. Now line 11 needs ship (found in this bubble) and planet — the ray travels through TWO walls to global and finds it. Rays can travel any distance, as long as the direction is outward.',
      highlightLines: [11],
    },
    {
      id: 'predict-fuel',
      caption:
        'Line 12 asks for fuel — but we’re standing in mission()’s bubble, and fuel lived in the if block. Before pressing next: what happens?',
      highlightLines: [12],
      prediction: {
        question: 'Line 12 (inside mission, but OUTSIDE the if block) runs console.log(fuel). What happens?',
        options: [
          'It prints 100 — the value is remembered from before',
          'It prints undefined — the variable is empty now',
          'The program crashes: ReferenceError: fuel is not defined',
        ],
        correctIndex: 2,
        why: 'fuel’s bubble popped when the if block ended, and lookup rays only travel OUTWARD — from mission’s bubble you cannot see into an inner block, and that block is gone anyway. The engine searches mission’s bubble, then global, finds no fuel anywhere, and throws a ReferenceError. Not undefined — “I have never heard of this name.”',
      },
    },
    {
      id: 'reveal',
      caption:
        'ReferenceError: fuel is not defined. Read the picture: the ray from line 12 hits nothing — the block bubble is gone, and even if it weren’t, rays don’t travel inward. This is the one-way glass: inner sees outer, outer never sees in. It’s a feature — mission’s internals stay private to mission.',
      highlightLines: [12],
    },
    {
      id: 'shadow',
      caption:
        'One last twist, with a different snippet: what if TWO bubbles each have a variable with the SAME name? The ray stops at the FIRST match it finds — the nearest bubble wins, and the outer name is invisible from inside, or “shadowed.” This prints "inner". Legal, but famous for confusing readers — most style guides say avoid it.',
      codeOverride: SHADOW_CODE,
      highlightLines: [4, 5],
    },
    {
      id: 'wrap',
      caption:
        'The whole lesson in three rules: (1) every { } blows a bubble, and let/const variables live in the bubble where they were declared; (2) lookups shoot rays outward — never inward; (3) the nearest match wins. Next lesson: what happens when functions call functions — bubbles aren’t enough, we’ll need a tower.',
    },
  ],
  Viz: ScopeLens,
  underTheHood: (
    <>
      <p>
        Real names: each bubble is a <strong>scope</strong> — global scope, function scope, block
        scope. What we drew as a ray is the engine walking the <strong>scope chain</strong>:
        current scope first, then outward, one level at a time, stopping at the first match.
        Exhaust the chain without a match → <code>ReferenceError</code>. This is called{' '}
        <strong>lexical scoping</strong>: the chain is fixed by where the code is <em>written</em>{' '}
        (where the braces are), not by how it's called.
      </p>
      <p>
        Remember leaky <code>var</code> from lesson 1.4? Now you can say precisely why it leaks:{' '}
        <code>var</code> ignores block bubbles and attaches to the whole <em>function</em> bubble.
        For twenty years that was all JavaScript had — real block scope only arrived with{' '}
        <code>let</code>/<code>const</code> in 2015.
      </p>
      <p>
        <strong style={{ color: 'var(--color-marker-coral)' }}>Fun fact:</strong> the spec has a
        deliciously spooky name for one corner of scope: the zone between entering a block and
        reaching a <code>let</code> line — where the variable exists but may not be touched yet —
        is officially called the <em>Temporal Dead Zone</em>. Yes, that's the real term standards
        engineers use, and yes, it sounds like a sci-fi movie.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'The lookup ray travels in ONE direction only. Type it: inward or outward.',
      accept: ['outward', 'Outward', 'out'],
      placeholder: 'inward / outward…',
      why: 'Outward — inner sees outer, never the reverse. The ray leaves the current bubble, checks the next one out, and so on until it finds the name or runs out of bubbles. That single direction rule is the whole game.',
    },
    {
      kind: 'type-output',
      question: 'Code in the global bubble tries to read a let variable declared INSIDE a function. Type the NAME of the error it gets.',
      accept: ['ReferenceError'],
      placeholder: 'SomethingError…',
      why: 'ReferenceError — the one-way glass. From outside, a function’s inner variables simply don’t exist: the lookup searches global, finds nothing, and throws. This privacy is a feature, and closures (lesson 3.7) will turn it into a superpower.',
    },
    {
      kind: 'type-output',
      question: 'Two variables, same name, different bubbles. Type exactly what calling f() prints:',
      code: 'let x = "out";\n\nfunction f() {\n  let x = "in";\n  console.log(x);\n}\n\nf();',
      accept: ['in'],
      why: 'Shadowing: the lookup stops at the FIRST match — the nearest bubble — so the inner "in" wins and the outer x is invisible from inside. Legal, but use sparingly.',
    },
  ],
  PlayExtra: () => <CodeExercise def={PRICE_TAG_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain scope to a friend using the bubbles-and-ray picture: where do variables live, which direction can lookups travel, and what happens when two bubbles use the same name?',
    modelAnswer:
      'Every pair of braces blows a bubble, and a variable lives in the bubble where it was declared — bubbles nest: blocks inside functions inside the global bubble. When a line uses a name, the engine shoots a lookup ray outward from that spot: it checks the current bubble first, then the next one out, and so on, using the first match it finds. Rays only travel outward — inner code can see outer variables, but outer code can NEVER see into an inner bubble, and a block’s variables vanish when the block ends. If the ray reaches the outermost bubble with no match, you get ReferenceError: not defined. If two bubbles declare the same name, the nearest bubble wins and the outer one is shadowed — invisible from inside. The direction rule is the whole game: inner sees outer, never the reverse.',
  },
  recap: [
    'Every { } blows a bubble (scope). let/const variables live in the bubble where they were declared, and die when it pops.',
    'Lookups shoot rays OUTWARD through the scope chain — inner sees outer, outer never sees in. No match anywhere → ReferenceError.',
    'Same name in two bubbles? Nearest wins (shadowing). var ignores block bubbles — that’s exactly why lesson 1.4 called it leaky.',
    'Fun fact: the spec really calls the region before a let line the "Temporal Dead Zone" — sci-fi name, official term.',
  ],
}
