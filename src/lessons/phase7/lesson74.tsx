import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 7.4 — Events
 * addEventListener wires callbacks to happenings; the event OBJECT carries
 * the facts (target, type, key…). The big four: click, input, submit,
 * keydown. Underneath: 6.2's queue, feeding handlers to the stack.
 */

const CODE = `const btn = document.querySelector("#save");

btn.addEventListener("click", (event) => {
  console.log(event.type);
  console.log(event.target.id);
});

const box = document.querySelector("#name");

box.addEventListener("input", (event) => {
  console.log(event.target.value);
});

box.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    console.log("submitted!");
  }
});`

interface View {
  wired: string[]
  firing: string | null
  eventCard: string[] | null
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without changing the wiring/card */
  badge?: string
}

const VIEWS: View[] = [
  {
    wired: ['#save · click'], firing: null, eventCard: null, console: [],
    note: 'addEventListener = “when THIS happens on THIS element, run THIS function”',
  },
  {
    wired: ['#save · click'], firing: null, eventCard: null, console: [],
    note: 'nothing runs yet — it just registers',
    badge: 'many listeners can stack on one element — they fire in the REGISTRATION order',
  },
  {
    wired: ['#save · click'], firing: 'click!', eventCard: null, console: [],
    note: 'a click lands! The browser queues your handler — the SAME queue timers use (6.2)',
  },
  {
    wired: ['#save · click'], firing: 'click!', eventCard: ['type: "click"', 'target: <button #save>'], console: ['click', 'save'],
    note: 'and calls it with ONE argument: the EVENT OBJECT — the report card of what just happened',
  },
  {
    wired: ['#save · click', '#name · input'], firing: 'typing…', eventCard: ['type: "input"', 'target.value: "Va"'], console: ['click', 'save', 'V', 'Va'],
    note: 'input fires on EVERY change — live search boxes are exactly this',
  },
  {
    wired: ['#save · click', '#name · input', '#name · keydown'], firing: 'Enter ⏎', eventCard: ['type: "keydown"', 'key: "Enter"'], console: ['submitted!'],
    note: 'keydown carries WHICH key — event.key — so Enter can mean “go”',
  },
  {
    wired: ['#save · click', '#name · input', '#name · keydown'], firing: 'Enter ⏎', eventCard: ['type: "keydown"', 'key: "Enter"'], console: ['submitted!'],
    note: 'siblings you now recognize on sight',
    badge: 'keyup, change, focus, blur — same pattern, different moments',
  },
  {
    wired: ['#save · click', '#name · input', '#name · keydown'], firing: null, eventCard: null, console: ['submitted!'],
    note: 'underneath: each event queues its handler (6.2) — listeners are callbacks with an address',
  },
  {
    wired: ['#save · click', '#name · input', '#name · keydown'], firing: null, eventCard: null, console: ['submitted!'],
    note: 'one more secret',
    badge: 'the event doesn’t just hit its target — it TRAVELS through the tree. That journey is bubbling. Next lesson.',
  },
]

function EventWiring({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 290" className="w-full">
      <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
        listeners wired to elements
      </text>
      {view.wired.map((w, i) => (
        <motion.g key={w} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <RoughRect x={30} y={44 + i * 40} width={170} height={30} seed={1151 + i} strokeWidth={1.7} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={115} y={64 + i * 40} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">{w}</text>
        </motion.g>
      ))}

      <AnimatePresence mode="wait">
        {view.firing && (
          <motion.g key={view.firing} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <circle cx={260} cy={70} r={26} fill="var(--color-marker-yellow)" opacity={0.9} />
            <text x={260} y={75} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-ink)">{view.firing}</text>
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view.eventCard && (
          <motion.g key={view.eventCard.join()} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={252} y={104} width={168} height={64} seed={1155} strokeWidth={2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 8%, transparent)" fillStyle="solid" />
            <text x={336} y={98} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">the event object</text>
            {view.eventCard.map((line, i) => (
              <text key={line} x={262} y={126 + i * 20} fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">{line}</text>
            ))}
          </motion.g>
        )}
      </AnimatePresence>

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={188} width={352} fontSize={9.5} seed={1157} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={230} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={426} fontSize={12.5} /></motion.text>
      </AnimatePresence>

      <RoughRect x={40} y={246} width={360} height={32} seed={1156} strokeWidth={1.5} />
      <text x={58} y={267} fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">
        {view.console.length === 0 ? '(console: nothing yet)' : view.console.join('  ·  ')}
      </text>
    </svg>
  )
}

