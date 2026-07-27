import { useTranslation } from '../../hooks/useGame.js'

export function LanguageToggle({ className = '' }) {
  const { language, setLanguage } = useTranslation()

  return (
    <div
      className={`inline-flex overflow-hidden rounded-full border border-parchment-200/20 text-xs font-display tracking-wide ${className}`}
    >
      {['vi', 'en'].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLanguage(code)}
          className={`px-2.5 py-1 transition-colors ${
            language === code ? 'bg-gold-400 text-ink-900' : 'bg-ocean-950/60 text-parchment-200/70 hover:text-parchment-100'
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
