export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
}

const appConfig: AppConfig = {
    apiPrefix: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
    authenticatedEntryPath: '/',
    unAuthenticatedEntryPath: '/login',
}

export default appConfig
