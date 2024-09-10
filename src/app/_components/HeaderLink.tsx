import Link from 'next/link'

type Props = {
    link: string
    label?: string
    icon?: JSX.Element
    isDisabled?: boolean
}

export const HeaderLink = ({ link, label, icon, isDisabled }: Props) => {
    return (
        <Link
            href={link}
            className={`flex items-center pl-10 tracking-wider text-typography-light dark:text-typography-dark ${!isDisabled && 'hidden md:flex'}`}
        >
            {label}
            <span className="pl-2">{icon}</span>
        </Link>
    )
}
