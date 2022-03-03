import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import api from "../api/api";
import { UserState } from "../context/UserContext";

interface BuyOperationProps {
  data: number | null;
  currency: string;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<number | null>>;
  setInitialValue: React.Dispatch<React.SetStateAction<number>>;
  initialValue: number;
}

const BuyOperation: React.FC<BuyOperationProps> = ({
  data,
  currency,
  setSuccess,
  setData,
  setInitialValue,
  initialValue,
}) => {
  const { getBalance, token } = UserState();
  const [error, setError] = useState<boolean>(false);

  const handleClick = async (currency: string) => {
    if (data && token) {
      try {
        const res = await api.buy(initialValue, data, currency, token);
        if (res.status === 200) {
          getBalance();
        }
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setInitialValue(0);
        setData(null);
        setSuccess(true);
      }
    }
  };

  if (error) {
    return (
      <>
        <h4>Error buy!</h4>
      </>
    );
  }

  return (
    <>
      <h3 >Do you want to confirm the purchase?</h3>
      <div
        className="d-flex align-items-center flex-column py-3"
        style={{ minWidth: "200px" }}
      >
        <h2>{data}$</h2>
        <div>
          {currency === "$" ? (
            <Button variant="outline-primary" onClick={() => handleClick("$")}>
              buy
            </Button>
          ) : (
            <Button variant="outline-primary" onClick={() => handleClick("€")}>
              buy
            </Button>
          )}
          <Button variant="outline-primary" onClick={() => setData(null)}>
            back
          </Button>
        </div>
      </div>
    </>
  );
};

export default BuyOperation;
