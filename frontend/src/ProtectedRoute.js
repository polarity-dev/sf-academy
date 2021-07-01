import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './Auth';

export const ProtectedRoute = ({ children, ...rest }) => {
    const auth = useAuth();
    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth.isAuthenticated() ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/nologin',
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
};
