import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

export const authContext = createContext();
console.log(process.env.REACT_APP_ADDRESS);
const a = process.env.REACT_APP_ADDRESS ? process.env.REACT_APP_ADDRESS.trim() : undefined;
export const address = process.env.REACT_APP_ADDRESS ? `http://${a}` : '/api';


export default function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    );
}


export function useAuth() {
    return useContext(authContext);
}


function useProvideAuth() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const login = async ({ email, password }) => {
        await axios.post(`${address}/login`, {
            email: email,
            password: password
        })
            .then((response) => {
                //console.log(response);
                const responseData = response.data;
                console.log(response.data);
                const { data } = responseData; // JWT
                console.log("data", data);
                localStorage.setItem('token', data);
                setUser(JSON.parse(atob(localStorage.getItem('token').split('.')[1])));
                setToken(data)
            })
            .catch((error) => {
                console.error(error);
                console.log("erase");
                logout()
            });
    }

    const signup = async ({ email, password, iban, name }) => {
        await axios.post(`${address}/signup`, { email, name, iban, password }).then(r => {
            localStorage.setItem("token", r.data.data);
            setUser(JSON.parse(atob(localStorage.getItem('token').split('.')[1])));
            setToken(r.data.data)
        })
            .catch((error) => {
                console.error(error);
                console.log("erase");
                logout()
            });
    }


    const logout = () => {
        localStorage.setItem('token', '');
    }
    const checkLogin = () => {
        if (isAuthenticated()) {
            const jwtToken = localStorage.getItem('token');
            setUser(JSON.parse(atob(jwtToken.split('.')[1])));
            setToken(jwtToken)
        }
    }


    const isAuthenticated = () => {
        console.log("call");
        const jwtToken = localStorage.getItem('token');
        // eslint-disable-next-line
        const re = new RegExp("^[A-Za-z0-9-_=]+1\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$");
        if (jwtToken === null || jwtToken === undefined || jwtToken === '' || jwtToken === 'null' || jwtToken === 'undefined' || !jwtToken.match(re)) {
            return false; // Non è presente un token
        }
        return true;    // È presente un token, la verifica della validità avviene server-side.
    }

    return {
        user,
        token,
        login,
        logout,
        isAuthenticated,
        checkLogin,
        signup
    };
}