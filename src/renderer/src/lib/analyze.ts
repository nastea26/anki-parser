import type { DeckId, NoteId, NoteInfo} from '../types/anki'
import { getNotesFromDeck, getNotesInfo } from './anki'
import type kuromoji from 'kuromoji'

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

export async function analyzeText(text: string, selectedDeckIds: DeckId[]) {
    const tokens = await window.api.tokenize(text)
    const cleanedTokens = cleanTokens(tokens);
    const uniqueTokens = [...new Set(cleanedTokens)]
    console.log('Unique Tokens:', uniqueTokens)
    const notesInfo: NoteInfo[] = [];

    await Promise.all(
        selectedDeckIds.map( (deckId) => {
            return getNotesFromDeck(deckId)
            .then( (noteIds: NoteId[]) => getNotesInfo(noteIds) )
            .then( (infos: NoteInfo[]) => notesInfo.push(...infos) )
            .catch( (err) => console.error(`Error fetching notes for deck ${deckId}:`, err) );
        } )
    )
    const expressions : string[] = [];

    notesInfo.map( (noteInfo) => {
        const entry = ( Object.entries(noteInfo.fields).find( ([_, field]) => field.order === 0 ) );
        if( entry ){
            expressions.push(entry[1].value);
        }
    })

    let matches = 0;
    uniqueTokens.map( (token) => {
        expressions.map( (exp) => {
            if(exp === token ) {
                matches++;
                console.log(`Matched the token: '${token}' with expression: '${exp}' `)

            }
        } )
    } )
    console.log(`number of matches: ${matches} out of ${uniqueTokens.length}. (${(matches/uniqueTokens.length) * 100}%)`);
}