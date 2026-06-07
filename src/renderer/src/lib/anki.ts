import type { DeckNamesAndIds, CardId, CardInfo, DeckId, NoteId, NoteInfo} from '../types/anki'

const ANKI_URL = 'http://127.0.0.1:8765';

async function ankiRequest<T>( action: string, params?: Record<string, unknown> ): Promise<T> {
    
    const response = await fetch(ANKI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({ action, version: 6, params })
    })
    const data = await response.json();

    if(data.error) throw new Error(data.error);
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