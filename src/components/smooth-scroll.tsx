import { useEffect } from 'react'

/* Lenis smooth scrolling. Skipped under prefers-reduced-motion. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cleanup: (() => void) | undefined
    let cancelled = false

    void import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return
      const lenis = new Lenis({ autoRaf: true, lerp: 0.11 })
      cleanup = () => lenis.destroy()
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return null
}
