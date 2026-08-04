import { lazy, Suspense, useEffect } from 'react'
import { her } from './content'
import { celebrate } from './effects'
import { Intro } from './components/intro'
import { SmoothScroll } from './components/smooth-scroll'
import { ProgressLine } from './components/progress-line'
import { ColorGrade } from './components/color-grade'
import { Hero } from './components/hero'
import { EnvelopeTransition } from './components/envelope-transition'
import { Letter } from './components/letter'
import { MemoryWalk } from './components/memory-walk'
import { Story } from './components/story'
const Gallery = lazy(() => import('./components/gallery').then((module) => ({ default: module.Gallery })))
import { Interlude } from './components/interlude'
const Filmstrip = lazy(() => import('./components/filmstrip').then((module) => ({ default: module.Filmstrip })))
import { Finale } from './components/finale'
import { FireworksOverlay } from './components/fireworks-overlay'

/* Film grain: fixed, non-scrolling, pointer-events-none. */
const GRAIN =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23n)" opacity="0.5"/%3E%3C/svg%3E'

export default function App() {
  /* on her actual birthday, the page celebrates on its own once the curtain lifts */
  useEffect(() => {
    const [m, d] = her.birthday.split('-').map(Number)
    const now = new Date()
    const isToday = now.getMonth() + 1 === m && now.getDate() === d
    if (!isToday || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => celebrate({ silent: true }), 3800)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="relative">
      <SmoothScroll />
      <ColorGrade />
      <Intro />
      <ProgressLine />
      <FireworksOverlay />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{ backgroundImage: `url('${GRAIN}')` }}
      />
      <Hero />
      <EnvelopeTransition />
      <Letter />
      <Story />
      <MemoryWalk />
      <Suspense fallback={<div className="min-h-[100dvh] bg-ink-900" aria-label="Loading photos" />}>
        <Gallery />
      </Suspense>
      <Interlude />
      <Suspense fallback={<div className="min-h-96 bg-ink-900" aria-label="Loading the full photo roll" />}>
        <Filmstrip />
      </Suspense>
      <Finale />

      <footer className="pb-10 text-center text-xs tracking-[0.25em] text-ivory-500 uppercase">
        {her.from}, for {her.name}.
      </footer>
    </main>
  )
}
