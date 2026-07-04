# Learner Name Personalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded "Welcome back, Vasavi" greeting with a click-to-edit learner name saved in localStorage, and give the home page a cosmetic `/<name>-journey` URL once a name is saved.

**Architecture:** A `useLearnerName()` hook in `src/content/learner.ts` reads/writes one localStorage key directly (no new store). `CurriculumMap.tsx` swaps the static name for a local `EditableName` component (display span ⇄ inline input). `App.tsx` gains one extra route that renders the same home page and never reads its slug. Spec: `docs/superpowers/specs/2026-07-04-learner-name-personalization-design.md`.

**Tech Stack:** React 19 + TypeScript, react-router ^8.1.0, Tailwind (v4, CSS-variable tokens like `var(--color-ink-soft)`), localStorage. No new dependencies.

## Global Constraints

- **No `git commit` at any step** — leave verified changes in the working tree; the user commits on request only (project standing rule).
- **No automated test infra exists** (`npm test` is not defined). The verification gates are: `npm run build` (`tsc -b && vite build`) must pass, plus the exact manual checks listed in Task 3.
- Apostrophes inside single-quoted learner-facing strings must be curly `’`, never straight `'` (project gotcha; the strings in this plan contain none — keep it that way if you reword).
- Do not touch anything under `src/lessons/` or the progress store (`src/store/progress.ts`).
- localStorage key naming follows the existing convention: the progress store persists under `jfb-progress`, so the name lives under `jfb-learner-name`.
- iPad is a target device: text inputs need explicit `autoCapitalize`/`autoCorrect`/`autoComplete` attributes (project iPad-hardening convention).

---

### Task 1: `useLearnerName` hook + `nameSlug` helper

**Files:**
- Modify: `src/content/learner.ts` (currently 2 lines — full replacement below)

**Interfaces:**
- Consumes: nothing.
- Produces (Task 2 relies on these exact names/types):
  - `DEFAULT_NAME: string` — the literal `'friend'`.
  - `useLearnerName(): [string, (name: string) => string]` — current name + setter. **The setter returns the canonical value it actually saved** (trimmed, capped at 30 chars, fallen back to `DEFAULT_NAME` if empty). This is a deliberate, documented deviation from the spec's illustrative `void` signature: it lets the caller decide about navigation without re-implementing the normalization rules (DRY).
  - `nameSlug(name: string): string` — `"Mary Jane"` → `"mary-jane"`; `''` when nothing URL-safe remains (e.g. non-Latin scripts, all-punctuation).

- [ ] **Step 1: Replace the whole file**

The current file is only:

```ts
/** Who this notebook belongs to — used wherever the app speaks to the learner by name. */
export const LEARNER_NAME = 'Vasavi'
```

Replace `src/content/learner.ts` entirely with:

```ts
import { useState } from 'react'

/**
 * Who this notebook belongs to — the learner types their own name into the
 * home-page greeting (persisted in localStorage); 'friend' until they do.
 */
const STORAGE_KEY = 'jfb-learner-name' // matches the 'jfb-progress' key convention
export const DEFAULT_NAME = 'friend'
const MAX_LENGTH = 30

function readStoredName(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_NAME
  } catch {
    return DEFAULT_NAME // storage unavailable (private mode, blocked) — greet generically
  }
}

/** "Mary Jane" → "mary-jane"; '' when nothing url-safe remains. */
export function nameSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * The learner's name + a setter. The setter normalizes (trim → cap at 30 →
 * fall back to DEFAULT_NAME when empty) and RETURNS the value it saved, so
 * callers can react to the real outcome without re-running the rules.
 */
export function useLearnerName(): [string, (name: string) => string] {
  const [name, setNameState] = useState(readStoredName)
  const setName = (next: string): string => {
    const value = next.trim().slice(0, MAX_LENGTH).trim() || DEFAULT_NAME
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* storage unavailable — keep the in-memory value for this session */
    }
    setNameState(value)
    return value
  }
  return [name, setName]
}
```

(The double `.trim()` is intentional: capping at 30 can leave a trailing space mid-name.)

- [ ] **Step 2: Verify the build fails for the RIGHT reason**

Run: `npm run build`
Expected: **FAIL** — `src/app/CurriculumMap.tsx` errors with `'"../content/learner"' has no exported member named 'LEARNER_NAME'`. That is the only expected error; anything else means Step 1 went wrong. (This confirms `CurriculumMap.tsx` is the single consumer — Task 2 fixes it.)

---

### Task 2: `EditableName` in the headline

