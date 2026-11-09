import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { Api } from '../shared/types/api'
import { IPC } from '../shared/ipcChannels'

// Bridge: each method should forward to main via ipcRenderer.invoke('channel', ...args)
const api: Api = {
    anki: {
        isConnected: () => ipcRenderer.invoke(IPC.anki.isConnected),
        getDeckTree: () => ipcRenderer.invoke(IPC.anki.getDeckTree)
    },
    
    analyze:{
        text: (text) => ipcRenderer.invoke(IPC.analyze.text, text),
    },

    external:{
        
    }

}

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
}
