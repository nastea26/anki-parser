import { getDeckNamesAndIds, getDirectNoteCountFromDeck } from './ankiConnect'
import type { DeckNamesAndIds, DeckNode } from '../../shared/types/anki'

function buildNode( name: string, allNames: string[], deckMap: DeckNamesAndIds, counts: Record<string, number>): DeckNode {
    const children = allNames
        .filter(other => other.startsWith(name + '::') && !other.slice(name.length + 2).includes('::'))
        .map(child => buildNode(child, allNames, deckMap, counts))

    const leafIds = children.length > 0
        ? children.flatMap(child => child.leafIds)
        : counts[name] > 0 ? [deckMap[name]] : []

    return {
        id: deckMap[name],
        name,
        label: name.split('::').pop() ?? name,
        noteCount: counts[name],
        leafIds,
        children
    }
}

export async function getDeckTree(): Promise<DeckNode[]> {
    const deckMap = await getDeckNamesAndIds()
    const allNames = Object.keys(deckMap)
    const counts: Record<string, number> = Object.fromEntries(
        await Promise.all(
            allNames.map(async name => [name, await getDirectNoteCountFromDeck(name)] as const)
        )
    )
    return allNames
        .filter(name => !name.includes('::'))
        .map(name => buildNode(name, allNames, deckMap, counts))
}