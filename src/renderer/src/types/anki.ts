//fetch cmds:
/* 
curl http://127.0.0.1:8765   -X POST   -H "Content-Type: application/json"   -d '{"action": "findCards", "version": 6, "params": {"query": "did:1753216958205"}}' | jq
curl http://127.0.0.1:8765   -X POST   -H "Content-Type: application/json"   -d '{"action": "deckNamesAndIds", "version": 6}' | jq
 curl http://127.0.0.1:8765   -X POST   -H "Content-Type: application/json"   -d '{"action": "cardsInfo", "version": 6, "params": { "cards": [1753642900906] } }' | jq
*/

export type DeckName = string;
export type DeckId = number;
export type DeckNamesAndIds = Record<DeckName, DeckId>;
export type CardId = number;
export type CardInfo = {
    cardId: CardId,
    fields: Record<string, {value: string, order: number}>,
    fieldOrder: number,
    question: string,
    answer: string,
    modelName: string,
    ord: number,
    deckName: string,
    css: string,
    factor: number,
    interval: number,
    note: number,
    type: number,
    queue: number,
    due: number,
    reps: number,
    lapses: number,
    left: number,
    mod: number,
    nextReviews: string[],
    flags: number,

};
export type NoteId = number;
export type NoteInfo = {
    noteId: NoteId,
    profile:string,
    tags:string[],
    fields: Record<string, {value:string, order:number}>,
    modelName: string,
    mod: number,
    cards: number[]
}
export type Version = number;