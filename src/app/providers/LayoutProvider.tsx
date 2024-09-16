import { createContext, ReactNode, useContext, useState } from 'react'

interface Props {
    children: ReactNode
}

type SnackbarParams = {
    isVisible: boolean
    message: string
    duration?: number
    type: 'success' | 'warning' | 'info' | 'error'
}

interface LayoutContextProps {
    isLoading: boolean
    snackbarParam: SnackbarParams | null
    setIsLoading: (state: boolean) => void
    setSnackbarParam: (param: SnackbarParams | null) => void
}

const LayoutContext = createContext<LayoutContextProps>({
    isLoading: false,
    snackbarParam: null,
    setIsLoading: () => {},
    setSnackbarParam: () => {},
})

export const useLayoutContext = () => {
    return useContext(LayoutContext)
}

export const LayoutProvider = ({ children }: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [snackbarParam, setSnackbarParam] = useState<SnackbarParams | null>(
        null,
    )

    return (
        <LayoutContext.Provider
            value={{ isLoading, setIsLoading, snackbarParam, setSnackbarParam }}
        >
            {children}
        </LayoutContext.Provider>
    )
}

export default LayoutProvider
