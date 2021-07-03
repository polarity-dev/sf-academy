import React, { useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { useHistory } from 'react-router-dom';
import { baseRoute, useAuth } from '../Auth';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function Signup() {
    const history = useHistory();
    const auth = useAuth();

    useEffect(() => {
        if (auth.isAuthenticated()) {
            history.push('/dashboard');
        }
    }, [auth, history]);

    const notEmpty = (value) => (value === undefined || value === null || value === '' || value.length === 0 ? 'The field is empty' : undefined);

    const onSubmit = async (data) => {
        const { email, password, username, iban } = data;
        axios
            .post(`${baseRoute}/signup`, {
                email,
                password,
                username,
                iban,
            })
            .then((response) => {
                toast.success('Signup success.');
                history.push('/login');
            })
            .catch((error) => {
                toast.error('Signup error.');
            });
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <Toaster
                position="bottom-center"
                toastOptions={{
                    duration: 2000,
                }}
            />
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
                            <label className="font-medium" htmlFor="username">
                                Username
                            </label>
                            <Field component="input" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5" type="text" name="username" placeholder="example" validate={notEmpty} />
                            <label className="font-medium" htmlFor="iban">
                                IBAN
                            </label>
                            <Field component="input" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5 " type="text" name="iban" placeholder="IT60X0542811101000000123456" validate={notEmpty} />
                            <button
                                className="py-2 w-full text-blue-600  focus:ring-2 focus:outline-none focus:ring-blue-200 hover:text-blue-700 font-medium cursor-pointer"
                                onClick={() => {
                                    history.push('/login');
                                }}
                            >
                                Already registered? Login here.
                            </button>
                            <input type="submit" value="Signup" className="text-center focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md cursor-pointer" />
                        </form>
                    )}
                />
            </div>
        </div>
    );
}
