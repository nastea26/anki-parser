export type DeckName = string;
export type DeckId = number;
export type DeckNamesAndIds = Record<DeckName, DeckId>;
export type CardId = number;
export type Version = number;
export type NoteId = number;

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
export type NoteInfo = {
    noteId: NoteId,
    profile:string,
    tags:string[],
    fields: Record<string, {value:string, order:number}>,
    modelName: string,
    mod: number,
    cards: number[]
}

export type DeckNode = {
    id: DeckId,
    name: DeckName, // 'full path -> Root::subdeck::subsubdeck'
    label: string, //'deck name'
    noteCount: number, //directly in this deck
    leafIds: DeckId[], //all leaf decks at or under this node 
    children: DeckNode[]
}