import { app } from 'electron'
import { join } from 'path'
import kuromoji from 'kuromoji'

type Tokenizer = kuromoji.Tokenizer<kuromoji.IpadicFeatures>

let tokenizerPromise: Promise<Tokenizer> | null = null

function getTokenizer(): Promise<Tokenizer> {
    if (!tokenizerPromise) {
        tokenizerPromise = new Promise((resolve, reject) => {
            const dicPath = join(app.getAppPath(), 'node_modules/kuromoji/dict')
            kuromoji.builder({ dicPath }).build((err, built) => {
                if (err) {
                    tokenizerPromise = null   // allow a retry
                    reject(err)
                    return
                }
                resolve(built)
            })
        })
    }
    return tokenizerPromise
}

export async function tokenize(text: string): Promise<kuromoji.IpadicFeatures[]> {
    const t = await getTokenizer()
    return t.tokenize(text)
}