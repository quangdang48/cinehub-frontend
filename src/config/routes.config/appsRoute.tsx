import { lazy } from 'react'
import type { Routes } from '@/types/routes'

const appsRoute: Routes = [
    {
        key: 'profile',
        path: `/profile`,
        component: lazy(() => import('@/pages/profile-page')),
        authority: [],
    },
]

export default appsRoute
