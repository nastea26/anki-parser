import { ElectronAPI } from '@electron-toolkit/preload'
import { ElectronAPI } from '@electron-toolkit/preload'
import type kuromoji from 'kuromoji'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      tokenize: (text: string) => Promise<kuromoji.IpadicFeatures[]>
    }
  }
}
