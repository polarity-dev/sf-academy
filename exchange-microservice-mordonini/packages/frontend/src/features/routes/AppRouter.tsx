import { 
    createBrowserRouter, 
    Route,
    createRoutesFromElements,
    Outlet,
} from "react-router-dom"
import { LoginPanel } from "../auth/LoginPanel"
import App from "../../App"
import { SignupPanel } from "../auth/SignupPanel"
import { UserPanel } from "../user/UserPanel"
import { Auth } from "../auth/Auth"
import { Logout } from "../auth/Logout"
import routes from './routes.json'
import { BankAccountPanel } from "../bank_account/BankAccount"

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path={routes.root} element={<App />}>                    {/* / */}
            <Route path={routes.auth} element={<Auth />}>               {/* /auth */}
                <Route path={routes.login} element={<LoginPanel />}/>   {/* /auth/login */}
                <Route path={routes.signup} element={<SignupPanel />}/> {/* /auth/signup */}
            </Route>
            <Route path={routes.userPanel} element={<UserPanel />}>     {/* /user */}
                <Route path={routes.bankAccount} element={<Outlet />}>  {/* /user/bankAccount */}
                    <Route                                              
                        path={routes.bankAccountIban} 
                        element={<BankAccountPanel />}
                    />                                                  {/* /user/bankAccount/:iban */}
                </Route>
            </Route>
            <Route path={routes.logout} element={<Logout />}/>          {/* /logout */}
        </Route>
    )
)