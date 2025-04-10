import React, { useEffect, useRef } from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Form as BootstrapForm, Button, Modal } from 'react-bootstrap';
import routes from '../../routes';
import { closeModal } from '../../slices/modalSlice';
import { setCurrentChannel } from '../../slices/channelsSlice';
import { useFilter } from '../../hooks/index.jsx';

const AddChannelModal = () => {
  const filterWords = useFilter();
  const dispatch = useDispatch();
  const newChannelFieldRef = useRef(null);
  const { t } = useTranslation();
  const { auth, channels, modal } = useSelector((state) => state);

  const NewChannelSchema = Yup.object().shape({
    channelName: Yup.string()
      .min(3, t('validation.channelNameMinMax'))
      .max(20, t('validation.channelNameMinMax'))
      .required(t('validation.required'))
      .notOneOf(
        channels.list.map((channel) => channel.name),
        t('validation.unique'),
      ),
  });

  useEffect(() => {
    if (modal.active && newChannelFieldRef.current) {
      newChannelFieldRef.current.focus();
    }
  }, [modal.active]);

  const handleFormSubmit = async ({ channelName }) => {
    try {
      const name = filterWords(channelName);
      const response = await axios.post(
        routes.channelsPath(),
        { name },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        },
      );
      dispatch(setCurrentChannel(response.data));
      dispatch(closeModal());
      toast.success(t('notification.successCreate'));
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  return (
    <Formik
      initialValues={{
        channelName: '',
      }}
      validationSchema={NewChannelSchema}
      onSubmit={handleFormSubmit}
    >
      {({
        isSubmitting, errors, touched, handleSubmit,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{t('mainPage.addChannel')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Field
              id="channelName"
              name="channelName"
              className={`form-control ${
                errors.channelName && touched.channelName ? 'is-invalid' : ''
              }`}
              validateOnBlur
              innerRef={newChannelFieldRef}
            />
            <label className="visually-hidden" htmlFor="channelName">
              {t('mainPage.channelName')}
            </label>
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
            <Button variant="secondary" onClick={() => dispatch(closeModal())}>
              Отменить
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Отправка...' : 'Отправить'}
            </Button>
          </Modal.Footer>
        </Form>
      )}
    </Formik>
  );
};

export default AddChannelModal;
