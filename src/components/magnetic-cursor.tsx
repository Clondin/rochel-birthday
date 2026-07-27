import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

type Mode = 'default' | 'seal' | 'press'

/**
 * Custom cursor: laggy wine blob that stretches with velocity.
 * Over [data-cursor="seal"] it becomes a wax-seal stamp.
 * Fine pointer only; respects reduced motion.
 */
export function MagneticCursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [mode, setMode] = useState<Mode>('default')
  const [visible, setVisible] = useState(false)
  const modeRef = useRef<Mode>('default')

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 280, damping: 28, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 280, damping: 28, mass: 0.35 })
  const scale = useSpring(1, { stiffness: 260, damping: 22 })
  const stretchX = useSpring(1, { stiffness: 200, damping: 18 })
  const stretchY = useSpring(1, { stiffness: 200, damping: 18 })

  useEffect(() => {
    if (reduce) return
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return
    setEnabled(true)
    document.documentElement.classList.add('has-magnetic-cursor')

    let prevX = 0
    let prevY = 0
    let prevT = performance.now()

    const onMove = (e: MouseEvent) => {
      const now = performance.now()
      const dt = Math.max(8, now - prevT)
      const vx = (e.clientX - prevX) / dt
      const vy = (e.clientY - prevY) / dt
      const speed = Math.min(1.8, Math.hypot(vx, vy) * 14)
      prevX = e.clientX
      prevY = e.clientY
      prevT = now

      x.set(e.clientX)
      y.set(e.clientY)
      const sxv = 1 + speed * 0.35
      stretchX.set(sxv)
      stretchY.set(1 / Math.max(0.7, Math.sqrt(sxv)))
      setVisible(true)

      const el = (e.target as Element | null)?.closest?.('[data-cursor]') as HTMLElement | null
      const kind = el?.dataset.cursor
      let next: Mode = 'default'
      if (kind === 'seal') next = 'seal'
      else if (kind === 'press') next = 'press'
      modeRef.current = next
      setMode(next)
    }

    const onDown = () => {
      scale.set(modeRef.current === 'seal' ? 0.82 : 0.72)
    }
    const onUp = () => scale.set(1)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      document.documentElement.classList.remove('has-magnetic-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [reduce, x, y, scale, stretchX, stretchY])

  if (!enabled || reduce) return null

  const isSeal = mode === 'seal' || mode === 'press'

  return (
    <motion.div
      aria-hidden
      style={{
        x: sx,
        y: sy,
        scale,
        scaleX: stretchX,
        scaleY: stretchY,
      }}
      className="pointer-events-none fixed top-0 left-0 z-[100] mix-blend-multiply"
    >
      <motion.div
        animate={{
          opacity: visible ? 1 : 0,
          width: isSeal ? 52 : 18,
          height: isSeal ? 52 : 18,
          marginLeft: isSeal ? -26 : -9,
          marginTop: isSeal ? -26 : -9,
          backgroundColor: isSeal ? 'rgb(239 75 47)' : 'rgb(239 75 47 / 0.55)',
          boxShadow: isSeal
            ? '0 10px 28px rgb(239 75 47 / 0.35), inset 0 1px 0 rgb(247 241 232 / 0.3)'
            : '0 0 0 0 transparent',
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        className="relative flex items-center justify-center rounded-full text-ink-950"
      >
        {isSeal && <span className="text-sm font-bold leading-none select-none">&#10038;</span>}
      </motion.div>
    </motion.div>
  )
}
