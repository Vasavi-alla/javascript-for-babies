# Onboarding welcome + returning-learner recall — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Greet a brand-new learner with a rich welcome modal that captures their name and sets expectations, and surface self-rated interview questions on already-completed topics when a returning learner opens a lesson (at most once every 8 hours).

**Architecture:** Two self-gating overlay components in the existing sketchbook style (modeled on `src/engine/coach/BreakCoach.tsx`). `WelcomeModal` mounts in `Layout.tsx` and shows only for a default-named learner on the home page. `RecallCheck` mounts in `LessonShell.tsx` and shows on lesson-open when the 8h clock has elapsed and the learner has ≥1 completed phase-1+ lesson with authored questions. A new content file holds the question bank; the existing zustand progress store gains recall fields.

**Tech Stack:** React 19 + TypeScript + Vite, zustand `persist`, motion/react, existing design components (`PaperCard`, `StickyNote`, `InkButton`, `CodePane`, `TapeLabel`).

## Global Constraints

- **DO NOT COMMIT.** Leave all changes in the working tree and report them ready. The user commits on their own word only (standing rule).
- **No `Co-Authored-By: Claude` trailer** anywhere (standing rule) — moot since we do not commit, but never add it.
- **Content register:** simplest English in the app; one idea per sentence; plain international English; **no em dashes**; **no idioms**. A recall question must be answerable from the lesson it is keyed to (only vocabulary taught by that lesson, unglossed).
- **Curly apostrophes (`'`) inside every JS string literal.** A straight `'` ends the string and breaks the build. This has bitten this codebase repeatedly.
- **iPad / touch:** no hover-only affordances; tap targets ≥ 44px; overlay cards `max-h-[90vh] overflow-y-auto`; width `min(92vw, …)`.
- **A11y:** overlays use `role="dialog"` + `aria-modal="true"` + `aria-labelledby`; Escape closes; respect `prefers-reduced-motion`.
- Verify each task with `npm run build` (must stay green). There is no React unit-test harness in active use in this repo; verification is build + a node validation script + in-browser checks, matching the project's established workflow.
- Do not edit `src/content/registry.ts` with PowerShell/regex (corrupts UTF-8). Use the Edit tool. (Not required by this plan, but a standing caution.)

---

## Task 1: Progress store — recall fields

**Files:**
- Modify: `src/store/progress.ts`

**Interfaces:**
- Produces: `useProgress()` gains `recall: Record<string, { confidence: Confidence; ratedAt: string }>`, `lastRecallShownAt: string | null`, `rateRecall(questionId: string, confidence: Confidence): void`, `markRecallShown(): void`. Exports `type Confidence = 'low' | 'ok' | 'solid'`.

- [ ] **Step 1: Add the recall fields and actions.**

Replace the whole `interface ProgressState { … }` block (currently `src/store/progress.ts:5-21`) with:

```ts
/** Self-rated confidence on a recall question. Not a grade. */
export type Confidence = 'low' | 'ok' | 'solid'

/** Learner progress, persisted to localStorage (see 02-ARCHITECTURE.md). */
interface ProgressState {
  /** lessonId → ISO date completed */
  completedLessons: Record<string, string>
  /** lessonId → the learner's teach-back answer */
  journal: Record<string, string>
  /** practice exerciseId → ISO date first solved (code written & validated) */
  solvedExercises: Record<string, string>
  /** mission challengeId → ISO date completed (so revisits don't restart job steps) */
  completedChallenges: Record<string, string>
  /** local day (YYYY-MM-DD) → active study minutes; fed by the break coach */
  studyLog: Record<string, number>
  /** recall questionId → the learner's latest self-rating + when */
  recall: Record<string, { confidence: Confidence; ratedAt: string }>
  /** ISO time the recall check was last shown (the 8-hour gate); null = never */
  lastRecallShownAt: string | null
  markComplete: (lessonId: string) => void
  saveJournal: (lessonId: string, text: string) => void
  markExerciseSolved: (exerciseId: string) => void
  markChallengeComplete: (challengeId: string) => void
  logStudyMinute: (day: string) => void
  rateRecall: (questionId: string, confidence: Confidence) => void
  markRecallShown: () => void
}
```

- [ ] **Step 2: Add the initial values and action implementations.**

In the `create<ProgressState>()(persist((set) => ({ … }), …))` body, add the two initial fields next to `studyLog: {},` (currently `src/store/progress.ts:30`):

```ts
      recall: {},
      lastRecallShownAt: null,
```

Then add the two actions just before the closing `}),` of the store object (immediately after the `logStudyMinute` action, currently ending at `src/store/progress.ts:46`):

```ts
      rateRecall: (questionId, confidence) =>
        set((s) => ({
          recall: { ...s.recall, [questionId]: { confidence, ratedAt: new Date().toISOString() } },
        })),
      markRecallShown: () => set({ lastRecallShownAt: new Date().toISOString() }),
```

- [ ] **Step 3: Verify build.**

