'use client'
import { HeaderLink } from '@/app/_components/HeaderLink'
import { MenuButton, MenuItem } from '@/app/_components/MenuButton'
import { useAuthContext } from '@/app/providers/AuthProvider'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BsFillLockFill, BsStack } from 'react-icons/bs'
import { MdLogout } from 'react-icons/md'
import { TbSettingsFilled } from 'react-icons/tb'
import localImage from '../../public/mastering-language.png'

const navItems = [
    {
        label: 'デッキ',
        link: '/pages/decks',
        icon: <BsStack />,
    },
]

export const Header = () => {
    const { isAuth, userInfo } = useAuthContext()
    const { signout } = useAuthContext()
    const router = useRouter()

    const menuItems: MenuItem[] = [
        {
            label: '設定',
            icon: <TbSettingsFilled />,
            handleClick: () => router.push('/pages/settings'),
        },
        {
            label: 'ログアウト',
            icon: <MdLogout />,
            handleClick: () => {
                signout()
                router.push('/')
            },
        },
    ]

    return (
        <>
            <header className="w-full h-10 bg-profound-light dark:bg-profound-dark">
                <div className="flex flex-wrap justify-between items-center size-11/12 mx-auto min-h-10 h-full">
                    <div>
                        <Link href="/">
                            <Image
                                src={localImage}
                                alt="logo"
                                width="30"
                                height="30"
                            />
                        </Link>
                    </div>
                    <nav>
                        <ul className="flex">
                            {isAuth &&
                                navItems.map((item, i) => (
                                    <li className="flex" key={i}>
                                        <HeaderLink
                                            link={item.link}
                                            label={item.label}
                                            icon={item.icon}
                                        />
                                    </li>
                                ))}
                            {isAuth && userInfo?.username ? (
                                <div className="ml-10">
                                    <MenuButton
                                        label={userInfo.username}
                                        items={menuItems}
                                    />
                                </div>
                            ) : (
                                <div className="md:flex">
                                    <HeaderLink
                                        link="/pages/login"
                                        label="ログイン"
                                        icon={
                                            <BsFillLockFill className="text-success text-lg" />
                                        }
                                        isDisabled={true}
                                    />
                                </div>
                            )}
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    )
}
