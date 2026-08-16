// The recurring "paper card" surface — dialog, discovery, puzzle, and
// inventory all sit on this so the game reads as one consistent object.
export function ParchmentPanel({ children, className = '', as: Component = 'div', ...rest }) {
  return (
    <Component
      className={`relative rounded-3xl border-2 border-gold-600/40 bg-gradient-to-b from-[#fefcf3] via-[#f7eed2] to-[#eddba5] text-ink-900 shadow-parchment outline outline-1 outline-gold-500/25 -outline-offset-8 ${className}`}
      {...rest}
    >
      {/* Decorative corner accent markers */}
      <span className="pointer-events-none absolute top-3 left-3 h-2 w-2 rounded-full border border-gold-600/50" />
      <span className="pointer-events-none absolute top-3 right-3 h-2 w-2 rounded-full border border-gold-600/50" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-2 w-2 rounded-full border border-gold-600/50" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 rounded-full border border-gold-600/50" />
      {children}
    </Component>
  )
}

