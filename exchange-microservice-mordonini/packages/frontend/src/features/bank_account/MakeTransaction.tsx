import { ApiError, CurrencyType, TransactionType } from "../../services/openapi";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { Button, Form, Input, InputProps, message } from "antd";
import { TransactionTypeSelector } from "../utils/TransactionTypeSelector";
import { selectTransactionPanelState, setTransactionState } from "./transactionPanelSlice";
import { CurrencySelector } from "../utils/CurrencySelector";
import { FunctionComponent } from "react";
import { doBuyTransactions, doDepositTransactions, doWithdrawTransactions } from "../../services/api";

interface MakeTransactionProps {
    transactionType: TransactionType,
    buyingCurrencyAmount: number,
    buyingCurrencyType: CurrencyType,
    sellingCurrencyAmount: number,
    sellingCurrencyType: CurrencyType
}

export const CurrencyInput: FunctionComponent<InputProps> = (props) => {
    return (
        <Input
            {...props}
            type={props.type || "number"}
            style={props.style || {width: 100}}
            placeholder={props.placeholder || "Amount"}
        />
    )
}

const handleMakeTransactionResponseSuccess = (resp: any) => {
    message.success("Success!")
    console.log(resp)
}

const handleMakeTransactionResponseFailure = (resp: ApiError) => {
    message.error(`Failure!`)
    console.log(resp)
}

export const MakeTransactionForm = () => {
    const transactionPanelState = useAppSelector(selectTransactionPanelState)
    const [form] = Form.useForm()
    const iban = transactionPanelState.bankAccount.iban
    const dispatch = useAppDispatch()

    /**
     * On submit: call to API to make transaction
     */
    const handleFormSubmit = (values: MakeTransactionProps) => {
        if (values.transactionType === TransactionType.BUY)
            doBuyTransactions({ 
                buyingCurrency: {
                    name: values.buyingCurrencyType,
                    amount: values.buyingCurrencyAmount
                },
                sellingCurrency: {
                    name: values.sellingCurrencyType,
                    amount: 0
                },
                iban: iban
            })
            .then(resp => {handleMakeTransactionResponseSuccess(resp)})
            .catch(resp => {handleMakeTransactionResponseFailure(resp)})
        else if (values.transactionType === TransactionType.DEPOSIT)
            doDepositTransactions({
                currency:{
                    name: values.buyingCurrencyType,
                    amount: values.buyingCurrencyAmount
                },
                iban: iban
            })
            .then(resp => {handleMakeTransactionResponseSuccess(resp)})
            .catch(resp => {handleMakeTransactionResponseFailure(resp)})
        else if (values.transactionType === TransactionType.WITHDRAW)
            doWithdrawTransactions({
                currency: {
                    name: values.buyingCurrencyType,
                    amount: values.buyingCurrencyAmount
                },
                iban: iban
            })
            .then(resp => {handleMakeTransactionResponseSuccess(resp)})
            .catch(resp => {handleMakeTransactionResponseFailure(resp)})
        else {
            console.log(`No valid transaction type: ${values.transactionType}`)
        }
    }

    return (
        <Form onFinish={handleFormSubmit} form={form}>
            <Form.Item
                name="transactionType"
                label="Transaction"
            >
                <TransactionTypeSelector onChange={
                    (value: TransactionType) => {dispatch(setTransactionState({
                        ...transactionPanelState,
                        transactionType: value
                    }))}
                }/>
            </Form.Item>
            <Form.Item name="buyingCurrencyType" 
                label={transactionPanelState.transactionType.toLowerCase()}
            >
                <CurrencySelector placeholder={
                    `Currency to ${transactionPanelState.transactionType.toLowerCase()}`
                }/>
            </Form.Item>
            <Form.Item name="buyingCurrencyAmount" >
                <CurrencyInput />
            </Form.Item>
            <Form.Item name="sellingCurrencyType"
                hidden={transactionPanelState.transactionType !== TransactionType.BUY}
                label="give"
            >
                <CurrencySelector 
                    placeholder={`Currency to trade for`}
                    disabled={transactionPanelState.transactionType !== TransactionType.BUY}
                />
            </Form.Item>
            <Form.Item>
                <Button 
                    type="primary"
                    htmlType="submit"
                >
                    Make Transaction
                </Button>
            </Form.Item>
        </Form>
        
    )
}