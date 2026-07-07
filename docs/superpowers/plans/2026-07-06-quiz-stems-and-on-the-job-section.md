# Quiz-Stem Clarity + "On the job" Section — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every quiz stem self-explanatory, and move all 59 💼 job notes out of Under the Hood into a new visual "On the job" lesson section that shows the future-work moment as a hand-drawn artifact.

**Architecture:** Content-first: one optional `onTheJob` slot in the lesson engine (rendered between the checks and teach-back), one small component family (`JobScene` + artifact pieces) in the design system, a lint extension for the new surface, then per-phase content migration + stem audit. No routes, no registry changes, no new lessons.

**Tech Stack:** React + TypeScript + Vite (existing), plain CSS-in-JSX with design tokens (no new deps), `scripts/lint-uth.mjs` (Node) extended.

**Spec:** `docs/superpowers/specs/2026-07-06-quiz-stems-and-on-the-job-section-design.md` (approved). Visual references (approved mockups, local only): `.superpowers/brainstorm/363-1783355912/content/phase2-on-the-job-v3.html` and `placement.html`.

## Global Constraints

- **NEVER `git commit` or `git push`. This project's standing rule: the user commits on their explicit word only.** This plan has NO commit steps by design — finish tasks, verify, report. If the user later authorizes a commit, never add a Co-Authored-By trailer.
- **The Quiz-Stem Contract (verbatim, from the spec):** 1) Complete problem statement — the stem states every background fact the question depends on. 2) Explicit answer shape (typed checks) — the stem ends by naming a valid answer's form, placeholder reinforces it; MCQs exempt. 3) Never explain the approach — no "try to find…", no pointing at the trick. What a question tests never changes.
- **The On-the-job content rules (verbatim, from the spec):** 1) Short sentences, **NO em dashes ("—") anywhere in this section's text**. 2) Only vocabulary taught at that lesson's position — everyday words always fine; untaught jargon glossed in everyday words or cut; ONE plain phase pointer allowed. 3) Real QA vocabulary may be seeded with an everyday gloss (approved example: "the success flow (the happy path, where everything works)"). 4) Show, don't tell — the artifact demonstrates; prose only does scene-setting + takeaway. Words go DOWN vs the old note.
- **Section anatomy is FIXED:** tape label `💼 on the job` → scene caption ("One day at work, you will…") → artifact → takeaway with one highlighted key phrase.
- Typographic apostrophes (’) in prose inside JS strings and JSX text; straight quotes inside `code`.
- Use the Edit tool for all file changes (files are CRLF; string-patching via node misses).
- Verification commands: `node scripts/lint-uth.mjs` (expect `UTH lint: clean`) and `npm run build` (expect `✓ built in …`).
- Every fact, example, and career payload of an old note survives its migration. Facts are never cut, only re-expressed.

---

## The two procedures (used verbatim by Tasks 6–11)

### Stem Audit Procedure (per quiz question)

Scope: the `quiz` array only. Ignore `prediction:` objects inside `steps` — LessonShell has
ignored them since 2026-07-03 (see `src/engine/stepper/types.ts`); they render nowhere.

1. Read the stem + placeholder + accept list (use the Task-3 worklist dump).
2. PASS if a beginner can tell, from the stem alone, (a) what situation is described and (b) what a valid answer looks like. Reasoning difficulty is NOT a finding.
3. FAIL → reword under the Quiz-Stem Contract. Keep what it tests identical. Update the placeholder to reinforce the answer shape. Widen `accept` if the new phrasing invites new valid variants (e.g. asking for a count → accept `0`, `zero`, `none`).
4. If a stem points at the trick ("notice…", "hint:"), delete the pointer.
5. Never touch the `why` text unless the reword contradicts it.

### Note Migration Procedure (per 💼 job note)

