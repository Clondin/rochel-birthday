import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { interlude } from '../content'
import { FadeImg } from './fade-img'

/* A silent full-screen photograph gives the page room to breathe. */
export function Interlude() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1])

  return (
    <section ref={ref} aria-label={interlude.alt} className="relative min-h-[100dvh] overflow-hidden">
      <motion.div style={reduce ? undefined : { scale }} className="absolute inset-0">
        <FadeImg
          src={interlude.src}
          alt={interlude.alt}
          loading="lazy"
          loadedClass="opacity-100"
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ink-950/12 via-transparent to-ink-950/32"
      />
    </section>
  )
}
