import { useMemo } from 'react'
import { useAppSelector } from '@/store'

function useAuthority(
    userAuthority: string[] = [],
    authority: string[] = [],
    emptyCheck = false,
) {
    const userRoles = useAppSelector((state) => state.auth.user.name ? userAuthority : [])
    const roleMatched = useMemo(() => {
        const authorityRoles = Array.isArray(authority) ? authority : []

        if (!userRoles.length) {
            return false
        }

        if (!authorityRoles.length) {
            return emptyCheck ? false : true
        }

        return authorityRoles.some((role) => userRoles.includes(role))
    }, [userAuthority, authority, emptyCheck])

    return roleMatched
}

export default useAuthority
