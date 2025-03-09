import React, { useRef, useEffect } from "react";
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

const SignUpPage = () => {
  const fieldRefs = {
    username: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  useEffect(() => {
    fieldRefs.username.current?.focus();
  }, []);

  const handleSubmit = (values, { resetForm, isSubmitting }) => {};

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

                    {Object.keys(fieldRefs).map((fieldName, index) => {
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
                                  {meta.error}
                                </Form.Control.Feedback>
                              </>
                            )}
                          </Field>
                        </FloatingLabel>
                      );
                    })}
                    {/*
                    <FloatingLabel //Username input
                      controlId="username"
                      label="Имя пользователя"
                      className="mb-3"
                    >
                      <Field name="username">
                        {({ field, meta }) => (
                          <>
                            <Form.Control
                              {...field}
                              type="text"
                              placeholder="От 3 до 20 символов"
                              isInvalid={meta.touched && !!meta.error}
                              autoComplete="username"
                              required
                              ref={usernameRef}
                              onKeyDown={(e) =>
                                handleKeyDown(
                                  e,
                                  passwordRef,
                                  submitForm,
                                  values
                                )
                              }
                            />
                            <Form.Control.Feedback type="invalid" tooltip>
                              {meta.error}
                            </Form.Control.Feedback>
                          </>
                        )}
                      </Field>
                    </FloatingLabel>
                    <FloatingLabel //Password Input
                      controlId="password"
                      label="Пароль"
                      className="mb-3"
                    >
                      <Field name="password">
                        {({ field, meta }) => (
                          <>
                            <Form.Control
                              {...field}
                              type="password"
                              placeholder="Не менее 6 символов"
                              isInvalid={meta.touched && !!meta.error}
                              autoComplete="new-password"
                              ref={passwordRef}
                              onKeyDown={(e) =>
                                handleKeyDown(
                                  e,
                                  confirmPasswordRef,
                                  submitForm,
                                  values
                                )
                              }
                            />
                            <Form.Control.Feedback type="invalid" tooltip>
                              {meta.error}
                            </Form.Control.Feedback>
                          </>
                        )}
                      </Field>
                    </FloatingLabel>
                    <FloatingLabel //Confirm password Input
                      controlId="confirmPassword"
                      label="Подтвердите пароль"
                      className="mb-3"
                    >
                      <Field name="confirmPassword">
                        {({ field, meta }) => (
                          <>
                            <Form.Control
                              {...field}
                              type="password"
                              placeholder="Пароли должны совпадать"
                              isInvalid={meta.touched && !!meta.error}
                              autoComplete="new-password"
                              ref={confirmPasswordRef}
                              onKeyDown={(e) =>
                                handleKeyDown(e, null, submitForm, values)
                              }
                            />
                            <Form.Control.Feedback type="invalid" tooltip>
                              {meta.error}
                            </Form.Control.Feedback>
                          </>
                        )}
                      </Field>
                    </FloatingLabel>
*/}
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
