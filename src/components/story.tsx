import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { story } from '../content'

const EASE = [0.16, 1, 0.3, 1] as const

export function Story() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const chapter = story.chapters[active]

  return (
    <section
      id="story"
      aria-labelledby="story-title"
      className="relative overflow-clip bg-ink-950 pt-20 pb-28 text-ivory-50 md:pt-24 md:pb-32"
    >
      <header className="mx-auto grid max-w-[1400px] gap-8 px-5 sm:px-8 md:grid-cols-[0.7fr_1.3fr] md:px-10">
        <p className="pt-2 text-[11px] font-bold uppercase tracking-[0.4em] text-wine-600">{story.label}</p>
        <div>
          <h2
            id="story-title"
            className="font-display max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.045em] sm:text-6xl md:text-8xl"
          >
            {story.headline}
          </h2>
        </div>
      </header>

      <div className="mx-auto mt-14 grid max-w-[1400px] gap-10 px-5 sm:px-8 md:mt-16 md:grid-cols-[1.15fr_0.85fr] md:items-start md:gap-14 md:px-10 lg:gap-20">
        <figure className="relative overflow-hidden rounded-2xl bg-ink-900 shadow-[0_32px_90px_-42px_rgb(70_50_45/0.45)] md:sticky md:top-8">
          <div className="relative aspect-[4/5] sm:aspect-[5/4] md:aspect-[4/5] lg:aspect-[5/4]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={chapter.photo}
                src={chapter.photo}
                alt={`${chapter.title} ${chapter.date}`}
                loading="lazy"
                decoding="async"
                initial={reduce ? false : { opacity: 0, scale: 1.025 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
                style={{ objectPosition: chapter.focus }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ivory-50/20 via-transparent to-transparent"
            />
          </div>
          <figcaption className="flex items-baseline justify-between gap-4 px-5 py-4 text-sm text-ivory-500 sm:px-6">
            <span>{chapter.date}</span>
            <span className="font-display text-xl text-ivory-50">{chapter.year}</span>
          </figcaption>
        </figure>

        <div className="border-t border-ivory-50/15">
          {story.chapters.map((item, index) => {
            const selected = index === active

            return (
              <button
                type="button"
                key={`${item.year}-${item.date}`}
                aria-pressed={selected}
                onClick={() => setActive(index)}
                className="group w-full border-b border-ivory-50/15 py-6 text-left transition-colors hover:text-wine-400 active:scale-[0.99] md:py-7"
              >
                <span className="grid grid-cols-[4.5rem_1fr] gap-4">
                  <span
                    className={`text-xs font-bold tracking-[0.22em] transition-colors ${
                      selected ? 'text-wine-400' : 'text-ivory-500'
                    }`}
                  >
                    {item.year}
                  </span>
                  <span
                    className={`font-display text-2xl font-semibold leading-tight tracking-[-0.02em] transition-colors sm:text-3xl ${
                      selected ? 'text-ivory-50' : 'text-ivory-300 group-hover:text-wine-400'
                    }`}
                  >
                    {item.title}
                  </span>
                </span>

                <AnimatePresence initial={false}>
                  {selected && (
                    <motion.span
                      initial={reduce ? false : { opacity: 0, height: 0, y: -6 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, height: 0, y: -6 }}
                      transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                      className="grid grid-cols-[4.5rem_1fr] gap-4 overflow-hidden"
                    >
                      <span aria-hidden />
                      <span className="max-w-md pt-3 text-base leading-relaxed text-ivory-500">{item.copy}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
