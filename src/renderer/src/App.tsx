import { useState, useEffect  } from "react"
import type { DeckNamesAndIds, CardId, CardInfo, NoteId, NoteInfo} from './types/anki';
import { getDeckNamesAndIds, getCardsFromDeck, getCardsInfo, getNotesFromDeck, getNotesInfo } from "./lib/anki"


function App(): React.JSX.Element {
    const [decks, setDecks] = useState<DeckNamesAndIds>({});
    const [noteIds, setNoteIds] = useState<NoteId[]>([]);
    const [notesInfo, setNotesInfo] = useState<NoteInfo[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        getDeckNamesAndIds()
        .then( (fetchedDecks) => {
            setDecks(fetchedDecks);
            return Promise.all( Object.entries(fetchedDecks).map( ([_, id]) => getNotesFromDeck(id) ));
        })
        .then( (notesFromDecks) => {
            setNoteIds(notesFromDecks.flat());
            console.log(notesFromDecks.flat())
            return getNotesInfo(notesFromDecks.flat());
        })
        .then( (NotesInfo) => {
            setNotesInfo(NotesInfo);
            console.log(`Fetched info for ${NotesInfo.length}cards`);
        })
        .catch( (e: Error) => {setError(e.message)} );
    },[])
    return (
    <>
        <div className="p-4">
            {error && <p className="text-red-500">{error}</p>}
            <ul>
                {Object.entries(decks).map( ([deckName, deckId]) => ( <li key={deckId}> {deckName} ({deckId}) </li> ) )}
            </ul>
        </div>

        <h1>Card Ids</h1>
        <div className="p-4">
            {error && <p className="text-red-500">{error}</p>}
            <ul>
                {noteIds.map( (id) => ( <li key={id}> {id} </li> ) )}
            </ul>
        </div>

        <h1>Card Info</h1>
        <div className="p-4">
            {error && <p className="text-red-500">{error}</p>}
            <ul>
            {
                notesInfo.map( (noteInfo)=>{
                    const firstField = Object.entries(noteInfo.fields).find( ([_,field]) => field.order === 0 );
                    return (
                        <li> {firstField?firstField[1].value : "No field"} </li>
                    );
                } )
            }
            </ul>
        </div>

    </>
    )
}

export default App
