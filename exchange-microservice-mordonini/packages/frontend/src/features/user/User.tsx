import { useAppSelector } from "../../app/hooks"
import { selectUser } from "./userSlice"
import { BankAccountList } from "../bank_account/BankAccount"

export const UserCard = () => {
    const userState = useAppSelector(selectUser)
    return (
        <div>
            <span>Email: {userState.email}</span><br/>
            <span>Name: {userState.name}</span><br/>
            <span>Surname: {userState.surname}</span><br/>

            <BankAccountList />
        </div>
    )
}