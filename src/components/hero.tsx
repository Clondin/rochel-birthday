import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { her, hero } from '../content'

const EASE = [0.16, 1, 0.3, 1] as const

function KineticName({ name, delay = 0 }: { name: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <span aria-label={name}>
      {name.split('').map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: '115%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: delay + i * 0.06, ease: EASE }}
          >
            {ch}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  /* Cursor parallax: type and portrait drift on opposite vectors. */
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const typeX = useSpring(useTransform(mx, [-1, 1], [-12, 12]), { stiffness: 60, damping: 18 })
  const typeY = useSpring(useTransform(my, [-1, 1], [-8, 8]), { stiffness: 60, damping: 18 })
  const imgX = useSpring(useTransform(mx, [-1, 1], [9, -9]), { stiffness: 60, damping: 18 })
  const imgY = useSpring(useTransform(my, [-1, 1], [7, -7]), { stiffness: 60, damping: 18 })

  function onMouseMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1)
    my.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }

  return (
    <section
      ref={ref}
      onMouseMove={onMouseMove}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4"
    >
      {/* soft candlelight behind everything */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 42% at 50% 52%, rgb(194 94 110 / 0.13), transparent 70%)',
        }}
      />

      {/* top strip */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.3 }}
        className="absolute top-0 right-0 left-0 flex items-center justify-between px-6 py-6 text-[11px] font-medium tracking-[0.3em] text-ivory-500 uppercase md:px-10"
      >
        <span>For {her.name}</span>
        <span>From {her.from}</span>
      </motion.div>

      {/* arched portrait */}
      <motion.div
        style={reduce ? undefined : { x: imgX, y: imgY }}
        initial={reduce ? false : { opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.4, ease: EASE }}
        className="absolute top-1/2 left-1/2 w-[60vw] max-w-85 -translate-x-1/2 -translate-y-1/2 sm:w-[40vw] md:w-[26vw]"
      >
        <div className="overflow-hidden rounded-t-full rounded-b-[2.5rem]">
          <img src={hero.coverSrc} alt={her.name} className="aspect-[3/4.2] w-full object-cover" />
          {/* scrim keeps the name readable where it crosses the photo */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-t-full rounded-b-[2.5rem] bg-gradient-to-b from-ink-950/80 via-ink-950/10 to-ink-950/75"
          />
        </div>
      </motion.div>

      {/* the name */}
      <motion.div style={reduce ? undefined : { x: typeX, y: typeY }} className="pointer-events-none relative z-10 text-center">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="mb-3 text-[11px] font-semibold tracking-[0.45em] text-wine-300 uppercase md:text-xs"
        >
          {hero.eyebrow}
        </motion.p>
        <h1 className="font-display text-[clamp(4.5rem,17vw,15rem)] leading-[1.05] font-light tracking-[-0.02em] text-ivory-50 italic">
          <KineticName name={her.name} delay={0.2} />
        </h1>
      </motion.div>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.5, ease: EASE }}
        className="relative z-10 mt-8 max-w-sm text-center text-base text-ivory-300 md:text-lg"
      >
        {hero.sub}
      </motion.p>
    </section>
  )
}
