import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import NotFound from './pages/NotFound';
import Homepage from './pages/Homepage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import NoLogin from './pages/NoLogin';

export default function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Homepage />
                </Route>

                <Route path="/nologin">
                    <NoLogin />
                </Route>

                <Route exact path="/login">
                  <Login />
                </Route>

                <Route exact path="/signup">
                  <Signup />
                </Route>

                <ProtectedRoute path="/dashboard"></ProtectedRoute>

                <Route path="*">
                    <NotFound />
                </Route>
            </Switch>
        </Router>
    );
}
