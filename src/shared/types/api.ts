// import type { DeckId, DeckNode } from './anki'
// import type { AnalysisResult } from './analysis'

import type { DeckNode } from "./anki"
import type { Result } from "./result"
import type { Token } from "./analysis"

export interface AnkiApi {
    isConnected:()=> Promise<boolean>
    getDeckTree:()=> Promise<Result<DeckNode[]>> 
}

export interface AnalyzeApi {
    text: (text: string) => Promise<Result <Token[]> >
}

export interface ExternalApi {
    // this will be used for fetching subtitles and maybe other things we will see
}

export interface Api {
    anki: AnkiApi
    analyze: AnalyzeApi
    external: ExternalApi
}


