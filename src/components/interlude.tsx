import { useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowClockwise, SpeakerHigh } from '@phosphor-icons/react'
import { interlude } from '../content'
import { FadeImg } from './fade-img'

/**
 * The quiet photograph between the galleries. When it scrolls into view,
 * a video message pops out big over it and plays with sound. Browsers only
 * allow unmuted autoplay after the page has been interacted with — if the
 * attempt is blocked, a play button appears so the sound starts on tap.
 */
export function Interlude() {
  const ref = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()
  const [popped, setPopped] = useState(false)
  const [needsTap, setNeedsTap] = useState(false)
  const [ended, setEnded] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1])

  /* Always autoplay: try with sound first; if the browser blocks unmuted
     autoplay (no interaction yet), play muted and offer an unmute button
     that restarts the message from the top with sound. */
  const tryPlay = () => {
    const video = videoRef.current
    if (!video) return
    setEnded(false)
    video.currentTime = 0
    video.muted = false
    video
      .play()
      .then(() => setNeedsTap(false))
      .catch(() => {
        video.muted = true
        void video.play().catch(() => {})
        setNeedsTap(true)
      })
  }

  /* Reduced motion: photo with the video sitting quietly on top, native controls. */
  if (reduce) {
    return (
      <section aria-label={interlude.alt} className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
        <img src={interlude.src} alt={interlude.alt} className="absolute inset-0 h-full w-full object-cover" />
        <div aria-hidden className="absolute inset-0 bg-ivory-50/40" />
        <figure className="relative z-10 text-center">
          <video
            src={interlude.video.src}
            controls
            playsInline
            preload="metadata"
            className="h-[60vh] rounded-2xl shadow-[0_40px_100px_rgb(33_27_26/0.5)]"
          />
          <figcaption className="mt-4 text-[11px] font-semibold tracking-[0.4em] text-ink-950 uppercase">
            {interlude.video.label}
          </figcaption>
        </figure>
      </section>
    )
  }

  return (
    <section ref={ref} aria-label={interlude.alt} className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
      <motion.div style={{ scale }} className="absolute inset-0">
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

      {/* dark veil behind the popped video so the message owns the moment */}
      <motion.div
        aria-hidden
        animate={{ opacity: popped ? 0.5 : 0 }}
        transition={{ duration: 0.5 }}
        className="pointer-events-none absolute inset-0 bg-ivory-50"
      />

      {/* the pop-out trigger: fires when the section is halfway into view */}
      <motion.div
        onViewportEnter={() => {
          setPopped(true)
          tryPlay()
        }}
        onViewportLeave={() => {
          setPopped(false)
          videoRef.current?.pause()
        }}
        viewport={{ amount: 0.5 }}
        className="absolute inset-0"
        aria-hidden
      />

      <motion.figure
        initial={false}
        animate={
          popped
            ? { scale: 1, opacity: 1, rotate: 0, y: 0 }
            : { scale: 0.55, opacity: 0, rotate: -5, y: 40 }
        }
        transition={{ type: 'spring', stiffness: 120, damping: 17 }}
        className={`relative z-10 text-center ${popped ? '' : 'pointer-events-none'}`}
      >
        <div className="relative overflow-hidden rounded-[1.5rem] border-[5px] border-ink-950 bg-ivory-50 shadow-[0_50px_130px_rgb(33_27_26/0.55)]">
          <video
            ref={videoRef}
            src={interlude.video.src}
            playsInline
            preload="auto"
            onEnded={() => setEnded(true)}
            className="aspect-[9/16] h-[min(62vh,34rem)] object-cover md:h-[min(70vh,40rem)]"
          />

          {/* muted-autoplay unmute / replay overlay */}
          {(needsTap || ended) && (
            <button
              onClick={tryPlay}
              aria-label={needsTap ? 'Turn the sound on' : 'Play it again'}
              className={`absolute inset-0 grid transition-colors ${
                needsTap ? 'items-end justify-center pb-6' : 'place-items-center bg-ivory-50/35 hover:bg-ivory-50/25'
              }`}
            >
              <span
                className={`grid place-items-center rounded-full bg-wine-400 text-ink-950 shadow-[0_16px_50px_rgb(239_75_47/0.45)] transition-transform hover:scale-105 active:scale-95 ${
                  needsTap ? 'h-14 gap-2 px-6 text-sm font-semibold tracking-wide grid-flow-col' : 'h-20 w-20'
                }`}
              >
                {needsTap ? (
                  <>
                    <SpeakerHigh size={22} weight="fill" /> Sound on
                  </>
                ) : (
                  <ArrowClockwise size={32} weight="bold" />
                )}
              </span>
            </button>
          )}
        </div>
        <figcaption className="mt-5 text-[11px] font-semibold tracking-[0.4em] text-ink-950 uppercase drop-shadow-[0_1px_8px_rgb(33_27_26/0.6)]">
          {interlude.video.label}
        </figcaption>
      </motion.figure>
    </section>
  )
}
