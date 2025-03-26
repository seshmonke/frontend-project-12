import { io } from 'socket.io-client';

// eslint-disable-next-line no-undef
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5001';

export default io(URL);
