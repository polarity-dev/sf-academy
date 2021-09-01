import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import TopNav from './navbar.js';
import Homepage from './home';
import App from '../App';

class SignupForm extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      password2: '',
      name:'',
      iban:'',
      loading: true,
      error: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  fetchSignup(){
    let data = {email: this.state.email, password: this.state.password, name:this.state.name, iban: this.state.iban};
    let error = "";

    this.setState({loading: true});
    fetch('http://localhost:80/v1/user/signup', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
      }).then(res => {
        this.setState({loading: false});
        switch (res.status) {
          case 401:
            error = "Email already in use";
            break;
          case 400:
            error = "Connection to server failed";
            break;
          default:
        }
        return res.json();
      }).then(json => {

          if (error !== "") {
            this.setState({loading: false, error: error});
            return;
          }

          localStorage.setItem("user",JSON.stringify(json));
          this.setState({loading :false});
          ReactDOM.render(<App />,  document.getElementById('root'));

      }).catch(err => {
        this.setState({loading: false});
        error = "Connection to server failed";
      });
  }

  componentDidMount(){
    this.setState({loading: false});
  }

  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.state.email === '' || this.state.password === '' || this.state.password2 === ''
                    || this.state.name === '' || this.state.iban === '') return;

    if (this.state.password !== this.state.password2) {
      this.setState({error : "Passwords do not match"});
      return;
    }
    else{
      this.setState({error : ""});
    }

    this.fetchSignup();
  }

  render() {

    let button = this.state.loading ?
                <Button className="mt-1" disabled>
                  <Spinner animation="border" role="status" size="sm"/>
                </Button>
              : <Button className="mt-1" type="submit">
                  Create account
                </Button>;

    return (
      <Container className= "content w-50 mx-auto my-5 py-5">
        <h1 className="title"> Sign Up </h1>
        <Row>
          <Col></Col>
          <Col lg= {8}>
            <Form onSubmit={this.handleSubmit}>

              <Form.Group className="my-3">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={this.handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="my-3">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={this.handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="my-3">
                <Form.Control
                  type="password"
                  name="password2"
                  placeholder="Confirm password"
                  onChange={this.handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="my-3">
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Name"
                  onChange={this.handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="my-3">
                <Form.Control
                  type="text"
                  name="iban"
                  placeholder="IBAN"
                  onChange={this.handleInputChange}
                  required
                />
              </Form.Group>

              <p id="error-signup" className= "error-message"> {this.state.error} &nbsp; </p>
              {button}
            </Form>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    );
  }
}

export default SignupForm
