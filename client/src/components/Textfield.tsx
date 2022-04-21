import React, { ChangeEventHandler } from "react";

interface Props {
	name: string;
	title: string;
	placeholder: string;
	text: string;
	onChange: ChangeEventHandler<HTMLInputElement>;
	password?: boolean;
	numberOnly?: boolean;
}

export const Textfield: React.FC<Props> = ({
	name,
	title,
	placeholder,
	text,
	password,
	onChange,
	numberOnly,
}) => {
	return (
		<>
			<label>{title}</label> <br/>
			<input
				name={name}
				type={password ? "password" : "text"}
				placeholder={placeholder}
				value={text}
				onChange={onChange}
				onKeyPress={(event) => {
					if (numberOnly && !/[0-9]/.test(event.key)) {
						event.preventDefault();
					}
				}}
			/>
		</>
	);
};
