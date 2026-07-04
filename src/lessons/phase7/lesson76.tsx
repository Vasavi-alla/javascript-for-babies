import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 7.6 — Forms & user input
 * Reading a form's state (value, checked), the submit event's default page
 * reload and why preventDefault kills it, and the read → validate → act
 * order every real form follows. The #1 surface automation scripts touch.
 */

const CODE = `const form = document.querySelector("form");
const nameInput = document.querySelector("#name");
const subscribe = document.querySelector("#subscribe");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  if (name === "") {
    console.log("error: name is required");
    return;
  }

  console.log("submitting: " + name + ", subscribed: " + subscribe.checked);
});`

interface View {
  nameValue: string
  checked: boolean
  status: 'idle' | 'reload' | 'error' | 'success'
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without changing the form state */
  badge?: string
}

const VIEWS: View[] = [
  {
    nameValue: 'Vas', checked: false, status: 'idle', console: [],
    note: 'input.value reads the CURRENT text in the field — always a string',
  },
  {
    nameValue: 'Vas', checked: true, status: 'idle', console: [],
    note: 'checkbox.checked reads a boolean — true or false, never the strings "true"/"false"',
  },
  {
    nameValue: 'Vasa', checked: true, status: 'idle', console: ['typing… "Vasa"'],
    note: 'combine with 7.4’s input event: read .value INSIDE the listener to react on every keystroke',
  },
  {
    nameValue: 'Vasavi', checked: true, status: 'reload', console: ['typing… "Vasa"'],
    note: 'clicking submit fires the form’s "submit" event — and by DEFAULT the browser RELOADS the page to send the data',
  },
  {
    nameValue: 'Vasavi', checked: true, status: 'idle', console: ['typing… "Vasa"'],
    note: 'event.preventDefault() on submit stops that reload — now YOUR code decides what happens next',
  },
  {
    nameValue: '', checked: true, status: 'error', console: ['typing… "Vasa"', 'error: name is required'],
    note: 'read + check BEFORE doing anything real: an empty required field stops right here',
  },
  {
    nameValue: '', checked: true, status: 'error', console: ['typing… "Vasa"', 'error: name is required'],
    note: 'real forms check MANY things, the same way',
    badge: 'length, format, matching passwords — every rule is just another guard, checked in order',
  },
  {
    nameValue: 'Vasavi', checked: true, status: 'success', console: ['typing… "Vasa"', 'submitting: Vasavi, subscribed: true'],
    note: 'only once EVERY check passes does the real work run',
  },
  {
    nameValue: 'Vasavi', checked: true, status: 'success', console: ['typing… "Vasa"', 'submitting: Vasavi, subscribed: true'],
    note: 'and this is exactly what automation drives',
    badge: 'Playwright’s fill()/check()/selectOption() set .value/.checked and fire the SAME events your listeners already handle',
  },
]

