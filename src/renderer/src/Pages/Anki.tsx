import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { getDeckNamesAndIds, getDirectNoteCountFromDeck } from '../lib/anki'
import { getAllLeafDescendants } from '../lib/deckUtils'
import type { DeckNamesAndIds, DeckId } from '../types/anki'
import DeckItem from '../components/deck/DeckItem'

interface AnkiProps {
    ankiConnected: boolean
    selectedDeckIds: DeckId[]
    setSelectedDeckIds: Dispatch<SetStateAction<DeckId[]>>
}

export default function Anki({ ankiConnected, selectedDeckIds, setSelectedDeckIds }: AnkiProps): React.JSX.Element {
    const [decks, setDecks] = useState<DeckNamesAndIds | null>(null)
    const [noteCounts, setNoteCounts] = useState<Record<string, number>>({})

    const toggleDeck = (id: DeckId) => {
        setSelectedDeckIds(prev =>
            prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
        )
    }

    const toggleGroup = (groupName: string, allNames: string[], deckMap: DeckNamesAndIds) => {
        const leafNames = getAllLeafDescendants(groupName, allNames, noteCounts)
        const leafIds = leafNames.map(n => deckMap[n]).filter(Boolean)
        const allSelected = leafIds.every(id => selectedDeckIds.includes(id))
        setSelectedDeckIds(prev =>
            allSelected
                ? prev.filter(id => !leafIds.includes(id))
                : [...new Set([...prev, ...leafIds])]
        )
    }

    useEffect(() => {
        if (!ankiConnected) {
            setDecks(null)
            setSelectedDeckIds([])
            setNoteCounts({})
            return
        }
        getDeckNamesAndIds()
            .then(async (fetchedDecks) => {
                setDecks(fetchedDecks)
                const allNames = Object.keys(fetchedDecks)
                const counts = await Promise.all(
                    allNames.map(async name => ({
                        name,
                        count: await getDirectNoteCountFromDeck(name)
                    }))
                )
                const countMap = Object.fromEntries(counts.map(({ name, count }) => [name, count]))
                setNoteCounts(countMap)
                const leafIds = allNames
                    .filter(name => countMap[name] > 0)
                    .map(name => fetchedDecks[name])
                if(selectedDeckIds.length === 0){
                    setSelectedDeckIds(leafIds)
                }
            })
            .catch(() => setDecks(null))
    }, [ankiConnected])

    const allNames = decks ? Object.keys(decks) : []
    const topLevel = allNames.filter(name => !name.includes('::'))

    return (
        <div className="p-2 m-3">
            <h2 className="text-cyan-400 text-2xl mb-4">Select Anki decks to parse</h2>
            <div className="p-4">
                {!ankiConnected && (
                    <p className="text-red-400 text-lg font-semibold m-2">
                        Anki is not connected. Please make sure Anki is running and AnkiConnect is installed.
                    </p>
                )}
                {ankiConnected && !decks && (
                    <p className="text-gray-400 text-lg font-semibold m-2">Loading decks...</p>
                )}
                {ankiConnected && decks && Object.keys(noteCounts).length === 0 && (
                    <p className="text-gray-400 text-lg font-semibold m-2">Loading note counts...</p>
                )}
                {ankiConnected && decks && Object.keys(noteCounts).length > 0 && (
                    <div className="flex flex-col gap-0.5">
                        {topLevel.map(name => (
                            <DeckItem
                                key={name}
                                name={name}
                                allNames={allNames}
                                deckMap={decks}
                                noteCounts={noteCounts}
                                selectedDeckIds={selectedDeckIds}
                                depth={0}
                                onToggleDeck={toggleDeck}
                                onToggleGroup={toggleGroup}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}