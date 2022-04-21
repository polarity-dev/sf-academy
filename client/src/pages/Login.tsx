import axios, { AxiosError } from "axios";
import React, { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { SubmitButton } from "../components/SubmitButton";
import { Textfield } from "../components/Textfield";

interface Props {
	setParentState: Dispatch<
		SetStateAction<{
			token: string;
			authenticated: boolean;
		}>
	>;
}

const apiUrl = `http://${process.env.API_HOST}:${process.env.API_PORT}/login`;

export const Login: React.FC<Props> = ({ setParentState }) => {
	const [state, setState] = useState({
		email: "",
		password: "",
	});

	const navigate: NavigateFunction = useNavigate();

	const onChange = (event: FormEvent<HTMLInputElement>) => {
		const { name, value } = event.currentTarget;
		setState({ ...state, [name]: value });
	};

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const { email, password } = state;
		axios
			.post(apiUrl, { email, password })
			.then((res) => res.data.token)
			.then((token) => {
				setParentState({ authenticated: true, token });
				navigate("/profile", { replace: true });
			})
			.catch((err: AxiosError) => {
				alert(err.response?.data.message);
			});
	};

	return (
		<form className="answer-form" onSubmit={onSubmit}>
			<div className="form-control">
				<h1>Log In</h1> <br />
				<Textfield
					name="email"
					title="Email"
					text={state.email}
					placeholder="Email"
					onChange={onChange}
				/>
				<Textfield
					name="password"
					title="Password"
					text={state.password}
					placeholder="Password"
					password={true}
					onChange={onChange}
				/>
			</div>
			<SubmitButton color="deepSkyBlue" text="Log In" />
		</form>
	);
};
