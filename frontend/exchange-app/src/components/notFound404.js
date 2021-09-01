import React from 'react';
import { Container } from 'react-bootstrap';

class Page404 extends React.Component {

  render(){
    return(
      <Container className= "content w-50 mx-auto my-3 py-5">
        <h1 className="title"> 404 - Page not found </h1>
      </Container>
    )
  }
}

export default Page404;
