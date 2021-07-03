import React, { useEffect, useState } from 'react';
import { useAuth, baseRoute } from '../Auth';
import { useHistory } from 'react-router-dom';
import { GiPayMoney, GiReceiveMoney, GiTakeMyMoney } from 'react-icons/gi';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Form, Field } from 'react-final-form';
import toast, { Toaster } from 'react-hot-toast';
import Footer from '../components/Footer';
const isNumber = (value) => (!isNaN(parseFloat(value)) && parseFloat(value) >= 0 ? undefined : 'Must be a positive number');
const checkEmpty = (value) => (value === undefined || value === null || value === '' ? 'Cannot be empty' : undefined);

export default function Dashboard() {
    const auth = useAuth();
    const history = useHistory();
    const [usdBalance, setUsdBalance] = useState(0);
    const [eurBalance, setEurBalance] = useState(0);
    console.log(auth);

    useEffect(() => {
        if (!auth.isAuthenticated()) {
            history.push('/');
        }
        const fetchData = async () => {
            axios
                .get(`${baseRoute}/currentBalance`, { params: { token: auth.token } })
                .then((response) => {
                    const { usdCurrent, eurCurrent } = response.data.data;
                    setUsdBalance(usdCurrent);
                    setEurBalance(eurCurrent);
                })
                .catch((error) => {
                    console.log(error);
                });
        };

        fetchData();
    }, [auth, history, usdBalance, eurBalance]);

    return auth.user ? (
        <div className="flex flex-col gap-5">
            <Toaster
                position="bottom-center"
                toastOptions={{
                    duration: 2000,
                }}
            />
            <Navbar />
            <div className="w-full my-5">
                <h1 className="text-center text-2xl font-bold">
                    Benvenuto, <span className="text-blue-600">{auth.user.username}</span>
                </h1>
            </div>
            <div className="flex flex-col gap-10">
                <div className="h-auto flex items-center justify-center gap-10 md:gap-0 flex-col md:flex-row">
                    <div className="w-1/3 text-2xl text-center items-center justify-center">
                        <p className="text-4xl h-9 font-bold text-center mb-5">EUR (€)</p>
                        <span className="text-4xl h-9 font-medium">{eurBalance ? eurBalance.toFixed(2) : '0'}</span>
                    </div>
                    <div className="w-1/3 text-2xl text-center items-center justify-center">
                        <p className="text-4xl h-9 font-bold text-center mb-5">USD ($)</p>
                        <p className="text-4xl h-9 font-medium text-center">{usdBalance ? usdBalance.toFixed(2) : '0'}</p>
                    </div>
                </div>
                <div className="h-auto flex items-center justify-center gap-20 xl:gap-0 flex-col xl:flex-row mb-20">
                    <div className="w-1/3 text-center flex items-center justify-center">
                        <Deposit setEurBalance={setEurBalance} setUsdBalance={setUsdBalance} />
                    </div>
                    <div className="w-1/3 text-center flex items-center justify-center">
                        <Buy setEurBalance={setEurBalance} setUsdBalance={setUsdBalance} />
                    </div>
                    <div className="w-1/3 text-center flex items-center justify-center">
                        <Withdraw setEurBalance={setEurBalance} setUsdBalance={setUsdBalance} />
                    </div>
                </div>
            </div>            
            <Footer />
        </div>
    ) : (
        <div className="w-screen h-screen flex jutify-center items-center">
            <div>
                <p>Loading...</p>
            </div>
        </div>
    );
}