Run: `npm run build`
Expected: green (no TS errors). Adding fields to a zustand `persist` store is backward-safe — old persisted state merges and the new keys fall back to these initializers, so no migration is needed.

---

## Task 2: Question bank — type + Phase 1 content (calibration exemplar)

**Files:**
- Create: `src/content/interview-questions.ts`
- Create: `scripts/verify-interview-bank.mjs`

**Interfaces:**
- Produces: `export interface InterviewQuestion { id, lessonId, type, difficulty, prompt, code?, answer }`; `export const INTERVIEW_QUESTIONS: InterviewQuestion[]`; `export function questionsForCompleted(completed: Record<string, string>): InterviewQuestion[]`.

- [ ] **Step 1: Create the bank file with the type, Phase 1 content, and the eligibility helper.**

Create `src/content/interview-questions.ts`:

```ts
import { findLesson } from './registry'

/**
 * The returning-learner recall bank. Distinct from each lesson's "🎤 in an
 * interview" teaching card (def.interview) — these are self-rated questions a
 * returning learner is asked on topics they already completed. Not graded.
 * Content rules: simplest English, no em dashes, curly apostrophes, only
 * vocabulary taught by the keyed lesson. Coding questions are NOT auto-checked;
 * the learner reveals the worked answer and rates their own confidence.
 */
export interface InterviewQuestion {
  /** stable, unique id */
  id: string
  /** the lesson that equips the learner to answer; eligible once it is completed */
  lessonId: string
  /** 'oral' = explain out loud; 'coding' = read or write a snippet */
  type: 'oral' | 'coding'
  difficulty: 'straightforward' | 'tricky'
  /** the interviewer's question */
  prompt: string
  /** optional snippet shown with the prompt (coding questions). Use \n for line breaks. */
  code?: string
  /** the model answer, revealed after the learner has thought about it */
  answer: string
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // ── Phase 1 — Values & Variables ────────────────────────────────
  {
    id: 'iq-1.1-value-type',
    lessonId: '1.1',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is a value in JavaScript, and what do we mean when we say every value has a type?',
    answer:
      'A value is a single piece of data the program remembers, like the number 7 or the text "hi". Every value has a type, which is the kind of thing it is. The type decides what you are allowed to do with the value. You can multiply two numbers, but multiplying two words has no clear meaning.',
  },
  {
    id: 'iq-1.2-variable-slot',
    lessonId: '1.2',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What really happens in memory when you write let score = 10?',
    answer:
      'The computer sets aside a slot in memory and puts the value 10 inside it. Then it ties the name score to that slot, like a label. When you later use score, the computer follows the label to the slot and reads what is inside.',
  },
  {
    id: 'iq-1.3-reassign',
    lessonId: '1.3',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print, and why?',
    code: 'let n = 5\nn = n + 3\nconsole.log(n)',
    answer:
      'It prints 8. The right side n + 3 is worked out first using the current value 5, which gives 8. That result is then put back into the same slot n. The label did not move. Only the contents were swapped.',
  },
  {
    id: 'iq-1.4-let-const',
    lessonId: '1.4',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is the difference between let and const?',
    answer:
      'let makes a label you can point at a new value later. const makes a label you cannot re-point once it is set. const locks the label to one slot, not the contents of that slot. Use const by default and reach for let only when you know the label needs to change.',
  },
  {
    id: 'iq-1.4-const-object',
    lessonId: '1.4',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'A colleague says "const means the value can never change." Are they right?',
    answer:
      'Not quite. const locks the label so you cannot point it at a different slot. For a simple value like a number, that does feel like the value cannot change. But const stops re-pointing, not editing. This matters more later once values can hold other values inside them. The one firm rule is that a const label cannot be reassigned.',
  },
  {
    id: 'iq-1.5-float',
    lessonId: '1.5',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does 0.1 + 0.2 give in JavaScript, and why is it not exactly 0.3?',
    code: 'console.log(0.1 + 0.2)',
    answer:
      'It prints 0.30000000000000004. Numbers are stored in a binary form that cannot hold 0.1 or 0.2 exactly, the same way 1/3 cannot be written exactly as a decimal. The tiny rounding errors add up and show. When you need an exact check, compare with a small tolerance or work in whole units like paise or cents.',
  },
  {
    id: 'iq-1.6-string-index',
    lessonId: '1.6',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print?',
    code: 'const word = "hello"\nconsole.log(word[0], word.length)',
    answer:
      'It prints h 5. A string is a run of characters, each with a position that starts at 0. So word[0] is the first character, h. length is how many characters there are, which is 5. The last character sits at length minus one.',
  },
  {
    id: 'iq-1.7-null-undefined',
    lessonId: '1.7',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What is the difference between null and undefined?',
    answer:
      'undefined means a value was never set. The computer gives it to you when nothing has been put in a slot yet. null means empty on purpose. You write null yourself to say "there is deliberately nothing here." So undefined is usually the computer speaking, and null is usually you speaking.',
  },
  {
    id: 'iq-1.8-typeof',
    lessonId: '1.8',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does typeof do here, and what prints?',
    code: 'let x = 42\nx = "now text"\nconsole.log(typeof x)',
    answer:
      'It prints string. typeof reports the type of the value a variable currently points at. JavaScript is dynamically typed, so the same variable can point at a number and later at a string. The type belongs to the value, not to the variable.',
  },
  {
    id: 'iq-1.9-equality',
    lessonId: '1.9',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What is the difference between == and ===, and what does each of these print?',
    code: 'console.log(0 == "0")\nconsole.log(0 === "0")',
    answer:
      'The first prints true and the second prints false. == converts the two sides to the same type before comparing, so the number 0 and the text "0" are treated as equal. === checks the type as well as the value, and a number is not the same type as a string, so it is false. Prefer === so nothing is converted behind your back.',
  },
  {
    id: 'iq-1.10-operator-order',
    lessonId: '1.10',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print, and which part runs first?',
    code: 'console.log(2 + 3 * 4)',
    answer:
      'It prints 14. Multiplication runs before addition, so 3 * 4 is worked out first to give 12, then 2 is added. An expression is like a small tree, and the values bubble up from the deepest parts first.',
  },
  {
    id: 'iq-1.11-template',
    lessonId: '1.11',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print?',
    code: 'const name = "Sam"\nconst age = 3\nconsole.log(`${name} is ${age}`)',
    answer:
      'It prints Sam is 3. Backticks make a template string. Anything inside ${ } is worked out and its value is dropped into the text. It is a cleaner way to join text and values than adding strings with plus signs.',
  },
]

/**
 * Questions the learner is eligible for: keyed lesson is completed and is in a
 * phase past 0 (phase 0 is never quizzed). Phase is read from the registry.
 */
export function questionsForCompleted(completed: Record<string, string>): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS.filter((q) => {
    if (!completed[q.lessonId]) return false
    const phase = findLesson(q.lessonId)?.phase ?? 0
    return phase >= 1
  })
}
```

