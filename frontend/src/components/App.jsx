import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { MainPage } from "./pages/MainPage.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import AuthContext from "../contexts/index.jsx";
import useAuth from "../hooks/index.jsx";

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(() => {
    try {
      const credentials = JSON.parse(window.localStorage.getItem("userId"));
      console.log("Какой токен отпарсился: ", credentials, !!credentials);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  });
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem("userId");
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  console.log(
    "Приватный путь работает!",
    "auth: ",
    auth,
    "location: ",
    location
  );

  return auth.loggedIn ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

const PublicRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return auth.loggedIn ? (
    <Navigate to="/" state={{ from: location }} />
  ) : children;
};


const App = () => {
  return (
    <AuthProvider>
      <div className="d-flex flex-column bg-white h-100">
        <Navbar className="bg-light-subtle shadow-sm">
          <Container>
            <Navbar.Brand href="/">Sesh Chat</Navbar.Brand>
          </Container>
        </Navbar>

        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <MainPage />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
};

export default App;