**Files:**
- Modify: `src/app/CurriculumMap.tsx` (imports at lines 1 and 6; a new local component after the `greetingByHour` helper; the `<h1>` at ~line 81)

**Interfaces:**
- Consumes from Task 1: `DEFAULT_NAME`, `nameSlug(name)`, `useLearnerName()` (setter returns the saved string).
- Produces: nothing consumed by later tasks. The navigation target it emits — `/${slug}-journey` via `navigate(..., { replace: true })` — must match the route pattern Task 3 adds.

- [ ] **Step 1: Update the two import lines**

Line 1, old:

```tsx
import { useState } from 'react'
```

new:

```tsx
import { useRef, useState } from 'react'
```

Line 6, old:

```tsx
import { LEARNER_NAME } from '../content/learner'
```

new:

```tsx
import { DEFAULT_NAME, nameSlug, useLearnerName } from '../content/learner'
```

(`useNavigate` is already imported from `react-router` on line 2 — no change there.)

- [ ] **Step 2: Add the `EditableName` component**

Insert directly after the `greetingByHour` function (after its closing `}`, before the `findNextLesson` comment):

```tsx
/**
 * The learner's name in the headline — click it, type, Enter. Saved via
 * useLearnerName (localStorage). Saving a real name also gives the page its
 * /<name>-journey address (cosmetic; the route never reads the slug back).
 */
function EditableName() {
  const [name, setName] = useLearnerName()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  // set once Enter/Escape has handled the edit, so the input's own blur
  // (which fires right after) can't double-commit or save a cancelled edit
  const done = useRef(false)

  const startEditing = () => {
    done.current = false
    setDraft(name === DEFAULT_NAME ? '' : name)
    setEditing(true)
  }

  const commit = () => {
    if (done.current) return
    done.current = true
    setEditing(false)
    const saved = setName(draft)
    const slug = nameSlug(saved)
    if (saved !== DEFAULT_NAME && slug) navigate(`/${slug}-journey`, { replace: true })
  }

  const cancel = () => {
    done.current = true
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') cancel()
        }}
        maxLength={30}
        size={Math.max(draft.length, 8)}
        placeholder="your name"
        aria-label="your name"
        autoCapitalize="words"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="done"
        className="bg-transparent outline-none"
        style={{ font: 'inherit', color: 'inherit', borderBottom: '3px dashed var(--color-ink-soft)' }}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={startEditing}
      title="click to change the name"
      className="cursor-pointer"
      style={{
        font: 'inherit',
        color: 'inherit',
        background: 'none',
        border: 'none',
        padding: 0,
        textDecoration: 'underline dashed var(--color-ink-soft)',
        textDecorationThickness: '2px',
        textUnderlineOffset: '6px',
      }}
    >
      {name}
      <span aria-hidden className="ml-1 align-middle text-3xl">✏️</span>
    </button>
  )
}
```

Design notes baked in (from the spec): only the name is clickable, with a dashed underline + always-visible pencil (interaction-clarity rule — no faint hover-only affordances); `font: 'inherit'` keeps both states at the h1's `font-hand text-5xl sm:text-6xl` size so nothing reflows; editing the default shows an empty input with a placeholder instead of making the learner delete "friend".

- [ ] **Step 3: Swap the name into the `<h1>`**

Old (line ~81):

```tsx
            Welcome{startedEver ? ' back' : ''}, {LEARNER_NAME}
```

New:

```tsx
            Welcome{startedEver ? ' back' : ''}, <EditableName />
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: **PASS** (the Task 1 export error is resolved; no other errors).

---

### Task 3: The `/<name>-journey` route + verification + progress log

**Files:**
- Modify: `src/app/App.tsx` (routes at lines 22-29; imports at line 2 only if the fallback branch is needed)
- Modify: `docs/plan/05-PROGRESS.md` (one session-log line + one next-up line)

**Interfaces:**
- Consumes: the URL shape Task 2 navigates to — a single path segment `<slug>-journey` (lowercase letters, digits, hyphens).
- Produces: a route matching that shape which renders `<CurriculumMap />` and ignores the slug.

- [ ] **Step 1: Probe whether react-router 8 supports a partial dynamic segment**

react-router v6/v7 rejected params glued to literals in one segment (`:slug-journey`); the project is on ^8.1.0, which may or may not. Decide objectively:

Run (from the repo root, where `node_modules` resolves):

```bash
node --input-type=module -e "import('react-router').then(m => console.log(JSON.stringify(m.matchPath('/:slug-journey', '/lijas-journey'))))"
```

- Output containing `"params":{"slug":"lijas"}` → **supported** → do Step 2A, skip 2B.
- Output `null`, or params keyed `"slug-journey"`, or an import error → **not supported** → skip 2A, do Step 2B.

- [ ] **Step 2A (supported): add the sibling route**

In `src/app/App.tsx`, old:

```tsx
        <Route index element={<CurriculumMap />} />
        <Route path="phase/:number" element={<PhasePage />} />
