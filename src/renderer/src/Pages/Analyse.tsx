import { useState } from 'react'
import type { DeckId } from '../types/anki'
import TextInput from '../components/analysis/TextInput'
import { analyzeText } from '../lib/analyze'

interface AnalyseProps {
    ankiConnected: boolean
    selectedDeckIds: DeckId[]
}

export default function Analyse({ ankiConnected, selectedDeckIds }: AnalyseProps): React.JSX.Element {
    const [text, setText] = useState<string>('')

    const handleAnalyse = (content: string) => {
        analyzeText(content, selectedDeckIds)
    }

    if (!ankiConnected) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-red-400">Couldn't connect to Anki</p>
            </div>
        )
    }

    return (
        <div className="p-6 flex flex-col gap-6">
            <h2 className="text-cyan-400 text-2xl">Analyse Content</h2>
            <div>
                <TextInput onTextChange={setText} />
                <button onClick={() => handleAnalyse(text)} disabled={text.trim().length === 0} className="mt-4 px-6 py-2 rounded bg-cyan-600 text-white font-semibold hover:bg-cyan-400 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                    Analyse
                </button>
            </div>
        </div>
    )
}