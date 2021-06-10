import axios from "axios";
import { useState } from "react";
import { Field, Form } from "react-final-form";
import { BiRefresh } from "react-icons/bi";
import { address, useAuth } from "../utils/auth";
import { OnChange } from "react-final-form-listeners";
import { toast, ToastContainer } from "react-toastify";

const Exchange = ({ updater }) => {
  const auth = useAuth();
  const required = (value) => (value && value !== 0 ? undefined : "Richiesto");
  const [symbol, setSymbol] = useState("EUR");
  const [price, setPrice] = useState(null);
  const fetchPrice = async (value, symbol) => {
    await axios
      .get(`${address}/exchangeValue`, {
        params: { value: parseFloat(value), symbol: symbol },
      })
      .then((res) => {
        console.log(res);
        setPrice(
          parseFloat(res.data.data.value).toFixed(3) +
            " " +
            (res.data.data.symbol === "EUR" ? "€" : "$")
        );
      });
  };
  const submitExchange = async (data) => {
    console.log("ciao");
    await axios
      .post(`${address}/buy`, {
        token: auth.token,
        value: parseFloat(data.value),
        symbol,
      })
      .then((r) => {
        console.log(r);
        updater(Math.random());
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.cause, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };
  return (
    <section className="grid flex-1 justify-center justify-items-center h-full w-full grid-cols-1 grid-rows-3 grid-flow-col">
      <div className="text-3xl row-span-1 w-full flex justify-center items-center">
        Exchange
      </div>
      <div className="row-span-1 text-2xl align-baseline">
        <Form
          onSubmit={submitExchange}
          initialValues={{ value: "" }}
          render={({ handleSubmit, reset, submitting, pristine, values }) => (
            <form
              onSubmit={async (event) => {
                try {
                  handleSubmit(event).then(reset);
                } catch (error) {
                  return;
                }
              }}
            >
              <Field
                name="value"
                component="input"
                type="number"
                placeholder="XXX"
                className="border border-gray-200 rounded-md p-2 mb-5 w-28"
                required
                validate={required}
              />
              <OnChange name="value">
                {async (value, previous) => {
                  fetchPrice(value, symbol);
                }}
              </OnChange>
              {symbol === "EUR" ? "€" : "$"}
              <button
                className="text-center align-baseline text-2xl px-2 py-2 focus:outline-none bg-blue-500 text-gray-100 rounded-md focus:bg-blue-600 ml-3"
                onClick={async (e) => {
                  e.preventDefault();
                  if (values.value !== "")
                    fetchPrice(values.value, symbol === "USD" ? "EUR" : "USD");
                  setSymbol(symbol === "USD" ? "EUR" : "USD");
                }}
              >
                <BiRefresh />
              </button>
              <button
                type="sumbit"
                disabled={submitting || pristine}
                className="text-center mx-auto px-16 py-2 mb-4 focus:outline-none bg-green-500 text-gray-100 rounded-md focus:bg-green-600 ml-3"
              >
                Buy
              </button>
              <ToastContainer />
            </form>
          )}
        />
      </div>
      <div className="row-span-1">
        Price: {price !== null ? `${price} ` : "None"}
      </div>
    </section>
  );
};

export default Exchange;
