import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useHistory } from 'react-router-dom';
import { baseRoute, useAuth } from '../Auth';
import axios from 'axios';

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
                if (response.data.data.transactions) setTransactions(response.data.data.transactions);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [auth, transactions]);

    return (
        <>
            <Navbar />
            {checkEmpty(transactions) ? (
                tableSkeleton()
            ) : (
                <div className="px-5 flex justify-center">
                    <table className="w-full xl:w-10/12 table-auto">
                        <thead className="bg-gray-200 text-center">
                            <tr className="font-bold">
                                <td className="rounded-l-lg">ID</td>
                                <td className="p-2">Date</td>
                                <td className="p-2">Type</td>
                                <td className="p-2">Value</td>
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
            )}
        </>
    );
}

const tableSkeleton = () => {
    return (
        <div className="px-10 flex justify-center animate-pulse">
            <table className="w-full xl:w-10/12 table-auto">
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
    );
};
