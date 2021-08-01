import React from 'react';
import { Container, Spinner, Row, Col, Card} from 'react-bootstrap';

class Homepage extends React.Component {

  constructor(){
    super();

    this.state = {
      loading: true,
      rates: [],
      error : ""
    };

    this.fetchExchangeRates();
  }

  fetchExchangeRates(){

    this.setState({loading :true});
    let error = "";

    fetch('http://localhost:80/v1/exchangerates', {
      method: 'GET'
      }).then(res => {
        switch (res.status) {
          case 400:
            error = "Could not fetch exchange rates";
            break;
          default:
        }
        return res.json();
      }).then(json => {

          if (error !== ""){
            this.setState({loading:false, error: error});
            return;
          }

          let parse = JSON.parse(json.rates);
          localStorage.setItem("rates", JSON.stringify(parse));
          this.setState({rates: parse, loading: false});

      }).catch(err => {
        error = "Could not fetch exchange rates";
        this.setState({loading: false, error: error});
      });

  }

  render(){

    let spinner = this.state.loading ?
                  <Spinner animation="border" role="status" className="mt-3"/>
              : "";


    let list = [];

    for(let i = 0; i < this.state.rates.length; i++){
      let rate = this.state.rates[i];
      let key = rate[0];
      let value = rate[1];
      list.push(<Col key= {key}>
                  <Card className="card-rate">
                    <Card.Body className= "d-flex justify-content-around align-items-center">
                        <p className ="m-0 rate">{value}</p>
                        <p className ="m-0 currency">{key}</p>
                        <img src= {`${process.env.PUBLIC_URL}/assets/flags_small/${key.toLowerCase()}.webp`} className ="currency-flag"/>
                    </Card.Body>
                  </Card>
                    </Col>);
    }

    let cards =  this.state.loading ? "" : <Row xs={1} sm={2} md={3} lg={4} className={`g-${this.state.rates.length} my-4`}>
                                            {list}
                                           </Row>;

    return (
      <Container className= "content w-75 mx-auto my-5 py-5">
        <h1 className="title p-0 m-0"> Exchange rates for 1 EUR
          <img src= {`${process.env.PUBLIC_URL}/assets/flags_small/eur.webp`} className="currency-flag eur ms-3"/>
        </h1>
        {spinner}
        {cards}
        <p id="error-home" className= "error-message my-3"> {this.state.error} </p>
      </Container>
    )
  }
}

export default Homepage;
