import React, { useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { baseRoute, useAuth } from '../Auth';
import { useHistory } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

export default function Login() {
    const auth = useAuth();
    const history = useHistory();

    useEffect(() => {
        if (auth.isAuthenticated()) {
            history.push('/dashboard');
        }
    }, [auth, history]);

    const onSubmit = async (data) => {
        const { email, password } = data;
        axios
            .post(`${baseRoute}/login`, {
                email,
                password,
            })
            .then((response) => {
                toast.success('Login success.');
                const { data } = response.data; // JWT
                const jwt = data.token;
                localStorage.setItem('token', jwt);
                const jwtToken = localStorage.getItem('token');
                auth.setUser(JSON.parse(atob(jwtToken.split('.')[1])));
                auth.setToken(jwt);
            })
            .catch((error) => {
                toast.error('Login error.');
            });
    };

    const notEmpty = (value) => (value === undefined || value === null || value === '' || value.length === 0 ? 'The field is empty' : undefined);

    return (
        <>
            <Toaster
                position="bottom-center"
                toastOptions={{
                    duration: 2000,
                }}
            />
            <div className="w-screen h-screen flex items-center justify-center">
                <div className="shadow-2xl rounded-xl p-10">
                    <Form
                        onSubmit={onSubmit}
                        render={({ handleSubmit, reset, submitting, pristine, values }) => (
                            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                                <label className="font-medium" htmlFor="email">
                                    Email
                                </label>
                                <Field component="input" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5" type="email" name="email" placeholder="example@email.com" validate={notEmpty} />
                                <label className="font-medium" htmlFor="password">
                                    Password
                                </label>
                                <Field component="input" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5" type="password" name="password" placeholder="**********" validate={notEmpty} />
                                <button
                                    className="py-2 w-full focus:ring-2 focus:outline-none focus:ring-blue-200 text-blue-600  hover:text-blue-700 font-medium cursor-pointer"
                                    onClick={() => {
                                        history.push('/signup');
                                    }}
                                >
                                    Not registered? Signup here.
                                </button>
                                <input type="submit" value="Login" className="text-center focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md cursor-pointer" />
                            </form>
                        )}
                    />
                </div>
            </div>
        </>
    );
}
