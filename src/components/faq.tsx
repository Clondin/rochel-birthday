import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Plus } from '@phosphor-icons/react'
import { faq } from '../content'
import { LineReveal } from './line-reveal'

const EASE = [0.16, 1, 0.3, 1] as const

/* The record, in Q and A. One open at a time. */
export function Faq() {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="mx-auto max-w-4xl px-6 py-28 md:py-44">
      <p className="text-[11px] font-semibold tracking-[0.4em] text-wine-300 uppercase">{faq.label}</p>
      <h2 className="font-display mt-6 text-5xl leading-[1.05] font-light tracking-tight md:text-7xl">
        <LineReveal>
          Frequently <span className="text-wine-300 italic">asked.</span>
        </LineReveal>
      </h2>

      <div className="mt-14 md:mt-20">
        {faq.items.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={item.q} className="border-b border-ivory-50/10 first:border-t">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="group flex w-full cursor-pointer items-center justify-between gap-6 py-7 text-left"
              >
                <span className="font-display text-2xl leading-snug font-light transition-colors duration-300 group-hover:text-wine-300 md:text-4xl">
                  {item.q}
                </span>
                <motion.span
                  animate={reduce ? undefined : { rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="shrink-0 text-wine-300"
                >
                  <Plus size={22} weight="regular" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="font-display max-w-xl pb-8 text-xl leading-relaxed text-ivory-300 italic md:text-2xl">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
