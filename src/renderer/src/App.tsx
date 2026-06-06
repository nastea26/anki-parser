import { useState, useEffect  } from "react"
import type { DeckNamesAndIds } from "./types/anki";
import { getDeckNamesAndIds } from "./lib/anki"


function App(): React.JSX.Element {
    const [decks, setDecks] = useState<DeckNamesAndIds>({});
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        getDeckNamesAndIds()
        .then(setDecks)
        .catch( (e:Error) => setError(e.message) )
    },[])
    return (
    <>
        <div className="p-4">
            {error && <p className="text-red-500">{error}</p>}
            <ul>
                {Object.entries(decks).map( ([deckName, deckId]) => ( <li key={deckId}> {deckName} ({deckId}) </li> ) )}
            </ul>
        </div>
    </>
    )
}

export default App
