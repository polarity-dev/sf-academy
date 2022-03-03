import { useEffect } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Link } from "react-router-dom";
import api from "../api/api";
import { UserState } from "../context/UserContext";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const { token, handleSetUser } = UserState();

  useEffect(() => {
    (async () => {
      if (token) {
        try {
          const res = await api.authUser(token);

          const { id, name, email, iban, balanceEUR, balanceUSD, balance } = res.data;

          const user = {
            id: id,
            name: name,
            email: email,
            iban: iban,
            balanceEUR: balanceEUR,
            balanceUSD: balanceUSD,
            balance: balance,
          };

          handleSetUser(user);
        } catch (err) {
          console.log(err);
        }
      }
    })();
  }, []);

  return (
    <div className="home-page">
      <Container
        fluid
        className="py-2 d-flex justify-content-center"
        style={{ textAlign: "center", color: "white" }}
      >
        <Row>
          <Col className="d-flex flex-column align-items-center py-2">
            <h1 style={{ fontWeight: "bold", fontSize: "60px" }}>
              Exchange microservice
            </h1>
            <Link to="/exchange">
              <Button
                variant="outline-primary"
                size="lg"
                style={{ width: "250px" }}
              >
                exchange your money
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
