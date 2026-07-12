import confetti from 'canvas-confetti'

const COLORS = ['#ef4b2f', '#ffb629', '#f7f1e8', '#211b1a']
const defaults = { colors: COLORS, disableForReducedMotion: true }

/* Star confetti in the page's own mark, one wine and one ivory. */
let starShapes: confetti.Shape[] = []
try {
  starShapes = [
    confetti.shapeFromText({ text: '✶', scalar: 2, color: '#ef4b2f' }),
    confetti.shapeFromText({ text: '✶', scalar: 2, color: '#211b1a' }),
  ]
} catch {
  starShapes = []
}

let audioCtx: AudioContext | null = null

/* One low glass note and its octave, quiet and short. No files.
   Only ever called from a user gesture. */
export function chime() {
  try {
    audioCtx ??= new AudioContext()
    if (audioCtx.state === 'suspended') void audioCtx.resume()
    const notes = [783.99, 1046.5]
    notes.forEach((freq, i) => {
      const t = audioCtx!.currentTime + i * 0.09
      const osc = audioCtx!.createOscillator()
      const gain = audioCtx!.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.05, t + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9)
      osc.connect(gain)
      gain.connect(audioCtx!.destination)
      osc.start(t)
      osc.stop(t + 1)
    })
  } catch {
    /* no audio, no problem */
  }
}

/* The full volley: chime, big center burst, side cannons, streamers. */
export function celebrate() {
  chime()
  confetti({ ...defaults, particleCount: 150, spread: 100, origin: { y: 0.7 } })
  if (starShapes.length) {
    confetti({
      ...defaults,
      particleCount: 26,
      spread: 120,
      scalar: 1.5,
      startVelocity: 40,
      shapes: starShapes,
      origin: { y: 0.65 },
    })
  }
  setTimeout(() => {
    confetti({ ...defaults, particleCount: 70, angle: 60, spread: 70, origin: { x: 0, y: 0.75 } })
    confetti({ ...defaults, particleCount: 70, angle: 120, spread: 70, origin: { x: 1, y: 0.75 } })
  }, 220)
  const end = performance.now() + 1300
  ;(function streamers() {
    confetti({ ...defaults, particleCount: 4, angle: 62, spread: 50, startVelocity: 58, origin: { x: 0, y: 0.85 } })
    confetti({ ...defaults, particleCount: 4, angle: 118, spread: 50, startVelocity: 58, origin: { x: 1, y: 0.85 } })
    if (performance.now() < end) requestAnimationFrame(streamers)
  })()
}

/* A small burst at a specific point on screen. */
export function spark(clientX: number, clientY: number, count = 22) {
  confetti({
    ...defaults,
    particleCount: count,
    spread: 60,
    startVelocity: 28,
    origin: { x: clientX / window.innerWidth, y: clientY / window.innerHeight },
  })
}
