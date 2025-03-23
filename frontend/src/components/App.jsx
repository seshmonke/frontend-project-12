import { clearCredentials } from "../slices/authSlice.js";
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
import { SignUpPage } from "./pages/SignUpPage.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { AuthContext } from "../contexts/index.jsx";
import { useAuth } from "../hooks/index.jsx";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../services/socket.js";
import { addNewMessage } from "../slices/messagesSlice.js";
import {
  addNewChannel,
  removeChannel,
  renameChannel,
} from "../slices/channelsSlice.js";
import { useTranslation } from "react-i18next";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useState(() => {
    try {
      const credentials = JSON.parse(window.localStorage.getItem("userId"));
      console.log("Какой токен отпарсился: ", credentials, !!credentials);
      return !!credentials;
    } catch (error) {
      console.error(error);
      return false;
    }
  });
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem("userId");
    setLoggedIn(false);
    dispatch(clearCredentials());
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
  console.log("auth Public Route", auth);
  const location = useLocation();

  return auth.loggedIn ? (
    <Navigate to="/" state={{ from: location }} />
  ) : (
    children
  );
};

const LogOutButton = () => {
  const { t, i18n } = useTranslation();
  const { logOut, loggedIn } = useAuth();

  return loggedIn ? (
    <button type="button" className="btn btn-primary" onClick={logOut}>
      {t('logoutButton')}
    </button>
  ) : null;
};


const App = () => {
  const { t, i18n } = useTranslation();

  const { logOut, loggedIn } = useAuth();
  const dispatch = useDispatch();
  useSelector((state) => {
    console.log("Состояние из стора", state);
    return state;
  });
  useEffect(() => {
    console.log('logged in: ', loggedIn)
    const onConnect = () => {
      console.log("Сокет подключился ура");
    };

    const onDisconnect = () => {
      console.log("Сокет отключился ура");
    };

    const onNewMessage = (payload) => {
      dispatch(addNewMessage(payload));
    };

    const onNewChannel = (payload) => {
      dispatch(addNewChannel(payload));
      //dispatch(setCurrentChannel(payload));
    };

    const onRemoveChannel = (payload) => {
      dispatch(removeChannel(payload));
    };

    const onRenameChannel = (payload) => {
      dispatch(renameChannel(payload));
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("newMessage", onNewMessage);
    socket.on("newChannel", onNewChannel);
    socket.on("removeChannel", onRemoveChannel);
    socket.on("renameChannel", onRenameChannel);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <AuthProvider>
      <div className="d-flex flex-column bg-white h-100">
        <Navbar className="bg-light-subtle shadow-sm">
          <Container>
            <Navbar.Brand href="/">{t('appTitle')}</Navbar.Brand>
            <LogOutButton />
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
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
};

export default App;
