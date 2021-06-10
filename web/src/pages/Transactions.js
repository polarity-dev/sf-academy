import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import Navbar from "../components/Navbar";
import { address, useAuth } from "../utils/auth";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Field, Form } from "react-final-form";
import { OnChange } from "react-final-form-listeners";

export default function Transactions() {
    const auth = useAuth();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            return await axios.get(`${address}/transactions`, {
                params: { token: auth.token },
            });
        };
        fetchData()
            .then((res) => {
                console.log(res.data.data);
                const temp = res.data.data || [];
                setData(tableParser(temp));
            })
            .then(() => {
                setLoading(false);
            });
    }, [auth]);

    const tableParser = (temp) => {
        return [
            ...temp.map((t) => {
                const { eSymbol, eValue, symbol, value, time, transType } = t;

                return {
                    type: transType,
                    value: `${value} ${symbol === "EUR" ? "€" : "$"}`,
                    price: `${eValue ? parseFloat(eValue).toFixed(3) : "undefined"} ${eSymbol === "EUR" ? "€" : "$"
                        }`,
                    time: new Date(time).toLocaleString(),
                };
            }),
        ];
    };

    const onSubmit = async ({ symbol, from, to }) => {
        const fetchData = async () => {
            return await axios.get(`${address}/transactions`, {
                params: {
                    token: auth.token,
                    symbol: symbol === "ALL" ? undefined : symbol,
                    from: from,
                    to: to,
                },
            });
        };

        fetchData().then((res) => {
            console.log(res.data.data);
            const temp = res.data.data || [];
            setData(tableParser(temp));
        });
    };

    return auth.user && !isLoading ? (
        <div className="w-screen h-screen">
            <Navbar />
            <main className="">
                <Form
                    onSubmit={onSubmit}
                    render={({ handleSubmit, reset, submitting, pristine, values }) => (
                        <div className="flex w-full flex-col md:flex-row justify-center items-center">
                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="flex w-full flex-col md:flex-row justify-center items-center gap-4"
                            >
                                <div>
                                    <label className="mr-4" htmlFor="symbol">
                                        Symbol
                  </label>
                                    <Field
                                        name="symbol"
                                        component="select"
                                        type="email"
                                        placeholder="email@email.com"
                                        className="border border-gray-200 rounded-md p-2 mr-5"
                                        required
                                    >
                                        <option value="ALL">ALL</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                    </Field>
                                    <OnChange name="symbol">
                                        {async (value, previous) => {
                                            handleSubmit(values);
                                        }}
                                    </OnChange>
                                </div>

                                <div>
                                    <label className="mr-4" htmlFor="from">
                                        From
                  </label>
                                    <Field
                                        name="from"
                                        component="input"
                                        type="date"
                                        placeholder=""
                                        className="border border-gray-200 rounded-md p-2 "
                                        required
                                    />
                                    <OnChange name="from">
                                        {async (value, previous) => {
                                            handleSubmit(values);
                                        }}
                                    </OnChange>
                                </div>
                                <div>
                                    <label className="mr-4" htmlFor="to">
                                        to
                  </label>
                                    <Field
                                        name="to"
                                        component="input"
                                        type="date"
                                        placeholder=""
                                        className="border border-gray-200 rounded-md p-2 "
                                        required
                                    />
                                    <OnChange name="to">
                                        {async (value, previous) => {
                                            handleSubmit(values);
                                        }}
                                    </OnChange>
                                </div>
                            </form>
                        </div>
                    )}
                />
                <div className="bg-white pb-4 px-4 rounded-md w-full">
                    <div className=" mt-6 mx-2 md:mx-20">
                        <table className="table-auto border-collapse w-full">
                            <thead>
                                <tr className="rounded-lg text-sm font-medium text-gray-700 text-left bg-gray-200">
                                    <th className="px-4 py-2  ">Type</th>
                                    <th className="px-4 py-2  ">Time</th>
                                    <th className="px-4 py-2  ">Value</th>
                                    <th className="px-4 py-2  ">Price</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-normal text-gray-700 tablecolor">
                                {data.map(({ type, value, time, price }, i) => (
                                    <tr className="" key={i}>
                                        <td className="px-4 py-4">{type}</td>
                                        <td className="px-4 py-4">{time}</td>
                                        <td className="px-4 py-4">{value}</td>
                                        <td className="px-4 py-4">
                                            {price.includes("undefined") ? "None" : price}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    ) : (
        <div className="h-screen w-screen">
            <div className="flex items-center justify-center h-full text-green-500">
                <Loader
                    type="Puff"
                    height={100}
                    color={"rgb(16, 185, 129)"}
                    width={100}
                />
            </div>
        </div>
    );
}
