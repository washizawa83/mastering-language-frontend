import { apiGet, UrlParams } from '@/app/_service/api'
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
    signin: (token: string) => void
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
    const [cookies, setCookie, removeCookie] = useCookies(['token'])

    const pathname = usePathname()
    const searchParams = useSearchParams()

    const signin = (token: string) => {
        setCookie('token', token, { path: '/' })
        setIsAuth(true)
    }

    const signout = () => {
        removeCookie('token')
        setIsAuth(false)
    }

    useEffect(() => {
        const verify = async () => {
            try {
                setIsLoading(true)
                const token = cookies.token
                const verifyUrlParams: UrlParams = {
                    endpoint: 'verify',
                    token: token,
                }
                const userUrlParams: UrlParams = {
                    endpoint: 'user',
                    token: token,
                }
                await apiGet(verifyUrlParams)
                const user = await apiGet(userUrlParams)
                signin(token)
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
