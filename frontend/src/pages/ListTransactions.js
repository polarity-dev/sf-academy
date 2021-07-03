import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useHistory } from 'react-router-dom';
import { baseRoute, useAuth } from '../Auth';
import axios from 'axios';
import { Form, Field } from 'react-final-form';
import toast, { Toaster } from 'react-hot-toast';
import Footer from '../components/Footer';

const checkEmpty = (value) => (value === undefined || value === null || value.length === 0 ? true : false);

export default function ListTransactions() {
    const history = useHistory();
    const auth = useAuth();
    const [transactions, setTransactions] = useState(null);

    useEffect(() => {
        console.log(auth.token);
        axios
            .get(`${baseRoute}/listTransactions`, { params: { token: auth.token } })
            .then((response) => {
                if (response.data.data.transactions) {
                    setTransactions(response.data.data.transactions);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [auth.token]);

    return (
        <>
            <Toaster
                position="bottom-center"
                toastOptions={{
                    duration: 2000,
                }}
            />
            <Navbar />
            {checkEmpty(transactions) ? (
                tableSkeleton()
            ) : (
                <div className="px-5 flex flex-col items-center mt-2 gap-5">
                    <Filter setTransactions={setTransactions} />
                    <div className="shadow-lg rounded-xl w-full xl:w-10/12 mb-10 p-3">
                        <table className="w-full table-auto">
                            <thead className="bg-gray-200 text-center">
                                <tr className="font-bold">
                                    <td className="rounded-l-lg">ID</td>
                                    <td className="py-2">Date</td>
                                    <td className="py-2">Type</td>
                                    <td className="py-2">Value</td>
                                    <td className="rounded-r-lg">Converted</td>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {transactions.map(({ id, date, type, value, currency, convertedValue }, index) => {
                                    return (
                                        <tr key={index} className="font-medium hover:bg-gray-100">
                                            <td className="p-2 rounded-l-lg">{id}</td>
                                            <td className="p-2">{new Date(date).toLocaleString()}</td>
                                            <td className="p-2">{type}</td>
                                            <td className="p-2">
                                                {value} {currency}
                                            </td>
                                            <td className="p-2 rounded-r-lg">{convertedValue ? `${convertedValue} ${currency === '$' ? '€' : '$'}` : ''}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

const Filter = ({ setTransactions }) => {
    const auth = useAuth();
    const onSubmit = (data) => {
        const { from, to, symbol } = data;
        axios
            .get(`${baseRoute}/listTransactions`, { params: { token: auth.token, from, to, symbol } })
            .then((response) => {
                if (response.data.data.transactions) {
                    console.log(response.data.data.transactions);
                    setTransactions(response.data.data.transactions);
                }
                if (response.data.data.transactions === undefined) {
                    toast.error('Filter got 0 results.');
                } else {
                    toast.success('Filter success.');
                }
            })
            .catch((error) => {
                console.log(error);
                toast.error('Filter failed.');
            });
    };

    return (
        <div className="shadow-lg rounded-xl p-5">
            <div>
                <Form
                    onSubmit={onSubmit}
                    render={({ handleSubmit, reset, submitting, pristine, values }) => (
                        <form className="flex flex-col lg:flex-row gap-2 items-center" onSubmit={handleSubmit}>
                            <div className="flex flex-row gap-2 items-center">
                                <label className="font-medium" htmlFor="email">
                                    Start
                                </label>
                                <Field component="input" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5" type="date" name="from" />
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <label className="font-medium" htmlFor="password">
                                    End
                                </label>
                                <Field component="input" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5" type="date" name="to" />
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <label className="font-medium" htmlFor="password">
                                    Currency
                                </label>
                                <Field component="select" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5" name="symbol">
                                    <option value="">Select</option>
                                    <option value="$">USD ($)</option>
                                    <option value="€">EUR (€)</option>
                                </Field>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <button type="submit" className="px-4 text-center focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md cursor-pointer">
                                    Filter
                                </button>
                            </div>
                        </form>
                    )}
                />
            </div>
        </div>
    );
};

const tableSkeleton = () => {
    return (
        <div className="px-10 items-center animate-pulse flex flex-col mt-2 gap-5">
            <Filter />
            <div className="shadow-lg rounded-xl w-full xl:w-10/12 mb-10 p-3">
                <table className="w-full table-auto">
                    <thead className="bg-gray-300 text-center">
                        <tr className="font-bold">
                            <td className="rounded-l-lg">&nbsp;</td>
                            <td className="p-2">&nbsp;</td>
                            <td className="p-2">&nbsp;</td>
                            <td className="p-2">&nbsp;</td>
                            <td className="rounded-r-lg">&nbsp;</td>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    );
};
