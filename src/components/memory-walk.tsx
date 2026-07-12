import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'

const VIDEO_SRC = '/video/our-memory-walk.mp4'
const POSTER_SRC = '/video/our-memory-walk-poster.jpg'
const BLOOM_SRC = '/photos/p57.jpg'

type Viewport = { w: number; h: number }

/* One measurement of the window, refreshed on resize (never on scroll). */
function useViewport(): Viewport {
  const [vp, setVp] = useState<Viewport>(() =>
    typeof window === 'undefined' ? { w: 1280, h: 800 } : { w: window.innerWidth, h: window.innerHeight },
  )
  useEffect(() => {
    let frame = 0
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setVp({ w: window.innerWidth, h: window.innerHeight }))
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [])
  return vp
}

type WallPhotoProps = {
  progress: MotionValue<number>
  src: string
  side: 'left' | 'right'
  range: [number, number]
  lane: number
  frameClass: string
  aspectClass: string
  vp: Viewport
  desktop: boolean
}

/**
 * A single memory hung on the corridor wall. It rides the video's own optical
 * flow: emerges small near the vanishing point, sweeps outward toward its wall
 * while growing and turning in perspective, and passes the camera. A warm haze
 * burns off as it nears, so distance reads as depth rather than a floating card.
 */
function WallPhoto({ progress, src, side, range, lane, frameClass, aspectClass, vp, desktop }: WallPhotoProps) {
  const dir = side === 'left' ? -1 : 1
  const [enter, exit] = range
  const span = exit - enter

  const yBase = vp.h * lane
  const x = useTransform(progress, range, [dir * vp.w * 0.03, dir * vp.w * (desktop ? 0.4 : 0.14)])
  const y = useTransform(progress, range, [yBase - vp.h * 0.02, yBase - vp.h * (desktop ? 0.15 : 0.1)])
  const scale = useTransform(progress, range, [desktop ? 0.3 : 0.46, desktop ? 1.42 : 1.12])
  const rotateY = useTransform(progress, range, [dir * (desktop ? 6 : 3), dir * (desktop ? 28 : 13)])
  const rotateZ = useTransform(progress, range, [dir * 1.4, dir * 3])
  /* Enter with a soft fade; leave earlier and slower so a photo dissolves into
     the hall's light well before it could clip against the viewport edge. */
  const opacity = useTransform(
    progress,
    [enter, enter + span * 0.16, exit - span * 0.32, exit],
    [0, 1, 1, 0],
  )
  const haze = useTransform(progress, [enter, enter + span * 0.5, exit], [0.72, 0, 0.44])
  const blurPx = useTransform(
    progress,
    [enter, enter + span * 0.16, exit - span * 0.2, exit],
    [3.2, 0, 0, 2.6],
  )
  const filter = useMotionTemplate`blur(${blurPx}px)`

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 grid place-items-center [perspective:1400px]"
    >
      <motion.figure
        style={{ x, y, scale, rotateY, rotateZ, opacity, ...(desktop ? { filter } : null) }}
        className={`origin-center rounded-[3px] bg-[#f8f2e9] p-[3.5%] shadow-[0_44px_70px_-32px_rgb(33_27_26/0.72),0_12px_26px_-14px_rgb(33_27_26/0.55)] will-change-transform ${frameClass}`}
      >
        <div className={`relative overflow-hidden rounded-[2px] ring-1 ring-ivory-50/10 ${aspectClass}`}>
          <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          {/* light from the hall: soft top sheen, grounded shadow at the base */}
          <div className="absolute inset-0 bg-gradient-to-b from-ivory-50/0 via-transparent to-[#2a1c14]/22" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-transparent" />
          {/* aerial haze: warm and washed when far, gone when near */}
          <motion.div
            style={{ opacity: haze }}
            className="absolute inset-0 bg-gradient-to-b from-[#f7efe0] to-[#efdcc4]"
          />
        </div>
      </motion.figure>
    </div>
  )
}

/**
 * A scroll-scrubbed walk down a warm gallery corridor. The generated hallway is
 * only atmosphere; the real photographs are the memories you pass, each hung on
 * a wall in perspective. The corridor ends at the light, out of which the last
 * photograph blooms and hands off to the Gallery.
 */
