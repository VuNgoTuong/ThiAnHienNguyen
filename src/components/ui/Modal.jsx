import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { ParchmentPanel } from './ParchmentPanel.jsx'

export function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ocean-950/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg"
          >
            <ParchmentPanel className="max-h-[80vh] overflow-y-auto p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <h2 className="font-display text-xl text-ink-900">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-full p-1 text-ink-700 transition-colors hover:bg-ink-900/10 hover:text-ink-900"
                >
                  <X size={20} />
                </button>
              </div>
              {children}
            </ParchmentPanel>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
