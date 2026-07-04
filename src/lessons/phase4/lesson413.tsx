import { motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 4.13 — JSON
 * The bridge out of the program entirely: an object in the heap (addresses,
 * arrows, engine internals) can't cross a network wire or land in a file —
 * only TEXT can. JSON.stringify flattens; JSON.parse rebuilds. Split out of
 * the old "Map, Set & JSON" lesson so this topic gets its own room to land.
 */

const CODE = `const order = { id: 7, items: ["mug", "pen"] };

const text = JSON.stringify(order);
console.log(text);

const back = JSON.parse(text);
console.log(back.items[1]);`

interface View {
  mode: 'why' | 'stringify' | 'parse'
  console: string[]
  note: string
}

const VIEWS: View[] = [
  { mode: 'why', console: [], note: 'order lives in the heap — addresses, arrows, engine internals' },
  { mode: 'why', console: [], note: 'a network wire or a file can carry none of that — only pure TEXT travels' },
  { mode: 'stringify', console: [], note: 'JSON.stringify(order) flattens the whole object into one string' },
  { mode: 'stringify', console: ['{"id":7,"items":["mug","pen"]}'], note: 'nested parts included: the array inside got flattened too, in one pass' },
  { mode: 'stringify', console: ['{"id":7,"items":["mug","pen"]}'], note: 'JSON’s dialect is strict: every key double-quoted, no functions, no undefined' },
  { mode: 'parse', console: ['{"id":7,"items":["mug","pen"]}'], note: 'JSON.parse(text) is the return trip: read the characters, build an object' },
  { mode: 'parse', console: ['{"id":7,"items":["mug","pen"]}', 'pen'], note: 'back.items[1] → "pen": fully usable data again — dot access, math, everything' },
  { mode: 'parse', console: ['{"id":7,"items":["mug","pen"]}', 'pen'], note: 'but it’s a BRAND-NEW object — fresh heap address (back === order would be false; 4.7 nods)' },
]

function JsonBridge({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  const showRibbon = view.mode !== 'why'
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      {/* object side */}
      <RoughRect x={30} y={56} width={140} height={80} seed={801} strokeWidth={2} fill="var(--color-sticky)" fillStyle="solid" />
      <text x={38} y={50} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
        {view.mode === 'parse' ? 'back — a NEW object' : 'order — an object in the heap'}
      </text>
      <text x={44} y={84} fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">id: 7</text>
      <text x={44} y={106} fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">items: ➝ ["mug","pen"]</text>

      {/* the ribbon */}
      {showRibbon && (
        <motion.g key={view.mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <RoughRect x={30} y={176} width={384} height={34} seed={802} strokeWidth={1.8} stroke="var(--color-pencil-blue)" />
          <text x={222} y={198} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">
            {'{"id":7,"items":["mug","pen"]}'}
          </text>
          <text x={38} y={170} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-pencil-blue)">
            pure text — every character just a character
          </text>
        </motion.g>
      )}

      {view.mode === 'stringify' && (
        <>
          <HandArrow from={{ x: 110, y: 140 }} to={{ x: 130, y: 172 }} curve={0.15} seed={803} stroke="var(--color-marker-teal)" strokeWidth={2.4} headLength={10} />
          <text x={250} y={130} fontFamily="var(--font-hand)" fontSize={13.5} fontWeight={700} fill="var(--color-marker-teal)">
            JSON.stringify — flatten ↓
          </text>
        </>
      )}
      {view.mode === 'parse' && (
        <>
          <HandArrow from={{ x: 130, y: 172 }} to={{ x: 110, y: 140 }} curve={-0.15} seed={804} stroke="var(--color-marker-coral)" strokeWidth={2.4} headLength={10} />
          <text x={250} y={130} fontFamily="var(--font-hand)" fontSize={13.5} fontWeight={700} fill="var(--color-marker-coral)">
            JSON.parse — rebuild ↑
          </text>
        </>
      )}

      <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={220} y={236} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fontWeight={700} fill="var(--color-marker-teal)">
        {view.note}
      </motion.text>

      <RoughRect x={40} y={252} width={360} height={38} seed={806} strokeWidth={1.5} />
      <text x={52} y={248} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">console</text>
      {view.console.length === 0 ? (
        <text x={220} y={276} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">(nothing printed yet)</text>
      ) : (
        <text x={58} y={276} fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">{view.console.slice(-2).join('   ·   ')}</text>
      )}
    </svg>
  )
}

const REPORT_EXERCISE: CodeExerciseDef = {
  id: 'l413-json-report',
  title: 'package the report',
  task: 'A test finished. Turn the RESULT — a plain object — into the JSON text a server expects, then read a value back out of it.',
  steps: [
    <>
      Start with <code>result</code> = <code>{'{ name: "login", passed: true, ms: 320 }'}</code>.
    </>,
    <>
      Turn it into JSON text with <code>JSON.stringify</code> and print the text.
    </>,
    <>
      Then <code>JSON.parse</code> that same text back into an object, and print just its{' '}
      <code>ms</code> field.
    </>,
  ],
  starter: '',
  expectedOutput: ['{"name":"login","passed":true,"ms":320}', '320'],
  mustUse: [
    { test: /JSON\.stringify\s*\(/, label: 'the object is turned into text with JSON.stringify' },
    { test: /JSON\.parse\s*\(/, label: 'the text is rebuilt into an object with JSON.parse' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']\{/, label: 'the JSON text must come from stringify, not be typed by hand' },
  ],
  modelAnswer: `const result = { name: "login", passed: true, ms: 320 };

const text = JSON.stringify(result);
console.log(text);

const rebuilt = JSON.parse(text);
console.log(rebuilt.ms);`,
}

export const lesson413: LessonDef = {
  id: '4.13',
  hook: (
    <>
      <p>
        Your objects have a hidden weakness. Everything you've built this phase — arrays, objects,
        the arrows connecting them — lives inside the engine's memory, in the heap (4.6). The
        moment your program needs to send data somewhere else — over a network, into a file — that
        picture breaks down completely.
      </p>
      <p>
        A network wire or a file can only carry one thing:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          text
        </HighlightMark>
        . <strong>JSON</strong> is the bridge — a way to flatten any object into text and rebuild
        it back. It's the format every API your future tests will talk to actually speaks.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'why-1',
      caption:
        'Your order object lives in the heap: an address, with an arrow pointing at its items array — engine internals, not something you can mail anywhere.',
      highlightLines: [1],
    },
    {
      id: 'why-2',
      caption:
        'A network wire or a file can carry none of that. They only carry TEXT — a plain sequence of characters, nothing else. Objects and text are two completely different worlds.',
      highlightLines: [1],
    },
    {
      id: 'stringify-call',
      caption:
        'JSON.stringify(order) builds the bridge: it walks the whole object and flattens it into one string. It LOOKS like code, but it is just characters now — no addresses, no arrows.',
      highlightLines: [3, 4],
    },
    {
      id: 'stringify-nested',
      caption:
        'Look closely at the result: the nested items array got flattened too, in the same pass. stringify walks everything reachable from the object, however deep.',
      highlightLines: [3, 4],
    },
    {
      id: 'dialect',
      caption:
        'Note the dialect: every key is in double quotes, and only objects, arrays, strings, numbers, booleans and null survive. Functions and undefined quietly vanish — there is no way to write them as text.',
      highlightLines: [3, 4],
    },
    {
      id: 'parse-call',
      caption:
        'JSON.parse(text) is the return trip: it reads the characters and builds a BRAND-NEW object out of them — new heap address, fresh arrows, all rebuilt from scratch.',
      highlightLines: [6, 7],
    },
    {
      id: 'parse-result',
      caption:
        'back.items[1] → "pen": fully usable data again. Dot access, math, everything works — it is ordinary data now, not text pretending to be data.',
      highlightLines: [6, 7],
    },
    {
      id: 'fresh-object',
      caption:
        'One catch worth remembering (4.7 nods): back is a NEW object, not the same one as order. back === order would be false — parse always reconstructs, it never hands back the original.',
      highlightLines: [6],
    },
  ],
  Viz: JsonBridge,
  underTheHood: (
    <>
      <p>
        JSON (JavaScript Object Notation) is a <em>stricter dialect</em> than JS literal syntax:
        keys must be double-quoted, strings double-quoted, and only objects, arrays, strings,
        numbers, booleans and <code>null</code> exist.
      </p>
      <p>
        <code>undefined</code>, functions and dates don't survive the trip (dates become plain
        strings) — which is exactly why the old <code>JSON.parse(JSON.stringify(x))</code>{' '}
        deep-copy trick from 4.7 is lossy.
      </p>
      <p>
        It stopped being "JavaScript's format" long ago: Python, Java, databases, and every REST
        API speak it. When lesson 9.7 has you <code>fetch</code> an API from a Node script and
        Phase 11 has you assert on API responses, the payload will be JSON text and{' '}
        <code>parse</code>/<code>stringify</code> will be the door in and out.
      </p>
      <p>
        <strong>Fun fact:</strong> this very notebook runs on it. Your streak, your finished
        lessons, your journal — one object, <code>JSON.stringify</code>-ed into your browser's
        localStorage after every change. Open DevTools → Application → Local Storage and you can
        read your own progress as JSON, right now.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type the exact string this prints (every character counts):',
      code: 'console.log(JSON.stringify({ a: 1 }));',
      accept: ['{"a":1}'],
      placeholder: 'type the console output…',
      why: 'JSON’s dialect: the key gets double quotes, no spaces are added — {"a":1}. If you typed {a:1}, that’s JS literal syntax, not JSON; the quoted key is the tell.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: "const o = JSON.parse('{\"n\":5}');\nconsole.log(o.n + 1);",
      accept: ['6'],
      placeholder: 'type the console output…',
      why: 'parse rebuilt a real object from the text, so o.n is the number 5 and o.n + 1 is 6. After parse, it’s ordinary data again — dot access, math, everything.',
    },
    {
      kind: 'type-output',
      question: 'JSON.parse(JSON.stringify(original)) — is the result === original? Type true or false.',
      accept: ['false'],
      placeholder: 'true / false…',
      why: 'False — parse always builds a BRAND-NEW object with a fresh heap address, even when the contents match exactly. Same shape, different object (4.7’s reference rules, still in force).',
    },
  ],
  PlayExtra: () => <CodeExercise def={REPORT_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend: why can’t you just send a JavaScript object over a network, what do JSON.stringify and JSON.parse actually do, and what gets lost along the way?',
    modelAnswer:
      'A JavaScript object lives in the engine’s heap as addresses and arrows — that’s meaningless outside the program, and a network wire or a file can only carry text. JSON.stringify walks an object (nested parts included) and flattens it into one string of text, following a strict dialect: double-quoted keys, and only objects, arrays, strings, numbers, booleans and null — functions and undefined just disappear. JSON.parse does the reverse: it reads that text and builds a brand-new object from scratch, with a fresh address — so parse(stringify(x)) looks identical to x but is never the same object. Together they’re the bridge: stringify to send or save, parse to receive or load — and it’s exactly what happens every time your future tests read an API response.',
  },
  recap: [
    'Objects live in the heap; only TEXT can cross a wire or land in a file. JSON is the bridge.',
    'JSON.stringify: object → strict text (double-quoted keys; no undefined/functions/dates survive).',
    'JSON.parse: text → brand-new object (fresh address, never === the original). The wire format of every API.',
  ],
}