export function MemoryWalk() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const frameRef = useRef<number | null>(null)
  const durationRef = useRef(10)
  const reduce = useReducedMotion()
  const [ready, setReady] = useState(false)
  const vp = useViewport()
  const desktop = vp.w >= 768

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 26,
    mass: 0.32,
    restDelta: 0.0005,
  })

  /* Video pacing: hold at the mouth, travel through the middle, ease at the light. */
  const timelineProgress = useTransform(smoothProgress, [0, 0.16, 0.74, 1], [0, 0.08, 0.86, 1])
  const videoScale = useTransform(smoothProgress, [0, 1], [1.06, 1])

  /* Entry: the paper of the section above dissolves into the corridor. */
  const entryVeil = useTransform(smoothProgress, [0, 0.09, 0.18], [1, 0.55, 0])
  /* Ambient wall falloff that deepens into a tunnel as we approach the light. */
  const tunnel = useTransform(smoothProgress, [0.66, 0.94], [0, 0.55])

  /* The two spoken beats, placed only where they carry weight. */
  const line1 = useTransform(smoothProgress, [0.04, 0.12, 0.22], [0, 1, 0])
  const line2 = useTransform(smoothProgress, [0.58, 0.68, 0.79], [0, 1, 0])

  /* Handoff: a warm flare at the doorway, out of which the final memory blooms
     — the whole photograph, framed, arriving at the end of the hall. */
  const flare = useTransform(smoothProgress, [0.72, 0.83, 0.93], [0, 0.85, 0])
  const bloomOpacity = useTransform(smoothProgress, [0.78, 0.84], [0, 1])
  const bloomScale = useTransform(smoothProgress, [0.8, 1], [0.06, 1])
  const finalWash = useTransform(smoothProgress, [0.94, 1], [0, 1])

  useMotionValueEvent(timelineProgress, 'change', (value) => {
    const video = videoRef.current
    if (!video || !ready || reduce) return
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      const target = Math.min(durationRef.current - 0.04, Math.max(0, value * durationRef.current))
      if (Math.abs(video.currentTime - target) > 0.03) video.currentTime = target
    })
  })

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    },
    [],
  )

  /* Reduced motion: a still corridor with one framed memory and the line. */
  if (reduce) {
    return (
      <section
        aria-label="A gallery hallway of Cheskie and Rochel's memories"
        className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-ink-900"
      >
        <img src={POSTER_SRC} alt="A warm gallery hallway lined with framed photographs" className="absolute inset-0 h-full w-full object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink-950/10 via-transparent to-ink-950/45" />
        <div aria-hidden className="absolute inset-0 shadow-[inset_0_0_200px_rgb(33_27_26/0.4)]" />
        <figure className="relative z-10 w-[64vw] max-w-xs rounded-[3px] bg-[#f8f2e9] p-[4%] shadow-[0_40px_70px_-30px_rgb(33_27_26/0.7)]">
          <div className="aspect-[2/3] overflow-hidden rounded-[2px] ring-1 ring-ivory-50/10">
            <img src={BLOOM_SRC} alt="Cheskie and Rochel on their wedding day" className="h-full w-full object-cover" />
          </div>
        </figure>
        <p className="font-display absolute inset-x-6 bottom-[9vh] z-10 mx-auto max-w-3xl text-center text-3xl font-semibold italic leading-tight text-ivory-50 [text-shadow:0_2px_26px_rgb(247_241_232/0.9)] sm:text-4xl md:text-5xl">
          Then we kept going. Right into everything else.
        </p>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      aria-label="A cinematic walk through Cheskie and Rochel's memories"
      className="relative h-[400dvh] bg-ink-950"
    >
      <div className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden bg-ink-900">
        <motion.video
          ref={videoRef}
          style={{ scale: videoScale }}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          preload="auto"
          muted
          playsInline
          aria-hidden="true"
          onLoadedMetadata={(event) => {
            durationRef.current = event.currentTarget.duration || 10
            event.currentTarget.pause()
            event.currentTarget.currentTime = 0
            setReady(true)
          }}
          className="h-full w-full translate-z-0 object-cover"
        />

        {/* warm colour grade, ties the corridor to the paper palette */}
        <div
          aria-hidden
          className="absolute inset-0 z-[1] bg-gradient-to-b from-wine-400/10 via-transparent to-[#2a1c14]/28"
        />
        {/* entry: paper of the section above dissolving into the hall */}
        <motion.div aria-hidden style={{ opacity: entryVeil }} className="absolute inset-0 z-[2] bg-ink-950" />

        {!ready && <div className="absolute inset-0 z-[3] animate-pulse bg-ink-900" aria-hidden />}

        <WallPhoto
          progress={smoothProgress}
          src="/photos/p45.jpg"
          side="right"
          range={[0.05, 0.29]}
          lane={-0.04}
          frameClass="w-[58vw] sm:w-[22vw] sm:max-w-[280px]"
          aspectClass="aspect-[2/3]"
          vp={vp}
          desktop={desktop}
        />
        <WallPhoto
          progress={smoothProgress}
          src="/photos/p59.jpg"
          side="left"
          range={[0.19, 0.45]}
          lane={-0.02}
          frameClass="w-[66vw] sm:w-[26vw] sm:max-w-[340px]"
          aspectClass="aspect-[3/2]"
          vp={vp}
          desktop={desktop}
        />
        <WallPhoto
          progress={smoothProgress}
          src="/photos/p52.jpg"
          side="right"
          range={[0.35, 0.6]}
          lane={0.01}
          frameClass="w-[64vw] sm:w-[25vw] sm:max-w-[330px]"
          aspectClass="aspect-[4/3]"
          vp={vp}
          desktop={desktop}
        />
        <WallPhoto
          progress={smoothProgress}
          src="/photos/p49.jpg"
          side="left"
          range={[0.51, 0.75]}
          lane={-0.03}
          frameClass="w-[54vw] sm:w-[20vw] sm:max-w-[260px]"
          aspectClass="aspect-[2/3]"
          vp={vp}
          desktop={desktop}
        />

        {/* wall falloff — darkens photos as they pass into the corridor's edges */}
        <div
          aria-hidden
          className="absolute inset-0 z-20 shadow-[inset_0_0_150px_rgb(33_27_26/0.34)] md:shadow-[inset_0_0_240px_rgb(33_27_26/0.38)]"
        />
        <motion.div
          aria-hidden
          style={{ opacity: tunnel }}
          className="absolute inset-0 z-[24] [background:radial-gradient(circle_at_50%_46%,transparent_18%,rgb(33_27_26/0.66)_82%)]"
        />

        {/* handoff: flare at the doorway, then the final memory blooms out of the light */}
        <motion.div
          aria-hidden
          style={{
            opacity: flare,
            backgroundImage:
              'radial-gradient(circle at 50% 46%, rgba(255,214,150,0.95), rgba(255,168,96,0.35) 32%, transparent 62%)',
          }}
          className="absolute inset-0 z-[28]"
        />
        <div aria-hidden className="absolute inset-0 z-30 grid place-items-center [perspective:1600px]">
          <motion.figure
            style={{ opacity: bloomOpacity, scale: bloomScale }}
            className="aspect-[2/3] h-[86vh] max-h-[86vh] origin-center rounded-[5px] bg-[#f8f2e9] p-[1.3%] shadow-[0_50px_130px_rgb(33_27_26/0.5)] will-change-transform"
          >
            <div className="relative h-full w-full overflow-hidden rounded-[2px] ring-1 ring-ivory-50/10">
              <img src={BLOOM_SRC} alt="" loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a1c14]/22 via-transparent to-white/10" />
            </div>
          </motion.figure>
        </div>
        <motion.div aria-hidden style={{ opacity: finalWash }} className="absolute inset-0 z-40 bg-ink-950" />

        <motion.p
          style={{ opacity: line1 }}
          className="font-display absolute inset-x-6 bottom-[12vh] z-50 mx-auto max-w-4xl text-center text-4xl font-semibold italic leading-[1.12] text-ivory-50 [text-shadow:0_2px_30px_rgb(247_241_232/0.92)] sm:text-5xl md:text-7xl"
        >
          Then we kept going.
        </motion.p>
        <motion.p
          style={{ opacity: line2 }}
          className="font-display absolute inset-x-6 bottom-[12vh] z-50 mx-auto max-w-4xl text-center text-4xl font-semibold italic leading-[1.12] text-ivory-50 [text-shadow:0_2px_30px_rgb(247_241_232/0.92)] sm:text-5xl md:text-7xl"
        >
          Right into everything else.
        </motion.p>
      </div>
    </section>
  )
}
