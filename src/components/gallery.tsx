import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CaretLeft, CaretRight, X } from '@phosphor-icons/react'
import { archive } from '../content'
import { FadeImg } from './fade-img'
import { LineReveal } from './line-reveal'

gsap.registerPlugin(ScrollTrigger)

/**
 * Horizontal scroll hijack (desktop, motion allowed): section pins at the
 * top and vertical scroll pans the track sideways, with inner parallax on
 * each photo and a progress hairline. On mobile or reduced motion it
 * degrades to a native horizontal scroll-snap strip. Any photo opens in
 * a lightbox.
 */
export function Gallery() {
  const wrap = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const progress = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<number | null>(null)

  /* lock page scroll while the lightbox is up */
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
      if (e.key === 'ArrowRight') setOpen((v) => (v === null ? v : (v + 1) % archive.items.length))
      if (e.key === 'ArrowLeft') setOpen((v) => (v === null ? v : (v - 1 + archive.items.length) % archive.items.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const el = track.current!
      const distance = () => el.scrollWidth - window.innerWidth
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`
          },
        },
      })

      /* Inner parallax: each photo slides inside its frame as it pans by. */
      const parallaxTweens = gsap.utils.toArray<HTMLElement>('.pan-img', wrap.current!).map((img) =>
        gsap.fromTo(
          img,
          { xPercent: -5 },
          {
            xPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: img,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        ),
      )

      /* Photos wipe open as they enter the pan. */
      const wipeTweens = gsap.utils.toArray<HTMLElement>('.pan-frame', wrap.current!).map((frame) =>
        gsap.fromTo(
          frame,
          { clipPath: 'inset(0% 100% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: frame,
              containerAnimation: tween,
              start: 'left 95%',
              toggleActions: 'play none none none',
            },
          },
        ),
      )

      /* Captions rise as their photo reaches the viewport. */
      const captionTweens = gsap.utils.toArray<HTMLElement>('.pan-caption', wrap.current!).map((cap) =>
        gsap.fromTo(
          cap,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cap,
              containerAnimation: tween,
              start: 'left 85%',
              toggleActions: 'play none none reverse',
            },
          },
        ),
      )

      return () => {
        ;[...parallaxTweens, ...wipeTweens, ...captionTweens, tween].forEach((t) => {
          t.scrollTrigger?.kill()
          t.kill()
        })
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={wrap} className="relative md:h-[100dvh] md:overflow-hidden">
      <div className="snap-x snap-mandatory overflow-x-auto md:snap-none md:overflow-visible">
        <div ref={track} className="flex w-max items-center gap-8 px-6 py-16 md:h-[100dvh] md:gap-16 md:px-16 md:py-0">
          {/* opening panel */}
          <div className="w-[80vw] shrink-0 snap-center md:w-[40vw]">
            <p className="text-[11px] font-semibold tracking-[0.4em] text-wine-300 uppercase">{archive.label}</p>
            <h2 className="font-display mt-6 text-6xl leading-[1.05] font-light tracking-tight md:text-8xl">
              <LineReveal>The good</LineReveal>
              <LineReveal delay={0.12}>
                <span className="text-wine-300 italic">roll.</span>
              </LineReveal>
            </h2>
            <p className="mt-8 max-w-xs text-ivory-500">{archive.sub}</p>
          </div>

          {archive.items.map((item, i) => (
            <figure key={item.src} className="shrink-0 snap-center">
              <button
                onClick={() => setOpen(i)}
                aria-label={`View larger: ${item.caption}`}
                className={`pan-frame block cursor-zoom-in overflow-hidden rounded-[2rem] bg-ink-900 ${
                  i % 2 ? 'h-[58vh] md:h-[74vh]' : 'h-[50vh] md:h-[62vh]'
                }`}
              >
                <FadeImg
                  src={item.src}
                  alt={item.caption}
                  loading="lazy"
                  className="pan-img h-full w-auto scale-[1.12] object-cover"
                />
              </button>
              <figcaption className="pan-caption mt-4 text-sm text-ivory-500">{item.caption}</figcaption>
            </figure>
          ))}

          {/* closing beat */}
          <div className="flex w-[60vw] shrink-0 snap-center items-center justify-center md:w-[30vw]">
            <p className="font-display pb-2 text-3xl text-ivory-300 italic md:text-5xl">to be continued</p>
          </div>
        </div>
      </div>

      {/* pan progress, desktop only */}
      <div aria-hidden className="absolute right-16 bottom-10 left-16 hidden h-px bg-ivory-50/10 md:block">
        <div ref={progress} className="h-full origin-left scale-x-0 bg-wine-400" />
      </div>

      {/* lightbox */}
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
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-full flex-col items-center"
            >
              <img
                src={archive.items[open].src}
                alt={archive.items[open].caption}
                className="max-h-[80vh] max-w-[92vw] rounded-2xl object-contain shadow-[0_30px_100px_rgb(70_50_45/0.3)]"
              />
              <figcaption className="mt-4 text-sm text-ivory-300">{archive.items[open].caption}</figcaption>
            </motion.figure>

            <button
              onClick={(e) => {
                e.stopPropagation()
                setOpen((open - 1 + archive.items.length) % archive.items.length)
              }}
              aria-label="Previous photo"
              className="absolute left-3 z-10 rounded-full border border-ivory-50/15 bg-ink-900/70 p-3 text-ivory-300 transition-colors hover:text-ivory-50 md:left-8"
            >
              <CaretLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setOpen((open + 1) % archive.items.length)
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
    </section>
  )
}
