import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Operations from "../components/Operations";
import { UserState } from "../context/UserContext";

interface OperationProps {}

const Operation: React.FC<OperationProps> = () => {
  const { user } = UserState();

  

  return (
    <Container className="operation py-5 d-flex flex-column align-items-center">
      <Row >
        <Col>
          <h1>Deposit/WithDraw</h1>
        </Col>
      </Row>
      <Row className="d-flex align-items-center" style={{height:"20vh"}}>
        <Col style={{textAlign:"center"}}>
        <h3 >
            balance is: {user.balance}
          </h3>
          <h3 >
            balance EUR is: {user.balanceEUR}&euro;
          </h3>
          <h3 >
            balance USD is: {user.balanceUSD}&#36;
          </h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Operations />
        </Col>
      </Row>
    </Container>
  );
};

export default Operation;
