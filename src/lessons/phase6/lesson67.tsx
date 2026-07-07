import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'
import { JobScene, Scene, Takeaway, Key, ReviewCard } from '../../design/JobScene'

/**
 * 6.7 — fetch & APIs
 * The HTTP round-trip: request envelope out, response envelope back.
 * fetch returns a promise of the RESPONSE HEAD; the body needs a second
 * await (res.json()). Status codes; res.ok; the two-await pattern that
 * every API test you'll ever write is built on.
 */

const CODE = `async function loadPokemon() {
  const res = await fetch(
    "https://pokeapi.co/api/v2/pokemon/25"
  );

  console.log(res.status);
  console.log(res.ok);

  if (!res.ok) {
    throw new Error("HTTP " + res.status);
  }

  const data = await res.json();
  console.log(data.name);
}

loadPokemon();`

interface View {
  phase: 'request' | 'server' | 'response' | 'body' | 'codes'
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without changing the phase */
  badge?: string
}

const VIEWS: View[] = [
  { phase: 'request', console: [], note: 'fetch(url) mails a REQUEST envelope: method GET, the URL, headers' },
  {
    phase: 'request', console: [],
    note: 'it returns a pending promise IMMEDIATELY',
    badge: 'your function awaits it, parked on 6.6’s shelf — thread free',
  },
  { phase: 'server', console: [], note: 'the server — someone else’s program, on someone else’s machine — prepares an answer' },
  { phase: 'response', console: ['200', 'true'], note: 'first await: the RESPONSE HEAD arrives — status code + headers. Not the body yet!' },
  {
    phase: 'response', console: ['200', 'true'],
    note: 'a 404 response is still a RESPONSE',
    badge: 'fetch’s promise FULFILLS, always, for any delivered status — it rejects only when the network itself fails',
  },
  {
    phase: 'response', console: ['200', 'true'],
    note: 'the guard, always: if (!res.ok) throw',
    badge: 'skipping this and parsing an error page is the #1 rookie fetch bug',
  },
  { phase: 'body', console: ['200', 'true', 'pikachu'], note: 'second await: res.json() streams the body in and parses the JSON (4.13!) into an object' },
  { phase: 'codes', console: ['200', 'true', 'pikachu'], note: '2xx ok · 4xx your mistake · 5xx their mistake — res.ok is true only for 2xx' },
  {
    phase: 'codes', console: ['200', 'true', 'pikachu'],
    note: 'this is API testing, precisely',
    badge: 'call the endpoint, assert the status, assert the parsed body — this lesson, wearing an expect()',
  },
]

