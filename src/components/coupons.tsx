import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { coupons } from '../content'
import { spark } from '../effects'
import { LineReveal } from './line-reveal'

const EASE = [0.16, 1, 0.3, 1] as const
const STORAGE_KEY = 'rochel-claimed-vouchers'

type Shard = { id: number; x: number; y: number; r: number; dx: number; dy: number; rot: number }

function loadClaims(): number[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function makeShards(): Shard[] {
  return Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: 30 + Math.random() * 40,
    y: 20 + Math.random() * 50,
    r: 6 + Math.random() * 14,
    dx: (Math.random() - 0.5) * 220,
    dy: -40 - Math.random() * 180,
    rot: (Math.random() - 0.5) * 480,
  }))
}

/**
 * Glass vouchers: frosted cards with specular swipe.
 * Claim shatters the card into shards, then stamps Redeemed.
 */
export function Coupons() {
  const reduce = useReducedMotion()
  const [claimed, setClaimed] = useState<number[]>(loadClaims)
  const [shattering, setShattering] = useState<number | null>(null)
  const [shards, setShards] = useState<Shard[]>([])
  const strip = useRef<HTMLDivElement>(null)
  const [dragW, setDragW] = useState(0)
  const [finePointer] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches,
  )

  useEffect(() => {
    const el = strip.current
    if (!el) return
    const measure = () =>
      setDragW(Math.max(0, el.scrollWidth - (el.parentElement?.clientWidth ?? window.innerWidth)))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  function claim(i: number, e: React.MouseEvent) {
    if (claimed.includes(i) || shattering !== null) return
    spark(e.clientX, e.clientY, 28)

    if (reduce) {
      const next = [...claimed, i]
      setClaimed(next)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* private mode */
      }
      return
    }

    setShattering(i)
    setShards(makeShards())
    window.setTimeout(() => {
      const next = [...claimed, i]
      setClaimed(next)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* private mode */
      }
      setShattering(null)
      setShards([])
    }, 720)
  }

  return (
    <section className="py-28 md:py-44">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <p className="text-[11px] font-semibold tracking-[0.4em] text-wine-600 uppercase">{coupons.label}</p>
        <h2 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] font-light tracking-tight md:text-7xl">
          <LineReveal>
            No <span className="text-wine-300 italic">expiration dates.</span>
          </LineReveal>
        </h2>
        <p className="mt-5 text-ivory-500">{coupons.sub}</p>
      </div>

      <div className="mt-14 snap-x overflow-x-auto pb-6 md:mt-20 md:snap-none md:overflow-hidden">
        <motion.div
          ref={strip}
          drag={finePointer && !reduce ? 'x' : false}
          dragConstraints={{ left: -dragW, right: 0 }}
          dragElastic={0.08}
          className="flex w-max gap-6 px-6 md:cursor-grab md:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] md:active:cursor-grabbing"
        >
          {coupons.items.map((coupon, i) => {
            const isClaimed = claimed.includes(i)
            const isShattering = shattering === i
            return (
              <motion.button
                key={coupon.title}
                data-cursor="press"
                onClick={(e) => claim(i, e)}
                initial={reduce ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={reduce || isClaimed ? undefined : { y: -8, scale: 1.02 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
                aria-pressed={isClaimed}
                className={`glass-card group relative flex h-64 w-72 shrink-0 snap-center flex-col justify-between overflow-hidden rounded-2xl border border-t-4 p-7 text-left shadow-[0_18px_50px_rgb(33_27_26/0.1)] transition-[border-color,background] duration-300 ${
                  isClaimed
                    ? 'cursor-default border-wine-400/40 border-t-wine-400/70 bg-ink-900/50'
                    : 'cursor-pointer border-ivory-50/25 border-t-wine-400 bg-ink-900/55 hover:border-wine-400/45'
                }`}
              >
                {/* glass fill + specular swipe */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgb(247_241_232/0.22)_0%,rgb(247_241_232/0.04)_42%,rgb(239_75_47/0.06)_100%)] backdrop-blur-[2px]"
                />
                <span
                  aria-hidden
                  className="glass-sheen pointer-events-none absolute -inset-y-8 -left-1/2 w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                <span aria-hidden className="absolute left-[-9px] top-1/2 z-[1] h-[18px] w-[18px] -translate-y-1/2 rounded-full bg-ink-950" />
                <span aria-hidden className="absolute right-[-9px] top-1/2 z-[1] h-[18px] w-[18px] -translate-y-1/2 rounded-full bg-ink-950" />

                <span className="relative z-[1] text-[10px] font-semibold tracking-[0.3em] text-ivory-500 uppercase">
                  Voucher
                </span>
                <span className="relative z-[1]">
                  <span
                    className={`font-display block pb-1 text-2xl leading-[1.2] font-light italic ${
                      isClaimed ? 'text-ivory-500' : 'text-ivory-50'
                    }`}
                  >
                    {coupon.title}
                  </span>
                  <span className="mt-2 block text-sm text-ivory-500">{coupon.detail}</span>
                </span>
                <span className="relative z-[1] text-[10px] tracking-[0.25em] text-ivory-500 uppercase">
                  {isClaimed ? 'Redeemed' : 'Valid forever, tap to claim'}
                </span>

                {isClaimed && (
                  <motion.span
                    initial={reduce ? false : { scale: 2.2, opacity: 0, rotate: -4 }}
                    animate={{ scale: 1, opacity: 1, rotate: -12 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="absolute top-5 right-5 z-[2] rounded border-2 border-wine-400 px-2 py-0.5 text-[11px] font-bold tracking-[0.2em] text-wine-300 uppercase"
                  >
                    Claimed
                  </motion.span>
                )}

                {/* shatter shards */}
                <AnimatePresence>
                  {isShattering &&
                    shards.map((s) => (
                      <motion.span
                        key={s.id}
                        aria-hidden
                        initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                        animate={{
                          opacity: 0,
                          x: s.dx,
                          y: s.dy,
                          rotate: s.rot,
                          scale: 0.4,
                        }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="pointer-events-none absolute z-[3] rounded-sm bg-gradient-to-br from-white/70 to-wine-400/40"
                        style={{
                          left: `${s.x}%`,
                          top: `${s.y}%`,
                          width: s.r,
                          height: s.r * (0.6 + Math.random() * 0.8),
                        }}
                      />
                    ))}
                </AnimatePresence>

                {isShattering && (
                  <motion.span
                    aria-hidden
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.45 }}
                    className="pointer-events-none absolute inset-0 z-[2] bg-white/40"
                  />
                )}
              </motion.button>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