const Deposit = ({ setUsdBalance, setEurBalance }) => {
    const auth = useAuth();

    const onSubmit = async (data) => {
        const { value, symbol } = data;
        console.log(value, symbol);
        axios
            .post(`${baseRoute}/deposit`, { token: auth.token, value: parseFloat(value), symbol })
            .then((response) => {
                setEurBalance(response.eurCurrent);
                setUsdBalance(response.usdCurrent);
                toast.success('Deposit success.');
            })
            .catch((error) => {
                console.log(error);
                toast.error('Deposit failed.');
            });
    };

    return (
        <div className="shadow-2xl rounded-xl p-10">
            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, reset, submitting, pristine, values }) => (
                    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            Deposit
                            <GiPayMoney className="text-3xl text-blue-500 font-black" />
                        </h1>
                        <label className="font-medium text-left" htmlFor="value">
                            Value
                        </label>
                        <div className="flex flex-row gap-1">
                            <Field component="input" size="5" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5" type="text" name="value" placeholder="125.75" validate={isNumber} />
                            <Field component="select" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5" name="symbol" validate={checkEmpty}>
                                <option>Select</option>
                                <option value="$">USD ($)</option>
                                <option value="€">EUR (€)</option>
                            </Field>
                        </div>
                        <button type="submit" className="text-center focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md cursor-pointer">
                            Deposit
                        </button>
                    </form>
                )}
            />
        </div>
    );
};

const Withdraw = ({ setUsdBalance, setEurBalance }) => {
    const auth = useAuth();

    const onSubmit = async (data) => {
        const { value, symbol } = data;
        console.log(value, symbol);
        axios
            .post(`${baseRoute}/withdraw`, { token: auth.token, value: parseFloat(value), symbol })
            .then((response) => {
                setEurBalance(response.eurCurrent);
                setUsdBalance(response.usdCurrent);
                toast.success('Withdraw success.');
            })
            .catch((error) => {
                console.log(error);
                toast.error('Withdraw failed.');
            });
    };

    return (
        <div className="shadow-2xl rounded-xl p-10">
            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, reset, submitting, pristine, values }) => (
                    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            Withdraw
                            <GiReceiveMoney className="text-3xl text-blue-500 font-black" />
                        </h1>
                        <label className="font-medium text-left" htmlFor="value">
                            Value
                        </label>
                        <div className="flex flex-row gap-1">
                            <Field component="input" size="5" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5" type="text" name="value" placeholder="125.75" validate={isNumber} />
                            <Field component="select" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5" name="symbol" validate={checkEmpty}>
                                <option>Select</option>
                                <option value="$">USD ($)</option>
                                <option value="€">EUR (€)</option>
                            </Field>
                        </div>
                        <button type="submit" className="text-center focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md cursor-pointer">
                            Withdraw
                        </button>
                    </form>
                )}
            />
        </div>
    );
};

const Buy = ({ setUsdBalance, setEurBalance }) => {
    const auth = useAuth();

    const onSubmit = async (data) => {
        const { value, symbol } = data;
        console.log(value, symbol);
        axios
            .post(`${baseRoute}/buy`, { token: auth.token, value: parseFloat(value), symbol })
            .then((response) => {
                setEurBalance(response.eurCurrent);
                setUsdBalance(response.usdCurrent);
                toast.success('Buy success.');
            })
            .catch((error) => {
                console.log(error);
                toast.error('Buy failed.');
            });
    };

    return (
        <div className="shadow-2xl rounded-xl p-10">
            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, reset, submitting, pristine, values }) => (
                    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            Buy
                            <GiTakeMyMoney className="text-3xl text-blue-500 font-black" />
                        </h1>
                        <label className="font-medium text-left" htmlFor="value">
                            From
                        </label>
                        <div className="flex flex-row gap-1">
                            <Field component="input" size="5" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5" type="text" name="value" placeholder="125.75" validate={isNumber} />
                            <Field component="select" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5" name="symbol" validate={checkEmpty}>
                                <option>Select</option>
                                <option value="$">USD ($)</option>
                                <option value="€">EUR (€)</option>
                            </Field>
                        </div>
                        {/* <label className="font-medium text-left" htmlFor="value">
                            To
                        </label>

                        <Field component="input" type="text" name="to" placeholder="€" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5" disabled />*/}
                        <button type="submit" value="Buy" className="text-center focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md cursor-pointer">
                            Buy
                        </button>
                    </form>
                )}
            />
        </div>
    );
};
