import Link from 'next/link'
import { BsFillLockFill, BsStack } from 'react-icons/bs'

const navItems = [
    {
        label: 'Deck',
        link: '/pages/decks',
        icon: <BsStack />,
    },
    {
        label: 'Login',
        link: 'pages/login',
        icon: <BsFillLockFill className="text-danger text-lg" />,
    },
]

export const Header = () => {
    return (
        <>
            <header className="w-full bg-profound-light dark:bg-profound-dark">
                <div className="flex flex-wrap justify-between items-center size-11/12 mx-auto min-h-10 h-full">
                    <div>
                        <h1 className="text-2xl text-typography-light dark:text-typography-dark">
                            Mastering Language
                        </h1>
                    </div>
                    <nav>
                        <ul className="flex">
                            {navItems.map((item, i) => (
                                <li className="flex" key={i}>
                                    <Link
                                        href={item.link}
                                        className="flex items-center p-2 tracking-wider text-typography-light dark:text-typography-dark"
                                    >
                                        {item.label}
                                        {item.icon}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    )
}
