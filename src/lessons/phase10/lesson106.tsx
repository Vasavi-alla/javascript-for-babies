import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'
import { JobScene, Scene, Takeaway, Key, ChatBubble } from '../../design/JobScene'

/**
 * 10.6 — Test doubles & a taste of TDD
 * The dependency problem (network in a unit test) → injection (3.8 made it
 * possible) → the double family precisely: stub (feeds), spy (records —
 * built live from a 5.3 closure), mock (the loose word), fake (9.5's model
 * disk WAS one) → double at boundaries only → red-green-refactor, one
 * honest loop.
 */

const CODE = `// the machine depends on the NETWORK:
async function greetUser(fetchUser, id) {
  const user = await fetchUser(id);
  return \`hello, \${user.name}!\`;
}

// a STUB — canned answer, no network:
const stubFetch = async (id) => ({ name: "Ada" });

// a SPY — records every call (a 5.3 closure!):
function makeSpy(fn) {
  const calls = [];
  const wrapped = (...args) => {
    calls.push(args);
    return fn(...args);
  };
  wrapped.calls = calls;
  return wrapped;
}

const spy = makeSpy(stubFetch);
await greetUser(spy, 7);
// spy.calls → [[7]]`

interface View {
  mode: 'problem' | 'swap' | 'spy' | 'family' | 'tdd'
  socket?: 'network' | 'stub'
  spyCalls?: string[]
  familyHot?: number | null
  tddPhase?: 'red' | 'green' | 'refactor' | null
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'problem', socket: 'network', console: [],
    note: 'unit-testing greetUser as-is drags in the REAL network: slow, flaky, needs a server running',
  },
  {
    mode: 'problem', socket: 'network', console: [],
    note: 'the door out was built in Phase 3: greetUser TAKES its dependency as a parameter — 3.8’s functions-as-values',
    badge: 'a dependency you can hand in is a dependency you can swap. This design move has a name: dependency injection.',
  },
  {
    mode: 'swap', socket: 'stub', console: ['hello, Ada!'],
    note: 'a STUB: a stand-in returning canned answers — it controls what the dependency FEEDS your machine',
  },
  {
    mode: 'swap', socket: 'stub', console: ['hello, Ada!'],
    note: 'now the test is a UNIT test again: no network, no server, ~milliseconds, same answer every run (10.2’s fast lane)',
  },
  {
    mode: 'spy', socket: 'stub', spyCalls: ['[7]'], console: ['hello, Ada!'],
    note: 'a SPY records every call — how many times, with which arguments: it observes what your machine DID',
  },
  {
    mode: 'spy', socket: 'stub', spyCalls: ['[7]'], console: ['hello, Ada!'],
    note: 'look how it’s built: calls lives in a closure (5.3!), the wrapper gathers args (4.11) and delegates',
    badge: 'stub = controls the INPUT side (what flows in) · spy = observes the OUTPUT side (what your code sent out)',
  },
  {
    mode: 'family', familyHot: 2, console: [],
    note: 'MOCK, the loose word: strictly a stub+spy with built-in expectations — casually, people say it for ALL doubles',
  },
  {
    mode: 'family', familyHot: 3, console: [],
    note: 'FAKE: a working lightweight stand-in — and you’ve already built one: 9.5’s model disk WAS a fake file system',
  },
  {
    mode: 'family', familyHot: null, console: [],
    note: 'the discipline: double at the BOUNDARIES (network, disk, clock, randomness) — don’t mock what you own',
    badge: 'over-mocked tests check the wiring instead of the behavior — they pass while the app is broken, and break while it works',
  },
  {
    mode: 'tdd', tddPhase: 'red', console: ['✗ greets by name — fetchUser is not defined'],
    note: 'TDD, one honest loop — beat one, RED: write the test FIRST and watch it fail. The failure is PROOF the test can fail',
  },
  {
    mode: 'tdd', tddPhase: 'green', console: ['✓ greets by name'],
    note: 'beat two, GREEN: write the MINIMUM code that passes — resist cleverness, just cross the line',
  },
  {
    mode: 'tdd', tddPhase: 'refactor', console: ['✓ greets by name'],
    note: 'beat three, REFACTOR: now improve the code freely — the green test is your safety net while you do',
    badge: 'red proves the test works · green proves the code works · refactor keeps it livable. Then the loop repeats — small, forever.',
  },
]

const FAMILY = [
  { name: 'STUB', role: 'canned answers — feeds your machine' },
  { name: 'SPY', role: 'records calls — observes your machine' },
  { name: 'MOCK', role: 'stub + spy + expectations (the loose word)' },
  { name: 'FAKE', role: 'working lightweight stand-in (9.5’s disk!)' },
]

