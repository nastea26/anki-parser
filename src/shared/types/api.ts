// import type { DeckId, DeckNode } from './anki'
// import type { AnalysisResult } from './analysis'

import type { DeckNode } from "./anki"
import type { Result } from "./result"

export interface AnkiApi {
    isConnected:()=> Promise<boolean>
    getDeckTree:()=> Promise<Result<DeckNode[]>> 
}

export interface AnalyzeApi {
    //this will be added when i get anki running
}

export interface ExternalApi {
    // this will be used for fetching subtitles and maybe other things we will see
}

export interface Api {
    anki: AnkiApi
    analyze: AnalyzeApi
    external: ExternalApi
}


