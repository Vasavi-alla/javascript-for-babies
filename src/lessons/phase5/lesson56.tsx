import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'

/**
 * 5.6 — Classes: ergonomic syntax over prototypes
 * The class keyword desugared live: constructor → own properties, methods →
 * the prototype, `new` → the four steps (create, link, run with this, return).
 * extends → a longer chain. Nothing new underneath — 5.5 with nicer handwriting.
 */

const CODE = `class Timer {
  constructor(label) {
    this.label = label;
  }

  start() {
    return this.label + " started";
  }
}

const t1 = new Timer("build");
const t2 = new Timer("deploy");

console.log(t1.start());
console.log(t2.start());
console.log(t1 instanceof Timer);`

const EXTENDS_CODE = `class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return this.name + " makes a sound";
  }
}

class Dog extends Animal {
  speak() {
    return this.name + " barks";
  }
}

const d = new Dog("Rex");
console.log(d.speak());`

interface View {
  boxes: { title: string; lines: string[]; hot?: boolean }[]
  newSteps?: string[]
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without changing the boxes */
  badge?: string
}

const VIEWS: View[] = [
  {
    boxes: [
      { title: 'Timer.prototype', lines: ['start: ƒ  (ONE copy)'], hot: true },
    ],
    console: [],
    note: 'the class body’s methods land on Timer.prototype — 5.5’s shared home, auto-built',
  },
  {
    boxes: [
      { title: 't1 (being created)', lines: ['(empty so far)'], hot: true },
      { title: 'Timer.prototype', lines: ['start: ƒ'] },
    ],
    newSteps: ['1 · create {}', '2 · link → Timer.prototype', '3 · run constructor…', '4 · return it'],
    console: [],
    note: 'new Timer("build") begins: (1) create an empty object, (2) link its [[Prototype]] to Timer.prototype',
  },
  {
    boxes: [
      { title: 't1 (instance)', lines: ['label: "build"'], hot: true },
      { title: 'Timer.prototype', lines: ['start: ƒ'] },
    ],
    newSteps: ['1 · create {} ✓', '2 · link → Timer.prototype ✓', '3 · run constructor (this = it)', '4 · return it'],
    console: [],
    note: '(3) the constructor runs with this = the new object — this.label lands as an OWN property. (4) return it — that’s all FOUR steps',
  },
  {
    boxes: [
      { title: 't1', lines: ['label: "build"'] },
      { title: 't2', lines: ['label: "deploy"'] },
      { title: 'Timer.prototype', lines: ['start: ƒ'], hot: true },
    ],
    console: ['build started', 'deploy started'],
    note: 'two instances, own labels — ONE start function, borrowed by both (the 5.5 climb)',
  },
  {
    boxes: [
      { title: 't1', lines: ['label: "build"'] },
      { title: 'Timer.prototype', lines: ['start: ƒ'], hot: true },
    ],
    console: ['build started', 'deploy started', 'true'],
    note: 'instanceof asks: is Timer.prototype anywhere on t1’s chain? Yes → true',
  },
  {
    boxes: [
      { title: 'd', lines: ['name: "Rex"'], hot: true },
      { title: 'Dog.prototype', lines: ['(speak lives here)'] },
      { title: 'Animal.prototype', lines: ['speak: ƒ (sound)'] },
    ],
    console: [],
    note: 'class Dog extends Animal wires Dog.prototype’s own link to Animal.prototype — the chain grows one story taller',
  },
  {
    boxes: [
      { title: 'd', lines: ['name: "Rex"'] },
      { title: 'Dog.prototype', lines: ['speak: ƒ (barks)'], hot: true },
      { title: 'Animal.prototype', lines: ['speak: ƒ (sound)'] },
    ],
    console: ['Rex barks'],
    note: 'd.speak() climbs and hits Dog.prototype FIRST — closest wins, so the override shadows the parent’s version',
  },
  {
    boxes: [
      { title: 'd', lines: ['name: "Rex"'] },
      { title: 'Dog.prototype', lines: ['speak: ƒ (barks)'], hot: true },
      { title: 'Animal.prototype', lines: ['speak: ƒ (sound)'] },
    ],
    console: ['Rex barks'],
    note: 'need the parent’s version anyway? Same climb, nicer handwriting',
    badge: 'super.speak() calls one story up; super(name) in a child constructor runs the parent’s constructor',
  },
]

