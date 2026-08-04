import { useEffect, useRef, useState } from 'react'
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import { finale, her } from '../content'
import { celebrate, spark } from '../effects'
import { Dust } from './dust'
import { FadeImg } from './fade-img'

const EASE = [0.16, 1, 0.3, 1] as const

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

/* Letters explode outward then reassemble as photo-filled name. */
function ExplodingName({ name, fillSrc, reduce }: { name: string; fillSrc: string; reduce: boolean | null }) {
  const chars = name.split('')
  return (
    <p className="relative mt-2 flex flex-wrap justify-center gap-x-[0.02em] pb-4" aria-label={name}>
      {chars.map((ch, i) => {
        const mid = (chars.length - 1) / 2
        const fromCenter = i - mid
        return (
          <motion.span
            key={`${ch}-${i}`}
            initial={
              reduce
                ? false
                : {
                    opacity: 0,
                    y: 80,
                    x: fromCenter * 28,
                    rotate: fromCenter * 18,
                    scale: 0.4,
                    filter: 'blur(8px)',
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
              x: 0,
              rotate: 0,
              scale: 1,
              filter: 'blur(0px)',
            }}
            transition={{
              type: 'spring',
              stiffness: 90,
              damping: 14,
              delay: 0.08 + i * 0.055,
            }}
            className="font-display font-wonk text-photo-fill inline-block text-[clamp(4.5rem,15vw,12rem)] leading-[1.1] font-light italic [filter:drop-shadow(0_2px_10px_rgb(247_241_232/0.85))]"
            style={{
              backgroundImage: `linear-gradient(rgb(217 138 151 / 0.4), rgb(217 138 151 / 0.4)), url('${fillSrc}')`,
            }}
            aria-hidden
          >
            {ch}
          </motion.span>
        )
      })}
    </p>
  )
}

const HOLD_MS = 1200

export function Finale() {
  const [wished, setWished] = useState(false)
  const reduce = useReducedMotion()

  /* Press-and-hold to wish: the glow builds while she holds, and the
     explosion fires when the hold completes. Released early, it breathes
     back down. Reduced motion grants the wish on a plain press. */
  const holdProgress = useMotionValue(0)
  const glowOpacity = useTransform(holdProgress, [0, 1], [0.3, 1])
  const glowScale = useTransform(holdProgress, [0, 1], [1, 2.1])
  const buttonScale = useTransform(holdProgress, [0, 1], [1, 1.08])
  const holdFrame = useRef<number | null>(null)

  const stopHold = () => {
    if (holdFrame.current !== null) cancelAnimationFrame(holdFrame.current)
    holdFrame.current = null
  }

  const grantWish = () => {
    stopHold()
    setWished(true)
    celebrate()
  }

  const startHold = () => {
    if (reduce) {
      grantWish()
      return
    }
    if (holdFrame.current !== null || wished) return
    const startAt = performance.now() - holdProgress.get() * HOLD_MS
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startAt) / HOLD_MS)
      holdProgress.set(progress)
      if (progress >= 1) {
        holdFrame.current = null
        grantWish()
        return
      }
      holdFrame.current = requestAnimationFrame(tick)
    }
    holdFrame.current = requestAnimationFrame(tick)
  }

  const cancelHold = () => {
    if (holdFrame.current === null) return
    stopHold()
    animate(holdProgress, 0, { duration: 0.4, ease: 'easeOut' })
  }

  useEffect(() => stopHold, [])

  return (
    <>
    <section
      onPointerDown={(e) => {
        if (wished && !reduce) spark(e.clientX, e.clientY)
      }}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
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

      {/* god-rays after wish */}
      <AnimatePresence>
        {wished && !reduce && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'conic-gradient(from 200deg at 50% 60%, transparent 0deg, rgb(247 241 232 / 0.14) 28deg, transparent 56deg, transparent 120deg, rgb(239 75 47 / 0.1) 150deg, transparent 180deg)',
              mixBlendMode: 'screen',
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!wished ? (
          <motion.div
            key="ask"
            exit={
              reduce
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    scale: 1.15,
                    filter: 'blur(12px)',
                    transition: { duration: 0.45, ease: EASE },
                  }
            }
            className="relative flex flex-col items-center"
          >
            <h2 className="max-w-5xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.055em] text-ivory-50 drop-shadow-[0_2px_16px_rgb(247_241_232/0.9)] sm:text-6xl md:text-8xl">
              {finale.lead}
            </h2>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
            >
              <Magnetic>
                <div className="relative mt-14 inline-block">
                  <motion.span
                    aria-hidden
                    style={reduce ? undefined : { opacity: glowOpacity, scale: glowScale }}
                    className="absolute -inset-2 rounded-full bg-wine-400/40 blur-xl"
                  />
                  <motion.button
                    data-cursor="press"
                    style={reduce ? undefined : { scale: buttonScale }}
                    onPointerDown={(e) => {
                      e.preventDefault()
                      try {
                        e.currentTarget.setPointerCapture(e.pointerId)
                      } catch {
                        /* capture is a nicety; the hold works without it */
                      }
                      startHold()
                    }}
                    onPointerUp={cancelHold}
                    onPointerCancel={cancelHold}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
                        e.preventDefault()
                        startHold()
                      }
                    }}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        cancelHold()
                      }
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    className="relative touch-none rounded-full bg-wine-400 px-12 py-5 text-lg font-medium tracking-wide text-ivory-50 transition-colors duration-200 select-none hover:bg-wine-300"
                  >
                    {finale.buttonLabel}
                  </motion.button>
                </div>
              </Magnetic>
              {!reduce && (
                <p className="mt-5 text-center text-[11px] font-semibold tracking-[0.3em] text-ivory-300 uppercase">
                  {finale.buttonHint}
                </p>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="wish"
            initial={reduce ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="relative flex flex-col items-center"
          >
            <motion.h2
              initial={reduce ? false : { opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 16, delay: 0.05 }}
              className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-ivory-50 drop-shadow-[0_2px_12px_rgb(247_241_232/0.95)] md:text-6xl"
            >
              {finale.headline}
            </motion.h2>

            <ExplodingName name={her.name} fillSrc={finale.nameFillSrc} reduce={reduce} />

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7, ease: EASE }}
              className="mt-4 text-xl font-semibold text-ivory-50 drop-shadow-[0_2px_10px_rgb(247_241_232/0.95)]"
            >
              {finale.sub}
            </motion.p>
            <motion.button
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              data-cursor="press"
              onClick={() => celebrate()}
              className="mt-10 rounded-full border border-ivory-50/20 px-8 py-3 text-sm font-medium tracking-[0.2em] text-ivory-300 uppercase transition-all duration-200 hover:border-wine-400/60 hover:text-ivory-50 active:scale-[0.98]"
            >
              More fireworks
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>

    {/* the quiet last line, fading in as she scrolls past the fireworks */}
    <section className="flex min-h-[45vh] items-center justify-center px-6">
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 1, ease: EASE }}
        className="font-display text-center text-3xl font-light tracking-tight text-ivory-50 italic md:text-4xl"
      >
        {finale.closingLine}
      </motion.p>
    </section>
    </>
  )
}
