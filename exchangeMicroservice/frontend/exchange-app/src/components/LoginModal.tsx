import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {}

const LoginModal: React.FC<LoginModalProps> = () => {

  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  return (
    <>
      <div className="login-modal">
        <Button
          variant="outline-primary"
          size="lg"
          onClick={handleShow}
          className="btn-login"
          style={{marginRight:"30px"}}
        >
          Login
        </Button>
        <Button variant="outline-primary" size="lg" onClick={()=>{navigate(`/signup`)}} className="btn-signup">
          Signup
        </Button>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginForm />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginModal;
