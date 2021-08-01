import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import SignupForm from './signup';
import LoginForm from './login';
import Homepage from './home';
import Accounts from "./accounts"
import Transactions from "./transactions"
import logo from "../images/logo.svg"

class TopNav extends React.Component {

  logoutClick(){
    localStorage.removeItem("user");
    ReactDOM.render(<TopNav />, document.getElementById('navbar'));
    ReactDOM.render(<Homepage />, document.getElementById('container'));
  }

  homeClick(){
    ReactDOM.render(<Homepage />, document.getElementById('container'));
  }

  signupClick(){
    ReactDOM.render(<SignupForm />, document.getElementById('container'));
  }

  loginClick(){
    ReactDOM.render(<LoginForm />, document.getElementById('container'));
  }

  accountsClick(){
    ReactDOM.render(<Accounts />, document.getElementById('container'));
  }

  TransactionsClick(){
    ReactDOM.render(<Transactions />, document.getElementById('container'));
  }


  render() {
    
    let isLogged = (JSON.parse(localStorage.getItem("user")) === null) ? false : true;
    let links;

    if (isLogged){
      links = <Nav className="w-100 me-5 d-flex justify-content-end">
                 <Nav.Link className="navigation-link mx-3" onClick={this.accountsClick}> Accounts </Nav.Link>
                 <Nav.Link className="navigation-link mx-3" onClick={this.TransactionsClick}> Transactions </Nav.Link>
                 <Nav.Link className="navigation-link mx-3" onClick={this.logoutClick}> Logout </Nav.Link>
              </Nav>
    }
    else{
      links = <Nav className="w-100 me-5 d-flex justify-content-end">
                <Nav.Link className="navigation-link mx-3" onClick={this.signupClick}> Signup </Nav.Link>
                <Nav.Link className="navigation-link mx-3" onClick={this.loginClick}> Login </Nav.Link>
              </Nav>
    }

    return(
      <Navbar expand="lg" className="navigation-bar">
        <Container>
          <Navbar.Brand>
            <img src= {logo} onClick= {this.homeClick} className="d-inline-block align-top" alt="exchange logo"/>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className = "custom-toggler"/>
          <Navbar.Collapse id="basic-navbar-nav" className ="mx-2 w-100">
            {links}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default TopNav
