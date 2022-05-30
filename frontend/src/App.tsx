import React, { PropsWithoutRef } from 'react';
import { Row, Col, Container, Button, Navbar, Nav, Stack, Alert } from 'react-bootstrap';
import DataQueueTable from './components/DataQueueTable';
import DataTable from './components/DataTable';
import DataFilters, { IDataFilters } from './components/DataFilters';
import UploadButton from './components/UploadButton';

interface IAppState {
    refresh: boolean;
    dataFilters: IDataFilters;
    showUploadSuccess: boolean
}

class App extends React.Component<{}, IAppState> {
    constructor(props: PropsWithoutRef<{}>) {
        super(props);

        this.state = {
            refresh: false,
            dataFilters: {
                limit: null,
                from: null
            },
            showUploadSuccess: false
        }

        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleDataFiltersChange = this.handleDataFiltersChange.bind(this);
        this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
        this.hideUploadSuccess = this.hideUploadSuccess.bind(this);
    }

    handleRefresh() {
        this.setState({refresh: !this.state.refresh});
    }

    handleUploadSuccess() {
        this.setState({
            refresh: !this.state.refresh,
            showUploadSuccess: true
        });
    }

    handleDataFiltersChange(state: IDataFilters) {
        this.setState({dataFilters: state});
    }

    hideUploadSuccess() {
        this.setState({showUploadSuccess: false});
    }

    render() {
        return (
            <>
                <Navbar bg="light" expand="lg">
                    <Container fluid>
                        <Navbar.Brand>Data Parser</Navbar.Brand>
                        <Nav className="me-auto">
                            <Button onClick={this.handleRefresh}>Refresh</Button>
                            <UploadButton onUploadStart={this.hideUploadSuccess} onUploadSuccess={this.handleUploadSuccess} />
                        </Nav>
                    </Container>
                </Navbar>
                <Container fluid>
                    <Alert show={this.state.showUploadSuccess} variant="success" onClose={this.hideUploadSuccess}
                        className="my-2" dismissible>
                        File has been uploaded successfully.
                    </Alert>
                    <Row>
                        <Col sm={12} md={6}>
                            <Stack direction="horizontal" gap={3}>
                                <h3 className="mt-2">Data</h3>
                                <DataFilters onChange={this.handleDataFiltersChange} />
                            </Stack>
                            <DataTable
                                limitFilter={this.state.dataFilters.limit}
                                fromFilter={this.state.dataFilters.from}
                                refresh={this.state.refresh}
                            />
                        </Col>
                        <Col sm={12} md={6}>
                            <h3 className="mt-2">Queue</h3>
                            <DataQueueTable refresh={this.state.refresh} />
                        </Col>
                    </Row>
                </Container>
            </>
        );
    };
}

export default App;
