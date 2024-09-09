import { ReactNode } from 'react'

interface BasePageProps {
    children: ReactNode
}

export const BasePage = ({ children }: BasePageProps) => {
    return (
        <main className="w-full h-[calc(100vh_-_40px)] overflow-auto bg-medium-light dark:bg-medium-dark">
            <div className="size-11/12 m-auto text-typography-light dark:text-typography-dark">
                {children}
            </div>
        </main>
    )
}
