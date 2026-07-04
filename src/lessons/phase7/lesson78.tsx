import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 7.8 — How the browser renders
 * Parse → Render Tree → Layout → Paint, gently. The critical gap for
 * testers: an element can EXIST in the DOM (7.1/7.2's queries) before it is
 * laid out or painted — "not visible yet." That gap is why Playwright's
 * auto-waiting checks attached/visible/stable/enabled instead of just
 * existence.
 */

const CODE = `<!-- the HTML the server sent -->
<body>
  <h1>My List</h1>
  <p class="note">loading…</p>
</body>

<!-- the CSS the server sent -->
<style>
  .note { display: none; }
</style>

// in JS: a mutation, later
document.querySelector("h1").textContent = "Shopping";`

const STAGES = ['Parse', 'Render Tree', 'Layout', 'Paint']

interface Item {
  label: string
  tone?: 'ok' | 'bad' | 'excluded'
}
interface View {
  litStages: number[]
  items: Item[]
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without changing the items */
  badge?: string
}

const VIEWS: View[] = [
  {
    litStages: [0], items: [{ label: 'DOM tree — from HTML (7.1)' }, { label: 'CSSOM — from CSS (new!)' }], console: [],
    note: 'parse produces TWO trees in parallel: the DOM you already know, and a new one — the CSSOM',
  },
  {
    litStages: [0, 1], items: [{ label: 'h1', tone: 'ok' }, { label: 'p.note', tone: 'ok' }, { label: 'ul#items', tone: 'ok' }], console: [],
    note: 'DOM + CSSOM combine into the RENDER TREE — the structure the browser will actually draw',
  },
  {
    litStages: [0, 1], items: [{ label: 'h1', tone: 'ok' }, { label: 'p.note — display:none', tone: 'excluded' }, { label: 'ul#items', tone: 'ok' }], console: [],
    note: 'but only VISIBLE nodes make it in: p.note is excluded from the render tree ENTIRELY',
  },
  {
    litStages: [0, 1, 2], items: [{ label: 'h1 → x:16 y:20 w:200 h:32', tone: 'ok' }, { label: 'ul#items → x:16 y:60 w:200 h:80', tone: 'ok' }], console: [],
    note: 'LAYOUT computes the exact size and position of every remaining node — pure geometry, not one pixel drawn yet',
    badge: 'this step has a nickname too: REFLOW. Doing it too often (heavy animations, huge tables) is a classic performance cost.',
  },
  {
    litStages: [0, 1, 2, 3], items: [{ label: 'h1 — painted ✓', tone: 'ok' }, { label: 'ul#items — painted ✓', tone: 'ok' }], console: [],
    note: 'PAINT finally draws pixels: colors, text, borders, images — turning geometry into something you can actually see',
    badge: 'modern browsers also COMPOSITE separate layers afterward (why some animations feel "free") — a detail for another day',
  },
  {
    litStages: [0, 1, 2, 3], items: [{ label: 'h1 — text changed → REPAINTS', tone: 'ok' }], console: ['Shopping'],
    note: 'mutate the DOM (7.3) and this pipeline partially RE-RUNS — that’s what "the page repaints" has meant this whole phase',
  },
  {
    litStages: [0, 1, 2, 3], items: [{ label: 'in the DOM (queryable) — YES', tone: 'ok' }, { label: 'painted on screen — NOT YET', tone: 'bad' }], console: ['Shopping'],
    note: 'the critical gap: an element can EXIST in the DOM the instant you query it (7.1/7.2) while NOT YET being laid out or painted',
  },
  {
    litStages: [0, 1, 2, 3], items: [{ label: 'display:none → 0 space, removed from render tree', tone: 'excluded' }, { label: 'visibility:hidden → space reserved, just not painted', tone: 'bad' }], console: ['Shopping'],
    note: 'two different "invisible" tools, two different footprints — pick the right one, and the right test assertion',
  },
  {
    litStages: [0, 1, 2, 3], items: [{ label: 'attached ✓', tone: 'ok' }, { label: 'visible ✓', tone: 'ok' }, { label: 'stable ✓', tone: 'ok' }, { label: 'enabled ✓', tone: 'ok' }], console: ['Shopping'],
    note: 'this exact gap is why Playwright checks ALL of these before acting — not just "does it exist," which you now know isn’t enough',
  },
]

function RenderPipeline({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      <text x={24} y={20} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
        the render pipeline
      </text>
      {STAGES.map((label, i) => {
        const lit = view.litStages.includes(i)
        return (
          <g key={label}>
            <RoughRect x={30 + i * 100} y={28} width={90} height={34} seed={1201 + i} strokeWidth={lit ? 2.2 : 1.5} stroke={lit ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={lit ? 'color-mix(in srgb, var(--color-marker-teal) 12%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
            <text x={75 + i * 100} y={49} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">{label}</text>
            {i > 0 && <text x={25 + i * 100} y={50} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">→</text>}
          </g>
        )
      })}

      {view.items.map((item, i) => {
        const y = 90 + i * 42
        const color = item.tone === 'bad' ? 'var(--color-marker-coral)' : item.tone === 'excluded' ? 'var(--color-ink-soft)' : 'var(--color-marker-teal)'
        return (
          <motion.g key={item.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
            <RoughRect x={30} y={y} width={380} height={32} seed={1211 + i} strokeWidth={1.8} roughness={item.tone === 'excluded' ? 2.4 : 1.3} stroke={color} fill={`color-mix(in srgb, ${color} 10%, transparent)`} fillStyle="solid" />
            <text x={220} y={y + 20} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill={item.tone === 'excluded' ? 'var(--color-ink-soft)' : 'var(--color-ink)'} style={item.tone === 'excluded' ? { textDecoration: 'line-through' } : undefined}>
              {item.label}
            </text>
          </motion.g>
        )
      })}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={30} y={252} width={380} height={30} seed={1221} strokeWidth={1.6} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 10%, transparent)" fillStyle="solid" />
            <text x={220} y={271} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fontWeight={700} fill="var(--color-pencil-blue)">
              {view.badge}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={296} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={314} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10} fill="var(--color-ink-soft)">
          console: {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const VISIBILITY_EXERCISE: CodeExerciseDef = {
  id: 'l78-visibility',
  title: 'model the render-tree exclusion',
  task: 'The sandbox has no real rendering — so model the ONE rule that matters most: which nodes make it into the render tree, and which don’t.',
  steps: [
    <>
      An array <code>nodes</code> of objects: <code>{'{ tag: "h1", display: "block" }'}</code>,{' '}
      <code>{'{ tag: "p", display: "none" }'}</code>, <code>{'{ tag: "ul", display: "block" }'}</code>.
    </>,
    <>
      Write <code>renderTree(nodes)</code>: return only the nodes whose <code>display</code> is
      NOT <code>"none"</code> (4.9’s filter).
    </>,
    <>
      Print how many nodes are in the full <code>nodes</code> array, then how many survive into{' '}
      <code>renderTree(nodes)</code>.
    </>,
  ],
  starter: '',
  expectedOutput: ['3', '2'],
  mustUse: [
    { test: /function\s+renderTree\s*\(\s*nodes\s*\)/, label: 'one function, renderTree(nodes)' },
    { test: /\.filter\s*\(/, label: 'exclusion is a filter, not a manual loop' },
    { test: /display\s*!==\s*["']none["']|display\s*===\s*["']none["']/, label: 'the check is on the display property' },
  ],
  mustNotUse: [
    { test: /\.length\s*-\s*1/, label: 'no hard-coded "minus one" — the filter must actually decide' },
  ],
  modelAnswer: `const nodes = [
  { tag: "h1", display: "block" },
  { tag: "p", display: "none" },
  { tag: "ul", display: "block" },
];

function renderTree(nodes) {
  return nodes.filter((node) => node.display !== "none");
}

console.log(nodes.length);
console.log(renderTree(nodes).length);`,
}

export const lesson78: LessonDef = {
  id: '7.8',
  hook: (
    <>
      <p>
        You've mutated the tree (7.3) and heard the word "repaint" more than once already.
        Today, gently, the whole pipeline behind it — and the one gap in it that causes more
        flaky tests than almost anything else:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          existing in the DOM is not the same as being visible on screen
        </HighlightMark>
        .
      </p>
      <p>
        Four stages, in order, every single page load: Parse → Render Tree → Layout → Paint.
        Learn the shape once, and "why is my test clicking something that isn't there yet"
        stops being a mystery.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'parse-html-css',
      caption:
        'Parsing produces TWO trees at once: the DOM (from the HTML text, 7.1 — you already own this) and a new one, the CSSOM (from the CSS text) — a tree of style rules, same shape idea, different source.',
      highlightLines: [1, 2, 3, 4, 5],
    },
    {
      id: 'render-tree-combine',
      caption:
        'The DOM and CSSOM combine into the RENDER TREE — the structure the browser will actually draw, carrying both the content AND the computed styles for each node.',
      highlightLines: [7, 8, 9, 10],
    },
    {
      id: 'render-tree-exclusion',
      caption:
        'But only VISIBLE nodes make it in: p.note has display: none in its CSS, so it is excluded from the render tree ENTIRELY — it exists in the DOM, and is completely absent from what gets drawn.',
      highlightLines: [4, 9],
    },
    {
      id: 'layout',
      caption:
        'LAYOUT (its other name: reflow) computes the exact size and position of every remaining node — pure geometry. Not one pixel has been drawn yet.',
      highlightLines: [2, 3],
    },
    {
      id: 'paint',
      caption:
        'PAINT finally draws pixels — colors, text, borders, images — turning that geometry into something a human can actually see on the screen.',
      highlightLines: [2, 3],
    },
    {
      id: 'mutation-reruns-it',
      caption:
        'Mutate the DOM (7.3) and this pipeline partially RE-RUNS on whatever changed — that is precisely what "the page repaints" has meant this entire phase, named at last.',
      highlightLines: [13],
    },
    {
      id: 'exists-vs-visible',
      caption:
        'And here is the gap that matters most for testing: an element can EXIST in the DOM — findable the instant you query it, 7.1/7.2 — while NOT YET being laid out or painted. "Not visible yet" is a real, common state, not an error.',
      highlightLines: [13],
    },
    {
      id: 'display-none-vs-hidden',
      caption:
        'Two different "invisible" CSS tools, two different footprints: display: none removes the element from the render tree entirely — zero space, as if it weren’t there. visibility: hidden keeps its space reserved; it simply isn’t painted. Different tools, different assertions.',
      highlightLines: [9],
    },
    {
      id: 'autowaiting-payoff',
      caption:
        'This exact exists-but-not-visible gap is why Playwright’s auto-waiting checks several things before acting on an element — attached, visible, stable, enabled — instead of just "is it in the DOM," which you now know isn’t nearly enough.',
      highlightLines: [13],
    },
  ],
  Viz: RenderPipeline,
  underTheHood: (
    <>
      <p>
        "Gently" because the real pipeline has more nuance the job rarely needs day to day: layout
        can happen more than once per frame if JS reads a geometry property (like{' '}
        <code>offsetHeight</code>) right after writing one (forcing a "layout thrash").
      </p>
      <p>
        And modern engines composite separate layers so some animations (transform, opacity) skip
        layout and paint almost entirely — which is exactly why those two properties are the fast
        ones to animate.
      </p>
      <p>
        Precision on the CSSOM: it isn't optional or skippable — a page with zero CSS still
        builds one (with browser-default styles), because the render tree always needs computed
        styles paired with content, never content alone.
      </p>
      <p>
        Job note: this whole lesson is the "why" behind auto-waiting, the single feature that
        makes Playwright tests dramatically less flaky than hand-rolled ones. Phase 11 teaches the
        API; today you own the reason it has to exist at all.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'An element has display: none. Is it part of the render tree? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — display: none removes an element from the render tree entirely, unlike visibility: hidden, which keeps its layout space but simply isn’t painted.',
    },
    {
      kind: 'type-output',
      question: 'Put these four stages in order (comma-separated): Paint, Parse, Layout, Render Tree',
      accept: ['Parse, Render Tree, Layout, Paint', 'parse, render tree, layout, paint'],
      placeholder: 'stage, stage, stage, stage…',
      why: 'Parse → Render Tree → Layout → Paint. Every page load runs this order, every time — and partially re-runs it on every DOM/CSS mutation.',
    },
    {
      kind: 'type-output',
      question: 'Can an element exist in the DOM (queryable with querySelector) before it has been painted on screen? Type yes or no.',
      accept: ['yes', 'Yes', 'YES'],
      placeholder: 'yes / no…',
      why: 'Yes — this exact gap is why Playwright checks attached, visible, stable, and enabled before acting, instead of trusting DOM presence alone.',
    },
  ],
  PlayExtra: () => <CodeExercise def={VISIBILITY_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend the four stages of the render pipeline, in order — and why "it exists in the DOM" is not the same claim as "it is visible on screen," with an example of a real testing consequence.',
    modelAnswer:
      'Every page runs the same four-stage pipeline. Parse builds two trees at once: the DOM from the HTML, and a new one, the CSSOM, from the CSS. Those combine into the render tree — but only visible nodes make it in; anything with display: none is excluded entirely, as if it never existed for drawing purposes. Layout (also called reflow) then computes the exact size and position of every remaining node — pure geometry, no pixels yet. Paint finally draws those pixels: colors, text, borders, images. Mutating the DOM or CSS later partially re-runs this pipeline, which is what "repaint" has meant throughout this phase. The testing consequence: an element can exist in the DOM — findable with querySelector the instant it’s added — while not yet being laid out or painted, so a script that acts the moment it finds an element can click something that isn’t actually ready yet. That is exactly why Playwright’s auto-waiting checks that an element is attached, visible, stable, and enabled before acting, rather than trusting DOM presence alone.',
  },
  recap: [
    'Parse (DOM + CSSOM) → Render Tree (visible nodes only — display:none is fully excluded) → Layout/reflow (geometry) → Paint (pixels). Mutations partially re-run this.',
    'Existing in the DOM ≠ visible on screen. That gap — "not visible yet" — is real and common, not an error.',
    'display:none removes an element from the render tree (0 space); visibility:hidden keeps its space, just unpainted. This exact gap is why Playwright’s auto-waiting checks attached/visible/stable/enabled, not just DOM presence.',
  ],
}
