import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";

import Buy from "../components/Buy";

import { UserState } from "../context/UserContext";

interface ExchangeProps {}

const Exchange: React.FC<ExchangeProps> = () => {
  const { user } = UserState();
  return (
    <Container className="exchange-page py-5 d-flex flex-column align-items-center">
      <Row>
        <Col>
          <h1>Exchange</h1>
          <h2>Here you can buy EUR to USD or USD to EUR</h2>
        </Col>
      </Row>
      <Row className="d-flex align-items-center" style={{ height: "30vh" }}>
        <Col>
          <h3 style={{ textAlign: "center" }}>
            balance EUR is: {user.balanceEUR}&euro;
          </h3>
          <h3 style={{ textAlign: "center" }}>
            balance USD is: {user.balanceUSD}&#36;
          </h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Buy />
        </Col>
      </Row>
    </Container>
  );
};

export default Exchange;
