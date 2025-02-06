import React from "react";
import { redirect } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import loginImage from "../../assets/loginImage.png";
import { Button, Image } from "react-bootstrap";
import axios from "axios";

const LoginForm = () => {
  const handleSubmit = async (values, { resetForm, isSubmitting }) => {
    try {
      console.log(values);
      const response = await axios.post("/api/v1/login", values);
      const { data } = response;
      resetForm();
      window.localStorage.setItem(data.username, data.token);
      redirect("/");
      console.log("getItem", window.localStorage.getItem("admin"));
      console.log("response", response, "isSubmitting", isSubmitting);
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={handleSubmit}
    >
      <Form className="col-12 col-md-6 mt-3 mt-mb-0">
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
            id="password"
            className="form-control"
          />
          <label htmlFor="password">Пароль</label>
        </div>
        <Button variant="primary" type="submit" className="w-100 mb-3">
          Войти
        </Button>
      </Form>
    </Formik>
  );
};

const LoginPage = () => {
  return (
    <div>
      <Image
        src={ loginImage }
        alt="Войти"
        rounded-circle
        fluid
        className="w-25"
      />

      <LoginForm />

      <span>Нет Аккаунта? </span>

      <a href="/signup">Регистрация</a>
    </div>
  );

  /*
  return (
    <div className="container-fluid h-100">
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
  */
};

export { LoginPage };
