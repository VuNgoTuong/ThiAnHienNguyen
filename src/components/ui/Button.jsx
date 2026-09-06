import { motion } from 'framer-motion'

const VARIANT_CLASSES = {
  primary:
    'relative overflow-hidden bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-ink-900 font-semibold border border-gold-300/80 shadow-[0_4px_20px_rgba(211,162,74,0.45)] hover:shadow-[0_6px_28px_rgba(211,162,74,0.6)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:-translate-x-full hover:before:animate-shimmer',
  ghost:
    'bg-ocean-950/75 text-parchment-100 border border-gold-400/30 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:border-gold-400 hover:text-gold-300 hover:bg-gold-500/15 hover:shadow-[0_4px_20px_rgba(232,195,104,0.3)]',
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
      whileHover={disabled ? undefined : { scale: 1.045, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3 font-display text-sm tracking-wider uppercase transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {Icon ? <Icon size={17} strokeWidth={2.2} className="relative z-10" /> : null}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

