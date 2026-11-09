# Roadmap

_Last updated: 2026-11-09_

Goal: a desktop app that takes Japanese media (plain text, subtitles, epub, pdf), tokenizes it, and shows how much of its vocabulary is already in your Anki decks, both as a share of unique words and as a share of the running text.

---

## App lifecycle

```
 Launch ──▶ Detect Anki ──▶ Anki page: select decks ──▶ Analyse page (stay here)
              ▲    │                    ▲                        │
              │    ▼                    └── change decks ────────┘
              └─ "Start Anki" (poll every 5s)
```

1. **Launch:** the app polls `isConnected` and shows the status in the Topbar.
2. **Detect:** once Anki is connected, the user is directed to the Anki page.
3. **Select decks:** the user picks decks, and the app fetches the known words for that selection once.
4. **Analyse:** the user stays on this page and analyses as much text as they like against the cached known words. No Anki calls are needed per analysis.
5. **Change decks:** going back to the Anki page and changing the selection refetches the known words. Nothing else does.

**Where state lives:** `ankiConnected`, `selectedDeckIds` and the known-words `Set` live in `App.tsx`, so they survive page switches. Pages receive them as props.

---

## Open decisions

- [x] **Error handling over IPC:** logic layers throw a typed `AnkiError`; `main/api/*` endpoints wrap them with `toResult` and return `Result<T>`. Yes/no endpoints like `isConnected` return a plain `boolean`.
- [x] **Channel names:** constants in `src/shared/ipcChannels.ts`
- [ ] **`analyze.text` output:** a full ordered `Token[]` (allows highlighting later) or grouped `WordCount[]` with counts (smaller response)
- [ ] **`analyze` input shape:** `text: string` only, or `{ kind: 'text' | 'file', ... }` to leave room for M4
- [ ] **Anki disconnects mid-session:** keep the cached known words so analysis still works offline, or block the Analyse page until Anki reconnects

---

## M0: Rewire IPC

Get one call working end to end with the new structure.

**Architecture:**
- `shared/types/api.ts`: `Api = { anki: AnkiApi, analyze: AnalyzeApi, external: ExternalApi }` (types only)
- `main/api/<area>.ts`: thin layer implementing each interface. It imports from the logic folders, never the other way around.
- `main/ipc/index.ts`: one-line `ipcMain.handle` pass-throughs to `main/api/*`
- `preload/index.ts`: `ipcRenderer.invoke` per method, exposed as `window.api`

**Order for adding an endpoint:** shared types → logic folder → `Api` interface → channel constant → IPC handler → preload → frontend

- [x] Skeleton files: `shared/types/api.ts`, `main/ipc/index.ts`, `preload/index.ts`, `preload/index.d.ts`
- [x] `AnkiApi` with `isConnected` in `shared/types/api.ts`
- [x] `ankiConnect.ts`: typed `AnkiError`, timeout, `response.ok` check; `api/helper.ts`: `toResult`
- [x] `main/api/anki.ts`: `isConnected()`
- [x] Wire `IPC.anki.isConnected` through IPC and preload
- [x] `App.tsx`: connection polling and the Topbar status dot
- [ ] Fix the dead imports in `DeckItem.tsx` (or rewrite it as part of M1 phase 2)
- [ ] `npm run typecheck` passes
- [x] Manual test: the dot goes green and red as Anki opens and closes

## M1: Core flow (plain text)

Built in the order a user moves through the app. Each phase can be clicked through on its own.

The UI only needs to be functional here: reuse the existing test UI, since it gets redesigned in M2.

### Phase 1: Launch and detect

- [ ] Show a clear "Anki not detected: start Anki with AnkiConnect installed" state on the Anki and Analyse pages while disconnected
- [ ] When Anki first connects and no decks are selected, send the user to the Anki page automatically, or show a prompt
- [ ] Decide and implement the mid-session disconnect behavior (see open decisions)

### Phase 2: Select decks (Anki page)

