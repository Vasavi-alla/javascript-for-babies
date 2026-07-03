# 03 — Design System: "Warm Sketchbook"

The app feels like the notebook of a brilliant, friendly teacher: cream paper, confident ink lines, highlighter swipes, sticky notes, and diagrams that look drawn by hand — but every wobbly line is deliberate and every animation is precise. **Cozy surface, rigorous machinery.**

## Palette (CSS custom properties in `styles/tokens.css`)
| Token | Hex | Use |
|---|---|---|
| `--paper` | `#FBF5E9` | App background (with subtle paper-grain texture overlay) |
| `--paper-raised` | `#FFFDF6` | Cards, panels |
| `--paper-shade` | `#F1E8D7` | Recessed areas, code pane background |
| `--ink` | `#2B2925` | Text, drawn lines (never pure black) |
| `--ink-soft` | `#6B6459` | Secondary text, gridlines |
| `--marker-yellow` | `#FFD95E` | Highlighter: the *current* thing (active line, active memory slot) |
| `--marker-coral` | `#FF6B57` | Warnings, errors, mutations, "gotcha!" moments |
| `--marker-teal` | `#2FA98C` | Success, returned values, passed assertions |
| `--marker-blue-pencil` | `#5B8DB8` | References/pointers (arrows into the heap) — pencil blue, not UI blue |
| `--sticky` | `#FFF3B8` | Sticky notes (console output, side notes) |
| `--sticky-pink` | `#FFD9D2` | Prediction prompts |

Semantic rule of thumb: **yellow = attention, coral = danger/mutation, teal = success/output, blue-pencil = references.** Consistent across every visualization so color itself teaches.

## Typography (@fontsource, self-hosted)
| Role | Font | Notes |
|---|---|---|
| Display / lesson titles / diagram labels | **Caveat** | Handwritten, energetic; 600 weight for titles |
| Body prose | **Nunito** | Rounded, warm, highly readable — body text must NOT be handwritten (fatigue) |
| Code | **JetBrains Mono** | Ligatures off (learners must see `=>` as two characters!) |

Body 17px/1.7 — this is a reading app. Diagram labels in Caveat 20px+ so hand-drawn text stays legible.

## The hand-drawn language (rough.js)
- All diagram shapes via rough.js: `roughness: 1.2`, `bowing: 1`, stroke `--ink` at 2px. **Fixed seed per shape instance** — wobble must not change between renders.
- Fills: rough.js `hachure` (diagonal pen strokes) in marker colors at ~40% opacity — like highlighter over ink.
- Arrows: hand-drawn curves with imperfect arrowheads (`HandArrow` component). Reference arrows always `--marker-blue-pencil`.
- Text annotations via rough-notation: `underline` for emphasis, `circle` for "look here", `crossed-off` for grayed-out paths/dead code.
- Paper texture: one tiled SVG noise/grain overlay at very low opacity on `--paper`. Optional faint dot-grid on visualization canvases (graph-paper corner of the notebook).

## Core components (build in M0, live in `src/design/`)
| Component | Description |
|---|---|
| `PaperCard` | Raised panel, rough-drawn border, slight random rotation (−0.4°..0.4°, seeded) |
| `StickyNote` | Sticky with a folded corner and soft shadow; variants: yellow (console), pink (predictions) |
| `RoughBox` / `RoughCircle` | rough.js primitives wrapped as React components (memoized, seeded) |
| `HandArrow` | Curved hand-drawn arrow between two anchor points; animates draw-on |
| `HighlightMark` | rough-notation wrapper for inline text emphasis |
| `InkButton` | Rough-bordered button; on press the border "re-inks" (redraws with a new seed — the one place wobble is allowed to change) |
| `Stepper` | Prev/next + dot progress; hand-drawn dots fill with ink |
| `CodePane` | Shiki-highlighted code on `--paper-shade`; current line gets a marker-yellow highlighter swipe (drawn left-to-right, 150ms) |
| `ConsolePane` | Output lines appear as small stacked sticky notes |
| `TapeLabel` | Washi-tape-style section headers |

## Motion principles (Framer Motion)
- **Step transitions: 400–600ms, ease-out.** Slow enough to follow, fast enough to not annoy on replay. Scrubbing backward uses the same tween reversed.
- **One moving thing at a time.** If a value moves into a slot AND a label attaches, sequence them (stagger 150ms). Simultaneous motion hides causality — and causality is the product.
- Values entering memory: drop in with a slight overshoot (spring, damping 15) — physical, like placing a token.
- Errors: quick shake + coral hachure flash. Successes: teal underline draws on.
- Draw-on effects (arrows, circles, underlines) animate `stroke-dashoffset` — like watching the pen.
- `prefers-reduced-motion`: all tweens become instant snaps; draw-ons appear complete.

## Voice & tone (the writing is part of the design)
- Warm, direct, second person: "You just created a variable. Here's what the machine did."
- Honest about simplifications: "This 'labeled box' picture is 90% true. In Phase 4 we'll upgrade it — because for objects, the box holds an *arrow*."
- Celebrates gotchas instead of hiding them: coral "Gotcha!" sticky notes for `0.1+0.2`, `typeof null`, array `sort`.
- Never "simply" / "just" / "obviously."

## Anti-goals
- No glassmorphism, no gradients-on-gradients, no neon, no dark-mode-first (a sketchbook is paper; dark mode can be a later "chalkboard" theme in M8 if wanted).
- No decorative animation that doesn't encode meaning. If it moves, it teaches.
