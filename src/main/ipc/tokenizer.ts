import { ipcMain } from 'electron'
import kuromoji from 'kuromoji'

let tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null = null

function getTokenizer(): Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>> {
    return new Promise((resolve, reject) => {
        if (tokenizer) {
            resolve(tokenizer)
            return
        }
        kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' }).build((err, built) => {
            if (err) reject(err)
            tokenizer = built
            resolve(built)
        })
    })
}

export function registerTokenizerHandlers(): void {
    ipcMain.handle('tokenize', async (_, text: string) => {
        const t = await getTokenizer()
        return t.tokenize(text)
    })
}