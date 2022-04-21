import { BrowserRouter as Router, Routes } from "react-router-dom";
import { Route } from "react-router";
import React, { MouseEvent, useState } from "react";
import { Button } from "./components/Button";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Transactions } from "./pages/Transactions";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";

const apiUrl = `http://${process.env.API_HOST}:${process.env.API_PORT}`;

function App() {
	const [state, setState] = useState({
		token: "",
		authenticated: false,
	});

	const exchangeOnClick = (event: MouseEvent) => {
		event.preventDefault();
		alert("Premuto!");
	};

	return (
		<Router>
			<div className="container">
				<Routes>
					<Route
						path="/"
						element={<Home authenticated={state.authenticated} />}
					/>
					<Route
						path="/login"
						element={<Login setParentState={setState} />}
					/>
					<Route
						path="/signup"
						element={<Signup setParentState={setState} />}
					/>
					<Route
						path="/profile"
						element={<Profile token={state.token} />}
					/>
					<Route
						path="/transactions"
						element={<Transactions token={state.token} />}
					/>
					<Route
						path="/tests"
						element={
							<>
								<Button
									color="deepSkyBlue"
									text="login"
									onClick={exchangeOnClick}
								/>
								<Transactions token={state.token} />
							</>
						}
					/>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
