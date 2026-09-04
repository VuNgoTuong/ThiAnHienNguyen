import { useEffect, useRef } from 'react'

// Warm palette matching the app's gold/parchment theme, plus soft rose/pink
// so bursts read as celebratory without turning into generic rainbow confetti.
const COLORS = ['#f7e096', '#e8c368', '#d3a24a', '#fefcf3', '#ff9eb3', '#ffc3d0']
const GRAVITY = 0.045
const DRAG = 0.988

function makeBurst(x, y) {
  const count = 44 + Math.floor(Math.random() * 20)
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]
  const particles = []
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3
    const speed = 2.4 + Math.random() * 3.2
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      size: 1.6 + Math.random() * 1.8,
      life: 1,
      decay: 0.008 + Math.random() * 0.01,
    })
  }
  return particles
}

// A lightweight canvas firework display — no external library needed. Bursts
// launch on a randomized interval across the upper two-thirds of the screen,
// with a soft trailing-glow effect from partially clearing each frame rather
// than a hard clearRect.
export function Fireworks() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let particles = []
    let raf = null
    let launchTimeout = null
    let width = 0
    let height = 0

    function resize() {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    function launch() {
      // Push in place rather than `particles.concat(...)` (which would
      // allocate a whole new array) — this only runs ~once a second, but
      // there's no reason to allocate here either.
      for (const p of makeBurst(width * (0.15 + Math.random() * 0.7), height * (0.15 + Math.random() * 0.35))) {
        particles.push(p)
      }
      launchTimeout = setTimeout(launch, 750 + Math.random() * 700)
    }
    launch()

    function frame() {
      // Fade previous particles by eroding existing alpha (not painting a
      // new layer on top) — keeps the canvas transparent everywhere except
      // where trails are actively fading, instead of slowly filling opaque.
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
      ctx.fillRect(0, 0, width, height)

      ctx.globalCompositeOperation = 'lighter'
      // In-place compaction (write-index swap) instead of `.filter()` — this
      // runs every frame, so avoiding a fresh array allocation ~60x/sec
      // keeps the GC quiet and the frame pacing steady.
      let writeIndex = 0
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.vy += GRAVITY
        p.vx *= DRAG
        p.vy *= DRAG
        p.x += p.vx
        p.y += p.vy
        p.life -= p.decay
        if (p.life <= 0) continue

        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        particles[writeIndex++] = p
      }
      ctx.globalAlpha = 1
      particles.length = writeIndex

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(launchTimeout)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="h-full w-full" />
}
