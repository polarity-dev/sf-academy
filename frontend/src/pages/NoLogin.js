import React from 'react';
import { useHistory } from 'react-router-dom';

export default function NoLogin() {
    const history = useHistory();
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <p className="text-2xl font-medium text-center">
                You are not logged in.
                <br />
                You can login{' '}
                <button
                    onClick={() => {
                        history.push('/login');
                    }}
                    className="font-bold text-blue-600 hover:text-blue-700"
                >
                    here
                </button>
                .
            </p>
        </div>
    );
}
