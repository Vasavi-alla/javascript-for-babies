# Lesson Format Variety — 3.1 Playground Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give lessons an optional "playground-first" format (an interactive teaser before the hook), and rebuild lesson 3.1 in that format to full quality, so the user can judge it against the existing classic-format lessons before any further lessons are converted.

**Architecture:** Add one optional field (`playground`) to the existing `LessonDef` type; render it as a new conditional block inside `LessonShell`'s existing `<header>`, positioned between the title and the hook. Every other lesson (which won't set this field) renders byte-for-byte identically to today. Lesson 3.1 gets a new self-contained interactive widget (click-a-name-see-a-greeting) and a hook rewritten to reference what the learner just did.

**Tech Stack:** React 19 + TypeScript, Vite, Tailwind v4, `motion/react` for animation, hand-drawn SVG primitives from `src/design/rough-svg.tsx`. No test runner is configured in this repo.

## Global Constraints

- **No automated test framework exists in this repo** (`package.json` has no vitest/jest). Verification for every step is: `npm run build` (runs `tsc -b && vite build` — this is the typecheck gate) plus a manual browser walkthrough via `npm run dev`. Do not introduce a testing framework as part of this work.
- Git was initialized partway through planning this work (repo now exists, remote `origin` is `https://github.com/jaws97/js-for-babies`, working branch is `development`). Each task below should be committed on `development` as normal — do not push to `origin` or touch `master` without being told to.
- **No new colors, fonts, or visual primitives.** Reuse only existing `src/design/` components and the 4 existing marker color tokens: `--color-marker-yellow`, `--color-marker-coral`, `--color-marker-teal`, `--color-pencil-blue` (defined in `src/styles/index.css`).
- **`LessonDef`/`LessonShell` changes must be strictly additive.** Every lesson currently in `src/lessons/index.ts` must keep rendering with no visual change when it doesn't set the new field.
- **Preserve the current 3.1 content** as a recoverable backup file before rewriting it, so the user can restore it instantly if the new format teaches worse (per `docs/superpowers/specs/2026-07-03-lesson-format-variety-design.md`).
- **3.1 must be built to full quality** — complete Hook / Viz / Under the Hood / Play (quiz) / Teach-back / Recap, matching the bar of the Phase 0–2 lessons it will be judged against. Not a stripped-down proof of concept.
- Route pattern for viewing a lesson in the browser: `/lesson/<id>` (e.g. `/lesson/3.1`, `/lesson/0.1`), confirmed from the `next lesson` link in `LessonShell.tsx`.

---

## File Structure

| File | Change | Responsibility |
|---|---|---|
| `src/engine/lesson/types.ts` | Modify | Add optional `playground` field to `LessonDef`. |
| `src/engine/lesson/LessonShell.tsx` | Modify | Render the optional playground block inside the existing header, before the hook. |
| `src/lessons/phase3/lesson31.old.tsx` | Create | Verbatim backup of the current 3.1 (classic format), exported as `lesson31Old`. Not registered/imported anywhere — reference only, until the user decides to keep or discard the new format. |
| `src/lessons/phase3/lesson31.tsx` | Modify (full rewrite) | The new playground-first 3.1: adds `FunctionPlayground` widget + `playground` field + rewritten `hook`; keeps the existing `FunctionMachine` viz, steps, Under the Hood, quiz, teach-back, and recap. |

No changes to `src/content/registry.ts` or `src/lessons/index.ts` — 3.1 is already registered and the exported symbol name (`lesson31`) doesn't change.

---

### Task 1: Add optional `playground` field to `LessonDef` and render it in `LessonShell`

**Files:**
- Modify: `src/engine/lesson/types.ts`
- Modify: `src/engine/lesson/LessonShell.tsx`
- Test: manual browser check (no automated test file exists in this repo — see Global Constraints)

**Interfaces:**
- Produces: `LessonDef.playground?: { prompt: ReactNode; Widget: ComponentType }` — an optional field any lesson file can now set. When present, `LessonShell` renders a "try it first" section (yellow `TapeLabel`, `PaperCard`) between the lesson title and the hook. When absent, rendering is unchanged from today.

- [ ] **Step 1: Add the `playground` field to `LessonDef`**

Open `src/engine/lesson/types.ts`. Replace the full file with:

