# SEO & Reach — Design (rebrand + prerender + playbook)

**Date:** 2026-07-06
**Status:** Draft — awaiting user review

## Problem

The app at https://javascript-for-babies.vercel.app does not appear in Google searches.
Root causes, confirmed against the deployed code:

1. **Google was never told the site exists** — no Search Console property, no submitted
   sitemap, zero backlinks. A site nobody links to and nobody registered is invisible.
2. **Every URL serves the same empty HTML shell.** The app is a client-rendered SPA:
   crawlers must execute JS to see any content, which new low-authority sites get very
   little budget for. The 115 lesson pages — the long-tail goldmine — share one generic
   `<title>` and are absent from the sitemap (13 URLs today).
3. **The vercel.app subdomain** carries a shared-reputation handicap and no brand.
4. **The name collides.** "JavaScript for Babies" is an existing published board-book
   brand (plus copycats). We would fight someone else's brand for our own name — and
   "for Babies" mis-signals the actual audience (adult absolute beginners) in search
   results.

## Goal

Make every page of the course independently findable in search, on a brand we can own,
with a concrete path to the first backlinks — so the course reaches many people, not
just its first learner.

## Positioning (user-confirmed)

Three layers, no trade-off:
- **Audience:** absolute beginners learning JavaScript.
- **Differentiator:** visually enriched — animated, hand-drawn, step-by-step.
- **Unique outcome:** ends at Playwright automation testing (the "become a tester" bonus).

Home page carries the beginner identity; lesson pages target concept searches
("closures explained simply", "== vs === in JavaScript"); Phase 10–11 pages target
"Playwright for beginners / JavaScript for automation testing" searches.

## Decisions (user-confirmed)

| Decision | Choice |
|---|---|
| Search Console status | Never set up → full walkthrough required |
| Custom domain | Buy one now, before any SEO work |
| Brand | **Rename: sketchbook identity** — working name "JS Sketchbook" |
| Scope | Code + setup walkthrough + distribution playbook |
| Technical approach | **A: build-time prerendering** (over meta-only B and Next.js migration C) |

## Design

### 1. Rebrand: JS Sketchbook

- Working name **"JS Sketchbook"**; tagline keeps the full promise:
  *"JavaScript for absolute beginners — drawn, animated, and hands-on, all the way to
  Playwright automation testing."*
- Domain shortlist to check at the registrar, in order: `jssketchbook.com`,
  `jssketchbook.dev`, `thejssketchbook.com`, `sketchbookjs.com`. User buys the first
  available they like (~$10–15/yr). `.com` preferred; `.dev` acceptable (dev audience,
  HTTPS-forced).
- New module `src/content/site.ts` — single source of truth:
  `SITE_NAME`, `SITE_TAGLINE`, `SITE_URL` (used by head manager, JSON-LD, sitemap
  generator, prerender manifest). `index.html` static tags updated to match.
