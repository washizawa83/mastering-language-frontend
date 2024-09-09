import { Loading } from '@/app/_components/Loading'
import { useAuthContext } from '@/app/providers/AuthProvider'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
    element: React.ReactElement
}

export const PrivateRoute = ({ element }: PrivateRouteProps) => {
    const { isAuth, isLoading } = useAuthContext()
    if (isLoading) {
        return <Loading />
    }

    if (isAuth) {
        return element
    }

    return <Navigate to="/signin" />
}
