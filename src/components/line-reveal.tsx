import { motion, useReducedMotion } from 'motion/react'

const EASE = [0.16, 1, 0.3, 1] as const

/* Masked line reveal: text slides up out of an overflow-hidden band. */
export function LineReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block pb-[0.14em]"
        initial={reduce ? false : { y: '110%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}
