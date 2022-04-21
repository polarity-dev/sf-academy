import React, { ChangeEvent, useState } from "react";
import { Button } from "./Button";
import { Textfield } from "./Textfield";

interface Props {
	action: string;
	handleSubmit: (amount: { value: number; symbol: string }) => void;
}

export const AmountForm: React.FC<Props> = ({ action, handleSubmit }) => {
	const [state, setState] = useState({
		text: "",
		choice: "USD",
	});

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		setState({ ...state, text: event.currentTarget.value });
	};

	const onSelect = (event: ChangeEvent<HTMLSelectElement>) => {
      setState({ ...state, choice: event.target.value });
	};

	const onClick = (event: React.MouseEvent) => {
		const value: number = Number(state.text as string);
		const symbol: string = state.choice;
		if (isNaN(value)) alert("Invalid value");
		else handleSubmit({ value, symbol });
	};

	return (
		<>
			<Textfield
				title={action}
				onChange={onChange}
				placeholder="Value"
				text={state.text}
				name="Amount"
				numberOnly={true}
			/>
			<select onChange={onSelect}>
				<option value="USD">USD</option>
				<option value="EUR">EUR</option>
			</select>
			<Button text="Confirm" onClick={onClick} />
		</>
	);
};
