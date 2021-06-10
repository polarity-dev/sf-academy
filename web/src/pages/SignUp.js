import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { useHistory } from "react-router";
import { Link } from "react-router-dom"
import { useAuth } from "../utils/auth";

export default function SignUp() {
    const history = useHistory();
    const auth = useAuth();
    const [error, setError] = useState("")

    const onSubmit = async (data) => {
        //console.log(data);
        await auth.signup(data);
        if (!auth.isAuthenticated()) {
            setError('Accesso fallito');
        }
    }


    useEffect(() => {
        if (auth.isAuthenticated()) {
            history.push('/');
        }
    }, [auth])

    return (
        <div className="flex justify-center h-screen w-screen items-center">
            <Form onSubmit={onSubmit} render={({ handleSubmit, reset, submitting, pristine, values }) => (
                <form onSubmit={handleSubmit} noValidate>
                    <div className="border border-gray-300 px-12 rounded-md shadow-md flex flex-col">
                        <p className="text-3xl font-semibold mb-3 text-center mt-3">
                            Sign Up
                        </p>
                        <label>
                            Name
                        </label>
                        <Field
                            name="name"
                            component="input"
                            type="text"
                            placeholder="Name Surname"
                            className="border border-gray-200 rounded-md p-2 mb-5" required
                        />
                        <label>
                            Email
                        </label>
                        <Field
                            name="email"
                            component="input"
                            type="email"
                            placeholder="email@email.com"
                            className="border border-gray-200 rounded-md p-2 mb-5" required
                        />
                        <label>
                            Password
                        </label>
                        <Field
                            name="password"
                            component="input"
                            type="password"
                            placeholder="********"
                            className="border border-gray-200 rounded-md p-2 mb-5" required
                        />
                        <label>
                            Iban
                        </label>
                        <Field
                            name="iban"
                            component="input"
                            type="text"
                            placeholder="IT60X0542811..."
                            className="border border-gray-200 rounded-md p-2 mb-5" required
                        />

                        <Link to="/login" className="text-sm mb-1 text-green-400" >Already Signed Up? Click Here </Link>
                        <button
                            type="sumbit" disabled={submitting}
                            className="text-center mx-auto px-20 py-2 mb-4 focus:outline-none bg-green-500 text-gray-100 rounded-md focus:bg-green-600">
                            Register
                        </button>
                        <p className={`text-red-500 ${error ? " mb-4" : ""} `}>
                            {error}
                        </p>
                    </div>
                </form>)} />
        </div>
    )
}