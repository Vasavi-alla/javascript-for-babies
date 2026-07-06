import { useMemo } from 'react'
import { Link, useParams } from 'react-router'
import { PHASES, findLesson } from '../content/registry'
import { SITE_NAME } from '../content/site'
import { lessonJsonLd } from '../content/seo-schemas'
import { useSeo } from './useSeo'
import { LESSON_DEFS } from '../lessons'
import { LessonShell } from '../engine/lesson/LessonShell'
import { PaperCard } from '../design/PaperCard'
import { StickyNote } from '../design/StickyNote'

export function LessonPage() {
  const { id } = useParams<{ id: string }>()
  const lesson = id ? findLesson(id) : undefined
  const def = id ? LESSON_DEFS[id] : undefined

  const seoLesson = lesson ?? { id: id ?? '', title: 'Lesson not found', blurb: '', phase: 0 }
  const phaseTitle = PHASES.find((p) => p.number === seoLesson.phase)?.title ?? ''
  useSeo({
    title: `${seoLesson.title} — JavaScript for beginners, visually | ${SITE_NAME}`,
    description: seoLesson.blurb.slice(0, 155),
    path: `/lesson/${seoLesson.id}`,
    jsonLd: useMemo(() => lessonJsonLd(seoLesson, phaseTitle), [seoLesson, phaseTitle]),
    noindex: !lesson,
  })

  if (!lesson) {
    return (
      <StickyNote id="lesson-404" color="pink">
        No lesson with id “{id}”. <Link to="/" className="underline">Back to the map</Link>
      </StickyNote>
    )
  }

  if (def) {
    // key resets the stepper/quiz state when navigating between lessons
    return <LessonShell key={lesson.id} def={def} />
  }

  return (
    <PaperCard id={`lesson-${lesson.id}`} className="max-w-2xl">
      <Link to={`/phase/${lesson.phase}`} className="text-ink-soft text-sm hover:underline">
        ← back to phase {lesson.phase}
      </Link>
      <h1 className="font-hand mt-2 text-4xl font-bold">
        {lesson.id} — {lesson.title}
      </h1>
      <p className="text-ink-soft mt-2">{lesson.blurb}</p>
      <p className="mt-4">✏️ This lesson is still being drawn — it arrives with its milestone (see the plan).</p>
    </PaperCard>
  )
}
