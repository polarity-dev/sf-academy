import React from "react";
import { Table } from "react-bootstrap";
import config from "../config";

interface IData {
    id: number;
    value: number;
    message: string;
    processed_at: string;
}

interface IDataTableState {
    data: IData[];
}

interface IDataTableFilters extends URLSearchParams {
    limit: string;
    from: string;
}

interface IDataTableProps {
    refresh: boolean;
    limitFilter: string | null;
    fromFilter: Date | null;
}

class DataTable extends React.Component<IDataTableProps, IDataTableState> {
    state: IDataTableState = {
        data: []
    };

    componentDidMount() {
        this.retrieveData();
    }

    componentDidUpdate(oldProps: IDataTableProps) {
        if (this.props.refresh !== oldProps.refresh
            || this.props.limitFilter !== oldProps.limitFilter
            || this.props.fromFilter !== oldProps.fromFilter) {
            this.retrieveData();
        }
    }

    retrieveData() {
        let params = {} as IDataTableFilters;
        if (this.props.limitFilter !== null) {
            params.limit = this.props.limitFilter;
        }
        if (this.props.fromFilter !== null) {
            params.from = this.props.fromFilter.getTime().toString();
        }

        fetch(`${config.api_path}/data?` + new URLSearchParams(params))
            .then(async (res: Response) => {
                if (res.status < 200 || res.status > 299) {
                    throw new Error(await res.text());
                } else {
                    return res.json();
                }
            })
            .then((data: IData[]) => {
                this.setState({data});
            })
            .catch(err => {
                console.error(err);
                alert('There was an error loading data.');
            });
    }

    render() {
        return (
            <Table striped responsive>
                <thead>
                    <tr>
                        <th style={{width:"100px"}}>Value</th>
                        <th>Message</th>
                        <th>Processed Time</th>
                    </tr>
                </thead>
                <tbody>
                    {(this.state.data.length && this.state.data.map((data) => (
                        <tr>
                            <td>{data.value}</td>
                            <td>{data.message}</td>
                            <td>{(new Date(data.processed_at)).toLocaleString()}</td>
                        </tr>
                    ))) || (
                        <tr>
                            <td colSpan={3}>No data found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        );
    }
}

export default DataTable;