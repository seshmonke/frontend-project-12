import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import { Provider, ErrorBoundary } from '@rollbar/react';
import PropTypes from 'prop-types';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { AuthContext } from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { MainPage } from './pages/MainPage.jsx';
import { SignUpPage } from './pages/SignUpPage.jsx';
import socket from '../services/socket.js';
import { clearCredentials } from '../slices/authSlice.js';
import { addNewMessage } from '../slices/messagesSlice.js';
import {
  addNewChannel,
  removeChannel,
  renameChannel,
} from '../slices/channelsSlice.js';

const rollbarConfig = {
  accessToken: '25319b5d0cef45c5842b232581503f9d',
  environment: 'testenv',
};

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useState(() => {
    try {
      const credentials = JSON.parse(window.localStorage.getItem('userId'));
      console.log('Какой токен отпарсился: ', credentials, !!credentials);
      return !!credentials;
    } catch (error) {
      console.error(error);
      return false;
    }
  });
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
    dispatch(clearCredentials());
  };

  const contextValue = useMemo(() => ({ loggedIn, logIn, logOut }), [loggedIn]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
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

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const PublicRoute = ({ children }) => {
  const auth = useAuth();
  console.log('auth Public Route', auth);
  const location = useLocation();

  return auth.loggedIn ? (
    <Navigate to="/" state={{ from: location }} />
  ) : (
    children
  );
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const LogOutButton = () => {
  const { t } = useTranslation();
  const { logOut, loggedIn } = useAuth();

  return loggedIn ? (
    <button type="button" className="btn btn-primary" onClick={logOut}>
      {t('logoutButton')}
    </button>
  ) : null;
};

const App = () => {
  const { t } = useTranslation();
  const { loggedIn } = useAuth();
  const dispatch = useDispatch();
  useSelector((state) => {
    console.log('Состояние из стора', state);
    return state;
  });
  useEffect(() => {
    console.log('logged in: ', loggedIn);
    const onConnect = () => {
      console.log('Сокет подключился ура');
    };

    const onDisconnect = () => {
      console.log('Сокет отключился ура');
    };

    const onNewMessage = (payload) => {
      dispatch(addNewMessage(payload));
    };

    const onNewChannel = (payload) => {
      dispatch(addNewChannel(payload));
    };

    const onRemoveChannel = (payload) => {
      dispatch(removeChannel(payload));
    };

    const onRenameChannel = (payload) => {
      dispatch(renameChannel(payload));
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('newMessage', onNewMessage);
    socket.on('newChannel', onNewChannel);
    socket.on('removeChannel', onRemoveChannel);
    socket.on('renameChannel', onRenameChannel);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <AuthProvider>
          <ToastContainer />
          <div className="d-flex flex-column bg-white h-100">
            <Navbar className="bg-light-subtle shadow-sm">
              <Container>
                <Navbar.Brand href="/">{t('title')}</Navbar.Brand>
                <LogOutButton />
              </Container>
            </Navbar>

            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={(
                    <PrivateRoute>
                      <MainPage />
                    </PrivateRoute>
                  )}
                />
                <Route
                  path="/login"
                  element={(
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  )}
                />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </div>
        </AuthProvider>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
