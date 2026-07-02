import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { archive } from '../content'
import { LineReveal } from './line-reveal'

gsap.registerPlugin(ScrollTrigger)

/**
 * Horizontal scroll hijack (desktop, motion allowed): section pins at the
 * top and vertical scroll pans the track sideways, with inner parallax on
 * each photo and a progress hairline. On mobile or reduced motion it
 * degrades to a native horizontal scroll-snap strip.
 */
export function Gallery() {
  const wrap = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const progress = useRef<HTMLDivElement>(null)

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
        ;[...parallaxTweens, ...captionTweens, tween].forEach((t) => {
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
              <LineReveal>Us,</LineReveal>
              <LineReveal delay={0.12}>
                <span className="text-wine-300 italic">documented.</span>
              </LineReveal>
            </h2>
            <p className="mt-8 max-w-xs text-ivory-500">{archive.sub}</p>
          </div>

          {archive.items.map((item, i) => (
            <figure key={item.src} className="shrink-0 snap-center">
              <div
                className={`overflow-hidden rounded-[2rem] bg-ink-900 ${i % 2 ? 'h-[52vh] md:h-[62vh]' : 'h-[44vh] md:h-[52vh]'}`}
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  loading="lazy"
                  className="pan-img h-full w-auto scale-[1.12] object-cover"
                />
              </div>
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
    </section>
  )
}
