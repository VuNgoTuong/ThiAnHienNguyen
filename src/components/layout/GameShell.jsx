import { useGame } from '../../hooks/useGame.js'
import { TitleScreen } from '../../pages/TitleScreen.jsx'
import { NameEntryPage } from '../../pages/NameEntryPage.jsx'
import { VerifyIdentityPage } from '../../pages/VerifyIdentityPage.jsx'
import { GreetingPage } from '../../pages/GreetingPage.jsx'
import { WorldMapPage } from '../../pages/WorldMapPage.jsx'
import { IslandPage } from '../../pages/IslandPage.jsx'
import { FinalIslandPage } from '../../pages/FinalIslandPage.jsx'
import { EndingPage } from '../../pages/EndingPage.jsx'
import { HUD } from './HUD.jsx'
import { AchievementToast } from '../achievements/AchievementToast.jsx'

const SCENES = {
  title: TitleScreen,
  'name-entry': NameEntryPage,
  verify: VerifyIdentityPage,
  greeting: GreetingPage,
  map: WorldMapPage,
  island: IslandPage,
  final: FinalIslandPage,
  ending: EndingPage,
}

const NO_HUD_SCENES = new Set(['title', 'name-entry', 'verify', 'greeting', 'ending'])

export function GameShell() {
  const { state } = useGame()
  const SceneComponent = SCENES[state.scene] ?? TitleScreen
  const showHud = !NO_HUD_SCENES.has(state.scene)

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-ocean-950">
      <SceneComponent />
      {showHud ? <HUD /> : null}
      <AchievementToast />
    </div>
  )
}
