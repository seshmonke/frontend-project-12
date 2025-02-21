import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { io } from "socket.io-client";
import {
  Container,
  Row,
  Col,
  Nav,
  Button,
  Form as BootstrapForm,
} from "react-bootstrap";
import { setChannels } from "../../slices/channelsSlice.js";
import { setMessages } from "../../slices/messagesSlice.js";

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
  console.log('channels in Channels', channels);
  return (
    <Nav
      id="channels-box"
      className="flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      as="ul"
    >
      {channels.map((channel, index) => {
        return (
          <Nav.Item className="w-100" as="li" key={index}>
            <button
              type="button"
              className="w-100 rounded-0 text-start btn btn-secondary"
            >
              <span className="me-1">#</span> {channel.name}
            </button>
          </Nav.Item>
        );
      })}
    </Nav>
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
  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5">
      {messages.map((message, index) => {
        return (
          <div className="text-break mb-2" key={index}>
            <b>{message.name}</b>:{message.content}
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
  const [inputValue, setInputValue] = useState("");
  const { channels, auth, messages } = useSelector((state) => state);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      //console.log("Submitted value:", inputValue);
      console.log('messages in messages form: ', messages);
      const newMessage = {
        id: messages.length,
        body: inputValue,
        channelId: channels.currentChannel.id,
        username: auth.username,
      };
      const response = await axios.post("/api/v1/messages", newMessage, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      console.log('New message response', response);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error);
    }

  };

  return (
    <BootstrapForm className="py-1 border rounded-2" onSubmit={handleSubmit}>
      <BootstrapForm.Group className="input-group has-validation">
        <BootstrapForm.Control
          name="body"
          aria-label="Новое сообщение"
          placeholder="Введите сообщение..."
          type="text"
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

const MainPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentChannelId, setCurrentChannelId] = useState("1");
  const dispatch = useDispatch();

  const { auth } = useSelector((state) => state);

  //console.log("A. Выгрузка токена из стора", auth);

  useEffect(() => {
    const socket = io("http://localhost:5001/");

    socket.on("newMessage", (payload) => {
      //console.log(payload); // => { body: "new message", channelId: 7, id: 8, username: "admin" }
    });

    const fetchData = async () => {
      try {
        const channelsResponse = await axios.get("/api/v1/channels", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        const messagesResponse = await axios.get("/api/v1/messages", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        dispatch(setChannels(channelsResponse.data));
        dispatch(setMessages(messagesResponse.data));

      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth, dispatch]);

  const { channels, messages } = useSelector((state) => {
    console.log("D. Состояние из стора", state);
    return state;
  });

  const currentChannel = useSelector(({ channels }) => channels.currentChannel);
  const currentChannelName = currentChannel ? currentChannel.name : 'Канал не выбран';

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>Каналы</b>
            <button className="p-0 text-primary btn btn-group-vertical">
              <MyIcon />
              <span className="visually-hidden">+</span>
            </button>
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

            <Messages messages={messages} />

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
