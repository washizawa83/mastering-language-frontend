import { useTheme } from '@/app/layout'
import { useState } from 'react'
import { IconContext } from 'react-icons'
import { BsToggleOff, BsToggleOn } from 'react-icons/bs'

export const FloatingHeadLine = () => {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const { toggleTheme, theme } = useTheme()

    const onToggleTheme = () => {
        toggleTheme()
        setIsDarkMode(!isDarkMode)
    }
    return (
        <div className="absolute right-0 mr-5 text-xl">
            <IconContext.Provider
                value={{ size: '38px', color: isDarkMode ? '#ddd' : '#333' }}
            >
                <div onClick={() => onToggleTheme()}>
                    {isDarkMode ? <BsToggleOn /> : <BsToggleOff />}
                </div>
            </IconContext.Provider>
        </div>
    )
}
