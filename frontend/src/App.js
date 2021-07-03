import React, { useEffect } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import NotFound from './pages/NotFound';
import Homepage from './pages/Homepage';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import Login from './pages/Login';
import NoLogin from './pages/NoLogin';
import ListTransactions from './pages/ListTransactions';
import { useAuth } from './Auth';

export default function App() {
    const auth = useAuth();

    useEffect(() => {
        auth.checkLogin();
        // console.log(auth);
    }, []);

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

                <ProtectedRoute path="/dashboard">
                    <Dashboard />
                </ProtectedRoute>

                <ProtectedRoute path="/listTransactions">
                    <ListTransactions />
                </ProtectedRoute>

                <Route path="*">
                    <NotFound />
                </Route>
            </Switch>
        </Router>
    );
}
