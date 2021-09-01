import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
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
    let router;

    if (isLogged){
      router =  <Router>

                  <Link to="/"> <Navbar.Brand>
                    <img src= {logo}  className="d-inline-block align-top" alt="exchange logo"/>
                  </Navbar.Brand> </Link>

                  <Navbar.Toggle aria-controls="basic-navbar-nav" className = "custom-toggler"/>
                  <Navbar.Collapse id="basic-navbar-nav" className ="mx-2 w-100">
                    <Nav className="w-100 me-5 d-flex justify-content-end">
                      <Link to="/accounts"> <Nav.Link className="navigation-link mx-3"> Accounts </Nav.Link> </Link>
                      <Link to="/transactions"> <Nav.Link className="navigation-link mx-3"> Transactions </Nav.Link> </Link>
                      <Nav.Link className="navigation-link mx-3" onClick={this.logoutClick}> Logout </Nav.Link>
                     </Nav>
                  </Navbar.Collapse>

                  <Switch>
                    <Route exact path="/">
                      <Homepage />
                    </Route>
                    <Route path="/accounts">
                      <Accounts />
                    </Route>
                    <Route path="/transactions">
                      <Transactions />
                    </Route>
                  </Switch>
                </Router>

    }
    else{
      router = <Router>

                <Link to="/"> <Navbar.Brand>
                  <img src= {logo}  className="d-inline-block align-top" alt="exchange logo"/>
                </Navbar.Brand> </Link>

                <Navbar.Toggle aria-controls="basic-navbar-nav" className = "custom-toggler"/>
                <Navbar.Collapse id="basic-navbar-nav" className ="mx-2 w-100">
                  <Nav className="w-100 me-5 d-flex justify-content-end">
                    <Link to="/signup"> <Nav.Link className="navigation-link mx-3"> Signup </Nav.Link> </Link>
                    <Link to="/login"> <Nav.Link className="navigation-link mx-3"> Login </Nav.Link> </Link>
                  </Nav>
                </Navbar.Collapse>

                <Switch>
                  <Route exact path="/">
                    <Homepage />
                  </Route>
                  <Route path="/accounts">
                    <SignupForm />
                  </Route>
                  <Route path="/login">
                    <LoginForm />
                  </Route>
                </Switch>
              </Router>
    }

    return(
      <Navbar expand="lg" className="navigation-bar">
        <Container>
          {router}
        </Container>
      </Navbar>
    );
  }
}

export default TopNav
