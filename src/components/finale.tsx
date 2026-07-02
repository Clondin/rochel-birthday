import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import confetti from 'canvas-confetti'
import { finale, her } from '../content'

const EASE = [0.16, 1, 0.3, 1] as const
const CONFETTI_COLORS = ['#c25e6e', '#d98a97', '#8e3a4a', '#f4ede7']

function celebrate() {
  const defaults = { colors: CONFETTI_COLORS, disableForReducedMotion: true }
  confetti({ ...defaults, particleCount: 140, spread: 100, origin: { y: 0.7 } })
  setTimeout(() => {
    confetti({ ...defaults, particleCount: 70, angle: 60, spread: 70, origin: { x: 0, y: 0.75 } })
    confetti({ ...defaults, particleCount: 70, angle: 120, spread: 70, origin: { x: 1, y: 0.75 } })
  }, 220)
  setTimeout(() => {
    confetti({ ...defaults, particleCount: 110, spread: 140, startVelocity: 48, origin: { y: 0.85 } })
  }, 500)
}

export function Finale() {
  const [wished, setWished] = useState(false)
  const reduce = useReducedMotion()

  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 40% at 50% 60%, rgb(194 94 110 / 0.12), transparent 70%)',
        }}
      />

      <AnimatePresence mode="wait">
        {!wished ? (
          <motion.div
            key="ask"
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative flex flex-col items-center"
          >
            <h2 className="font-display pb-2 text-6xl leading-[1.05] font-light tracking-tight italic md:text-9xl">
              {finale.lead}
            </h2>
            <button
              onClick={() => {
                setWished(true)
                celebrate()
              }}
              className="mt-14 rounded-full bg-wine-400 px-12 py-5 text-lg font-medium tracking-wide text-ink-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-wine-300 active:scale-[0.98]"
            >
              {finale.buttonLabel}
            </button>
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
            <p className="font-display pb-4 text-[clamp(4.5rem,15vw,12rem)] leading-[1.1] font-light text-wine-300 italic">
              {her.name}
            </p>
            <p className="mt-4 text-xl text-ivory-300">{finale.sub}</p>
            <button
              onClick={celebrate}
              className="mt-12 rounded-full border border-ivory-50/20 px-8 py-3 text-sm font-medium tracking-[0.2em] text-ivory-300 uppercase transition-all duration-200 hover:border-wine-400/60 hover:text-ivory-50 active:scale-[0.98]"
            >
              One more wish
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
