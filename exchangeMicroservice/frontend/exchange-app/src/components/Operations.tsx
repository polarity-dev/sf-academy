import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";

import Deposit from "./Deposit";
import WithDraw from "./WithDraw";

interface OperationsProps {}

const Operations: React.FC<OperationsProps> = () => {
  return (
    <Container style={{ width: "100vw"}}>
      <Row>
        <Col md={6} className="d-flex flex-column align-items-center">
          <Deposit />
        </Col>
        <Col md={6} className="d-flex flex-column align-items-center">
          <WithDraw />
        </Col>
      </Row>
    </Container>
  );
};

export default Operations;
