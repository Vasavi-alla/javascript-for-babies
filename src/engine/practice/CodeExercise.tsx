import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { hashSeed } from '../../design/seed'
import { RoughBox } from '../../design/RoughBox'
import { PaperCard } from '../../design/PaperCard'
import { InkButton } from '../../design/InkButton'
import { CodePane } from '../../design/CodePane'
import { ConsolePane } from '../../design/ConsolePane'
import { HighlightMark } from '../../design/HighlightMark'
import { runCode, type RunResult } from './runner'
import { unsmartText } from './typing'
import { diffLines } from './diff'
import { askMentor } from './gemini'
import { MentorPanel } from './MentorPanel'
import type { CodeExerciseDef } from './types'

/**
 * Write-real-code exercise: type JavaScript, RUN it for real (in a sandboxed
 * worker), get checked against exact output AND required syntax. "I'm stuck"
 * reveals the model answer with a line-by-line comparison; the optional AI
 * mentor (learner's own Gemini key) explains in plain words.
 */
export function CodeExercise({ def, onPass }: { def: CodeExerciseDef; onPass?: () => void }) {
  const [code, setCode] = useState(def.starter ?? '')
  const [result, setResult] = useState<RunResult | null>(null)
  const [checkedCode, setCheckedCode] = useState('')
  const [running, setRunning] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const passedOnce = useRef(false)

  // ── verdicts (computed against the code as it was when RUN was pressed) ──
  const outputOk =
    result !== null && !result.error && !result.timedOut && sameLines(result.lines, def.expectedOutput)
  const mustUse = (def.mustUse ?? []).map((c) => ({ label: c.label, ok: c.test.test(checkedCode) }))
  const violations = (def.mustNotUse ?? []).filter((c) => c.test.test(checkedCode))
  const passed = Boolean(result) && outputOk && mustUse.every((c) => c.ok) && violations.length === 0

  async function run() {
    if (running) return
    setRunning(true)
    const res = await runCode(code)
    setResult(res)
    setCheckedCode(code)
    setRunning(false)
    const nowPassed =
      !res.error &&
      !res.timedOut &&
      sameLines(res.lines, def.expectedOutput) &&
      (def.mustUse ?? []).every((c) => c.test.test(code)) &&
      !(def.mustNotUse ?? []).some((c) => c.test.test(code))
    if (nowPassed && !passedOnce.current) {
      passedOnce.current = true
      onPass?.()
    }
  }

  return (
    <PaperCard id={`exercise-${def.id}`} tilt={false} className="w-full max-w-3xl">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-hand text-2xl font-semibold">⌨️ {def.title}</p>
        {passed && <span className="text-marker-teal font-hand text-2xl font-bold">solved ✓</span>}
      </div>
      <p className="mt-2">{def.task}</p>

      <div className="mt-3">
        <p className="font-hand text-xl font-semibold">requirements:</p>
        <ul className="mt-1 flex list-disc flex-col gap-1.5 pl-6">
          {def.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <p className="font-hand text-xl font-semibold">when you press RUN, the console must show exactly:</p>
        <div className="bg-paper-shade/60 mt-1 inline-block min-w-64 rounded-md px-4 py-3 font-mono text-[14px] leading-relaxed">
          {def.expectedOutput.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>

      {/* ── the editor: real code, typed by hand ── */}
      <div className="mt-4">
        <RoughBox seed={hashSeed(`editor-${def.id}`)} className="bg-paper-shade/50">
          <textarea
            value={code}
            onChange={(e) => setCode(unsmartText(e.target.value))}
            rows={Math.max(8, code.split('\n').length + 1)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            placeholder="// write your JavaScript here…"
            className="w-full resize-y bg-transparent p-4 font-mono text-[16px] leading-relaxed outline-none"
          />
        </RoughBox>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <InkButton id={`run-${def.id}`} variant="primary" onClick={run} disabled={running || code.trim() === ''}>
          {running ? 'running…' : '▶ RUN it for real'}
        </InkButton>
        {result && !passed && !revealed && (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="text-ink-soft inline-block cursor-pointer px-1 py-2 text-sm underline"
          >
            I’m stuck — show the answer
          </button>
        )}
      </div>

      {/* ── the AI mentor (remounts per run so feedback never goes stale) ── */}
      {result && (
        <div className="mt-4">
          <MentorPanel
            key={checkedCode}
            id={`exercise-${def.id}`}
            ask={() =>
              askMentor({
                task: def.task,
                code: checkedCode,
                output: result.lines,
                expected: def.expectedOutput,
                error: result.error,
                passed,
              })
            }
          />
        </div>
      )}

      {/* ── what actually happened ── */}
      {result && (
        <div className="mt-5 grid items-start gap-5 md:grid-cols-2">
          <div>
            <ConsolePane lines={result.lines} />
            {result.error && (
              <p className="text-marker-coral mt-2 font-mono text-sm">💥 {result.error}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="font-hand text-xl">inspection:</p>
            <CheckLine ok={outputOk} label="prints exactly what’s expected" />
            {mustUse.map((c) => (
              <CheckLine key={c.label} ok={c.ok} label={c.label} />
            ))}
            {violations.map((v) => (
              <CheckLine key={v.label} ok={false} label={v.label} />
            ))}

            {!outputOk && !result.error && (
              <div className="mt-2 text-sm">
                <p className="text-ink-soft mb-1">expected, line by line:</p>
                {def.expectedOutput.map((line, i) => {
                  const got = result.lines[i]
                  const match = got === line
                  return (
                    <div key={i} className="mb-1 font-mono">
                      <div>{line}</div>
                      {!match && (
                        <div className="text-marker-coral">
                          yours: {got === undefined ? '(nothing — line missing)' : got}
                        </div>
                      )}
                    </div>
                  )
                })}
                {result.lines.length > def.expectedOutput.length && (
                  <p className="text-marker-coral font-mono">
                    …and yours prints {result.lines.length - def.expectedOutput.length} extra line(s).
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {passed && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
          <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-teal) 35%, transparent)">
            You wrote it, it ran, it’s right.
          </HighlightMark>{' '}
          That’s not a quiz answer — that’s working code from your own fingers.
        </motion.p>
      )}

      {/* ── the model answer + how yours compares ── */}
      {revealed && (
        <div className="mt-5">
          <p className="font-hand text-xl">the master’s solution:</p>
          <CodePane code={def.modelAnswer} className="mt-2" />
          {code.trim() !== '' && (
            <div className="mt-3">
              <p className="font-hand text-xl">yours vs the master’s:</p>
              <div className="bg-paper-shade/50 mt-2 rounded-md p-3 font-mono text-[13px] leading-relaxed">
                {diffLines(code, def.modelAnswer).map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.type === 'same'
                        ? ''
                        : line.type === 'model'
                          ? 'text-marker-teal'
                          : 'text-marker-coral line-through decoration-1'
                    }
                  >
                    {line.type === 'model' ? '+ ' : line.type === 'yours' ? '− ' : '  '}
                    {line.text || ' '}
                  </div>
                ))}
              </div>
              <p className="text-ink-soft mt-1 text-xs">
                <span className="text-marker-teal">+ green</span> = in the master’s answer, missing from yours ·{' '}
                <span className="text-marker-coral">− struck</span> = only in yours
              </p>
            </div>
          )}
          <p className="text-ink-soft mt-2 text-sm">
            Reading it is allowed — but type it out and press RUN. Fingers remember what eyes forget.
          </p>
        </div>
      )}
    </PaperCard>
  )
}

function CheckLine({ ok, label }: { ok: boolean; label: string }) {
  return (
    <p className="flex items-baseline gap-2 text-[15px]">
      <span className={ok ? 'text-marker-teal font-bold' : 'text-marker-coral font-bold'}>
        {ok ? '✓' : '✗'}
      </span>
      <span>{label}</span>
    </p>
  )
}

function sameLines(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((line, i) => line === b[i])
}
