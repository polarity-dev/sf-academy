import React from 'react';
import { Container, Spinner, Form, Row, Col, Button} from 'react-bootstrap';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

const options = {
    page: 1,
    sizePerPage: 10,
    sizePerPageList: [{text: '10', value: 10},
                      {text: '15', value: 15},
                      {text: '20', value: 20},
                      {text: '30', value: 30}],
    lastPageText: '>>',
    firstPageText: '<<',
    nextPageText: '>',
    prePageText: '<',
    showTotal: true,
    alwaysShowAllBtns: true,
    onPageChange: function (page, sizePerPage) {
      console.log('page', page);
      console.log('sizePerPage', sizePerPage);
    },
    onSizePerPageChange: function (page, sizePerPage) {
      console.log('page', page);
      console.log('sizePerPage', sizePerPage);
    }
  };

const columns = [
  { dataField: "id" , text: "Trans. ID", sort: true},
  { dataField: "amount" , text: "Amount", sort: true},
  { dataField: "from" , text: "From", sort: true},
  { dataField: "to" , text: "To", sort: true},
  { dataField: "date" , text: "Date", sort: true}
];

const defaultSorted = [{
  dataField: 'date',
  order: 'desc'
}];

class Transactions extends React.Component {

  constructor(){
    super();

    this.state = {
      loading: true,
      transactions : [],
      currency: "",
      date_from: "",
      date_to: "",
      error: ""
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFilterSubmit = this.handleFilterSubmit.bind(this);
    this.fetchTransactions();
  }

  fetchTransactions(){

    this.setState({loading :true});
    let user = JSON.parse(localStorage.getItem("user"));
    let filter = {currency: this.state.currency.toUpperCase(), dateFrom: this.state.date_from, dateTo: this.state.date_to};
    let data = {token: user.token, filter: JSON.stringify(filter)};
    let error = "";

    fetch(process.env.REACT_APP_API_ADDRESS + 'v1/user/listtransactions', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
      }).then(res => {
        switch (res.status) {
          case 400:
            error = "Connection to server failed";
            break;
          case 402:
            error = "Token error";
            break;
          default:
        }
        return res.json();
      }).then(json => {
        if (error !== "") {
          this.setState({loading: false, error: error});
          return;
        }
        error = "";
        let parse = JSON.parse(json.transactions);
        this.setState({transactions: parse, loading: false, error: error});

      }).catch(err => {
        error = "Connection to server failed";
        this.setState({loading: false, error: error});
      });
  }

  componentDidMount(){
    this.setState({loading: false});
  }

  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleFilterSubmit(e){
    e.preventDefault();
    this.fetchTransactions();
  }


  render(){

    let spinner = this.state.loading ?
                  <Spinner animation="border" role="status" className="mt-3"/>
                  : "";

    let button = this.state.loading ?
                <Button className= "d-flex justify-content-start" disabled>
                  <Spinner animation="border" role="status" size="sm"/>
                </Button>
              : <Button type="submit" className= "d-flex justify-content-start">
                  Filter
              </Button>


    let table = "";

    if (!this.state.loading){
      let transactions = [];

      for(let i= 0; i < this.state.transactions.length; i++){
        let obj = this.state.transactions[i];
        let date = new Date(Date.parse(obj.trans_date)).toJSON().slice(0, 19).replace('T', ' ');
        transactions.push({id: obj.id, amount: obj.amount, from: obj.currency_from, to: obj.currency_to, date: date});
      }

      table = <BootstrapTable bootstrap4 keyField="id"
                              striped
                              data= {transactions}
                              columns={columns}
                              defaultSorted={defaultSorted}
                              pagination={paginationFactory(options)}/>
    }

    return(
      <Container className= "content w-75 mx-auto my-5 py-5 px-5">
        <h1 className="title p-0 mb-5"> My Transactions </h1>

        <Form onSubmit={this.handleFilterSubmit} className= "mt-4">

          <Row className= "my-3">
            <Form.Group as={Col} sm= "4">
              <Form.Label className= "d-flex justify-content-start ps-3">
               From date
              </Form.Label>
              <Form.Control type="date"
                            name="date_from"
                            onChange={this.handleInputChange} />
            </Form.Group>
            <Form.Group as={Col} sm= "4">
              <Form.Label className= "d-flex justify-content-start ps-3">
                Until date
              </Form.Label>
              <Form.Control type="date"
                            name="date_to"
                            onChange={this.handleInputChange} />
            </Form.Group>
          </Row>

          <Row className= "mt-4 mb-5">
            <Col sm= "4">
              <Form.Control type="text"
                            name="currency"
                            placeholder="Enter currency"
                            onChange={this.handleInputChange} />
            </Col>
            <Col sm= "4">
              {button}
            </Col>
          </Row>
        </Form>

        {spinner}
        {table}
        <p id="error-transactions" className= "error-message mt-2"> {this.state.error} </p>
      </Container>
    );
  }
}

export default Transactions;
