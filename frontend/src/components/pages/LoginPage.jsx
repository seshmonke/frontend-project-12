import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  Form as BootstrapForm,
} from 'react-bootstrap';
import loginImage from '../../assets/loginImage.png';
import { setCredentials } from '../../slices/authSlice.js';
import { useAuth } from '../../hooks/index.jsx';
import routes from '../../routes.js';

const LoginForm = () => {
  const usernameRef = useRef(null);
  const { t } = useTranslation();
  const { logIn } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (authError && usernameRef.current) {
      usernameRef.current.focus();
      usernameRef.current.select();
    }

    if (authError) {
      toast.error(authError);
      setAuthError(null);
    }
  }, [authError]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setAuthError(null);
      const response = await axios.post(routes.loginPath(), values);
      const { data } = response;
      resetForm();
      dispatch(setCredentials(data));

      logIn(data);
      navigate(routes.rootRoute());
    } catch (e) {
      setAuthError(t(e.response ? 'notification.wrongCredentials' : 'notification.error'));
    }
  };

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={handleSubmit}
    >
      <Form className="col-12 col-md-6 mt-3 mt-mb-0">
        <h1 className="text-center mb-4">{t('loginPage.title')}</h1>
        <div className="form-floating mb-3">
          <Field
            type="text"
            name="username"
            autocomplete="username"
            placeholder={t('loginPage.yourName')}
            required
            id="username"
            className={`form-control ${authError && 'is-invalid'}`}
            innerRef={usernameRef}
          />
          <label htmlFor="username">{t('loginPage.yourName')}</label>
        </div>
        <div className="form-floating mb-3">
          <Field
            type="password"
            name="password"
            autocomplete="username"
            placeholder={t('loginPage.yourPassword')}
            required
            id="password"
            className={`form-control ${authError && 'is-invalid'}`}
          />
          <label htmlFor="password">{t('loginPage.yourPassword')}</label>
          <BootstrapForm.Control.Feedback type="invalid">
            {authError}
          </BootstrapForm.Control.Feedback>
        </div>
        <Button variant="primary" type="submit" className="w-100 mb-3">
          {t('loginPage.title')}
        </Button>
      </Form>
    </Formik>
  );
};

const LoginPage = () => {
  const { t } = useTranslation();
  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="row">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  src={loginImage}
                  alt={t('loginPage.title')}
                  className="rounded-circle h-50"
                />
              </div>
              <LoginForm />
            </Card.Body>
            <Card.Footer>
              <span>{t('loginPage.footer')}</span>
              <a href={routes.signupRoute()}>{t('loginPage.registration')}</a>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
