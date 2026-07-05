# Under-the-Hood Rework — Implementation Plan (Batch 0 + Batch 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite every lesson's `underTheHood` section into one plain, teaching voice under a 7-rule style contract — this plan covers the contract + lint tooling (Batch 0) and the Phases 0–2 calibration rewrite (Batch 1, 24 lessons), ending at the user review gate.

**Architecture:** Content-only edits to the `underTheHood: (…)` JSX block in `src/lessons/phaseN/*.tsx`. A lint script (`scripts/lint-uth.mjs`) is the mechanical gate: sentence length, idiom/jargon blocklist, word-count growth vs a recorded baseline. No component, engine, or registry changes.

**Tech Stack:** React/TSX lesson files (prose inside JSX), Node script for linting, `npm run build` as the compile check.

**Spec:** `docs/superpowers/specs/2026-07-05-under-the-hood-rework-design.md` (approved).

## Global Constraints

Every rewrite task obeys **The Style Contract** (copied verbatim from the spec — this is the law):

1. **One idea per sentence, max two clauses.** No triple-clause em-dash chains.
2. **Plain claim first, machinery second.** Every paragraph opens with its point in everyday words, then explains the mechanism.
3. **Every term is taught, glossed, or cut.** A technical term must have a lesson behind it (cited by number, as now) or an everyday-words gloss at first use. Insider asides about things never taught are glossed or deleted.
4. **One voice for the whole lesson.** Under-the-hood addresses the same beginner the captions address. Test: would a step caption ever say this sentence this way?
5. **Job notes: kept, badged.** Career/interview content opens with `<strong>💼 On the job —</strong>` inside its `<p>`, teaching voice.
6. **Rewrites may not grow a section.** Same paragraph count (3–4); word count ≤ the original (lint enforces vs baseline). Facts are never sacrificed — a fact that resists plain phrasing needs a gloss, not deletion.
7. **Plain International English.** No idioms, no slang, no culture-bound references. Test: translated word-for-word into another language, the sentence still makes sense.

Project rules that also apply:

- Edit ONLY the `underTheHood` block of each lesson (+ a `teachBack.modelAnswer` touch-up ONLY where a rewritten fact would contradict it).
- Typographic apostrophes (’) in JSX prose, exactly as the files already do. Straight quotes stay straight inside `<code>` elements.
- Use the Edit tool for file changes (files are CRLF on disk; node string-patching misses).
- Commits per task are authorized by the approved spec ("commits per batch"); NEVER push. No Co-Authored-By trailer.
- Build check: `npm run build` → expect `✓ built in …`.
- Existing content rules stay in force: metaphors get boundary lines; fun facts need everyday hooks; forward references flag, never teach.

**The calibration example** (approved by user; every rewrite imitates this register):

BEFORE (1.10): *"Short-circuiting is also load-bearing in real code: `user && user.name` deliberately uses the skip to avoid touching `.name` when there's no user."*

AFTER: *"The skip you watched (short-circuiting) is more than a speed trick — real code depends on it. An example built only from tools you own: `count !== 0 && total / count > 5`. When count is 0, `&&` skips the right side entirely — so the division by zero never happens. The left side protects the right side."*

