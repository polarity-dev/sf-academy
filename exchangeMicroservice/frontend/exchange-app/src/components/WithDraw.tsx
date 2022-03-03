import { useRef, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { FaDollarSign, FaEuroSign } from "react-icons/fa";
import { FormVariant } from "../utils/Interfaces";
import FormOp from "./FormOp";

interface WithDrawProps {}

const WithDraw: React.FC<WithDrawProps> = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showForm, setShowForm] = useState<boolean>(true);
  return (
    <>
      <h3 style={{ marginTop: "100px" }}>WithDraw</h3>
      <p>Here you can transfer money into your IBAN account.</p>
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
          formvariant={FormVariant.WITHDRAW}
          inputRef={inputRef}
          currency="€"
          operation="withdraw"
        />
      ) : (
        <FormOp
          formvariant={FormVariant.WITHDRAW}
          inputRef={inputRef}
          currency="$"
          operation="withdraw"
        />
      )}
    </>
  );
};

export default WithDraw;
