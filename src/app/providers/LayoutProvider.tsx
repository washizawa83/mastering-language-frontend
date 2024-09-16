import { createContext, ReactNode, useContext, useState } from 'react'

interface Props {
    children: ReactNode
}

interface LayoutContextProps {
    isLoading: boolean
    setIsLoading: (state: boolean) => void
}

const LayoutContext = createContext<LayoutContextProps>({
    isLoading: false,
    setIsLoading: () => {},
})

export const useLayoutContext = () => {
    return useContext(LayoutContext)
}

export const LayoutProvider = ({ children }: Props) => {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <LayoutContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LayoutContext.Provider>
    )
}

export default LayoutProvider
