import { Switch, Route, HashRouter as Router } from 'react-router-dom';
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login"
import Transactions from "./pages/Transactions";
import { useAuth } from './utils/auth';
import { useEffect } from 'react';

function App() {

  const auth = useAuth();

  useEffect(() => {
    auth.checkLogin();
    console.log(auth);
    // eslint-disable-next-line
  }, []);


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
