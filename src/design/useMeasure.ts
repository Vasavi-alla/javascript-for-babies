import { useLayoutEffect, useRef, useState } from 'react'

/** Border-box size of an element, updated on resize. */
export function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      const box = entry.borderBoxSize?.[0]
      const width = box ? box.inlineSize : entry.target.getBoundingClientRect().width
      const height = box ? box.blockSize : entry.target.getBoundingClientRect().height
      setSize((s) => (s.width !== width || s.height !== height ? { width, height } : s))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, size] as const
}
