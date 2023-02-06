import * as React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


interface State {
	data: { result: [{ K: number, D: string }] } | undefined;
	isLoading: boolean;
	error: any;
}

class PendingData extends React.Component<{}, State> {

	constructor(props: {}) {
		super(props);
		this.state = {
			data: undefined,
			isLoading: false,
			error: null
		};
	}

	componentDidMount() {
		this.setState({ isLoading: true });
		fetch('/pendingData')
			.then(response => {
				if (!response.ok) {
					throw new Error("Non è stato possibile recuperare i dati");
				}
				return response.json();
			})
			.then(data => this.setState({ data, isLoading: false }))
			.catch(error => this.setState({ error, isLoading: false }));
	}

	render() {
		const { data, isLoading, error } = this.state;

		if (error) {
			return <p>{error.message}</p>;
		}
		if (isLoading) {
			return <p>Loading ...</p>;
		}
		else {
			return (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
						<TableHead>
							<TableRow>
								<TableCell>K</TableCell>
								<TableCell>D</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data?.result.map((item: { K: number, D: string }, index) => (
								<TableRow
									key={index}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<TableCell>{item.K}</TableCell>
									<TableCell>{item.D}</TableCell>
								</TableRow>))}
						</TableBody>
					</Table>
				</TableContainer>


			);
		}
	}
}

export default PendingData;
