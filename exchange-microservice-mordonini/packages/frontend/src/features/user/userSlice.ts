import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { OpenAPI, User } from '../../services/openapi';

export const initialState: User = {
    id: -1,
    email: '',
    password: '',
    name: '',
    surname: '',
    bankAccountsList: []
}

export const selectUser = (state: RootState) => state.user;

const mapStateFromObject = (state: any, user: User) => {
    state.id                = user.id
    state.email             = user.email
    state.name              = user.name
    state.surname           = user.surname
    state.bankAccountsList  = user.bankAccountsList
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserState: (state, payload: PayloadAction<User>) => {
            mapStateFromObject(state, payload.payload)
            state.id = 1
            console.log(state)
        },
        resetUserState: (state) => {
            // Reset state
            mapStateFromObject(state, initialState)
            // Delete auth token
            OpenAPI.TOKEN = undefined
        }
    },
})

export const { setUserState, resetUserState } = userSlice.actions

export default userSlice.reducer