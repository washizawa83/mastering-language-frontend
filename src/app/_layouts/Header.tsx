'use client'
import { HeaderLink } from '@/app/_components/HeaderLink'
import { MenuButton, MenuItem } from '@/app/_components/MenuButton'
import { useAuthContext } from '@/app/providers/AuthProvider'
import Image from 'next/image'
import router from 'next/router'
import { BsFillLockFill, BsStack } from 'react-icons/bs'
import { MdLogout } from 'react-icons/md'
import { TbSettingsFilled } from 'react-icons/tb'
import localImage from '../../public/mastering-language.png'

const navItems = [
    {
        label: 'Deck',
        link: '/pages/decks',
        icon: <BsStack />,
    },
]

export const Header = () => {
    const { isAuth, userInfo } = useAuthContext()

    const menuItems: MenuItem[] = [
        {
            label: 'Settings',
            icon: <TbSettingsFilled />,
            handleClick: () => router.push('/pages/settings'),
        },
        {
            label: 'Logout',
            icon: <MdLogout />,
            handleClick: () => {},
        },
    ]

    return (
        <>
            <header className="w-full h-10 bg-profound-light dark:bg-profound-dark">
                <div className="flex flex-wrap justify-between items-center size-11/12 mx-auto min-h-10 h-full">
                    <div>
                        <Image
                            src={localImage}
                            alt="logo"
                            width="30"
                            height="30"
                        />
                    </div>
                    <nav>
                        <ul className="flex">
                            {navItems.map((item, i) => (
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
                                        label="Login"
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
