import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import SignupForm from './components/signup';
import LoginForm from './components/login';
import Homepage from './components/home';
import Accounts from "./components/accounts"
import Transactions from "./components/transactions"
import Page404 from "./components/notFound404"
import logo from "./images/logo.svg"
import "./App.css";

class App extends React.Component {

  logoutClick(){
    localStorage.removeItem("user");
    ReactDOM.render(<App />,  document.getElementById('root'));
  }

  render(){

    let isLogged = (JSON.parse(localStorage.getItem("user")) === null) ? false : true;
    let links;

    if (isLogged){
      links = <Nav className="w-100 me-5 d-flex justify-content-end">
                <Nav.Link href="/accounts" className="navigation-link mx-3"> Accounts </Nav.Link>
                <Nav.Link href="/transactions" className="navigation-link mx-3"> Transactions </Nav.Link>
                <Nav.Link className="navigation-link mx-3" onClick={this.logoutClick}> Logout </Nav.Link>
              </Nav>;
    }
    else{
      links = <Nav className="w-100 me-5 d-flex justify-content-end">
                <Nav.Link href="/signup" className="navigation-link mx-3"> Signup </Nav.Link>
                <Nav.Link href="/login" className="navigation-link mx-3"> Login </Nav.Link>
              </Nav>;
    }

    return (
      <div id="page" className="h-100 d-flex flex-column">
        <Router>

        <div id="navbar">
        <Navbar expand="lg" className="navigation-bar">
          <Container>
            <Navbar.Brand href="/">
              <img src= {logo}  className="d-inline-block align-top" alt="exchange logo"/>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className = "custom-toggler"/>
            <Navbar.Collapse id="basic-navbar-nav" className ="mx-2 w-100">
              {links}
            </Navbar.Collapse>
          </Container>
        </Navbar>
        </div>

        <Container id="container" className="w-100 mw-100 flex-grow-1 d-flex flex-column justify-content-center">
          <Switch>
            <Route exact path="/">
              <Homepage />
            </Route>
            <Route exact path="/signup">
              { isLogged ? <Redirect to = "/"/> : <SignupForm /> }
            </Route>
            <Route exact path="/login">
              { isLogged ? <Redirect to = "/"/> : <LoginForm /> }
            </Route>
            <Route exact path="/accounts">
              { isLogged ? <Accounts/> : <Redirect to = "/login" /> }
            </Route>
            <Route exact path="/transactions">
              { isLogged ? <Transactions/> : <Redirect to = "/login" /> }
            </Route>
            <Route path="*">
              <Page404 />
            </Route>
          </Switch>
        </Container>
      </Router>
    </div>
    );
  }
}

export default App;
