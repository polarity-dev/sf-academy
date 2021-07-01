export default function Homepage() {
    return (
        <div className="w-screen h-auto flex justify-between px-8 py-4 items-center">
            <div>
                <p className="text-blue-500 text-xl font-semibold">Exchange</p>
            </div>
            <div className="flex space-x-2">
                <a className="px-5 py-2 bg-blue-500 min-h-full text-white font-bold rounded-md cursor-pointer" href="/login">
                    Login
                </a>
                <a className="px-5 py-2 bg-blue-600 bg-opacity-10 min-h-full text-blue-600 font-bold rounded-md cursor-pointer" href="/signup">
                    Signup
                </a>
            </div>
        </div>
    );
}
