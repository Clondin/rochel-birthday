import { useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'
import confetti from 'canvas-confetti'
import { finale, her } from '../content'
import { Dust } from './dust'
import { LineReveal } from './line-reveal'

const EASE = [0.16, 1, 0.3, 1] as const
const CONFETTI_COLORS = ['#c25e6e', '#d98a97', '#8e3a4a', '#f4ede7']
const defaults = { colors: CONFETTI_COLORS, disableForReducedMotion: true }

let heartShape: confetti.Shape | null = null
try {
  heartShape = confetti.shapeFromText({ text: '❤️', scalar: 2 })
} catch {
  heartShape = null
}

/* The full volley: big center burst, hearts, side cannons, then streamers. */
function celebrate() {
  confetti({ ...defaults, particleCount: 150, spread: 100, origin: { y: 0.7 } })
  if (heartShape) {
    confetti({
      ...defaults,
      particleCount: 22,
      spread: 110,
      scalar: 1.7,
      startVelocity: 38,
      shapes: [heartShape],
      origin: { y: 0.65 },
    })
  }
  setTimeout(() => {
    confetti({ ...defaults, particleCount: 70, angle: 60, spread: 70, origin: { x: 0, y: 0.75 } })
    confetti({ ...defaults, particleCount: 70, angle: 120, spread: 70, origin: { x: 1, y: 0.75 } })
  }, 220)
  const end = performance.now() + 1300
  ;(function streamers() {
    confetti({ ...defaults, particleCount: 4, angle: 62, spread: 50, startVelocity: 58, origin: { x: 0, y: 0.85 } })
    confetti({ ...defaults, particleCount: 4, angle: 118, spread: 50, startVelocity: 58, origin: { x: 1, y: 0.85 } })
    if (performance.now() < end) requestAnimationFrame(streamers)
  })()
}

function spark(clientX: number, clientY: number) {
  confetti({
    ...defaults,
    particleCount: 26,
    spread: 65,
    startVelocity: 32,
    origin: { x: clientX / window.innerWidth, y: clientY / window.innerHeight },
  })
}

/* Button that leans toward the cursor. */
function Magnetic({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 160, damping: 17 })
  const sy = useSpring(y, { stiffness: 160, damping: 17 })

  return (
    <motion.div
      style={reduce ? undefined : { x: sx, y: sy }}
      onMouseMove={(e) => {
        if (reduce) return
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * 0.35)
        y.set((e.clientY - r.top - r.height / 2) * 0.35)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      className="inline-block"
    >
      {children}
    </motion.div>
  )
}

export function Finale() {
  const [wished, setWished] = useState(false)
  const reduce = useReducedMotion()

  return (
    <section
      onPointerDown={(e) => {
        if (wished && !reduce) spark(e.clientX, e.clientY)
      }}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 40% at 50% 60%, rgb(194 94 110 / 0.12), transparent 70%)',
        }}
      />
      <Dust count={12} />

      <AnimatePresence mode="wait">
        {!wished ? (
          <motion.div
            key="ask"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            className="relative flex flex-col items-center"
          >
            <h2 className="font-display text-6xl leading-[1.05] font-light tracking-tight italic md:text-9xl">
              <LineReveal>{finale.lead}</LineReveal>
            </h2>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
            >
              <Magnetic>
                <div className="relative mt-14 inline-block">
                  <span
                    aria-hidden
                    className="glow-pulse absolute -inset-2 rounded-full bg-wine-400/35 blur-xl"
                  />
                  <button
                    onClick={() => {
                      setWished(true)
                      celebrate()
                    }}
                    className="relative rounded-full bg-wine-400 px-12 py-5 text-lg font-medium tracking-wide text-ink-950 transition-colors duration-200 hover:bg-wine-300 active:scale-[0.98]"
                  >
                    {finale.buttonLabel}
                  </button>
                </div>
              </Magnetic>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="wish"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.1 }}
            className="relative flex flex-col items-center"
          >
            <h2 className="font-display text-4xl leading-[1.05] font-light tracking-tight text-ivory-300 md:text-6xl">
              {finale.headline}
            </h2>
            <p className="font-display font-wonk pb-4 text-[clamp(4.5rem,15vw,12rem)] leading-[1.1] font-light text-wine-300 italic">
              {her.name}
            </p>
            <p className="mt-4 text-xl text-ivory-300">{finale.sub}</p>
            <p className="mt-3 text-sm text-ivory-500">Tap anywhere for more.</p>
            <button
              onClick={celebrate}
              className="mt-10 rounded-full border border-ivory-50/20 px-8 py-3 text-sm font-medium tracking-[0.2em] text-ivory-300 uppercase transition-all duration-200 hover:border-wine-400/60 hover:text-ivory-50 active:scale-[0.98]"
            >
              One more wish
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
