///* eslint-disable functional/no-expression-statement */
import ReactDOM from 'react-dom/client';
import App from './components/App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const app = async () => {
  const root = ReactDOM.createRoot(document.querySelector('#chat'));
  root.render(await App());
};

app();