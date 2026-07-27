import { useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'motion/react'
import { decider } from '../content'
import { spark } from '../effects'
import { LineReveal } from './line-reveal'

const SEGMENT_COLORS = ['#ebe1d6', '#dccec1']

/**
 * A ruling wheel. Spins with momentum, lands on a verdict,
 * verdict is final.
 */
export function Decider() {
  const reduce = useReducedMotion()
  const rotation = useMotionValue(0)
  const [spinning, setSpinning] = useState(false)
  const [verdict, setVerdict] = useState<string | null>(null)
  const wheelRef = useRef<HTMLDivElement>(null)

  const n = decider.options.length
  const seg = 360 / n
  const gradient = `conic-gradient(${decider.options
    .map((_, i) => `${SEGMENT_COLORS[i % 2]} ${i * seg}deg ${(i + 1) * seg}deg`)
    .join(', ')})`

  function spin() {
    if (spinning) return
    setSpinning(true)
    setVerdict(null)
    const target = rotation.get() + 5 * 360 + Math.random() * 360
    const finish = () => {
      const landed = ((360 - (target % 360)) % 360 + 360) % 360
      const index = Math.floor(landed / seg) % n
      setVerdict(decider.options[index])
      setSpinning(false)
      const r = wheelRef.current?.getBoundingClientRect()
      if (r) spark(r.left + r.width / 2, r.top, 30)
    }
    if (reduce) {
      rotation.set(target)
      finish()
      return
    }
    animate(rotation, target, { duration: 3.4, ease: [0.12, 0.65, 0.08, 1], onComplete: finish })
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-28 text-center md:px-10 md:py-44">
      <p className="text-[11px] font-semibold tracking-[0.4em] text-wine-600 uppercase">{decider.label}</p>
      <h2 className="font-display mx-auto mt-6 max-w-4xl text-4xl leading-[1.15] font-light tracking-tight md:text-7xl">
        <LineReveal>
          For <span className="text-wine-300 italic">“I don’t care, you pick.”</span>
        </LineReveal>
      </h2>
      <p className="mt-5 text-ivory-500">{decider.sub}</p>

      <div className="relative mx-auto mt-16 w-fit md:mt-20">
        {/* pointer */}
        <div aria-hidden className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 text-2xl text-wine-400">
          &#9660;
        </div>
        <motion.div
          ref={wheelRef}
          style={{ rotate: rotation, background: gradient }}
          className="relative h-72 w-72 rounded-full border border-ivory-50/15 shadow-[0_24px_80px_rgb(70_50_45/0.18)] md:h-96 md:w-96"
        >
          {decider.options.map((option, i) => (
            <div
              key={option}
              aria-hidden
              className="absolute inset-0"
              style={{ transform: `rotate(${i * seg + seg / 2}deg)` }}
            >
              <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold tracking-[0.2em] whitespace-nowrap text-ivory-300 uppercase md:top-9 md:text-xs">
                {option}
              </span>
            </div>
          ))}
          {/* hub */}
          <div className="absolute top-1/2 left-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory-50/15 bg-ink-950 text-lg text-wine-400">
            &#10038;
          </div>
        </motion.div>
      </div>

      {/* the options, readable for the record */}
      <p className="sr-only">Options: {decider.options.join(', ')}</p>

      <button
        onClick={spin}
        disabled={spinning}
        className="mt-12 rounded-full bg-wine-400 px-10 py-4 text-base font-medium tracking-wide text-ivory-50 transition-all duration-200 hover:-translate-y-0.5 hover:bg-wine-300 active:scale-[0.98] disabled:cursor-default disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {spinning ? 'Deliberating' : 'Spin'}
      </button>

      <AnimatePresence mode="wait">
        {verdict && (
          <motion.p
            key={verdict}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 16 }}
            className="font-display mt-8 pb-2 text-3xl font-light text-ivory-50 md:text-4xl"
          >
            Verdict: <span className="text-wine-300 italic">{verdict}.</span>
            <span className="mt-2 block text-sm tracking-[0.2em] text-ivory-500 uppercase">No appeals</span>
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  )
}
