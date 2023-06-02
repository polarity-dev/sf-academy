import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { BankAccount, Transaction, TransactionType } from '../../services/openapi';

interface MakeTransactionState {
    bankAccount: BankAccount,
    transactionType: TransactionType
}

export const initialState: MakeTransactionState = {
    bankAccount: {
        iban: ''
    },
    transactionType: TransactionType.DEPOSIT
}

export const selectTransactionPanelState = (state: RootState) => state.transactionPanel;

const mapStateFromObject = (state: any, trans: MakeTransactionState) => {
    state.transactionType = trans.transactionType
    state.bankAccount = trans.bankAccount
}

export const transactionPanelSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        setTransactionState: (state, payload: PayloadAction<Transaction>) => {
            mapStateFromObject(state, payload.payload)
            console.log(state)
        },
        resetTransactionState: (state) => {
            // Reset state
            mapStateFromObject(state, initialState)
        }
    },
})

export const { setTransactionState, resetTransactionState } = transactionPanelSlice.actions

export default transactionPanelSlice.reducer