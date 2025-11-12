import { lazy } from 'react'
import type { Routes } from '@/types/routes'

const authRoute: Routes = [
    {
        key: 'login',
        path: `/login`,
        component: lazy(() => import('@/pages/login-page')),
        authority: [],
    },
    {
        key: 'register',
        path: `/register`,
        component: lazy(() => import('@/pages/register-page')),
        authority: [],
    },
    {
        key: 'forgotPassword',
        path: `/forgot-password`,
        component: lazy(() => import('@/pages/forgot-password-page')),
        authority: [],
    },
    {
        key: 'authCallback',
        path: '/auth/callback',
        component: lazy(() => import('@/pages/auth-google-callback-page')),
        authority: []
    },
]

export default authRoute
