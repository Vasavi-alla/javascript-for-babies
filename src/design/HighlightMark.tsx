import { useEffect, useRef, type ReactNode } from 'react'
import { annotate } from 'rough-notation'
import type { RoughAnnotationType } from 'rough-notation/lib/model'

/** rough-notation wrapper: hand-drawn underline / circle / highlight over text. */
export function HighlightMark({
  type = 'underline',
  color = 'var(--color-marker-yellow)',
  show = true,
  strokeWidth = 2,
  children,
}: {
  type?: RoughAnnotationType
  color?: string
  show?: boolean
  strokeWidth?: number
  children: ReactNode
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !show) return
    const annotation = annotate(el, {
      type,
      color,
      strokeWidth,
      multiline: true,
      animationDuration: 500,
      padding: 2,
    })
    annotation.show()
    return () => annotation.remove()
  }, [type, color, show, strokeWidth])

  return <span ref={ref}>{children}</span>
}
