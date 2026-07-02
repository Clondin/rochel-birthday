import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { her, hero } from '../content'
import { Dust } from './dust'

const EASE = [0.16, 1, 0.3, 1] as const
/* Hold entrance animations until the intro curtain lifts. */
const T0 = 1.7

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

/* A slow-spinning ring of type circling the portrait. */
function BirthdayRing({ delay }: { delay: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      aria-hidden
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay }}
      className="spin-slow pointer-events-none absolute top-1/2 left-1/2 z-0 w-[86vw] max-w-130 -translate-x-1/2 -translate-y-1/2 sm:w-[58vw] md:w-[40vw]"
    >
      <svg viewBox="0 0 200 200" className="h-auto w-full">
        <defs>
          <path id="birthday-ring" d="M 100,100 m -90,0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0" />
        </defs>
        <text className="fill-ivory-500/60 text-[8.5px] font-semibold uppercase" style={{ letterSpacing: '0.4em' }}>
          <textPath href="#birthday-ring">
            Happy birthday &#10038; Happy birthday &#10038; Happy birthday &#10038;
          </textPath>
        </text>
      </svg>
    </motion.div>
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

  /* Scroll-out parallax: the portrait sinks and swells, the name lifts away. */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 110])
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.14])
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -160])
  const fade = useTransform(scrollYProgress, [0, 0.65], [1, 0])

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
      <Dust count={16} />

      {/* top strip */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: T0 + 1.3 }}
        className="absolute top-0 right-0 left-0 flex items-center justify-between px-6 py-6 text-[11px] font-medium tracking-[0.3em] text-ivory-500 uppercase md:px-10"
      >
        <span>For {her.name}</span>
        <span>From {her.from}</span>
      </motion.div>

      <BirthdayRing delay={T0 + 1.6} />

      {/* arched portrait */}
      <motion.div
        style={reduce ? undefined : { y: photoY, scale: photoScale }}
        className="absolute top-1/2 left-1/2 z-[1] w-[60vw] max-w-85 -translate-x-1/2 -translate-y-1/2 sm:w-[40vw] md:w-[26vw]"
      >
        <motion.div
          style={reduce ? undefined : { x: imgX, y: imgY }}
          initial={reduce ? false : { opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: T0 + 0.4, ease: EASE }}
        >
          <div className="relative overflow-hidden rounded-t-full rounded-b-[2.5rem]">
            <img
              src={hero.coverSrc}
              alt={her.name}
              fetchPriority="high"
              className="ken-burns aspect-[3/4.2] w-full object-cover"
            />
            {/* scrim keeps the name readable where it crosses the photo */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-t-full rounded-b-[2.5rem] bg-gradient-to-b from-ink-950/80 via-ink-950/10 to-ink-950/75"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* the name */}
      <motion.div style={reduce ? undefined : { y: nameY, opacity: fade }} className="pointer-events-none relative z-10">
        <motion.div style={reduce ? undefined : { x: typeX, y: typeY }} className="text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: T0 + 1.1 }}
            className="mb-3 text-[11px] font-semibold tracking-[0.45em] text-wine-300 uppercase md:text-xs"
          >
            {hero.eyebrow}
          </motion.p>
          <h1 className="font-display font-wonk text-[clamp(4.5rem,17vw,15rem)] leading-[1.05] font-light tracking-[-0.02em] text-ivory-50 italic">
            <KineticName name={her.name} delay={T0 + 0.2} />
          </h1>
        </motion.div>
      </motion.div>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: T0 + 1.5, ease: EASE }}
        className="relative z-10 mt-8 max-w-sm text-center text-base text-ivory-300 md:text-lg"
      >
        {hero.sub}
      </motion.p>
    </section>
  )
}
