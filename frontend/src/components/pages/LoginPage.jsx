import React, { useState } from "react";
import PropTypes from 'prop-types';
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

const LoginForm = () => {
  const { t } = useTranslation();
  const { loggedIn, logIn, logOut } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);
  const dispatch = useDispatch();
  
  const userData = useSelector((state) => { 
    console.log("СОСТЯНИЕ СЛАЙСА: ", state);
    return state.auth
  });

  const handleSubmit = async (values, { resetForm, isSubmitting }) => {
    try {
      console.log(values);
      const response = await axios.post("/api/v1/login", values);
      const { data } = response;
      resetForm();
      window.localStorage.setItem("userId", JSON.stringify(data));
      dispatch(setCredentials(data));
      
      setAuthError(null);
      logIn();
      navigate("/");
      console.log("getItem", window.localStorage.getItem("userId"));
      console.log("response", response, "isSubmitting", isSubmitting);
    } catch (e) {
      console.log("error", e);
      e.response
        ? setAuthError("Неверные имя пользователя или пароль")
        : setAuthError("Произошла ошибка. Попробуйте снова.");
    }
  };

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={handleSubmit}
    >
      <Form className="col-12 col-md-6 mt-3 mt-mb-0">
        <h1 className="text-center mb-4">{t('loginPage.title')}</h1>
        <div className="form-floating mb-3">
          <Field
            type="text"
            name="username"
            autocomplete="username"
            placeholder="Ваш ник"
            required
            id="username"
            className={`form-control ${authError && "is-invalid"}`}
          />
          <label htmlFor="username">Ваш ник</label>
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
          <label htmlFor="password">Пароль</label>
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

const FormCard = () => {
  return (
    <Card className="shadow-sm">
      <Card.Body className="row">
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <img src={loginImage} alt="Войти" className="rounded-circle h-50" />
        </div>
        <LoginForm />
      </Card.Body>
      <Card.Footer>
        <span>Нет Аккаунта? </span>
        <a href="/signup">Регистрация</a>
      </Card.Footer>
    </Card>
  );
};


const LoginPage = () => {
  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col className="col-12 col-md-8 col-xxl-6">
          <FormCard />
        </Col>
      </Row>
    </Container>
  );
};

LoginPage.propTypes = {
  location: PropTypes.object
};

export { LoginPage };