(Note it also fixed a teaching bug: `user.name` used Phase-4 dot syntax in a Phase-1 lesson. Watch for and fix the same class: examples must only use tools already taught at that lesson's position.)

---

### Task 1: Write the style contract into the blueprint + memory

**Files:**
- Modify: `docs/plan/04-LESSON-BLUEPRINT.md` (append a new section at the end)
- Create: `C:\Users\Admin\.claude\projects\D--Code-js-for-babies\memory\feedback-uth-style-contract.md`
- Modify: `C:\Users\Admin\.claude\projects\D--Code-js-for-babies\memory\MEMORY.md` (add index line)

**Interfaces:**
- Produces: the written contract that all rewrite tasks cite; the standing rule for all future lesson content.

- [ ] **Step 1: Append the contract to the blueprint**

Add to the end of `docs/plan/04-LESSON-BLUEPRINT.md`:

```markdown
## Under-the-Hood style contract (2026-07-05 — applies to ALL prose content going forward)

Learner feedback: UTH read as "a different course" — dense sentences, unglossed jargon,
colleague voice. The contract (full rationale in
docs/superpowers/specs/2026-07-05-under-the-hood-rework-design.md):

1. One idea per sentence, max two clauses. No triple-clause em-dash chains.
2. Plain claim first, machinery second — every paragraph opens with its point in everyday
   words, then the mechanism.
3. Every term is taught (cite the lesson number), glossed inline in everyday words, or cut.
   No insider asides about untaught things.
4. One voice: UTH talks to the same beginner the captions talk to.
5. Job notes kept, badged: open with "💼 On the job —" (bold), teaching voice.
6. Rewrites may not grow a section (3–4 paragraphs; word count ≤ original). Never cut facts —
   gloss them.
7. Plain International English: no idioms, no slang, no culture-bound references. Test: does a
   word-for-word translation still make sense?

Lint: `node scripts/lint-uth.mjs [phase…]` — flags long sentences, blocklisted idioms/jargon,
and growth vs `scripts/uth-baseline.json`.
```

- [ ] **Step 2: Save the memory rule**

Create `C:\Users\Admin\.claude\projects\D--Code-js-for-babies\memory\feedback-uth-style-contract.md`:

```markdown
---
name: feedback-uth-style-contract
description: 7-rule style contract for underTheHood (and all future prose) — plain teaching voice, no idioms, glossed terms, plain-claim-first
metadata:
  type: feedback
---

Lijas's feedback (2026-07-05): underTheHood was too technical from Phase 1 on — dense
sentences, unglossed jargon, colleague-voice register jump. NOT too long (depth stays).

**Why:** UTH must teach the same beginner the captions teach; he is not a native English
speaker, so idioms ("pecking order", "load-bearing") are walls, and multi-clause sentences
lose him even when each word is known.

**How to apply:** the 7-rule contract in docs/plan/04-LESSON-BLUEPRINT.md (and the spec
2026-07-05-under-the-hood-rework-design.md): one idea per sentence · plain claim first ·
every term taught/glossed/cut · one voice · job notes badged "💼 On the job —" · no growth ·
plain international English (word-for-word translation test). Lint with
scripts/lint-uth.mjs. Applies to ALL new lesson prose, not just UTH. See also
[[feedback-explain-for-newbies]], [[feedback-metaphor-weaning]].
```

Add to `MEMORY.md` index:

```markdown
- [UTH style contract](feedback-uth-style-contract.md) — 7 rules: one idea/sentence, plain-claim-first, gloss-or-cut, one voice, 💼 job notes, no growth, NO IDIOMS (international English); lint-uth.mjs
```

- [ ] **Step 3: Commit**

```bash
git add docs/plan/04-LESSON-BLUEPRINT.md docs/superpowers/specs/2026-07-05-under-the-hood-rework-design.md docs/superpowers/plans/2026-07-05-under-the-hood-rework.md
git commit -m "docs: UTH style contract (7 rules) + rework spec/plan - Lijas feedback round"
```

(Memory files live outside the repo — no git action for them.)

---

### Task 2: Build the UTH lint script + record the baseline

**Files:**
- Create: `scripts/lint-uth.mjs`
- Create: `scripts/uth-baseline.json` (generated by the script's `--baseline` mode)

**Interfaces:**
- Consumes: `src/lessons/phase*/*.tsx` (reads `underTheHood` blocks).
- Produces: `node scripts/lint-uth.mjs phase0 phase1 phase2` → per-lesson findings + exit code (0 clean / 1 findings). `--baseline` writes word counts. All rewrite tasks run this.

- [ ] **Step 1: Write the script**

Create `scripts/lint-uth.mjs`:

```js
// Lint underTheHood prose against the style contract (docs/plan/04-LESSON-BLUEPRINT.md).
// Usage:
//   node scripts/lint-uth.mjs [phase0 phase1 …]   lint (default: all phases)
//   node scripts/lint-uth.mjs --baseline           record current word counts
import fs from 'node:fs'
import path from 'node:path'

const ROOT = 'src/lessons'
const BASELINE_PATH = 'scripts/uth-baseline.json'
const MAX_SENTENCE_WORDS = 28

// Rule 7 seed list — grows as offenders are found during the sweep.
const IDIOMS = [
  'pecking order', 'load-bearing', 'earning its keep', 'earn its keep', 'earns its keep',
  'pays rent', 'paying rent', 'pays its rent', 'cried wolf', 'cries wolf', 'junk drawer',
  'in costume', 'wearing a costume', 'sledgehammer', 'tester gold', 'goldmine',
  'the whole nine', 'walks past everyone', 'best in the trade', 'in the trenches',
  'day-one bug', 'arbitrage',
]
// Rule 3 seed list — untaught tech names; flagged unless a gloss "(" opens within the
// same sentence after the term.
const JARGON = ['React', 'layout thrash', 'structural typing', 'memoize', 'Annex B', 'monorepo']

const args = process.argv.slice(2)
const baselineMode = args.includes('--baseline')
const phases = args.filter((a) => a.startsWith('phase'))

function extractUth(source) {
  const m = source.match(/underTheHood: \(([\s\S]*?)\n  \),/)
  if (!m) return null
  return m[1]
    .replace(/<code>[\s\S]*?<\/code>/g, ' CODE ') // code spans are exempt from prose rules
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{'\s*'\}/g, ' ')
    .replace(/\{["']([^"']*)["']\}/g, '$1')
    .replace(/&\w+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const results = []
const baseline = fs.existsSync(BASELINE_PATH) ? JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8')) : {}
const newBaseline = {}

for (const dir of fs.readdirSync(ROOT).sort()) {
  if (!dir.startsWith('phase')) continue
  if (phases.length && !phases.includes(dir)) continue
  for (const file of fs.readdirSync(path.join(ROOT, dir)).sort()) {
    if (!file.endsWith('.tsx')) continue
    const source = fs.readFileSync(path.join(ROOT, dir, file), 'utf8')
    const id = (source.match(/id: '(\d+\.\d+)'/) || [])[1] || file
    const text = extractUth(source)
    if (!text) continue
    const words = text.split(' ').filter(Boolean).length
    newBaseline[id] = words
    const findings = []

    // Rule 1: sentence density
    for (const sentence of text.split(/(?<=[.!?])\s+/)) {
      const w = sentence.split(' ').filter(Boolean).length
      if (w > MAX_SENTENCE_WORDS) findings.push(`long sentence (${w}w): "${sentence.slice(0, 70)}…"`)
    }
    // Rule 7: idioms
    for (const idiom of IDIOMS) {
      if (text.toLowerCase().includes(idiom.toLowerCase())) findings.push(`idiom: "${idiom}"`)
    }
    // Rule 3: untaught jargon without a nearby gloss
    for (const term of JARGON) {
      const idx = text.indexOf(term)
      if (idx !== -1 && !text.slice(idx, idx + 120).includes('(')) findings.push(`unglossed jargon: "${term}"`)
    }
    // Rule 6: growth vs baseline
    if (!baselineMode && baseline[id] && words > baseline[id]) {
      findings.push(`grew: ${baseline[id]} → ${words} words`)
    }
    if (findings.length) results.push({ id, findings })
  }
}

if (baselineMode) {
  fs.writeFileSync(BASELINE_PATH, JSON.stringify(newBaseline, null, 2))
  console.log(`baseline recorded for ${Object.keys(newBaseline).length} lessons → ${BASELINE_PATH}`)
  process.exit(0)
}

for (const r of results) {
  console.log(`\n${r.id}`)
  for (const f of r.findings) console.log(`  - ${f}`)
}
console.log(results.length === 0 ? '\nUTH lint: clean' : `\nUTH lint: findings in ${results.length} lessons`)
process.exit(results.length === 0 ? 0 : 1)
```

- [ ] **Step 2: Record the baseline (word counts of CURRENT content)**

Run: `node scripts/lint-uth.mjs --baseline`
Expected: `baseline recorded for 115 lessons → scripts/uth-baseline.json`

- [ ] **Step 3: Verify the lint FAILS on current content (the failing-test moment)**

Run: `node scripts/lint-uth.mjs phase0 phase1 phase2`
Expected: exit 1 with findings — at minimum `1.10  - idiom: "load-bearing"` and several `long sentence` flags across Phases 0–2. If it reports clean, the extractor or lists are broken — fix before proceeding.

- [ ] **Step 4: Commit**

```bash
git add scripts/lint-uth.mjs scripts/uth-baseline.json
git commit -m "chore: UTH lint script + word-count baseline (style-contract gate)"
```

---

## The Rewrite Procedure (used verbatim by Tasks 3–7)

For EACH lesson in the task's list:

1. Read the lesson's `underTheHood: (…)` block in full.
2. List its facts (every claim, example, citation, job note). This list must survive.
3. Rewrite paragraph by paragraph under the 7 rules: plain claim first; split every
   multi-clause sentence; gloss or cut untaught terms; replace idioms with literal words;
   keep `<code>`/`<strong>`/lesson-number citations; keep paragraph count.
4. If a job note exists, open its `<p>` with `<strong>💼 On the job —</strong> `.
5. Check every code example uses only tools taught at or before this lesson's position
   (the `user.name`-in-Phase-1 bug class). Replace violating examples with taught-tools
   equivalents that keep the point.
6. If the rewrite contradicts the lesson's `teachBack.modelAnswer`, touch that up minimally.
7. Apply with the Edit tool (one edit per lesson: old UTH block → new UTH block).

After ALL lessons in the task: run the lint for the task's phases (expect clean or fix),
run `npm run build` (expect green), then commit.

---

### Task 3: Rewrite Phase 0 (5 lessons)

**Files:**
- Modify: `src/lessons/phase0/lesson01.tsx`, `lesson02.tsx`, `lesson03.tsx`, `lesson04.tsx`, `lesson05.tsx` (underTheHood blocks only)

**Interfaces:**
- Consumes: the Rewrite Procedure above + Global Constraints contract.
- Produces: Phase 0 UTH in the calibration register.

- [ ] **Step 1: Rewrite all 5 lessons per the Rewrite Procedure**
- [ ] **Step 2: Lint** — Run: `node scripts/lint-uth.mjs phase0` · Expected: `UTH lint: clean`
- [ ] **Step 3: Build** — Run: `npm run build` · Expected: `✓ built in …`
- [ ] **Step 4: Commit**

```bash
git add src/lessons/phase0
git commit -m "content: UTH rewrite phase 0 (style contract - plain teaching voice)"
```

### Task 4: Rewrite Phase 1, first half (1.1–1.6)

**Files:**
- Modify: `src/lessons/phase1/lesson11.tsx`, `lesson12.tsx`, `lesson13.tsx`, `lesson14.tsx`, `lesson15.tsx`, `lesson16.tsx`

Steps identical in shape to Task 3 (Procedure → lint `phase1` will still flag the un-rewritten half — acceptable mid-task; the Task 5 lint is the gate) → build → commit `content: UTH rewrite phase 1a (1.1-1.6)`.

- [ ] **Step 1: Rewrite 1.1–1.6 per the Rewrite Procedure**
- [ ] **Step 2: Build** — Run: `npm run build` · Expected: green
- [ ] **Step 3: Commit** — `git add src/lessons/phase1 && git commit -m "content: UTH rewrite phase 1a (1.1-1.6)"`

### Task 5: Rewrite Phase 1, second half (1.7–1.11)

**Files:**
- Modify: `src/lessons/phase1/lesson17.tsx`, `lesson18.tsx`, `lesson19.tsx`, `lesson110.tsx`, `lesson111.tsx`

Note: 1.10 must land exactly on the approved calibration text (spec "Calibration example") — including the `count !== 0 && total / count > 5` guard example and the corrected precedence paragraph.

- [ ] **Step 1: Rewrite 1.7–1.11 per the Rewrite Procedure (1.10 = the approved text)**
- [ ] **Step 2: Lint** — Run: `node scripts/lint-uth.mjs phase1` · Expected: `UTH lint: clean`
- [ ] **Step 3: Build** — Run: `npm run build` · Expected: green
- [ ] **Step 4: Commit** — `git add src/lessons/phase1 && git commit -m "content: UTH rewrite phase 1b (1.7-1.11)"`

### Task 6: Rewrite Phase 2, first half (2.1–2.4)

**Files:**
- Modify: `src/lessons/phase2/lesson21.tsx`, `lesson22.tsx`, `lesson23.tsx`, `lesson24.tsx`

- [ ] **Step 1: Rewrite 2.1–2.4 per the Rewrite Procedure**
- [ ] **Step 2: Build** — Run: `npm run build` · Expected: green
- [ ] **Step 3: Commit** — `git add src/lessons/phase2 && git commit -m "content: UTH rewrite phase 2a (2.1-2.4)"`

### Task 7: Rewrite Phase 2, second half (2.5–2.8)

**Files:**
- Modify: `src/lessons/phase2/lesson25.tsx`, `lesson26.tsx`, `lesson27.tsx`, `lesson28.tsx`

- [ ] **Step 1: Rewrite 2.5–2.8 per the Rewrite Procedure**
- [ ] **Step 2: Lint** — Run: `node scripts/lint-uth.mjs phase2` · Expected: `UTH lint: clean`
- [ ] **Step 3: Build** — Run: `npm run build` · Expected: green
- [ ] **Step 4: Commit** — `git add src/lessons/phase2 && git commit -m "content: UTH rewrite phase 2b (2.5-2.8)"`

---

### Task 8: Batch-1 verification + fresher read + STOP at the review gate

**Files:**
- Modify: `docs/plan/05-PROGRESS.md` (add the batch note)

- [ ] **Step 1: Full-batch lint** — Run: `node scripts/lint-uth.mjs phase0 phase1 phase2` · Expected: `UTH lint: clean`
- [ ] **Step 2: Fresher read** — re-read all 24 rewritten sections as the fresher (the established ritual): fact-list preserved per lesson? plain-claim-first per paragraph? any idiom the blocklist missed (add it to `IDIOMS` and fix the text)? any register slips? Fix inline, re-lint, re-build.
- [ ] **Step 3: Word-count report** — Run: `node -e "const b=require('./scripts/uth-baseline.json');const fs=require('fs');/* print id: before words for phases 0-2 */ Object.entries(b).filter(([k])=>/^[012]\./.test(k)).forEach(([k,v])=>console.log(k,v))"` and compare against the lint's growth check (already enforced — this step is the human glance).
- [ ] **Step 4: Update progress board** — add to `docs/plan/05-PROGRESS.md` Next-up: batch 1 done (24 lessons), lint clean, build green, awaiting user/Lijas register review before batches 2–6.
- [ ] **Step 5: Commit** — `git add docs/plan/05-PROGRESS.md scripts/lint-uth.mjs && git commit -m "content: UTH batch 1 verified (phases 0-2) - awaiting register review"`
- [ ] **Step 6: STOP.** Tell the user batch 1 is ready; ask them/Lijas to read 2–3 under-the-hood sections in the browser (suggest 0.2, 1.10, 2.7) and approve the register. Do NOT proceed to batches 2–6 without approval.

---

## Follow-on batches (GATED — do not start until the Task 8 review is approved)

Same Rewrite Procedure, same per-task shape (rewrite → lint phase-clean → build → commit),
split as: Batch 2 = Phases 3–4 (25 lessons, 4 tasks), Batch 3 = Phases 5–6 (18, 3 tasks),
Batch 4 = Phases 7–8 (15, 3 tasks), Batch 5 = Phases 9–10 (15, 3 tasks), Batch 6 = Phase 11
(18, 4 tasks; the many 💼 job notes live here). After user approval, extend THIS plan file
with those tasks written out (same level of detail) before executing them. Final step of the
last batch: full-course lint (`node scripts/lint-uth.mjs` → clean), build, progress update.
