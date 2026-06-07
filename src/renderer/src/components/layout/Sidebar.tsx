import type { View } from '../../App'

export interface SidebarProps {
  currentView: View
  onNavigate: (view: View) => void
}

function Sidebar({ currentView, onNavigate }: SidebarProps): React.JSX.Element {
  return (
    <div className="w-52 h-full bg-gray-800 flex flex-col p-4 gap-3">
        <button
            onClick={() => onNavigate('home')}
            className={`text-left p-2 rounded ${currentView === 'home' ? 'bg-gray-600 text-cyan-400' : 'text-gray-300 hover:bg-gray-700'}`}
        > 
            Home 
        </button>
      
        <button
            onClick={() => onNavigate('anki')}
            className={`text-left p-2 rounded ${currentView === 'anki' ? 'bg-gray-600 text-cyan-400' : 'text-gray-300 hover:bg-gray-700'}`}
        >
            Anki
        </button>
        <button
            onClick={() => onNavigate('analyse')}
            className={`text-left p-2 rounded ${currentView === 'analyse' ? 'bg-gray-600 text-cyan-400' : 'text-gray-300 hover:bg-gray-700'}`}
        >
            Analyse
        </button>
    </div>
  )
}

export default Sidebar