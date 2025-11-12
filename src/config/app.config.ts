export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
}

const appConfig: AppConfig = {
    apiPrefix: 'http://localhost:3000/api/v1',
    authenticatedEntryPath: '/',
    unAuthenticatedEntryPath: '/login',
}

export default appConfig
