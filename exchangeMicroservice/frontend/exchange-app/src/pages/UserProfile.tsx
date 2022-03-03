import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import ListTransactions from "../components/ListTransactions";
import { UserState } from "../context/UserContext";
import ListGroup from "react-bootstrap/esm/ListGroup";
import TransactionsFetch from "../api/TransactionsFetch";
import { useEffect, useState } from "react";
import { Transaction } from "../utils/Interfaces";

interface UserProfileProps {}

const UserProfile: React.FC<UserProfileProps> = () => {
  const { user,token } = UserState();
  const userTransactions = TransactionsFetch();
  const [list, setList] = useState<Transaction[]>();
  
  useEffect(() => {
    if (token && user.id) {
      userTransactions.fetchTransactions(user.id, token, setList);
    }
  }, []);

  return (
    <Container className="fluid profile py-4">
      <Row style={{ height: "50%" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Profile user
        </h1>
        <Col className="d-flex align-items-center flex-column">
          <ListGroup className="flex-row">
            <ListGroup.Item variant="primary" className="d-flex flex-column">
              <span>email: {user.email}</span>
              <span>name: {user.name}</span>
            </ListGroup.Item>
            <ListGroup.Item variant="info" className="d-flex flex-column">
              <span>iban: {user.iban}</span>
              <span>balance: {user.balance}</span>
            </ListGroup.Item>
            <ListGroup.Item variant="dark" className="d-flex flex-column">
              <span> balanceUSD: {user.balanceUSD}&#36;</span>
              <span>balanceEUR: {user.balanceEUR}&euro;</span>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col style={{ marginTop: "50px" }}>
          <h2 style={{ textAlign: "center" }}>List Transactions</h2>
          <ListTransactions 
              list={list} setList={setList} 
              loading={userTransactions.loading} 
              error={userTransactions.error} 
          />
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
