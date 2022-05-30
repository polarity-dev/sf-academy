import React from "react";
import { Table } from "react-bootstrap";
import config from "../config";

interface IDataQueue {
    id: number;
    priority: number;
    message: string;
}

interface IDataQueueTableState {
    data: IDataQueue[];
}

interface IDataQueueTableProps {
    refresh: boolean;
}

class DataQueueTable extends React.Component<IDataQueueTableProps, IDataQueueTableState> {
    state: IDataQueueTableState = {
        data: []
    };

    componentDidMount() {
        this.retrieveData();
    }
    
    componentDidUpdate(oldProps: IDataQueueTableProps) {
        if (this.props.refresh !== oldProps.refresh) {
            this.retrieveData();
        }
    }

    retrieveData() {
        fetch(`${config.api_path}/pendingData`)
            .then((res: Response) => res.json())
            .then((data: IDataQueue[]) => {
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
                        <th style={{width:"100px"}}>Priority</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {(this.state.data.length && this.state.data.map((data) => (
                        <tr>
                            <td>{data.priority}</td>
                            <td>{data.message}</td>
                        </tr>
                    ))) || (
                        <tr>
                            <td colSpan={2}>Queue is empty</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        );
    }
}

export default DataQueueTable;