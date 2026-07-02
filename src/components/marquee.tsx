import { her } from '../content'

const PHRASES = ['Happy birthday', her.name, 'Happy birthday', her.name]

function Band({ reverse = false, italic = false }: { reverse?: boolean; italic?: boolean }) {
  /* Content duplicated once; the track slides exactly one copy's width. */
  const copy = (key: string) => (
    <div key={key} aria-hidden={key === 'b'} className="flex shrink-0 items-center">
      {PHRASES.map((phrase, i) => (
        <span key={i} className="flex shrink-0 items-center">
          <span
            className={`font-display px-8 text-5xl font-light tracking-tight whitespace-nowrap md:px-12 md:text-7xl ${
              italic ? 'pb-2 text-ivory-500 italic' : 'text-ivory-50'
            }`}
          >
            {phrase}
          </span>
          <span className="text-xl text-wine-400 md:text-2xl">&#10038;</span>
        </span>
      ))}
    </div>
  )

  return (
    <div className="flex overflow-hidden border-y border-ivory-50/8 py-5 md:py-7">
      <div
        className={`marquee-track flex w-max ${reverse ? 'marquee-reverse' : ''}`}
        style={{ ['--marquee-duration' as string]: '36s' }}
      >
        {copy('a')}
        {copy('b')}
      </div>
    </div>
  )
}

export function Marquee() {
  return (
    <section className="py-10 md:py-16">
      <Band />
      <Band reverse italic />
    </section>
  )
}
