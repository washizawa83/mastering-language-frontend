type Props = {
    label: string
    icon: JSX.Element
}

export const Button = ({ label, icon }: Props) => {
    return (
        <button className="flex items-center bg-deep-light dark:bg-deep-dark py-1 px-2 rounded-md transition-all duration-200 hover:bg-profound-light hover:dark:bg-profound-dark hover:ring-offset-2 active:ring-2 active:ring-neutral-800">
            {label}
            {icon}
        </button>
    )
}
