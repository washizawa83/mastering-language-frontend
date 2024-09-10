import { BasePage } from '@/app/_layouts/BasePage'
import { ReactNode } from 'react'

type Props = {
    title: string
    children: ReactNode
}

export const BaseAuthForm = ({ title, children }: Props) => {
    return (
        <BasePage>
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh_-_80px)]">
                <div className="max-w-md w-full border border-typography-dark dark:border-typography-light">
                    <div className="text-center bg-profound-light dark:bg-profound-dark p-3 mb-5">
                        <h2 className="text-xl">{title}</h2>
                    </div>
                    {children}
                </div>
            </div>
        </BasePage>
    )
}
