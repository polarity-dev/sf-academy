/* tslint:disable */
/* eslint-disable */
import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import { Storage, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk'

import authReducer from '../features/auth/authSlice'
import userReducer from '../features/user/userSlice'
import transactionPaneReducer from '../features/bank_account/transactionPanelSlice'

const persistConfig = {
  key: 'root',
  storage
}

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  transactionPanel: transactionPaneReducer
})

const perdistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: perdistedReducer,
  middleware: [thunk]
})

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
