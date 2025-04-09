import { useContext } from 'react';

import { AuthContext, FilterContext, ModalContext } from '../contexts/index.jsx';

const useAuth = () => useContext(AuthContext);
const useFilter = () => useContext(FilterContext);
const useModal = () => useModal(ModalContext);

export { useAuth, useFilter, useModal };
