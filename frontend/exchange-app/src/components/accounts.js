import React from 'react';
import { Container, Row, Col, Form, Button, Spinner, Card } from 'react-bootstrap';

class Accounts extends React.Component {

  constructor(){
    super();

    this.state = {
      rates: new Map(JSON.parse(localStorage.getItem("rates"))),
      loading: true,
      deposit_amount: 0,
      deposit_currency: "",
      withdraw_amount: 0,
      withdraw_currency: "",
      buy_amount: 0,
      buy_from: "",
      buy_to: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDepositSubmit = this.handleDepositSubmit.bind(this);
    this.handleWithdrawSubmit = this.handleWithdrawSubmit.bind(this);
    this.handleBuySubmit = this.handleBuySubmit.bind(this);
  }

  componentDidMount(){
    this.setState({loading: false});
  }

  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value });

    let from = e.target.name === "buy_from" ? e.target.value.toUpperCase() : this.state.buy_from.toUpperCase();
    let to = e.target.name === "buy_to" ? e.target.value.toUpperCase() : this.state.buy_to.toUpperCase()

    if (from !== "" && to !== "" && from !== to){
      let rate;
      if (from === "EUR") rate = this.state.rates.get(to);
      else if (to === "EUR") rate = 1/this.state.rates.get(from);
      else rate = this.state.rates.get(to) / this.state.rates.get(from);

      rate = Math.round(rate * 1e4)/ 1e4;
      document.getElementById("rate").innerHTML = "Rate: "+ rate;
    }
    else{
      document.getElementById("rate").innerHTML = "Rate: ";
    }
  }

  handleDepositSubmit(e) {
    e.preventDefault();
    let amount = parseFloat(this.state.deposit_amount)

    if (!amount > 0) {
      document.getElementById("error-deposit").innerHTML = "Insert a valid amount";
      return;
    }

    if (this.state.deposit_currency === "") {
      document.getElementById("error-deposit").innerHTML = "Select a valid account";
      return;
    }

    let user = JSON.parse(localStorage.getItem("user"));
    let data = {token: user.token, currency: this.state.deposit_currency.toUpperCase(), amount: amount};
    let error = false;

    this.setState({loading: true});
    fetch('http://ec2-3-143-5-22.us-east-2.compute.amazonaws.com:80/v1/user/deposit', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
      }).then(res => {
        switch (res.status) {
          case 400:
            document.getElementById("error-deposit").innerHTML = "Connection to server failed";
            error = true;
            break;
          case 402:
            document.getElementById("error-deposit").innerHTML = "Token error";
            error = true;
            break;
          default:
        }
        return res.json();
      }).then(json => {

        if (error) {
          this.setState({loading: false});
          return;
        }

        document.getElementById("error-deposit").innerHTML = "&nbsp;";
        user.accounts = json.accounts;
        localStorage.setItem("user", JSON.stringify(user));
        this.setState({loading: false});

    }).catch(err => {
      this.setState({loading: false});
      document.getElementById("error-deposit").innerHTML = "Connection to server failed";
    });
  }

  handleWithdrawSubmit(e){
    e.preventDefault();
    let amount = parseFloat(this.state.withdraw_amount)

    if (!amount > 0) {
      document.getElementById("error-withdraw").innerHTML = "Insert a valid amount";
      return;
    }

    if (this.state.withdraw_currency === "") {
      document.getElementById("error-withdraw").innerHTML = "Select a valid account";
      return;
    }

    let user = JSON.parse(localStorage.getItem("user"));
    let data = {token: user.token, currency: this.state.withdraw_currency.toUpperCase(), amount: amount};
    let error = false;

    this.setState({loading: true});
    fetch('http://ec2-3-143-5-22.us-east-2.compute.amazonaws.com:80/v1/user/withdraw', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
      }).then(res => {
        switch (res.status) {
          case 400:
            document.getElementById("error-withdraw").innerHTML = "Connection to server failed";
            error = true;
            break;
          case 401:
            document.getElementById("error-withdraw").innerHTML = "Insuffcient balance";
            error = true;
            break;
          case 402:
            document.getElementById("error-withdraw").innerHTML = "Token error";
            error = true;
            break;
          default:
        }
        return res.json();
      }).then(json => {

        if (error) {
          this.setState({loading: false});
          return;
        }
        document.getElementById("error-withdraw").innerHTML = "&nbsp;";
        user.accounts = json.accounts;
        localStorage.setItem("user", JSON.stringify(user));
        this.setState({loading: false});

      }).catch(err => {
        this.setState({loading: false});
        document.getElementById("error-withdraw").innerHTML = "Connection to server failed";
      });
  }

  handleBuySubmit(e){
    e.preventDefault();
    let from = this.state.buy_from.toUpperCase();
    let to = this.state.buy_to.toUpperCase();
    let amount = parseFloat(this.state.buy_amount);

    if (!amount > 0) {
      document.getElementById("error-buy").innerHTML = "Insert a valid amount";
      return;
    }

    if (from === "" || to === "" || from === to){
      document.getElementById("error-buy").innerHTML = "Select a valid currency";
      return;
    }

    let user = JSON.parse(localStorage.getItem("user"));
    let data = {token: user.token, currencyFrom: from, currencyTo: to, amount: amount};
    let error = false;

    this.setState({loading: true});
    fetch('http://ec2-3-143-5-22.us-east-2.compute.amazonaws.com:80/v1/user/buy', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
      }).then(res => {
        switch (res.status) {
          case 400:
            document.getElementById("error-buy").innerHTML = "Connection to server failed";
            error = true;
            break;
          case 401:
            document.getElementById("error-buy").innerHTML = "Insuffcient balance";
            error = true;
            break;
          case 402:
            document.getElementById("error-buy").innerHTML = "Token error";
            error = true;
            break;
          default:
        }
        return res.json();
      }).then(json => {

        if (error) {
          this.setState({loading: false});
          return;
        }
        document.getElementById("error-buy").innerHTML = "&nbsp;";
        user.accounts = json.accounts;
        localStorage.setItem("user", JSON.stringify(user));
        this.setState({loading: false});

      }).catch(err => {
        this.setState({loading: false});
        document.getElementById("error-buy").innerHTML = "Connection to server failed";
      });
  }

  render() {

    let spinner = this.state.loading ? <Spinner animation="border" role="status" className="mt-3"/>
                      : "";

    let user = JSON.parse(localStorage.getItem("user"));
    let accounts = JSON.parse(user.accounts);
    let cards = [];
    let accounts_names = []

    for (let i=0; i < accounts.length; i++){
      let currency = accounts[i].currency;
      cards.push(<Col key= {currency} className = "">
                  <Card className= "card-account d-flex justify-content-center align-items-center mx-3 my-2">
                    <Card.Img variant= "top"
                              className="card-account-image"
                              src= {`${process.env.PUBLIC_URL}/assets/flags_medium/${currency.toLowerCase()}.webp`} />
                    <Card.Title className="my-2">
                      {currency}
                    </Card.Title>
                    <Card.Text>
                      {accounts[i].balance}
                    </Card.Text>
                  </Card>
                </Col>);

      accounts_names.push(<option key={currency} value= {`${currency}`}> {currency} </option>);
    }

    let cards_list =  this.state.loading ? "" :
                        <Row xs={1} sm={2} md={3} lg={4} className= {`g-${accounts.length} mt-4`}>
                          {cards}
                        </Row>

    let error0 = (!this.state.loading && accounts.length === 0) ?
                        <p id="error-accounts" className= "error-message mt-3"> User doesn't own any accounts </p>
                      : "";




    return (
      <Container className= "content w-75 mx-auto my-5 py-5">
        <h1 className="title"> My Accounts </h1>
        {spinner}
        {error0}
        {cards_list}

        <h4 className="title mt-4"> Deposit </h4>
          <Form onSubmit={this.handleDepositSubmit} className= "mt-5">
            <Row>

              <Col>
                <Form.Control type="number"
                          min= "0"
                          name="deposit_amount"
                          placeholder="Enter amount"
                          onChange={this.handleInputChange}
                          required
                />
              </Col>

              <Col>
                <Form.Control as="select"
                          name= "deposit_currency"
                          onChange={this.handleInputChange}
                          required >
                  <option value=""> Select Account</option>
                  <option value="eur"> EUR </option>
                  <option value="usd"> USD </option>
                  <option value="jpy"> JPY </option>
                  <option value="bgn"> BGN </option>
                  <option value="czk"> CZK </option>
                  <option value="dkk"> DKK </option>
                  <option value="gbp"> GBP </option>
                  <option value="huf"> HUF </option>
                  <option value="pln"> PLN </option>
                  <option value="ron"> RON </option>
                  <option value="sek"> SEK </option>
                  <option value="chf"> CHF </option>
                  <option value="isk"> ISK </option>
                  <option value="nok"> NOK </option>
                  <option value="hrk"> HRK </option>
                  <option value="rub"> RUB </option>
                  <option value="try"> TRY </option>
                  <option value="aud"> AUD </option>
                  <option value="brl"> BRL </option>
                  <option value="cad"> CAD </option>
                  <option value="cny"> CNY </option>
                  <option value="hkd"> HKD </option>
                  <option value="idr"> IDR </option>
                  <option value="ils"> ILS </option>
                  <option value="inr"> INR </option>
                  <option value="krw"> KRW </option>
                  <option value="mxn"> MXN </option>
                  <option value="myr"> MYR </option>
                  <option value="nzd"> NZD </option>
                  <option value="php"> PHP </option>
                  <option value="sgd"> SGD </option>
                  <option value="thb"> THB </option>
                  <option value="zar"> ZAR </option>
                </Form.Control>
              </Col>

              <Col className = "d-flex justify-content-start">
                <Button type="submit">
                    Deposit
                </Button>
              </Col>

            </Row>
            <p id="error-deposit" className= "error-message my-2"> &nbsp; </p>
          </Form>

        <h4 className="title my-3"> Withdraw </h4>
          <Form onSubmit={this.handleWithdrawSubmit} className= "mt-5">
            <Row>

              <Col>
                <Form.Control type="number"
                              min= "0"
                              name="withdraw_amount"
                              placeholder="Enter amount"
                              onChange={this.handleInputChange}
                              required
                />
              </Col>

              <Col>
                <Form.Control as="select"
                        name= "withdraw_currency"
                        onChange={this.handleInputChange}
                        required >
                  <option value=""> Select Account </option>
                  {accounts_names}
                </Form.Control>
              </Col>

              <Col className = "d-flex justify-content-start">
                <Button type="submit">
                    Withdraw
                </Button>
              </Col>

            </Row>
            <p id="error-withdraw" className= "error-message my-2"> &nbsp; </p>
          </Form>

        <h4 className="title my-3"> Buy </h4>
        <Form onSubmit={this.handleBuySubmit} className= "mt-5">
          <Row>

            <Col>
              <Form.Control type="number"
                            min= "0"
                            name="buy_amount"
                            placeholder="Enter amount"
                            onChange={this.handleInputChange}
                            required
              />
            </Col>

            <Col>
              <Form.Control as="select"
                      name= "buy_from"
                      onChange={this.handleInputChange}
                      required >
                <option value=""> Source Account</option>
                {accounts_names}
              </Form.Control>
            </Col>

            <Col>
              <Form.Control as="select"
                        name= "buy_to"
                        onChange={this.handleInputChange.bind(this)}
                        required >
                <option value=""> Destination Account</option>
                <option value="eur"> EUR </option>
                <option value="usd"> USD </option>
                <option value="jpy"> JPY </option>
                <option value="bgn"> BGN </option>
                <option value="czk"> CZK </option>
                <option value="dkk"> DKK </option>
                <option value="gbp"> GBP </option>
                <option value="huf"> HUF </option>
                <option value="pln"> PLN </option>
                <option value="ron"> RON </option>
                <option value="sek"> SEK </option>
                <option value="chf"> CHF </option>
                <option value="isk"> ISK </option>
                <option value="nok"> NOK </option>
                <option value="hrk"> HRK </option>
                <option value="rub"> RUB </option>
                <option value="try"> TRY </option>
                <option value="aud"> AUD </option>
                <option value="brl"> BRL </option>
                <option value="cad"> CAD </option>
                <option value="cny"> CNY </option>
                <option value="hkd"> HKD </option>
                <option value="idr"> IDR </option>
                <option value="ils"> ILS </option>
                <option value="inr"> INR </option>
                <option value="krw"> KRW </option>
                <option value="mxn"> MXN </option>
                <option value="myr"> MYR </option>
                <option value="nzd"> NZD </option>
                <option value="php"> PHP </option>
                <option value="sgd"> SGD </option>
                <option value="thb"> THB </option>
                <option value="zar"> ZAR </option>
              </Form.Control>
            </Col>

          </Row>
          <Row className = "mt-3">

            <Col>
            </Col>

            <Col className = "d-flex justify-content-start align-items-center">
              <p id="rate" className= "p-0 m-0"> Rate: </p>
            </Col>

            <Col className = "d-flex justify-content-start">
              <Button type="submit">
                  Buy
              </Button>
            </Col>

          </Row>
          <p id="error-buy" className= "error-message my-2"> &nbsp; </p>
        </Form>
      </Container>
    );
  }

}
export default Accounts;
