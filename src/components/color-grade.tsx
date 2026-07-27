import { useEffect, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

/**
 * Full-page cinematic color grade that shifts as you scroll.
 * Warm gold early → rose mid → deep wine at the end.
 * Overlay only; never blocks interaction.
 */
export function ColorGrade() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const [on, setOn] = useState(true)

  useEffect(() => {
    if (reduce) setOn(false)
  }, [reduce])

  /* Three wash layers crossfade by chapter of the page. */
  const gold = useTransform(scrollYProgress, [0, 0.18, 0.38], [0.22, 0.14, 0])
  const rose = useTransform(scrollYProgress, [0.22, 0.45, 0.68], [0, 0.18, 0.08])
  const wine = useTransform(scrollYProgress, [0.55, 0.78, 1], [0, 0.12, 0.28])
  const vignette = useTransform(scrollYProgress, [0, 0.5, 1], [0.12, 0.18, 0.32])

  if (!on) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[40]">
      <motion.div
        style={{ opacity: gold }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_20%,rgb(255_182_41/0.35),transparent_70%)] mix-blend-soft-light"
      />
      <motion.div
        style={{ opacity: rose }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,rgb(239_75_47/0.28),transparent_65%)] mix-blend-soft-light"
      />
      <motion.div
        style={{ opacity: wine }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_90%,rgb(201_54_32/0.4),transparent_60%)] mix-blend-multiply"
      />
      <motion.div
        style={{ opacity: vignette }}
        className="absolute inset-0 shadow-[inset_0_0_120px_rgb(33_27_26/0.35)]"
      />
    </div>
  )
}
