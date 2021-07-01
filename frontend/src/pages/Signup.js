import React from 'react';
import { Form, Field } from 'react-final-form';

export default function Signup() {
    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="shadow-2xl rounded-xl p-10">
                <Form
                    onSubmit={onSubmit}
                    render={({ handleSubmit, reset, submitting, pristine, values }) => (
                        <form className="flex flex-col gap-2" onSubmit={handleSubmit} noValidate>
                            <label className="font-medium" htmlFor="email">
                                Email
                            </label>
                            <Field component="input" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5" type="text" name="email" placeholder="example@email.com" />
                            <label className="font-medium" htmlFor="password">
                                Password
                            </label>
                            <Field component="input" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5" type="password" name="password" placeholder="**********" />
                            <label className="font-medium" htmlFor="username">
                                Username
                            </label>
                            <Field component="input" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5" type="text" name="username" placeholder="example" />
                            <label className="font-medium" htmlFor="iban">
                                IBAN
                            </label>
                            <Field component="input" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5" type="text" name="iban" placeholder="IT60X0542811101000000123456" />
                            <a className="py-2 w-full text-blue-600  focus:ring-2 focus:outline-none focus:ring-blue-200 hover:text-blue-700 font-medium cursor-pointer" href="/login">
                                Already registered? Login here.
                            </a>
                            <input type="submit" value="Signup" className="text-center focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md cursor-pointer" />
                        </form>
                    )}
                />
            </div>
        </div>
    );
}
