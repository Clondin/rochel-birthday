import { lazy, Suspense, useEffect } from 'react'
import { her } from './content'
import { celebrate, spark } from './effects'
import { Intro } from './components/intro'
import { SmoothScroll } from './components/smooth-scroll'
import { ProgressLine } from './components/progress-line'
import { MagneticCursor } from './components/magnetic-cursor'
import { ColorGrade } from './components/color-grade'
import { Hero } from './components/hero'
import { EnvelopeTransition } from './components/envelope-transition'
import { Letter } from './components/letter'
import { MemoryWalk } from './components/memory-walk'
import { Story } from './components/story'
const Gallery = lazy(() => import('./components/gallery').then((module) => ({ default: module.Gallery })))
import { Interlude } from './components/interlude'
import { Reasons } from './components/reasons'
import { Coupons } from './components/coupons'
import { Kids } from './components/kids'
import { Envelopes } from './components/envelopes'
const Decider = lazy(() => import('./components/decider').then((module) => ({ default: module.Decider })))
const Filmstrip = lazy(() => import('./components/filmstrip').then((module) => ({ default: module.Filmstrip })))
import { Finale } from './components/finale'
import { EasterEgg } from './components/easter-egg'
import { FireworksOverlay } from './components/fireworks-overlay'

/* Film grain: fixed, non-scrolling, pointer-events-none. */
const GRAIN =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23n)" opacity="0.5"/%3E%3C/svg%3E'

function heartBurst(e: React.MouseEvent) {
  spark(e.clientX, e.clientY, 16)
}

export default function App() {
  /* on her actual birthday, the page celebrates on its own once the curtain lifts */
  useEffect(() => {
    const [m, d] = her.birthday.split('-').map(Number)
    const now = new Date()
    const isToday = now.getMonth() + 1 === m && now.getDate() === d
    if (!isToday || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(celebrate, 3800)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="relative">
      <SmoothScroll />
      <MagneticCursor />
      <ColorGrade />
      <Intro />
      <ProgressLine />
      <FireworksOverlay />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay"
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
      <Reasons />
      <Coupons />
      <Kids />
      <Envelopes />
      <Suspense fallback={<div className="min-h-96 bg-ink-900" aria-label="Loading the decider" />}>
        <Decider />
      </Suspense>
      <Suspense fallback={<div className="min-h-96 bg-ink-900" aria-label="Loading the full photo roll" />}>
        <Filmstrip />
      </Suspense>
      <Finale />
      <EasterEgg />

      <footer className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-3 pb-10 text-xs tracking-[0.25em] text-ivory-500 uppercase">
        Made by {her.from}, for {her.name}
        <button onClick={heartBurst} aria-label="One more" className="cursor-pointer text-wine-400">
          &#10038;
        </button>
        <a
          href={`mailto:${her.email}?subject=Re%3A%20the%20birthday%20page`}
          className="underline decoration-ivory-50/30 underline-offset-4 transition-colors hover:text-ivory-300"
        >
          Complaints dept.
        </a>
      </footer>
    </main>
  )
}
