import { combineReducers, type Reducer } from 'redux'
import auth, { type AuthState } from './slices/auth'
import base, { type BaseState } from './slices/base'

export type RootState = {
    auth: AuthState
    base: BaseState
}

export interface AsyncReducers {
    [key: string]: Reducer<any, any>
}

const staticReducers = {
    auth,
    base,
}

const rootReducer =
    (asyncReducers?: AsyncReducers) =>
    (state: RootState, action: any) => {
        const combinedReducer = combineReducers({
            ...staticReducers,
            ...asyncReducers,
        })
        return combinedReducer(state, action)
    }

export default rootReducer
