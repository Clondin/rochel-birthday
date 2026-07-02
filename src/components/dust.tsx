import { useMemo } from 'react'

type Speck = {
  left: string
  size: number
  duration: string
  delay: string
  sway: string
  opacity: string
  blur: number
  wine: boolean
}

/* Candle dust: tiny specks drifting upward. CSS-driven, transform/opacity
   only, disabled entirely under prefers-reduced-motion (see index.css). */
export function Dust({ count = 14 }: { count?: number }) {
  const specks = useMemo<Speck[]>(
    () =>
      Array.from({ length: count }, () => ({
        left: `${Math.random() * 100}%`,
        size: 2 + Math.random() * 3,
        duration: `${11 + Math.random() * 12}s`,
        delay: `${-Math.random() * 22}s`,
        sway: `${(Math.random() - 0.5) * 8}vw`,
        opacity: `${0.12 + Math.random() * 0.25}`,
        blur: Math.random() > 0.5 ? 1.5 : 0,
        wine: Math.random() > 0.65,
      })),
    [count],
  )

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {specks.map((s, i) => (
        <span
          key={i}
          className={`dust absolute bottom-0 rounded-full ${s.wine ? 'bg-wine-300' : 'bg-ivory-50'}`}
          style={{
            left: s.left,
            width: s.size,
            height: s.size,
            filter: s.blur ? `blur(${s.blur}px)` : undefined,
            ['--dust-duration' as string]: s.duration,
            ['--dust-delay' as string]: s.delay,
            ['--dust-sway' as string]: s.sway,
            ['--dust-opacity' as string]: s.opacity,
          }}
        />
      ))}
    </div>
  )
}
