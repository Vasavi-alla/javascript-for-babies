import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 9.7 — fetch without a browser
 * 6.7's envelope now leaves a terminal: pure data conversations. status
 * codes, the two-await dance (6.8), 8.4's operators on optional fields —
 * named as API TESTING. Pyramid placement flagged for 10.2; Playwright's
 * request fixture flagged for Phase 11.
 */

const CODE = `// users.js — no HTML, no page, just Node
const res = await fetch("https://api.shop.com/users/7");

console.log(res.status);

const user = await res.json();
console.log(user.name);
console.log(user.pet?.name ?? "no pet");

// $ node users.js
// 200
// Ada
// no pet`

interface View {
  envelopeAt: 'terminal' | 'travelling' | 'server' | 'returning' | 'arrived' | null
  statusStamp?: string | null
  payload?: string | null
  parsed?: boolean
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    envelopeAt: 'terminal', console: [],
    note: '6.7’s fetch exists in Node too (built in since Node 18) — the envelope now leaves a TERMINAL',
  },
  {
    envelopeAt: 'travelling', console: [],
    note: 'no page anywhere: this is a pure DATA conversation — your script asks a server, JSON comes back',
  },
  {
    envelopeAt: 'returning', statusStamp: '200', console: ['200'],
    note: 'the reply comes stamped: res.status — 6.7’s family unchanged: 2xx good, 4xx your side, 5xx theirs',
  },
  {
    envelopeAt: 'arrived', statusStamp: '200', payload: '{ "name": "Ada" }', parsed: true, console: ['200'],
    note: 'await res.json() — 6.8’s two-await dance: envelope first, then unpack the body into a real object',
  },
  {
    envelopeAt: 'arrived', statusStamp: '200', payload: '{ "name": "Ada" }', parsed: true, console: ['200', 'Ada', 'no pet'],
    note: 'optional fields, read safely: ?. guards the hop, ?? supplies the honest default (8.4)',
  },
  {
    envelopeAt: 'arrived', statusStamp: '200', payload: '{ "name": "Ada" }', parsed: true, console: ['200', 'Ada', 'no pet'],
    note: 'name the discipline: API TESTING — asserting on status codes and JSON shapes, no UI involved',
    badge: 'faster than browser tests, immune to CSS changes — a huge slice of professional automation is exactly this',
  },
  {
    envelopeAt: 'arrived', statusStamp: '200', payload: '{ "name": "Ada" }', parsed: true, console: ['200', 'Ada', 'no pet'],
    note: 'file away: the testing pyramid (10.2) places API checks UNDER browser tests — more, cheaper, faster',
    badge: 'a preview, not homework — the pyramid gets its own lesson next phase',
  },
  {
    envelopeAt: 'arrived', statusStamp: '200', payload: '{ "name": "Ada" }', parsed: true, console: ['200', 'Ada', 'no pet'],
    note: 'Phase 11 wraps this exact idea for tests: await request.get(…) then expect(res.status()) — same envelope, test costume',
  },
  {
    envelopeAt: 'arrived', statusStamp: '200', payload: '{ "name": "Ada" }', parsed: true, console: ['200', 'Ada', 'no pet'],
    note: 'the whole 6.x + 8.4 arsenal, aimed at a server — nothing new was needed today',
  },
]

