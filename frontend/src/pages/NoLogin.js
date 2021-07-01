export default function NoLogin() {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <p className="text-2xl font-medium text-center">
                You are not logged in.
                <br />
                You can login <a href="/login" className="font-bold text-blue-600 hover:text-blue-700">here</a>.
            </p>
        </div>
    );
}
