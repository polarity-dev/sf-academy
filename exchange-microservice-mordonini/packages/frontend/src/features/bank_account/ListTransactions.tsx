import { DatePicker, Button, Form } from "antd"
import { useAppSelector } from "../../app/hooks"
import { doListTransactions } from "../../services/api"
import { CurrencyArray } from "../../services/openapi"
import { CurrencySelector } from "../utils/CurrencySelector"
import { selectTransactionPanelState } from "./transactionPanelSlice"

interface ListTransactionFilter {
    dateFilter?: Date[]
    boughtCurrencyFilter?: CurrencyArray,
    soldCurrencyFilter?: CurrencyArray
}

const handleCurrencyChange = (value: string) => {
    console.log(`selected ${value}`);
}

export const ListTransactionForm = () => {
    const transactionPanelState = useAppSelector(selectTransactionPanelState)

    // Get selected bank account from the store
    const account = transactionPanelState.bankAccount

    // List transaction Handler
    const listTransactionClick = (values: ListTransactionFilter) => {
        // Date filters
        const afterThenFilter = (values.dateFilter && values.dateFilter[0]) ? values.dateFilter[0].toISOString() : null
        const beforeThenFilter = (values.dateFilter && values.dateFilter[1]) ? values.dateFilter[1].toISOString() : null
        // Currency filters
        const boughtCurrencyFilter = values.boughtCurrencyFilter
        const soldCurrencyFilter = values.soldCurrencyFilter
        // Call to remote service
        doListTransactions(account.iban, beforeThenFilter, afterThenFilter, boughtCurrencyFilter, soldCurrencyFilter).then(resp => {
            console.log(resp)
        })
    }

    return (
        <Form 
            onFinish={listTransactionClick}
            key={account.id}
        >
            <span>Iban: {account.iban}</span>
            <Form.Item
                name="dateFilter"
                label="Date Filter"
            >
                <DatePicker.RangePicker allowEmpty={[true, true]}/>
            </Form.Item>
            <Form.Item 
                name="boughtCurrencyFilter"
                label="Boguht currency"
            >
                <CurrencySelector
                    mode="multiple"
                    placeholder="bought currencies"
                    optionLabelProp="label"
                    onChange={handleCurrencyChange}
                />
            </Form.Item>
            <Form.Item 
                name="soldCurrencyFilter"
                label="Sold currency"
            >
                <CurrencySelector
                    mode="multiple"
                    placeholder="sold currencies"
                    optionLabelProp="label"
                    onChange={handleCurrencyChange}
                />
            </Form.Item>
            <Form.Item>
                <Button 
                    type="primary"
                    htmlType="submit"
                >
                    List transactions
                </Button>
            </Form.Item>
        </Form>
    )
}