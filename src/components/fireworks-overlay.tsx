import { useEffect, useRef, useState } from 'react'

export function FireworksOverlay() {
  const video = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const launch = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const element = video.current
      if (!element) return
      setActive(true)
      element.currentTime = 0
      void element.play()
    }
    window.addEventListener('birthday-fireworks', launch)
    return () => window.removeEventListener('birthday-fireworks', launch)
  }, [])

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[90] overflow-hidden transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}
    >
      <video
        ref={video}
        muted
        playsInline
        preload="auto"
        onEnded={() => setActive(false)}
        className="h-full w-full object-cover [filter:drop-shadow(0_0_4px_rgba(255,181,89,0.7))_drop-shadow(0_0_12px_rgba(239,75,47,0.22))]"
      >
        <source src="/video/birthday-fireworks.webm" type="video/webm" />
      </video>
    </div>
  )
}
