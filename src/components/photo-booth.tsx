import { useState } from 'react'
import { ArrowsClockwise, Confetti } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'
import { spark } from '../effects'
import { FadeImg } from './fade-img'

const POOL = Array.from({ length: 65 }, (_, i) => `/photos/p${String(i + 1).padStart(2, '0')}.jpg`)
const INITIAL = [34, 11, 42, 27, 3, 39, 15, 31, 54]
const EASE = [0.16, 1, 0.3, 1] as const

function pickNine(previous: number[]) {
  const next = [...Array(POOL.length).keys()]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  const picked = next.slice(0, 9)
  return picked.every((value, i) => value === previous[i]) ? next.slice(9, 18) : picked
}

export function PhotoBooth() {
  const reduce = useReducedMotion()
  const [selection, setSelection] = useState(INITIAL)

  function shuffle(e: React.MouseEvent) {
    setSelection((current) => pickNine(current))
    spark(e.clientX, e.clientY, 28)
  }

  return (
    <section id="photos" className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 md:px-10 md:py-44">
      <div className="grid items-end gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.38em] text-wine-400">The photo booth</p>
          <h2 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.88] tracking-[-0.055em] sm:text-6xl md:text-8xl">
            <span className="block">65 photos.</span>
            <span className="block text-wine-400">No bad side.</span>
          </h2>
        </div>
        <div className="md:pb-2">
          <p className="max-w-md text-lg leading-relaxed text-ivory-500">
            A new wall every time. Keep shuffling until the family group chat agrees.
          </p>
          <button
            onClick={shuffle}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ivory-50 px-6 py-3.5 text-sm font-bold text-ink-950 transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <ArrowsClockwise size={18} weight="bold" />
            Shuffle the wall
          </button>
        </div>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0.6, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="mt-12 grid auto-rows-[24vw] grid-cols-2 gap-2 sm:auto-rows-[20vw] md:mt-16 md:auto-rows-[14vw] md:grid-cols-4 md:gap-3"
      >
        {selection.map((index, i) => (
          <motion.button
            key={`${index}-${i}`}
            onClick={(e) => spark(e.clientX, e.clientY, 12)}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: i * 0.045, ease: EASE }}
            aria-label={`Celebrate photo ${i + 1}`}
            className={`group relative overflow-hidden rounded-xl bg-ink-900 ${
              i === 0 || i === 5 ? 'col-span-2 row-span-2' : ''
            } ${i === 8 ? 'md:col-span-2' : ''}`}
          >
            <FadeImg
              src={POOL[index]}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <span className="absolute bottom-3 right-3 grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-wine-400 text-ivory-50 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <Confetti size={17} weight="bold" />
            </span>
          </motion.button>
        ))}
      </motion.div>
    </section>
  )
}
