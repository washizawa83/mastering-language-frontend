import Link from 'next/link'

type Props = {
    label: string
    link: string
    icon: JSX.Element
}

export const FooterLink = ({ label, link, icon }: Props) => {
    return (
        <Link href={link} className="flex flex-col items-center">
            {icon}
            {label}
        </Link>
    )
}
