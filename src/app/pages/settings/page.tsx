'use client'
import { BaseAuthForm } from '@/app/_forms/BaseAuthForm'
import { useTheme } from '@/app/layout'
import { useEffect, useState } from 'react'
import { IconContext } from 'react-icons'
import { BsToggleOff, BsToggleOn } from 'react-icons/bs'

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
        <BaseAuthForm title="Settings">
            <div>
                <ul className="mb-3">
                    <li className="flex items-center justify-between px-5">
                        <h3>Dark Mode</h3>
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
                </ul>
            </div>
        </BaseAuthForm>
    )
}

export default SettingsPage
