import { FadeImg } from './fade-img'

/* Every photo in the pool, p01..p65. */
const ALL = Array.from({ length: 65 }, (_, i) => `/photos/p${String(i + 1).padStart(2, '0')}.jpg`)
const ROW_A = ALL.slice(0, 33)
const ROW_B = ALL.slice(33)

function Row({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
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
        className={`marquee-track flex w-max ${reverse ? 'marquee-reverse' : ''}`}
        style={{ ['--marquee-duration' as string]: '160s' }}
      >
        {copy('a')}
        {copy('b')}
      </div>
    </div>
  )
}

/* The full reel, drifting by. */
export function Filmstrip() {
  return (
    <section className="space-y-3 py-24 md:py-36">
      <p className="mx-auto max-w-7xl px-6 pb-8 text-[11px] font-semibold tracking-[0.4em] text-wine-300 uppercase md:px-10">
        All 65. Because picking favorites failed.
      </p>
      <Row items={ROW_A} />
      <Row items={ROW_B} reverse />
    </section>
  )
}
