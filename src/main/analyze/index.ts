import type { DeckId } from '../../shared/types/anki'
import type kuromoji from 'kuromoji'
import { getNotesFromDeck, getNotesInfo } from '../anki/ankiConnect'
import { tokenize } from '../tokenizer'
import type { AnalysisResult } from '../../shared/types/analysis'

const EXCLUDED_POS = new Set([
    '助詞',      // particles (は、が、を、に、で...)
    '助動詞',    // auxiliary verbs (た、です、ます...)
    '記号',      // symbols/punctuation
    '感動詞',    // interjections
    '接続詞',    // conjunctions
    '接頭詞',    // prefixes
    '接尾',      // suffixes (this catches ら、ら、たち etc.)
])

function cleanTokens(tokens: kuromoji.IpadicFeatures[]): string[] {
    return tokens
        .filter(token =>
            !EXCLUDED_POS.has(token.pos) &&
            !EXCLUDED_POS.has(token.pos_detail_1) &&
            token.basic_form !== '*' &&
            token.basic_form.trim() !== ''
        )
        .map(token => token.basic_form)
}

export async function analyzeText(text: string, selectedDeckIds: DeckId[]): Promise<AnalysisResult> {
    const tokens = await tokenize(text)
    const uniqueTokens = [...new Set(cleanTokens(tokens))]

    const noteInfos = await Promise.all(
        selectedDeckIds.map(async (deckId) => {
            try {
                return await getNotesInfo(await getNotesFromDeck(deckId))
            } catch (err) {
                console.error(`Error fetching notes for deck ${deckId}:`, err)
                return []
            }
        })
    )

    const known = new Set<string>()
    for (const note of noteInfos.flat()) {
        const first = Object.values(note.fields).find(field => field.order === 0)
        if (first) known.add(first.value)
    }

    const matched = uniqueTokens.filter(token => known.has(token))
    const unmatched = uniqueTokens.filter(token => !known.has(token))

    return {
        uniqueCount: uniqueTokens.length,
        known : matched,
        unknown : unmatched,
        percentage: uniqueTokens.length > 0 ? (matched.length / uniqueTokens.length) * 100 : 0
    }
}