import React, { useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import routes from '../../routes';
import { closeModal } from '../../slices/modalSlice';
import { setCurrentChannel } from '../../slices/channelsSlice';
import { removeChannelMessages } from '../../slices/messagesSlice.js';

const RemoveChannelModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { modal } = useSelector((state) => state);
  const { token } = useSelector((state) => state.auth);
  const { list } = useSelector((state) => state.channels);
  const deleteButtonRef = useRef(null);

  const handleRemoveChannel = async () => {
    try {
      await axios.delete(routes.channelsPath(modal.selectedChannelId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const [generalChannel] = list;
      dispatch(removeChannelMessages(modal.selectedChannelId));
      dispatch(setCurrentChannel(generalChannel));
      toast.success(t('notification.successDelete'));
    } catch (error) {
      toast(error.message);
    } finally {
      dispatch(closeModal());
    }
  };

  useEffect(() => {
    console.log('modal.active, deleteButtonRef', modal.active, deleteButtonRef);
    if (modal.active && deleteButtonRef.current) {
      deleteButtonRef.current.focus(); // Устанавливаем фокус на кнопку 'Удалить'
    }
  }, [modal.active]);

  return (
    // заменяю
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('mainPage.deleteChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('mainPage.areYouSure')}</p>
        <div className="d-flex justify-content-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => dispatch(closeModal())}
            className="me-2"
          >
            {t('mainPage.cancel')}
          </Button>
          <Button
            type="button"
            autoFocus
            variant="danger"
            onClick={handleRemoveChannel}
            ref={deleteButtonRef}
          >
            {t('mainPage.delete')}
          </Button>
        </div>
      </Modal.Body>
    </>
  );
};

export default RemoveChannelModal;
