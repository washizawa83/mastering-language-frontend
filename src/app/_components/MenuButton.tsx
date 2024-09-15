'use client'
import { useEffect, useRef, useState } from 'react'
import { IconContext } from 'react-icons'

export type MenuItem = {
    label: string
    icon: JSX.Element
    handleClick: () => void
}

type Props = {
    label: string | JSX.Element
    items: MenuItem[]
    position?: 'right' | 'left'
}

export const MenuButton = ({ label, items, position = 'right' }: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<null | any>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [menuRef])

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        setIsOpen(!isOpen)
    }

    const handleItemClick = (
        event: React.MouseEvent<HTMLElement>,
        item: MenuItem,
    ) => {
        event.stopPropagation()
        setIsOpen(false)
        item.handleClick()
    }

    return (
        <nav className="bg-gray-800">
            <div className="mx-auto px-2">
                <div className="relative flex items-center justify-between">
                    <div
                        className="relative ml-3 text-typography-light dark:text-typography-dark"
                        ref={menuRef}
                    >
                        <div
                            onClick={(event) => handleOpenMenu(event)}
                            className="relative flex rounded-full bg-gray-800"
                        >
                            {label}
                        </div>
                        {isOpen && (
                            <ul
                                className={`absolute ${position === 'right' ? '-right-3' : '-left-3'} z-10 mt-2 w-40 origin-top-right rounded-md py-1 shadow-lg bg-deep-light dark:bg-deep-dark text-typography-light dark:text-typography-dark`}
                            >
                                {items.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center p-2 text-sm cursor-pointer hover:bg-profound-light dark:hover:bg-profound-dark"
                                        onClick={(event) =>
                                            handleItemClick(event, item)
                                        }
                                    >
                                        <span className="basis-2/6 ml-3">
                                            <IconContext.Provider
                                                value={{ size: '20px' }}
                                            >
                                                {item.icon}
                                            </IconContext.Provider>
                                        </span>
                                        <span>{item.label}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
