import React from "react";
import { Formik, Field, Form as FormikForm } from "formik";
import loginImage from './loginImage.png';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';


const LoginForm = () => {
  const handleSubmit = (values, actions) => {
    console.log(values, actions);
  }

  return (
    <Formik initialValues={{ email: "", password: "" }}
      onSubmit={handleSubmit}
    >
      <FormikForm as={Form} className="col-12 col-md-6 mt-3 mt-mb-0">
        <h1 className="text-center-mb-4">Войти</h1>
        <div className="form-floating mb-3">
          <Field
            type="text"
            name="username"
            autocomplete="username"
            placeholder="Ваш ник"
            required
            id="username"
            className="form-control"
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
            id="username"
            className="form-control"
          />
          <label for="password">Пароль</label>
        </div>
        <Button variant="primary" type="submit" className="w-100 mb-3">
          Войти
        </Button>
      </FormikForm>
    </Formik>
  );
};

const AuthPage = () => {
  return (
    <div class="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  src={loginImage}
                  alt="Войти"
                  className="rounded-circle img-fluid smaller-image"
                />
              </div>
              <LoginForm />
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>Нет Аккаунта? </span>
                <a href="/signup">Регистрация</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AuthPage };
