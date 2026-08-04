import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'

const VIDEO_SRC = '/video/envelope-transition.mp4?v=cinematic-6'
const POSTER_SRC = '/video/envelope-transition-poster.webp?v=cinematic-6'

export function EnvelopeTransition() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const seekFrameRef = useRef<number | null>(null)
  const durationRef = useRef(8)
  const reduce = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 639px)').matches)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 639px)')
    const update = () => setMobile(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  /* Don't fetch megabytes of video while the hero is still painting;
     start loading once the section is within ~1.5 viewports. */
  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        setShouldLoad(true)
        observer.disconnect()
      },
      { rootMargin: '1600px 0px' },
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !shouldLoad) return
    setReady(false)
    video.load()
  }, [shouldLoad])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
    restDelta: 0.0005,
  })
  // Brief calm at both ends; the middle remains direct enough to feel tactile.
  const timeline = useTransform(smoothProgress, [0, 0.07, 0.9, 1], [0, 0, 0.965, 1])
  const finalPaper = useTransform(smoothProgress, [0.93, 1], [0, 1])

  useMotionValueEvent(timeline, 'change', (progress) => {
    const video = videoRef.current
    if (!video || !ready || reduce) return
    if (seekFrameRef.current !== null) cancelAnimationFrame(seekFrameRef.current)
    seekFrameRef.current = requestAnimationFrame(() => {
      const target = Math.min(durationRef.current - 0.025, Math.max(0, progress * durationRef.current))
      /* Only seek once we're a full frame (24fps) off — each seek costs a decode burst. */
      if (Math.abs(video.currentTime - target) > 1 / 24) video.currentTime = target
    })
  })

  useEffect(
    () => () => {
      if (seekFrameRef.current !== null) cancelAnimationFrame(seekFrameRef.current)
    },
    [],
  )

  // The cinematic envelope is intentionally a desktop-only moment. Returning
  // before the media markup is created keeps phones from downloading it.
  if (mobile) return null

  if (reduce) {
    return (
      <section aria-label="A sealed envelope for Rochel" className="bg-ink-950 px-5 py-12 sm:py-16">
        <img
          src={POSTER_SRC}
          alt="An ivory envelope with a coral C plus R wax seal"
          className="mx-auto aspect-video w-full max-w-5xl rounded-[1.5rem] object-cover shadow-[0_24px_80px_rgb(33_27_26/0.14)]"
        />
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      aria-label="An envelope opens to reveal a letter for Rochel"
      className="relative h-[280dvh] bg-ink-950 sm:h-[360dvh] lg:h-[420dvh]"
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden bg-ink-950">
        <video
          ref={videoRef}
          poster={POSTER_SRC}
          preload="none"
          muted
          playsInline
          aria-hidden="true"
          onLoadedMetadata={(event) => {
            const video = event.currentTarget
            durationRef.current = video.duration || 8
            video.pause()
            // Respect restored scroll positions instead of flashing frame zero.
            video.currentTime = Math.min(durationRef.current - 0.025, timeline.get() * durationRef.current)
            setReady(true)
          }}
          className="h-full w-full object-cover object-center"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>

        {!ready && <div aria-hidden className="pointer-events-none absolute inset-0 animate-pulse bg-ink-900/10" />}
        <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgb(33_27_26/0.12)] sm:shadow-[inset_0_0_180px_rgb(33_27_26/0.13)]" />
        <motion.div aria-hidden style={{ opacity: finalPaper }} className="pointer-events-none absolute inset-0 bg-ink-950" />
      </div>
    </section>
  )
}
