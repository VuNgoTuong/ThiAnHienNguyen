import { GameShell } from './components/layout/GameShell.jsx'
import { ErrorBoundary } from './components/layout/ErrorBoundary.jsx'

function App() {
  return (
    <ErrorBoundary>
      <GameShell />
    </ErrorBoundary>
  )
}

export default App
