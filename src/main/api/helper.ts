import type { Result } from "../../shared/types/result"
import { AnkiError } from "../ankiConnect/client"

export async function toResult<T>(fn: () => Promise<T>): Promise<Result<T>>{
    try{
        return {ok: true, data: await fn() }
    }catch(err) {
        if(err instanceof AnkiError) return {ok: false, error: {type: err.type, message: err.message} }
        return {ok: false, error: {type: 'unknown', message: String(err)} }
    }

}