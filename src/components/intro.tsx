import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { her } from '../content'

/* Opening curtain: a beat of ink with her dedication, then it lifts. */
export function Intro() {
  const reduce = useReducedMotion()
  const [done, setDone] = useState(false)

  if (reduce || done) return null

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: '-100%' }}
      transition={{ duration: 1, delay: 1.6, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => setDone(true)}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-950"
    >
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="font-display pb-2 text-3xl font-light text-ivory-50 italic md:text-5xl"
      >
        For {her.name} <span className="not-italic text-wine-300">&#10038;</span>
      </motion.p>
    </motion.div>
  )
}
