import { useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'
import { finale, her } from '../content'
import { celebrate, spark } from '../effects'
import { Dust } from './dust'
import { FadeImg } from './fade-img'
import { LineReveal } from './line-reveal'

const EASE = [0.16, 1, 0.3, 1] as const

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
      {/* ambient backdrop, same treatment as the hero */}
      <div aria-hidden className="absolute inset-0">
        <FadeImg
          src={finale.bgSrc}
          alt=""
          loading="lazy"
          loadedClass="opacity-80"
          className="h-full w-full scale-105 object-cover blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/35 via-ink-950/10 to-ink-950/55" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 40% at 50% 60%, rgb(239 75 47 / 0.14), transparent 70%)',
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
            <h2 className="max-w-5xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.055em] text-ivory-50 drop-shadow-[0_2px_16px_rgb(247_241_232/0.9)] sm:text-6xl md:text-8xl">
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
                    className="glow-pulse absolute -inset-2 rounded-full bg-wine-400/25 blur-xl"
                  />
                  <button
                    onClick={() => {
                      setWished(true)
                      celebrate()
                    }}
                    className="relative rounded-full bg-wine-400 px-12 py-5 text-lg font-medium tracking-wide text-ivory-50 transition-colors duration-200 hover:bg-wine-300 active:scale-[0.98]"
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
            <h2 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-ivory-50 drop-shadow-[0_2px_12px_rgb(247_241_232/0.95)] md:text-6xl">
              {finale.headline}
            </h2>
            <p
              className="font-display font-wonk text-photo-fill pb-4 text-[clamp(4.5rem,15vw,12rem)] leading-[1.1] font-light italic [filter:drop-shadow(0_2px_10px_rgb(247_241_232/0.85))]"
              style={{
                backgroundImage: `linear-gradient(rgb(217 138 151 / 0.4), rgb(217 138 151 / 0.4)), url('${finale.nameFillSrc}')`,
              }}
            >
              {her.name}
            </p>
            <p className="mt-4 text-xl font-semibold text-ivory-50 drop-shadow-[0_2px_10px_rgb(247_241_232/0.95)]">{finale.sub}</p>
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
