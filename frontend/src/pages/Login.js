import React from 'react'
import { Form, Field } from 'react-final-form';

export default function Login () {
    const onSubmit = (data) => {
        console.log(data);
    };

    const notEmpty = (value) => (value === undefined || value === null || value === '' || value.length === 0 ? 'Il campo è vuoto.' : undefined);

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="shadow-2xl rounded-xl p-10">
                <Form
                    onSubmit={onSubmit}
                    render={({ handleSubmit, reset, submitting, pristine, values }) => (
                        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                            <label className="font-medium" htmlFor="email">
                                Email
                            </label>
                            <Field component="input" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5" type="text" name="email" placeholder="example@email.com" validate={notEmpty} />
                            <label className="font-medium" htmlFor="password">
                                Password
                            </label>
                            <Field component="input" className="rounded-md border-2 focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 px-5" type="password" name="password" placeholder="**********" validate={notEmpty} />
                            <a className="py-2 w-full focus:ring-2 focus:outline-none focus:ring-blue-200 text-blue-600  hover:text-blue-700 font-medium cursor-pointer" href="/signup">
                                Not registered? Signup here.
                            </a>
                            <input type="submit" value="Login" className="text-center focus:ring-2 focus:outline-none focus:ring-blue-200 py-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md cursor-pointer" />
                        </form>
                    )}
                />
            </div>
        </div>
    );
}
