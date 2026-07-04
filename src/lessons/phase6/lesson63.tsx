import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 6.3 — Callbacks & callback hell
 * Async work via continuation-passing: "when you're done, call this."
 * Works — then nests, slides rightward into the pyramid of doom, and
 * scatters error handling. The pain that motivates promises (6.4).
 */

const CODE = `function loadUser(cb) {
  setTimeout(() => cb("vas"), 40);
}
function loadCart(user, cb) {
  setTimeout(() => cb(user + "'s cart"), 40);
}
function pay(cart, cb) {
  setTimeout(() => cb(cart + " paid"), 40);
}

loadUser((user) => {
  loadCart(user, (cart) => {
    pay(cart, (receipt) => {
      console.log(receipt);
    });
  });
});`

interface View {
  depth: number
  lines: string[]
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without changing the code shape */
  badge?: string
}

const VIEWS: View[] = [
  {
    depth: 0,
    lines: ['loadUser(cb)…'],
    console: [],
    note: 'the three helpers all follow the callback contract: do async work, and when done, call cb(result)',
  },
  {
    depth: 0,
    lines: ['loadUser(cb)…'],
    console: [],
    note: 'the pattern: pass a function — “when you’re done, call this with the result”',
    badge: 'the caller gets NO return value — the RESULT TRAVELS THROUGH THE CALLBACK instead. That inversion is the whole pattern.',
  },
  {
    depth: 1,
    lines: ['loadUser((user) => {', '  …user has arrived…', '})'],
    console: [],
    note: 'the result arrives INSIDE the callback — that’s the only place it exists, and only once the work completes',
  },
  {
    depth: 2,
    lines: ['loadUser((user) => {', '  loadCart(user, (cart) => {', '    …', '  })', '})'],
    console: [],
    note: 'step 2 needs step 1’s result… so it must NEST inside step 1’s callback. The indentation isn’t style; it’s structure',
  },
  {
    depth: 3,
    lines: ['loadUser((user) => {', '  loadCart(user, (cart) => {', '    pay(cart, (receipt) => {', '      console.log(receipt)', '    })', '  })', '})'],
    console: ["vas's cart paid"],
    note: 'three steps → three levels deep. The receipt prints — it WORKS. But look at the shape: brackets stacked like dominoes',
  },
  {
    depth: 3,
    lines: ['loadUser((user) => {', '  loadCart(user, (cart) => {', '    pay(cart, (receipt) => {', '      console.log(receipt)', '    })', '  })', '})'],
    console: ["vas's cart paid"],
    note: 'real checkout flows run five or six steps deep — the code slides off the screen',
    badge: 'this shape earned a nickname developers say without smiling: callback hell',
  },
  {
    depth: 3,
    lines: ['and where does an ERROR go?', 'each level needs its own check…', 'if (err) { … } × every level'],
    console: ["vas's cart paid"],
    note: '5.8’s try/catch guards the SYNCHRONOUS stack — but each callback here runs LATER, on a fresh stack turn (6.2), long after any try has exited',
  },
  {
    depth: 3,
    lines: ['and where does an ERROR go?', 'each level needs its own check…', 'if (err) { … } × every level'],
    console: ["vas's cart paid"],
    note: 'this shape has a name: CALLBACK HELL. The cure was worth inventing — next lesson',
    badge: 'so every level needs its own error check, scattered — easy to forget one. Hold this pain.',
  },
]

function Pyramid({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 322" className="w-full">
      <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
        watch the left margin — the pyramid of doom
      </text>
      <RoughRect x={30} y={44} width={380} height={170} seed={1001} strokeWidth={2} roughness={1.4} />
      <AnimatePresence mode="wait">
        <motion.g key={view.lines.join('|')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {view.lines.map((line, i) => (
            <text key={`${line}-${i}`} x={46} y={70 + i * 20} fontFamily="var(--font-code)" fontSize={11.5} fill={line.includes('ERROR') || line.includes('if (err)') || line.includes('each level') ? 'var(--color-marker-coral)' : 'var(--color-ink)'}>
              {line}
            </text>
          ))}
        </motion.g>
      </AnimatePresence>
      {/* depth meter */}
      <text x={352} y={66} fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">nesting:</text>
      {Array.from({ length: 3 }, (_, i) => (
        <motion.rect key={i} animate={{ opacity: i < view.depth ? 1 : 0.15 }} x={352 + i * 18} y={74} width={14} height={14} rx={3} fill="var(--color-marker-coral)" />
      ))}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={44} y={222} width={352} height={32} seed={1003} strokeWidth={1.6} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 10%, transparent)" fillStyle="solid" />
            <text x={220} y={242} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fontWeight={700} fill="var(--color-pencil-blue)">
              {view.badge}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={266} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>

      <RoughRect x={40} y={280} width={360} height={30} seed={1002} strokeWidth={1.5} />
      <text x={58} y={300} fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">
        {view.console.length === 0 ? '(console: nothing yet)' : view.console.join('   ·   ')}
      </text>
    </svg>
  )
}

