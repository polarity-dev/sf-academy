import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../Auth';

export default function Navbar() {
    const history = useHistory();
    const auth = useAuth();
    const location = useLocation();

    return (
        <div className="h-auto flex justify-between px-8 py-4 items-center flex-col sm:flex-row gap-3">
            <div>
                <p className="text-blue-500 text-xl font-semibold">Exchange</p>
            </div>
            {!auth.isAuthenticated() ? (
                <div className="flex space-x-2">
                    <button
                        className="px-5 py-2 bg-blue-500 min-h-full text-white font-bold rounded-md cursor-pointer"
                        onClick={() => {
                            history.push('/login');
                        }}
                    >
                        Login
                    </button>
                    <button
                        className="px-5 py-2 bg-blue-600 bg-opacity-10 min-h-full text-blue-600 font-bold rounded-md cursor-pointer"
                        onClick={() => {
                            history.push('/signup');
                        }}
                    >
                        Signup
                    </button>
                </div>
            ) : (
                <div className="flex space-x-2">
                    {location.pathname === '/dashboard' ? (
                        <button
                            className="px-5 py-2 bg-blue-500 min-h-full text-white font-bold rounded-md cursor-pointer"
                            onClick={() => {
                                history.push('/listTransactions');
                            }}
                        >
                            Transactions
                        </button>
                    ) : (
                        <button
                            className="px-5 py-2 bg-blue-500 min-h-full text-white font-bold rounded-md cursor-pointer"
                            onClick={() => {
                                history.push('/dashboard');
                            }}
                        >
                            Dashboard
                        </button>
                    )}
                    <button
                        className="px-5 py-2 bg-blue-600 bg-opacity-10 min-h-full text-blue-600 font-bold rounded-md cursor-pointer"
                        onClick={() => {
                            auth.logout();
                            history.push('/');
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
