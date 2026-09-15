import { lazy, Suspense } from 'react'
import { useGame, useCurrentScene } from '../../hooks/useGame.js'
import { TitleScreen } from '../../pages/TitleScreen.jsx'
import { HUD } from './HUD.jsx'
import { AchievementToast } from '../achievements/AchievementToast.jsx'

// Every scene past the title screen is code-split: none of it (nor its 3D/
// shader/postprocessing weight) needs to be in the bundle the player waits
// on before they've even pressed "new voyage". Only TitleScreen stays a
// static import — it's the very first paint, so lazy-loading it would just
// add a network round-trip before anything shows.
const NameEntryPage = lazy(() => import('../../pages/NameEntryPage.jsx').then((m) => ({ default: m.NameEntryPage })))
const VerifyIdentityPage = lazy(() =>
  import('../../pages/VerifyIdentityPage.jsx').then((m) => ({ default: m.VerifyIdentityPage })),
)
const GreetingPage = lazy(() => import('../../pages/GreetingPage.jsx').then((m) => ({ default: m.GreetingPage })))
const WorldMapPage = lazy(() => import('../../pages/WorldMapPage.jsx').then((m) => ({ default: m.WorldMapPage })))
const IslandPage = lazy(() => import('../../pages/IslandPage.jsx').then((m) => ({ default: m.IslandPage })))
const FinalIslandPage = lazy(() =>
  import('../../pages/FinalIslandPage.jsx').then((m) => ({ default: m.FinalIslandPage })),
)
const EndingPage = lazy(() => import('../../pages/EndingPage.jsx').then((m) => ({ default: m.EndingPage })))
const WaterfallExperience = lazy(() =>
  import('../waterfall/WaterfallExperience.jsx').then((m) => ({ default: m.WaterfallExperience })),
)

function WaterfallSceneWrapper() {
  const { setScene } = useGame()
  return <WaterfallExperience onBack={() => setScene('map')} />
}

const SCENES = {
  title: TitleScreen,
  'name-entry': NameEntryPage,
  verify: VerifyIdentityPage,
  greeting: GreetingPage,
  map: WorldMapPage,
  island: IslandPage,
  final: FinalIslandPage,
  ending: EndingPage,
  waterfall: WaterfallSceneWrapper,
}

const NO_HUD_SCENES = new Set(['title', 'name-entry', 'verify', 'greeting', 'ending', 'waterfall'])

export function GameShell() {
  const scene = useCurrentScene()
  const SceneComponent = SCENES[scene] ?? TitleScreen
  const showHud = !NO_HUD_SCENES.has(scene)

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-ocean-950">
      <Suspense fallback={null}>
        <SceneComponent />
      </Suspense>
      {showHud ? <HUD /> : null}
      <AchievementToast />
    </div>
  )
}
