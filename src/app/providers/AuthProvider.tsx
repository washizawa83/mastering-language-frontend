import { apiGet } from '@/app/_service/api'
import axios from 'axios'
import { usePathname, useSearchParams } from 'next/navigation'
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'
import { useCookies } from 'react-cookie'
import { Navigate } from 'react-router-dom'

interface Props {
    children: ReactNode
}

type UserInfo = {
    username: string
}

interface AuthContextProps {
    isAuth: boolean
    isLoading: boolean
    userInfo: UserInfo | null
    signin: () => void
    signout: () => void
}
const AuthContext = createContext<AuthContextProps>({
    isAuth: false,
    isLoading: true,
    userInfo: null,
    signin: () => {},
    signout: () => {},
})

export const useAuthContext = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }: Props) => {
    const [isAuth, setIsAuth] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const [cookies] = useCookies(['token'])

    const pathname = usePathname()
    const searchParams = useSearchParams()

    const signin = () => {
        setIsAuth(true)
    }

    const signout = () => {
        setIsAuth(false)
    }

    useEffect(() => {
        const verify = async () => {
            try {
                console.log('ユーザー情報取得')
                setIsLoading(true)
                const token = cookies.token
                await apiGet('http://127.0.0.1:8000/verify', token)
                const user = await apiGet('http://127.0.0.1:8000/user', token)
                signin()
                setUserInfo(user)
                setIsLoading(false)
            } catch (error) {
                if (
                    axios.isAxiosError(error) &&
                    error.response &&
                    error.response.status === 401
                ) {
                    setUserInfo(null)
                    setIsLoading(false)
                    return <Navigate to="/pages/signin" />
                }
                setIsLoading(false)
                signout()
            }
        }

        verify()
    }, [pathname, searchParams])

    return (
        <AuthContext.Provider
            value={{
                isAuth,
                isLoading,
                signin,
                signout,
                userInfo,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
