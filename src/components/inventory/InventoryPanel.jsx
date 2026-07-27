import { Modal } from '../ui/Modal.jsx'
import { islands } from '../../data/islands.js'
import { useFragments, useTranslation } from '../../hooks/useGame.js'
import { uiStrings } from '../../data/uiStrings.js'
import { CompassFragment } from './CompassFragment.jsx'

export function InventoryPanel({ isOpen, onClose }) {
  const { t } = useTranslation()
  const { collected, total } = useFragments()
  const collectedIds = collected.map((fragment) => fragment.id)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${t(uiStrings.compassFragments)} (${collected.length}/${total})`}>
      <div className="grid grid-cols-1 gap-3">
        {islands.map((island) => {
          const isCollected = collectedIds.includes(island.fragment.id)
          return (
            <div key={island.fragment.id} className="flex items-center gap-3 rounded-lg border border-ink-900/10 p-3">
              <CompassFragment collected={isCollected} />
              <div>
                <p className="font-display text-sm text-ink-900">
                  {isCollected ? t(island.fragment.name) : t(uiStrings.fragmentUnknown)}
                </p>
                <p className="text-sm text-ink-700">
                  {isCollected ? t(island.fragment.loreText) : `${t(uiStrings.awaitsOnIsland)} ${t(island.name)}.`}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
