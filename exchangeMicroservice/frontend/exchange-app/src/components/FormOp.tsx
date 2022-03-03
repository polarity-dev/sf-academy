import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import FormControl from "react-bootstrap/esm/FormControl";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Spinner from "react-bootstrap/esm/Spinner";
import api from "../api/api";
import { UserState } from "../context/UserContext";
import { FormVariant } from "../utils/Interfaces";

interface FormOpProps {
  inputRef: React.RefObject<HTMLInputElement>;
  currency: string;
  operation: string;
  formvariant: FormVariant;
}

const FormOp: React.FC<FormOpProps> = ({
  inputRef,
  currency,
  operation,
  formvariant,
}) => {
  const { getBalance, token, user } = UserState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setData] = useState<boolean>(false);

  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRef.current && token) {
      const value = parseInt(inputRef.current.value);
      if (value < 0) {
        setIsError(true);
        return;
      }
      try {
        setIsLoading(true);
        const resDeposit = await api.deposit(value, currency, token);
        console.log(resDeposit);

        if (resDeposit.status === 200) {
          getBalance();
          setData(true);
        }
      } catch (e) {
        setIsError(true);
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmitWithDraw = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputRef.current && token) {
      const value = parseInt(inputRef.current.value);

      if (value < 0) {
        setIsError(true);
        return;
      } else if (currency === "$" && value > user.balanceUSD) {
        setIsError(true);
        return;
      } else if (currency === "€" && value > user.balanceEUR) {
        setIsError(true);
        return;
      }

      try {
        setIsLoading(true);
        const resWithDraw = await api.withdraw(value, currency, token);

        if (resWithDraw.status === 200) {
          console.log(resWithDraw.status);
          getBalance();
          setData(true);
        }
      } catch (e) {
        setIsError(true);
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <Spinner animation="border" role="status" style={{ marginTop: "30px" }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (isError) {
    return (
      <>
        <h4 style={{ marginTop: "30px" }}>Error api!</h4>
        <Button onClick={() => setIsError(false)}>Retry</Button>
      </>
    );
  }

  if (data) {
    return (
      <>
        <h4 style={{ marginTop: "30px" }}>Deposit successfully!</h4>
        <Button onClick={() => setData(false)}>back</Button>
      </>
    );
  }

  return (
    <Form
      onSubmit={
        formvariant === FormVariant.DEPOSIT
          ? handleSubmitDeposit
          : handleSubmitWithDraw
      }
    >
      <InputGroup style={{ marginTop: "30px" }} size="lg">
        <FormControl type="number" ref={inputRef} />
        <InputGroup.Text>{currency}</InputGroup.Text>
        <Button type="submit">{operation}</Button>
      </InputGroup>
    </Form>
  );
};

export default FormOp;
