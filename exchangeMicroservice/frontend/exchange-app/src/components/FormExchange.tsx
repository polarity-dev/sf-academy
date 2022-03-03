import { useRef, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import FormControl from "react-bootstrap/esm/FormControl";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Spinner from "react-bootstrap/esm/Spinner";
import api from "../api/api";
import { UserState } from "../context/UserContext";

interface FormExchangeProps {
  currencyTo: string;
  currency: string;
  setData: React.Dispatch<React.SetStateAction<number | null>>;
  setInitialValue: React.Dispatch<React.SetStateAction<number>>;
}

const FormExchange: React.FC<FormExchangeProps> = ({
  currency,
  currencyTo,
  setData,
  setInitialValue,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isErrorDeposit, setIsErrorDeposit] = useState<boolean>(false);
  const { user } = UserState();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputRef.current) {
      const value = parseInt(inputRef.current.value);

      if (value <= 0 || !value) {
        setIsError(true);
        return;
      }
      if (currency === "$" && value > user.balanceUSD) {
        setIsErrorDeposit(true);
        return;
      }
      if (currency === "€" && value > user.balanceEUR) {
        setIsErrorDeposit(true);
        return;
      }
      try {
        setIsLoading(true);
        const res = await api.exchange(value, currency, currencyTo);
        console.log("sono res", res);

        if (res.data.value) {
          setData(res.data.value);
          setInitialValue(value);
        }
      } catch (e) {
        setIsError(true);
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsErrorDeposit(true);
    }
  };

  if (isLoading) {
    return (
      <Spinner animation="border" role="status" style={{ marginTop: "30px" }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (isErrorDeposit) {
    return (
      <>
        {" "}
        <p style={{ color: "red", marginTop: "10px" }}>Error!</p>
        <Button onClick={() => setIsErrorDeposit(false)}>Retry</Button>
      </>
    );
  }

  if (isError) {
    return (
      <>
        {" "}
        <p style={{ color: "red", marginTop: "10px" }}>Error api exchange!</p>
        <Button onClick={() => setIsError(false)}>Retry</Button>
      </>
    );
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <InputGroup style={{alignItems: "baseline" }} size="lg">
          <FormControl  type="number" ref={inputRef} />
          <InputGroup.Text>{currency}</InputGroup.Text>
          <Button type="submit">calcolate</Button>
        </InputGroup>
      </Form>
    </>
  );
};

export default FormExchange;