```ts
import type { ComponentType, ReactNode } from 'react'
import type { Prediction, Step } from '../stepper/types'

/**
 * A complete lesson, following the 6-part anatomy in 04-LESSON-BLUEPRINT.md:
 * Hook → Visualize → Under the Hood → Play → Teach-back → Recap.
 */
export interface LessonDef {
  /** Must match a LessonMeta id in content/registry.ts */
  id: string
  /** Why this concept exists — shown before anything else. Never starts with syntax. */
  hook: ReactNode
  /**
   * Optional "playground-first" teaser: an interactive widget rendered
   * BEFORE the hook, with no explanation yet. The learner free-plays and
   * forms a theory; the hook then names what they just did. See
   * docs/superpowers/specs/2026-07-03-lesson-format-variety-design.md.
   */
  playground?: {
    prompt: ReactNode
    Widget: ComponentType
  }
  /** Code shown next to the visualization (steps may override via codeOverride). */
  code?: string
  steps: Step[]
  /** Pure function of stepIndex — scrubbing both ways must always be correct. */
  Viz: ComponentType<{ stepIndex: number }>
  /** The accurate, deeper explanation with real terminology. */
  underTheHood: ReactNode
  /** Quick-check questions (same shape as predictions). */
  quiz: Prediction[]
  /** Optional extra interactive exercise rendered in the Play section. */
  PlayExtra?: ComponentType
  teachBack: {
    prompt: string
    modelAnswer: string
  }
  /** Short recall statements shown as sticky notes at the end. */
  recap: string[]
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run build`
Expected: PASS (no lesson sets `playground` yet, so this is a purely additive type change).

- [ ] **Step 3: Render the playground block in `LessonShell`**

Open `src/engine/lesson/LessonShell.tsx`. Change line 27 from:

```tsx
  const { Viz, PlayExtra } = def
```

to:

```tsx
  const { Viz, PlayExtra, playground } = def
```

Then replace the `<header>` block (currently):

```tsx
      {/* ── header + hook ─────────────────────────────── */}
      <header>
        <Link to={`/phase/${meta.phase}`} className="text-ink-soft text-sm hover:underline">
          ← back to phase {meta.phase}
        </Link>
        <h1 className="font-hand mt-2 text-4xl font-bold sm:text-5xl">
          {meta.id} — {meta.title}
        </h1>
        <div className="mt-4 flex max-w-3xl flex-col gap-3 text-lg">{def.hook}</div>
      </header>
```

with:

```tsx
      {/* ── header + hook ─────────────────────────────── */}
      <header>
        <Link to={`/phase/${meta.phase}`} className="text-ink-soft text-sm hover:underline">
          ← back to phase {meta.phase}
        </Link>
        <h1 className="font-hand mt-2 text-4xl font-bold sm:text-5xl">
          {meta.id} — {meta.title}
        </h1>

        {playground && (
          <div className="mt-6 max-w-3xl">
            <TapeLabel id={`playground-${def.id}`} color="var(--color-marker-yellow)">
              try it first
            </TapeLabel>
            <PaperCard id={`playground-card-${def.id}`} tilt={false} className="mt-4">
              <div className="flex flex-col gap-4">
                <p>{playground.prompt}</p>
                <playground.Widget />
              </div>
            </PaperCard>
          </div>
        )}

        <div className="mt-4 flex max-w-3xl flex-col gap-3 text-lg">{def.hook}</div>
      </header>
```

Note: `PaperCard` and `TapeLabel` are already imported at the top of this file (lines 3 and 5) — no new imports needed. This keeps the hook's own markup (`mt-4 flex max-w-3xl flex-col gap-3 text-lg`) completely unchanged, so lessons without `playground` render identically to before; the new block only adds spacing (`mt-6`) between the title and itself when present.

- [ ] **Step 4: Typecheck**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Manual browser regression check (existing lesson unaffected)**

