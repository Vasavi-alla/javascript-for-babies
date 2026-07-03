import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { Layout } from './Layout'
import { CurriculumMap } from './CurriculumMap'
import { PhasePage } from './PhasePage'
import { LessonPage } from './LessonPage'
import { PracticePage } from './PracticePage'
import { DesignGallery } from './DesignGallery'

/** React Router keeps the scroll position across navigations — reset it. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route element={<Layout />}>
        <Route index element={<CurriculumMap />} />
        <Route path="phase/:number" element={<PhasePage />} />
        <Route path="lesson/:id" element={<LessonPage />} />
        <Route path="practice/:id" element={<PracticePage />} />
        <Route path="design" element={<DesignGallery />} />
      </Route>
    </Routes>
    </>
  )
}
