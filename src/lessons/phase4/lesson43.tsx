import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 4.3 — Growing & shrinking (push / pop / shift / unshift)
 * Viz: the array cells physically MOVE. push appends at the end (nothing else
 * moves); shift removes element 0 and every remaining element slides one
 * position left — the honest, visible cost. Removed elements fly out as
 * returned-value tokens; push shows its returned new length.
 */

const CODE = `const orders = ["latte", "mocha"];

orders.push("chai");
console.log(orders);

const next = orders.shift();
console.log(next);

orders.unshift("espresso");
console.log(orders);

orders.pop();
console.log(orders.length);`

interface View {
  cells: string[]
  /** which end just changed, for a colored flash */
  flash: 'front' | 'end' | null
  /** everyone slid this way (drawn as motion arrows under the cells) */
  slid: 'left' | 'right' | null
  /** token that flew out or in */
  token: { label: string; value: string } | null
  console: string[]
}

const VIEWS: View[] = [
  { cells: ['latte', 'mocha'], flash: null, slid: null, token: null, console: [] },
  {
    cells: ['latte', 'mocha', 'chai'], flash: 'end', slid: null,
    token: null,
    console: ['["latte","mocha","chai"]'],
  },
  {
    cells: ['latte', 'mocha', 'chai'], flash: 'end', slid: null,
    token: { label: 'push returned (new length)', value: '3' },
    console: ['["latte","mocha","chai"]'],
  },
  {
    cells: ['mocha', 'chai'], flash: 'front', slid: null,
    token: { label: 'shift returned (the removed element)', value: '"latte"' },
    console: ['["latte","mocha","chai"]', 'latte'],
  },
  {
    cells: ['mocha', 'chai'], flash: null, slid: 'left',
    token: null,
    console: ['["latte","mocha","chai"]', 'latte'],
  },
  {
    cells: ['espresso', 'mocha', 'chai'], flash: 'front', slid: 'right',
    token: null,
    console: ['["latte","mocha","chai"]', 'latte', '["espresso","mocha","chai"]'],
  },
  {
    cells: ['espresso', 'mocha'], flash: 'end', slid: null,
    token: { label: 'pop returned (the removed element)', value: '"chai"' },
    console: ['["latte","mocha","chai"]', 'latte', '["espresso","mocha","chai"]', '2'],
  },
  {
    cells: ['espresso', 'mocha'], flash: null, slid: null,
    token: null,
    console: ['["latte","mocha","chai"]', 'latte', '["espresso","mocha","chai"]', '2'],
  },
]

const CELL_W = 104
const CELL_X0 = 44