Run: `npm run dev`
Open the printed local URL, navigate to `/lesson/0.1`.
Expected: page looks exactly as before — title, then the hook paragraph directly beneath it, no "try it first" section anywhere (lesson 0.1 doesn't set `playground`).

---

### Task 2: Preserve the current 3.1 as a recoverable backup

**Files:**
- Create: `src/lessons/phase3/lesson31.old.tsx`

**Interfaces:**
- Produces: `lesson31Old: LessonDef` (unused by any registry — reference-only, for manual restore).

- [ ] **Step 1: Create the backup file**

Create `src/lessons/phase3/lesson31.old.tsx` with this exact content (identical to the current `lesson31.tsx`, with only the exported constant renamed):

```tsx
import { AnimatePresence, motion } from 'motion/react'
import { RoughEllipse, RoughLine, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 3.1 (OLD, classic-format backup — see lesson31.tsx for the playground-first
 * pilot). Kept only so the user can restore this version instantly if the
 * new format teaches worse. Not imported/registered anywhere.
 * Viz: FunctionMachine — a hand-drawn machine with an input hopper, a gear,
 * and an output chute. The key beat: DEFINING builds the machine (nothing
 * runs); CALLING drops a value in and makes it go.
 */

const CODE = `function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Lijas");
greet("Ada");`

// What the machine is doing at each step.
const MACHINE: Array<{
  built: boolean
  input: string | null
  running: boolean
  output: string[]
}> = [
  { built: true, input: null, running: false, output: [] }, // definition read
  { built: true, input: null, running: false, output: [] }, // prediction
  { built: true, input: '"Lijas"', running: true, output: ['Hello, Lijas!'] },
  { built: true, input: '"Ada"', running: true, output: ['Hello, Lijas!', 'Hello, Ada!'] },
  { built: true, input: null, running: false, output: ['Hello, Lijas!', 'Hello, Ada!'] },
]

function Gear({ cx, cy, turned }: { cx: number; cy: number; turned: boolean }) {
  return (
    <motion.g
      animate={{ rotate: turned ? 150 : 0 }}
      transition={{ type: 'spring', damping: 14 }}
      style={{ originX: `${cx}px`, originY: `${cy}px` }}
    >
      <RoughEllipse cx={cx} cy={cy} width={44} height={44} seed={331} strokeWidth={2} />
      {[0, 60, 120].map((deg) => (
        <RoughLine
          key={deg}
          x1={cx + 21 * Math.cos((deg * Math.PI) / 180)}
          y1={cy + 21 * Math.sin((deg * Math.PI) / 180)}
          x2={cx - 21 * Math.cos((deg * Math.PI) / 180)}
          y2={cy - 21 * Math.sin((deg * Math.PI) / 180)}
          seed={332 + deg}
          strokeWidth={1.5}
        />
      ))}
    </motion.g>
  )
}

function FunctionMachine({ stepIndex }: { stepIndex: number }) {
  const state = MACHINE[stepIndex] ?? MACHINE[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {/* the machine, faded in once "built" */}
      <motion.g animate={{ opacity: state.built ? 1 : 0.25 }}>
        {/* hopper (funnel) */}
        <RoughLine x1={155} y1={38} x2={195} y2={86} seed={333} strokeWidth={2} />
        <RoughLine x1={285} y1={38} x2={245} y2={86} seed={334} strokeWidth={2} />
        <text x={330} y={50} fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
          input hopper
        </text>
        {/* body */}
        <RoughRect x={148} y={86} width={144} height={108} seed={335} fill="var(--color-sticky)" fillStyle="solid" />
        {/* name tape */}
        <RoughRect x={175} y={76} width={90} height={26} seed={336} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
        <text x={220} y={94} textAnchor="middle" fontFamily="var(--font-code)" fontSize={14} fontWeight={700} fill="var(--color-ink)">
          greet
        </text>
        {/* gear */}
        <Gear cx={220} cy={148} turned={state.running} />
        {/* parameter slot label */}
        <text x={220} y={186} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink-soft)">
          slot: name
        </text>
        {/* output chute */}
        <RoughLine x1={292} y1={175} x2={340} y2={215} seed={337} strokeWidth={2} />
        <RoughLine x1={272} y1={192} x2={318} y2={230} seed={338} strokeWidth={2} />
        <text x={352} y={200} fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
          chute
        </text>
      </motion.g>

      {/* the input token dropping toward the hopper */}
      <AnimatePresence>
        {state.input && (
          <motion.g
            key={state.input}
            initial={{ x: 220, y: 8, opacity: 0 }}
            animate={{ x: 220, y: 52, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <RoughRect x={-42} y={-14} width={84} height={28} seed={339} fill="var(--color-marker-teal)" fillStyle="solid" strokeWidth={1.5} />
            <text x={0} y={5} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={600} fill="var(--color-ink)">
              {state.input}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* console strip at the bottom */}
      <RoughRect x={40} y={244} width={360} height={64} seed={340} strokeWidth={1.5} />
      <text x={52} y={240} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        console
      </text>
      {state.output.length === 0 && (
        <text x={220} y={280} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
          (nothing printed yet)
        </text>
      )}
      {state.output.map((line, i) => (
        <motion.text
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          x={58}
          y={268 + i * 20}
          fontFamily="var(--font-code)"
          fontSize={12.5}
          fill="var(--color-ink)"
        >
          {line}
        </motion.text>
      ))}
    </svg>
  )
}

export const lesson31Old: LessonDef = {
  id: '3.1',
  hook: (
    <>
      <p>
        In the FizzBuzz checkpoint you wrote fifteen lines of decision logic. Now imagine your
        program needs that logic in five different places. Copy-paste it five times? Then a bug is
        found… and you fix it in four places and forget the fifth. That disease has a cure, and the
        cure is the single most important idea in JavaScript: the{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          function
        </HighlightMark>{' '}
        — a machine you <em>build once</em> and <em>use forever</em>.
      </p>
      <p>
        A function is a named machine: values go in the hopper, work happens inside, something
        comes out. And here's a secret — you've been <em>using</em> these machines since your very
        first lesson. <code>console.log</code>? A function. <code>typeof</code>'s cousin{' '}
        <code>String()</code>? A function. Today you stop just using machines and start{' '}
        <strong>building</strong> them.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'read-definition',
      caption:
        'The engine reads lines 1–3 and does something surprising: it does NOT run the code inside the braces. It builds the machine — hopper, gears, an input slot called name — and stores the whole thing in memory under the label greet. Defining is construction, not execution.',
      highlightLines: [1, 2, 3],
    },
    {
      id: 'predict-printed',
      caption:
        'The engine has finished reading the definition and is about to move to line 5. Before pressing next — check the console strip in the picture. Think about what has printed so far.',
      highlightLines: [1, 2, 3],
      prediction: {
        question: 'The engine has read lines 1–3 (the whole function definition). What has printed to the console so far?',
        options: ['"Hello, undefined!" — the body ran with an empty slot', 'Nothing at all', 'An error — name has no value yet'],
        correctIndex: 1,
        why: 'Nothing! A definition just builds and stores the machine. The console.log inside is part of the machine\'s blueprint — it only runs when someone CALLS the machine. Defining and calling are two completely different moments. This distinction trips up more beginners than any other part of functions.',
      },
    },
    {
      id: 'first-call',
      caption:
        'Line 5: greet("Lijas") — the parentheses after the name are the "GO" button. The value "Lijas" drops into the hopper, lands in the slot called name, the gears turn, and the body finally runs: console.log("Hello, " + "Lijas" + "!"). First output!',
      highlightLines: [5],
    },
    {
      id: 'second-call',
      caption:
        'Line 6: same machine, different input. "Ada" drops into the same slot, the same body runs, a different sentence comes out. THIS is the payoff: one definition, endless calls. Fix a bug in the machine once, and every call everywhere is fixed.',
      highlightLines: [6],
    },
    {
      id: 'wrap',
      caption:
        'The anatomy, one more time: the keyword function says "machine ahead"; greet is the name label; (name) declares the input slot; the braces { } hold the body — the work. Define once (build), call many (run). Next lesson: what really happens inside that input slot.',
    },
  ],
  Viz: FunctionMachine,
  underTheHood: (
    <>
      <p>
        The proper vocabulary, worth owning: the whole recipe from <code>function</code> to the
        closing brace is called a <strong>function declaration</strong>. <code>greet</code> is its{' '}
        <strong>name</strong>, <code>name</code> is a <strong>parameter</strong> (the input
        slot — next lesson is all about these), and the code between the braces is the{' '}
        <strong>body</strong> (the work). Writing <code>greet("Lijas")</code> is called{' '}
        <strong>calling</strong> the function. The parentheses are the GO button — write the name
        without them and nothing runs.
      </p>
      <p>
        Inside the machine there are no real gears, of course. What actually happens: the engine
        saves the body's lines in memory and remembers "<code>greet</code> means this saved
        code" — the same label-on-a-box picture from Phase 1. When you call it, the engine jumps
        to the saved lines, runs them top to bottom, and jumps back to where the call was. That's
        it. And every Playwright line you'll write someday — <code>page.click()</code>,{' '}
        <code>expect()</code> — is just pressing GO on a machine someone else built.
      </p>
      <p>
        <strong style={{ color: 'var(--color-marker-coral)' }}>Fun fact:</strong> in 1995 Brendan
        Eich joined Netscape to put <em>Scheme</em> — a language built entirely around functions —
        into the browser. Management demanded it "look like Java" instead, so Eich kept the
        Java-ish braces but smuggled Scheme's function-loving soul inside, building the first
        version in about ten days. The syntax is a costume; underneath, functions rule.
      </p>
    </>
  ),
  quiz: [
    {
      question: 'The engine reads a function definition (function tellJoke() { console.log("…") }). What runs at that moment?',
      options: [
        'The body runs once, as a test',
        'Nothing in the body runs — the machine is built and stored under its name',
        'The body runs every time the engine re-reads the file',
      ],
      correctIndex: 1,
      why: 'Defining is construction. The engine stores the body in memory and ties the name to it — the code inside waits, inert, until a call. If you define a function and never call it, its body never runs at all.',
    },
    {
      question: 'A function is defined once and called 3 times. How many times does its body run?',
      options: ['Once — it was only defined once', '3 times — once per call', '4 times — once at definition plus once per call'],
      correctIndex: 1,
      why: 'The body runs exactly once per CALL, never at definition. One blueprint, three button-presses, three runs. That "define once, call many" split is the entire point of functions.',
    },
    {
      question: 'You have been calling a function since lesson 0.3. Which one?',
      options: ['let — it creates variables', 'console.log — parentheses, inputs, work done: a machine', 'The = sign'],
      correctIndex: 1,
      why: 'console.log(...) has the full machine shape: a name, the call-operator parentheses, and values dropped into the hopper. let and = are keywords/operators, not functions. You were a function CALLER from day one — today you became a function BUILDER.',
    },
  ],
  teachBack: {
    prompt:
      'Explain to a friend what a function is, using the machine picture — and make sure you explain why defining it prints nothing, but calling it does something.',
    modelAnswer:
      'A function is a machine you build inside your program: it has a name, an input hopper, and a body of code that does the work. Writing the definition — function greet(name) { … } — only BUILDS the machine and stores it in memory under its name; none of the code inside runs yet, which is why defining prints nothing. To make it go you CALL it by writing its name with parentheses, like greet("Lijas") — that drops the value into the input slot and runs the body top to bottom. The payoff is reuse: you define the machine once, and you can call it a thousand times with different inputs. Even console.log is one of these machines — someone else built it, and we\'ve been pressing its GO button all along.',
  },
  recap: [
    'A function = a named machine: inputs → work → output. Build once, call many.',
    'Defining runs NOTHING. Only the call — name + parentheses, the GO button — runs the body.',
    'You\'ve called functions since day one: console.log is a machine someone else built.',
    'Fun fact: JS was supposed to be Scheme-in-the-browser. Eich kept Scheme\'s function-loving soul under a Java costume — built in ~10 days, May 1995.',
  ],
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run build`
Expected: PASS. (This file is not imported by `src/lessons/index.ts`, so it contributes no runtime change — it only needs to compile.)

---

### Task 3: Rewrite 3.1 as the playground-first pilot

**Files:**
- Modify (full rewrite): `src/lessons/phase3/lesson31.tsx`

**Interfaces:**
- Consumes: `LessonDef.playground` field from Task 1.
- Produces: none (leaf lesson file — already registered as `'3.1'` in `src/lessons/index.ts`, export name `lesson31` is unchanged).

- [ ] **Step 1: Replace the full contents of `src/lessons/phase3/lesson31.tsx`**

```tsx
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { RoughEllipse, RoughLine, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { InkButton } from '../../design/InkButton'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 3.1 — What is a function? 🎬 hero lesson — playground-first pilot
 * Viz: FunctionMachine — a hand-drawn machine with an input hopper, a gear,
 * and an output chute. The key beat: DEFINING builds the machine (nothing
 * runs); CALLING drops a value in and makes it go.
 * A "try it first" playground (mystery machine, no explanation) runs before
 * the hook — the format-variety pilot from
 * docs/superpowers/specs/2026-07-03-lesson-format-variety-design.md.
 * Classic-format backup: lesson31.old.tsx.
 */

const CODE = `function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Lijas");
greet("Ada");`

// What the machine is doing at each step.
const MACHINE: Array<{
  built: boolean
  input: string | null
  running: boolean
  output: string[]
}> = [
  { built: true, input: null, running: false, output: [] }, // definition read
  { built: true, input: null, running: false, output: [] }, // prediction
  { built: true, input: '"Lijas"', running: true, output: ['Hello, Lijas!'] },
  { built: true, input: '"Ada"', running: true, output: ['Hello, Lijas!', 'Hello, Ada!'] },
  { built: true, input: null, running: false, output: ['Hello, Lijas!', 'Hello, Ada!'] },
]

function Gear({ cx, cy, turned }: { cx: number; cy: number; turned: boolean }) {
  return (
    <motion.g
      animate={{ rotate: turned ? 150 : 0 }}
      transition={{ type: 'spring', damping: 14 }}
      style={{ originX: `${cx}px`, originY: `${cy}px` }}
    >
      <RoughEllipse cx={cx} cy={cy} width={44} height={44} seed={331} strokeWidth={2} />
      {[0, 60, 120].map((deg) => (
        <RoughLine
          key={deg}
          x1={cx + 21 * Math.cos((deg * Math.PI) / 180)}
          y1={cy + 21 * Math.sin((deg * Math.PI) / 180)}
          x2={cx - 21 * Math.cos((deg * Math.PI) / 180)}
          y2={cy - 21 * Math.sin((deg * Math.PI) / 180)}
          seed={332 + deg}
          strokeWidth={1.5}
        />
      ))}
    </motion.g>
  )
}

function FunctionMachine({ stepIndex }: { stepIndex: number }) {
  const state = MACHINE[stepIndex] ?? MACHINE[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {/* the machine, faded in once "built" */}
      <motion.g animate={{ opacity: state.built ? 1 : 0.25 }}>
        {/* hopper (funnel) */}
        <RoughLine x1={155} y1={38} x2={195} y2={86} seed={333} strokeWidth={2} />
        <RoughLine x1={285} y1={38} x2={245} y2={86} seed={334} strokeWidth={2} />
        <text x={330} y={50} fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
          input hopper
        </text>
        {/* body */}
        <RoughRect x={148} y={86} width={144} height={108} seed={335} fill="var(--color-sticky)" fillStyle="solid" />
        {/* name tape */}
        <RoughRect x={175} y={76} width={90} height={26} seed={336} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
        <text x={220} y={94} textAnchor="middle" fontFamily="var(--font-code)" fontSize={14} fontWeight={700} fill="var(--color-ink)">
          greet
        </text>
        {/* gear */}
        <Gear cx={220} cy={148} turned={state.running} />
        {/* parameter slot label */}
        <text x={220} y={186} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink-soft)">
          slot: name
        </text>
        {/* output chute */}
        <RoughLine x1={292} y1={175} x2={340} y2={215} seed={337} strokeWidth={2} />
        <RoughLine x1={272} y1={192} x2={318} y2={230} seed={338} strokeWidth={2} />
        <text x={352} y={200} fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
          chute
        </text>
      </motion.g>

      {/* the input token dropping toward the hopper */}
      <AnimatePresence>
        {state.input && (
          <motion.g
            key={state.input}
            initial={{ x: 220, y: 8, opacity: 0 }}
            animate={{ x: 220, y: 52, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <RoughRect x={-42} y={-14} width={84} height={28} seed={339} fill="var(--color-marker-teal)" fillStyle="solid" strokeWidth={1.5} />
            <text x={0} y={5} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={600} fill="var(--color-ink)">
              {state.input}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* console strip at the bottom */}
      <RoughRect x={40} y={244} width={360} height={64} seed={340} strokeWidth={1.5} />
      <text x={52} y={240} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        console
      </text>
      {state.output.length === 0 && (
        <text x={220} y={280} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
          (nothing printed yet)
        </text>
      )}
      {state.output.map((line, i) => (
        <motion.text
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          x={58}
          y={268 + i * 20}
          fontFamily="var(--font-code)"
          fontSize={12.5}
          fill="var(--color-ink)"
        >
          {line}
        </motion.text>
      ))}
    </svg>
  )
}

// ── "try it first" playground: click a name, watch a greeting come out. ──
const PLAY_NAMES = ['Lijas', 'Ada', 'you']

function FunctionPlayground() {
  const [history, setHistory] = useState<string[]>([])
  const [dropping, setDropping] = useState<string | null>(null)

  function tryName(nameValue: string) {
    setDropping(nameValue)
    window.setTimeout(() => {
      setHistory((h) => [...h, `Hello, ${nameValue}!`])
      setDropping(null)
    }, 550)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        {PLAY_NAMES.map((n) => (
          <InkButton id={`play-31-chip-${n}`} key={n} onClick={() => tryName(n)} disabled={dropping !== null}>
            {n}
          </InkButton>
        ))}
      </div>
      <svg viewBox="0 0 440 260" className="w-full max-w-md">
        {/* hopper */}
        <RoughLine x1={155} y1={20} x2={195} y2={68} seed={361} strokeWidth={2} />
        <RoughLine x1={285} y1={20} x2={245} y2={68} seed={362} strokeWidth={2} />
        <RoughRect x={148} y={68} width={144} height={90} seed={363} fill="var(--color-sticky)" fillStyle="solid" />
        <text x={220} y={118} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
          ???
        </text>
        <RoughLine x1={292} y1={158} x2={340} y2={198} seed={364} strokeWidth={2} />
        <RoughLine x1={272} y1={175} x2={318} y2={213} seed={365} strokeWidth={2} />

        <AnimatePresence>
          {dropping && (
            <motion.g
              key={dropping}
              initial={{ x: 220, y: -10, opacity: 0 }}
              animate={{ x: 220, y: 40, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <RoughRect x={-42} y={-14} width={84} height={28} seed={366} fill="var(--color-marker-teal)" fillStyle="solid" strokeWidth={1.5} />
              <text x={0} y={5} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={600} fill="var(--color-ink)">
                "{dropping}"
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <RoughRect x={40} y={210} width={360} height={44} seed={367} strokeWidth={1.5} />
        <text x={52} y={206} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
          console
        </text>
        {history.length === 0 && (
          <text x={220} y={236} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
            click a name above
          </text>
        )}
        {history.slice(-1).map((line) => (
          <motion.text
            key={line}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            x={58}
            y={236}
            fontFamily="var(--font-code)"
            fontSize={12.5}
            fill="var(--color-ink)"
          >
            {line}
          </motion.text>
        ))}
      </svg>
    </div>
  )
}

export const lesson31: LessonDef = {
  id: '3.1',
  playground: {
    prompt: (
      <>
        Before any explanation — here's a mystery machine. Click a name below and watch what
        happens. Click another. See if you can guess the rule before reading on.
      </>
    ),
    Widget: FunctionPlayground,
  },
  hook: (
    <>
      <p>
        You just clicked a name and a greeting popped out the other side. Click a different name
        and a different greeting appears — same machine, same rule, different input. That mystery
        box is your very first{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          function
        </HighlightMark>{' '}
        — a machine you <em>build once</em> and <em>use forever</em>.
      </p>
      <p>
        Here's why that matters: imagine your program needs that "say hello" logic in five
        different places. Copy-paste it five times? Then a bug is found… and you fix it in four
        places and forget the fifth. Functions are the cure — and you've been <em>using</em> them
        since your very first lesson. <code>console.log</code>? A function. Today you stop just
        using machines and start <strong>building</strong> them.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'read-definition',
      caption:
        'The engine reads lines 1–3 and does something surprising: it does NOT run the code inside the braces. It builds the machine — hopper, gears, an input slot called name — and stores the whole thing in memory under the label greet. Defining is construction, not execution.',
      highlightLines: [1, 2, 3],
    },
    {
      id: 'predict-printed',
      caption:
        'The engine has finished reading the definition and is about to move to line 5. Before pressing next — check the console strip in the picture. Think about what has printed so far.',
      highlightLines: [1, 2, 3],
      prediction: {
        question: 'The engine has read lines 1–3 (the whole function definition). What has printed to the console so far?',
        options: ['"Hello, undefined!" — the body ran with an empty slot', 'Nothing at all', 'An error — name has no value yet'],
        correctIndex: 1,
        why: 'Nothing! A definition just builds and stores the machine. The console.log inside is part of the machine\'s blueprint — it only runs when someone CALLS the machine. Defining and calling are two completely different moments. This distinction trips up more beginners than any other part of functions.',
      },
    },
    {
      id: 'first-call',
      caption:
        'Line 5: greet("Lijas") — the parentheses after the name are the "GO" button. The value "Lijas" drops into the hopper, lands in the slot called name, the gears turn, and the body finally runs: console.log("Hello, " + "Lijas" + "!"). First output!',
      highlightLines: [5],
    },
    {
      id: 'second-call',
      caption:
        'Line 6: same machine, different input. "Ada" drops into the same slot, the same body runs, a different sentence comes out. THIS is the payoff: one definition, endless calls. Fix a bug in the machine once, and every call everywhere is fixed.',
      highlightLines: [6],
    },
    {
      id: 'wrap',
      caption:
        'The anatomy, one more time: the keyword function says "machine ahead"; greet is the name label; (name) declares the input slot; the braces { } hold the body — the work. Define once (build), call many (run). Next lesson: what really happens inside that input slot.',
    },
  ],
  Viz: FunctionMachine,
  underTheHood: (
    <>
      <p>
        The proper vocabulary, worth owning: the whole recipe from <code>function</code> to the
        closing brace is called a <strong>function declaration</strong>. <code>greet</code> is its{' '}
        <strong>name</strong>, <code>name</code> is a <strong>parameter</strong> (the input
        slot — next lesson is all about these), and the code between the braces is the{' '}
        <strong>body</strong> (the work). Writing <code>greet("Lijas")</code> is called{' '}
        <strong>calling</strong> the function. The parentheses are the GO button — write the name
        without them and nothing runs.
      </p>
      <p>
        Inside the machine there are no real gears, of course. What actually happens: the engine
        saves the body's lines in memory and remembers "<code>greet</code> means this saved
        code" — the same label-on-a-box picture from Phase 1. When you call it, the engine jumps
        to the saved lines, runs them top to bottom, and jumps back to where the call was. That's
        it. And every Playwright line you'll write someday — <code>page.click()</code>,{' '}
        <code>expect()</code> — is just pressing GO on a machine someone else built.
      </p>
      <p>
        <strong style={{ color: 'var(--color-marker-coral)' }}>Fun fact:</strong> in 1995 Brendan
        Eich joined Netscape to put <em>Scheme</em> — a language built entirely around functions —
        into the browser. Management demanded it "look like Java" instead, so Eich kept the
        Java-ish braces but smuggled Scheme's function-loving soul inside, building the first
        version in about ten days. The syntax is a costume; underneath, functions rule.
      </p>
    </>
  ),
  quiz: [
    {
      question: 'The engine reads a function definition (function tellJoke() { console.log("…") }). What runs at that moment?',
      options: [
        'The body runs once, as a test',
        'Nothing in the body runs — the machine is built and stored under its name',
        'The body runs every time the engine re-reads the file',
      ],
      correctIndex: 1,
      why: 'Defining is construction. The engine stores the body in memory and ties the name to it — the code inside waits, inert, until a call. If you define a function and never call it, its body never runs at all.',
    },
    {
      question: 'A function is defined once and called 3 times. How many times does its body run?',
      options: ['Once — it was only defined once', '3 times — once per call', '4 times — once at definition plus once per call'],
      correctIndex: 1,
      why: 'The body runs exactly once per CALL, never at definition. One blueprint, three button-presses, three runs. That "define once, call many" split is the entire point of functions.',
    },
    {
      question: 'You have been calling a function since lesson 0.3. Which one?',
      options: ['let — it creates variables', 'console.log — parentheses, inputs, work done: a machine', 'The = sign'],
      correctIndex: 1,
      why: 'console.log(...) has the full machine shape: a name, the call-operator parentheses, and values dropped into the hopper. let and = are keywords/operators, not functions. You were a function CALLER from day one — today you became a function BUILDER.',
    },
  ],
  teachBack: {
    prompt:
      'Explain to a friend what a function is, using the machine picture — and make sure you explain why defining it prints nothing, but calling it does something.',
    modelAnswer:
      'A function is a machine you build inside your program: it has a name, an input hopper, and a body of code that does the work. Writing the definition — function greet(name) { … } — only BUILDS the machine and stores it in memory under its name; none of the code inside runs yet, which is why defining prints nothing. To make it go you CALL it by writing its name with parentheses, like greet("Lijas") — that drops the value into the input slot and runs the body top to bottom. The payoff is reuse: you define the machine once, and you can call it a thousand times with different inputs. Even console.log is one of these machines — someone else built it, and we\'ve been pressing its GO button all along.',
  },
  recap: [
    'A function = a named machine: inputs → work → output. Build once, call many.',
    'Defining runs NOTHING. Only the call — name + parentheses, the GO button — runs the body.',
    'You\'ve called functions since day one: console.log is a machine someone else built.',
    'Fun fact: JS was supposed to be Scheme-in-the-browser. Eich kept Scheme\'s function-loving soul under a Java costume — built in ~10 days, May 1995.',
  ],
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Manual browser verification**

Run: `npm run dev`
Open the printed local URL, navigate to `/lesson/3.1`, and walk through the whole lesson:

1. **"try it first" section** appears right under the title, above the hook, with a yellow tape label and 3 clickable name chips (Lijas / Ada / you).
2. Click each chip in turn: the value animates dropping toward the hopper, all 3 chips disable briefly (~550ms) while it's "processing," then a `Hello, <name>!` line appears in the mini console and the chips re-enable. Click a different chip after — the previous console line is replaced by the new one.
3. Below that, the **hook** paragraph appears, referencing what was just clicked ("You just clicked a name and a greeting popped out...").
4. The **"watch it happen"** section below still works exactly as before: code pane + `FunctionMachine` viz, stepping through read-definition → prediction ("what has printed so far?") → first call → second call → wrap, with Prev/Next controls.
5. **Under the Hood** (3 paragraphs: vocabulary, what's really happening, Eich/Scheme fun fact), **3 quiz questions**, **teach-back** box, and **recap** sticky notes all render as before.
6. Check the whole page at both a full desktop width and a narrowed ~1280px window (per the `04-LESSON-BLUEPRINT.md` authoring checklist) — layout should not break or overflow at either width.
7. Compare the feel of this lesson against how Phase 0–2 lessons felt, per the decision gate below.

---

## Decision gate (after Task 3)

Do not touch `lesson31.old.tsx` or lessons 3.2–3.11 until the user has verified 3.1 in the browser and made a call:

- **Keep it** → proceed to convert 3.2–3.11 per the format mapping in the spec, and delete `lesson31.old.tsx`.
- **Adjust** → revise the playground widget/hook copy and re-verify, still comparing against `lesson31.old.tsx`'s content for what worked before.
- **Revert** → restore `lesson31.old.tsx`'s content into `lesson31.tsx` (rename the export back to `lesson31`), delete `lesson31.old.tsx`, and revisit the format-variety approach entirely.
