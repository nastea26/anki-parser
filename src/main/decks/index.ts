import { getDeckNamesAndIds, getDirectNoteCountsFromDecks } from '../ankiConnect/client'
import type { DeckNamesAndIds, DeckNode } from '../../shared/types/anki'

function buildNode( name: string, allNames: string[], deckMap: DeckNamesAndIds, counts: Record<string, number>): DeckNode {
    const children = allNames
        .filter(other => other.startsWith(name + '::') && !other.slice(name.length + 2).includes('::'))
        .map(child => buildNode(child, allNames, deckMap, counts))

    const own = counts[name] > 0 ? [deckMap[name]] : []

    const leafIds =[...own, ...children.flatMap(child=>child.leafIds)]

    return {
        id: deckMap[name],
        name,
        label: name.split('::').pop() ?? name,
        noteCount: counts[name],
        leafIds,
        children
    }
}

export async function buildDeckTree(): Promise<DeckNode[]> {
    const deckMap = await getDeckNamesAndIds()
    const allNames = Object.keys(deckMap)
    const counts = await getDirectNoteCountsFromDecks(allNames)
    return allNames
    .filter(name => !name.includes('::') ).map( name=> buildNode(name, allNames, deckMap, counts) )
}