function TerminalRoundTrip({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  const envelopeX =
    view.envelopeAt === 'terminal' ? 96
    : view.envelopeAt === 'travelling' ? 210
    : view.envelopeAt === 'server' ? 330
    : view.envelopeAt === 'returning' ? 210
    : 96
  const envelopeY = view.envelopeAt === 'returning' || view.envelopeAt === 'arrived' ? 148 : 92
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {/* terminal */}
      <RoughRect x={30} y={56} width={132} height={120} seed={2501} strokeWidth={2.2} stroke="var(--color-ink)" fill="color-mix(in srgb, var(--color-ink) 5%, transparent)" fillStyle="solid" />
      <text x={96} y={48} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-ink-soft)">your terminal</text>
      <text x={44} y={80} fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-marker-teal)">$ node users.js</text>

      {/* server */}
      <RoughRect x={288} y={56} width={122} height={120} seed={2502} strokeWidth={2.2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
      <text x={349} y={48} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-ink-soft)">api.shop.com</text>
      <text x={349} y={100} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-ink-soft)">the server</text>
      <text x={349} y={120} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink-soft)">/users/7</text>

      {/* the route */}
      <HandArrow from={{ x: 166, y: 92 }} to={{ x: 284, y: 92 }} curve={0.12} seed={2505} stroke="var(--color-ink-soft)" strokeWidth={1.6} />
      <HandArrow from={{ x: 284, y: 148 }} to={{ x: 166, y: 148 }} curve={0.12} seed={2506} stroke="var(--color-ink-soft)" strokeWidth={1.6} />

      {/* the envelope */}
      {view.envelopeAt && (
        <motion.g key={view.envelopeAt} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1, x: envelopeX - 96, y: envelopeY - 92 }} transition={{ type: 'spring', damping: 16 }}>
          <RoughRect x={72} y={78} width={48} height={30} seed={2510} strokeWidth={1.8} stroke="var(--color-marker-coral)" fill="color-mix(in srgb, var(--color-marker-coral) 10%, transparent)" fillStyle="solid" />
          <text x={96} y={98} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12}>✉️</text>
        </motion.g>
      )}
      {view.statusStamp && (
        <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 13 }}>
          <RoughRect x={196} y={168} width={50} height={26} seed={2511} strokeWidth={2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 12%, transparent)" fillStyle="solid" />
          <text x={221} y={186} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fontWeight={700} fill="var(--color-ink)">{view.statusStamp}</text>
        </motion.g>
      )}
      {view.payload && (
        <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <RoughRect x={40} y={196} width={200} height={34} seed={2512} strokeWidth={1.8} stroke={view.parsed ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={view.parsed ? 'color-mix(in srgb, var(--color-marker-teal) 8%, transparent)' : 'transparent'} fillStyle="solid" />
          <text x={140} y={217} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink)">
            {view.parsed ? 'user = { name: "Ada" }' : view.payload}
          </text>
          <text x={288} y={217} fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink-soft)">
            {view.parsed ? '← a real object (parsed)' : '← raw JSON text'}
          </text>
        </motion.g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={252} width={392} fontSize={9.5} seed={2520} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={292} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={12} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={314} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink-soft)">
          console: {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const API_CHECK_EXERCISE: CodeExerciseDef = {
  id: 'l97-first-api-check',
  title: 'your first API check',
  task: 'A fake server is provided (so the check is deterministic — no real network). Write the async function that performs a genuine API check: status first, then the parsed body, read safely.',
  steps: [
    <>
      Keep the provided <code>fakeFetch</code> exactly as is — it stands in for the real network.
    </>,
    <>
      Write an async function <code>checkUser()</code>: await the response, print its{' '}
      <code>status</code>, await the parsed body, print its <code>name</code>.
    </>,
    <>
      Also print the pet’s name with an honest fallback of <code>"no pet"</code> — the response
      has no pet field, and your check must not crash (8.4’s pair).
    </>,
    <>
      Call <code>checkUser()</code> at the end.
    </>,
  ],
  starter: `// the fake network — keep as is:
function fakeFetch(url) {
  return Promise.resolve({
    status: 200,
    json: () => Promise.resolve({ name: "Ada" }),
  });
}

// your API check below:
`,
  expectedOutput: ['200', 'Ada', 'no pet'],
  mustUse: [
    { test: /async\s+function\s+checkUser\s*\(|const\s+checkUser\s*=\s*async/, label: 'an async function named checkUser' },
    { test: /await\s+fakeFetch\s*\(/, label: 'the response is awaited from fakeFetch' },
    { test: /await\s+\w+\.json\s*\(\s*\)/, label: 'the body is awaited via .json() — the two-await dance' },
    { test: /\?\./, label: 'the pet lookup is guarded with ?.' },
    { test: /\?\?/, label: 'the fallback arrives via ??' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']Ada["']\s*\)/, label: 'no hard-coded name — read it from the parsed body' },
    { test: /console\.log\s*\(\s*200\s*\)|console\.log\s*\(\s*["']200["']\s*\)/, label: 'no hard-coded status — read it from the response' },
  ],
  modelAnswer: `// the fake network — keep as is:
function fakeFetch(url) {
  return Promise.resolve({
    status: 200,
    json: () => Promise.resolve({ name: "Ada" }),
  });
}

// your API check below:
async function checkUser() {
  const res = await fakeFetch("https://api.shop.com/users/7");
  console.log(res.status);

  const user = await res.json();
  console.log(user.name);
  console.log(user.pet?.name ?? "no pet");
}

checkUser();`,
}

export const lesson97: LessonDef = {
  id: '9.7',
  hook: (
    <>
      <p>
        In 6.7 an envelope left a browser tab. Today the same envelope leaves a{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          plain terminal — no page, no HTML, just a script having a data conversation with a
          server
        </HighlightMark>
        . JSON out, JSON in.
      </p>
      <p>
        This tiny shift has a job title hiding inside it: API testing. By the end of the lesson
        you’ll have written your first API check — every tool for it is already on your belt.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'same-fetch',
      caption:
        'The star is an old friend: fetch — 6.7’s envelope, round trip and all — is built into Node (since version 18). Line 2 works in a plain script with zero installs. The envelope simply leaves a terminal now instead of a browser tab.',
      highlightLines: [1, 2],
    },
    {
      id: 'pure-data',
      caption:
        'Pause on what’s MISSING: no page, no DOM, nothing to render. This is a pure data conversation — your script asks a server a question, and JSON comes back. The web without its costume: just 6.7’s network layer, isolated.',
      highlightLines: [2],
    },
    {
      id: 'status',
      caption:
        'The reply arrives stamped: res.status is 200 — “all good.” The whole 6.7 family applies unchanged: 2xx means success, 4xx means the mistake was on your side of the envelope, 5xx means the server itself failed.',
      highlightLines: [4],
    },
    {
      id: 'two-awaits',
      caption:
        'Line 6 is 6.8’s two-await dance, identical in Node: the first await got the ENVELOPE (status + headers, body still streaming); await res.json() unpacks and parses the body into a real JavaScript object. Envelope first, contents second — always two waits.',
      highlightLines: [2, 6],
    },
    {
      id: 'read-safely',
      caption:
        'And line 8 is 8.4 earning its keep on day one: this user has no pet field, so user.pet?.name ?? "no pet" reads the optional path without crashing and supplies an honest default. API responses are the natural habitat of optional fields — this pair is how professionals read them.',
      highlightLines: [7, 8],
    },
    {
      id: 'name-the-discipline',
      caption:
        'Now name what you just did: you asserted on a status code and a JSON shape, with no UI anywhere. That discipline is called API TESTING — 6.7 whispered the name once in passing; today it’s officially yours. A huge slice of professional automation, faster than browser tests and immune to every CSS change ever shipped.',
      highlightLines: [4, 7],
    },
    {
      id: 'pyramid-flag',
      caption:
        'File this away — a preview, not homework: the TESTING PYRAMID (lesson 10.2) will place API checks UNDER browser tests: you write MORE of them because they’re cheaper and faster, and fewer full-browser tests on top. Today you met the middle layer of your future test suites.',
      highlightLines: [2],
    },
    {
      id: 'playwright-request',
      caption:
        'And the Phase 11 hook: Playwright ships a built-in helper called request wrapping exactly this — await request.get(url), then expect(res.status()).toBe(200). (Playwright’s word for such helpers is “fixture” — Phase 11 explains why.) Same envelope, test-runner costume — when you meet it, it will already be yours.',
      highlightLines: [2, 4],
    },
    {
      id: 'roundup',
      caption:
        'Count your tools: async/await (6.6), fetch and status codes (6.7), the two-await dance (6.8), safe optional reads (8.4), a terminal to run it all from (9.2). Nothing new was needed — today just aimed your existing arsenal at a server. The exercise makes it official.',
      highlightLines: [2, 4, 6, 7, 8],
    },
  ],
  Viz: TerminalRoundTrip,
  underTheHood: (
    <>
      <p>
        Sending data works the same way, with options:{' '}
        <code>fetch(url, {'{ method: "POST", body: JSON.stringify(data) }'})</code>. 4.13’s
        stringify finally meets its purpose: objects travel as JSON text. GET reads, POST creates,
        PUT/PATCH update, DELETE removes — the HTTP verbs, worth recognizing on sight.
      </p>
      <p>
        One honesty note carried over from 6.7: fetch only rejects on <em>network</em> failure. A
        404 or 500 is a “successful” fetch with a bad status. That’s precisely why API checks
        assert on <code>res.status</code> explicitly, instead of trusting that “it didn’t throw.”
      </p>
      <p>
        The browser’s CORS wall (6.7’s bouncer) doesn’t apply here — CORS protects users inside
        browsers, and there’s no browser. Scripts can call any API they’re authorized for; the
        authorization usually travels as a header carrying a token from… <code>process.env</code>{' '}
        (9.4’s secrets, completing the circle).
      </p>
      <p>
        <strong>💼 On the job —</strong> API tests make superb <em>setup</em> for browser tests
        too. Create the user via the API in one second, then browser-test only the login screen.
        Phase 11 uses this trick constantly; often the difference between a 40-second test and a
        4-second one.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'res.status is 404. Whose side of the conversation made the mistake — yours or the server’s?',
      accept: ['yours', 'mine', 'my side', 'yours (the client)', 'the client', 'client'],
      placeholder: 'yours / the server’s…',
      why: '4xx = the request side (wrong URL, missing auth); 5xx = the server itself failed. 404 specifically: the thing you asked for isn’t there.',
    },
    {
      kind: 'type-output',
      question: 'How many awaits does reading a JSON response take, and why? Type the number.',
      accept: ['2', 'two', 'Two'],
      placeholder: 'a number…',
      why: 'Two — the first await gets the envelope (status + headers), the second (res.json()) unpacks and parses the still-streaming body. Envelope first, contents second.',
    },
    {
      kind: 'type-output',
      question: 'The response body has no pet field. What does user.pet?.name ?? "no pet" evaluate to?',
      accept: ['no pet', '"no pet"'],
      placeholder: 'the value…',
      why: '?. turns the missing path into undefined instead of a crash, and ?? catches exactly that undefined with the honest default — 8.4’s pair in its natural habitat.',
    },
  ],
  PlayExtra: () => <CodeExercise def={API_CHECK_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend what API testing is, using today’s script: what fetch does without a browser, why status and body take separate awaits, and why ?. and ?? show up in almost every check.',
    modelAnswer:
      'API testing is asserting on a server’s raw data conversation — status codes and JSON shapes — with no UI involved at all. Node has fetch built in, so a plain terminal script can send the same envelope a browser would: fetch(url) travels to the server and resolves to a response. Reading it takes two awaits, always: the first await hands you the envelope — status and headers — while the body may still be streaming; await res.json() then unpacks and parses that body into a real JavaScript object. The status is the first assertion: 2xx success, 4xx my side’s mistake, 5xx the server’s — and fetch doesn’t throw on bad statuses, so a real check must assert on res.status explicitly. Then the body gets read safely: API fields are optional by nature, so user.pet?.name ?? "no pet" guards the lookup — the ?. converts a missing path into undefined instead of a crash, and ?? supplies an honest default. That’s a complete API check, and it’s a huge slice of professional automation: faster than browser tests, immune to styling changes, and — as the testing pyramid will formalize next phase — you write more of these than full-browser tests precisely because they’re cheap.',
  },
  recap: [
    'fetch is built into Node — the 6.7 envelope leaves a terminal: a pure data conversation, JSON out and in. GET/POST/PUT/DELETE are the verbs; POST bodies travel via JSON.stringify.',
    'Two awaits, always: envelope (status/headers) → res.json() (parsed body). Assert res.status explicitly — fetch only rejects on network failure, never on 404/500.',
    'This discipline = API TESTING: cheap, fast, CSS-immune. The pyramid (10.2) stacks many of these under fewer browser tests; Playwright wraps it as the request fixture (Phase 11).',
  ],
}
