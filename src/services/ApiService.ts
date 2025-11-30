import axios, { AxiosError } from 'axios'
import appConfig from '@/config/app.config'
import deepParseJson from '@/utils/deepParseJson'
import store, { signOutSuccess } from '@/store'
declare module 'axios' {
    export interface AxiosRequestConfig {
        authRequired?: boolean
    }
}
const unauthorizedCode = [401]

const ApiService = axios.create({
    timeout: 60000,
    baseURL: appConfig.apiPrefix,
})

ApiService.interceptors.request.use(
    (config) => {
        if ((config as any).authRequired === false) {
            return config
        }

        const rawPersistData = localStorage.getItem('cinehub-root')
        const persistData = deepParseJson(rawPersistData)

        let accessToken = (persistData as any)?.auth?.session?.token

        if (!accessToken) {
            const { auth } = store.getState()
            accessToken = auth.session.token
        }
        if (config.authRequired && accessToken) {
            config.headers['Authorization'] =
                `Bearer ${accessToken}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

ApiService.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError) => {
        const { response } = error
        if (response && unauthorizedCode.includes(response.status)) {
            store.dispatch(signOutSuccess())
        }
        return Promise.reject(error)
    },
)

export default ApiService
