import React, { useEffect, useRef } from 'react';
import { Modal, Form as BootstrapForm, Button } from 'react-bootstrap';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import routes from '../../routes';
import { closeModal } from '../../slices/modalSlice';
import { useFilter } from '../../hooks/index.jsx';

const RenameChannelModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const renameInputRef = useRef(null);
  const filterWords = useFilter();
  const { selectedChannelId } = useSelector((state) => state.modal);
  const { token } = useSelector((state) => state.auth);
  const { list } = useSelector((state) => state.channels);
  const { modal } = useSelector((state) => state);
  const selectedChannel = list.find(
    (channel) => channel.id === selectedChannelId,
  );

  const handleSubmitForm = async ({ channelName }) => {
    const name = filterWords(channelName);
    try {
      await axios.patch(
        routes.channelsPath(selectedChannelId || null),
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      dispatch(closeModal());
      toast.success(t('notification.successRename'));
    } catch (error) {
      toast(error.message);
    }
  };

  const RenameChannelSchema = Yup.object().shape({
    channelName: Yup.string()
      .min(3, t('validation.channelNameMinMax'))
      .max(20, t('validation.channelNameMinMax'))
      .required(t('validation.required'))
      .notOneOf(
        list.map((channel) => channel.name),
        t('validation.unique'),
      ),
  });

  useEffect(() => {
    console.log('modal.active, renameInputRef', modal.active, renameInputRef);
    if (modal.active && renameInputRef.current) {
      setTimeout(() => {
        renameInputRef.current.focus();
        renameInputRef.current.select();
      }, 0);
    }
  }, [modal.active, modal.selectedChannelId]);

  return (
    <Formik
      initialValues={{
        channelName: selectedChannel ? selectedChannel.name : '',
      }}
      validationSchema={RenameChannelSchema}
      onSubmit={handleSubmitForm}
    >
      {({
        isSubmitting, errors, touched, handleSubmit,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{t('mainPage.renameChannel')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Field
              id="channelName"
              name="channelName"
              className={`form-control ${
                errors.channelName && touched.channelName ? 'is-invalid' : ''
              }`}
              validateOnBlur
              innerRef={renameInputRef}
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

export default RenameChannelModal;
