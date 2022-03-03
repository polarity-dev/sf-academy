import { useRef, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { FaEuroSign, FaDollarSign } from "react-icons/fa";
import { FormVariant } from "../utils/Interfaces";
import FormOp from "./FormOp";

interface DepositProps {}

const Deposit: React.FC<DepositProps> = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showForm, setShowForm] = useState<boolean>(true);

  return (
    <>
      <h3 style={{ marginTop: "100px" }}>Deposit</h3>
      <p>Here you can transfer money into your Exchange account.</p>
      <div className="btn-op">
        <Button
          variant="outline-primary"
          onClick={() => {
            setShowForm(true);
          }}
        >
          <FaEuroSign />
        </Button>
        <Button
          variant="outline-primary"
          onClick={() => {
            setShowForm(false);
          }}
        >
          <FaDollarSign />
        </Button>
      </div>
      {showForm ? (
        <FormOp
          formvariant={FormVariant.DEPOSIT}
          inputRef={inputRef}
          currency="€"
          operation="deposit"
        />
      ) : (
        <FormOp
          formvariant={FormVariant.DEPOSIT}
          inputRef={inputRef}
          currency="$"
          operation="deposit"
        />
      )}
    </>
  );
};

export default Deposit;
