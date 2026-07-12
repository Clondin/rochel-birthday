import { useEffect, useRef } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { interlude } from '../content'
import { FadeImg } from './fade-img'

function Word({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>
  range: [number, number]
  children: string
}) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{' '}
    </motion.span>
  )
}

/**
 * Full-screen breather: a photo that settles as you scroll into it,
 * a giant quote that lights up word by word, and the day count
 * rolling up from zero.
 */
export function Interlude() {
  const ref = useRef<HTMLElement>(null)
  const counterRef = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.28, 1])

  const { scrollYProgress: lit } = useScroll({ target: ref, offset: ['start 0.75', 'start 0.1'] })
  const words = interlude.quote.split(' ')

  const days = Math.floor((Date.now() - new Date(interlude.metDate).getTime()) / 86_400_000)
  const count = useMotionValue(0)
  const countText = useTransform(count, (v) => Math.round(v).toLocaleString())
  const counterInView = useInView(counterRef, { once: true, amount: 0.8 })

  useEffect(() => {
    if (!counterInView) return
    if (reduce) {
      count.set(days)
      return
    }
    const controls = animate(count, days, { duration: 1.8, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [counterInView, days, reduce, count])

  return (
    <section ref={ref} className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-6">
      <motion.div style={reduce ? undefined : { scale }} className="absolute inset-0">
        <FadeImg src={interlude.src} alt="" loading="lazy" loadedClass="opacity-100" className="h-full w-full object-cover" />
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-ink-950/18" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgb(247 241 232 / 0.05), rgb(247 241 232 / 0.12) 52%, rgb(247 241 232 / 0.62))',
        }}
      />

      <div className="relative z-10 max-w-5xl text-center">
        <p className="font-display pb-3 text-4xl leading-[1.2] font-semibold tracking-tight text-ivory-50 italic drop-shadow-[0_2px_14px_rgb(247_241_232/0.95)] md:text-8xl">
          {reduce
            ? interlude.quote
            : words.map((word, i) => (
                <Word key={i} progress={lit} range={[i / words.length, (i + 1) / words.length]}>
                  {word}
                </Word>
              ))}
        </p>
        <motion.p
          ref={counterRef}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 text-xs font-semibold tracking-[0.4em] text-wine-300 uppercase md:text-sm"
        >
          Day <motion.span className="inline-block min-w-[3ch] tabular-nums">{countText}</motion.span> of us
        </motion.p>
      </div>
    </section>
  )
}
