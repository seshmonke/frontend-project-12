import AddChannelModal from './AddChannel';
import RemoveChannelModal from './RemoveChannel';
import RenameChannelModal from './RenameChannel';

const modals = {
  addChannel: AddChannelModal,
  removeChannel: RemoveChannelModal,
  renameChannel: RenameChannelModal,
};

export default (modalName) => modals[modalName];
