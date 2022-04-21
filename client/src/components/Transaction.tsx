import React from "react";

interface Props {
	data: {
		usdDelta: number;
		eurDelta: number;
		timestamp: string;
		type: string;
	};
}

export const Transaction: React.FC<Props> = ({ data }) => {
	const { type, eurDelta, usdDelta, timestamp } = data;

	const processValue = (value: number): string => {
		return (value > 0 ? "+" : "") + value.toFixed().toString();
	};

	const capitalize = (text: string): string => {
		return text[0].toUpperCase() + type.slice(1).toLowerCase();
	};

	return (
		<tr>
			<td>{capitalize(type)}</td>
			<td>{processValue(eurDelta)}€</td>
			<td>{processValue(usdDelta)}$</td>
			<td>{new Date(timestamp).toLocaleString()}</td>
		</tr>
	);
};
