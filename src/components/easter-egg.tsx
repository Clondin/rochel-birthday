import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { her, kids } from '../content'
import { celebrate } from '../effects'

/* Type her name, or either kid's, anywhere on the page and the room celebrates. */
export function EasterEgg() {
  const [found, setFound] = useState(false)

  useEffect(() => {
    const secrets = [her.name, ...kids.members.map((k) => k.name)].map((n) => n.toLowerCase())
    const maxLen = Math.max(...secrets.map((s) => s.length))
    let buffer = ''
    let hideTimer: ReturnType<typeof setTimeout>
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return
      buffer = (buffer + e.key.toLowerCase()).slice(-maxLen)
      if (secrets.some((s) => buffer.endsWith(s))) {
        buffer = ''
        celebrate()
        setFound(true)
        clearTimeout(hideTimer)
        hideTimer = setTimeout(() => setFound(false), 3400)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(hideTimer)
    }
  }, [])

  return (
    <AnimatePresence>
      {found && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-8 left-1/2 z-[75] -translate-x-1/2 rounded-full border border-wine-400/40 bg-ink-900/95 px-6 py-3 text-sm whitespace-nowrap text-ivory-50 shadow-[0_10px_40px_rgb(70_50_45/0.25)]"
        >
          You typed the magic word. <span className="font-display text-wine-300 italic">Obviously.</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
