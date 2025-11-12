import type { Routes } from '@/types/routes'
import { lazy } from 'react'

const pagesRoute: Routes = [
    {
        key: 'home',
        path: `/`,
        component: lazy(() => import('@/pages/home-page')),
        authority: [],
    },
    // {
    //     key: 'pages.accessDenied',
    //     path: '/access-denied',
    //     component: lazy(() => import('@/views/pages/AccessDenied')),
    //     authority: [MANAGER, STAFF],
    // },
]

export default pagesRoute
