import type { DeckNamesAndIds, CardId, CardInfo, DeckId, NoteId, NoteInfo, Version, DeckName} from '../../shared/types/anki'
import { ErrorType } from '../../shared/types/result';

const ANKI_URL = 'http://127.0.0.1:8765';

export class AnkiError extends Error{
    constructor(public type: ErrorType, message: string) { super(message) }
}

async function ankiRequest<T>( action: string, params?: Record<string, unknown> ): Promise<T> {
    let response: Response
    try{
        response = await fetch(ANKI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({ action, version: 6, params }),
            signal: AbortSignal.timeout(5000)
        })
    } catch(err) {
        if(err instanceof DOMException && err.name === 'TimeoutError') throw new AnkiError('timeout', 'AnkiConnect did not respond')
        throw new AnkiError('offline', 'Could not reach AnkiConnect. Check if Anki is running')
    }
    if(!response.ok) throw new AnkiError('anki', `HTTP ${response.status}`)
    
    const data = await response.json();

    if(data.error) throw new AnkiError('anki', data.error)
    return data.result as T;

}

export async function getDeckNamesAndIds(): Promise<DeckNamesAndIds> {
    const action = "deckNamesAndIds";
    return ankiRequest<DeckNamesAndIds>(action);
}

export async function getCardsFromDeck(deckId: DeckId): Promise<CardId[]>{
    const action = "findCards";
    const params = {query: `did:${deckId}`};
    return ankiRequest<CardId[]>(action, params);
}

export async function getCardsInfo(cardIds: CardId[]): Promise<CardInfo[]>{
    const action = "cardsInfo";
    const params = {cards: cardIds};
    return ankiRequest<CardInfo[]>(action, params);
}

export async function getNotesFromDeck(deckId: DeckId): Promise<NoteId[]>{
    const action = "findNotes";
    const params = {query: `did:${deckId}`};
    return ankiRequest<NoteId[]>(action,params);
}

export async function getNotesInfo(noteIds: NoteId[]): Promise <NoteInfo[]>{
    const action = "notesInfo";
    const params = {notes: noteIds};
    return ankiRequest<NoteInfo[]>(action,params);
}

export async function getAnkiConnectVersion(): Promise <Version>{
    const action = "version";
    return ankiRequest<Version>(action);
}

export async function getDirectNoteCountFromDeck(deckName: DeckName ): Promise<number> {
    const action = "findNotes"
    const params = { query: `deck:"${deckName}" -deck:"${deckName}::*"` }
    const notes = await ankiRequest<NoteId[]>(action, params)
    return notes.length
}