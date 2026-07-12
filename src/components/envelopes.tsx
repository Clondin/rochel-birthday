import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X } from '@phosphor-icons/react'
import { openWhen } from '../content'
import { LineReveal } from './line-reveal'

const EASE = [0.16, 1, 0.3, 1] as const
const TILTS = [-1.5, 1.2, -0.8, 1.5]

/**
 * Open-when notes: four sealed cards that morph open into a letter.
 * Escape or a click outside closes the open note.
 */
export function Envelopes() {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    if (open === null) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <section className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-44">
      <div className="text-center">
        <p className="text-[11px] font-semibold tracking-[0.4em] text-wine-300 uppercase">{openWhen.label}</p>
        <h2 className="font-display mx-auto mt-6 max-w-3xl text-4xl leading-[1.1] font-light tracking-tight md:text-6xl">
          <LineReveal>
            Open <span className="text-wine-300 italic">when.</span>
          </LineReveal>
        </h2>
        <p className="mt-5 text-ivory-500">{openWhen.sub}</p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
        {openWhen.notes.map((note, i) => (
          <motion.button
            key={note.title}
            layoutId={reduce ? undefined : `note-${i}`}
            onClick={() => setOpen(i)}
            initial={reduce ? false : { opacity: 0, y: 30, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: reduce ? 0 : TILTS[i] }}
            whileHover={reduce ? undefined : { y: -8, rotate: 0, scale: 1.015 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: i * 0.07, ease: EASE }}
            className="group flex min-h-60 cursor-pointer flex-col items-start justify-between gap-8 rounded-2xl border border-ivory-50/10 bg-ink-900 p-7 text-left transition-colors duration-300 hover:border-wine-400/40"
          >
            {/* wax seal */}
            <span
              aria-hidden
              className="flex h-10 w-10 items-center justify-center rounded-full bg-wine-400 text-sm text-ivory-50 shadow-[0_8px_20px_rgb(239_75_47/0.18),inset_0_1px_0_rgb(247_241_232/0.25)]"
            >
              &#10038;
            </span>
            <span>
              <span className="block text-[10px] font-semibold tracking-[0.3em] text-ivory-500 uppercase">
                Open when
              </span>
              <span className="font-display mt-2 block pb-1 text-2xl leading-[1.2] font-light text-ivory-50 italic md:text-[1.7rem]">
                {note.title}
              </span>
            </span>
            <span className="text-[10px] tracking-[0.25em] text-ivory-500 uppercase transition-colors duration-300 group-hover:text-wine-300">
              Sealed, tap to open
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[70] flex items-center justify-center p-6"
          >
            <div aria-hidden className="absolute inset-0 bg-ink-950/85 backdrop-blur-sm" />
            <motion.div
              layoutId={reduce ? undefined : `note-${open}`}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-lg rounded-2xl bg-ivory-50 p-9 shadow-[0_30px_100px_rgb(70_50_45/0.3)] md:p-12"
            >
              <button
                onClick={() => setOpen(null)}
                aria-label="Close note"
                className="absolute top-4 right-4 rounded-full p-2 text-ink-800/50 transition-colors hover:text-ink-950"
              >
                <X size={18} weight="bold" />
              </button>
              <p className="text-[10px] font-semibold tracking-[0.3em] text-rose-300 uppercase">Open when</p>
              <p className="font-display mt-2 pb-1 text-3xl leading-[1.15] font-light text-ink-950 italic md:text-4xl">
                {openWhen.notes[open].title}
              </p>
              <p className="font-display mt-6 text-xl leading-relaxed text-ink-800">{openWhen.notes[open].body}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
