
interface TopbarProps {
  ankiConnected: boolean
}

export default function Topbar({ ankiConnected }: TopbarProps): React.JSX.Element {

    return (
        <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
            <h1 className="text-cyan-500 font-bold text-lg">Vocab Analyzer</h1>
            <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${ankiConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-sm text-gray-400">{ankiConnected ? 'Anki connected' : 'Anki disconnected'}</span>
            </div>
        </div>
    )
}
