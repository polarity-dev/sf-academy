import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface Auth {
    accessToken: string
}

export const initialState: Auth = {
    accessToken: ''
}

export const selectAuth = (state: RootState) => state.auth

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthState: (state, payload: PayloadAction<Auth>) => {
            state.accessToken = payload.payload.accessToken
        },
        resetAuthState: (state) => {
            state.accessToken = initialState.accessToken
        }
    },
})

export const { setAuthState, resetAuthState } = authSlice.actions
export default authSlice.reducer