import type kuromoji from 'kuromoji'
import { tokenize } from '../tokenizer'
import type { Token } from '../../shared/types/analysis'

const EXCLUDED_POS = new Set([
    '助詞',      // particles (は、が、を、に、で...)
    '助動詞',    // auxiliary verbs (た、です、ます...)
    '記号',      // symbols/punctuation
    '感動詞',    // interjections
    '接続詞',    // conjunctions
    '接頭詞',    // prefixes
    '接尾',      // suffixes (this catches ら、ら、たち etc.)
])

function cleanTokens(tokens: kuromoji.IpadicFeatures[]): kuromoji.IpadicFeatures[] {
    return tokens
        .filter(token =>
            !EXCLUDED_POS.has(token.pos) &&
            !EXCLUDED_POS.has(token.pos_detail_1) &&
            token.basic_form !== '*' &&
            token.basic_form.trim() !== ''
        )
}

export async function analyzeText(text: string): Promise<Token[]> {
    const tokens = await tokenize(text)
    const cleaned_tokens = cleanTokens(tokens)
    
    return cleaned_tokens.map(token=> ({
        surface: token.surface_form,
        basicForm: token.basic_form,
        reading: token.reading ?? '',
        pos: token.pos
    }))

}