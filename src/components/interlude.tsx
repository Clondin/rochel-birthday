import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { interlude } from '../content'

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
 * a giant quote that lights up word by word, and the running day count.
 */
export function Interlude() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.28, 1])

  const { scrollYProgress: lit } = useScroll({ target: ref, offset: ['start 0.75', 'start 0.1'] })
  const words = interlude.quote.split(' ')

  const days = Math.floor((Date.now() - new Date(interlude.metDate).getTime()) / 86_400_000)

  return (
    <section ref={ref} className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-6">
      <motion.img
        src={interlude.src}
        alt=""
        style={reduce ? undefined : { scale }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-ink-950/78" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgb(23 17 20 / 0.7) 100%)',
        }}
      />

      <div className="relative z-10 max-w-5xl text-center">
        <p className="font-display pb-3 text-4xl leading-[1.2] font-light tracking-tight text-ivory-50 italic md:text-7xl">
          {reduce
            ? interlude.quote
            : words.map((word, i) => (
                <Word key={i} progress={lit} range={[i / words.length, (i + 1) / words.length]}>
                  {word}
                </Word>
              ))}
        </p>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 text-xs font-semibold tracking-[0.4em] text-wine-300 uppercase md:text-sm"
        >
          Day {days.toLocaleString()} of us, and counting
        </motion.p>
      </div>
    </section>
  )
}
