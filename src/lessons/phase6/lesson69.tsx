import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 6.9 — Checkpoint: the Pokédex fetcher
 * The whole phase in one flow: loading state → fetch (two awaits + guard) →
 * error path → parallel fetches. Two exercises: the resilient single fetch,
 * and the parallel pair. Offline-faithful via fakeFetch shapes.
 */

const CODE = `async function showPokemon(id) {
  console.log("loading…");
  try {
    const res = await fetch(BASE + id);
    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }
    const p = await res.json();
    console.log(p.name + " #" + p.id);
  } catch (err) {
    console.log("error: " + err.message);
  } finally {
    console.log("done");
  }
}`

interface View {
  ui: string[]
  tone: 'load' | 'ok' | 'err'
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without changing the panel */
  badge?: string
}

const VIEWS: View[] = [
  {
    ui: ['⏳ loading…'], tone: 'load', console: ['loading…'],
    note: 'state 1 of every fetching UI: tell the human something is happening',
  },
  {
    ui: ['⏳ loading…'], tone: 'load', console: ['loading…'],
    note: 'the response head arrives',
    badge: 'res.ok passes the guard — count the machinery you’re fluently reading: two awaits, a guard, a parse',
  },
  {
    ui: ['⚡ pikachu #25'], tone: 'ok', console: ['loading…', 'pikachu #25', 'done'],
    note: 'second await parses the body — the data renders, and finally signs off',
  },
  {
    ui: ['⏳ loading…'], tone: 'load', console: ['loading…'],
    note: 'same function, different data: a 404 arrives',
    badge: 'the guard THROWS (6.7’s honesty), and the async function’s promise rejects at the await line',
  },
  {
    ui: ['❌ error: HTTP 404'], tone: 'err', console: ['loading…', 'error: HTTP 404', 'done'],
    note: 'the catch renders it — one drain for every failure: network down, bad status, broken JSON, all land here',
  },
  {
    ui: ['⚡ pikachu #25', '💧 squirtle #7'], tone: 'ok', console: ['loading…'],
    note: 'scaling up: a real Pokédex screen loads MANY pokémon',
    badge: 'dependent? No — so the 6.8 reflex: start every fetch first, Promise.all the responses',
  },
  {
    ui: ['⚡ pikachu #25', '💧 squirtle #7'], tone: 'ok', console: ['loading…', 'both loaded', 'done'],
    note: 'sequential awaits here would turn 100ms into seconds — overlap wins',
  },
  {
    ui: ['🎓'], tone: 'ok', console: [],
    note: 'loading → data | error → done: you now own the full async story, machine to UI',
  },
]

function PokedexPanel({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  const tone = view.tone === 'err' ? 'var(--color-marker-coral)' : view.tone === 'ok' ? 'var(--color-marker-teal)' : 'var(--color-marker-yellow)'
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
        the pokédex screen — a UI is just states made visible
      </text>
      <RoughRect x={90} y={44} width={260} height={130} seed={1091} strokeWidth={2.4} stroke={tone} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
      <AnimatePresence mode="wait">
        <motion.g key={view.ui.join('|')} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {view.ui.map((line, i) => (
            <text key={line} x={220} y={100 + i * 34 - (view.ui.length - 1) * 12} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={view.ui[0] === '🎓' ? 40 : 18} fontWeight={700} fill="var(--color-ink)">
              {line}
            </text>
          ))}
        </motion.g>
      </AnimatePresence>

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={44} y={180} width={352} height={30} seed={1093} strokeWidth={1.6} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 10%, transparent)" fillStyle="solid" />
            <text x={220} y={199} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-pencil-blue)">
              {view.badge}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={236} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>

      <RoughRect x={40} y={252} width={360} height={34} seed={1092} strokeWidth={1.5} />
      <text x={58} y={274} fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">
        {view.console.length === 0 ? '(console: nothing yet)' : view.console.join('  ·  ')}
      </text>
    </svg>
  )
}