```

new:

```tsx
        <Route index element={<CurriculumMap />} />
        <Route path=":slug-journey" element={<CurriculumMap />} />
        <Route path="phase/:number" element={<PhasePage />} />
```

No conflict with `/design` or `/phase/:number`: static segments outrank dynamic ones, and both differ in shape anyway.

- [ ] **Step 2B (fallback): single-param route + suffix check in code**

Only if Step 1 said not supported. In `src/app/App.tsx`:

Import change — old line 2:

```tsx
import { Route, Routes, useLocation } from 'react-router'
```

new:

```tsx
import { Route, Routes, useLocation, useParams } from 'react-router'
```

Add after the `ScrollToTop` function:

```tsx
/** /<anything>-journey is the home page wearing the learner's name; anything else renders nothing. */
function JourneyRoute() {
  const { slug } = useParams()
  return slug && slug.endsWith('-journey') ? <CurriculumMap /> : null
}
```

Routes — old:

```tsx
        <Route index element={<CurriculumMap />} />
        <Route path="phase/:number" element={<PhasePage />} />
```

new:

```tsx
        <Route index element={<CurriculumMap />} />
        <Route path=":slug" element={<JourneyRoute />} />
        <Route path="phase/:number" element={<PhasePage />} />
```

(Accepted side effect, per spec: unknown single-segment URLs like `/foo` now render the Layout shell with an empty body instead of a fully blank page. `/design` is unaffected — static beats dynamic in route ranking.)

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: **PASS**.

- [ ] **Step 4: Manual verification in the dev server**

Run: `npm run dev`, then in the browser (use a private window or clear the `jfb-learner-name` key for check 1):

1. Fresh state → headline reads "Welcome, friend" with dashed underline + ✏️; clicking it opens an **empty** input with placeholder "your name".
2. Type `Lijas` + Enter → headline shows the name, URL becomes `/lijas-journey`, and DevTools → Application → Local Storage shows `jfb-learner-name: Lijas`.
3. Refresh on `/lijas-journey` → same home page, name persists. Visit `/` directly → also works, **no** redirect.
4. Click the name, press Escape → editor closes, nothing changed (URL and storage untouched). Click, clear the field, Enter → back to "friend", URL does **not** change.
5. Type a two-word name (`Mary Jane`) → URL is `/mary-jane-journey`.
6. `/design` and `/phase/0` still route to their own pages.

If the machine running this has no browser access, stop and hand the checklist to the user — do not claim these checks passed without running them.

- [ ] **Step 5: Log in `docs/plan/05-PROGRESS.md`**

Add to the top of the "Next up" list:

```md
0. **Learner-name personalization built (2026-07-04) — awaiting user browser verification.** The home-page greeting name is now click-to-edit (dashed underline + ✏️), saved to localStorage under `jfb-learner-name` via a new `useLearnerName()` hook in `src/content/learner.ts` (default: "friend"; empty input falls back to it; 30-char cap). Saving a real name also rewrites the address bar to `/<name-slug>-journey` (cosmetic — the route renders the same CurriculumMap and never reads the slug; `/` still works, no redirect). Spec: `docs/superpowers/specs/2026-07-04-learner-name-personalization-design.md`. Verify per the checklist in `docs/superpowers/plans/2026-07-04-learner-name-personalization.md` Task 3 Step 4 — especially Escape-cancel and the `/lijas-journey` refresh.
```

And a session-log row:

```md
| 2026-07-04 | **Learner-name personalization.** LEARNER_NAME constant retired; `useLearnerName()` hook (localStorage `jfb-learner-name`, default "friend") + click-to-edit name in the CurriculumMap headline (Enter/blur saves, Escape cancels via a done-ref so the trailing blur can’t double-fire; iPad input attrs; 30-char cap) + cosmetic `/<name>-journey` route in App.tsx (slug never read back; chosen between `:slug-journey` and a `:slug`+suffix-check fallback by probing react-router 8’s matchPath at implementation time). Build green; browser checklist pending user. |
```

(Note the curly apostrophes in "can’t" / "8’s" — keep them curly.)

- [ ] **Step 6: Report — do not commit**

Summarize the diff to the user and wait; commits happen only on explicit request.
