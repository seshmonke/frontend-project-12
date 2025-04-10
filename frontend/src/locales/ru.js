export default {
  translation: {
    logoutButton: 'Выйти',
    title: 'Hexlet Chat',
    mainPage: {
      channelName: 'Имя канала',
      channels: 'Каналы',
      inputMessage: 'Введите сообщение...',
      addChannel: 'Добавить канал',
      delete: 'Удалить',
      rename: 'Переименовать',
      deleteChannel: 'Удалить канал', //
      renameChannel: 'Переименовать канал',
      areYouSure: 'Уверены?', //
      cancel: 'Отменить', //
      controlChannel: 'Управление каналом',
      messages: '{{count}} сообщение', // Базовый ключ
      messages_plural: '{{count}} сообщения', // Множественная форма
      messages_few: '{{count}} сообщения', // Форма для нескольких
      messages_many: '{{count}} сообщений',
    },
    loginPage: {
      title: 'Войти',
      yourName: 'Ваш ник',
      yourPassword: 'Пароль',
      footer: 'Нет аккаунта?  ',
      registration: 'Регистрация',
    },
    signUpPage: {
      title: 'Регистрация',
      username: 'Имя пользователя',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      registration: 'Зарегистрироваться',
      sending: 'Отправка...',
    },
    notFoundPage: {
      notFound: 'Страница не найдена',
      youCanGoTo: 'Но вы можете перейти',
      goToMainPage: ' на главную страницу',
    },
    validation: {
      channelNameMinMax: 'От 3 до 20 символов',
      usernameMinMax: 'От 3 до 20 символов',
      required: 'Обязательное поле',
      unique: 'Должно быть уникальным',
      passwordMin: 'Минимум 6 символов',
      passwordMinAlt: 'Не менее 6 символов',
      passwordMatch: 'Пароли должны совпадать',
    },
    notification: {
      wrongCredentials: 'Неверные имя пользователя или пароль',
      error: 'Произошла ошибка. Попробуйте снова.',
      alreadyExist: 'Такой пользователь уже существует',
      messageError: 'Ошибка при отправке сообщения',
      successCreate: 'Канал создан',
      successRename: 'Канал переименован',
      successDelete: 'Канал удалён',
    },
  },
};
