import { useEffect } from 'react'

/* Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger
   stays in sync. Skipped under prefers-reduced-motion. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cleanup: (() => void) | undefined
    let cancelled = false

    void Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
        if (cancelled) return
        gsap.registerPlugin(ScrollTrigger)
        const lenis = new Lenis({ autoRaf: false, lerp: 0.11 })
        lenis.on('scroll', ScrollTrigger.update)
        const raf = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(raf)
        gsap.ticker.lagSmoothing(0)
        cleanup = () => {
          gsap.ticker.remove(raf)
          lenis.destroy()
        }
      },
    )

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return null
}