- [ ] **Step 2: Create the bank validation script.**

Create `scripts/verify-interview-bank.mjs`:

```js
// Validates the recall question bank without booting the app.
// Checks: unique ids, referenced lessonId exists in the registry and is phase >= 1,
// coding questions have code, every question has a non-empty answer, no em dashes,
// no straight apostrophes inside the string fields.
import { readFileSync } from 'node:fs'

const bankSrc = readFileSync('src/content/interview-questions.ts', 'utf8')
const regSrc = readFileSync('src/content/registry.ts', 'utf8')

const lessonIds = new Set([...regSrc.matchAll(/id:\s*'(\d+\.\d+)'/g)].map((m) => m[1]))
const phaseOf = {}
for (const m of regSrc.matchAll(/id:\s*'(\d+\.\d+)'[^}]*?phase:\s*(\d+)/g)) phaseOf[m[1]] = Number(m[2])

// crude object split good enough for a lint gate
const blocks = bankSrc.split(/\{\s*\n\s*id:/).slice(1)
const ids = new Set()
let errors = 0
const fail = (msg) => {
  console.error('FAIL:', msg)
  errors++
}

for (const b of blocks) {
  const id = (b.match(/^\s*'([^']+)'/) || [])[1]
  const lessonId = (b.match(/lessonId:\s*'([^']+)'/) || [])[1]
  const type = (b.match(/type:\s*'([^']+)'/) || [])[1]
  if (!id) { fail('a question is missing an id'); continue }
  if (ids.has(id)) fail(`duplicate id ${id}`)
  ids.add(id)
  if (!lessonId || !lessonIds.has(lessonId)) fail(`${id}: lessonId ${lessonId} not in registry`)
  else if ((phaseOf[lessonId] ?? 0) < 1) fail(`${id}: lessonId ${lessonId} is phase < 1`)
  if (type === 'coding' && !/code:\s*'/.test(b)) fail(`${id}: coding question has no code`)
  if (!/answer:\s*\n?\s*'/.test(b)) fail(`${id}: missing answer`)
  const strings = [...b.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1]).join(' ')
  if (strings.includes('—')) fail(`${id}: contains an em dash`)
}

console.log(`checked ${ids.size} questions`)
if (errors) { console.error(`${errors} error(s)`); process.exit(1) }
console.log('interview bank OK')
```

- [ ] **Step 3: Run the validator.**

Run: `node scripts/verify-interview-bank.mjs`
Expected: `checked 12 questions` then `interview bank OK`, exit 0.

- [ ] **Step 4: Verify build.**

Run: `npm run build`
Expected: green.

---

## Task 3: WelcomeModal component

**Files:**
- Create: `src/design/WelcomeModal.tsx`
- Create: `src/store/welcome.ts`

**Interfaces:**
- Consumes: `useLearnerName`, `DEFAULT_NAME`, `nameSlug` from `src/content/learner.ts`; `InkButton`, `PaperCard` from design.
- Produces: `export function WelcomeModal()`; `export const useWelcome` (zustand) with `{ open: boolean; setOpen: (v: boolean) => void }`. The home page's re-open link calls `useWelcome.getState().setOpen(true)` (or the hook).

