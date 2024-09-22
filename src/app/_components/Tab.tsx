import { TabPageNames } from '@/app/pages/cards/page'
import { ReactNode } from 'react'

type Props = {
    name: string
    tabPageName: TabPageNames
    isSelected?: boolean
    badge?: ReactNode
    onTabChange: (tabName: TabPageNames) => void
}

export const Tab = ({
    name,
    tabPageName,
    isSelected = false,
    badge,
    onTabChange,
}: Props) => {
    return (
        <button
            className={`relative rounded-t-lg ${isSelected ? 'bg-profound-light dark:bg-profound-dark' : 'bg-deep-light dark:bg-deep-dark'} p-3`}
            onClick={() => onTabChange(tabPageName)}
        >
            {badge && (
                <span className="absolute -top-2 -right-1 flex items-center justify-center bg-teal rounded-full h-5 w-5">
                    {badge}
                </span>
            )}
            <h3>{name}</h3>
        </button>
    )
}
