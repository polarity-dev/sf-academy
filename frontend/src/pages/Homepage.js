import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { GiPayMoney, GiReceiveMoney, GiTakeMyMoney } from 'react-icons/gi';
import { useHistory } from 'react-router-dom';
import { FaGithubAlt } from 'react-icons/fa';

export default function Homepage() {
    const history = useHistory();

    return (
        <>
            <Navbar />
            <div className="h-auto flex flex-col items-center md:flex-row bg-white p-20 justify-center gap-24">
                <div className="flex items-center">
                    <div className="flex flex-col gap-5 items-center md:items-start">
                        <p className="font-black text-5xl break-words text-center md:text-left">Exchange</p>
                        <p className="text-center md:text-left">Signup and start managing your money in a smarter way.</p>
                        <button
                            className="px-5 py-2 bg-blue-500 min-h-full text-white font-bold rounded-md cursor-pointer max-w-max"
                            onClick={() => {
                                history.push('/signup');
                            }}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
                <div>
                    <img className="w-96" src="./assets/wallet_undraw.svg" alt="Wallet from unDraw.com" />
                </div>
            </div>
            <div className="w-full bg-gray-50 flex justify-center items-center">
                <div className="flex gap-10 px-10 py-10">
                    <div className="flex flex-col items-center justify-center w-1/3">
                        <GiPayMoney className="text-4xl text-blue-600" />
                        <p className="font-medium break-words text-center">You can deposit your money.</p>
                    </div>
                    <div className="flex flex-col items-center justify-center w-1/3">
                        <GiReceiveMoney className="text-4xl text-blue-600" />
                        <p className="font-medium break-words text-center">You can withdraw your money.</p>
                    </div>
                    <div className="flex flex-col items-center justify-center w-1/3">
                        <GiTakeMyMoney className="text-4xl text-blue-600" />
                        <p className="font-medium break-words text-center">You can convert your money from one currency to another.</p>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center p-10">
                <p className="text-center font-medium text-2xl mb-5">You can find the code here</p>
                <a href="https://github.com/nilaerdna/sf-academy" target="_blank" rel="noreferrer">
                    <FaGithubAlt className="text-center text-7xl text-blue-500 hover:text-color-700" />
                </a>
            </div>
            <Footer />
        </>
    );
}
