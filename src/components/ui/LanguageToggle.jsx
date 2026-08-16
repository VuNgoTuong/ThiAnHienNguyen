import { useTranslation } from '../../hooks/useGame.js'

export function LanguageToggle({ className = '' }) {
  const { language, setLanguage } = useTranslation()

  return (
    <div
      className={`inline-flex overflow-hidden rounded-full border border-gold-400/30 bg-ocean-950/75 p-0.5 text-xs font-display backdrop-blur-md shadow-md ${className}`}
    >
      {['vi', 'en'].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLanguage(code)}
          className={`rounded-full px-3 py-1 transition-all duration-200 uppercase font-semibold ${
            language === code
              ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-ink-900 shadow-[0_0_12px_rgba(232,195,104,0.5)]'
              : 'text-parchment-200/70 hover:text-parchment-100 hover:bg-gold-500/10'
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  )
}

