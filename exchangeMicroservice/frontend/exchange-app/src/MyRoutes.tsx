import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignUp";
import { UserState } from "./context/UserContext";
import Exchange from "./pages/Exchange";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import Home from "./pages/Home";
import Operation from './pages/Operation';

const MyRoutes = () => {
  const { token } = UserState();

  return (
    <Routes>
      {token === null && <Route path="/"  element={<HomePage />}/>}
      <Route      
        path="/"
        element={
          <PrivateRoutes>
            {" "}
            <Home />{" "}
          </PrivateRoutes>
        }
      />

      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/exchange"
        element={
          <PrivateRoutes>
            <Exchange />
          </PrivateRoutes>
        }
      />
  
      <Route
        path="/operations"
        element={
          <PrivateRoutes>
            <Operation />
          </PrivateRoutes>
        }
      />
      <Route
        path="/user/:id"
        element={
          <PrivateRoutes>
            <UserProfile />
          </PrivateRoutes>
        }
      />
      <Route
        path="*"
        element={
          <PrivateRoutes>
            <NotFound />
          </PrivateRoutes>
        }
      />
    </Routes>
  );
};

export default MyRoutes;

const PrivateRoutes = ({ children }: { children: React.ReactNode }) => {
  const { token } = UserState();

  // const user=localStorage.getItem('token')

  return <>{token ? children : <Navigate to={"/"} />}</>;
};
