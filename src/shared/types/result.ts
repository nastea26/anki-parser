export type ErrorType = 'offline' | 'anki' | 'timeout' | 'unknown'
export type Result<T> = {ok: true, data: T} | {ok:false, error: {type: ErrorType, message: string } }