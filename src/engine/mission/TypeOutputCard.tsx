import { useState } from 'react'
import { motion } from 'motion/react'
import { StickyNote } from '../../design/StickyNote'
import { InkButton } from '../../design/InkButton'
import { CodePane } from '../../design/CodePane'
import { HighlightMark } from '../../design/HighlightMark'

/**
 * A final-inspection check where the learner types the exact console output —
 * no options to lean on. Wrong answers can retry; a reveal appears after the
 * first miss so nobody gets wedged.
 */
export function TypeOutputCard({
  index,
  question,
  code,
  accept,
  why,
}: {
  index: number
  question: string
  code: string
  accept: string[]
  why: string
}) {
  const [typed, setTyped] = useState('')
  const [tries, setTries] = useState(0)
  const [solved, setSolved] = useState(false)
  const [revealed, setRevealed] = useState(false)

  function check() {
    if (accept.includes(typed.trim())) {
      setSolved(true)
    } else {
      setTries((n) => n + 1)
    }
  }

  const finished = solved || revealed

  return (
    <StickyNote id={`typecheck-${index}-${question}`} className="w-full max-w-xl">
      <p className="font-hand text-2xl leading-snug font-semibold">✏️ Quick check {index + 1}</p>
      <p className="mt-1 mb-3">{question}</p>
      <CodePane code={code} className="text-sm" />

      {!finished ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') check()
            }}
            placeholder="type the console output…"
            className="border-ink-soft/50 bg-paper-raised focus:border-ink w-64 rounded-sm border border-dashed px-3 py-1.5 font-mono text-sm outline-none"
          />
          <InkButton id={`typecheck-go-${index}`} onClick={check} disabled={typed.trim() === ''}>
            check
          </InkButton>
          {tries > 0 && (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="text-ink-soft cursor-pointer text-sm underline"
            >
              show me the answer
            </button>
          )}
        </div>
      ) : null}

      {tries > 0 && !finished && (
        <p className="mt-2">
          <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-coral) 30%, transparent)">
            Not it —
          </HighlightMark>{' '}
          walk the code line by line, exactly like the engine would. Mind every space and character.
        </p>
      )}

      {finished && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-3">
          <p>
            <HighlightMark
              type="highlight"
              color={
                solved
                  ? 'color-mix(in srgb, var(--color-marker-teal) 35%, transparent)'
                  : 'color-mix(in srgb, var(--color-marker-coral) 30%, transparent)'
              }
            >
              {solved ? 'Exactly right!' : 'The answer:'}
            </HighlightMark>{' '}
            {!solved && <code className="font-mono text-sm font-bold">{accept[0]}</code>}
            {!solved && ' — '}
            {why}
          </p>
        </motion.div>
      )}
    </StickyNote>
  )
}
