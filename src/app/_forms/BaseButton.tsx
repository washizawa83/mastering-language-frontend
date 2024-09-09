type Props = {
    label: string
    handleClick: () => void
    type?: 'submit' | 'reset' | 'button'
    disabled?: boolean
}

export const BaseButton = ({
    label,
    handleClick,
    type,
    disabled = false,
}: Props) => {
    return (
        <button
            className="relative h-12 overflow-hidden rounded bg-deep-light dark:bg-deep-dark px-5 py-2.5 text-white transition-all duration-200 hover:bg-profound-light hover:dark:bg-profound-dark hover:ring-offset-2 active:ring-2 active:ring-neutral-800"
            onClick={() => handleClick()}
            type={type}
            disabled={disabled}
        >
            {label}
        </button>
    )
}
