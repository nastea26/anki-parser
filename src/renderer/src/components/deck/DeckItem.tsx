import type { DeckNamesAndIds, DeckId } from '../../types/anki'
import { isWrapper, getDirectChildren, getAllLeafDescendants } from '../../lib/deckUtils'
import Checkbox from './Checkbox'

interface DeckItemProps {
    name: string
    allNames: string[]
    deckMap: DeckNamesAndIds
    noteCounts: Record<string, number>
    selectedDeckIds: DeckId[]
    depth: number
    onToggleDeck: (id: DeckId) => void
    onToggleGroup: (name: string, allNames: string[], deckMap: DeckNamesAndIds) => void
}

export default function DeckItem({
    name,
    allNames,
    deckMap,
    noteCounts,
    selectedDeckIds,
    depth,
    onToggleDeck,
    onToggleGroup
}: DeckItemProps): React.JSX.Element | null {
    const id = deckMap[name]
    const hasNotes = noteCounts[name] > 0
    const wrapper = isWrapper(name, allNames)
    const indent = depth > 0 ? `ml-${depth * 4}` : ''

    if (wrapper) {
        const leafDescendants = getAllLeafDescendants(name, allNames, noteCounts)
        const leafIds = leafDescendants.map(n => deckMap[n]).filter(Boolean)
        const allSelected = leafIds.length > 0 && leafIds.every(id => selectedDeckIds.includes(id))
        const children = getDirectChildren(name, allNames)

        return (
            <div key={name} className={indent}>
                <div
                    onClick={() => onToggleGroup(name, allNames, deckMap)}
                    className="flex items-center gap-2 px-3 py-1.5 cursor-pointer group"
                >
                    <Checkbox checked={allSelected} />
                    <p className="text-gray-400 text-xs uppercase tracking-wider group-hover:text-gray-300 transition-colors">
                        {name.split('::').pop()}
                    </p>
                </div>
                <div className="flex flex-col gap-0.5">
                    {children.map(child => (
                        <DeckItem
                            key={child}
                            name={child}
                            allNames={allNames}
                            deckMap={deckMap}
                            noteCounts={noteCounts}
                            selectedDeckIds={selectedDeckIds}
                            depth={depth + 1}
                            onToggleDeck={onToggleDeck}
                            onToggleGroup={onToggleGroup}
                        />
                    ))}
                </div>
            </div>
        )
    }

    if (!hasNotes) return null

    return (
        <div
            key={id}
            onClick={() => onToggleDeck(id)}
            className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors ${indent}
                ${selectedDeckIds.includes(id)
                    ? 'text-cyan-400 hover:bg-gray-700'
                    : 'text-gray-500 opacity-60 hover:bg-gray-700 hover:opacity-100'
                }`}
        >
            <Checkbox checked={selectedDeckIds.includes(id)} />
            {name.split('::').pop()}
        </div>
    )
}