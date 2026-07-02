import { motion, useScroll, useSpring } from 'motion/react'

/* Hairline scroll progress across the top of the page. */
export function ProgressLine() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed top-0 right-0 left-0 z-[60] h-[2px] origin-left bg-wine-400/80"
    />
  )
}
