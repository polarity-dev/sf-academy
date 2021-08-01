import React from 'react';
import "./App.css";
import { Container } from "react-bootstrap";
import TopNav from "./components/navbar.js"
import Homepage from './components/home';

class App extends React.Component {

  render(){
    return (
      <div id="page" className="h-100 d-flex flex-column">
        <div id="navbar">
        <TopNav/>
        </div>
        <Container id="container" className="w-100 mw-100 flex-grow-1 d-flex flex-column justify-content-center">
          <Homepage/>
        </Container>
      </div>
    );
  }
}
export default App;
