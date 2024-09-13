'use client'
import { useEffect, useRef, useState } from 'react'

export type MenuItem = {
    label: string
    icon: JSX.Element
    handleClick: () => void
}

type Props = {
    label: string
    items: MenuItem[]
}

export const MenuButton = ({ label, items }: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef(null)

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

    const handleItemClick = (item: MenuItem) => {
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
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="relative flex rounded-full bg-gray-800"
                        >
                            {label}
                        </button>
                        {isOpen && (
                            <ul className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md py-1 shadow-lg bg-deep-light dark:bg-deep-dark text-typography-light dark:text-typography-dark">
                                {items.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center p-2 cursor-pointer hover:bg-profound-light dark:hover:bg-profound-dark"
                                        onClick={() => handleItemClick(item)}
                                    >
                                        <span className="basis-2/6 ml-3">
                                            {item.icon}
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
