import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Compass } from 'lucide-react'
import { Button } from '../ui/Button.jsx'
import { useTranslation } from '../../hooks/useGame.js'
import { uiStrings } from '../../data/uiStrings.js'

export function EndingSequence({ onPlayAgain }) {
  const { t } = useTranslation()
  const compassRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const timeline = gsap.timeline()
    timeline
      .fromTo(
        compassRef.current,
        { scale: 0.4, opacity: 0, rotate: -180 },
        { scale: 1, opacity: 1, rotate: 0, duration: 1.4, ease: 'back.out(1.6)' },
      )
      .fromTo(glowRef.current, { opacity: 0 }, { opacity: 0.6, duration: 1.2 }, '<')
      .to(compassRef.current, { rotate: 360, duration: 14, ease: 'none', repeat: -1 })

    return () => timeline.kill()
  }, [])

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="relative flex h-40 w-40 items-center justify-center">
        <div ref={glowRef} className="absolute inset-0 rounded-full bg-gold-400/40 opacity-0 blur-2xl" />
        <div
          ref={compassRef}
          className="relative flex h-32 w-32 items-center justify-center rounded-full border-2 border-gold-400 bg-ocean-900/80"
        >
          <Compass size={56} className="text-gold-400" />
        </div>
      </div>
      <h1 className="font-display text-3xl text-parchment-100 sm:text-4xl">{t(uiStrings.endingTitle)}</h1>
      <p className="max-w-md text-parchment-200/80">{t(uiStrings.endingSubtitle)}</p>
      <Button onClick={onPlayAgain}>{t(uiStrings.playAgain)}</Button>
    </div>
  )
}
