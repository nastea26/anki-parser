function Home(): React.JSX.Element {
    return (
        <div className="p-2 m-3">
            <h2 className="text-cyan-400 text-2xl">About</h2>
            <div className="p-4">
                <p className="text-lg font-semibold m-2">Welcome to the Vocab Analyzer!</p>
                <p className="text-lg font-semibold m-2">This is a tool for parsing your Anki decks with media like subtitles, .epubs, .pdf files</p>
                <p className="text-lg font-semibold m-2">It will get words from the selected media and then check for how many words are already in your Anki decks</p>
                <p className="text-lg font-semibold m-2 mt-4">NOTE: Do not think that the % of matched vocab is 1:1, things like names etc... can force match % to be lower. Aditionally, the tokenizer can make mistakes which would cause the % to jump up. This tool should be used to get a rough estimate </p>
                <p className="text-gray-400 text-sm m-4">*IT IS RECOMMENDED THAT YOU SELECT ONLY YOUR VOCAB DECKS IN THE ANKI SECTION </p>
            </div>
        </div>
    )
}

export default Home