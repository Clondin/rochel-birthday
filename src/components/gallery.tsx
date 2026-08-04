import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'
import { CaretLeft, CaretRight, X } from '@phosphor-icons/react'
import { archive } from '../content'
import { FadeImg } from './fade-img'

const EASE = [0.16, 1, 0.3, 1] as const

/* Cards render ≤380px wide — use the 800px variant and keep the
   full-size image for the lightbox only. */
const card = (src: string) => src.replace('/web/', '/card/')

/**
 * 3D fling gallery: drag / flick through a coverflow stack.
 * Depth, blur, and scale encode distance from the active card.
 * Mobile falls back to a horizontal snap strip. Lightbox on click.
 */
export function Gallery() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState<number | null>(null)
  const [desktop, setDesktop] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 768px) and (pointer: fine)').matches,
  )
  const dragX = useMotionValue(0)
  const springX = useSpring(dragX, { stiffness: 220, damping: 28, mass: 0.55 })
  const lock = useRef(false)
  const n = archive.items.length

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px) and (pointer: fine)')
    const update = () => setDesktop(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const go = useCallback(
    (next: number) => {
      const clamped = ((next % n) + n) % n
      setIndex(clamped)
      dragX.set(0)
    },
    [n, dragX],
  )

  useEffect(() => {
    if (open === null) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((v) => (v === null ? v : (v + 1) % n))
      if (e.key === 'ArrowLeft') setOpen((v) => (v === null ? v : (v - 1 + n) % n))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, n])

  useEffect(() => {
    if (!desktop || reduce) return
    const onKey = (e: KeyboardEvent) => {
      if (open !== null) return
      if (e.key === 'ArrowRight') go(index + 1)
      if (e.key === 'ArrowLeft') go(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [desktop, reduce, open, index, go])

  /* Desktop / motion: 3D coverflow */
  if (desktop && !reduce) {
    return (
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <p className="text-[11px] font-semibold tracking-[0.4em] text-wine-600 uppercase">{archive.label}</p>
          <h2 className="font-display mt-6 text-6xl leading-[1.05] font-light tracking-tight md:text-8xl">
            {archive.headline}
          </h2>
        </div>

        <div
          className="relative mx-auto mt-10 h-[min(72vh,640px)] w-full max-w-6xl touch-none select-none"
          style={{ perspective: 1400 }}
        >
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            style={{ x: springX }}
            onDragStart={() => {
              lock.current = false
            }}
            onDrag={(_, info) => {
              dragX.set(info.offset.x)
              if (Math.abs(info.offset.x) > 12) lock.current = true
            }}
            onDragEnd={(_, info) => {
              const flung = info.velocity.x
              const offset = info.offset.x
              if (flung < -500 || offset < -90) go(index + 1)
              else if (flung > 500 || offset > 90) go(index - 1)
              else dragX.set(0)
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            {archive.items.map((item, i) => {
              let offset = i - index
              /* wrap for endless-feeling deck edges */
              if (offset > n / 2) offset -= n
              if (offset < -n / 2) offset += n
              if (Math.abs(offset) > 3) return null

              const abs = Math.abs(offset)
              const x = offset * (abs === 0 ? 0 : 150 + abs * 18)
              const z = -abs * 120
              const rotateY = offset * -28
              const scale = 1 - abs * 0.1
              const blur = abs === 0 ? 0 : abs * 1.6
              const opacity = 1 - abs * 0.16

              return (
                <motion.figure
                  key={item}
                  animate={{
                    x,
                    z,
                    rotateY,
                    scale,
                    opacity,
                  }}
                  transition={{ type: 'spring', stiffness: 180, damping: 24, mass: 0.7 }}
                  /* blur is set statically (CSS transition, not spring-animated):
                     continuously interpolating a filter repaints every card every frame */
                  style={{
                    transformStyle: 'preserve-3d',
                    filter: blur ? `blur(${blur}px)` : 'none',
                    transition: 'filter 0.35s ease',
                  }}
                  className="absolute top-1/2 left-1/2 w-[min(72vw,380px)] -translate-x-1/2 -translate-y-1/2"
                >
                  <button
                    data-cursor="press"
                    onClick={() => {
                      if (lock.current) return
                      if (offset === 0) setOpen(i)
                      else go(i)
                    }}
                    aria-label={`Open photo ${i + 1}`}
                    className="block w-full overflow-hidden rounded-[1.75rem] bg-ink-900 shadow-[0_30px_80px_rgb(33_27_26/0.22)] ring-1 ring-ivory-50/10"
                  >
                    <FadeImg
                      src={card(item)}
                      alt={`Family photograph ${i + 1}`}
                      loading={abs < 2 ? 'eager' : 'lazy'}
                      className="aspect-[3/4] h-auto w-full object-cover"
                    />
                  </button>
                </motion.figure>
              )
            })}
          </motion.div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            data-cursor="press"
            onClick={() => go(index - 1)}
            aria-label="Previous photo"
            className="rounded-full border border-ivory-50/15 bg-ink-900/70 p-3 text-ivory-300 transition-colors hover:text-ivory-50"
          >
            <CaretLeft size={18} />
          </button>
          <button
            data-cursor="press"
            onClick={() => go(index + 1)}
            aria-label="Next photo"
            className="rounded-full border border-ivory-50/15 bg-ink-900/70 p-3 text-ivory-300 transition-colors hover:text-ivory-50"
          >
            <CaretRight size={18} />
          </button>
        </div>

        <Lightbox open={open} setOpen={setOpen} n={n} />
      </section>
    )
  }

  /* Mobile / reduced motion: snap strip */
  return (
    <section className="relative">
      <div className="snap-x snap-mandatory overflow-x-auto">
        <div className="flex w-max items-center gap-8 px-6 py-16">
          <div className="w-[80vw] shrink-0 snap-center">
            <p className="text-[11px] font-semibold tracking-[0.4em] text-wine-600 uppercase">{archive.label}</p>
            <h2 className="font-display mt-6 text-6xl leading-[1.05] font-light tracking-tight">
              {archive.headline}
            </h2>
          </div>

          {archive.items.map((item, i) => (
            <figure key={item} className="shrink-0 snap-center">
              <button
                onClick={() => setOpen(i)}
                aria-label={`Open photo ${i + 1}`}
                className={`block overflow-hidden rounded-[2rem] bg-ink-900 ${
                  i % 2 ? 'h-[58vh]' : 'h-[50vh]'
                }`}
              >
                <FadeImg
                  src={card(item)}
                  alt={`Family photograph ${i + 1}`}
                  loading="lazy"
                  className="aspect-[3/4] h-full w-auto object-cover"
                />
              </button>
            </figure>
          ))}
        </div>
      </div>
      <Lightbox open={open} setOpen={setOpen} n={n} />
    </section>
  )
}

function Lightbox({
  open,
  setOpen,
  n,
}: {
  open: number | null
  setOpen: React.Dispatch<React.SetStateAction<number | null>>
  n: number
}) {
  return (
    <AnimatePresence>
      {open !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center p-4 md:p-10"
        >
          <div aria-hidden className="absolute inset-0 bg-ink-950/92 backdrop-blur-sm" />
          <motion.figure
            key={open}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-full flex-col items-center"
          >
            <img
              src={archive.items[open]}
              alt={`Family photograph ${open + 1}`}
              className="max-h-[80vh] max-w-[92vw] rounded-2xl object-contain shadow-[0_30px_100px_rgb(70_50_45/0.3)]"
            />
          </motion.figure>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setOpen((open - 1 + n) % n)
            }}
            aria-label="Previous photo"
            className="absolute left-3 z-10 rounded-full border border-ivory-50/15 bg-ink-900/70 p-3 text-ivory-300 transition-colors hover:text-ivory-50 md:left-8"
          >
            <CaretLeft size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setOpen((open + 1) % n)
            }}
            aria-label="Next photo"
            className="absolute right-3 z-10 rounded-full border border-ivory-50/15 bg-ink-900/70 p-3 text-ivory-300 transition-colors hover:text-ivory-50 md:right-8"
          >
            <CaretRight size={20} />
          </button>
          <button
            onClick={() => setOpen(null)}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 rounded-full border border-ivory-50/15 bg-ink-900/70 p-3 text-ivory-300 transition-colors hover:text-ivory-50 md:top-8 md:right-8"
          >
            <X size={18} weight="bold" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
