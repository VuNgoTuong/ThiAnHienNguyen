import { useEffect, useState } from 'react'
import { Bot, User, Sparkles } from 'lucide-react'
import { useTranslation } from '../../../hooks/useGame.js'
import { uiStrings } from '../../../data/uiStrings.js'
import { Button } from '../../ui/Button.jsx'
import { getSyllables, validateNextWord, pickAiWord, hasAnyCandidate } from '../../../utils/wordChainEngine.js'

const STARTER_WORD = 'học sinh'
const TARGET_CORRECT = 10
const AI_THINK_DELAY_MS = 650

const ERROR_KEYS = {
  'needs-two-syllables': 'wordChainNeedsTwoSyllables',
  'wrong-start': 'wordChainWrongStart',
  used: 'wordChainUsed',
  unknown: 'wordChainUnknown',
}

export function WordChainLesson({ onCorrect }) {
  const { t } = useTranslation()
  const [chain, setChain] = useState([{ word: STARTER_WORD, by: 'start' }])
  const [input, setInput] = useState('')
  const [error, setError] = useState(null)
  const [aiThinking, setAiThinking] = useState(false)
  const [freeMove, setFreeMove] = useState(false)

  const playerCorrectCount = chain.filter((entry) => entry.by === 'player').length
  const lastWord = chain[chain.length - 1].word
  const requiredStartSyllable = freeMove ? null : getSyllables(lastWord)[1]

  // Proactively detect a dead syllable (no unused dictionary word starts
  // with it) so the player is never left guessing at the impossible —
  // catches it whenever the chain changes, not just after a failed guess.
  useEffect(() => {
    if (freeMove || aiThinking) return
    const usedWords = new Set(chain.map((entry) => entry.word))
    if (!hasAnyCandidate({ requiredStartSyllable, usedWords })) {
      setFreeMove(true)
    }
  }, [chain, freeMove, aiThinking, requiredStartSyllable])

  function handleSubmit(event) {
    event.preventDefault()
    if (aiThinking || input.trim().length === 0) return

    const usedWords = new Set(chain.map((entry) => entry.word))
    const result = validateNextWord({ input, requiredStartSyllable, usedWords })

    if (!result.valid) {
      setError(result.reason)
      return
    }

    setError(null)
    setInput('')
    setFreeMove(false)

    const nextChain = [...chain, { word: result.word, by: 'player' }]
    setChain(nextChain)

    if (nextChain.filter((entry) => entry.by === 'player').length >= TARGET_CORRECT) {
      onCorrect()
      return
    }

    setAiThinking(true)
    const nextUsed = new Set(nextChain.map((entry) => entry.word))
    const nextRequired = getSyllables(result.word)[1]

    setTimeout(() => {
      const aiWord = pickAiWord({ requiredStartSyllable: nextRequired, usedWords: nextUsed })
      setAiThinking(false)
      if (aiWord) {
        setChain((current) => [...current, { word: aiWord, by: 'ai' }])
      } else {
        setFreeMove(true)
      }
    }, AI_THINK_DELAY_MS)
  }

  return (
    <div className="space-y-4">
      <div className="max-h-40 space-y-1.5 overflow-y-auto rounded-lg border border-ink-900/10 bg-ink-900/5 p-3">
        {chain.map((entry, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 text-sm ${
              entry.by === 'player' ? 'font-medium text-ink-900' : 'text-ink-700'
            }`}
          >
            {entry.by === 'ai' ? <Bot size={14} className="shrink-0" /> : null}
            {entry.by === 'player' ? <User size={14} className="shrink-0" /> : null}
            {entry.by === 'start' ? <Sparkles size={14} className="shrink-0" /> : null}
            {entry.word}
          </div>
        ))}
        {aiThinking ? <p className="text-xs text-ink-700/60 italic">{t(uiStrings.wordChainAiThinking)}</p> : null}
      </div>

      <div className="flex items-center justify-between gap-3 text-xs text-ink-700">
        <span className="font-medium">
          {t(uiStrings.wordChainProgress)}: {playerCorrectCount}/{TARGET_CORRECT}
        </span>
        {freeMove ? (
          <span className="text-gold-600">{t(uiStrings.wordChainAiStuck)}</span>
        ) : (
          <span>
            {t(uiStrings.wordChainNeedsSyllable)} "{requiredStartSyllable}"
          </span>
        )}
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-900/10">
        <div
          className="h-full bg-gold-600 transition-[width] duration-300"
          style={{ width: `${(playerCorrectCount / TARGET_CORRECT) * 100}%` }}
        />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t(uiStrings.wordChainInputPlaceholder)}
          disabled={aiThinking}
          className="flex-1 rounded-lg border border-ink-900/20 bg-parchment-100 px-4 py-2.5 font-body text-ink-900 placeholder:text-ink-700/50 focus:border-gold-600 focus:outline-none disabled:opacity-60"
        />
        <Button type="submit" disabled={aiThinking || input.trim().length === 0}>
          {t(uiStrings.wordChainSubmit)}
        </Button>
      </form>

      {error ? <p className="text-sm text-red-700">{t(uiStrings[ERROR_KEYS[error]])}</p> : null}
    </div>
  )
}
