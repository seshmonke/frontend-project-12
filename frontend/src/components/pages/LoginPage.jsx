import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import loginImage from "../../assets/loginImage.png";
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  Form as BootstrapForm,
} from "react-bootstrap";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../../slices/authSlice.js";
import { useAuth } from "../../hooks/index.jsx";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import routes from '../../routes.js';

const LoginForm = () => {
  const usernameRef = useRef(null);
  const { t } = useTranslation();
  const { loggedIn, logIn, logOut } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [authError, setAuthError] = useState(null);

  const userData = useSelector((state) => {
    console.log("СОСТЯНИЕ СЛАЙСА: ", state);
    return state.auth;
  });

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


  const handleSubmit = async (values, { resetForm, isSubmitting }) => {
    try {
      setAuthError(null);
      console.log(values);
      const response = await axios.post(routes.loginPath(), values);
      const { data } = response;
      resetForm();
      window.localStorage.setItem("userId", JSON.stringify(data));
      dispatch(setCredentials(data));

      logIn();
      navigate("/");
      console.log("getItem", window.localStorage.getItem("userId"));
      console.log("response", response, "isSubmitting", isSubmitting);
    } catch (e) {
      console.log("error", e);
      //toast(e.message);

      e.response
        ? setAuthError(t('notification.wrongCredentials'))
        : setAuthError(t('notification.error'));
    }
  };

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={handleSubmit}
    >
      <Form className="col-12 col-md-6 mt-3 mt-mb-0">
        <h1 className="text-center mb-4">{t("loginPage.title")}</h1>
        <div className="form-floating mb-3">
          <Field
            type="text"
            name="username"
            autocomplete="username"
            placeholder="Ваш ник"
            required
            id="username"
            className={`form-control ${authError && "is-invalid"}`}
            innerRef={usernameRef}
          />
          <label htmlFor="username">{t("loginPage.yourName")}</label>
        </div>
        <div className="form-floating mb-3">
          <Field
            type="password"
            name="password"
            autocomplete="username"
            placeholder="Пароль"
            required
            id="password"
            className={`form-control ${authError && "is-invalid"}`}
          />
          <label htmlFor="password">{t("loginPage.yourPassword")}</label>
          <BootstrapForm.Control.Feedback type="invalid">
            {authError}
          </BootstrapForm.Control.Feedback>
        </div>
        <Button variant="primary" type="submit" className="w-100 mb-3">
          Войти
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
                  alt="Войти"
                  className="rounded-circle h-50"
                />
              </div>
              <LoginForm />
            </Card.Body>
            <Card.Footer>
              <span>{t("loginPage.footer")}</span>
              <a href="/signup">{t("loginPage.registration")}</a>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

LoginPage.propTypes = {
  location: PropTypes.object,
};

export { LoginPage };
