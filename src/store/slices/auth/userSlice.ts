import { Gender } from '@/types/Gender'
import type { UserDto } from '@/types/UserDto'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type UserState = UserDto

const initialState: UserState = {
    id: '',
    name: '',
    email: '',
    gender: Gender.MALE,
    createdAt: '',
    updatedAt: '',
}

const userSlice = createSlice({
    name: `auth/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            return { ...state, ...action.payload }
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