const RELAY_EXERCISE: CodeExerciseDef = {
  id: 'l63-relay',
  title: 'a two-step relay, callback style',
  task: 'Feel the pattern (and its shape) in your own hands: two async steps where the second NEEDS the first’s result — so it must live inside the first’s callback.',
  steps: [
    <>
      A function <code>fetchName(cb)</code> that waits 30ms (setTimeout), then calls{' '}
      <code>cb("vasavi")</code>.
    </>,
    <>
      A function <code>makeBadge(name, cb)</code> that waits 30ms, then calls{' '}
      <code>cb("badge: " + name)</code>.
    </>,
    <>
      Wire the relay: fetch the name, and INSIDE its callback, make the badge from it, and inside
      THAT callback print the result. One print, two levels deep — feel the slide.
    </>,
  ],
  starter: '',
  expectedOutput: ['badge: vasavi'],
  mustUse: [
    { test: /function\s+fetchName\s*\(\s*cb\s*\)|const\s+fetchName/, label: 'fetchName takes a callback' },
    { test: /setTimeout[\s\S]*setTimeout/, label: 'both steps are genuinely async (setTimeout)' },
    { test: /fetchName\s*\(\s*\(?\s*\w+\s*\)?\s*=>\s*\{[\s\S]*makeBadge\s*\(/, label: 'makeBadge is called INSIDE fetchName’s callback — the nesting is the lesson' },
  ],
  mustNotUse: [
    { test: /async|await|Promise/, label: 'callbacks only — the cure arrives next lesson' },
  ],
  modelAnswer: `function fetchName(cb) {
  setTimeout(() => cb("vasavi"), 30);
}

function makeBadge(name, cb) {
  setTimeout(() => cb("badge: " + name), 30);
}

fetchName((name) => {
  makeBadge(name, (badge) => {
    console.log(badge);
  });
});`,
}

export const lesson63: LessonDef = {
  id: '6.3',
  hook: (
    <>
      <p>
        You now know async results arrive <em>later</em> — so how does later-code get the value?
        The original answer, powering a decade of JavaScript:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          pass a callback
        </HighlightMark>{' '}
        — "when you're done, call this function with the result." It's 3.8's higher-order
        functions, doing the heaviest lifting of their careers.
      </p>
      <p>
        It works. And then real life asks for <em>step after step</em> — load the user, then their
        cart, then pay — and the pattern's flaw appears: each next step must nest inside the
        previous callback, and the code slides rightward into the{' '}
        <strong>pyramid of doom</strong>. Today you build the pyramid with your own hands and feel
        exactly why promises had to be invented.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'pattern-contract',
      caption:
        'The three helpers all follow the callback contract: do async work (here a small timer stands in for the network), and when done, call cb(result).',
      highlightLines: [1, 2, 3],
    },
    {
      id: 'pattern-inversion',
      caption:
        'The caller doesn’t get a return value — line 2 returns nothing useful — the RESULT TRAVELS THROUGH THE CALLBACK instead. That inversion is the whole pattern.',
      highlightLines: [1, 2, 3],
    },
    {
      id: 'inside-only',
      caption:
        'Using it: loadUser((user) => { … }). Understand what the arrow receives and WHEN: user exists only inside that callback, only when the work completes. Outside it — before it — there is no user anywhere. Async values live inside their callbacks.',
      highlightLines: [11],
    },
    {
      id: 'nest',
      caption:
        'Now the chain problem: loadCart NEEDS user. Since user only exists inside loadUser’s callback, loadCart’s call must go THERE — and its own result, cart, only exists inside ITS callback. Each dependent step digs one level deeper. The indentation isn’t style; it’s structure.',
      highlightLines: [11, 12, 13],
    },
    {
      id: 'pyramid-works',
      caption:
        'Three steps: three levels. The receipt prints — it WORKS — but look at the shape: closing brackets stacked like dominoes, logic marching off the right edge.',
      highlightLines: [11, 12, 13, 14, 15, 16, 17],
    },
    {
      id: 'pyramid-named',
      caption:
        'Real checkout flows run five or six steps deep. This shape earned a nickname developers say without smiling: callback hell.',
      highlightLines: [11, 12, 13, 14, 15, 16, 17],
    },
    {
      id: 'error-tryctach-fails',
      caption:
        'And the deeper wound: errors. 5.8’s try/catch guards the SYNCHRONOUS stack — but each callback here runs LATER, on a fresh stack turn (6.2), long after any try has exited.',
      highlightLines: [11, 12, 13],
    },
    {
      id: 'error-scattered',
      caption:
        'So every level needs its own error check, by convention an (err, result) first argument, handled at every single depth. Scattered, repetitive, easy to forget one. Hold this pain — next lesson sells the cure, and you’ll want to buy it.',
      highlightLines: [11, 12, 13],
    },
  ],
  Viz: Pyramid,
  underTheHood: (
    <>
      <p>
        The pattern's proper name is <em>continuation-passing</em>: instead of returning a value,
        a function receives "the rest of the program" (the continuation) as an argument and calls
        it when ready. Every callback API you'll ever meet — timers, old Node file APIs, event
        listeners in Phase 7 — is this one idea.
      </p>
      <p>
        Be precise about what's broken and what isn't: ONE level of callback is completely fine
        and stays common everywhere (every <code>addEventListener</code>, every{' '}
        <code>test('…', fn)</code> in your Phase 10 future is a callback). The failure mode is{' '}
        <em>sequencing chains</em> of dependent
        async steps — that's where nesting compounds, errors scatter, and reading order stops
        matching running order.
      </p>
      <p>
        The cure's shape is worth previewing precisely: promises turn "hand your next step INTO
        the function" into "the function HANDS BACK an object you can attach next steps to."
        Return-a-thing beats take-a-thing — it flattens the pyramid into a chain and gives errors
        one shared drain. That object is lesson 6.4.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Where does the value "vas" exist? Type: inside or outside (the callback).',
      code: 'function loadUser(cb) {\n  setTimeout(() => cb("vas"), 40);\n}\nloadUser((user) => {\n  // here?\n});\n// or here?',
      accept: ['inside', 'Inside', 'inside the callback'],
      placeholder: 'inside / outside…',
      why: 'Inside — the result travels through the callback’s parameter, arriving only when the async work completes. Outside (and before), user simply doesn’t exist. Async values live inside their callbacks.',
    },
    {
      kind: 'type-output',
      question: 'Step B needs step A’s result. In callback style, where must B’s call be written? Type: inside or after (A’s callback).',
      accept: ['inside', 'Inside', 'inside the callback', "inside A's callback"],
      placeholder: 'inside / after…',
      why: 'Inside A’s callback — that’s the only place A’s result exists. This forced nesting is exactly what stacks the pyramid one level per dependent step.',
    },
    {
      kind: 'type-output',
      question: 'Can a try/catch wrapped around loadUser(…) catch an error thrown LATER inside its callback? Type yes or no.',
      accept: ['no', 'No', 'NO', 'no!'],
      placeholder: 'yes / no…',
      why: 'No — the callback runs on a later stack turn (6.2), long after the try block exited. That’s why callback code handles errors per-level with (err, result) conventions — and a big part of why promises were invented.',
    },
  ],
  PlayExtra: () => <CodeExercise def={RELAY_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend how async code gets its results using callbacks, why chaining dependent steps creates the pyramid of doom, and why error handling makes it even worse.',
    modelAnswer:
      'A callback-style async function doesn’t return its result — it accepts a function and calls it with the result when the work finishes: loadUser(cb) eventually runs cb("vas"). So the result exists only INSIDE the callback, only after completion. That’s fine for one step — but when step B needs step A’s result, B’s call must be written inside A’s callback, and C inside B’s: each dependent step nests one level deeper, sliding the code rightward into the pyramid of doom. Errors compound it: try/catch can’t help, because each callback runs on a later stack turn after the try has exited — so every level needs its own error check, scattered and easy to forget. The shape works but doesn’t scale in readability or error handling — which is precisely the pain promises were designed to cure.',
  },
  recap: [
    'Callback contract: no return — the result arrives INSIDE the callback, later. (3.8, promoted to async duty.)',
    'Dependent steps must nest inside each other’s callbacks → the pyramid of doom. Structure, not style.',
    'try/catch can’t reach later stack turns → per-level error checks, scattered. The cure (an object you attach steps to) is next.',
  ],
}
