import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { her, letter } from '../content'
import { FadeImg } from './fade-img'
import { LineReveal } from './line-reveal'

const EASE = [0.16, 1, 0.3, 1] as const

function Word({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>
  range: [number, number]
  children: string
}) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{' '}
    </motion.span>
  )
}

/* Each paragraph lights up word by word as it crosses the viewport. */
function LitParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.45'],
  })
  const words = text.split(' ')

  return (
    <p ref={ref} className="font-display text-2xl leading-snug font-light text-ivory-50 md:text-4xl">
      {reduce
        ? text
        : words.map((word, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {word}
            </Word>
          ))}
    </p>
  )
}

export function Letter() {
  const reduce = useReducedMotion()

  return (
    <section id="letter" className="mx-auto grid max-w-7xl scroll-mt-8 grid-cols-1 gap-12 px-6 py-28 md:grid-cols-[1fr_1.4fr] md:gap-20 md:px-10 md:py-44">
      <div className="md:sticky md:top-28 md:self-start">
        <p className="text-[11px] font-semibold tracking-[0.4em] text-wine-300 uppercase">{letter.label}</p>
        <h2 className="font-display mt-6 text-5xl leading-[1.1] font-light tracking-tight text-ivory-50 italic md:text-7xl">
          <LineReveal>{letter.headline}</LineReveal>
        </h2>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: -3.5 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 110, damping: 15, delay: 0.2 }}
          className="mt-10 w-44 rounded-xl bg-ivory-50 p-2 pb-3 shadow-[0_16px_50px_rgb(70_50_45/0.18)] sm:w-52"
        >
          <FadeImg src={letter.snapshotSrc} alt="" loading="lazy" className="aspect-square w-full rounded-lg object-cover" />
        </motion.div>
      </div>

      <div className="space-y-10 md:pt-4">
        {letter.paragraphs.map((p, i) => (
          <LitParagraph key={i} text={p} />
        ))}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="pb-2 font-[family-name:var(--font-hand)] text-4xl text-wine-300 md:text-5xl"
        >
          {her.from}
        </motion.p>
      </div>
    </section>
  )
}
