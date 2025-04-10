import { useContext } from 'react';

import { AuthContext, FilterContext } from '../contexts/index.jsx';

const useAuth = () => useContext(AuthContext);
const useFilter = () => useContext(FilterContext);

export { useAuth, useFilter };
