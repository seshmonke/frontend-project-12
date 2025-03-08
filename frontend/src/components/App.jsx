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
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { AuthContext, SocketContext } from "../contexts/index.jsx";
import { useAuth } from "../hooks/index.jsx";
import { setCredentials } from "../slices/authSlice.js";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../services/socket.js";
import { addNewMessage } from "../slices/messagesSlice.js";
import { addNewChannel, setCurrentChannel, removeChannel, renameChannel } from "../slices/channelsSlice.js";

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
  const { logOut, loggedIn } = useAuth();

  return loggedIn ? (
    <button type="button" className="btn btn-primary" onClick={logOut}>
      Выйти
    </button>
  ) : null;
};

const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const dispatch = useDispatch();
  const auth = useAuth();
  const { channels } = useSelector((state) => {
    console.log("Состояние из стора", state);
    return state;
  });
  useEffect(() => {
    const onConnect = () => {
      console.log("Сокет подключился ура");
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log("Сокет отключился ура");
      setIsConnected(false);
    };

    const onNewMessage = (payload) => {
      dispatch(addNewMessage(payload));
    };

    const onNewChannel = (payload) => {
      dispatch(addNewChannel(payload));

      //const [currentChannel] = [...channels.list].reverse();
      dispatch(setCurrentChannel(payload));
    };

    const onRemoveChannel = (payload) => {
      dispatch(removeChannel(payload));
    }

    const onRenameChannel = (payload) => {
      console.log('Пришел ивент на изменение имени канала');
      dispatch(renameChannel(payload));
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("newMessage", onNewMessage);
    socket.on("newChannel", onNewChannel);
    socket.on('removeChannel', onRemoveChannel);
    socket.on('renameChannel', onRenameChannel);
    

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
            <Navbar.Brand href="/">Sesh Chat</Navbar.Brand>
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
};

export default App;
