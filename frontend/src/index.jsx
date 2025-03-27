///* eslint-disable functional/no-expression-statement */

import ReactDOM from 'react-dom/client';
import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18next from './i18n'; 
import App from './components/App.jsx';
import store from './slices/index.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const app = () => {
  const root = ReactDOM.createRoot(document.querySelector('#chat'));
  root.render(
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    </Provider>
  );
};

app();
