import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import notFoundImage from '../../assets/notFoundImage.png';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <img
        src={notFoundImage}
        alt="t('notFoundPage.notFound')"
        className="img-fluid h-25"
      />
      <h1 className="h4 text-muted">{t('notFoundPage.notFound')}</h1>
      <p>
        {t('notFoundPage.youCanGoTo')}
        <Link to="/">{t('notFoundPage.goToMainPage')}</Link>
      </p>
    </div>
  );
};

export default NotFoundPage;
