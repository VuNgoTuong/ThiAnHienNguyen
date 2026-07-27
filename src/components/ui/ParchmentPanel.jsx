// The recurring "paper card" surface — dialog, discovery, puzzle, and
// inventory all sit on this so the game reads as one consistent object.
export function ParchmentPanel({ children, className = '', as: Component = 'div', ...rest }) {
  return (
    <Component
      className={`rounded-2xl border border-gold-600/30 bg-gradient-to-b from-parchment-100 to-parchment-200 text-ink-900 shadow-parchment ${className}`}
      {...rest}
    >
      {children}
    </Component>
  )
}
