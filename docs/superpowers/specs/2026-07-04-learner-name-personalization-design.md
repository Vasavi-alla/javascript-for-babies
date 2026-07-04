# Learner name personalization + journey URL — design

## Problem

The home page greets with a hardcoded name: `LEARNER_NAME = 'Vasavi'` in
`src/content/learner.ts`, rendered once in `CurriculumMap.tsx`'s big headline
("Welcome back, Vasavi"). Anyone else using the app (the actual learner is Lijas; the deployed
site is public) is greeted with the wrong name and has no way to change it.

## Decisions (user-approved)

1. **Entry method: click the name to edit it inline.** The name in the headline itself is the
   editor — no modal, no settings page. (A first-visit prompt dialog was considered and
   declined.)
2. **Storage: a tiny custom hook backed directly by `localStorage`.** No new Zustand store, no
   new field on the existing progress store. (Both were considered; a whole store is
   disproportionate ceremony for one string, and the progress store's documented concern is
   progress, not identity.)
3. **Default/fallback: `friend`.** First-ever visit shows "Welcome, friend"; saving an
   empty/whitespace-only name falls back to "friend".
4. **URL flavor: cosmetic `/​<name-slug>-journey`.** After a real name is saved, the address bar
   updates to e.g. `/lijas-journey`. `/` keeps working exactly as today; the slug route renders
   the same home page and **never reads the slug** (visiting `/priya-journey` on a fresh browser
   does NOT set the name — explicitly declined). `/` does not redirect to the slug URL
   (explicitly declined).

## Data layer — `src/content/learner.ts`

Replace the static export with a hook (the constant's only consumer is `CurriculumMap.tsx`, so
removing the `LEARNER_NAME` export breaks nothing else):

```ts
import { useState } from 'react'

const STORAGE_KEY = 'jfb-learner-name' // matches the existing 'jfb-progress' key convention
export const DEFAULT_NAME = 'friend'
const MAX_LENGTH = 30

function readStoredName(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_NAME
  } catch {
    return DEFAULT_NAME // Safari private mode etc. — degrade to in-memory
  }
}

export function useLearnerName(): [string, (name: string) => void] {
  const [name, setNameState] = useState(readStoredName)
  const setName = (next: string) => {
    const value = next.trim().slice(0, MAX_LENGTH) || DEFAULT_NAME
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* storage unavailable — keep the in-memory value for this session */
    }
    setNameState(value)
  }
  return [name, setName]
}
```

Notes:
- Trim before saving; internal whitespace preserved ("Mary Jane" stays "Mary Jane").
- Hard cap 30 characters (also enforced by the input's `maxLength`) so a long name can't break
  the headline layout.
- Single consumer today (`CurriculumMap`). The hook holds independent state per consumer — if a
  second consumer ever needs the name live, add a `storage`-event sync then, not now (YAGNI).

## Slug helper — same file

```ts
/** "Mary Jane" → "mary-jane"; returns '' if nothing url-safe remains. */
export function nameSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
```

Names written in non-Latin scripts slug to `''` — they simply skip the URL flavor (see
Routing); the greeting itself still shows the name exactly as typed.

## UI — `CurriculumMap.tsx`

The headline becomes: `Welcome{startedEver ? ' back' : ''}, ` + an `EditableName` element
(small component local to `CurriculumMap.tsx`, following the file's existing pattern of local
helpers).

**Display state:** the name only (never the whole sentence) is a button-like span with a
**dashed underline and an always-visible small pencil ✏️** — unmistakably clickable per the
project's interaction-clarity rule (no faint hover-only tints). Font/size identical to the
rest of the H1.

**Editing state (on click):** swaps to a text input pre-filled with the current name (or empty
when the current name is the default "friend", so the learner types fresh instead of deleting
the placeholder), styled to match the headline's `font-hand` size so nothing reflows.
- `maxLength={30}`, `autoFocus`
- iPad (a target device): `autocapitalize="words"`, `autoCorrect="off"`, `autocomplete="off"`;
  font size is far above the 16px Safari zoom threshold already.
- **Enter or blur → save.** **Escape → cancel** (revert to the previous name, no save).
  Implementation note: Escape closes the editor, which fires blur — the blur-save must not run
  after an Escape-cancel (guard with a ref/flag).

**Save flow:**
1. `setName(input)` (hook handles trim/cap/fallback).
2. If the resulting name ≠ `DEFAULT_NAME` **and** `nameSlug(name)` is non-empty:
   `navigate('/' + nameSlug(name) + '-journey', { replace: true })` — `replace` so the
   back button isn't cluttered with the same page. Clearing the field (→ "friend") or an
   all-punctuation name skips navigation.

## Routing — `App.tsx`

Add one sibling route rendering the same component:

```tsx
<Route index element={<CurriculumMap />} />
<Route path=":slug-journey" element={<CurriculumMap />} />
```

- The element never reads the param — purely cosmetic.
- No conflict with `/design`: static segments outrank dynamic ones in react-router's matcher,
  and `design` doesn't carry the `-journey` suffix anyway.
- Deep links / refresh on `/lijas-journey` already work in deployment: the existing
  `_redirects` + `vercel.json` SPA fallbacks serve `index.html` for unknown paths.

**⚠ Verify at implementation time:** partial dynamic segments (`:slug-journey` — a param and a
literal in one segment) were invalid in react-router v6/v7; the project is on react-router
^8.1.0. If v8 still rejects it, fall back to `path=":slug"` plus a tiny wrapper element that
renders `<CurriculumMap />` when `slug.endsWith('-journey')` and `null` otherwise. (Side
effect of the fallback, accepted: unknown single-segment URLs like `/foo` render the Layout
shell with an empty body instead of today's fully blank page.)

## Out of scope (YAGNI)

- Reading the slug to set the name (declined), redirecting `/` (declined).
- Using the name anywhere beyond the one greeting (teach-back, break coach, document.title).
- Multi-tab sync, name validation beyond trim/cap, a settings page.

## Files touched

- `src/content/learner.ts` — const → `useLearnerName` hook + `nameSlug` + `DEFAULT_NAME`.
- `src/app/CurriculumMap.tsx` — swap `LEARNER_NAME` import for the hook; add local
  `EditableName` component.
- `src/app/App.tsx` — add the `:slug-journey` route.

## Verification

- `npm run build` (`tsc -b && vite build`) green.
- Manual, in `npm run dev`:
  1. Fresh browser (or cleared `jfb-learner-name`): headline reads "Welcome, friend" with
     pencil affordance; clicking opens an empty input.
  2. Type "Lijas" + Enter → headline reads "Welcome, Lijas" (or "Welcome back," once lessons
     are done), URL becomes `/lijas-journey`, `localStorage['jfb-learner-name'] === 'Lijas'`.
  3. Refresh on `/lijas-journey` → same page, name persists. Visit `/` → still works, no
     redirect.
  4. Edit again, Escape → reverts, nothing saved. Edit, clear field, Enter → "friend", URL
     unchanged.
  5. `/design` and `/phase/0` still route correctly.
