import * as React from "react";

import { Box } from "@mui/system";
import { Stack, Button } from "@mui/material";

import dayjs, { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

class Data extends React.Component<
	{},
	{
		from: Dayjs | null;
		limit: Dayjs | null;
		data: { result: [{ K: number; D: string }] } | undefined;
		isLoading: boolean;
		error: any;
	}
> {
	constructor(props: {}) {
		super(props);

		this.state = {
			from: dayjs("1970-01-01"),
			limit: dayjs(),
			data: undefined,
			isLoading: false,
			error: null,
		};

		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.setFrom = this.setFrom.bind(this);
		this.setLimit = this.setLimit.bind(this);
		this.updateTable = this.updateTable.bind(this);
	}

	onChangeHandler = (date: Date | null) => {
		console.log(date);
	};

	setFrom(value: Dayjs | null) {
		this.setState({ from: value });
	}

	setLimit(value: Dayjs | null) {
		this.setState({ limit: value });
	}

	updateTable = () => {
		let from = this.state.from?.valueOf() + "";
		let limit = this.state.limit?.valueOf() + "";

		this.setState({ isLoading: true });
		fetch("/data?from=" + from + "&limit=" + limit + "&type=K")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => this.setState({ data, isLoading: false }))
			.catch((error) => this.setState({ error, isLoading: false }));
	};

	render() {
		return (
			<div>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						height: "15%",
					}}
				>
					<Stack
						justifyContent="center"
						alignItems="center"
						direction="row"
						spacing={2}
					>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DateTimePicker
								renderInput={(props) => <TextField {...props} />}
								label="From"
								value={this.state.from}
								onChange={(newValue) => {
									this.setFrom(newValue);
								}}
							/>
						</LocalizationProvider>

						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DateTimePicker
								renderInput={(props) => <TextField {...props} />}
								label="Limit"
								value={this.state.limit}
								onChange={(newValue) => {
									this.setLimit(newValue);
								}}
							/>
						</LocalizationProvider>

						<Button
							variant="contained"
							color="primary"
							onClick={this.updateTable}
						>
							Get Data
						</Button>
					</Stack>
				</Box>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
						<TableHead>
							<TableRow>
								<TableCell>K</TableCell>
								<TableCell>D</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{this.state.data?.result.map(
								(item: { K: number; D: string }, index) => (
									<TableRow
										key={index}
										sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
									>
										<TableCell>{item.K}</TableCell>
										<TableCell>{item.D}</TableCell>
									</TableRow>
								),
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		);
	}
}

export default Data;
