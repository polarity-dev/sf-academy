import React from "react";

interface Props {
	title: string;
	subtitle?: string;
}

export const Header: React.FC<Props> = ({ title, subtitle }) => {
	return (
		<>
			<header className="header">
				<h1>{title}</h1>
			</header>
			<p>{subtitle}</p>
			<br />
		</>
	);
};
