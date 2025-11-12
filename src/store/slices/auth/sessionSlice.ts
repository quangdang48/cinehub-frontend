import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface SessionState {
    signedIn: boolean
    token: string | null
}

const initialState: SessionState = {
    signedIn: false,
    token: null,
}

const sessionSlice = createSlice({
    name: `auth/session`,
    initialState,
    reducers: {
        signInSuccess(state, action: PayloadAction<string>) {
            state.signedIn = true
            state.token = action.payload
        },
        signOutSuccess(state) {
            state.signedIn = false
            state.token = null
        },
    },
})

export const { signInSuccess, signOutSuccess } = sessionSlice.actions
export default sessionSlice.reducer
