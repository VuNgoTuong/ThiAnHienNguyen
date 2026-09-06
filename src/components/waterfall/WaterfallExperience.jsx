import { WaterfallScene } from './WaterfallScene.jsx'
import { WaterfallHUD } from './WaterfallHUD.jsx'

export function WaterfallExperience({ onBack }) {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-ocean-950">
      <WaterfallScene />
      <WaterfallHUD onBack={onBack} />
    </div>
  )
}