function ClassDesugar({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 328" className="w-full">
      {view.boxes.map((b, i) => {
        const y = 44 + i * 66
        return (
          <motion.g key={b.title} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <RoughRect x={40} y={y} width={216} height={48} seed={901 + i} strokeWidth={b.hot ? 2.6 : 1.8} stroke={b.hot ? 'var(--color-marker-teal)' : 'var(--color-ink)'} fill={b.hot ? 'color-mix(in srgb, var(--color-marker-teal) 10%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
            <text x={48} y={y - 5} fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">{b.title}</text>
            {b.lines.map((line, j) => (
              <text key={line} x={54} y={y + 22 + j * 17} fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">{line}</text>
            ))}
            {i < view.boxes.length - 1 && (
              <HandArrow from={{ x: 148, y: y + 52 }} to={{ x: 148, y: y + 62 }} curve={0} seed={911 + i} stroke="var(--color-pencil-blue)" strokeWidth={2.2} headLength={8} />
            )}
          </motion.g>
        )
      })}

      {view.newSteps && (
        <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
          <RoughRect x={280} y={50} width={148} height={104} seed={915} strokeWidth={1.8} fill="var(--color-marker-yellow)" fillStyle="solid" />
          <text x={354} y={44} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fontWeight={700} fill="var(--color-ink)">
            what `new` does
          </text>
          {view.newSteps.map((s, i) => (
            <text key={s} x={288} y={72 + i * 21} fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">{s}</text>
          ))}
        </motion.g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={44} y={230} width={352} height={26} seed={917} strokeWidth={1.6} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 10%, transparent)" fillStyle="solid" />
            <text x={220} y={247} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-pencil-blue)"><WrapTspans text={view.badge} x={220} maxPx={330} fontSize={9.5} /></text>
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={280} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={426} fontSize={12.5} /></motion.text>
      </AnimatePresence>

      <RoughRect x={40} y={292} width={360} height={28} seed={916} strokeWidth={1.5} />
      <text x={58} y={311} fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">
        {view.console.length === 0 ? '(console: nothing yet)' : view.console.join('  ·  ')}
      </text>
    </svg>
  )
}

const PAGES_EXERCISE: CodeExerciseDef = {
  id: 'l56-pages',
  title: 'your first page objects',
  task: 'A sneak preview of your Playwright future: model two pages of a site as instances of ONE class — own data per instance, shared behavior on the prototype.',
  steps: [
    <>
      A class <code>SitePage</code> whose constructor takes <code>url</code> and stores it on the
      instance.
    </>,
    <>
      One method <code>open()</code> returning <code>"visiting " + this.url</code>.
    </>,
    <>
      Two instances: one for <code>"/search"</code>, one for <code>"/cart"</code>. Print each
      one's <code>open()</code>, then print whether the first instance is an{' '}
      <code>instanceof SitePage</code>.
    </>,
  ],
  starter: '',
  expectedOutput: ['visiting /search', 'visiting /cart', 'true'],
  mustUse: [
    { test: /class\s+SitePage/, label: 'a class named SitePage' },
    { test: /constructor\s*\(\s*url\s*\)/, label: 'the constructor takes url' },
    { test: /this\.url/, label: 'the url is stored and read via this' },
    { test: /new\s+SitePage\s*\(/, label: 'instances are made with new' },
    { test: /instanceof\s+SitePage/, label: 'membership is checked with instanceof' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']visiting/, label: 'no hand-built output strings — the method must produce them' },
  ],
  modelAnswer: `class SitePage {
  constructor(url) {
    this.url = url;
  }

  open() {
    return "visiting " + this.url;
  }
}

const search = new SitePage("/search");
const cart = new SitePage("/cart");

console.log(search.open());
console.log(cart.open());
console.log(search instanceof SitePage);`,
}

export const lesson56: LessonDef = {
  id: '5.6',
  hook: (
    <>
      <p>
        Yesterday you built object families by hand: a base object, <code>Object.create</code>,
        own properties added one by one. It works — and real codebases do it approximately never,
        because JavaScript ships a cleaner handwriting for the same machinery:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          <code>class</code>
        </HighlightMark>
        .
      </p>
      <p>
        The word matters: <em>handwriting</em>, not new machinery. A class builds exactly the
        prototype chains of 5.5 — methods land on a shared prototype, <code>new</code> creates and
        links instances, <code>extends</code> just makes the chain longer. Today you'll watch class
        syntax <em>desugar</em> — shed its sugar-coating — into the diagram you already own.
      </p>
      <p>
        And this is career-critical syntax: Playwright's Page Object Model — lesson 11.7 — is
        classes, wall to wall.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'methods-to-prototype',
      caption:
        'Read the class body as two zones. Everything OUTSIDE the constructor — like start() — is written ONCE onto Timer.prototype, the shared home from 5.5. Declaring the class builds that prototype object before any instance exists. No copying per instance, ever.',
      highlightLines: [1, 6, 7, 8, 9],
    },
    {
      id: 'new-create-link',
      caption:
        'new Timer("build") begins. Step 1: create a brand-new, empty object. Step 2: set its [[Prototype]] link to Timer.prototype. Nothing has your data on it yet — watch what happens next.',
      highlightLines: [2, 3, 4, 11],
    },
    {
      id: 'new-run-return',
      caption:
        'Step 3: run the constructor with this = that new object — so this.label = label writes label as an OWN property onto it. Step 4: return it. That’s also 5.4’s final priority rule paid in full: with new, this = the freshly created object.',
      highlightLines: [2, 3, 4, 11],
    },
    {
      id: 'shared',
      caption:
        't1 and t2 each own their label — but t1.start is a MISS on t1, a climb to Timer.prototype, and a borrow of the single shared function (this = t1 via the dot rule, so it reads the right label). Two instances, one method in memory. A thousand timers: still one method.',
      highlightLines: [11, 12, 14, 15],
    },
    {
      id: 'instanceof',
      caption:
        't1 instanceof Timer asks a chain question, literally: “does Timer.prototype appear ANYWHERE on t1’s [[Prototype]] chain?” It does (one link up) → true. That’s all instanceof is — a chain walk with a yes/no answer.',
      highlightLines: [16],
    },
    {
      id: 'extends-wiring',
      caption:
        'New code: inheritance. class Dog extends Animal wires Dog.prototype’s own link to Animal.prototype — the chain grows one story taller: d → Dog.prototype → Animal.prototype.',
      codeOverride: EXTENDS_CODE,
      highlightLines: [10, 11],
    },
    {
      id: 'extends-override',
      caption:
        'd.speak() climbs and finds Dog’s speak FIRST — closest wins, so the override shadows the parent’s version entirely (the third shadowing you’ve met: 3.5 scopes, 5.3 chain, now this).',
      codeOverride: EXTENDS_CODE,
      highlightLines: [12, 13, 14, 16, 17],
    },
    {
      id: 'extends-super',
      caption:
        'Need the parent’s version anyway? super.speak() calls one story up; super(name) inside a child constructor runs the parent’s constructor. Same climb, nicer handwriting.',
      codeOverride: EXTENDS_CODE,
      highlightLines: [12, 13, 14],
    },
  ],
  Viz: ClassDesugar,
  underTheHood: (
    <>
      <p>
        Now 5.5's naming knot unties: a function/class's <code>prototype</code> <em>property</em>{' '}
        is simply "the object <code>new</code> will link instances to." The instance's hidden{' '}
        <code>[[Prototype]]</code> then points at it: <code>Object.getPrototypeOf(t1) ===
        Timer.prototype</code> is <code>true</code>. Two names, one arrow — from opposite ends.
      </p>
      <p>
        Details that bite in interviews: class bodies run in strict mode automatically (5.4's{' '}
        <code>undefined</code>-this rule applies inside).
      </p>
      <p>
        Calling a class <em>without</em> <code>new</code> throws a TypeError (unlike old
        constructor functions, which silently polluted globals).
      </p>
      <p>
        And a child constructor must call <code>super(...)</code> before touching <code>this</code>{' '}
        — step 1 of the four (creating the object) is delegated to the parent.
      </p>
      <p>
        Where you'll live in this syntax: lesson 11.7's Page Object Model —{' '}
        <code>class LoginPage</code> holding locators as properties and actions as methods, one
        instance per test.
      </p>
      <p>
        Even the errors you'll catch in 5.8 are classes (<code>Error</code>, with{' '}
        <code>TypeError extends Error</code> — a real chain you've already met in stack traces).
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'class Badge {\n  constructor(id) {\n    this.id = id;\n  }\n  show() {\n    return "#" + this.id;\n  }\n}\nconst b = new Badge(7);\nconsole.log(b.show());',
      accept: ['#7'],
      placeholder: 'type the console output…',
      why: 'new created the object, linked it, ran the constructor with this = it (own property id: 7), and b.show() climbed to Badge.prototype for the one shared method — which read this.id via the dot rule.',
    },
    {
      kind: 'type-output',
      question: 'Methods written in a class body land on the class’s ___ — type the word.',
      accept: ['prototype', 'Prototype', 'prototype object', 'the prototype'],
      placeholder: 'one word…',
      why: 'The prototype — the shared home. Instances borrow methods through their [[Prototype]] link instead of carrying copies; that’s the entire memory win of the system.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'class A {}\nclass B extends A {}\nconst x = new B();\nconsole.log(x instanceof A);',
      accept: ['true'],
      placeholder: 'type the console output…',
      why: 'x’s chain is x → B.prototype → A.prototype → … — and instanceof asks whether A.prototype appears ANYWHERE on the chain. It does: true. extends = a longer chain, nothing more.',
    },
  ],
  PlayExtra: () => <CodeExercise def={PAGES_EXERCISE} />,
  teachBack: {
    prompt:
      'A friend says “JavaScript classes are like classes in other languages, right?” Give the honest answer: what a class actually builds, the four things new does, and what extends really wires.',
    modelAnswer:
      'JavaScript classes are ergonomic handwriting over prototypes — there’s no separate class system underneath. Declaring a class builds a prototype object and puts the methods on it, once, shared. new does four things: creates an empty object, links its [[Prototype]] to the class’s prototype, runs the constructor with this bound to the new object (so this.x = … writes own properties), and returns it. Instances own their data; methods are borrowed through the prototype link — a thousand instances share one copy of each method. extends just wires the child’s prototype to the parent’s, making the lookup chain one story taller: overrides win because the climb finds the closest method first, and super reaches one story up. instanceof is a chain question — “is that prototype anywhere on this object’s chain?” So: familiar syntax, but the machinery is 100% prototype chains.',
  },
  recap: [
    'class = handwriting over 5.5: methods land ONCE on ClassName.prototype; instances borrow via their [[Prototype]] link.',
    'new does 4 steps: create {} → link to prototype → run constructor with this = it → return it. (The final this rule from 5.4.)',
    'extends wires child prototype → parent prototype (longer chain); closest method wins (override); super reaches one story up; instanceof = “is that prototype on the chain?”.',
  ],
}
