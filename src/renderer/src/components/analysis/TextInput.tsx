import { useRef, useState } from 'react'

interface TextInputProps {
    onTextChange: (text: string) => void
}

export default function TextInput({ onTextChange }: TextInputProps): React.JSX.Element {
    const [text, setText] = useState<string>('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
        onTextChange(e.target.value)
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }

    return (
        <div>
            <h2 className="text-base pt-2 pb-2">Parse from plaintext</h2>
            <textarea
                ref={textareaRef}
                value={text}
                onChange={handleChange}
                placeholder="Enter Japanese text for analysis..."
                className="w-full min-h-30 p-3 border border-gray-700 rounded bg-gray-900 text-gray-300 focus:outline-none focus:border-cyan-400 resize-none overflow-hidden"
            />
        </div>
    )
}