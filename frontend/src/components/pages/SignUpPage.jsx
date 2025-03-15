import React, { useRef, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  FloatingLabel,
  Button,
} from "react-bootstrap";
import * as Yup from "yup";
import signUpImage from "../../assets/signUpImage.png";
import { Formik, Field, Form as FormikForm } from "formik";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/authSlice";
import { useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const { loggedIn, logIn, logOut } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fieldRefs = {
    username: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  useEffect(() => {
    fieldRefs.username.current?.focus();
  }, []);

  const [signUpError, setSignUpError] = useState(null);

  const handleSubmit = async (
    { username, password },
    { resetForm, isSubmitting }
  ) => {
    try {
      const response = await axios.post("/api/v1/signup", {
        username,
        password,
      });
      console.log("Создание нового пользователя респонс: ", response);
      resetForm();
      window.localStorage.setItem("userId", JSON.stringify(response.data));
      dispatch(setCredentials(response.data));
      setSignUpError(null);
      logIn();
      navigate("/");
      console.log("getItem", window.localStorage.getItem("userId"));
      console.log("response", response, "isSubmitting", isSubmitting);
    } catch (error) {
      console.log("error", error);
      error.response.status === 409
        ? setSignUpError("Такой пользователь уже существует")
        : setSignUpError("Произошла ошибка. Попробуйте снова.");
    }
  };

  useEffect(() => {
    console.log("Асинхронное изменение состояния ошибки", signUpError);
  }, [signUpError]);

  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .required("Обязательное поле")
      .min(3, "От 3 до 20 символов")
      .max(20, "От 3 до 20 символов"),
    password: Yup.string()
      .required("Обязательное поле")
      .min(6, "Минимум 6 символов"),
    confirmPassword: Yup.string()
      .required("Обязательное поле")
      .oneOf([Yup.ref("password"), null], "Пароли должны совпадать"),
  });

  const handleKeyDown = (event, submitForm, values, setFieldTouched) => {
    if (event.key === "Enter") {
      event.preventDefault();

      // Определяем порядок полей
      const fieldOrder = Object.keys(fieldRefs);
      console.log("fieldOrder", fieldOrder);

      // Находим первое незаполненное поле
      const emptyField = fieldOrder.find(
        (field) => values[field].trim() === ""
      );

      if (emptyField) {
        // Помечаем поле как "touched" для показа ошибки
        setFieldTouched(emptyField, true);
        // Устанавливаем фокус на первое незаполненное поле
        fieldRefs[emptyField].current?.focus();
      } else {
        // Все поля заполнены - отправляем форму
        submitForm();
      }
    }
  };

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img
                  src={signUpImage}
                  className="rounded-circle h-50"
                  alt="Регистрация"
                />
              </div>
              <Formik
                onSubmit={handleSubmit}
                initialValues={{
                  username: "",
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={SignupSchema}
              >
                {({ isSubmitting, submitForm, values, setFieldTouched }) => (
                  <Form as={FormikForm} className="w-50">
                    <h1 className="text-center mb-4">Регистрация</h1>
                    {signUpError && (
                      <div className="alert alert-danger">{signUpError}</div>
                    )}
                    {Object.keys(fieldRefs).map((fieldName) => {
                      return (
                        <FloatingLabel
                          key={fieldName}
                          controlId={fieldName}
                          label={
                            fieldName === "username"
                              ? "Имя пользователя"
                              : fieldName === "password"
                              ? "Пароль"
                              : "Подтвердите пароль"
                          }
                          className="mb-3"
                        >
                          <Field name={fieldName}>
                            {({ field, meta }) => (
                              <>
                                <Form.Control
                                  {...field}
                                  type={
                                    fieldName.includes("password")
                                      ? "password"
                                      : fieldName.includes("confirmPassword")
                                      ? "password"
                                      : "text"
                                  }
                                  placeholder={
                                    fieldName === "username"
                                      ? "От 3 до 20 символов"
                                      : fieldName === "password"
                                      ? "Не менее 6 символов"
                                      : "Пароли должны совпадать"
                                  }
                                  isInvalid={meta.touched && !!meta.error}
                                  ref={fieldRefs[fieldName]}
                                  onKeyDown={(e) =>
                                    handleKeyDown(
                                      e,
                                      submitForm,
                                      values,
                                      setFieldTouched
                                    )
                                  }
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                  {meta.touched && meta.error}
                                </Form.Control.Feedback>
                              </>
                            )}
                          </Field>
                        </FloatingLabel>
                      );
                    })}
                    <Button
                      variant="outline-primary"
                      type="submit"
                      className="w-100"
                    >
                      {isSubmitting ? "Отправка..." : "Зарегистрироваться"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export { SignUpPage };
