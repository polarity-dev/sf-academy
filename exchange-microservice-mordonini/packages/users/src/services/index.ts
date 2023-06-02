import { login } from "./login";
import { signup } from "./signup";
import { listTransactions } from "./list_transactions";
import { depositCurrency } from "./deposit";
import { withdrawCurrency } from "./withdraw";
import { buyCurrency } from "./buy";

// API
export default { 
    login, 
    signup, 
    listTransactions, 
    depositCurrency, 
    withdrawCurrency,
    buyCurrency
}