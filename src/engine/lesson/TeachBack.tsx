import { useState } from 'react'
import { motion } from 'motion/react'
import { PaperCard } from '../../design/PaperCard'
import { StickyNote } from '../../design/StickyNote'
import { InkButton } from '../../design/InkButton'
import { MentorPanel } from '../practice/MentorPanel'
import { reviewTeachBack } from '../practice/gemini'
import { useProgress } from '../../store/progress'

/**
 * The mastery gate: explain the concept in your own words. Saved to the
 * journal (localStorage) — over time this becomes the learner's own textbook.
 */
export function TeachBack({
  lessonId,
  prompt,
  modelAnswer,
}: {
  lessonId: string
  prompt: string
  modelAnswer: string
}) {
  const { journal, saveJournal } = useProgress()
  const saved = journal[lessonId]
  const [draft, setDraft] = useState(saved ?? '')
  const [submitted, setSubmitted] = useState(Boolean(saved))

  return (
    <PaperCard id={`teachback-${lessonId}`} tilt={false}>
      <p className="font-hand text-2xl font-semibold">🗣️ Now teach it back</p>
      <p className="mt-1 max-w-2xl">{prompt}</p>
      <p className="text-ink-soft mt-1 text-sm">
        Write it as if your friend is sitting next to you. Saved to your journal — future-you will
        use these notes to teach others.
      </p>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={5}
        placeholder="Okay, so imagine…"
        className="border-ink-soft/50 bg-paper-shade/60 mt-3 w-full max-w-2xl rounded-md border border-dashed p-3 text-[16px] outline-none focus:border-ink"
      />
      <div className="mt-2">
        <InkButton
          id={`teachback-save-${lessonId}`}
          variant="primary"
          disabled={draft.trim().length < 20}
          onClick={() => {
            saveJournal(lessonId, draft.trim())
            setSubmitted(true)
          }}
        >
          {submitted ? 'update my explanation' : 'save my explanation'}
        </InkButton>
        {!submitted && draft.trim().length < 20 && (
          <span className="text-ink-soft ml-3 text-sm">a few sentences, minimum — you’ve got this</span>
        )}
      </div>

      {submitted && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
          <p className="text-marker-teal font-hand text-xl font-semibold">✓ saved to your journal</p>

          <div className="mt-4">
            <MentorPanel
              id={`teachback-${lessonId}`}
              label="🤖 have the mentor check my explanation"
              ask={() => reviewTeachBack({ prompt, answer: draft.trim(), modelAnswer })}
            />
          </div>

          <p className="text-ink-soft mt-4 text-sm">Compare with one way a teacher might say it:</p>
          <div className="mt-2">
            <StickyNote id={`model-${lessonId}`} className="max-w-2xl">
              {modelAnswer}
            </StickyNote>
          </div>
        </motion.div>
      )}
    </PaperCard>
  )
}