1. Read the old `💼 On the job —` paragraph in the lesson's `underTheHood`. List its facts and career payload — this list must survive.
2. Pick the artifact template that shows the moment best:
   - **team chat** — bug reports, teammate exchanges → `ChatBubble` pair
   - **app moment** — a visible bug on a page → `AppMoment` + one code line
   - **code review** — comments about code shape → `ReviewCard` + `ChatBubble`
   - **test run** — runs, counts, failures, CI verdicts → `TestRunCard`
   - **interview** — "interviewers ask…" notes → two `ChatBubble`s (ask + your answer)
   - **pipeline** — CI step stories → `PipelineRow`
3. Write the section: `<Scene>` one italic future-work line ("One day, …"), the artifact, `<Takeaway>` with ONE `<Key>` phrase. Apply the content rules (top of this plan). If the old note used vocabulary untaught at this lesson (check the phase number), rebuild the example from the lesson's own domain and, where the example is valuable later, add it to an EXISTING later note in the same sweep (log the relocation). Unsure whether a word is taught by this position? Grep `docs/plan/01-CURRICULUM.md` and earlier-phase lesson files for it; if absent, gloss it in everyday words or rebuild without it.
4. Add `onTheJob: (…)` to the lesson's `LessonDef` (after `quiz`), importing from `../../design/JobScene`. Keep the exact field shape — `onTheJob: (` at two-space indent, closing with `),` at two-space indent — the Task-3 lint extractor anchors on that shape.
5. DELETE the old 💼 paragraph from `underTheHood` (the whole `<p>…</p>`).
6. Read the result once as the never-coded learner: every word understandable at this position? No em dashes? Artifact shows, prose doesn't retell?

After ALL lessons in a task: `node scripts/lint-uth.mjs` (clean) → `npm run build` (green) → append the task's before/after rows to `docs/reviews/2026-07-06-stems-and-job-notes-report.md`.

---

### Task 1: The `onTheJob` engine slot

**Files:**
- Modify: `src/engine/lesson/types.ts` (LessonDef, after `PlayExtra`)
- Modify: `src/engine/lesson/LessonShell.tsx` (between the play section closing `</section>` around line 104 and the `{/* ── teach-back ─…` comment at line 106)

**Interfaces:**
- Produces: `LessonDef.onTheJob?: ReactNode` — every migration task sets this field; LessonShell renders it only when present.

- [ ] **Step 1: Add the field to LessonDef** in `src/engine/lesson/types.ts`:

```ts
  /** Optional extra interactive exercise rendered in the Play section (e.g. a CodeExercise). */
  PlayExtra?: ComponentType
  /**
   * Optional "💼 on the job" section (rendered after the checks, before teach-back):
   * the lesson's future-work moment as a hand-drawn artifact. Compose with the
   * JobScene family (src/design/JobScene.tsx). Content rules live in
   * docs/plan/04-LESSON-BLUEPRINT.md — simplest English in the app, no em dashes.
   */
  onTheJob?: ReactNode
```

(`ReactNode` is already imported at the top of types.ts — no import edit needed. Optional polish: the LessonDef docstring lists the 6-part anatomy; append "(+ optional 💼 On the job between Play and Teach-back)".)

- [ ] **Step 2: Render the section in LessonShell.** Insert between the play section and the teach-back comment (exact surrounding lines shown for anchoring; `TapeLabel` and `PaperCard` are already imported there — no import edits):

```tsx
      </section>

      {/* ── on the job ────────────────────────────────── */}
      {def.onTheJob && (
        <section>
          <TapeLabel id={`job-${def.id}`} color="var(--color-marker-yellow)">
            💼 on the job
          </TapeLabel>
          <PaperCard id={`job-card-${def.id}`} tilt={false} className="mt-3 max-w-3xl">
            {def.onTheJob}
          </PaperCard>
        </section>
      )}

      {/* ── teach-back ────────────────────────────────── */}
```

- [ ] **Step 3: Build** — Run: `npm run build` · Expected: `✓ built in …` (no lesson uses the field yet).

### Task 2: The JobScene component family

