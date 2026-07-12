import { useRef } from 'react'
import { Confetti } from '@phosphor-icons/react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { her, hero } from '../content'
import { celebrate } from '../effects'
import { FadeImg } from './fade-img'

const EASE = [0.16, 1, 0.3, 1] as const
const T0 = 1.65

function KineticName({ name }: { name: string }) {
  const reduce = useReducedMotion()
  return (
    <span aria-label={name}>
      {name.split('').map((character, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: '112%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: T0 + 0.12 + i * 0.055, ease: EASE }}
          >
            {character}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

function BirthdayRing() {
  const reduce = useReducedMotion()
  return (
    <motion.div
      aria-hidden
      initial={reduce ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, delay: T0 + 0.55, ease: EASE }}
      className="spin-slow pointer-events-none absolute left-1/2 top-1/2 z-[1] w-[94vw] max-w-[640px] -translate-x-1/2 -translate-y-1/2 sm:w-[72vw] lg:w-[48vw]"
    >
      <svg viewBox="0 0 200 200" className="h-auto w-full">
        <defs>
          <path id="birthday-ring" d="M 100,100 m -89,0 a 89,89 0 1,1 178,0 a 89,89 0 1,1 -178,0" />
        </defs>
        <text className="fill-wine-400 text-[8.4px] font-bold uppercase" style={{ letterSpacing: '0.34em' }}>
          <textPath href="#birthday-ring">
            Happy birthday ✶ main event ✶ happy birthday ✶ main event ✶
          </textPath>
        </text>
      </svg>
    </motion.div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const typeX = useSpring(useTransform(mx, [-1, 1], [-12, 12]), { stiffness: 70, damping: 18 })
  const typeY = useSpring(useTransform(my, [-1, 1], [-7, 7]), { stiffness: 70, damping: 18 })
  const photoX = useSpring(useTransform(mx, [-1, 1], [8, -8]), { stiffness: 70, damping: 18 })
  const photoY = useSpring(useTransform(my, [-1, 1], [6, -6]), { stiffness: 70, damping: 18 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 85])
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -105])
  const fade = useTransform(scrollYProgress, [0, 0.72], [1, 0])

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
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 pb-24 pt-20"
    >
      <motion.div
        aria-hidden
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: T0 + 0.05 }}
        className="absolute inset-0"
      >
        <FadeImg
          src={hero.bgSrc}
          alt=""
          fetchPriority="high"
          loadedClass="opacity-25"
          className="h-full w-full scale-105 object-cover blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/42 to-ink-950/85" />
      </motion.div>

      <div aria-hidden className="party-orbit absolute -right-44 -top-52 h-[34rem] w-[34rem] rounded-full border border-wine-400/20" />
      <div aria-hidden className="party-orbit party-orbit-reverse absolute -bottom-56 -left-44 h-[30rem] w-[30rem] rounded-full border border-wine-400/15" />

      <motion.header
        initial={reduce ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: T0 + 0.35 }}
        className="absolute left-5 right-5 top-5 z-20 flex items-center justify-between border-b border-ivory-50/15 pb-4 text-[10px] font-semibold uppercase tracking-[0.26em] sm:left-8 sm:right-8 md:left-10 md:right-10"
      >
        <span>For {her.name}</span>
        <span className="text-wine-400">July 02</span>
        <span>From {her.from}</span>
      </motion.header>

      <BirthdayRing />

      <motion.div
        style={reduce ? undefined : { y: portraitY, scale: portraitScale }}
        className="absolute left-1/2 top-1/2 z-[2] w-[64vw] max-w-[405px] -translate-x-1/2 -translate-y-1/2 sm:w-[46vw] lg:w-[29vw]"
      >
        <motion.div
          style={reduce ? undefined : { x: photoX, y: photoY }}
          initial={reduce ? false : { opacity: 0, scale: 0.94, clipPath: 'inset(100% 0 0 0 round 999px 999px 18px 18px)' }}
          animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0 0 0 round 999px 999px 18px 18px)' }}
          transition={{ duration: 1.15, delay: T0 + 0.18, ease: EASE }}
          className="overflow-hidden rounded-t-full rounded-b-2xl border-[5px] border-ink-950 shadow-[0_30px_90px_rgb(33_27_26/0.2)]"
        >
          <FadeImg
            src={hero.coverSrc}
            alt={`${her.name}, the birthday girl`}
            fetchPriority="high"
            className="ken-burns aspect-[3/4.25] w-full object-cover object-[50%_34%]"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink-950/5 via-ink-950/20 to-ink-950/45" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, rotate: -12, scale: 0.85 }}
        animate={{ opacity: 1, rotate: -7, scale: 1 }}
        transition={{ type: 'spring', stiffness: 95, damping: 16, delay: T0 + 0.72 }}
        className="absolute left-[5vw] top-[22%] z-[3] hidden w-36 overflow-hidden rounded-xl border-[5px] border-ink-950 bg-ink-900 shadow-[0_20px_55px_rgb(33_27_26/0.18)] md:block lg:left-[11vw] lg:w-44"
      >
        <FadeImg src="/photos/optimized/p57.webp" alt="Rochel on her wedding day" fetchPriority="high" className="aspect-[4/5] w-full object-cover" />
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, rotate: 11, scale: 0.85 }}
        animate={{ opacity: 1, rotate: 6, scale: 1 }}
        transition={{ type: 'spring', stiffness: 95, damping: 16, delay: T0 + 0.86 }}
        className="absolute bottom-[16%] right-[5vw] z-[3] hidden w-36 overflow-hidden rounded-xl border-[5px] border-ink-950 bg-ink-900 shadow-[0_20px_55px_rgb(33_27_26/0.18)] md:block lg:right-[11vw] lg:w-44"
      >
        <FadeImg src="/photos/optimized/p23.webp" alt="A family favorite" fetchPriority="high" className="aspect-square w-full object-cover" />
      </motion.div>

      <motion.div style={reduce ? undefined : { y: nameY, opacity: fade }} className="pointer-events-none relative z-10 text-center">
        <motion.div style={reduce ? undefined : { x: typeX, y: typeY }}>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: T0 + 0.55 }}
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.42em] text-wine-400 sm:text-xs"
          >
            {hero.eyebrow}
          </motion.p>
          <h1 className="font-display font-wonk pb-3 text-[clamp(4.8rem,17vw,14rem)] font-light italic leading-[0.9] tracking-[-0.045em] text-ivory-50 drop-shadow-[0_2px_12px_rgb(247_241_232/0.7)]">
            <KineticName name={her.name} />
          </h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: T0 + 0.9, ease: EASE }}
            className="font-display mx-auto max-w-sm pb-1 text-xl font-semibold italic leading-[1.15] text-ivory-50 drop-shadow-[0_2px_10px_rgb(247_241_232/0.95)] sm:text-2xl"
          >
            {hero.sub}
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.button
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: T0 + 1.05, ease: EASE }}
        onClick={celebrate}
        className="absolute bottom-6 z-20 inline-flex items-center gap-2 rounded-full bg-wine-400 px-6 py-3.5 text-sm font-bold text-ivory-50 shadow-[0_14px_40px_rgb(239_75_47/0.2)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
      >
        <Confetti size={18} weight="bold" />
        Start the party
      </motion.button>
    </section>
  )
}
