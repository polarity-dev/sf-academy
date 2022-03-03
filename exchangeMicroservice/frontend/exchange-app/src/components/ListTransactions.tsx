import { useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import FormControl from "react-bootstrap/esm/FormControl";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Row from "react-bootstrap/esm/Row";
import Spinner from "react-bootstrap/esm/Spinner";
import Table from "react-bootstrap/esm/Table";
import { Transaction, SortKeys } from "../utils/Interfaces";
import { ordinaStringheASC, ordinaStringheDSC } from "../utils/utils";

interface ListTransactionsProps {
  list: Transaction[] | undefined;
  setList: React.Dispatch<React.SetStateAction<Transaction[] | undefined>>;
  loading: boolean;
  error: boolean;
}

const ListTransactions: React.FC<ListTransactionsProps> = ({
  list,
  setList,
  loading,
  error,
}) => {
  const [order, setOrder] = useState<string>("ASC");
  const [filter, setFilter] = useState<string>("");
  const style = { cursor: "pointer" };

  const sorting = (col: SortKeys) => {
    if (list) {
      if (order === "ASC") {
        const ordinaASC = (a: Transaction, b: Transaction) =>
          ordinaStringheASC(a[col], b[col]);
        const sorted = [...list].sort(ordinaASC);
        setList(sorted);
        setOrder("DSC");
      }
      if (order === "DSC") {
        const ordinaDSC = (a: Transaction, b: Transaction) =>
          ordinaStringheDSC(a[col], b[col]);
        const sorted = [...list].sort(ordinaDSC);
        setList(sorted);
        setOrder("ASC");
      }
    }
  };

  const filterList = (val: Transaction) => {
    if (filter === "") {
      return val;
    } else if (
      val.typeOperations.toLowerCase().includes(filter.toLowerCase()) ||
      val.value.toString().toLowerCase().includes(filter.toLowerCase()) ||
      val.currency.toLowerCase().includes(filter.toLowerCase()) ||
      val.date.toLowerCase().includes(filter.toLowerCase())
    ) {
      return val;
    }
  };

  if (loading) {
    return (
      <Container className="d-flex align-content-center justify-content-center py-5">
        <Row>
          <Col className="d-flex flex-column align-items-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex align-content-center justify-content-center py-5">
        <Row>
          <Col className="d-flex flex-column align-items-center">
            Impossibile caricare transazioni
          </Col>
        </Row>
      </Container>
    );
  }

  if (list) {
    return (
      <Container>
        <Row>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              filter
            </InputGroup.Text>
            <FormControl
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              value={filter}
              onChange={(elem) => setFilter(elem.target.value)}
            />
          </InputGroup>
        </Row>
        <Row>
          <Col>
            <Table striped bordered hover responsive="sm">
              <thead>
                <tr style={style}>
                  <th onClick={() => sorting("typeOperations")}>Operation</th>
                  <th onClick={() => sorting("value")}>value</th>
                  <th onClick={() => sorting("currency")}>Currency</th>
                  <th onClick={() => sorting("date")}>Data</th>
                </tr>
              </thead>
              <tbody>
                {list.filter(filterList).map((elem) => {
                  const { id, value, date, typeOperations, currency } = elem;
                  return (
                    <tr key={id}>
                      <td>{typeOperations}</td>
                      <td>{value}</td>
                      <td>{currency}</td>
                      <td>{date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col className="d-flex justify-content-center">
          <h4>No transactions yet</h4>
        </Col>
      </Row>
    </Container>
  );
};

export default ListTransactions;
