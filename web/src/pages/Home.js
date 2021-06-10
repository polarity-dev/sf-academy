import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Eur from "../components/BalanceEUR";
import Usd from "../components/BalanceUSD";
import Navbar from "../components/Navbar";
import Exchange from "../components/Exchange";
import { address, useAuth } from "../utils/auth";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

export default function Home() {
    const auth = useAuth()
    const history = useHistory()
    console.log(auth);
    const [balanceE, setBalanceE] = useState(0);
    const [balanceU, setBalanceU] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [reloader, update] = useState(null);

    useEffect(() => {
        if (!auth.isAuthenticated()) {
            history.push('/login');
        }
        const fetchData = async () => {
            return await axios.get(`${address}/balance`, { params: { token: auth.token } })
        }

        fetchData().then(r => {
            console.log(r.data);
            const { balanceEUR, balanceUSD } = r.data.data
            setBalanceE(parseFloat(balanceEUR))
            setBalanceU(parseFloat(balanceUSD))

        }).catch(err => {
            console.log(err);
        }).finally(() => {
            setIsLoading(false);
        })


    }, [auth, reloader])


    return auth.user && !isLoading ? (
        <div className="w-screen h-screen">
            <Navbar />
            <main className="grid grid-cols-1 grid-rows-2">
                <section className="text-2xl grid mb-4">
                    <div className="col-span-2 text-center w-full h-1/5 text-3xl">Welcome Back, {auth.user["name"]}!</div>
                    <div className="col-span-2 flex flex-col md:flex-row h-4/5 mt-4">
                        <Eur balanceE={balanceE} updater={update} />
                        <Usd balanceU={balanceU} updater={update} />
                    </div>

                </section>

                <Exchange updater={update} />

            </main>


        </div>)
        :
        (<div className="h-screen w-screen">
            <div className="flex items-center justify-center h-full text-green-500">
                <Loader
                    type="Puff"
                    height={100}
                    color={"rgb(16, 185, 129)"}
                    width={100}
                />
            </div>
        </div>)
}