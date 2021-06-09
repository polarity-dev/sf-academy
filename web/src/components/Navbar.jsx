import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/auth";

const Navbar = () => {
  const auth = useAuth();
  const history = useHistory();
  const logout = () => {
    auth.logout();
    history.push("/login");
  };

  return (
    <header className="w-full shadow-md bg-green-500 mb-4">
      <nav className=" z-50 text-gray-200 container mx-auto  select-none flex items-stretch w-full justify-center lg:justify-between">
        <div className="text-3xl flex p-4 justify-center lg:justify-start">
          <div className="pointer flex items-center justify-center">
            <Link to="/">
              <span role="img" aria-label="dragon">
                💸
              </span>
              Exchange Demo
            </Link>
          </div>
        </div>
        <div className="text-lg hidden lg:flex justify-end p-4">
          <span className="pointer rounded-full py-3 px-6 hover:bg-green-400 focus:bg-green-600 ">
            <Link to="/history">Transactions</Link>
          </span>
          <span
            className="pointer rounded-full py-3 px-6 hover:bg-green-400 focus:bg-green-600 "
            onClick={logout}
          >
            Logout
          </span>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
