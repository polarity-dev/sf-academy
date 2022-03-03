import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { FcCurrencyExchange } from "react-icons/fc";
import { RiExchangeFundsFill } from "react-icons/ri";

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const style = { width: "60px", height: "50px" };
  return (
    <Container fluid className="footer">
      <Row>
        <Col className="d-flex align-items-center justify-content-center footer-content">
          <span className="d-flex">
            <FcCurrencyExchange style={style} />
            <RiExchangeFundsFill style={style} />
          </span>
          <p>develompment by veffev</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
