import { useAuthContext } from '@/app/providers/AuthProvider'
import Link from 'next/link'
import { BsFillLockFill, BsStack } from 'react-icons/bs'

const navItems = [
    {
        label: 'Deck',
        link: '/pages/decks',
        icon: <BsStack />,
    },
]

export const Header = () => {
    const { isAuth, userInfo } = useAuthContext()

    return (
        <>
            <header className="w-full h-10 bg-profound-light dark:bg-profound-dark">
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
                            {isAuth ? (
                                <Link
                                    href="/pages/user"
                                    className="flex items-center p-2 tracking-wider text-typography-light dark:text-typography-dark"
                                >
                                    {userInfo?.username}
                                </Link>
                            ) : (
                                <Link
                                    href="/pages/login"
                                    className="flex items-center p-2 tracking-wider text-typography-light dark:text-typography-dark"
                                >
                                    Login
                                    <BsFillLockFill className="text-success text-lg" />
                                </Link>
                            )}
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    )
}
