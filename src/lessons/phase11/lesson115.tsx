import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 11.5 — Actions
 * Every action = real trusted input events (not JS fakery), preceded by the
 * actionability checklist: attached → visible → stable → enabled, retried
 * until ticked or timeout. 7.8's exists-vs-visible gap, solved in the API.
 * fill/click/press/selectOption/check/hover toured with their semantics.
 */

const CODE = `await page.getByLabel("Email").fill("ada@shop.com");
await page.getByRole("button", { name: "Log in" })
  .click();
await page.getByLabel("Qty").press("ArrowUp");
await page.getByLabel("Size").selectOption("L");
await page.getByLabel("Accept terms").check();
await page.getByText("Menu").hover();

// before EVERY action, the checklist:
//   attached?  (in the DOM — 7.1)
//   visible?   (rendered — 7.8)
//   stable?    (not mid-animation)
//   enabled?   (not disabled)
// …retried until all tick, or timeout`

interface View {
  mode: 'events' | 'checklist' | 'tour'
  checks?: Array<{ label: string; state: 'pending' | 'pass' | 'fail' }>
  clicked?: boolean
  tourHot?: number | null
  console: string[]
  note: string
  badge?: string
}

const CHECKS_ALL = (upTo: number, failAt = -1) =>
  ['attached (in the DOM — 7.1)', 'visible (rendered — 7.8)', 'stable (not animating)', 'enabled (not disabled)'].map((label, i) => ({
    label,
    state: i === failAt ? ('fail' as const) : i < upTo ? ('pass' as const) : ('pending' as const),
  }))

const VIEWS: View[] = [
  {
    mode: 'events', console: [],
    note: 'an action = a command across 11.1’s bridge that becomes REAL input events in the browser — not JavaScript fakery',
  },
  {
    mode: 'events', console: [],
    note: 'a Playwright click is a trusted click: hit-testing, hover, focus, mousedown, mouseup — everything a mouse does (7.4, sender’s side)',
    badge: 'el.click() in JS skips all of that. If the app treats real users differently, Playwright sides with the users.',
  },
  {
    mode: 'tour', tourHot: 0, console: [],
    note: 'fill: focus the field, clear it, set the value, fire the input events (7.6) — the “type the whole thing” verb',
  },
  {
    mode: 'tour', tourHot: 1, console: [],
    note: 'press: single keys and chords — "Enter", "ArrowUp", "Control+a" — 7.4’s keyboard events, from the sending side',
  },
  {
    mode: 'tour', tourHot: 2, console: [],
    note: 'the form specials: selectOption for dropdowns, check/uncheck for boxes (idempotent: check when already checked = fine) — 7.6, driven',
  },
  {
    mode: 'tour', tourHot: 3, console: [],
    note: 'hover for menus that open on pointer-over; dragTo for the rare drag-and-drop. The verbs map one-to-one to user intentions',
  },
  {
    mode: 'checklist', checks: CHECKS_ALL(0), console: [],
    note: 'now the deep part: before EVERY action, Playwright runs the ACTIONABILITY checklist on the resolved element',
  },
  {
    mode: 'checklist', checks: CHECKS_ALL(4), clicked: true, console: ['click performed'],
    note: 'attached → visible → stable → enabled — all four tick, THEN the real events fire. Re-checked until they tick, or timeout (11.3’s budget)',
  },
  {
    mode: 'checklist', checks: CHECKS_ALL(1, 1), console: ['TimeoutError: element is not visible'],
    note: 'a button that never becomes visible: the checklist retries, times out, and the error NAMES the failed check — 7.8’s vocabulary, in your report',
  },
  {
    mode: 'checklist', checks: CHECKS_ALL(4), clicked: true, console: [],
    note: 'this checklist IS 7.8’s exists-vs-visible gap, solved in the API: the robot refuses to click what a human couldn’t',
    badge: 'and it’s why you never write “wait for the page” by hand — the waiting is inside every action already (11.6 extends it to assertions)',
  },
]

const TOUR = ['fill("ada@shop.com")', 'press("Control+a")', 'selectOption("L") · check()', 'hover() · dragTo(…)']