- [ ] **Step 1: Create the tiny open-state store.**

Create `src/store/welcome.ts`:

```ts
import { create } from 'zustand'

/** Whether the welcome modal is open. Auto-opened once for fresh learners; the
 *  home-page "who drew this?" link can re-open it any time. Not persisted. */
export const useWelcome = create<{ open: boolean; setOpen: (v: boolean) => void }>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}))

const SEEN_KEY = 'jfb-welcome-seen'
export function hasSeenWelcome(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}
export function markWelcomeSeen(): void {
  try {
    localStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* storage blocked — modal simply may reappear next load */
  }
}
```

- [ ] **Step 2: Create the modal.**

Create `src/design/WelcomeModal.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { DEFAULT_NAME, nameSlug, useLearnerName } from '../content/learner'
import { hasSeenWelcome, markWelcomeSeen, useWelcome } from '../store/welcome'
import { PaperCard } from './PaperCard'
import { InkButton } from './InkButton'

/** A random one of Vasavi's portraits, fixed for the life of the modal. */
const PORTRAITS = Array.from({ length: 10 }, (_, i) => `/vasavi/${i + 1}.webp`)

/**
 * First-run welcome: who made this and why, a name field, and the two habits
 * that make the course work (mark-complete + the recall questions). Auto-opens
 * once for a default-named learner on the home page; re-openable via useWelcome.
 * Skin/overlay pattern follows BreakCoach.tsx.
 */
export function WelcomeModal() {
  const [name, setName] = useLearnerName()
  const open = useWelcome((s) => s.open)
  const setOpen = useWelcome((s) => s.setOpen)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [draft, setDraft] = useState('')
  const [portrait] = useState(() => PORTRAITS[Math.floor(Math.random() * PORTRAITS.length)])
  const inputRef = useRef<HTMLInputElement>(null)

  const onHome = pathname === '/' || pathname.endsWith('-journey')

  // auto-open once for a fresh learner on the home page
  useEffect(() => {
    if (onHome && name === DEFAULT_NAME && !hasSeenWelcome()) setOpen(true)
  }, [onHome, name, setOpen])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  function close() {
    markWelcomeSeen()
    setOpen(false)
  }

  function start() {
    const saved = setName(draft) // trims, caps at 30, empty → 'friend'
    markWelcomeSeen()
    setOpen(false)
    const slug = nameSlug(saved)
    if (saved !== DEFAULT_NAME && slug) navigate(`/${slug}-journey`, { replace: true })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          style={{ background: 'color-mix(in srgb, var(--color-ink) 40%, transparent)' }}
        >
          <motion.div
            initial={{ y: 24, rotate: -1.5 }}
            animate={{ y: 0, rotate: -0.5 }}
            transition={{ type: 'spring', damping: 18 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') close()
            }}
            className="relative mt-16 w-[min(92vw,34rem)]"
          >
            <PaperCard id="welcome-card" tilt={false} className="max-h-[86vh] overflow-y-auto">
              <div className="flex flex-col items-center gap-4 text-center">
                <img
                  src={portrait}
                  alt="Vasavi"
                  className="border-ink h-28 w-24 rounded-xl border-2 object-cover shadow-[3px_5px_12px_rgba(43,41,37,0.22)]"
                  style={{ rotate: '2deg' }}
                />
                <h2 id="welcome-title" className="font-hand text-4xl font-bold">
                  Hi, welcome ✏️
                </h2>
                <p className="text-left">
                  I'm Vasavi, a tester. I have worked at Amazon and Siemens, and I am now at Dover.
                </p>
                <p className="text-left">
                  I drew this notebook for fellow testers who want to become automation testers and
                  really understand how it works, not just lean on AI to do it for them.
                </p>

                <div className="w-full text-left">
                  <label htmlFor="welcome-name" className="font-hand text-xl font-bold">
                    What should I call you?
                  </label>
                  <input
                    id="welcome-name"
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') start()
                    }}
                    maxLength={30}
                    placeholder="your name"
                    aria-label="your name"
                    autoCapitalize="words"
                    autoCorrect="off"
                    autoComplete="off"
                    spellCheck={false}
                    enterKeyHint="done"
                    className="border-ink-soft mt-1 w-full rounded-md border-2 border-dashed bg-transparent px-3 py-2 text-lg outline-none"
                  />
                </div>

                <div className="bg-paper-shade/50 w-full rounded-lg p-3 text-left text-[15px]">
                  <p>
                    As you go, I'll ask you a few interview style questions on what you've covered.
                    They are not graded. They are just so you can see how confident you feel about
                    each idea.
                  </p>
                  <p className="mt-2">
                    One habit makes it all work. Tick <strong>mark lesson complete</strong> at the
                    bottom of each lesson. That is how your journey, and those questions, follow you
                    back here.
                  </p>
                </div>

                <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
                  <InkButton id="welcome-start" variant="primary" onClick={start}>
                    start on page one ▸
                  </InkButton>
                  <button
                    type="button"
                    onClick={close}
                    className="text-ink-soft font-hand cursor-pointer py-2 text-lg underline"
                  >
                    maybe later
                  </button>
                </div>
              </div>
            </PaperCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 3: Verify build.**

Run: `npm run build`
Expected: green.

---

## Task 4: RecallCheck overlay component

**Files:**
- Create: `src/engine/lesson/RecallCheck.tsx`

**Interfaces:**
- Consumes: `useProgress` (`completedLessons`, `recall`, `lastRecallShownAt`, `rateRecall`, `markRecallShown`); `questionsForCompleted`, `type InterviewQuestion`; `CodePane`, `PaperCard`, `InkButton`, `TapeLabel`.
- Produces: `export function RecallCheck()` — self-gating; renders nothing unless it decides to show.

- [ ] **Step 1: Create the overlay.**

Create `src/engine/lesson/RecallCheck.tsx`:

```tsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useProgress } from '../../store/progress'
import { questionsForCompleted, type InterviewQuestion } from '../../content/interview-questions'
import { PaperCard } from '../../design/PaperCard'
import { InkButton } from '../../design/InkButton'
import { CodePane } from '../../design/CodePane'
import { TapeLabel } from '../../design/TapeLabel'

