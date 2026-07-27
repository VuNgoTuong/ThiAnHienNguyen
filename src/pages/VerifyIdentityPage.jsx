import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useGame, useTranslation } from '../hooks/useGame.js'
import { Button } from '../components/ui/Button.jsx'
import { ParchmentPanel } from '../components/ui/ParchmentPanel.jsx'
import { Ocean } from '../components/world/Ocean.jsx'
import { uiStrings } from '../data/uiStrings.js'
import { fadeStep } from '../utils/motionPresets.js'

// Two objectively-correct-answer questions (retry on a wrong pick, same
// shake+reset UX as MultipleChoicePuzzle), then one just-for-fun question
// with no wrong answer — both replies get a warm response either way.
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
  {
    id: 'numerology',
    prompt: uiStrings.verifyNumerologyQuestion,
    correctId: 'b',
    options: [
      { id: 'a', label: { vi: 'Số 7', en: 'Number 7' } },
      { id: 'b', label: { vi: 'Số 3', en: 'Number 3' } },
      { id: 'c', label: { vi: 'Số 5', en: 'Number 5' } },
    ],
  },
]

function QuizQuestion({ question, onCorrect }) {
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
      setTimeout(() => setStatus('idle'), 500)
    }
  }

  return (
    <>
      <h2 className="mb-1 font-display text-xs tracking-wide text-gold-600">{t(uiStrings.verifyTitle)}</h2>
      <p className="mb-5 font-body text-lg text-ink-900 italic">{t(question.prompt)}</p>
      <div className="grid gap-2">
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
              animate={showWrong ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-left font-body text-ink-900 transition-colors ${
                showCorrect
                  ? 'border-green-600 bg-green-600/10'
                  : showWrong
                    ? 'border-red-600 bg-red-600/10'
                    : 'border-ink-900/20 bg-parchment-100 hover:border-gold-600'
              }`}
            >
              <span>{t(option.label)}</span>
              {showCorrect ? <Check size={16} className="text-green-700" /> : null}
              {showWrong ? <X size={16} className="text-red-700" /> : null}
            </motion.button>
          )
        })}
      </div>
    </>
  )
}

function RelationshipQuestion({ onDone }) {
  const { t } = useTranslation()
  const [answer, setAnswer] = useState(null)

  function handleAnswer(value) {
    setAnswer(value)
    setTimeout(onDone, 1600)
  }

  return (
    <>
      <h2 className="mb-1 font-display text-xs tracking-wide text-gold-600">{t(uiStrings.verifyTitle)}</h2>
      <p className="mb-5 font-body text-lg text-ink-900 italic">{t(uiStrings.verifyRelationshipQuestion)}</p>
      {answer ? (
        <p className="font-body text-ink-700">
          {t(answer === 'yes' ? uiStrings.verifyRelationshipYesResponse : uiStrings.verifyRelationshipNoResponse)}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" onClick={() => handleAnswer('yes')}>
            {t(uiStrings.verifyRelationshipYes)}
          </Button>
          <Button variant="ghost" onClick={() => handleAnswer('no')}>
            {t(uiStrings.verifyRelationshipNo)}
          </Button>
        </div>
      )}
    </>
  )
}

export function VerifyIdentityPage() {
  const { setScene } = useGame()
  const [step, setStep] = useState(0) // 0..QUESTIONS.length-1 = quiz, QUESTIONS.length = relationship question

  return (
    <div className="relative flex h-full w-full items-center justify-center p-6">
      <Ocean />
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background: 'radial-gradient(ellipse 60% 65% at 50% 50%, rgba(5,13,24,0.7) 0%, rgba(5,13,24,0.15) 55%, rgba(5,13,24,0) 75%)',
        }}
      />
      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div key={step} {...fadeStep}>
            <ParchmentPanel className="p-8 text-center">
              {step < QUESTIONS.length ? (
                <QuizQuestion question={QUESTIONS[step]} onCorrect={() => setStep((s) => s + 1)} />
              ) : (
                <RelationshipQuestion onDone={() => setScene('greeting')} />
              )}
            </ParchmentPanel>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
