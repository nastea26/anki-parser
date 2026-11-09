import type { DeckNode } from "../../shared/types/anki";
import type { Result } from "../../shared/types/result";
import { getAnkiConnectVersion } from "../ankiConnect/client";
import { buildDeckTree } from "../decks";
import { toResult } from "./helper";

export async function isConnected(): Promise<boolean>{
    const res = await toResult( ()=> getAnkiConnectVersion() )
    return res.ok;
}

export async function getDeckTree(): Promise< Result<DeckNode[]> >{
    return toResult(() => buildDeckTree() )
}