function DoubleSwap({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {(view.mode === 'problem' || view.mode === 'swap' || view.mode === 'spy') && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the machine and its dependency socket
          </text>
          <RoughRect x={40} y={64} width={160} height={90} seed={3201} strokeWidth={2.4} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={120} y={100} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">greetUser</text>
          <text x={120} y={120} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink-soft)">the machine under test</text>
          <HandArrow from={{ x: 204, y: 108 }} to={{ x: 248, y: 108 }} curve={0} seed={3205} stroke="var(--color-ink-soft)" strokeWidth={1.8} />
          {view.socket === 'network' ? (
            <g>
              <RoughRect x={252} y={64} width={150} height={90} seed={3210} strokeWidth={2.2} stroke="var(--color-marker-coral)" roughness={2.2} fill="color-mix(in srgb, var(--color-marker-coral) 8%, transparent)" fillStyle="solid" />
              <text x={327} y={96} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fontWeight={700} fill="var(--color-marker-coral)">the REAL network</text>
              <text x={327} y={116} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">slow · flaky · needs a server</text>
              <text x={327} y={134} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">🌐 6.7’s whole round trip</text>
            </g>
          ) : (
            <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 15 }}>
              <RoughRect x={252} y={64} width={150} height={90} seed={3211} strokeWidth={2.2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 8%, transparent)" fillStyle="solid" />
              <text x={327} y={92} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fontWeight={700} fill="var(--color-marker-teal)">cardboard STUB</text>
              <text x={327} y={112} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">async () =&gt; ({'{ name: "Ada" }'})</text>
              <text x={327} y={132} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">instant · same answer, every run</text>
            </motion.g>
          )}
          {view.mode === 'spy' && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <RoughRect x={110} y={180} width={220} height={54} seed={3220} strokeWidth={2} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 8%, transparent)" fillStyle="solid" />
              <text x={220} y={202} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">the spy’s notebook 📓</text>
              <text x={220} y={222} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink)">
                calls: [ {(view.spyCalls ?? []).join(', ')} ]  ← called once, with 7
              </text>
            </motion.g>
          )}
        </g>
      )}

      {view.mode === 'family' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the double family — four stand-ins, four jobs
          </text>
          {FAMILY.map((member, i) => {
            const hot = view.familyHot === i
            return (
              <g key={member.name} opacity={view.familyHot === null || hot ? 1 : 0.35}>
                <RoughRect x={36} y={44 + i * 48} width={368} height={40} seed={3230 + i} strokeWidth={hot ? 2.4 : 1.5} stroke={hot ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={hot ? 'color-mix(in srgb, var(--color-marker-teal) 8%, transparent)' : 'transparent'} fillStyle="solid" />
                <text x={54} y={69 + i * 48} fontFamily="var(--font-hand)" fontSize={11.5} fontWeight={700} fill="var(--color-ink)">{member.name}</text>
                <text x={392} y={69 + i * 48} textAnchor="end" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink-soft)">{member.role}</text>
              </g>
            )
          })}
        </g>
      )}

      {view.mode === 'tdd' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            red → green → refactor
          </text>
          {[
            { key: 'red', label: 'RED', sub: 'test first — watch it fail', color: 'var(--color-marker-coral)' },
            { key: 'green', label: 'GREEN', sub: 'minimum code to pass', color: 'var(--color-marker-teal)' },
            { key: 'refactor', label: 'REFACTOR', sub: 'improve, net beneath you', color: 'var(--color-pencil-blue)' },
          ].map((phase, i) => {
            const active = view.tddPhase === phase.key
            return (
              <g key={phase.key} opacity={active ? 1 : 0.3}>
                <RoughRect x={36 + i * 132} y={52} width={118} height={86} seed={3240 + i} strokeWidth={active ? 2.8 : 1.6} stroke={phase.color} fill={`color-mix(in srgb, ${phase.color} ${active ? 14 : 4}%, transparent)`} fillStyle="solid" />
                <text x={95 + i * 132} y={88} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fontWeight={700} fill="var(--color-ink)">{phase.label}</text>
                <text x={95 + i * 132} y={112} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8.5} fill="var(--color-ink-soft)">{phase.sub}</text>
                {i < 2 && <text x={158 + i * 132} y={100} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">→</text>}
              </g>
            )
          })}
          <text x={220} y={172} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">
            …and back to RED for the next small behavior ↺
          </text>
        </g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={252} width={392} fontSize={9.5} seed={3250} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={292} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={12} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={314} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink-soft)">
          {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const SPY_EXERCISE: CodeExerciseDef = {
  id: 'l106-build-a-spy',
  title: 'build a spy, deploy a stub',
  task: 'The two working doubles, from raw materials: a stub that feeds greetUser a canned user, and a spy — a closure with a notebook — that proves exactly how the dependency was called.',
  steps: [
    <>
      Write <code>greetUser(fetchUser, id)</code>: an async function that awaits{' '}
      <code>fetchUser(id)</code> and returns <code>hello, NAME!</code> built from the user’s
      name (template literal).
    </>,
    <>
      The stub: <code>stubFetch</code> — an async arrow that ignores the id and resolves to{' '}
      <code>{'{ name: "Ada" }'}</code>.
    </>,
    <>
      The spy: <code>makeSpy(fn)</code> — inside, a <code>calls</code> array (the closure’s
      notebook, 5.3); return a wrapped function that gathers its arguments (rest, 4.11), pushes
      them into <code>calls</code>, and delegates to <code>fn</code>. Attach the notebook:{' '}
      <code>wrapped.calls = calls</code>.
    </>,
    <>
      Run the sting inside an async function: wrap the stub in a spy, await{' '}
      <code>greetUser(spy, 7)</code> and print the greeting, then print{' '}
      <code>calls: 1</code> (from the notebook’s length) and <code>first arg: 7</code> (from the
      recorded arguments).
    </>,
  ],
  starter: '',
  expectedOutput: ['hello, Ada!', 'calls: 1', 'first arg: 7'],
  mustUse: [
    { test: /function\s+makeSpy\s*\(|const\s+makeSpy\s*=/, label: 'a function named makeSpy' },
    { test: /const\s+calls\s*=\s*\[\]/, label: 'the notebook: a calls array captured in the closure' },
    { test: /\(\s*\.\.\.\w+\s*\)/, label: 'the wrapper gathers arguments with rest (...)' },
    { test: /async/, label: 'greetUser is async' },
    { test: /await/, label: 'the dependency is awaited' },
    { test: /\.calls\.length/, label: 'the call count is read from the notebook' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']calls: 1["']\s*\)/, label: 'no hard-coded counts — read the spy’s notebook' },
    { test: /console\.log\s*\(\s*["']hello, Ada!["']\s*\)/, label: 'no hard-coded greeting — greetUser must build it' },
  ],
  modelAnswer: `async function greetUser(fetchUser, id) {
  const user = await fetchUser(id);
  return \`hello, \${user.name}!\`;
}

const stubFetch = async (id) => ({ name: "Ada" });

function makeSpy(fn) {
  const calls = [];
  const wrapped = (...args) => {
    calls.push(args);
    return fn(...args);
  };
  wrapped.calls = calls;
  return wrapped;
}

async function runTheSting() {
  const spy = makeSpy(stubFetch);
  const greeting = await greetUser(spy, 7);
  console.log(greeting);
  console.log("calls: " + spy.calls.length);
  console.log("first arg: " + spy.calls[0][0]);
}

runTheSting();`,
}

export const lesson106: LessonDef = {
  id: '10.6',
  hook: (
    <>
      <p>
        A unit test must live in 10.2’s fast lane — no network, no disk, no clock. But real
        machines DEPEND on those things. The trade’s answer:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          test doubles — stand-ins for a dependency, like a stunt double for an actor
        </HighlightMark>
        . Today you’ll meet the whole family precisely (stub, spy, mock, fake), build two of them
        from raw materials, and take one honest lap of the most famous rhythm in the craft:
        red–green–refactor.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-problem',
      caption:
        'The machine under test: greetUser fetches a user, then formats a greeting. Unit-test it as-is and you drag in 6.7’s ENTIRE round trip: slow (hundreds of ms), flaky (networks fail randomly), and it needs a server running with user 7 in it. Three violations of the fast lane in one dependency.',
      highlightLines: [1, 2, 3, 4, 5],
    },
    {
      id: 'injection',
      caption:
        'Now spot the door out — it was built in Phase 3. greetUser doesn’t reach out and grab the network: it RECEIVES fetchUser as a parameter. 3.8’s functions-as-values, paying its biggest dividend yet: a dependency you can hand in is a dependency you can SWAP. (The design move’s name: dependency injection.)',
      highlightLines: [2],
    },
    {
      id: 'stub',
      caption:
        'Swap number one — the STUB: a stand-in that returns canned answers. stubFetch ignores the id and instantly resolves to { name: "Ada" } (async arrow — 6.6 + 3.4). A stub controls what the dependency FEEDS your machine: you’re testing the greeting logic, not the internet.',
      highlightLines: [7, 8],
    },
    {
      id: 'fast-lane-again',
      caption:
        'Look what the swap bought: the test now runs in milliseconds, needs no server, and gives the SAME answer every run — deterministic, the property 10.1’s suite depends on. greetUser’s real logic (the await, the template) is still fully exercised. Isolation without amputation.',
      highlightLines: [3, 4],
    },
    {
      id: 'spy',
      caption:
        'Swap number two — the SPY: a stand-in that RECORDS. Sometimes the question isn’t “did my machine return right?” but “did my machine CALL its dependency right?” — once, not twice; with id 7, not undefined. The spy’s notebook holds the evidence: calls → [[7]].',
      highlightLines: [11, 21, 22],
    },
    {
      id: 'spy-anatomy',
      caption:
        'Read makeSpy closely — it’s a Phase 5 trophy. calls lives in a CLOSURE (5.3: the wrapper’s rope back to its birthplace); the wrapper gathers arguments with rest (4.11), records them, then delegates with spread. Attach the notebook to the function (functions are objects — 3.4) and return it. Ten lines, no framework.',
      highlightLines: [11, 12, 13, 14, 15, 16, 17, 18],
    },
    {
      id: 'mock-the-word',
      caption:
        'Family member three, and a vocabulary warning: a MOCK is strictly a stub-plus-spy with built-in expectations (“I expect to be called once with 7 — I’ll fail the test myself if not”). But in casual speech, people say “mock” for EVERY double. Now you know both the precise word and the street usage.',
      highlightLines: [7, 11],
    },
    {
      id: 'fake',
      caption:
        'Family member four — the FAKE: a genuinely WORKING lightweight stand-in, not canned answers but a real implementation of the boring kind. Here’s the payoff: 9.5’s model disk — the object you wrote writeFile/readFile against — WAS a fake file system. You’ve been building doubles since before you knew the word.',
      highlightLines: [7],
    },
    {
      id: 'when-to-double',
      caption:
        'The discipline that separates professionals: double at the BOUNDARIES — network, disk, clock, randomness (the slow, flaky outside world) — and DON’T mock what you own. Stub your own withTax to test your own cart, and the test checks wiring instead of behavior: it passes while the app is broken and breaks while it works. The worst of both.',
      highlightLines: [7, 8],
    },
    {
      id: 'tdd-red',
      caption:
        'Last act — TDD, test-driven development, one honest lap. Beat one, RED: write the test BEFORE the code exists, run it, watch it fail. That failure is not a formality — it’s PROOF the test can fail. (10.3’s enshrined-bug trap is impossible when the code doesn’t exist yet to copy from.)',
      highlightLines: [1],
    },
    {
      id: 'tdd-green',
      caption:
        'Beat two, GREEN: write the MINIMUM code that makes the test pass — resist cleverness, resist generality, just cross the line. Minimum matters: every line you write beyond the test’s demand is a line no test is watching.',
      highlightLines: [2, 3, 4],
    },
    {
      id: 'tdd-refactor',
      caption:
        'Beat three, REFACTOR: NOW make the code good — rename, restructure, simplify — with the green test as your safety net; if the light stays green, your improvement changed no behavior. Then the loop repeats for the next small behavior. Red proves the test, green proves the code, refactor keeps it livable.',
      highlightLines: [2, 3, 4],
    },
  ],
  Viz: DoubleSwap,
  underTheHood: (
    <>
      <p>
        Real frameworks ship the spy factory you just hand-built: Vitest’s{' '}
        <code>vi.fn()</code> creates a spy (its notebook is <code>.mock.calls</code>), and{' '}
        <code>vi.spyOn(object, "method")</code> wraps an existing method in place. Read their
        docs after building makeSpy and you’ll recognize every feature — a closure, a notebook, a
        delegate.
      </p>
      <p>
        The clock is the sneakiest boundary: code using <code>Date.now()</code> or{' '}
        <code>setTimeout</code> gives different answers every run — untestable by definition
        until you double TIME itself. <code>vi.useFakeTimers()</code> swaps the clock for a
        puppet you advance by hand (<code>vi.advanceTimersByTime(2000)</code> — two “seconds,”
        instantly). Phase 11 has a browser-side sibling, <code>page.clock</code>.
      </p>
      <p>
        The honest boundaries of TDD: it shines when behavior is clear and design is the question
        (parsers, calculators, your tip functions). It’s clumsy for exploratory UI work, where
        you don’t yet know what you’re building. Most professionals use it selectively, not
        religiously. What survives everywhere is the RED discipline: never trust a test you’ve
        never seen fail.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'One double FEEDS canned answers in; another RECORDS how it was called. Name them in that order (comma-separated).',
      accept: ['stub, spy', 'stub,spy', 'Stub, Spy', 'a stub, a spy', 'stub and spy'],
      placeholder: 'double, double…',
      why: 'Stub = controls the input side (canned answers in); spy = observes the output side (records calls and arguments). A mock is strictly both plus built-in expectations.',
    },
    {
      kind: 'type-output',
      question: 'In TDD, why must you watch the test FAIL before writing the code? (what does the red prove?)',
      accept: ['it proves the test can fail', 'proves the test can fail', 'the test can fail', 'that the test can fail', 'proof the test can fail', 'it can fail'],
      placeholder: 'the red proves…',
      why: 'Red is proof the test CAN fail — a test you’ve never seen fail might be incapable of failing (asserting nothing, testing the wrong thing). Never trust a test you’ve never seen red.',
    },
    {
      kind: 'type-output',
      question: 'Your test stubs YOUR OWN withTax function to test YOUR OWN cart. Good idea or bad idea?',
      accept: ['bad', 'bad idea', 'Bad', 'bad!', 'a bad idea'],
      placeholder: 'good / bad…',
      why: 'Bad — double at the boundaries (network, disk, clock), never what you own. Over-mocking makes tests check the wiring instead of the behavior: green while broken, red while working.',
    },
  ],
  onTheJob: (
    <JobScene>
      <Scene>One day, an interviewer will ask you this exact question:</Scene>
      <ChatBubble who="interviewer" face="🙂">Explain stub vs mock vs spy.</ChatBubble>
      <ChatBubble who="you, after this lesson" face="😊" accent indent>
        A stub feeds canned answers in. A spy records how it was called. Playwright’s
        route.fulfill() is a stub at the network boundary: when the page asks for data, answer
        with this.
      </ChatBubble>
      <Takeaway>
        <Key>Most candidates miss this answer.</Key> Same family, biggest stage.
      </Takeaway>
    </JobScene>
  ),
  PlayExtra: () => <CodeExercise def={SPY_EXERCISE} />,
  teachBack: {
    prompt:
      'Teach the double family to a friend: the problem doubles solve, each member’s precise job (stub/spy/mock/fake — with your 9.5 example), the boundaries rule — then walk one red-green-refactor lap and say what each beat proves.',
    modelAnswer:
      'Unit tests must be fast and deterministic, but real code depends on slow, flaky things — the network, the disk, the clock. Test doubles are stand-ins for those dependencies, and swapping them in is possible because of dependency injection: a function that RECEIVES its dependency as a parameter (functions are values — Phase 3) can be handed a stand-in instead. The family, precisely: a STUB returns canned answers — it controls what flows INTO your machine, so greetUser can be tested with a fake user in milliseconds, no server. A SPY records every call and its arguments — it observes what your machine sent OUT; it’s built from a closure holding a calls array, a wrapper that gathers arguments and delegates. A MOCK is strictly stub-plus-spy with built-in expectations, though people casually say “mock” for everything. A FAKE is a working lightweight implementation — the model disk I built in 9.5 was literally a fake file system. The discipline: double only at the boundaries — network, disk, clock, randomness — and never mock what you own, or your tests check wiring instead of behavior. TDD is the rhythm on top: RED — write the test first and watch it fail, which proves the test CAN fail; GREEN — write the minimum code to pass; REFACTOR — improve the code freely with the green test as a safety net. Red proves the test, green proves the code, refactor keeps it livable.',
  },
  recap: [
    'Doubles = stand-ins for dependencies, made possible by injection (3.8: hand the dependency in, and you can swap it). Double at BOUNDARIES only — network, disk, clock, randomness; never what you own.',
    'The family, precisely: STUB feeds canned answers (input side) · SPY records calls (output side; a 5.3 closure with a notebook — you built one) · MOCK = stub+spy+expectations (the loosely-used word) · FAKE = working lightweight stand-in (9.5’s model disk!).',
    'TDD’s lap: RED (test first — the failure PROVES the test can fail) → GREEN (minimum code to pass) → REFACTOR (improve under a green safety net). Never trust a test you’ve never seen fail.',
  ],
}
