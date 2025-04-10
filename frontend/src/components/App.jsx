import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import { Provider, ErrorBoundary } from '@rollbar/react';
import filter from 'leo-profanity';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { Navbar, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { io } from 'socket.io-client';
import { AuthContext, FilterContext } from '../contexts/index.jsx';
import { useAuth } from '../hooks/index.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import MainPage from './pages/MainPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import { clearCredentials } from '../slices/authSlice.js';
import { addNewMessage } from '../slices/messagesSlice.js';
import {
  addNewChannel,
  removeChannel,
  renameChannel,
} from '../slices/channelsSlice.js';
import routes from '../routes.js';
import getModal from './modals/index.js';
import { closeModal } from '../slices/modalSlice.js';

const rollbarConfig = {
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  environment: 'testenv',
};

const FilterProvider = ({ children }) => {
  const filterWords = useCallback((word) => {
    filter.loadDictionary('en');
    const englishWord = filter.clean(word);
    filter.loadDictionary('ru');
    return filter.clean(englishWord);
  }, []);

  return (
    <FilterContext.Provider value={filterWords}>
      {children}
    </FilterContext.Provider>
  );
};

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useState(() => {
    try {
      const credentials = JSON.parse(window.localStorage.getItem('userId'));
      return !!credentials;
    } catch (error) {
      console.error(error);
      return false;
    }
  });
  const logIn = (data) => {
    window.localStorage.setItem('userId', JSON.stringify(data));
    setLoggedIn(true);
  };
  const logOut = useCallback(() => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
    dispatch(clearCredentials());
  }, [dispatch]);

  const contextValue = useMemo(
    () => ({ loggedIn, logIn, logOut }),
    [loggedIn, logOut],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return auth.loggedIn ? (
    children
  ) : (
    <Navigate to={routes.loginRoute()} state={{ from: location }} />
  );
};

const PublicRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return auth.loggedIn ? (
    <Navigate to={routes.rootRoute()} state={{ from: location }} />
  ) : (
    children
  );
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

const ModalFacade = () => {
  const { modal } = useSelector((state) => state);
  console.log('modal', modal);
  console.log('modal.type', modal.type);
  console.log('getModal(modal.type)', getModal(modal.type));
  const CurrentModal = getModal(modal.type);
  const dispatch = useDispatch();

  return (
    <Modal show={modal.active} onHide={() => dispatch(closeModal())}>
      {CurrentModal ? <CurrentModal /> : null}
    </Modal>
  );
};

const App = () => {
  const socket = io(routes.socketPath());
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
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

    socket.on('newMessage', onNewMessage);
    socket.on('newChannel', onNewChannel);
    socket.on('removeChannel', onRemoveChannel);
    socket.on('renameChannel', onRenameChannel);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  });

  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <FilterProvider>
          <AuthProvider>
            <ModalFacade />
            <ToastContainer />
            <div className="d-flex flex-column bg-white h-100">
              <Navbar className="bg-light-subtle shadow-sm">
                <Container>
                  <Navbar.Brand href={routes.rootRoute()}>
                    {t('title')}
                  </Navbar.Brand>
                  <LogOutButton />
                </Container>
              </Navbar>

              <BrowserRouter>
                <Routes>
                  <Route
                    path={routes.rootRoute()}
                    element={(
                      <PrivateRoute>
                        <MainPage />
                      </PrivateRoute>
                    )}
                  />
                  <Route
                    path={routes.loginRoute()}
                    element={(
                      <PublicRoute>
                        <LoginPage />
                      </PublicRoute>
                    )}
                  />
                  <Route path={routes.signupRoute()} element={<SignUpPage />} />
                  <Route
                    path={routes.othersRoute()}
                    element={<NotFoundPage />}
                  />
                </Routes>
              </BrowserRouter>
            </div>
          </AuthProvider>
        </FilterProvider>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
