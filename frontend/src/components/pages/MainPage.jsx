import {
  setChannels,
  setCurrentChannel,
  removeChannel,
} from "../../slices/channelsSlice.js";
import {
  setMessages,
  addNewMessage,
  removeChannelMessages,
} from "../../slices/messagesSlice.js";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  Nav,
  Button,
  Form as BootstrapForm,
  Modal,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import { SocketContext } from "../../contexts/index.jsx";
import { useSocket } from "../../hooks/index.jsx";
import { Formik, Field, Form } from "formik";
const MyIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width="20"
      height="20"
      fill="currentColor"
    >
      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
    </svg>
  );
};

const Channels = ({ channels }) => {
  const deleteButtonRef = useRef(null); // Реф для кнопки "Удалить"
  const renameInputRef = useRef(null); // Реф для кнопки "Удалить"
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const { currentChannel, list } = useSelector((state) => state.channels);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleClick = (channel) => {
    console.log("НАЖАТИЕ НА КНОПКУ КАНАЛА!");
    dispatch(setCurrentChannel(channel));
  };

  const handleShowRemoveModal = (channel) => {
    setSelectedChannel(channel);
    setShowRemoveModal(true);
  };

  const handleCloseRemoveModal = () => {
    setShowRemoveModal(false);
    setSelectedChannel(null);
  };

  const handleRemoveChannel = async () => {
    if (!selectedChannel) return;

    try {
      const response = await axios.delete(
        `/api/v1/channels/${selectedChannel.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const [generalChannel] = list;
      dispatch(removeChannelMessages(selectedChannel));
      dispatch(setCurrentChannel(generalChannel));
      console.log(
        "Респонс из обработчика удаления канала :",
        JSON.stringify(response)
      );
    } catch (error) {
      console.error("Ошибка удаления:", error);
    } finally {
      setShowRemoveModal(false);
    }
  };

  const handleRenameChannel = (channel) => {};

  const handleKeyDown = (event) => {
    console.log("Ивент из Handle key down", event);
    if (event.key === "Enter") {
      handleRemoveChannel(); // Вызываем удаление канала при нажатии Enter
    }
  };

  useEffect(() => {
    if (showRemoveModal && deleteButtonRef.current) {
      deleteButtonRef.current.focus(); // Устанавливаем фокус на кнопку "Удалить"
    }
  }, [showRemoveModal]);

  useEffect(() => {
    if (showRenameModal && renameInputRef.current) {
      renameInputRef.current.focus(); // Устанавливаем фокус на поле ввода
    }
  }, [showRenameModal]);

  return (
    <>
      <Nav
        id="channels-box"
        className="flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
        as="ul"
      >
        {channels.map((channel) => {
          console.log(
            "Отображение канала: ",
            JSON.stringify(channel.id),
            JSON.stringify(currentChannel.id),
            channel.id === currentChannel.id
          );
          return (
            <Nav.Item className="w-100" as="li" key={channel.id}>
              {channel.removable ? (
                <Dropdown as={ButtonGroup} className="d-flex">
                  <Button
                    type="button"
                    variant={
                      channel.id === currentChannel.id ? "secondary" : "light"
                    }
                    className="w-100 rounded-0 text-start text-truncate"
                    onClick={() => handleClick(channel)}
                  >
                    {channel.name}
                  </Button>

                  <Dropdown.Toggle
                    split
                    id="dropdown-split-basic"
                    variant={
                      channel.id === currentChannel.id ? "secondary" : "light"
                    }
                  />

                  <Dropdown.Menu>
                    <Dropdown.Item
                      as="button"
                      onClick={() => handleShowRemoveModal(channel)}
                    >
                      Удалить
                    </Dropdown.Item>
                    <Dropdown.Item as="button">Переименовать</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button
                  onClick={() => handleClick(channel)}
                  в
                  type="button"
                  variant={
                    channel.id === currentChannel.id ? "secondary" : "light"
                  }
                  className="w-100 rounded-0 text-start"
                >
                  <span className="me-1">#</span> {channel.name}
                </Button>
              )}
            </Nav.Item>
          );
        })}
      </Nav>
      <Modal
        show={showRemoveModal}
        onHide={handleCloseRemoveModal}
        centered
        onKeyDown={handleKeyDown}
      >
        <Modal.Header closeButton>
          <Modal.Title>Удалить канал</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="lead">Уверены?</p>
          <div className="d-flex justify-content-end">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseRemoveModal}
              className="me-2"
            >
              Отменить
            </Button>
            <Button
              type="button"
              autoFocus
              variant="danger"
              onClick={handleRemoveChannel}
              ref={deleteButtonRef}
            >
              Удалить
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showRenameModal} onHide={setShowRenameModal(false)} centered>
        <Formik
          initialValues={{
            channelName: "",
          }}
          validationSchema={NewChannelSchema}
          onSubmit={async ({ channelName: name }) => {
            console.log("Форма отправляется");
            const response = await axios.post(
              "/api/v1/channels",
              { name },
              {
                headers: {
                  Authorization: `Bearer ${auth.token}`,
                },
              }
            );
            const [newChannel] = [...channels.list].reverse();
            console.log(
              "Новый канал в сабмите модального окна",
              channels,
              newChannel
            );
            handleClose();
          }}
        >
          {({ isSubmitting, errors, touched, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>Добавить канал</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Field
                  id="channelName"
                  name="channelName"
                  className={`form-control ${
                    errors.channelName && touched.channelName
                      ? "is-invalid"
                      : ""
                  }`}
                  validateOnBlur
                  innerRef={channelNameRef}
                />
                {errors.channelName && touched.channelName ? (
                  <BootstrapForm.Control.Feedback
                    type="invalid"
                    className="d-block"
                  >
                    {errors.channelName}
                  </BootstrapForm.Control.Feedback>
                ) : null}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Отменить
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? "Отправка..." : "Отправить"}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

Channels.propTypes = {
  channels: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired, // Указываем, что name должен быть строкой и является обязательным
    })
  ).isRequired, // Указываем, что channels является обязательным массивом
};

const Messages = ({ messages }) => {
  const state = useSelector((state) => {
    return state;
  });

  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5">
      {messages.map((message, index) => {
        return (
          <div className="text-break mb-2" key={index}>
            <b>{message.username}</b>: {message.body}
          </div>
        );
      })}
    </div>
  );
};

Messages.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired, // Указываем, что name должен быть строкой и является обязательным
      content: PropTypes.string.isRequired, // Указываем, что content должен быть строкой и является обязательным
    })
  ).isRequired, // Указываем, что messages является обязательным массивом
};

const MessageForm = () => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const { channels, auth, messages } = useSelector((state) => {
    return state;
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputValue.trim()) return;
    const newMessage = {
      id: messages.list.length,
      body: inputValue,
      channelId: channels.currentChannel.id,
      username: auth.username,
    };

    try {
      const response = await axios.post("/api/v1/messages", newMessage, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setInputValue("");
      setErrorMessage(null);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      setErrorMessage(error.message || "Ошибка при отправке сообщения");
    }
  };

  return (
    <BootstrapForm className="py-1 border rounded-2" onSubmit={handleSubmit}>
      <BootstrapForm.Group className="input-group has-validation">
        <BootstrapForm.Control
          autoComplete="off"
          ref={inputRef}
          name="body"
          aria-label="Новое сообщение"
          placeholder="Введите сообщение..."
          type="text"
          value={inputValue}
          className="border-0 p-0 ps-2 form-control"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="btn btn-group-vertical">
          <svg
            type="submit"
            disabled
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"
            ></path>
          </svg>
          <span className="visually-hidden">Отправить</span>
        </button>
      </BootstrapForm.Group>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}
    </BootstrapForm>
  );
};

const NewChannelButton = () => {
  const channelNameRef = useRef(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { auth, channels } = useSelector((state) => state);

  console.log("список каналов: ", JSON.stringify(channels.list));

  const NewChannelSchema = Yup.object().shape({
    channelName: Yup.string()
      .min(3, "От 3 до 20 символов")
      .max(20, "От 3 до 20 символов")
      .required("Обязательное поле")
      .notOneOf(
        channels.list.map((channel) => channel.name),
        "Должно быть уникальным"
      ),
  });

  useEffect(() => {
    if (show && channelNameRef.current) {
      channelNameRef.current.focus();
    }
  }, [show]);

  return (
    <>
      <button
        className="p-0 text-primary btn btn-group-vertical"
        onClick={handleShow}
      >
        <MyIcon />
        <span className="visually-hidden">+</span>
      </button>

      <Modal show={show} onHide={handleClose} centered>
        <Formik
          initialValues={{
            channelName: "",
          }}
          validationSchema={NewChannelSchema}
          onSubmit={async ({ channelName: name }) => {
            console.log("Форма отправляется");
            const response = await axios.post(
              "/api/v1/channels",
              { name },
              {
                headers: {
                  Authorization: `Bearer ${auth.token}`,
                },
              }
            );
            const [newChannel] = [...channels.list].reverse();
            console.log(
              "Новый канал в сабмите модального окна",
              channels,
              newChannel
            );
            handleClose();
          }}
        >
          {({ isSubmitting, errors, touched, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>Добавить канал</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Field
                  id="channelName"
                  name="channelName"
                  className={`form-control ${
                    errors.channelName && touched.channelName
                      ? "is-invalid"
                      : ""
                  }`}
                  validateOnBlur
                  innerRef={channelNameRef}
                />
                {errors.channelName && touched.channelName ? (
                  <BootstrapForm.Control.Feedback
                    type="invalid"
                    className="d-block"
                  >
                    {errors.channelName}
                  </BootstrapForm.Control.Feedback>
                ) : null}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Отменить
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? "Отправка..." : "Отправить"}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

const MainPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  useEffect(() => {
    if (!auth.token) return;

    const fetchData = async () => {
      try {
        const [channelsResponse, messagesResponse] = await Promise.all([
          axios.get("/api/v1/channels", {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }),
          axios.get("/api/v1/messages", {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }),
        ]);

        dispatch(setChannels(channelsResponse.data));
        const [firstChannel] = channelsResponse.data;
        dispatch(setCurrentChannel(firstChannel));
        dispatch(setMessages(messagesResponse.data));
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth.token, dispatch]);

  const { channels, messages } = useSelector((state) => {
    console.log(
      "Состояние из стора",
      JSON.stringify(state.channels.currentChannel)
    );
    return state;
  });

  const currentChannel = useSelector(({ channels }) => channels.currentChannel);
  const currentChannelName = currentChannel
    ? currentChannel.name
    : "Канал не выбран";

  const channelMessages = messages.list.filter(
    (message) => message.channelId === channels.currentChannel.id
  );

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>Каналы</b>
            <NewChannelButton />
          </div>

          <Channels channels={channels.list} />
        </Col>
        <Col className="p-0 h-100 ">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b># {currentChannelName}</b>
              </p>
              <span className="text-muted">0 сообщений</span>
            </div>

            <Messages messages={channelMessages} />

            <div className="mt-auto px-5 py-3">
              <MessageForm />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export { MainPage };
