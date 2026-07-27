import { useState } from 'react'
import { useGame } from '../hooks/useGame.js'
import { useShipVoyage } from '../hooks/useShipVoyage.js'
import { islands } from '../data/islands.js'
import { finalIsland } from '../data/finalIsland.js'
import { isIslandUnlocked, isIslandSolved, getShipRestingPosition } from '../utils/islandLogic.js'
import { WorldMap } from '../components/world/WorldMap.jsx'
import { VoyageOverlay } from '../components/world/VoyageOverlay.jsx'

export function WorldMapPage() {
  const { state, arriveAtIsland, arriveAtFinalIsland } = useGame()
  const { position, bearing, isSailing, sailTo } = useShipVoyage()
  const [restingPosition, setRestingPosition] = useState(() => getShipRestingPosition(state))
  const [destinationName, setDestinationName] = useState('')

  function handleSelectIsland(island) {
    if (isSailing) return
    const isFinal = island.id === finalIsland.id
    if (!isFinal && !isIslandUnlocked(island, state)) return

    setDestinationName(island.name)
    sailTo(restingPosition, island.position, () => {
      setRestingPosition(island.position)
      if (isFinal) {
        arriveAtFinalIsland()
      } else {
        arriveAtIsland(island.id)
      }
    })
  }

  return (
    <div className="relative h-full w-full">
      <WorldMap
        islands={islands}
        finalIsland={finalIsland}
        finalUnlocked={state.finalIslandUnlocked}
        isUnlocked={(island) => isIslandUnlocked(island, state)}
        isSolved={(island) => isIslandSolved(island, state)}
        onSelectIsland={handleSelectIsland}
        shipPosition={position ?? restingPosition}
        shipBearing={bearing}
      />
      <VoyageOverlay isSailing={isSailing} destinationName={destinationName} />
    </div>
  )
}
