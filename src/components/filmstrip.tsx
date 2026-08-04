import { useEffect, useRef, useState } from 'react'
import { FadeImg } from './fade-img'

/* Every photo in the pool, p01..p120 — the 420px thumbs, not the full-size
   images: these render ~200px wide, and full-size decodes are what lag. */
const ALL = Array.from({ length: 120 }, (_, i) => `/photos/thumbs/p${String(i + 1).padStart(2, '0')}.webp`)
const ROW_A = ALL.slice(0, 60)
const ROW_B = ALL.slice(60)

function Row({ items, paused, reverse = false }: { items: string[]; paused: boolean; reverse?: boolean }) {
  /* Content duplicated once; the track slides exactly one copy's width. */
  const copy = (key: string) => (
    <div key={key} aria-hidden={key === 'b'} className="flex shrink-0 gap-3 pr-3">
      {items.map((src) => (
        <div key={src} className="h-28 w-40 shrink-0 overflow-hidden rounded-lg bg-ink-900 md:h-36 md:w-52">
          <FadeImg
            src={src}
            alt=""
            loading="lazy"
            loadedClass="opacity-75"
            className="h-full w-full object-cover transition-opacity duration-300 hover:opacity-100!"
          />
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex overflow-hidden">
      <div
        className={`marquee-track flex w-max ${reverse ? 'marquee-reverse' : ''} ${paused ? 'marquee-paused' : ''}`}
        style={{ ['--marquee-duration' as string]: '160s' }}
      >
        {copy('a')}
        {copy('b')}
      </div>
    </div>
  )
}

/* The full reel, drifting by. The marquee only animates while the section
   is near the viewport; offscreen it pauses so it costs nothing. */
export function Filmstrip() {
  const ref = useRef<HTMLElement>(null)
  const [paused, setPaused] = useState(true)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      (entries) => setPaused(!entries.some((entry) => entry.isIntersecting)),
      { rootMargin: '200px 0px' },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="space-y-3 py-24 md:py-36">
      <p className="mx-auto max-w-7xl px-6 pb-8 text-[11px] font-semibold tracking-[0.4em] text-wine-600 uppercase md:px-10">
        The rest of the photos.
      </p>
      <Row items={ROW_A} paused={paused} />
      <Row items={ROW_B} paused={paused} reverse />
    </section>
  )
}
