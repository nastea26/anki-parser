interface CheckboxProps {
    checked: boolean
}

export default function Checkbox({ checked }: CheckboxProps): React.JSX.Element {
    return (
        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0
            ${checked ? 'border-cyan-400 bg-cyan-400' : 'border-gray-500'}`}
        >
            {checked && (
                <svg className="w-3 h-3 text-gray-900" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            )}
        </div>
    )
}