function GrowShrinkShelf({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 310" className="w-full">
      <RoughRect x={20} y={20} width={88} height={26} seed={441} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
      <text x={64} y={38} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill="var(--color-ink)">
        orders
      </text>
      <text x={120} y={38} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        — the SAME array the whole time
      </text>

      {/* cells — layout animation slides them when indexes change */}
      {view.cells.map((value, i) => {
        const flashing = (view.flash === 'front' && i === 0) || (view.flash === 'end' && i === view.cells.length - 1)
        return (
          <motion.g key={value} layout transition={{ type: 'spring', damping: 18 }}>
            <motion.g
              animate={{ x: CELL_X0 + i * CELL_W, y: 78 }}
              initial={{ x: CELL_X0 + i * CELL_W, y: 78 }}
              transition={{ type: 'spring', damping: 17 }}
            >
              <RoughRect
                x={0}
                y={0}
                width={CELL_W - 12}
                height={52}
                seed={450 + (value.length % 7)}
                strokeWidth={flashing ? 2.6 : 1.8}
                stroke={flashing ? 'var(--color-marker-coral)' : 'var(--color-ink)'}
                fill={flashing ? 'color-mix(in srgb, var(--color-marker-coral) 18%, transparent)' : 'var(--color-paper-raised, #fff)'}
                fillStyle="solid"
              />
              <text x={(CELL_W - 12) / 2} y={32} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13.5} fontWeight={600} fill="var(--color-ink)">
                {value}
              </text>
              <text x={(CELL_W - 12) / 2} y={72} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink-soft)">
                {i}
              </text>
            </motion.g>
          </motion.g>
        )
      })}

      {/* the re-indexing callout */}
      <AnimatePresence>
        {view.slid && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <text x={CELL_X0 + 2} y={178} fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-marker-coral)" fontWeight={700}>
              {view.slid === 'left'
                ? '← every element slid one position left — all re-indexed'
                : '→ every element slid one position right to make room at 0'}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* returned-value token */}
      <AnimatePresence>
        {view.token && (
          <motion.g
            key={view.token.value}
            initial={{ opacity: 0, y: 96 }}
            animate={{ opacity: 1, y: 196 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 16 }}
          >
            <RoughRect x={140} y={0} width={160} height={26} seed={461} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
            <text x={220} y={17} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fontWeight={700} fill="var(--color-ink)">
              {view.token.value}
            </text>
            <text x={220} y={44} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
              {view.token.label}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* console strip */}
      <RoughRect x={40} y={252} width={360} height={52} seed={462} strokeWidth={1.5} />
      <text x={52} y={248} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        console
      </text>
      {view.console.length === 0 ? (
        <text x={220} y={282} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
          (nothing printed yet)
        </text>
      ) : (
        view.console.slice(-2).map((line, i) => (
          <motion.text
            key={`${line}-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            x={58}
            y={270 + i * 16}
            fontFamily="var(--font-code)"
            fontSize={11.5}
            fill="var(--color-ink)"
          >
            {line}
          </motion.text>
        ))
      )}
    </svg>
  )
}

const TODOS_EXERCISE: CodeExerciseDef = {
  id: 'l42-todos',
  title: 'a day in a to-do list',
  task: 'Your to-do list changes all day: urgent things cut the line, finished things leave, new things join at the back. Mutate ONE array through the whole day — never rebuild it by hand.',
  steps: [
    <>
      Start with an array named <code>todos</code> holding <code>"email boss"</code> and{' '}
      <code>"water plants"</code>, in that order.
    </>,
    <>
      An urgent task arrives: <code>"call plumber"</code> must enter at the <strong>front</strong>{' '}
      of the array.
    </>,
    <>
      You do the front task immediately — remove it from the <strong>front</strong>.
    </>,
    <>
      Add <code>"gym"</code> at the <strong>end</strong>, then print the array, then print how
      many tasks it holds.
    </>,
  ],
  starter: '',
  expectedOutput: ['["email boss","water plants","gym"]', '3'],
  mustUse: [
    { test: /todos\.unshift\s*\(/, label: 'entering at the front is unshift' },
    { test: /todos\.shift\s*\(\s*\)/, label: 'leaving from the front is shift' },
    { test: /todos\.push\s*\(/, label: 'joining at the end is push' },
    { test: /todos\.length/, label: 'the count comes from .length' },
  ],
  mustNotUse: [
    { test: /=\s*\[[^\]]*gym/, label: 'the array must be CHANGED by methods — not rebuilt by hand with gym inside' },
    { test: /console\.log\s*\(\s*3\s*\)/, label: 'no hand-typed 3 — ask the array' },
  ],
  modelAnswer: `const todos = ["email boss", "water plants"];

todos.unshift("call plumber");
todos.shift();
todos.push("gym");

console.log(todos);
console.log(todos.length);`,
}

export const lesson43: LessonDef = {
  id: '4.3',
  hook: (
    <>
      <p>
        Real collections never sit still. A café's order list grows as people order and shrinks as
        drinks go out. A browser's history grows with every page. Yesterday's array-by-index tricks
        can't do this — assigning to <code>orders[2]</code> replaces an element, but it can't{' '}
        <em>make room</em> or <em>close a gap</em>.
      </p>
      <p>
        Arrays carry four built-in methods for exactly this, two per end:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          push and pop work at the end; unshift and shift work at the front
        </HighlightMark>
        .
      </p>
      <p>
        Same four verbs power everything from undo stacks to print queues — and one of them is
        secretly more expensive than the others. You'll <em>see</em> which.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'start',
      caption:
        'The café opens with two orders. Watch the cells and their indexes below — the whole lesson is about what happens to EXISTING elements when the array grows or shrinks.',
      highlightLines: [1],
    },
    {
      id: 'push',
      caption:
        'orders.push("chai") appends a new element after the current last one. Nothing else moved — latte and mocha kept their indexes. End-of-array work disturbs nobody.',
      highlightLines: [3, 4],
    },
    {
      id: 'push-returns',
      caption:
        'And push hands something back: the array’s NEW LENGTH, 3. Every one of today’s four methods returns something — that detail writes half of tomorrow’s bugs.',
      highlightLines: [3, 4],
    },
    {
      id: 'shift',
      caption:
        'orders.shift() removes the element at index 0 AND returns it — so const next = orders.shift() catches "latte" as it leaves.',
      highlightLines: [6, 7],
    },
    {
      id: 'shift-reindex',
      caption:
        'Now watch the shelf: mocha slid from index 1 to 0, chai from 2 to 1. shift re-indexes EVERY remaining element. On three elements that’s invisible; on a million-element array, that’s a million moves for one removal — 4.2’s O(n) bill, arriving on schedule.',
      highlightLines: [6, 7],
    },
    {
      id: 'unshift',
      caption:
        'orders.unshift("espresso") is the reverse: first every element slides one position RIGHT to clear index 0, then the new element drops in at the front. Same cost story as shift — front-of-array work moves everyone.',
      highlightLines: [9, 10],
    },
    {
      id: 'pop',
      caption:
        'orders.pop() removes the LAST element and returns it — we let "chai" go without storing it. End-of-array again: nobody else moved. Final count: 2.',
      highlightLines: [12, 13],
    },
    {
      id: 'the-pattern',
      caption:
        'The pattern to keep forever: END work (push/pop) is cheap — O(1), nobody moves. FRONT work (shift/unshift) moves everyone — O(n). When lists get big, which end you work at becomes a real decision.',
      highlightLines: [3, 6, 9, 12],
    },
  ],
  Viz: GrowShrinkShelf,
  underTheHood: (
    <>
      <p>
        All four methods <strong>mutate</strong> the array — they change the one you already have
        rather than making a new one. The variable still points at the <em>same array</em>; only
        its contents and <code>.length</code> changed. (Keep the phrase “the same array” in your
        pocket — lesson 4.6 turns it into the most important idea of this phase.)
      </p>
      <p>
        Each also returns a value, and mixing them up is a classic bug: <code>pop</code> and{' '}
        <code>shift</code> return <em>the removed element</em>; <code>push</code> and{' '}
        <code>unshift</code> return <em>the new length</em>. So{' '}
        <code>const t = list.push("x")</code> puts a <em>number</em> in <code>t</code>, not the
        text — a mistake you'll now spot at a glance.
      </p>
      <p>
        The cost difference is real, not folklore — end work is O(1), front work O(n), in lesson 4.2’s labels: elements sit in order in memory, so removing the
        front means every survivor is re-indexed, while the end just grows or shrinks in place.
        It's the supermarket queue versus the plate stack: when the first person leaves a queue,
        the whole line shuffles forward; the top plate lifts off a stack and no other plate moves.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const q = ["ana", "ben", "cara"];\nconst x = q.shift();\nconsole.log(x);',
      accept: ['ana'],
      placeholder: 'type the console output…',
      why: 'shift removes the FRONT element and returns it — x caught "ana" on the way out. The array is left holding ["ben","cara"], freshly re-indexed.',
    },
    {
      kind: 'type-output',
      question: 'Careful — type exactly what this prints:',
      code: 'const s = [5, 6];\nconsole.log(s.push(7));',
      accept: ['3'],
      placeholder: 'type the console output…',
      why: 'push appends 7, then returns the NEW LENGTH — 3. It does not return the array or the added element. pop/shift return the removed element; push/unshift return the new length.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const t = ["x", "y", "z"];\nt.shift();\nconsole.log(t[0]);',
      accept: ['y'],
      placeholder: 'type the console output…',
      why: 'After shift removes "x", every remaining element slides one position left — "y" now lives at index 0. That silent re-indexing is exactly why front-of-array work costs more.',
    },
  ],
  PlayExtra: () => <CodeExercise def={TODOS_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend why removing the first element of a huge array is slower than removing the last one — and what pop and push each hand back when called.',
    modelAnswer:
      'Array elements sit in order, and every element’s index is its distance from the start. Remove the LAST element (pop) and nothing else is affected. Remove the FIRST (shift) and every remaining element is now one step closer to the start — the array re-indexes all of them, so on a million elements that’s a million little moves for one removal. It’s a supermarket queue versus a plate stack: the queue shuffles forward when the front person leaves; the top plate lifts off and nobody else moves. And the return values differ: pop and shift return the element they removed; push and unshift return the array’s new length — so storing push’s result gives you a number, not your item.',
  },
  recap: [
    'push/pop work at the END (cheap); unshift/shift work at the FRONT (every remaining element re-indexes).',
    'pop & shift return the REMOVED ELEMENT; push & unshift return the NEW LENGTH.',
    'All four mutate — the variable keeps pointing at the same array; its contents and .length change in place.',
  ],
}
