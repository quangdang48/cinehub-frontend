import { Suspense } from 'react'
import { protectedRoutes, publicRoutes } from '@/config/routes.config'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store'
import ProtectedRoute from '@/routes/route/ProtectedRoute'
import PublicRoute from '@/routes/route/PublicRoute'
import AuthorityGuard from '@/routes/route/AuthorityGuard'
import AppRoute from './route/AppRoute'
import Loading from '@/components/common/Loading'

const AllRoutes = () => {
    const userAuthority = useAppSelector((state) => state.auth.user.email)

    return (
        <Routes>
            <Route element={<PublicRoute />}>
                {publicRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <AppRoute
                                routeKey={route.key}
                                component={route.component}
                                {...route.meta}
                            />
                        }
                    />
                ))}
            </Route>
            <Route element={<ProtectedRoute />}>
                {protectedRoutes.map((route, index) => (
                    <Route
                        key={route.key + index}
                        path={route.path}
                        element={
                            <AuthorityGuard
                                userAuthority={[userAuthority]}
                                authority={route.authority}
                            >
                            <AppRoute
                                routeKey={route.key}
                                component={route.component}
                                {...route.meta}
                            />
                            </AuthorityGuard>
                        }
                    />
                ))}
            <Route path="*" element={<Navigate replace to="/" />} />
            </Route>
        </Routes>
    )
}

const AppRoutes = () => {
    return (
        <Suspense fallback={<Loading loading={true} />}>
            <AllRoutes />
        </Suspense>
    )
}
export default AppRoutes

