import {
    configureStore,
    type Action,
    type Reducer,
    type Store,
    type UnknownAction,
} from '@reduxjs/toolkit'
import {
    persistStore,
    persistReducer,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import type { AsyncReducers, RootState } from './rootReducer'
import rootReducer from './rootReducer'

const persistConfig = {
    key: 'cinehub-root',
    keyPrefix: '',
    storage,
    whitelist: ['auth'],
}

interface CustomStore extends Store<RootState, UnknownAction> {
    asyncReducers?: AsyncReducers
}

const store: CustomStore = configureStore({
    reducer: persistReducer(persistConfig, rootReducer() as Reducer),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    devTools: import.meta.env.NODE_ENV === 'development',
})

store.asyncReducers = {}

export const persistor = persistStore(store)

export function injectReducer<S>(key: string, reducer: Reducer<S, Action>) {
    if (store.asyncReducers) {
        if (store.asyncReducers[key]) {
            return false
        }
        store.asyncReducers[key] = reducer
        store.replaceReducer(
            persistReducer(
                persistConfig,
                rootReducer(store.asyncReducers) as Reducer
            )
        )
    }
    persistor.persist()
    return store
}

export type AppDispatch = typeof store.dispatch

export default store
