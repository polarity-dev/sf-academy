import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import image from  '../images/logo_small_icon_only_inverted.png'
import TopNav from './navbar.js';
import Homepage from './home';

class LoginForm extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      loading: true,
      error: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  fetchLogin(){
    let data = {email: this.state.email, password: this.state.password};
    let error = "";
    this.setState({loading: true});
    fetch('http://localhost:80/v1/user/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
      }).then(res => {
        switch (res.status) {
          case 401:
            error = "Wrong email or password";
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
        this.setState({loading: false});
        ReactDOM.render(<TopNav />, document.getElementById('navbar'));
        ReactDOM.render(<Homepage />, document.getElementById('container'));

      }).catch(err => {
        this.setState({loading: false});
        document.getElementById("error-login").innerHTML = "Connection to server failed";
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
    if (this.state.email === '' || this.state.password === '') return;
    this.fetchLogin();
  }

  render() {

    let button = this.state.loading ?
                <Button className="mt-1" disabled>
                  <Spinner animation="border" role="status" size="sm"/>
                </Button>
              : <Button className="mt-1" type="submit">
                  Login
                </Button>;

    return (
      <Container className= "content w-50 mx-auto my-3 py-5">
        <img src= {image} className="d-inline-block align-top mb-3" width="150" height="150" alt="exchange logo"/>
        <Row>
          <Col></Col>
          <Col lg= {8}>
            <Form onSubmit={this.handleSubmit}>

              <Form.Group className="mb-3 mt-2">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  onChange={this.handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={this.handleInputChange}
                  required
                />
              </Form.Group>

              <p id="error-login" className= "error-message"> {this.state.error} &nbsp; </p>
              {button}
            </Form>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    );
  }
}

export default LoginForm
