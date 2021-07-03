import React, { createContext, useState, useContext } from 'react';
// import axios from 'axios';

export const authContext = createContext();
export const baseRoute = 'http://localhost:9002';
// export const baseRoute = 'http://nginx/api';

export default function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth() {
    return useContext(authContext);
}

function useProvideAuth() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // const login = async ({ email, password }) => {
    //     axios
    //         .post(`${baseRoute}/login`, {
    //             email,
    //             password,
    //         })
    //         .then((response) => {
    //             const { data } = response.data; // JWT
    //             const jwt = data.token;
    //             localStorage.setItem('token', jwt);
    //             const jwtToken = localStorage.getItem('token');
    //             setUser(JSON.parse(atob(jwtToken.split('.')[1])));
    //             setToken(jwt);
    //             return response;
    //         })
    //         .catch((error) => {
    //             return error;
    //         });
    // };

    // const signup = async ({ email, password, username, iban }) => {
    //     axios
    //         .post(`${baseRoute}/signup`, {
    //             email,
    //             password,
    //             username,
    //             iban,
    //         })
    //         .then((response) => {
    //             return response;
    //         })
    //         .catch((error) => {
    //             return error;
    //         });
    // };

    const logout = () => {
        localStorage.setItem('token', '');
    };

    const checkLogin = () => {
        if (isAuthenticated()) {
            const jwtToken = localStorage.getItem('token');
            setUser(JSON.parse(atob(jwtToken.split('.')[1])));
            setToken(jwtToken);
        }
    };

    const isAuthenticated = () => {
        const jwtToken = localStorage.getItem('token');
        const re = new RegExp('^[A-Za-z0-9-_=]+1.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$');
        if (jwtToken === null || jwtToken === undefined || jwtToken === '' || jwtToken === 'null' || jwtToken === 'undefined' || !jwtToken.match(re)) {
            return false; // Non è presente un token
        }
        //setUser(atob(jwtToken.split('.')[1]));
        return true; // È presente un token, la verifica della validità avviene server-side.
    };

    return {
        user,
        token,
        setUser,
        setToken,
        // login,
        // signup,
        logout,
        isAuthenticated,
        checkLogin,
    };
}
