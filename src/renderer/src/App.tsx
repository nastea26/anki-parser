import { useState, useEffect } from 'react'
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar'
import Home from './Pages/Home';
import Anki from './Pages/Anki';
import Analyse from './Pages/Analyse';
import { getAnkiConnectVersion } from './lib/anki';
import { DeckId } from './types/anki';
export type View = 'home' | 'anki' | 'analyse'


function App(): React.JSX.Element {
    const [ankiConnected, setAnkiConnected] = useState<boolean>(false)
    const [view, setView] = useState<View>('home')
    const [selectedDeckIds, setSelectedDeckIds] = useState<DeckId[]>([])
    useEffect(() => {
    const check = () => {
        getAnkiConnectVersion()
        .then(() => setAnkiConnected(true))
        .catch(() => setAnkiConnected(false))
    }
    check()
    const interval = setInterval(check, 5000)
    return () => clearInterval(interval)
    }, [])

    return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
        <Topbar ankiConnected={ankiConnected}  />
        <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={view} onNavigate={setView} />
        <main className="flex-1 overflow-auto p-6">
            {view === 'home' && <Home/>}
            {view === 'anki' && <Anki ankiConnected={ankiConnected} selectedDeckIds={selectedDeckIds} setSelectedDeckIds={setSelectedDeckIds} />}
            {view === 'analyse' && <Analyse ankiConnected={ankiConnected} selectedDeckIds={selectedDeckIds} />}
        </main>
        </div>
    </div>
    )
}

export default App