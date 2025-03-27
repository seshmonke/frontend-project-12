import React from 'react';
import { Link } from 'react-router-dom';
import notFoundImage from '../../assets/notFoundImage.png';

const NotFoundPage = () => (
    <div className="text-center">
      <img
        src={notFoundImage}
        alt="Страница не найдена"
        className="img-fluid h-25"
      />
      <h1 className="h4 text-muted">Страница не найдена</h1>
      <p>
        Но вы можете перейти
        <Link to="/"> на главную страницу</Link>
      </p>
    </div>
  );

export default NotFoundPage;
