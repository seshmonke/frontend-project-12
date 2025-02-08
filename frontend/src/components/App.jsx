import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import AuthContext from "../contexts/index.jsx";
import useAuth from '../hooks/index.jsx';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem("userid");
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

  return auth.loggedIn ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

const PrivatePage = () => {
  return (
    <div>Private</div>
  )
};

const App = () => {
  return (
    <AuthProvider>
      <Container className="bg-white h-100" fluid>
        <Navbar className="bg-light-subtle shadow-sm">
          <Container fluid>
            <Navbar.Brand href="/">Sesh Chat</Navbar.Brand>
          </Container>
        </Navbar>

        <BrowserRouter>
          <Routes>
            <Route path="/" element={(
              <PrivateRoute>
                <PrivatePage />
              </PrivateRoute>
            )} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </Container>
    </AuthProvider>
  );
};

export default App;
