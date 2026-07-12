import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const FLASHES = ['/photos/p45.jpg', '/photos/p24.jpg', '/photos/p57.jpg', '/photos/p34.jpg']

export function Intro() {
  const reduce = useReducedMotion()
  const [done, setDone] = useState(false)
  if (reduce || done) return null

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: '-100%' }}
      transition={{ duration: 0.78, delay: 1.45, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => setDone(true)}
      className="fixed inset-0 z-[80] overflow-hidden bg-ivory-50"
    >
      {FLASHES.map((src, i) => (
        <motion.img
          key={src}
          src={src}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.92, 0], scale: [1.08, 1.02, 1] }}
          transition={{ duration: 0.26, delay: 0.38 + i * 0.23, times: [0, 0.35, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ))}
      <div aria-hidden className="absolute inset-0 bg-ivory-50/35" />
      <div className="relative flex h-full items-center justify-center overflow-hidden px-4">
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 1.08] }}
          transition={{ duration: 1.35, times: [0, 0.2, 0.76, 1], ease: [0.16, 1, 0.3, 1] }}
          className="text-center text-[clamp(3.5rem,13vw,10rem)] font-black uppercase leading-[0.78] tracking-[-0.07em] text-ink-950"
        >
          Birthday<br />mode
        </motion.p>
      </div>
    </motion.div>
  )
}
