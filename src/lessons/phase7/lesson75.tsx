import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 7.5 — Bubbling, delegation & preventDefault
 * Every event travels: capture DOWN from the root, arrives at the TARGET,
 * then bubbles back UP. Most listeners run in the bubble phase — which is
 * what makes delegation possible: one listener on a parent, not one per
 * child, present or future. preventDefault is a separate, unrelated tool:
 * it stops the browser's own default reaction, not the event's travel.
 */

const CODE = `const list = document.querySelector("#list");

list.addEventListener("click", (event) => {
  console.log("heard on: " + event.currentTarget.id);
  console.log("actually clicked: " + event.target.tagName);

  if (event.target.matches(".delete")) {
    event.target.closest("li").remove();
  }
});

// <ul id="list">
//   <li>milk <button class="delete">×</button></li>
//   <li>eggs <button class="delete">×</button></li>
// </ul>`

const PREVENT_CODE = `const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("intercepted — no page reload");
});`

const NODES = ['document', 'ul#list — LISTENER HERE', 'li', 'button.delete — clicked']

interface View {
  markerAt: number | null
  phaseLabel: string
  lit: number[]
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without moving the marker */
  badge?: string
}

const VIEWS: View[] = [
  {
    markerAt: null, phaseLabel: '', lit: [], console: [],
    note: 'click the delete button on "milk" — does only IT react, or do its ancestors too?',
  },
  {
    markerAt: 0, phaseLabel: 'capturing ↓', lit: [], console: [],
    note: 'the journey actually starts at the TOP: capture sweeps DOWN from document toward the target (most listeners skip this phase)',
  },
  {
    markerAt: 3, phaseLabel: 'TARGET', lit: [0, 1, 2], console: [],
    note: 'capture arrives at the button — the actual element the click hit. event.target will point here',
  },
  {
    markerAt: 2, phaseLabel: 'bubbling ↑', lit: [3], console: [],
    note: 'then it BUBBLES back up: button → li → ul → document',
  },
  {
    markerAt: 1, phaseLabel: 'bubbling ↑ — listener fires!', lit: [3, 2], console: ['heard on: list', 'actually clicked: BUTTON'],
    note: 'bubbling delivers the event to the ONE listener in this whole tree — on ul#list',
  },
  {
    markerAt: 1, phaseLabel: 'bubbling ↑ — listener fires!', lit: [3, 2], console: ['heard on: list', 'actually clicked: BUTTON'],
    note: 'inside the handler, two different things',
    badge: 'event.target = the button (where it happened). event.currentTarget = the ul (where the LISTENER lives).',
  },
  {
    markerAt: 1, phaseLabel: 'bubbling ↑ — listener fires!', lit: [3, 2], console: ['heard on: list', 'actually clicked: BUTTON'],
    note: 'the payoff pattern: delegation',
    badge: 'ONE listener on the parent covers every child button — no need to wire each one individually',
  },
  {
    markerAt: 1, phaseLabel: 'bubbling ↑ — listener fires!', lit: [3, 2], console: ['heard on: list', 'actually clicked: BUTTON'],
    note: 'and it covers the FUTURE too',
    badge: 'a new <li> added later is automatically covered — delegation relies on bubbling, not a per-element listener',
  },
  {
    markerAt: 1, phaseLabel: 'stopped here ✗', lit: [3, 2], console: ['heard on: list', 'actually clicked: BUTTON'],
    note: 'event.stopPropagation() would cut the bubble short — ancestors after this point never see it',
    badge: 'rare — it also breaks delegation for anyone ELSE listening further up. Use sparingly.',
  },
  {
    markerAt: null, phaseLabel: '', lit: [], console: ['intercepted — no page reload'],
    note: 'a DIFFERENT button: preventDefault() stops the browser’s OWN default reaction (link navigate, form submit) — unrelated to bubbling',
  },
]

