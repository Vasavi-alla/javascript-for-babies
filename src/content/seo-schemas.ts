import { AUTHOR, SITE_NAME, SITE_TAGLINE, SITE_URL, absUrl } from './site'

const author = { '@type': 'Person', name: AUTHOR.name, sameAs: [AUTHOR.linkedIn] }

export function courseJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: SITE_NAME,
    description: SITE_TAGLINE,
    provider: author,
    isAccessibleForFree: true,
    inLanguage: 'en',
    url: SITE_URL + '/',
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT40H' },
    teaches: 'JavaScript from zero, ending at Playwright automation testing — 115 visual lessons.',
  }
}

const crumb = (position: number, name: string, path: string) => ({
  '@type': 'ListItem',
  position,
  name,
  item: absUrl(path),
})

export function phaseJsonLd(number: number, title: string, question: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${title} — Phase ${number} of ${SITE_NAME}`,
    description: question,
    url: absUrl(`/phase/${number}`),
    isPartOf: { '@type': 'Course', name: SITE_NAME, url: SITE_URL + '/' },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [crumb(1, 'Home', '/'), crumb(2, `Phase ${number} — ${title}`, `/phase/${number}`)],
    },
  }
}

export function lessonJsonLd(
  lesson: { id: string; title: string; blurb: string; phase: number },
  phaseTitle: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: lesson.title,
    description: lesson.blurb,
    educationalLevel: 'Beginner',
    isAccessibleForFree: true,
    inLanguage: 'en',
    url: absUrl(`/lesson/${lesson.id}`),
    isPartOf: { '@type': 'Course', name: SITE_NAME, url: SITE_URL + '/' },
    author,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        crumb(1, 'Home', '/'),
        crumb(2, `Phase ${lesson.phase} — ${phaseTitle}`, `/phase/${lesson.phase}`),
        crumb(3, lesson.title, `/lesson/${lesson.id}`),
      ],
    },
  }
}
