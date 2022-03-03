import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { FaExchangeAlt } from "react-icons/fa";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";

import FormExchange from "./FormExchange";
import BuyOperation from "./BuyOperation";

interface BuyProps {}

const Buy: React.FC<BuyProps> = () => {
  const [initialValue, setInitialValue] = useState<number>(0);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [data, setData] = useState<number | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  return (
    <>
      {!success ? (
        <Container className="d-flex flex-column justify-content-center align-items-center">
          <Row>
            <Col className="d-flex flex-column align-items-center">
              <p>
                before confirmation the value of the currencies will be
                calculated
              </p>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex flex-column align-items-center">
              <Button
                variant="outline-primary"
                onClick={() => {
                  setShowForm(!showForm);
                }}
                style={{ width: "100px" }}
              >
                <FaExchangeAlt />
              </Button>
              <>
                {showForm ? (
                  <Container fluid>
                    <h5 style={{ marginTop: "30px" }}>EUR to USD</h5>
                    <FormExchange
                      currency="€"
                      currencyTo="$"
                      setData={setData}
                      setInitialValue={setInitialValue}
                    />
                  </Container>
                ) : (
                  <Container fluid>
                    <h5 style={{ marginTop: "30px" }}>USD to EUR</h5>
                    <FormExchange
                      currency="$"
                      currencyTo="€"
                      setData={setData}
                      setInitialValue={setInitialValue}
                    />
                  </Container>
                )}
              </>
            </Col>
          </Row>
          {data ? (
            <Row>
              <Col
                className="d-flex flex-column align-items-center py-4"
                style={{ marginTop: "50px"}}
              >
                {showForm ? (
                  <BuyOperation
                    data={data}
                    currency="$"
                    setSuccess={setSuccess}
                    setData={setData}
                    setInitialValue={setInitialValue}
                    initialValue={initialValue}
                  />
                ) : (
                  <BuyOperation
                    data={data}
                    currency="€"
                    setSuccess={setSuccess}
                    setData={setData}
                    setInitialValue={setInitialValue}
                    initialValue={initialValue}
                  />
                )}
              </Col>
            </Row>
          ) : null}
        </Container>
      ) : (
        <Container
          className="d-flex align-items-center"
          style={{ height: "30vh" }}
        >
          <h2>Buy Successful!</h2>
          <Button
            onClick={() => setSuccess(false)}
            style={{ marginLeft: "10px" }}
          >
            back
          </Button>
        </Container>
      )}
    </>
  );
};

export default Buy;