const EMITTER_EXERCISE: CodeExerciseDef = {
  id: 'l74-emitter',
  title: 'build addEventListener’s heart',
  task: 'Every event system — the DOM’s included — is a name → list-of-callbacks map. Build one in twenty lines and the browser’s version will never feel magic again.',
  steps: [
    <>
      An object <code>listeners</code> (start empty). A function <code>on(name, fn)</code>: if{' '}
      <code>listeners[name]</code> doesn't exist yet, create an empty array there (4.4's
      assignment-creates!); then push <code>fn</code> in.
    </>,
    <>
      A function <code>emit(name, payload)</code>: loop the array at <code>listeners[name]</code>{' '}
      (if any) and call each callback with <code>payload</code>.
    </>,
    <>
      Register TWO listeners for <code>"click"</code> — one printing{' '}
      <code>"heard: " + payload</code>, one printing <code>"also: " + payload</code> — and one for{' '}
      <code>"scroll"</code> printing <code>"scrolled"</code>. Emit <code>"click"</code> with{' '}
      <code>"save-btn"</code>. Only the two click listeners may fire, in registration order.
    </>,
  ],
  starter: '',
  expectedOutput: ['heard: save-btn', 'also: save-btn'],
  mustUse: [
    { test: /listeners\s*\[\s*name\s*\]/, label: 'listeners are stored per event name — dynamic keys (4.4!)' },
    { test: /\.push\s*\(\s*fn\s*\)/, label: 'each registration pushes into that name’s array' },
    { test: /for\s*\(|forEach/, label: 'emit loops the registered callbacks' },
  ],
  mustNotUse: [
    { test: /addEventListener/, label: 'no DOM here — you’re building the machinery it runs on' },
  ],
  modelAnswer: `const listeners = {};

function on(name, fn) {
  if (!listeners[name]) {
    listeners[name] = [];
  }
  listeners[name].push(fn);
}

function emit(name, payload) {
  const fns = listeners[name];
  if (!fns) return;
  for (const fn of fns) {
    fn(payload);
  }
}

on("click", (p) => console.log("heard: " + p));
on("click", (p) => console.log("also: " + p));
on("scroll", () => console.log("scrolled"));

emit("click", "save-btn");`,
}

