import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { guestbook } from '../content'
import { LineReveal } from './line-reveal'

const TILTS = [-5, 3, -2, 4, -3.5, 2.5]
const LIFTS = ['md:mt-0', 'md:mt-10', 'md:mt-3', 'md:mt-12', 'md:mt-6']

/**
 * Scattered notes pinned to the page in everyone's handwriting.
 * Desktop: pick them up and toss them; they spring back.
 */
export function Guestbook() {
  const reduce = useReducedMotion()
  const [finePointer] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches,
  )
  const draggable = finePointer && !reduce

  return (
    <section className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-44">
      <div className="text-center">
        <p className="text-[11px] font-semibold tracking-[0.4em] text-wine-600 uppercase">{guestbook.label}</p>
        <h2 className="font-display mx-auto mt-6 max-w-4xl text-4xl leading-[1.1] font-light tracking-tight md:text-7xl">
          <LineReveal>
            Signed, <span className="text-wine-300 italic">everyone.</span>
          </LineReveal>
        </h2>
        <p className="mt-5 text-ivory-500">{guestbook.sub}</p>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 items-start gap-8 sm:grid-cols-2 md:mt-24 md:grid-cols-3">
        {guestbook.notes.map((note, i) => (
          <motion.figure
            key={note.text}
            initial={reduce ? false : { opacity: 0, y: 36, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: reduce ? 0 : TILTS[i % TILTS.length] }}
            whileHover={reduce ? undefined : { rotate: 0, y: -6, scale: 1.03 }}
            whileDrag={{ rotate: 0, scale: 1.07, zIndex: 20 }}
            drag={draggable}
            dragSnapToOrigin
            dragElastic={0.22}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 17 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 130, damping: 16, delay: i * 0.07 }}
            className={`${LIFTS[i % LIFTS.length]} ${
              note.tone === 'blush' ? 'bg-wine-300' : 'bg-ivory-50'
            } rounded-xl p-7 pb-6 shadow-[0_16px_50px_rgb(70_50_45/0.18)] ${
              draggable ? 'cursor-grab active:cursor-grabbing' : ''
            }`}
          >
            <p className="pointer-events-none font-[family-name:var(--font-hand)] text-3xl leading-snug text-ink-950 md:text-4xl">
              {note.text}
            </p>
            <figcaption className="pointer-events-none mt-4 text-right font-[family-name:var(--font-hand)] text-xl text-ink-800/70">
              {note.by}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}
