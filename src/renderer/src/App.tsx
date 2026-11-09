import { useState, useEffect } from 'react';

import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Home from './Pages/Home';

export type View = 'home' | 'anki' | 'analyse'

function App(): React.JSX.Element {
    const [ankiConnected, setAnkiConnected] = useState<boolean>(false)
    const [view, setView] = useState<View>('home')

    useEffect( () => {
        let cancelled = false
        let timer: ReturnType<typeof setTimeout>

        const check = async (): Promise <void> => {
            const connected = await window.api.anki.isConnected()
            if(cancelled) return
            setAnkiConnected(connected)
            timer = setTimeout(check, 5000)
        }
        
        check()
        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [])

    useEffect(() => {
        if (!ankiConnected) return
        window.api.anki.getDeckTree().then(res => {
            if (res.ok) console.log('Deck tree:', res.data)
            else console.error('getDeckTree failed:', res.error)
        })
    }, [ankiConnected])


    return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
        <Topbar ankiConnected={ankiConnected}  />
        <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={view} onNavigate={setView} />
        <main className="flex-1 overflow-auto p-6">
            {view === 'home' && <Home/>}
            {/* {view === 'anki' && <Anki ankiConnected={ankiConnected} selectedDeckIds={selectedDeckIds} setSelectedDeckIds={setSelectedDeckIds} />}
            {view === 'analyse' && <Analyse ankiConnected={ankiConnected} selectedDeckIds={selectedDeckIds} />} */}
        </main>
        </div>
    </div>
    )
}

export default App