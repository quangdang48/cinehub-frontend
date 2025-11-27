import type { Routes } from '@/types/routes'
import { lazy } from 'react'

const pagesRoute: Routes = [
    {
        key: 'home',
        path: `/`,
        component: lazy(() => import('@/pages/home-page')),
        authority: [],
    },
    {
        key: 'movie-detail',
        path: `/movie/:id`,
        component: lazy(() => import('@/pages/movie-detail-page')),
        authority: [],
    },
    {
        key: 'movie-list',
        path: `/phim-le`,
        component: lazy(() => import('@/pages/movie-list-page')),
        authority: [],
    },
    {
        key: 'series-list',
        path: `/phim-bo`,
        component: lazy(() => import('@/pages/movie-list-page')),
        authority: [],
    },
    {
        key: 'browse',
        path: `/filter`,
        component: lazy(() => import('@/pages/movie-list-page')),
        authority: [],
    },
    {
        key: 'genre',
        path: `/genre`,
        component: lazy(() => import('@/pages/movie-list-page')),
        authority: [],
    },
    {
        key: 'country',
        path: `/country`,
        component: lazy(() => import('@/pages/movie-list-page')),
        authority: [],
    },
    {
        key: 'billing',
        path: `/billing`,
        component: lazy(() => import('@/pages/billing-page')),
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
