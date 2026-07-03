import { Link, useParams } from 'react-router'
import { findPracticeSet } from '../practice/sets'
import { CodeExercise } from '../engine/practice/CodeExercise'
import { useProgress } from '../store/progress'
import { StickyNote } from '../design/StickyNote'
import { TapeLabel } from '../design/TapeLabel'
import { HighlightMark } from '../design/HighlightMark'

/** A practice bay: a set of write-real-code drills for one phase. */
export function PracticePage() {
  const { id } = useParams<{ id: string }>()
  const set = id ? findPracticeSet(id) : undefined
  const { solvedExercises, markExerciseSolved } = useProgress()

  if (!set) {
    return (
      <StickyNote id="practice-404" color="pink">
        No practice bay “{id}”. <Link to="/" className="underline">Back to the map</Link>
      </StickyNote>
    )
  }

  const solvedCount = set.exercises.filter((ex) => solvedExercises[ex.id]).length
  const allSolved = solvedCount === set.exercises.length

  return (
    <div className="flex flex-col gap-8">
      <header>
        <Link to={`/phase/${set.phase}`} className="text-ink-soft text-sm hover:underline">
          ← back to phase {set.phase}
        </Link>
        <div className="mt-3">
          <TapeLabel id={`practice-${set.id}`} color="var(--color-marker-yellow)">
            practice bay · best after lesson {set.bestAfter}
          </TapeLabel>
        </div>
        <h1 className="font-hand mt-3 text-4xl font-bold sm:text-5xl">{set.title}</h1>
        <p className="text-ink-soft mt-2 max-w-2xl text-lg">{set.blurb}</p>
        <p className="mt-3 max-w-2xl">
          No multiple choice down here — you <strong>write the code, it really runs</strong>, and
          the inspection checks both what it prints and how you wrote it. Stuck is allowed: “show
          the answer” compares the master’s solution against yours, line by line.
        </p>
        <p className="font-hand mt-3 text-2xl">
          {solvedCount} of {set.exercises.length} solved
          {allSolved && <span className="text-marker-teal font-bold"> — bay cleared! ✓</span>}
        </p>
      </header>

      {set.exercises.map((exercise, i) => (
        <section key={exercise.id}>
          <p className="font-hand text-ink-soft mb-2 text-xl">
            {i + 1} / {set.exercises.length}
            {solvedExercises[exercise.id] && <span className="text-marker-teal ml-2 font-bold">✓ solved</span>}
          </p>
          <CodeExercise def={exercise} onPass={() => markExerciseSolved(exercise.id)} />
        </section>
      ))}

      {allSolved && (
        <p className="max-w-2xl text-lg">
          <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-teal) 35%, transparent)">
            Every line here came from your fingers.
          </HighlightMark>{' '}
          That’s the difference between recognizing JavaScript and writing it.
        </p>
      )}
    </div>
  )
}
