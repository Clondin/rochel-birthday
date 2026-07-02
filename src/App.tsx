import { her } from './content'
import { Hero } from './components/hero'
import { Marquee } from './components/marquee'
import { Letter } from './components/letter'
import { Gallery } from './components/gallery'
import { Reasons } from './components/reasons'
import { Kids } from './components/kids'
import { Finale } from './components/finale'

/* Film grain: fixed, non-scrolling, pointer-events-none. */
const GRAIN =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23n)" opacity="0.5"/%3E%3C/svg%3E'

export default function App() {
  return (
    <main className="relative">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url('${GRAIN}')` }}
      />

      <Hero />
      <Marquee />
      <Letter />
      <Gallery />
      <Reasons />
      <Kids />
      <Finale />

      <footer className="flex items-center justify-center pb-10 text-xs tracking-[0.25em] text-ivory-500 uppercase">
        Made by {her.from}, for {her.name}
      </footer>
    </main>
  )
}
