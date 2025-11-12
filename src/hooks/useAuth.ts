import { AuthService } from '@/services/AuthService'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch,
} from '@/store'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import appConfig from '@/config/app.config'
import type { LoginDto } from '@/types/LoginDto'
import { Gender } from '@/types/Gender'

type Status = 'success' | 'failed'

function useAuth() {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const query = useQuery()

    const { signedIn, token } = useAppSelector((state) => state.auth.session)

    const defaultUser = {
        id: '',
        name: '',
        email: '',
        gender: Gender.MALE,
        createdAt: '',
        updatedAt: '',
    }
    const login = async (
        values: LoginDto,
    ): Promise<
        | {
              status: Status
              message: string
          } | undefined
    > => {
        try {
            const redirectUrl = query.get('redirectUrl')
            const resp = await AuthService.login(values)
            if (resp.data) {
                const token = resp.data.accessToken
                dispatch(signInSuccess(token))
                dispatch(setUser(resp.data.user || defaultUser))

                navigate(
                    redirectUrl
                        ? redirectUrl
                        : appConfig.authenticatedEntryPath,
                )
                return {
                    status: 'success',
                    message: '',
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(setUser(defaultUser))
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = () => {
        handleSignOut()
    }

    return {
        authenticated: token && signedIn,
        login,
        signOut,
    }
}

export default useAuth
