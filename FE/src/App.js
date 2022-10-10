import Header from "./Header";
import classes from "./App.module.css";
import Card from "./Card";
import { useEffect } from "react";
import Parsed from "./Parsed";

function App() {
  useEffect(() => {
    // fetchEvents();
  }, []);

  return (
    <div>
      <Header />
      <div className={classes["list-container"]}>
        <Card />
        <Parsed />
      </div>
    </div>
  );
}

export default App;
