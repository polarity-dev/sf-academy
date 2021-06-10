import axios from "axios";
import { Field, Form } from "react-final-form";
import { address, useAuth } from "../utils/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Eur = ({ balanceE, updater }) => {
  const auth = useAuth();
  const required = (value) => (value && value !== 0 ? undefined : "Richiesto");
  const onSubmitDeposit = async (data) => {
    console.log(data);
    const { value } = data;
    await axios
      .post(`${address}/deposit`, {
        token: auth.token,
        value: parseFloat(value),
        symbol: "EUR",
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

  const onSubmitWithdraw = async (data) => {
    console.log(data);
    const { value } = data;
    await axios
      .post(`${address}/withdraw`, {
        token: auth.token,
        value: parseFloat(value),
        symbol: "EUR",
      })
      .then((r) => {
        console.log(r);
        updater(Math.random());
      })
      .catch((err) => {
        console.log(err);
        console.log(err.response.data.cause);
        toast.error(err.response.data.cause, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };

  return (
    <div className="grid flex-1 justify-evenly justify-items-center h-full w-full md:w-1/2 mb-10 md:mb-0 ">
      <ToastContainer />
      <div className="text-3xl">Euro Balance: </div>
      <div className="text-4xl">{parseFloat(balanceE).toFixed(2)}€ </div>
      <div>
        <Form
          onSubmit={onSubmitDeposit}
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
              €
              <button
                type="sumbit"
                disabled={submitting || pristine}
                className="text-center mx-auto px-16 py-2 mb-4 focus:outline-none bg-green-500 text-gray-100 rounded-md focus:bg-green-600 ml-3"
              >
                Deposit
              </button>
            </form>
          )}
        />
      </div>

      <div>
        <Form
          onSubmit={onSubmitWithdraw}
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
              €
              <button
                type="sumbit"
                disabled={submitting || pristine}
                className="text-center mx-auto px-14 py-2 mb-4 focus:outline-none bg-green-500 text-gray-100 rounded-md focus:bg-green-600 ml-3"
              >
                Withdraw
              </button>
            </form>
          )}
        />
      </div>
    </div>
  );
};

export default Eur;
