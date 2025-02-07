import React, { useState }  from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import loginImage from "../../assets/loginImage.png";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import axios from "axios";

const LoginForm = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);
  const handleSubmit = async (values, { resetForm, isSubmitting }) => {
    try {
      console.log(values);
      const response = await axios.post("/api/v1/login", values);
      const { data } = response;
      resetForm();
      window.localStorage.setItem('userId', JSON.stringify(data));
      setAuthError(null);
      navigate("/");
      console.log("getItem", window.localStorage.getItem("admin"));
      console.log("response", response, "isSubmitting", isSubmitting);
    } catch (e) {
      console.log("error", e);
      e.response ? setAuthError(e.response.data.message || "Ошибка авторизации") : setAuthError("Произошла ошибка. Попробуйте снова.");
    } finally {
      isSubmitting(false);
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
            className={`form-control ${authError && 'is-invalid'}`}
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
            className={`form-control ${authError && 'is-invalid'}`}
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

const FormCard = () => {
  return (
    <Card className="shadow-sm">
      <Card.Body className="row">
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <img
            src={loginImage}
            alt="Войти"
            className="rounded-circle img-fluid col-6"
          />
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

export { LoginPage };
