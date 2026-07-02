import { motion, useReducedMotion } from 'motion/react'
import { her, letter } from '../content'

const EASE = [0.16, 1, 0.3, 1] as const

export function Letter() {
  const reduce = useReducedMotion()

  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-28 md:grid-cols-[1fr_1.4fr] md:gap-20 md:px-10 md:py-44">
      <div className="md:sticky md:top-28 md:self-start">
        <p className="text-[11px] font-semibold tracking-[0.4em] text-wine-300 uppercase">{letter.label}</p>
        <h2 className="font-display mt-6 pb-2 text-5xl leading-[1.1] font-light tracking-tight text-ivory-50 italic md:text-7xl">
          {letter.headline}
        </h2>
      </div>

      <div className="space-y-10 md:pt-4">
        {letter.paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
            className="font-display text-2xl leading-snug font-light text-ivory-300 md:text-4xl"
          >
            {p}
          </motion.p>
        ))}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-display pb-2 text-2xl text-wine-300 italic md:text-3xl"
        >
          {her.from}
        </motion.p>
      </div>
    </section>
  )
}
