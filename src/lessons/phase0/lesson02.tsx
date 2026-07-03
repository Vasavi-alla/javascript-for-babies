import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughEllipse, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 0.2 — Where does JavaScript live?
 * Viz: EngineDiagram — the three web languages, the engine, and Node.js.
 */

const LANGS = [
  { name: 'HTML', role: 'the bones', color: 'var(--color-pencil-blue)' },
  { name: 'CSS', role: 'the clothes', color: 'var(--color-marker-teal)' },
  { name: 'JS', role: 'the muscles', color: 'var(--color-marker-yellow)' },
]

function EngineDiagram({ stepIndex }: { stepIndex: number }) {
  return (
    <svg viewBox="0 0 560 310" className="w-full">
      {/* the browser */}
      <text x={195} y={38} fontFamily="var(--font-hand)" fontSize={24} fontWeight={700} fill="var(--color-ink)">
        the browser
      </text>
      <RoughRect x={190} y={50} width={230} height={230} seed={80} />

      {/* three languages feeding in */}
      <AnimatePresence>
        {stepIndex >= 1 &&
          LANGS.map((lang, i) => (
            <motion.g
              key={lang.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
            >
              <RoughRect x={20} y={65 + i * 72} width={110} height={52} seed={82 + i} fill={lang.color} />
              <text x={75} y={88 + i * 72} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={21} fontWeight={700} fill="var(--color-ink)">
                {lang.name}
              </text>
              <text x={75} y={108 + i * 72} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink)">
                {lang.role}
              </text>
              <HandArrow
                from={{ x: 134, y: 91 + i * 72 }}
                to={{ x: 186, y: 120 + i * 30 }}
                seed={86 + i}
                curve={0.1}
                stroke="var(--color-ink-soft)"
                strokeWidth={2}
              />
            </motion.g>
          ))}
      </AnimatePresence>

      {/* the engine */}
      <AnimatePresence>
        {stepIndex >= 2 && (
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            style={{ transformOrigin: '305px 165px' }}
          >
            <RoughEllipse cx={305} cy={165} width={140} height={100} seed={90} fill="var(--color-marker-yellow)" />
            <text x={305} y={160} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={23} fontWeight={700} fill="var(--color-ink)">
              engine
            </text>
            <text x={305} y={184} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-ink-soft)">
              reads the JS
            </text>
            <text x={305} y={252} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
              Chrome: V8 · Firefox: SpiderMonkey
            </text>
            <text x={305} y={270} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
              Safari: JavaScriptCore
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* Node.js */}
      <AnimatePresence>
        {stepIndex >= 4 && (
          <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
            <text x={448} y={92} fontFamily="var(--font-hand)" fontSize={22} fontWeight={700} fill="var(--color-ink)">
              Node.js
            </text>
            <RoughRect x={445} y={105} width={100} height={110} seed={95} />
            <RoughEllipse cx={495} cy={155} width={68} height={48} seed={96} fill="var(--color-marker-teal)" />
            <text x={495} y={162} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={18} fontWeight={700} fill="var(--color-ink)">
              V8
            </text>
            <text x={495} y={238} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
              no browser around it
            </text>
            <text x={495} y={256} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
              (Playwright lives here)
            </text>
            <HandArrow from={{ x: 372, y: 150 }} to={{ x: 452, y: 150 }} seed={97} stroke="var(--color-marker-coral)" curve={-0.2} />
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

export const lesson02: LessonDef = {
  id: '0.2',
  hook: (
    <>
      <p>
        You now know a program is a list of instructions. So you write some JavaScript… and then
        what? Where do you <em>put</em> it? What actually reads it?
      </p>
      <p>
        The answer explains why JavaScript is everywhere — and it introduces the two “homes” you’ll
        work in for the rest of this journey:{' '}
        <HighlightMark type="underline" color="var(--color-marker-teal)">the browser</HighlightMark>{' '}
        and, later, <HighlightMark type="underline" color="var(--color-marker-teal)">Node.js</HighlightMark>.
      </p>
    </>
  ),
  steps: [
    {
      id: 'browser',
      caption:
        'Meet the browser — Chrome, Edge, Firefox, Safari. Here’s a thought that surprises people: the browser is itself a program that someone wrote. Its job is fetching web pages and showing them to you.',
    },
    {
      id: 'three-langs',
      caption:
        'Every web page is built from three languages, each with one job. HTML is the bones (what exists: a button, a heading). CSS is the clothes (how it looks: colors, sizes). JavaScript is the muscles (what it DOES: what happens when you click). You’re here to learn the muscles.',
    },
    {
      id: 'engine',
      caption:
        'Hidden deep inside every browser sits the engine — the part that reads JavaScript and executes it, exactly like the obedient cook from lesson 0.1. Chrome’s engine is called V8. Other browsers have their own; they all speak the same JavaScript.',
    },
    {
      id: 'predict-where',
      caption: 'Here’s the question that confuses almost every beginner. Think carefully before answering.',
      prediction: {
        question:
          'You build a website with JavaScript. Your friend in another country opens it on their laptop. Where does your JavaScript actually run?',
        options: [
          'On the website’s server, somewhere far away',
          'On YOUR computer, since you wrote it',
          'Inside your friend’s browser — on their laptop',
        ],
        correctIndex: 2,
        why: 'The code travels to whoever opens the page, and THEIR browser’s engine runs it on THEIR machine. A million visitors = your code running on a million computers. This is why JavaScript is everywhere — and why, as a tester, you’ll care which browsers you test in.',
      },
    },
    {
      id: 'node',
      caption:
        'One more twist. In 2009 engineers took the V8 engine OUT of the browser and gave it a life of its own: Node.js. Same engine, same language — but now JavaScript can run anywhere: in terminals, on servers… and in test runners. Playwright is a Node program.',
    },
    {
      id: 'big-picture',
      caption:
        'So: one language, two homes. In the browser, JavaScript animates pages for users. In Node, it powers tools for developers — including every automated test you will ever write. You’ll be fluent in both.',
    },
  ],
  Viz: EngineDiagram,
  underTheHood: (
    <>
      <p>
        What does an engine actually do with your file? Two big moves: it <strong>parses</strong>{' '}
        the text (reads it and checks the grammar — this is where typos get caught), then{' '}
        <strong>executes</strong> it. Modern engines even watch which parts of your code run hottest
        and quietly translate those parts into raw machine code for extra speed (a trick called
        JIT — just-in-time compilation). You get all of this for free.
      </p>
      <p>
        Fun fact for interviews: the language’s official name is <strong>ECMAScript</strong> — a
        published standard that all engines agree to follow. That agreement is why the same code
        runs in Chrome, Firefox and Safari. (“JavaScript” is the everyday name; you’ll see “ES2023”
        etc. meaning versions of the standard.)
      </p>
      <p>
        <strong style={{ color: 'var(--color-marker-coral)' }}>Fun fact:</strong> Chrome’s engine
        is literally named after a car engine — the <strong>V8</strong>, eight cylinders of
        muscle-car power — because Google wanted the name itself to promise speed. And the joke
        continues inside it: V8’s two main parts are called <em>Ignition</em> (the interpreter
        that starts your code) and <em>TurboFan</em> (the optimizer that makes hot code fly).
      </p>
      <p>
        <strong>Node.js</strong> = the V8 engine + extra abilities the browser deliberately doesn’t
        grant (reading files on your disk, running servers, talking to the operating system) — and{' '}
        <em>minus</em> the page itself (there’s no HTML in Node; nothing to click). That trade is
        exactly why test tools live there: Playwright runs in Node and reaches out to command real
        browsers from the outside. You’ll see that architecture again in Phase 10.
      </p>
    </>
  ),
  quiz: [
    {
      question: 'A page has a button that changes color when hovered, and shows a popup when clicked. Which language does which?',
      options: [
        'CSS does the hover color, JavaScript does the popup',
        'JavaScript does both',
        'HTML does both',
      ],
      correctIndex: 0,
      why: 'Looks (even reacting looks, like hover styles) are CSS. Behavior — deciding something and making it happen — is JavaScript. HTML just declares that the button exists. The three-way split is worth keeping crisp; testers read all three daily.',
    },
    {
      question: 'What is Node.js?',
      options: [
        'A newer, faster version of JavaScript',
        'A browser without pictures',
        'The V8 engine taken out of the browser, so JavaScript can run anywhere',
      ],
      correctIndex: 2,
      why: 'Same language, same engine — new home. No new JavaScript to learn. It adds powers (files, servers, terminals) and drops the web page. Playwright, and nearly every developer tool you’ll meet, runs on it.',
    },
    {
      kind: 'type-output',
      question: 'Chrome, Firefox and Safari have different engines, yet the same JavaScript runs in all three — because every engine follows one published rulebook. Type its name.',
      accept: ['ECMAScript', 'ecmascript', 'EcmaScript', 'Ecmascript'],
      placeholder: 'the standard’s name…',
      why: 'ECMAScript — different engines, one rulebook. The standard defines exactly how the language must behave, and every engine implements it. (Small differences still exist — which is one reason cross-browser testing is a real job.)',
    },
  ],
  teachBack: {
    prompt:
      'Explain to a friend: what are the three languages of a web page (use the body analogy or your own), and where does JavaScript actually run when someone visits a website?',
    modelAnswer:
      'A web page is built from three languages: HTML is the bones — what exists on the page; CSS is the clothes — how it looks; JavaScript is the muscles — what it does when you interact. When you visit a site, the code is sent to YOUR computer, and a part of your browser called the engine (V8 in Chrome) reads and runs the JavaScript right there. There’s also Node.js — the same engine taken out of the browser — which lets JavaScript run anywhere, like in the tools testers use.',
  },
  recap: [
    'HTML = bones (what exists), CSS = clothes (how it looks), JavaScript = muscles (what it does).',
    'Your JavaScript runs in the visitor’s browser, on their machine — executed by the engine (V8 in Chrome).',
    'Node.js = the engine without the browser: same language, new home. Playwright and the whole testing toolbox live there.',
  ],
}
