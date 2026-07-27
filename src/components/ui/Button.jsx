import { motion } from 'framer-motion'

const VARIANT_CLASSES = {
  primary:
    'bg-gradient-to-b from-gold-400 to-gold-600 text-ink-900 border-gold-600/60 shadow-[0_4px_14px_-4px_rgba(211,162,74,0.6)]',
  ghost:
    'bg-ocean-900/60 text-parchment-200 border-parchment-200/20 hover:border-gold-500/50 hover:text-gold-400',
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  icon: Icon,
  disabled = false,
  type = 'button',
  className = '',
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-6 py-2.5 font-display text-sm tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {Icon ? <Icon size={16} strokeWidth={2} /> : null}
      {children}
    </motion.button>
  )
}
