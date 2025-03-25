const apiPath = '/api/v1';

export default {
  loginPath: () => [apiPath, 'login'].join('/'),
  usersPath: () => [apiPath, 'data'].join('/'),
  messagesPath: () => [apiPath, 'messages'].join('/'),
  signupPath: () => [apiPath, 'signup'].join('/'),
  channelsPath: (id) => (id ? [apiPath, 'channels', id] : [apiPath, 'channels']).join('/'),
};
