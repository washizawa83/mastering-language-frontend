import { IconContext } from 'react-icons'

type Props = {
    label: string
    icon: JSX.Element
    outline?: boolean
    color?: 'success' | 'error'
    onClick: () => void
}

const colors = {
    success: '#22c55e',
    error: '#f43f5e',
}

export const Button = ({
    label,
    icon,
    outline = false,
    color,
    onClick,
}: Props) => {
    return (
        <button
            onClick={() => onClick()}
            className={`flex items-center
                ${
                    outline
                        ? `bg-transparent border ${color && `border-${color}`}`
                        : `bg-deep-light dark:bg-deep-dark ${color && `bg-${color}`}`
                }
                py-1 px-2 rounded-md transition-all duration-200 hover:bg-profound-light hover:dark:bg-profound-dark hover:ring-offset-2 active:ring-2 active:ring-neutral-800`}
        >
            {label}
            <IconContext.Provider
                value={{ color: color ? colors[color] : '', size: '20px' }}
            >
                {icon}
            </IconContext.Provider>
        </button>
    )
}