function ActionChecklist({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'events' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            one .click() — what actually happens
          </text>
          {['hit-test the point', 'hover + focus', 'mousedown', 'mouseup → click event'].map((ev, i) => (
            <g key={ev}>
              <RoughRect x={60} y={44 + i * 44} width={320} height={34} seed={4401 + i} strokeWidth={1.8} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 6%, transparent)" fillStyle="solid" />
              <text x={220} y={66 + i * 44} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">{i + 1}. {ev}</text>
            </g>
          ))}
        </g>
      )}

      {view.mode === 'tour' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the verb family
          </text>
          {TOUR.map((verb, i) => {
            const hot = view.tourHot === i
            return (
              <g key={verb} opacity={hot ? 1 : 0.35}>
                <RoughRect x={50} y={44 + i * 48} width={340} height={38} seed={4410 + i} strokeWidth={hot ? 2.4 : 1.5} stroke={hot ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={hot ? 'color-mix(in srgb, var(--color-marker-teal) 8%, transparent)' : 'transparent'} fillStyle="solid" />
                <text x={70} y={68 + i * 48} fontFamily="var(--font-code)" fontSize={10} fill="var(--color-ink)">{verb}</text>
              </g>
            )
          })}
        </g>
      )}

      {view.mode === 'checklist' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the actionability checklist — before the click lands
          </text>
          {(view.checks ?? []).map((check, i) => (
            <g key={check.label}>
              <RoughRect x={50} y={40 + i * 40} width={280} height={32} seed={4420 + i} strokeWidth={check.state === 'pending' ? 1.3 : 2} stroke={check.state === 'fail' ? 'var(--color-marker-coral)' : check.state === 'pass' ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={check.state === 'pending' ? 'transparent' : `color-mix(in srgb, ${check.state === 'fail' ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'} 8%, transparent)`} fillStyle="solid" />
              <text x={66} y={60 + i * 40} fontFamily="var(--font-hand)" fontSize={10} fontWeight={700} fill="var(--color-ink)">
                {check.state === 'pass' ? '☑' : check.state === 'fail' ? '☒' : '☐'} {check.label}
              </text>
            </g>
          ))}
          {view.clicked && (
            <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 13 }}>
              <RoughRect x={344} y={90} width={76} height={40} seed={4430} strokeWidth={2.4} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 12%, transparent)" fillStyle="solid" />
              <text x={382} y={115} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fontWeight={700} fill="var(--color-ink)">CLICK ✓</text>
            </motion.g>
          )}
        </g>
      )}

      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={248} width={392} fontSize={9.5} seed={4440} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={292} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={11.5} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={314} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink-soft)">
          {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const ACTIONABILITY_EXERCISE: CodeExerciseDef = {
  id: 'l115-actionability-gate',
  title: 'build the actionability gate',
  task: 'Model the checklist that runs before every real click: given an element’s state, either clear it for action or name EXACTLY which check blocked it — the same name the real TimeoutError would carry.',
  steps: [
    <>
      Write <code>canAct(el)</code>: check <code>attached</code>, <code>visible</code>,{' '}
      <code>stable</code>, <code>enabled</code> IN THAT ORDER; return the FIRST failing check’s
      name, or <code>"actionable"</code> when all four hold (early returns keep it clean).
    </>,
    <>
      Write <code>click(el)</code>: consult the gate — print <code>click performed</code> when
      actionable, otherwise <code>blocked: NAME</code>.
    </>,
    <>
      Run it on a ready button (<code>{'{ attached: true, visible: true, stable: true, enabled: true }'}</code>),
      then on a hidden one (same but <code>visible: false</code>), then on a disabled one
      (visible but <code>enabled: false</code>).
    </>,
  ],
  starter: '',
  expectedOutput: ['click performed', 'blocked: visible', 'blocked: enabled'],
  mustUse: [
    { test: /function\s+canAct\s*\(|const\s+canAct\s*=/, label: 'a gate function named canAct' },
    { test: /return\s*["']attached["']|return\s*["']visible["']/, label: 'the gate returns the FIRST failing check’s name' },
    { test: /function\s+click\s*\(|const\s+click\s*=/, label: 'a click that consults the gate' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']blocked: visible["']\s*\)/, label: 'no hard-coded verdicts — the gate must decide' },
  ],
  modelAnswer: `function canAct(el) {
  if (!el.attached) return "attached";
  if (!el.visible) return "visible";
  if (!el.stable) return "stable";
  if (!el.enabled) return "enabled";
  return "actionable";
}

function click(el) {
  const verdict = canAct(el);
  if (verdict === "actionable") {
    console.log("click performed");
  } else {
    console.log("blocked: " + verdict);
  }
}

click({ attached: true, visible: true, stable: true, enabled: true });
click({ attached: true, visible: false, stable: true, enabled: true });
click({ attached: true, visible: true, stable: true, enabled: false });`,
}

export const lesson115: LessonDef = {
  id: '11.5',
  hook: (
    <>
      <p>
        Locators find; actions DO. And the deep fact about Playwright’s actions is what happens{' '}
        <em>before</em> each one:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          a four-point checklist — attached, visible, stable, enabled — retried until the element
          is genuinely ready for a human-grade interaction
        </HighlightMark>
        . 7.8 taught you why that gap exists; today you watch the tool close it.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'actions-are-commands',
      caption:
        'Each action line is one command across 11.1’s bridge — and on the browser side it becomes REAL input events, not JavaScript fakery. A Playwright click is a trusted click: the same event sequence a physical mouse produces.',
      highlightLines: [2, 3],
    },
    {
      id: 'trusted-events',
      caption:
        'Spell that out (7.4, now from the sender’s side): hit-test the point, hover, focus, mousedown, mouseup, click — the full ritual. A JS el.click() skips most of it. If an app behaves differently for real users than for synthetic events, Playwright sides with the users — which is the whole point of E2E.',
      highlightLines: [3],
    },
    {
      id: 'fill',
      caption:
        'The verb tour, semantics included. fill: focus the field, CLEAR it, set the value, fire the input events (7.6’s machinery notified properly). It’s “make the field say this,” not “append keystrokes.” (For literal key-by-key typing — rare, for autocomplete widgets — pressSequentially exists.)',
      highlightLines: [1],
    },
    {
      id: 'press',
      caption:
        'press: the keyboard — single keys ("Enter", "ArrowUp") and chords ("Control+a"). 7.4’s keydown events, dispatched for real. Form submission via Enter, keyboard navigation, shortcuts: all testable exactly as users perform them.',
      highlightLines: [4],
    },
    {
      id: 'form-specials',
      caption:
        'The form specials (7.6, driven): selectOption("L") for dropdowns — by value, label, or index; check()/uncheck() for checkboxes — idempotent verbs: check() on an already-checked box is fine, it asserts the END STATE you want rather than blindly toggling.',
      highlightLines: [5, 6],
    },
    {
      id: 'hover-drag',
      caption:
        'And the rarer verbs: hover() for menus that open on pointer-over (a real hover — CSS :hover fires); dragTo() for drag-and-drop. Notice the pattern across all of them: each verb maps one-to-one to a USER intention, never to a DOM operation.',
      highlightLines: [7],
    },
    {
      id: 'the-checklist',
      caption:
        'Now the deep machinery. Before EVERY action, Playwright runs the ACTIONABILITY checklist on the freshly-resolved element (11.4’s freshness). Four questions, in order — and the action fires only when all four say yes.',
      highlightLines: [9, 10, 11, 12, 13],
    },
    {
      id: 'four-checks',
      caption:
        'The four, each an old friend: ATTACHED — in the DOM at all (7.1). VISIBLE — actually rendered (7.8’s render tree: no display:none ghost-clicking). STABLE — not mid-animation (a button sliding in gets clicked where it IS, not where it was). ENABLED — not disabled. All tick → the real events fire.',
      highlightLines: [10, 11, 12, 13],
    },
    {
      id: 'failure-mode',
      caption:
        'And when the checks never all tick? The action retries the checklist until 11.3’s timeout, then fails with an error that NAMES the failed check: “element is not visible.” Read those errors literally — they speak 7.8’s vocabulary, and they’re telling you which gap the human would have hit too.',
      highlightLines: [14],
    },
    {
      id: 'the-payoff',
      caption:
        'Step back and name what this is: 7.8’s exists-vs-visible gap — the one that lesson promised “auto-waiting” would solve — closed, inside every single action. This is why you never write “wait for the page to be ready” by hand. The waiting lives inside the verbs. 11.6 extends the same patience to assertions.',
      highlightLines: [9, 14],
    },
  ],
  Viz: ActionChecklist,
  underTheHood: (
    <>
      <p>
        The checklist is per-action-appropriate: <code>click</code> additionally checks the
        element isn’t covered by something else (it must actually{' '}
        <strong>receive events</strong> at the click point — a cookie banner on top blocks it,
        exactly as it blocks a human); <code>fill</code> checks the target is editable. The four
        you learned are the core; the variations all serve the same principle.
      </p>
      <p>
        Escape hatches exist and are honestly labeled: <code>click({'{ force: true }'})</code>{' '}
        skips the checks, and <code>dispatchEvent</code> fires synthetic events. Treat both as
        confessions — “my test clicks something a user couldn’t” — occasionally right (a
        deliberately hidden but functional control), usually a locator or app bug wearing a
        workaround.
      </p>
      <p>
        Timing precision: the checklist runs against the element the locator resolves{' '}
        <em>at action time</em>, and re-resolves during retries — so even if the page re-renders
        and the node is replaced (frameworks do this constantly), the action follows the
        DESCRIPTION, not a dead reference. 11.4’s locator-not-element design pays exactly here.
      </p>
      <p>
        Job note: “element is not stable” failures usually mean CSS animations — real suites
        often disable animations globally for tests (a config/use option) both for speed and
        stability. And “not visible” with a correct locator often means you found a SECOND,
        hidden copy of the element (mobile + desktop nav rendering twice) — strict mode’s cousin;
        narrow the locator’s scope (11.4’s chaining).
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Name the four actionability checks, in order.',
      accept: ['attached, visible, stable, enabled', 'attached visible stable enabled', 'attached, visible, stable, and enabled', 'attached,visible,stable,enabled'],
      placeholder: 'check, check, check, check…',
      why: 'Attached (in the DOM — 7.1) → visible (rendered — 7.8) → stable (not animating) → enabled (not disabled). Retried until all tick or timeout; only then do real events fire.',
    },
    {
      kind: 'type-output',
      question: 'A button exists in the DOM but has display:none. Does .click() eventually click it, or time out? ',
      accept: ['time out', 'times out', 'timeout', 'it times out', 'timeouterror'],
      placeholder: 'click / time out…',
      why: 'Times out — display:none removes it from the render tree (7.8), so the VISIBLE check never passes. The error names it: “element is not visible.” A human couldn’t click it either.',
    },
    {
      kind: 'type-output',
      question: 'You want the field to contain exactly "mug" regardless of what was there before. Which verb — fill or press?',
      accept: ['fill', 'Fill', 'fill()', '.fill()'],
      placeholder: 'the verb…',
      why: 'fill — focus, CLEAR, set value, fire input events: “make the field say this.” press sends individual keys; pressSequentially types key-by-key for autocomplete-style widgets.',
    },
  ],
  PlayExtra: () => <CodeExercise def={ACTIONABILITY_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend what happens between “await button.click()” and the click landing: the bridge, the trusted events, the four-point checklist (with each check’s Phase-7 root), and what the error says when a check never passes.',
    modelAnswer:
      'The line sends one command across the bridge from my Node test to the real browser. Before any events fire, Playwright re-resolves the locator fresh — it’s a description, not a stale reference — and runs the actionability checklist on the element, four checks in order, each one an old lesson: attached means it’s in the DOM at all (the live tree from 7.1); visible means it’s actually rendered — not display:none, which 7.8 taught removes it from the render tree; stable means it’s not mid-animation, so the click lands where the button IS; enabled means it isn’t disabled. The checklist retries patiently until all four tick or the timeout budget from the config expires. Only then do the REAL input events fire — hit-testing, hover, focus, mousedown, mouseup — a trusted click identical to a physical mouse, not a JavaScript el.click() simulation, so the app can’t tell it from a user. If a check never passes, the action fails with an error that names it — “element is not visible” — which is the tool telling you a human couldn’t have clicked it either. That’s why you never hand-write “wait for the page”: the waiting lives inside every verb.',
  },
  recap: [
    'Actions = bridge commands that become REAL trusted input events (full mouse/keyboard rituals — 7.4 from the sender’s side). Verbs map to user intentions: fill (clear+set), press, selectOption, check (idempotent), hover, dragTo.',
    'Before EVERY action: the actionability checklist — attached (7.1) → visible (7.8) → stable → enabled — retried on the freshly-resolved element until all tick or timeout.',
    'Failures NAME the check (“element is not visible” = 7.8’s vocabulary). force: true skips checks — treat as a confession. The waiting lives inside the verbs; 11.6 gives assertions the same patience.',
  ],
}
