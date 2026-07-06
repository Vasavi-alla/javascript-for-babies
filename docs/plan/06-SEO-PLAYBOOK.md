# SEO & Reach Playbook — the steps only a human can do

Code side (shipped): per-page titles/descriptions/canonicals + JSON-LD, 128-URL sitemap,
Playwright prerender (crawlers get full HTML), robots.txt, JS Sketchbook rebrand.
This doc: everything OUTSIDE the codebase, in order.

## Part 1 — Domain & Google setup (~1 hour once)

### 1. Buy the domain
Shortlist in order: jssketchbook.com → jssketchbook.dev → thejssketchbook.com →
sketchbookjs.com. Any registrar (Namecheap/Cloudflare/GoDaddy), ~$10–15/yr.
If you buy anything other than jssketchbook.com: update `.env` (VITE_SITE_URL),
`index.html` (og:url, JSON-LD url), `public/robots.txt` (Sitemap line) — then redeploy.

### 2. Connect it to Vercel
Vercel dashboard → the project → Settings → Domains → Add → enter the domain.
Add BOTH `jssketchbook.com` and `www.jssketchbook.com`; set the apex as primary
(www redirects to it). Vercel shows you 1–2 DNS records (A/CNAME) to add at the
registrar — copy them exactly. Wait until Vercel shows "Valid Configuration".
Check: the old javascript-for-babies.vercel.app now redirects (308) to the new domain.

### 3. Google Search Console (tell Google you exist)
1. Go to https://search.google.com/search-console → Add property → choose
   **Domain** (not URL prefix) → enter jssketchbook.com.
2. Google shows a TXT record (`google-site-verification=…`). At your registrar's
   DNS page, add it: Type TXT, Host/Name `@`, Value = the string. Wait 10–30 min,
   click Verify.
3. Left menu → Sitemaps → enter `sitemap.xml` → Submit. Status should become
   "Success" with ~128 discovered URLs.
4. Left menu → URL Inspection → paste each of these, then "Request Indexing"
   (one by one; there is a small daily quota):
   - https://jssketchbook.com/
   - https://jssketchbook.com/phase/1
   - https://jssketchbook.com/lesson/1.10  (operators)
   - https://jssketchbook.com/lesson/3.7   (closures)
   - https://jssketchbook.com/lesson/6.2   (event loop)
   - https://jssketchbook.com/lesson/11.1  (Playwright)

### 4. Bing (free extra traffic, 2 minutes)
https://www.bing.com/webmasters → sign in → "Import from Google Search Console".
Done — Bing also feeds DuckDuckGo and Yahoo.

### 5. What to watch (and what not to panic about)
- GSC → Indexing → Pages: indexed count should climb over 2–6 WEEKS. "Discovered –
  currently not indexed" in week one is normal for a new domain. Re-request the
  flagship URLs weekly if stuck.
- GSC → Performance: impressions rise before clicks. First goal: lesson pages
  getting impressions for concept queries ("closures explained", "event loop
  javascript") — not just the brand name.
- Reality check: `site:jssketchbook.com` in Google shows what's indexed.

## Part 2 — Distribution (how the first backlinks happen)

Order of durability. Rule: one action per week beats ten in launch week.

1. **Curated GitHub lists** (best links, do first): open PRs adding the site to
   `awesome-playwright` (mcholl85/awesome-playwright), plus JavaScript learning
   lists (`micromata/awesome-javascript-learning`, `sorrycc/awesome-javascript`).
   Follow each repo's CONTRIBUTING format; one-line description, no marketing tone.
2. **dev.to / Hashnode series** (a canonical backlink per article + own search
   presence): one concept per article with the lesson's visualization as images.
   Seed titles: "How I finally understood closures (by drawing them)",
   "The event loop, animated", "== vs === explained to a beginner",
   "From zero JavaScript to my first Playwright test". Link the matching lesson.
3. **LinkedIn** (already in the footer): one post per phase — 30–60s screen
   recording of its best visualization + one insight + lesson link.
4. **Communities** (read each one's self-promotion rules first; share as a free
   resource, participate before posting): r/learnjavascript, r/QualityAssurance,
   r/softwaretesting, Ministry of Testing club, freeCodeCamp forum.
5. **Show HN**: once the rebrand + prerender are live — title like
   "Show HN: A visual JavaScript course that ends at Playwright, free". Be present
   in the comments that day.

## First-month checklist
- [ ] Week 0: domain + Vercel + GSC + Bing + request indexing (Part 1 complete)
- [ ] Week 1: two awesome-list PRs
- [ ] Week 2: first dev.to article + LinkedIn post (Phase 0/1 visuals)
- [ ] Week 3: one community share (pick ONE subreddit, follow its rules)
- [ ] Week 4: Show HN + check GSC Pages report; re-request flagships if needed