function NetworkRoundTrip({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 348" className="w-full">
      {/* your program */}
      <RoughRect x={30} y={60} width={120} height={70} seed={1061} strokeWidth={2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
      <text x={90} y={88} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fontWeight={700} fill="var(--color-ink)">your code</text>
      <text x={90} y={108} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink-soft)">await fetch(…)</text>

      {/* server */}
      <RoughRect x={290} y={60} width={120} height={70} seed={1062} strokeWidth={2} roughness={1.8} fill="var(--color-sticky)" fillStyle="solid" />
      <text x={350} y={88} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fontWeight={700} fill="var(--color-ink)">the server</text>
      <text x={350} y={108} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink-soft)">pokeapi.co</text>

      {/* envelopes */}
      <AnimatePresence mode="wait">
        {view.phase === 'request' && (
          <motion.g key="req" initial={{ x: 0, opacity: 0 }} animate={{ x: 130, opacity: 1 }} transition={{ duration: 0.9 }}>
            <RoughRect x={100} y={38} width={90} height={26} seed={1063} strokeWidth={1.6} fill="var(--color-marker-yellow)" fillStyle="solid" />
            <text x={145} y={55} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">GET /pokemon/25</text>
          </motion.g>
        )}
        {(view.phase === 'response' || view.phase === 'body') && (
          <motion.g key="res" initial={{ x: 0, opacity: 0 }} animate={{ x: -130, opacity: 1 }} transition={{ duration: 0.9 }}>
            <RoughRect x={250} y={150} width={110} height={30} seed={1064} strokeWidth={1.6} fill="color-mix(in srgb, var(--color-marker-teal) 20%, transparent)" fillStyle="solid" />
            <text x={305} y={169} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink)">
              {view.phase === 'response' ? '200 OK + headers' : '{"name":"pikachu",…}'}
            </text>
          </motion.g>
        )}
        {view.phase === 'server' && (
          <motion.text key="cook" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={350} y={44} textAnchor="middle" fontSize={16}>
            ⚙️
          </motion.text>
        )}
      </AnimatePresence>

      {view.phase === 'codes' && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {[
            { code: '200 OK', tone: 'var(--color-marker-teal)', note: 'success (res.ok = true)' },
            { code: '404 Not Found', tone: 'var(--color-marker-coral)', note: 'your URL’s mistake' },
            { code: '500 Server Error', tone: 'var(--color-marker-coral)', note: 'their program crashed' },
          ].map((r, i) => (
            <g key={r.code}>
              <RoughRect x={70} y={148 + i * 34} width={130} height={26} seed={1071 + i} strokeWidth={1.6} stroke={r.tone} />
              <text x={135} y={165 + i * 34} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10} fill="var(--color-ink)">{r.code}</text>
              <text x={214} y={165 + i * 34} fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-ink-soft)">{r.note}</text>
            </g>
          ))}
        </motion.g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={267} width={352} fontSize={9.5} seed={1073} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={296} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={426} fontSize={12.5} /></motion.text>
      </AnimatePresence>

      <RoughRect x={40} y={310} width={360} height={32} seed={1072} strokeWidth={1.5} />
      <text x={58} y={331} fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">
        {view.console.length === 0 ? '(console: nothing yet)' : view.console.join('  ·  ')}
      </text>
    </svg>
  )
}

