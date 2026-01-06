import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SessionState {
  signedIn: boolean;
  token: string | null;
  refreshToken: string | null;
}

const initialState: SessionState = {
  signedIn: false,
  token: null,
  refreshToken: null,
};

const sessionSlice = createSlice({
  name: `auth/session`,
  initialState,
  reducers: {
    signInSuccess(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
      state.signedIn = true;
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    signOutSuccess(state) {
      state.signedIn = false;
      state.token = null;
      state.refreshToken = null;
    },
    updateTokens(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const { signInSuccess, signOutSuccess, updateTokens } = sessionSlice.actions;
export default sessionSlice.reducer;
