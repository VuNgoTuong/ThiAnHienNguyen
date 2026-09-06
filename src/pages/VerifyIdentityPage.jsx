import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useGame, useTranslation } from '../hooks/useGame.js'
import { ParchmentPanel } from '../components/ui/ParchmentPanel.jsx'
import { Ocean } from '../components/world/Ocean.jsx'
import { uiStrings } from '../data/uiStrings.js'
import { fadeStep } from '../utils/motionPresets.js'

// Single verification question before setting sail
const QUESTIONS = [
  {
    id: 'birthday',
    prompt: uiStrings.verifyBirthdayQuestion,
    correctId: 'a',
    options: [
      { id: 'a', label: { vi: '27/08/2002', en: '27/08/2002' } },
      { id: 'b', label: { vi: '15/03/2001', en: '15/03/2001' } },
      { id: 'c', label: { vi: '09/11/2003', en: '09/11/2003' } },
    ],
  },
]

function QuizQuestion({ question, onCorrect, onWrong }) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(null)
  const [status, setStatus] = useState('idle') // idle | wrong | correct

  function handleSelect(optionId) {
    if (status === 'correct') return
    setSelected(optionId)
    if (optionId === question.correctId) {
      setStatus('correct')
      setTimeout(onCorrect, 650)
    } else {
      setStatus('wrong')
      setTimeout(() => onWrong?.(), 500)
    }
  }

  return (
    <>
      <h2 className="mb-3 font-display text-sm tracking-widest text-gold-700 uppercase font-semibold">
        {t(uiStrings.verifyTitle)}
      </h2>
      <p className="mb-8 font-serif text-2xl font-medium text-ink-900 italic leading-snug">{t(question.prompt)}</p>
      <div className="grid gap-4">
        {question.options.map((option) => {
          const isSelected = selected === option.id
          const showCorrect = status === 'correct' && isSelected
          const showWrong = status === 'wrong' && isSelected
          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option.id)}
              disabled={status === 'correct'}
              whileHover={status !== 'correct' ? { scale: 1.02, x: 3 } : undefined}
              whileTap={status !== 'correct' ? { scale: 0.98 } : undefined}
              animate={showWrong ? { x: [0, -8, 8, -6, 6, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`flex items-center justify-between rounded-2xl border-2 px-6 py-4.5 text-left font-body text-lg font-semibold transition-all duration-200 shadow-md ${
                showCorrect
                  ? 'border-emerald-600 bg-emerald-500/20 text-emerald-950 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                  : showWrong
                    ? 'border-red-600 bg-red-500/20 text-red-950 shadow-[0_0_20px_rgba(239,68,68,0.35)]'
                    : 'border-gold-600/35 bg-[#fbf5e6] text-ink-900 hover:border-gold-600 hover:bg-[#ffffff] hover:shadow-lg'
              }`}
            >
              <span>{t(option.label)}</span>
              {showCorrect ? <Check size={22} className="text-emerald-700 font-bold shrink-0 ml-2" /> : null}
              {showWrong ? <X size={22} className="text-red-700 font-bold shrink-0 ml-2" /> : null}
            </motion.button>
          )
        })}
      </div>
    </>
  )
}

export function VerifyIdentityPage() {
  const { setScene } = useGame()
  const [step, setStep] = useState(0)
  // Bumped on every wrong answer so the key below always changes — even a
  // miss on question 1 remounts QuizQuestion and replays the entrance, which
  // reads as "starting over" rather than a no-op.
  const [attempt, setAttempt] = useState(0)

  function handleCorrect() {
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1)
    } else {
      setScene('greeting')
    }
  }

  // A wrong answer on any question sends the whole quiz back to question 1
  function handleWrong() {
    setStep(0)
    setAttempt((a) => a + 1)
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center p-6 sm:p-8">
      <Ocean />
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background: 'radial-gradient(ellipse 60% 65% at 50% 50%, rgba(5,13,24,0.4) 0%, rgba(5,13,24,0.1) 55%, rgba(5,13,24,0) 75%)',
        }}
      />
      <div className="relative z-10 w-full max-w-xl sm:max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div key={`${step}-${attempt}`} {...fadeStep}>
            <ParchmentPanel className="p-8 sm:p-12 text-center">
              <QuizQuestion question={QUESTIONS[step]} onCorrect={handleCorrect} onWrong={handleWrong} />
            </ParchmentPanel>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
