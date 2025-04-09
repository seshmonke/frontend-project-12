import AddChannelModal from './AddChannel';

const modals = {
  addingChannel: AddChannelModal,
};

export default (modalName) => modals[modalName];
