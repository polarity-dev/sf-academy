import React from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import LoginModal from "../components/LoginModal";

export interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  return (
    <div className="home-page">
      <Container fluid className="py-2">
        <Row>
          <Col className="d-flex flex-column py-2 home-page-content">
            <h1 style={{ fontWeight: "bold" }}>Exchange microservice</h1>
            <LoginModal />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
