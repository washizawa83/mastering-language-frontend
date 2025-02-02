import { ReactNode } from 'react'

interface BasePageProps {
    children: ReactNode
}

export const BasePage = ({ children }: BasePageProps) => {
    return (
        <main className="w-full h-[calc(100vh_-_40px)] bg-medium-light dark:bg-medium-dark overflow-auto">
            <div className="size-11/12 m-auto text-typography-light dark:text-typography-dark">
                <div className="pb-16">{children}</div>
            </div>
        </main>
    )
}
