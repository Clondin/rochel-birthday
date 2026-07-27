import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { her, letter } from '../content'
import { FadeImg } from './fade-img'
import { LineReveal } from './line-reveal'

const EASE = [0.16, 1, 0.3, 1] as const

function Word({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>
  range: [number, number]
  children: string
}) {
  const opacity = useTransform(progress, range, [0.5, 1])
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{' '}
    </motion.span>
  )
}

/* Each paragraph lights up word by word as it crosses the viewport. */
function LitParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.45'],
  })
  const words = text.split(' ')

  return (
    <p ref={ref} className="font-display text-2xl leading-snug font-light text-ivory-50 md:text-4xl">
      {reduce
        ? text
        : words.map((word, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {word}
            </Word>
          ))}
    </p>
  )
}

/**
 * Stationery letter: paper sheet with scroll-linked curl, stacked shadow,
 * and a corner fold. Sits next to the sticky headline + polaroid.
 */
export function Letter() {
  const reduce = useReducedMotion()
  const sheetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sheetRef,
    offset: ['start 0.95', 'end 0.35'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })
  const rotateX = useTransform(smooth, [0, 0.35, 1], [12, 4, 0])
  const rotateZ = useTransform(smooth, [0, 1], [-1.2, 0.4])
  const y = useTransform(smooth, [0, 1], [36, 0])
  const shadow = useTransform(
    smooth,
    [0, 1],
    [
      '0 40px 80px rgb(70 50 45 / 0.18), 0 8px 20px rgb(70 50 45 / 0.1)',
      '0 18px 40px rgb(70 50 45 / 0.12), 0 2px 8px rgb(70 50 45 / 0.06)',
    ],
  )
  const curl = useTransform(smooth, [0, 0.5, 1], [1, 0.45, 0])

  return (
    <section
      id="letter"
      className="mx-auto grid max-w-7xl scroll-mt-8 grid-cols-1 gap-12 px-6 py-28 md:grid-cols-[1fr_1.4fr] md:gap-20 md:px-10 md:py-44"
    >
      <div className="md:sticky md:top-28 md:self-start">
        <p className="text-[11px] font-semibold tracking-[0.4em] text-wine-600 uppercase">{letter.label}</p>
        <h2 className="font-display mt-6 text-5xl leading-[1.1] font-light tracking-tight text-ivory-50 italic md:text-7xl">
          <LineReveal>{letter.headline}</LineReveal>
        </h2>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: -3.5 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 110, damping: 15, delay: 0.2 }}
          className="mt-10 w-44 rounded-xl bg-ivory-50 p-2 pb-3 shadow-[0_16px_50px_rgb(70_50_45/0.18)] sm:w-52"
        >
          <FadeImg src={letter.snapshotSrc} alt="" loading="lazy" className="aspect-square w-full rounded-lg object-cover" />
        </motion.div>
      </div>

      <div style={{ perspective: 1400 }} className="md:pt-4">
        <motion.div
          ref={sheetRef}
          style={
            reduce
              ? undefined
              : {
                  rotateX,
                  rotateZ,
                  y,
                  boxShadow: shadow,
                  transformStyle: 'preserve-3d',
                }
          }
          className="letter-sheet relative overflow-hidden rounded-[1.25rem] border border-ivory-50/10 bg-[linear-gradient(165deg,#fbf6ee_0%,#f3e8d8_48%,#efe2d0_100%)] px-7 py-9 sm:px-10 sm:py-12"
        >
          {/* paper tooth / fiber */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
            }}
          />
          {/* ruled lines */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-16 bottom-10 opacity-[0.12]"
            style={{
              backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0 31px, #c9a08a 31px 32px)',
            }}
          />
          {/* corner curl */}
          {!reduce && (
            <motion.div
              aria-hidden
              style={{ opacity: curl, scale: curl }}
              className="letter-curl pointer-events-none absolute -right-1 -bottom-1 h-20 w-20 origin-bottom-right"
            />
          )}

          <div className="relative space-y-8">
            {letter.paragraphs.map((p, i) => (
              <LitParagraph key={i} text={p} />
            ))}
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="pb-1 font-[family-name:var(--font-hand)] text-4xl text-wine-400 md:text-5xl"
            >
              {her.from}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
