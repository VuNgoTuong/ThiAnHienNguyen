import { useMemo } from 'react'
import { motion } from 'framer-motion'

const FLOWERS = ['🌸', '🌷', '🌹', '💮', '🏵️', '🌺']

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

// Gentle falling flowers behind the ending screen's content — pure decoration
// (aria-hidden, no interaction), each one an independent infinite loop so
// they never sync up into a visible pattern.
export function FlowerPetals({ count = 18 }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, index) => ({
        id: index,
        emoji: FLOWERS[Math.floor(Math.random() * FLOWERS.length)],
        left: randomBetween(2, 98),
        size: randomBetween(16, 30),
        duration: randomBetween(9, 16),
        delay: randomBetween(0, 10),
        drift: randomBetween(-40, 40),
        spin: randomBetween(-140, 140),
      })),
    [count],
  )

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((petal) => (
        <motion.span
          key={petal.id}
          className="absolute top-[-10%] select-none opacity-80"
          style={{ left: `${petal.left}%`, fontSize: petal.size }}
          initial={{ y: '-10vh', x: 0, rotate: 0, opacity: 0 }}
          animate={{ y: '110vh', x: petal.drift, rotate: petal.spin, opacity: [0, 0.85, 0.85, 0] }}
          transition={{ duration: petal.duration, delay: petal.delay, repeat: Infinity, ease: 'linear' }}
        >
          {petal.emoji}
        </motion.span>
      ))}
    </div>
  )
}