const FAKEFETCH_EXERCISE: CodeExerciseDef = {
  id: 'l67-fakefetch',
  title: 'the two-await drill (offline edition)',
  task: 'The sandbox has no network — so build a faithful fake of fetch’s SHAPE and drill the exact pattern you’ll use on real APIs and in API tests: check the head, then parse the body.',
  steps: [
    <>
      A function <code>fakeFetch(url)</code> that returns a Promise resolving to a response-shaped
      object: <code>ok</code> = <code>true</code>, <code>status</code> = <code>200</code>, and a{' '}
      <code>json</code> METHOD that itself returns a Promise resolving to{' '}
      <code>{'{ name: "pikachu", id: 25 }'}</code>.
    </>,
    <>
      An async <code>main()</code>: await <code>fakeFetch("/pokemon/25")</code>; if the response
      is not ok, throw <code>new Error("HTTP " + status)</code>; otherwise await{' '}
      <code>.json()</code>.
    </>,
    <>
      Print the data's <code>name</code>, then its <code>id</code>. Two awaits, one guard — the
      immortal pattern.
    </>,
  ],
  starter: '',
  expectedOutput: ['pikachu', '25'],
  mustUse: [
    { test: /json\s*:|json\s*\(\s*\)\s*\{/, label: 'the fake response carries a json method' },
    { test: /await\s+fakeFetch/, label: 'first await: the response head' },
    { test: /await\s+\w+\.json\s*\(\s*\)/, label: 'second await: the parsed body' },
    { test: /\.ok\b/, label: 'the guard checks res.ok before touching the body' },
  ],
  mustNotUse: [
    { test: /\bfetch\s*\(/, label: 'fakeFetch only — the sandbox has no network; the SHAPE is the lesson' },
  ],
  modelAnswer: `function fakeFetch(url) {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ name: "pikachu", id: 25 }),
  });
}

async function main() {
  const res = await fakeFetch("/pokemon/25");
  if (!res.ok) {
    throw new Error("HTTP " + res.status);
  }
  const data = await res.json();
  console.log(data.name);
  console.log(data.id);
}

main();`,
}

export const lesson67: LessonDef = {
  id: '6.7',
  hook: (
    <>
      <p>
        Everything async so far waited on <em>timers</em>. The real star of "later" is the{' '}
        <strong>network</strong>: your program asking another program — across the world — for
        data. The language for that conversation is HTTP, the data format is 4.13's JSON, and the
        JavaScript doorway is{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          <code>fetch</code>
        </HighlightMark>
        .
      </p>
      <p>
        One pattern to engrave — <em>the two-await</em>: first await the response <em>head</em>{' '}
        (status + headers), check it's ok, then await the <em>body</em> (<code>res.json()</code>).
        This exact dance is the foundation of API testing (Playwright's <code>request</code>{' '}
        fixture, lesson 11.8, is fetch in a test costume) — learn it here, use it for a decade.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'request-envelope',
      caption:
        'fetch(url) mails a REQUEST: an envelope carrying the method (GET — “give me”), the URL (which resource), and headers (metadata about the ask).',
      highlightLines: [2, 3, 4],
    },
    {
      id: 'request-parked',
      caption:
        'It returns a pending promise immediately — the envelope is in the mail, your function awaits at line 2, parked on 6.6’s shelf, thread free.',
      highlightLines: [2, 3, 4],
    },
    {
      id: 'server',
      caption:
        'On the other end, a SERVER — just a program on someone else’s machine, listening for envelopes — looks at the URL, gathers pokemon #25’s data, and mails back a RESPONSE. This round-trip is the slow part: tens to hundreds of milliseconds. Exactly what awaiting was built for.',
      highlightLines: [3],
    },
    {
      id: 'head',
      caption:
        'First await fulfills — with the response HEAD only: res.status (200 — the number code), res.ok (true — shorthand for “status is 2xx”), headers. NOT the data yet. The body may still be streaming in. This split is why the pattern needs two awaits.',
      highlightLines: [2, 6, 7],
    },
    {
      id: 'guard-fulfills',
      caption:
        'A 404 response is still a RESPONSE — fetch’s promise fulfills! fetch only rejects when the network itself fails — no connection, or DNS dead (DNS is the internet’s address book, translating a name like example.com into the actual address to connect to).',
      highlightLines: [9, 10, 11],
    },
    {
      id: 'guard-throw',
      caption:
        'The guard before the goods: if (!res.ok) throw. Skipping this check and parsing an error page is the #1 rookie fetch bug. You throw (5.8), and your async function rejects (6.6) — errors flow to the caller’s catch.',
      highlightLines: [9, 10, 11],
    },
    {
      id: 'body',
      caption:
        'Second await: res.json() reads the body stream to its end AND runs JSON.parse on it (4.13, industrialized) — a promise of the parsed object. data.name → "pikachu". Two awaits: head, then body. Say it like a mantra.',
      highlightLines: [13, 14],
    },
    {
      id: 'codes-map',
      caption:
        'The status-code map you’ll read daily as a tester: 2xx = success. 4xx = the CLIENT’s mistake (404 wrong URL, 401 not logged in, 403 forbidden). 5xx = the SERVER’s mistake (500 crash, 503 overloaded).',
      highlightLines: [6, 9, 10],
    },
    {
      id: 'codes-testing',
      caption:
        'An API test is often literally: call the endpoint, assert the status, assert the parsed body — this lesson, wearing an expect().',
      highlightLines: [6, 9, 10],
    },
  ],
  Viz: NetworkRoundTrip,
  underTheHood: (
    <>
      <p>
        HTTP is textual and stateless: each request stands alone, carrying everything the server
        needs (that's why sessions need cookies/storage — lesson 7.7).
      </p>
      <p>
        Beyond GET: POST sends data (a body on the request, plus options:{' '}
        <code>{'fetch(url, { method: "POST", body: JSON.stringify(…) })'}</code> — the options
        object of 4.11!), PUT updates, DELETE removes. Same envelope dance, different verbs.
      </p>
      <p>
        The two promises exist because bodies can be huge: the head arrives first and fast, so you
        can decide — is it ok? does its content-type header say "this is really JSON"? — before
        paying for the body. <code>res.json()</code> is the JSON body reader; <code>res.text()</code>{' '}
        exists for everything else.
      </p>
      <p>
        The exercise uses a <em>fake</em> fetch deliberately. The sandbox has no network — and
        faking a response's shape is itself a professional skill. It is how tests mock APIs —
        Playwright's <code>route.fulfill</code> (lesson 11.10) is the same idea, built in.
        The shape you fake today is the shape you'll assert on for years.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'A server replies 404. Does fetch’s promise reject? Type yes or no.',
      accept: ['no', 'No', 'NO', 'no!'],
      placeholder: 'yes / no…',
      why: 'No — a 404 is a successfully delivered RESPONSE, so the promise fulfills with res.ok === false. fetch rejects only on network failure (no connection, DNS). Hence the guard: if (!res.ok) throw.',
    },
    {
      kind: 'type-output',
      question: 'Why TWO awaits? Because the first delivers the response ___ and the second delivers the ___. Type the two words (space-separated).',
      accept: ['head body', 'head, body', 'head and body', 'headers body'],
      placeholder: 'e.g. x y…',
      why: 'Head (status + headers — fast, first), then body (the actual data, possibly still streaming — res.json() awaits and parses it). Check the head before paying for the body.',
    },
    {
      kind: 'type-output',
      question: 'Status 503 — whose side made the mistake? Type: client or server.',
      accept: ['server', 'Server', 'the server', 'server!'],
      placeholder: 'client / server…',
      why: '5xx = server-side trouble (503: overloaded/unavailable). 4xx = client-side (bad URL, no auth). As a tester you’ll read this split every single day.',
    },
  ],
  onTheJob: (
    <JobScene>
      <Scene>One day, a test check you write will look like this:</Scene>
      <ReviewCard file="pokemon.spec.js" lines={[{ text: 'res.status === 200 && data.id === 25 && ms < 2000' }]} />
      <Takeaway>
        Three comparisons and two &&s, evaluating to one true or false. <Key>Remember 1.10’s
        boolean grammar? This is the same tree, now with real status codes and data.</Key>
      </Takeaway>
    </JobScene>
  ),
  PlayExtra: () => <CodeExercise def={FAKEFETCH_EXERCISE} />,
  teachBack: {
    prompt:
      'Walk a friend through what happens from fetch(url) to data.name — the envelopes, both awaits, the ok-guard, and why a 404 doesn’t reject the promise.',
    modelAnswer:
      'fetch(url) mails a request envelope — method, URL, headers — and immediately returns a pending promise; my async function awaits it, parked, thread free. A server (a program on another machine) reads the request and mails back a response. The first await fulfills with the response HEAD: status code, res.ok (true for 2xx), headers — not the data. I guard here: if (!res.ok) throw new Error("HTTP " + status), because a 404 is a delivered response — fetch fulfills for ANY status and only rejects when the network itself fails — so skipping the guard means parsing an error page. Then the second await: res.json() reads the body stream fully and JSON.parses it into a real object — data.name is usable data. Two awaits — head, then body — plus one guard: the pattern every API call and every API test is built on. Codes: 2xx success, 4xx my mistake, 5xx theirs.',
  },
  recap: [
    'fetch = mail a request envelope, await the response HEAD (status/ok/headers), then await res.json() for the parsed body. Two awaits, always.',
    'fetch fulfills for ANY delivered status — 404 included. Guard with if (!res.ok) throw. It rejects only on network failure.',
    '2xx ok · 4xx client’s fault · 5xx server’s fault. API testing = this pattern + assertions (11.8’s request fixture).',
  ],
}
