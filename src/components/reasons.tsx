import { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { reasons } from '../content'
import { LineReveal } from './line-reveal'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * The list: big rows, and on desktop a photo that trails the cursor
 * while a row is hovered. Mobile shows inline thumbnails instead.
 */
export function Reasons() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const [active, setActive] = useState<number | null>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 22 })
  const sy = useSpring(y, { stiffness: 180, damping: 22 })
  /* The photo leans into its own movement. */
  const tilt = useSpring(useTransform(useVelocity(sx), [-1400, 1400], [-9, 9]), {
    stiffness: 220,
    damping: 28,
  })

  function onMouseMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set(e.clientX - r.left)
    y.set(e.clientY - r.top)
  }

  return (
    <section
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setActive(null)}
      className="relative mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-44"
    >
      <p className="text-[11px] font-semibold tracking-[0.4em] text-wine-300 uppercase">The list</p>
      <h2 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] font-light tracking-tight md:text-7xl">
        <LineReveal>
          Reasons, <span className="text-wine-300 italic">abridged.</span>
        </LineReveal>
      </h2>

      {/* cursor-trailing photo (desktop only) */}
      <AnimatePresence>
        {!reduce && active !== null && (
          <motion.div
            key={active}
            style={{ x: sx, y: sy, rotate: tilt }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="pointer-events-none absolute top-0 left-0 z-10 hidden md:block"
          >
            <img
              src={reasons[active].src}
              alt=""
              className="w-60 -translate-x-1/2 -translate-y-1/2 rounded-3xl object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-16 md:mt-24">
        {reasons.map((reason, i) => (
          <motion.div
            key={reason.title}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
            onMouseEnter={(e) => {
              if (active === null && ref.current) {
                const r = ref.current.getBoundingClientRect()
                x.jump(e.clientX - r.left)
                y.jump(e.clientY - r.top)
              }
              setActive(i)
            }}
            className="group grid grid-cols-1 items-center gap-4 border-t border-ivory-50/8 py-8 last:border-b md:grid-cols-[auto_1fr_auto] md:gap-10 md:py-10"
          >
            <img
              src={reason.src}
              alt=""
              loading="lazy"
              className="h-20 w-16 rounded-xl object-cover md:hidden"
            />
            <h3 className="font-display pb-1 text-4xl leading-[1.15] font-light tracking-tight transition-all duration-300 group-hover:translate-x-2 group-hover:text-wine-300 group-hover:italic md:text-6xl">
              {reason.title}
            </h3>
            <div />
            <p className="text-base text-ivory-500 transition-colors duration-300 group-hover:text-ivory-300 md:text-lg">
              {reason.phrase}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
