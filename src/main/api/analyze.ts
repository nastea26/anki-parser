import type { Result } from "../../shared/types/result";
import type { Token } from "../../shared/types/analysis";
import { analyzeText } from "../analyze";
import { toResult } from "./helper";

export async function text(text: string): Promise<Result <Token[]> > {
    return toResult( ()=> analyzeText(text) )
}