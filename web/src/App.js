import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login"
import Transactions from "./pages/Transactions";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/history">
          <Transactions />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>

        <Route path="*">
          <div>Not found</div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