export const lesson74: LessonDef = {
  id: '7.4',
  hook: (
    <>
      <p>
        Until now, your programs ran top to bottom and ended. Pages don't end — they{' '}
        <em>wait for the human</em>. The mechanism is{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          events
        </HighlightMark>
        : the browser announces happenings — a click, a keystroke, a form submitted — and your
        code volunteers listeners: "when <em>that</em> happens on <em>this</em> element, run{' '}
        <em>this</em> function."
      </p>
      <p>
        You already own every ingredient: listeners are callbacks (3.8), delivered through the
        event queue (6.2), receiving an object full of facts (4.4).
      </p>
      <p>
        And as a future automation engineer, this is doubly yours: <em>every Playwright action —
        click, fill, press — works by dispatching exactly these events</em>. Today you learn what
        your tests will one day fire.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'wire',
      caption:
        'btn.addEventListener("click", handler) wires it: on THIS element, for THIS event name, run THIS callback. Nothing runs now — line 3 just registers, like setTimeout registered (6.1). The page keeps waiting; your function waits with it.',
      highlightLines: [1, 3],
    },
    {
      id: 'wire-stacking',
      caption:
        'Many listeners can stack on one element — they’ll fire in the order they were registered, one after another.',
      highlightLines: [1, 3],
    },
    {
      id: 'event-fires',
      caption:
        'A click lands! The browser queues your handler — through the SAME queue timers use (6.2). It waits its turn like everything else.',
      highlightLines: [3, 4, 5, 6],
    },
    {
      id: 'event-object-shape',
      caption:
        'Then it’s called with one argument: the EVENT OBJECT — the report card. event.type: "click". event.target: the element that was actually hit (a live reference, of course). Every fact about the happening rides in this object.',
      highlightLines: [3, 4, 5, 6],
    },
    {
      id: 'input',
      caption:
        'Event two of the big four: "input" fires on EVERY change to a field — each keystroke, each paste. event.target.value reads the field’s current text (7.6 goes deep here). Live-search boxes, character counters, autosave: all just input listeners.',
      highlightLines: [8, 10, 11, 12],
    },
    {
      id: 'keydown',
      caption:
        '"keydown" fires per key press and tells you WHICH key: event.key — "Enter", "Escape", "a". The classic: if (event.key === "Enter") … turns any box into a submit box.',
      highlightLines: [14, 15, 16, 17],
    },
    {
      id: 'keydown-siblings',
      caption:
        'Sibling events exist too — keyup, change, focus, blur — same pattern, different moments; you recognize them now on sight.',
      highlightLines: [14, 15, 16, 17],
    },
    {
      id: 'machinery-queue',
      caption:
        'Zoom out to the machinery you already own: the browser watches hardware (Web-API side), a happening queues your handler as a MACROTASK, and the loop feeds it to the stack when free. That’s why a blocked stack (6.1) makes clicks feel dead — and why your handlers must stay SHORT.',
      highlightLines: [3],
    },
    {
      id: 'bubbling-tease',
      caption:
        'One more secret for next lesson: the event doesn’t just hit its target — it TRAVELS through the tree. That journey is bubbling, and it powers the biggest listener trick in the book.',
      highlightLines: [3],
    },
  ],
  Viz: EventWiring,
  underTheHood: (
    <>
      <p>
        Each event type hands you a specialized object (5.6's inheritance, again). A click gives
        a MouseEvent (coordinates). A keydown gives a KeyboardEvent (<code>.key</code>). A
        submit gives a SubmitEvent. All extend Event.
      </p>
      <p>
        <code>.type</code>, <code>.target</code>, and 7.5's <code>preventDefault</code> live on the
        base. One family tree, one lesson — yours already.
      </p>
      <p>
        One rule separates juniors from seniors: <code>removeEventListener(name, fn)</code>{' '}
        needs the SAME function reference. That's why handlers you plan to remove get names
        instead of inline arrows.
      </p>
      <p>
        Forgotten listeners on long-lived pages are a classic 5.7 leak: the listener's rope keeps
        its closure reachable forever.
      </p>
      <p>
        Your exercise builds the pattern's heart: a name → callbacks map. It isn't a toy. Node's
        EventEmitter (Phase 9's world) IS this object. The DOM's version is this map plus a
        tree. Build it once, recognize it everywhere — the whole curriculum's bet.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Which property of the event object tells you the element that was actually hit? Type it (event.___):',
      accept: ['target', 'event.target', '.target'],
      placeholder: 'event.…',
      why: 'event.target — a live reference to the element the happening landed on. (Next lesson adds its subtle sibling, currentTarget — the element your listener is attached to.)',
    },
    {
      kind: 'type-output',
      question: 'A user types "hi" (two keystrokes) into a box with an "input" listener. How many times does the listener fire? Type the number.',
      accept: ['2', 'two', 'Two'],
      placeholder: 'a number…',
      why: 'Twice — input fires on EVERY change. That’s what makes it the live-feedback event: search-as-you-type is an input listener and nothing more.',
    },
    {
      kind: 'type-output',
      question: 'Inside a keydown handler, which property holds WHICH key was pressed? Type it (event.___):',
      accept: ['key', 'event.key', '.key'],
      placeholder: 'event.…',
      why: 'event.key — "Enter", "Escape", "a"… The Enter-to-submit pattern is one if-statement on this property.',
    },
  ],
  PlayExtra: () => <CodeExercise def={EMITTER_EXERCISE} />,
  interview: {
    question: 'What is event delegation?',
    say: 'You put one listener on a parent instead of many on each child. Events bubble up from the target, so the parent hears them and checks which child was clicked. It also handles children added later, which per child listeners would miss.',
    example: {
      code: '// one listener on the parent, not one per row\nlist.addEventListener("click", (e) => {\n  if (e.target.matches(".delete")) {\n    remove(e.target)\n  }\n})',
      note: 'Clicks on any row bubble up to list. The parent checks the target, so rows added later work too.',
    },
    deeper:
      'Events travel down, then bubble up through ancestors (7.4). Because the parent catches them, it also handles children added later, which a per child listener would miss.',
    dontSay: {
      wrong: 'Delegation means fewer clicks.',
      why: 'The user still clicks each thing. Delegation is fewer listeners, using bubbling to handle them in one place (7.4).',
    },
  },
  teachBack: {
    prompt:
      'Explain to a friend how a click becomes their function running: the registration, the event object, the queue underneath — and why a busy page makes clicks feel dead.',
    modelAnswer:
      'addEventListener("click", fn) registers a callback on an element: nothing runs at registration — the browser just files “for this element, on this event name, call this function.” When the click happens, the browser (on its Web-API side) creates an EVENT OBJECT — a report card carrying type ("click"), target (a live reference to the hit element), and per-type facts like key for keyboards or coordinates for mice — and queues the handler in the macrotask queue, the same line timers use. The event loop feeds it to the stack when the stack is empty, and the function runs with the event object as its argument. That queue is also the answer to dead clicks: if long synchronous code is hogging the stack, queued handlers can’t board — the click registered, but its handler waits. Same machine as 6.2, wearing a mouse.',
  },
  recap: [
    'addEventListener(name, fn) = register a callback for a happening on an element; many can stack, firing in order.',
    'Handlers receive the EVENT OBJECT: .type, .target (live ref), plus specifics (.key, coordinates). Three of the big four here — click, input, keydown; submit joins them once we hit forms (7.6).',
    'Delivery = 6.2’s queue (macrotasks) — blocked stacks make clicks feel dead. Playwright actions DISPATCH these exact events.',
  ],
}
