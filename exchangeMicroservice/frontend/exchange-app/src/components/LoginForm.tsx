import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { UserState } from "../context/UserContext";
import api from "../api/api";
import Container from "react-bootstrap/esm/Container";

interface LoginFormProps {}

const LoginForm: React.FC<LoginFormProps> = () => {
  const { handleSetToken } = UserState();
  const [error, setError] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.login(email, password);
      handleSetToken(res.data.token);
      sessionStorage.setItem("token", res.data.token);
    } catch (error) {
      setError(true);
      console.warn(error);
    }
  };

  if (error) {
    return (
      <Container fluid className="d-flex align-items-center flex-column">
        <h4>incorrect credentials!</h4>
        <Button onClick={() => setError(false)}>Retry</Button>
      </Container>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          autoComplete="email"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          autoComplete="current-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        enter
      </Button>
    </Form>
  );
};

export default LoginForm;
