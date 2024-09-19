'use client'
import { BaseAuthForm } from '@/app/_forms/BaseAuthForm'
import { useTheme } from '@/app/layout'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { IconContext } from 'react-icons'
import { BsToggleOff, BsToggleOn } from 'react-icons/bs'
import { IoIosArrowForward } from 'react-icons/io'

export const SettingsPage = () => {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const { toggleTheme, theme } = useTheme()

    useEffect(() => {
        theme === 'dark' && setIsDarkMode(true)
    }, [])

    const onToggleTheme = () => {
        toggleTheme()
        setIsDarkMode(!isDarkMode)
    }

    return (
        <BaseAuthForm title="設定">
            <div>
                <ul className="mb-3 px-5">
                    <li className="flex items-center justify-between mb-3 leading-10">
                        <h3>ダークモード</h3>
                        <IconContext.Provider
                            value={{
                                size: '38px',
                                color: isDarkMode ? '#ddd' : '#333',
                            }}
                        >
                            <div onClick={() => onToggleTheme()}>
                                {isDarkMode ? <BsToggleOn /> : <BsToggleOff />}
                            </div>
                        </IconContext.Provider>
                    </li>
                    <li className="leading-10">
                        <Link
                            href="/pages/settings/oblivion-curve/"
                            className="flex items-center justify-between"
                        >
                            <h3>忘却曲線設定</h3>
                            <div>
                                <IconContext.Provider value={{ size: '24px' }}>
                                    <IoIosArrowForward />
                                </IconContext.Provider>
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>
        </BaseAuthForm>
    )
}

export default SettingsPage
