import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router'
import { Layout } from './Layout'
import { CurriculumMap } from './CurriculumMap'
import { PhasePage } from './PhasePage'
import { LessonPage } from './LessonPage'
import { DesignGallery } from './DesignGallery'
import { DEFAULT_NAME, nameSlug, useLearnerName } from '../content/learner'

/** React Router keeps the scroll position across navigations — reset it. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

/** /<anything>-journey is the home page wearing the learner's name; anything else renders nothing. */
function JourneyRoute() {
  const { slug } = useParams()
  return slug && slug.endsWith('-journey') ? <CurriculumMap /> : null
}

/**
 * Once a name is saved, "/" always wears it: replace-redirect to
 * /<name>-journey. Fresh visitors (default name, or a name with no
 * url-safe characters) stay on plain "/".
 */
function HomeRoute() {
  const [name] = useLearnerName()
  const slug = nameSlug(name)
  if (name !== DEFAULT_NAME && slug) {
    return <Navigate replace to={`/${slug}-journey`} />
  }
  return <CurriculumMap />
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomeRoute />} />
        <Route path=":slug" element={<JourneyRoute />} />
        <Route path="phase/:number" element={<PhasePage />} />
        <Route path="lesson/:id" element={<LessonPage />} />
        <Route path="design" element={<DesignGallery />} />
      </Route>
    </Routes>
    </>
  )
}