- [ ] `main/api/anki.ts`: `getDeckTree()` wrapped in `toResult`, plus the `AnkiApi` type, channel, handler and preload method
- [ ] `App.tsx`: move `selectedDeckIds` state here and pass it to the Anki and Analyse pages
- [ ] Rewrite `DeckItem` to recurse over `DeckNode.children` and use `leafIds` for group toggling
- [ ] `Pages/Anki.tsx`: load the tree once per connection, and select all leaf decks by default when nothing is selected yet
- [ ] `main/api/anki.ts`: `getKnownWords(deckIds) → Result<string[]>`, moving the note-fetching logic out of `analyze/` into `anki/`
- [ ] `App.tsx`: fetch the known words when the selection changes, and cache them as a `Set<string>`
- [ ] Show the selection summary (number of decks and words loaded), with a "Continue to Analyse" button

### Phase 3: Analyse (stays here)

- [ ] Rework `analyze/` to tokenize and filter only (no Anki imports), keeping duplicates or counts
- [ ] `main/api/analyze.ts`: `text()`, plus the `AnalyzeApi` type, channel, handler and preload method
- [ ] `Pages/Analyse.tsx`: if no decks are selected, show a prompt with a link to the Anki page
- [ ] Calculate **vocabulary %** (unique words) and **coverage %** (running text) in the frontend against the cached `Set`
- [ ] Show both percentages plus known and unknown word counts
- [ ] Show which decks are active, with a "Change decks" link back to the Anki page
- [ ] Repeat analyses must not call Anki: only `analyze.text` runs per click

## M2: UI rework

Starts once M1 is done, so the app can analyse plain text end to end. The current UI was a quick generated placeholder for testing. Redesign it now that the real flow and data exist, before adding more features on top.

- [ ] Decide on a visual direction: colors, typography, spacing
- [ ] Layout and navigation: Sidebar and Topbar, including how the lifecycle (detect → decks → analyse) is shown to the user
- [ ] Anki page: deck tree interaction (expand/collapse, group selection, note counts, selection summary)
- [ ] Analyse page: input area and a results view for both percentages and the known/unknown word lists
- [ ] Consistent loading, empty, error and "Anki not connected" states across pages
- [ ] Clean up components: shared building blocks (buttons, cards, checkbox) instead of repeated Tailwind class strings
- [ ] Leave room for M4/M5 features: a file-input area and an unknown-words list

## M3: Better matching

Make the percentages trustworthy.

- [ ] Clean Anki field values in the backend: strip HTML and `&nbsp;`, remove furigana (`食[た]べる` → `食べる`), split multi-word fields
- [ ] Choose which field holds the word, per note type, instead of always using field 0
- [ ] Persist the selected decks and field choice across restarts, so launching skips the Anki page when a saved selection exists
- [ ] Cache known words in main as well, so restarts and reconnects are faster
- [ ] Review `EXCLUDED_POS`: handle proper nouns/names, numbers, and katakana noise

## M4: File inputs

Each parser produces plain text that goes into `analyze`. Analyze itself never knows about file formats.

- [ ] `main/input/`: a parser interface and a file-picker dialog
- [ ] Subtitles: `.srt`, `.ass`
- [ ] `.epub`
- [ ] `.pdf` (text layer only)
- [ ] Analyse page: tabs or a drop zone for text vs. file

## M5: Useful output

- [ ] Unknown words ranked by frequency (what to learn next)
- [ ] Highlight unknown words in the source text (needs ordered tokens)
- [ ] Export unknown words (CSV, or straight into an Anki deck through AnkiConnect `addNotes`)
- [ ] Per-file history of past analyses

## M6: Release

- [ ] Fix the kuromoji dictionary path for packaged builds (`extraResources` + `process.resourcesPath`)
- [ ] electron-builder config, app name and icon
- [ ] `external` API area (`main/external/` + `main/api/external.ts`), e.g. fetching anime subtitles, with keys kept in main and no direct `fetch` from the frontend
- [ ] README: setup (Anki + AnkiConnect), usage, screenshots

---

## Later / ideas

- Dictionary lookups for unknown words (definitions, readings)
- JLPT-level breakdown of unknown words
- Support for other languages and tokenizers
