import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resources from './locales/index';

const i18nInstance = i18next.createInstance();

i18nInstance
  .use(initReactI18next) // передаем экземпляр i18n в react-i18next
  .use(LanguageDetector) // с помощью плагина определяем язык пользователя в браузере
  .init({
    resources, // передаем переводы текстов интерфейса в формате JSON
    fallbackLng: 'ru', // если переводы на языке пользователя недоступны, то будет использоваться язык, указанный в этом поле
    interpolation: {
      escapeValue: false, // экранирование уже есть в React, поэтому отключаем
    },
    debug: true, // Enable debug mode for development
    lng: 'ru', // Set default language to Russian for testing
    compatibilityJSON: 'v3',
  });

export default i18nInstance;
