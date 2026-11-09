import { ipcMain } from 'electron'
import { IPC } from '../../shared/ipcChannels'
import * as anki from '../api/anki'

// Register every ipcMain.handle(...) here. Called once from main/index.ts before the window is created.
export function registerIpcHandlers(): void {
    ipcMain.handle( IPC.anki.isConnected, () => anki.isConnected() )
    ipcMain.handle( IPC.anki.getDeckTree, () => anki.getDeckTree() )
}
