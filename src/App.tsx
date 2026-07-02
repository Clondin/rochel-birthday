import { HeartStraight } from '@phosphor-icons/react'
import confetti from 'canvas-confetti'
import { her } from './content'
import { Intro } from './components/intro'
import { SmoothScroll } from './components/smooth-scroll'
import { ProgressLine } from './components/progress-line'
import { Hero } from './components/hero'
import { Marquee } from './components/marquee'
import { Letter } from './components/letter'
import { Gallery } from './components/gallery'
import { Interlude } from './components/interlude'
import { Reasons } from './components/reasons'
import { Coupons } from './components/coupons'
import { Kids } from './components/kids'
import { Envelopes } from './components/envelopes'
import { Finale } from './components/finale'

/* Film grain: fixed, non-scrolling, pointer-events-none. */
const GRAIN =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23n)" opacity="0.5"/%3E%3C/svg%3E'

function heartBurst(e: React.MouseEvent) {
  confetti({
    colors: ['#c25e6e', '#d98a97', '#f4ede7'],
    disableForReducedMotion: true,
    particleCount: 16,
    spread: 50,
    startVelocity: 24,
    origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
  })
}

export default function App() {
  return (
    <main className="relative">
      <SmoothScroll />
      <Intro />
      <ProgressLine />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url('${GRAIN}')` }}
      />
      {/* soft vignette pulls the eye to center */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40"
        style={{
          background:
            'radial-gradient(ellipse 130% 100% at 50% 45%, transparent 62%, rgb(10 7 9 / 0.5) 100%)',
        }}
      />

      <Hero />
      <Marquee />
      <Letter />
      <Gallery />
      <Interlude />
      <Reasons />
      <Coupons />
      <Kids />
      <Envelopes />
      <Finale />

      <footer className="flex items-center justify-center gap-2.5 pb-10 text-xs tracking-[0.25em] text-ivory-500 uppercase">
        Made by {her.from}, for {her.name}
        <button onClick={heartBurst} aria-label="A little extra" className="cursor-pointer">
          <HeartStraight size={14} weight="fill" className="heartbeat text-wine-400" />
        </button>
      </footer>
    </main>
  )
}
