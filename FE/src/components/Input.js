import { useState } from "react";
import Button from "./Button";
import classes from "./Input.module.css";

function Input(props) {
  const [from, setFrom] = useState("");
  const [limit, setLimit] = useState("");
  const [select, setSelect] = useState("desc");

  const sendData = () => {
    props.onFilter({ from: from, limit: limit, select: select });
  };

  return (
    <div className={classes.container}>
      <input
        onChange={(e) => setFrom(e.target.value)}
        type="number"
        className={`${classes.input} ${classes.limit}`}
        placeholder="From..."
      ></input>
      <input
        onChange={(e) => setLimit(e.target.value)}
        type="number"
        className={`${classes.input} ${classes.limit}`}
        placeholder="Limit..."
      ></input>
      <select
        onChange={(e) => setSelect(e.target.value)}
        className={`${classes.input} ${classes.select}`}
      >
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>
      <Button sendData={sendData} style={{ margin: "0.5rem", width: "20%" }}>
        Apply
      </Button>
    </div>
  );
}

export default Input;