- Rename touches: `index.html` (title/OG/Twitter/JSON-LD), `manifest.webmanifest`,
  apple-touch title, in-app header/footer brand strings, README title, `og.png`
  regenerated with the new name (screenshot of a small HTML template via Playwright —
  same tool as the prerender; also fixes today's ~1 MB og.png → target < 300 KB).
- "JS for Babies" may survive as an easter-egg line in the footer if the user wants;
  nothing else keeps the old name.
- The old vercel.app URL keeps working forever: Vercel redirects it (308) to the new
  primary domain — existing LinkedIn shares and Lijas's bookmarks don't break.

### 2. Per-route heads — `useSeo()` hook

Small hook (~40 lines, no new runtime dependency) called by each page component; sets
`document.title`, meta description, canonical `<link>`, OG/Twitter tags, and one
JSON-LD `<script>` per route. Data comes from what already exists — zero new writing:

| Route | Title pattern | Description source | JSON-LD |
|---|---|---|---|
| `/` | `JS Sketchbook — learn JavaScript visually, from zero to Playwright` | current description, brand-swapped | `Course` (free, online, 115 lessons, provider Person Vasavi) |
| `/phase/:n` | `{phase.title} — Phase {n} | JS Sketchbook` | the phase's `question` + first `whyNeeded` line | `CollectionPage` + `BreadcrumbList` |
| `/lesson/:id` | `{lesson.title} — JavaScript for beginners, visually | JS Sketchbook` | the lesson's `blurb` (registry) | `LearningResource` + `BreadcrumbList` (Home → Phase → Lesson) |
| `/:slug-journey` | home title | home description | canonical → `/` (duplicate-content guard) |
| `/design` | dev gallery | — | `noindex` meta + robots disallow |

Titles clamp to ~60 visible chars (lesson titles are short; pattern verified at
implementation against the longest registry title).

### 3. Prerendering pipeline

- `scripts/routes.mjs`: extracts lesson ids + phase numbers from
  `src/content/registry.ts` (same regex-extraction pattern proven by
  `scripts/lint-uth.mjs`) → emits the route manifest (~128 routes: `/`, 12 phases,
  115 lessons).
- `scripts/prerender.mjs`: after `vite build` — serves `dist/` with SPA fallback,
  launches **Playwright Chromium**, visits every manifest route, waits for the page's
  main content selector, writes `dist/<route>/index.html` with the fully rendered
  markup (head tags included, since `useSeo` ran).
- Vercel serves real files before applying the SPA rewrite (filesystem wins over
  `rewrites` in vercel.json), so crawlers receive full HTML per URL; unknown routes
  (e.g. name-journey vanity URLs) still fall back to the SPA shell.
- Client behavior unchanged: React mounts over the snapshot on load. A crawler and a
  first-time visitor see identical content (empty progress state — already the
  default).
- Build command on Vercel becomes: `npm run build && node scripts/prerender.mjs`
  (Playwright installed as devDependency; `npx playwright install chromium --with-deps`
  in the Vercel install step). Build time grows a few minutes — acceptable.
- Playwright prerendering the Playwright course is the correct joke and we keep it.

### 4. Sitemap & robots

- `scripts/generate-sitemap.mjs` (runs in the build, before prerender): all ~128 URLs
  on the new domain with `lastmod` = build date → `dist/sitemap.xml` (replaces today's
  13-URL static file, which is deleted from `public/`).
- `robots.txt`: keep `Allow: /`, add `Disallow: /design`, sitemap line moves to the
  new domain.
- New lessons appear in the sitemap automatically on the next build.

### 5. Setup walkthrough (docs/plan/06-SEO-PLAYBOOK.md, part 1)

Step-by-step, written for someone who has never used these tools:
1. Buy the domain at the registrar; add it to the Vercel project (apex + `www`), set
   primary, verify the 308 redirect from vercel.app.
2. Update `SITE_URL` + `index.html` + redeploy (one commit).
3. **Google Search Console**: add a Domain property, verify via DNS TXT record
   (exact registrar steps), submit `sitemap.xml`, then URL-Inspect + Request Indexing
   for `/`, one phase page, and 3–4 flagship lessons (1.10 operators, 3.7 closures,
   6.2 event loop, 11.1 Playwright).
4. **Bing Webmaster Tools**: one-click import from the GSC property.
5. What to watch: GSC Pages report (indexed count climbing over 2–6 weeks),
   Performance report (impressions before clicks). What NOT to panic about:
   "Discovered — currently not indexed" in week one is normal.

### 6. Distribution playbook (same doc, part 2)

The first backlinks, ordered by durability:
1. **Curated GitHub lists** (PRs): awesome-playwright, JavaScript learning-resource
   lists — durable, crawled, on-topic backlinks.
2. **dev.to / Hashnode article series** ("How I visualize closures", one concept per
   article) that deep-link the matching lessons — canonical backlinks plus their own
   search presence.
3. **LinkedIn** (already wired in the footer): one post per phase with a screen
   recording of its best visualization.
4. **Communities, following each one's self-promo rules**: r/learnjavascript,
   r/QualityAssurance, r/softwaretesting, Ministry of Testing club, freeCodeCamp
   forum — shared as a free resource, not an ad. One "Show HN" when the rebrand +
   prerender ship.
5. Cadence: one action per week beats ten in launch week; the doc includes a
   first-month checklist.

### 7. Success criteria

- `site:<newdomain>` returns 100+ pages within ~6 weeks of the sitemap submission.
- GSC shows impressions on lesson pages for concept queries (not just brand queries).
- Link previews (LinkedIn/WhatsApp) unfurl the new brand fast (og.png < 300 KB).
- Old vercel.app links 308-redirect; no broken shares.
- Build stays green; prerendered pages byte-match what a browser renders.

## Non-goals

- No SSR framework migration (Next.js) — prerendering achieves the same for static
  content without touching the app architecture.
- No paid ads, no analytics changes (Vercel Analytics already mounted).
- No content rewrites for SEO — the lesson prose is the content; the UTH rework
  already governs its quality.
- No per-lesson custom og images (one rebranded og.png for now; revisit if social
  sharing becomes a real channel).

## Risks

- **Prerender fragility**: a route that renders nothing (error boundary, missing
  registry entry) would snapshot an empty page — the script fails the build if a
  page's main selector or expected text is missing (acts as a smoke test of all 128
  routes — a bonus, not just a risk control).
- **Hydration flash**: returning learners may briefly see the empty-progress snapshot
  before their localStorage state paints — same flash that exists today from the blank
  shell; acceptable.
- **Domain choice**: availability unknown until checked; the shortlist has four
  fallbacks and the design is name-parameterized (`site.ts`).
- **Rename blast radius**: og.png, manifest, README, in-app strings — enumerated in
  the plan as one task so nothing half-renamed ships.