function EventBubbles({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 330" className="w-full">
      <text x={24} y={24} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
        the event's journey through the tree
      </text>
      {NODES.map((label, i) => {
        const y = 40 + i * 52
        const isLit = view.lit.includes(i)
        return (
          <g key={label}>
            {i > 0 && <HandArrow from={{ x: 130, y: y - 12 }} to={{ x: 130, y: y - 2 }} curve={0} seed={1161 + i} stroke="var(--color-ink-soft)" strokeWidth={1.4} headLength={0} />}
            <RoughRect x={30} y={y} width={200} height={34} seed={1165 + i} strokeWidth={isLit ? 2.2 : 1.6} stroke={isLit ? 'var(--color-marker-teal)' : 'var(--color-ink)'} fill={isLit ? 'color-mix(in srgb, var(--color-marker-teal) 10%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
            <text x={130} y={y + 21} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">{label}</text>
          </g>
        )
      })}

      <AnimatePresence>
        {view.markerAt !== null && (
          <motion.g key="marker" animate={{ y: 40 + view.markerAt * 52 + 17 }} transition={{ type: 'spring', damping: 16 }}>
            <circle cx={280} cy={0} r={10} fill="var(--color-marker-coral)" />
            <text x={280} y={4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">●</text>
          </motion.g>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {view.phaseLabel && (
          <motion.text key={view.phaseLabel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={330} y={40 + (view.markerAt ?? 0) * 52 + 21} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fontWeight={700} fill="var(--color-marker-coral)">
            {view.phaseLabel}
          </motion.text>
        )}
      </AnimatePresence>

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={30} y={252} width={380} height={30} seed={1171} strokeWidth={1.6} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 10%, transparent)" fillStyle="solid" />
            <text x={220} y={271} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-pencil-blue)">
              {view.badge}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={296} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>

      <RoughRect x={40} y={306} width={360} height={20} seed={1172} strokeWidth={1.5} />
      <text x={220} y={320} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10} fill="var(--color-ink)">
        {view.console.length === 0 ? '(console: nothing yet)' : view.console.join('  ·  ')}
      </text>
    </svg>
  )
}

const DELEGATE_EXERCISE: CodeExerciseDef = {
  id: 'l75-delegate',
  title: 'delegate, don’t multiply',
  task: 'Build the delegation pattern in miniature: ONE handler that receives which child fired and removes it — modeled with plain objects and arrays (no real DOM in this sandbox).',
  steps: [
    <>
      An array <code>items</code> of objects: <code>{'{ id: "milk" }'}</code>,{' '}
      <code>{'{ id: "eggs" }'}</code>, <code>{'{ id: "bread" }'}</code>.
    </>,
    <>
      A function <code>handleDelegatedClick(items, clickedId)</code>: return a NEW array with the
      matching item removed (4.9’s filter — one function, works for ANY id).
    </>,
    <>
      Call it with <code>"eggs"</code>, print the remaining ids joined by <code>", "</code>. Then
      call it AGAIN on that result with <code>"bread"</code> — the SAME function handling a
      completely different click, proving delegation needs no per-item logic. Print the final
      ids.
    </>,
  ],
  starter: '',
  expectedOutput: ['milk, bread', 'milk'],
  mustUse: [
    { test: /function\s+handleDelegatedClick\s*\(\s*items\s*,\s*clickedId\s*\)/, label: 'one function, handleDelegatedClick(items, clickedId)' },
    { test: /\.filter\s*\(/, label: 'removal uses filter — a new array, nothing mutated in place' },
    { test: /\.join\s*\(\s*["'], ["']\s*\)/, label: 'printed as a joined string' },
  ],
  mustNotUse: [
    { test: /if\s*\(\s*clickedId\s*===\s*["']milk["']|if\s*\(\s*clickedId\s*===\s*["']eggs["']/, label: 'no per-id branches — ONE generic function is the whole point' },
  ],
  modelAnswer: `const items = [{ id: "milk" }, { id: "eggs" }, { id: "bread" }];

function handleDelegatedClick(items, clickedId) {
  return items.filter((item) => item.id !== clickedId);
}

const afterFirst = handleDelegatedClick(items, "eggs");
console.log(afterFirst.map((i) => i.id).join(", "));

const afterSecond = handleDelegatedClick(afterFirst, "bread");
console.log(afterSecond.map((i) => i.id).join(", "));`,
}

export const lesson75: LessonDef = {
  id: '7.5',
  hook: (
    <>
      <p>
        Last lesson ended on a cliffhanger: an event doesn't just hit its target — it{' '}
        <em>travels</em> through the whole tree on the way there and back. Today: the full
        journey, and the single most useful trick it quietly enables —{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          delegation
        </HighlightMark>
        : one listener instead of a hundred.
      </p>
      <p>
        Plus a separate tool that gets confused with it constantly:{' '}
        <code>preventDefault()</code>, which stops the browser's own reaction to an event — a
        link navigating, a form submitting — and has nothing to do with the event's travel at
        all.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-question',
      caption:
        'A click lands on the delete button, nested inside an li, inside a ul. Does ONLY the button react — or do its ancestors get a say too?',
      highlightLines: [1, 3],
    },
    {
      id: 'capture-phase',
      caption:
        'The journey actually starts at the very TOP of the tree: the CAPTURE phase sweeps DOWN from document toward the target. Almost nobody listens here — it needs a special third argument to addEventListener — but it always happens first.',
      highlightLines: [3],
    },
    {
      id: 'target-phase',
      caption:
        'Capture arrives at the button — the actual element the click hit. This is the TARGET phase, and it is exactly what event.target will point to inside any handler.',
      highlightLines: [4, 5],
    },
    {
      id: 'bubble-phase',
      caption:
        'Then the event reverses and BUBBLES back UP: button → li → ul → document. Any listener along this path, in the default (bubble) mode, gets a turn — in order, innermost first.',
      highlightLines: [3],
    },
    {
      id: 'bubble-hits-listener',
      caption:
        'Bubbling delivers the event to the ONE listener that exists anywhere in this tree — the one wired to ul#list. It never needed a listener of its own on every button.',
      highlightLines: [1, 3],
    },
    {
      id: 'target-vs-currentTarget',
      caption:
        'Inside that handler, two properties matter and are easy to confuse: event.target is the button — where the click actually happened. event.currentTarget is the ul — where THIS listener lives.',
      highlightLines: [4, 5],
    },
    {
      id: 'delegation',
      caption:
        'That distinction is the whole payoff, named: DELEGATION. One listener on a parent — checking event.target inside it — covers every child button, instead of wiring a hundred individual listeners. Two small helpers do the checking: event.target.matches(".delete") asks “does the clicked element match this selector?”, and .closest("li") walks UPWARD from it to the nearest li ancestor — the mirror image of querySelector’s downward search.',
      highlightLines: [7, 8],
    },
    {
      id: 'delegation-dynamic',
      caption:
        'And it covers the FUTURE too: add a brand-new li to the list tomorrow, and its delete button is already covered — no new listener to remember, because delegation rides on bubbling, not on a per-element wire-up.',
      highlightLines: [7, 8],
    },
    {
      id: 'stoppropagation',
      caption:
        'event.stopPropagation() would cut this bubble short at any point — ancestors past that point never see the event at all. It’s rare, and it’s sharp: it silently breaks delegation for anyone ELSE listening further up the same tree.',
      highlightLines: [3],
    },
    {
      id: 'preventdefault',
      caption:
        'A completely different tool, on a completely different element: preventDefault() stops the browser’s OWN built-in reaction — a form’s page-reloading submit, a link’s navigation. It says nothing about where the event travels; it only cancels what happens AFTER.',
      codeOverride: PREVENT_CODE,
      highlightLines: [3, 4, 5],
    },
  ],
  Viz: EventBubbles,
  underTheHood: (
    <>
      <p>
        Precision for interviews: addEventListener's rare third argument (<code>true</code> or{' '}
        <code>{'{ capture: true }'}</code>) opts a listener INTO the capture phase instead of
        bubble. Almost every real listener uses the default — bubble — which is exactly why
        delegation works at all: it needs the event to still be traveling upward when it arrives.
      </p>
      <p>
        <code>event.currentTarget</code> is only meaningful WHILE the handler is actively running
        — the DOM reassigns it fresh at each node the event visits. Save the whole event object
        for later and read <code>currentTarget</code> then, and you'll find it's gone (usually{' '}
        <code>null</code>). Read it synchronously, inside the handler, always.
      </p>
      <p>
        Job note: Playwright's <code>.click()</code> dispatches a real, trusted click event that
        bubbles exactly like a human's would — which is precisely why delegated listeners in the
        app you're testing keep firing correctly under automation, with zero special handling.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'In the handler, event.target is the button. Type exactly what event.target.tagName prints:',
      accept: ['BUTTON', 'button'],
      placeholder: 'the tag name…',
      why: 'tagName is always UPPERCASE for HTML elements: "BUTTON". event.target is whatever was actually hit — the button, not the ul the listener lives on.',
    },
    {
      kind: 'type-output',
      question: 'Does stopPropagation() also stop the browser’s default action (like a link navigating)? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — stopPropagation only stops the event’s bubble; preventDefault is the separate tool for stopping the browser’s own reaction. Confusing the two is one of the most common DOM mistakes.',
    },
    {
      kind: 'type-output',
      question: 'A brand-new <li> is added to the list AFTER the listener was wired to the ul. Does clicking its delete button still work, with no new listener? Type yes or no.',
      accept: ['yes', 'Yes', 'YES'],
      placeholder: 'yes / no…',
      why: 'Yes — delegation relies on bubbling from whatever is inside the parent, present or future. That’s the entire reason it beats wiring a listener to every individual child.',
    },
  ],
  PlayExtra: () => <CodeExercise def={DELEGATE_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend the three phases every event travels through, what delegation is and why it actually works, and the difference between stopPropagation and preventDefault.',
    modelAnswer:
      'Every event travels three phases: CAPTURE sweeps down from the document to the target (almost nobody listens here), then the TARGET phase fires at the exact element hit, then it BUBBLES back up through every ancestor — and that default bubble phase is where nearly all real listeners live. Delegation exploits this: instead of wiring a listener to every child element, you wire ONE listener to a shared parent; when any child is clicked, the event bubbles up to that parent’s listener, which reads event.target to figure out exactly what was hit (event.currentTarget is always the parent itself, where the listener lives). Because it depends on bubbling rather than a specific element, delegation automatically covers children added later too. stopPropagation() and preventDefault() are unrelated tools people mix up: stopPropagation halts the event’s bubble early, so ancestors never see it; preventDefault cancels the browser’s own built-in reaction (a link navigating, a form submitting) without affecting whether the event keeps bubbling at all.',
  },
  recap: [
    'Every event travels CAPTURE (down) → TARGET → BUBBLE (up); nearly all listeners run in the bubble phase.',
    'Delegation: one listener on a parent handles every child — present AND future — via bubbling. event.target = what was hit; event.currentTarget = where the listener lives.',
    'stopPropagation halts the bubble (rare, breaks delegation elsewhere); preventDefault cancels the browser’s own default action. Different jobs, often confused.',
  ],
}
