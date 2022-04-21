import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import React, { MouseEventHandler, useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { AmountForm } from "../components/AmountForm";
import { Button } from "../components/Button";
import { TransactionsTable } from "../components/TransactionTables";

interface Props {
	token: string;
}

interface Transaction {
	eurDelta: number;
	usdDelta: number;
	type: string;
	timestamp: string;
}

const apiUrl = `http://${process.env.API_HOST}:${process.env.API_PORT}`;

export const Transactions: React.FC<Props> = ({ token }) => {
	const [state, setState] = useState<{
		transactionsList: Array<Transaction>;
		action: string;
	}>({
		transactionsList: [],
		action: "None",
	});

	const navigate: NavigateFunction = useNavigate();

	const axiosConfig: AxiosRequestConfig = {
		headers: { Authorization: "Bearer " + token },
	};

	useEffect(() => {
		axios
			.get(apiUrl + "/listTransactions", axiosConfig)
			.then((res) => res.data)
			.then((data) => data.reverse())
			.then((data) => setState({ ...state, transactionsList: data }))
			.catch((err: AxiosError) => {
				alert(err.response?.data.message);
				navigate("/", { replace: true });
			});
	}, []);

	const onClick: MouseEventHandler<HTMLButtonElement> = (event) => {
		setState({ ...state, action: event.currentTarget.textContent as string });
	};

	const deposit = (amount: { value: number; symbol: string }) => {
		axios
			.post(apiUrl + "/deposit", amount, axiosConfig)
			.then((res: AxiosResponse) => res.data)
			.then((data: Transaction) => {
				setState({
					...state,
					transactionsList: [data, ...state.transactionsList],
				});
			})
			.catch((err: AxiosError) => {
				alert(err.response?.data.message);
				if (err.response?.status === 401) navigate("/", { replace: true });
			});
	};

	const withdraw = (amount: { value: number; symbol: string }) => {
		axios
			.post(apiUrl + "/withdraw", amount, axiosConfig)
			.then((res: AxiosResponse) => res.data)
			.then((data: Transaction) => {
				setState({
					...state,
					transactionsList: [data, ...state.transactionsList],
				});
			})
			.catch((err: AxiosError) => {
				alert(err.response?.data.message);
				if (err.response?.status === 401) navigate("/", { replace: true });
			});
	};

	const buy = (amount: { value: number; symbol: string }) => {
		axios
			.post(apiUrl + "/buy", amount, axiosConfig)
			.then((res: AxiosResponse) => res.data)
			.then((data: Transaction) => {
				setState({
					...state,
					transactionsList: [data, ...state.transactionsList],
				});
			})
			.catch((err: AxiosError) => {
				alert(err.response?.data.message);
				if (err.response?.status === 401) navigate("/", { replace: true });
			});
	};

	return (
		<>
			<Button text="Deposit" color="green" onClick={onClick} />
			<Button text="Buy" color="yellow" onClick={onClick} />
			<Button text="Withdraw" color="red" onClick={onClick} />
			<br />
			{state.action === "Deposit" && (
				<AmountForm action="Deposit" handleSubmit={deposit} />
			)}
			{state.action === "Buy" && (
				<AmountForm action="Buy" handleSubmit={buy} />
			)}
			{state.action === "Withdraw" && (
				<AmountForm action="Withdraw" handleSubmit={withdraw} />
			)}
			<TransactionsTable transactionsList={state.transactionsList} />
		</>
	);
};