const RESILIENT_EXERCISE: CodeExerciseDef = {
  id: 'l69-resilient',
  title: 'part 1 — the fetcher that survives a 404',
  task: 'Build the full loading → error → done flow against a fake API that FAILS — your code must report the failure gracefully and always sign off.',
  steps: [
    <>
      A <code>fakeFetch(url)</code> that resolves to <code>{'{ ok: false, status: 404 }'}</code> —
      the server couldn't find it.
    </>,
    <>
      An async <code>load()</code>: print <code>"loading…"</code>; in a <code>try</code>, await
      the fetch, and if not ok, throw <code>new Error("HTTP " + status)</code>.
    </>,
    <>
      In the <code>catch</code>, print <code>"error: " + message</code>; in a{' '}
      <code>finally</code>, print <code>"done"</code>. Call <code>load()</code>.
    </>,
  ],
  starter: '',
  expectedOutput: ['loading…', 'error: HTTP 404', 'done'],
  mustUse: [
    { test: /ok\s*:\s*false/, label: 'the fake response reports failure: ok: false' },
    { test: /throw\s+new\s+Error\s*\(\s*["']HTTP ["']\s*\+/, label: 'the guard throws with the status baked into the message' },
    { test: /finally\s*\{/, label: 'finally signs off in every ending' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']error: HTTP 404/, label: 'the 404 must travel through the thrown Error, not a direct print' },
  ],
  modelAnswer: `function fakeFetch(url) {
  return Promise.resolve({ ok: false, status: 404 });
}

async function load() {
  console.log("loading…");
  try {
    const res = await fakeFetch("/pokemon/9999");
    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }
  } catch (err) {
    console.log("error: " + err.message);
  } finally {
    console.log("done");
  }
}

load();`,
}

const PARALLEL_EXERCISE: CodeExerciseDef = {
  id: 'l69-parallel',
  title: 'part 2 — two pokémon, one wait',
  task: 'Fetch two records in PARALLEL from a fake API and print both names — using the start-first, all-second reflex from 6.8 and the two-await shape from 6.7.',
  steps: [
    <>
      A <code>fakeFetch(name)</code> returning a promise of{' '}
      <code>{'{ ok: true, json: () => Promise.resolve({ name }) }'}</code> — it echoes the name
      you ask for.
    </>,
    <>
      An async <code>loadTwo()</code>: START both fetches for <code>"pikachu"</code> and{' '}
      <code>"squirtle"</code> (no await yet!), then await <code>Promise.all</code> of the pair.
    </>,
    <>
      Await each response's <code>.json()</code> (another all is fine), and print the two names,
      pikachu first.
    </>,
  ],
  starter: '',
  expectedOutput: ['pikachu', 'squirtle'],
  mustUse: [
    { test: /Promise\.all\s*\(/, label: 'the pair is awaited together with Promise.all' },
    { test: /const\s+\w+\s*=\s*fakeFetch\s*\([\s\S]*const\s+\w+\s*=\s*fakeFetch\s*\(/, label: 'both fetches START before any await' },
    { test: /\.json\s*\(\s*\)/, label: 'bodies still come from .json() — the 6.7 shape holds' },
  ],
  mustNotUse: [
    { test: /await\s+fakeFetch/, label: 'no direct awaits on the fetches — hold the receipts, await the combinator' },
  ],
  modelAnswer: `function fakeFetch(name) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ name }),
  });
}

async function loadTwo() {
  const p1 = fakeFetch("pikachu");
  const p2 = fakeFetch("squirtle");

  const [res1, res2] = await Promise.all([p1, p2]);
  const [d1, d2] = await Promise.all([res1.json(), res2.json()]);

  console.log(d1.name);
  console.log(d2.name);
}

loadTwo();`,
}

export const lesson69: LessonDef = {
  id: '6.9',
  hook: (
    <>
      <p>
        Checkpoint. One function on the left — <code>showPokemon</code> — quietly contains the
        entire phase: the non-blocking thread (6.1) parking at awaits (6.6) while the event loop
        (6.2) and its express lane (6.5) shuttle promise reactions (6.4), a two-await fetch with
        its guard (6.7), errors falling into one catch (5.8 × async), and a finally that always
        signs off.
      </p>
      <p>
        Every data-driven screen you've ever used — and every API test you'll ever write — is this
        exact flow: <strong>loading → data or error → done</strong>. Walk it once more with
        commentary, then build it twice with your own hands.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'loading',
      caption:
        'State one: "loading…" prints BEFORE any await — synchronously, instantly. Users (and test logs) should never stare at silence. Then the function parks at the first await, thread free, world turning.',
      highlightLines: [2, 4],
    },
    {
      id: 'happy-head',
      caption:
        'The happy path begins: response head arrives, res.ok passes the guard. Count what you’re fluently reading now: two awaits, a guard, a parse — four lessons of machinery in five lines.',
      highlightLines: [4, 5, 6],
    },
    {
      id: 'happy-body',
      caption:
        'Second await parses the body, and the data renders.',
      highlightLines: [7, 8, 9],
    },
    {
      id: 'sad-throws',
      caption:
        'The sad path, same function: a 404 fulfills the fetch (6.7’s honesty), the guard THROWS, and the async function’s promise rejects at the await line.',
      highlightLines: [5, 6],
    },
    {
      id: 'sad-catch',
      caption:
        'The catch renders "error: HTTP 404". One drain for every failure — network down, bad status, broken JSON — all land here.',
      highlightLines: [10, 11],
    },
    {
      id: 'parallel-reflex',
      caption:
        'Scaling up: a real Pokédex screen loads MANY pokémon. Dependent? No — so the 6.8 reflex: start every fetch first, Promise.all the responses, all the json()s, render together.',
      highlightLines: [4, 8],
    },
    {
      id: 'parallel-payoff',
      caption:
        'Sequential awaits here would turn 100ms into seconds. Overlap wins.',
      highlightLines: [4, 8],
    },
    {
      id: 'graduate',
      caption:
        'And finally — literally — "done" prints on every ending: success, failure, always (5.8’s cleanup lane). loading → data | error → done. You can now read, write, debug, and explain the full asynchronous story from machine to UI. Phase 7 gives that story a stage: the page itself.',
      highlightLines: [12, 13, 14],
    },
  ],
  Viz: PokedexPanel,
  underTheHood: (
    <>
      <p>
        Why fakes again in the exercises: determinism — the same reason professional test suites
        mock network calls. A test that depends on pokeapi.co's uptime and latency is a flaky
        test; a faked response with the <em>same shape</em> tests your logic with none of the
        weather. Lesson 11.8 gives this practice its industrial name (<code>route.fulfill</code>);
        today you're already doing it.
      </p>
      <p>
        The loading/error/done trio is also the anatomy of test-friendly UI: each state is{' '}
        <em>observable</em> — a spinner, an error banner, a rendered list. Playwright tests assert
        exactly these observations ("expect the spinner, then expect the list"). Apps built
        without visible states are the ones that are miserable to test — you'll say this in
        interviews someday.
      </p>
      <p>
        Phase complete. The machine's full picture, one breath: one thread; blocking forbidden;
        environment waits; queue and express lane feed an empty stack; promises are receipts;
        await parks frames; combinators overlap independent waits; fetch rides it all. That
        paragraph is your teach-back — and a senior-engineer answer to "explain async JavaScript."
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type the FULL output, space-separated:',
      code: 'async function go() {\n  console.log("loading");\n  try {\n    const res = await Promise.resolve({ ok: false, status: 500 });\n    if (!res.ok) throw new Error("HTTP " + res.status);\n    console.log("data");\n  } catch (e) {\n    console.log(e.message);\n  } finally {\n    console.log("done");\n  }\n}\ngo();',
      accept: ['loading HTTP 500 done', 'loading, HTTP 500, done'],
      placeholder: 'e.g. a b c…',
      why: 'loading prints sync; the guard throws on ok:false; catch prints the message; finally always signs off. The full trio: loading → error → done.',
    },
    {
      kind: 'type-output',
      question: 'Ten independent fetches, ~100ms each. Roughly how many ms with start-first + Promise.all? Type the number.',
      accept: ['100', '~100', '100ms'],
      placeholder: 'a number…',
      why: 'Overlapped, the total is the slowest single fetch (~100ms), not the sum (~1000ms). The start-first reflex is a 10× win here — and in your future test suites.',
    },
    {
      kind: 'type-output',
      question: 'Test suites fake network responses instead of calling real APIs mainly for ___ — type the word (hint: the opposite of flaky).',
      accept: ['determinism', 'Determinism', 'deterministic', 'reliability', 'stability'],
      placeholder: 'one word…',
      why: 'Determinism — same input, same result, every run, no network weather. Faking the response SHAPE tests your logic without the world’s noise; Playwright calls it route.fulfill (11.8).',
    },
  ],
  PlayExtra: () => (
    <>
      <CodeExercise def={RESILIENT_EXERCISE} />
      <CodeExercise def={PARALLEL_EXERCISE} />
    </>
  ),
  teachBack: {
    prompt:
      'The grand tour, out loud: explain how one JavaScript thread shows a loading spinner, fetches data from a server, handles a 404, and renders — naming every piece of machinery it rides on the way.',
    modelAnswer:
      'One thread, one call stack — so nothing may block. The function prints its loading state synchronously, then calls fetch: a request envelope goes out and the browser’s Web-API side handles the waiting, off the thread. await parks just this function’s frame, bookmarked, freeing the stack — clicks and rendering continue. When the response HEAD arrives, the function’s resumption rides the microtask lane (which drains completely before any timer or click callback) back onto the empty stack. The guard checks res.ok — a 404 fulfilled the fetch, so I throw, my async function’s promise rejects, and the catch renders the error; otherwise a second await parses the JSON body and the data renders. finally signs off either way. Independent fetches get started first and awaited together with Promise.all, so the total is the slowest, not the sum. Receipts, shelf, express lane, queue, envelopes — that’s the entire async machine, end to end.',
  },
  recap: [
    'Every fetching UI (and API test) = loading → data | error → done — with finally as the always-runs sign-off.',
    'The resilient shape: sync loading print → try { await head → guard → await body → render } catch { render error } finally { done }.',
    'Many independent requests: start first, Promise.all — the slowest, not the sum. Fakes give determinism; Playwright will call it route.fulfill.',
  ],
}
