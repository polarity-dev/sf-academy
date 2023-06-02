import { Space, Table } from "antd"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { BankAccount, User } from "../../services/openapi"
import { selectUser } from "../user/userSlice"
import Column from "antd/es/table/Column"
import { Link, useMatch, useNavigate } from "react-router-dom"

import routes from "../routes/routes.json"
import { ListTransactionForm } from "./ListTransactions"
import { MakeTransactionForm } from "./MakeTransaction"
import { selectTransactionPanelState, setTransactionState } from "./transactionPanelSlice"
import { useEffect } from "react"

interface BankAccountTableColumns {
    key: React.Key,
    iban: string,
    creation_date: string
}

interface BankAccountQueryParam {
    iban?: string
}

const mapBankAccountsTable = (accounts?: BankAccount[]): BankAccountTableColumns[] => {
    if (!accounts) return []
    return accounts.map((bank_account, index) => ({
        key: index,
        iban: bank_account.iban,
        creation_date: new Date(bank_account.creationDate || '').toLocaleDateString()
    } as BankAccountTableColumns))
}
  
export const BankAccountList = () => {
    const userState = useAppSelector(selectUser)

    return (
        <>
            <Table dataSource={mapBankAccountsTable(userState.bankAccountsList)}>
                <Column title="IBAN" dataIndex="iban" key="iban" />
                <Column title="Created" dataIndex="creation_date" key="creation_date" />
                <Column 
                    title="Action"
                    key="action"
                    render={(_: any, record: BankAccountTableColumns, index: number) => (
                        <Space size="small">
                            <Link to={`${routes.bankAccount}/${record.iban}`}>
                                Manage
                            </Link>
                        </Space>
                    )}
                />
            </Table>
        </>
    )
}

const haveBankAccountRights = (user: User, iban: string) => 
    user.bankAccountsList?.some(bankAccount => bankAccount.iban.toLowerCase() === iban.toLowerCase())

export const BankAccountPanel = () => {
    const userState = useAppSelector(selectUser)
    const transactionPanelState = useAppSelector(selectTransactionPanelState)
    const dispatch = useAppDispatch()

    const navigate = useNavigate()
    const match = useMatch(routes.bankAccountIban)  // /user/bankAccount/:iban

    // Checks if the iban in the url is owned by the user, redirect to user panel otherwise
    const iban = (match?.params as BankAccountQueryParam)?.iban
    useEffect(() => { 
        if (!match || !iban || !haveBankAccountRights(userState, iban)) {
            // User doesn't own iban
            console.log(`User doesn't own Iban ${iban}`)
            navigate(routes.userPanel)
        } else {
            // User owns iban
            if (iban.toUpperCase() !== transactionPanelState.bankAccount.iban.toUpperCase()) 
                // Iban wasn't already set
                dispatch(setTransactionState({
                    ...transactionPanelState,
                    bankAccount: { iban: iban }
                }))
            else {
                // Iban was already set
            }
        }
    })
    
    
    return (
        <>
            <ListTransactionForm />
            <MakeTransactionForm />
        </>
    )
}