**Files:**
- Create: `src/design/JobScene.tsx`

**Interfaces:**
- Produces (all named exports, consumed by every migration task):
  `JobScene({children})` · `Scene({children})` · `Takeaway({children})` · `Key({children})` ·
  `ChatBubble({who, face, accent?, indent?, children})` ·
  `ReviewCard({file, lines})` with `lines: { text: string; dead?: boolean; note?: string }[]` ·
  `TestRunCard({lines})` with `lines: ReactNode[]` · `Pass({children})` · `Fail({children})` ·
  `AppMoment({children})` · `PipelineRow({steps})` with `steps: { label: string; state: 'pass' | 'fail' | 'run' }[]`

- [ ] **Step 1: Create the file** with this complete content:

```tsx
import type { ReactNode } from 'react'

/*
 * The "💼 on the job" artifact family (spec: 2026-07-06-quiz-stems-and-on-the-job-section).
 * Hand-drawn skin via wobbly border radii; ink color falls back if the token is absent.
 * Section anatomy: <JobScene><Scene>…</Scene> <artifact/> <Takeaway>…</Takeaway></JobScene>
 */

const INK = 'var(--color-ink, #2B2A26)'
const ROUGH_A = '255px 15px 225px 15px / 15px 225px 15px 255px'
const ROUGH_B = '15px 255px 15px 225px / 225px 15px 255px 15px'

export function JobScene({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3">{children}</div>
}

/** One italic line of plain future-work framing: “One day at work, you will …” */
export function Scene({ children }: { children: ReactNode }) {
  return <p className="text-ink-soft text-sm italic">{children}</p>
}

export function Takeaway({ children }: { children: ReactNode }) {
  return <p className="text-[15px]">{children}</p>
}

/** Highlighted key phrase inside a Takeaway. */
export function Key({ children }: { children: ReactNode }) {
  return (
    <strong
      style={{
        background:
          'linear-gradient(transparent 55%, color-mix(in srgb, var(--color-marker-yellow) 55%, transparent) 55%)',
      }}
    >
      {children}
    </strong>
  )
}

/** A wobbly speech bubble with a small hand-drawn face. accent = teal border (replies). */
export function ChatBubble({
  who,
  face,
  accent = false,
  indent = false,
  children,
}: {
  who: string
  face: string
  accent?: boolean
  indent?: boolean
  children: ReactNode
}) {
  return (
    <div
      className="bg-white px-4 py-2.5 text-[14px]"
      style={{
        border: `2px solid ${accent ? 'var(--color-marker-teal, #2A9D8F)' : INK}`,
        borderRadius: accent ? ROUGH_B : ROUGH_A,
        transform: accent ? 'rotate(0.5deg)' : 'rotate(-0.6deg)',
        marginLeft: indent ? '1.5rem' : 0,
      }}
    >
      <div className="font-mono text-[11px] text-ink-soft">
        <span
          className="mr-1.5 inline-block text-center"
          style={{
            width: 24,
            height: 24,
            lineHeight: '21px',
            border: `2px solid ${INK}`,
            borderRadius: '60% 40% 55% 45%/50% 55% 45% 50%',
            background: '#fff',
          }}
        >
          {face}
        </span>
        {who}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  )
}

/** A code-review artifact: file title bar + code lines; dead lines fade, notes point. */
export function ReviewCard({
  file,
  lines,
}: {
  file: string
  lines: { text: string; dead?: boolean; note?: string }[]
}) {
  return (
    <div className="bg-paper-shade" style={{ border: `2px solid ${INK}`, borderRadius: ROUGH_A }}>
      <div className="font-mono text-[11px] text-ink-soft px-3 py-1" style={{ borderBottom: `2px solid ${INK}` }}>
        ✎ pull request · {file}
      </div>
      <pre className="overflow-x-auto px-3 py-2 font-mono text-[12.5px] leading-7">
        {lines.map((l, i) => (
          <div key={i} style={{ opacity: l.dead ? 0.5 : 1 }}>
            {l.text}
            {l.note && (
              <span className="font-bold" style={{ color: 'var(--color-marker-coral, #E8604C)', opacity: 1 }}>
                {'  '}← {l.note}
              </span>
            )}
          </div>
        ))}
      </pre>
    </div>
  )
}

/** A dark terminal / test-run card. Compose lines with <Pass>/<Fail> marks below. */
export function TestRunCard({ lines }: { lines: ReactNode[] }) {
  return (
    <div
      className="px-4 py-2.5 font-mono text-[12.5px] leading-7"
      style={{ background: INK, color: 'var(--color-paper, #FBF7EE)', border: `2px solid ${INK}`, borderRadius: ROUGH_A }}
    >
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  )
}

export function Pass({ children }: { children: ReactNode }) {
  return <span style={{ color: 'var(--color-marker-teal, #2A9D8F)', fontWeight: 700 }}>✓ {children}</span>
}

export function Fail({ children }: { children: ReactNode }) {
  return (
    <span
      className="px-1.5 font-bold"
      style={{ color: 'var(--color-marker-coral, #E8604C)', border: '2px solid var(--color-marker-coral, #E8604C)', borderRadius: '50% 45% 55% 48%' }}
    >
      ✗ {children}
    </span>
  )
}

/** A sketched fragment of an app screen (the bug, visible). */
export function AppMoment({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white px-4 py-3 text-[14px]" style={{ border: `2px solid ${INK}`, borderRadius: ROUGH_A }}>
      {children}
    </div>
  )
}

/** A CI pipeline row: labeled steps, pass/fail/run states. */
export function PipelineRow({ steps }: { steps: { label: string; state: 'pass' | 'fail' | 'run' }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((s, i) => (
        <div
          key={i}
          className="px-3 py-1 font-mono text-[12px]"
          style={{
            border: `2px solid ${s.state === 'fail' ? 'var(--color-marker-coral, #E8604C)' : s.state === 'pass' ? 'var(--color-marker-teal, #2A9D8F)' : INK}`,
            borderRadius: i % 2 ? ROUGH_B : ROUGH_A,
          }}
        >
          {s.state === 'pass' ? '✓ ' : s.state === 'fail' ? '✗ ' : '⟳ '}
          {s.label}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Build** — Run: `npm run build` · Expected: green. (Visual proof comes with Task 5's Phase-2 migration; compare against `phase2-on-the-job-v3.html`.)

### Task 3: Lint the new surface + build the worklists

**Files:**
- Modify: `scripts/lint-uth.mjs`
- Create (session scratchpad): `dump-stems.mjs`

**Interfaces:**
- Produces: lint coverage of `onTheJob` blocks (idioms, 28-word cap, em-dash ban); a tab-separated worklist of every quiz stem for the audits.

- [ ] **Step 1: Extend the lint.** In `scripts/lint-uth.mjs`, add after the `extractUth` function:

```js
function extractJob(source) {
  const m = source.match(/onTheJob: \(([\s\S]*?)\n  \),/)
  if (!m) return null
  return m[1]
    .replace(/\{\[[\s\S]*?\]\}/g, ' ') // array props (ReviewCard lines etc.) may contain ">" — strip before tags
    .replace(/\{\{[\s\S]*?\}\}/g, ' ') // inline style objects
    .replace(/<code>[\s\S]*?<\/code>/g, ' CODE ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{'\s*'\}/g, ' ')
    .replace(/\{["']([^"']*)["']\}/g, '$1')
    .replace(/&\w+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
```

Then inside the file loop, after the existing UTH `if (findings.length) results.push…` block, add:

```js
    const job = extractJob(source)
    if (job) {
      const jobFindings = []
      for (const sentence of job.split(/(?<=[.!?])["”'’)]*\s+/)) {
        const w = sentence.split(' ').filter(Boolean).length
        if (w > MAX_SENTENCE_WORDS) jobFindings.push(`job: long sentence (${w}w): "${sentence.slice(0, 70)}…"`)
      }
      for (const idiom of IDIOMS) {
        if (job.toLowerCase().includes(idiom.toLowerCase())) jobFindings.push(`job idiom: "${idiom}"`)
      }
      if (job.includes('—')) jobFindings.push('job: em dash (banned in On-the-job text)')
      if (jobFindings.length) results.push({ id: `${id} (on the job)`, findings: jobFindings })
    }
```

- [ ] **Step 2: Verify the lint still passes** — Run: `node scripts/lint-uth.mjs` · Expected: `UTH lint: clean` (no `onTheJob` blocks exist yet).

- [ ] **Step 3: Create the stem worklist script** in your session scratchpad as `dump-stems.mjs`:

```js
import fs from 'node:fs'
import path from 'node:path'
const ROOT = 'src/lessons'
for (const dir of fs.readdirSync(ROOT).sort()) {
  if (!dir.startsWith('phase')) continue
  for (const file of fs.readdirSync(path.join(ROOT, dir)).sort()) {
    if (!file.endsWith('.tsx')) continue
    const src = fs.readFileSync(path.join(ROOT, dir, file), 'utf8')
    const id = (src.match(/id: '(\d+\.\d+)'/) || [])[1] || file
    const quiz = src.match(/quiz: \[([\s\S]*?)\n  \]/)
    if (!quiz) continue
    // one chunk per question object — pairing stays correct even when a typed check
    // omits its optional placeholder, or an MCQ (which has none) sits mid-array
    const starts = [...quiz[1].matchAll(/question:/g)].map((m) => m.index)
    starts.forEach((start, i) => {
      const chunk = quiz[1].slice(start, starts[i + 1] ?? quiz[1].length)
      const q = (chunk.match(/^question:\s*'((?:[^'\\]|\\.)*)'/) || [])[1] ?? '??'
      const ph = (chunk.match(/placeholder:\s*'((?:[^'\\]|\\.)*)'/) || [])[1]
      const accept = (chunk.match(/accept: \[([^\]]*)\]/) || [])[1]
      const mcq = /correctIndex:/.test(chunk)
      console.log([id, `Q${i + 1}`, mcq ? 'mcq' : 'typed', q, `[${ph ?? (mcq ? '—' : 'default')}]`, accept ?? '—'].join('\t'))
    })
  }
}
```

- [ ] **Step 4: Dump the worklist** — Run: `node <scratchpad>/dump-stems.mjs > <scratchpad>/stems.tsv` then spot-check: roughly 300 rows, one per question — `lessonId · Qn · kind · stem · [placeholder] · accept`. `mcq` rows are exempt from contract rule 2 (the options are the shape). The dump is a reading aid: make every edit against the real file text, never from the tsv.

### Task 4: Write both contracts into the blueprint

**Files:**
- Modify: `docs/plan/04-LESSON-BLUEPRINT.md` (append at end; also find the UTH style contract's job-note rule — rule 5, "Job notes kept, badged" — and mark it superseded)

- [ ] **Step 1: Mark the old rule.** In the "Under-the-Hood style contract" section, rule 5 reads exactly `5. Job notes kept, badged: open with "💼 On the job —" (bold), teaching voice.` — edit it to end with: `(SUPERSEDED 2026-07-06: job content now lives in the On-the-job section — see below.)`

- [ ] **Step 2: Append:**

```markdown
## Quiz-stem contract (2026-07-06 — applies to ALL quiz questions)

1. Complete problem statement: the stem states every background fact the question depends on
   ("n can be any number"). Never leave the situation or input universe to guesswork.
2. Explicit answer shape (typed checks): the stem ends by naming a valid answer's form
   ("Type the count — 0 if none." / "Type its name." / "Type yes or no."), placeholder
   reinforces it. MCQs exempt (options are the shape).
3. Never explain the approach. No "try to find…", no pointing at the trick. Reasoning
   difficulty is the point; interpretation difficulty is the only defect.

## The "On the job" section (2026-07-06 — replaces 💼 paragraphs in underTheHood)

Placement: between the checks and teach-back (LessonShell renders `def.onTheJob`).
Anatomy (fixed): tape label → <Scene> one italic "One day at work…" line → an artifact
(JobScene family: chat / app moment / review / test run / interview / pipeline) →
<Takeaway> with one <Key> phrase.
Content rules: simplest English in the app — short sentences, NO em dashes; only vocabulary
taught at this lesson's position (everyday words fine; gloss or cut jargon; one plain phase
pointer allowed); real QA words may be seeded with an everyday gloss ("the success flow
(the happy path, where everything works)"); the artifact shows, prose never retells it.
Lint: `node scripts/lint-uth.mjs` checks onTheJob blocks (idioms, sentence cap, em-dash ban).
```

- [ ] **Step 3: Build** — Run: `npm run build` · Expected: green (docs only; sanity habit).

### Task 5: Phase 2 calibration — the four approved sections + 2.3's stems, then STOP

**Files:**
- Modify: `src/lessons/phase2/lesson21.tsx`, `lesson22.tsx`, `lesson23.tsx`, `lesson26.tsx`

Every lesson gets: (a) the import line, (b) the `onTheJob` field (insert after the `quiz: [...]` array's closing `],`), (c) its old 💼 `<p>…</p>` DELETED from `underTheHood`. Import line for all four:

```tsx
import { JobScene, Scene, Takeaway, Key, ChatBubble, ReviewCard, TestRunCard, Pass, Fail, AppMoment } from '../../design/JobScene'
```

(Trim each file's import to the names it actually uses.)

- [ ] **Step 1: 2.1 (lesson21.tsx).** Delete from `underTheHood` the paragraph starting `<strong>💼 On the job —</strong> test code is <em>full</em> of forks:` — its closing words are "a bug report developers love." with `love.` wrapped onto its own line; delete the whole `<p>…</p>` (lines ~262–269). Add:

```tsx
  onTheJob: (
    <JobScene>
      <Scene>One day at work, you will write a bug report like this:</Scene>
      <ChatBubble who="you · reporting a bug" face="🙂">
        The login button does nothing on iPad. I expected the success flow (the happy path,
        where everything works): the button is visible, so click it. The program took the
        failure path. The boolean <code>isVisible</code> was false.
      </ChatBubble>
      <ChatBubble who="developer" face="😅" accent indent>
        Found it in minutes. You pointed at the exact fork. Thanks!
      </ChatBubble>
      <Takeaway>
        Every bug report you will ever write is <Key>a story about a branch</Key>. Name the
        fork. Name the boolean.
      </Takeaway>
    </JobScene>
  ),
```

- [ ] **Step 2: 2.2 (lesson22.tsx).** Delete the paragraph starting `<strong>💼 On the job —</strong> truthy/falsy bugs are <em>silent</em>.` Add:

```tsx
  onTheJob: (
    <JobScene>
      <Scene>One day, you will catch this bug on a real page:</Scene>
      <AppMoment>
        Quantity:{' '}
        <span className="font-mono" style={{ border: '2px solid var(--color-ink, #2B2A26)', borderRadius: '12px 4px 10px 5px', padding: '2px 10px' }}>
          0
        </span>{' '}
        <strong style={{ color: 'var(--color-marker-coral, #E8604C)' }}>⚠ “please enter a quantity”</strong>
        <div className="mt-1 text-[12.5px] font-bold" style={{ color: 'var(--color-marker-coral, #E8604C)' }}>
          ← but the user DID type 0!
        </div>
      </AppMoment>
      <ReviewCard file="cart.js" lines={[{ text: 'if (quantity) { addToCart(); }', note: '0 is falsy: “nothing entered”' }]} />
      <Takeaway>
        No error. No crash. The program simply walks the wrong road. Testers always try 0,
        "", and a lone space. <Key>That is the falsy list. You own it now.</Key>
      </Takeaway>
    </JobScene>
  ),
```

- [ ] **Step 3: 2.3 (lesson23.tsx) — section AND stems.** Delete the paragraph starting `<strong>💼 On the job —</strong> chains of else-if handling <em>ranges</em>` (the whole `<p>`). Add:

```tsx
  onTheJob: (
    <JobScene>
      <Scene>One day, you will read a code review comment like this. Later, you will write them:</Scene>
      <ReviewCard
        file="grades.js"
        lines={[
          { text: 'if (score >= 40) { pass(); }' },
          { text: 'else if (score >= 90) { topGrade(); }', dead: true, note: 'dead. can never run' },
        ]}
      />
      <ChatBubble who="senior dev · review comment" face="🙂">
        Every score above 40 stops at gate one, so gate two never gets a turn. Swap the
        order: check <code>score &gt;= 90</code> first.
      </ChatBubble>
      <Takeaway>
        Reviewers catch dead gates fast. <Key>Phase 10 makes reviewing part of your job.</Key>
      </Takeaway>
    </JobScene>
  ),
```

Then the two stem fixes in the same file's `quiz` array:

Quiz 1 — replace:

```ts
      question: 'For how many values of n can bigPrize() ever run? Type the number.',
      placeholder: 'a number…',
```

with:

```ts
      question: 'n can be any number. How many of them make bigPrize() run? Type the count — 0 if none.',
      placeholder: 'how many…',
```

(code, accept `['0', 'zero', 'none']`, and why stay unchanged.)

Quiz 2 — replace:

```ts
      question: 'x is "a" — and notice the first case has NO break. How many numbers print? Type it.',
```

with:

```ts
      question: 'x is "a". How many numbers print? Type the count.',
```

(accept `['2', 'two']` and why stay unchanged.)

- [ ] **Step 4: 2.6 (lesson26.tsx).** Delete the paragraph starting `<strong>💼 On the job —</strong> for loops drive data-driven tests:`. Add:

```tsx
  onTheJob: (
    <JobScene>
      <Scene>One day, your test run will print this:</Scene>
      <TestRunCard
        lines={[
          <>for each of 50 usernames → run login:</>,
          <>
            <Pass>user 1</Pass>&nbsp;&nbsp;<Pass>user 2</Pass>&nbsp;&nbsp;…&nbsp;&nbsp;
            <Fail>user 24</Fail>&nbsp;&nbsp;<Pass>user 25</Pass> …
          </>,
        ]}
      />
      <p className="text-[12.5px] font-bold" style={{ color: 'var(--color-marker-coral, #E8604C)' }}>
        ↑ the counter names the failing lap: i = 24
      </p>
      <Takeaway>
        One body, fifty laps. <Key>The counter tells you exactly which lap failed.</Key> Phase
        11 gives this pattern its real name: data-driven testing.
      </Takeaway>
    </JobScene>
  ),
```

- [ ] **Step 5: Lint + build** — Run: `node scripts/lint-uth.mjs` · Expected: clean (UTH word counts DROP — that always passes; the four new job blocks must produce no findings). Run: `npm run build` · Expected: green.
- [ ] **Step 6: Start the report.** Create `docs/reviews/2026-07-06-stems-and-job-notes-report.md` with a `| lesson | surface | before | after |` table and the six Phase-2 rows (4 notes + 2 stems).
- [ ] **Step 7: STOP — user gate.** Tell the user Phase 2 is live behind `npm run dev`: verify lessons 2.1, 2.2, 2.3, 2.6 end with the new 💼 section (compare `.superpowers/brainstorm/363-1783355912/content/phase2-on-the-job-v3.html`), and that Under the Hood no longer carries the note. Do NOT proceed to Task 6 without approval.

### Task 6: Batch — Phases 0–2 stems + Phase 0–1 notes

**Files:** `src/lessons/phase0/*.tsx`, `src/lessons/phase1/*.tsx`, `src/lessons/phase2/*.tsx`

- [ ] **Step 1: Stem audit** for every question in phases 0, 1, 2 (2.3's two are done) — Stem Audit Procedure, using `stems.tsv`.
- [ ] **Step 2: Migrate the six notes** — 0.5, 1.6, 1.7, 1.8, 1.9, 1.10 — Note Migration Procedure. These are the EARLIEST lessons: the anchored-vocabulary rule bites hardest here; expect full example rebuilds, not rewording.
- [ ] **Step 3: Lint + build + report rows** (per the procedures footer).

### Task 7: Batch — Phases 3–4 (stems + notes 3.7, 3.11, 4.11)

- [ ] **Step 1: Stem audit** phases 3–4.
- [ ] **Step 2: Migrate** 3.7, 3.11, 4.11 per the procedure.
- [ ] **Step 3: Lint + build + report rows.**

### Task 8: Batch — Phases 5–6 (stems + notes 5.2, 5.4, 5.9, 6.2, 6.8)

- [ ] **Step 1: Stem audit** phases 5–6.
- [ ] **Step 2: Migrate** 5.2, 5.4, 5.9, 6.2, 6.8 per the procedure.
- [ ] **Step 3: Lint + build + report rows.**

### Task 9: Batch — Phases 7–8 (stems + notes 7.2, 7.5, 7.6, 7.7, 7.8, 8.1, 8.3, 8.4, 8.6)

- [ ] **Step 1: Stem audit** phases 7–8.
- [ ] **Step 2: Migrate** the nine notes per the procedure. (7.x/8.x notes reference Playwright/CI: those are FLAGGED concepts by these phases — glosses exist in the UTH already; keep them plain.)
- [ ] **Step 3: Lint + build + report rows.**

### Task 10: Batch — Phases 9–10 (stems + all 15 notes: 9.1–9.8, 10.1–10.7)

- [ ] **Step 1: Stem audit** phases 9–10.
- [ ] **Step 2: Migrate** the fifteen notes. Interview-flavored notes (10.2, 10.3, 10.6, 10.7…) use the two-ChatBubble interview template: interviewer asks, "you, after this lesson" answers. This is also where relocated early-phase examples land (e.g. the status-code chain from old 2.3 fits 9.7 or 10.x — add it to that lesson's new section as a callback: "remember 2.3's dead gate?").
- [ ] **Step 3: Lint + build + report rows.**

### Task 11: Batch — Phase 11 (stems + all 17 notes: 11.1–11.17)

- [ ] **Step 1: Stem audit** phase 11.
- [ ] **Step 2: Migrate** the seventeen notes (heaviest interview + pipeline content; `PipelineRow` and interview bubbles earn their keep here — 11.18 has no note).
- [ ] **Step 3: Lint + build + report rows.**

### Task 12: Final verification + handoff

- [ ] **Step 1: Full lint** — `node scripts/lint-uth.mjs` · Expected: clean across all 115 lessons + all onTheJob blocks.
- [ ] **Step 2: Full build** — `npm run build` · green.
- [ ] **Step 3: Zero leftovers** — `grep -rn "💼" src/lessons` returns NOTHING (the tape label lives in LessonShell, and migrated sections carry no 💼 inside lesson files — today the same grep finds exactly the 59 old badges); `grep -rl "onTheJob:" src/lessons | wc -l` prints 59.
- [ ] **Step 4: Fresher read** — re-read every migrated section and reworded stem against the two contracts; fix inline, re-lint.
- [ ] **Step 5: Finish the report** (all rows, plus a relocations list) and add a Next-up entry to `docs/plan/05-PROGRESS.md` describing what shipped and pointing at the report.
- [ ] **Step 6: STOP. Do not commit.** Report to the user: lint clean, build green, report path, and that Phase 2+ sections await their browser pass. The user commits on their own word.