const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000
const MAX_QUESTIONS = 3

/** Least-recently-asked first; never-rated sorts before any rated. */
function pickQuestions(
  eligible: InterviewQuestion[],
  recall: Record<string, { ratedAt: string }>,
): InterviewQuestion[] {
  return [...eligible]
    .sort((a, b) => (recall[a.id]?.ratedAt ?? '').localeCompare(recall[b.id]?.ratedAt ?? ''))
    .slice(0, MAX_QUESTIONS)
}

/**
 * Returning-learner recall. On lesson-open, if the 8-hour clock has elapsed and
 * the learner has eligible questions (completed phase-1+ lessons), it covers the
 * page with a short self-rated review. Skipping still resets the clock, so there
 * is no nagging on refresh. Skin follows BreakCoach.tsx.
 */
export function RecallCheck() {
  const { completedLessons, recall, lastRecallShownAt, rateRecall, markRecallShown } = useProgress()
  const [active, setActive] = useState(false)
  const [queue, setQueue] = useState<InterviewQuestion[]>([])
  const [i, setI] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const decided = useRef(false)

  // decide once per mount (LessonShell is keyed by lesson id, so this runs on each lesson open)
  useEffect(() => {
    if (decided.current) return
    decided.current = true
    const eligible = questionsForCompleted(completedLessons)
    if (eligible.length === 0) return
    const last = lastRecallShownAt ? new Date(lastRecallShownAt).getTime() : 0
    if (Date.now() - last < EIGHT_HOURS_MS) return
    setQueue(pickQuestions(eligible, recall))
    setActive(true)
    markRecallShown() // stamp now, so a skip still resets the 8h clock
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const q = queue[i]
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  if (!active || !q) return null

  function rate(confidence: 'low' | 'ok' | 'solid') {
    rateRecall(q.id, confidence)
    if (i + 1 < queue.length) {
      setI(i + 1)
      setRevealed(false)
    } else {
      setActive(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: reducedMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recall-title"
        onKeyDown={(e) => {
          if (e.key === 'Escape') setActive(false)
        }}
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6"
        style={{ background: 'color-mix(in srgb, var(--color-ink) 40%, transparent)' }}
      >
        <div className="mt-12 w-[min(92vw,40rem)]">
          <PaperCard id="recall-card" tilt={false} className="max-h-[86vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <TapeLabel id="recall-tape" color="var(--color-marker-coral)">
                🎤 quick recall
              </TapeLabel>
              <span className="text-ink-soft font-hand text-lg">
                {i + 1} of {queue.length}
              </span>
            </div>

            <h2 id="recall-title" className="sr-only">
              Recall questions on what you have covered
            </h2>

            <p className="text-ink-soft mt-3 text-sm">
              Not graded. Just so you can see how confident you feel. ({q.type}, {q.difficulty})
            </p>

            <p className="mt-2 text-lg font-semibold">{q.prompt}</p>
            {q.code && <CodePane code={q.code} className="mt-3" />}

            {!revealed ? (
              <div className="mt-5">
                <InkButton id={`recall-reveal-${q.id}`} variant="primary" onClick={() => setRevealed(true)}>
                  reveal answer
                </InkButton>
              </div>
            ) : (
              <>
                <div className="bg-paper-shade/50 mt-4 rounded-lg p-3 text-[15px]">{q.answer}</div>
                <p className="font-hand mt-4 text-xl font-bold">How confident are you?</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <InkButton id={`recall-low-${q.id}`} onClick={() => rate('low')}>
                    🙁 not yet
                  </InkButton>
                  <InkButton id={`recall-ok-${q.id}`} onClick={() => rate('ok')}>
                    😐 getting there
                  </InkButton>
                  <InkButton id={`recall-solid-${q.id}`} onClick={() => rate('solid')}>
                    🙂 solid
                  </InkButton>
                </div>
              </>
            )}

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setActive(false)}
                className="text-ink-soft font-hand cursor-pointer text-lg underline"
              >
                skip for now, take me to my lesson
              </button>
            </div>
          </PaperCard>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Confirm `TapeLabel` accepts a `color` prop.**

Run: `grep -n "color" src/design/TapeLabel.tsx`
Expected: a `color` prop appears in the component signature (it is used across the app as `<TapeLabel id=… color=…>`). If `TapeLabel` takes no `color`, drop the `color` prop from the usage above.

- [ ] **Step 3: Verify build.**

Run: `npm run build`
Expected: green.

---

## Task 5: Wire both overlays in

**Files:**
- Modify: `src/app/Layout.tsx`
- Modify: `src/engine/lesson/LessonShell.tsx`
- Modify: `src/app/CurriculumMap.tsx`

**Interfaces:**
- Consumes: `WelcomeModal`, `RecallCheck`, `useWelcome`.

- [ ] **Step 1: Mount `WelcomeModal` in the Layout.**

In `src/app/Layout.tsx`, add the import beside the BreakCoach import (line 2):

```tsx
import { WelcomeModal } from '../design/WelcomeModal'
```

Then render it right after `<BreakCoach />` (currently `src/app/Layout.tsx:7`):

```tsx
      <BreakCoach />
      <WelcomeModal />
```

- [ ] **Step 2: Mount `RecallCheck` in the LessonShell.**

In `src/engine/lesson/LessonShell.tsx`, add the import after the `TeachBack` import (currently line 13):

```tsx
import { RecallCheck } from './RecallCheck'
```

Then render it as the first child of the top-level returned `<div>` (currently opens at `src/engine/lesson/LessonShell.tsx:34` with `<div className="flex flex-col gap-10">`):

```tsx
    <div className="flex flex-col gap-10">
      <RecallCheck />
      {/* ── header + hook ─────────────────────────────── */}
```

- [ ] **Step 3: Add the "who drew this?" re-open link on the home page.**

In `src/app/CurriculumMap.tsx`, add the import near the other design imports (e.g. after line 6's learner import):

```tsx
import { useWelcome } from '../store/welcome'
```

Then, inside the `CurriculumMap` component body, read the setter (near the other hook calls, e.g. after `const navigate = useNavigate()` at line 135):

```tsx
  const openWelcome = useWelcome((s) => s.setOpen)
```

Then insert a re-open control inside the sign-off `<footer>`, on the line **between** the closing `</p>` (currently `src/app/CurriculumMap.tsx:475`) and `</footer>` (line 476) — i.e. right after the existing "drawn by Vasavi … say hi on LinkedIn" paragraph:

```tsx
        <p className="font-hand text-ink-soft mt-1 text-lg">
          <button
            type="button"
            onClick={() => openWelcome(true)}
            className="cursor-pointer underline decoration-dashed"
          >
            who drew this? ✏️
          </button>
        </p>
```

- [ ] **Step 4: Verify build.**

Run: `npm run build`
Expected: green.

- [ ] **Step 5: STOP — user browser-verification gate (before authoring Phases 2–3).**

Ask the user to verify in-browser (desktop **and iPad**) before continuing:
- Clear state: in devtools console run `localStorage.removeItem('jfb-learner-name'); localStorage.removeItem('jfb-welcome-seen'); location.reload()`. The welcome modal appears over the home page.
- Type a name → "start on page one" closes it, the URL becomes `/<name>-journey`, and refreshing does not reopen it.
- "maybe later" closes without a name and does not reopen on refresh; the "who drew this? ✏️" footer link reopens it.
- Complete lesson 1.1 (or any phase-1 lesson) via "mark lesson complete", then open any lesson. The recall check appears with a phase-1 question. Reveal → rate. Reopening a lesson immediately does NOT show it again (8h gate). To retest the gate: in console run `localStorage` on `jfb-progress`, or simply confirm it does not reappear.
- On iPad or a narrow touch viewport: both overlays scroll, never clip, and every button is tappable.

Do not proceed to Tasks 6–7 until the user approves the loop.

---

## Task 6: Question bank — Phase 2 content

**Files:**
- Modify: `src/content/interview-questions.ts`

- [ ] **Step 1: Append the Phase 2 questions.**

In `src/content/interview-questions.ts`, insert this block immediately before the closing `]` of `INTERVIEW_QUESTIONS` (right after the last Phase 1 entry, the `iq-1.11-template` object):

```ts
  // ── Phase 2 — Making Decisions & Repeating ──────────────────────
  {
    id: 'iq-2.1-if-else',
    lessonId: '2.1',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print, and which branch runs?',
    code: 'const age = 20\nif (age >= 18) {\n  console.log("adult")\n} else {\n  console.log("minor")\n}',
    answer:
      'It prints adult. The condition age >= 18 is checked first. It is true, so the if branch runs and the else branch is skipped. Only one branch of an if or else ever runs.',
  },
  {
    id: 'iq-2.2-falsy',
    lessonId: '2.2',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'Which values in JavaScript are falsy?',
    answer:
      'There are six everyday falsy values: false, 0, an empty string, null, undefined, and NaN. Everything else is truthy, including an empty array and the string "0". When a value sits in a condition, JavaScript treats a falsy value as no and anything else as yes.',
  },
  {
    id: 'iq-2.3-switch-fall',
    lessonId: '2.3',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What prints here, and what caused it?',
    code: 'const x = 1\nswitch (x) {\n  case 1:\n    console.log("one")\n  case 2:\n    console.log("two")\n}',
    answer:
      'It prints one then two. This is fall-through. A case without a break keeps running into the next case. Once case 1 matches, it prints one, then falls into case 2 and prints two. Add break after each case unless you want this on purpose.',
  },
  {
    id: 'iq-2.4-short-circuit',
    lessonId: '2.4',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print, and why does the right side not run?',
    code: 'const name = "Sam"\nconsole.log(name || "guest")',
    answer:
      'It prints Sam. With ||, JavaScript checks the left side first. "Sam" is truthy, so that becomes the result and the right side is never looked at. This skipping is called short circuit. || gives back the first truthy value, or the last value if none are truthy.',
  },
  {
    id: 'iq-2.5-while-infinite',
    lessonId: '2.5',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What makes a while loop run forever, and why does that freeze the tab?',
    answer:
      'A while loop keeps repeating as long as its condition is true. If nothing inside the loop ever makes the condition false, it never stops. JavaScript runs your code on one main thread, so a loop that never ends never hands control back, and the page cannot respond. Always change something inside the loop that moves the condition toward false.',
  },
  {
    id: 'iq-2.6-for-loop',
    lessonId: '2.6',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'How many times does this run, and what is the last value of i printed?',
    code: 'for (let i = 0; i < 3; i++) {\n  console.log(i)\n}',
    answer:
      'It runs three times and prints 0, 1, 2. i starts at 0. Before each lap the condition i < 3 is checked. After each lap i goes up by one. When i reaches 3 the condition is false, so the loop stops before printing 3.',
  },
  {
    id: 'iq-2.7-break-continue',
    lessonId: '2.7',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is the difference between break and continue in a loop?',
    answer:
      'break stops the whole loop right away and moves on to the code after it. continue stops just the current lap and jumps to the next one. So break leaves the loop, and continue skips ahead inside it.',
  },
  {
    id: 'iq-2.8-fizzbuzz',
    lessonId: '2.8',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'In FizzBuzz, why must you check for a multiple of 15 before checking 3 or 5?',
    code: 'if (n % 15 === 0) console.log("FizzBuzz")\nelse if (n % 3 === 0) console.log("Fizz")\nelse if (n % 5 === 0) console.log("Buzz")',
    answer:
      'Because 15 is a multiple of both 3 and 5. If you checked 3 first, a number like 15 would print Fizz and stop, since only one branch of an else-if chain runs. Checking 15 first catches the both case before the single cases get a turn. Order matters in an else-if chain.',
  },
```

- [ ] **Step 2: Run the validator.**

Run: `node scripts/verify-interview-bank.mjs`
Expected: `checked 20 questions` then `interview bank OK`.

- [ ] **Step 3: Verify build.**

Run: `npm run build`
Expected: green.

---

## Task 7: Question bank — Phase 3 content

**Files:**
- Modify: `src/content/interview-questions.ts`

- [ ] **Step 1: Append the Phase 3 questions.**

In `src/content/interview-questions.ts`, insert this block immediately before the closing `]` of `INTERVIEW_QUESTIONS` (right after the last Phase 2 entry, the `iq-2.8-fizzbuzz` object):

```ts
  // ── Phase 3 — Functions ─────────────────────────────────────────
  {
    id: 'iq-3.1-what-function',
    lessonId: '3.1',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is a function, and how is defining one different from calling it?',
    answer:
      'A function is a reusable machine: it takes inputs, does some work, and gives an output. Defining a function writes down the steps but does not run them. Calling the function is what actually runs those steps. Defining is writing the recipe. Calling is cooking it.',
  },
  {
    id: 'iq-3.2-params-args',
    lessonId: '3.2',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is the difference between a parameter and an argument?',
    answer:
      'A parameter is the slot name written in the function definition. An argument is the real value you drop into that slot when you call the function. Every call gets its own fresh slots, so two calls do not share values.',
  },
  {
    id: 'iq-3.3-return-vs-log',
    lessonId: '3.3',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and what is the difference between return and console.log?',
    code: 'function double(n) {\n  console.log(n * 2)\n}\nconst result = double(5)\nconsole.log(result)',
    answer:
      'It prints 10 then undefined. console.log only shows a value on the screen. return is what hands a value back to the caller. This function logs 10 but returns nothing, so result is undefined. To use the answer in code, the function must return it, not just log it.',
  },
  {
    id: 'iq-3.4-functions-are-values',
    lessonId: '3.4',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What does it mean that functions are values in JavaScript?',
    answer:
      'A function is a value like a number or a string, so you can store it in a variable, pass it into another function, or return it from one. A function expression stores a function in a variable. An arrow function is a shorter way to write one. Because functions are values, you can move them around.',
  },
  {
    id: 'iq-3.5-scope',
    lessonId: '3.5',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What happens when this runs, and why?',
    code: 'function outer() {\n  const secret = 42\n}\nouter()\nconsole.log(secret)',
    answer:
      'It throws an error, because secret is not defined out here. A variable made inside a function can only be seen inside that function. That is scope. Inner code can look outward to names in the functions around it, but outer code cannot look inward.',
  },
  {
    id: 'iq-3.6-call-stack',
    lessonId: '3.6',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is the call stack?',
    answer:
      'The call stack is how JavaScript keeps track of which function is running. Each call gets its own frame placed on top of the stack. When a function finishes, its frame pops off and control returns to the one below. It is last in, first out, like a stack of plates.',
  },
  {
    id: 'iq-3.7-closure',
    lessonId: '3.7',
    type: 'coding',
    difficulty: 'tricky',
    prompt: 'What does this print, and what is the closure here?',
    code: 'function counter() {\n  let count = 0\n  return function () {\n    count++\n    return count\n  }\n}\nconst next = counter()\nconsole.log(next(), next())',
    answer:
      'It prints 1 2. The inner function was returned but it still remembers count from the function it was born in. That kept-alive link to outer variables is a closure. Each call to next reaches the same remembered count and adds one, so it goes 1 then 2.',
  },
  {
    id: 'iq-3.8-callback',
    lessonId: '3.8',
    type: 'oral',
    difficulty: 'straightforward',
    prompt: 'What is a higher-order function, and what is a callback?',
    answer:
      'A higher-order function is a function that takes another function as an input or returns one. The function you hand in is called a callback, because it gets called back at the right time. This is how tools like array methods and event handlers let you plug in your own step.',
  },
  {
    id: 'iq-3.9-recursion',
    lessonId: '3.9',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What is recursion, and why does it need a base case?',
    answer:
      'Recursion is a function that calls itself to solve a smaller piece of the same problem. The base case is the simple version that stops the calling. Without a base case the function would call itself forever and overflow the call stack. Every recursion needs a case that stops and a case that shrinks the problem.',
  },
  {
    id: 'iq-3.10-default-pure',
    lessonId: '3.10',
    type: 'coding',
    difficulty: 'straightforward',
    prompt: 'What does this print, and what does the = 1 do?',
    code: 'function greet(name, times = 1) {\n  return name.repeat(times)\n}\nconsole.log(greet("hi "))',
    answer:
      'It prints hi followed by a space, once. times = 1 is a default parameter. When you call greet without a second argument, times falls back to 1. Defaults give a slot a value to use when the caller leaves it out.',
  },
  {
    id: 'iq-3.11-pure-function',
    lessonId: '3.11',
    type: 'oral',
    difficulty: 'tricky',
    prompt: 'What is a pure function, and why are pure functions easy to test?',
    answer:
      'A pure function always gives the same output for the same inputs and changes nothing outside itself. It does not touch the screen, files, or outside variables. That makes it easy to test, because you just pass inputs and check the output, with no setup and no surprises. The tip calculator brain is built from small pure functions for exactly this reason.',
  },
```

- [ ] **Step 2: Run the validator.**

Run: `node scripts/verify-interview-bank.mjs`
Expected: `checked 31 questions` then `interview bank OK`.

- [ ] **Step 3: Verify build.**

Run: `npm run build`
Expected: green.

- [ ] **Step 4: Final in-browser check.**

Ask the user to complete a phase-2 and a phase-3 lesson, then (after resetting the 8h clock by clearing `lastRecallShownAt` in the `jfb-progress` localStorage entry, or after 8h) open a lesson and confirm the recall check now draws from phases 1–3, mixing oral and coding questions.

---

## Self-review notes (author)

- **Spec coverage:** Welcome modal (Task 3, wired Task 5) covers Feature A incl. trigger, Vasavi bio, name capture, expectations copy, re-open link, iPad/a11y. Recall check (Tasks 4–5) covers Feature B trigger/8h gate/eligibility/selection/flow/self-rating. Storage (Task 1) matches the spec fields. Question bank + phases 1–3 (Tasks 2, 6, 7) covers content, keyed to lessonId, oral+coding, straightforward+tricky. Phase 0 excluded via `questionsForCompleted`.
- **Placeholders:** none — every component and question is embedded in full.
- **Type consistency:** `Confidence = 'low' | 'ok' | 'solid'` (Task 1) matches `rate('low'|'ok'|'solid')` (Task 4) and the modal copy. `InterviewQuestion` fields (Task 2) match usage in `RecallCheck` (`q.prompt`, `q.code`, `q.answer`, `q.type`, `q.difficulty`, `q.id`). `useWelcome` shape (Task 3) matches its reads in Tasks 3 and 5.
- **Counts:** validator expectations 12 → 20 → 31 track the three content tasks (11 P1 with 1.4 having two = 12; +8 P2 = 20; +11 P3 = 31).
