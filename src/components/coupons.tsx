import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import confetti from 'canvas-confetti'
import { coupons } from '../content'
import { LineReveal } from './line-reveal'

const EASE = [0.16, 1, 0.3, 1] as const
const STORAGE_KEY = 'rochel-claimed-vouchers'

function loadClaims(): number[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

/**
 * Ticket strip: horizontally scrollable vouchers she can actually claim.
 * Claims are stamped and persist in localStorage.
 */
export function Coupons() {
  const reduce = useReducedMotion()
  const [claimed, setClaimed] = useState<number[]>(loadClaims)

  function claim(i: number, e: React.MouseEvent) {
    if (claimed.includes(i)) return
    const next = [...claimed, i]
    setClaimed(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* private mode, claims just won't persist */
    }
    confetti({
      colors: ['#c25e6e', '#d98a97', '#f4ede7'],
      disableForReducedMotion: true,
      particleCount: 24,
      spread: 60,
      startVelocity: 28,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
    })
  }

  return (
    <section className="py-28 md:py-44">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <p className="text-[11px] font-semibold tracking-[0.4em] text-wine-300 uppercase">{coupons.label}</p>
        <h2 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] font-light tracking-tight md:text-7xl">
          <LineReveal>
            The <span className="text-wine-300 italic">vouchers.</span>
          </LineReveal>
        </h2>
        <p className="mt-5 text-ivory-500">{coupons.sub}</p>
      </div>

      <div className="mt-14 flex snap-x gap-6 overflow-x-auto px-6 pb-6 md:mt-20 md:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]">
        {coupons.items.map((coupon, i) => {
          const isClaimed = claimed.includes(i)
          return (
            <motion.button
              key={coupon.title}
              onClick={(e) => claim(i, e)}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={reduce || isClaimed ? undefined : { y: -6 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
              aria-pressed={isClaimed}
              className={`relative flex h-56 w-72 shrink-0 snap-center flex-col justify-between rounded-2xl border border-dashed p-7 text-left transition-colors duration-300 ${
                isClaimed
                  ? 'cursor-default border-wine-400/50 bg-ink-900/60'
                  : 'cursor-pointer border-ivory-50/25 bg-ink-900 hover:border-wine-400/50'
              }`}
            >
              <span className="text-[10px] font-semibold tracking-[0.3em] text-ivory-500 uppercase">Voucher</span>
              <span>
                <span
                  className={`font-display block pb-1 text-2xl leading-[1.2] font-light italic ${
                    isClaimed ? 'text-ivory-500' : 'text-ivory-50'
                  }`}
                >
                  {coupon.title}
                </span>
                <span className="mt-2 block text-sm text-ivory-500">{coupon.detail}</span>
              </span>
              <span className="text-[10px] tracking-[0.25em] text-ivory-500 uppercase">
                {isClaimed ? 'Redeemed' : 'Valid forever, tap to claim'}
              </span>

              {isClaimed && (
                <motion.span
                  initial={reduce ? false : { scale: 2.2, opacity: 0, rotate: -4 }}
                  animate={{ scale: 1, opacity: 1, rotate: -12 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="absolute top-5 right-5 rounded border-2 border-wine-400 px-2 py-0.5 text-[11px] font-bold tracking-[0.2em] text-wine-300 uppercase"
                >
                  Claimed
                </motion.span>
              )}
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
