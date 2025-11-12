import { combineReducers } from '@reduxjs/toolkit'
import session, { type SessionState } from './sessionSlice'
import user, { type UserState } from './userSlice'

const reducer = combineReducers({
    session,
    user,
})

export type AuthState = {
    session: SessionState
    user: UserState
}

export * from './sessionSlice'
export * from './userSlice'

export default reducer
