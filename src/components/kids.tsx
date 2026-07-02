import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { kids } from '../content'
import { LineReveal } from './line-reveal'

const TILTS = [-3, 2, -2, 3, -1.5]

/**
 * The fan club: paper photo cards from the kids, slightly scattered.
 * On desktop they can be picked up and tossed; they spring back home.
 */
export function Kids() {
  const reduce = useReducedMotion()
  const [finePointer] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches,
  )
  const draggable = finePointer && !reduce

  return (
    <section className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-44">
      <div className="text-center">
        <p className="text-[11px] font-semibold tracking-[0.4em] text-wine-300 uppercase">{kids.label}</p>
        <h2 className="font-display mx-auto mt-6 max-w-3xl text-4xl leading-[1.1] font-light tracking-tight md:text-6xl">
          <LineReveal>
            Statements from <span className="text-wine-300 italic">the committee.</span>
          </LineReveal>
        </h2>
        <p className="mt-5 text-ivory-500">{kids.sub}</p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 md:mt-24 md:grid-cols-3 md:gap-8">
        {kids.members.map((kid, i) => (
          <motion.figure
            key={kid.name}
            initial={reduce ? false : { opacity: 0, y: 40, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: reduce ? 0 : TILTS[i % TILTS.length] }}
            whileHover={reduce ? undefined : { rotate: 0, y: -8, scale: 1.02 }}
            whileDrag={{ rotate: 0, scale: 1.06, zIndex: 20 }}
            drag={draggable}
            dragSnapToOrigin
            dragElastic={0.22}
            dragTransition={{ bounceStiffness: 320, bounceDamping: 18 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16, delay: i * 0.08 }}
            className={`mx-auto w-full max-w-xs rounded-2xl bg-ivory-50 p-3 pb-5 shadow-[0_20px_60px_rgb(0_0_0/0.45)] ${
              draggable ? 'cursor-grab active:cursor-grabbing' : ''
            }`}
          >
            <div className="pointer-events-none aspect-[5/6] overflow-hidden rounded-xl bg-ink-800">
              <img src={kid.src} alt={kid.name} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <figcaption className="pointer-events-none px-2 pt-4">
              <p className="font-display pb-1 text-2xl leading-[1.25] text-ink-950 italic">“{kid.quote}”</p>
              <p className="mt-2 text-xs font-semibold tracking-[0.2em] text-ink-800/60 uppercase">{kid.name}</p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}