function FormPanel({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  const statusColor = view.status === 'error' ? 'var(--color-marker-coral)' : view.status === 'success' ? 'var(--color-marker-teal)' : view.status === 'reload' ? 'var(--color-marker-yellow)' : 'var(--color-ink-soft)'
  return (
    <svg viewBox="0 0 440 316" className="w-full">
      <text x={24} y={24} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
        the form, live
      </text>

      <text x={30} y={52} fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">#name (text input)</text>
      <RoughRect x={30} y={58} width={220} height={30} seed={1181} strokeWidth={1.8} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
      <AnimatePresence mode="wait">
        <motion.text key={view.nameValue} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={40} y={78} fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">
          {view.nameValue || '(empty)'}
        </motion.text>
      </AnimatePresence>

      <text x={30} y={110} fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">#subscribe (checkbox)</text>
      <RoughRect x={30} y={116} width={26} height={26} seed={1182} strokeWidth={1.8} fill={view.checked ? 'var(--color-marker-teal)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
      {view.checked && <text x={43} y={135} textAnchor="middle" fontSize={16} fontWeight={700} fill="#fff">✓</text>}
      <text x={64} y={134} fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">checked: {String(view.checked)}</text>

      <AnimatePresence mode="wait">
        <motion.g key={view.status}>
          <RoughRect x={30} y={160} width={380} height={34} seed={1183} strokeWidth={2} stroke={statusColor} fill={`color-mix(in srgb, ${statusColor} 10%, transparent)`} fillStyle="solid" />
          <text x={220} y={181} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill={statusColor}>
            {view.status === 'idle' ? 'waiting…' : view.status === 'reload' ? '⟳ default: page would RELOAD' : view.status === 'error' ? '✗ blocked by validation' : '✓ submitted'}
          </text>
        </motion.g>
      </AnimatePresence>

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={217} width={380} fontSize={9.5} seed={1184} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={250} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={426} fontSize={12} /></motion.text>
      </AnimatePresence>

      <RoughRect x={30} y={264} width={380} height={40} seed={1185} strokeWidth={1.5} />
      <text x={42} y={260} fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">console</text>
      <text x={42} y={280} fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">
        {view.console[0] ?? '(nothing yet)'}
      </text>
      <text x={42} y={296} fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">
        {view.console[1] ?? ''}
      </text>
    </svg>
  )
}

const SUBMIT_EXERCISE: CodeExerciseDef = {
  id: 'l76-submit',
  title: 'the read → validate → act flow',
  task: 'Model a form submit handler as a plain function — no real DOM needed to feel the shape every form follows.',
  steps: [
    <>
      A function <code>trySubmit(formState)</code>, where <code>formState</code> looks like{' '}
      <code>{'{ name: "  ", subscribed: true }'}</code>.
    </>,
    <>
      Inside: trim the name. If it’s empty, RETURN the string{' '}
      <code>"error: name is required"</code> immediately.
    </>,
    <>
      Otherwise, return <code>{'"submitting: " + name + ", subscribed: " + subscribed'}</code>.
      Call it once with an all-space name (print the result), then once with{' '}
      <code>"Vasavi"</code> and <code>subscribed: false</code> (print that result too).
    </>,
  ],
  starter: '',
  expectedOutput: ['error: name is required', 'submitting: Vasavi, subscribed: false'],
  mustUse: [
    { test: /function\s+trySubmit\s*\(\s*formState\s*\)/, label: 'one function, trySubmit(formState)' },
    { test: /\.trim\s*\(\s*\)/, label: 'the name is trimmed before checking' },
    { test: /return\s*["']error: name is required["']/, label: 'the empty case returns the error string, before any real work' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']error: name is required["']\s*\)/, label: 'the error must come from trySubmit’s return, not a direct print' },
  ],
  modelAnswer: `function trySubmit(formState) {
  const name = formState.name.trim();
  if (name === "") {
    return "error: name is required";
  }
  return "submitting: " + name + ", subscribed: " + formState.subscribed;
}

console.log(trySubmit({ name: "   ", subscribed: true }));
console.log(trySubmit({ name: "Vasavi", subscribed: false }));`,
}

export const lesson76: LessonDef = {
  id: '7.6',
  hook: (
    <>
      <p>
        You've wired listeners (7.4) and mastered delegation (7.5). Today's target is the{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          #1 thing every automation script touches
        </HighlightMark>
        : forms — reading what a human typed, checking it's actually usable, and deciding what
        happens next.
      </p>
      <p>
        One habit runs through the whole lesson: READ the field, VALIDATE it, then ACT — never
        skip a step, and never act on data you haven't checked.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'read-value',
      caption:
        'nameInput.value reads whatever text currently sits in the field — always a plain string, even if the input type is "number".',
      highlightLines: [2],
    },
    {
      id: 'read-checked',
      caption:
        'subscribe.checked reads a genuine BOOLEAN — true or false — not the strings "true"/"false". Checkboxes and text inputs hand you different shapes; read the right one.',
      highlightLines: [3],
    },
    {
      id: 'live-reading',
      caption:
        'Combine this with 7.4’s input event: read .value INSIDE that listener and you react to every keystroke — live character counts, instant search, autosave, all just this.',
      highlightLines: [1, 2],
    },
    {
      id: 'submit-default',
      caption:
        'Clicking submit (or pressing Enter in a field) fires the form’s "submit" event. By DEFAULT, the browser then reloads the page to send the data over HTTP — exactly like the oldest websites ever built.',
      highlightLines: [5],
    },
    {
      id: 'preventdefault-submit',
      caption:
        'event.preventDefault() on that submit event stops the reload cold (7.5’s tool, doing its most common job). Now your JavaScript decides what happens next instead of a full page refresh.',
      highlightLines: [6],
    },
    {
      id: 'validate-empty',
      caption:
        'Before any real work: read, then CHECK. name.trim() === "" stops everything right here with an error — garbage never reaches the "real" logic below.',
      highlightLines: [8, 9, 10, 11],
    },
    {
      id: 'validate-multiple',
      caption:
        'Real forms repeat this same guard for every rule that matters — a minimum length, an email shape, two passwords that must match. One check, one early return, per rule.',
      highlightLines: [8, 9, 10, 11],
    },
    {
      id: 'validation-payoff',
      caption:
        'Only once EVERY guard has passed does the real work finally run — here, just a log; in a real app, a fetch (6.7) carrying the now-trusted data to a server.',
      highlightLines: [14],
    },
    {
      id: 'automation-tie-in',
      caption:
        'And this is exactly the surface automation drives: Playwright’s fill() sets .value and fires input events; check() flips .checked; selectOption() picks from a dropdown. No special robot magic — the same mechanism a human’s hands would trigger.',
      highlightLines: [1, 2, 3],
    },
  ],
  Viz: FormPanel,
  underTheHood: (
    <>
      <p>
        The browser has its OWN built-in validation too — attributes like <code>required</code>,{' '}
        <code>type="email"</code>, <code>minlength</code> block a submit before your JS even
        runs, and <code>input.checkValidity()</code> asks it directly.
      </p>
      <p>
        Real apps almost always <em>also</em> validate in JS, for custom error messages and
        cross-field rules the browser can't express (like matching passwords).
      </p>
      <p>
        Precision worth remembering: <code>value</code> is ALWAYS a string, even for{' '}
        <code>{'<input type="number">'}</code>. Need to compute with it? Read{' '}
        <code>input.valueAsNumber</code>, or convert yourself with <code>Number(input.value)</code>{' '}
        — a forgotten conversion is a classic silent bug (string concatenation instead of
        addition).
      </p>
      <p>
        Job note: every one of Playwright's form actions — <code>fill</code>, <code>check</code>,{' '}
        <code>uncheck</code>, <code>selectOption</code> — is just setting the property and
        dispatching the event you read today. There is nothing more exotic underneath; that's why
        this lesson transfers directly.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'A number input holds "42". Type the JavaScript TYPE that input.value always is, regardless of what was typed:',
      accept: ['string', 'a string', 'String'],
      placeholder: 'one word…',
      why: 'value is always a string — "42", not 42. Read valueAsNumber or convert with Number() before doing math with it.',
    },
    {
      kind: 'type-output',
      question: 'Does a form’s DEFAULT submit behavior reload the page? Type yes or no.',
      accept: ['yes', 'Yes', 'YES'],
      placeholder: 'yes / no…',
      why: 'Yes — unless preventDefault() is called on the submit event, the browser sends the form over HTTP and reloads. That’s why preventDefault is nearly the first line in every JS form handler.',
    },
    {
      kind: 'type-output',
      question: 'checkbox.checked is true. Type exactly what console.log(subscribe.checked) prints:',
      accept: ['true', 'True'],
      placeholder: 'the value…',
      why: 'true — a real boolean, not the string "true". Comparing it with === "true" is a classic beginner bug that always fails.',
    },
  ],
  PlayExtra: () => <CodeExercise def={SUBMIT_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend the whole path from a human typing in a form to your code deciding what to do: reading value/checked, why preventDefault matters on submit, and where validation fits in that order.',
    modelAnswer:
      'A text field’s current text lives in input.value, always as a string; a checkbox’s state lives in checkbox.checked, always as a real boolean — reading the wrong shape (like comparing checked to the string "true") is a classic bug. Clicking submit fires the form’s "submit" event, and by default the browser reloads the page to send the data over HTTP — so nearly every JS-powered form calls event.preventDefault() first, handing control to your code instead. From there the order matters: READ the fields, VALIDATE them (an empty required field, a bad format — each check is an early return, same guard pattern as error handling elsewhere), and only once everything passes does the real ACT step run — updating the page, or sending a fetch. Automation tools like Playwright drive this exact same mechanism: fill(), check(), and selectOption() just set these same properties and fire these same events, so nothing about testing a form is special.',
  },
  recap: [
    'input.value is always a string; checkbox.checked is always a boolean — read the shape the control actually gives you.',
    'Submit’s default is a page reload; preventDefault() is the near-universal first line inside a JS form handler.',
    'READ → VALIDATE (a guard per rule) → ACT, in that order. Playwright’s fill/check/selectOption drive this exact mechanism — nothing special for automation.',
  ],
}
